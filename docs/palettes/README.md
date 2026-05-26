# Curated palettes

Ready-to-drop palettes matching the Pixel-Maker `palette.json` schema. Copy one into a new project's `palette.json` to start with a coherent palette instead of inventing one.

| File | Colors | Notes |
|---|---|---|
| `gameboy-dmg.json` | 4 | The original Game Boy green. Use for Game Boy authenticity or extreme constraint. |
| `pico8.json` | 16 | The famous PICO-8 palette. Beloved by indie pixel artists; works for almost any style. Safe default for any 16-color sprite. |
| `ff6-warm.json` | 16 | Hand-curated warm earth tones for fantasy chibis. Includes proper 3-tone hue-shifted ramps for skin, tunic (rust), metal armor, hair, and gold. Use for FF6-style characters. |

## How to use

Pick a palette, copy its contents into `projects/<your-project>/palette.json`, then reference colors by their `id` (`0`, `1`, `a`, `f`, etc.) when writing sprite row strings.

## Notes on `ff6-warm.json`

This palette is designed around the **bridging principle** (see `docs/COLOR.md`). The same color often serves as the shadow of one material and the midtone of another:

- `5` (tunic-rust-shadow) is also useful as a dark hair shadow.
- `1` (leather-dark) doubles as a deep crease shadow on any brown material.
- `f` (gold-shadow) bridges into orange-brown territory.

That's why the palette is only 16 entries despite covering skin, metal, cloth, leather, hair, and gold.
