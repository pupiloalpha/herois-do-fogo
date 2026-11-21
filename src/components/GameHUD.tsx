import React, { useState } from 'react';
import { GameHUDState, HUDObjectiveItem } from '../game/types';
import {
  Heart,
  Flame,
  Clock,
  Trophy,
  Volume2,
  VolumeX,
  Pause,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Maximize,
  Minimize,
  CheckCircle2,
  Droplets,
  ListChecks,
  Trees,
  Wind,
} from 'lucide-react';
import { sounds } from '../audio/SoundManager';

export interface HUDToolOption {
  id: string;
  icon: string;
  label: string;
  keyHint?: string;
}

interface GameHUDProps {
  hud: GameHUDState;
  isMuted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  fireSpreadSpeed?: number;
  stageTerm?: string;
  totalStages?: number;
  tools?: HUDToolOption[];
  onSelectTool?: (toolId: string) => void;
}

interface EmberSpec {
  id: number;
  positionClass: string;
  sizeClass: string;
  timingClass: string;
  minTier: number;
}

const EMBER_PARTICLES: EmberSpec[] = [
  { id: 1, positionClass: 'left-[3%] bottom-[8%]', sizeClass: 'w-1.5 h-1.5 bg-orange-400', timingClass: '[animation-duration:3.4s] [animation-delay:0s]', minTier: 1 },
  { id: 2, positionClass: 'left-[8%] bottom-[22%]', sizeClass: 'w-1 h-1 bg-amber-300', timingClass: '[animation-duration:4.1s] [animation-delay:0.8s]', minTier: 1 },
  { id: 3, positionClass: 'left-[5%] bottom-[48%]', sizeClass: 'w-1.5 h-1.5 bg-red-400', timingClass: '[animation-duration:3.8s] [animation-delay:1.5s]', minTier: 1 },
  { id: 4, positionClass: 'right-[4%] bottom-[12%]', sizeClass: 'w-1.5 h-1.5 bg-amber-400', timingClass: '[animation-duration:3.6s] [animation-delay:0.4s]', minTier: 1 },
  { id: 5, positionClass: 'right-[7%] bottom-[34%]', sizeClass: 'w-1 h-1 bg-orange-300', timingClass: '[animation-duration:4.3s] [animation-delay:1.9s]', minTier: 1 },
  { id: 6, positionClass: 'right-[3%] bottom-[58%]', sizeClass: 'w-1.5 h-1.5 bg-red-400', timingClass: '[animation-duration:3.5s] [animation-delay:1.1s]', minTier: 1 },
  { id: 7, positionClass: 'left-[18%] bottom-[4%]', sizeClass: 'w-1 h-1 bg-amber-300', timingClass: '[animation-duration:4.0s] [animation-delay:2.2s]', minTier: 1 },
  { id: 8, positionClass: 'right-[20%] bottom-[5%]', sizeClass: 'w-1.5 h-1.5 bg-orange-400', timingClass: '[animation-duration:3.9s] [animation-delay:0.6s]', minTier: 1 },
  { id: 9, positionClass: 'left-[12%] bottom-[68%]', sizeClass: 'w-1 h-1 bg-amber-200', timingClass: '[animation-duration:3.2s] [animation-delay:1.3s]', minTier: 2 },
  { id: 10, positionClass: 'right-[11%] bottom-[72%]', sizeClass: 'w-1.5 h-1.5 bg-orange-400', timingClass: '[animation-duration:3.7s] [animation-delay:2.5s]', minTier: 2 },
  { id: 11, positionClass: 'left-[35%] bottom-[3%]', sizeClass: 'w-1 h-1 bg-red-400', timingClass: '[animation-duration:4.2s] [animation-delay:1.7s]', minTier: 2 },
  { id: 12, positionClass: 'right-[36%] bottom-[4%]', sizeClass: 'w-1.5 h-1.5 bg-amber-400', timingClass: '[animation-duration:3.3s] [animation-delay:0.2s]', minTier: 2 },
  { id: 13, positionClass: 'left-[6%] bottom-[82%]', sizeClass: 'w-1.5 h-1.5 bg-red-500', timingClass: '[animation-duration:2.9s] [animation-delay:0.9s]', minTier: 3 },
  { id: 14, positionClass: 'right-[6%] bottom-[84%]', sizeClass: 'w-1.5 h-1.5 bg-orange-500', timingClass: '[animation-duration:3.1s] [animation-delay:2.1s]', minTier: 3 },
  { id: 15, positionClass: 'left-[62%] bottom-[3%]', sizeClass: 'w-1 h-1 bg-amber-300', timingClass: '[animation-duration:3.6s] [animation-delay:1.4s]', minTier: 3 },
  { id: 16, positionClass: 'left-[48%] bottom-[6%]', sizeClass: 'w-1.5 h-1.5 bg-orange-400', timingClass: '[animation-duration:3.4s] [animation-delay:2.7s]', minTier: 3 },
];

