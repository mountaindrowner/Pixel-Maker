---
description: Generate a sprite, critique it against the docs, refine, repeat — stops at score ≥ 9 or after 3 passes
argument-hint: <character description> [project=chrono]
---

# Iterate-and-refine a sprite

You are running a generate → critique → refine loop for a new pixel art sprite. The user described the character as: **$ARGUMENTS**

## Loop rules

- **Max 3 passes.** Hard cap.
- **Stop early if total score ≥ 9/10.** Don't keep tweaking a sprite that's already strong.
- **Stop early if score does not improve between two consecutive passes** (you're hill-climbing into a local optimum; ship the current best).
- **Show only the final result.** Don't send intermediate previews to the user — they only see the chosen sprite at the end, plus a one-paragraph summary of what each pass changed.

## Pass 1 — Initial generation

1. **Read the docs that matter for this sprite.** Always read `docs/README.md`, `docs/CHARACTER_DESIGN.md`, `docs/ANATOMY.md`, `docs/COLOR.md`, `CLAUDE.md`. If a style is named (Chrono Trigger, FF6, Mega Man, etc.) also read `docs/STYLE_REFERENCES.md` and any matching `docs/STYLES/<NAME>.md`. If the description involves dynamic motion read `docs/ANIMATION.md`.
2. **Read the target project's `palette.json` and one existing sprite** in that project as style reference. Default project is `chrono` unless the user named another. If the project doesn't exist yet, scaffold it: `projects/<name>/project.json` (canvas size from the style guide), `projects/<name>/palette.json`, `projects/<name>/sprites/`.
3. **Plan the sprite in 4 bullets BEFORE writing pixels.** Output to the user as a brief plan, then proceed without waiting for approval:
   - Two-color palette signature (the two colors a viewer would name)
   - One silhouette hallmark (the shape that breaks the standing figure)
   - 12-or-fewer-color palette laid out slot by slot
   - Pose, with anatomy notes: contrapposto direction, joint dots, hand vocabulary
4. **Write the sprite file** at `projects/<project>/sprites/<name>_idle.sprite.json`. Pick `<name>` from the character description (e.g. "druid", "frost_witch").
5. **Validate** with `npm run validate <path>`. Fix any width/height/palette errors.
6. **Render** with `npm run sync-pngs`. Read the resulting PNG.

## Critique pass — after every generation

Score the sprite against this rubric. Each row is 0, 1, or 2 points. Be honest — overscoring kills the loop.

| Category | 0 (fail) | 1 (partial) | 2 (clean) |
|---|---|---|---|
| **Silhouette** | Cannot tell what it is when filled with one color | Iconic feature present but muddled by other shapes | Squint test passes — the hallmark shape identifies the character instantly |
| **Anatomy** | Columnar limbs, soldier-stance, blob hands or hidden limbs | Some articulation visible but joints / stance / hands are inconsistent | Visible joint dots at appropriate scale, one-foot-offset or other deliberate symmetry break, hand vocabulary matches scale (see `docs/ANATOMY.md`) |
| **Color** | Flat single-tone fills, no hue shift, or pure black outlines everywhere | 3-tone ramps present but hue shift weak or light direction inconsistent | 3-tone hue-shifted ramps per material, light source upper-left consistently, colored line work (each region outlined by its own dark tone) |
| **Line work / detail** | Jaggies, doubles, 2×2 eyes that read as owlish | Mostly clean lines but some jaggies or misplaced details | Single-pixel symmetric curves, 1×1 eyes with glints, no jaggies, intentional restraint |
| **Style adherence** | Doesn't match the named style at all | Hits some constraints (palette cap, proportions) but not others | All major constraints of the named style met (e.g. CT: 12-color cap + colored line work + 1-px speculars + 1:5 proportions) |

**Total: __ / 10.** Then write a brief critique: 3–5 specific concrete issues — name the pixels or regions where the issue lives, not vague art-school adjectives. "The left arm reads as a column at rows 14–20 because there's no joint dot at the elbow row 17" beats "anatomy needs work."

## Refinement pass — after a critique that didn't stop the loop

1. Take the top 3 issues from the critique. Don't try to fix everything in one pass — that introduces new bugs.
2. **Edit the sprite file** (use `Edit`, not `Write`, for targeted row replacements). Address each issue with a specific pixel-level change.
3. **Validate** again. Fix any new width/height errors before rendering.
4. **Render** with `npm run sync-pngs`. Read the PNG.
5. **Go back to the critique pass** with the new sprite. Score honestly — refinement can introduce regressions; if the score drops, that pass failed and the previous version is the candidate.

## After the loop terminates

1. **Identify the winning iteration** — the highest-scoring pass, not necessarily the last one. If iteration 2 scored 8 and iteration 3 scored 7, iteration 2 wins; overwrite the sprite file with iteration 2's content if needed (you may want to save iteration history to `/tmp/iterate_history/` mid-loop to make this easy).
2. **Build a comparison image** at `/tmp/iterate_<name>.png` showing pass 1 → final, upscaled with `sharp` and `kernel: 'nearest'`, on a dark background.
3. **Send the user ONE message:** include the final PNG via `SendUserFile` with a one-paragraph caption summarizing what each pass changed and the final score. Don't send intermediate PNGs.
4. **Commit and push** to the active feature branch with a message naming the character and the final score. Don't open a PR unless asked.

## Anti-patterns to avoid

- Showing every iteration to the user as it happens. The whole point of this command is that the noise stays in your context, not theirs.
- Overscoring to terminate early. If you give a 9 to a sprite that genuinely deserves a 6, the loop's no better than a single pass.
- Underscoring to keep iterating past the point of improvement. Three passes is the cap for a reason — refinement past that usually trades one issue for another.
- Rewriting the entire sprite file on each refinement when the issue is a 5-pixel region. Use `Edit` for surgical changes.
- Forgetting to read the PNG after `sync-pngs`. The critique has to look at the rendered result, not at the JSON, or you're scoring code you can't see.
