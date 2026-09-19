import React, { useState, useEffect, useRef } from 'react';
import {
  DrawingLine,
  ReferenceTarget,
  ReferenceTransform,
  ExportBackgroundMode,
} from '../types';
import { VectorShape } from './VectorShapes';
import {
  Share2,
  Download,
  Copy,
  Check,
  X,
  Sparkles,
  Smartphone,
  Eye,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';

interface ExportPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  lines: DrawingLine[];
  referenceTarget: ReferenceTarget;
  referenceTransform: ReferenceTransform;
}

export const ExportPhotoModal: React.FC<ExportPhotoModalProps> = ({
  isOpen,
  onClose,
  lines,
  referenceTarget,
  referenceTransform,
}) => {
  const [bgMode, setBgMode] = useState<ExportBackgroundMode>('transparent');
  const [scaleFactor, setScaleFactor] = useState<number>(2); // 2x Retina default
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [savedStatus, setSavedStatus] = useState<string | null>(null);

  // Generate canvas export data URL whenever options change or modal opens
  useEffect(() => {
    if (!isOpen) return;
    generateExportImage();
  }, [isOpen, bgMode, scaleFactor, lines, referenceTarget, referenceTransform]);

  const generateExportImage = async () => {
    setIsGenerating(true);
    try {
      // Create offscreen canvas with fixed standard dimension (e.g., 1080 x 1080 scaled)
      const baseSize = 1080;
      const width = baseSize * (scaleFactor / 2);
      const height = baseSize * (scaleFactor / 2);

      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = width;
      offscreenCanvas.height = height;
      const ctx = offscreenCanvas.getContext('2d');
      if (!ctx) return;

      // 1. Draw Background Mat if requested
      if (bgMode === 'darkMat') {
        ctx.fillStyle = '#0e0e12';
        ctx.fillRect(0, 0, width, height);

        // Subtle studio grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 1;
        const gridSpacing = 40 * (scaleFactor / 2);
        for (let x = 0; x < width; x += gridSpacing) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSpacing) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      } else if (bgMode === 'withTemplate') {
        ctx.fillStyle = '#111116';
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Draw Reference Target if mode === 'withTemplate'
      if (bgMode === 'withTemplate') {
        ctx.save();
        ctx.translate(width / 2 + referenceTransform.x * (scaleFactor / 2), height / 2 + referenceTransform.y * (scaleFactor / 2));
        ctx.scale(referenceTransform.scale, referenceTransform.scale);

        if (referenceTarget.type === 'vector' && referenceTarget.vectorShape) {
          // Render vector SVG shape to offscreen image
          const svgString = getVectorSvgString(referenceTarget.vectorShape);
          if (svgString) {
            const img = new Image();
            const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            await new Promise<void>((resolve) => {
              img.onload = () => {
                const targetDim = width * 0.7;
                ctx.globalAlpha = 0.55;
                ctx.drawImage(img, -targetDim / 2, -targetDim / 2, targetDim, targetDim);
                URL.revokeObjectURL(url);
                resolve();
              };
              img.onerror = () => {
                URL.revokeObjectURL(url);
                resolve();
              };
              img.src = url;
            });
          }
        } else if (referenceTarget.type === 'image' && referenceTarget.imageSrc) {
          const img = new Image();
          await new Promise<void>((resolve) => {
            img.onload = () => {
              const maxDim = width * 0.75;
              const aspect = img.width / img.height;
              let drawW = maxDim;
              let drawH = maxDim;
              if (aspect > 1) {
                drawH = maxDim / aspect;
              } else {
                drawW = maxDim * aspect;
              }
              ctx.globalAlpha = 0.55;
              ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
              resolve();
            };
            img.onerror = () => resolve();
            img.src = referenceTarget.imageSrc!;
          });
        }
        ctx.restore();
      }

      // 3. Draw Foreground User Strokes
      // Normalize drawing coordinates from screen space or relative coordinates
      // Find bounding box of lines or scale to fit nicely in 1080x1080
      drawStrokesToCanvas(ctx, lines, width, height);

      const dataUrl = offscreenCanvas.toDataURL('image/png');
      setPreviewDataUrl(dataUrl);
    } catch (err) {
      console.error('Failed to render export image', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const drawStrokesToCanvas = (
    ctx: CanvasRenderingContext2D,
    drawingLines: DrawingLine[],
    targetW: number,
    targetH: number
  ) => {
    if (drawingLines.length === 0) return;

    // Find bounding box of all drawn points to scale gracefully onto canvas
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    for (const line of drawingLines) {
      for (const pt of line.points) {
        if (pt.x < minX) minX = pt.x;
        if (pt.y < minY) minY = pt.y;
        if (pt.x > maxX) maxX = pt.x;
        if (pt.y > maxY) maxY = pt.y;
      }
    }

    const strokeW = maxX - minX;
    const strokeH = maxY - minY;

    // If points are valid, center and scale strokes into 80% of target area
    const padding = targetW * 0.1;
    const availableW = targetW - padding * 2;
    const availableH = targetH - padding * 2;

    const scale =
      strokeW > 0 && strokeH > 0
        ? Math.min(availableW / strokeW, availableH / strokeH, 2.5)
        : 1.0;

    const offsetX = targetW / 2 - ((minX + maxX) / 2) * scale;
    const offsetY = targetH / 2 - ((minY + maxY) / 2) * scale;

    ctx.save();

    for (const line of drawingLines) {
      if (line.points.length < 2) continue;

      ctx.save();
      ctx.beginPath();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = line.lineWidth * scale;

      if (line.isEraser) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = '#000000';
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = line.color;
        ctx.globalAlpha = line.opacity;
      }

      ctx.moveTo(line.points[0].x * scale + offsetX, line.points[0].y * scale + offsetY);
      for (let i = 1; i < line.points.length; i++) {
        ctx.lineTo(line.points[i].x * scale + offsetX, line.points[i].y * scale + offsetY);
      }
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  };

  // Helper to serialize vector shapes for offscreen SVG rendering
  const getVectorSvgString = (shape: string): string => {
    // Generate inline SVG markup with cyan stroke
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="400" height="400">
      <style>
        path, circle, ellipse, polygon, line { stroke: #06b6d4; stroke-width: 3; fill: none; stroke-linecap: round; stroke-linejoin: round; }
      </style>
      ${getSvgShapeInnerXml(shape)}
    </svg>`;
  };

  const getSvgShapeInnerXml = (shape: string): string => {
    switch (shape) {
      case 'star':
        return `<polygon points="100,10 123,72 190,72 136,110 156,172 100,134 44,172 64,110 10,72 77,72" />`;
      case 'heart':
        return `<path d="M 100,170 C 60,140 10,110 10,70 A 46,46 0 0,1 100,64 A 46,46 0 0,1 190,70 C 190,110 140,140 100,170 Z" />`;
      case 'lion':
        return `<circle cx="100" cy="100" r="75" stroke-dasharray="12 6" /><circle cx="100" cy="104" r="48" /><circle cx="62" cy="56" r="16" /><circle cx="138" cy="56" r="16" /><ellipse cx="80" cy="95" rx="6" ry="8" /><ellipse cx="120" cy="95" rx="6" ry="8" /><polygon points="100,118 88,106 112,106" /><path d="M 100,118 L 100,126 M 100,126 Q 88,136 78,126 M 100,126 Q 112,136 122,126" />`;
      case 'bird':
        return `<path d="M 60,118 C 50,85 70,48 105,48 C 122,48 138,58 144,72 L 175,78 L 144,88 C 146,112 135,138 100,144 C 75,148 64,136 60,118 Z" /><circle cx="126" cy="68" r="5" /><path d="M 94,84 C 114,84 122,96 116,114 C 110,132 82,132 72,118 C 68,102 78,84 94,84 Z" /><line x1="25" y1="160" x2="175" y2="160" />`;
      case 'strawberry':
        return `<path d="M 100,42 Q 104,22 118,18" /><path d="M 64,66 C 36,92 48,142 92,176 C 96,179 104,179 108,176 C 152,142 164,92 136,66 C 118,52 82,52 64,66 Z" /><circle cx="100" cy="90" r="3" /><circle cx="80" cy="110" r="3" /><circle cx="120" cy="110" r="3" /><circle cx="100" cy="130" r="3" />`;
      case 'orange':
        return `<circle cx="100" cy="112" r="66" /><path d="M 100,42 L 100,30" /><circle cx="100" cy="112" r="54" stroke-dasharray="3 3" /><circle cx="100" cy="112" r="10" />`;
      case 'watermelon':
        return `<path d="M 20,85 C 32,165 168,165 180,85 Z" /><line x1="20" y1="85" x2="180" y2="85" /><circle cx="60" cy="105" r="4" /><circle cx="100" cy="120" r="4" /><circle cx="140" cy="105" r="4" />`;
      case 'apple':
        return `<path d="M 100,48 Q 106,24 116,22" /><path d="M 100,56 C 85,42 42,48 38,92 C 34,136 68,172 90,174 C 96,174 98,168 100,168 C 102,168 104,174 110,174 C 132,172 166,136 162,92 C 158,48 115,42 100,56 Z" />`;
      case 'marshmallow':
        return `<ellipse cx="100" cy="70" rx="48" ry="22" /><path d="M 52,70 L 52,130 C 52,152 148,152 148,130 L 148,70" /><circle cx="80" cy="106" r="4" /><circle cx="120" cy="106" r="4" /><path d="M 92,112 Q 100,122 108,112" />`;
      case 'mnms':
        return `<ellipse cx="80" cy="115" rx="52" ry="45" /><path d="M 62,124 L 62,108 Q 70,98 78,108 L 78,124 M 78,108 Q 86,98 94,108 L 94,124" />`;
      case 'lollipop':
        return `<circle cx="100" cy="74" r="54" /><line x1="100" y1="128" x2="100" y2="185" /><path d="M 100,74 A 16,16 0 0,1 92,74 A 24,24 0 0,1 124,74 A 32,32 0 0,1 76,74 A 40,40 0 0,1 140,74" />`;
      case 'candy':
        return `<ellipse cx="100" cy="100" rx="38" ry="30" /><path d="M 64,100 L 26,68 Q 30,100 26,132 Z" /><path d="M 136,100 L 174,68 Q 170,100 174,132 Z" />`;
      default:
        return `<polygon points="100,10 123,72 190,72 136,110 156,172 100,134 44,172 64,110 10,72 77,72" />`;
    }
  };

  // 1. Native Web Share to iOS Photos / Camera Roll
  const handleSaveToPhotos = async () => {
    if (!previewDataUrl) return;

    try {
      // Convert dataUrl to File blob
      const res = await fetch(previewDataUrl);
      const blob = await res.blob();
      const file = new File([blob], `TraceDraw-${Date.now()}.png`, { type: 'image/png' });

      // Check for Web Share API (Supported on iOS Safari & iPadOS for Photos)
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'TraceDraw Artwork',
          text: 'My tracing artwork created with TraceDraw iOS',
        });
        setSavedStatus('Opened iOS Share Sheet!');
        setTimeout(() => setSavedStatus(null), 3500);
        return;
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.warn('Web Share failed, falling back to direct download', err);
    }

    // Direct download fallback
    handleDirectDownload();
  };

  // 2. Direct PNG Download
  const handleDirectDownload = () => {
    if (!previewDataUrl) return;
    const link = document.createElement('a');
    link.download = `TraceDraw-Artwork-${Date.now()}.png`;
    link.href = previewDataUrl;
    link.click();
    setSavedStatus('Image saved to downloads!');
    setTimeout(() => setSavedStatus(null), 3000);
  };

  // 3. Copy to Clipboard
  const handleCopyClipboard = async () => {
    if (!previewDataUrl) return;
    try {
      const res = await fetch(previewDataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob,
        }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#16161a] border border-white/10 rounded-3xl shadow-2xl p-5 sm:p-6 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Export to Photos
              </h2>
              <p className="text-[11px] text-gray-400">
                Offline high-resolution PNG export for iPad & iPhone Camera Roll
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto py-3 space-y-4 flex-1">
          {/* Live Preview Box */}
          <div className="flex flex-col items-center justify-center">
            <div
              className={`w-full max-w-[280px] sm:max-w-[320px] aspect-square rounded-2xl border border-white/15 overflow-hidden flex items-center justify-center shadow-inner relative ${
                bgMode === 'transparent'
                  ? 'bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:16px_16px] bg-[#1a1a1f]'
                  : bgMode === 'darkMat'
                  ? 'bg-[#0e0e12]'
                  : 'bg-[#111116]'
              }`}
            >
              {isGenerating ? (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs">Rendering artwork...</span>
                </div>
              ) : previewDataUrl ? (
                <img
                  src={previewDataUrl}
                  alt="Drawing Export Preview"
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <span className="text-xs text-gray-500">No strokes drawn yet</span>
              )}

              {/* Resolution Badge */}
              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-cyan-300">
                {scaleFactor}x Retina HD
              </div>
            </div>
          </div>

          {/* Export Mode Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
              Composition Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setBgMode('transparent')}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-center transition-all ${
                  bgMode === 'transparent'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-white/5 border-white/5 hover:bg-white/10 text-gray-400'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-semibold">Art Only (PNG)</span>
                <span className="text-[9px] opacity-75">Transparent</span>
              </button>

              <button
                type="button"
                onClick={() => setBgMode('darkMat')}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-center transition-all ${
                  bgMode === 'darkMat'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-white/5 border-white/5 hover:bg-white/10 text-gray-400'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span className="text-xs font-semibold">Studio Mat</span>
                <span className="text-[9px] opacity-75">Dark Board</span>
              </button>

              <button
                type="button"
                onClick={() => setBgMode('withTemplate')}
                className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-center transition-all ${
                  bgMode === 'withTemplate'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-white/5 border-white/5 hover:bg-white/10 text-gray-400'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span className="text-xs font-semibold">Full Composite</span>
                <span className="text-[9px] opacity-75">Art + Template</span>
              </button>
            </div>
          </div>

          {/* Resolution Options */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5">
            <span className="text-xs text-gray-300 font-medium">Export Quality</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((factor) => (
                <button
                  key={factor}
                  onClick={() => setScaleFactor(factor)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    scaleFactor === factor
                      ? 'bg-cyan-500 text-black shadow-sm'
                      : 'bg-white/5 hover:bg-white/10 text-gray-300'
                  }`}
                >
                  {factor}x
                </button>
              ))}
            </div>
          </div>

          {/* iOS Tip Banner */}
          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 flex items-start gap-2.5">
            <Smartphone className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-cyan-200/90 leading-relaxed">
              <strong className="font-semibold text-cyan-100">iOS & iPad Tip:</strong> Tap{' '}
              <strong className="text-white">Save to Photos</strong> to trigger the native iOS
              Share Sheet, or touch and hold the preview image above to choose{' '}
              <em>"Save to Photos"</em>.
            </p>
          </div>

          {savedStatus && (
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-center text-xs font-semibold text-emerald-300 animate-in fade-in">
              {savedStatus}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <button
            onClick={handleCopyClipboard}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-gray-200 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Image'}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDirectDownload}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>

            <button
              onClick={handleSaveToPhotos}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-xs font-bold text-black shadow-lg shadow-cyan-500/20 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Save to Photos</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
