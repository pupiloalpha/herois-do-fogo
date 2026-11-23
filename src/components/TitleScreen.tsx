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
  CheckCircle2,
  ChevronRight,
  Shield,
  Zap,
} from 'lucide-react';
import { sounds } from '../audio/SoundManager';
import { StageSelectModal } from './StageSelectModal';
import { CareerModal } from './CareerModal';
import { MissionPreviewModal } from './MissionPreviewModal';
import { MissionBannerArt } from './MissionBannerArt';
import { FireEmbers } from './FireEmbers';

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

const MOBILE_TAB_LABELS: Record<MissionId, string> = {
  vertical_10: 'Edifício',
  flood_rescue: 'Enchentes',
  forest_fire: 'Floresta',
};

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
}) => {
  const [showCareer, setShowCareer] = useState(false);
  const [stageSelectMission, setStageSelectMission] = useState<MissionCatalogEntry | null>(null);
  const [previewMission, setPreviewMission] = useState<MissionCatalogEntry | null>(null);
  const [mobileMissionId, setMobileMissionId] = useState<MissionId>('vertical_10');

  const selectedCharacter = saveState.selectedCharacter;
  const totalStars = getTotalHubStars(saveState);
  const careerRank = getCareerRank(totalStars.earned);

  const activeMobileMission =
    MISSIONS_CATALOG.find((m) => m.id === mobileMissionId) || MISSIONS_CATALOG[0];

  const renderMissionCardContent = (mission: MissionCatalogEntry, compact = false) => {
    const summary = getMissionProgressSummary(saveState, mission.id);
    const isPlayable = mission.status === 'playable';
    const isVertical = mission.id === 'vertical_10';
    const isForest = mission.id === 'forest_fire';

    const progressPercent = Math.round((summary.completedStages / summary.totalStages) * 100);

    const cardSurface = isVertical
      ? 'bg-slate-950/88 border-orange-400/35 hover:border-orange-300/70'
      : isForest
        ? 'bg-slate-950/88 border-emerald-400/35 hover:border-emerald-300/70'
        : 'bg-slate-950/88 border-sky-400/35 hover:border-sky-300/70';

    const subtitleColor = isVertical
      ? 'text-amber-300'
      : isForest
        ? 'text-emerald-300'
        : 'text-sky-300';

    const emblemBg = isVertical
      ? 'bg-slate-900 border-orange-400/60'
      : isForest
        ? 'bg-slate-900 border-emerald-400/60'
        : 'bg-slate-900 border-sky-400/60';

    const progressBarColor = isVertical
      ? 'bg-gradient-to-r from-amber-400 to-orange-500'
      : isForest
        ? 'bg-gradient-to-r from-emerald-400 to-teal-400'
        : 'bg-gradient-to-r from-sky-400 to-cyan-300';

    const btnArcadeClass = isVertical
      ? 'btn-arcade-orange text-slate-950'
      : isForest
        ? 'btn-arcade-emerald text-slate-950'
        : 'btn-arcade-cyan text-slate-950';

    const primaryCtaLabel =
      summary.completedStages >= summary.totalStages
        ? 'Jogar Novamente'
        : summary.completedStages > 0
          ? `Jogar ${mission.stageTermSingular} ${summary.nextStageToPlay}`
          : `Iniciar ${mission.stageTermSingular} 1`;

    const shortDesc = isVertical
      ? 'Suba 10 andares apagando o fogo, feche válvulas de gás e salve todos!'
      : isForest
        ? 'Contenha queimadas no parque, use bomba costal e resgate a fauna!'
        : 'Pilote bote e helicóptero para resgatar famílias em áreas alagadas!';

    return (
      <article
        key={mission.id}
        className={`rounded-2xl border backdrop-blur-md shadow-xl overflow-hidden flex flex-col justify-between transition duration-150 ${
          compact ? '' : 'hover:-translate-y-1'
        } ${cardSurface}`}
      >
        <div>
          <div className="relative">
            <MissionBannerArt missionId={mission.id} compact={compact} />
            <div
              className={`absolute left-3.5 -bottom-4 w-10 h-10 rounded-xl border-2 flex items-center justify-center text-xl shadow-lg ${emblemBg}`}
            >
              {mission.badgeEmoji}
            </div>
          </div>

          <div className={`px-4 pt-6 ${compact ? 'pb-2.5' : 'pb-3'} space-y-1`}>
            <p className={`text-[11px] font-bold truncate ${subtitleColor}`}>
              {mission.totalStages} {mission.stageTermPlural.toLowerCase()} · {mission.subtitle}
            </p>
            <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-tight truncate">
              {mission.title}
            </h3>

            {!compact && (
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 pt-0.5">
                {shortDesc}
              </p>
            )}
          </div>
        </div>

        <div className={`px-4 pb-4 pt-2.5 border-t border-white/10 space-y-2.5`}>
          {isPlayable ? (
            <>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-300 tabular-nums">
                    {summary.completedStages}/{summary.totalStages} {mission.stageTermPlural.toLowerCase()}
                  </span>
                  <span className="flex items-center gap-1 text-amber-300 font-mono tabular-nums font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    {summary.earnedStars}/{summary.maxStars}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden border border-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${progressBarColor}`}
                    style={{ width: `${Math.max(4, progressPercent)}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onLaunchMissionStage(mission.id, summary.nextStageToPlay);
                  }}
                  className={`w-full min-h-[44px] py-2.5 px-4 rounded-xl font-display font-bold text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer ${btnArcadeClass}`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{primaryCtaLabel}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setStageSelectMission(mission);
                  }}
                  className="w-full min-h-[44px] py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <ListChecks className="w-3.5 h-3.5 text-amber-300" />
                  <span>Escolher {mission.stageTermSingular.toLowerCase()}</span>
                </button>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setPreviewMission(mission);
              }}
              className="w-full min-h-[44px] rounded-xl bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Ver Prévia</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </article>
    );
  };

  return (
    <div className="relative w-full h-full min-h-[100dvh] bg-slate-950 text-white flex flex-col justify-between overflow-y-auto overscroll-contain select-none">
      {/* 1. VIBRANT BANNER BACKDROP WITH MEASURED SCRIM & SUBTLE EMBERS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute inset-0 bg-cover bg-center brightness-95 contrast-105"
          style={{ backgroundImage: `url('/banner.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/45 to-slate-950/92" />
        <FireEmbers count={16} />
      </div>

      {/* 2. CLEAN TOP BAR WITH iOS SAFE-AREA SUPPORT */}
      <header className="relative z-10 w-full max-w-5xl mx-auto pt-[max(0.75rem,env(safe-area-inset-top))] pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] sm:px-6 pb-1 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src="/assets/aistudio/LogoCorpoDeBombeiros_57dfdd49.png"
            alt="Brasão CBMMG"
            referrerPolicy="no-referrer"
            className="w-10 h-10 rounded-full object-contain shrink-0 drop-shadow-md"
          />
          <span className="text-xs sm:text-sm font-bold tracking-wide text-amber-200 truncate drop-shadow">
            CBMMG · 193
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setShowCareer(true);
            }}
            className="h-10 px-2.5 sm:px-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition whitespace-nowrap cursor-pointer shrink-0"
            title="Patente, Conquistas e Medalhas"
            aria-label="Abrir carreira e medalhas"
          >
            <span className="text-sm">{careerRank.current.insignia}</span>
            <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
            <span className="font-mono tabular-nums font-bold">
              {totalStars.earned}/{totalStars.max}
            </span>
          </button>

          <PWAInstallButton />

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onOpenInstructions();
            }}
            className="w-10 h-10 rounded-xl bg-slate-900/75 hover:bg-slate-800 border border-white/15 text-amber-300 hover:text-white transition active:scale-95 flex items-center justify-center shrink-0 cursor-pointer backdrop-blur-md"
            title="Como Jogar"
            aria-label="Como jogar"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onToggleMute();
            }}
            className={`w-10 h-10 rounded-xl border transition active:scale-95 flex items-center justify-center shrink-0 cursor-pointer backdrop-blur-md ${
              isMuted
                ? 'bg-rose-950/80 border-rose-400/50 text-rose-300 hover:text-white'
                : 'bg-slate-900/75 hover:bg-slate-800 border-white/15 text-emerald-300 hover:text-white'
            }`}
            title={isMuted ? 'Ligar Som' : 'Silenciar'}
            aria-label={isMuted ? 'Ligar Som' : 'Silenciar'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {onToggleFullscreen && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onToggleFullscreen();
              }}
              className="w-10 h-10 rounded-xl bg-slate-900/75 hover:bg-slate-800 border border-white/15 text-slate-200 hover:text-white transition active:scale-95 flex items-center justify-center shrink-0 cursor-pointer backdrop-blur-md"
              title={isFullscreen ? 'Sair da Tela Cheia' : 'Tela Cheia'}
              aria-label="Tela Cheia"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          )}
        </div>
      </header>

      {/* 3. MAIN HUB ARENA */}
      <main className="relative z-10 w-full max-w-5xl mx-auto px-3 sm:px-6 py-2 my-auto flex flex-col gap-3.5 sm:gap-5">
        {/* Hero Game Wordmark Emblem (Dual-layer stroke + radiant fill over soft radial scrim) */}
        <section className="relative text-center py-1 sm:py-2 flex flex-col items-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-6 -inset-y-3 bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0.74)_0%,rgba(15,23,42,0)_72%)]"
          />

          <p className="relative text-[11px] sm:text-xs font-bold tracking-wider uppercase text-amber-200/95 drop-shadow mb-1">
            Operação Corpo de Bombeiros · 193
          </p>

          <h1 className="relative inline-block leading-none tracking-wide uppercase font-display text-4xl sm:text-6xl md:text-[64px] font-bold text-balance">
            <span aria-hidden="true" className="hero-wordmark-outline block">
              Heróis do Fogo
            </span>
            <span className="absolute inset-0 block bg-gradient-to-b from-amber-50 via-yellow-300 to-orange-400 bg-clip-text text-transparent">
              Heróis do Fogo
            </span>
          </h1>

          <p className="relative text-amber-100/95 text-xs sm:text-sm font-medium drop-shadow max-w-md mx-auto mt-1.5">
            Apague o fogo, proteja a mata e salve vidas!
          </p>
        </section>

        {/* Hero Character Selector (Visual stats on mobile + desktop) */}
        <section aria-labelledby="hero-choice-heading" className="space-y-2">
          <h2
            id="hero-choice-heading"
            className="text-xs font-bold text-amber-200/95 drop-shadow px-0.5"
          >
            Escolha seu bombeiro
          </h2>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
            {(['foguinho', 'faisca'] as CharacterId[]).map((charId) => {
              const char = CHARACTERS[charId];
              const isSelected = selectedCharacter === charId;
              const isFoguinho = charId === 'foguinho';
              const resistancePct = isFoguinho ? 90 : 52;
              const speedPct = isFoguinho ? 62 : 95;

              return (
                <button
                  key={charId}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onSelectCharacter(charId);
                  }}
                  aria-pressed={isSelected}
                  className={`relative min-h-[88px] sm:min-h-[100px] p-2.5 sm:p-3.5 rounded-2xl border text-left transition duration-150 flex items-center gap-2.5 sm:gap-3.5 backdrop-blur-md cursor-pointer ${
                    isSelected
                      ? isFoguinho
                        ? 'bg-gradient-to-br from-amber-950/85 to-slate-950/90 border-amber-400 ring-1 ring-amber-300/40 shadow-xl scale-[1.01]'
                        : 'bg-gradient-to-br from-orange-950/85 to-slate-950/90 border-orange-400 ring-1 ring-orange-300/40 shadow-xl scale-[1.01]'
                      : 'bg-slate-950/70 border-white/10 hover:border-white/25 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src={char.avatarUrl}
                    alt={char.name}
                    referrerPolicy="no-referrer"
                    className={`w-14 h-14 sm:w-[68px] sm:h-[68px] rounded-xl object-cover border-2 shrink-0 shadow-md ${
                      isSelected
                        ? isFoguinho
                          ? 'border-amber-300'
                          : 'border-orange-300'
                        : 'border-white/15'
                    }`}
                  />

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-display text-base sm:text-lg font-bold text-white leading-tight truncate">
                        {char.name}
                      </h3>
                      {isSelected && (
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 ${
                            isFoguinho ? 'text-amber-300' : 'text-orange-300'
                          }`}
                        />
                      )}
                    </div>

                    <p
                      className={`text-[11px] sm:text-xs font-bold truncate ${
                        isFoguinho ? 'text-amber-300' : 'text-orange-300'
                      }`}
                    >
                      {isFoguinho ? 'O Forte do Fogo' : 'A Veloz do Resgate'}
                    </p>

                    {/* Compact visual attribute bars visible on mobile & desktop */}
                    <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                      <div className="flex items-center gap-1 min-w-0">
                        <Shield className="w-3 h-3 text-amber-300 shrink-0" />
                        <div className="flex-1 h-1.5 rounded-full bg-slate-900 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-amber-400"
                            style={{ width: `${resistancePct}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-1 min-w-0">
                        <Zap className="w-3 h-3 text-sky-300 shrink-0" />
                        <div className="flex-1 h-1.5 rounded-full bg-slate-900 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-sky-400"
                            style={{ width: `${speedPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Missions Hub */}
        <section aria-labelledby="missions-heading" className="space-y-2">
          <h2
            id="missions-heading"
            className="text-xs font-bold text-amber-200/95 drop-shadow px-0.5"
          >
            Escolha a operação
          </h2>

          {/* Mobile Segmented Switcher (< md) with clear world names */}
          <div className="md:hidden space-y-2">
            <div className="grid grid-cols-3 gap-1 bg-slate-950/80 p-1 rounded-xl border border-white/10 backdrop-blur-md">
              {MISSIONS_CATALOG.map((m) => {
                const isActive = mobileMissionId === m.id;
                const activeClass =
                  m.accent === 'orange'
                    ? 'bg-orange-500 text-slate-950 shadow-sm'
                    : m.accent === 'emerald'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'bg-sky-400 text-slate-950 shadow-sm';

                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setMobileMissionId(m.id);
                    }}
                    className={`min-h-[44px] px-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer whitespace-nowrap truncate ${
                      isActive ? activeClass : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>{m.badgeEmoji}</span>
                    <span className="truncate">{MOBILE_TAB_LABELS[m.id]}</span>
                  </button>
                );
              })}
            </div>

            {renderMissionCardContent(activeMobileMission, true)}
          </div>

          {/* Desktop 3-Column Grid (>= md) */}
          <div className="hidden md:grid grid-cols-3 gap-4 items-stretch">
            {MISSIONS_CATALOG.map((mission) => renderMissionCardContent(mission, false))}
          </div>
        </section>
      </main>

      {/* 4. QUIET FOOTER WITH iOS SAFE-AREA SUPPORT */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-4 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-300/80 border-t border-white/10 gap-0.5 text-center shrink-0">
        <span className="font-medium text-amber-200/90">
          Corpo de Bombeiros Militar de Minas Gerais (CBMMG)
        </span>
        <span>Jogo Educativo PWA · Celular, Tablet e Computador</span>
      </footer>

      {/* MODALS */}
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
