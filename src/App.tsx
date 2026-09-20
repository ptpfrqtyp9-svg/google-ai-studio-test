import React, { useState, useCallback } from 'react';
import {
  CompositionGuideMode,
  DrawingLine,
  DrawingTool,
  ReferenceTarget,
  ReferenceTransform,
  StrokePoint,
  VectorShapeType,
  AppMode,
  CanvasTheme,
  EraserSize,
} from './types';
import { DualLayerCanvas } from './components/DualLayerCanvas';
import { BottomToolbar } from './components/BottomToolbar';
import { ColorSidebar } from './components/ColorSidebar';
import { ImageChannelsModal, UNIFIED_PICTURE_LIBRARY } from './components/ImageChannelsModal';
import { VectorShape } from './components/VectorShapes';
import { SwiftSourceModal } from './components/SwiftSourceModal';
import { ExportPhotoModal } from './components/ExportPhotoModal';
import { TimeLapseReplayModal } from './components/TimeLapseReplayModal';
import { TraceAnalyticsModal } from './components/TraceAnalyticsModal';
import { ColorByNumberView } from './components/ColorByNumberView';
import {
  Sparkles,
  Trash2,
  Code,
  Share2,
  AlertTriangle,
  Film,
  Trophy,
  Dices,
  Layers,
  X,
  Palette,
} from 'lucide-react';

const MAX_UNDO_STEPS = 15;

function playEraserPopSound() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(360, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  } catch {
    // Ignore audio context autoplay restrictions
  }
}

