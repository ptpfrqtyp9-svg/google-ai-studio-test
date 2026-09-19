import React, { useState, useEffect, useRef } from 'react';
import { DrawingLine, ReferenceTarget, ReferenceTransform } from '../types';
import { VectorShape } from './VectorShapes';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  X,
  Sparkles,
  Film,
  Layers,
  Eye,
  EyeOff,
} from 'lucide-react';

interface TimeLapseReplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  lines: DrawingLine[];
  referenceTarget: ReferenceTarget;
  referenceTransform: ReferenceTransform;
}

export const TimeLapseReplayModal: React.FC<TimeLapseReplayModalProps> = ({
  isOpen,
  onClose,
  lines,
  referenceTarget,
  referenceTransform,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(2); // 1x, 2x, 4x
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState<number>(0);
  const [currentPointIndex, setCurrentPointIndex] = useState<number>(0);
  const [showReference, setShowReference] = useState<boolean>(true);
  const [referenceAlpha, setReferenceAlpha] = useState<number>(0.25);

  const animationFrameRef = useRef<number | null>(null);

  // Total points across all strokes
  const totalStrokes = lines.length;

  // Initialize playback state when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStrokeIndex(lines.length > 0 ? 0 : 0);
      setCurrentPointIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  }, [isOpen, lines.length]);

  // Canvas dimensions
  const width = 720;
  const height = 520;

  // Render canvas frame
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Draw completed strokes up to currentStrokeIndex
    for (let i = 0; i < currentStrokeIndex && i < lines.length; i++) {
      drawFullStroke(ctx, lines[i]);
    }

    // Draw partial stroke currently animating
    if (currentStrokeIndex < lines.length) {
      const activeLine = lines[currentStrokeIndex];
      const partialPoints = activeLine.points.slice(0, currentPointIndex + 1);
      if (partialPoints.length > 0) {
        drawFullStroke(ctx, {
          ...activeLine,
          points: partialPoints,
        });
      }
    }
  }, [isOpen, currentStrokeIndex, currentPointIndex, lines, width, height]);

  // Stroke rendering helper
  const drawFullStroke = (ctx: CanvasRenderingContext2D, line: DrawingLine) => {
    if (line.points.length === 0) return;
    ctx.save();

    if (line.isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = line.lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    } else if (line.tool === 'highlighter') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = line.color;
      ctx.globalAlpha = Math.min(line.opacity * 0.45, 0.55);
      ctx.lineWidth = line.lineWidth * 2;
      ctx.lineCap = 'square';
      ctx.lineJoin = 'bevel';
    } else if (line.tool === 'pencil') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = line.color;
      ctx.globalAlpha = line.opacity * 0.85;
      ctx.lineWidth = Math.max(1, line.lineWidth * 0.75);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    } else {
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

  // Playback loop
  useEffect(() => {
    if (!isPlaying || !isOpen || lines.length === 0) return;

    let stepTimer: NodeJS.Timeout;
    const stepInterval = Math.max(12 / speed, 4);

    const step = () => {
      setCurrentPointIndex((prevPt) => {
        const activeStroke = lines[currentStrokeIndex];
        if (!activeStroke) {
          setIsPlaying(false);
          return 0;
        }

        const nextPt = prevPt + Math.max(1, Math.floor(speed * 1.5));
        if (nextPt < activeStroke.points.length) {
          return nextPt;
        } else {
          // Finished this stroke, advance to next stroke
          setCurrentStrokeIndex((prevStroke) => {
            const nextStroke = prevStroke + 1;
            if (nextStroke >= lines.length) {
              setIsPlaying(false);
              return prevStroke;
            }
            return nextStroke;
          });
          return 0;
        }
      });
    };

    stepTimer = setInterval(step, stepInterval);
    return () => clearInterval(stepTimer);
  }, [isPlaying, isOpen, speed, currentStrokeIndex, lines]);

  if (!isOpen) return null;

  // Calculate progress percentage
  const progressPercent =
    totalStrokes > 0 ? Math.min(100, Math.round((currentStrokeIndex / totalStrokes) * 100)) : 0;

  const handleRestart = () => {
    setCurrentStrokeIndex(0);
    setCurrentPointIndex(0);
    setIsPlaying(true);
  };

  const handleToggleSpeed = () => {
    if (speed === 1) setSpeed(2);
    else if (speed === 2) setSpeed(4);
    else setSpeed(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#16161a] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#1a1a20]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">Time-Lapse Replay</h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Procreate Engine
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Watch your tracing strokes come to life in chronological sequence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Reference Overlay Toggle */}
            <button
              onClick={() => setShowReference(!showReference)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
                showReference
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                  : 'bg-white/5 text-gray-400 border-white/10'
              }`}
              title="Toggle Reference Template"
            >
              {showReference ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Template</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Playback Stage Screen */}
        <div className="relative flex-1 min-h-[380px] bg-[#0c0c0f] flex items-center justify-center overflow-hidden">
          {/* Subtle Grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.3) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '24px 24px',
            }}
          />

          {/* Underlying Reference Layer */}
          {showReference && (
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200"
              style={{ opacity: referenceAlpha }}
            >
              <div
                style={{
                  transform: `translate(${referenceTransform.x}px, ${referenceTransform.y}px) scale(${referenceTransform.scale * 0.85})`,
                  transformOrigin: 'center center',
                }}
                className="flex items-center justify-center max-w-[80%] max-h-[80%]"
              >
                {referenceTarget.type === 'vector' && referenceTarget.vectorShape ? (
                  <div className="w-[300px] h-[300px]">
                    <VectorShape
                      type={referenceTarget.vectorShape}
                      strokeColor="#22d3ee"
                      strokeWidth={3}
                      className="w-full h-full"
                    />
                  </div>
                ) : referenceTarget.imageSrc ? (
                  <img
                    src={referenceTarget.imageSrc}
                    alt={referenceTarget.imageName || 'Reference Target'}
                    className="max-w-[70vw] max-h-[50vh] object-contain rounded-lg"
                    draggable={false}
                  />
                ) : null}
              </div>
            </div>
          )}

          {/* Active Canvas Drawing Frame */}
          <canvas
            ref={canvasRef}
            className="relative z-10 max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />

          {/* Stroke Count Watermark Overlay */}
          <div className="absolute top-3 left-4 z-20 flex items-center gap-2 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-xs text-gray-300 font-mono">
            <span>Stroke: {Math.min(currentStrokeIndex + 1, totalStrokes)} / {totalStrokes}</span>
          </div>

          {/* Replay Finished Banner */}
          {!isPlaying && currentStrokeIndex >= totalStrokes && totalStrokes > 0 && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-200">
              <div className="p-5 bg-[#1e1e24]/95 border border-cyan-500/40 rounded-2xl shadow-2xl text-center space-y-3 max-w-xs">
                <div className="w-10 h-10 mx-auto rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Replay Complete</h3>
                <p className="text-xs text-gray-300">
                  You completed {totalStrokes} precision tracing strokes!
                </p>
                <button
                  onClick={handleRestart}
                  className="w-full py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-all shadow-lg shadow-cyan-500/25"
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Playback Controls Footer */}
        <div className="p-4 sm:p-5 bg-[#1a1a20] border-t border-white/10 space-y-3">
          {/* Progress Timeline Scrubber */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
              <span>Timeline Progress</span>
              <span className="font-mono text-cyan-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden cursor-pointer">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-75"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Button Strip */}
          <div className="flex items-center justify-between pt-1">
            {/* Left: Restart */}
            <button
              onClick={handleRestart}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors"
              title="Restart from beginning"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart</span>
            </button>

            {/* Center: Play/Pause */}
            <button
              onClick={() => {
                if (currentStrokeIndex >= totalStrokes && !isPlaying) {
                  handleRestart();
                } else {
                  setIsPlaying(!isPlaying);
                }
              }}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/30 transition-transform active:scale-95"
              title={isPlaying ? 'Pause Replay' : 'Play Replay'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            {/* Right: Speed Multiplier */}
            <button
              onClick={handleToggleSpeed}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-cyan-300 font-mono text-xs font-bold transition-colors border border-cyan-500/20"
              title="Toggle Playback Speed"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>{speed}x Speed</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
