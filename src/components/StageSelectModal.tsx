import React from 'react';
import { X, Lock, Star, Play, Trophy } from 'lucide-react';
import { MissionCatalogEntry, MissionProgress } from '../hub/types';
import { sounds } from '../audio/SoundManager';

interface StageSelectModalProps {
  mission: MissionCatalogEntry;
  progress: MissionProgress;
  onSelectStage: (stageNumber: number) => void;
  onClose: () => void;
}

export const StageSelectModal: React.FC<StageSelectModalProps> = ({
  mission,
  progress,
  onSelectStage,
  onClose,
}) => {
  const stageNumbers = Array.from({ length: mission.totalStages }, (_, idx) => idx + 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-fade-in select-none">
      <div className="w-full max-w-2xl max-h-[92dvh] rounded-3xl border border-slate-700/80 bg-slate-900/98 shadow-2xl text-white flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl shrink-0">{mission.badgeEmoji}</span>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-white truncate">
                {mission.title}
              </h2>
              <p className="text-xs text-slate-400">
                Selecione um {mission.stageTermSingular.toLowerCase()} liberado para iniciar
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="min-w-[44px] min-h-[44px] rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition active:scale-95"
            aria-label="Fechar seleção de fases"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stages Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto overscroll-contain grid grid-cols-2 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {stageNumbers.map((stageNum) => {
            const record = progress.stages[stageNum];
            const isUnlocked = stageNum <= progress.unlockedStage;
            const isCompleted = Boolean(record?.completed);
            const stars = record?.stars ?? 0;
            const bestScore = record?.bestScore ?? 0;
            const stageTitle =
              mission.plannedSectorsPreview[stageNum - 1] ??
              `${stageNum}º ${mission.stageTermSingular}`;

            return (
              <button
                key={stageNum}
                type="button"
                disabled={!isUnlocked}
                onClick={() => {
                  if (!isUnlocked) return;
                  sounds.playClick();
                  onSelectStage(stageNum);
                }}
                className={`text-left rounded-2xl p-3.5 border transition-all flex flex-col justify-between min-h-[104px] ${
                  isUnlocked
                    ? isCompleted
                      ? 'bg-slate-950/80 border-emerald-500/40 hover:border-emerald-400 active:scale-[0.98]'
                      : 'bg-slate-950/90 border-orange-500/60 hover:border-orange-400 ring-1 ring-orange-500/20 active:scale-[0.98]'
                    : 'bg-slate-950/40 border-slate-800/70 opacity-55 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[11px] font-semibold text-slate-400 block">
                      {mission.stageTermSingular} {stageNum}/{mission.totalStages}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-white block truncate mt-0.5">
                      {stageTitle.replace(/^\d+º\s+Andar\s+·\s+/, '')}
                    </span>
                  </div>

                  {!isUnlocked ? (
                    <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  ) : (
                    <span className="w-8 h-8 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center shrink-0">
                      <Play className="w-3.5 h-3.5 fill-orange-400" />
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-800/80">
                  {/* Stars */}
                  <div className="flex items-center gap-1" aria-label={`${stars} de 3 estrelas`}>
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= stars ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Score or Status */}
                  <span className="text-[11px] font-mono tabular-nums text-slate-300">
                    {bestScore > 0 ? (
                      <span className="inline-flex items-center gap-1 text-amber-300 font-semibold">
                        <Trophy className="w-3 h-3" />
                        {bestScore.toLocaleString('pt-BR')}
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-orange-300 font-sans font-semibold">Liberado</span>
                    ) : (
                      <span className="text-slate-500 font-sans">Bloqueado</span>
                    )}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
