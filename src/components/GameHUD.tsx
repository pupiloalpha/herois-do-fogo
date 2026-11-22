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

function formatStageName(stageTerm: string): string {
  const clean = stageTerm.trim().toLowerCase();
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

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
  const [desktopGoalsOpen, setDesktopGoalsOpen] = useState(true);

  const isForest = hud.missionId === 'forest_fire';
  const isFlood = hud.missionId === 'flood_rescue';
  const stagePrefix = stageTerm.charAt(0).toUpperCase();
  const formattedStageTerm = formatStageName(stageTerm);
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

  const renderChecklist = () => (
    <div className="space-y-1.5 text-xs">
      {objectivesList.map((obj) => {
        const done = obj.current >= obj.target;
        return (
          <div key={obj.id} className="flex justify-between items-center text-slate-200 gap-2">
            <span className="flex items-center gap-1.5 text-xs">
              <span>{obj.icon}</span>
              <span className={done ? 'text-slate-400 line-through' : 'text-slate-200'}>
                {obj.label}
              </span>
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
          <div
            className={`absolute inset-0 shadow-[inset_0_0_70px_rgba(234,88,12,0.22)] ${
              dangerTier >= 3
                ? 'opacity-90'
                : dangerTier === 2
                  ? 'opacity-70'
                  : 'opacity-45'
            }`}
          />
          {EMBER_PARTICLES.filter((p) => p.minTier <= dangerTier).map((particle) => (
            <span
              key={particle.id}
              className={`absolute rounded-full blur-[0.5px] shadow-[0_0_6px_rgba(251,146,60,0.8)] animate-ember-rise ${particle.positionClass} ${particle.sizeClass} ${particle.timingClass}`}
            />
          ))}
        </div>
      )}

      {/* ================= MOBILE SLIM TOP BAR (< md) ================= */}
      <div className="md:hidden w-full flex flex-col items-center gap-1.5">
        <div className="w-full h-11 bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-2xl px-2.5 shadow-lg pointer-events-auto flex items-center justify-between gap-2">
          {/* Left: Colorful Iconic Vitals */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex flex-col w-10">
              <div className="flex items-center justify-between text-[10px] font-bold leading-none mb-1">
                <Heart className={`w-3 h-3 fill-rose-500 text-rose-500 ${healthPercent < 30 ? 'animate-pulse' : ''}`} />
                <span className="font-mono tabular-nums text-white">{hud.health}</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-150 ${healthPercent < 30 ? 'bg-red-500' : 'bg-rose-400'}`}
                  style={{ width: `${healthPercent}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col w-10">
              <div className="flex items-center justify-between text-[10px] font-bold leading-none mb-1">
                <Droplets className={`w-3 h-3 ${hud.extinguisher <= 15 ? 'text-red-400 animate-pulse' : 'text-sky-400'}`} />
                <span className={`font-mono tabular-nums ${hud.extinguisher <= 15 ? 'text-red-400' : 'text-sky-200'}`}>
                  {hud.extinguisher}%
                </span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-100 ${hud.extinguisher <= 15 ? 'bg-red-500' : 'bg-sky-400'}`}
                  style={{ width: `${extPercent}%` }}
                />
              </div>
            </div>

            <div className="flex flex-col w-10">
              <div className="flex items-center justify-between text-[10px] font-bold leading-none mb-1">
                <Flame className={`w-3 h-3 ${heatPercent >= 70 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`} />
                <span className={`font-mono tabular-nums ${heatPercent >= 70 ? 'text-red-400' : 'text-amber-200'}`}>
                  {heatPercent}%
                </span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-100 ${heatPercent >= 70 ? 'bg-red-500' : 'bg-amber-400'}`}
                  style={{ width: `${heatPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Center: Stage & Timer */}
          <div className="flex items-center gap-1.5 whitespace-nowrap shrink-0">
            <span className={`font-display text-xs font-bold ${isFlood ? 'text-sky-300' : isForest ? 'text-emerald-300' : 'text-orange-300'}`}>
              {stagePrefix}{hud.currentFloor}
            </span>
            <span className="text-slate-600 text-xs">·</span>
            <span className={`font-mono tabular-nums font-bold text-xs ${isTimeCritical ? 'text-rose-400 animate-pulse' : 'text-slate-100'}`}>
              {formattedTime}
            </span>
          </div>

          {/* Right: Metas Drawer & Pause */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setShowMobileMissions((prev) => !prev);
              }}
              className={`h-8 px-2 rounded-xl border text-[11px] font-bold flex items-center gap-1 transition active:scale-95 whitespace-nowrap ${
                showMobileMissions
                  ? 'bg-orange-500 border-orange-300 text-slate-950'
                  : hud.exitUnlocked
                    ? 'bg-emerald-500 border-emerald-300 text-slate-950'
                    : 'bg-slate-900/90 border-white/15 text-amber-300'
              }`}
              aria-label="Abrir metas da fase"
            >
              <ListChecks className="w-3.5 h-3.5 shrink-0" />
              <span className="font-mono tabular-nums">{completedCount}/{totalCount}</span>
              {showMobileMissions ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setShowMobileMissions(false);
                onPause();
              }}
              className="w-8 h-8 rounded-xl bg-slate-900/90 border border-white/15 text-slate-200 hover:text-white flex items-center justify-center active:scale-95 transition"
              aria-label="Pausar jogo"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile Metas Popover */}
        {showMobileMissions && (
          <div className="self-end w-56 bg-slate-950/92 backdrop-blur-md border border-white/15 rounded-2xl p-3 shadow-2xl pointer-events-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
              <span className="text-xs font-bold text-slate-200">Metas ({completedCount}/{totalCount})</span>
              <span className="text-xs font-mono tabular-nums font-bold text-amber-300 flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                {hud.score.toLocaleString('pt-BR')}
              </span>
            </div>
            {(hud.windLabel || hud.preservedPercent !== undefined || hud.vehicleLabel) && (
              <div className="mb-2 pb-1.5 border-b border-white/10 flex items-center justify-between text-[11px] font-semibold">
                {hud.windLabel && <span className="text-sky-300">{hud.windLabel}</span>}
                {hud.preservedPercent !== undefined && (
                  <span className={hud.preservedPercent < 55 ? 'text-amber-300' : 'text-emerald-300'}>
                    🌲 {hud.preservedPercent}%
                  </span>
                )}
                {hud.vehicleLabel && <span className="text-sky-300">{hud.vehicleLabel}</span>}
                {hud.aboardCount !== undefined && hud.maxAboard !== undefined && (
                  <span className={hud.aboardCount >= hud.maxAboard ? 'text-amber-300' : 'text-emerald-300'}>
                    🛟 {hud.aboardCount}/{hud.maxAboard}
                  </span>
                )}
              </div>
            )}
            {renderChecklist()}
          </div>
        )}

        {/* Mobile Dynamic Alert / Compact Telemetry */}
        {hud.exitUnlocked ? (
          <div className="bg-emerald-500 text-slate-950 text-xs font-bold px-3 py-1 rounded-xl shadow-lg flex items-center gap-1.5 whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isFlood ? 'Setor evacuado!' : isForest ? 'Setor controlado!' : 'Saída liberada!'}</span>
          </div>
        ) : isFlood && hud.aboardCount !== undefined && hud.maxAboard !== undefined && hud.aboardCount >= hud.maxAboard ? (
          <div className="bg-emerald-500 text-slate-950 text-xs font-bold px-3 py-1 rounded-xl shadow-lg animate-pulse flex items-center gap-1.5 whitespace-nowrap">
            <span>🏥</span>
            <span>Lotado ({hud.aboardCount}/{hud.maxAboard}) — vá ao Abrigo (H)</span>
          </div>
        ) : hud.extinguisher <= 0 ? (
          <div className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-xl shadow-lg animate-pulse flex items-center gap-1.5 whitespace-nowrap">
            <span>{isFlood ? '⛽' : '🚰'}</span>
            <span>{labels?.emptyResourceAlertText ?? 'Tanque vazio! Recarregue'}</span>
          </div>
        ) : hud.smokeAlert ? (
          <div className="bg-amber-400 text-slate-950 text-xs font-bold px-3 py-1 rounded-xl shadow-lg animate-pulse flex items-center gap-1.5 whitespace-nowrap">
            <span>{isFlood ? '⚡' : isForest ? '🔥' : '💨'}</span>
            <span>
              {isFlood
                ? 'Risco elétrico / correnteza!'
                : isForest
                  ? 'Calor extremo! Afaste-se'
                  : 'Fumaça tóxica! Use o jato'}
            </span>
          </div>
        ) : isFlood && hud.vehicleLabel ? (
          <div className="bg-slate-950/70 backdrop-blur-sm text-slate-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-lg flex items-center gap-2 whitespace-nowrap">
            <span className="text-sky-300">{hud.vehicleLabel}</span>
            <span className="text-slate-500">·</span>
            <span className={(hud.aboardCount ?? 0) > 0 ? 'text-amber-300' : 'text-slate-300'}>
              A bordo: {hud.aboardCount ?? 0}/{hud.maxAboard ?? 3}
            </span>
          </div>
        ) : isForest && (hud.windLabel || hud.preservedPercent !== undefined) ? (
          <div className="bg-slate-950/70 backdrop-blur-sm text-slate-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-lg flex items-center gap-2 whitespace-nowrap">
            {hud.windLabel && <span className="text-sky-300">{hud.windLabel}</span>}
            {hud.windLabel && hud.preservedPercent !== undefined && <span className="text-slate-500">·</span>}
            {hud.preservedPercent !== undefined && (
              <span className={hud.preservedPercent < 55 ? 'text-amber-300' : 'text-emerald-300'}>
                🌲 {hud.preservedPercent}% mata viva
              </span>
            )}
          </div>
        ) : null}
      </div>

      {/* ================= DESKTOP PERIMETER HUD (md+) ================= */}
      <div className="hidden md:flex items-start justify-between w-full gap-3">
        <div />

        {/* Center Top: Single Clean Stage Capsule + Contextual Alert Only When Needed */}
        <div className="flex flex-col items-center gap-1.5 shrink-0">
          <div className="bg-slate-950/80 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-1.5 shadow-lg flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className={`font-display text-sm font-bold ${isFlood ? 'text-sky-300' : isForest ? 'text-emerald-300' : 'text-amber-300'}`}>
                {formattedStageTerm}
              </span>
              <span className={`font-mono tabular-nums text-slate-950 font-bold text-xs px-2 py-0.5 rounded-lg ${isFlood ? 'bg-sky-400' : isForest ? 'bg-emerald-400' : 'bg-orange-400'}`}>
                {hud.currentFloor}/{totalStages}
              </span>
            </div>

            <div className="h-4 w-px bg-white/15" />

            <div className={`flex items-center gap-1.5 font-mono font-bold text-sm tabular-nums ${isTimeCritical ? 'text-rose-400 animate-pulse' : 'text-white'}`}>
              <Clock className={`w-4 h-4 ${isFlood ? 'text-sky-400' : isForest ? 'text-emerald-400' : 'text-orange-400'}`} />
              <span>{formattedTime}</span>
            </div>

            {isFlood && hud.vehicleLabel && (
              <>
                <div className="h-4 w-px bg-white/15" />
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <span className="text-sky-300">{hud.vehicleLabel}</span>
                  <span className="text-slate-500">·</span>
                  <span className={`font-mono tabular-nums ${(hud.aboardCount ?? 0) >= (hud.maxAboard ?? 3) ? 'text-amber-300' : 'text-emerald-300'}`}>
                    🛟 {hud.aboardCount ?? 0}/{hud.maxAboard ?? 3}
                  </span>
                </div>
              </>
            )}

            {isForest && (hud.windLabel || hud.preservedPercent !== undefined) && (
              <>
                <div className="h-4 w-px bg-white/15" />
                <div className="flex items-center gap-2 text-xs font-semibold">
                  {hud.windLabel && (
                    <span className="flex items-center gap-1 text-sky-300">
                      <Wind className="w-3.5 h-3.5" />
                      <span>{hud.windLabel}</span>
                    </span>
                  )}
                  {hud.preservedPercent !== undefined && (
                    <span className={`flex items-center gap-1 font-mono tabular-nums ${hud.preservedPercent < 55 ? 'text-amber-300' : 'text-emerald-300'}`}>
                      <Trees className="w-3.5 h-3.5" />
                      <span>{hud.preservedPercent}%</span>
                    </span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Dynamic Alerts Only */}
          {hud.exitUnlocked ? (
            <div className="bg-emerald-500 text-slate-950 text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 pointer-events-auto">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isFlood ? 'Setor evacuado!' : isForest ? 'Setor controlado!' : 'Saída liberada! Vá até a porta!'}</span>
            </div>
          ) : isFlood && hud.aboardCount !== undefined && hud.maxAboard !== undefined && hud.aboardCount >= hud.maxAboard ? (
            <div className="bg-emerald-500 text-slate-950 text-xs font-bold px-3.5 py-1 rounded-xl shadow-lg animate-pulse flex items-center gap-1.5 pointer-events-auto">
              <span>🏥</span>
              <span>Lotado ({hud.aboardCount}/{hud.maxAboard})! Leve ao Abrigo (H)</span>
            </div>
          ) : hud.extinguisher <= 0 ? (
            <div className="bg-rose-600 text-white text-xs font-bold px-3.5 py-1 rounded-xl shadow-lg animate-pulse flex items-center gap-1.5 pointer-events-auto">
              <span>🚨</span>
              <span>
                {isFlood
                  ? 'Combustível baixo! Vá ao Abrigo (H)'
                  : isForest
                    ? 'Bomba vazia! Use o Abafador [2] ou encha no Riacho'
                    : 'Extintor vazio! Recarregue no Hidrante [E]'}
              </span>
            </div>
          ) : hud.smokeAlert ? (
            <div className="bg-amber-400 text-slate-950 text-xs font-bold px-3.5 py-1 rounded-xl shadow-lg animate-pulse flex items-center gap-1.5 pointer-events-auto">
              <span>{isFlood ? '⚡' : isForest ? '🔥' : '💨'}</span>
              <span>
                {isFlood
                  ? 'Poste energizado ou correnteza forte!'
                  : isForest
                    ? 'Calor extremo! Afaste-se ou resfrie no riacho'
                    : 'Fumaça espessa! Disperse com o jato'}
              </span>
            </div>
          ) : null}
        </div>

        {/* Right Top: Consolidated Single Compact Column (~228px max) */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          {/* Score & 36px Action Buttons */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <div className="h-9 bg-slate-950/80 backdrop-blur-md border border-white/15 rounded-xl px-3 shadow-md flex items-center gap-1.5 text-amber-300">
              <Trophy className="w-3.5 h-3.5" />
              <span className="font-mono text-sm font-bold text-white tabular-nums">
                {hud.score.toLocaleString('pt-BR')}
              </span>
            </div>

            {onToggleFullscreen && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onToggleFullscreen();
                }}
                className="w-9 h-9 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-white/15 text-amber-300 hover:text-white transition shadow-md active:scale-95 flex items-center justify-center cursor-pointer"
                title={isFullscreen ? 'Sair da Tela Cheia' : 'Tela Cheia'}
                aria-label="Tela Cheia"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onToggleMute();
              }}
              className="w-9 h-9 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-white/15 text-slate-200 hover:text-white transition shadow-md active:scale-95 flex items-center justify-center cursor-pointer"
              title={isMuted ? 'Ativar Som' : 'Silenciar'}
              aria-label={isMuted ? 'Ativar Som' : 'Silenciar'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onPause();
              }}
              className="w-9 h-9 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-white/15 text-slate-200 hover:text-white transition shadow-md active:scale-95 flex items-center justify-center cursor-pointer"
              title="Pausar (Esc / P)"
              aria-label="Pausar"
            >
              <Pause className="w-4 h-4" />
            </button>
          </div>

          {/* Unified Compact Vitals + Collapsible Goals Card */}
          <div className="w-[216px] lg:w-[232px] bg-slate-950/80 backdrop-blur-md border border-white/15 rounded-2xl p-3 shadow-xl pointer-events-auto space-y-2.5">
            {/* Vitals Bars */}
            <div className="space-y-2">
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-rose-400">
                    <Heart className={`w-3.5 h-3.5 fill-rose-500 text-rose-500 ${healthPercent < 30 ? 'animate-pulse' : ''}`} />
                    <span>{labels?.healthLabel ?? 'Vida'}</span>
                  </span>
                  <span className="font-mono text-white tabular-nums">{hud.health}/{hud.maxHealth}</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-150 ${healthPercent < 30 ? 'bg-red-500' : 'bg-gradient-to-r from-rose-500 to-rose-400'}`}
                    style={{ width: `${healthPercent}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-sky-400">
                    <span>{labels?.resourceEmoji ?? '🧯'}</span>
                    <span>{labels?.resourceLabel ?? 'Água'}</span>
                  </span>
                  <span className={`font-mono tabular-nums ${hud.extinguisher <= 15 ? 'text-rose-400 font-bold' : 'text-sky-200'}`}>
                    {hud.extinguisher}%
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-100 ${hud.extinguisher <= 15 ? 'bg-red-500' : 'bg-gradient-to-r from-sky-500 to-cyan-300'}`}
                    style={{ width: `${extPercent}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>{labels?.hazardLabel ?? 'Calor'}</span>
                  </span>
                  <span className={`font-mono tabular-nums ${heatPercent > 70 ? 'text-rose-400 font-bold' : 'text-amber-200'}`}>
                    {heatPercent}%
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-100 ${heatPercent > 70 ? 'bg-red-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`}
                    style={{ width: `${heatPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Collapsible Goals Section */}
            <div className="pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setDesktopGoalsOpen((prev) => !prev);
                }}
                className="w-full flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
                aria-expanded={desktopGoalsOpen}
              >
                <span className="flex items-center gap-1.5">
                  <ListChecks className="w-3.5 h-3.5 text-amber-300" />
                  <span>Metas</span>
                </span>
                <span className="flex items-center gap-1 font-mono tabular-nums text-amber-300">
                  {completedCount}/{totalCount}
                  {desktopGoalsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </span>
              </button>

              {desktopGoalsOpen && <div className="mt-2">{renderChecklist()}</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Bottom Tool Bar + Contextual Action Prompt */}
      <div className="hidden md:flex flex-col items-center gap-2 mb-3 pointer-events-none px-2">
        {hud.promptActionText && (
          <div className="bg-slate-950/90 backdrop-blur-md text-white font-bold text-sm px-5 py-2 rounded-xl shadow-2xl border border-amber-400/70 flex items-center gap-2.5 max-w-[90vw] pointer-events-auto">
            <span className="bg-amber-400 text-slate-950 text-xs px-2 py-0.5 rounded-md font-mono font-bold shrink-0">
              E
            </span>
            <span className="truncate">{hud.promptActionText}</span>
          </div>
        )}

        {tools && tools.length > 0 && onSelectTool && (
          <div className="pointer-events-auto bg-slate-950/85 backdrop-blur-md border border-white/15 rounded-2xl p-1.5 shadow-xl flex items-center gap-1.5">
            {tools.map((tool) => {
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
                      ? isFlood
                        ? 'bg-sky-400 text-slate-950 shadow-sm'
                        : 'bg-emerald-400 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {tool.keyHint && (
                    <span
                      className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                        active ? 'bg-slate-950/20 text-slate-950' : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      {tool.keyHint}
                    </span>
                  )}
                  <span className="text-sm leading-none">{tool.icon}</span>
                  <span>{tool.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
