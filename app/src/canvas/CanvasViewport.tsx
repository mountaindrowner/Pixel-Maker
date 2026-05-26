import { useEffect, useRef, useState, useCallback } from "react";
import { useSpriteStore } from "../state/spriteStore";
import { useEditorStore } from "../state/editorStore";
import { PixelCanvas } from "./PixelCanvas";
import { OverlayCanvas } from "./OverlayCanvas";
import { TRANSPARENT } from "../lib/pixels";

export function CanvasViewport() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [hoverPixel, setHoverPixel] = useState<{ x: number; y: number } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const lastDrawnRef = useRef<{ x: number; y: number } | null>(null);
  const panStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const hitboxStartRef = useRef<{ x: number; y: number } | null>(null);
  const [hitboxDraft, setHitboxDraft] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const spaceHeldRef = useRef(false);

  const width = useSpriteStore((s) => s.width);
  const height = useSpriteStore((s) => s.height);
  const frameBytes = useSpriteStore((s) => s.frameBytes);
  const palette = useSpriteStore((s) => s.palette);
  const beginEdit = useSpriteStore((s) => s.beginEdit);
  const endEdit = useSpriteStore((s) => s.endEdit);
  const setPixel = useSpriteStore((s) => s.setPixel);
  const floodFill = useSpriteStore((s) => s.floodFill);
  const setHitbox = useSpriteStore((s) => s.setHitbox);
  const undo = useSpriteStore((s) => s.undo);
  const redo = useSpriteStore((s) => s.redo);

  const zoom = useEditorStore((s) => s.zoom);
  const panX = useEditorStore((s) => s.panX);
  const panY = useEditorStore((s) => s.panY);
  const setZoom = useEditorStore((s) => s.setZoom);
  const setPan = useEditorStore((s) => s.setPan);
  const tool = useEditorStore((s) => s.tool);
  const activePaletteId = useEditorStore((s) => s.activePaletteId);
  const setActivePaletteId = useEditorStore((s) => s.setActivePaletteId);
  const currentFrame = useEditorStore((s) => s.currentFrame);
  const mirrorX = useEditorStore((s) => s.mirrorX);

  const fitToView = useCallback(() => {
    if (width === 0 || height === 0 || size.w === 0 || size.h === 0) return;
    const pad = 40;
    const z = Math.max(1, Math.floor(Math.min((size.w - pad) / width, (size.h - pad) / height)));
    setZoom(z);
    setPan(Math.round((size.w - width * z) / 2), Math.round((size.h - height * z) / 2));
  }, [width, height, size.w, size.h, setZoom, setPan]);

  // Observe size of the container.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Auto-fit when sprite changes (width/height change) or container first sized.
  const lastFitKey = useRef<string>("");
  useEffect(() => {
    const key = `${width}x${height}@${size.w}x${size.h}`;
    if (width > 0 && size.w > 0 && lastFitKey.current !== key) {
      lastFitKey.current = key;
      fitToView();
    }
  }, [width, height, size.w, size.h, fitToView]);

  // Keyboard: space (pan), ctrl+z, ctrl+shift+z, ctrl+y.
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === " ") {
        spaceHeldRef.current = true;
        e.preventDefault();
      }
      const meta = e.ctrlKey || e.metaKey;
      if (meta && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      } else if (meta && e.key.toLowerCase() === "y") {
        e.preventDefault();
        redo();
      } else if (e.key === "f" && !meta) {
        fitToView();
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.key === " ") spaceHeldRef.current = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [undo, redo, fitToView]);

  const screenToPixel = (clientX: number, clientY: number): { x: number; y: number } | null => {
    const el = containerRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const x = Math.floor((clientX - r.left - panX) / zoom);
    const y = Math.floor((clientY - r.top - panY) / zoom);
    if (x < 0 || x >= width || y < 0 || y >= height) return null;
    return { x, y };
  };

  const byteForActiveColor = (): number => {
    if (activePaletteId == null) return TRANSPARENT;
    const i = palette.findIndex((p) => p.id === activePaletteId);
    return i >= 0 ? i : TRANSPARENT;
  };

  const drawPixelWithMirror = (frame: number, x: number, y: number, byte: number) => {
    setPixel(frame, x, y, byte);
    if (mirrorX) setPixel(frame, width - 1 - x, y, byte);
  };

  const drawLine = (frame: number, from: { x: number; y: number }, to: { x: number; y: number }, byte: number) => {
    // Bresenham.
    let x0 = from.x;
    let y0 = from.y;
    const x1 = to.x;
    const y1 = to.y;
    const dx = Math.abs(x1 - x0);
    const dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    while (true) {
      drawPixelWithMirror(frame, x0, y0, byte);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        x0 += sx;
      }
      if (e2 <= dx) {
        err += dx;
        y0 += sy;
      }
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button === 1 || (e.button === 0 && (spaceHeldRef.current || tool === undefined))) {
      // Pan
      setIsPanning(true);
      panStartRef.current = { x: e.clientX, y: e.clientY, panX, panY };
      (e.target as Element).setPointerCapture(e.pointerId);
      return;
    }
    if (e.button !== 0) return;
    const px = screenToPixel(e.clientX, e.clientY);
    if (!px) return;

    if (tool === "eyedropper") {
      const idx = frameBytes[currentFrame]?.[px.y * width + px.x];
      if (idx == null || idx === TRANSPARENT) {
        setActivePaletteId(null);
      } else {
        setActivePaletteId(palette[idx]?.id ?? null);
      }
      return;
    }

    if (tool === "fill") {
      const byte = byteForActiveColor();
      beginEdit();
      floodFill(currentFrame, px.x, px.y, byte);
      endEdit();
      return;
    }

    if (tool === "hitbox") {
      hitboxStartRef.current = px;
      setHitboxDraft({ x: px.x, y: px.y, w: 1, h: 1 });
      (e.target as Element).setPointerCapture(e.pointerId);
      setIsDrawing(true);
      return;
    }

    // pencil or eraser
    setIsDrawing(true);
    (e.target as Element).setPointerCapture(e.pointerId);
    beginEdit();
    const byte = tool === "eraser" ? TRANSPARENT : byteForActiveColor();
    drawPixelWithMirror(currentFrame, px.x, px.y, byte);
    lastDrawnRef.current = px;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (isPanning && panStartRef.current) {
      const s = panStartRef.current;
      setPan(s.panX + (e.clientX - s.x), s.panY + (e.clientY - s.y));
      return;
    }

    const px = screenToPixel(e.clientX, e.clientY);
    setHoverPixel(px);

    if (!isDrawing || !px) return;

    if (tool === "hitbox" && hitboxStartRef.current) {
      const start = hitboxStartRef.current;
      const x = Math.min(start.x, px.x);
      const y = Math.min(start.y, px.y);
      const w = Math.abs(px.x - start.x) + 1;
      const h = Math.abs(px.y - start.y) + 1;
      setHitboxDraft({ x, y, w, h });
      return;
    }

    if (tool === "pencil" || tool === "eraser") {
      const byte = tool === "eraser" ? TRANSPARENT : byteForActiveColor();
      const last = lastDrawnRef.current;
      if (last) drawLine(currentFrame, last, px, byte);
      else drawPixelWithMirror(currentFrame, px.x, px.y, byte);
      lastDrawnRef.current = px;
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    (e.target as Element).releasePointerCapture?.(e.pointerId);
    if (isPanning) {
      setIsPanning(false);
      panStartRef.current = null;
      return;
    }
    if (isDrawing) {
      if (tool === "hitbox" && hitboxDraft) {
        setHitbox({ x: hitboxDraft.x, y: hitboxDraft.y, w: hitboxDraft.w, h: hitboxDraft.h });
        setHitboxDraft(null);
        hitboxStartRef.current = null;
      } else {
        endEdit();
      }
      setIsDrawing(false);
      lastDrawnRef.current = null;
    }
  };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const el = containerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const mx = e.clientX - r.left;
    const my = e.clientY - r.top;
    const oldZoom = zoom;
    const factor = e.deltaY < 0 ? 1.25 : 0.8;
    const newZoom = Math.max(1, Math.min(64, Math.round(oldZoom * factor)));
    if (newZoom === oldZoom) return;
    // Zoom toward cursor.
    const worldX = (mx - panX) / oldZoom;
    const worldY = (my - panY) / oldZoom;
    setZoom(newZoom);
    setPan(mx - worldX * newZoom, my - worldY * newZoom);
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={() => setHoverPixel(null)}
      onWheel={onWheel}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#1a1a1d",
        cursor: isPanning || spaceHeldRef.current ? "grab" : "crosshair",
        touchAction: "none",
      }}
    >
      <PixelCanvas viewWidth={size.w} viewHeight={size.h} />
      <OverlayCanvas viewWidth={size.w} viewHeight={size.h} hoverPixel={hoverPixel} hitboxDraft={hitboxDraft} />
      <FitButton onClick={fitToView} />
      <ZoomReadout zoom={zoom} />
    </div>
  );
}

function FitButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title="Fit canvas to view (F)"
      style={{
        position: "absolute",
        top: 8,
        left: 8,
        background: "#2a2a2f",
        color: "#ddd",
        border: "1px solid #444",
        padding: "4px 10px",
        borderRadius: 4,
        fontSize: 12,
        cursor: "pointer",
      }}
    >
      Fit
    </button>
  );
}

function ZoomReadout({ zoom }: { zoom: number }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 8,
        right: 8,
        background: "rgba(0,0,0,0.5)",
        color: "#ddd",
        padding: "2px 8px",
        borderRadius: 4,
        fontSize: 11,
        fontFamily: "monospace",
        pointerEvents: "none",
      }}
    >
      {zoom}x
    </div>
  );
}

