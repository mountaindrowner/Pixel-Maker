# Pixel-Maker

A constrained pixel-art editor. Sprites are stored as `.sprite.json` files that you (Claude) can read and write directly — that's the whole point. The web editor visualizes and refines what you produce.

## Before you generate a sprite — read the art docs

The `/docs/` directory holds the distilled pixel art knowledge that should inform every sprite you write. Read **at minimum**:

- [`docs/README.md`](docs/README.md) — index and quickstart.
- [`docs/CHARACTER_DESIGN.md`](docs/CHARACTER_DESIGN.md) — silhouette, proportions, iconic features, sprite size guide.
- [`docs/COLOR.md`](docs/COLOR.md) — the 3-tone rule and hue-shift discipline.

If the user names a specific style (FF6, Chrono Trigger, Mega Man, etc.), also read [`docs/STYLE_REFERENCES.md`](docs/STYLE_REFERENCES.md) and target that style's specific constraints. For Chrono Trigger specifically, also read [`docs/STYLES/CHRONO.md`](docs/STYLES/CHRONO.md) — character-by-character breakdowns and a workflow recipe.

### Pre-flight checklist for every new sprite

- [ ] **Silhouette readable as the character?** Mental test: fill with one color, can you still tell what it is?
- [ ] **1–3 iconic features identified and emphasized?** What makes this character recognizable in one glance?
- [ ] **Light source picked?** Consistent with other sprites in the same project (default: upper-left).
- [ ] **3 tones per material** (shadow + midtone + highlight) **with hue shift** (shadows toward blue/purple, highlights toward yellow)? Flat single-tone fills are the mark of an apprentice.
- [ ] **Eyes 1×1 with optional glint** (or 2×2 ONLY in the NES Mega Man template style with white surround)?
- [ ] **No pillow shading** (shadow wrapped around the silhouette regardless of light direction)?
- [ ] **No "doubles" / jaggies** on outlines (single-pixel lines with symmetric curve segments)?

The demo sprites in `projects/demo/sprites/` (mage, peasant, megaman) violate most of these. They're the "before" baseline — don't imitate them, do better.

## The loop

1. User asks: "make me a FF6-style mage sprite"
2. Read the docs above and the project's `palette.json` for context
3. You write `projects/<project>/sprites/<name>.sprite.json` directly with the `Write` tool
4. Run `npm run validate projects/<project>/sprites/<name>.sprite.json` to check
5. Run `npm run sync-pngs` to generate the matching `.png` preview
6. User opens the editor (`npm run dev` → http://127.0.0.1:5173/) to view/refine
7. The editor's SSE channel auto-refreshes when you write new files

## File format

See `app/src/schema/sprite.ts` for the Zod schema and `projects/demo/sprites/mage_idle.sprite.json` for a canonical example.

Key constraints:
- **Palette ids are single base36 chars** (`0-9`, `a-z`) — 36 colors max per sprite/project.
- **`.` is reserved for transparent** pixels.
- **Each `rows` array has exactly `height` strings**, and each row is exactly `width` chars.
- **All sprites in a project share canvas dimensions** (defined in `project.json`).
- **Reuse the project palette** in `projects/<project>/palette.json` rather than inventing new colors for each sprite — keeps characters visually coherent.
- **Soft cap sprites at 64×64** when generating from scratch. Larger sprites (up to 128×128) work for hand-editing but get token-heavy to write in one shot.

## Workflow tips

- Read `projects/<project>/palette.json` first so your new sprite uses the same colors as the rest of the project.
- Read an existing sprite in the project as a style reference before writing a variant (e.g. read `mage_idle.sprite.json` before writing `mage_walk.sprite.json` to keep the same proportions, color usage, and bounding box).
- Omit `anchor` if you want auto bottom-center; omit `hitbox` if not yet defined; `boundingBox` will be auto-recomputed on first editor save (set `auto: true`).
- Always validate (`npm run validate <file>`) before declaring done — it catches row-length and unknown-palette-id mistakes that the editor will surface as errors.

## Commands

| | |
|---|---|
| `npm run dev` | Boot the editor at http://127.0.0.1:5173/ |
| `npm run validate <files...>` | Schema-validate sprite files |
| `npm run sync-pngs` | Regenerate every `.png` from its `.sprite.json` |
| `npm run build` | Production build (mostly unused) |

## Repo layout

```
/app/                          Vite + React editor source
  src/schema/sprite.ts         The format spec (Zod) — read this first
  src/lib/pixels.ts            Encode/decode bytes ↔ rows
  vite.server.ts               Dev-server middleware (read/write + SSE)
/projects/<name>/
  project.json                 Canvas size, default fps, sprite manifest
  palette.json                 Curated project-wide palette
  sprites/
    <name>.sprite.json         Source of truth
    <name>.png                 Auto-regenerated preview (committed)
```
