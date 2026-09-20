import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Check,
  ChevronLeft,
  ChevronRight,
  Eraser,
  PenTool,
  Sun,
  Moon,
  Heart,
  Droplets,
  FileText,
} from 'lucide-react';
import { CanvasTheme, DrawingTool, EraserSize } from '../types';
import { CRAYON_COLORS, PASTEL_COLORS, NEON_COLORS } from './KidColorPickerModal';

interface ColorSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedColor: string;
  onSelectColor: (color: string) => void;
  lineWidth: number;
  onChangeLineWidth: (width: number) => void;
  currentTool: DrawingTool;
  onSelectTool: (tool: DrawingTool) => void;
  eraserSize: EraserSize;
  onChangeEraserSize: (size: EraserSize) => void;
  currentTheme: CanvasTheme;
  onChangeTheme: (theme: CanvasTheme) => void;
}

type PaletteCategory = 'crayons' | 'pastels' | 'neon' | 'rainbow';

const BRUSH_SIZES = [
  { label: 'Fine', size: 3, dot: 'w-2 h-2' },
  { label: 'Medium', size: 7, dot: 'w-3.5 h-3.5' },
  { label: 'Chunky', size: 14, dot: 'w-5 h-5' },
  { label: 'Jumbo', size: 28, dot: 'w-6 h-6' },
];

const ERASER_SIZES: { label: string; size: EraserSize; radius: number }[] = [
  { label: 'Small', size: 'small', radius: 16 },
  { label: 'Medium', size: 'medium', radius: 28 },
  { label: 'Big', size: 'large', radius: 45 },
];

const THEME_OPTIONS: { id: CanvasTheme; label: string; icon: React.ReactNode; bg: string; border: string }[] = [
  {
    id: 'paper',
    label: 'Art Paper',
    icon: <FileText className="w-3.5 h-3.5 text-amber-600" />,
    bg: '#faf9f5',
    border: 'border-amber-200',
  },
  {
    id: 'sunshine',
    label: 'Sunny Day',
    icon: <Sun className="w-3.5 h-3.5 text-amber-500" />,
    bg: '#fffbeb',
    border: 'border-amber-300',
  },
  {
    id: 'blossom',
    label: 'Blossom Pink',
    icon: <Heart className="w-3.5 h-3.5 text-pink-500" />,
    bg: '#fdf2f8',
    border: 'border-pink-300',
  },
  {
    id: 'ocean',
    label: 'Ocean Sky',
    icon: <Droplets className="w-3.5 h-3.5 text-sky-500" />,
    bg: '#f0f9ff',
    border: 'border-sky-300',
  },
  {
    id: 'night',
    label: 'Starry Night',
    icon: <Moon className="w-3.5 h-3.5 text-indigo-400" />,
    bg: '#0f172a',
    border: 'border-indigo-800',
  },
];

