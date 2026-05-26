import { create } from "zustand";
import type { Sprite, PaletteEntry, Box } from "../schema/sprite";
import {
  computeAutoBoundingBox,
  decodeSprite,
  encodeSprite,
  TRANSPARENT,
  type DecodedSprite,
} from "../lib/pixels";

interface PixelChange {
  frame: number;
  x: number;
  y: number;
  oldByte: number;
  newByte: number;
}

interface UndoEntry {
  changes: PixelChange[];
}

interface SpriteState {
  spriteName: string | null;
  width: number;
  height: number;
  fps: number;
  palette: PaletteEntry[];
  frameNames: string[];
  frameBytes: Uint8Array[];
  anchor: { x: number; y: number } | null;
  boundingBox: Box | null;
  hitbox: Box | null;
  frameVersion: number;

  undoStack: UndoEntry[];
  redoStack: UndoEntry[];
  currentTxn: PixelChange[] | null;

  loadSprite: (sprite: Sprite, name: string) => void;
  clearSprite: () => void;
  beginEdit: () => void;
  endEdit: () => void;
  setPixel: (frame: number, x: number, y: number, byte: number) => void;
  floodFill: (frame: number, x: number, y: number, byte: number) => void;
  setHitbox: (box: Box | null) => void;
  setAnchor: (a: { x: number; y: number } | null) => void;
  setFps: (fps: number) => void;
  setPalette: (palette: PaletteEntry[]) => void;
  addFrame: () => void;
  removeFrame: (i: number) => void;
  duplicateFrame: (i: number) => void;
  recomputeBoundingBox: () => void;
  undo: () => void;
  redo: () => void;
  toSprite: () => Sprite | null;
}

function applyChange(frames: Uint8Array[], width: number, change: PixelChange, forward: boolean) {
  const f = frames[change.frame];
  f[change.y * width + change.x] = forward ? change.newByte : change.oldByte;
}

function emptyFrameLike(width: number, height: number): Uint8Array {
  return new Uint8Array(width * height).fill(TRANSPARENT);
}

