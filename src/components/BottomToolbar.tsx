import React, { useState } from 'react';
import { DrawingTool, EraserSize } from '../types';
import {
  Sparkles,
  Move,
  Eye,
  EyeOff,
  Eraser,
  Undo2,
  Redo2,
  Share2,
} from 'lucide-react';

interface BottomToolbarProps {
  currentTool: DrawingTool;
  onSelectTool: (tool: DrawingTool) => void;
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
  onOpenColorByNumber: () => void;
  hasStrokes: boolean;
  eraserSize: EraserSize;
  onChangeEraserSize: (size: EraserSize) => void;
}

export const BottomToolbar: React.FC<BottomToolbarProps> = ({
  currentTool,
  onSelectTool,
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
  onOpenColorByNumber,
  eraserSize,
  onChangeEraserSize,
}) => {
  const [isFaintnessOpen, setIsFaintnessOpen] = useState<boolean>(false);
  const [isEraserMenuOpen, setIsEraserMenuOpen] = useState<boolean>(false);

  return (
    <div className="flex flex-col items-center gap-2 max-w-4xl mx-auto px-2 sm:px-4">
      {/* 1. Picture Faintness Capsule (Quick touch-friendly popover) */}
      {isFaintnessOpen && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/95 backdrop-blur-xl border-2 border-amber-300 rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-150 select-none text-gray-800">
          <span className="text-[11px] font-black text-amber-900 pl-1">
            Picture Faintness:
          </span>

          {/* Quick 1-tap presets */}
          <button
            onClick={() => onChangeReferenceOpacity(0.18)}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              Math.abs(referenceOpacity - 0.18) < 0.05
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Faint Ghost
          </button>
          <button
            onClick={() => onChangeReferenceOpacity(0.45)}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              Math.abs(referenceOpacity - 0.45) < 0.05
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Medium
          </button>
          <button
            onClick={() => onChangeReferenceOpacity(0.85)}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              Math.abs(referenceOpacity - 0.85) < 0.05
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Bright
          </button>

          {/* Hide/Show Picture Eye button */}
          <button
            onClick={onToggleEye}
            className={`p-1.5 rounded-xl border transition-colors ${
              isReferenceVisible
                ? 'bg-sky-100 border-sky-300 text-sky-700'
                : 'bg-gray-200 border-gray-300 text-gray-500'
            }`}
            title={isReferenceVisible ? 'Hide Picture' : 'Show Picture'}
          >
            {isReferenceVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}

      {/* 2. Eraser Size Mini Capsule */}
      {isEraserMenuOpen && currentTool === 'eraser' && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/95 backdrop-blur-xl border-2 border-rose-300 rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-150 select-none text-gray-800">
          <span className="text-[11px] font-black text-rose-700 pl-1">
            Eraser Size:
          </span>
          {(['small', 'medium', 'large'] as EraserSize[]).map((size) => (
            <button
              key={size}
              onClick={() => {
                onChangeEraserSize(size);
                setIsEraserMenuOpen(false);
              }}
              className={`px-2.5 py-0.5 rounded-lg text-xs font-bold capitalize transition-all ${
                eraserSize === size
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {size === 'large' ? 'Big' : size}
            </button>
          ))}
        </div>
      )}

      {/* 3. Primary Bottom Kid-Friendly Action Capsule */}
      <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-white/95 backdrop-blur-2xl border-2 border-amber-300 rounded-full shadow-2xl overflow-x-auto max-w-full">
        {/* Pictures Library */}
        <button
          onClick={onOpenTargetModal}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black transition-transform hover:scale-105 active:scale-95 shadow-md flex-shrink-0"
          title="Choose a Picture to Draw"
        >
          <Sparkles className="w-4 h-4" />
          <span>Pictures</span>
        </button>

        {/* Color by Number Toggle */}
        <button
          onClick={onOpenColorByNumber}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black text-xs font-black transition-transform hover:scale-105 active:scale-95 shadow-md flex-shrink-0"
          title="Play Color by Number"
        >
          <span className="text-xs">🔢</span>
          <span className="hidden sm:inline">Color by Number</span>
        </button>

        <div className="w-px h-6 bg-gray-300 mx-0.5 flex-shrink-0" />

        {/* Object Eraser */}
        <button
          onClick={() => {
            if (currentTool === 'eraser') {
              setIsEraserMenuOpen(!isEraserMenuOpen);
            } else {
              onSelectTool('eraser');
              setIsEraserMenuOpen(true);
            }
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
            currentTool === 'eraser'
              ? 'bg-rose-500 text-white shadow-md scale-105 ring-2 ring-rose-300'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          title="Object Eraser (Tap to change size or swipe across any line to delete it)"
        >
          <Eraser className="w-4 h-4" />
          <span>Eraser</span>
        </button>

        {/* Picture Faintness Toggle */}
        <button
          onClick={() => setIsFaintnessOpen(!isFaintnessOpen)}
          className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
            isFaintnessOpen
              ? 'bg-amber-100 text-amber-800 border border-amber-300'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          title="Adjust Picture Faintness"
        >
          <Eye className="w-4 h-4" />
          <span className="hidden md:inline">Faintness</span>
        </button>

        {/* Move & Zoom Button */}
        <button
          onClick={onToggleAdjustReference}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0 ${
            isAdjustingReference
              ? 'bg-amber-500 text-white shadow-md font-black ring-2 ring-amber-300'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          title={isAdjustingReference ? 'Done moving picture' : 'Move & Zoom picture'}
        >
          <Move className="w-4 h-4" />
          <span className="hidden lg:inline">Move & Zoom</span>
        </button>

        <div className="w-px h-6 bg-gray-300 mx-0.5 flex-shrink-0" />

        {/* Undo & Redo */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 disabled:opacity-30 disabled:pointer-events-none transition-opacity"
            title="Undo stroke"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 sm:p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 disabled:opacity-30 disabled:pointer-events-none transition-opacity"
            title="Redo stroke"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Save / Export Drawing */}
        <button
          onClick={onOpenExportModal}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-sky-100 hover:bg-sky-200 text-sky-800 text-xs font-bold transition-all shadow-xs flex-shrink-0"
          title="Save Picture"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Save</span>
        </button>
      </div>
    </div>
  );
};
