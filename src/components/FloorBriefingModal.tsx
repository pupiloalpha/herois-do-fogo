import React, { useEffect, useState } from 'react';
import { FloorData } from '../game/types';
import { Radio, Users, Flame, AlertTriangle, Zap, CheckCircle2, Play, ChevronDown, ChevronUp, Wind } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto animate-fade-in select-none">
      <div className="w-full max-w-xl max-h-[94dvh] flex flex-col rounded-3xl border-2 border-orange-500/60 bg-slate-900/98 shadow-2xl text-white relative overflow-hidden">
        {/* Top Header - Fixed & High Contrast */}
        <div className="flex items-center justify-between p-3.5 sm:p-5 pb-2.5 sm:pb-3 border-b border-slate-800 shrink-0 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-orange-600 text-slate-950 font-black text-xs sm:text-sm tracking-wider uppercase shadow-md">
              ANDAR {floor.floorNumber} / 10
            </span>
            <span className="text-xs sm:text-sm text-orange-400 font-bold uppercase tracking-wider truncate max-w-[180px] sm:max-w-none">
              {floor.subtitle}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="hidden xs:inline">CBMMG 193</span>
          </div>
        </div>

        {/* Scrollable Body with smooth touch scroll and large readable typography */}
        <div className="overflow-y-auto overscroll-contain flex-1 p-3.5 sm:p-6 space-y-3 sm:space-y-4 pr-2.5 scrollbar-thin scrollbar-thumb-orange-500/40">
          {/* Floor Title */}
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-white leading-tight">{floor.name}</h2>
            {/* Quick summary line */}
            <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
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

          {/* Radio Dispatch Message */}
          <div className="bg-slate-950/90 border-l-4 border-amber-400 p-3 sm:p-3.5 rounded-r-2xl text-xs sm:text-sm text-amber-200/95 font-mono flex items-start gap-2.5 shadow-inner">
            <span className="text-lg sm:text-xl shrink-0">📻</span>
            <p className="leading-snug italic font-medium">"{floor.radioDispatch}"</p>
          </div>

          {/* Smoke Hazard Callout (Improvement 4) */}
          <div className="bg-amber-950/50 border border-amber-500/40 p-2.5 sm:p-3 rounded-2xl flex items-start gap-2.5 text-xs sm:text-sm text-amber-200">
            <Wind className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-300 block text-xs sm:text-sm font-black">
                💨 Perigo de Fumaça &amp; Calor no Local:
              </strong>
              <span>
                Fumaça espessa causa tosse e reduz sua velocidade. <strong>Use o jato do extintor</strong> para dissipar as nuvens e abrir passagem!
              </span>
            </div>
          </div>

          {/* Refill Hydrant Notice (Improvement 2) */}
          {floor.refillStations.length > 0 && (
            <div className="bg-cyan-950/50 border border-cyan-500/40 p-2.5 sm:p-3 rounded-2xl flex items-center gap-2.5 text-xs sm:text-sm text-cyan-200">
              <span className="text-xl shrink-0">🚰</span>
              <div>
                <strong className="text-cyan-300 block text-xs sm:text-sm font-black">
                  Hidrante Disponível ({floor.refillStations.length} ponto{floor.refillStations.length > 1 ? 's' : ''}):
                </strong>
                <span>Se a água acabar, vá até o hidrante vermelho e aperte [AÇÃO] para 100% de recarga!</span>
              </div>
            </div>
          )}

          {/* Objectives Grid with Large, Readable Cards (Improvement 1) */}
          <div>
            <h3 className="text-xs sm:text-sm font-black text-slate-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>📋 MISSÕES DO ANDAR:</span>
              <span className="text-[11px] text-amber-400 font-bold">Tempo: {floor.timeLimitSeconds}s</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
              {floor.civilians.length > 0 && (
                <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-slate-800/80 border border-emerald-500/40 text-slate-100 shadow-sm">
                  <Users className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Salvar <strong>{floor.civilians.length} pessoa(s)</strong></span>
                </div>
              )}

              {floor.pets.length > 0 && (
                <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-slate-800/80 border border-yellow-500/40 text-slate-100 shadow-sm">
                  <span className="text-lg shrink-0">🐾</span>
                  <span>Resgatar <strong>{floor.pets.length} animal(is)</strong></span>
                </div>
              )}

              <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-slate-800/80 border border-orange-500/40 text-slate-100 shadow-sm">
                <Flame className="w-5 h-5 text-orange-400 shrink-0" />
                <span>Extinguir <strong>{floor.fires.length} foco(s) de fogo</strong></span>
              </div>

              {floor.gasValves.length > 0 && (
                <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-slate-800/80 border border-purple-500/40 text-slate-100 shadow-sm">
                  <AlertTriangle className="w-5 h-5 text-purple-400 shrink-0" />
                  <span>Fechar <strong>{floor.gasValves.length} válvula(s) de gás</strong></span>
                </div>
              )}

              {floor.electricPanels.length > 0 && (
                <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-slate-800/80 border border-cyan-500/40 text-slate-100 shadow-sm">
                  <Zap className="w-5 h-5 text-cyan-400 shrink-0" />
                  <span>Desligar <strong>{floor.electricPanels.length} quadro(s)</strong></span>
                </div>
              )}

              <div className="flex items-center gap-2.5 p-2.5 sm:p-3 rounded-xl bg-slate-800/80 border border-emerald-500/40 text-slate-100 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Tempo Limite: <strong>{floor.timeLimitSeconds}s</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Button - Large, Touch Friendly */}
        <div className="p-3.5 sm:p-5 pt-3 border-t border-slate-800 bg-slate-950/80 shrink-0">
          <button
            onClick={() => {
              sounds.playClick();
              onStartFloor();
            }}
            className="w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 text-slate-950 font-black text-base sm:text-lg shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-slate-950 text-slate-950" />
            <span>INICIAR ANDAR {floor.floorNumber} (ENTER / TOQUE)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
