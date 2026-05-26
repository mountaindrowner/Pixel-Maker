# Style references

What specifically makes the most iconic pixel art styles look like themselves. Use these when targeting a particular look ("FF6-style", "Chrono Trigger-style", "NES Mega Man style") so the result actually evokes the source.

## Final Fantasy 6 (SNES, chibi battle/overworld)

**Canvas:** 16–32 px tall. Battle sprites slightly larger than overworld.

**Proportions:** ~3 heads tall. Head is 35–40% of total height. Body is small but recognizable.

**Palette:** ~6–12 colors per sprite. Each class (mage, knight, monk, etc.) has a strongly identifying color scheme. A blue/gold mage is unmistakably a mage.

**Shading:** 2–3 tones per region with subtle hue shift. Not heavily shaded — the silhouette and color do most of the work.

**Iconic features:** big distinctive hat or helmet per class. Mage = pointy hat. Knight = visored helm. Monk = bare head, gi. The hat IS the silhouette.

**Line work:** clean, mostly black or dark outlines. No anti-aliasing.

**Eyes:** 1×1 pupils. Sometimes just 2 black pixels for the whole face at the smallest sizes.

**To target this style:** start with a 16–24 px tall canvas, give the character a strongly distinctive headpiece, use 2 tones per region, and let the hat carry the silhouette.

## Chrono Trigger (SNES)

**Canvas:** ~32 px tall battle sprites. Some are taller (Robo) or shorter (Frog).

**Proportions:** More realistic than FF6 — about 1:5 head:body ratio. The head is ~20% of total height. Builds vary (Robo is square, Frog is short, Magus is lanky).

**Palette:** **12 colors per sprite, hard cap.** Each character gets a unique 12-color set. Designed for the SNES 16-color sprite palette limit (with a few slots reserved).

**Shading:** Rich, multi-tone. **Colored line work, not pure black** — each region's outline is a darker shade of that region's own color. Outlines on the hair are dark brown, outlines on armor are dark blue, etc. This is what makes Chrono Trigger look softer and more painterly than FF6.

**Specular highlights:** bright near-white spots on metal armor, weapons, jewelry. Often a single pixel of pure white.

**Iconic features:** each character has a distinct silhouette and palette signature (Crono = teal/orange, Frog = green/blue, Marle = ponytail blue, Magus = purple/cape). 

**To target this style:** 32 px tall, design a 12-color palette where each material has 3 tones plus a darker outline color, use the colored outline approach instead of black, add 1-pixel specular dots on shiny surfaces.

## NES Mega Man (1987)

**Canvas:** 24 px tall.

**Proportions:** Chibi (~2.5 heads tall). Huge head, small body.

**Palette:** 3–4 colors per character total. Black outline, white, and one or two color tones. The original NES limit.

**The "blank template" trick:** Mega Man's basic sprite has clearly defined regions (helmet, face, body, gloves, boots) that act like a paint-by-numbers template. Many derivative characters (Robot Masters, fan-made Mega Man variants) reuse this layout and just swap colors and headpiece.

**Eyes:** 2×2 black pupils with white surround. This is THE PLACE where 2×2 eyes work, because the white frame defines them. Without that frame they'd look blocky; with it, they look cartoony and expressive.

**Iconic features:**
- The helmet (rounded dome with the side fins).
- The two big white-framed eyes.
- The cyan stripe(s) across body and limbs.
- The arm cannon (right arm replaced with a blue/cyan cannon barrel) — **essential when firing or in many idle stances**.
- The exaggerated jump pose: legs splayed wide, arm up. The pose itself is iconic.

**Line work:** solid black outline everywhere.

**To target this style:** 24 px tall, exactly 4 colors per character (black + white + main color + accent), 2×2 white-framed eyes, give EVERY Mega Man derivative an arm cannon (this is the silhouette signature; without it, it's not Mega Man).

## Pokémon Gen 1 trainer sprites (Game Boy, 1996)

**Canvas:** 56×56 px.

**Palette:** 4 colors — black, white, and 2 mid-tones (the classic Game Boy green or the Super Game Boy orange/blue). That's the only palette available.

**Shading:** the orange (lighter mid-tone) is often used as the skin color, with white as highlight directly on top of it for blown-out specular. The blue (darker mid-tone) shadows and breaks up line work.

**Dithering:** heavy use of dithering for fabric texture, hair, straw hats, motorcycle wheels. The dither pattern itself reads as roughness or fabric grain.

**Line work:** black, but BROKEN — the blue mid-tone interrupts the black line work in many places to soften it. The hair often spills outside the outline in soft tones.

**Iconic features per trainer:** each one has a clear archetype made readable through pose and props. Boxer crouched and ready, Beauty with flowing hair and a tossed Pokéball, Biker on a motorcycle, Bug Catcher with a net. **The pose IS the character.**

**To target this style:** strict 4-color palette, lean heavily on dithering for texture, build the silhouette around an archetypal pose with a single defining prop.

## Stardew Valley world art (2016, top-down)

**Canvas:** Tiles are 16×16. Character sprites ~24 px tall. World assets vary.

**Palette:** Rich and varied. Every region has its own color set; the project as a whole spans many palettes harmoniously.

**Outlines:** **Selective — every object has a darker version of its own color as outline.** Trees get dark-green outlines, wood gets dark-brown outlines, stone gets dark-gray. **Never pure black.** Terrain (grass, dirt) has NO outline. This is what makes Stardew feel soft and integrated rather than cartoony.

**Shadows:** hue-shifted toward purple/cool. A red barn casts a purple shadow on the ground.

**Color variety:** rich. Multiple shades of green for foliage, each tree slightly different. The world feels alive because no two patches of the same material use identical colors.

**To target this style:** selective outlines (no pure black), hue-shifted purple shadows, vary your greens and browns by ±5–10% in HSV to make terrain feel alive.

## Eastward / Battle Axe (modern indie top-down)

**Hallmark technique:** contrast modulates pathing. Walkable terrain is low-contrast and visually quiet. Dense, high-contrast areas signal "don't walk here" (forests, rocks, water edges). The player's eye is naturally drawn along the bright clear paths because the dark dense areas read as visual noise.

**To target this style:** when designing world tiles, keep navigable areas LOW contrast (small value differences between adjacent pixels). Reserve high contrast for borders, walls, decorative density. The player navigates by where the eye flows.

## Hyper Light Drifter (2016)

**Hallmark technique:** NO outlines. Period. Shapes are defined entirely by silhouette and value contrast against the background.

**Why it works:** the value (brightness) contrast between figure and background is high enough that outlines aren't needed. The character is always significantly lighter or darker than what's behind them.

**Why it's hard:** demands strong shape language. You can't rely on a black line to clarify which pixel belongs to which object — the shapes themselves must do that work.

**To target this style:** drop outlines entirely. Design characters with very strong, clean silhouettes that work as flat values. Use strong background-vs-foreground value contrast.

---

## Picking a target style

When the user asks for a specific style, **read the matching section above first** and design within those constraints. Don't blend styles — a "Chrono Trigger style Mega Man" should pick ONE and stick to it. Each style is internally coherent because all its choices reinforce one aesthetic.

When the user asks for a generic "pixel art character" without naming a style, default to **FF6 chibi at 16–24 px tall** with hue-shifted 3-tone shading. It's the safest, most recognizable look.
