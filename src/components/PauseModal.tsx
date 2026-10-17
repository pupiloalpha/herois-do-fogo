import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react';
import { sounds } from '../audio/SoundManager';

interface PauseModalProps {
  floorNumber: number;
  score: number;
  isMuted: boolean;
  onResume: () => void;
  onRestartFloor: () => void;
  onHome: () => void;
  onToggleMute: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  floorNumber,
  score,
  isMuted,
  onResume,
  onRestartFloor,
  onHome,
  onToggleMute,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in select-none">
      <div className="w-full max-w-sm rounded-3xl border border-slate-700 bg-slate-900/95 p-6 shadow-2xl text-center text-white">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-400">
          JOGO PAUSADO
        </span>
        <h2 className="text-2xl font-black text-white mt-1">
          {floorNumber}º ANDAR
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Pontuação Atual: <strong className="text-amber-400 font-mono">{score.toLocaleString('pt-BR')} PTS</strong>
        </p>

        <div className="space-y-2.5 my-6">
          <button
            onClick={() => {
              sounds.playClick();
              onResume();
            }}
            className="w-full py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>CONTINUAR MISSÃO</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onRestartFloor();
            }}
            className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 transition border border-slate-700"
          >
            <RotateCcw className="w-4 h-4" />
            <span>REINICIAR ESTE ANDAR</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onToggleMute();
            }}
            className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 transition border border-slate-700"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>{isMuted ? 'ATIVAR SONS' : 'SILENCIAR SONS'}</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onHome();
            }}
            className="w-full py-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <Home className="w-4 h-4" />
            <span>VOLTAR AO MENU INICIAL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
