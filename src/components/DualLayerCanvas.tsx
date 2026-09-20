import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  CanvasTheme,
  CompositionGuideMode,
  DrawingLine,
  DrawingTool,
  EraserSize,
  ReferenceTarget,
  ReferenceTransform,
  StrokePoint,
} from '../types';
import { VectorShape } from './VectorShapes';

interface DualLayerCanvasProps {
  lines: DrawingLine[];
  currentLine: DrawingLine | null;
  onStartLine: (point: StrokePoint) => void;
  onAppendPoint: (point: StrokePoint) => void;
  onEndLine: () => void;
  referenceTarget: ReferenceTarget;
  referenceOpacity: number;
  isAdjustingReference: boolean;
  referenceTransform: ReferenceTransform;
  onUpdateTransform: (transform: ReferenceTransform) => void;
  onResetTransform: () => void;
  guideMode?: CompositionGuideMode;
  currentTool?: DrawingTool;
  eraserSize?: EraserSize;
  onEraseStrokes?: (strokeIds: string[]) => void;
  currentTheme?: CanvasTheme;
}

// Helper: Calculate distance squared from point (px, py) to line segment (x1, y1)-(x2, y2)
function distToSegmentSquared(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const l2 = dx * dx + dy * dy;
  if (l2 === 0) {
    const dpx = px - x1;
    const dpy = py - y1;
    return dpx * dpx + dpy * dpy;
  }
  let t = ((px - x1) * dx + (py - y1) * dy) / l2;
  t = Math.max(0, Math.min(1, t));
  const projX = x1 + t * dx;
  const projY = y1 + t * dy;
  const diffX = px - projX;
  const diffY = py - projY;
  return diffX * diffX + diffY * diffY;
}

function strokeIntersectsCircle(
  line: DrawingLine,
  px: number,
  py: number,
  radius: number
): boolean {
  if (line.points.length === 0) return false;
  const hitThreshold = radius + line.lineWidth / 2;
  const hitThresholdSq = hitThreshold * hitThreshold;

  if (line.points.length === 1) {
    const pt = line.points[0];
    const dx = px - pt.x;
    const dy = py - pt.y;
    return dx * dx + dy * dy <= hitThresholdSq;
  }

  for (let i = 1; i < line.points.length; i++) {
    const p1 = line.points[i - 1];
    const p2 = line.points[i];
    const d2 = distToSegmentSquared(px, py, p1.x, p1.y, p2.x, p2.y);
    if (d2 <= hitThresholdSq) {
      return true;
    }
  }
  return false;
}

