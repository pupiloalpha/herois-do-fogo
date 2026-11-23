import React from 'react';
import {
  Play,
  RotateCcw,
  Home,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  ArrowUpDown,
  HelpCircle,
} from 'lucide-react';
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
  const isSectorMission = missionId === 'forest_fire' || missionId === 'flood_rescue';
  const stageLabel = isSectorMission ? `Setor ${floorNumber}` : `${floorNumber}º Andar`;

  const topAccentBarClass =
    missionId === 'flood_rescue'
      ? 'from-sky-400 via-cyan-400 to-blue-500'
      : missionId === 'forest_fire'
        ? 'from-emerald-400 via-teal-400 to-green-500'
        : 'from-amber-400 via-orange-500 to-red-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto select-none">
      <div className="animate-modal-enter w-full max-w-sm max-h-[92dvh] flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl text-slate-100">
        <div className={`h-1 w-full shrink-0 bg-gradient-to-r ${topAccentBarClass}`} />
        <div className="p-5 sm:p-6 overflow-y-auto overscroll-contain">
        {/* Header */}
        <div className="text-center pb-4 border-b border-white/10">
          <p className="text-xs font-semibold text-amber-300">
            Jogo pausado · {stageLabel}
          </p>
          <h2 className="font-display text-xl font-bold text-white mt-1">
            Pausa Operacional
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono tabular-nums">
            {score.toLocaleString('pt-BR')} pts
          </p>
        </div>

        {/* Primary Actions */}
        <div className="space-y-2.5 pt-4">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onResume();
            }}
            className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Continuar Missão</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onRestartFloor();
            }}
            className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>{isSectorMission ? 'Reiniciar Setor' : 'Reiniciar Andar'}</span>
          </button>

          {onOpenInstructions && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onOpenInstructions();
              }}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-amber-300" />
              <span>Manual de Operações</span>
            </button>
          )}
        </div>

        {/* Quick Settings Grid */}
        <div className="grid grid-cols-2 gap-2 pt-3 mt-3 border-t border-white/10">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onToggleMute();
            }}
            className="min-h-[44px] py-2 px-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-white/10 text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 active:scale-[0.98] transition cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{isMuted ? 'Som: Mudo' : 'Som: Ativo'}</span>
          </button>

          {onToggleFullscreen && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onToggleFullscreen();
              }}
              className="min-h-[44px] py-2 px-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-white/10 text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 active:scale-[0.98] transition cursor-pointer"
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4 text-amber-300 shrink-0" />
              ) : (
                <Maximize className="w-4 h-4 text-amber-300 shrink-0" />
              )}
              <span>{isFullscreen ? 'Janela' : 'Tela Cheia'}</span>
            </button>
          )}

          {onToggleExtraLift && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onToggleExtraLift();
              }}
              className="col-span-2 md:hidden min-h-[44px] py-2 px-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-white/10 text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 active:scale-[0.98] transition cursor-pointer"
            >
              <ArrowUpDown className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{extraLift ? 'Baixar Controles' : 'Elevar Controles'}</span>
            </button>
          )}
        </div>

        {/* Secondary Return */}
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onHome();
          }}
          className="w-full min-h-[44px] mt-3 py-2.5 px-4 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 font-medium text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Voltar ao Hub</span>
        </button>
        </div>
      </div>
    </div>
  );
};
