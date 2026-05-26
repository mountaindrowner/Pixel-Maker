# Chrono Trigger style — deep dive

The short summary lives in [`../STYLE_REFERENCES.md`](../STYLE_REFERENCES.md#chrono-trigger-snes). This doc is for when you've been asked specifically for Chrono Trigger style and the summary isn't enough — it walks through the four technical pillars that produce the CT look, breaks down each main party member's silhouette and palette signature, and ends with a workflow recipe and an annotated walkthrough of the existing knight sprite.

CT is the apex of the SNES JRPG look: warm, painterly, more grown-up than FF6, more grounded than the Mode 7 spectacle of FF4 or Lufia. What makes it feel that way is not one trick — it's four disciplines working together. Apply only one or two of them and you get a sprite that *almost* looks like CT but reads as a generic SNES character.

This doc assumes you've already read [`../CHARACTER_DESIGN.md`](../CHARACTER_DESIGN.md), [`../COLOR.md`](../COLOR.md), and [`../SHADING.md`](../SHADING.md). Those cover the universal principles (silhouette, hue shift, light source, 3-tone ramps) that CT then layers its specific moves on top of.

## The four pillars of the CT look

### 1. Colored line work, not pure black

This is the single biggest visual difference between CT and FF6. CT outlines are **the darkest tone of each region's own ramp**, not pure black. The hair has a dark-brown outline. The blue armor has a dark-blue outline. The skin has a dark-rust outline. Pure black appears only in the deepest voids — a visor slit interior, a pupil, the inside of an open mouth.

The effect: the figure feels integrated into its own colors rather than stamped on top of them. Outlines stop being cage bars and become shading.

### 2. Three-tone hue-shifted ramps

Every material gets shadow + midtone + highlight, and the shadow shifts cooler (toward blue/purple) while the highlight shifts warmer (toward yellow/white). At 32px the ramp has to read in just a few pixels per region, so contrast between the three tones matters more than nuance — pick tones that are clearly different in value, not just hue.

### 3. Selective 1-pixel speculars

CT loves a single pure-white pixel on metal — helmet apex, sword fuller, jewel, gold trim corner. One pixel per surface, never two. Speculars are reserved for genuinely reflective materials: polished metal, gem, glass, wet surfaces. Cloth, hair, and skin never get a pure-white spec; they get their own ramp's highlight tone instead.

### 4. The 12-color palette ceiling

Per-sprite hard cap. The SNES sprite palette is 16 colors and a handful are typically reserved for engine use; CT works within ~12 freely-usable. The cap forces decisions: which materials get a full 3-tone ramp, which share colors, which get a single tone. Designing the palette *before* drawing keeps the cap from biting you mid-sprite.

## Anatomy of a 12-color CT palette

The recipe almost always breaks down like this:

| Slots | What |
|---|---|
| 1–2 | Outline-shadow colors (darkest tone of major regions — used as colored line work) |
| 6–9 | 3-tone ramps for the major regions (armor, cloth, hair, skin) — usually 2–3 materials |
| 1 | Pure white specular |
| 1–2 | Accent / signature color (gold trim, magic glow, cape lining) |

The worked example — the knight palette at `projects/chrono/palette.json` — uses 11 of 12:

- **Armor ramp (4 colors):** `armor-shadow` (also the colored line work) → `armor-mid` → `armor-hi`, plus a separate near-black `void-deepest` for the visor interior.
- **Gold accent ramp (3 colors):** `gold-shadow` → `gold-mid` → `gold-hi`.
- **Cape ramp (3 colors):** `cape-shadow` (wine) → `cape-mid` (red) → `cape-hi` (pink). The shadow is purple-shifted; the highlight is warm-shifted. Textbook.
- **Specular (1 color):** pure `#ffffff` for the helmet apex and eye glint.

That's the shape. For any new CT character, allocate slots the same way: outline-tones up top, ramps in the middle, spec at the bottom, signature accent for whatever makes them *them*.

### Bridging across the party

A project with multiple CT characters should share 3–5 colors across the cast — typically the outline-shadow tones and the specular. The differences live in the ramps. This is why a CT party feels like one game: their dark outlines and white speculars come from the same wells; only their costume colors diverge.

## Colored line work in practice

**Rule of thumb:** each region's outline is the darkest tone in that region's own ramp. The armor's outline uses `armor-shadow`. The hair's outline uses `hair-shadow`. They never share an outline color unless the regions are touching and the boundary needs to read as a seam.

**Light-side reduction:** on the upper-left edge of any curved or rounded region, *omit* the outline or thin it to a single pixel. The light catches that edge; an outline there reads as a shadow that contradicts the lighting. On the lower-right edge, the outline is full thickness — it doubles as the deep-shadow tone of the form.

**Where pure black survives:**
- Visor slit interior, eye sockets behind a mask
- Pupil dots (1×1)
- Deep cape folds where the cloth turns away from the light source entirely
- The mouth interior on close-up faces

If you find yourself reaching for pure black anywhere else, you're slipping into FF6-style line work. Stop and pick the region's own dark tone instead.

## Specular highlights — the CT shine

**Where to place them:**
- Helmet apex (1 pixel, upper-left of the dome)
- Sword fuller, blade edge, or tip
- Pauldron crest or any rounded armor plate
- Jewelry — earrings, brooches, pendants
- Eye glint (1 pixel of pure white inside the pupil — the CT face hallmark)
- Gold trim corners where the trim wraps a form

**Where NOT:**
- Cloth, hair, skin — use the ramp's highlight tone, not pure white
- The center of a flat plate (that's pillow shading territory)
- Multiple adjacent pixels (reads as wet or magical, not metallic)

**The one-pixel rule:** every specular is a single pixel. Two adjacent white pixels stop reading as "reflection" and start reading as "glow." For magic effects that *should* glow, that's a different palette move — handle it with a saturated highlight tone, not by widening the spec.

## Proportions

The 1:5 head-to-body ratio is the baseline — head is roughly the top 20% of the figure. On a 32px-tall sprite that's a ~6-row head, ~10-row torso, ~14-row legs and feet. Compare with FF6's ~40% head: CT looks more like real people in armor, FF6 looks like dolls.

**Build variation matters more than the baseline does.** CT pushes silhouette via body shape, not just costume:

- **Robo** is a literal box on box. His silhouette is rectangles. Even from across the screen, no curve reads as Robo.
- **Frog** is squat — 1:3.5 head:body, wide-bottomed, hunched. The character's whole vibe is "low to the ground."
- **Magus** is lanky — taller than the rest, with a cape that doubles his vertical mass.
- **Ayla** is athletic — square shoulders, narrow waist, exposed limbs that break the silhouette where everyone else is wrapped in cloth.

If your CT character has the same body shape as every other CT character you've drawn, you've left the most identifying lever on the table.

## The party — character-by-character

Each entry: **silhouette hallmark** (the one shape that identifies them from across the screen) / **palette signature** (the two colors a fan would name in a heartbeat) / **iconic features** (1–3 design moves that say "this is them") / **construction notes** (the order to build the sprite).

### Crono

- **Silhouette hallmark:** the spike-hair sweep — long red spikes that fan up-and-back, breaking the head's outline at the top. The katana held out to the side extends his silhouette horizontally.
- **Palette signature:** flame-orange hair + dark-teal gi.
- **Iconic features:** (1) the upward-sweeping spike hair, (2) the cross-body white belt over the gi, (3) the katana with the round gold tsuba.
- **Construction:** lock the hair silhouette first — Crono without the hair sweep is unrecognizable. Body proportions are standard 1:5. Use white belt and gold tsuba as the two warm accents against the cool teal.

### Marle

- **Silhouette hallmark:** the long blonde ponytail trailing behind her — a flag-shape extending past the body silhouette.
- **Palette signature:** ice-blue jumpsuit + warm-yellow ponytail.
- **Iconic features:** (1) the ponytail, (2) the white-collared blue jumpsuit with the boots, (3) her crossbow when armed.
- **Construction:** the ponytail does more silhouette work than any costume element. Make it long enough to read as a separate shape from the body. Ramp the yellow hair through warm tones; ramp the blue jumpsuit through cool tones.

### Lucca

- **Silhouette hallmark:** the helmet/cap with goggles on top and the long scarf trailing behind.
- **Palette signature:** purple cap + orange-gold trim.
- **Iconic features:** (1) the helmet with goggles parked on top (her engineer signature), (2) the long scarf, (3) the wonderchu gun.
- **Construction:** the goggles are a small element but iconic — give them a 2-pixel gold ring with a dark center. Purple is a hard signature color because it's rare in pixel art; resist softening it toward blue.

### Robo

- **Silhouette hallmark:** rectangles. A box body, a smaller box head, blocky arms. Not a single curve in the silhouette.
- **Palette signature:** cool grey + warm orange highlights (chest light, joints).
- **Iconic features:** (1) the boxy body, (2) the dome head with the single-eye plate, (3) the orange chest indicator and joint highlights.
- **Construction:** unlike the others, Robo's silhouette is rectilinear. Drop the 1:5 rule — he's roughly 1:3 head:body and the proportions are nearly square. Use the spec-white on his head plate and joint highlights aggressively; he's all metal.

### Frog

- **Silhouette hallmark:** squat hunched body, cape on the shoulders, oversized sword (the Masamune) bigger than he is.
- **Palette signature:** green skin + blue armor cape.
- **Iconic features:** (1) the hunched amphibian posture (legs bent, body forward), (2) the cape covering the shoulders, (3) the huge sword.
- **Construction:** make him short — 24–28px tall instead of 32. The oversized sword should extend past the head height when held vertical. Cool greens for skin (shadows shift to blue, not yellow — frogs are cool-shifted creatures).

### Ayla

- **Silhouette hallmark:** wild long hair (longer than Marle's, less contained), exposed athletic build, club held one-handed.
- **Palette signature:** warm orange-blonde hair + tan skin + cream fur scraps.
- **Iconic features:** (1) the wild hair, (2) bare athletic limbs (no full sleeves or pants — fur scraps only), (3) the bone or club weapon.
- **Construction:** more skin showing than any other party member, so skin is a major region — give it a full 3-tone ramp. The hair silhouette should be the largest single-color region in the sprite. Avoid black anywhere; her palette runs entirely warm.

### Magus

- **Silhouette hallmark:** a tall, lanky figure dominated by a long cape that flares wider than his shoulders, with a scythe extending the vertical line.
- **Palette signature:** purple/violet cape + dark blue armor + silver-white hair.
- **Iconic features:** (1) the cape (the largest shape in the silhouette), (2) the scythe held vertical, (3) the long silver-white hair that contrasts against the dark costume.
- **Construction:** push him taller than the others — 36px instead of 32 if your canvas allows. The cape silhouette should bell out at the bottom, not hang straight. Hair gets its own 3-tone ramp with a near-white highlight to pop against the dark cape.

## Workflow — designing a new CT character from scratch

1. **Pick a 2-color signature.** What two colors does a fan name when describing this character? "Teal and orange" or "blue and yellow." If you can't name them, the character isn't iconic enough yet.
2. **Decide the silhouette hallmark.** One shape that breaks the standing-figure outline — a cape, a hair sweep, an oversized weapon, a boxy body, a long ponytail. One per character.
3. **Sketch the silhouette at 32px tall** as a single filled color. Squint. If you can already tell who it is from the silhouette alone, you're on track. If not, push the hallmark harder before adding any detail.
4. **Build the 12-color palette around the signature pair.** Slot 1–2 outline-shadow colors, 6–9 ramp tones across 2–3 major regions, 1 spec-white, 1–2 accent colors.
5. **Block flat colors** inside the silhouette using only the midtones from each ramp.
6. **Apply 3-tone shading per region**, with light from upper-left. Shadows go on lower-right edges, highlights on upper-left curves.
7. **Replace any black outlines with colored ones** — each region uses its own darkest-tone color as outline.
8. **Add 1-pixel speculars** on metal, jewelry, weapon. Add the eye glint (1 pixel of pure white inside the pupil).

If the silhouette test in step 3 fails, restart at step 2. Don't try to fix a weak silhouette with detail later — detail amplifies weak silhouettes into noise.

## Worked example — the horned knight, annotated

The sprite at `projects/chrono/sprites/knight_idle.sprite.json` is a first attempt at the CT style. Read it side-by-side with this critique:

**What it does right:**
- **Iconic silhouette hallmark.** The gold horns sweep out from the helmet and break the standing-figure outline at the top. They pass the squint test — silhouette alone reads as "horned knight."
- **Colored line work on the armor.** Outlines use `armor-shadow` (`#3a4868`, a dark blue), not pure black. Pure black survives only in the visor slit interior (`void-deepest`).
- **Hue-shifted cape ramp.** Cape shadow is wine (`#5a1830` — purple-shifted), midtone is red (`#a82848`), highlight is warm pink (`#e84878`). Cool to warm gradient across the ramp — textbook.
- **White speculars** on the helmet apex and inside the visor as eye glints. Single pixels each.
- **Light source consistent upper-left.** Highlights cluster on the upper-left edges of horns, helmet, pauldrons; shadows on the lower-right.

**What it does wrong relative to true CT:**
- **Proportions are still chibi-leaning.** The figure runs about 1:2.5 head:body when the helmet's horns are counted as head, not the CT-standard 1:5. Real CT character would be visibly taller for the same head size.
- **No animation.** A CT idle is at minimum 2 frames — blink + bob. This sprite is one frame.
- **The gold chest emblem reads as flair, not as a character signature.** Gold appears on horns, emblem, belt, and boots — diluted. A true CT character has one or two distinctive accent placements, not five.
- **The cape is roughly symmetric.** CT capes flow more — asymmetric edges, more variation in where the highlight catches.

**Where to take it next:** drop the gold emblem; concentrate the gold to just the horns and one other element (sword pommel? belt?). Add a 2-frame blink-and-bob idle. Optionally redraw at 40px tall with the helmet shifted up so the body lengthens toward true CT proportions.

## Common pitfalls

- **Pure-black outlines everywhere.** Result: looks like FF6, not CT. The colored line work is what separates the styles.
- **Skipping speculars.** Result: flat, plasticky armor. One white pixel per metal surface is the difference between "plastic" and "polished steel."
- **Same palette across the whole party.** Each CT character should have a *unique* 12-color set; the shared elements are just outline-tones and the spec. If your archer and your knight use the same purple, one of them is wrong.
- **Pillow shading on the helmet.** The single easiest place to slip — a dome shape begs to be shaded radially. Force yourself to put highlight upper-left and shadow lower-right, even on a round helmet.
- **Over-detailing at 32px.** Restraint reads as polish. If you're adding pixels because there's empty space, you're past the point of diminishing returns. Less is more at this resolution.

## Quick reference checklist

Use this in addition to the universal pre-flight checklist in [`/CLAUDE.md`](../../CLAUDE.md):

- [ ] **2-color signature picked**, and a fan could name both from the sprite alone?
- [ ] **One silhouette hallmark** that breaks the standing-figure outline (cape, hair, oversized weapon, boxy body)?
- [ ] **12-color palette planned before drawing**, slotted as outline-tones + ramps + spec + accent?
- [ ] **Colored line work** — each region outlined by its own darkest tone, not pure black?
- [ ] **3-tone hue-shifted ramp** on every major region, with light from upper-left?
- [ ] **1-pixel speculars** on metal, jewelry, weapon? Plus the eye glint?
- [ ] **Build variation** considered — does this character have the same body shape as the last CT character you drew, or is the silhouette genuinely different?
- [ ] **Proportions** closer to 1:5 head:body than to chibi (unless the character is specifically squat like Frog or boxy like Robo)?
