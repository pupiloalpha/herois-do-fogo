import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, ArrowRight, ShieldCheck, Flame, Home, Award } from 'lucide-react';
import { sounds } from '../audio/SoundManager';
import { MedalDefinition, MissionId } from '../hub/types';

interface FloorClearModalProps {
  floorNumber: number;
  score: number;
  stars: number;
  missionId?: MissionId;
  fireSpreadIncreased?: boolean;
  fireSpreadSpeed?: number;
  newlyUnlockedMedals?: MedalDefinition[];
  onNextFloor: () => void;
  onReturnHub?: () => void;
}

export const FloorClearModal: React.FC<FloorClearModalProps> = ({
  floorNumber,
  score,
  stars,
  missionId = 'vertical_10',
  fireSpreadIncreased = false,
  fireSpreadSpeed = 1.0,
  newlyUnlockedMedals = [],
  onNextFloor,
  onReturnHub,
}) => {
  const isForest = missionId === 'forest_fire';
  const isFlood = missionId === 'flood_rescue';

  useEffect(() => {
    confetti({
      particleCount: 70,
      spread: 65,
      origin: { y: 0.6 },
    });

    const medalTimer =
      newlyUnlockedMedals.length > 0
        ? window.setTimeout(() => {
            sounds.playMedalUnlock();
          }, 480)
        : undefined;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onNextFloor();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (medalTimer !== undefined) window.clearTimeout(medalTimer);
    };
  }, [onNextFloor, newlyUnlockedMedals.length]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto select-none">
      <div className="w-full max-w-md max-h-[92dvh] overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-slate-900/95 p-5 sm:p-6 shadow-2xl text-center text-slate-100">
        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <p className="text-xs font-semibold text-emerald-400">
          Missão Cumprida
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
          {isFlood
            ? `Setor ${floorNumber} Evacuado`
            : isForest
              ? `Setor ${floorNumber} Controlado`
              : `${floorNumber}º Andar Liberado`}
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-xs mx-auto leading-relaxed">
          {isFlood
            ? 'Famílias e animais levados em segurança até o abrigo.'
            : isForest
              ? 'Focos e brasas contidos e fauna silvestre protegida.'
              : 'Focos extintos, vítimas salvas e riscos neutralizados.'}
        </p>

        {/* Stars */}
        <div className="flex justify-center items-center gap-2 my-4" aria-label={`${stars} de 3 estrelas`}>
          {[1, 2, 3].map((s) => (
            <Star
              key={s}
              className={`w-8 h-8 transition-transform duration-200 ${
                s <= stars
                  ? 'fill-amber-400 text-amber-400 scale-105'
                  : 'text-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Hairline Score Summary */}
        <div className="border-y border-white/10 py-3 mb-4 flex items-center justify-between text-sm px-1">
          <span className="text-slate-400 text-xs font-medium">Pontuação acumulada</span>
          <span className="font-mono tabular-nums font-bold text-lg text-amber-300 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            {score.toLocaleString('pt-BR')}
          </span>
        </div>

        {fireSpreadIncreased && (
          <div className="mb-4 rounded-xl bg-orange-500/10 border border-orange-500/25 px-3 py-2 text-xs text-orange-200 flex items-center justify-center gap-2 text-left">
            <Flame className="w-4 h-4 text-orange-400 shrink-0" />
            <span>
              <strong>{isFlood ? 'Cabeça d\'Água:' : 'Desafio Extra:'}</strong>{' '}
              {isFlood
                ? `Correnteza ${Math.round(fireSpreadSpeed * 100)}% no próximo setor.`
                : isForest
                  ? `Propagação ${Math.round(fireSpreadSpeed * 100)}% no próximo setor.`
                  : `Chamas ${Math.round(fireSpreadSpeed * 100)}% no próximo andar.`}
            </span>
          </div>
        )}

        {newlyUnlockedMedals.length > 0 && (
          <div className="mb-4 rounded-xl bg-amber-500/10 border border-amber-500/25 px-3.5 py-2.5 text-left space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
              <Award className="w-3.5 h-3.5 shrink-0" />
              <span>Medalha conquistada</span>
            </div>
            {newlyUnlockedMedals.map((medal) => (
              <div key={medal.id} className="flex items-center gap-2 text-xs text-slate-200">
                <span className="text-base shrink-0">{medal.icon}</span>
                <span className="font-semibold text-white">{medal.title}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onNextFloor();
            }}
            className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm sm:text-base active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isFlood || isForest ? `Avançar para o ${floorNumber + 1}º Setor` : `Subir para o ${floorNumber + 1}º Andar`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {onReturnHub && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onReturnHub();
              }}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-medium text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Voltar ao Hub</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
