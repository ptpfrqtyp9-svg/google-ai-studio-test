import React, { useState } from 'react';
import { CompositionGuideMode, DrawingTool } from '../types';
import { KidColorPickerModal, CRAYON_COLORS } from './KidColorPickerModal';
import {
  Sparkles,
  Move,
  Eye,
  EyeOff,
  PenLine,
  Pencil,
  Highlighter,
  Eraser,
  Undo2,
  Redo2,
  Share2,
  Palette,
  Layers,
  Trash2,
} from 'lucide-react';

interface BottomToolbarProps {
  currentTool: DrawingTool;
  onSelectTool: (tool: DrawingTool) => void;
  selectedColor: string;
  onSelectColor: (color: string) => void;
  lineWidth: number;
  onChangeLineWidth: (width: number) => void;
  brushOpacity: number;
  onChangeBrushOpacity: (opacity: number) => void;
  referenceOpacity: number;
  onChangeReferenceOpacity: (opacity: number) => void;
  isReferenceVisible: boolean;
  onToggleEye: () => void;
  isAdjustingReference: boolean;
  onToggleAdjustReference: () => void;
  onOpenTargetModal: () => void;
  onOpenExportModal: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  guideMode: CompositionGuideMode;
  onChangeGuideMode: (mode: CompositionGuideMode) => void;
  isPeeking: boolean;
  onStartPeeking: () => void;
  onStopPeeking: () => void;
  onOpenColorByNumber: () => void;
  onClearCanvas: () => void;
  hasStrokes: boolean;
}

// Quick popular kid colors shown directly on the toolbar capsule
const QUICK_KID_COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#facc15', // Yellow
  '#22c55e', // Green
  '#0ea5e9', // Blue
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#18181b', // Charcoal
];

