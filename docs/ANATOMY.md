# Anatomy — limbs, joints, stance

This doc is the missing instruction layer between [`CHARACTER_DESIGN.md`](CHARACTER_DESIGN.md) (silhouette, proportions, iconic features) and [`SHADING.md`](SHADING.md) (cylinders, light source, hue shift). It covers what `CHARACTER_DESIGN.md` mentions only in passing: how a humanoid figure articulates — where the joints are, how wide a limb has to be to read as a limb, where hands and feet go, how weight shift breaks the dead-symmetric soldier-stance.

The three existing chrono sprites (knight, Magus, Beetle-Paladin) all share the same anatomical weakness: rigid columnar limbs with no visible joints, narrow mirror-symmetric stances, hands hidden or absorbed. They were drawn before this doc existed. Don't repeat that.

The six worked-example sprites under `projects/anatomy_studies_small/` (32×40) and `projects/anatomy_studies_large/` (64×80) are paired so you can see what fits at each scale and what falls out when you shrink down.

## Proportions reference

Different styles target different head:body ratios. Pick one for the project and stick to it across characters.

| Style | Heads tall | Where head ends | Notes |
|---|---|---|---|
| Pure chibi (Pokémon overworld) | 2 | At the shoulders | The body IS one head plus one body-shape. |
| FF6 chibi | 2.5–3 | Just above the chest | The hat does the silhouette work. |
| Chrono Trigger / Mega Man X | 5 | Just below the collarbone | The reference target for medium sprites. |
| Realistic / illustrative | 7–8 | Just below the collarbone | Anatomically correct adult. |

Two universal anchors regardless of style:

- **Elbow sits at the navel.** Always. From shoulder to elbow is half the arm. If you draw an arm hanging straight, the elbow is at belly-button height.
- **Knee sits at the midpoint of the leg.** From hip to ankle, the knee is exactly halfway. Higher = chibi (looks childlike). Lower = leggy (looks idealized/heroic).

Other useful facts that hold in pixel art too: shoulder-width is ~2 head-widths for an adult, hand-length equals face-length, foot-length equals forearm-length. None of this needs to be exact at 32px, but knowing it lets you check when something looks "off."

## The pixel budget at each sprite scale

The single most actionable rule in this doc. What limb width reads as an arm vs. a stick vs. a blob at common sprite-figure heights:

| Figure height | Arm width | Leg width | Head width | Hand | Foot width |
|---|---|---|---|---|---|
| 16 px | 1 px | 1 px | 4 px | implied | 2 px |
| 24 px | 1–2 px | 2 px | 5 px | 1 px fist | 2–3 px |
| 32 px | 2 px | 2–3 px | 6–7 px | 1–2 px | 3–4 px |
| 48 px | 2–3 px | 3–4 px | 9 px | 2 px | 4–5 px |
| 64 px | 3–4 px | 4–5 px | 11–12 px | 2–3 px | 5–7 px |
| 80+ px | 4–5 px | 5–7 px | 14+ px | 3–4 px | 7–9 px |

**A 1-px-wide limb at any scale reads as a stick.** Fine for stick figures, never for a character.

**A limb wider than 1/4 of the figure height reads as bloated.** A 32-tall figure with 5-px arms looks like a cartoon strongman, not a person.

**A limb width must not equal the body width.** If the body is 5 wide and each arm is 5 wide, they merge into one shape. Keep the arm at most ~half the body width.

## The skeleton — drawing the figure from inside out

CT artists (and most pixel artists who draw bodies well) work outside-in only after the inside is right. The CT video PDF shipped to the repo describes the move directly: lay down circles for head, hands, and feet first, then connect with 1-pixel lines, then thicken outward.

For a humanoid sprite:

1. **Place 7 dots:** head-top, shoulders (×2), hips (×2), feet (×2). That's the figure's whole height encoded in seven pixels.
2. **Trace the spine** as one vertical line from head-bottom to between the hips.
3. **Connect shoulders to hips** with the trunk outline.
4. **Connect shoulders to hands** with the arm lines. Plan the elbow as a single inflection pixel halfway down.
5. **Connect hips to feet** with the leg lines. Plan the knee as a single inflection pixel halfway down.
6. **Thicken outward** to the silhouette: arms are tubes outward from the centerline, legs are tubes downward.

Doing the skeleton first prevents the most common failure: arms that hang from the wrong spot on the shoulder, or legs that emerge from the side of the body instead of from inside the silhouette. If the skeleton is right, the silhouette is almost automatic.

