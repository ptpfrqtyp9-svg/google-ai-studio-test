import React from 'react';
import { VectorShapeType } from '../types';

interface VectorShapeProps {
  type: VectorShapeType;
  className?: string;
  strokeColor?: string;
  strokeWidth?: number;
}

export const VectorShape: React.FC<VectorShapeProps> = ({
  type,
  className = 'w-full h-full',
  strokeColor = '#06b6d4',
  strokeWidth = 3,
}) => {
  switch (type) {
    // -------------------------------------------------------------
    // BASICS & SHAPES
    // -------------------------------------------------------------
    case 'star': {
      const points: string[] = [];
      const numPoints = 5;
      const outerR = 88;
      const innerR = 38;
      const cx = 100;
      const cy = 100;
      for (let i = 0; i < numPoints * 2; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (i * Math.PI) / numPoints - Math.PI / 2;
        points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
      }
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          <polygon
            points={points.join(' ')}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    case 'heart': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          <path
            d="M 100,170 C 60,140 10,110 10,70 A 46,46 0 0,1 100,64 A 46,46 0 0,1 190,70 C 190,110 140,140 100,170 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    case 'circle': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          <circle cx="100" cy="100" r="76" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="100" cy="100" r="46" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} strokeDasharray="6 6" />
        </svg>
      );
    }

    case 'square': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          <rect x="28" y="28" width="144" height="144" rx="16" stroke={strokeColor} strokeWidth={strokeWidth} />
          <rect x="52" y="52" width="96" height="96" rx="8" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} strokeDasharray="6 6" />
        </svg>
      );
    }

    case 'triangle': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          <polygon
            points="100,24 178,172 22,172"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polygon
            points="100,70 146,152 54,152"
            stroke={strokeColor}
            strokeWidth={strokeWidth * 0.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="6 6"
          />
        </svg>
      );
    }

    case 'diamond': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          <polygon
            points="100,16 182,100 100,184 18,100"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="18" y1="100" x2="182" y2="100" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
          <line x1="100" y1="16" x2="100" y2="184" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
        </svg>
      );
    }

    case 'cloud': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          <path
            d="M 50,144 L 152,144 A 28,28 0 0,0 168,92 A 38,38 0 0,0 126,58 A 44,44 0 0,0 60,82 A 32,32 0 0,0 50,144 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    case 'flower': {
      const petals = 8;
      const petalElements: React.ReactNode[] = [];
      for (let i = 0; i < petals; i++) {
        const angle = (i * 360) / petals;
        petalElements.push(
          <g key={i} transform={`rotate(${angle} 100 100)`}>
            <ellipse
              cx="100"
              cy="58"
              rx="18"
              ry="34"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
          </g>
        );
      }
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {petalElements}
          <circle cx="100" cy="100" r="22" stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>
      );
    }

    // -------------------------------------------------------------
    // ANIMALS & NATURE
    // -------------------------------------------------------------
    case 'butterfly': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Antennae */}
          <path d="M 96,44 Q 84,20 68,24" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
          <path d="M 104,44 Q 116,20 132,24" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
          <circle cx="68" cy="24" r="3" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          <circle cx="132" cy="24" r="3" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          {/* Butterfly Body */}
          <ellipse cx="100" cy="98" rx="8" ry="46" stroke={strokeColor} strokeWidth={strokeWidth} />
          <line x1="94" y1="84" x2="106" y2="84" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
          <line x1="93" y1="102" x2="107" y2="102" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
          <line x1="94" y1="120" x2="106" y2="120" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
          {/* Upper Wings */}
          <path d="M 96,68 C 64,24 16,36 16,84 C 16,116 68,116 94,96 Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 104,68 C 136,24 184,36 184,84 C 184,116 132,116 106,96 Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          {/* Wing interior decorative loops */}
          <circle cx="56" cy="74" r="14" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} />
          <circle cx="144" cy="74" r="14" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} />
          {/* Lower Wings */}
          <path d="M 94,104 C 54,116 28,154 52,176 C 74,196 96,150 96,134 Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 106,104 C 146,116 172,154 148,176 C 126,196 104,150 104,134 Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }

    case 'panda': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Ears */}
          <circle cx="54" cy="58" r="22" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="54" cy="58" r="12" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
          <circle cx="146" cy="58" r="22" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="146" cy="58" r="12" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
          {/* Head Contour */}
          <ellipse cx="100" cy="114" rx="66" ry="58" stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Eye Patches */}
          <ellipse cx="74" cy="106" rx="16" ry="14" transform="rotate(-15 74 106)" stroke={strokeColor} strokeWidth={strokeWidth} />
          <ellipse cx="126" cy="106" rx="16" ry="14" transform="rotate(15 126 106)" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="74" cy="106" r="6" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
          <circle cx="126" cy="106" r="6" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
          {/* Nose */}
          <ellipse cx="100" cy="126" rx="9" ry="6" stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Smile */}
          <path d="M 100,132 L 100,140 Q 92,148 84,142 M 100,140 Q 108,148 116,142" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      );
    }

    case 'cat': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Cat Head with pointy ears */}
          <path
            d="M 68,64 L 46,24 L 84,48 Q 100,44 116,48 L 154,24 L 132,64 Q 168,92 168,124 Q 168,172 100,172 Q 32,172 32,124 Q 32,92 68,64 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Inner ears */}
          <path d="M 54,38 L 74,56" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} strokeLinecap="round" />
          <path d="M 146,38 L 126,56" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} strokeLinecap="round" />
          {/* Eyes */}
          <ellipse cx="76" cy="106" rx="10" ry="14" stroke={strokeColor} strokeWidth={strokeWidth} />
          <line x1="76" y1="96" x2="76" y2="116" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
          <ellipse cx="124" cy="106" rx="10" ry="14" stroke={strokeColor} strokeWidth={strokeWidth} />
          <line x1="124" y1="96" x2="124" y2="116" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
          {/* Nose & Mouth */}
          <polygon points="100,122 93,116 107,116" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          <path d="M 100,122 L 100,130 Q 90,138 82,130 M 100,130 Q 110,138 118,130" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Whiskers */}
          <line x1="68" y1="124" x2="28" y2="118" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} strokeLinecap="round" />
          <line x1="68" y1="132" x2="30" y2="136" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} strokeLinecap="round" />
          <line x1="132" y1="124" x2="172" y2="118" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} strokeLinecap="round" />
          <line x1="132" y1="132" x2="170" y2="136" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} strokeLinecap="round" />
        </svg>
      );
    }

    case 'dog': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Floppy ears */}
          <path d="M 52,66 C 30,76 18,114 36,134 C 48,146 62,126 60,94 Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 148,66 C 170,76 182,114 164,134 C 152,146 138,126 140,94 Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          {/* Dog Face */}
          <ellipse cx="100" cy="110" rx="54" ry="48" stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Friendly Eyes */}
          <circle cx="80" cy="98" r="9" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="80" cy="98" r="3" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          <circle cx="120" cy="98" r="9" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="120" cy="98" r="3" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          {/* Cute Nose & Tongue */}
          <ellipse cx="100" cy="120" rx="12" ry="8" stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M 100,128 L 100,136 Q 90,144 82,136 M 100,136 Q 110,144 118,136" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d="M 94,140 Q 100,158 106,140" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      );
    }

    case 'lion': {
      const manePetals = 16;
      const manePoints: string[] = [];
      const cx = 100;
      const cy = 100;
      for (let i = 0; i < manePetals * 2; i++) {
        const r = i % 2 === 0 ? 88 : 70;
        const angle = (i * Math.PI) / manePetals;
        manePoints.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
      }
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          <polygon
            points={manePoints.join(' ')}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="62" cy="56" r="16" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="138" cy="56" r="16" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="100" cy="104" r="48" stroke={strokeColor} strokeWidth={strokeWidth} />
          <ellipse cx="80" cy="95" rx="6" ry="8" stroke={strokeColor} strokeWidth={strokeWidth} />
          <ellipse cx="120" cy="95" rx="6" ry="8" stroke={strokeColor} strokeWidth={strokeWidth} />
          <polygon points="100,118 88,106 112,106" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          <path d="M 100,118 L 100,126 Q 88,136 78,126 M 100,126 Q 112,136 122,126" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          <line x1="72" y1="122" x2="48" y2="120" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
          <line x1="128" y1="122" x2="152" y2="120" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
        </svg>
      );
    }

    case 'bird': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Bird Body & Head */}
          <path
            d="M 68,124 C 44,116 36,88 56,66 C 72,48 108,44 136,66 C 158,84 164,124 136,146 C 114,162 86,158 68,124 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Wing */}
          <path
            d="M 88,96 C 68,108 64,136 84,142 C 104,148 126,128 118,104 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Beak */}
          <polygon points="152,76 178,82 150,92" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          {/* Eye */}
          <circle cx="132" cy="78" r="7" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="132" cy="78" r="2.5" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          {/* Tail feathers */}
          <path d="M 44,112 L 18,102 L 36,126 L 16,126 L 42,138" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          {/* Legs & Twig */}
          <line x1="96" y1="152" x2="90" y2="176" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          <line x1="112" y1="150" x2="108" y2="176" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d="M 60,176 L 150,176" stroke={strokeColor} strokeWidth={strokeWidth * 1.2} strokeLinecap="round" />
        </svg>
      );
    }

    case 'dolphin': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Leaping Dolphin Contour */}
          <path
            d="M 174,106 C 160,94 134,80 96,82 C 60,84 34,104 22,142 C 26,144 32,142 36,134 C 48,110 74,98 106,98 C 136,98 152,112 168,124 L 174,106 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Dorsal Fin */}
          <path d="M 104,82 C 104,56 122,50 128,54 C 124,68 118,78 116,83" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          {/* Tail Fluke */}
          <path d="M 22,142 C 14,134 6,138 8,148 C 14,154 22,156 26,150 C 28,158 36,162 42,154 C 36,146 28,142 22,142 Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          {/* Flipper */}
          <path d="M 126,104 C 120,122 108,130 98,128 C 104,118 114,110 126,104 Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          {/* Eye & Smile */}
          <circle cx="156" cy="98" r="4" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          <path d="M 166,108 Q 160,114 154,110" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
          {/* Waves */}
          <path d="M 30,172 Q 55,162 80,172 Q 105,182 130,172 Q 155,162 180,172" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      );
    }

    case 'rabbit': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Tall Ears */}
          <ellipse cx="80" cy="52" rx="14" ry="40" transform="rotate(-8 80 52)" stroke={strokeColor} strokeWidth={strokeWidth} />
          <ellipse cx="80" cy="52" rx="6" ry="26" transform="rotate(-8 80 52)" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} />
          <ellipse cx="120" cy="52" rx="14" ry="40" transform="rotate(8 120 52)" stroke={strokeColor} strokeWidth={strokeWidth} />
          <ellipse cx="120" cy="52" rx="6" ry="26" transform="rotate(8 120 52)" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} />
          {/* Head */}
          <circle cx="100" cy="126" r="46" stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Eyes */}
          <ellipse cx="82" cy="116" rx="6" ry="8" stroke={strokeColor} strokeWidth={strokeWidth} />
          <ellipse cx="118" cy="116" rx="6" ry="8" stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Nose & Whiskers */}
          <ellipse cx="100" cy="132" rx="5" ry="4" stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M 100,136 L 100,142 Q 92,148 84,144 M 100,142 Q 108,148 116,144" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          <line x1="72" y1="134" x2="38" y2="132" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} strokeLinecap="round" />
          <line x1="128" y1="134" x2="162" y2="132" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} strokeLinecap="round" />
        </svg>
      );
    }

    case 'fish': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Fish Body */}
          <path
            d="M 40,100 C 60,60 120,60 156,100 C 120,140 60,140 40,100 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Tail Fin */}
          <polygon points="40,100 16,68 24,100 16,132" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          {/* Fin Top */}
          <path d="M 96,70 Q 112,46 128,72" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Eye & Mouth */}
          <circle cx="138" cy="94" r="6" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="138" cy="94" r="2" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          <path d="M 152,104 Q 146,108 140,104" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
          {/* Scales & Gills */}
          <path d="M 120,84 C 112,94 112,106 120,116" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
          <path d="M 96,86 C 88,94 88,104 96,114" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
        </svg>
      );
    }

    case 'turtle': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Shell */}
          <ellipse cx="100" cy="110" rx="58" ry="46" stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Shell Hexagon Pattern */}
          <polygon points="100,86 120,98 120,122 100,134 80,122 80,98" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeLinejoin="round" />
          <line x1="100" y1="86" x2="100" y2="64" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          <line x1="120" y1="98" x2="152" y2="92" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          <line x1="120" y1="122" x2="152" y2="128" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          <line x1="100" y1="134" x2="100" y2="156" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          <line x1="80" y1="122" x2="48" y2="128" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          <line x1="80" y1="98" x2="48" y2="92" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          {/* Head */}
          <ellipse cx="100" cy="50" rx="16" ry="20" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="92" cy="46" r="3" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          <circle cx="108" cy="46" r="3" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          {/* 4 Flippers */}
          <ellipse cx="50" cy="84" rx="18" ry="10" transform="rotate(-30 50 84)" stroke={strokeColor} strokeWidth={strokeWidth} />
          <ellipse cx="150" cy="84" rx="18" ry="10" transform="rotate(30 150 84)" stroke={strokeColor} strokeWidth={strokeWidth} />
          <ellipse cx="56" cy="144" rx="16" ry="9" transform="rotate(30 56 144)" stroke={strokeColor} strokeWidth={strokeWidth} />
          <ellipse cx="144" cy="144" rx="16" ry="9" transform="rotate(-30 144 144)" stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>
      );
    }

    case 'sun': {
      const rays = 12;
      const rayLines: React.ReactNode[] = [];
      for (let i = 0; i < rays; i++) {
        const angle = (i * 360) / rays;
        const rad = (angle * Math.PI) / 180;
        const x1 = 100 + 58 * Math.cos(rad);
        const y1 = 100 + 58 * Math.sin(rad);
        const x2 = 100 + 82 * Math.cos(rad);
        const y2 = 100 + 82 * Math.sin(rad);
        rayLines.push(
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
        );
      }
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {rayLines}
          <circle cx="100" cy="100" r="48" stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Cheerful face */}
          <circle cx="86" cy="94" r="5" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          <circle cx="114" cy="94" r="5" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          <path d="M 86,110 Q 100,124 114,110" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      );
    }

    case 'leaf': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          <path
            d="M 32,168 C 32,168 54,74 168,32 C 168,32 126,146 32,168 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Main vein & side ribs */}
          <path d="M 32,168 Q 96,120 168,32" stroke={strokeColor} strokeWidth={strokeWidth * 0.85} strokeLinecap="round" />
          <line x1="74" y1="134" x2="60" y2="108" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} strokeLinecap="round" />
          <line x1="98" y1="112" x2="90" y2="78" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} strokeLinecap="round" />
          <line x1="126" y1="84" x2="124" y2="54" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} strokeLinecap="round" />
          <line x1="84" y1="140" x2="114" y2="146" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} strokeLinecap="round" />
          <line x1="112" y1="116" x2="140" y2="118" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} strokeLinecap="round" />
        </svg>
      );
    }

    case 'rainbow': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          <path d="M 24,156 A 76,76 0 0,1 176,156" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d="M 38,156 A 62,62 0 0,1 162,156" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d="M 52,156 A 48,48 0 0,1 148,156" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d="M 66,156 A 34,34 0 0,1 134,156" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Cloud left */}
          <path d="M 16,166 L 54,166 A 12,12 0 0,0 60,146 A 16,16 0 0,0 34,136 A 14,14 0 0,0 16,166 Z" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          {/* Cloud right */}
          <path d="M 146,166 L 184,166 A 12,12 0 0,0 190,146 A 16,16 0 0,0 164,136 A 14,14 0 0,0 146,166 Z" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
        </svg>
      );
    }

    case 'bonsai': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Pot */}
          <polygon points="46,154 154,154 142,176 58,176" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          <line x1="38" y1="154" x2="162" y2="154" stroke={strokeColor} strokeWidth={strokeWidth * 1.1} strokeLinecap="round" />
          {/* Trunk & Branches */}
          <path d="M 100,154 Q 106,128 88,110 Q 72,94 82,78 Q 96,62 100,56" stroke={strokeColor} strokeWidth={strokeWidth * 1.4} strokeLinecap="round" />
          <path d="M 90,110 Q 124,104 134,92" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Foliage Clouds */}
          <circle cx="88" cy="62" r="26" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="120" cy="54" r="22" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="140" cy="88" r="20" stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>
      );
    }

    case 'strawberry': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          <path
            d="M 100,172 C 60,172 38,136 38,98 C 38,62 70,58 100,58 C 130,58 162,62 162,98 C 162,136 140,172 100,172 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Crown leaves & Stem */}
          <path d="M 100,58 L 100,32" stroke={strokeColor} strokeWidth={strokeWidth * 1.1} strokeLinecap="round" />
          <polygon points="100,58 74,42 86,60 56,66 84,72 100,58" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          <polygon points="100,58 126,42 114,60 144,66 116,72 100,58" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          {/* Seeds */}
          <circle cx="80" cy="92" r="2.5" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
          <circle cx="100" cy="84" r="2.5" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
          <circle cx="120" cy="92" r="2.5" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
          <circle cx="70" cy="118" r="2.5" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
          <circle cx="100" cy="116" r="2.5" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
          <circle cx="130" cy="118" r="2.5" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
          <circle cx="88" cy="144" r="2.5" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
          <circle cx="112" cy="144" r="2.5" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
        </svg>
      );
    }

    case 'orange': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          <circle cx="100" cy="108" r="66" stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Stem & Leaf */}
          <path d="M 100,42 L 100,24" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d="M 100,32 Q 130,20 136,36 Q 120,48 100,32 Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          {/* Citrus Segments outline inside */}
          <circle cx="100" cy="108" r="50" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeDasharray="8 6" />
          <line x1="100" y1="58" x2="100" y2="158" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} />
          <line x1="50" y1="108" x2="150" y2="108" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} />
          <line x1="65" y1="73" x2="135" y2="143" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} />
          <line x1="65" y1="143" x2="135" y2="73" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} />
        </svg>
      );
    }

    case 'watermelon': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Watermelon Slice Crescent */}
          <path d="M 24,80 Q 100,186 176,80 Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 34,88 Q 100,172 166,88 Z" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" strokeLinejoin="round" />
          {/* Seeds */}
          <ellipse cx="64" cy="106" rx="3.5" ry="6" transform="rotate(-20 64 106)" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
          <ellipse cx="90" cy="124" rx="3.5" ry="6" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
          <ellipse cx="112" cy="124" rx="3.5" ry="6" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
          <ellipse cx="138" cy="106" rx="3.5" ry="6" transform="rotate(20 138 106)" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
        </svg>
      );
    }

    case 'apple': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          <path
            d="M 100,64 C 84,48 48,48 38,82 C 26,124 58,172 100,172 C 142,172 174,124 162,82 C 152,48 116,48 100,64 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Stem & Leaf */}
          <path d="M 100,64 Q 106,36 122,26" stroke={strokeColor} strokeWidth={strokeWidth * 1.1} strokeLinecap="round" />
          <path d="M 108,44 Q 134,36 138,50 Q 122,58 108,44 Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
        </svg>
      );
    }

    case 'crystal': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          <polygon points="100,24 136,68 126,172 74,172 64,68" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          <line x1="100" y1="24" x2="100" y2="172" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          <line x1="64" y1="68" x2="136" y2="68" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          <polygon points="56,76 34,104 46,168 74,168 64,96" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          <polygon points="144,76 166,104 154,168 126,168 136,96" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
        </svg>
      );
    }

    // -------------------------------------------------------------
    // VEHICLES
    // -------------------------------------------------------------
    case 'car': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          <path
            d="M 16,130 L 16,110 Q 16,100 40,100 L 60,100 L 84,60 L 140,60 L 164,100 L 184,104 Q 188,116 188,130 L 168,130 A 18,18 0 0,0 132,130 L 76,130 A 18,18 0 0,0 40,130 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="58" cy="130" r="14" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="58" cy="130" r="6" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
          <circle cx="150" cy="130" r="14" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="150" cy="130" r="6" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
          {/* Windows */}
          <path d="M 88,66 L 108,66 L 108,96 L 70,96 Z" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeLinejoin="round" />
          <path d="M 114,66 L 136,66 L 154,96 L 114,96 Z" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeLinejoin="round" />
        </svg>
      );
    }

    case 'airplane': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Fuselage */}
          <path d="M 100,20 C 92,20 86,52 86,112 L 86,160 L 96,166 L 100,172 L 104,166 L 114,160 L 114,112 C 114,52 108,20 100,20 Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          {/* Swept Wings */}
          <polygon points="86,84 14,124 14,136 86,116" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          <polygon points="114,84 186,124 186,136 114,116" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          {/* Tail Stabilizers */}
          <polygon points="86,150 54,168 54,174 88,162" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          <polygon points="114,150 146,168 146,174 112,162" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          {/* Cockpit Window */}
          <ellipse cx="100" cy="46" rx="6" ry="10" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
        </svg>
      );
    }

    case 'sailboat': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Hull */}
          <path d="M 32,136 L 168,136 L 150,166 L 50,166 Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          {/* Mast */}
          <line x1="98" y1="36" x2="98" y2="136" stroke={strokeColor} strokeWidth={strokeWidth * 1.1} strokeLinecap="round" />
          {/* Main Sail */}
          <polygon points="98,42 98,126 158,126" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          {/* Jib Sail */}
          <polygon points="92,48 42,126 92,126" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          {/* Waves */}
          <path d="M 20,176 Q 45,168 70,176 Q 95,184 120,176 Q 145,168 170,176 Q 185,180 195,176" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      );
    }

    case 'rocket': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Rocket Body */}
          <path
            d="M 100,24 C 74,44 68,98 68,142 L 132,142 C 132,98 126,44 100,24 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Porothole Window */}
          <circle cx="100" cy="80" r="16" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="100" cy="80" r="10" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
          {/* Side Fins */}
          <polygon points="68,114 36,152 68,146" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          <polygon points="132,114 164,152 132,146" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          {/* Center Thruster nozzle & flames */}
          <polygon points="82,142 78,154 122,154 118,142" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          <path d="M 84,154 L 92,176 L 100,162 L 108,176 L 116,154" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }

    case 'planet': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          <circle cx="100" cy="100" r="48" stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Planet Rings */}
          <ellipse cx="100" cy="100" rx="88" ry="24" transform="rotate(-25 100 100)" stroke={strokeColor} strokeWidth={strokeWidth} />
          <ellipse cx="100" cy="100" rx="74" ry="18" transform="rotate(-25 100 100)" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} strokeDasharray="6 6" />
          {/* Craters */}
          <circle cx="84" cy="84" r="7" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
          <circle cx="118" cy="116" r="10" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
        </svg>
      );
    }

    case 'astronaut': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Helmet Outline */}
          <circle cx="100" cy="80" r="54" stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Visor */}
          <rect x="64" y="60" width="72" height="46" rx="20" stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Visor Glare line */}
          <path d="M 74,70 Q 100,64 126,70" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} strokeLinecap="round" />
          {/* Neck ring & Suit collar */}
          <rect x="76" y="134" width="48" height="12" rx="4" stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M 60,146 L 50,176 M 140,146 L 150,176" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      );
    }

    case 'bicycle': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Wheels */}
          <circle cx="48" cy="136" r="28" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="48" cy="136" r="8" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
          <circle cx="152" cy="136" r="28" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="152" cy="136" r="8" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
          {/* Frame */}
          <line x1="48" y1="136" x2="96" y2="136" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          <line x1="48" y1="136" x2="80" y2="88" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          <line x1="96" y1="136" x2="136" y2="88" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          <line x1="80" y1="88" x2="136" y2="88" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          <line x1="136" y1="88" x2="152" y2="136" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Seat & Handlebars */}
          <line x1="72" y1="80" x2="92" y2="80" stroke={strokeColor} strokeWidth={strokeWidth * 1.3} strokeLinecap="round" />
          <path d="M 136,88 L 140,70 L 154,70" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }

    case 'train': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Engine Body */}
          <rect x="36" y="80" width="128" height="66" rx="8" stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Cab */}
          <rect x="110" y="52" width="54" height="60" rx="4" stroke={strokeColor} strokeWidth={strokeWidth} />
          <rect x="120" y="62" width="34" height="24" rx="4" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          {/* Chimney */}
          <polygon points="56,80 50,56 68,56 62,80" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          {/* Wheels */}
          <circle cx="60" cy="154" r="16" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="102" cy="154" r="16" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="144" cy="154" r="16" stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Connecting rod */}
          <line x1="60" y1="154" x2="144" y2="154" stroke={strokeColor} strokeWidth={strokeWidth * 0.85} strokeLinecap="round" />
        </svg>
      );
    }

    // -------------------------------------------------------------
    // FUN & GAMES
    // -------------------------------------------------------------
    case 'gamepad': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Controller Body */}
          <path
            d="M 52,68 C 76,68 88,80 100,80 C 112,80 124,68 148,68 C 172,68 186,88 180,126 C 176,150 156,158 144,142 L 132,122 C 122,120 112,122 100,122 C 88,122 78,120 68,122 L 56,142 C 44,158 24,150 20,126 C 14,88 28,68 52,68 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* D-pad */}
          <polygon points="54,92 62,92 62,84 70,84 70,92 78,92 78,100 70,100 70,108 62,108 62,100 54,100" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeLinejoin="round" />
          {/* 4 Action Buttons */}
          <circle cx="140" cy="88" r="4.5" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          <circle cx="152" cy="96" r="4.5" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          <circle cx="140" cy="104" r="4.5" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          <circle cx="128" cy="96" r="4.5" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
        </svg>
      );
    }

    case 'dice': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Cube Isometric */}
          <polygon points="100,24 164,60 100,96 36,60" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          <polygon points="36,60 100,96 100,168 36,132" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          <polygon points="164,60 100,96 100,168 164,132" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          {/* Pips / Dots */}
          <circle cx="100" cy="60" r="5" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          <circle cx="68" cy="108" r="4.5" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          <circle cx="68" cy="126" r="4.5" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          <circle cx="132" cy="102" r="4.5" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          <circle cx="132" cy="116" r="4.5" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          <circle cx="132" cy="130" r="4.5" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
        </svg>
      );
    }

    case 'crown': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Crown Peaks */}
          <polygon points="32,148 24,74 68,110 100,56 132,110 176,74 168,148" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          <rect x="28" y="148" width="144" height="18" rx="4" stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Jewels */}
          <circle cx="24" cy="68" r="5" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="100" cy="50" r="6" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="176" cy="68" r="5" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="64" cy="157" r="4" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
          <circle cx="100" cy="157" r="5" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
          <circle cx="136" cy="157" r="4" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
        </svg>
      );
    }

    case 'gift': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Box */}
          <rect x="42" y="86" width="116" height="88" rx="6" stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Lid */}
          <rect x="34" y="68" width="132" height="20" rx="4" stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Ribbons */}
          <line x1="100" y1="68" x2="100" y2="174" stroke={strokeColor} strokeWidth={strokeWidth * 1.2} strokeLinecap="round" />
          {/* Bow on Top */}
          <path d="M 100,68 C 80,42 54,42 66,58 C 76,70 94,68 100,68 Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          <path d="M 100,68 C 120,42 146,42 134,58 C 124,70 106,68 100,68 Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          <circle cx="100" cy="68" r="5" stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>
      );
    }

    case 'balloon': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Balloon Oval */}
          <path
            d="M 100,32 C 60,32 46,74 54,116 C 62,148 92,156 100,156 C 108,156 138,148 146,116 C 154,74 140,32 100,32 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Glare line */}
          <path d="M 72,56 Q 66,80 72,104" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
          {/* Knot */}
          <polygon points="100,156 94,166 106,166" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          {/* String */}
          <path d="M 100,166 Q 90,178 104,188" stroke={strokeColor} strokeWidth={strokeWidth * 0.85} strokeLinecap="round" />
        </svg>
      );
    }

    case 'lollipop': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          <circle cx="100" cy="74" r="48" stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Spiral Pinwheel rings */}
          <circle cx="100" cy="74" r="34" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          <circle cx="100" cy="74" r="20" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          <circle cx="100" cy="74" r="8" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          {/* Stick */}
          <line x1="100" y1="122" x2="100" y2="184" stroke={strokeColor} strokeWidth={strokeWidth * 1.3} strokeLinecap="round" />
        </svg>
      );
    }

    case 'candy': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Center Sweet */}
          <circle cx="100" cy="100" r="36" stroke={strokeColor} strokeWidth={strokeWidth} />
          <path d="M 80,74 Q 100,100 80,126" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
          <path d="M 120,74 Q 100,100 120,126" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
          {/* Twist Left */}
          <polygon points="64,100 24,70 34,100 24,130" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          {/* Twist Right */}
          <polygon points="136,100 176,70 166,100 176,130" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
        </svg>
      );
    }

    case 'marshmallow': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Marshmallow Cylinder */}
          <ellipse cx="100" cy="62" rx="46" ry="18" stroke={strokeColor} strokeWidth={strokeWidth} />
          <line x1="54" y1="62" x2="54" y2="136" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          <line x1="146" y1="62" x2="146" y2="136" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          <ellipse cx="100" cy="136" rx="46" ry="18" stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Kawaii Face */}
          <circle cx="80" cy="102" r="4" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          <circle cx="120" cy="102" r="4" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          <path d="M 94,112 Q 100,118 106,112" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
        </svg>
      );
    }

    case 'mnms': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          <circle cx="100" cy="100" r="64" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="100" cy="100" r="54" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} strokeDasharray="8 6" />
          {/* Letter 'm' */}
          <path
            d="M 76,116 L 76,92 Q 76,82 86,82 Q 96,82 96,92 L 96,116 M 96,92 Q 96,82 106,82 Q 116,82 116,92 L 116,116 M 116,92 Q 116,82 126,82 Q 134,82 134,92 L 134,116"
            stroke={strokeColor}
            strokeWidth={strokeWidth * 1.1}
            strokeLinecap="round"
          />
        </svg>
      );
    }

    case 'music': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Double 8th Note */}
          <ellipse cx="64" cy="144" rx="18" ry="14" transform="rotate(-15 64 144)" stroke={strokeColor} strokeWidth={strokeWidth} />
          <ellipse cx="144" cy="128" rx="18" ry="14" transform="rotate(-15 144 128)" stroke={strokeColor} strokeWidth={strokeWidth} />
          <line x1="78" y1="140" x2="78" y2="52" stroke={strokeColor} strokeWidth={strokeWidth * 1.1} strokeLinecap="round" />
          <line x1="158" y1="124" x2="158" y2="36" stroke={strokeColor} strokeWidth={strokeWidth * 1.1} strokeLinecap="round" />
          <polygon points="76,52 160,36 160,54 76,70" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
        </svg>
      );
    }

    // -------------------------------------------------------------
    // SPORTS
    // -------------------------------------------------------------
    case 'soccer': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          <circle cx="100" cy="100" r="70" stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Center Pentagon */}
          <polygon points="100,74 122,90 114,114 86,114 78,90" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          {/* Radiating lines to edge */}
          <line x1="100" y1="74" x2="100" y2="30" stroke={strokeColor} strokeWidth={strokeWidth * 0.85} />
          <line x1="122" y1="90" x2="164" y2="76" stroke={strokeColor} strokeWidth={strokeWidth * 0.85} />
          <line x1="114" y1="114" x2="148" y2="150" stroke={strokeColor} strokeWidth={strokeWidth * 0.85} />
          <line x1="86" y1="114" x2="52" y2="150" stroke={strokeColor} strokeWidth={strokeWidth * 0.85} />
          <line x1="78" y1="90" x2="36" y2="76" stroke={strokeColor} strokeWidth={strokeWidth * 0.85} />
        </svg>
      );
    }

    case 'basketball': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          <circle cx="100" cy="100" r="70" stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Basketball Seams */}
          <line x1="30" y1="100" x2="170" y2="100" stroke={strokeColor} strokeWidth={strokeWidth * 0.9} strokeLinecap="round" />
          <line x1="100" y1="30" x2="100" y2="170" stroke={strokeColor} strokeWidth={strokeWidth * 0.9} strokeLinecap="round" />
          <path d="M 52,42 C 84,68 84,132 52,158" stroke={strokeColor} strokeWidth={strokeWidth * 0.85} strokeLinecap="round" />
          <path d="M 148,42 C 116,68 116,132 148,158" stroke={strokeColor} strokeWidth={strokeWidth * 0.85} strokeLinecap="round" />
        </svg>
      );
    }

    case 'tennis': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          <circle cx="100" cy="100" r="68" stroke={strokeColor} strokeWidth={strokeWidth} />
          {/* Tennis Ball Curved Seams */}
          <path d="M 62,38 C 96,66 96,134 62,162" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d="M 138,38 C 104,66 104,134 138,162" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      );
    }

    case 'trophy': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Cup Body */}
          <path d="M 64,36 L 136,36 L 136,88 C 136,118 100,128 100,128 C 100,128 64,118 64,88 Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          {/* Cup Handles */}
          <path d="M 64,48 C 36,48 34,92 64,96" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d="M 136,48 C 164,48 166,92 136,96" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          {/* Stem & Base */}
          <line x1="100" y1="128" x2="100" y2="152" stroke={strokeColor} strokeWidth={strokeWidth * 1.2} strokeLinecap="round" />
          <polygon points="76,152 124,152 134,174 66,174" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          {/* Star on Cup */}
          <polygon points="100,64 104,74 114,74 106,80 109,90 100,84 91,90 94,80 86,74 96,74" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} strokeLinejoin="round" />
        </svg>
      );
    }

    case 'skateboard': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Deck with curved kicktails */}
          <path d="M 22,96 Q 28,114 44,114 L 156,114 Q 172,114 178,96" stroke={strokeColor} strokeWidth={strokeWidth * 1.2} strokeLinecap="round" />
          {/* Trucks */}
          <rect x="52" y="114" width="16" height="8" rx="2" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          <rect x="132" y="114" width="16" height="8" rx="2" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          {/* Wheels */}
          <circle cx="60" cy="134" r="12" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="60" cy="134" r="4" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          <circle cx="140" cy="134" r="12" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="140" cy="134" r="4" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
        </svg>
      );
    }

    case 'medal': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Ribbons */}
          <polygon points="80,30 64,84 88,84 100,48" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          <polygon points="120,30 136,84 112,84 100,48" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
          {/* Medal Circle */}
          <circle cx="100" cy="124" r="46" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="100" cy="124" r="36" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} strokeDasharray="6 4" />
          {/* Number 1 */}
          <path d="M 94,112 L 102,106 L 102,142 M 90,142 L 114,142" stroke={strokeColor} strokeWidth={strokeWidth * 1.1} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }

    default:
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          <circle cx="100" cy="100" r="70" stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray="6 6" />
        </svg>
      );
  }
};
