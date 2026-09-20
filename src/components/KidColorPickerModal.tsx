import React, { useState } from 'react';
import { X, Sparkles, Check, Palette } from 'lucide-react';

interface KidColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedColor: string;
  onSelectColor: (color: string) => void;
  lineWidth: number;
  onChangeLineWidth: (width: number) => void;
}

type PaletteCategory = 'crayons' | 'pastels' | 'neon' | 'rainbow';

export const CRAYON_COLORS = [
  { name: 'Cherry Red', hex: '#ef4444' },
  { name: 'Crimson', hex: '#dc2626' },
  { name: 'Tangerine', hex: '#f97316' },
  { name: 'Sunny Yellow', hex: '#eab308' },
  { name: 'Lime Green', hex: '#84cc16' },
  { name: 'Grass Green', hex: '#22c55e' },
  { name: 'Forest Green', hex: '#15803d' },
  { name: 'Sky Blue', hex: '#0ea5e9' },
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Midnight Navy', hex: '#1e3a8a' },
  { name: 'Grape Purple', hex: '#9333ea' },
  { name: 'Berry Violet', hex: '#7c3aed' },
  { name: 'Bubblegum Pink', hex: '#ec4899' },
  { name: 'Hot Pink', hex: '#f43f5e' },
  { name: 'Chocolate Brown', hex: '#78350f' },
  { name: 'Warm Tan', hex: '#b45309' },
  { name: 'Charcoal Black', hex: '#18181b' },
  { name: 'Snowy White', hex: '#ffffff' },
];

export const PASTEL_COLORS = [
  { name: 'Cotton Candy', hex: '#fbcfe8' },
  { name: 'Baby Pink', hex: '#fce7f3' },
  { name: 'Sweet Peach', hex: '#fed7aa' },
  { name: 'Buttercup Yellow', hex: '#fef08a' },
  { name: 'Soft Cream', hex: '#fef9c3' },
  { name: 'Mint Frost', hex: '#a7f3d0' },
  { name: 'Seafoam', hex: '#bbf7d0' },
  { name: 'Powder Blue', hex: '#bae6fd' },
  { name: 'Baby Blue', hex: '#bfdbfe' },
  { name: 'Soft Lilac', hex: '#ddd6fe' },
  { name: 'Lavender Mist', hex: '#e9d5ff' },
  { name: 'Cloud Gray', hex: '#e2e8f0' },
];

export const NEON_COLORS = [
  { name: 'Electric Lime', hex: '#4ade80' },
  { name: 'Laser Neon Green', hex: '#22c55e' },
  { name: 'Cyan Glow', hex: '#06b6d4' },
  { name: 'Electric Aqua', hex: '#00f5ff' },
  { name: 'Hyper Blue', hex: '#3b82f6' },
  { name: 'Ultra Violet', hex: '#a855f7' },
  { name: 'Neon Purple', hex: '#c084fc' },
  { name: 'Shocking Pink', hex: '#ff007f' },
  { name: 'Hot Neon Pink', hex: '#fb7185' },
  { name: 'Radiant Orange', hex: '#fb923c' },
  { name: 'Neon Tangerine', hex: '#ff6600' },
  { name: 'Sunburst Lemon', hex: '#facc15' },
];

const BRUSH_SIZES = [
  { label: 'Fine', size: 3, dot: 'w-2 h-2' },
  { label: 'Medium', size: 7, dot: 'w-3.5 h-3.5' },
  { label: 'Chunky', size: 14, dot: 'w-5 h-5' },
  { label: 'Jumbo', size: 28, dot: 'w-7 h-7' },
];

