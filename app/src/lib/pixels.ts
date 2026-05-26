import type { Frame, PaletteEntry, Sprite } from "../schema/sprite";
import { TRANSPARENT_CHAR } from "../schema/sprite";

export const TRANSPARENT = 255;

/**
 * Build a lookup from palette id char ('0'-'9', 'a'-'z') to a byte index 0..palette.length-1.
 * Transparent ('.') maps to 255. Unknown chars map to 255 (the loader has already validated).
 */
export function paletteCharToByte(palette: PaletteEntry[]): Uint8Array {
  const table = new Uint8Array(128); // ASCII range
  table.fill(TRANSPARENT);
  palette.forEach((entry, i) => {
    table[entry.id.charCodeAt(0)] = i;
  });
  return table;
}

export function byteToPaletteChar(palette: PaletteEntry[]): string[] {
  const out: string[] = new Array(256).fill(TRANSPARENT_CHAR);
  palette.forEach((entry, i) => {
    out[i] = entry.id;
  });
  out[TRANSPARENT] = TRANSPARENT_CHAR;
  return out;
}

export function decodeFrameToBytes(frame: Frame, width: number, height: number, palette: PaletteEntry[]): Uint8Array {
  const bytes = new Uint8Array(width * height).fill(TRANSPARENT);
  const lookup = paletteCharToByte(palette);
  for (let y = 0; y < height; y++) {
    const row = frame.rows[y] ?? "";
    for (let x = 0; x < width; x++) {
      const c = row.charCodeAt(x);
      if (!isNaN(c)) bytes[y * width + x] = lookup[c] ?? TRANSPARENT;
    }
  }
  return bytes;
}

export function encodeBytesToRows(bytes: Uint8Array, width: number, height: number, palette: PaletteEntry[]): string[] {
  const charTable = byteToPaletteChar(palette);
  const rows: string[] = [];
  for (let y = 0; y < height; y++) {
    let row = "";
    for (let x = 0; x < width; x++) {
      row += charTable[bytes[y * width + x]];
    }
    rows.push(row);
  }
  return rows;
}

/**
 * Tightest non-transparent bounding box across all frames. Returns null if entirely transparent.
 */
export function computeAutoBoundingBox(
  frames: Uint8Array[],
  width: number,
  height: number,
): { x: number; y: number; w: number; h: number } | null {
  let minX = width,
    minY = height,
    maxX = -1,
    maxY = -1;
  for (const frame of frames) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (frame[y * width + x] !== TRANSPARENT) {
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }
  }
  if (maxX < 0) return null;
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

export interface DecodedSprite {
  width: number;
  height: number;
  fps: number;
  palette: PaletteEntry[];
  frameNames: string[];
  frameBytes: Uint8Array[];
  anchor: { x: number; y: number } | null;
  boundingBox: { x: number; y: number; w: number; h: number; auto?: boolean } | null;
  hitbox: { x: number; y: number; w: number; h: number } | null;
}

export function decodeSprite(sprite: Sprite): DecodedSprite {
  return {
    width: sprite.width,
    height: sprite.height,
    fps: sprite.fps,
    palette: sprite.palette,
    frameNames: sprite.frames.map((f) => f.name),
    frameBytes: sprite.frames.map((f) => decodeFrameToBytes(f, sprite.width, sprite.height, sprite.palette)),
    anchor: sprite.anchor ?? null,
    boundingBox: sprite.boundingBox
      ? { ...sprite.boundingBox, auto: sprite.boundingBox.auto ?? false }
      : null,
    hitbox: sprite.hitbox ?? null,
  };
}

export function encodeSprite(name: string, decoded: DecodedSprite): Sprite {
  return {
    schemaVersion: 1,
    name,
    width: decoded.width,
    height: decoded.height,
    fps: decoded.fps,
    encoding: "chars",
    palette: decoded.palette,
    ...(decoded.anchor ? { anchor: decoded.anchor } : {}),
    ...(decoded.boundingBox ? { boundingBox: decoded.boundingBox } : {}),
    ...(decoded.hitbox ? { hitbox: decoded.hitbox } : {}),
    frames: decoded.frameNames.map((frameName, i) => ({
      name: frameName,
      durationMs: null,
      rows: encodeBytesToRows(decoded.frameBytes[i], decoded.width, decoded.height, decoded.palette),
    })),
  };
}
