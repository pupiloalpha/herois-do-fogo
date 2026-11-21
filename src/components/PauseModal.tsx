import React from 'react';
import { Play, RotateCcw, Home, Volume2, VolumeX, Maximize, Minimize, ArrowUpDown, HelpCircle } from 'lucide-react';
import { sounds } from '../audio/SoundManager';

import { MissionId } from '../hub/types';

interface PauseModalProps {
  floorNumber: number;
  score: number;
  isMuted: boolean;
  missionId?: MissionId;
  onResume: () => void;
  onRestartFloor: () => void;
  onHome: () => void;
  onToggleMute: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  extraLift?: boolean;
  onToggleExtraLift?: () => void;
  onOpenInstructions?: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  floorNumber,
  score,
  isMuted,
  missionId = 'vertical_10',
  onResume,
  onRestartFloor,
  onHome,
  onToggleMute,
  isFullscreen = false,
  onToggleFullscreen,
  extraLift = false,
  onToggleExtraLift,
  onOpenInstructions,
}) => {
  const isForest = missionId === 'forest_fire';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-fade-in select-none">
      <div className="w-full max-w-sm max-h-[92dvh] overflow-y-auto overscroll-contain rounded-3xl border border-slate-700 bg-slate-900/98 p-5 sm:p-6 shadow-2xl text-center text-white">
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-orange-400">
          JOGO PAUSADO
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
          {isForest ? `SETOR ${floorNumber}` : `${floorNumber}º ANDAR`}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Pontuação: <strong className="text-amber-400 font-mono tabular-nums">{score.toLocaleString('pt-BR')} PTS</strong>
        </p>

        <div className="space-y-2.5 my-5">
          <button
            onClick={() => {
              sounds.playClick();
              onResume();
            }}
            className="w-full min-h-[48px] py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>CONTINUAR MISSÃO</span>
          </button>

          {onOpenInstructions && (
            <button
              onClick={() => {
                sounds.playClick();
                onOpenInstructions();
              }}
              className="w-full min-h-[46px] py-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition border border-amber-500/40"
            >
              <HelpCircle className="w-4 h-4 text-amber-300" />
              <span>MANUAL / COMO JOGAR</span>
            </button>
          )}

          <button
            onClick={() => {
              sounds.playClick();
              onRestartFloor();
            }}
            className="w-full min-h-[46px] py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition border border-slate-700"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isForest ? 'REINICIAR SETOR' : 'REINICIAR ANDAR'}</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onToggleMute();
            }}
            className="w-full min-h-[46px] py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition border border-slate-700"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            <span>{isMuted ? 'ATIVAR SONS' : 'SILENCIAR SONS'}</span>
          </button>

          {onToggleFullscreen && (
            <button
              onClick={() => {
                sounds.playClick();
                onToggleFullscreen();
              }}
              className="w-full min-h-[46px] py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-95 transition border border-amber-500/30"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              <span>{isFullscreen ? 'SAIR DA TELA CHEIA' : 'TELA CHEIA'}</span>
            </button>
          )}

          {onToggleExtraLift && (
            <button
              onClick={() => {
                sounds.playClick();
                onToggleExtraLift();
              }}
              className="md:hidden w-full min-h-[46px] py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 transition border border-slate-700"
            >
              <ArrowUpDown className="w-4 h-4 text-cyan-400" />
              <span>{extraLift ? 'BAIXAR CONTROLES NA TELA' : 'ELEVAR CONTROLES NA TELA'}</span>
            </button>
          )}

          <button
            onClick={() => {
              sounds.playClick();
              onHome();
            }}
            className="w-full min-h-[44px] py-2.5 rounded-2xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white font-semibold text-xs flex items-center justify-center gap-2 active:scale-95 transition"
          >
            <Home className="w-4 h-4" />
            <span>VOLTAR AO HUB</span>
          </button>
        </div>
      </div>
    </div>
  );
};
