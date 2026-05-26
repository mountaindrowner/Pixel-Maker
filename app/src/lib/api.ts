import type { Project } from "../schema/project";
import type { PaletteFile } from "../schema/palette";
import type { Sprite } from "../schema/sprite";

const base = "/api";

export async function listProjects(): Promise<string[]> {
  const r = await fetch(`${base}/projects`);
  if (!r.ok) throw new Error(`listProjects: ${r.status}`);
  return r.json();
}

export interface ProjectBundle {
  project: Project;
  palette: PaletteFile;
  spriteNames: string[];
}

export async function loadProject(name: string): Promise<ProjectBundle> {
  const r = await fetch(`${base}/projects/${encodeURIComponent(name)}`);
  if (!r.ok) throw new Error(`loadProject: ${r.status}`);
  return r.json();
}

export async function loadSprite(projectName: string, spriteName: string): Promise<Sprite> {
  const r = await fetch(`${base}/projects/${encodeURIComponent(projectName)}/sprites/${encodeURIComponent(spriteName)}`);
  if (!r.ok) throw new Error(`loadSprite: ${r.status}`);
  return r.json();
}

export async function saveSprite(projectName: string, sprite: Sprite): Promise<void> {
  const r = await fetch(
    `${base}/projects/${encodeURIComponent(projectName)}/sprites/${encodeURIComponent(sprite.name)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sprite),
    },
  );
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`saveSprite: ${r.status} ${text}`);
  }
}

export async function savePalette(projectName: string, palette: PaletteFile): Promise<void> {
  const r = await fetch(`${base}/projects/${encodeURIComponent(projectName)}/palette`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(palette),
  });
  if (!r.ok) throw new Error(`savePalette: ${r.status}`);
}

export async function createSprite(projectName: string, sprite: Sprite): Promise<void> {
  const r = await fetch(`${base}/projects/${encodeURIComponent(projectName)}/sprites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sprite),
  });
  if (!r.ok) throw new Error(`createSprite: ${r.status}`);
}

export function subscribeFsEvents(onEvent: (data: { event: string; path: string }) => void): () => void {
  const es = new EventSource(`${base}/events`);
  es.addEventListener("fs", (e) => {
    try {
      onEvent(JSON.parse((e as MessageEvent).data));
    } catch {
      // ignore
    }
  });
  return () => es.close();
}
