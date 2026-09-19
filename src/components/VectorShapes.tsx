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
    // BASICS
    // -------------------------------------------------------------
    case 'star': {
      const points: string[] = [];
      const numPoints = 5;
      const outerR = 90;
      const innerR = 40;
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

    case 'flower': {
      const petals = 8;
      const petalElements: React.ReactNode[] = [];
      for (let i = 0; i < petals; i++) {
        const angle = (i * 360) / petals;
        petalElements.push(
          <g key={i} transform={`rotate(${angle} 100 100)`}>
            <ellipse
              cx="100"
              cy="62"
              rx="16"
              ry="32"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
          </g>
        );
      }
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {petalElements}
          <circle
            cx="100"
            cy="100"
            r="18"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill={strokeColor}
            fillOpacity="0.2"
          />
        </svg>
      );
    }

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
          <circle cx="150" cy="130" r="14" stroke={strokeColor} strokeWidth={strokeWidth} />
          <path
            d="M 88,66 L 108,66 L 108,96 L 70,96 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth * 0.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 114,66 L 136,66 L 154,96 L 114,96 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth * 0.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    // -------------------------------------------------------------
    // ANIMALS
    // -------------------------------------------------------------
    case 'cat': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          <path
            d="M100,56 L130,56 L156,24 L152,76 Q170,92 144,112 Q164,144 150,170 Q100,180 50,170 Q36,144 56,112 Q30,92 48,76 L44,24 L70,56 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <ellipse cx="78" cy="88" rx="7" ry="9" stroke={strokeColor} strokeWidth={strokeWidth} fill={strokeColor} fillOpacity="0.2" />
          <ellipse cx="122" cy="88" rx="7" ry="9" stroke={strokeColor} strokeWidth={strokeWidth} fill={strokeColor} fillOpacity="0.2" />
          <polygon points="100,100 94,95 106,95" stroke={strokeColor} strokeWidth={strokeWidth} fill={strokeColor} />
          <path d="M 100,100 L 100,107 M 100,107 Q 92,114 86,108 M 100,107 Q 108,114 114,108" stroke={strokeColor} strokeWidth={strokeWidth * 0.85} strokeLinecap="round" />
          <line x1="70" y1="104" x2="36" y2="98" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
          <line x1="70" y1="110" x2="36" y2="114" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
          <line x1="130" y1="104" x2="164" y2="98" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
          <line x1="130" y1="110" x2="164" y2="114" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
        </svg>
      );
    }

    case 'lion': {
      // Magnificent Lion Head with radial wavy mane, ears, face, muzzle, eyes & nose
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
          {/* Outer Sunburst Lion Mane */}
          <polygon
            points={manePoints.join(' ')}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={strokeColor}
            fillOpacity="0.06"
          />

          {/* Ears */}
          <circle cx="62" cy="56" r="16" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="62" cy="56" r="8" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} />
          <circle cx="138" cy="56" r="16" stroke={strokeColor} strokeWidth={strokeWidth} />
          <circle cx="138" cy="56" r="8" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} />

          {/* Face Contour */}
          <circle cx="100" cy="104" r="48" stroke={strokeColor} strokeWidth={strokeWidth} />

          {/* Eyes */}
          <ellipse cx="80" cy="95" rx="6" ry="8" stroke={strokeColor} strokeWidth={strokeWidth} fill={strokeColor} fillOpacity="0.3" />
          <ellipse cx="120" cy="95" rx="6" ry="8" stroke={strokeColor} strokeWidth={strokeWidth} fill={strokeColor} fillOpacity="0.3" />
          <circle cx="78" cy="93" r="2" fill="#ffffff" />
          <circle cx="118" cy="93" r="2" fill="#ffffff" />

          {/* Big Triangular Nose */}
          <polygon points="100,118 88,106 112,106" stroke={strokeColor} strokeWidth={strokeWidth} fill={strokeColor} fillOpacity="0.4" strokeLinejoin="round" />

          {/* Lion Muzzle & Mouth */}
          <path d="M 100,118 L 100,126 M 100,126 Q 88,136 78,126 M 100,126 Q 112,136 122,126" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />

          {/* Whiskers */}
          <line x1="72" y1="122" x2="48" y2="120" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
          <line x1="72" y1="126" x2="46" y2="129" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
          <line x1="128" y1="122" x2="152" y2="120" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
          <line x1="128" y1="126" x2="154" y2="129" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
        </svg>
      );
    }

    case 'bird': {
      // Charming Songbird on branch with beak, wing, eye, and tail
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Branch */}
          <path d="M 25,160 Q 90,152 175,164" stroke={strokeColor} strokeWidth={strokeWidth * 1.1} strokeLinecap="round" />
          {/* Little leaf on branch */}
          <path d="M 45,158 Q 55,142 65,156 Q 55,165 45,158 Z" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />

          {/* Bird Feet */}
          <line x1="90" y1="142" x2="90" y2="155" stroke={strokeColor} strokeWidth={strokeWidth * 0.9} strokeLinecap="round" />
          <line x1="104" y1="142" x2="104" y2="155" stroke={strokeColor} strokeWidth={strokeWidth * 0.9} strokeLinecap="round" />

          {/* Tail Feathers */}
          <path d="M 52,128 L 18,142 L 32,122 L 56,120 Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />

          {/* Main Body & Head */}
          <path
            d="M 60,118 C 50,85 70,48 105,48 C 122,48 138,58 144,72 L 175,78 L 144,88 C 146,112 135,138 100,144 C 75,148 64,136 60,118 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Wing */}
          <path
            d="M 94,84 C 114,84 122,96 116,114 C 110,132 82,132 72,118 C 68,102 78,84 94,84 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          {/* Wing Feather Feathers Internal detail */}
          <path d="M 80,105 Q 98,112 110,108 M 76,116 Q 92,124 104,119" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />

          {/* Eye */}
          <circle cx="126" cy="68" r="5" stroke={strokeColor} strokeWidth={strokeWidth} fill={strokeColor} />
          <circle cx="124.5" cy="66.5" r="1.5" fill="#ffffff" />
          {/* Cheek Blush */}
          <circle cx="120" cy="78" r="4" stroke={strokeColor} strokeWidth={strokeWidth * 0.6} fill={strokeColor} fillOpacity="0.2" />
        </svg>
      );
    }

    // -------------------------------------------------------------
    // FRUITS
    // -------------------------------------------------------------
    case 'strawberry': {
      // Juicy Strawberry with leafy crown and seed drops
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Strawberry Stem */}
          <path d="M 100,42 Q 104,22 118,18" stroke={strokeColor} strokeWidth={strokeWidth * 1.1} strokeLinecap="round" />

          {/* Calyx Crown (5 leafy sepals) */}
          <path
            d="M 100,48 L 84,36 L 86,52 L 66,46 L 76,60 L 98,54 L 102,54 L 124,60 L 134,46 L 114,52 L 116,36 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            fill={strokeColor}
            fillOpacity="0.15"
          />

          {/* Heart-Drop Berry Body */}
          <path
            d="M 64,66 C 36,92 48,142 92,176 C 96,179 104,179 108,176 C 152,142 164,92 136,66 C 118,52 82,52 64,66 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Seeds Grid */}
          {[
            { cx: 78, cy: 84 },
            { cx: 100, cy: 80 },
            { cx: 122, cy: 84 },
            { cx: 68, cy: 106 },
            { cx: 90, cy: 102 },
            { cx: 110, cy: 102 },
            { cx: 132, cy: 106 },
            { cx: 78, cy: 128 },
            { cx: 100, cy: 124 },
            { cx: 122, cy: 128 },
            { cx: 90, cy: 148 },
            { cx: 110, cy: 148 },
            { cx: 100, cy: 164 },
          ].map((s, idx) => (
            <ellipse
              key={idx}
              cx={s.cx}
              cy={s.cy}
              rx="2.5"
              ry="4"
              transform={`rotate(10 ${s.cx} ${s.cy})`}
              stroke={strokeColor}
              strokeWidth={strokeWidth * 0.75}
              fill={strokeColor}
            />
          ))}
        </svg>
      );
    }

    case 'orange': {
      // Plump citrus orange with stem & leaves, plus side citrus slice segment
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Leaves & Stem at top */}
          <path d="M 100,42 L 100,30" stroke={strokeColor} strokeWidth={strokeWidth * 1.2} strokeLinecap="round" />
          <path d="M 100,34 Q 120,20 132,32 Q 120,44 100,34 Z" stroke={strokeColor} strokeWidth={strokeWidth} fill={strokeColor} fillOpacity="0.2" />
          <path d="M 100,34 Q 80,22 68,34 Q 80,44 100,34 Z" stroke={strokeColor} strokeWidth={strokeWidth} fill={strokeColor} fillOpacity="0.2" />

          {/* Main Orange Round Body */}
          <circle cx="100" cy="112" r="66" stroke={strokeColor} strokeWidth={strokeWidth} />

          {/* Citrus Wheel Detail on the Face */}
          <circle cx="100" cy="112" r="54" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} strokeDasharray="3 3" />
          <circle cx="100" cy="112" r="10" stroke={strokeColor} strokeWidth={strokeWidth} fill={strokeColor} fillOpacity="0.2" />

          {/* 8 Radial Citrus Segments */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <line
              key={i}
              x1="100"
              y1="112"
              x2={100 + 48 * Math.cos((angle * Math.PI) / 180)}
              y2={112 + 48 * Math.sin((angle * Math.PI) / 180)}
              stroke={strokeColor}
              strokeWidth={strokeWidth * 0.85}
              strokeLinecap="round"
            />
          ))}
        </svg>
      );
    }

    case 'watermelon': {
      // Classic crescent watermelon wedge with green rind and dark seeds
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Outer Rind Arc */}
          <path
            d="M 20,85 C 32,165 168,165 180,85 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth * 1.1}
            strokeLinejoin="round"
          />
          {/* Inner White Pith Arc */}
          <path
            d="M 28,88 C 40,154 160,154 172,88"
            stroke={strokeColor}
            strokeWidth={strokeWidth * 0.8}
          />
          {/* Top Slice Cut Line */}
          <line x1="20" y1="85" x2="180" y2="85" stroke={strokeColor} strokeWidth={strokeWidth} />

          {/* Watermelon Seeds */}
          {[
            { cx: 58, cy: 104 },
            { cx: 84, cy: 102 },
            { cx: 116, cy: 102 },
            { cx: 142, cy: 104 },
            { cx: 72, cy: 122 },
            { cx: 100, cy: 120 },
            { cx: 128, cy: 122 },
            { cx: 100, cy: 138 },
          ].map((seed, i) => (
            <ellipse
              key={i}
              cx={seed.cx}
              cy={seed.cy}
              rx="3"
              ry="5"
              stroke={strokeColor}
              strokeWidth={strokeWidth * 0.8}
              fill={strokeColor}
            />
          ))}
        </svg>
      );
    }

    case 'apple': {
      // Luscious Apple with dimpled bottom and jaunty leaf
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Apple Stem */}
          <path d="M 100,48 Q 106,24 116,22" stroke={strokeColor} strokeWidth={strokeWidth * 1.2} strokeLinecap="round" />
          {/* Leaf */}
          <path d="M 106,36 Q 130,22 138,36 Q 126,50 106,36 Z" stroke={strokeColor} strokeWidth={strokeWidth} fill={strokeColor} fillOpacity="0.2" />

          {/* Apple Silhouette with heart dimples */}
          <path
            d="M 100,56 C 85,42 42,48 38,92 C 34,136 68,172 90,174 C 96,174 98,168 100,168 C 102,168 104,174 110,174 C 132,172 166,136 162,92 C 158,48 115,42 100,56 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
          />
          {/* Shine highlight */}
          <path d="M 60,78 Q 54,102 60,122" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} strokeLinecap="round" opacity="0.6" />
        </svg>
      );
    }

    // -------------------------------------------------------------
    // SWEETS & CANDY
    // -------------------------------------------------------------
    case 'marshmallow': {
      // Cute, puffy cylindrical marshmallow with soft rounded curves & kawaii face
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Main Puffy Marshmallow Cylinder */}
          <g transform="rotate(-6 100 100)">
            {/* Cylinder Body */}
            <path
              d="M 52,70 L 52,130 C 52,152 148,152 148,130 L 148,70"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />
            {/* Top Ellipse Cap */}
            <ellipse cx="100" cy="70" rx="48" ry="22" stroke={strokeColor} strokeWidth={strokeWidth} fill={strokeColor} fillOpacity="0.08" />

            {/* Kawaii Face on Marshmallow */}
            <ellipse cx="80" cy="106" rx="4.5" ry="6" stroke={strokeColor} strokeWidth={strokeWidth} fill={strokeColor} />
            <circle cx="78" cy="104" r="1.5" fill="#ffffff" />
            <ellipse cx="120" cy="106" rx="4.5" ry="6" stroke={strokeColor} strokeWidth={strokeWidth} fill={strokeColor} />
            <circle cx="118" cy="104" r="1.5" fill="#ffffff" />

            {/* Rosy Blush Cheeks */}
            <ellipse cx="68" cy="114" rx="6" ry="4" stroke={strokeColor} strokeWidth={strokeWidth * 0.6} fill={strokeColor} fillOpacity="0.3" />
            <ellipse cx="132" cy="114" rx="6" ry="4" stroke={strokeColor} strokeWidth={strokeWidth * 0.6} fill={strokeColor} fillOpacity="0.3" />

            {/* Sweet Happy Smile */}
            <path d="M 92,112 Q 100,124 108,112" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />

            {/* Roasting Stick / Skewer passing underneath */}
            <line x1="100" y1="150" x2="100" y2="185" stroke={strokeColor} strokeWidth={strokeWidth * 0.9} strokeLinecap="round" />
            <line x1="100" y1="18" x2="100" y2="48" stroke={strokeColor} strokeWidth={strokeWidth * 0.9} strokeLinecap="round" />
          </g>
        </svg>
      );
    }

    case 'mnms': {
      // Iconic round M&M candies with the signature tilted lowercase "m" printed in center!
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Back M&M Candy */}
          <ellipse
            cx="134"
            cy="76"
            rx="46"
            ry="40"
            transform="rotate(18 134 76)"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray="180 0"
          />
          {/* Back "m" */}
          <path
            d="M 118,78 L 118,66 Q 124,60 130,66 L 130,78 M 130,66 Q 136,60 142,66 L 142,78"
            stroke={strokeColor}
            strokeWidth={strokeWidth * 0.85}
            strokeLinecap="round"
            transform="rotate(18 134 76)"
          />

          {/* Front Foreground M&M Candy */}
          <ellipse
            cx="78"
            cy="118"
            rx="52"
            ry="45"
            transform="rotate(-12 78 118)"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill={strokeColor}
            fillOpacity="0.1"
          />
          {/* Front Signature curved lowercase 'm' */}
          <g transform="rotate(-12 78 118)">
            <path
              d="M 60,126 L 60,108 Q 68,98 76,108 L 76,126 M 76,108 Q 84,98 92,108 L 92,126"
              stroke={strokeColor}
              strokeWidth={strokeWidth * 1.1}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Distinctive M&M edge shine */}
            <path
              d="M 44,116 A 40,34 0 0,1 104,82"
              stroke={strokeColor}
              strokeWidth={strokeWidth * 0.65}
              strokeLinecap="round"
              opacity="0.6"
            />
          </g>
        </svg>
      );
    }

    case 'lollipop': {
      // Classic Pinwheel Swirl Lollipop on a stick with a ribbon bow
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Stick */}
          <line x1="100" y1="135" x2="100" y2="190" stroke={strokeColor} strokeWidth={strokeWidth * 1.2} strokeLinecap="round" />

          {/* Ribbon Bow */}
          <path
            d="M 100,136 L 82,128 Q 78,142 96,140 Z M 100,136 L 118,128 Q 122,142 104,140 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth * 0.85}
            fill={strokeColor}
            fillOpacity="0.3"
          />
          <circle cx="100" cy="136" r="4" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} fill={strokeColor} />

          {/* Outer Candy Disc */}
          <circle cx="100" cy="74" r="54" stroke={strokeColor} strokeWidth={strokeWidth} />

          {/* Spiral Concentric Swirl */}
          <path
            d="M 100,74
               A 8,8 0 0,1 108,74
               A 16,16 0 0,1 92,74
               A 24,24 0 0,1 124,74
               A 32,32 0 0,1 76,74
               A 40,40 0 0,1 140,74
               A 48,48 0 0,1 60,74"
            stroke={strokeColor}
            strokeWidth={strokeWidth * 0.85}
            strokeLinecap="round"
          />
        </svg>
      );
    }

    case 'candy': {
      // Classic Twist-Wrapped Hard Candy with striped wrapper body
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          <g transform="rotate(-15 100 100)">
            {/* Left Twist Wrapper */}
            <path
              d="M 64,100 L 26,68 Q 30,100 26,132 Z"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
              fill={strokeColor}
              fillOpacity="0.15"
            />
            <line x1="64" y1="100" x2="32" y2="88" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} strokeLinecap="round" />
            <line x1="64" y1="100" x2="32" y2="112" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} strokeLinecap="round" />

            {/* Right Twist Wrapper */}
            <path
              d="M 136,100 L 174,68 Q 170,100 174,132 Z"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
              fill={strokeColor}
              fillOpacity="0.15"
            />
            <line x1="136" y1="100" x2="168" y2="88" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} strokeLinecap="round" />
            <line x1="136" y1="100" x2="168" y2="112" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} strokeLinecap="round" />

            {/* Central Round Candy Body */}
            <ellipse cx="100" cy="100" rx="38" ry="30" stroke={strokeColor} strokeWidth={strokeWidth} fill={strokeColor} fillOpacity="0.1" />

            {/* Festive Diagonal Stripes */}
            <path d="M 80,74 Q 92,100 84,126" stroke={strokeColor} strokeWidth={strokeWidth * 0.9} strokeLinecap="round" />
            <path d="M 96,70 Q 108,100 100,130" stroke={strokeColor} strokeWidth={strokeWidth * 0.9} strokeLinecap="round" />
            <path d="M 112,74 Q 124,100 116,126" stroke={strokeColor} strokeWidth={strokeWidth * 0.9} strokeLinecap="round" />
          </g>
        </svg>
      );
    }

    // -------------------------------------------------------------
    // MORE ANIMALS: PANDA & DOLPHIN
    // -------------------------------------------------------------
    case 'panda': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Panda Ears */}
          <circle cx="56" cy="60" r="22" stroke={strokeColor} strokeWidth={strokeWidth} fill={strokeColor} fillOpacity="0.25" />
          <circle cx="144" cy="60" r="22" stroke={strokeColor} strokeWidth={strokeWidth} fill={strokeColor} fillOpacity="0.25" />
          
          {/* Face Head */}
          <ellipse cx="100" cy="112" rx="66" ry="58" stroke={strokeColor} strokeWidth={strokeWidth} />
          
          {/* Eye Patches */}
          <ellipse cx="76" cy="104" rx="16" ry="20" transform="rotate(-15 76 104)" stroke={strokeColor} strokeWidth={strokeWidth} fill={strokeColor} fillOpacity="0.3" />
          <ellipse cx="124" cy="104" rx="16" ry="20" transform="rotate(15 124 104)" stroke={strokeColor} strokeWidth={strokeWidth} fill={strokeColor} fillOpacity="0.3" />
          
          {/* Eyes & Catchlights */}
          <circle cx="78" cy="103" r="5" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} fill={strokeColor} />
          <circle cx="122" cy="103" r="5" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} fill={strokeColor} />
          <circle cx="76" cy="101" r="1.5" fill="#ffffff" />
          <circle cx="120" cy="101" r="1.5" fill="#ffffff" />
          
          {/* Cute Nose & Mouth */}
          <path d="M 94,124 Q 100,128 106,124 Q 100,121 94,124 Z" stroke={strokeColor} strokeWidth={strokeWidth} fill={strokeColor} />
          <path d="M 100,126 L 100,133 M 92,135 Q 100,142 100,133 Q 100,142 108,135" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          
          {/* Cheeks */}
          <ellipse cx="58" cy="126" rx="8" ry="4" stroke={strokeColor} strokeWidth={strokeWidth * 0.6} opacity="0.5" />
          <ellipse cx="142" cy="126" rx="8" ry="4" stroke={strokeColor} strokeWidth={strokeWidth * 0.6} opacity="0.5" />
        </svg>
      );
    }

    case 'dolphin': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Leaping Dolphin Body */}
          <path
            d="M 28,126 C 45,70 115,50 162,94 C 172,102 182,108 186,108 C 182,112 170,112 160,110 C 120,135 60,145 28,126 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Dorsal Fin */}
          <path
            d="M 108,63 C 114,40 128,42 134,54 C 126,58 118,63 114,66"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Flipper Pectoral Fin */}
          <path
            d="M 125,116 C 122,134 110,142 98,140 C 104,130 114,122 125,116"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Tail Fluke */}
          <path
            d="M 32,128 C 16,116 10,114 12,122 C 18,126 26,128 28,130 C 24,134 14,142 16,146 C 22,146 30,138 36,132"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Eye & Smile */}
          <circle cx="158" cy="100" r="3.5" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} fill={strokeColor} />
          <path d="M 168,107 Q 174,109 178,108" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
          {/* Water Splash Ripples */}
          <path d="M 40,165 Q 65,158 90,165 Q 115,172 140,165" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" opacity="0.6" />
        </svg>
      );
    }

    // -------------------------------------------------------------
    // SPACE: ROCKET, PLANET, ASTRONAUT
    // -------------------------------------------------------------
    case 'rocket': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          <g transform="rotate(25 100 100)">
            {/* Rocket Exhaust Flames */}
            <path
              d="M 88,146 Q 100,186 100,192 Q 100,186 112,146 Z"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              fill={strokeColor}
              fillOpacity="0.35"
            />
            <path d="M 94,146 Q 100,172 100,176 Q 100,172 106,146 Z" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} fill={strokeColor} />
            
            {/* Left & Right Stabilizer Fins */}
            <path d="M 78,120 L 52,146 L 78,142 Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" fill={strokeColor} fillOpacity="0.2" />
            <path d="M 122,120 L 148,146 L 122,142 Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" fill={strokeColor} fillOpacity="0.2" />
            
            {/* Rocket Main Fuselage */}
            <path
              d="M 78,146 C 74,90 86,40 100,24 C 114,40 126,90 122,146 Z"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Nose Cone Trim */}
            <path d="M 86,60 C 94,56 106,56 114,60" stroke={strokeColor} strokeWidth={strokeWidth} />
            
            {/* Porthole Window */}
            <circle cx="100" cy="84" r="16" stroke={strokeColor} strokeWidth={strokeWidth} fill={strokeColor} fillOpacity="0.15" />
            <circle cx="100" cy="84" r="11" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
            <path d="M 95,78 A 7,7 0 0,1 106,81" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" />
            
            {/* Base Engine Ring */}
            <rect x="84" y="146" width="32" height="6" rx="2" stroke={strokeColor} strokeWidth={strokeWidth} />
          </g>
        </svg>
      );
    }

    case 'planet': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Background Ring Arc */}
          <path
            d="M 24,96 C 24,80 70,68 126,68 C 158,68 184,72 194,80"
            stroke={strokeColor}
            strokeWidth={strokeWidth * 1.2}
            strokeLinecap="round"
            opacity="0.5"
          />
          
          {/* Planet Sphere */}
          <circle cx="100" cy="100" r="54" stroke={strokeColor} strokeWidth={strokeWidth} fill={strokeColor} fillOpacity="0.12" />
          
          {/* Atmospheric Banding Stripes */}
          <path d="M 52,90 C 80,82 120,82 148,90" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} strokeLinecap="round" />
          <path d="M 48,110 C 80,102 120,102 152,110" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} strokeLinecap="round" />
          <path d="M 58,128 C 82,122 118,122 142,128" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} strokeLinecap="round" />
          
          {/* Foreground Main Orbital Ring with Thickness */}
          <path
            d="M 14,104 C 14,124 64,138 126,138 C 172,138 200,126 198,110 C 196,96 160,84 110,84 C 54,84 14,94 14,104 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill={strokeColor}
            fillOpacity="0.1"
          />
          <path
            d="M 28,106 C 36,120 74,130 124,130 C 160,130 182,120 184,110"
            stroke={strokeColor}
            strokeWidth={strokeWidth * 0.7}
            strokeLinecap="round"
          />
          
          {/* Distant Twinkling Stars */}
          <path d="M 42,46 L 44,40 L 46,46 L 52,48 L 46,50 L 44,56 L 42,50 L 36,48 Z" stroke={strokeColor} strokeWidth={strokeWidth * 0.6} fill={strokeColor} />
          <circle cx="166" cy="42" r="2.5" fill={strokeColor} />
          <circle cx="178" cy="158" r="2" fill={strokeColor} />
          <circle cx="36" cy="152" r="1.5" fill={strokeColor} />
        </svg>
      );
    }

    case 'astronaut': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Antenna */}
          <line x1="100" y1="20" x2="100" y2="38" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
          <circle cx="100" cy="18" r="4" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} fill={strokeColor} />
          
          {/* Outer Helmet Sphere */}
          <rect x="44" y="38" width="112" height="106" rx="50" stroke={strokeColor} strokeWidth={strokeWidth} fill={strokeColor} fillOpacity="0.1" />
          
          {/* Visor Screen */}
          <rect x="56" y="52" width="88" height="66" rx="28" stroke={strokeColor} strokeWidth={strokeWidth * 1.2} fill={strokeColor} fillOpacity="0.25" />
          
          {/* Visor Glare Reflection */}
          <path d="M 68,66 C 76,60 92,60 100,64 C 94,76 74,80 68,66 Z" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} fill="#ffffff" fillOpacity="0.4" />
          <circle cx="124" cy="98" r="4" stroke={strokeColor} strokeWidth={strokeWidth * 0.6} opacity="0.6" />
          
          {/* Ear Modules */}
          <rect x="36" y="74" width="10" height="28" rx="4" stroke={strokeColor} strokeWidth={strokeWidth} fill={strokeColor} fillOpacity="0.3" />
          <rect x="154" y="74" width="10" height="28" rx="4" stroke={strokeColor} strokeWidth={strokeWidth} fill={strokeColor} fillOpacity="0.3" />
          
          {/* Collar Neck Ring */}
          <rect x="60" y="142" width="80" height="16" rx="8" stroke={strokeColor} strokeWidth={strokeWidth} fill={strokeColor} fillOpacity="0.2" />
          
          {/* Shoulders */}
          <path d="M 40,178 C 45,158 60,154 70,152 M 160,178 C 155,158 140,154 130,152" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      );
    }

    // -------------------------------------------------------------
    // NATURE & FANTASY: BUTTERFLY, BONSAI, CRYSTAL
    // -------------------------------------------------------------
    case 'butterfly': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Antennae */}
          <path d="M 97,76 C 92,54 74,48 70,52" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
          <circle cx="69" cy="53" r="2.5" fill={strokeColor} />
          <path d="M 103,76 C 108,54 126,48 130,52" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
          <circle cx="131" cy="53" r="2.5" fill={strokeColor} />
          
          {/* Slender Body & Head */}
          <ellipse cx="100" cy="74" r="5" stroke={strokeColor} strokeWidth={strokeWidth} fill={strokeColor} />
          <ellipse cx="100" cy="112" rx="4" ry="32" stroke={strokeColor} strokeWidth={strokeWidth} fill={strokeColor} fillOpacity="0.4" />
          
          {/* Left Upper Wing */}
          <path
            d="M 96,86 C 60,40 20,62 30,104 C 36,120 70,122 96,110 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill={strokeColor}
            fillOpacity="0.12"
          />
          <path d="M 96,96 C 70,75 48,82 52,102" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
          <circle cx="56" cy="86" r="6" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} opacity="0.7" />
          
          {/* Right Upper Wing */}
          <path
            d="M 104,86 C 140,40 180,62 170,104 C 164,120 130,122 104,110 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill={strokeColor}
            fillOpacity="0.12"
          />
          <path d="M 104,96 C 130,75 152,82 148,102" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} />
          <circle cx="144" cy="86" r="6" stroke={strokeColor} strokeWidth={strokeWidth * 0.7} opacity="0.7" />
          
          {/* Left Lower Wing */}
          <path
            d="M 96,116 C 64,120 44,142 54,166 C 66,178 92,156 96,134 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill={strokeColor}
            fillOpacity="0.12"
          />
          
          {/* Right Lower Wing */}
          <path
            d="M 104,116 C 136,120 156,142 146,166 C 134,178 108,156 104,134 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill={strokeColor}
            fillOpacity="0.12"
          />
        </svg>
      );
    }

    case 'bonsai': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Ceramic Planter Pot */}
          <path d="M 52,150 L 148,150 L 140,172 L 60,172 Z" stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" fill={strokeColor} fillOpacity="0.2" />
          <line x1="48" y1="150" x2="152" y2="150" stroke={strokeColor} strokeWidth={strokeWidth * 1.2} strokeLinecap="round" />
          {/* Pot Feet */}
          <rect x="68" y="172" width="10" height="4" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          <rect x="122" y="172" width="10" height="4" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          
          {/* Trunk & Main Branches */}
          <path
            d="M 96,150 C 94,130 82,118 88,104 C 94,92 110,88 116,74 C 114,64 104,58 100,52"
            stroke={strokeColor}
            strokeWidth={strokeWidth * 1.8}
            strokeLinecap="round"
          />
          <path d="M 88,104 C 74,100 62,106 54,98" stroke={strokeColor} strokeWidth={strokeWidth * 1.3} strokeLinecap="round" />
          <path d="M 112,82 C 128,84 140,78 148,74" stroke={strokeColor} strokeWidth={strokeWidth * 1.3} strokeLinecap="round" />
          
          {/* Foliage Cloud Left */}
          <path
            d="M 36,94 C 32,84 46,74 58,78 C 66,72 78,76 76,86 C 82,92 78,104 68,104 C 54,108 40,102 36,94 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill={strokeColor}
            fillOpacity="0.25"
          />
          
          {/* Foliage Cloud Right */}
          <path
            d="M 130,72 C 126,62 140,52 152,56 C 160,50 172,56 170,66 C 176,72 170,82 160,82 C 146,84 134,80 130,72 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill={strokeColor}
            fillOpacity="0.25"
          />
          
          {/* Foliage Cloud Top Canopy */}
          <path
            d="M 76,46 C 72,32 90,20 106,24 C 118,18 132,26 130,38 C 138,46 130,58 118,58 C 100,60 82,56 76,46 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill={strokeColor}
            fillOpacity="0.25"
          />
        </svg>
      );
    }

    case 'crystal': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Center Tall Crystal Tower */}
          <polygon
            points="100,24 126,60 122,154 100,166 78,154 74,60"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            fill={strokeColor}
            fillOpacity="0.15"
          />
          {/* Facet lines */}
          <line x1="100" y1="24" x2="100" y2="166" stroke={strokeColor} strokeWidth={strokeWidth * 0.9} />
          <line x1="74" y1="60" x2="100" y2="76" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          <line x1="126" y1="60" x2="100" y2="76" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          <line x1="100" y1="76" x2="100" y2="166" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          
          {/* Left Angled Crystal */}
          <polygon
            points="58,82 76,104 74,160 52,168 38,158 42,108"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            fill={strokeColor}
            fillOpacity="0.2"
          />
          <line x1="58" y1="82" x2="56" y2="164" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          
          {/* Right Angled Crystal */}
          <polygon
            points="142,82 158,108 162,158 148,168 126,160 124,104"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            fill={strokeColor}
            fillOpacity="0.2"
          />
          <line x1="142" y1="82" x2="144" y2="164" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
          
          {/* Magic Sparkle Accents */}
          <path d="M 148,36 L 152,24 L 156,36 L 168,40 L 156,44 L 152,56 L 148,44 L 136,40 Z" stroke={strokeColor} strokeWidth={strokeWidth * 0.6} fill={strokeColor} />
          <circle cx="48" cy="62" r="2.5" fill={strokeColor} />
        </svg>
      );
    }

    // -------------------------------------------------------------
    // VEHICLES: SAILBOAT & AIRPLANE
    // -------------------------------------------------------------
    case 'sailboat': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Mast */}
          <line x1="98" y1="30" x2="98" y2="146" stroke={strokeColor} strokeWidth={strokeWidth * 1.3} strokeLinecap="round" />
          {/* Masthead Pennant */}
          <path d="M 98,30 L 118,36 L 98,42 Z" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} fill={strokeColor} />
          
          {/* Main Sail (Right) */}
          <path
            d="M 104,38 L 160,136 L 104,136 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            fill={strokeColor}
            fillOpacity="0.2"
          />
          
          {/* Jib Fore Sail (Left) */}
          <path
            d="M 92,48 L 42,136 L 92,136 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            fill={strokeColor}
            fillOpacity="0.15"
          />
          
          {/* Hull */}
          <path
            d="M 32,146 L 168,146 L 146,172 L 54,172 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth * 1.2}
            strokeLinejoin="round"
            fill={strokeColor}
            fillOpacity="0.3"
          />
          
          {/* Water Waves */}
          <path d="M 22,178 Q 42,170 62,178 Q 82,186 102,178 Q 122,170 142,178 Q 162,186 182,178" stroke={strokeColor} strokeWidth={strokeWidth * 0.9} strokeLinecap="round" />
        </svg>
      );
    }

    case 'airplane': {
      return (
        <svg viewBox="0 0 200 200" className={className} fill="none">
          {/* Fuselage Body */}
          <path
            d="M 100,24 C 94,36 90,74 90,146 L 82,168 L 100,164 L 118,168 L 110,146 C 110,74 106,36 100,24 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            fill={strokeColor}
            fillOpacity="0.15"
          />
          
          {/* Main Swept Wings */}
          <path
            d="M 90,84 L 18,124 L 20,134 L 90,118 L 110,118 L 180,134 L 182,124 L 110,84 Z"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            fill={strokeColor}
            fillOpacity="0.2"
          />
          
          {/* Jet Engines under wings */}
          <rect x="52" y="112" width="10" height="20" rx="3" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} fill={strokeColor} fillOpacity="0.4" />
          <rect x="138" y="112" width="10" height="20" rx="3" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} fill={strokeColor} fillOpacity="0.4" />
          
          {/* Horizontal Tail Stabilizers */}
          <path
            d="M 90,154 L 64,170 L 64,176 L 92,166 M 110,154 L 136,170 L 136,176 L 108,166"
            stroke={strokeColor}
            strokeWidth={strokeWidth * 0.9}
            strokeLinejoin="round"
          />
          
          {/* Cockpit Windshield */}
          <path d="M 96,44 C 98,42 102,42 104,44 L 106,50 L 94,50 Z" stroke={strokeColor} strokeWidth={strokeWidth * 0.75} fill={strokeColor} />
        </svg>
      );
    }
  }
};

