import React from 'react';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';
import { sounds } from '../audio/SoundManager';
import { MissionId } from '../hub/types';

interface GameOverModalProps {
  floorNumber: number;
  reason: string;
  score: number;
  missionId?: MissionId;
  onRetry: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  floorNumber,
  reason,
  score,
  missionId = 'vertical_10',
  onRetry,
  onHome,
}) => {
  const isForest = missionId === 'forest_fire';
  const isFlood = missionId === 'flood_rescue';
  const stageLabel = isFlood || isForest ? `Setor ${floorNumber}` : `${floorNumber}º Andar`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto select-none">
      <div className="w-full max-w-md max-h-[92dvh] overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-slate-900/95 p-5 sm:p-6 shadow-2xl text-center text-slate-100">
        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <AlertOctagon className="w-6 h-6" />
        </div>

        <p className="text-xs font-semibold text-rose-400">
          Alerta de Retirada · {stageLabel}
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
          {isFlood
            ? 'Operação Aquática Interrompida'
            : isForest
              ? 'Frente de Fogo não Contida'
              : 'Bombeiro Fora de Combate'}
        </h2>

        <p className="text-xs sm:text-sm text-rose-200 mt-3 bg-rose-500/10 border border-rose-500/25 p-3 rounded-xl leading-relaxed">
          {reason}
        </p>

        <div className="border-y border-white/10 py-3 my-4 flex items-center justify-between text-xs px-1">
          <span className="text-slate-400 font-medium">Pontuação atingida</span>
          <span className="text-base font-bold text-amber-300 font-mono tabular-nums">
            {score.toLocaleString('pt-BR')} pts
          </span>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onRetry();
            }}
            className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-sm active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Tentar {stageLabel} Novamente</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onHome();
            }}
            className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-medium text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Voltar ao Hub</span>
          </button>
        </div>
      </div>
    </div>
  );
};
