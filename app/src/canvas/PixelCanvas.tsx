import { useEffect, useRef } from "react";
import { useSpriteStore } from "../state/spriteStore";
import { useEditorStore } from "../state/editorStore";
import { hexToRgb } from "../lib/color";
import { TRANSPARENT } from "../lib/pixels";

interface Props {
  viewWidth: number;
  viewHeight: number;
}

/**
 * Renders the active frame into an offscreen canvas at 1:1 then blits it
 * scaled by `zoom` onto the visible canvas with nearest-neighbor scaling.
 */
export function PixelCanvas({ viewWidth, viewHeight }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);

  const width = useSpriteStore((s) => s.width);
  const height = useSpriteStore((s) => s.height);
  const palette = useSpriteStore((s) => s.palette);
  const frameBytes = useSpriteStore((s) => s.frameBytes);
  const frameVersion = useSpriteStore((s) => s.frameVersion);
  const currentFrame = useEditorStore((s) => s.currentFrame);
  const onionSkin = useEditorStore((s) => s.onionSkin);
  const zoom = useEditorStore((s) => s.zoom);
  const panX = useEditorStore((s) => s.panX);
  const panY = useEditorStore((s) => s.panY);

  // Maintain an offscreen canvas sized to the sprite.
  useEffect(() => {
    if (width === 0 || height === 0) return;
    const off = document.createElement("canvas");
    off.width = width;
    off.height = height;
    offscreenRef.current = off;
  }, [width, height]);

  // Render the active (and onion-skin) frame.
  useEffect(() => {
    const canvas = canvasRef.current;
    const off = offscreenRef.current;
    if (!canvas || !off || width === 0 || height === 0) return;
    const ctx = canvas.getContext("2d");
    const offCtx = off.getContext("2d");
    if (!ctx || !offCtx) return;

    const paletteRgb = palette.map((p) => hexToRgb(p.hex));

    const renderFrame = (bytes: Uint8Array, alpha: number) => {
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
          img.data[i * 4 + 3] = Math.round(255 * alpha);
        }
      }
      offCtx.putImageData(img, 0, 0);
    };

    // Clear the visible canvas with the transparent checkerboard.
    drawCheckerboard(ctx, viewWidth, viewHeight);

    ctx.imageSmoothingEnabled = false;
    ctx.save();
    ctx.translate(panX, panY);
    ctx.scale(zoom, zoom);

    // Onion skin previous frame underneath.
    if (onionSkin && currentFrame > 0 && frameBytes[currentFrame - 1]) {
      renderFrame(frameBytes[currentFrame - 1], 0.35);
      ctx.drawImage(off, 0, 0);
    }

    // Active frame.
    const active = frameBytes[currentFrame];
    if (active) {
      renderFrame(active, 1);
      ctx.drawImage(off, 0, 0);
    }

    ctx.restore();
  }, [width, height, palette, frameBytes, frameVersion, currentFrame, onionSkin, zoom, panX, panY, viewWidth, viewHeight]);

  return (
    <canvas
      ref={canvasRef}
      width={viewWidth}
      height={viewHeight}
      style={{ position: "absolute", inset: 0, display: "block", pointerEvents: "none" }}
    />
  );
}

function drawCheckerboard(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = "#1e1e22";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#26262b";
  const size = 8;
  for (let y = 0; y < h; y += size) {
    for (let x = 0; x < w; x += size) {
      if (((x / size) + (y / size)) % 2 === 0) ctx.fillRect(x, y, size, size);
    }
  }
}
