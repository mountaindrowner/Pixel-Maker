import { create } from "zustand";
import type { Project } from "../schema/project";
import type { PaletteFile } from "../schema/palette";
import type { PaletteEntry } from "../schema/sprite";
import { PALETTE_ID_CHARS, MAX_PALETTE_SIZE } from "../schema/sprite";

interface ProjectState {
  projectName: string | null;
  project: Project | null;
  palette: PaletteEntry[];
  spriteNames: string[];

  setProjectData: (data: { name: string; project: Project; palette: PaletteFile; spriteNames: string[] }) => void;
  addColor: (hex: string, name?: string) => PaletteEntry | null;
  removeSpriteFromList: (name: string) => void;
  addSpriteToList: (name: string) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projectName: null,
  project: null,
  palette: [],
  spriteNames: [],

  setProjectData: ({ name, project, palette, spriteNames }) =>
    set({ projectName: name, project, palette: palette.colors, spriteNames }),

  addColor: (hex, name) => {
    const { palette } = get();
    if (palette.length >= MAX_PALETTE_SIZE) return null;
    if (palette.some((c) => c.hex.toLowerCase() === hex.toLowerCase())) {
      return palette.find((c) => c.hex.toLowerCase() === hex.toLowerCase()) ?? null;
    }
    const usedIds = new Set(palette.map((c) => c.id));
    const id = PALETTE_ID_CHARS.split("").find((ch) => !usedIds.has(ch));
    if (!id) return null;
    const entry: PaletteEntry = name ? { id, hex, name } : { id, hex };
    set({ palette: [...palette, entry] });
    return entry;
  },

  removeSpriteFromList: (name) =>
    set((s) => ({ spriteNames: s.spriteNames.filter((n) => n !== name) })),

  addSpriteToList: (name) =>
    set((s) => (s.spriteNames.includes(name) ? s : { spriteNames: [...s.spriteNames, name] })),
}));
