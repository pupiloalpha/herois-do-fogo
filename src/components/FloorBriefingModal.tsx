import React, { useEffect, useState } from 'react';
import { FloorData } from '../game/types';
import { Radio, Users, Flame, AlertTriangle, Zap, CheckCircle2, Play, ChevronDown, ChevronUp, Wind, Clock } from 'lucide-react';
import { sounds } from '../audio/SoundManager';

interface FloorBriefingModalProps {
  floor: FloorData;
  onStartFloor: () => void;
}

export const FloorBriefingModal: React.FC<FloorBriefingModalProps> = ({
  floor,
  onStartFloor,
}) => {
  const [showFullLore, setShowFullLore] = useState(false);
  const [showMobileDetails, setShowMobileDetails] = useState(false);

  useEffect(() => {
    sounds.playClick();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onStartFloor();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStartFloor]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto animate-fade-in select-none">
      <div className="w-full max-w-xl max-h-[92dvh] flex flex-col rounded-3xl border border-orange-500/50 bg-slate-900/98 shadow-2xl text-white relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-5 pb-2.5 sm:pb-3 border-b border-slate-800 shrink-0 bg-slate-950/60">
          <div className="flex items-center gap-2 min-w-0">
            <span className="px-2.5 sm:px-3 py-1 rounded-xl bg-orange-600 text-slate-950 font-black text-xs sm:text-sm tracking-wider uppercase shrink-0">
              ANDAR {floor.floorNumber}/10
            </span>
            <span className="text-xs sm:text-sm text-orange-400 font-bold truncate">
              {floor.subtitle}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-bold shrink-0">
            <Radio className="w-4 h-4 text-emerald-400" />
            <span>CBMMG 193</span>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto overscroll-contain flex-1 p-4 sm:p-6 space-y-3.5 sm:space-y-4">
          {/* Floor Title + Short Summary */}
          <div>
            <h2 className="text-base sm:text-2xl font-black text-white leading-tight">{floor.name}</h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed font-medium md:hidden line-clamp-2">
              {floor.description}
            </p>
            <p className="mt-1 text-sm text-slate-300 leading-relaxed font-medium hidden md:block">
              {showFullLore ? floor.description : (
                <>
                  {floor.description.slice(0, 100)}...{' '}
                  <button
                    onClick={() => setShowFullLore(true)}
                    className="text-orange-400 font-bold underline ml-1 hover:text-orange-300"
                  >
                    Ler mais
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Compact Missions Grid (Immediate visibility on mobile & desktop) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs sm:text-sm font-black text-slate-300 uppercase tracking-wider">
                Metas do Andar
              </h3>
              <span className="text-xs text-amber-400 font-mono tabular-nums font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {floor.timeLimitSeconds}s
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
              {floor.civilians.length > 0 && (
                <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-slate-800/80 border border-emerald-500/35 text-slate-100">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
                  <span><strong>{floor.civilians.length}</strong> pessoa(s)</span>
                </div>
              )}

              {floor.pets.length > 0 && (
                <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-slate-800/80 border border-yellow-500/35 text-slate-100">
                  <span className="text-base sm:text-lg shrink-0">🐾</span>
                  <span><strong>{floor.pets.length}</strong> animal(is)</span>
                </div>
              )}

              <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-slate-800/80 border border-orange-500/35 text-slate-100">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 shrink-0" />
                <span><strong>{floor.fires.length}</strong> foco(s) fogo</span>
              </div>

              {floor.gasValves.length > 0 && (
                <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-slate-800/80 border border-purple-500/35 text-slate-100">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 shrink-0" />
                  <span><strong>{floor.gasValves.length}</strong> válvula(s) gás</span>
                </div>
              )}

              {floor.electricPanels.length > 0 && (
                <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-slate-800/80 border border-cyan-500/35 text-slate-100">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0" />
                  <span><strong>{floor.electricPanels.length}</strong> quadro(s)</span>
                </div>
              )}

              <div className="hidden md:flex items-center gap-2 p-3 rounded-xl bg-slate-800/80 border border-emerald-500/35 text-slate-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Tempo: <strong>{floor.timeLimitSeconds}s</strong></span>
              </div>
            </div>
          </div>

          {/* Mobile Details Toggle Button */}
          <button
            type="button"
            onClick={() => setShowMobileDetails(prev => !prev)}
            className="md:hidden w-full py-2 px-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center justify-between"
          >
            <span>Detalhes da ocorrência (Rádio e Hidrante)</span>
            {showMobileDetails ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Secondary Info: Always shown on Desktop (md+), collapsible on Mobile */}
          <div className={`${showMobileDetails ? 'block' : 'hidden'} md:block space-y-3`}>
            {/* Radio Dispatch Message */}
            <div className="bg-slate-950/90 border border-amber-500/30 p-3 sm:p-3.5 rounded-2xl text-xs sm:text-sm text-amber-200/95 font-mono flex items-start gap-2.5">
              <span className="text-lg shrink-0">📻</span>
              <p className="leading-snug italic font-medium">"{floor.radioDispatch}"</p>
            </div>

            {/* Smoke Hazard Callout */}
            <div className="bg-amber-950/40 border border-amber-500/30 p-2.5 sm:p-3 rounded-2xl flex items-start gap-2.5 text-xs sm:text-sm text-amber-200">
              <Wind className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 block text-xs sm:text-sm font-black">
                  Fumaça e Calor no Local
                </strong>
                <span>
                  Use o jato do extintor para dissipar nuvens espessas e abrir passagem.
                </span>
              </div>
            </div>

            {/* Refill Hydrant Notice */}
            {floor.refillStations.length > 0 && (
              <div className="bg-cyan-950/40 border border-cyan-500/30 p-2.5 sm:p-3 rounded-2xl flex items-center gap-2.5 text-xs sm:text-sm text-cyan-200">
                <span className="text-xl shrink-0">🚰</span>
                <div>
                  <strong className="text-cyan-300 block text-xs sm:text-sm font-black">
                    Hidrantes no Andar ({floor.refillStations.length})
                  </strong>
                  <span>Aproxime-se e use [AÇÃO] para recarregar 100% da água.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA Button */}
        <div className="p-3.5 sm:p-5 pt-3 border-t border-slate-800 bg-slate-950/80 shrink-0">
          <button
            onClick={() => {
              sounds.playClick();
              onStartFloor();
            }}
            className="w-full min-h-[48px] py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 text-slate-950 font-black text-base sm:text-lg shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-slate-950 text-slate-950" />
            <span>INICIAR ANDAR {floor.floorNumber}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