export const BottomToolbar: React.FC<BottomToolbarProps> = ({
  currentTool,
  onSelectTool,
  selectedColor,
  onSelectColor,
  lineWidth,
  onChangeLineWidth,
  referenceOpacity,
  onChangeReferenceOpacity,
  isReferenceVisible,
  onToggleEye,
  isAdjustingReference,
  onToggleAdjustReference,
  onOpenTargetModal,
  onOpenExportModal,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  isPeeking,
  onStartPeeking,
  onStopPeeking,
  onOpenColorByNumber,
  onClearCanvas,
  hasStrokes,
}) => {
  const [isColorModalOpen, setIsColorModalOpen] = useState<boolean>(false);
  const [isFaintnessOpen, setIsFaintnessOpen] = useState<boolean>(false);

  return (
    <>
      {/* Full Kid Color Studio Modal */}
      <KidColorPickerModal
        isOpen={isColorModalOpen}
        onClose={() => setIsColorModalOpen(false)}
        selectedColor={selectedColor}
        onSelectColor={(color) => {
          onSelectColor(color);
          if (currentTool === 'eraser') onSelectTool('pen');
        }}
        lineWidth={lineWidth}
        onChangeLineWidth={onChangeLineWidth}
      />

      <div className="flex flex-col items-center gap-2.5 w-full max-w-4xl mx-auto px-2 select-none">
        {/* Kid-Friendly Picture Faintness Capsule */}
        {isFaintnessOpen && (
          <div className="bg-[#18181e]/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-3.5 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150 flex items-center gap-3">
            <span className="text-xs font-bold text-gray-200">Picture Faintness:</span>

            {/* Quick 3 levels: Ghostly (20%), Just Right (45%), Bright (75%) */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  onChangeReferenceOpacity(0.2);
                  if (!isReferenceVisible) onToggleEye();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  Math.abs(referenceOpacity - 0.2) < 0.1 && isReferenceVisible
                    ? 'bg-cyan-500 text-black shadow-md'
                    : 'bg-white/10 hover:bg-white/15 text-gray-300'
                }`}
              >
                👻 Faint
              </button>
              <button
                onClick={() => {
                  onChangeReferenceOpacity(0.45);
                  if (!isReferenceVisible) onToggleEye();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  Math.abs(referenceOpacity - 0.45) < 0.1 && isReferenceVisible
                    ? 'bg-cyan-500 text-black shadow-md'
                    : 'bg-white/10 hover:bg-white/15 text-gray-300'
                }`}
              >
                ✨ Medium
              </button>
              <button
                onClick={() => {
                  onChangeReferenceOpacity(0.75);
                  if (!isReferenceVisible) onToggleEye();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  Math.abs(referenceOpacity - 0.75) < 0.1 && isReferenceVisible
                    ? 'bg-cyan-500 text-black shadow-md'
                    : 'bg-white/10 hover:bg-white/15 text-gray-300'
                }`}
              >
                🌟 Bright
              </button>
            </div>

            <div className="w-px h-5 bg-white/20 mx-1" />

            {/* Eye Hide / Show */}
            <button
              onClick={onToggleEye}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isReferenceVisible
                  ? 'bg-white/10 text-cyan-400 hover:bg-white/15'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}
            >
              {isReferenceVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{isReferenceVisible ? 'Hide Picture' : 'Show Picture'}</span>
            </button>
          </div>
        )}

        {/* Floating Quick Color Swatches Bar */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#18181c]/80 backdrop-blur-xl border border-white/10 rounded-full shadow-lg overflow-x-auto max-w-full">
          <span className="text-[11px] font-bold text-gray-300 pl-1">Colors:</span>
          {QUICK_KID_COLORS.map((color) => {
            const isSelected = selectedColor.toLowerCase() === color.toLowerCase() && currentTool !== 'eraser';
            return (
              <button
                key={color}
                onClick={() => {
                  onSelectColor(color);
                  if (currentTool === 'eraser') onSelectTool('pen');
                }}
                className={`w-7 h-7 rounded-full flex-shrink-0 transition-transform ${
                  isSelected
                    ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#18181c] shadow-lg'
                    : 'hover:scale-110 opacity-90'
                }`}
                style={{ backgroundColor: color }}
              />
            );
          })}

          {/* More Colors Button with Rainbow Palette Icon */}
          <button
            onClick={() => setIsColorModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all flex-shrink-0"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>More Colors...</span>
          </button>
        </div>

        {/* Main Floating Kid-Friendly Capsule Toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 bg-[#18181c]/90 backdrop-blur-2xl border border-white/15 rounded-full shadow-2xl overflow-x-auto max-w-full">
          {/* 1. Tracing Picture Library */}
          <button
            onClick={onOpenTargetModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-black text-xs font-black shadow-lg shadow-cyan-500/20 active:scale-95 transition-all flex-shrink-0"
            title="Choose a Tracing Picture"
          >
            <Sparkles className="w-4 h-4 text-black stroke-[2.5]" />
            <span>Pictures</span>
          </button>

          {/* 2. Color-by-Number Button matching user request & IMG_3933.jpg */}
          <button
            onClick={onOpenColorByNumber}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black text-xs font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex-shrink-0"
            title="Play Color-by-Number!"
          >
            <span className="text-sm">🔢</span>
            <span>Color by Number</span>
          </button>

          <div className="w-px h-6 bg-white/20 mx-0.5 flex-shrink-0" />

          {/* 3. Drawing Tools: Pen & Marker */}
          <button
            onClick={() => onSelectTool('pen')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
              currentTool === 'pen'
                ? 'bg-white text-black shadow-lg'
                : 'bg-white/10 hover:bg-white/15 text-white'
            }`}
            title="Crayon / Pen"
          >
            <PenLine className="w-4 h-4" />
            <span className="hidden sm:inline">Draw</span>
          </button>

          {/* 4. Eraser */}
          <button
            onClick={() => {
              if (currentTool === 'eraser') {
                onSelectTool('pen');
              } else {
                onSelectTool('eraser');
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
              currentTool === 'eraser'
                ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/30'
                : 'bg-white/10 hover:bg-white/15 text-white'
            }`}
            title="Eraser"
          >
            <Eraser className="w-4 h-4" />
            <span className="hidden sm:inline">Eraser</span>
          </button>

          {/* 5. Picture Faintness Toggle */}
          <button
            onClick={() => setIsFaintnessOpen(!isFaintnessOpen)}
            className={`flex items-center gap-1 px-3 py-2 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
              isFaintnessOpen
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                : 'bg-white/10 hover:bg-white/15 text-gray-200'
            }`}
            title="Adjust Picture Faintness"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden md:inline">Faintness</span>
          </button>

          {/* 6. Move & Zoom Button */}
          <button
            onClick={onToggleAdjustReference}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
              isAdjustingReference
                ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/30 font-black'
                : 'bg-white/10 hover:bg-white/15 text-white'
            }`}
            title={isAdjustingReference ? 'Done moving picture' : 'Move & Zoom picture'}
          >
            <Move className="w-4 h-4" />
            <span className="hidden lg:inline">Move & Zoom</span>
          </button>

          {/* 7. Hold to Peek */}
          <button
            onMouseDown={onStartPeeking}
            onMouseUp={onStopPeeking}
            onMouseLeave={onStopPeeking}
            onTouchStart={onStartPeeking}
            onTouchEnd={onStopPeeking}
            className={`flex items-center gap-1 px-3 py-2 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
              isPeeking
                ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/40'
                : 'bg-white/10 hover:bg-white/15 text-gray-200'
            }`}
            title="Hold to see clear picture"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden md:inline">Peek</span>
          </button>

          <div className="w-px h-6 bg-white/20 mx-0.5 flex-shrink-0" />

          {/* 8. Undo & Redo */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="p-2 rounded-full bg-white/10 hover:bg-white/15 text-white disabled:opacity-30 disabled:pointer-events-none transition-opacity"
              title="Undo stroke"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="p-2 rounded-full bg-white/10 hover:bg-white/15 text-white disabled:opacity-30 disabled:pointer-events-none transition-opacity"
              title="Redo stroke"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* 9. Erase All / Clear Canvas */}
          <button
            onClick={onClearCanvas}
            disabled={!hasStrokes}
            className="p-2 rounded-full bg-white/10 hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
            title="Erase All Strokes"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* 10. Save / Export Drawing */}
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 text-xs font-bold transition-all shadow-sm flex-shrink-0"
            title="Save Picture"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
      </div>
    </>
  );
};
