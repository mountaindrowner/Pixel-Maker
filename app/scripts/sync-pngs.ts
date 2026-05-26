import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { validateSprite } from "../src/schema/sprite";
import { decodeFrameToBytes } from "../src/lib/pixels";
import { hexToRgb } from "../src/lib/color";

async function main() {
  const root = path.resolve("projects");
  const projects = await fs.readdir(root, { withFileTypes: true }).catch(() => []);
  let count = 0;
  for (const p of projects) {
    if (!p.isDirectory()) continue;
    const spritesDir = path.join(root, p.name, "sprites");
    const files = await fs.readdir(spritesDir).catch(() => []);
    for (const f of files) {
      if (!f.endsWith(".sprite.json")) continue;
      const jsonPath = path.join(spritesDir, f);
      const raw = await fs.readFile(jsonPath, "utf8");
      const result = validateSprite(JSON.parse(raw));
      if (!result.sprite) {
        console.error(`skip ${jsonPath}: invalid`);
        continue;
      }
      const sprite = result.sprite;
      const pngPath = jsonPath.replace(".sprite.json", ".png");
      const bytes = decodeFrameToBytes(sprite.frames[0], sprite.width, sprite.height, sprite.palette);
      const rgba = Buffer.alloc(sprite.width * sprite.height * 4);
      const paletteRgb = sprite.palette.map((c) => hexToRgb(c.hex));
      for (let i = 0; i < bytes.length; i++) {
        const idx = bytes[i];
        if (idx === 255) {
          rgba[i * 4 + 3] = 0;
        } else {
          const [r, g, b] = paletteRgb[idx];
          rgba[i * 4] = r;
          rgba[i * 4 + 1] = g;
          rgba[i * 4 + 2] = b;
          rgba[i * 4 + 3] = 255;
        }
      }
      await sharp(rgba, { raw: { width: sprite.width, height: sprite.height, channels: 4 } })
        .png()
        .toFile(pngPath);
      count++;
      console.log(`wrote ${pngPath}`);
    }
  }
  console.log(`synced ${count} png(s)`);
}

main();