export const useSpriteStore = create<SpriteState>((set, get) => ({
  spriteName: null,
  width: 0,
  height: 0,
  fps: 8,
  palette: [],
  frameNames: [],
  frameBytes: [],
  anchor: null,
  boundingBox: null,
  hitbox: null,
  frameVersion: 0,
  undoStack: [],
  redoStack: [],
  currentTxn: null,

  loadSprite: (sprite, name) => {
    const decoded: DecodedSprite = decodeSprite(sprite);
    set({
      spriteName: name,
      width: decoded.width,
      height: decoded.height,
      fps: decoded.fps,
      palette: decoded.palette,
      frameNames: decoded.frameNames,
      frameBytes: decoded.frameBytes,
      anchor: decoded.anchor,
      boundingBox: decoded.boundingBox,
      hitbox: decoded.hitbox,
      frameVersion: 0,
      undoStack: [],
      redoStack: [],
      currentTxn: null,
    });
  },

  clearSprite: () =>
    set({
      spriteName: null,
      width: 0,
      height: 0,
      palette: [],
      frameNames: [],
      frameBytes: [],
      anchor: null,
      boundingBox: null,
      hitbox: null,
      undoStack: [],
      redoStack: [],
      currentTxn: null,
    }),

  beginEdit: () => set({ currentTxn: [] }),

  endEdit: () => {
    const { currentTxn, undoStack } = get();
    if (currentTxn && currentTxn.length > 0) {
      set({
        undoStack: [...undoStack, { changes: currentTxn }],
        redoStack: [],
        currentTxn: null,
      });
      get().recomputeBoundingBox();
    } else {
      set({ currentTxn: null });
    }
  },

  setPixel: (frame, x, y, byte) => {
    const { width, height, frameBytes, currentTxn, frameVersion } = get();
    if (frame < 0 || frame >= frameBytes.length) return;
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const idx = y * width + x;
    const oldByte = frameBytes[frame][idx];
    if (oldByte === byte) return;
    frameBytes[frame][idx] = byte;
    if (currentTxn) {
      currentTxn.push({ frame, x, y, oldByte, newByte: byte });
    }
    set({ frameVersion: frameVersion + 1 });
  },

  floodFill: (frame, x, y, byte) => {
    const { width, height, frameBytes, currentTxn, frameVersion } = get();
    if (frame < 0 || frame >= frameBytes.length) return;
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const buf = frameBytes[frame];
    const target = buf[y * width + x];
    if (target === byte) return;
    const queue: number[] = [y * width + x];
    while (queue.length > 0) {
      const i = queue.pop()!;
      if (buf[i] !== target) continue;
      const cy = Math.floor(i / width);
      const cx = i - cy * width;
      const oldByte = buf[i];
      buf[i] = byte;
      if (currentTxn) currentTxn.push({ frame, x: cx, y: cy, oldByte, newByte: byte });
      if (cx > 0) queue.push(i - 1);
      if (cx < width - 1) queue.push(i + 1);
      if (cy > 0) queue.push(i - width);
      if (cy < height - 1) queue.push(i + width);
    }
    set({ frameVersion: frameVersion + 1 });
  },

  setHitbox: (hitbox) => set({ hitbox }),
  setAnchor: (anchor) => set({ anchor }),
  setFps: (fps) => set({ fps }),
  setPalette: (palette) => set({ palette }),

  addFrame: () => {
    const { width, height, frameBytes, frameNames, frameVersion } = get();
    const nextIdx = frameBytes.length + 1;
    set({
      frameBytes: [...frameBytes, emptyFrameLike(width, height)],
      frameNames: [...frameNames, `frame_${nextIdx}`],
      frameVersion: frameVersion + 1,
    });
  },

  removeFrame: (i) => {
    const { frameBytes, frameNames, frameVersion } = get();
    if (frameBytes.length <= 1) return;
    set({
      frameBytes: frameBytes.filter((_, idx) => idx !== i),
      frameNames: frameNames.filter((_, idx) => idx !== i),
      frameVersion: frameVersion + 1,
    });
  },

  duplicateFrame: (i) => {
    const { frameBytes, frameNames, frameVersion } = get();
    if (i < 0 || i >= frameBytes.length) return;
    const copy = new Uint8Array(frameBytes[i]);
    const nextBytes = [...frameBytes.slice(0, i + 1), copy, ...frameBytes.slice(i + 1)];
    const nextNames = [...frameNames.slice(0, i + 1), `${frameNames[i]}_copy`, ...frameNames.slice(i + 1)];
    set({ frameBytes: nextBytes, frameNames: nextNames, frameVersion: frameVersion + 1 });
  },

  recomputeBoundingBox: () => {
    const { width, height, frameBytes, boundingBox } = get();
    if (boundingBox && boundingBox.auto === false) return;
    const auto = computeAutoBoundingBox(frameBytes, width, height);
    if (auto) set({ boundingBox: { ...auto, auto: true } });
    else set({ boundingBox: null });
  },

  undo: () => {
    const { undoStack, redoStack, frameBytes, width, frameVersion } = get();
    if (undoStack.length === 0) return;
    const entry = undoStack[undoStack.length - 1];
    for (let i = entry.changes.length - 1; i >= 0; i--) {
      applyChange(frameBytes, width, entry.changes[i], false);
    }
    set({
      undoStack: undoStack.slice(0, -1),
      redoStack: [...redoStack, entry],
      frameVersion: frameVersion + 1,
    });
    get().recomputeBoundingBox();
  },

  redo: () => {
    const { undoStack, redoStack, frameBytes, width, frameVersion } = get();
    if (redoStack.length === 0) return;
    const entry = redoStack[redoStack.length - 1];
    for (const ch of entry.changes) applyChange(frameBytes, width, ch, true);
    set({
      redoStack: redoStack.slice(0, -1),
      undoStack: [...undoStack, entry],
      frameVersion: frameVersion + 1,
    });
    get().recomputeBoundingBox();
  },

  toSprite: () => {
    const s = get();
    if (!s.spriteName) return null;
    return encodeSprite(s.spriteName, {
      width: s.width,
      height: s.height,
      fps: s.fps,
      palette: s.palette,
      frameNames: s.frameNames,
      frameBytes: s.frameBytes,
      anchor: s.anchor,
      boundingBox: s.boundingBox,
      hitbox: s.hitbox,
    });
  },
}));
