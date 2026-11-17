import React, { useState } from 'react';
import { GameHUDState } from '../game/types';
import {
  Heart,
  Flame,
  Clock,
  Trophy,
  Users,
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
} from 'lucide-react';
import { sounds } from '../audio/SoundManager';

interface GameHUDProps {
  hud: GameHUDState;
  isMuted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

// Desktop Vitals Panel (preserved for md+ right-hand operational cluster)
const VitalsPanel: React.FC<{
  hud: GameHUDState;
  healthPercent: number;
  extPercent: number;
  heatPercent: number;
  className?: string;
}> = ({ hud, healthPercent, extPercent, heatPercent, className = '' }) => (
  <div className={`bg-slate-900/90 border border-slate-700/80 rounded-2xl p-2.5 shadow-xl pointer-events-auto ${className}`}>
    <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between border-b border-slate-800 pb-0.5">
      <span>Dados Operacionais</span>
      <span className="text-[9px] text-orange-400 font-mono">BOMBEIRO</span>
    </div>

    {/* Health (Vida) */}
    <div className="space-y-1">
      <div className="flex justify-between items-center text-xs font-bold">
        <span className="flex items-center gap-1 text-rose-400">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
          <span>VIDA</span>
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

    {/* Extinguisher Pressure & Hydrant Refill Alert (Água) */}
    <div className="space-y-1 mt-1.5">
      <div className="flex justify-between items-center text-xs font-bold">
        <span className="flex items-center gap-1 text-cyan-400">
          <span className="text-[10px]">🧯</span>
          <span>ÁGUA</span>
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
          <span>Recarregue no Hidrante!</span>
        </div>
      )}
    </div>

    {/* Heat & Smoke Exposure (Dano / Fumaça) */}
    <div className="space-y-1 mt-1.5">
      <div className="flex justify-between items-center text-xs font-bold">
        <span className="flex items-center gap-1 text-amber-400">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          <span>FUMAÇA / CALOR</span>
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
          <span>Fumaça Tóxica!</span>
        </div>
      )}
    </div>
  </div>
);

