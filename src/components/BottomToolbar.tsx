import React, { useState } from 'react';
import { CompositionGuideMode, DrawingTool } from '../types';
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
  Sliders,
  Share2,
  Grid,
  Film,
  Trophy,
  Palette,
  Pipette,
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
  onOpenReplayModal: () => void;
  onOpenAnalyticsModal: () => void;
}

export const COLOR_PALETTES = [
  {
    name: 'iOS Neon Studio',
    colors: ['#007aff', '#5856d6', '#af52de', '#ff2d55', '#ff3b30', '#ff9500', '#ffcc00', '#34c759', '#22d3ee', '#ffffff', '#1c1c1e'],
  },
  {
    name: 'Pastel Blossom',
    colors: ['#a7f3d0', '#bfdbfe', '#ddd6fe', '#fbcfe8', '#fecdd3', '#fed7aa', '#fef08a', '#e2e8f0'],
  },
  {
    name: 'Earthy Botanical',
    colors: ['#3f6212', '#15803d', '#b45309', '#78350f', '#ca8a04', '#475569', '#292524', '#f5f5f4'],
  },
  {
    name: 'Manga & Ink',
    colors: ['#000000', '#1f2937', '#4b5563', '#9ca3af', '#e5e7eb', '#ffffff', '#ef4444', '#f59e0b'],
  },
];

