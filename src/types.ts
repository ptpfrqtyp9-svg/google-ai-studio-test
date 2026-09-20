export type VectorShapeCategory =
  | 'animals-nature'
  | 'vehicles'
  | 'fun-games'
  | 'sports'
  | 'basics';

export type VectorShapeType =
  // Animals & Nature
  | 'butterfly'
  | 'panda'
  | 'cat'
  | 'lion'
  | 'bird'
  | 'dolphin'
  | 'dog'
  | 'rabbit'
  | 'fish'
  | 'turtle'
  | 'bonsai'
  | 'flower'
  | 'sun'
  | 'leaf'
  | 'rainbow'
  | 'strawberry'
  | 'orange'
  | 'watermelon'
  | 'apple'
  | 'crystal'
  // Vehicles
  | 'car'
  | 'airplane'
  | 'sailboat'
  | 'rocket'
  | 'planet'
  | 'astronaut'
  | 'bicycle'
  | 'train'
  // Fun & Games
  | 'gamepad'
  | 'dice'
  | 'crown'
  | 'gift'
  | 'balloon'
  | 'lollipop'
  | 'candy'
  | 'marshmallow'
  | 'mnms'
  | 'music'
  // Sports
  | 'soccer'
  | 'basketball'
  | 'tennis'
  | 'trophy'
  | 'skateboard'
  | 'medal'
  // Basic Shapes
  | 'star'
  | 'heart'
  | 'circle'
  | 'square'
  | 'triangle'
  | 'diamond'
  | 'cloud';

export interface VectorShapeMetadata {
  type: VectorShapeType;
  name: string;
  category: VectorShapeCategory;
  description: string;
  icon?: string;
}

export type DrawingTool =
  | 'brush'
  | 'crayon'
  | 'glitter'
  | 'rainbow'
  | 'pen'
  | 'pencil'
  | 'highlighter'
  | 'eraser';

export interface StrokePoint {
  x: number;
  y: number;
}

export interface DrawingLine {
  id: string;
  points: StrokePoint[];
  color: string;
  lineWidth: number;
  opacity: number;
  isEraser: boolean;
  tool?: DrawingTool;
}

export interface ReferenceTarget {
  type: 'vector' | 'image';
  vectorShape?: VectorShapeType;
  imageSrc?: string;
  imageName?: string;
}

export interface ReferenceTransform {
  x: number;
  y: number;
  scale: number;
}

export type ExportBackgroundMode = 'transparent' | 'darkMat' | 'withTemplate';

export type CompositionGuideMode = 'none' | 'ruleOfThirds' | 'crosshair' | 'dots';

export type AppMode = 'free-draw' | 'color-by-number';

export type CanvasTheme = 'paper' | 'sunshine' | 'blossom' | 'ocean' | 'night';

export type EraserSize = 'small' | 'medium' | 'large';

export interface ColorByNumberPaletteItem {
  number: number;
  color: string;
  name: string;
}

export interface ColorByNumberTemplate {
  id: string;
  name: string;
  category: string;
  cols: number;
  rows: number;
  palette: ColorByNumberPaletteItem[];
  // Grid matrix of cell numbers (0 = blank/transparent)
  grid: number[][];
}

