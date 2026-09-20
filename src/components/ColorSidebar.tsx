import React, { useState } from 'react';
import { DrawingTool, EraserSize } from '../types';

interface ColorSidebarProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
  currentTool: DrawingTool;
  onSelectTool: (tool: DrawingTool) => void;
  onClearCanvas?: () => void;
  onSaveOrNext?: () => void;
  lineWidth?: number;
  onChangeLineWidth?: (width: number) => void;
  eraserSize?: EraserSize;
  onChangeEraserSize?: (size: EraserSize) => void;
}

type TabType = 'crayon' | 'brush' | 'glitter' | 'rainbow';

// 18 Rich, vibrant kid colors matching physical art supplies
const PALETTE_COLORS = [
  { hex: '#f9a8d4', name: 'Baby Pink' },
  { hex: '#ec4899', name: 'Hot Magenta' }, // Default selected in reference screenshot
  { hex: '#e11d48', name: 'Berry Rose' },
  { hex: '#c084fc', name: 'Soft Mauve' },
  { hex: '#fb7185', name: 'Coral Salmon' },
  { hex: '#dc2626', name: 'Crimson Red' },
  { hex: '#ea580c', name: 'Terracotta' },
  { hex: '#881337', name: 'Deep Burgundy' },
  { hex: '#78716c', name: 'Warm Taupe' },
  { hex: '#713f12', name: 'Chocolate Brown' },
  { hex: '#facc15', name: 'Sunny Yellow' },
  { hex: '#f97316', name: 'Juicy Orange' },
  { hex: '#84cc16', name: 'Apple Green' },
  { hex: '#10b981', name: 'Emerald Green' },
  { hex: '#0ea5e9', name: 'Sky Blue' },
  { hex: '#2563eb', name: 'Royal Blue' },
  { hex: '#1f2937', name: 'Charcoal' },
  { hex: '#ffffff', name: 'Pure White' },
];

