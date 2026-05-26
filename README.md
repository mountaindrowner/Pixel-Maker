# Pixel-Maker

A constrained pixel-art editor designed for AI-human collaboration. Sprites are stored as plain JSON that Claude Code can read and write directly; the web tool visualizes and refines them.

## Quick start

```bash
npm install
npm run dev
```

Open http://127.0.0.1:5173/, pick the `demo` project, then the `mage_idle` sprite.

## Workflow

1. In a Claude Code session, ask Claude to write a sprite (e.g. "make me a FF6-style mage, 32×40, 4 frames").
2. Claude writes `projects/<project>/sprites/<name>.sprite.json` directly using the file format described in `CLAUDE.md`.
3. `npm run validate <file>` confirms the format.
4. `npm run sync-pngs` regenerates PNG previews.
5. The running editor auto-refreshes via SSE; refine the pixels by hand.

See `CLAUDE.md` for the file format and `projects/demo/sprites/mage_idle.sprite.json` for a canonical example.
