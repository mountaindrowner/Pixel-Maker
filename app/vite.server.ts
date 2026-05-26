import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin, ViteDevServer } from "vite";
import sharp from "sharp";
import chokidar from "chokidar";
import { validateSprite } from "./src/schema/sprite";
import { paletteFileSchema } from "./src/schema/palette";
import { projectSchema } from "./src/schema/project";
import { decodeFrameToBytes } from "./src/lib/pixels";
import { hexToRgb } from "./src/lib/color";

const NAME_RX = /^[a-z0-9_-]+$/i;

interface Options {
  projectsDir: string;
}

export function pixelMakerServer({ projectsDir }: Options): Plugin {
  return {
    name: "pixel-maker-server",
    apply: "serve",
    configureServer(server: ViteDevServer) {
      const here = path.dirname(fileURLToPath(import.meta.url));
      const root = path.resolve(here, projectsDir);

      const watcher = chokidar.watch(root, { ignoreInitial: true, depth: 5 });
      const sseClients = new Set<import("node:http").ServerResponse>();
      watcher.on("all", (event, filePath) => {
        const rel = path.relative(root, filePath);
        const payload = `event: fs\ndata: ${JSON.stringify({ event, path: rel })}\n\n`;
        for (const client of sseClients) client.write(payload);
      });

      const validateName = (name: string) => {
        if (!NAME_RX.test(name)) throw new Error(`invalid name: ${name}`);
      };
      const safeJoin = (...parts: string[]) => path.join(root, ...parts);

      const json = (res: import("node:http").ServerResponse, status: number, body: unknown) => {
        res.statusCode = status;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(body));
      };

      const readBody = (req: import("node:http").IncomingMessage): Promise<string> =>
        new Promise((resolve, reject) => {
          const chunks: Buffer[] = [];
          req.on("data", (c) => chunks.push(c));
          req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
          req.on("error", reject);
        });

      server.middlewares.use("/api", async (req, res, next) => {
        try {
          const url = new URL(req.url ?? "/", "http://localhost");
          const parts = url.pathname.split("/").filter(Boolean);
          // parts after stripping "/api" base — middleware strips it already
          const method = (req.method ?? "GET").toUpperCase();

          // GET /events  -> SSE stream
          if (method === "GET" && parts[0] === "events") {
            res.setHeader("Content-Type", "text/event-stream");
            res.setHeader("Cache-Control", "no-cache");
            res.setHeader("Connection", "keep-alive");
            res.write("retry: 2000\n\n");
            sseClients.add(res);
            req.on("close", () => sseClients.delete(res));
            return;
          }

          // GET /projects
          if (method === "GET" && parts[0] === "projects" && parts.length === 1) {
            const entries = await fs.readdir(root, { withFileTypes: true }).catch(() => []);
            return json(res, 200, entries.filter((e) => e.isDirectory()).map((e) => e.name));
          }

          // GET /projects/:name
          if (method === "GET" && parts[0] === "projects" && parts.length === 2) {
            validateName(parts[1]);
            const projectDir = safeJoin(parts[1]);
            const projectRaw = await fs.readFile(path.join(projectDir, "project.json"), "utf8");
            const paletteRaw = await fs.readFile(path.join(projectDir, "palette.json"), "utf8").catch(() => "{}");
            const project = projectSchema.parse(JSON.parse(projectRaw));
            const palette = paletteFileSchema.safeParse(JSON.parse(paletteRaw));
            const spriteFiles = await fs
              .readdir(path.join(projectDir, "sprites"))
              .catch(() => [] as string[]);
            const spriteNames = spriteFiles
              .filter((f) => f.endsWith(".sprite.json"))
              .map((f) => f.replace(".sprite.json", ""));
            return json(res, 200, {
              project,
              palette: palette.success ? palette.data : { schemaVersion: 1, colors: [] },
              spriteNames,
            });
          }

          // GET /projects/:name/sprites/:sprite
          if (method === "GET" && parts[0] === "projects" && parts[2] === "sprites" && parts.length === 4) {
            validateName(parts[1]);
            validateName(parts[3]);
            const file = safeJoin(parts[1], "sprites", `${parts[3]}.sprite.json`);
            const raw = await fs.readFile(file, "utf8");
            return json(res, 200, JSON.parse(raw));
          }

          // PUT /projects/:name/sprites/:sprite
          if (method === "PUT" && parts[0] === "projects" && parts[2] === "sprites" && parts.length === 4) {
            validateName(parts[1]);
            validateName(parts[3]);
            const body = await readBody(req);
            const parsed = validateSprite(JSON.parse(body));
            if (!parsed.sprite) return json(res, 400, { issues: parsed.issues });
            const jsonPath = safeJoin(parts[1], "sprites", `${parts[3]}.sprite.json`);
            const pngPath = safeJoin(parts[1], "sprites", `${parts[3]}.png`);
            await fs.writeFile(jsonPath, JSON.stringify(parsed.sprite, null, 2) + "\n");
            await writeSpritePng(parsed.sprite, pngPath);
            return json(res, 200, { ok: true });
          }

          // POST /projects/:name/sprites
          if (method === "POST" && parts[0] === "projects" && parts[2] === "sprites" && parts.length === 3) {
            validateName(parts[1]);
            const body = await readBody(req);
            const parsed = validateSprite(JSON.parse(body));
            if (!parsed.sprite) return json(res, 400, { issues: parsed.issues });
            validateName(parsed.sprite.name);
            const jsonPath = safeJoin(parts[1], "sprites", `${parsed.sprite.name}.sprite.json`);
            const pngPath = safeJoin(parts[1], "sprites", `${parsed.sprite.name}.png`);
            await fs.mkdir(path.dirname(jsonPath), { recursive: true });
            await fs.writeFile(jsonPath, JSON.stringify(parsed.sprite, null, 2) + "\n");
            await writeSpritePng(parsed.sprite, pngPath);
            return json(res, 201, { ok: true });
          }

          // PUT /projects/:name/palette
          if (method === "PUT" && parts[0] === "projects" && parts[2] === "palette" && parts.length === 3) {
            validateName(parts[1]);
            const body = await readBody(req);
            const parsed = paletteFileSchema.parse(JSON.parse(body));
            const file = safeJoin(parts[1], "palette.json");
            await fs.writeFile(file, JSON.stringify(parsed, null, 2) + "\n");
            return json(res, 200, { ok: true });
          }

          // PUT /projects/:name (project.json)
          if (method === "PUT" && parts[0] === "projects" && parts.length === 2) {
            validateName(parts[1]);
            const body = await readBody(req);
            const parsed = projectSchema.parse(JSON.parse(body));
            const file = safeJoin(parts[1], "project.json");
            await fs.writeFile(file, JSON.stringify(parsed, null, 2) + "\n");
            return json(res, 200, { ok: true });
          }

          next();
        } catch (err) {
          json(res, 500, { error: (err as Error).message });
        }
      });
    },
  };
}

async function writeSpritePng(sprite: ReturnType<typeof validateSprite>["sprite"] & object, file: string) {
  // First frame as the preview PNG.
  const frame = sprite.frames[0];
  const bytes = decodeFrameToBytes(frame, sprite.width, sprite.height, sprite.palette);
  const rgba = Buffer.alloc(sprite.width * sprite.height * 4);
  const paletteRgb = sprite.palette.map((p) => hexToRgb(p.hex));
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
    .toFile(file);
}
