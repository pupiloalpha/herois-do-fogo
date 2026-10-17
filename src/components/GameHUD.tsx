import React from 'react';
import { GameHUDState } from '../game/types';
import { Heart, Flame, ShieldAlert, Clock, Trophy, Users, Volume2, VolumeX, Pause, Sparkles } from 'lucide-react';
import { sounds } from '../audio/SoundManager';

interface GameHUDProps {
  hud: GameHUDState;
  isMuted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  hud,
  isMuted,
  onToggleMute,
  onPause,
}) => {
  const healthPercent = Math.max(0, Math.min(100, (hud.health / hud.maxHealth) * 100));
  const extPercent = Math.max(0, Math.min(100, (hud.extinguisher / hud.maxExtinguisher) * 100));
  const heatPercent = Math.max(0, Math.min(100, hud.heatMeter));

  const isTimeCritical = hud.timeRemaining <= 20;

  return (
    <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-3 select-none">
      {/* Top perimeter cluster */}
      <div className="flex items-start justify-between w-full gap-2">
        {/* Left: Vitals (Health, Extinguisher, Heat) */}
        <div className="bg-slate-900/85 border border-slate-700/80 rounded-2xl p-2.5 shadow-xl min-w-[210px] max-w-[260px] pointer-events-auto">
          {/* Health */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="flex items-center gap-1.5 text-rose-400">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
                <span>VIDA</span>
              </span>
              <span className="font-mono text-white tabular-nums">{hud.health}/{hud.maxHealth}</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
              <div 
                className={`h-full transition-all duration-150 ${healthPercent < 30 ? 'bg-red-600 animate-pulse' : 'bg-gradient-to-r from-red-500 to-rose-400'}`}
                style={{ width: `${healthPercent}%` }}
              />
            </div>
          </div>

          {/* Extinguisher Pressure */}
          <div className="space-y-1 mt-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="text-xs">🧯</span>
                <span>EXTINTOR</span>
              </span>
              <span className="font-mono text-cyan-200 tabular-nums">{hud.extinguisher}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-cyan-600 to-sky-400 transition-all duration-100"
                style={{ width: `${extPercent}%` }}
              />
            </div>
          </div>

          {/* Heat & Smoke Exposure */}
          <div className="space-y-1 mt-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>CALOR AMBIENTE</span>
              </span>
              <span className={`font-mono tabular-nums ${heatPercent > 75 ? 'text-red-400 font-bold' : 'text-amber-200'}`}>{heatPercent}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div 
                className={`h-full transition-all duration-100 ${heatPercent > 75 ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}
                style={{ width: `${heatPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Center: Floor Indicator & Timer */}
        <div className="flex flex-col items-center gap-1">
          <div className="bg-slate-900/90 border border-orange-500/40 rounded-2xl px-4 py-1.5 shadow-xl flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-orange-400 text-xs font-bold uppercase tracking-wider">ANDAR</span>
              <span className="bg-orange-600 text-white font-extrabold text-sm px-2 py-0.5 rounded-lg shadow-sm">
                {hud.currentFloor} / 10
              </span>
            </div>

            <div className="h-4 w-px bg-slate-700" />

            <div className={`flex items-center gap-1.5 font-mono font-bold text-base tabular-nums ${isTimeCritical ? 'text-red-400 animate-pulse' : 'text-slate-100'}`}>
              <Clock className="w-4 h-4 text-orange-400" />
              <span>{Math.floor(hud.timeRemaining / 60)}:{(hud.timeRemaining % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>

          {/* Exit Status Pill */}
          {hud.exitUnlocked ? (
            <div className="bg-emerald-600/90 border border-emerald-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
              <span>SAÍDA DESBLOQUEADA! VÁ ATÉ A PORTA!</span>
            </div>
          ) : (
            <div className="text-[11px] text-slate-300 bg-slate-900/70 px-2.5 py-0.5 rounded-full border border-slate-800">
              Cumpra as missões do andar para liberar a escada
            </div>
          )}
        </div>

        {/* Right: Score, Missions Checklist & Quick Actions */}
        <div className="flex flex-col items-end gap-2">
          {/* Controls bar */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => {
                sounds.playClick();
                onToggleMute();
              }}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition shadow-md active:scale-95"
              title={isMuted ? 'Ativar Som' : 'Silenciar'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                onPause();
              }}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition shadow-md active:scale-95"
              title="Pausar"
            >
              <Pause className="w-4 h-4" />
            </button>
          </div>

          {/* Score & Objectives panel */}
          <div className="bg-slate-900/85 border border-slate-700/80 rounded-2xl p-2.5 shadow-xl text-right min-w-[190px]">
            <div className="flex items-center justify-end gap-1.5 text-amber-400 text-xs font-bold mb-1">
              <Trophy className="w-3.5 h-3.5" />
              <span className="font-mono text-base font-extrabold text-white tabular-nums">{hud.score.toLocaleString('pt-BR')}</span>
              <span className="text-[10px] text-amber-300">PTS</span>
            </div>

            <div className="space-y-1 text-xs border-t border-slate-800 pt-1.5">
              {hud.totalCivilians > 0 && (
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Users className="w-3 h-3 text-emerald-400" /> Pessoas:
                  </span>
                  <span className={`font-mono font-bold ${hud.rescuedCivilians >= hud.totalCivilians ? 'text-emerald-400' : 'text-slate-100'}`}>
                    {hud.rescuedCivilians}/{hud.totalCivilians}
                  </span>
                </div>
              )}

              {hud.totalPets > 0 && (
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-1 text-[11px]">
                    🐾 Animais:
                  </span>
                  <span className={`font-mono font-bold ${hud.rescuedPets >= hud.totalPets ? 'text-yellow-400' : 'text-slate-100'}`}>
                    {hud.rescuedPets}/{hud.totalPets}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1 text-[11px]">
                  🔥 Focos Fogo:
                </span>
                <span className={`font-mono font-bold ${hud.extinguishedFires >= hud.totalFires ? 'text-emerald-400' : 'text-orange-400'}`}>
                  {hud.extinguishedFires}/{hud.totalFires}
                </span>
              </div>

              {hud.totalGasValves > 0 && (
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-1 text-[11px]">
                    ⚠️ Válvulas Gás:
                  </span>
                  <span className={`font-mono font-bold ${hud.closedGasValves >= hud.totalGasValves ? 'text-emerald-400' : 'text-purple-400'}`}>
                    {hud.closedGasValves}/{hud.totalGasValves}
                  </span>
                </div>
              )}

              {hud.totalElectricPanels > 0 && (
                <div className="flex justify-between items-center text-slate-300">
                  <span className="flex items-center gap-1 text-[11px]">
                    ⚡ Quadros Luz:
                  </span>
                  <span className={`font-mono font-bold ${hud.cutElectricPanels >= hud.totalElectricPanels ? 'text-emerald-400' : 'text-cyan-400'}`}>
                    {hud.cutElectricPanels}/{hud.totalElectricPanels}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Center bottom prompt action pill */}
      <div className="flex justify-center mb-24 md:mb-6">
        {hud.promptActionText && (
          <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-sm px-5 py-2 rounded-full shadow-2xl border-2 border-amber-300/60 animate-bounce flex items-center gap-2">
            <span className="bg-white/20 text-xs px-2 py-0.5 rounded font-mono">E / Toque</span>
            <span>{hud.promptActionText}</span>
          </div>
        )}
      </div>
    </div>
  );
};
