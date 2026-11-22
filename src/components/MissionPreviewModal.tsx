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
      ? 'text-sky-300'
      : mission.accent === 'emerald'
        ? 'text-emerald-300'
        : 'text-amber-300';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto select-none">
      <div className="w-full max-w-xl max-h-[92dvh] rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl text-slate-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl shrink-0">{mission.badgeEmoji}</span>
            <div className="min-w-0">
              <span className={`text-xs font-semibold block ${accentText}`}>
                {mission.subtitle}
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
            className="min-w-[44px] min-h-[44px] rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition active:scale-95 cursor-pointer shrink-0"
            aria-label="Fechar prévia da missão"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto overscroll-contain space-y-4">
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {mission.shortDescription}
          </p>

          <div className="py-3 border-y border-white/10 space-y-2">
            <h3 className="text-xs font-semibold text-slate-400">
              Mecânicas da operação
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

          <div className="pb-3 border-b border-white/10 space-y-1.5">
            <h3 className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Especialidades da equipe</span>
            </h3>
            <p className="text-xs text-slate-300">
              <strong className="text-amber-300">Foguinho:</strong> {mission.characterPerks.foguinho}
            </p>
            <p className="text-xs text-slate-300">
              <strong className="text-orange-300">Faísca:</strong> {mission.characterPerks.faisca}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Map className="w-3.5 h-3.5 text-slate-400" />
              <span>{mission.totalStages} {mission.stageTermPlural.toLowerCase()}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300">
              {mission.plannedSectorsPreview.map((sector, idx) => (
                <div key={idx} className="py-1 text-slate-300 truncate">
                  {sector}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10 bg-slate-950/40 shrink-0">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-sm transition cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
