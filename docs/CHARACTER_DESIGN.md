# Character design

This is where most sprites win or lose. Get the silhouette right and you can fix everything else; get the silhouette wrong and no amount of polishing will save it.

## Silhouette is everything

**Test:** fill your sprite with a single solid color (mentally, or actually). Can you still tell what character it is?

If yes — you've nailed the silhouette. Move on to details with confidence.

If no — go back. Adjust proportions, exaggerate the iconic features, change the pose, give the head a more distinctive shape. Repeat until the silhouette alone reads as the intended character.

Real examples of silhouettes you can recognize at one color:
- Mickey Mouse (giant round ears, big shoes).
- Mega Man jumping (splayed legs, arm out).
- Mario (cap brim, mustache shadow, overalls outline).
- Shovel Knight (T-shaped helmet opening, shovel held back, blocky armor).
- Final Fantasy chibis (oversized hat or weapon distinguishing each class).

Notice: silhouette readability comes from **proportion exaggeration and 1–3 iconic features**, not from cramming in detail.

## The scaffold method

Don't start by drawing the character. Start by drawing a stick figure with:
- A circle for the head.
- A small wedge or block for the torso.
- Lines for the spine, arms, legs.
- Circles for hands and feet.

Get the pose, proportions, and approximate sprite footprint right at this stage. Then build outward: fill the silhouette, refine the line work, add color. The scaffold is what keeps proportions believable.

For poses other than a neutral standing pose, the scaffold is even more important. A character mid-kick, sitting cross-legged, holding a bowl of ramen — these are easy to mess up without a stick-figure pass first. Sometimes the best move is to get into the pose yourself, photograph it, and use that as a reference for the stick figure.

## Proportions at small scale

Real human proportions are about 7.5 heads tall. Pixel art proportions are almost never that. At small sprite scales, you have to exaggerate the head:

- **Chibi (~3 heads tall):** the head is 35–40% of total height. Used by FF6, Pokémon overworld, most JRPGs, most cute indie games. This is the safe default for 16–32 pixel tall sprites.
- **Semi-realistic (~5 heads tall):** Chrono Trigger. The head is ~20% of total height. Works at 32+ pixels.
- **Realistic (~7 heads):** only at 64+ pixels. Below that, the face becomes too small to read.

The bigger the head relative to body, the more "cute" the character feels. Adjust to taste. Heroes are often slightly more realistic-proportioned; sidekicks and townspeople are often more chibi.

For pixel-budget rules per limb at each figure scale, joint-dot placement, contrapposto stance, and hand/foot vocabulary, see [`ANATOMY.md`](ANATOMY.md). That doc is where the rules-of-thumb for limb width, elbow position, and weight shift live — this section just sets the head:body baseline.

**Feminine vs masculine silhouette** at chibi scale:
- Feminine: smaller upper torso, hips slightly wider than shoulders, hourglass curve.
- Masculine: bigger shoulders, narrowing toward hips, triangle from top down.
- These are stereotypes, but at pixel-art scale you have so few pixels to communicate gender that exaggerated proportions do most of the work.

## 1–3 iconic features

Pick the one or two things that make this character recognizable, and pull them into the silhouette aggressively. Examples:

- **Mega Man:** the helmet (with the round dome and the two 2×2 white-outlined eyes), the cyan chest stripe, the arm cannon (if firing). Three features, instantly readable.
- **Mario:** red cap, mustache, overalls with buttons. Three features.
- **Link (NES):** green tunic, pointed hat, sword. Three features.
- **Scrooge McDuck:** top hat, glasses, cane. Three features.

The lesson: **identify the iconic features before you start drawing**, then make sure each one gets enough pixels to be visible in the silhouette. Don't waste pixels on shoelaces if you haven't yet given the hat enough room.

For original characters, do the same exercise: what are the 1–3 things a future player would describe this character by? Build outward from those.

## The sprite size guide

How much detail you can pack in depends entirely on canvas size. Plan the sprite size before you plan the design.

| Range | Examples | What it supports |
|---|---|---|
| **Small (16–30 px tall)** | Pac-Man, NES Mario, Pokémon overworld sprites, FF6 chibis | 2–3 iconic features. Almost no shading. Eyes are 1 pixel. Silhouette does ALL the work. |
| **Medium (30–65 px tall)** | Super Metroid Samus, Mega Man X, Stardew Valley NPCs, Chrono Trigger battle sprites | The sweet spot. Supports 3-tone shading, distinctive face, accessories, props. |
| **Large (70+ px tall)** | X-Men Mutant Apocalypse, modern HD pixel art, character portraits | Illustrative quality. Multi-tone shading per region. Detailed faces. Time-intensive. |

When in doubt, **start medium (32–48 px tall).** Small enough to be fast, large enough to express style.

## Eyes and expression

Eyes communicate more than any other single feature at small scale.

**At 16–24 px tall sprites: use 1×1 pupils.** Two black dots, one pixel each. Sometimes flanked by 1-pixel skin on either side. The Pokémon overworld trainer and FF6 battle sprites all do this.

**2×2 eyes** look owlish and blocky at small scale — the demo peasant and mage in this project make that mistake. The one place 2×2 eyes work is **NES Mega Man specifically**, where the 2×2 black pupils are surrounded by white pixels that visually frame them. Without that white surround, 2×2 eyes look like Minecraft.

**Add a single glint pixel** (one pure-white or near-white pixel inside the pupil) to instantly humanize a character. The eye stops being a static black dot and starts being a living eye.

**Iris position in the eye box** tells the story:
- Iris touching top edge of eye = looking up.
- Iris touching bottom edge = looking down or sad.
- Iris touching neither = surprised, alert, wide-eyed.
- Iris touching both = neutral, default.

A single pixel shift can flip a character from "calm" to "panicked." Use this when designing expression variants.

**Eyebrows** are 1–2 pixels above the eye and convey emotion:
- Straight: neutral.
- Angled down toward the center (V shape): angry, focused.
- Angled up toward the center (inverted V): worried, sad, sympathetic.

At very small scale you may have to omit eyebrows entirely; that's fine.

## Cutouts within the silhouette

Negative space between body parts helps each limb read. Don't let arms, hands, and torso blob together. If you draw a character with their hands on their hips, leave at least a 1-pixel gap (transparent) between each hand and the torso so the silhouette has a hole there. Solid blobs are confusing; articulated silhouettes are clear.

The Mickey Mouse rule: if his giant round ears were tucked against his head with no gap, the silhouette wouldn't read as ears.

## Decoration scaling

The bigger the sprite, the more colors per material you can support without noise:

- **16-px tall:** 2 colors per material (outline + one fill). No shading. Detail through silhouette alone.
- **32-px tall:** 3 colors per material (shadow + midtone + highlight). Hue shift, standard.
- **64-px tall:** 4–5 colors per material. Multi-step shading, specular highlights, dithered transitions.

Going over budget produces noise. A 16-px sprite with 4 colors per region looks busy and confused.

## What I personally got wrong in the demo sprites

- **Eyes everywhere are 2×2 black squares** with no skin separator, no glint, no expression. They look owlish.
- **Mega Man has no arm cannon** — the most iconic feature of the character, missing entirely from the silhouette. Whoops.
- **Peasant has no distinguishing iconic feature** beyond "is wearing peasant clothes." I should have given him something — a sack over the shoulder, a staff, a basket, a distinct hat shape.
- **The mage's silhouette is dominated by the hat (good)** but the body below is generic — could have added a staff in his hand or a spell aura.

Next round: identify the iconic features FIRST, then build the silhouette around them.
