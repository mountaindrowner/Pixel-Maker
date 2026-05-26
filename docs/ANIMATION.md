# Animation

Pixel-Maker supports multi-frame sprites with a single FPS per sprite. This doc covers what to put in those frames.

## Key frames first, in-betweens last

Block the major poses before filling in the transitions. For any animation, identify:

- **Idle:** the rest pose.
- **Anticipation:** the brief moment of windup before the main action (a small crouch before a jump, an arm pulling back before a punch).
- **Peak:** the most extreme point of the action (sword at apex of swing, body at top of jump).
- **Recovery:** settling back to idle after the peak.

Even a 4-frame animation can use this structure. Block these poses first. Add in-between frames only after the key poses feel right at the target FPS.

## Squash and stretch

The principle from classical animation that sells weight and impact:

- **Squash:** on impact (landing from a jump, taking a hit), compress the sprite vertically. The character's whole height drops by 1–2 pixels and the body widens slightly. Lasts 1–2 frames.
- **Stretch:** in motion (mid-jump, mid-swing), extend the sprite slightly in the direction of motion. Adds energy.

Without squash and stretch, animations look mechanical. With it, characters feel like they have mass.

## Idle animation vocabulary

The smallest, most subtle motions communicate "the character is alive." Standard idle motions:

- **Blink.** Eyes closed for 1–2 frames every few seconds. The single most life-giving idle. The peasant and mage demo sprites both use this (frame 2 = eyes closed).
- **Shoulder bob.** Shift the upper body (head + torso) down by 1 pixel for half the frames, back up for the other half. Conveys breathing.
- **Breath compression.** Combine: head drops 1 pixel + body squashes 1 pixel + feet stay planted. Reads as inhale/exhale.
- **Cape/hair sway.** If the character has flowing elements, animate just those (1–2 pixels of sway side to side) while keeping the body still. The mage's robe sway, a knight's plume bob.
- **Weapon waver.** A held weapon dips slightly between frames. Subtle but adds presence.

**For a 2-frame idle**, the cleanest combo is **blink + shoulder bob**. Frame 1: eyes open, body up. Frame 2: eyes closed, body down 1px. Reads as a soft breathing-and-blinking idle.

**For a 4-frame idle**, alternate: open-up, open-down, closed-down, open-up. Eyes blink for one frame in the middle.

## Walk cycle (3–4 frames minimum)

A basic walk cycle has 4 frames:
1. **Contact:** front foot just touching ground, back foot lifted.
2. **Down:** both feet near ground, body slightly lowered (weight transfer).
3. **Pass:** opposite leg passes through, body slightly raised.
4. **Up:** back foot leaves ground, front foot fully planted.

Then frames 1–4 again with legs swapped. So a full walk loop is 8 frames, but the second half is just frames 1–4 mirrored.

At small sprite scale, 4 frames total (not mirrored) often suffice. The eye fills in the rest.

## Mega Man's jump pose

A study in why a single frame can carry an entire animation. The pose:
- Legs splayed wide (one forward, one back).
- One arm up, one arm down (or both pointing).
- Body slightly tilted.

It works because **the silhouette is unmistakably Mega Man in every frame**. The pose breaks his neutral standing silhouette and adds energy without losing readability. Even if the jump is only 1–2 frames of animation, that pose carries the whole motion.

Lesson: when designing an action frame, ensure the character is still readable from silhouette alone. Don't lose the character in dynamic poses.

## Consistent light source across frames

The sun doesn't move between frames of an idle. Highlights and shadows should stay in the same relative positions on the character even as they breathe, blink, or walk. If the light direction visibly shifts frame-to-frame, the animation feels broken.

Exception: dramatic action frames (an explosion, a spell cast) can have temporary additional light sources (the spell glow, the muzzle flash) that override the ambient light for 1–2 frames.

## Frame counts

Quality beats frame count:

- **2 frames:** minimal viable idle. Blink only, or shoulder bob only. Surprisingly readable.
- **3–4 frames:** standard idle with full vocabulary (blink + bob + breath).
- **4–6 frames:** walk cycle.
- **8–12 frames:** smooth run, attack, or jump.
- **16+ frames:** ultra-smooth (modern indie) but expensive to author.

Most game animations look fine at 3–6 frames played at 4–8 FPS.

## What I personally got wrong in the demo sprites

- **All three demo sprites use only "blink" as the second frame.** No shoulder bob, no breath compression. The animation is technically present but barely noticeable.
- **No frame 2 for the mage has any actual breath movement.** The robe should sway a pixel; the hat should bob.

Next round: combine blink with shoulder bob for richer idles. For dynamic poses, study the Mega Man jump principle — break the neutral silhouette while keeping the character recognizable.
