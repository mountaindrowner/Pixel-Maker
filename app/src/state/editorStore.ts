import { create } from "zustand";

export type Tool = "pencil" | "eraser" | "eyedropper" | "fill" | "hitbox";

interface EditorState {
  tool: Tool;
  activePaletteId: string | null; // single-char palette id, or null = transparent
  zoom: number;
  panX: number;
  panY: number;
  currentFrame: number;
  mirrorX: boolean;
  onionSkin: boolean;
  showBoundingBox: boolean;
  showHitbox: boolean;
  showGrid: boolean;
  saving: boolean;
  dirty: boolean;

  setTool: (tool: Tool) => void;
  setActivePaletteId: (id: string | null) => void;
  setZoom: (z: number) => void;
  setPan: (x: number, y: number) => void;
  setCurrentFrame: (i: number) => void;
  toggleMirrorX: () => void;
  toggleOnionSkin: () => void;
  toggleBoundingBox: () => void;
  toggleHitbox: () => void;
  toggleGrid: () => void;
  setSaving: (s: boolean) => void;
  setDirty: (d: boolean) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  tool: "pencil",
  activePaletteId: null,
  zoom: 16,
  panX: 0,
  panY: 0,
  currentFrame: 0,
  mirrorX: false,
  onionSkin: false,
  showBoundingBox: true,
  showHitbox: true,
  showGrid: true,
  saving: false,
  dirty: false,

  setTool: (tool) => set({ tool }),
  setActivePaletteId: (activePaletteId) => set({ activePaletteId }),
  setZoom: (zoom) => set({ zoom: Math.max(1, Math.min(64, zoom)) }),
  setPan: (panX, panY) => set({ panX, panY }),
  setCurrentFrame: (currentFrame) => set({ currentFrame }),
  toggleMirrorX: () => set((s) => ({ mirrorX: !s.mirrorX })),
  toggleOnionSkin: () => set((s) => ({ onionSkin: !s.onionSkin })),
  toggleBoundingBox: () => set((s) => ({ showBoundingBox: !s.showBoundingBox })),
  toggleHitbox: () => set((s) => ({ showHitbox: !s.showHitbox })),
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  setSaving: (saving) => set({ saving }),
  setDirty: (dirty) => set({ dirty }),
}));
