import { useEffect, useRef } from "react";
import { useSpriteStore } from "../state/spriteStore";
import { useEditorStore } from "../state/editorStore";

interface Props {
  viewWidth: number;
  viewHeight: number;
  hoverPixel: { x: number; y: number } | null;
  hitboxDraft: { x: number; y: number; w: number; h: number } | null;
}

export function OverlayCanvas({ viewWidth, viewHeight, hoverPixel, hitboxDraft }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const width = useSpriteStore((s) => s.width);
  const height = useSpriteStore((s) => s.height);
  const boundingBox = useSpriteStore((s) => s.boundingBox);
  const hitbox = useSpriteStore((s) => s.hitbox);
  const anchor = useSpriteStore((s) => s.anchor);
  const zoom = useEditorStore((s) => s.zoom);
  const panX = useEditorStore((s) => s.panX);
  const panY = useEditorStore((s) => s.panY);
  const showBoundingBox = useEditorStore((s) => s.showBoundingBox);
  const showHitbox = useEditorStore((s) => s.showHitbox);
  const showGrid = useEditorStore((s) => s.showGrid);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, viewWidth, viewHeight);

    if (width === 0 || height === 0) return;

    ctx.save();
    ctx.translate(panX, panY);

    // Outline of the sprite canvas.
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, width * zoom, height * zoom);

    // Grid at zoom >= 6.
    if (showGrid && zoom >= 6) {
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 1; x < width; x++) {
        ctx.moveTo(x * zoom, 0);
        ctx.lineTo(x * zoom, height * zoom);
      }
      for (let y = 1; y < height; y++) {
        ctx.moveTo(0, y * zoom);
        ctx.lineTo(width * zoom, y * zoom);
      }
      ctx.stroke();
    }

    // Bounding box.
    if (showBoundingBox && boundingBox) {
      ctx.strokeStyle = "#34d4e8";
      ctx.lineWidth = 2;
      ctx.strokeRect(boundingBox.x * zoom, boundingBox.y * zoom, boundingBox.w * zoom, boundingBox.h * zoom);
    }

    // Hitbox.
    const hb = hitboxDraft ?? hitbox;
    if (showHitbox && hb) {
      ctx.strokeStyle = "#ff5566";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(hb.x * zoom, hb.y * zoom, hb.w * zoom, hb.h * zoom);
      ctx.setLineDash([]);
    }

    // Anchor crosshair.
    if (anchor) {
      const ax = anchor.x * zoom;
      const ay = anchor.y * zoom;
      ctx.strokeStyle = "#ffd76b";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(ax - 5, ay);
      ctx.lineTo(ax + 5, ay);
      ctx.moveTo(ax, ay - 5);
      ctx.lineTo(ax, ay + 5);
      ctx.stroke();
    }

    // Hover pixel preview.
    if (hoverPixel) {
      ctx.strokeStyle = "rgba(255,255,255,0.85)";
      ctx.lineWidth = 1;
      ctx.strokeRect(hoverPixel.x * zoom + 0.5, hoverPixel.y * zoom + 0.5, zoom - 1, zoom - 1);
    }

    ctx.restore();
  }, [width, height, zoom, panX, panY, boundingBox, hitbox, anchor, hoverPixel, hitboxDraft, showBoundingBox, showHitbox, showGrid, viewWidth, viewHeight]);

  return (
    <canvas
      ref={canvasRef}
      width={viewWidth}
      height={viewHeight}
      style={{ position: "absolute", inset: 0, display: "block", pointerEvents: "none" }}
    />
  );
}
