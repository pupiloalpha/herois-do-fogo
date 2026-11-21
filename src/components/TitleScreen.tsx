import React, { useState } from 'react';
import { CharacterId } from '../game/types';
import { CHARACTERS } from '../game/charactersData';
import { MISSIONS_CATALOG } from '../hub/missionsCatalog';
import {
  getCareerRank,
  getMissionProgressSummary,
  getTotalHubStars,
} from '../hub/hubProgress';
import { HubSaveState, MissionCatalogEntry, MissionId } from '../hub/types';
import { PWAInstallButton } from '../pwa/PWAInstallButton';
import {
  Volume2,
  VolumeX,
  HelpCircle,
  Play,
  Maximize,
  Minimize,
  Star,
  ListChecks,
  Check,
  ChevronRight,
  Flame,
  Sparkles,
  X,
} from 'lucide-react';
import { sounds } from '../audio/SoundManager';
import { FullscreenGuideModal } from './FullscreenGuideModal';
import { StageSelectModal } from './StageSelectModal';
import { CareerModal } from './CareerModal';
import { MissionPreviewModal } from './MissionPreviewModal';

interface TitleScreenProps {
  saveState: HubSaveState;
  onSelectCharacter: (id: CharacterId) => void;
  onLaunchMissionStage: (missionId: MissionId, stageNumber: number) => void;
  onOpenInstructions: () => void;
  onResetProgress: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  isStandalone?: boolean;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  saveState,
  onSelectCharacter,
  onLaunchMissionStage,
  onOpenInstructions,
  onResetProgress,
  isMuted,
  onToggleMute,
  isFullscreen = false,
  onToggleFullscreen,
  isStandalone = false,
}) => {
  const [showGuide, setShowGuide] = useState(false);
  const [showCareer, setShowCareer] = useState(false);
  const [stageSelectMission, setStageSelectMission] = useState<MissionCatalogEntry | null>(null);
  const [previewMission, setPreviewMission] = useState<MissionCatalogEntry | null>(null);
  const [mobileMissionId, setMobileMissionId] = useState<MissionId>('vertical_10');
  const [hideTip, setHideTip] = useState(false);

  const selectedCharacter = saveState.selectedCharacter;
  const totalStars = getTotalHubStars(saveState);
  const careerRank = getCareerRank(totalStars.earned);

  const activeMobileMission =
    MISSIONS_CATALOG.find((m) => m.id === mobileMissionId) || MISSIONS_CATALOG[0];

  return (
    <div className="relative w-full h-full min-h-[100dvh] bg-gradient-to-b from-sky-950 via-slate-900 to-slate-950 text-white flex flex-col justify-between overflow-y-auto overscroll-contain select-none">
      {/* 1. VIBRANT, CHEERFUL BANNER BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute inset-0 bg-cover bg-center filter brightness-100 contrast-105 opacity-90 sm:opacity-95"
          style={{ backgroundImage: `url('/banner.jpg')` }}
        />
        {/* Soft, warm daylight overlay (keeps banner artwork bright and clear) */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-amber-950/20 to-slate-950/40" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(circle at 50% 15%, rgba(251, 191, 36, 0.45) 0%, transparent 65%)',
          }}
        />
      </div>

      {/* 2. TOP BAR HUD (Ultra-Clean on Mobile) */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-3 sm:px-6 pt-2.5 sm:pt-4 pb-1 flex items-center justify-between gap-1.5 sm:gap-2 shrink-0">
        {/* CBMMG Official Seal */}
        <div className="flex items-center gap-2 min-w-0">
          <img
            src="/assets/aistudio/LogoCorpoDeBombeiros_57dfdd49.png"
            alt="Brasão CBMMG"
            className="w-9 h-9 sm:w-11 sm:h-11 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)] rounded-full object-contain shrink-0"
          />
          <div className="min-w-0 leading-tight">
            <span className="text-[10px] sm:text-xs font-black tracking-wider text-amber-300 uppercase block truncate drop-shadow">
              CBMMG
            </span>
            <span className="text-xs sm:text-sm font-black text-white tracking-wide block truncate drop-shadow-md">
              Heróis do Fogo
            </span>
          </div>
        </div>

        {/* Clean Header Actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Trophy & Stars Pill */}
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setShowCareer(true);
            }}
            className="h-8 sm:h-10 px-2 sm:px-3 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 text-slate-950 font-black text-xs flex items-center gap-1 shadow-md border border-yellow-200 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
            title="Conquistas e Medalhas"
          >
            <span className="text-sm sm:text-base">{careerRank.current.insignia}</span>
            <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
            <span className="font-mono font-black text-xs sm:text-sm">{totalStars.earned}/{totalStars.max}</span>
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Fullscreen Button */}
          {onToggleFullscreen && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onToggleFullscreen();
              }}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-amber-500/25 hover:bg-amber-500/40 border border-amber-400/60 text-amber-300 hover:text-white transition shadow-sm active:scale-95 flex items-center justify-center shrink-0 cursor-pointer backdrop-blur-sm"
              title={isFullscreen ? 'Sair da Tela Cheia' : 'Jogar em Tela Cheia'}
              aria-label="Tela Cheia"
            >
              {isFullscreen ? <Minimize className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Maximize className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </button>
          )}

          {/* Help Button */}
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onOpenInstructions();
            }}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-amber-500/25 hover:bg-amber-500/40 border border-amber-400/60 text-amber-300 hover:text-white transition shadow-sm active:scale-95 flex items-center justify-center shrink-0 cursor-pointer backdrop-blur-sm"
            title="Como Jogar"
            aria-label="Como jogar"
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" />
          </button>

          {/* Audio Button */}
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onToggleMute();
            }}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl border transition shadow-sm active:scale-95 flex items-center justify-center shrink-0 cursor-pointer backdrop-blur-sm ${
              isMuted
                ? 'bg-rose-500/30 border-rose-400/80 text-rose-300'
                : 'bg-emerald-500/30 border-emerald-400/80 text-emerald-300'
            }`}
            title={isMuted ? 'Ligar Som' : 'Silenciar'}
            aria-label={isMuted ? 'Ligar Som' : 'Silenciar'}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
        </div>
      </header>

      {/* Discrete, Dismissible Tip for Mobile/Tablet */}
      {!isStandalone && !hideTip && (
        <div className="relative z-10 w-full max-w-5xl mx-auto px-3 sm:px-6 my-0.5">
          <div className="bg-amber-500/20 border border-amber-400/50 rounded-xl px-2.5 py-1 flex items-center justify-between gap-1.5 backdrop-blur-md text-[11px] text-amber-100 shadow-sm">
            <span className="truncate">
              📱 Dica: Jogue em <strong>Tela Cheia</strong> para esconder barras do celular!
            </span>
            <div className="flex items-center gap-1 shrink-0">
              {onToggleFullscreen && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onToggleFullscreen();
                  }}
                  className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[10px] active:scale-95"
                >
                  Tela Cheia
                </button>
              )}
              <button
                type="button"
                onClick={() => setHideTip(true)}
                className="p-0.5 text-amber-200 hover:text-white"
                title="Fechar dica"
                aria-label="Fechar dica"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN GAME ARENA */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-3 sm:px-6 py-1 sm:py-2 my-auto flex flex-col gap-3 sm:gap-5">
        {/* Title Section (Compact on mobile) */}
        <section className="text-center space-y-0.5 sm:space-y-1">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:py-1 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-slate-950 text-[10px] sm:text-xs font-black tracking-wider uppercase shadow-md border border-yellow-300">
            <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-slate-950 text-slate-950" />
            <span>Jogo Oficial CBMMG</span>
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-slate-950 text-slate-950" />
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none uppercase drop-shadow-xl">
            <span className="bg-gradient-to-b from-yellow-200 via-amber-300 to-orange-500 bg-clip-text text-transparent text-glow-fire">
              HERÓIS DO FOGO
            </span>
          </h1>

          <p className="text-amber-100 text-[11px] sm:text-sm font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] max-w-md mx-auto hidden sm:block">
            Apague o fogo, resgate seus amigos e divirta-se salvando vidas!
          </p>
        </section>

        {/* 4. CLEAN HERO SELECTOR (Large Avatar Buttons, Zero Clutter) */}
        <section aria-labelledby="hero-choice-heading" className="space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-amber-300 drop-shadow">
            <h2 id="hero-choice-heading" className="flex items-center gap-1 text-[11px] sm:text-xs">
              <span>🚒</span>
              <span>Escolha Seu Bombeiro:</span>
            </h2>
            <span className="text-[10px] sm:text-[11px] text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/40">
              Pronto: <strong>{CHARACTERS[selectedCharacter].name}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            {(['foguinho', 'faisca'] as CharacterId[]).map((charId) => {
              const char = CHARACTERS[charId];
              const isSelected = selectedCharacter === charId;
              const isFoguinho = charId === 'foguinho';

              return (
                <button
                  key={charId}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onSelectCharacter(charId);
                  }}
                  className={`relative p-2 sm:p-3 rounded-2xl sm:rounded-3xl border-2 sm:border-3 text-left transition-all duration-150 flex items-center gap-2 sm:gap-3.5 backdrop-blur-md cursor-pointer ${
                    isSelected
                      ? isFoguinho
                        ? 'bg-amber-950/80 border-amber-400 ring-2 sm:ring-4 ring-amber-400/40 box-glow-amber scale-[1.01]'
                        : 'bg-orange-950/80 border-orange-400 ring-2 sm:ring-4 ring-orange-400/40 box-glow-orange scale-[1.01]'
                      : 'bg-slate-900/60 border-slate-700/80 hover:border-amber-400/50 opacity-80 hover:opacity-100'
                  }`}
                >
                  {/* Selected Tag Badge */}
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-0.5 shadow-sm border border-yellow-200">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                      <span>Ativo</span>
                    </div>
                  )}

                  {/* Character Avatar */}
                  <div className="relative shrink-0">
                    <img
                      src={char.avatarUrl}
                      alt={char.name}
                      className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl object-cover border-2 shadow-md ${
                        isSelected
                          ? isFoguinho
                            ? 'border-amber-400 ring-1 sm:ring-2 ring-amber-300'
                            : 'border-orange-400 ring-1 sm:ring-2 ring-orange-300'
                          : 'border-slate-500'
                      }`}
                    />
                    <span className="absolute -bottom-1 -right-1 text-xs sm:text-sm drop-shadow">
                      {isFoguinho ? '🛡️' : '⚡'}
                    </span>
                  </div>

                  {/* Character Quick Info */}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm sm:text-lg font-black text-white leading-tight drop-shadow truncate">
                      {char.name}
                    </h3>
                    <p className={`text-[10px] sm:text-xs font-black uppercase truncate ${isFoguinho ? 'text-amber-300' : 'text-orange-300'}`}>
                      {isFoguinho ? '🛡️ O Forte do Fogo' : '⚡ A Veloz do Resgate'}
                    </p>
                    <p className="text-[9px] sm:text-xs text-amber-100/90 font-medium line-clamp-1 hidden sm:block">
                      {isFoguinho ? 'Resiste a calor e chamas' : 'Ágil para salvar pessoas'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 5. MISSIONS SHOWCASE (Segmented Switcher on Mobile, 3-Columns on Desktop) */}
        <section aria-labelledby="missions-heading" className="space-y-2">
          {/* Mobile Tabbed Switcher (Shown ONLY on Mobile < md) */}
          <div className="md:hidden space-y-1.5">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-amber-300 drop-shadow">
              <h2 id="missions-heading-mobile" className="flex items-center gap-1 text-[11px]">
                <span>🎯</span>
                <span>Escolha a Missão:</span>
              </h2>
              <span className="text-[10px] text-amber-200">⭐ Progresso Salvo</span>
            </div>

            {/* Segmented Pills for Fast Switching */}
            <div className="grid grid-cols-3 gap-1 bg-slate-900/80 p-1 rounded-2xl border border-amber-400/40 backdrop-blur-md">
              {MISSIONS_CATALOG.map((m) => {
                const isActive = mobileMissionId === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setMobileMissionId(m.id);
                    }}
                    className={`py-1.5 px-1 rounded-xl text-[11px] font-black flex items-center justify-center gap-1 transition-all cursor-pointer truncate ${
                      isActive
                        ? m.accent === 'orange'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-black'
                          : m.accent === 'emerald'
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md font-black'
                            : 'bg-gradient-to-r from-sky-500 to-blue-500 text-slate-950 shadow-md font-black'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>{m.badgeEmoji}</span>
                    <span className="truncate">{m.title.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Single Clean Active Mission Card for Mobile */}
            {(() => {
              const mission = activeMobileMission;
              const summary = getMissionProgressSummary(saveState, mission.id);
              const isPlayable = mission.status === 'playable';
              const isVertical = mission.id === 'vertical_10';
              const isForest = mission.id === 'forest_fire';

              const cardBorder = isVertical
                ? 'border-amber-400/80 bg-gradient-to-b from-amber-950/85 to-slate-900/90 box-glow-amber'
                : isForest
                  ? 'border-emerald-400/80 bg-gradient-to-b from-emerald-950/85 to-slate-900/90 box-glow-emerald'
                  : 'border-sky-400/80 bg-gradient-to-b from-sky-950/85 to-slate-900/90 box-glow-sky';

              const btnClass = isVertical
                ? 'btn-chunky-orange text-white'
                : isForest
                  ? 'btn-chunky-emerald text-white'
                  : 'btn-chunky-cyan text-white';

              const primaryCtaLabel =
                summary.completedStages >= summary.totalStages
                  ? 'Jogar Novamente'
                  : summary.completedStages > 0
                    ? `Jogar · ${mission.stageTermSingular} ${summary.nextStageToPlay}`
                    : `Iniciar ${mission.stageTermSingular} 1`;

              return (
                <div className={`rounded-2xl border-2 p-3 shadow-xl backdrop-blur-md space-y-2.5 ${cardBorder}`}>
                  <div className="flex items-center justify-between gap-1.5">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 block">
                        {mission.subtitle}
                      </span>
                      <h3 className="text-base font-black text-white leading-tight flex items-center gap-1.5">
                        <span>{mission.badgeEmoji}</span>
                        <span>{mission.title}</span>
                      </h3>
                    </div>
                    {isPlayable ? (
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                        Disponível
                      </span>
                    ) : (
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-sky-500 text-slate-950">
                        Em Breve
                      </span>
                    )}
                  </div>

                  {isPlayable ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-black text-amber-200">
                        <span>
                          {summary.completedStages}/{summary.totalStages} {mission.stageTermPlural.toLowerCase()}
                        </span>
                        <span className="flex items-center gap-1 text-yellow-300 font-mono font-black">
                          <Star className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
                          {summary.earnedStars}/{summary.maxStars}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          onLaunchMissionStage(mission.id, summary.nextStageToPlay);
                        }}
                        className={`w-full h-11 rounded-xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer ${btnClass}`}
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>{primaryCtaLabel}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          sounds.playClick();
                          setStageSelectMission(mission);
                        }}
                        className="w-full h-8 rounded-lg bg-slate-900/80 border border-slate-700 text-[11px] font-bold text-amber-200 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <ListChecks className="w-3 h-3 text-amber-300" />
                        <span>Escolher {mission.stageTermSingular} (1–{mission.totalStages})</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playClick();
                        setPreviewMission(mission);
                      }}
                      className="w-full h-10 rounded-xl bg-sky-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <span>Ver Prévia da Missão</span>
                      <ChevronRight className="w-4 h-4 stroke-[3]" />
                    </button>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Desktop & Tablet 3-Columns Grid (Hidden on Mobile) */}
          <div className="hidden md:block space-y-2">
            <div className="flex items-center justify-between">
              <h2 id="missions-heading" className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5 drop-shadow">
                <span>🎯</span>
                <span>Escolha a Operação:</span>
              </h2>
              <span className="text-[11px] font-semibold text-amber-200 drop-shadow">
                Seu progresso fica salvo automaticamente ⭐
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 items-stretch">
              {MISSIONS_CATALOG.map((mission) => {
                const summary = getMissionProgressSummary(saveState, mission.id);
                const isPlayable = mission.status === 'playable';

                const isVertical = mission.id === 'vertical_10';
                const isForest = mission.id === 'forest_fire';

                const cardBorder = isVertical
                  ? 'border-amber-400/80 bg-gradient-to-b from-amber-950/80 via-slate-900/85 to-orange-950/70 hover:border-amber-300 box-glow-amber'
                  : isForest
                    ? 'border-emerald-400/80 bg-gradient-to-b from-emerald-950/80 via-slate-900/85 to-teal-950/70 hover:border-emerald-300 box-glow-emerald'
                    : 'border-sky-400/80 bg-gradient-to-b from-sky-950/80 via-slate-900/85 to-blue-950/70 box-glow-sky';

                const primaryCtaLabel =
                  summary.completedStages >= summary.totalStages
                    ? 'Jogar Novamente'
                    : summary.completedStages > 0
                      ? `Jogar · ${mission.stageTermSingular} ${summary.nextStageToPlay}`
                      : `Iniciar ${mission.stageTermSingular} 1`;

                const btnChunkyClass = isVertical
                  ? 'btn-chunky-orange text-white'
                  : isForest
                    ? 'btn-chunky-emerald text-white'
                    : 'btn-chunky-cyan text-white';

                return (
                  <article
                    key={mission.id}
                    className={`rounded-3xl border-3 p-4 flex flex-col justify-between gap-3 shadow-2xl backdrop-blur-md transition-all duration-150 hover:-translate-y-1 ${cardBorder}`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className={`text-xs font-black uppercase tracking-wider ${
                          isVertical ? 'text-amber-300' : isForest ? 'text-emerald-300' : 'text-sky-300'
                        }`}>
                          {isVertical ? 'Missão 1 · Combate' : isForest ? 'Missão 2 · Floresta' : 'Missão 3 · Água'}
                        </span>
                        {isPlayable ? (
                          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                            Disponível
                          </span>
                        ) : (
                          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-sky-500 text-slate-950">
                            Em Breve
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-black text-white leading-tight flex items-center gap-1.5 drop-shadow">
                        <span>{mission.badgeEmoji}</span>
                        <span className="truncate">{mission.title}</span>
                      </h3>

                      <p className="text-xs text-amber-50/90 font-medium leading-snug line-clamp-2">
                        {isVertical && 'Suba os 10 andares apagando o fogo, feche válvulas de gás e evacue todos!'}
                        {isForest && 'Contenha queimadas no parque estadual, use bomba costal e salve animais silvestres!'}
                        {mission.id === 'flood_rescue' && 'Pilote bote e helicóptero com guincho para resgatar pessoas em áreas alagadas!'}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/10">
                      {isPlayable ? (
                        <>
                          <div className="flex items-center justify-between text-xs font-black text-amber-200">
                            <span>
                              {summary.completedStages}/{summary.totalStages} {mission.stageTermPlural.toLowerCase()}
                            </span>
                            <span className="flex items-center gap-1 text-yellow-300 font-mono font-black drop-shadow">
                              <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                              {summary.earnedStars}/{summary.maxStars}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              sounds.playClick();
                              onLaunchMissionStage(mission.id, summary.nextStageToPlay);
                            }}
                            className={`w-full h-12 rounded-2xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer ${btnChunkyClass}`}
                          >
                            <Play className="w-5 h-5 fill-white" />
                            <span>{primaryCtaLabel}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              sounds.playClick();
                              setStageSelectMission(mission);
                            }}
                            className="w-full h-9 rounded-xl bg-slate-900/80 hover:bg-slate-800 border-2 border-slate-700 text-xs font-bold text-amber-200 flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                          >
                            <ListChecks className="w-3.5 h-3.5 text-amber-300" />
                            <span>Escolher {mission.stageTermSingular} (1–{mission.totalStages})</span>
                          </button>
                        </>
                      ) : (
                        <div className="space-y-2 pt-1">
                          <div className="flex items-center justify-between text-xs text-sky-200 font-bold">
                            <span>10 Setores planejados</span>
                            <span className="font-black text-sky-300">Em Desenvolvimento</span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              sounds.playClick();
                              setPreviewMission(mission);
                            }}
                            className="w-full h-11 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow-md"
                          >
                            <span>Ver Prévia da Missão</span>
                            <ChevronRight className="w-4 h-4 stroke-[3]" />
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* 6. CLEAN FOOTER */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-[11px] text-amber-100/90 border-t border-amber-500/20 gap-0.5 text-center shrink-0">
        <span className="font-bold text-amber-200">
          Corpo de Bombeiros Militar de Minas Gerais (CBMMG)
        </span>
        <span className="font-medium text-amber-300/80">
          Jogo Educativo PWA · Celular, Tablet e Computador
        </span>
      </footer>

      {/* MODALS */}
      {showGuide && (
        <FullscreenGuideModal
          onClose={() => setShowGuide(false)}
          onEnterFullscreen={onToggleFullscreen}
          isFullscreen={isFullscreen}
        />
      )}

      {showCareer && (
        <CareerModal
          saveState={saveState}
          onResetProgress={onResetProgress}
          onClose={() => setShowCareer(false)}
        />
      )}

      {stageSelectMission && (
        <StageSelectModal
          mission={stageSelectMission}
          progress={saveState.missions[stageSelectMission.id]}
          onSelectStage={(stageNum) => {
            const targetMissionId = stageSelectMission.id;
            setStageSelectMission(null);
            onLaunchMissionStage(targetMissionId, stageNum);
          }}
          onClose={() => setStageSelectMission(null)}
        />
      )}

      {previewMission && (
        <MissionPreviewModal
          mission={previewMission}
          onClose={() => setPreviewMission(null)}
        />
      )}
    </div>
  );
};
