import React from 'react';
import { AlertOctagon, RotateCcw, Home } from 'lucide-react';
import { sounds } from '../audio/SoundManager';

interface GameOverModalProps {
  floorNumber: number;
  reason: string;
  score: number;
  onRetry: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  floorNumber,
  reason,
  score,
  onRetry,
  onHome,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-fade-in select-none">
      <div className="w-full max-w-md max-h-[92dvh] overflow-y-auto overscroll-contain rounded-3xl border-2 border-red-500/60 bg-slate-900/98 p-5 sm:p-6 shadow-2xl text-center text-white relative">
        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-2.5 rounded-2xl bg-red-500/20 border border-red-400/50 flex items-center justify-center text-red-500">
          <AlertOctagon className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce" />
        </div>

        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-red-400">
          ALERTA DE RETIRADA
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
          BOMBEIRO FORA DE COMBATE!
        </h2>
        <p className="text-xs sm:text-sm text-red-200 mt-2 bg-red-950/60 border border-red-800/60 p-3 rounded-xl font-medium">
          {reason}
        </p>

        <div className="bg-slate-950/80 rounded-2xl p-3 border border-slate-800 my-4 text-center">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
            PONTUAÇÃO ATINGIDA
          </span>
          <span className="text-lg sm:text-xl font-black text-amber-400 font-mono">
            {score.toLocaleString('pt-BR')} PTS
          </span>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={() => {
              sounds.playClick();
              onRetry();
            }}
            className="w-full py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 text-white font-black text-xs sm:text-sm shadow-xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>TENTAR O {floorNumber}º ANDAR NOVAMENTE</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onHome();
            }}
            className="w-full py-2.5 sm:py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs transition flex items-center justify-center gap-2 border border-slate-700"
          >
            <Home className="w-4 h-4" />
            <span>VOLTAR AO MENU INICIAL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
