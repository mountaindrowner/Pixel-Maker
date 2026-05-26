import { useEffect } from "react";
import { TopBar } from "./ui/TopBar";
import { Toolbar } from "./ui/Toolbar";
import { PalettePanel } from "./ui/PalettePanel";
import { FrameStrip } from "./ui/FrameStrip";
import { MetadataPanel } from "./ui/MetadataPanel";
import { ExportMenu } from "./ui/ExportMenu";
import { CanvasViewport } from "./canvas/CanvasViewport";
import { useSpriteStore } from "./state/spriteStore";
import { useProjectStore } from "./state/projectStore";
import { subscribeFsEvents, loadSprite, loadProject } from "./lib/api";

export function App() {
  const spriteName = useSpriteStore((s) => s.spriteName);
  const loadSpriteIntoStore = useSpriteStore((s) => s.loadSprite);
  const recomputeBoundingBox = useSpriteStore((s) => s.recomputeBoundingBox);
  const projectName = useProjectStore((s) => s.projectName);
  const setProjectData = useProjectStore((s) => s.setProjectData);

  // SSE: refresh on filesystem changes from Claude (or another tool).
  useEffect(() => {
    if (!projectName) return;
    const unsub = subscribeFsEvents(async (e) => {
      const rel = e.path.replaceAll("\\", "/");
      if (!rel.startsWith(`${projectName}/`)) return;
      // Reload the sprite list and palette when anything in the project changes.
      try {
        const bundle = await loadProject(projectName);
        setProjectData({ name: projectName, ...bundle });
      } catch {}
      // If the currently-open sprite was written, reload its pixels.
      if (spriteName && rel.endsWith(`${spriteName}.sprite.json`) && (e.event === "change" || e.event === "add")) {
        try {
          const sprite = await loadSprite(projectName, spriteName);
          loadSpriteIntoStore(sprite, spriteName);
          recomputeBoundingBox();
        } catch {}
      }
    });
    return unsub;
  }, [projectName, spriteName, setProjectData, loadSpriteIntoStore, recomputeBoundingBox]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#16161a", color: "#ddd", fontFamily: "system-ui, sans-serif" }}>
      <TopBar />
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <div
          style={{
            width: 240,
            background: "#1c1c20",
            borderRight: "1px solid #2e2e34",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Toolbar />
          <PalettePanel />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          {spriteName ? <CanvasViewport /> : <EmptyState />}
        </div>

        <div
          style={{
            width: 260,
            background: "#1c1c20",
            borderLeft: "1px solid #2e2e34",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <FrameStrip />
          <MetadataPanel />
          <ExportMenu />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        gap: 12,
        color: "#666",
        fontSize: 14,
      }}
    >
      <div style={{ fontSize: 48 }}>◧</div>
      <div>Pick a project, then a sprite, to start editing.</div>
      <div style={{ fontSize: 11, color: "#555", maxWidth: 460, textAlign: "center" }}>
        Sprites live in <code style={{ fontFamily: "monospace", color: "#888" }}>/projects/&lt;name&gt;/sprites/</code>{" "}
        as <code style={{ fontFamily: "monospace", color: "#888" }}>.sprite.json</code> + <code style={{ fontFamily: "monospace", color: "#888" }}>.png</code> pairs.
        Have Claude write new sprites directly into that folder.
      </div>
    </div>
  );
}
