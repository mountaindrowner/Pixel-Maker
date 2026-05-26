import { useSpriteStore } from "../state/spriteStore";
import { Tip } from "./Tooltip";

export function MetadataPanel() {
  const boundingBox = useSpriteStore((s) => s.boundingBox);
  const hitbox = useSpriteStore((s) => s.hitbox);
  const anchor = useSpriteStore((s) => s.anchor);
  const setHitbox = useSpriteStore((s) => s.setHitbox);
  const width = useSpriteStore((s) => s.width);
  const height = useSpriteStore((s) => s.height);

  if (width === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 12, borderTop: "1px solid #2e2e34" }}>
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: "#888" }}>
        Metadata
      </div>

      <Tip tip="Bounding box: tightest rectangle around non-transparent pixels. Auto-recomputed on each edit.">
        <Row label="Bounding" value={boundingBox ? `${boundingBox.x},${boundingBox.y} → ${boundingBox.w}×${boundingBox.h}` : "—"} />
      </Tip>

      <Tip tip="Hitbox: gameplay collision rectangle. Use the Hitbox tool to drag-define on the canvas.">
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <Row label="Hitbox" value={hitbox ? `${hitbox.x},${hitbox.y} → ${hitbox.w}×${hitbox.h}` : "—"} />
          {hitbox && (
            <button
              onClick={() => setHitbox(null)}
              style={{
                background: "#2a2a2f",
                color: "#aaa",
                border: "1px solid #444",
                padding: "4px 8px",
                borderRadius: 3,
                cursor: "pointer",
                fontSize: 11,
                alignSelf: "flex-start",
              }}
            >
              Clear hitbox
            </button>
          )}
        </div>
      </Tip>

      <Tip tip="Anchor point: the sprite's origin pixel for in-game positioning. Auto-set to bottom-center of bounding box.">
        <Row label="Anchor" value={anchor ? `${anchor.x},${anchor.y}` : "auto"} />
      </Tip>

      <Tip tip="Canvas dimensions (fixed at sprite creation).">
        <Row label="Canvas" value={`${width}×${height}`} />
      </Tip>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#ccc" }}>
      <span style={{ color: "#888" }}>{label}</span>
      <span style={{ fontFamily: "monospace" }}>{value}</span>
    </div>
  );
}
