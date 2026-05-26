import { useEffect, useState } from "react";
import { useProjectStore } from "../state/projectStore";
import { useSpriteStore } from "../state/spriteStore";
import { useEditorStore } from "../state/editorStore";
import { listProjects, loadProject, loadSprite, saveSprite } from "../lib/api";
import { Tip } from "./Tooltip";

export function TopBar() {
  const [projects, setProjects] = useState<string[]>([]);
  const projectName = useProjectStore((s) => s.projectName);
  const spriteName = useSpriteStore((s) => s.spriteName);
  const spriteNames = useProjectStore((s) => s.spriteNames);
  const setProjectData = useProjectStore((s) => s.setProjectData);
  const loadSpriteIntoStore = useSpriteStore((s) => s.loadSprite);
  const clearSprite = useSpriteStore((s) => s.clearSprite);
  const toSprite = useSpriteStore((s) => s.toSprite);
  const recomputeBoundingBox = useSpriteStore((s) => s.recomputeBoundingBox);
  const saving = useEditorStore((s) => s.saving);
  const setSaving = useEditorStore((s) => s.setSaving);
  const dirty = useEditorStore((s) => s.dirty);
  const setDirty = useEditorStore((s) => s.setDirty);
  const undoStackLen = useSpriteStore((s) => s.undoStack.length);

  // Mark dirty when undo stack grows beyond the loaded baseline.
  useEffect(() => {
    setDirty(undoStackLen > 0);
  }, [undoStackLen, setDirty]);

  useEffect(() => {
    listProjects().then(setProjects).catch(console.error);
  }, []);

  const openProject = async (name: string) => {
    const bundle = await loadProject(name);
    setProjectData({ name, ...bundle });
    clearSprite();
    if (bundle.spriteNames.length > 0) {
      openSprite(name, bundle.spriteNames[0]);
    }
  };

  const openSprite = async (proj: string, spr: string) => {
    const sprite = await loadSprite(proj, spr);
    loadSpriteIntoStore(sprite, spr);
    recomputeBoundingBox();
    setDirty(false);
  };

  const save = async () => {
    if (!projectName) return;
    const sprite = toSprite();
    if (!sprite) return;
    setSaving(true);
    try {
      await saveSprite(projectName, sprite);
      setDirty(false);
    } catch (e) {
      alert(`Save failed: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  // Cmd/Ctrl+S keyboard shortcut.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const meta = e.ctrlKey || e.metaKey;
      if (meta && e.key.toLowerCase() === "s") {
        e.preventDefault();
        save();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [projectName, toSprite, setSaving, setDirty]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "8px 12px",
        background: "#212126",
        borderBottom: "1px solid #2e2e34",
      }}
    >
      <div style={{ fontWeight: 700, color: "#ffd76b", fontFamily: "monospace" }}>Pixel Maker</div>

      <Tip tip="Pick a project folder from /projects/ to load its palette and sprites.">
        <Select
          value={projectName ?? ""}
          onChange={(v) => v && openProject(v)}
          options={projects}
          placeholder="select project…"
        />
      </Tip>

      {projectName && (
        <Tip tip="Pick a sprite to edit.">
          <Select
            value={spriteName ?? ""}
            onChange={(v) => v && openSprite(projectName, v)}
            options={spriteNames}
            placeholder="select sprite…"
          />
        </Tip>
      )}

      <div style={{ flex: 1 }} />

      {spriteName && (
        <>
          <span style={{ fontSize: 11, color: dirty ? "#ffaa66" : "#888", fontFamily: "monospace" }}>
            {saving ? "saving…" : dirty ? "● unsaved" : "saved"}
          </span>
          <Tip tip="Save sprite to disk (writes .sprite.json and regenerates .png). Cmd/Ctrl+S.">
            <button
              onClick={save}
              disabled={saving}
              style={{
                background: "#3850a8",
                color: "#fff",
                border: "1px solid #5070d0",
                padding: "6px 14px",
                borderRadius: 4,
                cursor: saving ? "wait" : "pointer",
                fontSize: 12,
              }}
            >
              Save
            </button>
          </Tip>
        </>
      )}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        background: "#1a1a1d",
        color: "#ddd",
        border: "1px solid #444",
        padding: "4px 8px",
        borderRadius: 3,
        fontSize: 12,
        fontFamily: "monospace",
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
