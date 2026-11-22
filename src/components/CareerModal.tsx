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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-fade-in select-none">
      <div className="w-full max-w-2xl max-h-[92dvh] rounded-3xl border border-slate-700/80 bg-slate-900/98 shadow-2xl text-white flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{rank.current.insignia}</span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Carreira e Medalhas CBMMG
              </h2>
              <p className="text-xs text-slate-400">
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
            className="min-w-[44px] min-h-[44px] rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition active:scale-95"
            aria-label="Fechar painel de carreira"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain space-y-5">
          {/* Rank Progress */}
          <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4">
            <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-mono tabular-nums font-bold text-amber-300">
                  {earned}/{max}
                </span>
                <span className="text-slate-400">estrelas no Hub</span>
              </span>
              {rank.next ? (
                <span className="text-xs text-slate-400">
                  Próxima patente: <strong className="text-slate-200">{rank.next.title}</strong> ({rank.next.minStars} ★)
                </span>
              ) : (
                <span className="text-xs font-semibold text-emerald-400">Patente Máxima Atingida</span>
              )}
            </div>

            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
                style={{ width: `${rank.progressPercent}%` }}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80">
              {MISSIONS_CATALOG.map((mission) => {
                const summary = getMissionProgressSummary(saveState, mission.id);
                return (
                  <div
                    key={mission.id}
                    className="rounded-xl bg-slate-900/80 border border-slate-800 px-2.5 py-2 text-center"
                  >
                    <div className="text-[11px] font-bold text-slate-200 truncate">
                      {mission.badgeEmoji} {mission.title.split(' ')[0]}
                    </div>
                    <div className="text-[10px] font-mono text-amber-300 mt-0.5">
                      {summary.completedStages}/{summary.totalStages} · {summary.earnedStars}★
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lifetime Stats */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Histórico de Ocorrências
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-3">
                <span className="text-[11px] text-slate-400 block">Pessoas Salvas</span>
                <span className="text-lg sm:text-xl font-bold font-mono tabular-nums text-emerald-400">
                  {saveState.stats.totalCiviliansSaved}
                </span>
              </div>
              <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-3">
                <span className="text-[11px] text-slate-400 block">Animais Salvos</span>
                <span className="text-lg sm:text-xl font-bold font-mono tabular-nums text-amber-300">
                  {saveState.stats.totalPetsSaved}
                </span>
              </div>
              <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-3">
                <span className="text-[11px] text-slate-400 block">Focos Extintos</span>
                <span className="text-lg sm:text-xl font-bold font-mono tabular-nums text-orange-400">
                  {saveState.stats.totalFiresExtinguished}
                </span>
              </div>
              <div className="rounded-2xl bg-slate-950/70 border border-slate-800 p-3">
                <span className="text-[11px] text-slate-400 block">Fases Concluídas</span>
                <span className="text-lg sm:text-xl font-bold font-mono tabular-nums text-cyan-400">
                  {saveState.stats.totalStagesCleared}
                </span>
              </div>
            </div>
          </div>

          {/* Medals Grid */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Condecorações ({saveState.unlockedMedals.length}/{HUB_MEDALS.length})</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {HUB_MEDALS.map((medal) => {
                const unlocked = saveState.unlockedMedals.includes(medal.id);
                const scopeTag =
                  medal.missionId === 'vertical_10'
                    ? '🏢 10 Andares'
                    : medal.missionId === 'forest_fire'
                      ? '🌲 Florestal'
                      : medal.missionId === 'flood_rescue'
                        ? '🚤 Enchentes'
                        : '🏅 Cruzada';
                return (
                  <div
                    key={medal.id}
                    className={`rounded-2xl p-3 border flex items-start gap-3 ${
                      unlocked
                        ? 'bg-slate-950/80 border-amber-500/40'
                        : 'bg-slate-950/40 border-slate-800/80 opacity-60'
                    }`}
                  >
                    <span className="text-2xl shrink-0">{medal.icon}</span>
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
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                        {medal.description}
                      </p>
                      <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                        {scopeTag}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Safe Reset Controls */}
          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
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
                className="min-h-[40px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition"
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
                  className="min-h-[40px] px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white transition"
                >
                  Confirmar Reset
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setConfirmReset(false);
                  }}
                  className="min-h-[40px] px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
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
