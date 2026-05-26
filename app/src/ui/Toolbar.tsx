import { useEditorStore, type Tool } from "../state/editorStore";
import { useSpriteStore } from "../state/spriteStore";
import { Tip } from "./Tooltip";

const tools: { id: Tool; label: string; tip: string }[] = [
  { id: "pencil", label: "Pencil", tip: "Pencil — paint single pixels with the active color." },
  { id: "eraser", label: "Eraser", tip: "Eraser — set pixels to transparent." },
  { id: "eyedropper", label: "Eyedropper", tip: "Eyedropper — sample a pixel's color and make it active." },
  { id: "fill", label: "Fill", tip: "Bucket fill — flood-fill the connected same-color region." },
  { id: "hitbox", label: "Hitbox", tip: "Click and drag on the canvas to define the sprite's hitbox rectangle." },
];

export function Toolbar() {
  const tool = useEditorStore((s) => s.tool);
  const setTool = useEditorStore((s) => s.setTool);
  const mirrorX = useEditorStore((s) => s.mirrorX);
  const toggleMirrorX = useEditorStore((s) => s.toggleMirrorX);
  const onionSkin = useEditorStore((s) => s.onionSkin);
  const toggleOnionSkin = useEditorStore((s) => s.toggleOnionSkin);
  const showBoundingBox = useEditorStore((s) => s.showBoundingBox);
  const toggleBoundingBox = useEditorStore((s) => s.toggleBoundingBox);
  const showHitbox = useEditorStore((s) => s.showHitbox);
  const toggleHitbox = useEditorStore((s) => s.toggleHitbox);
  const showGrid = useEditorStore((s) => s.showGrid);
  const toggleGrid = useEditorStore((s) => s.toggleGrid);
  const undo = useSpriteStore((s) => s.undo);
  const redo = useSpriteStore((s) => s.redo);
  const undoCount = useSpriteStore((s) => s.undoStack.length);
  const redoCount = useSpriteStore((s) => s.redoStack.length);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: 12 }}>
      <Section title="Tools">
        {tools.map((t) => (
          <Tip key={t.id} tip={t.tip}>
            <ToolButton active={tool === t.id} onClick={() => setTool(t.id)}>
              {t.label}
            </ToolButton>
          </Tip>
        ))}
      </Section>

      <Section title="Modes">
        <Tip tip="Mirror X — paint mirrored on the horizontal axis to maintain left/right symmetry.">
          <ToggleButton active={mirrorX} onClick={toggleMirrorX}>Mirror X</ToggleButton>
        </Tip>
        <Tip tip="Onion skin — show the previous frame faintly underneath to align animation.">
          <ToggleButton active={onionSkin} onClick={toggleOnionSkin}>Onion Skin</ToggleButton>
        </Tip>
      </Section>

      <Section title="Overlays">
        <Tip tip="Bounding box — the auto-fit rectangle around all non-transparent pixels (cyan).">
          <ToggleButton active={showBoundingBox} onClick={toggleBoundingBox}>Bounding Box</ToggleButton>
        </Tip>
        <Tip tip="Hitbox — the gameplay collision rectangle stored in the sprite file (red).">
          <ToggleButton active={showHitbox} onClick={toggleHitbox}>Hitbox</ToggleButton>
        </Tip>
        <Tip tip="Pixel grid — light grid lines between pixels at high zoom.">
          <ToggleButton active={showGrid} onClick={toggleGrid}>Grid</ToggleButton>
        </Tip>
      </Section>

      <Section title="History">
        <Tip tip="Undo (Ctrl/Cmd+Z)">
          <ToolButton onClick={undo} disabled={undoCount === 0}>↶ Undo ({undoCount})</ToolButton>
        </Tip>
        <Tip tip="Redo (Ctrl/Cmd+Shift+Z or Ctrl/Cmd+Y)">
          <ToolButton onClick={redo} disabled={redoCount === 0}>↷ Redo ({redoCount})</ToolButton>
        </Tip>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: "#888" }}>{title}</div>
      {children}
    </div>
  );
}

function ToolButton({
  active,
  disabled,
  onClick,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: active ? "#3850a8" : "#2a2a2f",
        color: disabled ? "#666" : "#ddd",
        border: `1px solid ${active ? "#5070d0" : "#444"}`,
        padding: "6px 10px",
        borderRadius: 4,
        cursor: disabled ? "not-allowed" : "pointer",
        textAlign: "left",
        fontSize: 12,
      }}
    >
      {children}
    </button>
  );
}

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? "#2d4a2d" : "#2a2a2f",
        color: "#ddd",
        border: `1px solid ${active ? "#4a8a4a" : "#444"}`,
        padding: "6px 10px",
        borderRadius: 4,
        cursor: "pointer",
        textAlign: "left",
        fontSize: 12,
      }}
    >
      {active ? "✓ " : "  "}
      {children}
    </button>
  );
}
