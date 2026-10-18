import React, { useState } from 'react';
import { GameHUDState } from '../game/types';
import { Heart, Flame, Clock, Trophy, Users, Volume2, VolumeX, Pause, Sparkles, ChevronDown, ChevronUp, Maximize, Minimize, CheckCircle2 } from 'lucide-react';
import { sounds } from '../audio/SoundManager';

interface GameHUDProps {
  hud: GameHUDState;
  isMuted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

// Reusable Vitals component for both mobile (left) and desktop (right alongside missions)
const VitalsPanel: React.FC<{
  hud: GameHUDState;
  healthPercent: number;
  extPercent: number;
  heatPercent: number;
  className?: string;
  isCompact?: boolean;
}> = ({ hud, healthPercent, extPercent, heatPercent, className = '', isCompact = false }) => (
  <div className={`bg-slate-900/90 border border-slate-700/80 rounded-2xl p-2 sm:p-2.5 shadow-xl pointer-events-auto ${className}`}>
    {!isCompact && (
      <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-between border-b border-slate-800 pb-0.5">
        <span>Dados Operacionais</span>
        <span className="text-[9px] text-orange-400 font-mono">BOMBEIRO</span>
      </div>
    )}

    {/* Health (Vida) */}
    <div className="space-y-0.5 sm:space-y-1">
      <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold">
        <span className="flex items-center gap-1 text-rose-400">
          <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
          <span>VIDA</span>
        </span>
        <span className="font-mono text-white tabular-nums text-[10px] sm:text-xs">{hud.health}/{hud.maxHealth}</span>
      </div>
      <div className="w-full bg-slate-950 rounded-full h-1.5 sm:h-2 overflow-hidden border border-slate-800">
        <div 
          className={`h-full transition-all duration-150 ${healthPercent < 30 ? 'bg-red-600 animate-pulse' : 'bg-gradient-to-r from-red-500 to-rose-400'}`}
          style={{ width: `${healthPercent}%` }}
        />
      </div>
    </div>

    {/* Extinguisher Pressure & Hydrant Refill Alert (Água) */}
    <div className="space-y-0.5 sm:space-y-1 mt-1 sm:mt-1.5">
      <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold">
        <span className="flex items-center gap-1 text-cyan-400">
          <span className="text-[10px]">🧯</span>
          <span>ÁGUA</span>
        </span>
        <span className={`font-mono tabular-nums text-[10px] sm:text-xs ${hud.extinguisher <= 15 ? 'text-red-400 font-bold animate-pulse' : 'text-cyan-200'}`}>
          {hud.extinguisher}%
        </span>
      </div>
      <div className="w-full bg-slate-950 rounded-full h-1.5 sm:h-2 overflow-hidden border border-slate-800">
        <div 
          className={`h-full transition-all duration-100 ${hud.extinguisher <= 15 ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-cyan-600 to-sky-400'}`}
          style={{ width: `${extPercent}%` }}
        />
      </div>
      {hud.extinguisher <= 15 && (
        <div className="text-[9px] sm:text-[10px] text-amber-200 font-black bg-red-950/90 border border-red-500/80 rounded px-1.5 py-0.5 animate-pulse mt-0.5 flex items-center gap-1 leading-tight">
          <span>🚰</span>
          <span>Recarregue no Hidrante!</span>
        </div>
      )}
    </div>

    {/* Heat & Smoke Exposure (Dano / Fumaça) */}
    <div className="space-y-0.5 sm:space-y-1 mt-1 sm:mt-1.5">
      <div className="flex justify-between items-center text-[10px] sm:text-xs font-bold">
        <span className="flex items-center gap-1 text-amber-400">
          <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500" />
          <span>FUMAÇA / CALOR</span>
        </span>
        <span className={`font-mono tabular-nums text-[10px] sm:text-xs ${heatPercent > 70 ? 'text-red-400 font-bold' : 'text-amber-200'}`}>{heatPercent}%</span>
      </div>
      <div className="w-full bg-slate-950 rounded-full h-1.5 sm:h-2 overflow-hidden border border-slate-800">
        <div 
          className={`h-full transition-all duration-100 ${heatPercent > 70 ? 'bg-red-600 animate-pulse' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}
          style={{ width: `${heatPercent}%` }}
        />
      </div>
      {heatPercent >= 70 && (
        <div className="text-[8px] sm:text-[10px] text-red-300 font-extrabold bg-red-950/90 border border-red-500 rounded px-1.5 py-0.5 animate-pulse mt-0.5 flex items-center gap-1 leading-tight">
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
    <div className="space-y-1 text-xs">
      {hud.totalCivilians > 0 && (
        <div className="flex justify-between items-center text-slate-300 gap-2">
          <span className="flex items-center gap-1 text-[10px] sm:text-[11px]">
            <Users className="w-3 h-3 text-emerald-400" /> Pessoas:
          </span>
          <span className={`font-mono font-bold text-[10px] sm:text-xs flex items-center gap-1 ${hud.rescuedCivilians >= hud.totalCivilians ? 'text-emerald-400' : 'text-slate-100'}`}>
            {hud.rescuedCivilians}/{hud.totalCivilians}
            {hud.rescuedCivilians >= hud.totalCivilians && <CheckCircle2 className="w-3 h-3 text-emerald-400 inline" />}
          </span>
        </div>
      )}

      {hud.totalPets > 0 && (
        <div className="flex justify-between items-center text-slate-300 gap-2">
          <span className="flex items-center gap-1 text-[10px] sm:text-[11px]">
            🐾 Animais:
          </span>
          <span className={`font-mono font-bold text-[10px] sm:text-xs flex items-center gap-1 ${hud.rescuedPets >= hud.totalPets ? 'text-yellow-400' : 'text-slate-100'}`}>
            {hud.rescuedPets}/{hud.totalPets}
            {hud.rescuedPets >= hud.totalPets && <CheckCircle2 className="w-3 h-3 text-emerald-400 inline" />}
          </span>
        </div>
      )}

      <div className="flex justify-between items-center text-slate-300 gap-2">
        <span className="flex items-center gap-1 text-[10px] sm:text-[11px]">
          🔥 Focos Fogo:
        </span>
        <span className={`font-mono font-bold text-[10px] sm:text-xs flex items-center gap-1 ${hud.extinguishedFires >= hud.totalFires ? 'text-emerald-400' : 'text-orange-400'}`}>
          {hud.extinguishedFires}/{hud.totalFires}
          {hud.extinguishedFires >= hud.totalFires && <CheckCircle2 className="w-3 h-3 text-emerald-400 inline" />}
        </span>
      </div>

      {hud.totalGasValves > 0 && (
        <div className="flex justify-between items-center text-slate-300 gap-2">
          <span className="flex items-center gap-1 text-[10px] sm:text-[11px]">
            ⚠️ Gás GLP:
          </span>
          <span className={`font-mono font-bold text-[10px] sm:text-xs flex items-center gap-1 ${hud.closedGasValves >= hud.totalGasValves ? 'text-emerald-400' : 'text-purple-400'}`}>
            {hud.closedGasValves}/{hud.totalGasValves}
            {hud.closedGasValves >= hud.totalGasValves && <CheckCircle2 className="w-3 h-3 text-emerald-400 inline" />}
          </span>
        </div>
      )}

      {hud.totalElectricPanels > 0 && (
        <div className="flex justify-between items-center text-slate-300 gap-2">
          <span className="flex items-center gap-1 text-[10px] sm:text-[11px]">
            ⚡ Quadros:
          </span>
          <span className={`font-mono font-bold text-[10px] sm:text-xs flex items-center gap-1 ${hud.cutElectricPanels >= hud.totalElectricPanels ? 'text-emerald-400' : 'text-cyan-400'}`}>
            {hud.cutElectricPanels}/{hud.totalElectricPanels}
            {hud.cutElectricPanels >= hud.totalElectricPanels && <CheckCircle2 className="w-3 h-3 text-emerald-400 inline" />}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-20 flex flex-col justify-between p-2 sm:p-3 pt-[max(0.6rem,env(safe-area-inset-top))] pb-[max(0.6rem,env(safe-area-inset-bottom))] pl-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))] select-none">
      {/* Top perimeter cluster */}
      <div className="flex items-start justify-between w-full gap-1.5 sm:gap-2">
        {/* Left Side:
            - Mobile (< md): shows compact Vitals panel
            - Computer/Desktop (md+): Left side is COMPLETELY CLEAR to avoid overlaying game objects! */}
        <div className="md:hidden">
          <VitalsPanel
            hud={hud}
            healthPercent={healthPercent}
            extPercent={extPercent}
            heatPercent={heatPercent}
            className="w-[125px] sm:w-[140px] shrink-0"
            isCompact={true}
          />
        </div>

        {/* Center: Floor Indicator & Timer */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="bg-slate-900/90 border border-orange-500/40 rounded-xl sm:rounded-2xl px-2.5 sm:px-4 py-1 sm:py-1.5 shadow-xl flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1">
              <span className="text-orange-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider">ANDAR</span>
              <span className="bg-orange-600 text-white font-extrabold text-xs sm:text-sm px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg shadow-sm">
                {hud.currentFloor}/10
              </span>
            </div>

            <div className="h-3 sm:h-4 w-px bg-slate-700" />

            <div className={`flex items-center gap-1 font-mono font-bold text-xs sm:text-base tabular-nums ${isTimeCritical ? 'text-red-400 animate-pulse' : 'text-slate-100'}`}>
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              <span>{Math.floor(hud.timeRemaining / 60)}:{(hud.timeRemaining % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>

          {/* Exit Status Pill */}
          {hud.exitUnlocked ? (
            <div className="bg-emerald-600/95 border-2 border-emerald-300 text-white text-[11px] sm:text-xs font-black px-3 py-1 sm:py-1.5 rounded-full shadow-xl animate-bounce flex items-center gap-1.5 pointer-events-auto">
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>SAÍDA LIBERADA! VÁ ATÉ A PORTA!</span>
            </div>
          ) : (
            <div className="text-[10px] sm:text-xs text-slate-300 bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-slate-800 hidden sm:block font-medium">
              Cumpra as metas para liberar a escada
            </div>
          )}

          {/* Urgent Empty Tank Alert */}
          {hud.extinguisher <= 0 && (
            <div className="bg-red-600 border-2 border-amber-300 text-white text-[10px] sm:text-xs font-black px-3 py-1 rounded-full shadow-2xl animate-bounce flex items-center gap-1.5 pointer-events-auto">
              <span>🚨</span>
              <span>EXTINTOR VAZIO! Vá ao Hidrante [🚰] e aperte [AÇÃO]!</span>
            </div>
          )}

          {/* Toxic Smoke Exposure Alert */}
          {hud.smokeAlert && hud.extinguisher > 0 && !hud.exitUnlocked && (
            <div className="bg-amber-600/95 border border-amber-300 text-slate-950 text-[10px] sm:text-xs font-black px-2.5 py-0.5 sm:py-1 rounded-full shadow-lg animate-pulse flex items-center gap-1.5 pointer-events-auto">
              <span>💨</span>
              <span>FUMAÇA ESPESSA! Disperse com o Extintor para não sufocar!</span>
            </div>
          )}
        </div>

        {/* Right Side:
            - Controls bar (Fullscreen, Mute, Pause) + Score
            - On Desktop (md+): Vitals Panel (Vida, Água, Dano) is placed right here alongside Metas da Fase!
            - On Mobile (< md): Metas da fase with dropdown toggle button */}
        <div className="flex flex-col items-end gap-1.5 sm:gap-2 shrink-0">
          {/* Controls & Score bar */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Score */}
            <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl px-2.5 py-1 shadow-md flex items-center gap-1.5 text-amber-400">
              <Trophy className="w-3.5 h-3.5" />
              <span className="font-mono text-xs sm:text-sm font-extrabold text-white tabular-nums">{hud.score.toLocaleString('pt-BR')}</span>
            </div>

            {/* Quick buttons */}
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

          {/* Desktop Layout: Vitals Panel AND Metas Panel side-by-side on the Right */}
          <div className="hidden md:flex flex-row items-start gap-2 pointer-events-auto">
            {/* Panel 1: Vida, Água, Dano / Fumaça */}
            <VitalsPanel
              hud={hud}
              healthPercent={healthPercent}
              extPercent={extPercent}
              heatPercent={heatPercent}
              className="w-[200px] lg:w-[220px]"
              isCompact={false}
            />

            {/* Panel 2: Metas da Fase (Checklist) */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-2.5 shadow-xl w-[190px] lg:w-[210px]">
              <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between border-b border-slate-800 pb-0.5">
                <span>Metas da Fase</span>
                <span className="text-[10px] text-amber-400 font-mono font-bold">({completedCount}/{totalCount})</span>
              </div>
              {renderChecklist()}
            </div>
          </div>

          {/* Mobile Layout (< md): Collapsible Objectives Box */}
          <div className="md:hidden bg-slate-900/90 border border-slate-700/80 rounded-xl p-1.5 shadow-xl pointer-events-auto w-[130px]">
            <button
              onClick={() => setShowMobileMissions(!showMobileMissions)}
              className="flex items-center justify-between text-[10px] font-bold text-orange-400 bg-slate-950/80 px-2 py-0.5 rounded-lg border border-slate-800 w-full"
            >
              <span>Metas ({completedCount}/{totalCount})</span>
              {showMobileMissions ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {showMobileMissions && (
              <div className="mt-1.5 border-t border-slate-800 pt-1">
                {renderChecklist()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating prompt action pill (positioned safely above joystick & action buttons) */}
      <div className="flex justify-center mb-28 sm:mb-24 md:mb-6 pointer-events-auto px-2">
        {hud.promptActionText && (
          <div className="bg-slate-900/95 text-white font-black text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-2.5 rounded-full shadow-2xl border-2 border-amber-400 animate-bounce flex items-center gap-2 max-w-[94vw] text-center">
            <span className="bg-amber-500 text-slate-950 text-[10px] sm:text-xs px-2 py-0.5 rounded font-mono font-black uppercase shrink-0">
              AÇÃO
            </span>
            <span className="truncate">{hud.promptActionText}</span>
          </div>
        )}
      </div>
    </div>
  );
};
