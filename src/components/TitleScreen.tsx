import React, { useEffect } from 'react';
import { CharacterId } from '../game/types';
import { CHARACTERS } from '../game/charactersData';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import { Volume2, VolumeX, Shield, Zap, Heart, Flame, HelpCircle, Play } from 'lucide-react';
import { sounds } from '../audio/SoundManager';

interface TitleScreenProps {
  selectedCharacter: CharacterId;
  onSelectCharacter: (id: CharacterId) => void;
  onStartGame: () => void;
  onOpenInstructions: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  selectedCharacter,
  onSelectCharacter,
  onStartGame,
  onOpenInstructions,
  isMuted,
  onToggleMute,
}) => {
  const current = CHARACTERS[selectedCharacter];

  // Enter or Space to start
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onStartGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onStartGame]);

  return (
    <div className="relative w-full h-full min-h-screen bg-slate-950 text-white flex flex-col justify-between overflow-y-auto overflow-x-hidden p-4 md:p-8 select-none">
      {/* Background illustration / hero art with subtle vignette */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-[2px] scale-105 pointer-events-none"
        style={{ backgroundImage: `url('/banner.jpg')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/90 pointer-events-none" />

      {/* Top Bar: CBMMG Badge & Utilities */}
      <header className="relative z-10 flex items-center justify-between w-full max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <img 
            src="/icon.svg" 
            alt="Brasão CBMMG" 
            className="w-11 h-11 drop-shadow-md rounded-xl"
          />
          <div>
            <span className="text-[10px] md:text-xs font-bold tracking-widest text-amber-400 uppercase block">
              Corpo de Bombeiros Militar de MG
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Operação Resgate Vertical
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <PWAInstallButton />
          
          <button
            onClick={() => {
              sounds.playClick();
              onOpenInstructions();
            }}
            className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition shadow-sm active:scale-95"
            title="Como Jogar"
          >
            <HelpCircle className="w-5 h-5 text-amber-400" />
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              onToggleMute();
            }}
            className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition shadow-sm active:scale-95"
            title={isMuted ? 'Ativar Som' : 'Silenciar'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-emerald-400" />}
          </button>
        </div>
      </header>

      {/* Centerpiece: Title Lockup & Character Selection */}
      <main className="relative z-10 w-full max-w-5xl mx-auto my-auto py-4 flex flex-col items-center text-center">
        {/* Title Lockup */}
        <div className="mb-6 space-y-1">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold tracking-wider uppercase mb-2 animate-pulse">
            <Flame className="w-3.5 h-3.5" /> Edifício em Chamas · 10 Andares
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight uppercase leading-none drop-shadow-2xl">
            <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
              HERÓIS DO FOGO
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto font-medium">
            Escolha seu bombeiro, escale os 10 andares, apague focos de incêndio, feche válvulas de gás, desligue painéis energizados e salve pessoas e animais!
          </p>
        </div>

        {/* Character Selection Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mb-6">
          {/* Foguinho Card */}
          <div
            onClick={() => {
              sounds.playClick();
              onSelectCharacter('foguinho');
            }}
            className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 border-2 text-left relative overflow-hidden ${
              selectedCharacter === 'foguinho'
                ? 'bg-slate-900/90 border-amber-400 shadow-2xl ring-4 ring-amber-400/20 scale-[1.02]'
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
            }`}
          >
            {selectedCharacter === 'foguinho' && (
              <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                SELECIONADO
              </div>
            )}
            <div className="flex gap-4 items-center">
              <img
                src={CHARACTERS.foguinho.avatarUrl}
                alt="Foguinho"
                className="w-24 h-24 rounded-2xl object-cover border-2 border-amber-400/60 shadow-lg"
              />
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  {CHARACTERS.foguinho.gender} · {CHARACTERS.foguinho.role}
                </span>
                <h3 className="text-xl font-black text-white">{CHARACTERS.foguinho.name}</h3>
                <p className="text-xs text-slate-300 line-clamp-2">
                  {CHARACTERS.foguinho.specialTrait}
                </p>
              </div>
            </div>

            {/* Attributes Bars */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-red-400" /> Resistência Térmica:</span>
                <span className="font-bold text-amber-300">135 HP (+45% defesa fogo)</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-amber-400 h-full w-[95%]" />
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-cyan-400" /> Velocidade:</span>
                <span className="font-bold text-slate-200">195 km/h (Firme & Constante)</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-cyan-400 h-full w-[70%]" />
              </div>
            </div>
          </div>

          {/* Faísca Card */}
          <div
            onClick={() => {
              sounds.playClick();
              onSelectCharacter('faisca');
            }}
            className={`cursor-pointer rounded-2xl p-4 transition-all duration-200 border-2 text-left relative overflow-hidden ${
              selectedCharacter === 'faisca'
                ? 'bg-slate-900/90 border-orange-500 shadow-2xl ring-4 ring-orange-500/20 scale-[1.02]'
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
            }`}
          >
            {selectedCharacter === 'faisca' && (
              <div className="absolute top-3 right-3 bg-orange-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                SELECIONADA
              </div>
            )}
            <div className="flex gap-4 items-center">
              <img
                src={CHARACTERS.faisca.avatarUrl}
                alt="Faísca"
                className="w-24 h-24 rounded-2xl object-cover border-2 border-orange-500/60 shadow-lg"
              />
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">
                  {CHARACTERS.faisca.gender} · {CHARACTERS.faisca.role}
                </span>
                <h3 className="text-xl font-black text-white">{CHARACTERS.faisca.name}</h3>
                <p className="text-xs text-slate-300 line-clamp-2">
                  {CHARACTERS.faisca.specialTrait}
                </p>
              </div>
            </div>

            {/* Attributes Bars */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-orange-400" /> Velocidade:</span>
                <span className="font-bold text-orange-300">255 km/h (+31% Ágil)</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-orange-500 h-full w-[95%]" />
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-red-400" /> Resistência:</span>
                <span className="font-bold text-slate-200">100 HP (Resgate Rápido)</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div className="bg-red-400 h-full w-[75%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Start Game CTA Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onStartGame();
          }}
          className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 bg-size-200 text-slate-950 font-black text-lg md:text-xl shadow-2xl hover:shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <Play className="w-6 h-6 fill-slate-950 text-slate-950" />
          <span>INICIAR MISSÃO COM {current.name.toUpperCase()}</span>
        </button>

        {/* Control hint line */}
        <div className="mt-4 text-xs text-slate-400 font-mono tracking-wide">
          <span className="hidden md:inline">WASD Mover · Espaço Extintor · E Interagir/Salvar · Shift Correr · Enter Iniciar</span>
          <span className="md:hidden">Controles por Joystick e Botões de Toque na Tela</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-900">
        <span>Edição Oficial · Baseado no Corpo de Bombeiros Militar de Minas Gerais</span>
        <span>PWA Offline Suportado · 60 FPS Phaser.js</span>
      </footer>
    </div>
  );
};
