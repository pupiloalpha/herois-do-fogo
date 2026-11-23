import React from 'react';
import { MissionId } from '../hub/types';

interface MissionBannerArtProps {
  missionId: MissionId;
  compact?: boolean;
}

export const MissionBannerArt: React.FC<MissionBannerArtProps> = ({
  missionId,
  compact = false,
}) => {
  const heightClass = compact ? 'h-12' : 'h-16';

  if (missionId === 'vertical_10') {
    return (
      <div
        aria-hidden="true"
        className={`relative w-full ${heightClass} overflow-hidden bg-gradient-to-br from-amber-500/25 via-orange-600/25 to-rose-950/75 border-b border-orange-400/20`}
      >
        <svg
          viewBox="0 0 320 72"
          preserveAspectRatio="none"
          className="w-full h-full block"
        >
          <defs>
            <linearGradient id="sky-building" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#431407" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="0.45" />
            </linearGradient>
          </defs>
          <rect width="320" height="72" fill="url(#sky-building)" />
          {/* Warm horizon glow */}
          <circle cx="240" cy="54" r="44" fill="#fb923c" fillOpacity="0.24" />
          {/* Skyline towers */}
          <rect x="24" y="28" width="32" height="44" rx="2" fill="#0f172a" fillOpacity="0.85" />
          <rect x="64" y="14" width="44" height="58" rx="2" fill="#1e293b" fillOpacity="0.92" />
          <rect x="118" y="22" width="36" height="50" rx="2" fill="#0f172a" fillOpacity="0.85" />
          <rect x="164" y="8" width="52" height="64" rx="2" fill="#1e293b" fillOpacity="0.95" />
          <rect x="226" y="26" width="38" height="46" rx="2" fill="#0f172a" fillOpacity="0.85" />
          <rect x="272" y="18" width="32" height="54" rx="2" fill="#1e293b" fillOpacity="0.9" />
          {/* Lit and flame-tinted windows */}
          <rect x="74" y="22" width="6" height="6" rx="1" fill="#fde047" fillOpacity="0.85" />
          <rect x="90" y="22" width="6" height="6" rx="1" fill="#fb923c" fillOpacity="0.9" />
          <rect x="74" y="36" width="6" height="6" rx="1" fill="#f97316" fillOpacity="0.9" />
          <rect x="90" y="36" width="6" height="6" rx="1" fill="#fde047" fillOpacity="0.7" />
          <rect x="174" y="18" width="7" height="7" rx="1" fill="#fde047" fillOpacity="0.9" />
          <rect x="190" y="18" width="7" height="7" rx="1" fill="#fde047" fillOpacity="0.75" />
          <rect x="174" y="32" width="7" height="7" rx="1" fill="#fb923c" fillOpacity="0.9" />
          <rect x="190" y="32" width="7" height="7" rx="1" fill="#ef4444" fillOpacity="0.85" />
          <rect x="280" y="28" width="6" height="6" rx="1" fill="#fde047" fillOpacity="0.8" />
          {/* Helipad 'H' accent & rotor silhouette */}
          <rect x="176" y="5" width="28" height="3" rx="1.5" fill="#facc15" fillOpacity="0.9" />
          <path d="M248 16h20M258 16v4m-7 3h14c2 0 4 2 4 4h-18c-2 0-4-2-4-4z" stroke="#fde047" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (missionId === 'flood_rescue') {
    return (
      <div
        aria-hidden="true"
        className={`relative w-full ${heightClass} overflow-hidden bg-gradient-to-br from-sky-500/25 via-cyan-700/25 to-slate-950/80 border-b border-sky-400/20`}
      >
        <svg
          viewBox="0 0 320 72"
          preserveAspectRatio="none"
          className="w-full h-full block"
        >
          <defs>
            <linearGradient id="sky-flood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#082f49" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          <rect width="320" height="72" fill="url(#sky-flood)" />
          {/* Rain streaks */}
          <g stroke="#bae6fd" strokeOpacity="0.26" strokeWidth="1.3" strokeLinecap="round">
            <line x1="42" y1="8" x2="36" y2="24" />
            <line x1="94" y1="12" x2="88" y2="28" />
            <line x1="158" y1="6" x2="152" y2="22" />
            <line x1="224" y1="10" x2="218" y2="26" />
            <line x1="286" y1="8" x2="280" y2="24" />
          </g>
          {/* Partially submerged roof silhouette */}
          <path d="M68 48l22-16 22 16v12H68z" fill="#0f172a" fillOpacity="0.88" />
          <rect x="85" y="42" width="10" height="8" rx="1" fill="#fde047" fillOpacity="0.85" />
          {/* Rescue helicopter & spotlight cone */}
          <polygon points="222,22 192,58 238,58" fill="#fef08a" fillOpacity="0.16" />
          <path d="M206 16h28M220 16v4m-8 2h16c3 0 5 2 5 4h-21c-3 0-5-2-5-4z" stroke="#38bdf8" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          {/* Layered flood waves */}
          <path d="M0 52 Q 40 45 80 52 T 160 52 T 240 52 T 320 52 L 320 72 L 0 72 Z" fill="#0ea5e9" fillOpacity="0.45" />
          <path d="M0 60 Q 45 54 90 60 T 180 60 T 270 60 T 320 60 L 320 72 L 0 72 Z" fill="#38bdf8" fillOpacity="0.45" />
        </svg>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`relative w-full ${heightClass} overflow-hidden bg-gradient-to-br from-emerald-500/25 via-teal-800/25 to-slate-950/80 border-b border-emerald-400/20`}
    >
      <svg
        viewBox="0 0 320 72"
        preserveAspectRatio="none"
        className="w-full h-full block"
      >
        <defs>
          <linearGradient id="sky-forest" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#052e16" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#047857" stopOpacity="0.45" />
          </linearGradient>
        </defs>
        <rect width="320" height="72" fill="url(#sky-forest)" />
        {/* Warm ridge glow */}
        <circle cx="255" cy="56" r="40" fill="#fb923c" fillOpacity="0.22" />
        {/* Serra mountain ridge */}
        <path d="M0 54 L58 34 L122 52 L195 28 L266 48 L320 38 L320 72 L0 72 Z" fill="#064e3b" fillOpacity="0.7" />
        {/* Pine tree silhouettes */}
        <g fill="#022c22" fillOpacity="0.92">
          <polygon points="36,24 22,56 50,56" />
          <polygon points="62,18 46,58 78,58" />
          <polygon points="116,26 102,58 130,58" />
          <polygon points="172,20 156,58 188,58" />
          <polygon points="214,28 200,58 228,58" />
          <polygon points="282,22 266,58 298,58" />
        </g>
        {/* Stream ribbon & floating ember sparks */}
        <path d="M0 62 Q 80 56 160 63 T 320 60 L 320 72 L 0 72 Z" fill="#10b981" fillOpacity="0.35" />
        <circle cx="242" cy="36" r="2.2" fill="#fbbf24" fillOpacity="0.85" />
        <circle cx="256" cy="24" r="1.6" fill="#fb923c" fillOpacity="0.9" />
        <circle cx="232" cy="20" r="1.5" fill="#fde047" fillOpacity="0.8" />
      </svg>
    </div>
  );
};
