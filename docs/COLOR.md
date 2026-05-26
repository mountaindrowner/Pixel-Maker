# Color

If you only learn one thing from this knowledge base, learn this: **hue shift, every time.**

## The 3-tone rule

Every material gets three colors: shadow, midtone, highlight. That's the floor. Two colors per material reads as flat. Four or more starts to look noisy unless the sprite is large (>64px).

For a peasant's tunic, that's:
- Midtone: the "color" of the tunic (e.g., rust orange).
- Shadow: where the tunic is in shade (under the arm, behind the belt).
- Highlight: where the light catches it (top of the shoulder, edge of the chest).

For skin: shadow, midtone, highlight. For hair: shadow, midtone, highlight. Etc. You can share tones across materials (see "bridging" below) to keep the palette small.

## Hue shift, ALWAYS

The single biggest mistake new pixel artists make is shading by sliding only the brightness slider — taking a midtone and going darker for shadow, lighter for highlight, in the same hue. The result is **muddy and dead.** Skin shadows look like dirt. Tunic shadows look like soot.

**The fix: shift the hue when you change brightness.**

- **Shadows shift toward blue/purple.** Rotate the hue 20–40° cooler. A red tunic's shadow is dark *purple*, not dark red.
- **Highlights shift toward yellow.** Rotate the hue 20–40° warmer. A red tunic's highlight is bright *orange-yellow*, not bright red.

This works because real-world shadows fall in the cool half of the color wheel (light bounces off the blue sky, into shadow), and real-world highlights pick up warm light from the sun. Pixel art exaggerates this physics for vivid, painterly results.

A concrete ramp for orange skin:
- Shadow: `#a06848` (warm brown, hue-shifted toward red-brown)
- Midtone: `#f8c898` (peach)
- Highlight: `#fff0c8` (cream, hue-shifted toward yellow)

Apply this rule to every material. Period.

## Saturation rules

- **Brighter colors → more saturated.** Shadows desaturate slightly; highlights saturate (for cloth, skin, plants) or desaturate (for metal, glass, polished surfaces).
- **Highlight type matters:** matte material (cloth, skin) → saturated highlight. Reflective material (chrome, polished steel, glass) → desaturated, almost-white highlight, often a single tiny dot of pure white. Different physics, different look.
- **Avoid pure white and pure black** as midtones. Use slightly hue-tinted versions (`#f8f0e0` instead of `#ffffff`, `#181818` instead of `#000000`). Pure white/black are very high-contrast and read as harsh. The Pixel-Maker demo palette uses `#181818` for its "outline" color for exactly this reason.

## Palette bridging

A well-designed palette has colors that double-duty. The shadow color of the tunic is also the highlight color of the boots. The midtone of the hair is also the outline color of the helmet. This keeps total color count low (~12 per sprite, ~24 per project) and makes the whole thing feel coherent — the same hand made it all.

When designing a new ramp, lay it on top of existing ramps and look for overlaps you can exploit.

## Contrast at zoom-out scale

Squint at your sprite at 1:1 size (or use Aseprite's F7 preview). If two adjacent regions blur into one shape, their contrast is too low. The fix is usually to push the shadow darker, not to add a new color.

The grayscale value test: temporarily convert the sprite to grayscale (in Aseprite: new layer filled with black, set to "color" blend mode). The shapes should still read by value alone. If they don't, your colors are doing the work that value should do, and the sprite will fail for color-blind players and at low brightness.

## Curated palettes beat invented ones

Always. Use a curated palette unless you have a specific reason not to.

- **Lospec** (lospec.com/palette-list) — the standard source. Hundreds of palettes filterable by color count.
- **`docs/palettes/`** in this repo — a few classics ready to drop into a project's `palette.json`.

When picking, look for:
- At least 3 shades per "color family" (so you have built-in shadow/mid/highlight).
- 8–16 colors is the sweet spot for character work.
- A pre-existing reputation as good for pixel art (Lospec curates well).

Inventing palettes from scratch is a skill that takes years. Don't fight it; stand on the shoulders of others.

## SNES 15-bit color

Pixel-Maker enforces 15-bit color (5 bits per channel, 32 levels per channel) which matches the SNES color space. That means each hex channel value should be from this set: `00, 08, 10, 18, 21, 29, 31, 39, 42, 4a, 52, 5a, 63, 6b, 73, 7b, 84, 8c, 94, 9c, a5, ad, b5, bd, c6, ce, d6, de, e7, ef, f7, ff`. The tool's color picker snaps automatically. When hand-authoring, snap mentally (it's fine to be approximate; the editor will reconcile on save).

## What I personally got wrong in the demo sprites

- All three demo sprites use single-tone fills per region. No shadow. No highlight. No hue shift. That's why they look cardboard-cutout.
- The peasant's tunic is one flat `#b85a30`. It should have a shadow like `#7a3018` (darker, shifted toward red-purple) and a highlight like `#e0904a` (lighter, shifted toward yellow).
- Mega Man's blue uses single tone. Real Mega Man has the cyan trim as the highlight color, but also needs a darker navy shadow on the underside of arms and legs.

Next round of sprites: 3 tones per region, hue-shifted, no exceptions.
