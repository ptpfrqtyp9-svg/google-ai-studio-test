import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ColorByNumberTemplate } from '../types';
import {
  Sparkles,
  Grid,
  Lightbulb,
  RotateCcw,
  Trophy,
  Check,
  ChevronLeft,
  ChevronRight,
  Share2,
} from 'lucide-react';

interface ColorByNumberViewProps {
  onBackToDrawing: () => void;
  onExportImage?: (canvasDataUrl: string) => void;
}

// Built-in Kid-Friendly Color By Number Templates
export const COLOR_BY_NUMBER_TEMPLATES: ColorByNumberTemplate[] = [
  {
    id: 'bee',
    name: 'Buzzy Bee',
    category: 'Animals & Nature',
    cols: 12,
    rows: 12,
    palette: [
      { number: 1, color: '#38bdf8', name: 'Sky Blue (Wings)' },
      { number: 2, color: '#facc15', name: 'Sunny Yellow (Body)' },
      { number: 3, color: '#27272a', name: 'Charcoal Black (Eyes & Stripes)' },
    ],
    grid: [
      [0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0],
      [0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0],
      [1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1],
      [1, 1, 1, 2, 3, 2, 2, 3, 2, 1, 1, 1],
      [1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1],
      [0, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 0],
      [0, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 0],
      [0, 1, 1, 1, 3, 3, 3, 3, 1, 1, 1, 0],
      [0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 3, 3, 0, 0, 0, 0, 0],
    ],
  },
  {
    id: 'rocket',
    name: 'Cosmic Rocket',
    category: 'Vehicles',
    cols: 12,
    rows: 12,
    palette: [
      { number: 1, color: '#f97316', name: 'Flame Orange' },
      { number: 2, color: '#ef4444', name: 'Rocket Red' },
      { number: 3, color: '#3b82f6', name: 'Cosmic Blue' },
      { number: 4, color: '#ffffff', name: 'Star White' },
    ],
    grid: [
      [0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 2, 4, 4, 2, 0, 0, 0, 0],
      [0, 0, 0, 0, 2, 4, 4, 2, 0, 0, 0, 0],
      [0, 0, 0, 0, 4, 3, 3, 4, 0, 0, 0, 0],
      [0, 0, 0, 0, 4, 3, 3, 4, 0, 0, 0, 0],
      [0, 0, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0],
      [0, 0, 0, 2, 4, 4, 4, 4, 2, 0, 0, 0],
      [0, 0, 2, 2, 4, 4, 4, 4, 2, 2, 0, 0],
      [0, 2, 2, 0, 4, 4, 4, 4, 0, 2, 2, 0],
      [0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
    ],
  },
  {
    id: 'heart',
    name: 'Magic Heart',
    category: 'Basic Shapes',
    cols: 11,
    rows: 11,
    palette: [
      { number: 1, color: '#f43f5e', name: 'Ruby Red' },
      { number: 2, color: '#ec4899', name: 'Bubblegum Pink' },
      { number: 3, color: '#fef08a', name: 'Golden Sparkle' },
    ],
    grid: [
      [0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0],
      [1, 2, 2, 1, 0, 0, 0, 1, 2, 2, 1],
      [1, 2, 3, 2, 1, 0, 1, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
      [0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0],
      [0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0],
      [0, 0, 0, 1, 2, 2, 2, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
  },
  {
    id: 'flower',
    name: 'Happy Sunflower',
    category: 'Animals & Nature',
    cols: 11,
    rows: 11,
    palette: [
      { number: 1, color: '#facc15', name: 'Sunflower Yellow' },
      { number: 2, color: '#78350f', name: 'Cocoa Brown (Center)' },
      { number: 3, color: '#22c55e', name: 'Garden Green (Stem)' },
      { number: 4, color: '#38bdf8', name: 'Sky Sparkle' },
    ],
    grid: [
      [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 2, 2, 2, 2, 2, 1, 1, 0],
      [1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1],
      [1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1],
      [0, 1, 1, 2, 2, 2, 2, 2, 1, 1, 0],
      [0, 0, 1, 1, 1, 3, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 3, 3, 1, 0, 0, 0, 0],
      [0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0],
    ],
  },
];

// Offline Web Audio chime synthesizer
class SoundFX {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playPop() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {
      // Audio autoplay restriction safe fallback
    }
  }

  playWrong() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.13);
    } catch {}
  }

  playFanfare() {
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.25, this.ctx!.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx!.currentTime + idx * 0.12 + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(this.ctx!.currentTime + idx * 0.12);
        osc.stop(this.ctx!.currentTime + idx * 0.12 + 0.45);
      });
    } catch {}
  }
}