export const DualLayerCanvas: React.FC<DualLayerCanvasProps> = ({
  lines,
  currentLine,
  onStartLine,
  onAppendPoint,
  onEndLine,
  referenceTarget,
  referenceOpacity,
  isAdjustingReference,
  referenceTransform,
  onUpdateTransform,
  onResetTransform,
  guideMode = 'none',
  currentTool = 'pen',
  eraserSize = 'medium',
  onEraseStrokes,
  currentTheme = 'paper',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [containerDimensions, setContainerDimensions] = useState<{ width: number; height: number }>({
    width: 800,
    height: 600,
  });

  // Eraser cursor position for visual feedback
  const [eraserCursor, setEraserCursor] = useState<{ x: number; y: number } | null>(null);

  // Dragging template state when in adjust mode
  const [isDraggingTemplate, setIsDraggingTemplate] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; initX: number; initY: number }>({
    x: 0,
    y: 0,
    initX: 0,
    initY: 0,
  });

  // Determine eraser radius
  const eraserRadius =
    eraserSize === 'small' ? 16 : eraserSize === 'large' ? 45 : 28;

  // Track canvas container sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerDimensions({
          width: Math.max(rect.width, 300),
          height: Math.max(rect.height, 300),
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Theme configuration for lively kid background & vector stroke color
  const themeConfig = {
    paper: {
      bg: 'bg-[#faf9f5]',
      grid: 'radial-gradient(#d97706 1.2px, transparent 1.2px)',
      gridOpacity: 'opacity-10',
      vectorStroke: '#2563eb', // Royal Blue outline for high contrast on paper
      shadow: 'drop-shadow-[0_0_12px_rgba(37,99,235,0.25)]',
    },
    sunshine: {
      bg: 'bg-[#fffdf2]',
      grid: 'radial-gradient(#eab308 1.4px, transparent 1.4px)',
      gridOpacity: 'opacity-15',
      vectorStroke: '#dc2626', // Crimson Red outline
      shadow: 'drop-shadow-[0_0_12px_rgba(220,38,38,0.25)]',
    },
    blossom: {
      bg: 'bg-[#fdf4f8]',
      grid: 'radial-gradient(#ec4899 1.4px, transparent 1.4px)',
      gridOpacity: 'opacity-12',
      vectorStroke: '#9333ea', // Grape Purple outline
      shadow: 'drop-shadow-[0_0_12px_rgba(147,51,234,0.25)]',
    },
    ocean: {
      bg: 'bg-[#f0f9ff]',
      grid: 'radial-gradient(#0284c7 1.4px, transparent 1.4px)',
      gridOpacity: 'opacity-12',
      vectorStroke: '#1d4ed8', // Deep Blue outline
      shadow: 'drop-shadow-[0_0_12px_rgba(29,78,216,0.25)]',
    },
    night: {
      bg: 'bg-[#0f172a]',
      grid: 'radial-gradient(#38bdf8 1.2px, transparent 1.2px)',
      gridOpacity: 'opacity-20',
      vectorStroke: '#22d3ee', // Glowing Cyan outline for dark theme
      shadow: 'drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]',
    },
  }[currentTheme] || {
    bg: 'bg-[#faf9f5]',
    grid: 'radial-gradient(#d97706 1.2px, transparent 1.2px)',
    gridOpacity: 'opacity-10',
    vectorStroke: '#2563eb',
    shadow: 'drop-shadow-[0_0_12px_rgba(37,99,235,0.25)]',
  };

  // Redraw canvas whenever lines, active stroke, or dimension changes
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = containerDimensions.width;
    const height = containerDimensions.height;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Draw lines function
    const drawStroke = (line: DrawingLine) => {
      if (line.points.length === 0 || line.isEraser) return;
      ctx.save();

      if (line.tool === 'rainbow') {
        // Multi-color rainbow magical stroke
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineWidth = line.lineWidth * 1.25;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (line.points.length === 1) {
          const pt = line.points[0];
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, (line.lineWidth * 1.25) / 2, 0, Math.PI * 2);
          ctx.fillStyle = '#ec4899';
          ctx.fill();
        } else {
          for (let i = 1; i < line.points.length; i++) {
            const p1 = line.points[i - 1];
            const p2 = line.points[i];
            const hue = (i * 16) % 360;
            ctx.strokeStyle = `hsl(${hue}, 95%, 52%)`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
        ctx.restore();
        return;
      }

      if (line.tool === 'glitter') {
        // Glitter sparkle stroke
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = line.color;
        ctx.globalAlpha = 0.92;
        ctx.lineWidth = line.lineWidth * 1.1;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        if (line.points.length === 1) {
          const pt = line.points[0];
          ctx.arc(pt.x, pt.y, (line.lineWidth * 1.1) / 2, 0, Math.PI * 2);
          ctx.fillStyle = line.color;
          ctx.fill();
        } else {
          ctx.moveTo(line.points[0].x, line.points[0].y);
          for (let i = 1; i < line.points.length; i++) {
            const p1 = line.points[i - 1];
            const p2 = line.points[i];
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);
          }
          const last = line.points[line.points.length - 1];
          ctx.lineTo(last.x, last.y);
          ctx.stroke();
        }

        // Draw glittering starburst sparkles along the stroke path
        for (let i = 2; i < line.points.length; i += 4) {
          const pt = line.points[i];
          ctx.fillStyle = i % 8 === 0 ? '#ffffff' : '#fef08a';
          ctx.beginPath();
          ctx.arc(pt.x + (i % 3 - 1), pt.y + ((i * 2) % 3 - 1), 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        return;
      }

      if (line.tool === 'crayon') {
        // Authentic waxy textured crayon stroke with paper tooth grain
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (line.points.length === 1) {
          const pt = line.points[0];
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, (line.lineWidth * 1.3) / 2, 0, Math.PI * 2);
          ctx.fillStyle = line.color;
          ctx.globalAlpha = 0.85;
          ctx.fill();
        } else {
          // Pass 1: Semi-opaque wax body base
          ctx.save();
          ctx.strokeStyle = line.color;
          ctx.globalAlpha = 0.72;
          ctx.lineWidth = line.lineWidth * 1.35;
          ctx.beginPath();
          ctx.moveTo(line.points[0].x, line.points[0].y);
          for (let i = 1; i < line.points.length; i++) {
            const p1 = line.points[i - 1];
            const p2 = line.points[i];
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);
          }
          const last = line.points[line.points.length - 1];
          ctx.lineTo(last.x, last.y);
          ctx.stroke();
          ctx.restore();

          // Pass 2: Textured wax paper-tooth jitter along stroke
          ctx.save();
          ctx.strokeStyle = line.color;
          ctx.globalAlpha = 0.55;
          ctx.lineWidth = line.lineWidth * 0.9;
          ctx.beginPath();
          for (let i = 0; i < line.points.length; i++) {
            const pt = line.points[i];
            // Deterministic micro-jitter to simulate paper grain
            const jx = ((i * 31) % 7 - 3) * 0.35;
            const jy = ((i * 47) % 7 - 3) * 0.35;
            if (i === 0) {
              ctx.moveTo(pt.x + jx, pt.y + jy);
            } else {
              ctx.lineTo(pt.x + jx, pt.y + jy);
            }
          }
          ctx.stroke();

          // Pass 3: Subtle waxy texture granules
          ctx.fillStyle = line.color;
          ctx.globalAlpha = 0.45;
          for (let i = 1; i < line.points.length; i += 3) {
            const pt = line.points[i];
            const r = ((i * 13) % 4) * 0.4 + 0.7;
            const ox = ((i * 7) % 7 - 3) * (line.lineWidth * 0.06);
            const oy = ((i * 11) % 7 - 3) * (line.lineWidth * 0.06);
            ctx.beginPath();
            ctx.arc(pt.x + ox, pt.y + oy, r, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
        ctx.restore();
        return;
      }

      if (line.tool === 'highlighter') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = line.color;
        ctx.globalAlpha = Math.min(line.opacity * 0.45, 0.55);
        ctx.lineWidth = line.lineWidth * 2.2;
        ctx.lineCap = 'square';
        ctx.lineJoin = 'bevel';
      } else if (line.tool === 'pencil') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = line.color;
        ctx.globalAlpha = line.opacity * 0.85;
        ctx.lineWidth = Math.max(1.5, line.lineWidth * 0.8);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      } else {
        // Paintbrush / Studio pen (default rich wet paint)
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = line.color;
        ctx.globalAlpha = line.opacity;
        ctx.lineWidth = line.tool === 'brush' ? line.lineWidth * 1.35 : line.lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }

      ctx.beginPath();
      if (line.points.length === 1) {
        const pt = line.points[0];
        ctx.arc(pt.x, pt.y, (line.tool === 'brush' ? line.lineWidth * 1.35 : line.lineWidth) / 2, 0, Math.PI * 2);
        ctx.fillStyle = line.color;
        ctx.fill();
      } else {
        ctx.moveTo(line.points[0].x, line.points[0].y);
        for (let i = 1; i < line.points.length; i++) {
          const p1 = line.points[i - 1];
          const p2 = line.points[i];
          const midX = (p1.x + p2.x) / 2;
          const midY = (p1.y + p2.y) / 2;
          ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);
        }
        const last = line.points[line.points.length - 1];
        ctx.lineTo(last.x, last.y);
        ctx.stroke();
      }

      ctx.restore();
    };

    // Draw all committed lines
    lines.forEach(drawStroke);

    // Draw active drawing stroke
    if (currentLine && currentTool !== 'eraser') {
      drawStroke(currentLine);
    }
  }, [lines, currentLine, containerDimensions, currentTool]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Handle Object Eraser stroke deletion
  const checkObjectEraserHits = useCallback(
    (point: StrokePoint) => {
      if (!onEraseStrokes || lines.length === 0) return;
      const hitIds: string[] = [];
      lines.forEach((line) => {
        if (strokeIntersectsCircle(line, point.x, point.y, eraserRadius)) {
          hitIds.push(line.id);
        }
      });
      if (hitIds.length > 0) {
        onEraseStrokes(hitIds);
      }
    },
    [lines, eraserRadius, onEraseStrokes]
  );

  // Pointer event handlers for drawing or object erasing
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isAdjustingReference) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    canvas.setPointerCapture(e.pointerId);

    if (currentTool === 'eraser') {
      setEraserCursor(point);
      checkObjectEraserHits(point);
    } else {
      onStartLine(point);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isAdjustingReference) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    if (currentTool === 'eraser') {
      setEraserCursor(point);
      // If pointer is down (buttons > 0) or user is dragging, erase intersected strokes
      if (e.buttons > 0) {
        checkObjectEraserHits(point);
      }
    } else if (currentLine) {
      onAppendPoint(point);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isAdjustingReference) return;
    const canvas = canvasRef.current;
    if (canvas && canvas.hasPointerCapture(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }

    if (currentTool === 'eraser') {
      // Keep or clear eraser cursor on release
    } else {
      onEndLine();
    }
  };

  const handlePointerLeave = () => {
    if (currentTool === 'eraser') {
      setEraserCursor(null);
    }
  };

  // Dragging reference layer when in template adjustment mode
  const handleTemplatePointerDown = (e: React.PointerEvent) => {
    if (!isAdjustingReference) return;
    setIsDraggingTemplate(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initX: referenceTransform.x,
      initY: referenceTransform.y,
    };
  };

  const handleTemplatePointerMove = (e: React.PointerEvent) => {
    if (!isAdjustingReference || !isDraggingTemplate) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    onUpdateTransform({
      ...referenceTransform,
      x: dragStartRef.current.initX + dx,
      y: dragStartRef.current.initY + dy,
    });
  };

  const handleTemplatePointerUp = () => {
    if (isDraggingTemplate) {
      setIsDraggingTemplate(false);
    }
  };

  const handleWheelZoom = (e: React.WheelEvent) => {
    if (!isAdjustingReference) return;
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    const nextScale = Math.min(Math.max(0.3, referenceTransform.scale * zoomFactor), 5.0);
    onUpdateTransform({
      ...referenceTransform,
      scale: nextScale,
    });
  };

  return (
    <div
      ref={containerRef}
      id="dual-layer-workspace"
      className={`relative w-full h-full overflow-hidden ${themeConfig.bg} select-none touch-none transition-colors duration-300`}
      onPointerMove={isAdjustingReference ? handleTemplatePointerMove : undefined}
      onPointerUp={isAdjustingReference ? handleTemplatePointerUp : undefined}
      onWheel={isAdjustingReference ? handleWheelZoom : undefined}
    >
      {/* Lively Background Studio Grid / Dots */}
      <div
        className={`absolute inset-0 pointer-events-none ${themeConfig.gridOpacity}`}
        style={{
          backgroundImage: themeConfig.grid,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Composition Guides Overlay */}
      {guideMode === 'ruleOfThirds' && (
        <div className="absolute inset-0 pointer-events-none z-15">
          <div className="w-full h-full grid grid-cols-3 grid-rows-3 border border-sky-400/30">
            <div className="border-r border-b border-sky-400/25" />
            <div className="border-r border-b border-sky-400/25" />
            <div className="border-b border-sky-400/25" />
            <div className="border-r border-b border-sky-400/25" />
            <div className="border-r border-b border-sky-400/25" />
            <div className="border-b border-sky-400/25" />
            <div className="border-r border-b border-sky-400/25" />
            <div className="border-r border-b border-sky-400/25" />
            <div />
          </div>
        </div>
      )}

      {guideMode === 'crosshair' && (
        <div className="absolute inset-0 pointer-events-none z-15 flex items-center justify-center">
          <div className="absolute left-0 right-0 h-px bg-sky-400/30" />
          <div className="absolute top-0 bottom-0 w-px bg-sky-400/30" />
          <div className="w-8 h-8 rounded-full border border-sky-400/40" />
        </div>
      )}

      {guideMode === 'dots' && (
        <div
          className="absolute inset-0 pointer-events-none z-15 opacity-25"
          style={{
            backgroundImage: 'radial-gradient(#3b82f6 1.5px, transparent 1.5px)',
            backgroundSize: '36px 36px',
          }}
        />
      )}

      {/* LAYER 1: Background Reference Tracing Layer (Underneath) */}
      <div
        id="reference-layer"
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
        style={{
          opacity: referenceOpacity,
          pointerEvents: isAdjustingReference ? 'auto' : 'none',
          cursor: isAdjustingReference ? 'grab' : 'default',
        }}
        onPointerDown={handleTemplatePointerDown}
      >
        <div
          style={{
            transform: `translate(${referenceTransform.x}px, ${referenceTransform.y}px) scale(${referenceTransform.scale})`,
            transformOrigin: 'center center',
          }}
          className="flex items-center justify-center max-w-[85%] max-h-[85%]"
        >
          {referenceTarget.type === 'vector' && referenceTarget.vectorShape ? (
            <div className="w-[320px] h-[320px] sm:w-[420px] sm:h-[420px]">
              <VectorShape
                type={referenceTarget.vectorShape}
                strokeColor={themeConfig.vectorStroke}
                strokeWidth={3.8}
                className={`w-full h-full filter ${themeConfig.shadow}`}
              />
            </div>
          ) : referenceTarget.imageSrc ? (
            <img
              src={referenceTarget.imageSrc}
              alt={referenceTarget.imageName || 'Tracing Picture'}
              className="max-w-[85vw] max-h-[75vh] object-contain select-none pointer-events-none shadow-2xl rounded-2xl"
              draggable={false}
            />
          ) : null}
        </div>
      </div>

      {/* Active Reference Move & Zoom Notification Pill */}
      {isAdjustingReference && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-full shadow-xl border border-amber-300">
          <span>Drag or Pinch to Move & Zoom Picture</span>
          <button
            onClick={onResetTransform}
            className="px-2.5 py-0.5 bg-black/20 hover:bg-black/30 rounded-full text-[11px] font-extrabold"
          >
            Reset Center
          </button>
        </div>
      )}

      {/* LAYER 2: Foreground Drawing Canvas (Overlaid on top) */}
      <canvas
        ref={canvasRef}
        id="drawing-canvas-layer"
        className={`absolute inset-0 w-full h-full touch-none z-10 ${
          currentTool === 'eraser' ? 'cursor-none' : 'cursor-crosshair'
        }`}
        style={{
          pointerEvents: isAdjustingReference ? 'none' : 'auto',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerLeave}
      />

      {/* Object Eraser Circular Floating Cursor Ring */}
      {currentTool === 'eraser' && eraserCursor && !isAdjustingReference && (
        <div
          className="pointer-events-none absolute rounded-full border-2 border-rose-500 bg-rose-500/25 shadow-lg flex items-center justify-center -translate-x-1/2 -translate-y-1/2 z-30 transition-none animate-in fade-in zoom-in-75 duration-75"
          style={{
            left: eraserCursor.x,
            top: eraserCursor.y,
            width: eraserRadius * 2,
            height: eraserRadius * 2,
          }}
        >
          <span className="text-[11px] select-none">🧹</span>
        </div>
      )}
    </div>
  );
};