export const BottomToolbar: React.FC<BottomToolbarProps> = ({
  currentTool,
  onSelectTool,
  selectedColor,
  onSelectColor,
  lineWidth,
  onChangeLineWidth,
  brushOpacity,
  onChangeBrushOpacity,
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
  guideMode,
  onChangeGuideMode,
  isPeeking,
  onStartPeeking,
  onStopPeeking,
  onOpenReplayModal,
  onOpenAnalyticsModal,
}) => {
  const [isBrushPanelOpen, setIsBrushPanelOpen] = useState<boolean>(false);
  const [isSlidersPanelOpen, setIsSlidersPanelOpen] = useState<boolean>(false);
  const [activePaletteIndex, setActivePaletteIndex] = useState<number>(0);

  // Cycle Guides: none -> ruleOfThirds -> crosshair -> dots -> none
  const handleCycleGuides = () => {
    if (guideMode === 'none') onChangeGuideMode('ruleOfThirds');
    else if (guideMode === 'ruleOfThirds') onChangeGuideMode('crosshair');
    else if (guideMode === 'crosshair') onChangeGuideMode('dots');
    else onChangeGuideMode('none');
  };

  const currentPalette = COLOR_PALETTES[activePaletteIndex];

  return (
    <div className="flex flex-col items-center gap-2.5 w-full max-w-2xl mx-auto px-2 select-none">
      {/* Expandable Brush Kit, Tool Options & Color Studio */}
      {isBrushPanelOpen && (
        <div className="w-full bg-[#1c1c20]/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-4 shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200 space-y-4">
          {/* Pro Tool Selection Tabs */}
          <div className="flex items-center justify-between gap-1 p-1 bg-black/40 rounded-2xl border border-white/10">
            <button
              onClick={() => onSelectTool('pen')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                currentTool === 'pen'
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <PenLine className="w-3.5 h-3.5" />
              <span>Studio Pen</span>
            </button>

            <button
              onClick={() => onSelectTool('pencil')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                currentTool === 'pencil'
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Graphite</span>
            </button>

            <button
              onClick={() => onSelectTool('highlighter')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                currentTool === 'highlighter'
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Highlighter className="w-3.5 h-3.5" />
              <span>Marker</span>
            </button>

            <button
              onClick={() => onSelectTool('eraser')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-bold transition-all ${
                currentTool === 'eraser'
                  ? 'bg-white text-black shadow-lg shadow-white/10'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Eraser className="w-3.5 h-3.5" />
              <span>Eraser</span>
            </button>
          </div>

          {/* Line Thickness Slider */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-300 w-20">Size</span>
            <input
              type="range"
              min="1"
              max="45"
              step="1"
              value={lineWidth}
              onChange={(e) => onChangeLineWidth(Number(e.target.value))}
              className="flex-1 accent-cyan-400 cursor-pointer h-1.5 bg-white/20 rounded-lg appearance-none"
            />
            <span className="text-xs font-mono font-bold text-white w-12 text-right">
              {lineWidth} pt
            </span>
          </div>

          {/* Brush Opacity Slider */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-300 w-20">Opacity</span>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={brushOpacity}
              onChange={(e) => onChangeBrushOpacity(Number(e.target.value))}
              className="flex-1 accent-cyan-400 cursor-pointer h-1.5 bg-white/20 rounded-lg appearance-none"
            />
            <span className="text-xs font-mono font-bold text-white w-12 text-right">
              {Math.round(brushOpacity * 100)}%
            </span>
          </div>

          {/* Color Palette Switcher & Custom Spectrum Picker */}
          <div className="space-y-2 pt-1 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                {COLOR_PALETTES.map((p, idx) => (
                  <button
                    key={p.name}
                    onClick={() => setActivePaletteIndex(idx)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                      activePaletteIndex === idx
                        ? 'bg-white/20 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>

              {/* Native / Custom Hex Color Input */}
              <label className="relative cursor-pointer flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-gray-200">
                <Pipette className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-[11px] font-medium hidden sm:inline">Custom</span>
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => {
                    onSelectColor(e.target.value);
                    if (currentTool === 'eraser') onSelectTool('pen');
                  }}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                />
              </label>
            </div>

            {/* Palette Swatches */}
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {currentPalette.colors.map((color) => {
                const isSelected = selectedColor === color && currentTool !== 'eraser';
                return (
                  <button
                    key={color}
                    onClick={() => {
                      onSelectColor(color);
                      if (currentTool === 'eraser') onSelectTool('pen');
                    }}
                    className={`w-7 h-7 rounded-full flex-shrink-0 transition-transform ${
                      isSelected
                        ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#1c1c20]'
                        : 'hover:scale-110 opacity-90'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Expandable Reference Alpha Slider */}
      {isSlidersPanelOpen && (
        <div className="w-full bg-[#1c1c20]/95 backdrop-blur-2xl border border-white/15 rounded-2xl px-4 py-3 shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-cyan-300 w-24">Template Alpha</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={referenceOpacity}
              onChange={(e) => onChangeReferenceOpacity(Number(e.target.value))}
              className="flex-1 accent-cyan-400 cursor-pointer h-1.5 bg-white/20 rounded-lg appearance-none"
            />
            <span className="text-xs font-mono font-bold text-cyan-300 w-12 text-right">
              {Math.round(referenceOpacity * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Main Floating Capsule Toolbar */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-[#18181c]/90 backdrop-blur-2xl border border-white/15 rounded-full shadow-2xl overflow-x-auto max-w-full">
        {/* 1. Target Selector */}
        <button
          onClick={onOpenTargetModal}
          id="btn-target-selector"
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors flex-shrink-0"
          title="Open Tracing Target Library & Importer"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Target</span>
        </button>

        {/* 2. Adjust Reference Alignment */}
        <button
          onClick={onToggleAdjustReference}
          id="btn-adjust-reference"
          className={`p-2 rounded-full transition-colors flex-shrink-0 ${
            isAdjustingReference
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
              : 'bg-white/10 hover:bg-white/15 text-white'
          }`}
          title={isAdjustingReference ? 'Finish Adjusting Template' : 'Pan/Scale Template'}
        >
          <Move className="w-4 h-4" />
        </button>

        {/* 3. Hold-to-Peek Button (Press to view 100% template) */}
        <button
          onMouseDown={onStartPeeking}
          onMouseUp={onStopPeeking}
          onMouseLeave={onStopPeeking}
          onTouchStart={onStartPeeking}
          onTouchEnd={onStopPeeking}
          id="btn-hold-peek"
          className={`flex items-center gap-1 px-2.5 py-2 rounded-full text-xs font-bold transition-colors flex-shrink-0 ${
            isPeeking
              ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/40'
              : 'bg-white/10 hover:bg-white/15 text-gray-200'
          }`}
          title="Hold to Peek Template at 100% Opacity"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Peek</span>
        </button>

        {/* 4. Quick Eye Toggle */}
        <button
          onClick={onToggleEye}
          id="btn-quick-eye"
          className={`p-2 rounded-full transition-colors flex-shrink-0 ${
            isReferenceVisible
              ? 'bg-white/10 text-cyan-400 hover:bg-white/15'
              : 'bg-white/5 text-gray-500 hover:bg-white/10'
          }`}
          title="Toggle Reference Visibility"
        >
          {isReferenceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>

        {/* 5. Alpha Sliders Button */}
        <button
          onClick={() => setIsSlidersPanelOpen(!isSlidersPanelOpen)}
          className={`p-2 rounded-full transition-colors flex-shrink-0 ${
            isSlidersPanelOpen ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/10 hover:bg-white/15 text-gray-300'
          }`}
          title="Adjust Template Opacity"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* 6. Composition Guide Mode Toggle */}
        <button
          onClick={handleCycleGuides}
          className={`p-2 rounded-full transition-colors flex-shrink-0 ${
            guideMode !== 'none'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'bg-white/10 hover:bg-white/15 text-gray-300'
          }`}
          title={`Composition Guides: ${guideMode} (Click to cycle)`}
        >
          <Grid className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-white/20 mx-0.5 flex-shrink-0" />

        {/* 7. Active Tool & Brush Kit Options */}
        <button
          onClick={() => setIsBrushPanelOpen(!isBrushPanelOpen)}
          id="btn-brush-options"
          className={`flex items-center gap-1.5 px-3 py-2 rounded-full transition-colors flex-shrink-0 ${
            isBrushPanelOpen || currentTool !== 'eraser'
              ? 'bg-white text-black font-bold'
              : 'bg-white/10 hover:bg-white/15 text-white'
          }`}
          title="Select Drawing Tool & Palettes"
        >
          {currentTool === 'pen' && <PenLine className="w-4 h-4" />}
          {currentTool === 'pencil' && <Pencil className="w-4 h-4" />}
          {currentTool === 'highlighter' && <Highlighter className="w-4 h-4" />}
          {currentTool === 'eraser' && <Eraser className="w-4 h-4" />}
          <div
            className="w-2.5 h-2.5 rounded-full border border-black/30"
            style={{ backgroundColor: currentTool === 'eraser' ? '#ffffff' : selectedColor }}
          />
        </button>

        {/* 8. Eraser Shortcut */}
        <button
          onClick={() => {
            if (currentTool === 'eraser') {
              onSelectTool('pen');
            } else {
              onSelectTool('eraser');
            }
          }}
          className={`p-2 rounded-full transition-colors flex-shrink-0 ${
            currentTool === 'eraser'
              ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/30'
              : 'bg-white/10 hover:bg-white/15 text-white'
          }`}
          title="Eraser Tool"
        >
          <Eraser className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-white/20 mx-0.5 flex-shrink-0" />

        {/* 9. 15-Step Undo & Redo */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            id="btn-undo"
            className="p-2 rounded-full bg-white/10 hover:bg-white/15 text-white disabled:opacity-30 disabled:pointer-events-none transition-opacity"
            title="Undo"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            id="btn-redo"
            className="p-2 rounded-full bg-white/10 hover:bg-white/15 text-white disabled:opacity-30 disabled:pointer-events-none transition-opacity"
            title="Redo"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="w-px h-6 bg-white/20 mx-0.5 flex-shrink-0" />

        {/* 10. Replay Time-Lapse Button */}
        <button
          onClick={onOpenReplayModal}
          id="btn-time-lapse"
          className="p-2 rounded-full bg-white/10 hover:bg-white/15 text-gray-200 hover:text-white transition-colors flex-shrink-0"
          title="Watch Time-Lapse Replay"
        >
          <Film className="w-4 h-4" />
        </button>

        {/* 11. Trace Analytics Button */}
        <button
          onClick={onOpenAnalyticsModal}
          id="btn-trace-analytics"
          className="p-2 rounded-full bg-white/10 hover:bg-white/15 text-gray-200 hover:text-white transition-colors flex-shrink-0"
          title="View Tracing Accuracy & Stats"
        >
          <Trophy className="w-4 h-4" />
        </button>

        {/* 12. Export to Photos */}
        <button
          onClick={onOpenExportModal}
          id="btn-export-photos"
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 text-xs font-bold transition-all shadow-sm flex-shrink-0"
          title="Export Drawing to Photos"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
};
