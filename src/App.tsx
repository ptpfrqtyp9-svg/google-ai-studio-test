import React, { useState, useCallback } from 'react';
import {
  CompositionGuideMode,
  DrawingLine,
  DrawingTool,
  ReferenceTarget,
  ReferenceTransform,
  StrokePoint,
  VectorShapeType,
} from './types';
import { DualLayerCanvas } from './components/DualLayerCanvas';
import { BottomToolbar } from './components/BottomToolbar';
import { ImageChannelsModal } from './components/ImageChannelsModal';
import { SwiftSourceModal } from './components/SwiftSourceModal';
import { ExportPhotoModal } from './components/ExportPhotoModal';
import { TimeLapseReplayModal } from './components/TimeLapseReplayModal';
import { TraceAnalyticsModal } from './components/TraceAnalyticsModal';
import {
  Sparkles,
  Trash2,
  Code,
  Share2,
  AlertTriangle,
  Film,
  Trophy,
} from 'lucide-react';

const MAX_UNDO_STEPS = 15;

export default function App() {
  // Canvas stroke history & state
  const [lines, setLines] = useState<DrawingLine[]>([]);
  const [currentLine, setCurrentLine] = useState<DrawingLine | null>(null);

  // 15-Step Undo/Redo Matrix
  const [undoStack, setUndoStack] = useState<DrawingLine[][]>([]);
  const [redoStack, setRedoStack] = useState<DrawingLine[][]>([]);

  // Active Tool & Brush Kit settings
  const [currentTool, setCurrentTool] = useState<DrawingTool>('pen');
  const [selectedColor, setSelectedColor] = useState<string>('#007aff');
  const [lineWidth, setLineWidth] = useState<number>(6);
  const [brushOpacity, setBrushOpacity] = useState<number>(1.0);

  // Reference Target & Opacity settings
  const [referenceTarget, setReferenceTarget] = useState<ReferenceTarget>({
    type: 'vector',
    vectorShape: 'star',
  });
  const [referenceOpacity, setReferenceOpacity] = useState<number>(0.45);
  const [lastActiveReferenceOpacity, setLastActiveReferenceOpacity] = useState<number>(0.45);
  const [isReferenceVisible, setIsReferenceVisible] = useState<boolean>(true);

  // Hold-to-Peek & Composition Guides
  const [isPeeking, setIsPeeking] = useState<boolean>(false);
  const [guideMode, setGuideMode] = useState<CompositionGuideMode>('none');

  // Decoupled Gesture Control for Template Layer
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

  // Quick Eye Toggle (flips opacity between 0% and active opacity)
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

  // Target Selection Handlers
  const handleSelectVector = (shape: VectorShapeType) => {
    setReferenceTarget({
      type: 'vector',
      vectorShape: shape,
    });
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
    setReferenceTransform({ x: 0, y: 0, scale: 1.0 });
    if (referenceOpacity === 0) {
      setReferenceOpacity(lastActiveReferenceOpacity);
      setIsReferenceVisible(true);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a0a0c] text-white flex flex-col select-none">
      {/* Top Header Bar */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-3 sm:px-6 py-3 pointer-events-none">
        {/* App Title Pill */}
        <div className="pointer-events-auto flex items-center gap-2.5 px-3.5 py-1.5 bg-[#18181c]/85 backdrop-blur-xl border border-white/15 rounded-full shadow-lg">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-sm font-bold tracking-tight text-white">TraceDraw iOS</span>
          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-white/10 text-cyan-300">
            Offline Pro
          </span>
        </div>

        {/* Right Actions */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
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
            title="Export Drawing to Photos"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Export</span>
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

          {/* Native Swift Code & Download Hub */}
          <button
            onClick={() => setIsSwiftModalOpen(true)}
            id="btn-swift-code"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#18181c]/85 hover:bg-[#222228] border border-white/15 text-gray-300 hover:text-white text-xs font-bold transition-all shadow-lg"
            title="View & Download Native iOS Swift Source Code"
          >
            <Code className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Swift Source</span>
          </button>
        </div>
      </header>

      {/* Main Dual-Layer Canvas Workspace */}
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
          onOpenReplayModal={() => setIsReplayModalOpen(true)}
          onOpenAnalyticsModal={() => setIsAnalyticsModalOpen(true)}
        />
      </footer>

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
              <h3 className="text-base font-bold text-white">Clear Drawing Strokes?</h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              This will clear all your foreground sketch strokes. Your underlying tracing target
              template will remain untouched.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsClearModalOpen(false)}
                className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleClearCanvas}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-bold text-white transition-colors"
              >
                Clear Canvas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
