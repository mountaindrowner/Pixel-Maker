import { promises as fs } from "node:fs";
import path from "node:path";
import { validateSprite } from "../src/schema/sprite";

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("usage: npm run validate <path-to-sprite.json> [...more]");
    process.exit(2);
  }
  let allOk = true;
  for (const arg of args) {
    const file = path.resolve(arg);
    const raw = await fs.readFile(file, "utf8").catch((e) => {
      console.error(`${arg}: cannot read (${e.message})`);
      allOk = false;
      return null;
    });
    if (raw == null) continue;
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error(`${arg}: invalid JSON (${(e as Error).message})`);
      allOk = false;
      continue;
    }
    const result = validateSprite(parsed);
    if (result.sprite) {
      console.log(`${arg}: OK (${result.sprite.frames.length} frames, ${result.sprite.palette.length} colors)`);
    } else {
      allOk = false;
      console.error(`${arg}: ${result.issues.length} issue(s)`);
      for (const i of result.issues) console.error(`  ${i.path}: ${i.message}`);
    }
  }
  process.exit(allOk ? 0 : 1);
}

main();
