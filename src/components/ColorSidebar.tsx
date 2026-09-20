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
        {/* Left Sub-Panel: Vertical Rack of Brushes / Crayons */}
        <div className="w-18 sm:w-24 bg-gradient-to-r from-[#d8effe] to-[#ecf7ff] py-3 px-1.5 sm:px-2 overflow-y-auto overflow-x-hidden flex flex-col gap-1 sm:gap-1.5 scrollbar-thin scrollbar-thumb-sky-200">
          {PALETTE_COLORS.map(({ hex, name }) => {
            const isSelected = selectedColor.toLowerCase() === hex.toLowerCase();

            return (
              <button
                key={hex}
                type="button"
                onClick={() => handleColorClick(hex)}
                title={name}
                className={`group relative flex items-center transition-all duration-150 cursor-pointer h-7 sm:h-8 w-full ${
                  isSelected
                    ? '-translate-x-2 sm:-translate-x-3 scale-105 z-10'
                    : 'hover:-translate-x-1 opacity-95 hover:opacity-100'
                }`}
              >
                {/* Visual Paintbrush / Crayon SVG illustration */}
                <svg
                  viewBox="0 0 100 28"
                  className="w-full h-full filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] overflow-visible"
                >
                  <defs>
                    {/* Metal Ferrule Chrome Gradient */}
                    <linearGradient id={`ferrule-${hex}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f1f5f9" />
                      <stop offset="35%" stopColor="#cbd5e1" />
                      <stop offset="60%" stopColor="#ffffff" />
                      <stop offset="100%" stopColor="#94a3b8" />
                    </linearGradient>

                    {/* Wooden Brush Handle Gradient */}
                    <linearGradient id={`wood-${hex}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a76535" />
                      <stop offset="45%" stopColor="#c57e45" />
                      <stop offset="70%" stopColor="#8d5027" />
                      <stop offset="100%" stopColor="#633719" />
                    </linearGradient>

                    {/* Paint Sheen Gradient */}
                    <linearGradient id={`paintSheen-${hex}`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="white" stopOpacity="0.5" />
                      <stop offset="50%" stopColor="white" stopOpacity="0.1" />
                      <stop offset="100%" stopColor="black" stopOpacity="0.15" />
                    </linearGradient>
                  </defs>

                  {/* 1. Wooden Handle */}
                  <path
                    d="M 58 7 L 100 7 L 100 21 L 58 21 Z"
                    fill={`url(#wood-${hex})`}
                    rx="1.5"
                  />
                  {/* Subtle wood seam */}
                  <line x1="58" y1="14" x2="100" y2="14" stroke="#522a12" strokeWidth="0.5" opacity="0.3" />

                  {/* 2. Metallic Chrome Ferrule */}
                  <path
                    d="M 40 5.5 L 58 7 L 58 21 L 40 22.5 Z"
                    fill={`url(#ferrule-${hex})`}
                    stroke="#94a3b8"
                    strokeWidth="0.5"
                  />
                  {/* Ferrule crimp rings */}
                  <line x1="47" y1="6" x2="47" y2="22" stroke="#64748b" strokeWidth="0.7" opacity="0.6" />
                  <line x1="53" y1="6.5" x2="53" y2="21.5" stroke="#ffffff" strokeWidth="0.7" opacity="0.8" />

                  {/* 3. Dipped Bristles Tip */}
                  <path
                    d="M 40 5.5 C 32 5.5, 18 9, 3 14 C 18 19, 32 22.5, 40 22.5 Z"
                    fill={hex}
                  />

                  {/* Paint gloss highlight overlay */}
                  <path
                    d="M 38 8 C 30 8, 18 11.5, 7 14 C 18 13, 30 11, 38 11 Z"
                    fill="white"
                    opacity="0.45"
                  />

                  {/* Rainbow Sparkle overlay if in rainbow/glitter mode */}
                  {activeTab === 'glitter' && (
                    <circle cx="20" cy="14" r="2.5" fill="#fef08a" opacity="0.9" />
                  )}

                  {/* Active Pop-out Halo Outline when Selected */}
                  {isSelected && (
                    <path
                      d="M 40 4 C 30 4, 15 8, 1 14 C 15 20, 30 24, 40 24"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="2"
                      opacity="0.9"
                    />
                  )}
                </svg>

                {/* Selected Active Indicator Badge */}
                {isSelected && (
                  <div
                    className="absolute -left-1 sm:-left-1.5 w-2 h-2 rounded-full border border-white shadow-sm animate-pulse"
                    style={{ backgroundColor: hex }}
                  />
                )}
              </button>
            );
          })}
        </div>

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
