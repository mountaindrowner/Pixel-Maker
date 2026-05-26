import { useEffect, useMemo, useRef, useState } from "react";
import { useSpriteStore } from "../state/spriteStore";
import { useEditorStore } from "../state/editorStore";
import { hexToRgb } from "../lib/color";
import { TRANSPARENT } from "../lib/pixels";
import { Tip } from "./Tooltip";

const THUMB_SIZE = 64;

export function FrameStrip() {
  const width = useSpriteStore((s) => s.width);
  const height = useSpriteStore((s) => s.height);
  const palette = useSpriteStore((s) => s.palette);
  const frameBytes = useSpriteStore((s) => s.frameBytes);
  const frameNames = useSpriteStore((s) => s.frameNames);
  const frameVersion = useSpriteStore((s) => s.frameVersion);
  const fps = useSpriteStore((s) => s.fps);
  const setFps = useSpriteStore((s) => s.setFps);
  const addFrame = useSpriteStore((s) => s.addFrame);
  const removeFrame = useSpriteStore((s) => s.removeFrame);
  const duplicateFrame = useSpriteStore((s) => s.duplicateFrame);
  const currentFrame = useEditorStore((s) => s.currentFrame);
  const setCurrentFrame = useEditorStore((s) => s.setCurrentFrame);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing || frameBytes.length <= 1) return;
    const interval = 1000 / Math.max(1, fps);
    const id = window.setInterval(() => {
      setCurrentFrame((useEditorStore.getState().currentFrame + 1) % frameBytes.length);
    }, interval);
    return () => window.clearInterval(id);
  }, [playing, fps, frameBytes.length, setCurrentFrame]);

  if (frameBytes.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 12, borderTop: "1px solid #2e2e34" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: "#888" }}>
          Frames ({frameBytes.length})
        </div>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <Tip tip="Frames per second for play preview">
            <label style={{ fontSize: 11, color: "#aaa", display: "flex", alignItems: "center", gap: 4 }}>
              FPS
              <input
                type="number"
                min={1}
                max={30}
                value={fps}
                onChange={(e) => setFps(Math.max(1, Math.min(30, +e.target.value || 1)))}
                style={{ width: 44, background: "#1a1a1d", color: "#ddd", border: "1px solid #444", padding: "2px 4px", borderRadius: 3, fontSize: 11 }}
              />
            </label>
          </Tip>
          <Tip tip={playing ? "Pause animation preview" : "Play animation preview"}>
            <button
              onClick={() => setPlaying(!playing)}
              style={{
                background: playing ? "#a83838" : "#3850a8",
                color: "#fff",
                border: "1px solid #555",
                padding: "4px 10px",
                borderRadius: 3,
                cursor: "pointer",
                fontSize: 11,
              }}
            >
              {playing ? "Pause" : "Play"}
            </button>
          </Tip>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4 }}>
        {frameBytes.map((bytes, i) => (
          <FrameThumb
            key={i}
            bytes={bytes}
            width={width}
            height={height}
            palette={palette}
            name={frameNames[i]}
            index={i}
            active={currentFrame === i}
            onClick={() => setCurrentFrame(i)}
            onDuplicate={() => duplicateFrame(i)}
            onDelete={() => {
              if (frameBytes.length === 1) return;
              removeFrame(i);
              if (currentFrame >= frameBytes.length - 1) setCurrentFrame(Math.max(0, currentFrame - 1));
            }}
            version={frameVersion}
          />
        ))}
        <Tip tip="Add a new blank frame at the end of the strip.">
          <button
            onClick={() => {
              addFrame();
              setCurrentFrame(frameBytes.length);
            }}
            style={{
              width: THUMB_SIZE,
              height: THUMB_SIZE,
              flexShrink: 0,
              background: "#2a2a2f",
              color: "#888",
              border: "2px dashed #555",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 24,
            }}
          >
            +
          </button>
        </Tip>
      </div>
    </div>
  );
}

function FrameThumb({
  bytes,
  width,
  height,
  palette,
  name,
  index,
  active,
  onClick,
  onDuplicate,
  onDelete,
  version,
}: {
  bytes: Uint8Array;
  width: number;
  height: number;
  palette: { id: string; hex: string }[];
  name: string;
  index: number;
  active: boolean;
  onClick: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  version: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paletteRgb = useMemo(() => palette.map((p) => hexToRgb(p.hex)), [palette]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width === 0 || height === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const off = document.createElement("canvas");
    off.width = width;
    off.height = height;
    const offCtx = off.getContext("2d");
    if (!offCtx) return;
    const img = offCtx.createImageData(width, height);
    for (let i = 0; i < bytes.length; i++) {
      const idx = bytes[i];
      if (idx === TRANSPARENT) {
        img.data[i * 4 + 3] = 0;
      } else {
        const [r, g, b] = paletteRgb[idx] ?? [0, 0, 0];
        img.data[i * 4] = r;
        img.data[i * 4 + 1] = g;
        img.data[i * 4 + 2] = b;
        img.data[i * 4 + 3] = 255;
      }
    }
    offCtx.putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, THUMB_SIZE, THUMB_SIZE);
    // Draw checkerboard background.
    ctx.fillStyle = "#1a1a1d";
    ctx.fillRect(0, 0, THUMB_SIZE, THUMB_SIZE);
    ctx.fillStyle = "#26262b";
    for (let y = 0; y < THUMB_SIZE; y += 4) {
      for (let x = 0; x < THUMB_SIZE; x += 4) {
        if (((x / 4) + (y / 4)) % 2 === 0) ctx.fillRect(x, y, 4, 4);
      }
    }
    const scale = Math.min(THUMB_SIZE / width, THUMB_SIZE / height);
    const dw = width * scale;
    const dh = height * scale;
    ctx.drawImage(off, (THUMB_SIZE - dw) / 2, (THUMB_SIZE - dh) / 2, dw, dh);
  }, [bytes, width, height, paletteRgb, version]);

  return (
    <div
      onClick={onClick}
      style={{
        flexShrink: 0,
        position: "relative",
        width: THUMB_SIZE,
        height: THUMB_SIZE,
        border: `2px solid ${active ? "#3850a8" : "#444"}`,
        borderRadius: 4,
        cursor: "pointer",
        background: "#000",
      }}
      title={name}
    >
      <canvas ref={canvasRef} width={THUMB_SIZE} height={THUMB_SIZE} style={{ display: "block" }} />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          background: "rgba(0,0,0,0.6)",
          color: "#ddd",
          padding: "0 4px",
          fontSize: 9,
          fontFamily: "monospace",
        }}
      >
        {index + 1}
      </div>
      <div style={{ position: "absolute", bottom: 0, right: 0, display: "flex", gap: 2 }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          title="Duplicate frame"
          style={{
            background: "rgba(0,0,0,0.7)",
            color: "#ddd",
            border: "none",
            padding: "0 4px",
            fontSize: 10,
            cursor: "pointer",
          }}
        >
          ⧉
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Delete frame"
          style={{
            background: "rgba(120,0,0,0.7)",
            color: "#ddd",
            border: "none",
            padding: "0 4px",
            fontSize: 10,
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
