import React from 'react';
import { X, CheckCircle2, Shield, Map } from 'lucide-react';
import { MissionCatalogEntry } from '../hub/types';
import { sounds } from '../audio/SoundManager';

interface MissionPreviewModalProps {
  mission: MissionCatalogEntry;
  onClose: () => void;
}

export const MissionPreviewModal: React.FC<MissionPreviewModalProps> = ({
  mission,
  onClose,
}) => {
  const accentText =
    mission.accent === 'cyan'
      ? 'text-cyan-400'
      : mission.accent === 'emerald'
        ? 'text-emerald-400'
        : 'text-orange-400';

  const accentBorder =
    mission.accent === 'cyan'
      ? 'border-cyan-500/40'
      : mission.accent === 'emerald'
        ? 'border-emerald-500/40'
        : 'border-orange-500/40';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-fade-in select-none">
      <div className={`w-full max-w-xl max-h-[92dvh] rounded-3xl border ${accentBorder} bg-slate-900/98 shadow-2xl text-white flex flex-col overflow-hidden`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl shrink-0">{mission.badgeEmoji}</span>
            <div className="min-w-0">
              <span className={`text-[11px] font-bold uppercase tracking-wider block ${accentText}`}>
                {mission.subtitle} · Em Preparação
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white truncate">
                {mission.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="min-w-[44px] min-h-[44px] rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition active:scale-95"
            aria-label="Fechar prévia da missão"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain space-y-4">
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {mission.shortDescription}
          </p>

          {/* Mechanics */}
          <div className="rounded-2xl bg-slate-950/75 border border-slate-800 p-4 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Mecânicas da Operação
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-200">
              {mission.mechanicsHighlight.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${accentText}`} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Character Perks */}
          <div className="rounded-2xl bg-slate-950/75 border border-slate-800 p-4 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Especialidades da Equipe</span>
            </h3>
            <div className="space-y-1.5 text-xs text-slate-300">
              <p>
                <strong className="text-amber-300">Foguinho:</strong> {mission.characterPerks.foguinho}
              </p>
              <p>
                <strong className="text-orange-400">Faísca:</strong> {mission.characterPerks.faisca}
              </p>
            </div>
          </div>

          {/* Planned Sectors */}
          <div className="rounded-2xl bg-slate-950/75 border border-slate-800 p-4 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Map className="w-3.5 h-3.5 text-slate-400" />
              <span>{mission.totalStages} {mission.stageTermPlural} Planejados</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300">
              {mission.plannedSectorsPreview.map((sector, idx) => (
                <div key={idx} className="py-1 px-2 rounded-lg bg-slate-900/70 border border-slate-800/80 truncate">
                  {sector}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-950/70 shrink-0">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-full min-h-[44px] py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition active:scale-95"
          >
            Fechar Prévia
          </button>
        </div>
      </div>
    </div>
  );
};