export default function App() {
  // Application Mode: Free Draw (Tracing) or Color By Number
  const [appMode, setAppMode] = useState<AppMode>('free-draw');

  // Lively Studio Canvas Theme (default: warm ivory art paper)
  const [currentTheme, setCurrentTheme] = useState<CanvasTheme>('paper');

  // Canvas stroke history & state
  const [lines, setLines] = useState<DrawingLine[]>([]);
  const [currentLine, setCurrentLine] = useState<DrawingLine | null>(null);

  // 15-Step Undo/Redo Matrix
  const [undoStack, setUndoStack] = useState<DrawingLine[][]>([]);
  const [redoStack, setRedoStack] = useState<DrawingLine[][]>([]);

  // Active Tool & Brush Kit settings (defaults match reference: Magenta Paintbrush)
  const [currentTool, setCurrentTool] = useState<DrawingTool>('brush');
  const [selectedColor, setSelectedColor] = useState<string>('#ec4899');
  const [lineWidth, setLineWidth] = useState<number>(7);
  const [brushOpacity, setBrushOpacity] = useState<number>(1.0);
  const [eraserSize, setEraserSize] = useState<EraserSize>('medium');

  // 3 Random Startup Drawing Options
  const [isStartupModalOpen, setIsStartupModalOpen] = useState<boolean>(true);
  const [startupOptions, setStartupOptions] = useState<VectorShapeType[]>(() => {
    const all = UNIFIED_PICTURE_LIBRARY.map((item) => item.type);
    const shuffled = [...all].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  });

  // Reference Target & Opacity settings
  const [referenceTarget, setReferenceTarget] = useState<ReferenceTarget>(() => {
    const all = UNIFIED_PICTURE_LIBRARY.map((item) => item.type);
    const initial = all[Math.floor(Math.random() * all.length)] || 'butterfly';
    return {
      type: 'vector',
      vectorShape: initial,
    };
  });
  const [referenceOpacity, setReferenceOpacity] = useState<number>(0.45);
  const [lastActiveReferenceOpacity, setLastActiveReferenceOpacity] = useState<number>(0.45);
  const [isReferenceVisible, setIsReferenceVisible] = useState<boolean>(true);

  // Composition Guides
  const [guideMode, setGuideMode] = useState<CompositionGuideMode>('none');

  // Move & Zoom for Template Layer
  const [isAdjustingReference, setIsAdjustingReference] = useState<boolean>(false);
  const [referenceTransform, setReferenceTransform] = useState<ReferenceTransform>({
    x: 0,
    y: 0,
    scale: 1.0,
  });

  // Modals
  const [isTargetModalOpen, setIsTargetModalOpen] = useState<boolean>(false);
  const [isSwiftModalOpen, setIsSwiftModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState<boolean>(false);
  const [isReplayModalOpen, setIsReplayModalOpen] = useState<boolean>(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState<boolean>(false);

  // Drawing Event Handlers
  const handleStartLine = useCallback(
    (point: StrokePoint) => {
      if (isAdjustingReference || currentTool === 'eraser') return;
      const newLine: DrawingLine = {
        id: Math.random().toString(36).substring(2, 9),
        points: [point],
        color: selectedColor,
        lineWidth,
        opacity: brushOpacity,
        isEraser: false,
        tool: currentTool,
      };
      setCurrentLine(newLine);
    },
    [isAdjustingReference, selectedColor, lineWidth, brushOpacity, currentTool]
  );

  const handleAppendPoint = useCallback(
    (point: StrokePoint) => {
      if (isAdjustingReference || currentTool === 'eraser') return;
      setCurrentLine((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          points: [...prev.points, point],
        };
      });
    },
    [isAdjustingReference, currentTool]
  );

  const handleEndLine = useCallback(() => {
    if (!currentLine) return;
    setUndoStack((prev) => {
      const next = [...prev, lines];
      if (next.length > MAX_UNDO_STEPS) {
        return next.slice(next.length - MAX_UNDO_STEPS);
      }
      return next;
    });
    setRedoStack([]);
    setLines((prev) => [...prev, currentLine]);
    setCurrentLine(null);
  }, [currentLine, lines]);

  // Object Eraser Handler: Deletes entire stroke objects upon touch/swipe
  const handleEraseStrokes = useCallback(
    (strokeIds: string[]) => {
      if (strokeIds.length === 0) return;
      setLines((prev) => {
        const idSet = new Set(strokeIds);
        const remaining = prev.filter((line) => !idSet.has(line.id));
        if (remaining.length !== prev.length) {
          setUndoStack((uPrev) => {
            const next = [...uPrev, prev];
            if (next.length > MAX_UNDO_STEPS) {
              return next.slice(next.length - MAX_UNDO_STEPS);
            }
            return next;
          });
          setRedoStack([]);
          playEraserPopSound();
        }
        return remaining;
      });
    },
    []
  );

  // 15-Step Undo & Redo
  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, prev.length - 1));
    setRedoStack((prev) => {
      const next = [...prev, lines];
      if (next.length > MAX_UNDO_STEPS) {
        return next.slice(next.length - MAX_UNDO_STEPS);
      }
      return next;
    });
    setLines(previous);
  }, [undoStack, lines]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, prev.length - 1));
    setUndoStack((prev) => {
      const updated = [...prev, lines];
      if (updated.length > MAX_UNDO_STEPS) {
        return updated.slice(updated.length - MAX_UNDO_STEPS);
      }
      return updated;
    });
    setLines(next);
  }, [redoStack, lines]);

  // Clear Canvas (leaves reference template untouched)
  const handleClearCanvas = () => {
    if (lines.length === 0) return;
    setUndoStack((prev) => {
      const next = [...prev, lines];
      if (next.length > MAX_UNDO_STEPS) {
        return next.slice(next.length - MAX_UNDO_STEPS);
      }
      return next;
    });
    setRedoStack([]);
    setLines([]);
    setIsClearModalOpen(false);
  };

  // Quick Eye Toggle
  const handleToggleEye = () => {
    if (isReferenceVisible) {
      setLastActiveReferenceOpacity(Math.max(referenceOpacity, 0.1));
      setReferenceOpacity(0);
      setIsReferenceVisible(false);
    } else {
      setReferenceOpacity(lastActiveReferenceOpacity);
      setIsReferenceVisible(true);
    }
  };

  // Drawing Selection Handlers — automatically erases the board when drawing changes
  const handleSelectVector = (shape: VectorShapeType) => {
    setReferenceTarget({
      type: 'vector',
      vectorShape: shape,
    });
    // Automatically erase the board
    setLines([]);
    setCurrentLine(null);
    setUndoStack([]);
    setRedoStack([]);
    setReferenceTransform({ x: 0, y: 0, scale: 1.0 });
    if (referenceOpacity === 0) {
      setReferenceOpacity(lastActiveReferenceOpacity);
      setIsReferenceVisible(true);
    }
  };

  const handleSelectImage = (dataUrl: string, name: string) => {
    setReferenceTarget({
      type: 'image',
      imageSrc: dataUrl,
      imageName: name,
    });
    // Automatically erase the board
    setLines([]);
    setCurrentLine(null);
    setUndoStack([]);
    setRedoStack([]);
    setReferenceTransform({ x: 0, y: 0, scale: 1.0 });
    if (referenceOpacity === 0) {
      setReferenceOpacity(lastActiveReferenceOpacity);
      setIsReferenceVisible(true);
    }
  };

  const handleShuffleStartupOptions = () => {
    const all = UNIFIED_PICTURE_LIBRARY.map((item) => item.type);
    const shuffled = [...all].sort(() => 0.5 - Math.random());
    setStartupOptions(shuffled.slice(0, 3));
  };

  // Theme container background
  const containerBgClass = {
    paper: 'bg-[#faf9f5]',
    sunshine: 'bg-[#fffdf2]',
    blossom: 'bg-[#fdf4f8]',
    ocean: 'bg-[#f0f9ff]',
    night: 'bg-[#0f172a]',
  }[currentTheme] || 'bg-[#faf9f5]';

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden ${containerBgClass} text-gray-800 flex flex-col select-none transition-colors duration-300`}
    >
      {/* Top Header Bar */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-3 sm:px-6 py-3 pointer-events-none">
        {/* Left App Badge & Mode Switcher */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white/95 backdrop-blur-xl border-2 border-amber-300 rounded-full shadow-lg">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-sm font-black tracking-tight text-gray-900">Drawing Studio</span>
          </div>

          {/* Mode Switcher Pills: Free Draw vs Color by Number */}
          <div className="hidden sm:flex items-center p-1 bg-white/95 backdrop-blur-xl border-2 border-amber-300/80 rounded-full shadow-lg">
            <button
              onClick={() => setAppMode('free-draw')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black transition-all ${
                appMode === 'free-draw'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Trace & Draw</span>
            </button>
            <button
              onClick={() => setAppMode('color-by-number')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black transition-all ${
                appMode === 'color-by-number'
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-md'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <span>🔢</span>
              <span>Color by Number</span>
            </button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
          {appMode === 'free-draw' && (
            <>
              {/* Time-Lapse Replay Button */}
              <button
                onClick={() => setIsReplayModalOpen(true)}
                id="btn-top-replay"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white border-2 border-sky-200 text-sky-800 text-xs font-bold transition-all shadow-md"
                title="Watch Time-Lapse Replay"
              >
                <Film className="w-3.5 h-3.5 text-sky-600" />
                <span className="hidden sm:inline">Replay</span>
              </button>

              {/* Trace Accuracy & Stats Button */}
              <button
                onClick={() => setIsAnalyticsModalOpen(true)}
                id="btn-top-stats"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white border-2 border-amber-200 text-amber-900 text-xs font-bold transition-all shadow-md"
                title="View Trace Accuracy & Statistics"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden sm:inline">Score</span>
              </button>

              {/* Export / Save to Photos Button */}
              <button
                onClick={() => setIsExportModalOpen(true)}
                id="btn-top-export"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white border-2 border-amber-300 text-amber-900 text-xs font-black transition-all shadow-md"
                title="Save Drawing to Photos"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Save</span>
              </button>

              {/* Clear Canvas Button */}
              <button
                onClick={() => setIsClearModalOpen(true)}
                disabled={lines.length === 0}
                id="btn-clear-canvas"
                className="p-2 rounded-full bg-white/95 hover:bg-rose-50 disabled:opacity-40 border-2 border-rose-200 text-rose-500 transition-all shadow-md"
                title="Clear Drawing Canvas"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Native Swift Code & Download Hub */}
          <button
            onClick={() => setIsSwiftModalOpen(true)}
            id="btn-swift-code"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 hover:bg-white border-2 border-gray-300 text-gray-800 text-xs font-bold transition-all shadow-md"
            title="View & Download Native iOS Swift Source Code"
          >
            <Code className="w-3.5 h-3.5 text-gray-700" />
            <span className="hidden md:inline">Swift Code</span>
          </button>
        </div>
      </header>

      {/* Mode 1: Interactive Color-By-Number View */}
      {appMode === 'color-by-number' && (
        <main className="flex-1 w-full h-full relative overflow-y-auto pt-16 pb-6 flex items-center justify-center">
          <ColorByNumberView onBackToDrawing={() => setAppMode('free-draw')} />
        </main>
      )}

      {/* Mode 2: Free Drawing Canvas & Kid-Friendly Toolbar */}
      {appMode === 'free-draw' && (
        <>
          <main className="flex-1 w-full h-full relative pl-20 sm:pl-28 md:pl-32 pr-2 sm:pr-4">
            <DualLayerCanvas
              lines={lines}
              currentLine={currentLine}
              onStartLine={handleStartLine}
              onAppendPoint={handleAppendPoint}
              onEndLine={handleEndLine}
              referenceTarget={referenceTarget}
              referenceOpacity={referenceOpacity}
              isAdjustingReference={isAdjustingReference}
              referenceTransform={referenceTransform}
              onUpdateTransform={setReferenceTransform}
              onResetTransform={() => setReferenceTransform({ x: 0, y: 0, scale: 1.0 })}
              guideMode={guideMode}
              currentTool={currentTool}
              eraserSize={eraserSize}
              onEraseStrokes={handleEraseStrokes}
              currentTheme={currentTheme}
            />
          </main>

          {/* Permanently Open Left Kid Color & Brush Sidebar */}
          <ColorSidebar
            selectedColor={selectedColor}
            onSelectColor={setSelectedColor}
            currentTool={currentTool}
            onSelectTool={setCurrentTool}
            onClearCanvas={() => setIsClearModalOpen(true)}
            onSaveOrNext={() => setIsExportModalOpen(true)}
            eraserSize={eraserSize}
            onChangeEraserSize={setEraserSize}
          />

          {/* Bottom Floating Capsule Toolbar */}
          <footer className="absolute bottom-4 left-0 right-0 z-30 pointer-events-auto">
            <BottomToolbar
              currentTool={currentTool}
              onSelectTool={setCurrentTool}
              referenceOpacity={referenceOpacity}
              onChangeReferenceOpacity={(val) => {
                setReferenceOpacity(val);
                setIsReferenceVisible(val > 0.01);
                if (val > 0.05) setLastActiveReferenceOpacity(val);
              }}
              isReferenceVisible={isReferenceVisible}
              onToggleEye={handleToggleEye}
              isAdjustingReference={isAdjustingReference}
              onToggleAdjustReference={() => setIsAdjustingReference(!isAdjustingReference)}
              onOpenTargetModal={() => setIsTargetModalOpen(true)}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              canUndo={undoStack.length > 0}
              canRedo={redoStack.length > 0}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onOpenColorByNumber={() => setAppMode('color-by-number')}
              hasStrokes={lines.length > 0}
              eraserSize={eraserSize}
              onChangeEraserSize={setEraserSize}
            />
          </footer>
        </>
      )}

      {/* Picture Channels Modal */}
      <ImageChannelsModal
        isOpen={isTargetModalOpen}
        onClose={() => setIsTargetModalOpen(false)}
        currentTarget={referenceTarget}
        onSelectVector={handleSelectVector}
        onSelectImage={handleSelectImage}
      />

      {/* Export to Photos Modal */}
      <ExportPhotoModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        lines={lines}
        referenceTarget={referenceTarget}
        referenceTransform={referenceTransform}
      />

      {/* Time-Lapse Replay Modal */}
      <TimeLapseReplayModal
        isOpen={isReplayModalOpen}
        onClose={() => setIsReplayModalOpen(false)}
        lines={lines}
        referenceTarget={referenceTarget}
        referenceTransform={referenceTransform}
      />

      {/* Trace Accuracy & Analytics Modal */}
      <TraceAnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
        lines={lines}
        referenceTarget={referenceTarget}
      />

      {/* Native Swift Source Code & ZIP Download Modal */}
      <SwiftSourceModal
        isOpen={isSwiftModalOpen}
        onClose={() => setIsSwiftModalOpen(false)}
      />

      {/* Clear Canvas Confirmation Modal */}
      {isClearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white border-2 border-rose-300 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-base font-black text-gray-900">Erase All Drawing?</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              This will clear your pencil and crayon strokes. Your tracing picture
              will stay on the screen so you can start fresh!
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsClearModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors"
              >
                Keep Drawing
              </button>
              <button
                onClick={handleClearCanvas}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-black text-white transition-colors shadow-md"
              >
                Erase Everything
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Startup 3 Random Options Modal */}
      {isStartupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-250">
          <div className="w-full max-w-lg bg-white border-2 border-amber-300 rounded-3xl p-6 shadow-2xl space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <span>Pick a Picture to Draw</span>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                    3 Fun Ideas
                  </span>
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Choose one of these random pictures to trace, or shuffle for 3 new ones:
                </p>
              </div>
              <button
                onClick={() => setIsStartupModalOpen(false)}
                className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
                title="Start with blank paper"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 3 Interactive Cards (Outline-Only) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {startupOptions.map((shapeKey) => {
                const meta = UNIFIED_PICTURE_LIBRARY.find((item) => item.type === shapeKey);
                return (
                  <button
                    key={shapeKey}
                    onClick={() => {
                      handleSelectVector(shapeKey);
                      setIsStartupModalOpen(false);
                    }}
                    className="group flex flex-col items-center text-center p-4 rounded-2xl bg-[#faf9f5] hover:bg-amber-50 border-2 border-amber-200 hover:border-amber-400 transition-all hover:scale-105 active:scale-95 shadow-md"
                  >
                    <div className="w-16 h-16 rounded-xl bg-white border border-amber-200 group-hover:border-amber-400 flex items-center justify-center p-2 transition-colors mb-2 shadow-inner">
                      <VectorShape type={shapeKey} strokeColor="#2563eb" strokeWidth={3.0} />
                    </div>
                    <span className="text-xs font-black text-gray-800 group-hover:text-amber-900 transition-colors">
                      {meta?.name || shapeKey}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-amber-700 mt-1 px-1.5 py-0.5 rounded bg-amber-100">
                      {meta?.category || 'picture'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Secondary Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-gray-200">
              <button
                onClick={handleShuffleStartupOptions}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors border border-gray-300"
              >
                <Dices className="w-4 h-4 text-amber-600" />
                <span>Shuffle 3 New Ideas</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setIsStartupModalOpen(false);
                    setIsTargetModalOpen(true);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-white text-xs font-black transition-colors shadow-lg shadow-amber-500/20"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Browse All Pictures</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