## Joints — making elbows and knees visible

Joints don't actually need to *bend* to read. They need to **read as joints** even in a straight pose. The trick is the **joint dot**.

A joint dot is a single darker-tone pixel placed at the elbow or knee position. On a 32-tall figure with 2-wide arms, one shadow-tone pixel embedded at the elbow column tells the eye "this is an elbow." Without it, the arm reads as a featureless tube.

**Where to place joint dots by scale:**

- **At 24 px and below:** no joint dots. The figure is too small; one extra dark pixel reads as noise. The viewer's brain fills in the joints.
- **At 32 px:** optional joint dots for the elbow and knee, on the *outer* edge of the limb (away from the body). Place them at the limb's halfway point. If they fuse with the colored line work, drop them.
- **At 48–64 px:** joint dots become standard. Place on the outer edge of the elbow and the outer edge of the knee, in the limb's darkest tone.
- **At 80+ px:** you can do more — a 2-pixel knee cap (lighter pixel on top of the joint dot), a wrist bone shadow, a clavicle hint.

The joint dots make the difference between "the figure is wearing a tracksuit made of cardboard tubes" and "this is a body that could move."

## Stance and weight

A standing figure with both legs identical and both arms identical hanging straight down is **soldier-stance**. It reads as "character standing at attention." It is the apprentice mark. The knight and Beetle-Paladin both fall into it.

**Contrapposto** is the fix. Weight on one leg, the other leg relaxed. It shows up in three places:

1. **Foot position:** the weight-bearing foot is planted vertical; the free foot is offset forward, back, or to the side by 1–2 px. This is the cheapest break of symmetry — a single pixel of difference between the feet reads instantly as a relaxed pose vs. attention.
2. **Hip line:** the weight-bearing hip rises (the locked leg pushes the pelvis up on that side); the free hip drops. At 32 px tall, this is a 1-px hip-row tilt — barely visible but it changes the read.
3. **Shoulder line:** shoulders tilt opposite to the hips to balance. Weight-side shoulder drops; free-side shoulder lifts. Again 1 px at small scale.

For asymmetry that's deliberate (not soldier-stance), one of the three changes is enough. All three is dramatic. None is wrong only if the character is *actually* at attention (a guard, a robot, a wax figure).

**Cheapest possible weight-shift:** one foot 1 px offset, both arms straight, nothing else. The viewer's eye does the rest of the contrapposto interpretation.

## Hands at small scale

At small scales, hands aren't drawn — they're suggested. Vocabulary:

- **1-px fist (default):** at the wrist position, the arm width tapers by 1 px and the bottom-most pixel uses the skin's darkest tone or outline color. The eye reads it as a closed hand. Works at 24 px and up.
- **2-px fist:** at the wrist position, the arm bumps OUT by 1 px on the outer side for one row, then ends. Reads as a clenched fist. Works at 32 px and up.
- **2×2 open hand:** the arm ends in a 2×2 block of skin. Reads as a relaxed open hand only when in clear silhouette context (away from the body). Against the body it reads as a mitten.
- **3-px pointing/holding:** the wrist ends in three skin pixels arranged in an L-shape, with a 1-px extension forward (the thumb or grip indicator). Works at 48 px and up.

**The 2×2 hand at small scale next to a hip reads as a wallet, a pocket, or nothing.** If you need an open hand at the side, use the 1-px fist instead and trust the viewer.

## Feet and grounding

Feet are the cheapest place to add character. Three rules:

1. **Boots are always wider than the leg above them.** At 32 px tall: 2-px leg, 3–4 px boot. The boot widens at the toe and slightly narrows at the ankle. A leg that ends at the same width as the leg above it reads as a peg-leg.
2. **The ground contact pixel matters.** The bottom-most pixel of each boot should land on the same row (for both feet planted) or one row higher for the lifted foot in a step pose. Mismatched contact pixels read as floating or as standing on uneven ground.
3. **One foot slightly forward is free contrapposto.** Even in an idle pose, offsetting one foot 1 px forward (or pointing it outward) breaks the parallel-feet soldier look. The cheapest pose break in the doc.

For a walking step: the back foot's toe pixel lifts 1–2 rows higher than the front foot's heel. The visible contact difference is what reads as motion at static scale.

## Worked examples — the six studies, annotated

Each pose appears at 32×40 (`projects/anatomy_studies_small/`) and 64×80 (`projects/anatomy_studies_large/`) for direct comparison. Look at the pair side by side and you can name what gets dropped at small scale.