function getHUDObjectives(hud: GameHUDState): HUDObjectiveItem[] {
  if (hud.objectives && hud.objectives.length > 0) {
    return hud.objectives;
  }

  const list: HUDObjectiveItem[] = [];
  if (hud.totalCivilians > 0) {
    list.push({
      id: 'civilians',
      icon: '👥',
      label: 'Pessoas',
      current: hud.rescuedCivilians,
      target: hud.totalCivilians,
      pendingTextClass: 'text-slate-100',
    });
  }
  if (hud.totalPets > 0) {
    list.push({
      id: 'pets',
      icon: '🐾',
      label: 'Animais',
      current: hud.rescuedPets,
      target: hud.totalPets,
      pendingTextClass: 'text-slate-100',
    });
  }
  list.push({
    id: 'fires',
    icon: '🔥',
    label: 'Focos Fogo',
    current: hud.extinguishedFires,
    target: hud.totalFires,
    pendingTextClass: 'text-orange-400',
  });
  if (hud.totalGasValves > 0) {
    list.push({
      id: 'gas',
      icon: '⚠️',
      label: 'Gás GLP',
      current: hud.closedGasValves,
      target: hud.totalGasValves,
      pendingTextClass: 'text-purple-400',
    });
  }
  if (hud.totalElectricPanels > 0) {
    list.push({
      id: 'electric',
      icon: '⚡',
      label: 'Quadros',
      current: hud.cutElectricPanels,
      target: hud.totalElectricPanels,
      pendingTextClass: 'text-cyan-400',
    });
  }
  return list;
}

