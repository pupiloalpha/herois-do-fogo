import React, { useEffect } from 'react';
import { FloorData } from '../game/types';
import { ForestSectorData, WindDirection } from '../game/forest/forestTypes';
import { FloodSectorData } from '../game/flood/floodTypes';
import {
  Radio,
  Users,
  Flame,
  AlertTriangle,
  Zap,
  Play,
  Clock,
  Trees,
  Compass,
  ArrowLeft,
} from 'lucide-react';
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
  N: 'Norte',
  NE: 'Nordeste',
  E: 'Leste',
  SE: 'Sudeste',
  S: 'Sul',
  SW: 'Sudoeste',
  W: 'Oeste',
  NW: 'Noroeste',
};

function formatStageTerm(term: string): string {
  const clean = term.trim().toLowerCase();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

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
    ? floodSector.rescueSpots.filter((spot) => spot.hasPet).length
    : 0;
  const floodSinkingCount = floodSector
    ? floodSector.rescueSpots.filter((spot) => spot.kind === 'sinking_car').length
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

  const formattedTerm = formatStageTerm(stageTerm);

  const accentText = floodSector
    ? 'text-sky-300'
    : forestSector
      ? 'text-emerald-300'
      : 'text-amber-300';

  const primaryButtonClass = floodSector
    ? 'btn-arcade-cyan text-slate-950'
    : forestSector
      ? 'btn-arcade-emerald text-slate-950'
      : 'btn-arcade-orange text-slate-950';

  const topAccentBarClass = floodSector
    ? 'from-sky-400 via-cyan-400 to-blue-500'
    : forestSector
      ? 'from-emerald-400 via-teal-400 to-green-500'
      : 'from-amber-400 via-orange-500 to-red-500';

  const tacticalNote = floodSector
    ? `Use Espaço (Turbo) na correnteza, [E] para resgatar e desembarque no Abrigo (H).${
        floodSector.electricPoles.length > 0
          ? ` Atenção a ${floodSector.electricPoles.length} poste(s) energizado(s).`
          : ''
      }`
    : forestSector
      ? `Ferramentas [1] Aceiro · [2] Abafador · [3] Água · [4] Pá para brasas.${
          forestSector.streams.length > 0
            ? ` ${forestSector.streams.length} riacho(s) disponível(is) para recarga.`
            : ''
        }`
      : `Use o jato para dissipar fumaça tóxica.${
          floor.refillStations.length > 0
            ? ` ${floor.refillStations.length} hidrante(s) disponível(is) para recarga.`
            : ''
        }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-4 overflow-y-auto select-none">
      <div className="animate-modal-enter w-full max-w-lg max-h-[92dvh] flex flex-col rounded-2xl border border-white/10 bg-slate-900/95 shadow-2xl text-slate-100 overflow-hidden">
        <div className={`h-1 w-full bg-gradient-to-r shrink-0 ${topAccentBarClass}`} />
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/10 shrink-0">
          <div className="min-w-0">
            <p className={`text-xs font-semibold truncate ${accentText}`}>
              {missionTitle ? `${missionTitle} · ` : ''}
              {formattedTerm} {stageNumber}/{totalStages}
            </p>
            <h2 className="font-display text-lg sm:text-xl font-bold text-white truncate mt-0.5">
              {stageName}
            </h2>
          </div>

          {onBackToHub && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onBackToHub();
              }}
              className="min-h-[40px] px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Hub</span>
            </button>
          )}
        </div>

        {/* Body */}
        <div className="overflow-y-auto overscroll-contain flex-1 px-5 py-4 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
              <span className="truncate">{stageSubtitle}</span>
              <span className="font-mono tabular-nums font-semibold text-amber-300 flex items-center gap-1 shrink-0">
                <Clock className="w-3.5 h-3.5" />
                {timeLimitSeconds}s
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {stageDescription}
            </p>
          </div>

          {/* Concise Objectives Strip */}
          <div className="border-y border-white/10 py-3">
            <h3 className="text-xs font-semibold text-slate-400 mb-2">
              {floodSector || forestSector ? 'Objetivos do setor' : 'Objetivos do andar'}
            </h3>

            {floodSector ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm text-slate-200">
                <div className="flex items-center gap-2">
                  <span>👥</span>
                  <span className="tabular-nums"><strong>{floodTotalPeople}</strong> pessoa(s)</span>
                </div>
                {floodTotalPets > 0 && (
                  <div className="flex items-center gap-2">
                    <span>🐾</span>
                    <span className="tabular-nums"><strong>{floodTotalPets}</strong> animal(is)</span>
                  </div>
                )}
                {floodSinkingCount > 0 && (
                  <div className="flex items-center gap-2 text-rose-300">
                    <span>🚗</span>
                    <span className="tabular-nums"><strong>{floodSinkingCount}</strong> carro(s) afundando</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span>
                    {floodSector.vehiclePolicy === 'helicopter' ? '🚁' : floodSector.vehiclePolicy === 'mixed' ? '🚤' : '🚤'}
                  </span>
                  <span className="truncate">
                    {floodSector.vehiclePolicy === 'mixed'
                      ? 'Bote + Arcanjo'
                      : floodSector.vehiclePolicy === 'helicopter'
                        ? 'Helicóptero Arcanjo'
                        : 'Bote (cap. 3)'}
                  </span>
                </div>
                <div className="col-span-2 text-xs text-slate-400 pt-0.5">
                  {floodSector.currentLabel} · {floodSector.shelters.length} abrigo(s) seguro(s)
                </div>
              </div>
            ) : forestSector ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm text-slate-200">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400 shrink-0" />
                  <span className="tabular-nums"><strong>{forestSector.initialFires.length}</strong> foco(s)</span>
                </div>
                {forestSector.wildlife.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span>🦊</span>
                    <span className="tabular-nums"><strong>{forestSector.wildlife.length}</strong> fauna</span>
                  </div>
                )}
                {forestSector.hikers.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span>🥾</span>
                    <span className="tabular-nums"><strong>{forestSector.hikers.length}</strong> trilheiro(s)</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>Vento {WIND_NAMES[forestSector.windDirection]}</span>
                </div>
                <div className="col-span-2 flex items-center gap-2 text-xs text-emerald-300 pt-0.5">
                  <Trees className="w-3.5 h-3.5 shrink-0" />
                  <span className="tabular-nums">
                    Preservar ao menos <strong>{100 - forestSector.maxBurnPercent}%</strong> da mata
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm text-slate-200">
                {floor.civilians.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="tabular-nums"><strong>{floor.civilians.length}</strong> pessoa(s)</span>
                  </div>
                )}
                {floor.pets.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span>🐾</span>
                    <span className="tabular-nums"><strong>{floor.pets.length}</strong> animal(is)</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400 shrink-0" />
                  <span className="tabular-nums"><strong>{floor.fires.length}</strong> foco(s)</span>
                </div>
                {floor.gasValves.length > 0 && (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="tabular-nums"><strong>{floor.gasValves.length}</strong> válvula(s) gás</span>
                  </div>
                )}
                {floor.electricPanels.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="tabular-nums"><strong>{floor.electricPanels.length}</strong> quadro(s)</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Radio Dispatch + Single Tactical Note */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-2.5 text-amber-200/90">
              <Radio className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="italic leading-relaxed">"{stageRadio}"</p>
            </div>
            <p className="text-slate-400 leading-relaxed pl-6">
              {tacticalNote}
            </p>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-5 py-4 border-t border-white/10 bg-slate-950/40 shrink-0">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onStartFloor();
            }}
            className={`w-full min-h-[48px] py-3 px-4 rounded-xl font-display font-bold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer ${primaryButtonClass}`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Iniciar {formattedTerm} {stageNumber}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