// Playful sound synthesizer for kid taps
function playPopSound(pitch: number = 440) {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(pitch * 1.5, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch {
    // Audio autoplay safety
  }
}

export const ColorSidebar: React.FC<ColorSidebarProps> = ({
  selectedColor,
  onSelectColor,
  currentTool,
  onSelectTool,
  onClearCanvas,
  onSaveOrNext,
  lineWidth,
  onChangeLineWidth,
  eraserSize,
  onChangeEraserSize,
}) => {
  // Determine active tab based on currentTool
  const activeTab: TabType =
    currentTool === 'crayon'
      ? 'crayon'
      : currentTool === 'glitter'
      ? 'glitter'
      : currentTool === 'rainbow'
      ? 'rainbow'
      : 'brush';

  const handleSelectTab = (tab: TabType) => {
    playPopSound(520);
    onSelectTool(tab);
  };

  const handleColorClick = (hex: string) => {
    playPopSound(420);
    onSelectColor(hex);
    // If currently on an incompatible tool like eraser, switch to brush/tab
    if (currentTool === 'eraser' || currentTool === 'highlighter' || currentTool === 'pencil') {
      onSelectTool(activeTab);
    }
  };

  return (
    <aside
      id="kid-color-sidebar"
      aria-label="Color and Tool Selection"
      className="fixed left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-2 sm:gap-3 select-none pointer-events-auto"
    >
      {/* 1. Top Juicy 3D Squircle "X" Button (Erase / Clear Canvas) */}
      <button
        type="button"
        onClick={() => {
          playPopSound(320);
          onClearCanvas?.();
        }}
        id="btn-sidebar-clear"
        title="Clear Drawing"
        className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-[20px] bg-gradient-to-b from-[#ff8c61] via-[#f95738] to-[#d63b1a] p-1 shadow-[0_6px_14px_rgba(214,59,26,0.45),inset_0_2px_4px_rgba(255,255,255,0.6),inset_0_-3px_4px_rgba(0,0,0,0.25)] border-2 border-[#ffb194] transition-all hover:scale-108 active:scale-95 flex items-center justify-center cursor-pointer"
      >
        {/* Top glossy gel highlight curve */}
        <div className="absolute top-1 left-2 right-2 h-3.5 bg-gradient-to-b from-white/70 to-transparent rounded-t-[14px] pointer-events-none" />

        {/* Big Chubby Cream "X" */}
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 sm:w-8 sm:h-8 text-[#fff4e6] drop-shadow-[0_2px_3px_rgba(180,40,15,0.6)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="6" y1="6" x2="18" y2="18" />
          <line x1="6" y1="18" x2="18" y2="6" />
        </svg>
      </button>

      {/* 2. Middle Color & Tool Caddy (Always Open) */}
      <div className="flex items-stretch rounded-3xl shadow-[0_12px_32px_rgba(0,0,0,0.18)] border-2 border-[#38bdf8] overflow-hidden bg-[#e6f4fe] max-h-[68vh] sm:max-h-[72vh]">
        {/* Left Sub-Panel: Dedicated Rainbow Magic Card OR Big Chunky Rack of Crayons/Brushes/Markers */}
        {activeTab === 'rainbow' ? (
          <div className="w-28 sm:w-36 bg-gradient-to-b from-[#fff1f2] via-[#ffe4e6] to-[#fecdd3] p-3 sm:p-4 flex flex-col items-center justify-center text-center gap-3 select-none">
            {/* Animated Magic Rainbow Badge */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-rose-500 via-amber-400 via-emerald-400 to-sky-500 p-0.5 shadow-lg shadow-rose-500/25 animate-pulse">
              <div className="w-full h-full rounded-[14px] bg-white flex flex-col items-center justify-center overflow-hidden">
                <span className="text-2xl sm:text-3xl">🌈</span>
              </div>
              <span className="absolute -top-1 -right-1 text-sm animate-bounce">✨</span>
            </div>

            <div className="space-y-1">
              <div className="text-xs sm:text-sm font-black text-rose-600 tracking-wide uppercase">
                Rainbow Magic
              </div>
              <p className="text-[10px] sm:text-[11px] text-gray-600 font-semibold leading-tight">
                No color selection needed — your strokes cycle through all rainbow colors automatically!
              </p>
            </div>

            {/* Rainbow Stroke Width Quick Buttons */}
            {onChangeLineWidth && (
              <div className="w-full pt-1 flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  Brush Thickness
                </span>
                <div className="flex items-center justify-center gap-1.5 w-full">
                  {[
                    { label: 'S', width: 4, title: 'Thin Rainbow' },
                    { label: 'M', width: 8, title: 'Medium Rainbow' },
                    { label: 'L', width: 14, title: 'Thick Rainbow' },
                  ].map((sz) => (
                    <button
                      key={sz.label}
                      type="button"
                      onClick={() => onChangeLineWidth(sz.width)}
                      title={sz.title}
                      className={`flex-1 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        lineWidth === sz.width
                          ? 'bg-rose-500 text-white shadow-md scale-105'
                          : 'bg-white/80 text-gray-700 hover:bg-white border border-rose-200'
                      }`}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="w-32 sm:w-44 bg-gradient-to-r from-[#d8effe] to-[#ecf7ff] py-3 px-1.5 sm:px-2.5 overflow-y-auto overflow-x-hidden flex flex-col gap-1.5 sm:gap-2 scrollbar-thin scrollbar-thumb-sky-200">
            {PALETTE_COLORS.map(({ hex, name }) => {
              const isSelected = selectedColor.toLowerCase() === hex.toLowerCase();

              return (
                <button
                  key={hex}
                  type="button"
                  onClick={() => handleColorClick(hex)}
                  title={`${name} (${activeTab.toUpperCase()})`}
                  className={`group relative flex items-center transition-all duration-150 cursor-pointer h-10 sm:h-12 w-full ${
                    isSelected
                      ? '-translate-x-2 sm:-translate-x-3 scale-105 z-10'
                      : 'hover:-translate-x-1 opacity-95 hover:opacity-100'
                  }`}
                >
                  {/* Distinct SVG illustration based on active tab: Crayon vs Paintbrush vs Glitter Marker */}
                  {activeTab === 'crayon' ? (
                    /* REALISTIC CRAYON: Pointed wax cone, exposed wax neck, paper wrapper with wavy bands & label */
                    <svg
                      viewBox="0 0 130 36"
                      className="w-full h-full filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.18)] overflow-visible"
                    >
                      <defs>
                        <linearGradient id={`crayon-wax-${hex}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
                          <stop offset="35%" stopColor={hex} />
                          <stop offset="85%" stopColor={hex} />
                          <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
                        </linearGradient>
                        <linearGradient id={`paper-${hex}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ffffff" />
                          <stop offset="60%" stopColor="#f8fafc" />
                          <stop offset="100%" stopColor="#e2e8f0" />
                        </linearGradient>
                      </defs>

                      {/* 1. Pointed Conical Wax Tip */}
                      <path
                        d="M 6 18 L 32 6 L 32 30 Z"
                        fill={`url(#crayon-wax-${hex})`}
                      />
                      {/* Wax tip chisel reflection */}
                      <path
                        d="M 6 18 L 32 6 L 32 18 Z"
                        fill="white"
                        opacity="0.3"
                      />

                      {/* 2. Exposed Wax Neck */}
                      <rect x="32" y="6" width="6" height="24" fill={hex} />

                      {/* 3. Paper Wrapper Barrel */}
                      <rect
                        x="38"
                        y="5"
                        width="88"
                        height="26"
                        rx="4"
                        fill={`url(#paper-${hex})`}
                        stroke="#cbd5e1"
                        strokeWidth="0.8"
                      />

                      {/* Main color stripe on wrapper */}
                      <rect x="44" y="9" width="76" height="18" rx="2" fill={hex} opacity="0.9" />

                      {/* Classic iconic Crayola wavy / zigzag black borders */}
                      <path
                        d="M 46 11 Q 49 8 52 11 T 58 11 T 64 11 T 70 11 T 76 11 T 82 11 T 88 11 T 94 11 T 100 11 T 106 11 T 112 11 T 118 11"
                        fill="none"
                        stroke="#1e293b"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 46 25 Q 49 22 52 25 T 58 25 T 64 25 T 70 25 T 76 25 T 82 25 T 88 25 T 94 25 T 100 25 T 106 25 T 112 25 T 118 25"
                        fill="none"
                        stroke="#1e293b"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                      />

                      {/* Wrapper Label text: e.g. color name */}
                      <text
                        x="82"
                        y="19.5"
                        textAnchor="middle"
                        fontSize="7"
                        fontWeight="900"
                        letterSpacing="0.8"
                        fill={
                          hex === '#ffffff' || hex === '#facc15' || hex === '#f9a8d4'
                            ? '#1e293b'
                            : '#ffffff'
                        }
                        fontFamily="sans-serif"
                      >
                        {name.toUpperCase()}
                      </text>

                      {/* Active selection outline */}
                      {isSelected && (
                        <rect
                          x="3"
                          y="3"
                          width="125"
                          height="30"
                          rx="6"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="2.5"
                          filter="drop-shadow(0 0 3px rgba(255,255,255,0.8))"
                        />
                      )}
                    </svg>
                  ) : activeTab === 'brush' ? (
                    /* REALISTIC PAINTBRUSH: Elegant long wooden handle, chrome ferrule with crimp rings, wet teardrop bristle tip with paint drip */
                    <svg
                      viewBox="0 0 130 36"
                      className="w-full h-full filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.18)] overflow-visible"
                    >
                      <defs>
                        <linearGradient id={`ferrule-brush-${hex}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f8fafc" />
                          <stop offset="30%" stopColor="#cbd5e1" />
                          <stop offset="60%" stopColor="#ffffff" />
                          <stop offset="100%" stopColor="#64748b" />
                        </linearGradient>
                        <linearGradient id={`wood-brush-${hex}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#b45309" />
                          <stop offset="40%" stopColor="#d97706" />
                          <stop offset="70%" stopColor="#92400e" />
                          <stop offset="100%" stopColor="#451a03" />
                        </linearGradient>
                      </defs>

                      {/* 1. Long Elegant Tapered Wooden Artist Handle */}
                      <path
                        d="M 64 10 L 126 13 C 129 14.5 129 21.5 126 23 L 64 26 Z"
                        fill={`url(#wood-brush-${hex})`}
                      />
                      {/* Handle glossy varnish stripe */}
                      <path
                        d="M 66 12 L 122 15 C 124 16 124 17 122 18 L 66 15 Z"
                        fill="white"
                        opacity="0.35"
                      />

                      {/* 2. Chrome Metallic Ferrule with Crimp Rings */}
                      <rect
                        x="42"
                        y="8"
                        width="22"
                        height="20"
                        rx="1.5"
                        fill={`url(#ferrule-brush-${hex})`}
                        stroke="#64748b"
                        strokeWidth="0.6"
                      />
                      <line x1="49" y1="8" x2="49" y2="28" stroke="#475569" strokeWidth="1" opacity="0.6" />
                      <line x1="56" y1="8" x2="56" y2="28" stroke="#ffffff" strokeWidth="0.8" opacity="0.8" />

                      {/* 3. Soft Teardrop Artist Bristle Tip dipped in paint */}
                      <path
                        d="M 42 9 C 32 9, 18 13.5, 4 18 C 18 22.5, 32 27, 42 27 Z"
                        fill={hex}
                      />
                      {/* Glossy wet paint reflection curve */}
                      <path
                        d="M 40 11 C 30 11, 19 14.5, 9 18 C 19 16.5, 30 14, 40 14 Z"
                        fill="white"
                        opacity="0.65"
                      />
                      {/* Paint drip bead */}
                      <circle cx="4" cy="18" r="2.2" fill={hex} />
                      <circle cx="3.2" cy="17.2" r="0.8" fill="white" opacity="0.8" />

                      {/* Active selection outline */}
                      {isSelected && (
                        <rect
                          x="2"
                          y="4"
                          width="126"
                          height="28"
                          rx="6"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="2.5"
                          filter="drop-shadow(0 0 3px rgba(255,255,255,0.8))"
                        />
                      )}
                    </svg>
                  ) : (
                    /* GLITTER MARKER: Translucent barrel, floating stars, felt bullet tip */
                    <svg
                      viewBox="0 0 130 36"
                      className="w-full h-full filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.18)] overflow-visible"
                    >
                      <defs>
                        <linearGradient id={`glitter-barrel-${hex}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                          <stop offset="40%" stopColor={hex} stopOpacity="0.85" />
                          <stop offset="100%" stopColor={hex} stopOpacity="0.95" />
                        </linearGradient>
                      </defs>

                      {/* 1. Sparkle Felt Tip */}
                      <polygon points="6,18 28,9 28,27" fill={hex} />
                      <polygon points="6,18 28,9 28,18" fill="white" opacity="0.3" />

                      {/* 2. Plastic Collar */}
                      <rect
                        x="28"
                        y="9"
                        width="10"
                        height="18"
                        rx="1"
                        fill="#e2e8f0"
                        stroke="#94a3b8"
                        strokeWidth="0.5"
                      />

                      {/* 3. Translucent Glitter Barrel */}
                      <rect
                        x="38"
                        y="7"
                        width="88"
                        height="22"
                        rx="4"
                        fill={`url(#glitter-barrel-${hex})`}
                        stroke="#ffffff"
                        strokeWidth="0.8"
                      />

                      {/* Floating Sparkle Stars inside barrel */}
                      <circle cx="52" cy="14" r="1.8" fill="#ffffff" />
                      <circle cx="68" cy="22" r="1.4" fill="#fef08a" />
                      <circle cx="84" cy="13" r="2" fill="#ffffff" />
                      <circle cx="102" cy="21" r="1.5" fill="#fef08a" />
                      <circle cx="116" cy="15" r="1.8" fill="#ffffff" />

                      <text
                        x="76"
                        y="19.5"
                        textAnchor="middle"
                        fontSize="7.5"
                        fontWeight="900"
                        letterSpacing="1"
                        fill="#ffffff"
                        fontFamily="sans-serif"
                        opacity="0.9"
                      >
                        ✨ GLITTER ✨
                      </text>

                      {/* Active selection outline */}
                      {isSelected && (
                        <rect
                          x="3"
                          y="4"
                          width="125"
                          height="28"
                          rx="6"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="2.5"
                          filter="drop-shadow(0 0 3px rgba(255,255,255,0.8))"
                        />
                      )}
                    </svg>
                  )}

                  {/* Selected Active Indicator Badge */}
                  {isSelected && (
                    <div
                      className="absolute -left-1 sm:-left-1.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm animate-pulse"
                      style={{ backgroundColor: hex }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Right Sub-Panel: Vibrant Sky-Blue Bar with 4 Tool Tabs */}
        <div className="w-13 sm:w-16 bg-gradient-to-b from-[#029df4] via-[#028ce0] to-[#017bc7] p-1 sm:p-1.5 flex flex-col justify-around gap-1.5 sm:gap-2 border-l border-[#38bdf8]">
          {/* TAB 1: Crayon Tab (Yellow/Amber) */}
          <button
            type="button"
            onClick={() => handleSelectTab('crayon')}
            title="Crayons"
            className={`group relative w-full aspect-square rounded-2xl transition-all duration-150 p-1 flex items-center justify-center cursor-pointer ${
              activeTab === 'crayon'
                ? 'bg-gradient-to-b from-[#fec84b] to-[#f79009] shadow-[0_4px_10px_rgba(247,144,9,0.5)] scale-105 border-2 border-white'
                : 'bg-[#fdb022] hover:bg-[#f79009] border border-amber-300/60 opacity-90 hover:opacity-100'
            }`}
          >
            {/* Active Pointer Triangle pointing to rack */}
            {activeTab === 'crayon' && (
              <div className="absolute -left-2 sm:-left-2.5 top-1/2 -translate-y-1/2 w-0 h-0 border-y-5 border-y-transparent border-r-6 border-r-white filter drop-shadow-sm" />
            )}

            {/* Inner White Badge */}
            <div className="w-full h-full rounded-full bg-white shadow-inner flex items-center justify-center p-0.5 overflow-hidden">
              {/* Green Crayon drawing green scribble */}
              <svg viewBox="0 0 40 40" className="w-full h-full">
                {/* Green scribble line */}
                <path
                  d="M 12 28 Q 20 22 28 28 Q 22 34 32 30"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Crayon body */}
                <g transform="rotate(35 22 18)">
                  <polygon points="12,14 16,14 14,8" fill="#15803d" />
                  <rect x="11" y="14" width="6" height="15" rx="1" fill="#22c55e" />
                  <rect x="11" y="18" width="6" height="7" fill="#16a34a" />
                  <line x1="11" y1="20" x2="17" y2="20" stroke="#14532d" strokeWidth="0.8" />
                  <line x1="11" y1="23" x2="17" y2="23" stroke="#14532d" strokeWidth="0.8" />
                </g>
              </svg>
            </div>
          </button>

          {/* TAB 2: Paintbrush Tab (Lavender/Purple) — Active in Reference Image */}
          <button
            type="button"
            onClick={() => handleSelectTab('brush')}
            title="Paintbrush"
            className={`group relative w-full aspect-square rounded-2xl transition-all duration-150 p-1 flex items-center justify-center cursor-pointer ${
              activeTab === 'brush'
                ? 'bg-gradient-to-b from-[#e9d5ff] to-[#c084fc] shadow-[0_4px_10px_rgba(192,132,252,0.5)] scale-105 border-2 border-white'
                : 'bg-[#d8b4fe] hover:bg-[#c084fc] border border-purple-300/60 opacity-90 hover:opacity-100'
            }`}
          >
            {/* Active Pointer Triangle pointing to rack (As seen in reference screenshot!) */}
            {activeTab === 'brush' && (
              <div className="absolute -left-2 sm:-left-2.5 top-1/2 -translate-y-1/2 w-0 h-0 border-y-5 border-y-transparent border-r-6 border-r-white filter drop-shadow-sm" />
            )}

            {/* Inner White Badge */}
            <div className="w-full h-full rounded-full bg-white shadow-inner flex items-center justify-center p-0.5 overflow-hidden">
              {/* Paintbrush dipping into purple splash */}
              <svg viewBox="0 0 40 40" className="w-full h-full">
                {/* Purple paint splash on paper */}
                <path
                  d="M 14 24 C 10 23, 11 31, 17 31 C 21 31, 23 34, 27 32 C 32 30, 31 24, 27 23 C 24 22, 21 25, 18 24 Z"
                  fill="#a855f7"
                />
                <circle cx="28" cy="20" r="1.5" fill="#a855f7" />
                <circle cx="12" cy="22" r="1.2" fill="#a855f7" />

                {/* Paintbrush angled */}
                <g transform="rotate(-38 20 20)">
                  {/* Wooden handle */}
                  <rect x="18" y="4" width="4" height="16" rx="1" fill="#a16207" />
                  {/* Silver ferrule */}
                  <rect x="17.5" y="19" width="5" height="5" rx="0.5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.5" />
                  {/* Purple bristle tip */}
                  <path d="M 17.5 24 C 17.5 24, 18 29, 20 31 C 22 29, 22.5 24, 22.5 24 Z" fill="#9333ea" />
                </g>
              </svg>
            </div>
          </button>

          {/* TAB 3: Glitter / Sparkle Tab (Green/Teal) */}
          <button
            type="button"
            onClick={() => handleSelectTab('glitter')}
            title="Glitter & Sparkles"
            className={`group relative w-full aspect-square rounded-2xl transition-all duration-150 p-1 flex items-center justify-center cursor-pointer ${
              activeTab === 'glitter'
                ? 'bg-gradient-to-b from-[#6ee7b7] to-[#10b981] shadow-[0_4px_10px_rgba(16,185,129,0.5)] scale-105 border-2 border-white'
                : 'bg-[#34d399] hover:bg-[#10b981] border border-emerald-300/60 opacity-90 hover:opacity-100'
            }`}
          >
            {/* Active Pointer Triangle */}
            {activeTab === 'glitter' && (
              <div className="absolute -left-2 sm:-left-2.5 top-1/2 -translate-y-1/2 w-0 h-0 border-y-5 border-y-transparent border-r-6 border-r-white filter drop-shadow-sm" />
            )}

            {/* Inner White Badge */}
            <div className="w-full h-full rounded-full bg-white shadow-inner flex items-center justify-center p-0.5 overflow-hidden">
              {/* Gold glitter marker with sparkling dots */}
              <svg viewBox="0 0 40 40" className="w-full h-full">
                {/* Golden glitter sparkle splash */}
                <path
                  d="M 16 23 C 12 24, 13 31, 18 31 C 23 31, 27 34, 30 30 C 33 26, 29 23, 26 23 Z"
                  fill="#f59e0b"
                />
                {/* Sparkle stars */}
                <circle cx="15" cy="27" r="1" fill="#fff" />
                <circle cx="22" cy="28" r="1.2" fill="#fff" />
                <circle cx="28" cy="28" r="1" fill="#fff" />
                <circle cx="26" cy="22" r="1.5" fill="#fbbf24" />

                {/* Orange glitter pen */}
                <g transform="rotate(35 20 18)">
                  <polygon points="12,13 16,13 14,7" fill="#d97706" />
                  <rect x="11" y="13" width="6" height="16" rx="1" fill="#f97316" />
                  <circle cx="14" cy="18" r="1" fill="#fef08a" />
                  <circle cx="13" cy="23" r="0.8" fill="#fef08a" />
                  <circle cx="15" cy="26" r="0.8" fill="#fef08a" />
                </g>
              </svg>
            </div>
          </button>

          {/* TAB 4: Rainbow / Magic Wave Tab (Coral/Pink) */}
          <button
            type="button"
            onClick={() => handleSelectTab('rainbow')}
            title="Rainbow Magic"
            className={`group relative w-full aspect-square rounded-2xl transition-all duration-150 p-1 flex items-center justify-center cursor-pointer ${
              activeTab === 'rainbow'
                ? 'bg-gradient-to-b from-[#fecdd3] to-[#f43f5e] shadow-[0_4px_10px_rgba(244,63,94,0.5)] scale-105 border-2 border-white'
                : 'bg-[#fda4af] hover:bg-[#fb7185] border border-rose-300/60 opacity-90 hover:opacity-100'
            }`}
          >
            {/* Active Pointer Triangle */}
            {activeTab === 'rainbow' && (
              <div className="absolute -left-2 sm:-left-2.5 top-1/2 -translate-y-1/2 w-0 h-0 border-y-5 border-y-transparent border-r-6 border-r-white filter drop-shadow-sm" />
            )}

            {/* Inner White Badge */}
            <div className="w-full h-full rounded-full bg-white shadow-inner flex items-center justify-center p-0.5 overflow-hidden">
              {/* Rainbow patterned pen with wavy rainbow swatch */}
              <svg viewBox="0 0 40 40" className="w-full h-full">
                {/* Wavy rainbow ribbon swatch */}
                <path
                  d="M 12 25 Q 18 20 24 25 Q 30 30 34 26"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                />
                <path
                  d="M 12 27 Q 18 22 24 27 Q 30 32 34 28"
                  fill="none"
                  stroke="#eab308"
                  strokeWidth="2"
                />
                <path
                  d="M 12 29 Q 18 24 24 29 Q 30 34 34 30"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
                <path
                  d="M 12 31 Q 18 26 24 31 Q 30 36 34 32"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2"
                />

                {/* Striped Rainbow Pen */}
                <g transform="rotate(35 22 18)">
                  <polygon points="12,13 16,13 14,7" fill="#ef4444" />
                  <rect x="11" y="13" width="6" height="4" fill="#ef4444" />
                  <rect x="11" y="17" width="6" height="4" fill="#f59e0b" />
                  <rect x="11" y="21" width="6" height="4" fill="#10b981" />
                  <rect x="11" y="25" width="6" height="4" fill="#3b82f6" />
                </g>
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* 3. Bottom Juicy 3D Squircle "➔" Button (Save / Done / Next) */}
      <button
        type="button"
        onClick={() => {
          playPopSound(580);
          onSaveOrNext?.();
        }}
        id="btn-sidebar-next"
        title="Save & Share Drawing"
        className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-[20px] bg-gradient-to-b from-[#ff6b6b] via-[#ee3f4d] to-[#c9182b] p-1 shadow-[0_6px_14px_rgba(201,24,43,0.45),inset_0_2px_4px_rgba(255,255,255,0.6),inset_0_-3px_4px_rgba(0,0,0,0.25)] border-2 border-[#ffa8a8] transition-all hover:scale-108 active:scale-95 flex items-center justify-center cursor-pointer"
      >
        {/* Top glossy gel highlight curve */}
        <div className="absolute top-1 left-2 right-2 h-3.5 bg-gradient-to-b from-white/70 to-transparent rounded-t-[14px] pointer-events-none" />

        {/* Big Chubby Cream/Yellow Arrow "➔" */}
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 sm:w-8 sm:h-8 text-[#fffbe6] drop-shadow-[0_2px_3px_rgba(150,15,30,0.6)]"
          fill="currentColor"
        >
          <path d="M 5 10 C 4.4 10, 4 10.4, 4 11 L 4 13 C 4 13.6, 4.4 14, 5 14 L 13 14 L 13 17.5 C 13 18.2, 13.8 18.6, 14.4 18.1 L 20.4 12.6 C 20.8 12.3, 20.8 11.7, 20.4 11.4 L 14.4 5.9 C 13.8 5.4, 13 5.8, 13 6.5 L 13 10 L 5 10 Z" />
        </svg>
      </button>
    </aside>
  );
};
