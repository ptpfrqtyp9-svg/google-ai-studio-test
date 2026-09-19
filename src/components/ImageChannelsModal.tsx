import React, { useState, useRef } from 'react';
import { ReferenceTarget, VectorShapeMetadata, VectorShapeType } from '../types';
import { VectorShape } from './VectorShapes';
import {
  Sparkles,
  Image as ImageIcon,
  FolderOpen,
  X,
  Search,
  Check,
} from 'lucide-react';

interface ImageChannelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTarget: ReferenceTarget;
  onSelectVector: (shape: VectorShapeType) => void;
  onSelectImage: (dataUrl: string, name: string) => void;
}

const VECTOR_LIBRARY: VectorShapeMetadata[] = [
  // Space
  { type: 'rocket', name: 'Rocket Ship', category: 'space', description: 'Retro rocket with thruster flames' },
  { type: 'planet', name: 'Saturn Planet', category: 'space', description: 'Orbital rings, bands & stars' },
  { type: 'astronaut', name: 'Astronaut', category: 'space', description: 'Cosmonaut helmet & gold visor' },

  // Animals
  { type: 'panda', name: 'Panda Bear', category: 'animals', description: 'Kawaii panda face with black eye patches' },
  { type: 'dolphin', name: 'Dolphin', category: 'animals', description: 'Leaping ocean dolphin & splash waves' },
  { type: 'lion', name: 'Lion', category: 'animals', description: 'Regal mane & whiskers' },
  { type: 'bird', name: 'Bird', category: 'animals', description: 'Perched songbird on twig' },
  { type: 'cat', name: 'Cat', category: 'animals', description: 'Silhouette & feline face' },

  // Nature & Fantasy
  { type: 'butterfly', name: 'Butterfly', category: 'nature', description: 'Graceful wings & filigree patterns' },
  { type: 'bonsai', name: 'Bonsai Tree', category: 'nature', description: 'Zen tree trunk in ceramic pot' },
  { type: 'crystal', name: 'Magic Crystal', category: 'nature', description: 'Geodesic crystal cluster with sparkles' },

  // Vehicles
  { type: 'sailboat', name: 'Sailboat', category: 'vehicles', description: 'Dual sails, mast pennant & sea waves' },
  { type: 'airplane', name: 'Jetliner', category: 'vehicles', description: 'Swept-wing commercial aircraft' },
  { type: 'car', name: 'Vintage Car', category: 'vehicles', description: 'Streamlined vehicle silhouette' },

  // Fruits
  { type: 'strawberry', name: 'Strawberry', category: 'fruits', description: 'Heart berry & leaf crown' },
  { type: 'orange', name: 'Orange', category: 'fruits', description: 'Citrus sphere & segmented slice' },
  { type: 'watermelon', name: 'Watermelon', category: 'fruits', description: 'Smiling slice with seeds' },
  { type: 'apple', name: 'Apple', category: 'fruits', description: 'Stem, leaf & dimpled shape' },

  // Candy & Sweets
  { type: 'marshmallow', name: 'Marshmallow', category: 'sweets', description: 'Puffy kawaii sweet on skewer' },
  { type: 'mnms', name: "M&M's", category: 'sweets', description: 'Signature chocolate candy shells' },
  { type: 'lollipop', name: 'Lollipop', category: 'sweets', description: 'Pinwheel swirl on stick' },
  { type: 'candy', name: 'Wrapped Candy', category: 'sweets', description: 'Classic twist wrapper hard candy' },

  // Basics & Shapes
  { type: 'star', name: 'Star', category: 'basics', description: '5-pointed mathematical star' },
  { type: 'heart', name: 'Heart', category: 'basics', description: 'Smooth cardioid heart' },
  { type: 'flower', name: 'Flower', category: 'basics', description: '8-petal botanical bloom' },
];

const CATEGORIES = [
  { id: 'all', label: 'All Shapes (25)' },
  { id: 'space', label: '🚀 Space' },
  { id: 'animals', label: '🐼 Animals' },
  { id: 'nature', label: '🦋 Nature & Magic' },
  { id: 'vehicles', label: '⛵ Vehicles' },
  { id: 'fruits', label: '🍓 Fruits' },
  { id: 'sweets', label: '🍬 Candy & Sweets' },
  { id: 'basics', label: '🌟 Basics' },
] as const;

export const ImageChannelsModal: React.FC<ImageChannelsModalProps> = ({
  isOpen,
  onClose,
  currentTarget,
  onSelectVector,
  onSelectImage,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const photoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const filteredShapes = VECTOR_LIBRARY.filter((shape) => {
    const matchesCategory = selectedCategory === 'all' || shape.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      shape.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shape.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onSelectImage(dataUrl, file.name);
        onClose();
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full sm:max-w-xl bg-[#16161a] border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Tracing Targets Library
            </h2>
            <p className="text-xs text-gray-400">
              100% offline & local. Zero web requests, zero external APIs.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto py-3 space-y-5 flex-1 pr-1">
          {/* CHANNEL 1: Built-In Vector Library */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>1. Built-In Vector Library</span>
              </div>
              <span className="text-[11px] text-cyan-300/80 font-semibold">
                {VECTOR_LIBRARY.length} Infinite-Scale Shapes
              </span>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-cyan-500 text-black shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Shapes Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 max-h-[260px] overflow-y-auto p-1 bg-black/20 rounded-2xl border border-white/5">
              {filteredShapes.map((item) => {
                const isSelected =
                  currentTarget.type === 'vector' && currentTarget.vectorShape === item.type;
                return (
                  <button
                    key={item.type}
                    onClick={() => {
                      onSelectVector(item.type);
                      onClose();
                    }}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all group relative ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10'
                        : 'bg-white/5 border-white/5 hover:bg-white/10 text-gray-300 hover:border-white/20'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-cyan-400 text-black flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                    <div className="w-12 h-12 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <VectorShape
                        type={item.type}
                        strokeColor={isSelected ? '#22d3ee' : '#9ca3af'}
                        strokeWidth={2.8}
                        className="w-10 h-10"
                      />
                    </div>
                    <span className="text-[11px] font-semibold tracking-tight truncate w-full text-center">
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-white/10" />

          {/* CHANNEL 2: iOS Photos Library */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-wider">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>2. iOS Photos Library</span>
              </div>
              <span className="text-[11px] text-gray-400 font-medium">Filtered for .images</span>
            </div>

            <input
              type="file"
              ref={photoInputRef}
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />

            <button
              onClick={() => photoInputRef.current?.click()}
              className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors group"
            >
              <div className="w-9 h-9 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 group-hover:scale-105 transition-transform">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-xs sm:text-sm font-bold text-white">Select from Photos</div>
                <div className="text-[11px] text-gray-400">
                  Simulates PhotosUI PhotosPicker with asynchronous loading
                </div>
              </div>
            </button>
          </div>

          <div className="h-px bg-white/10" />

          {/* CHANNEL 3: iOS Files App Importer */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider">
                <FolderOpen className="w-3.5 h-3.5" />
                <span>3. iOS Files App / iCloud</span>
              </div>
              <span className="text-[11px] text-gray-400 font-medium">PNG / JPEG • Safe Security Scoping</span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept=".png, .jpg, .jpeg"
              className="hidden"
              onChange={handlePhotoChange}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-colors group"
            >
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 group-hover:scale-105 transition-transform">
                <FolderOpen className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-xs sm:text-sm font-bold text-white">Import from Files App</div>
                <div className="text-[11px] text-gray-400">
                  Simulates .fileImporter with startAccessingSecurityScopedResource
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
