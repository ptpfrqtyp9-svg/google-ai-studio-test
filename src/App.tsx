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
} from './types';
import { DualLayerCanvas } from './components/DualLayerCanvas';
import { BottomToolbar } from './components/BottomToolbar';
import { ImageChannelsModal, UNIFIED_PICTURE_LIBRARY, VECTOR_LIBRARY } from './components/ImageChannelsModal';
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

export default function App() {
  // Application Mode: Free Draw (Tracing) or Color By Number
  const [appMode, setAppMode] = useState<AppMode>('free-draw');

  // Canvas stroke history & state
  const [lines, setLines] = useState<DrawingLine[]>([]);
  const [currentLine, setCurrentLine] = useState<DrawingLine | null>(null);

  // 15-Step Undo/Redo Matrix
  const [undoStack, setUndoStack] = useState<DrawingLine[][]>([]);
  const [redoStack, setRedoStack] = useState<DrawingLine[][]>([]);

  // Active Tool & Brush Kit settings
  const [currentTool, setCurrentTool] = useState<DrawingTool>('pen');
  const [selectedColor, setSelectedColor] = useState<string>('#ef4444');
  const [lineWidth, setLineWidth] = useState<number>(7);
  const [brushOpacity, setBrushOpacity] = useState<number>(1.0);

  // 3 Random Startup Drawing Options
  const [isStartupModalOpen, setIsStartupModalOpen] = useState<boolean>(true);
  const [startupOptions, setStartupOptions] = useState<VectorShapeType[]>(() => {
    const all = UNIFIED_PICTURE_LIBRARY.map((item) => item.type);
    const shuffled = [...all].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  });

  // Reference Target & Opacity settings (initialized to first random option)
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

  // Hold-to-Peek & Composition Guides
  const [isPeeking, setIsPeeking] = useState<boolean>(false);
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
      if (isAdjustingReference) return;
      const newLine: DrawingLine = {
        id: Math.random().toString(36).substring(2, 9),
        points: [point],
        color: selectedColor,
        lineWidth,
        opacity: brushOpacity,
        isEraser: currentTool === 'eraser',
        tool: currentTool,
      };
      setCurrentLine(newLine);
    },
    [isAdjustingReference, selectedColor, lineWidth, brushOpacity, currentTool]
  );

  const handleAppendPoint = useCallback(
    (point: StrokePoint) => {
      if (isAdjustingReference) return;
      setCurrentLine((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          points: [...prev.points, point],
        };
      });
    },
    [isAdjustingReference]
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

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a0a0c] text-white flex flex-col select-none">
      {/* Top Header Bar */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-3 sm:px-6 py-3 pointer-events-none">
        {/* Left App Badge & Mode Switcher */}
        <div className="pointer-events-auto flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#18181c]/85 backdrop-blur-xl border border-white/15 rounded-full shadow-lg">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm font-bold tracking-tight text-white">Drawing Studio</span>
          </div>

          {/* Mode Switcher Pills: Free Draw vs Color by Number */}
          <div className="hidden sm:flex items-center p-1 bg-[#18181c]/85 backdrop-blur-xl border border-white/15 rounded-full shadow-lg">
            <button
              onClick={() => setAppMode('free-draw')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                appMode === 'free-draw'
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Trace & Draw</span>
            </button>
            <button
              onClick={() => setAppMode('color-by-number')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                appMode === 'color-by-number'
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-md'
                  : 'text-gray-300 hover:text-white'
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#18181c]/85 hover:bg-[#222228] border border-white/15 text-gray-200 hover:text-white text-xs font-bold transition-all shadow-lg"
                title="Watch Time-Lapse Replay"
              >
                <Film className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Replay</span>
              </button>

              {/* Trace Accuracy & Stats Button */}
              <button
                onClick={() => setIsAnalyticsModalOpen(true)}
                id="btn-top-stats"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#18181c]/85 hover:bg-[#222228] border border-white/15 text-gray-200 hover:text-white text-xs font-bold transition-all shadow-lg"
                title="View Trace Accuracy & Statistics"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Score</span>
              </button>

              {/* Export / Save to Photos Button */}
              <button
                onClick={() => setIsExportModalOpen(true)}
                id="btn-top-export"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#18181c]/85 hover:bg-[#222228] border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all shadow-lg"
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
                className="p-2 rounded-full bg-[#18181c]/85 hover:bg-[#222228] disabled:opacity-40 border border-white/10 text-gray-300 hover:text-white transition-all"
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
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#18181c]/85 hover:bg-[#222228] border border-white/15 text-gray-300 hover:text-white text-xs font-bold transition-all shadow-lg"
            title="View & Download Native iOS Swift Source Code"
          >
            <Code className="w-3.5 h-3.5" />
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
          <main className="flex-1 w-full h-full relative">
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
              isPeeking={isPeeking}
            />
          </main>

          {/* Bottom Floating Capsule Toolbar */}
          <footer className="absolute bottom-4 left-0 right-0 z-30 pointer-events-auto">
            <BottomToolbar
              currentTool={currentTool}
              onSelectTool={setCurrentTool}
              selectedColor={selectedColor}
              onSelectColor={setSelectedColor}
              lineWidth={lineWidth}
              onChangeLineWidth={setLineWidth}
              brushOpacity={brushOpacity}
              onChangeBrushOpacity={setBrushOpacity}
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
              guideMode={guideMode}
              onChangeGuideMode={setGuideMode}
              isPeeking={isPeeking}
              onStartPeeking={() => setIsPeeking(true)}
              onStopPeeking={() => setIsPeeking(false)}
              onOpenColorByNumber={() => setAppMode('color-by-number')}
              onClearCanvas={() => setIsClearModalOpen(true)}
              hasStrokes={lines.length > 0}
            />
          </footer>
        </>
      )}

      {/* 3 Offline Target Channels Modal */}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-[#1c1c20] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-base font-bold text-white">Erase All Drawing?</h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              This will clear your pencil and crayon strokes. Your tracing picture
              will stay on the screen so you can start fresh!
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsClearModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
              >
                Keep Drawing
              </button>
              <button
                onClick={handleClearCanvas}
                className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white transition-colors"
              >
                Erase Everything
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Startup 3 Random Options Modal */}
      {isStartupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-250">
          <div className="w-full max-w-lg bg-[#151518] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>Pick a Picture to Draw</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                    3 Fun Ideas
                  </span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Choose one of these random pictures to trace, or shuffle for 3 new ones:
                </p>
              </div>
              <button
                onClick={() => setIsStartupModalOpen(false)}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
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
                    className="group flex flex-col items-center text-center p-4 rounded-2xl bg-[#1d1d22] hover:bg-[#25252b] border border-white/10 hover:border-cyan-500/40 transition-all hover:scale-105 active:scale-95 shadow-lg"
                  >
                    <div className="w-16 h-16 rounded-xl bg-black/30 border border-white/5 group-hover:bg-cyan-500/10 flex items-center justify-center p-2 transition-colors mb-2">
                      <VectorShape type={shapeKey} strokeColor="#22d3ee" strokeWidth={2.8} />
                    </div>
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {meta?.name || shapeKey}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-gray-400 mt-1 px-1.5 py-0.5 rounded bg-white/5">
                      {meta?.category || 'picture'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Secondary Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2 border-t border-white/10">
              <button
                onClick={handleShuffleStartupOptions}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-colors border border-white/10"
              >
                <Dices className="w-4 h-4 text-cyan-400" />
                <span>Shuffle 3 New Ideas</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setIsStartupModalOpen(false);
                    setIsTargetModalOpen(true);
                  }}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-colors shadow-lg shadow-cyan-500/20"
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
