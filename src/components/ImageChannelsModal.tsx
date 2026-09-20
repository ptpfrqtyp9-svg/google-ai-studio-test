import React, { useState, useRef } from 'react';
import { ReferenceTarget, VectorShapeMetadata, VectorShapeType, VectorShapeCategory } from '../types';
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

export const UNIFIED_PICTURE_LIBRARY: VectorShapeMetadata[] = [
  // -------------------------------------------------------------
  // ANIMALS & NATURE (20)
  // -------------------------------------------------------------
  { type: 'butterfly', name: 'Butterfly', category: 'animals-nature', description: 'Graceful butterfly with patterned wings' },
  { type: 'panda', name: 'Panda Bear', category: 'animals-nature', description: 'Kawaii panda face with sweet ears' },
  { type: 'cat', name: 'Cute Kitty', category: 'animals-nature', description: 'Playful cat with pointy ears and whiskers' },
  { type: 'dog', name: 'Puppy Dog', category: 'animals-nature', description: 'Friendly puppy with floppy ears' },
  { type: 'lion', name: 'Royal Lion', category: 'animals-nature', description: 'Brave lion with a grand sunny mane' },
  { type: 'bird', name: 'Songbird', category: 'animals-nature', description: 'Sweet bird perched on a branch' },
  { type: 'dolphin', name: 'Ocean Dolphin', category: 'animals-nature', description: 'Joyful dolphin leaping over sea waves' },
  { type: 'rabbit', name: 'Bunny Rabbit', category: 'animals-nature', description: 'Fluffy bunny with tall ears' },
  { type: 'fish', name: 'Little Fish', category: 'animals-nature', description: 'Cute swimming fish with bubbly scales' },
  { type: 'turtle', name: 'Friendly Turtle', category: 'animals-nature', description: 'Smiling sea turtle with patterned shell' },
  { type: 'flower', name: 'Spring Flower', category: 'animals-nature', description: '8-petal blooming daisy' },
  { type: 'sun', name: 'Happy Sunshine', category: 'animals-nature', description: 'Warm sun with smiling face and beams' },
  { type: 'leaf', name: 'Green Leaf', category: 'animals-nature', description: 'Fresh garden leaf with delicate veins' },
  { type: 'rainbow', name: 'Magic Rainbow', category: 'animals-nature', description: 'Arching rainbow over fluffy clouds' },
  { type: 'bonsai', name: 'Bonsai Tree', category: 'animals-nature', description: 'Twisting tree in a decorative pot' },
  { type: 'strawberry', name: 'Sweet Berry', category: 'animals-nature', description: 'Juicy strawberry with leaf crown' },
  { type: 'orange', name: 'Citrus Orange', category: 'animals-nature', description: 'Fresh orange with sliced segments' },
  { type: 'watermelon', name: 'Watermelon', category: 'animals-nature', description: 'Sweet watermelon slice with seeds' },
  { type: 'apple', name: 'Red Apple', category: 'animals-nature', description: 'Crisp apple with stem and little leaf' },
  { type: 'crystal', name: 'Magic Crystal', category: 'animals-nature', description: 'Sparkling gemstone cluster' },

  // -------------------------------------------------------------
  // VEHICLES (8)
  // -------------------------------------------------------------
  { type: 'car', name: 'Zoom Car', category: 'vehicles', description: 'Speedy car with rounded wheels' },
  { type: 'airplane', name: 'Sky Airplane', category: 'vehicles', description: 'Jet plane soaring through the clouds' },
  { type: 'sailboat', name: 'Sailboat', category: 'vehicles', description: 'Boat with big sails on the ocean' },
  { type: 'rocket', name: 'Space Rocket', category: 'vehicles', description: 'Rocket blast-off with thruster flames' },
  { type: 'planet', name: 'Saturn Planet', category: 'vehicles', description: 'Orbital planet with ring and stars' },
  { type: 'astronaut', name: 'Astronaut', category: 'vehicles', description: 'Space explorer with helmet visor' },
  { type: 'bicycle', name: 'Bicycle', category: 'vehicles', description: 'Pedal bike with wheels and handlebars' },
  { type: 'train', name: 'Steam Train', category: 'vehicles', description: 'Classic locomotive with puffing chimney' },

  // -------------------------------------------------------------
  // FUN & GAMES (10)
  // -------------------------------------------------------------
  { type: 'gamepad', name: 'Game Controller', category: 'fun-games', description: 'Video game joypad with d-pad and buttons' },
  { type: 'dice', name: 'Lucky Dice', category: 'fun-games', description: '3D playing cube with numbered dots' },
  { type: 'crown', name: 'Princess Crown', category: 'fun-games', description: 'Royal crown with shiny jewels' },
  { type: 'gift', name: 'Surprise Present', category: 'fun-games', description: 'Gift box wrapped with a festive bow' },
  { type: 'balloon', name: 'Party Balloon', category: 'fun-games', description: 'Floating celebration balloon with string' },
  { type: 'lollipop', name: 'Swirl Lollipop', category: 'fun-games', description: 'Rainbow candy swirl on a stick' },
  { type: 'candy', name: 'Wrapped Sweet', category: 'fun-games', description: 'Classic twist-wrap bonbon candy' },
  { type: 'marshmallow', name: 'Marshmallow', category: 'fun-games', description: 'Kawaii soft marshmallow treat' },
  { type: 'mnms', name: 'Chocolate Candy', category: 'fun-games', description: 'Sweet candy button with classic m' },
  { type: 'music', name: 'Music Notes', category: 'fun-games', description: 'Joyful melody double notes' },

  // -------------------------------------------------------------
  // SPORTS (6)
  // -------------------------------------------------------------
  { type: 'soccer', name: 'Soccer Ball', category: 'sports', description: 'Classic patterned football' },
  { type: 'basketball', name: 'Basketball', category: 'sports', description: 'Hoop ball with curved grip seams' },
  { type: 'tennis', name: 'Tennis Ball', category: 'sports', description: 'Bouncing tennis ball with curved lines' },
  { type: 'trophy', name: 'Golden Trophy', category: 'sports', description: 'Champion cup with star emblem' },
  { type: 'skateboard', name: 'Skateboard', category: 'sports', description: 'Rider skateboard with wheels and deck' },
  { type: 'medal', name: 'Number 1 Medal', category: 'sports', description: 'Winner prize medal with ribbon' },

  // -------------------------------------------------------------
  // BASIC SHAPES (7)
  // -------------------------------------------------------------
  { type: 'star', name: 'Bright Star', category: 'basics', description: 'Classic 5-point star' },
  { type: 'heart', name: 'Love Heart', category: 'basics', description: 'Smooth friendly heart shape' },
  { type: 'circle', name: 'Double Circle', category: 'basics', description: 'Round concentric circles' },
  { type: 'square', name: 'Soft Square', category: 'basics', description: 'Geometric box with smooth corners' },
  { type: 'triangle', name: 'Pyramid Triangle', category: 'basics', description: '3-sided balanced triangle' },
  { type: 'diamond', name: 'Sparkle Diamond', category: 'basics', description: 'Faceted gem diamond polygon' },
  { type: 'cloud', name: 'Puffy Cloud', category: 'basics', description: 'Soft friendly sky cloud' },
];

