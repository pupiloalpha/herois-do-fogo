import React, { useState } from 'react';
import { X, Award, Star, RotateCcw, CheckCircle2, Lock } from 'lucide-react';
import { HUB_MEDALS, MISSIONS_CATALOG } from '../hub/missionsCatalog';
import { getCareerRank, getMissionProgressSummary, getTotalHubStars } from '../hub/hubProgress';
import { HubSaveState } from '../hub/types';
import { sounds } from '../audio/SoundManager';

interface CareerModalProps {
  saveState: HubSaveState;
  onResetProgress: () => void;
  onClose: () => void;
}

export const CareerModal: React.FC<CareerModalProps> = ({
  saveState,
  onResetProgress,
  onClose,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  const { earned, max } = getTotalHubStars(saveState);
  const rank = getCareerRank(earned);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto select-none">
      <div className="w-full max-w-2xl max-h-[92dvh] rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl text-slate-100 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-2xl shrink-0">{rank.current.insignia}</span>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-white truncate">
                Carreira e Medalhas CBMMG
              </h2>
              <p className="text-xs text-slate-400 truncate">
                Patente atual: <strong className="text-amber-300">{rank.current.title}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="min-w-[44px] min-h-[44px] rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition active:scale-95 cursor-pointer shrink-0"
            aria-label="Fechar painel de carreira"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto overscroll-contain space-y-5">
          {/* Rank Progress (Hairline-separated, zero nested cards) */}
          <div className="space-y-3 pb-4 border-b border-white/10">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-mono tabular-nums font-bold text-amber-300">
                  {earned}/{max}
                </span>
                <span className="text-slate-400">estrelas no Hub</span>
              </span>
              {rank.next ? (
                <span className="text-xs text-slate-400 tabular-nums">
                  Próxima: <strong className="text-slate-200">{rank.next.title}</strong> ({rank.next.minStars} ★)
                </span>
              ) : (
                <span className="text-xs font-semibold text-emerald-400">Patente máxima atingida</span>
              )}
            </div>

            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-amber-400 transition-all duration-300"
                style={{ width: `${rank.progressPercent}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-3 pt-1">
              {MISSIONS_CATALOG.map((mission) => {
                const summary = getMissionProgressSummary(saveState, mission.id);
                return (
                  <div key={mission.id} className="text-left">
                    <div className="text-xs font-medium text-slate-300 truncate">
                      {mission.badgeEmoji} {mission.title.split(' ')[0]}
                    </div>
                    <div className="text-xs font-mono tabular-nums text-amber-300 font-semibold mt-0.5">
                      {summary.completedStages}/{summary.totalStages} · {summary.earnedStars}★
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lifetime Stats */}
          <div className="pb-4 border-b border-white/10">
            <h3 className="text-xs font-semibold text-slate-400 mb-3">
              Histórico de ocorrências
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-xs text-slate-400 block">Pessoas salvas</span>
                <span className="text-lg sm:text-xl font-bold font-mono tabular-nums text-emerald-400">
                  {saveState.stats.totalCiviliansSaved}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Animais salvos</span>
                <span className="text-lg sm:text-xl font-bold font-mono tabular-nums text-amber-300">
                  {saveState.stats.totalPetsSaved}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Focos extintos</span>
                <span className="text-lg sm:text-xl font-bold font-mono tabular-nums text-orange-400">
                  {saveState.stats.totalFiresExtinguished}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block">Fases concluídas</span>
                <span className="text-lg sm:text-xl font-bold font-mono tabular-nums text-sky-400">
                  {saveState.stats.totalStagesCleared}
                </span>
              </div>
            </div>
          </div>

          {/* Medals Grid */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-3">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="tabular-nums">
                Condecorações ({saveState.unlockedMedals.length}/{HUB_MEDALS.length})
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {HUB_MEDALS.map((medal) => {
                const unlocked = saveState.unlockedMedals.includes(medal.id);
                const scopeLabel =
                  medal.missionId === 'vertical_10'
                    ? '10 Andares'
                    : medal.missionId === 'forest_fire'
                      ? 'Florestal'
                      : medal.missionId === 'flood_rescue'
                        ? 'Enchentes'
                        : 'Cruzada';

                return (
                  <div
                    key={medal.id}
                    className={`rounded-xl p-3 border flex items-start gap-3 ${
                      unlocked
                        ? 'bg-amber-500/10 border-amber-400/35'
                        : 'bg-slate-950/35 border-white/5 opacity-60'
                    }`}
                  >
                    <span className="text-xl shrink-0 mt-0.5">{medal.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs sm:text-sm font-bold text-white truncate">
                          {medal.title}
                        </span>
                        {unlocked ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5 leading-snug">
                        {medal.description}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {scopeLabel} · {unlocked ? 'Conquistada' : 'Bloqueada'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Safe Reset Controls */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-400">
              Progresso salvo localmente neste dispositivo.
            </span>

            {!confirmReset ? (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setConfirmReset(true);
                }}
                className="min-h-[44px] px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar Progresso</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onResetProgress();
                    setConfirmReset(false);
                  }}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition cursor-pointer"
                >
                  Confirmar Reset
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setConfirmReset(false);
                  }}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 transition cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