const sfx = new SoundFX();

export const ColorByNumberView: React.FC<ColorByNumberViewProps> = ({
  onBackToDrawing,
  onExportImage,
}) => {
  const [templateIndex, setTemplateIndex] = useState<number>(0);
  const currentTemplate = COLOR_BY_NUMBER_TEMPLATES[templateIndex];

  // Active chosen number in palette (default to first number)
  const [activeNumber, setActiveNumber] = useState<number>(1);

  // Filled cells matrix: [row][col] = boolean
  const [filledCells, setFilledCells] = useState<boolean[][]>(() =>
    Array(currentTemplate.rows)
      .fill(false)
      .map(() => Array(currentTemplate.cols).fill(false))
  );

  // UI States
  const [showGridLines, setShowGridLines] = useState<boolean>(true);
  const [isHintActive, setIsHintActive] = useState<boolean>(false);
  const [wobbleCell, setWobbleCell] = useState<{ r: number; c: number } | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [hintMessage, setHintMessage] = useState<string | null>(null);

  const isMouseDownRef = useRef<boolean>(false);

  // Reset grid whenever template changes
  useEffect(() => {
    setFilledCells(
      Array(currentTemplate.rows)
        .fill(false)
        .map(() => Array(currentTemplate.cols).fill(false))
    );
    setActiveNumber(currentTemplate.palette[0].number);
    setIsCompleted(false);
    setHintMessage(null);
  }, [templateIndex, currentTemplate]);

  // Calculate stats
  let totalColorableCells = 0;
  let totalFilledCells = 0;
  const numberCounts: Record<number, { total: number; filled: number }> = {};

  currentTemplate.palette.forEach((p) => {
    numberCounts[p.number] = { total: 0, filled: 0 };
  });

  for (let r = 0; r < currentTemplate.rows; r++) {
    for (let c = 0; c < currentTemplate.cols; c++) {
      const num = currentTemplate.grid[r][c];
      if (num > 0) {
        totalColorableCells++;
        if (numberCounts[num]) {
          numberCounts[num].total++;
          if (filledCells[r] && filledCells[r][c]) {
            numberCounts[num].filled++;
            totalFilledCells++;
          }
        }
      }
    }
  }

  const completionPercent =
    totalColorableCells > 0 ? Math.round((totalFilledCells / totalColorableCells) * 100) : 0;

  // Check for completion
  useEffect(() => {
    if (totalColorableCells > 0 && totalFilledCells === totalColorableCells && !isCompleted) {
      setIsCompleted(true);
      sfx.playFanfare();
    }
  }, [totalFilledCells, totalColorableCells, isCompleted]);

  // Handle cell coloring
  const handleColorCell = useCallback(
    (r: number, c: number) => {
      const targetNum = currentTemplate.grid[r][c];
      if (targetNum === 0) return; // Background empty cell

      if (filledCells[r][c]) return; // Already colored

      if (targetNum === activeNumber) {
        // Correct match!
        sfx.playPop();
        setFilledCells((prev) => {
          const next = prev.map((rowArr) => [...rowArr]);
          next[r][c] = true;
          return next;
        });
        setHintMessage(null);
      } else {
        // Mismatch: provide gentle kid-friendly guidance
        sfx.playWrong();
        setWobbleCell({ r, c });
        setTimeout(() => setWobbleCell(null), 500);

        const correctColor = currentTemplate.palette.find((p) => p.number === targetNum);
        setHintMessage(
          `Oops! That's number ${targetNum}! Choose color #${targetNum} (${correctColor?.name || ''}) below 🎨`
        );
      }
    },
    [currentTemplate, activeNumber, filledCells]
  );

  // Switch template
  const handlePrevTemplate = () => {
    setTemplateIndex((prev) =>
      prev === 0 ? COLOR_BY_NUMBER_TEMPLATES.length - 1 : prev - 1
    );
  };

  const handleNextTemplate = () => {
    setTemplateIndex((prev) =>
      prev === COLOR_BY_NUMBER_TEMPLATES.length - 1 ? 0 : prev + 1
    );
  };

  // Reset current artwork
  const handleReset = () => {
    setFilledCells(
      Array(currentTemplate.rows)
        .fill(false)
        .map(() => Array(currentTemplate.cols).fill(false))
    );
    setIsCompleted(false);
    setHintMessage(null);
  };

  // Lightbulb Hint toggle (pulses uncolored cells of active number)
  const handleToggleHint = () => {
    setIsHintActive(!isHintActive);
    if (!isHintActive) {
      setHintMessage(`Look for the glowing #${activeNumber} boxes! Tap to color them!`);
    } else {
      setHintMessage(null);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto px-3 py-2 select-none">
      {/* Top Header Bar */}
      <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-white/10 gap-2">
        <button
          onClick={onBackToDrawing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-all active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Free Draw</span>
        </button>

        {/* Template Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevTemplate}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/15 text-white transition-colors"
            title="Previous Picture"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-center px-2">
            <h2 className="text-sm sm:text-base font-black text-white tracking-tight">
              {currentTemplate.name}
            </h2>
            <span className="text-[11px] text-cyan-300 font-semibold">
              {currentTemplate.category} • {completionPercent}% Done
            </span>
          </div>
          <button
            onClick={handleNextTemplate}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/15 text-white transition-colors"
            title="Next Picture"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Reset button */}
        <button
          onClick={handleReset}
          className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white text-xs font-bold transition-colors"
          title="Restart This Picture"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Clear</span>
        </button>
      </div>

      {/* Friendly Hint Banner */}
      {hintMessage && (
        <div className="w-full mb-3 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/40 rounded-2xl text-center text-xs sm:text-sm font-bold text-amber-200 animate-in fade-in slide-in-from-top-1 duration-150 shadow-md">
          {hintMessage}
        </div>
      )}

      {/* Main Workspace Layout matching IMG_3933.jpg */}
      <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-center gap-5 sm:gap-8">
        {/* LEFT COLUMN: Reference Thumbnail Guide, Number Palette & Action Buttons */}
        <div className="flex flex-col items-center gap-4 w-full md:w-auto flex-shrink-0">
          {/* Reference Preview Box with wooden/soft frame inspired by IMG_3933.jpg */}
          <div className="relative p-2.5 rounded-2xl bg-[#c59b6d] shadow-2xl border-4 border-[#8b5a2b]">
            <div className="text-[10px] font-black uppercase text-[#4a2e12] tracking-wider text-center pb-1">
              Picture Guide
            </div>
            <div
              className="bg-white rounded-lg p-1 shadow-inner grid gap-[1px]"
              style={{
                gridTemplateColumns: `repeat(${currentTemplate.cols}, minmax(0, 1fr))`,
                width: '130px',
                height: '130px',
              }}
            >
              {currentTemplate.grid.map((row, r) =>
                row.map((val, c) => {
                  if (val === 0) {
                    return <div key={`${r}-${c}`} className="bg-white" />;
                  }
                  const colorItem = currentTemplate.palette.find((p) => p.number === val);
                  return (
                    <div
                      key={`${r}-${c}`}
                      className="w-full h-full flex items-center justify-center text-[7px] font-bold text-black/50"
                      style={{ backgroundColor: colorItem?.color || '#cbd5e1' }}
                    >
                      {val}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Floating Numbered Color Swatch Capsule inspired by IMG_3933.jpg */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-white/95 rounded-full shadow-2xl border border-gray-200">
            {currentTemplate.palette.map((p) => {
              const isSelected = activeNumber === p.number;
              const count = numberCounts[p.number];
              const isNumberFinished = count && count.total > 0 && count.filled === count.total;

              return (
                <button
                  key={p.number}
                  onClick={() => {
                    setActiveNumber(p.number);
                    setHintMessage(null);
                  }}
                  className={`relative flex items-center justify-center rounded-full transition-all ${
                    isSelected
                      ? 'ring-4 ring-emerald-500 ring-offset-2 scale-110 shadow-lg'
                      : 'hover:scale-105 opacity-90'
                  }`}
                  style={{
                    width: '44px',
                    height: '44px',
                    backgroundColor: p.color,
                  }}
                  title={`${p.name} (Number ${p.number})`}
                >
                  {/* Number inside color ball */}
                  <span
                    className={`font-black text-base drop-shadow ${
                      p.color === '#ffffff' ? 'text-black' : 'text-white'
                    }`}
                  >
                    {isNumberFinished ? <Check className="w-5 h-5 stroke-[3]" /> : p.number}
                  </span>

                  {/* Complete check badge */}
                  {isNumberFinished && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border border-white text-[10px] text-white flex items-center justify-center font-bold shadow">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Action Tools (Grid Toggle & Hint Lightbulb) inspired by IMG_3933.jpg */}
          <div className="flex items-center gap-3">
            {/* Green Grid Lines Button */}
            <button
              onClick={() => setShowGridLines(!showGridLines)}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border-2 transition-all active:scale-95 ${
                showGridLines
                  ? 'bg-[#22c55e] border-[#16a34a] text-white shadow-emerald-500/30'
                  : 'bg-white/10 border-white/20 text-gray-300'
              }`}
              title="Toggle Grid Lines"
            >
              <Grid className="w-6 h-6" />
            </button>

            {/* Green Lightbulb Hint Button */}
            <button
              onClick={handleToggleHint}
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border-2 transition-all active:scale-95 ${
                isHintActive
                  ? 'bg-[#facc15] border-[#eab308] text-black shadow-yellow-500/40 animate-pulse'
                  : 'bg-[#22c55e] border-[#16a34a] text-white shadow-emerald-500/30'
              }`}
              title="Show Hint (Find Number Spots)"
            >
              <Lightbulb className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Coloring Board */}
        <div
          className="relative p-3 sm:p-5 rounded-3xl bg-[#d4a373] border-4 sm:border-8 border-[#8b5a2b] shadow-2xl flex items-center justify-center"
          onMouseDown={() => (isMouseDownRef.current = true)}
          onMouseUp={() => (isMouseDownRef.current = false)}
          onTouchStart={() => (isMouseDownRef.current = true)}
          onTouchEnd={() => (isMouseDownRef.current = false)}
        >
          <div
            className={`bg-white rounded-2xl p-1 sm:p-2 shadow-2xl grid gap-[2px] sm:gap-[3px] select-none ${
              showGridLines ? 'border border-gray-400/40' : ''
            }`}
            style={{
              gridTemplateColumns: `repeat(${currentTemplate.cols}, minmax(0, 1fr))`,
              width: 'min(80vw, 440px)',
              height: 'min(80vw, 440px)',
            }}
          >
            {currentTemplate.grid.map((row, r) =>
              row.map((cellNumber, c) => {
                const isBlank = cellNumber === 0;
                const isFilled = filledCells[r] && filledCells[r][c];
                const isWobbling = wobbleCell?.r === r && wobbleCell?.c === c;
                const isHintTarget =
                  isHintActive && !isFilled && cellNumber === activeNumber;
                const paletteItem = currentTemplate.palette.find(
                  (p) => p.number === cellNumber
                );

                if (isBlank) {
                  return (
                    <div
                      key={`grid-${r}-${c}`}
                      className="w-full h-full bg-[#f8fafc] rounded-sm pointer-events-none"
                    />
                  );
                }

                return (
                  <button
                    key={`grid-${r}-${c}`}
                    onMouseDown={() => handleColorCell(r, c)}
                    onMouseEnter={() => {
                      if (isMouseDownRef.current) {
                        handleColorCell(r, c);
                      }
                    }}
                    onTouchStart={() => handleColorCell(r, c)}
                    className={`w-full h-full rounded-sm flex items-center justify-center font-black transition-all relative ${
                      showGridLines ? 'border border-gray-300' : ''
                    } ${
                      isFilled
                        ? 'shadow-sm'
                        : 'bg-white hover:bg-gray-100 cursor-pointer'
                    } ${isWobbling ? 'animate-bounce bg-red-200' : ''} ${
                      isHintTarget
                        ? 'ring-2 ring-emerald-500 ring-inset bg-emerald-50 animate-pulse'
                        : ''
                    }`}
                    style={{
                      backgroundColor: isFilled
                        ? paletteItem?.color || '#3b82f6'
                        : '#ffffff',
                    }}
                  >
                    {!isFilled && (
                      <span className="text-gray-800 text-xs sm:text-base select-none font-bold">
                        {cellNumber}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Completion Modal Celebration */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200 select-none">
          <div className="max-w-md w-full bg-[#18181e] border-2 border-amber-400 rounded-3xl p-6 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center text-black shadow-lg shadow-yellow-500/40 animate-bounce">
              <Trophy className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white">
                Hooray! Great Job! 🌟
              </h3>
              <p className="text-sm text-amber-200 font-bold">
                You colored every single number on the {currentTemplate.name}!
              </p>
            </div>

            <div className="py-2 flex items-center justify-center gap-2">
              <span className="text-3xl">🎉</span>
              <span className="text-3xl">🎨</span>
              <span className="text-3xl">⭐</span>
              <span className="text-3xl">🐝</span>
              <span className="text-3xl">💖</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={handleNextTemplate}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-black text-sm shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
              >
                Next Picture
              </button>
              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm transition-colors"
              >
                Color Again
              </button>
              <button
                onClick={onBackToDrawing}
                className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-gray-300 hover:text-white font-bold text-sm transition-colors"
              >
                Free Draw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
