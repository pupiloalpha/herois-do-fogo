import React, { useEffect } from 'react';
import { FloorData } from '../game/types';
import { Radio, Users, Flame, AlertTriangle, Zap, CheckCircle2, Play } from 'lucide-react';
import { sounds } from '../audio/SoundManager';

interface FloorBriefingModalProps {
  floor: FloorData;
  onStartFloor: () => void;
}

export const FloorBriefingModal: React.FC<FloorBriefingModalProps> = ({
  floor,
  onStartFloor,
}) => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in select-none">
      <div className="w-full max-w-xl rounded-3xl border-2 border-orange-500/50 bg-slate-900/95 p-6 shadow-2xl text-white relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="px-3 py-1 rounded-xl bg-orange-600 text-slate-950 font-black text-sm tracking-wider uppercase">
              ANDAR {floor.floorNumber} / 10
            </span>
            <span className="text-xs text-orange-400 font-bold uppercase tracking-wider">
              {floor.subtitle}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>DESPACHO CBMMG</span>
          </div>
        </div>

        {/* Floor Title & Description */}
        <div className="mt-4">
          <h2 className="text-2xl font-black text-white">{floor.name}</h2>
          <p className="mt-1.5 text-sm text-slate-300 leading-relaxed">
            {floor.description}
          </p>
        </div>

        {/* Radio Dispatch Message */}
        <div className="mt-4 bg-slate-950/80 border-l-4 border-amber-400 p-3.5 rounded-r-2xl text-xs text-amber-200/90 italic font-mono flex items-start gap-3">
          <span className="text-lg">📻</span>
          <p>"{floor.radioDispatch}"</p>
        </div>

        {/* Objectives Checklist */}
        <div className="mt-5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            MISSÕES OBRIGATÓRIAS DO ANDAR:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {floor.civilians.length > 0 && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-200">
                <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Salvar <strong>{floor.civilians.length} pessoa(s)</strong></span>
              </div>
            )}

            {floor.pets.length > 0 && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-200">
                <span className="text-base shrink-0">🐾</span>
                <span>Resgatar <strong>{floor.pets.length} animal(is)</strong></span>
              </div>
            )}

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-200">
              <Flame className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Extinguir <strong>{floor.fires.length} focos de fogo</strong></span>
            </div>

            {floor.gasValves.length > 0 && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-200">
                <AlertTriangle className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Fechar <strong>{floor.gasValves.length} válvula(s) de gás</strong></span>
              </div>
            )}

            {floor.electricPanels.length > 0 && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-200">
                <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Desligar <strong>{floor.electricPanels.length} painel(éis)</strong></span>
              </div>
            )}

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Tempo Limite: <strong>{floor.timeLimitSeconds} segundos</strong></span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onStartFloor();
          }}
          className="mt-6 w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 text-slate-950 font-black text-base shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5 fill-slate-950 text-slate-950" />
          <span>ENTRAR NO ANDAR {floor.floorNumber} (ENTER / ESPAÇO)</span>
        </button>
      </div>
    </div>
  );
};
