export type VectorShapeCategory = 'basics' | 'animals' | 'fruits' | 'sweets' | 'space' | 'nature' | 'vehicles';

export type VectorShapeType =
  // Basics
  | 'star'
  | 'heart'
  | 'flower'
  | 'car'
  // Animals
  | 'lion'
  | 'bird'
  | 'cat'
  | 'panda'
  | 'dolphin'
  // Fruits
  | 'strawberry'
  | 'orange'
  | 'watermelon'
  | 'apple'
  // Sweets & Candy
  | 'marshmallow'
  | 'mnms'
  | 'lollipop'
  | 'candy'
  // Space
  | 'rocket'
  | 'planet'
  | 'astronaut'
  // Nature & Fantasy
  | 'butterfly'
  | 'bonsai'
  | 'crystal'
  // Vehicles
  | 'sailboat'
  | 'airplane';

export interface VectorShapeMetadata {
  type: VectorShapeType;
  name: string;
  category: VectorShapeCategory;
  description: string;
}

export type DrawingTool = 'pen' | 'pencil' | 'highlighter' | 'eraser';

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