export const ColorSidebar: React.FC<ColorSidebarProps> = ({
  isOpen,
  onToggle,
  selectedColor,
  onSelectColor,
  lineWidth,
  onChangeLineWidth,
  currentTool,
  onSelectTool,
  eraserSize,
  onChangeEraserSize,
  currentTheme,
  onChangeTheme,
}) => {
  const [activeTab, setActiveTab] = useState<PaletteCategory>('crayons');
  const [customHex, setCustomHex] = useState<string>(selectedColor);

  return (
    <>
      {/* Floating Toggle Tab when Sidebar is closed */}
      {!isOpen && (
        <button
          onClick={onToggle}
          id="btn-open-color-sidebar"
          className="absolute left-3 top-20 z-40 flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-white/95 text-gray-800 shadow-xl border-2 border-amber-300/80 hover:scale-105 active:scale-95 transition-all"
          title="Open Color & Brush Sidebar"
        >
          <div
            className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: selectedColor }}
          />
          <span className="text-xs font-black tracking-tight text-gray-800">Colors</span>
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </button>
      )}

      {/* Docked Left Sidebar */}
      <aside
        id="kid-color-sidebar"
        className={`fixed top-16 bottom-24 left-2 sm:left-4 z-40 w-72 sm:w-80 flex flex-col bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-amber-200/90 text-gray-800 transition-transform duration-300 select-none overflow-hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-[110%]'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200/60">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md border-2 border-white transition-transform scale-105"
              style={{ backgroundColor: selectedColor }}
            >
              <Palette className="w-4 h-4 text-white filter drop-shadow" />
            </div>
            <div>
              <h3 className="text-sm font-black text-gray-900 leading-tight">Kid Color Studio</h3>
              <p className="text-[10px] font-bold text-amber-700">Choose colors & tools</p>
            </div>
          </div>

          <button
            onClick={onToggle}
            className="p-1.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors"
            title="Minimize Color Sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4 text-xs">
          {/* Tool Mode: Pen / Draw vs Object Eraser */}
          <div className="bg-amber-50/60 p-2 rounded-2xl border border-amber-200/60 space-y-2">
            <div className="text-[10px] font-black uppercase text-amber-800 tracking-wider">
              Drawing Tool
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => onSelectTool('pen')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs transition-all ${
                  currentTool !== 'eraser'
                    ? 'bg-amber-500 text-white shadow-md scale-[1.02]'
                    : 'bg-white text-gray-700 hover:bg-amber-100/50'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Draw & Trace</span>
              </button>

              <button
                onClick={() => onSelectTool('eraser')}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl font-bold text-xs transition-all ${
                  currentTool === 'eraser'
                    ? 'bg-rose-500 text-white shadow-md scale-[1.02]'
                    : 'bg-white text-gray-700 hover:bg-rose-50'
                }`}
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Object Eraser</span>
              </button>
            </div>

            {/* Object Eraser Size options when eraser is active */}
            {currentTool === 'eraser' && (
              <div className="pt-1.5 border-t border-amber-200/50 space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-bold text-rose-700">
                  <span>Eraser Size:</span>
                  <span className="font-extrabold capitalize">{eraserSize} Radius</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {ERASER_SIZES.map((es) => (
                    <button
                      key={es.size}
                      onClick={() => onChangeEraserSize(es.size)}
                      className={`py-1.5 px-2 rounded-lg text-[10px] font-black transition-all ${
                        eraserSize === es.size
                          ? 'bg-rose-500 text-white shadow-sm'
                          : 'bg-white text-gray-600 hover:bg-rose-100'
                      }`}
                    >
                      {es.label}
                    </button>
                  ))}
                </div>
                <p className="text-[9px] text-gray-600 leading-tight">
                  ✨ Touch or swipe over any stroke to erase that entire object!
                </p>
              </div>
            )}
          </div>

          {/* Color Categories Tabs */}
          <div>
            <div className="text-[10px] font-black uppercase text-gray-500 tracking-wider mb-1.5">
              Color Palette
            </div>
            <div className="grid grid-cols-4 gap-1 p-1 bg-gray-100 rounded-2xl">
              <button
                onClick={() => setActiveTab('crayons')}
                className={`py-1.5 px-1 rounded-xl text-[10px] font-black transition-all text-center ${
                  activeTab === 'crayons'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🖍️ Crayons
              </button>
              <button
                onClick={() => setActiveTab('pastels')}
                className={`py-1.5 px-1 rounded-xl text-[10px] font-black transition-all text-center ${
                  activeTab === 'pastels'
                    ? 'bg-pink-400 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🌸 Pastels
              </button>
              <button
                onClick={() => setActiveTab('neon')}
                className={`py-1.5 px-1 rounded-xl text-[10px] font-black transition-all text-center ${
                  activeTab === 'neon'
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ✨ Neon
              </button>
              <button
                onClick={() => setActiveTab('rainbow')}
                className={`py-1.5 px-1 rounded-xl text-[10px] font-black transition-all text-center ${
                  activeTab === 'rainbow'
                    ? 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🌈 Mixer
              </button>
            </div>
          </div>

          {/* Swatches Grid */}
          <div className="p-2.5 bg-gray-50 rounded-2xl border border-gray-200">
            {activeTab === 'crayons' && (
              <div className="grid grid-cols-4 gap-2">
                {CRAYON_COLORS.map((c) => {
                  const isSelected = selectedColor.toLowerCase() === c.hex.toLowerCase();
                  return (
                    <button
                      key={c.hex}
                      onClick={() => {
                        onSelectColor(c.hex);
                        if (currentTool === 'eraser') onSelectTool('pen');
                      }}
                      className="group flex flex-col items-center gap-1 p-1 rounded-xl hover:bg-white transition-all"
                      title={c.name}
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all ${
                          isSelected
                            ? 'ring-4 ring-amber-400 scale-110 shadow-lg'
                            : 'group-hover:scale-105 border border-black/10'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {isSelected && (
                          <Check
                            className={`w-4 h-4 stroke-[3] ${
                              c.hex === '#ffffff' ? 'text-black' : 'text-white'
                            }`}
                          />
                        )}
                      </div>
                      <span className="text-[9px] font-bold text-gray-600 truncate max-w-[54px]">
                        {c.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {activeTab === 'pastels' && (
              <div className="grid grid-cols-4 gap-2">
                {PASTEL_COLORS.map((c) => {
                  const isSelected = selectedColor.toLowerCase() === c.hex.toLowerCase();
                  return (
                    <button
                      key={c.hex}
                      onClick={() => {
                        onSelectColor(c.hex);
                        if (currentTool === 'eraser') onSelectTool('pen');
                      }}
                      className="group flex flex-col items-center gap-1 p-1 rounded-xl hover:bg-white transition-all"
                      title={c.name}
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all ${
                          isSelected
                            ? 'ring-4 ring-pink-400 scale-110 shadow-lg'
                            : 'group-hover:scale-105 border border-black/10'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {isSelected && <Check className="w-4 h-4 text-gray-800 stroke-[3]" />}
                      </div>
                      <span className="text-[9px] font-bold text-gray-600 truncate max-w-[54px]">
                        {c.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {activeTab === 'neon' && (
              <div className="grid grid-cols-4 gap-2">
                {NEON_COLORS.map((c) => {
                  const isSelected = selectedColor.toLowerCase() === c.hex.toLowerCase();
                  return (
                    <button
                      key={c.hex}
                      onClick={() => {
                        onSelectColor(c.hex);
                        if (currentTool === 'eraser') onSelectTool('pen');
                      }}
                      className="group flex flex-col items-center gap-1 p-1 rounded-xl hover:bg-white transition-all"
                      title={c.name}
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all ${
                          isSelected
                            ? 'ring-4 ring-emerald-400 scale-110 shadow-lg'
                            : 'group-hover:scale-105 border border-black/10'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {isSelected && <Check className="w-4 h-4 text-black stroke-[3]" />}
                      </div>
                      <span className="text-[9px] font-bold text-gray-600 truncate max-w-[54px]">
                        {c.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {activeTab === 'rainbow' && (
              <div className="space-y-3 p-1">
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customHex}
                    onChange={(e) => {
                      setCustomHex(e.target.value);
                      onSelectColor(e.target.value);
                      if (currentTool === 'eraser') onSelectTool('pen');
                    }}
                    className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent"
                  />
                  <div className="flex-1">
                    <div className="text-[10px] font-bold text-gray-700">Custom Color Mixer</div>
                    <div className="text-[10px] font-mono text-gray-500 uppercase">{customHex}</div>
                  </div>
                </div>

                <div className="h-4 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 via-green-500 via-blue-500 via-purple-500 to-pink-500 shadow-inner" />
              </div>
            )}
          </div>

          {/* Brush Thickness */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-black uppercase text-gray-500 tracking-wider mb-1.5">
              <span>Brush Size</span>
              <span className="text-amber-700 font-extrabold">{lineWidth} pt</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {BRUSH_SIZES.map((b) => {
                const isSelected = lineWidth === b.size;
                return (
                  <button
                    key={b.size}
                    onClick={() => onChangeLineWidth(b.size)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-white shadow-md scale-105'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="h-6 flex items-center justify-center">
                      <div
                        className={`rounded-full ${b.dot} ${
                          isSelected ? 'bg-white' : 'bg-gray-800'
                        }`}
                      />
                    </div>
                    <span className="text-[9px] font-bold mt-1">{b.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Canvas Background / Paper Theme */}
          <div>
            <div className="text-[10px] font-black uppercase text-gray-500 tracking-wider mb-1.5">
              Canvas Paper Theme
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {THEME_OPTIONS.map((theme) => {
                const isSelected = currentTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => onChangeTheme(theme.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-400 shadow-sm'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border shadow-xs ${theme.border}`}
                      style={{ backgroundColor: theme.bg }}
                    >
                      {theme.icon}
                    </div>
                    <span className="text-[10px] font-bold text-gray-800">{theme.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
