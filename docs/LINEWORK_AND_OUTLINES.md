# Line work and outlines

Clean line work is the first thing the eye registers and the easiest place to look like an amateur. Two ideas to internalize: **avoid doubles** and **mind your curves**.

## Doubles (a.k.a. jaggies)

A "double" is when a pixel has three or more neighbors along a single line — a stacked 2×2 corner where the line should taper gracefully. Doubles make lines look chunky and unintentional. Compare:

```
With doubles (bad):       Without doubles (good):
..XX..                    ..XX..
..XX..                    ..XX..
...XX.                    ...X..
...XX.                    ...XX.
....XX                    ....XX
```

In the bad version, the line has 2-pixel-thick vertical sections that don't taper. In the good version, the line is consistently 1 pixel thick with clean diagonal steps. **Single-pixel lines unless you have a deliberate stylistic reason for thicker ones.**

Aseprite has a "pixel perfect" mode that prevents auto-doubles when freehand-drawing. We don't have that in Pixel-Maker, but the principle holds: when you draw a diagonal, count.

## Curves and the segment-length rule

A diagonal line in pixel art is made of straight segments stacked next to each other (e.g., 3 pixels, then 2, then 1). To make the curve look smooth, those segment lengths must be **symmetric on either side of the curve's peak** and **change by no more than 1 at a time**.

A clean 90° curve uses a 4-3-2-1 or 3-2-1 segment sequence on each side:

```
......XXXX   ← 4
....XX....   ← 2  
...X......   ← 1
..X.......   ← 1
.X........   ← 1
X.........   ← 1
```

If you have a jump like 4-1-3 on one side, the curve will look broken. Always count.

For small curves (one or two pixels), the same rule applies — just simpler. Start by placing the two endpoints, then fill toward the middle.

## Outline strategies, ranked

There's no single right answer; pick deliberately:

1. **No outline** — Hyper Light Drifter, Hyper Light Breaker. Demands very strong shape language and high value contrast between figure and ground. Hardest to pull off but most modern-looking.

2. **Hard black outline** — the NES Mega Man / classic look. Reads instantly, no ambiguity. Default for small sprites where readability matters most. Good for interactive objects, enemies, the player.

3. **Selective outline** — outline is a darker version of the object's own color, not pure black. Stardew Valley everywhere. Wood gets dark-brown outline, foliage gets dark-green outline, etc. Softer, more painterly. Good for environmental objects, NPCs that should feel part of the world rather than popping out.

4. **Partial outline** — same as a hard outline but omit the bottom edge of objects that sit on the ground. Connects them visually to the floor instead of floating. Almost universal for top-down trees, rocks, buildings.

5. **Broken / colored outline** — the Pokémon Gen 1 trainer trick. Break the black line with a touch of a darker mid-tone every few pixels. Conveys line tapering and softens the silhouette. Works especially well on hair and clothing edges.

## Outline emphasis tricks

- **Pointiness pixel.** A single corner pixel sticking out from a hard-cornered shape makes it read as pointy. Sword tips, hat spikes, claws. Without it, the same shape reads as blunt.
  ```
  Blunt:     Pointy:
  .XX..      ..X..
  XXXX.      .XXX.
  XXXX.      XXXX.
  ```
- **Outline weight via gaps.** Replace a single black outline pixel with the darker midtone for a few-pixel stretch — the line "thins" without actually changing thickness. Use to suggest soft surfaces (hair, cloth) vs hard ones (armor, weapon).
- **Inverted outlines on dark costumes.** When the object is mostly black or very dark, use a *lighter* color as the internal line work to separate sub-regions. Otherwise everything blends into a single black blob.

## What I personally got wrong in the demo sprites

- The peasant has no outline at all on the body, which is fine stylistically but means the rust tunic blends into the dark pants and the silhouette is mushy.
- The Mega Man has a solid block of cyan helmet top with no outline differentiation between helmet and face — Mega Man's actual sprite has a thin dark line separating them.
- Several body parts have 2-pixel-wide outline stretches where 1 would do. Doubles.

Next round, fix these.
