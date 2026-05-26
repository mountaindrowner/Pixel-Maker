# Mindset and workflow

## How to think

**Constraints breed creativity.** A 16×16 canvas with 4 colors will teach you more about pixel art than a 256×256 canvas with the full RGB space. Limit yourself first; expand only when the smaller box stops fitting the idea.

**Every pixel must serve a purpose.** A pixel placed because you weren't sure what else to do is noise. A pixel placed to communicate the corner of a chin, the gleam on a sword, the shadow under a brim — that's the craft. If you can remove a pixel and the sprite still reads the same, remove it.

**Pixel art is technical, not painterly.** You're placing blocks, not stroking a brush. That means small mistakes are visible and worth fixing — but it also means once you understand the rules (the five basic shapes, hue shifting, silhouette readability), you can replicate the look reliably. Don't be intimidated by it. Be systematic.

**Treat the canvas like a data table.** This is Pixel-Maker's whole thesis. The file format is rigid (palette ids, fixed grid, single-char-per-pixel rows) precisely because that rigidity is what lets us reason about every pixel placement and not hallucinate. Lean into it.

## The order of operations

Always work in this order, never skip steps:

1. **Silhouette** — solid single color. Test: does it read as the intended character?
2. **Line work** — clean outlines, no doubles, no jaggies. Refine the silhouette's boundary.
3. **Flat color** — base midtone of each material, no shading yet. Confirms regions are right.
4. **Shade** — add shadow tone and highlight tone for each material, with hue shift.
5. **Details** — eyes, accessories, props, the one or two iconic features that define this character.
6. **Polish** — fix individual pixels at corners, add a single specular highlight, soften an outline.

Skipping straight to "details" before nailing silhouette is the classic beginner mistake. Resist it.

## Practical habits

- **Start small.** 16×16 or 32×32 for your first attempts at any new style. Scale up once you understand what shapes work at small scale.
- **Zoom out constantly.** Aseprite has F7 for a 1:1 preview. Use it every few changes. The sprite's job is to look right at actual size, not zoomed in. What looks like a clean detail at 16x zoom often looks like noise at 1x.
- **Iterate cheaply.** Don't delete attempts. Copy the layer, modify the copy, compare. Keep checkpoints in the file. The cumulative effect of small comparisons is what teaches your eye.
- **Use references — but the right ones.** Google image search is now polluted with AI slop. Use Pinterest, ArtStation, Lospec, or rip real sprite sheets from games as study material. For a character archetype (knight, mage, peasant), study three or four real sprites of that archetype before designing yours.
- **Limit your palette before you start.** Picking colors as you go produces incoherent results. Either grab a curated palette from Lospec (or `docs/palettes/`) or design a small one (8–16 colors) up front.
- **Read your sprite at low contrast.** Squint at the screen. If two adjacent regions blur together, push their contrast apart. If a critical feature disappears, brighten or darken it.

## What "absorbing the craft" means

It's not memorizing rules — it's developing the eye that notices when something is off. Symptoms to learn to feel:
- "This looks puffy" → pillow shading.
- "This looks muddy" → no hue shift; you just darkened the base color.
- "I can't tell what this is" → silhouette failure; the character isn't recognizable.
- "This is busy" → too many colors per region, or too many details competing for attention.
- "This looks owlish" → 2×2 square eyes where 1×1 dots would work.
- "This looks blunt" → missing a single corner pixel that would emphasize pointiness.

When you can diagnose your own sprites this way, you've absorbed the material.

## Make art because you like making art

Not because you want to have made it. The grind is real — you'll spend an hour fixing tiny pixel arms and feel like you've accomplished nothing visible. That's the work. The output gets better only because the eye gets better, and the eye gets better only with reps. Don't measure progress sprite by sprite; measure it month by month.
