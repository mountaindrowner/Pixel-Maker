import { useState } from "react";
import { useSpriteStore } from "../state/spriteStore";
import { useEditorStore } from "../state/editorStore";
import { useProjectStore } from "../state/projectStore";
import { hexToHsv, hsvToHex, snapTo15Bit } from "../lib/color";
import { Tip } from "./Tooltip";
import { savePalette } from "../lib/api";
import { MAX_PALETTE_SIZE } from "../schema/sprite";

export function PalettePanel() {
  const spritePalette = useSpriteStore((s) => s.palette);
  const setSpritePalette = useSpriteStore((s) => s.setPalette);
  const projectPalette = useProjectStore((s) => s.palette);
  const projectName = useProjectStore((s) => s.projectName);
  const addProjectColor = useProjectStore((s) => s.addColor);
  const activePaletteId = useEditorStore((s) => s.activePaletteId);
  const setActivePaletteId = useEditorStore((s) => s.setActivePaletteId);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 12, borderTop: "1px solid #2e2e34" }}>
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: "#888" }}>
        Active color
      </div>
      <ActiveColorSwatch />

      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: "#888", marginTop: 8 }}>
        Sprite palette ({spritePalette.length}/{MAX_PALETTE_SIZE})
      </div>
      <Tip tip="Click a swatch to set it as the active color. The id char (0-9, a-z) is the file-format reference.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 4 }}>
          <SwatchTransparent
            active={activePaletteId == null}
            onClick={() => setActivePaletteId(null)}
          />
          {spritePalette.map((c) => (
            <Swatch
              key={c.id}
              hex={c.hex}
              label={c.id}
              active={activePaletteId === c.id}
              onClick={() => setActivePaletteId(c.id)}
            />
          ))}
        </div>
      </Tip>

      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: "#888", marginTop: 8 }}>
        Project palette
      </div>
      <Tip tip="Project palette colors not yet in this sprite. Click to add to the sprite palette.">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 4 }}>
          {projectPalette
            .filter((c) => !spritePalette.some((s) => s.hex.toLowerCase() === c.hex.toLowerCase()))
            .map((c) => (
              <Swatch
                key={c.id}
                hex={c.hex}
                label={c.id}
                active={false}
                onClick={() => {
                  // Re-use the id char if free in the sprite palette; otherwise let store assign.
                  const used = new Set(spritePalette.map((s) => s.id));
                  if (!used.has(c.id) && spritePalette.length < MAX_PALETTE_SIZE) {
                    setSpritePalette([...spritePalette, c]);
                    setActivePaletteId(c.id);
                  }
                }}
              />
            ))}
        </div>
      </Tip>

      <ColorAdder
        onAdd={async (hex, name) => {
          const projEntry = addProjectColor(hex, name);
          if (projectName && projEntry) {
            try {
              await savePalette(projectName, {
                schemaVersion: 1,
                colors: [...projectPalette, projEntry],
              });
            } catch (e) {
              console.error(e);
            }
          }
          // Also add to sprite palette if room.
          if (projEntry && spritePalette.length < MAX_PALETTE_SIZE) {
            const used = new Set(spritePalette.map((s) => s.id));
            if (!used.has(projEntry.id)) {
              setSpritePalette([...spritePalette, projEntry]);
              setActivePaletteId(projEntry.id);
            }
          }
        }}
      />
    </div>
  );
}

function ActiveColorSwatch() {
  const palette = useSpriteStore((s) => s.palette);
  const activePaletteId = useEditorStore((s) => s.activePaletteId);
  const entry = activePaletteId ? palette.find((p) => p.id === activePaletteId) : null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 4,
          border: "1px solid #555",
          background: entry?.hex ?? "transparent",
          backgroundImage: entry ? "none" : "linear-gradient(45deg, #444 25%, transparent 25%, transparent 75%, #444 75%), linear-gradient(45deg, #444 25%, transparent 25%, transparent 75%, #444 75%)",
          backgroundSize: "8px 8px",
          backgroundPosition: "0 0, 4px 4px",
        }}
      />
      <div style={{ fontSize: 12, color: "#ccc", fontFamily: "monospace" }}>
        {entry ? `${entry.id}  ${entry.hex}${entry.name ? `  ${entry.name}` : ""}` : "transparent"}
      </div>
    </div>
  );
}