export const KidColorPickerModal: React.FC<KidColorPickerModalProps> = ({
  isOpen,
  onClose,
  selectedColor,
  onSelectColor,
  lineWidth,
  onChangeLineWidth,
}) => {
  const [activeTab, setActiveTab] = useState<PaletteCategory>('crayons');
  const [customHex, setCustomHex] = useState<string>(selectedColor);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200 select-none">
      <div className="w-full sm:max-w-lg bg-[#18181e] border border-white/15 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Kid-Friendly Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/30 transition-transform scale-105"
              style={{ backgroundColor: selectedColor }}
            >
              <Palette className="w-5 h-5 text-white filter drop-shadow" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                <span>Kid Color Studio</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
                  Fun & Vibrant
                </span>
              </h2>
              <p className="text-xs text-gray-400">
                Choose crayons, pastels, neon glow, or make any rainbow color!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs inspired by reference image */}
        <div className="grid grid-cols-4 gap-1.5 py-3">
          <button
            onClick={() => setActiveTab('crayons')}
            className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-2xl font-bold text-xs transition-all ${
              activeTab === 'crayons'
                ? 'bg-gradient-to-b from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 scale-105'
                : 'bg-white/5 hover:bg-white/10 text-gray-300'
            }`}
          >
            <span className="text-base">🖍️</span>
            <span>Crayons</span>
          </button>

          <button
            onClick={() => setActiveTab('pastels')}
            className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-2xl font-bold text-xs transition-all ${
              activeTab === 'pastels'
                ? 'bg-gradient-to-b from-pink-400 to-purple-500 text-white shadow-lg shadow-pink-500/25 scale-105'
                : 'bg-white/5 hover:bg-white/10 text-gray-300'
            }`}
          >
            <span className="text-base">🌸</span>
            <span>Pastels</span>
          </button>

          <button
            onClick={() => setActiveTab('neon')}
            className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-2xl font-bold text-xs transition-all ${
              activeTab === 'neon'
                ? 'bg-gradient-to-b from-cyan-400 to-emerald-500 text-black shadow-lg shadow-cyan-500/25 scale-105'
                : 'bg-white/5 hover:bg-white/10 text-gray-300'
            }`}
          >
            <span className="text-base">✨</span>
            <span>Neon</span>
          </button>

          <button
            onClick={() => setActiveTab('rainbow')}
            className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-2xl font-bold text-xs transition-all ${
              activeTab === 'rainbow'
                ? 'bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 text-white shadow-lg shadow-purple-500/25 scale-105'
                : 'bg-white/5 hover:bg-white/10 text-gray-300'
            }`}
          >
            <span className="text-base">🌈</span>
            <span>Rainbow</span>
          </button>
        </div>

        {/* Color Palette Display */}
        <div className="overflow-y-auto flex-1 p-3 bg-black/30 rounded-2xl border border-white/5 min-h-[220px]">
          {activeTab === 'crayons' && (
            <div className="grid grid-cols-6 sm:grid-cols-6 gap-3">
              {CRAYON_COLORS.map((item) => {
                const isSelected = selectedColor.toLowerCase() === item.hex.toLowerCase();
                return (
                  <button
                    key={item.hex}
                    onClick={() => {
                      onSelectColor(item.hex);
                      setCustomHex(item.hex);
                    }}
                    className={`group relative flex flex-col items-center gap-1 p-1 rounded-2xl transition-all ${
                      isSelected ? 'scale-115' : 'hover:scale-110'
                    }`}
                    title={item.name}
                  >
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-md transition-all ${
                        isSelected
                          ? 'ring-4 ring-white ring-offset-2 ring-offset-[#18181e] scale-105 shadow-xl'
                          : 'border-2 border-white/20'
                      }`}
                      style={{ backgroundColor: item.hex }}
                    >
                      {isSelected && (
                        <Check
                          className={`w-5 h-5 stroke-[3] ${
                            item.hex === '#ffffff' ? 'text-black' : 'text-white'
                          }`}
                        />
                      )}
                    </div>
                    <span className="text-[10px] text-gray-300 font-semibold truncate w-full text-center">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'pastels' && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {PASTEL_COLORS.map((item) => {
                const isSelected = selectedColor.toLowerCase() === item.hex.toLowerCase();
                return (
                  <button
                    key={item.hex}
                    onClick={() => {
                      onSelectColor(item.hex);
                      setCustomHex(item.hex);
                    }}
                    className={`group relative flex flex-col items-center gap-1 p-1 rounded-2xl transition-all ${
                      isSelected ? 'scale-115' : 'hover:scale-110'
                    }`}
                    title={item.name}
                  >
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-md transition-all ${
                        isSelected
                          ? 'ring-4 ring-white ring-offset-2 ring-offset-[#18181e] scale-105 shadow-xl'
                          : 'border-2 border-white/20'
                      }`}
                      style={{ backgroundColor: item.hex }}
                    >
                      {isSelected && (
                        <Check className="w-5 h-5 stroke-[3] text-gray-800" />
                      )}
                    </div>
                    <span className="text-[10px] text-gray-300 font-semibold truncate w-full text-center">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'neon' && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {NEON_COLORS.map((item) => {
                const isSelected = selectedColor.toLowerCase() === item.hex.toLowerCase();
                return (
                  <button
                    key={item.hex}
                    onClick={() => {
                      onSelectColor(item.hex);
                      setCustomHex(item.hex);
                    }}
                    className={`group relative flex flex-col items-center gap-1 p-1 rounded-2xl transition-all ${
                      isSelected ? 'scale-115' : 'hover:scale-110'
                    }`}
                    title={item.name}
                  >
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-md transition-all ${
                        isSelected
                          ? 'ring-4 ring-white ring-offset-2 ring-offset-[#18181e] scale-105 shadow-xl'
                          : 'border-2 border-white/20'
                      }`}
                      style={{ backgroundColor: item.hex }}
                    >
                      {isSelected && (
                        <Check className="w-5 h-5 stroke-[3] text-black" />
                      )}
                    </div>
                    <span className="text-[10px] text-gray-300 font-semibold truncate w-full text-center">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'rainbow' && (
            <div className="flex flex-col items-center gap-4 py-2">
              <div className="text-center">
                <span className="text-sm font-bold text-white">
                  Rainbow Color Wheel & Custom Mixer
                </span>
                <p className="text-xs text-gray-400">
                  Tap anywhere on the rainbow to pick your own custom shade!
                </p>
              </div>

              {/* Rainbow Spectrum Strip */}
              <div className="w-full h-12 rounded-2xl shadow-inner relative overflow-hidden cursor-pointer border-2 border-white/20 bg-gradient-to-r from-red-500 via-yellow-400 via-green-400 via-cyan-400 via-blue-500 via-purple-500 to-pink-500">
                <input
                  type="color"
                  value={customHex}
                  onChange={(e) => {
                    setCustomHex(e.target.value);
                    onSelectColor(e.target.value);
                  }}
                  className="w-full h-full opacity-0 cursor-pointer"
                />
              </div>

              {/* Color Preview & Native Picker Button */}
              <div className="flex items-center gap-4 w-full p-3 rounded-2xl bg-white/5 border border-white/10">
                <div
                  className="w-14 h-14 rounded-2xl shadow-lg border-2 border-white/40 flex-shrink-0"
                  style={{ backgroundColor: selectedColor }}
                />
                <div className="flex-1">
                  <div className="text-xs text-gray-300 font-semibold">Active Custom Color</div>
                  <div className="text-base font-black text-white font-mono uppercase">
                    {selectedColor}
                  </div>
                </div>
                <label className="cursor-pointer px-4 py-2 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs shadow-lg transition-transform active:scale-95 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Pick Shade</span>
                  <input
                    type="color"
                    value={customHex}
                    onChange={(e) => {
                      setCustomHex(e.target.value);
                      onSelectColor(e.target.value);
                    }}
                    className="opacity-0 w-0 h-0 absolute"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Brush Size Selector (Fine, Medium, Chunky, Jumbo) */}
        <div className="pt-3.5 mt-2 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-gray-300">
            <span>Brush Size</span>
            <span className="text-cyan-400 font-mono">{lineWidth} pt</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {BRUSH_SIZES.map((b) => {
              const isSelected = Math.abs(lineWidth - b.size) <= 2;
              return (
                <button
                  key={b.label}
                  onClick={() => onChangeLineWidth(b.size)}
                  className={`flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'
                  }`}
                >
                  <div
                    className={`${b.dot} rounded-full transition-transform ${
                      isSelected ? 'scale-110' : ''
                    }`}
                    style={{ backgroundColor: selectedColor }}
                  />
                  <span className="text-[11px] font-bold">{b.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Done button */}
        <div className="pt-3 mt-2 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-7 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black text-sm shadow-xl shadow-cyan-500/20 active:scale-95 transition-all"
          >
            Start Drawing!
          </button>
        </div>
      </div>
    </div>
  );
};