export const GameHUD: React.FC<GameHUDProps> = ({
  hud,
  isMuted,
  onToggleMute,
  onPause,
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const [showMobileMissions, setShowMobileMissions] = useState(false);

  const healthPercent = Math.max(0, Math.min(100, (hud.health / hud.maxHealth) * 100));
  const extPercent = Math.max(0, Math.min(100, (hud.extinguisher / hud.maxExtinguisher) * 100));
  const heatPercent = Math.max(0, Math.min(100, hud.heatMeter));

  const isTimeCritical = hud.timeRemaining <= 20;
  const formattedTime = `${Math.floor(hud.timeRemaining / 60)}:${(hud.timeRemaining % 60).toString().padStart(2, '0')}`;

  // Calculate completed objectives count
  let completedCount = 0;
  let totalCount = 0;
  if (hud.totalCivilians > 0) {
    totalCount += hud.totalCivilians;
    completedCount += hud.rescuedCivilians;
  }
  if (hud.totalPets > 0) {
    totalCount += hud.totalPets;
    completedCount += hud.rescuedPets;
  }
  if (hud.totalFires > 0) {
    totalCount += hud.totalFires;
    completedCount += hud.extinguishedFires;
  }
  if (hud.totalGasValves > 0) {
    totalCount += hud.totalGasValves;
    completedCount += hud.closedGasValves;
  }
  if (hud.totalElectricPanels > 0) {
    totalCount += hud.totalElectricPanels;
    completedCount += hud.cutElectricPanels;
  }

  // Objectives checklist content
  const renderChecklist = () => (
    <div className="space-y-1.5 text-xs">
      {hud.totalCivilians > 0 && (
        <div className="flex justify-between items-center text-slate-300 gap-2">
          <span className="flex items-center gap-1.5 text-[11px]">
            <Users className="w-3.5 h-3.5 text-emerald-400" /> Pessoas
          </span>
          <span className={`font-mono tabular-nums font-bold text-xs flex items-center gap-1 ${hud.rescuedCivilians >= hud.totalCivilians ? 'text-emerald-400' : 'text-slate-100'}`}>
            {hud.rescuedCivilians}/{hud.totalCivilians}
            {hud.rescuedCivilians >= hud.totalCivilians && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />}
          </span>
        </div>
      )}

      {hud.totalPets > 0 && (
        <div className="flex justify-between items-center text-slate-300 gap-2">
          <span className="flex items-center gap-1.5 text-[11px]">
            🐾 Animais
          </span>
          <span className={`font-mono tabular-nums font-bold text-xs flex items-center gap-1 ${hud.rescuedPets >= hud.totalPets ? 'text-yellow-400' : 'text-slate-100'}`}>
            {hud.rescuedPets}/{hud.totalPets}
            {hud.rescuedPets >= hud.totalPets && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />}
          </span>
        </div>
      )}

      <div className="flex justify-between items-center text-slate-300 gap-2">
        <span className="flex items-center gap-1.5 text-[11px]">
          🔥 Focos Fogo
        </span>
        <span className={`font-mono tabular-nums font-bold text-xs flex items-center gap-1 ${hud.extinguishedFires >= hud.totalFires ? 'text-emerald-400' : 'text-orange-400'}`}>
          {hud.extinguishedFires}/{hud.totalFires}
          {hud.extinguishedFires >= hud.totalFires && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />}
        </span>
      </div>

      {hud.totalGasValves > 0 && (
        <div className="flex justify-between items-center text-slate-300 gap-2">
          <span className="flex items-center gap-1.5 text-[11px]">
            ⚠️ Gás GLP
          </span>
          <span className={`font-mono tabular-nums font-bold text-xs flex items-center gap-1 ${hud.closedGasValves >= hud.totalGasValves ? 'text-emerald-400' : 'text-purple-400'}`}>
            {hud.closedGasValves}/{hud.totalGasValves}
            {hud.closedGasValves >= hud.totalGasValves && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />}
          </span>
        </div>
      )}

      {hud.totalElectricPanels > 0 && (
        <div className="flex justify-between items-center text-slate-300 gap-2">
          <span className="flex items-center gap-1.5 text-[11px]">
            ⚡ Quadros
          </span>
          <span className={`font-mono tabular-nums font-bold text-xs flex items-center gap-1 ${hud.cutElectricPanels >= hud.totalElectricPanels ? 'text-emerald-400' : 'text-cyan-400'}`}>
            {hud.cutElectricPanels}/{hud.totalElectricPanels}
            {hud.cutElectricPanels >= hud.totalElectricPanels && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-20 flex flex-col justify-between p-2 sm:p-3 pt-[max(0.5rem,env(safe-area-inset-top))] pb-[max(0.5rem,env(safe-area-inset-bottom))] pl-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))] select-none">

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

          {/* Center: Floor & Timer */}
          <div className="flex items-center gap-1.5 whitespace-nowrap shrink-0">
            <span className="text-[11px] font-black text-orange-400">A{hud.currentFloor}</span>
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
          <div className="self-end w-52 bg-slate-950/95 backdrop-blur-md border border-slate-700/90 rounded-2xl p-3 shadow-2xl pointer-events-auto animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
              <span className="text-[11px] font-bold text-slate-300">Metas ({completedCount}/{totalCount})</span>
              <span className="text-[11px] font-mono tabular-nums font-bold text-amber-400 flex items-center gap-1">
                <Trophy className="w-3 h-3" />
                {hud.score.toLocaleString('pt-BR')}
              </span>
            </div>
            {renderChecklist()}
          </div>
        )}

        {/* Mobile Single-Line Critical Alert Only */}
        {hud.exitUnlocked ? (
          <div className="bg-emerald-600/95 border border-emerald-300 text-white text-[11px] font-black px-3 py-0.5 rounded-full shadow-lg animate-bounce flex items-center gap-1 whitespace-nowrap">
            <Sparkles className="w-3 h-3" />
            <span>SAÍDA LIBERADA!</span>
          </div>
        ) : hud.extinguisher <= 0 ? (
          <div className="bg-red-600/95 border border-amber-300 text-white text-[11px] font-black px-3 py-0.5 rounded-full shadow-lg animate-pulse flex items-center gap-1 whitespace-nowrap">
            <span>🚰</span>
            <span>EXTINTOR VAZIO! RECARREGUE NO HIDRANTE</span>
          </div>
        ) : hud.smokeAlert ? (
          <div className="bg-amber-600/95 border border-amber-200 text-slate-950 text-[11px] font-black px-3 py-0.5 rounded-full shadow-lg animate-pulse flex items-center gap-1 whitespace-nowrap">
            <span>💨</span>
            <span>FUMAÇA TÓXICA! USE O JATO</span>
          </div>
        ) : null}
      </div>

      {/* ================= DESKTOP PERIMETER HUD (md+) ================= */}
      <div className="hidden md:flex items-start justify-between w-full gap-2">
        {/* Left side kept completely clear on desktop */}
        <div />

        {/* Center: Floor Indicator & Timer */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="bg-slate-900/90 border border-orange-500/40 rounded-2xl px-4 py-1.5 shadow-xl flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="text-orange-400 text-xs font-bold uppercase tracking-wider">ANDAR</span>
              <span className="bg-orange-600 text-white font-extrabold text-sm px-2 py-0.5 rounded-lg shadow-sm">
                {hud.currentFloor}/10
              </span>
            </div>

            <div className="h-4 w-px bg-slate-700" />

            <div className={`flex items-center gap-1 font-mono font-bold text-base tabular-nums ${isTimeCritical ? 'text-red-400 animate-pulse' : 'text-slate-100'}`}>
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              <span>{formattedTime}</span>
            </div>
          </div>

          {/* Exit Status Pill */}
          {hud.exitUnlocked ? (
            <div className="bg-emerald-600/95 border-2 border-emerald-300 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-xl animate-bounce flex items-center gap-1.5 pointer-events-auto">
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>SAÍDA LIBERADA! VÁ ATÉ A PORTA!</span>
            </div>
          ) : (
            <div className="text-xs text-slate-300 bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-slate-800 font-medium">
              Cumpra as metas para liberar a escada
            </div>
          )}

          {/* Urgent Empty Tank Alert */}
          {hud.extinguisher <= 0 && (
            <div className="bg-red-600 border-2 border-amber-300 text-white text-xs font-black px-3 py-1 rounded-full shadow-2xl animate-bounce flex items-center gap-1.5 pointer-events-auto">
              <span>🚨</span>
              <span>EXTINTOR VAZIO! Vá ao Hidrante [🚰] e aperte [AÇÃO]!</span>
            </div>
          )}

          {/* Toxic Smoke Exposure Alert */}
          {hud.smokeAlert && hud.extinguisher > 0 && !hud.exitUnlocked && (
            <div className="bg-amber-600/95 border border-amber-300 text-slate-950 text-xs font-black px-2.5 py-1 rounded-full shadow-lg animate-pulse flex items-center gap-1.5 pointer-events-auto">
              <span>💨</span>
              <span>FUMAÇA ESPESSA! Disperse com o Extintor para não sufocar!</span>
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

      {/* Floating prompt action pill (Desktop only; mobile uses the dynamic contextual touch button) */}
      <div className="hidden md:flex justify-center mb-6 pointer-events-auto px-2">
        {hud.promptActionText && (
          <div className="bg-slate-900/95 text-white font-black text-sm px-6 py-2.5 rounded-full shadow-2xl border-2 border-amber-400 animate-bounce flex items-center gap-2 max-w-[94vw] text-center">
            <span className="bg-amber-500 text-slate-950 text-xs px-2 py-0.5 rounded font-mono font-black uppercase shrink-0">
              AÇÃO
            </span>
            <span className="truncate">{hud.promptActionText}</span>
          </div>
        )}
      </div>
    </div>
  );
};
