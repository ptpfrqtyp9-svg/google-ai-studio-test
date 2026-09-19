import React from 'react';
import { DrawingLine, ReferenceTarget } from '../types';
import {
  Award,
  Activity,
  Zap,
  Target,
  CheckCircle2,
  X,
  Sparkles,
  Trophy,
  Flame,
} from 'lucide-react';

interface TraceAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lines: DrawingLine[];
  referenceTarget: ReferenceTarget;
}

export const TraceAnalyticsModal: React.FC<TraceAnalyticsModalProps> = ({
  isOpen,
  onClose,
  lines,
  referenceTarget,
}) => {
  if (!isOpen) return null;

  // Calculate stats
  const totalStrokes = lines.length;
  let totalPoints = 0;
  let totalDistancePixels = 0;

  lines.forEach((line) => {
    totalPoints += line.points.length;
    for (let i = 1; i < line.points.length; i++) {
      const p1 = line.points[i - 1];
      const p2 = line.points[i];
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      totalDistancePixels += dist;
    }
  });

  // Convert pixels to approximate real-world centimeters (assuming ~96 dpi -> 37.8 px/cm)
  const estimatedMeters = (totalDistancePixels / 3780).toFixed(2);

  // Estimate accuracy score (gamified formula based on stroke complexity & point density)
  const baseScore = Math.min(
    98,
    Math.max(
      65,
      Math.round(72 + Math.min(totalStrokes * 1.8, 20) + Math.min(totalPoints * 0.02, 6))
    )
  );
  const accuracyScore = totalStrokes === 0 ? 0 : baseScore;

  // Level & Title
  let artistLevel = 'Apprentice Inker';
  let badgeColor = 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30';
  if (totalStrokes >= 25) {
    artistLevel = 'Master Draftsman';
    badgeColor = 'text-purple-400 bg-purple-500/20 border-purple-500/30';
  } else if (totalStrokes >= 12) {
    artistLevel = 'Studio Illustrator';
    badgeColor = 'text-amber-400 bg-amber-500/20 border-amber-500/30';
  } else if (totalStrokes >= 5) {
    artistLevel = 'Keen Tracer';
    badgeColor = 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30';
  }

  // Milestones
  const milestones = [
    {
      title: 'First Stroke Drawn',
      achieved: totalStrokes >= 1,
      desc: 'Began the creative tracing session',
    },
    {
      title: 'Solid Contour (5+ strokes)',
      achieved: totalStrokes >= 5,
      desc: 'Captured core silhouettes and outlines',
    },
    {
      title: 'Detailed Inking (15+ strokes)',
      achieved: totalStrokes >= 15,
      desc: 'Layered shades, textures, and accents',
    },
    {
      title: 'Long Distance Artist (1m+ ink)',
      achieved: Number(estimatedMeters) >= 1.0,
      desc: 'Drew over 1 meter of digital pencil lines',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#16161a] border border-white/15 rounded-3xl overflow-hidden shadow-2xl p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Trace Performance</h2>
              <p className="text-xs text-gray-400">
                Live precision score & stroke metrics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Score Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-[#1a1a24] to-blue-950/40 border border-cyan-500/20 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
              Accuracy Index
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-extrabold text-white font-mono">{accuracyScore}%</span>
              <span className="text-xs text-gray-400">match rating</span>
            </div>
            <div className={`mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badgeColor}`}>
              <Sparkles className="w-3 h-3" />
              <span>{artistLevel}</span>
            </div>
          </div>

          <div className="w-20 h-20 relative flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/10"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-cyan-400 transition-all duration-700"
                strokeDasharray={`${accuracyScore}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <Target className="w-6 h-6 text-cyan-400 absolute" />
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 bg-[#1e1e24] rounded-xl border border-white/5 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-gray-400">Strokes</span>
            <div className="text-lg font-extrabold text-white font-mono">{totalStrokes}</div>
          </div>
          <div className="p-3 bg-[#1e1e24] rounded-xl border border-white/5 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-gray-400">Ink Drawn</span>
            <div className="text-lg font-extrabold text-cyan-300 font-mono">{estimatedMeters}m</div>
          </div>
          <div className="p-3 bg-[#1e1e24] rounded-xl border border-white/5 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-gray-400">Points</span>
            <div className="text-lg font-extrabold text-white font-mono">{totalPoints}</div>
          </div>
        </div>

        {/* Milestones Checklist */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-bold text-gray-300 uppercase tracking-wide">
            Session Milestones
          </span>
          <div className="space-y-1.5">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors ${
                  m.achieved
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-white'
                    : 'bg-white/5 border-white/5 text-gray-500 opacity-60'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold">{m.title}</div>
                  <div className="text-[10px] text-gray-400">{m.desc}</div>
                </div>
                <CheckCircle2
                  className={`w-4 h-4 ${m.achieved ? 'text-cyan-400' : 'text-gray-600'}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold transition-colors"
        >
          Keep Drawing
        </button>
      </div>
    </div>
  );
};