export const VECTOR_LIBRARY = UNIFIED_PICTURE_LIBRARY;

const CATEGORIES: { id: 'all' | VectorShapeCategory; label: string; icon: string }[] = [
  { id: 'all', label: 'All Pictures', icon: '🎨' },
  { id: 'animals-nature', label: 'Animals & Nature', icon: '🐾' },
  { id: 'vehicles', label: 'Vehicles', icon: '🚗' },
  { id: 'fun-games', label: 'Fun & Games', icon: '🎮' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'basics', label: 'Basic Shapes', icon: '⭐' },
];

export const ImageChannelsModal: React.FC<ImageChannelsModalProps> = ({
  isOpen,
  onClose,
  currentTarget,
  onSelectVector,
  onSelectImage,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | VectorShapeCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const photoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const filteredShapes = UNIFIED_PICTURE_LIBRARY.filter((shape) => {
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
      <div className="w-full sm:max-w-2xl bg-[#17171c] border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Kid-Friendly Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Tracing Picture Library
              </h2>
              <p className="text-xs text-gray-400 font-medium">
                Choose a fun picture to trace and color! (Clean outline drawings)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="py-3 space-y-3">
          {/* Quick Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search drawings (e.g., puppy, rocket, star, flower)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {/* Unified Kid-Friendly Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-lg shadow-cyan-500/20 scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pictures Grid (Clean Outline Only) */}
        <div className="overflow-y-auto flex-1 p-2 bg-black/25 rounded-2xl border border-white/5 max-h-[380px]">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
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
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all group relative ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/10'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-200 hover:border-white/25 hover:scale-[1.02]'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-md">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                  {/* Clean outline drawing container */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center p-1 rounded-xl bg-black/30 border border-white/5 group-hover:border-cyan-400/30 transition-colors">
                    <VectorShape
                      type={item.type}
                      strokeColor={isSelected ? '#22d3ee' : '#38bdf8'}
                      strokeWidth={3}
                      className="w-full h-full"
                    />
                  </div>
                  <span className="text-xs font-bold text-center truncate w-full">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>

          {filteredShapes.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">
              No pictures found matching "{searchQuery}". Try another word!
            </div>
          )}
        </div>

        {/* Kid-Friendly Photo Import Options */}
        <div className="pt-3.5 mt-2 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <input
            type="file"
            ref={photoInputRef}
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
          <input
            type="file"
            ref={fileInputRef}
            accept=".png, .jpg, .jpeg"
            className="hidden"
            onChange={handlePhotoChange}
          />

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => photoInputRef.current?.click()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-colors"
            >
              <ImageIcon className="w-4 h-4 text-green-400" />
              <span>Use a Photo</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-white transition-colors"
            >
              <FolderOpen className="w-4 h-4 text-orange-400" />
              <span>Choose a File</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
