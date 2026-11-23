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

  const nextBorderClass =
    mission.accent === 'emerald'
      ? 'bg-emerald-500/10 border-emerald-400/50 hover:border-emerald-300'
      : mission.accent === 'cyan'
        ? 'bg-sky-500/10 border-sky-400/50 hover:border-sky-300'
        : 'bg-orange-500/10 border-orange-400/50 hover:border-orange-300';

  const nextPlayBadgeClass =
    mission.accent === 'emerald'
      ? 'bg-emerald-500 text-slate-950'
      : mission.accent === 'cyan'
        ? 'bg-sky-400 text-slate-950'
        : 'bg-orange-500 text-slate-950';

  const nextStatusTextClass =
    mission.accent === 'emerald'
      ? 'text-emerald-300'
      : mission.accent === 'cyan'
        ? 'text-sky-300'
        : 'text-amber-300';

  const topAccentBarClass =
    mission.accent === 'emerald'
      ? 'from-emerald-400 via-teal-400 to-green-500'
      : mission.accent === 'cyan'
        ? 'from-sky-400 via-cyan-400 to-blue-500'
        : 'from-amber-400 via-orange-500 to-red-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto select-none">
      <div className="animate-modal-enter w-full max-w-2xl max-h-[92dvh] rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl text-slate-100 flex flex-col overflow-hidden">
        <div className={`h-1 w-full bg-gradient-to-r shrink-0 ${topAccentBarClass}`} />
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl shrink-0">{mission.badgeEmoji}</span>
            <div className="min-w-0">
              <h2 className="font-display text-base sm:text-lg font-bold text-white truncate">
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
            className="min-w-[44px] min-h-[44px] rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition active:scale-95 cursor-pointer"
            aria-label="Fechar seleção de fases"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stages Grid */}
        <div className="p-4 sm:p-5 overflow-y-auto overscroll-contain grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {stageNumbers.map((stageNum) => {
            const record = progress.stages[stageNum];
            const isUnlocked = stageNum <= progress.unlockedStage;
            const isCompleted = Boolean(record?.completed);
            const stars = record?.stars ?? 0;
            const bestScore = record?.bestScore ?? 0;
            const rawTitle =
              mission.plannedSectorsPreview[stageNum - 1] ??
              `${stageNum}º ${mission.stageTermSingular}`;
            const stageTitle = rawTitle
              .replace(/^\d+º\s+Andar\s*·\s*/i, '')
              .replace(/^Setor\s+\d+\s*·\s*/i, '');

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
                className={`text-left rounded-xl p-3.5 border transition flex flex-col justify-between min-h-[96px] ${
                  isUnlocked
                    ? isCompleted
                      ? 'bg-slate-950/50 border-white/10 hover:border-emerald-400/50 active:scale-[0.98] cursor-pointer'
                      : `${nextBorderClass} active:scale-[0.98] cursor-pointer`
                    : 'bg-slate-950/25 border-white/5 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-slate-400 block font-mono tabular-nums">
                      {mission.stageTermSingular} {stageNum}/{mission.totalStages}
                    </span>
                    <span className="text-sm font-bold text-white block truncate mt-0.5">
                      {stageTitle}
                    </span>
                  </div>

                  {!isUnlocked ? (
                    <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  ) : (
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isCompleted
                          ? 'bg-white/5 text-emerald-300 border border-white/10'
                          : nextPlayBadgeClass
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2.5 mt-2.5 border-t border-white/10">
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

                  <span className="text-xs font-mono tabular-nums text-slate-300">
                    {bestScore > 0 ? (
                      <span className="inline-flex items-center gap-1 text-amber-300 font-semibold">
                        <Trophy className="w-3 h-3" />
                        {bestScore.toLocaleString('pt-BR')}
                      </span>
                    ) : isUnlocked ? (
                      <span className={`font-sans font-semibold ${nextStatusTextClass}`}>
                        Liberado
                      </span>
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
