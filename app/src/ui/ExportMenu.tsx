import { useSpriteStore } from "../state/spriteStore";
import { useProjectStore } from "../state/projectStore";
import { useEditorStore } from "../state/editorStore";
import { hexToRgb } from "../lib/color";
import { TRANSPARENT } from "../lib/pixels";
import { Tip } from "./Tooltip";

export function ExportMenu() {
  const width = useSpriteStore((s) => s.width);
  const height = useSpriteStore((s) => s.height);
  const palette = useSpriteStore((s) => s.palette);
  const frameBytes = useSpriteStore((s) => s.frameBytes);
  const frameNames = useSpriteStore((s) => s.frameNames);
  const spriteName = useSpriteStore((s) => s.spriteName);
  const projectName = useProjectStore((s) => s.projectName);
  const currentFrame = useEditorStore((s) => s.currentFrame);

  if (!spriteName || width === 0) return null;

  const exportFrame = async (i: number) => {
    const blob = await framesToPngBlob([frameBytes[i]], width, height, palette);
    download(blob, `${projectName ?? "project"}_${spriteName}_${frameNames[i]}.png`);
  };

  const exportAllFrames = async () => {
    for (let i = 0; i < frameBytes.length; i++) {
      await exportFrame(i);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: 12, borderTop: "1px solid #2e2e34" }}>
      <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1, color: "#888" }}>
        Export
      </div>
      <Tip tip="Download the current frame as a transparent PNG (pixel-perfect, no smoothing).">
        <button onClick={() => exportFrame(currentFrame)} style={menuBtn}>
          Current frame → PNG
        </button>
      </Tip>
      <Tip tip="Download every frame as separate PNG files.">
        <button onClick={exportAllFrames} style={menuBtn}>
          All frames → PNGs
        </button>
      </Tip>
    </div>
  );
}

const menuBtn: React.CSSProperties = {
  background: "#2a2a2f",
  color: "#ddd",
  border: "1px solid #444",
  padding: "6px 10px",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: 11,
  textAlign: "left",
};

async function framesToPngBlob(
  frames: Uint8Array[],
  width: number,
  height: number,
  palette: { hex: string }[],
): Promise<Blob> {
  const totalWidth = width * frames.length;
  const canvas = document.createElement("canvas");
  canvas.width = totalWidth;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const paletteRgb = palette.map((c) => hexToRgb(c.hex));
  const img = ctx.createImageData(totalWidth, height);
  for (let f = 0; f < frames.length; f++) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const src = frames[f][y * width + x];
        const dst = (y * totalWidth + (f * width + x)) * 4;
        if (src === TRANSPARENT) {
          img.data[dst + 3] = 0;
        } else {
          const [r, g, b] = paletteRgb[src] ?? [0, 0, 0];
          img.data[dst] = r;
          img.data[dst + 1] = g;
          img.data[dst + 2] = b;
          img.data[dst + 3] = 255;
        }
      }
    }
  }
  ctx.putImageData(img, 0, 0);
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b!), "image/png"));
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