function Swatch({
  hex,
  label,
  active,
  onClick,
}: {
  hex: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={`${label}  ${hex}`}
      style={{
        width: 28,
        height: 28,
        borderRadius: 3,
        border: active ? "2px solid #fff" : "1px solid #444",
        background: hex,
        cursor: "pointer",
        padding: 0,
        position: "relative",
      }}
    >
      <span
        style={{
          position: "absolute",
          bottom: 0,
          right: 2,
          fontSize: 9,
          color: contrastChar(hex),
          fontFamily: "monospace",
          textShadow: "0 0 2px rgba(0,0,0,0.6)",
        }}
      >
        {label}
      </span>
    </button>
  );
}

function SwatchTransparent({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title="transparent  ."
      style={{
        width: 28,
        height: 28,
        borderRadius: 3,
        border: active ? "2px solid #fff" : "1px solid #444",
        backgroundImage: "linear-gradient(45deg, #444 25%, transparent 25%, transparent 75%, #444 75%), linear-gradient(45deg, #444 25%, transparent 25%, transparent 75%, #444 75%)",
        backgroundSize: "8px 8px",
        backgroundPosition: "0 0, 4px 4px",
        cursor: "pointer",
        padding: 0,
        color: "#ddd",
        fontSize: 11,
        fontFamily: "monospace",
      }}
    >
      .
    </button>
  );
}

function contrastChar(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  return lum > 140 ? "#000" : "#fff";
}

function ColorAdder({ onAdd }: { onAdd: (hex: string, name?: string) => void }) {
  const [hex, setHex] = useState("#ff6688");
  const [name, setName] = useState("");
  const snapped = snapTo15Bit(hex);
  const hsv = hexToHsv(hex);
  const [h, setH] = useState(hsv.h);
  const [s, setS] = useState(hsv.s);
  const [v, setV] = useState(hsv.v);

  const apply = (newH: number, newS: number, newV: number) => {
    setH(newH);
    setS(newS);
    setV(newV);
    setHex(hsvToHex(newH, newS, newV));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingTop: 8, borderTop: "1px solid #2e2e34" }}>
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: "#888" }}>
        Add color
      </div>
      <Tip tip="Hue 0–360°">
        <input type="range" min={0} max={359} value={h} onChange={(e) => apply(+e.target.value, s, v)} style={{ width: "100%" }} />
      </Tip>
      <Tip tip="Saturation">
        <input type="range" min={0} max={100} value={s * 100} onChange={(e) => apply(h, +e.target.value / 100, v)} style={{ width: "100%" }} />
      </Tip>
      <Tip tip="Value / brightness">
        <input type="range" min={0} max={100} value={v * 100} onChange={(e) => apply(h, s, +e.target.value / 100)} style={{ width: "100%" }} />
      </Tip>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <div style={{ width: 24, height: 24, border: "1px solid #555", background: hex }} />
        <span style={{ fontSize: 11, fontFamily: "monospace", color: "#888" }}>→</span>
        <Tip tip="15-bit snapped color (5 bits per channel — SNES gamut)">
          <div style={{ width: 24, height: 24, border: "1px solid #555", background: snapped }} />
        </Tip>
        <span style={{ fontSize: 11, fontFamily: "monospace", color: "#aaa" }}>{snapped}</span>
      </div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="optional name (e.g. robe-light)"
        style={{
          background: "#1a1a1d",
          color: "#ddd",
          border: "1px solid #444",
          padding: "4px 6px",
          fontSize: 11,
          borderRadius: 3,
        }}
      />
      <button
        onClick={() => {
          onAdd(snapped, name.trim() || undefined);
          setName("");
        }}
        style={{
          background: "#3850a8",
          color: "#fff",
          border: "1px solid #5070d0",
          padding: "6px",
          borderRadius: 4,
          cursor: "pointer",
          fontSize: 12,
        }}
      >
        Add to project + sprite
      </button>
    </div>
  );
}