// Desktop Vitals Panel (preserved for md+ right-hand operational cluster)
const VitalsPanel: React.FC<{
  hud: GameHUDState;
  healthPercent: number;
  extPercent: number;
  heatPercent: number;
  className?: string;
}> = ({ hud, healthPercent, extPercent, heatPercent, className = '' }) => {
  const labels = hud.vitalsLabels;
  return (
    <div className={`bg-slate-900/90 border border-slate-700/80 rounded-2xl p-2.5 shadow-xl pointer-events-auto ${className}`}>
      <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between border-b border-slate-800 pb-0.5">
        <span>Dados Operacionais</span>
        <span className="text-[9px] text-orange-400 font-mono">BOMBEIRO</span>
      </div>

      {/* Health */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="flex items-center gap-1 text-rose-400">
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
            <span>{labels?.healthLabel ?? 'VIDA'}</span>
          </span>
          <span className="font-mono text-white tabular-nums text-xs">{hud.health}/{hud.maxHealth}</span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-150 ${healthPercent < 30 ? 'bg-red-600 animate-pulse' : 'bg-gradient-to-r from-red-500 to-rose-400'}`}
            style={{ width: `${healthPercent}%` }}
          />
        </div>
      </div>

      {/* Primary Resource (Água / Combustível / Bomba Costal) */}
      <div className="space-y-1 mt-1.5">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="flex items-center gap-1 text-cyan-400">
            <span className="text-[10px]">{labels?.resourceEmoji ?? '🧯'}</span>
            <span>{labels?.resourceLabel ?? 'ÁGUA'}</span>
          </span>
          <span className={`font-mono tabular-nums text-xs ${hud.extinguisher <= 15 ? 'text-red-400 font-bold animate-pulse' : 'text-cyan-200'}`}>
            {hud.extinguisher}%
          </span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-100 ${hud.extinguisher <= 15 ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-cyan-600 to-sky-400'}`}
            style={{ width: `${extPercent}%` }}
          />
        </div>
        {hud.extinguisher <= 15 && (
          <div className="text-[10px] text-amber-200 font-black bg-red-950/90 border border-red-500/80 rounded px-1.5 py-0.5 animate-pulse mt-0.5 flex items-center gap-1 leading-tight">
            <span>🚰</span>
            <span>{labels?.refillTipText ?? 'Recarregue no Hidrante!'}</span>
          </div>
        )}
      </div>

      {/* Environmental Hazard (Fumaça / Correnteza / Fadiga Térmica) */}
      <div className="space-y-1 mt-1.5">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="flex items-center gap-1 text-amber-400">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>{labels?.hazardLabel ?? 'FUMAÇA / CALOR'}</span>
          </span>
          <span className={`font-mono tabular-nums text-xs ${heatPercent > 70 ? 'text-red-400 font-bold' : 'text-amber-200'}`}>{heatPercent}%</span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-100 ${heatPercent > 70 ? 'bg-red-600 animate-pulse' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}
            style={{ width: `${heatPercent}%` }}
          />
        </div>
        {heatPercent >= 70 && (
          <div className="text-[10px] text-red-300 font-extrabold bg-red-950/90 border border-red-500 rounded px-1.5 py-0.5 animate-pulse mt-0.5 flex items-center gap-1 leading-tight">
            <span>⚠️</span>
            <span>{labels?.hazardAlertText ?? 'Fumaça Tóxica!'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const GameHUD: React.FC<GameHUDProps> = ({
  hud,
  isMuted,
  onToggleMute,
  onPause,
  isFullscreen = false,
  onToggleFullscreen,
  fireSpreadSpeed = 1.0,
  stageTerm = 'ANDAR',
  totalStages = 10,
  tools,
  onSelectTool,
}) => {
  const [showMobileMissions, setShowMobileMissions] = useState(false);

  const isForest = hud.missionId === 'forest_fire';
  const stagePrefix = stageTerm.charAt(0).toUpperCase();
  const isDangerElevated = fireSpreadSpeed > 1.0;
  const dangerTier = fireSpreadSpeed >= 1.45 ? 3 : fireSpreadSpeed >= 1.2 ? 2 : 1;

  const healthPercent = Math.max(0, Math.min(100, (hud.health / hud.maxHealth) * 100));
  const extPercent = Math.max(0, Math.min(100, (hud.extinguisher / hud.maxExtinguisher) * 100));
  const heatPercent = Math.max(0, Math.min(100, hud.heatMeter));

  const isTimeCritical = hud.timeRemaining <= 20;
  const formattedTime = `${Math.floor(hud.timeRemaining / 60)}:${(hud.timeRemaining % 60).toString().padStart(2, '0')}`;

  const objectivesList = getHUDObjectives(hud);
  const completedCount = objectivesList.reduce((acc, obj) => acc + Math.min(obj.current, obj.target), 0);
  const totalCount = objectivesList.reduce((acc, obj) => acc + obj.target, 0);

  const labels = hud.vitalsLabels;

  // Objectives checklist content
  const renderChecklist = () => (
    <div className="space-y-1.5 text-xs">
      {objectivesList.map(obj => {
        const done = obj.current >= obj.target;
        return (
          <div key={obj.id} className="flex justify-between items-center text-slate-300 gap-2">
            <span className="flex items-center gap-1.5 text-[11px]">
              <span>{obj.icon}</span>
              <span>{obj.label}</span>
            </span>
            <span
              className={`font-mono tabular-nums font-bold text-xs flex items-center gap-1 ${
                done ? 'text-emerald-400' : obj.pendingTextClass ?? 'text-slate-100'
              }`}
            >
              {obj.current}/{obj.target}
              {done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />}
            </span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-20 flex flex-col justify-between p-2 sm:p-3 pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))] pl-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))] select-none">

      {/* Subtle Danger Particle Overlay when fire spread speed is elevated */}
      {isDangerElevated && (
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none overflow-hidden transition-opacity duration-700"
        >
          {/* Soft perimeter heat glow */}
          <div
            className={`absolute inset-0 shadow-[inset_0_0_70px_rgba(234,88,12,0.22)] ${
              dangerTier >= 3
                ? 'opacity-90'
                : dangerTier === 2
                  ? 'opacity-70'
                  : 'opacity-45'
            }`}
          />

          {/* Rising ember particles along edges */}
          {EMBER_PARTICLES.filter(p => p.minTier <= dangerTier).map(particle => (
            <span
              key={particle.id}
              className={`absolute rounded-full blur-[0.5px] shadow-[0_0_6px_rgba(251,146,60,0.8)] animate-ember-rise ${particle.positionClass} ${particle.sizeClass} ${particle.timingClass}`}
            />
          ))}
        </div>
      )}

      {/* ================= MOBILE SLIM TOP BAR (< md) ================= */}
      <div className="md:hidden w-full flex flex-col items-center gap-1.5">
        <div className="w-full h-11 bg-slate-950/85 backdrop-blur-md border border-slate-800/90 rounded-2xl px-2.5 shadow-xl pointer-events-auto flex items-center justify-between gap-2">
          {/* Left: Compact Iconic Vitals (Health, Water, Smoke/Heat) */}
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Vida */}
            <div className="flex flex-col w-10">
              <div className="flex items-center justify-between text-[10px] font-bold leading-none mb-1">
                <Heart className={`w-3 h-3 fill-rose-500 text-rose-500 ${healthPercent < 30 ? 'animate-pulse' : ''}`} />
                <span className="font-mono tabular-nums text-white">{hud.health}</span>
              </div>
              <div className="w-full h-[3px] bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-150 ${healthPercent < 30 ? 'bg-red-500' : 'bg-rose-400'}`}
                  style={{ width: `${healthPercent}%` }}
                />
              </div>
            </div>

            {/* Água */}
            <div className="flex flex-col w-10">
              <div className="flex items-center justify-between text-[10px] font-bold leading-none mb-1">
                <Droplets className={`w-3 h-3 ${hud.extinguisher <= 15 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`} />
                <span className={`font-mono tabular-nums ${hud.extinguisher <= 15 ? 'text-red-400' : 'text-cyan-200'}`}>{hud.extinguisher}%</span>
              </div>
              <div className="w-full h-[3px] bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-100 ${hud.extinguisher <= 15 ? 'bg-red-500' : 'bg-cyan-400'}`}
                  style={{ width: `${extPercent}%` }}
                />
              </div>
            </div>

            {/* Fumaça / Calor */}
            <div className="flex flex-col w-10">
              <div className="flex items-center justify-between text-[10px] font-bold leading-none mb-1">
                <Flame className={`w-3 h-3 ${heatPercent >= 70 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`} />
                <span className={`font-mono tabular-nums ${heatPercent >= 70 ? 'text-red-400' : 'text-amber-200'}`}>{heatPercent}%</span>
              </div>
              <div className="w-full h-[3px] bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-100 ${heatPercent >= 70 ? 'bg-red-500' : 'bg-amber-400'}`}
                  style={{ width: `${heatPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Center: Stage & Timer */}
          <div className="flex items-center gap-1.5 whitespace-nowrap shrink-0">
            <span className={`text-[11px] font-black ${isForest ? 'text-emerald-400' : 'text-orange-400'}`}>
              {stagePrefix}{hud.currentFloor}
            </span>
            <span className="text-slate-600 text-xs">·</span>
            <span className={`font-mono tabular-nums font-bold text-xs ${isTimeCritical ? 'text-red-400 animate-pulse' : 'text-slate-100'}`}>
              {formattedTime}
            </span>
          </div>

          {/* Right: Metas Drawer Toggle & Pause */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                sounds.playClick();
                setShowMobileMissions(prev => !prev);
              }}
              className={`h-8 px-2 rounded-xl border text-[11px] font-bold flex items-center gap-1 transition active:scale-95 whitespace-nowrap ${
                showMobileMissions
                  ? 'bg-orange-600/90 border-orange-400 text-white'
                  : hud.exitUnlocked
                    ? 'bg-emerald-600/80 border-emerald-400 text-white'
                    : 'bg-slate-900 border-slate-700 text-amber-300'
              }`}
              aria-label="Abrir metas da fase"
            >
              <ListChecks className="w-3.5 h-3.5 shrink-0" />
              <span className="font-mono tabular-nums">{completedCount}/{totalCount}</span>
              {showMobileMissions ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                setShowMobileMissions(false);
                onPause();
              }}
              className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-white flex items-center justify-center active:scale-95 transition"
              aria-label="Pausar jogo"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile Metas Popover Drawer */}
        {showMobileMissions && (
          <div className="self-end w-56 bg-slate-950/95 backdrop-blur-md border border-slate-700/90 rounded-2xl p-3 shadow-2xl pointer-events-auto animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
              <span className="text-[11px] font-bold text-slate-300">Metas ({completedCount}/{totalCount})</span>
              <span className="text-[11px] font-mono tabular-nums font-bold text-amber-400 flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                {hud.score.toLocaleString('pt-BR')}
              </span>
            </div>
            {(hud.windLabel || hud.preservedPercent !== undefined) && (
              <div className="mb-2 pb-1.5 border-b border-slate-800 flex items-center justify-between text-[10px] font-bold">
                {hud.windLabel && <span className="text-sky-300">{hud.windLabel}</span>}
                {hud.preservedPercent !== undefined && (
                  <span className={hud.preservedPercent < 55 ? 'text-amber-300' : 'text-emerald-300'}>
                    🌲 {hud.preservedPercent}%
                  </span>
                )}
              </div>
            )}
            {renderChecklist()}
          </div>
        )}

        {/* Mobile Single-Line Alert or Forest Telemetry */}
        {hud.exitUnlocked ? (
          <div className="bg-emerald-600/95 border border-emerald-300 text-white text-[11px] font-black px-3 py-0.5 rounded-full shadow-lg animate-bounce flex items-center gap-1 whitespace-nowrap">
            <Sparkles className="w-3 h-3" />
            <span>{isForest ? 'SETOR CONTROLADO!' : 'SAÍDA LIBERADA!'}</span>
          </div>
        ) : hud.extinguisher <= 0 ? (
          <div className="bg-red-600/95 border border-amber-300 text-white text-[11px] font-black px-3 py-0.5 rounded-full shadow-lg animate-pulse flex items-center gap-1 whitespace-nowrap">
            <span>🚰</span>
            <span>{labels?.emptyResourceAlertText ?? 'EXTINTOR VAZIO! RECARREGUE NO HIDRANTE'}</span>
          </div>
        ) : hud.smokeAlert ? (
          <div className="bg-amber-600/95 border border-amber-200 text-slate-950 text-[11px] font-black px-3 py-0.5 rounded-full shadow-lg animate-pulse flex items-center gap-1 whitespace-nowrap">
            <span>{isForest ? '🔥' : '💨'}</span>
            <span>{isForest ? 'CALOR EXTREMO! AFASTE-SE DO FOGO' : 'FUMAÇA TÓXICA! USE O JATO'}</span>
          </div>
        ) : isForest && (hud.windLabel || hud.preservedPercent !== undefined) ? (
          <div className="bg-slate-950/85 border border-emerald-500/35 text-slate-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow flex items-center gap-2 whitespace-nowrap">
            {hud.windLabel && <span className="text-sky-300">{hud.windLabel}</span>}
            {hud.windLabel && hud.preservedPercent !== undefined && <span className="text-slate-600">·</span>}
            {hud.preservedPercent !== undefined && (
              <span className={hud.preservedPercent < 55 ? 'text-amber-300' : 'text-emerald-300'}>
                🌲 {hud.preservedPercent}% mata viva
              </span>
            )}
          </div>
        ) : null}
      </div>

      {/* ================= DESKTOP PERIMETER HUD (md+) ================= */}
      <div className="hidden md:flex items-start justify-between w-full gap-2">
        {/* Left side kept clear on desktop */}
        <div />

        {/* Center: Stage Indicator & Timer */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className={`bg-slate-900/90 border rounded-2xl px-4 py-1.5 shadow-xl flex items-center gap-3 ${isForest ? 'border-emerald-500/40' : 'border-orange-500/40'}`}>
            <div className="flex items-center gap-1">
              <span className={`text-xs font-bold uppercase tracking-wider ${isForest ? 'text-emerald-400' : 'text-orange-400'}`}>{stageTerm}</span>
              <span className={`text-white font-extrabold text-sm px-2 py-0.5 rounded-lg shadow-sm ${isForest ? 'bg-emerald-600' : 'bg-orange-600'}`}>
                {hud.currentFloor}/{totalStages}
              </span>
            </div>

            <div className="h-4 w-px bg-slate-700" />

            <div className={`flex items-center gap-1 font-mono font-bold text-base tabular-nums ${isTimeCritical ? 'text-red-400 animate-pulse' : 'text-slate-100'}`}>
              <Clock className={`w-3.5 h-3.5 ${isForest ? 'text-emerald-400' : 'text-orange-400'}`} />
              <span>{formattedTime}</span>
            </div>
          </div>

          {/* Forest Telemetry Strip (Wind & Vegetation Preservation) */}
          {isForest && (hud.windLabel || hud.preservedPercent !== undefined) && (
            <div className="bg-slate-950/90 border border-slate-700/80 rounded-full px-3 py-0.5 shadow-lg flex items-center gap-2.5 text-xs font-bold">
              {hud.windLabel && (
                <span className="flex items-center gap-1 text-sky-300">
                  <Wind className="w-3.5 h-3.5 text-sky-400" />
                  <span>{hud.windLabel}</span>
                </span>
              )}
              {hud.windLabel && hud.preservedPercent !== undefined && <span className="text-slate-600">|</span>}
              {hud.preservedPercent !== undefined && (
                <span className={`flex items-center gap-1 ${hud.preservedPercent < 55 ? 'text-amber-300' : 'text-emerald-300'}`}>
                  <Trees className="w-3.5 h-3.5" />
                  <span>{hud.preservedPercent}% mata preservada</span>
                </span>
              )}
            </div>
          )}

          {/* Exit / Goal Status Pill */}
          {hud.exitUnlocked ? (
            <div className="bg-emerald-600/95 border-2 border-emerald-300 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-xl animate-bounce flex items-center gap-1.5 pointer-events-auto">
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>{isForest ? 'SETOR CONTROLADO!' : 'SAÍDA LIBERADA! VÁ ATÉ A PORTA!'}</span>
            </div>
          ) : (
            <div className="text-xs text-slate-300 bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-slate-800 font-medium">
              {isForest
                ? 'Contenha os focos, enterre brasas e salve a fauna'
                : 'Cumpra as metas para liberar a escada'}
            </div>
          )}

          {/* Urgent Empty Tank Alert */}
          {hud.extinguisher <= 0 && (
            <div className="bg-red-600 border-2 border-amber-300 text-white text-xs font-black px-3 py-1 rounded-full shadow-2xl animate-bounce flex items-center gap-1.5 pointer-events-auto">
              <span>🚨</span>
              <span>
                {isForest
                  ? 'BOMBA VAZIA! Use o Abafador [2] ou encha no Riacho [🚰]!'
                  : 'EXTINTOR VAZIO! Vá ao Hidrante [🚰] e aperte [AÇÃO]!'}
              </span>
            </div>
          )}

          {/* Thermal / Smoke Exposure Alert */}
          {hud.smokeAlert && hud.extinguisher > 0 && !hud.exitUnlocked && (
            <div className="bg-amber-600/95 border border-amber-300 text-slate-950 text-xs font-black px-2.5 py-1 rounded-full shadow-lg animate-pulse flex items-center gap-1.5 pointer-events-auto">
              <span>{isForest ? '🔥' : '💨'}</span>
              <span>
                {isForest
                  ? 'CALOR EXTREMO! Afaste-se do fogo ou resfrie no riacho!'
                  : 'FUMAÇA ESPESSA! Disperse com o Extintor para não sufocar!'}
              </span>
            </div>
          )}
        </div>

        {/* Right Side: Controls bar + Vitals & Metas side-by-side */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          {/* Controls & Score bar */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl px-2.5 py-1 shadow-md flex items-center gap-1.5 text-amber-400">
              <Trophy className="w-3.5 h-3.5" />
              <span className="font-mono text-sm font-extrabold text-white tabular-nums">{hud.score.toLocaleString('pt-BR')}</span>
            </div>

            <div className="flex items-center gap-1">
              {onToggleFullscreen && (
                <button
                  onClick={() => {
                    sounds.playClick();
                    onToggleFullscreen();
                  }}
                  className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-amber-400 hover:text-white transition shadow-md active:scale-95"
                  title={isFullscreen ? 'Sair da Tela Cheia' : 'Entrar em Tela Cheia'}
                >
                  {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
                </button>
              )}

              <button
                onClick={() => {
                  sounds.playClick();
                  onToggleMute();
                }}
                className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition shadow-md active:scale-95"
                title={isMuted ? 'Ativar Som' : 'Silenciar'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
              </button>

              <button
                onClick={() => {
                  sounds.playClick();
                  onPause();
                }}
                className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition shadow-md active:scale-95"
                title="Pausar"
              >
                <Pause className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex flex-row items-start gap-2 pointer-events-auto">
            <VitalsPanel
              hud={hud}
              healthPercent={healthPercent}
              extPercent={extPercent}
              heatPercent={heatPercent}
              className="w-[200px] lg:w-[220px]"
            />

            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-2.5 shadow-xl w-[190px] lg:w-[210px]">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between border-b border-slate-800 pb-0.5">
                <span>Metas da Fase</span>
                <span className="text-[10px] text-amber-400 font-mono font-bold">({completedCount}/{totalCount})</span>
              </div>
              {renderChecklist()}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Bottom Tool Bar + Contextual Action Prompt */}
      <div className="hidden md:flex flex-col items-center gap-2 mb-4 pointer-events-none px-2">
        {hud.promptActionText && (
          <div className="bg-slate-900/95 text-white font-black text-sm px-6 py-2.5 rounded-full shadow-2xl border-2 border-amber-400 animate-bounce flex items-center gap-2 max-w-[94vw] text-center pointer-events-auto">
            <span className="bg-amber-500 text-slate-950 text-xs px-2 py-0.5 rounded font-mono font-black uppercase shrink-0">
              AÇÃO [E]
            </span>
            <span className="truncate">{hud.promptActionText}</span>
          </div>
        )}

        {tools && tools.length > 0 && onSelectTool && (
          <div className="pointer-events-auto bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-2xl p-1.5 shadow-2xl flex items-center gap-1.5">
            {tools.map(tool => {
              const active = tool.id === hud.activeToolId;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onSelectTool(tool.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'bg-slate-900/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                  }`}
                >
                  {tool.keyHint && (
                    <span className={`font-mono text-[10px] px-1 rounded ${active ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                      {tool.keyHint}
                    </span>
                  )}
                  <span>{tool.icon}</span>
                  <span>{tool.label}</span>
                </button>
              );
            })}
            <span className="text-[11px] text-slate-400 font-medium px-2 border-l border-slate-800">
              [ESPAÇO] Usar · [E] Resgatar / Riacho
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
