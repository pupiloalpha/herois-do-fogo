import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Star, ArrowRight, ShieldCheck } from 'lucide-react';
import { sounds } from '../audio/SoundManager';

interface FloorClearModalProps {
  floorNumber: number;
  score: number;
  stars: number;
  onNextFloor: () => void;
}

export const FloorClearModal: React.FC<FloorClearModalProps> = ({
  floorNumber,
  score,
  stars,
  onNextFloor,
}) => {
  useEffect(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onNextFloor();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNextFloor]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-fade-in select-none">
      <div className="w-full max-w-md max-h-[92dvh] overflow-y-auto overscroll-contain rounded-3xl border-2 border-emerald-500/60 bg-slate-900/98 p-5 sm:p-6 shadow-2xl text-center text-white relative">
        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400">
          <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse" />
        </div>

        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-emerald-400">
          MISSÃO CUMPRIDA!
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
          {floorNumber}º ANDAR LIBERADO!
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
          Todos os focos foram extintos, vítimas salvas e riscos neutralizados com sucesso!
        </p>

        {/* Stars */}
        <div className="flex justify-center items-center gap-2 my-4 sm:my-5">
          {[1, 2, 3].map((s) => (
            <Star
              key={s}
              className={`w-8 h-8 sm:w-9 sm:h-9 transition-all duration-300 ${
                s <= stars
                  ? 'fill-amber-400 text-amber-400 scale-110 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                  : 'text-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Score display */}
        <div className="bg-slate-950/80 rounded-2xl p-3 sm:p-4 border border-slate-800 flex items-center justify-around mb-5">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
              PONTUAÇÃO ATUAL
            </span>
            <div className="flex items-center justify-center gap-1.5 text-xl sm:text-2xl font-black text-amber-400 font-mono">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>{score.toLocaleString('pt-BR')}</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => {
            sounds.playClick();
            onNextFloor();
          }}
          className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 text-slate-950 font-black text-sm sm:text-base shadow-xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <span>SUBIR PARA O {floorNumber + 1}º ANDAR</span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};
