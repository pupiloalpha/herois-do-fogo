import React, { useEffect, useState } from 'react';
import { FloorData } from '../game/types';
import { ForestSectorData, WindDirection } from '../game/forest/forestTypes';
import { FloodSectorData } from '../game/flood/floodTypes';
import { Radio, Users, Flame, AlertTriangle, Zap, CheckCircle2, Play, ChevronDown, ChevronUp, Wind, Clock, Trees, Compass } from 'lucide-react';
import { sounds } from '../audio/SoundManager';

interface FloorBriefingModalProps {
  floor: FloorData;
  forestSector?: ForestSectorData;
  floodSector?: FloodSectorData;
  missionTitle?: string;
  stageTerm?: string;
  totalStages?: number;
  onStartFloor: () => void;
  onBackToHub?: () => void;
}

const WIND_NAMES: Record<WindDirection, string> = {
  N: 'Norte (⬆️)',
  NE: 'Nordeste (↗️)',
  E: 'Leste (➡️)',
  SE: 'Sudeste (↘️)',
  S: 'Sul (⬇️)',
  SW: 'Sudoeste (↙️)',
  W: 'Oeste (⬅️)',
  NW: 'Noroeste (↖️)',
};

export const FloorBriefingModal: React.FC<FloorBriefingModalProps> = ({
  floor,
  forestSector,
  floodSector,
  missionTitle,
  stageTerm = 'ANDAR',
  totalStages = 10,
  onStartFloor,
  onBackToHub,
}) => {
  const [showFullLore, setShowFullLore] = useState(false);
  const [showMobileDetails, setShowMobileDetails] = useState(false);

  const stageNumber = floodSector
    ? floodSector.sectorNumber
    : forestSector
      ? forestSector.sectorNumber
      : floor.floorNumber;
  const stageName = floodSector
    ? floodSector.name
    : forestSector
      ? forestSector.name
      : floor.name;
  const stageSubtitle = floodSector
    ? floodSector.subtitle
    : forestSector
      ? forestSector.subtitle
      : floor.subtitle;
  const stageDescription = floodSector
    ? floodSector.description
    : forestSector
      ? forestSector.description
      : floor.description;
  const stageRadio = floodSector
    ? floodSector.radioDispatch
    : forestSector
      ? forestSector.radioDispatch
      : floor.radioDispatch;
  const timeLimitSeconds = floodSector
    ? floodSector.timeLimitSeconds
    : forestSector
      ? forestSector.timeLimitSeconds
      : floor.timeLimitSeconds;

  const floodTotalPeople = floodSector
    ? floodSector.rescueSpots.reduce((sum, spot) => sum + spot.victims, 0)
    : 0;
  const floodTotalPets = floodSector
    ? floodSector.rescueSpots.filter(spot => spot.hasPet).length
    : 0;
  const floodSinkingCount = floodSector
    ? floodSector.rescueSpots.filter(spot => spot.kind === 'sinking_car').length
    : 0;

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
      <div className={`w-full max-w-xl max-h-[92dvh] flex flex-col rounded-3xl border bg-slate-900/98 shadow-2xl text-white relative overflow-hidden ${floodSector ? 'border-cyan-500/50' : forestSector ? 'border-emerald-500/50' : 'border-orange-500/50'}`}>
        {/* Top Header */}
        <div className="flex items-center justify-between p-3.5 sm:p-5 pb-2.5 sm:pb-3 border-b border-slate-800 shrink-0 bg-slate-950/60">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`px-2.5 sm:px-3 py-1 rounded-xl text-slate-950 font-black text-xs sm:text-sm tracking-wider uppercase shrink-0 ${floodSector ? 'bg-cyan-400' : forestSector ? 'bg-emerald-500' : 'bg-orange-600'}`}>
              {stageTerm} {stageNumber}/{totalStages}
            </span>
            <span className={`text-xs sm:text-sm font-bold truncate ${floodSector ? 'text-cyan-400' : forestSector ? 'text-emerald-400' : 'text-orange-400'}`}>
              {missionTitle ? `${missionTitle} · ${stageSubtitle}` : stageSubtitle}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 font-bold">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span>CBMMG 193</span>
            </div>
            {onBackToHub && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onBackToHub();
                }}
                className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition"
              >
                Hub
              </button>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto overscroll-contain flex-1 p-4 sm:p-6 space-y-3.5 sm:space-y-4">
          {/* Stage Title + Short Summary */}
          <div>
            <h2 className="text-base sm:text-2xl font-black text-white leading-tight">{stageName}</h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed font-medium md:hidden line-clamp-2">
              {stageDescription}
            </p>
            <p className="mt-1 text-sm text-slate-300 leading-relaxed font-medium hidden md:block">
              {showFullLore || stageDescription.length <= 105 ? stageDescription : (
                <>
                  {stageDescription.slice(0, 100)}...{' '}
                  <button
                    onClick={() => setShowFullLore(true)}
                    className={`font-bold underline ml-1 ${floodSector ? 'text-cyan-400 hover:text-cyan-300' : forestSector ? 'text-emerald-400 hover:text-emerald-300' : 'text-orange-400 hover:text-orange-300'}`}
                  >
                    Ler mais
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Compact Missions Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs sm:text-sm font-black text-slate-300 uppercase tracking-wider">
                {floodSector || forestSector ? 'Metas do Setor' : 'Metas do Andar'}
              </h3>
              <span className="text-xs text-amber-400 font-mono tabular-nums font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {timeLimitSeconds}s
              </span>
            </div>

            {floodSector ? (
              <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-slate-800/80 border border-cyan-500/35 text-slate-100">
                  <span className="text-base sm:text-lg shrink-0">👥</span>
                  <span><strong>{floodTotalPeople}</strong> pessoa(s) ilhada(s)</span>
                </div>

                {floodTotalPets > 0 && (
                  <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-slate-800/80 border border-amber-500/35 text-slate-100">
                    <span className="text-base sm:text-lg shrink-0">🐾</span>
                    <span><strong>{floodTotalPets}</strong> animal(is)</span>
                  </div>
                )}

                {floodSinkingCount > 0 && (
                  <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-slate-800/80 border border-rose-500/45 text-slate-100">
                    <span className="text-base sm:text-lg shrink-0">🚗</span>
                    <span><strong>{floodSinkingCount}</strong> carro(s) afundando</span>
                  </div>
                )}

                <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-slate-800/80 border border-sky-500/35 text-slate-100">
                  <span className="text-base sm:text-lg shrink-0">
                    {floodSector.vehiclePolicy === 'helicopter' ? '🚁' : floodSector.vehiclePolicy === 'mixed' ? '🚤🚁' : '🚤'}
                  </span>
                  <span className="truncate">
                    {floodSector.vehiclePolicy === 'mixed'
                      ? 'Bote + Arcanjo'
                      : floodSector.vehiclePolicy === 'helicopter'
                        ? 'Helicóptero Arcanjo'
                        : 'Bote Inflável (cap. 3)'}
                  </span>
                </div>

                <div className="col-span-2 flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-slate-800/80 border border-emerald-500/35 text-slate-100">
                  <span className="text-base sm:text-lg shrink-0">🌊</span>
                  <span>{floodSector.currentLabel} · {floodSector.shelters.length} Abrigo(s) Seguro(s)</span>
                </div>
              </div>
            ) : forestSector ? (
              <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                {forestSector.wildlife.length > 0 && (
                  <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-slate-800/80 border border-amber-500/35 text-slate-100">
                    <span className="text-base sm:text-lg shrink-0">🦊</span>
                    <span><strong>{forestSector.wildlife.length}</strong> animal(is) silvestre(s)</span>
                  </div>
                )}

                {forestSector.hikers.length > 0 && (
                  <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-slate-800/80 border border-emerald-500/35 text-slate-100">
                    <span className="text-base sm:text-lg shrink-0">🥾</span>
                    <span><strong>{forestSector.hikers.length}</strong> trilheiro(s)</span>
                  </div>
                )}

                <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-slate-800/80 border border-orange-500/35 text-slate-100">
                  <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 shrink-0" />
                  <span><strong>{forestSector.initialFires.length}</strong> foco(s) + brasas</span>
                </div>

                <div className="flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-slate-800/80 border border-sky-500/35 text-slate-100">
                  <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-sky-400 shrink-0" />
                  <span className="truncate">Vento <strong>{WIND_NAMES[forestSector.windDirection]}</strong></span>
                </div>

                <div className="col-span-2 flex items-center gap-2 p-2.5 sm:p-3 rounded-xl bg-slate-800/80 border border-emerald-500/35 text-slate-100">
                  <Trees className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
                  <span>
                    Preservar no mínimo <strong>{100 - forestSector.maxBurnPercent}%</strong> da mata do setor
                  </span>
                </div>
              </div>
            ) : (
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
            )}
          </div>

          {/* Mobile Details Toggle Button */}
          <button
            type="button"
            onClick={() => setShowMobileDetails(prev => !prev)}
            className="md:hidden w-full py-2 px-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center justify-between"
          >
            <span>
              {floodSector
                ? 'Detalhes táticos (Rádio, Turbo e Abrigo)'
                : forestSector
                  ? 'Detalhes táticos (Rádio, Ferramentas e Riachos)'
                  : 'Detalhes da ocorrência (Rádio e Hidrante)'}
            </span>
            {showMobileDetails ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Secondary Info: Always shown on Desktop (md+), collapsible on Mobile */}
          <div className={`${showMobileDetails ? 'block' : 'hidden'} md:block space-y-3`}>
            {/* Radio Dispatch Message */}
            <div className="bg-slate-950/90 border border-amber-500/30 p-3 sm:p-3.5 rounded-2xl text-xs sm:text-sm text-amber-200/95 font-mono flex items-start gap-2.5">
              <span className="text-lg shrink-0">📻</span>
              <p className="leading-snug italic font-medium">"{stageRadio}"</p>
            </div>

            {floodSector ? (
              <>
                <div className="bg-cyan-950/40 border border-cyan-500/35 p-2.5 sm:p-3 rounded-2xl text-xs sm:text-sm text-cyan-100 space-y-1">
                  <strong className="text-cyan-300 block font-black">
                    Manual de Navegação e Guincho CBMMG
                  </strong>
                  <p className="text-[11px] sm:text-xs text-slate-200 leading-relaxed">
                    Use <strong>[ESPAÇO] / Turbo</strong> para vencer a correnteza, aperte <strong>[E] / [AÇÃO]</strong> perto dos ilhados para embarcar ou içar, e aproxime-se do <strong>Abrigo Seguro (H)</strong> para desembarcar, reparar e reabastecer!
                  </p>
                </div>

                {floodSector.electricPoles.length > 0 && (
                  <div className="bg-amber-950/40 border border-amber-500/35 p-2.5 sm:p-3 rounded-2xl flex items-center gap-2.5 text-xs sm:text-sm text-amber-200">
                    <span className="text-xl shrink-0">⚡</span>
                    <div>
                      <strong className="text-amber-300 block text-xs sm:text-sm font-black">
                        Postes Energizados na Água ({floodSector.electricPoles.length})
                      </strong>
                      <span>Mantenha distância dos halos amarelos para não sofrer descargas elétricas.</span>
                    </div>
                  </div>
                )}
              </>
            ) : forestSector ? (
              <>
                <div className="bg-emerald-950/35 border border-emerald-500/30 p-2.5 sm:p-3 rounded-2xl text-xs sm:text-sm text-emerald-100 space-y-1.5">
                  <strong className="text-emerald-300 block font-black">
                    Equipamento Florestal (Teclas 1 a 4 ou Barra Tátil)
                  </strong>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px] sm:text-xs text-slate-200">
                    <span>⛏️ <strong>1 Aceiro:</strong> corta a passagem do fogo</span>
                    <span>🧹 <strong>2 Abafador:</strong> apaga sem gastar água</span>
                    <span>💧 <strong>3 Bomba Água:</strong> jato de alto alcance</span>
                    <span>🪣 <strong>4 Pá:</strong> enterra troncos em brasa</span>
                  </div>
                </div>

                {forestSector.streams.length > 0 && (
                  <div className="bg-cyan-950/40 border border-cyan-500/30 p-2.5 sm:p-3 rounded-2xl flex items-center gap-2.5 text-xs sm:text-sm text-cyan-200">
                    <span className="text-xl shrink-0">🚰</span>
                    <div>
                      <strong className="text-cyan-300 block text-xs sm:text-sm font-black">
                        Riachos no Setor ({forestSector.streams.length})
                      </strong>
                      <span>Aproxime-se da água e pressione [AÇÃO] para reabastecer 100%.</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
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
              </>
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
            className={`w-full min-h-[48px] py-3.5 sm:py-4 rounded-2xl text-slate-950 font-black text-base sm:text-lg shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 ${
              floodSector
                ? 'bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-400'
                : forestSector
                  ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500'
                  : 'bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600'
            }`}
          >
            <Play className="w-5 h-5 fill-slate-950 text-slate-950" />
            <span>INICIAR {stageTerm} {stageNumber}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
