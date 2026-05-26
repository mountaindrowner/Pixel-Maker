# Shading

Shading is how 2D pixels start to feel 3D. The trick is to decompose every object into one of five basic shapes and shade it according to that shape's rule — not to wing it.

## The five basic shapes

Memorize these. Every object you draw breaks down into a combination of them.

### Cube (and pyramid) — flat faces

A cube has six flat faces. **Each face gets exactly one color.** No gradient. The color is determined by how directly that face points at the light source.

Light from upper-left:
- Top face: lightest tone.
- Front face: midtone.
- Right face: shadow tone.

Don't gradient a flat face. A flat face has the same orientation across its entire surface, so it receives the same amount of light across its entire surface. Drawing a gradient on it is the #1 marker of an amateur. (See "pillow shading" below.)

Pyramids work the same way: each face is a triangle, and each triangle gets one tone based on its orientation to the light.

### Sphere — curved everywhere

A sphere is curved in every direction. Light hits it most strongly at a single point (the spot directly facing the light) and falls off radially outward into shadow. So shading is a **radial gradient outward from the light spot.**

Layout (light from upper-left):
- Brightest pixel: upper-left of the sphere, roughly.
- Concentric rings of decreasing brightness as you move away.
- Darkest pixel: lower-right.
- Optional: a tiny pure-white specular dot if the material is shiny.

At small scale (8–12 px diameter), this might just be: a 1-pixel highlight at upper-left, the midtone filling the body, and a thin crescent of shadow at lower-right.

### Cylinder — flat ends, curved side

A cylinder has flat caps (top/bottom) and a curved side. Apply both rules:
- Caps: one color each (cube rule).
- Curved side: horizontal **bands** of color (one tone per band), running along the length of the cylinder. With light from upper-left, the band order across the curve is: shadow / midtone / highlight / midtone / shadow.

This is why a cylinder looks "striped" — those bands are the gradient along the curvature.

### Cone — like a cylinder, but tapered

Cone shading uses the same band approach as a cylinder, but the bands taper toward the point. So instead of horizontal stripes, you get angled stripes that converge at the apex.

## Pillow shading — the cardinal sin

Pillow shading is when you put shadow around all edges of a silhouette regardless of light direction, leaving the brightest tone in the center. The result looks puffy, inflated, like every object is a throw pillow.

Symptoms:
- The same object is shaded the same way regardless of where you imagine the light source.
- Highlights appear in the geometric center rather than on the side facing the light.
- Flat surfaces (cube faces) have gradient on them.

The cure: **pick a light source direction first, then shade everything as if the light were really coming from there.**

## Light source — pick one, stick to it

For a project, pick a light direction up front. The safe default is **upper-left**: the imagined sun is in the top-left corner of the canvas, illuminating everything from that direction. Consequence: top and left edges of objects are bright, bottom and right edges are dark.

Top-down games typically use **light from above + slight forward angle.** That means tops of objects are brightest, fronts are midtone, sides are shadow. Buildings, trees, characters all light from the top.

**Consistency across sprites in a project is non-negotiable.** If the mage is lit from the upper-left and the knight is lit from the upper-right, the world reads as broken. Pick once, enforce always. In Pixel-Maker, pick the light direction when you start a project and write it in `project.json` as a note or comment.

## Highlights as specular reflections

A highlight isn't just "the brightest tone of the base color in the lit area." It's the **reflection of the light source itself off a smooth surface.** That's why a single tiny pixel of pure white (or near-white) on a knee, shoulder, or sword edge reads as "shiny" — it's the light source's reflection.

Use specular highlights sparingly:
- Polished metal: yes, a 1-2 pixel pure-white spot per metallic region.
- Skin: one small bright dot on the cheek or shoulder if you want a "well-lit" look.
- Cloth, hair, wood: typically no specular — those materials don't reflect strongly.

## Dithering

Dithering is a checkerboard (or other pattern) of two colors that fakes an intermediate tone at viewing distance. Originally a hardware necessity (limited palettes on old consoles); now a stylistic choice.

When to use:
- **Texture.** Bushy beard, straw hat, fur, coarse fabric. The pattern itself reads as roughness.
- **Smooth color transitions** in a low-color-count palette. The dither bridges two tones without needing a third color.
- **Large flat areas** that need visual interest without committing to a third color.

When NOT to use:
- Small sprites (16×16). There's no room; dithering reads as noise.
- Anywhere you want a clean, modern look. Dense checkerboard dithering screams "old console."

The modern indie approach is **sparse dithering**: scattered single pixels, not a regular checkerboard. Reads as soft transition, not retro texture.

## Anti-aliasing

Anti-aliasing in pixel art is placing a single intermediate-color pixel at the inside corner of a curve to soften the jaggies between two colors. Different from blurry image-resampling AA — here it's manual and surgical.

Rules:
- Use sparingly. Pixel art's charm is sharpness; AA softens that.
- Keep AA on the **inside** of shapes, not the outside. If you put it on the outside, it bleeds into the background and looks wrong when the background changes.
- The AA color should be visually between the two colors it's bridging. (HSV-midway, not just RGB-average.)

## Cast shadows

Cast shadows (the shadow an object throws on the ground) are physics, not vibes. Trace rays from the light source through the top edges of the object down to the ground plane to find the shadow's outline. Don't eyeball them — wrong cast shadows are immediately uncanny.

For top-down: a small dark ellipse directly under the object (slightly larger if the light is high, smaller if the light is overhead) usually does the job.

## What I personally got wrong in the demo sprites

- **All three demo sprites are pillow-shaded** (or worse, flat-shaded). No consistent light source. The mage's hat has no top-vs-side distinction.
- **No specular highlights anywhere.** Even Mega Man's armor (which would have bright reflective spots on the curves) is flat.
- **No use of the 5 basic shapes mental model.** I just blocked in silhouettes and filled regions. Next time, identify each region as a shape first and shade by the shape's rule.

Next round: pick light from upper-left, shade each region by its underlying shape.
