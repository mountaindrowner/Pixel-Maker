# Pixel art knowledge base

Distilled from many hours of pixel art tutorial video transcripts. This is the artist's mindset Claude (in any session in this repo) should bring when generating sprites for Pixel-Maker.

The first thing to internalize: **flat single-tone fills are the mark of an apprentice.** Real pixel art lives or dies on three things — silhouette, hue-shifted shading, and one or two iconic features that make the character recognizable at a glance. The demo sprites in `projects/demo/sprites/` (mage, peasant, megaman) are honest first attempts that violate most of these principles. Don't repeat their mistakes.

## Where to start

Read in this order before writing a sprite from scratch:

1. **[MINDSET_AND_WORKFLOW.md](MINDSET_AND_WORKFLOW.md)** — how to think and what order to work in.
2. **[CHARACTER_DESIGN.md](CHARACTER_DESIGN.md)** — silhouette, proportions, the sprite-size guide, iconic features.
3. **[ANATOMY.md](ANATOMY.md)** — limb pixel budgets, joint dots, contrapposto stance, hand and foot vocabulary. The fix for columnar limbs and soldier-stance.
4. **[COLOR.md](COLOR.md)** — the 3-tone rule and the hue-shift discipline that turns muddy art into vivid art.
5. **[SHADING.md](SHADING.md)** — the five basic shapes and how to avoid pillow shading.

Then dip into the rest as needed:

6. **[LINEWORK_AND_OUTLINES.md](LINEWORK_AND_OUTLINES.md)** — clean lines, no jaggies, outline strategies.
7. **[STYLE_REFERENCES.md](STYLE_REFERENCES.md)** — what specifically makes FF6, Chrono Trigger, NES Mega Man, Pokémon Gen 1, Stardew etc. look like themselves.
8. **[ANIMATION.md](ANIMATION.md)** — idle vocabulary, key frames, squash and stretch.

## Per-style deep dives

When `STYLE_REFERENCES.md`'s summary isn't enough, the `STYLES/` subdirectory holds character-by-character breakdowns and workflow recipes:

- **[STYLES/CHRONO.md](STYLES/CHRONO.md)** — Chrono Trigger. The four pillars (colored line work, 3-tone hue-shifted ramps, 1-pixel speculars, 12-color cap), each main party member (Crono, Marle, Lucca, Robo, Frog, Ayla, Magus) with their silhouette hallmark and palette signature, and an annotated walkthrough of the horned knight sprite.

## Curated palettes

`palettes/` holds ready-to-use palette JSONs matching our sprite schema. Drop one into a new project's `palette.json` to start with a coherent color set instead of inventing one from scratch (which is a beginner trap).

## The one-sentence summary of all of it

Constraints breed creativity. Start with a strong silhouette, give every pixel a job, hue-shift your shades, pick a light source and stick to it, and pull one or two distinctive features into focus so the character reads in one glance.
