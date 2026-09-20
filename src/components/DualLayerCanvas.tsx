import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CompositionGuideMode, DrawingLine, ReferenceTarget, ReferenceTransform, StrokePoint } from '../types';
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
  isPeeking?: boolean;
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
  isPeeking = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [containerDimensions, setContainerDimensions] = useState<{ width: number; height: number }>({
    width: 800,
    height: 600,
  });

  // Effective template opacity (jumps to 1.0 when user is holding Peek button)
  const effectiveReferenceOpacity = isPeeking ? 1.0 : referenceOpacity;

  // Dragging template state when in adjust mode
  const [isDraggingTemplate, setIsDraggingTemplate] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; initX: number; initY: number }>({
    x: 0,
    y: 0,
    initX: 0,
    initY: 0,
  });

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
      if (line.points.length === 0) return;
      ctx.save();

      if (line.isEraser) {
        // Pixel-accurate eraser: cuts only from foreground drawing layer!
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = line.lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      } else if (line.tool === 'highlighter') {
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
        // Studio pen (default)
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = line.color;
        ctx.globalAlpha = line.opacity;
        ctx.lineWidth = line.lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }

      ctx.beginPath();
      if (line.points.length === 1) {
        const pt = line.points[0];
        ctx.arc(pt.x, pt.y, line.lineWidth / 2, 0, Math.PI * 2);
        ctx.fillStyle = line.isEraser ? '#000000' : line.color;
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
    if (currentLine) {
      drawStroke(currentLine);
    }
  }, [lines, currentLine, containerDimensions]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  // Pointer event handlers for drawing on Layer 2
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
    onStartLine(point);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isAdjustingReference || !currentLine) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const point = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    onAppendPoint(point);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isAdjustingReference) return;
    const canvas = canvasRef.current;
    if (canvas && canvas.hasPointerCapture(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }
    onEndLine();
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
      className="relative w-full h-full overflow-hidden bg-[#111115] select-none touch-none"
      onPointerMove={isAdjustingReference ? handleTemplatePointerMove : undefined}
      onPointerUp={isAdjustingReference ? handleTemplatePointerUp : undefined}
      onWheel={isAdjustingReference ? handleWheelZoom : undefined}
    >
      {/* Background Studio Drafting Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.25) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.25) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Composition Guides Overlay */}
      {guideMode === 'ruleOfThirds' && (
        <div className="absolute inset-0 pointer-events-none z-15">
          <div className="w-full h-full grid grid-cols-3 grid-rows-3 border border-cyan-500/20">
            <div className="border-r border-b border-cyan-500/25" />
            <div className="border-r border-b border-cyan-500/25" />
            <div className="border-b border-cyan-500/25" />
            <div className="border-r border-b border-cyan-500/25" />
            <div className="border-r border-b border-cyan-500/25" />
            <div className="border-b border-cyan-500/25" />
            <div className="border-r border-cyan-500/25" />
            <div className="border-r border-cyan-500/25" />
            <div />
          </div>
        </div>
      )}

      {guideMode === 'crosshair' && (
        <div className="absolute inset-0 pointer-events-none z-15 flex items-center justify-center">
          <div className="absolute left-0 right-0 h-px bg-cyan-500/30" />
          <div className="absolute top-0 bottom-0 w-px bg-cyan-500/30" />
          <div className="w-8 h-8 rounded-full border border-cyan-400/40" />
        </div>
      )}

      {guideMode === 'dots' && (
        <div
          className="absolute inset-0 pointer-events-none z-15 opacity-25"
          style={{
            backgroundImage: 'radial-gradient(#22d3ee 1.5px, transparent 1.5px)',
            backgroundSize: '36px 36px',
          }}
        />
      )}

      {/* LAYER 1: Background Reference Tracing Layer (Underneath) */}
      <div
        id="reference-layer"
        className="absolute inset-0 flex items-center justify-center transition-opacity duration-200"
        style={{
          opacity: effectiveReferenceOpacity,
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
                strokeColor="#22d3ee"
                strokeWidth={3.5}
                className="w-full h-full filter drop-shadow-[0_0_8px_rgba(34,211,238,0.3)]"
              />
            </div>
          ) : referenceTarget.imageSrc ? (
            <img
              src={referenceTarget.imageSrc}
              alt={referenceTarget.imageName || 'Reference Target'}
              className="max-w-[85vw] max-h-[75vh] object-contain select-none pointer-events-none shadow-2xl rounded-lg"
              draggable={false}
            />
          ) : null}
        </div>
      </div>

      {/* Active Peeking Indicator */}
      {isPeeking && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-4 py-1.5 bg-cyan-500 text-black text-xs font-bold rounded-full shadow-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="w-2 h-2 rounded-full bg-black animate-ping" />
          <span>Clear Picture Peek ✨</span>
        </div>
      )}

      {/* Active Reference Adjust Notification Pill */}
      {isAdjustingReference && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-4 py-2 bg-cyan-600/90 backdrop-blur-md rounded-full text-white text-xs font-semibold shadow-lg border border-cyan-400/30">
          <span>Drag or Pinch to Move & Zoom Picture</span>
          <button
            onClick={onResetTransform}
            className="px-2 py-0.5 bg-white/20 hover:bg-white/30 rounded-full text-[11px] font-bold"
          >
            Reset Center
          </button>
        </div>
      )}

      {/* LAYER 2: Foreground Drawing Canvas (Overlaid on top) */}
      <canvas
        ref={canvasRef}
        id="drawing-canvas-layer"
        className="absolute inset-0 w-full h-full cursor-crosshair touch-none z-10"
        style={{
          pointerEvents: isAdjustingReference ? 'none' : 'auto',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />
    </div>
  );
};