### `standing_neutral`

Contrapposto idle. Right foot offset 2 px to the right, left foot planted vertical — the cheapest weight-shift the doc describes. Both arms hang at sides with a 1-px gap separating arm from body (the cutout rule from `CHARACTER_DESIGN.md`).

**What survives at 32 px:** the foot offset, the arm-body cutout, the 2-px wide bare arms with 1-px tapered fists, the leg gap.

**What only appears at 64 px:** joint dots at the elbow (a single shadow pixel mid-arm), knee dots on each knee, the hip-line tilt of 1 px, finer hair-shading transitions, the 2-px clenched-fist hand instead of just the wrist taper.

### `walking_step`

Mid-stride contact frame. Front leg lifted with knee bent forward, back leg planted, back foot's toe pixel raised 1 row higher than the front foot's contact.

**What survives at 32 px:** the lifted-vs-planted leg distinction (the lifted leg has the knee at a visibly different position from the planted leg), the leg gap, the foot height difference.

**What only appears at 64 px:** the actual knee bend (4 px of upper leg angling forward, then 4 px of lower leg angling back), the proper knee cap shadow, the forward-arm-back-arm swing (1-px col offset on each arm).

### `arm_raised`

Right arm extended overhead with a 1–2 px fist at the top, left arm hanging straight at the side. Head straight (no tilt — keeps it simple).

**What survives at 32 px:** the arm extension column going up past the head, the contrasting hanging arm, the clear "raise" silhouette signal.

**What only appears at 64 px:** the shoulder-rotation hint (a darker pixel at the shoulder where the deltoid would catch shadow on the lifted side), the elbow on the raised arm (a single inflection pixel), the open-hand option at the top.

## Common mistakes

- **Columnar limbs.** Arms are tubes with no width variation top to bottom; legs are blocks. Even at 32 px, a 1-px narrowing at the elbow row or a slight widening at the boot top changes the read entirely.
- **Mirror-symmetric stance.** Both arms hanging identically, both feet parallel and planted. Soldier-stance. Use the cheapest contrapposto move — one foot offset — to break it.
- **2×2 blob hands.** Especially at the wrist next to the hip. Reads as a wallet or pocket. Use the 1-px fist instead.
- **Identical parallel feet at boot level.** No depth, no character. One foot 1 px forward or 1 px pointed outward fixes it.
- **Knee at the wrong height.** A knee dot at the leg's 1/3 point reads as childlike (chibi); at 2/3 down it reads as leggy. The midpoint is the safe default for an adult human figure.
- **Body width = arm width.** Arms and body merge into one shape. Arms should be at most half the body's width.
- **Arms hanging from the wrong shoulder spot.** Arms must descend from the OUTER edge of the shoulder, not the inner edge. If you draw the arm starting from a column inside the body silhouette, the shoulder reads as broken.
- **No elbow visible at sizes that could show one.** At 48 px and up, both arms straight with no joint dot is amateur. Add the dot.
- **Both arms identical when one is doing something.** If one arm is raised, the other is NEVER simply hanging — it tilts slightly back for balance, or grips the belt, or holds a prop. Mirror is for static poses only.

## Quick reference checklist

Supplement to CLAUDE.md's universal pre-flight list, scoped to anatomy:

- [ ] **Skeleton placed first?** Did you mentally (or actually) put down the 7 anchor dots (head-top, shoulders, hips, feet) and trace the limb lines before adding silhouette?
- [ ] **Limb widths fit the figure scale?** Arms and legs at the correct pixel-budget width for the figure height — not 1 px (stick) and not 1/4 of figure height (bloated).
- [ ] **Joints visible at sizes that allow it?** Elbow and knee joint dots present at 48 px and up. Optional at 32 px. Absent at 24 px and below.
- [ ] **At least one symmetry break?** One foot offset, one arm pose different, hip line tilted by 1 px, or shoulder line tilted opposite. Soldier-stance only for actual soldiers.
- [ ] **Hand vocabulary appropriate?** 1-px fist at the wrist for small figures; 2×2 hand only in clear silhouette context, never against the hip.
- [ ] **Feet wider than legs?** Boots flare wider than the leg above them. No peg-legs.
- [ ] **Contact pixels intentional?** Both feet on the same row for planted poses; offset by 1+ rows for any lifted foot.
- [ ] **Both arms doing the same thing?** If yes, you've defaulted to mirror. Pick one arm and break it.
