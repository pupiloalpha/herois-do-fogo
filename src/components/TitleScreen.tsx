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
} from 'lucide-react';
import { sounds } from '../audio/SoundManager';
import { StageSelectModal } from './StageSelectModal';
import { CareerModal } from './CareerModal';
import { MissionPreviewModal } from './MissionPreviewModal';
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
      ? 'bg-gradient-to-b from-orange-950/75 via-slate-950/85 to-slate-950/90 border-orange-400/35 hover:border-orange-400/65'
      : isForest
        ? 'bg-gradient-to-b from-emerald-950/75 via-slate-950/85 to-slate-950/90 border-emerald-400/35 hover:border-emerald-400/65'
        : 'bg-gradient-to-b from-sky-950/75 via-slate-950/85 to-slate-950/90 border-sky-400/35 hover:border-sky-400/65';

    const subtitleColor = isVertical
      ? 'text-amber-300'
      : isForest
        ? 'text-emerald-300'
        : 'text-sky-300';

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
        className={`rounded-2xl border backdrop-blur-md shadow-xl flex flex-col justify-between transition duration-150 ${
          compact ? 'p-3.5 gap-3' : 'p-4 gap-3.5 hover:-translate-y-0.5'
        } ${cardSurface}`}
      >
        <div className="space-y-1.5">
          <div className="flex items-start gap-2.5">
            <span className="text-2xl sm:text-[26px] leading-none shrink-0 mt-0.5">
              {mission.badgeEmoji}
            </span>
            <div className="min-w-0 flex-1">
              <p className={`text-[11px] font-bold truncate ${subtitleColor}`}>
                {mission.totalStages} {mission.stageTermPlural.toLowerCase()} · {mission.subtitle}
              </p>
              <h3 className="font-display text-lg sm:text-xl font-bold text-white leading-tight truncate">
                {mission.title}
              </h3>
            </div>
          </div>

          {!compact && (
            <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 pt-0.5">
              {shortDesc}
            </p>
          )}
        </div>

        <div className="space-y-2.5 pt-2.5 border-t border-white/10">
          {isPlayable ? (
            <>
              {/* Visual Progress Bar + Stars */}
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
                <div className="w-full h-1.5 rounded-full bg-slate-900/90 overflow-hidden border border-white/5">
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
                  className="w-full min-h-[36px] py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition cursor-pointer"
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
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/65 via-slate-950/35 to-slate-950/90" />
        <FireEmbers count={16} />
      </div>

      {/* 2. CLEAN TOP BAR (Uniform 40px controls, breathable spacing) */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-3 sm:px-6 pt-3 sm:pt-4 pb-1 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src="/assets/aistudio/LogoCorpoDeBombeiros_57dfdd49.png"
            alt="Brasão CBMMG"
            className="w-10 h-10 rounded-full object-contain shrink-0 drop-shadow-md"
          />
          <div className="min-w-0 leading-tight">
            <span className="text-[11px] font-bold text-amber-300 block truncate">
              CBMMG · 193
            </span>
            <span className="font-display text-sm sm:text-base font-bold text-white block truncate drop-shadow">
              Heróis do Fogo
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Career & Stars Medallion */}
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
        {/* Hero Title */}
        <section className="text-center space-y-1">
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-none text-balance">
            <span className="bg-gradient-to-b from-yellow-200 via-amber-300 to-orange-500 bg-clip-text text-transparent text-arcade-title">
              Heróis do Fogo
            </span>
          </h1>
          <p className="text-amber-100/95 text-xs sm:text-sm font-medium drop-shadow max-w-md mx-auto">
            Apague o fogo, proteja a mata e salve vidas com o CBMMG!
          </p>
        </section>

        {/* Hero Character Selector */}
        <section aria-labelledby="hero-choice-heading" className="space-y-2">
          <h2
            id="hero-choice-heading"
            className="text-xs font-bold text-amber-200/90 drop-shadow px-0.5"
          >
            Escolha seu bombeiro
          </h2>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
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
                  className={`relative min-h-[82px] sm:min-h-[92px] p-2.5 sm:p-3.5 rounded-2xl border text-left transition duration-150 flex items-center gap-3 backdrop-blur-md cursor-pointer ${
                    isSelected
                      ? isFoguinho
                        ? 'bg-amber-950/75 border-amber-400 shadow-lg scale-[1.01]'
                        : 'bg-orange-950/75 border-orange-400 shadow-lg scale-[1.01]'
                      : 'bg-slate-950/65 border-white/10 hover:border-white/25 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src={char.avatarUrl}
                    alt={char.name}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border-2 shrink-0 ${
                      isSelected
                        ? isFoguinho
                          ? 'border-amber-300'
                          : 'border-orange-300'
                        : 'border-white/15'
                    }`}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
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
                      className={`text-xs font-bold truncate mt-0.5 ${
                        isFoguinho ? 'text-amber-300' : 'text-orange-300'
                      }`}
                    >
                      {isFoguinho ? 'O Forte do Fogo' : 'A Veloz do Resgate'}
                    </p>
                    <p className="text-[11px] text-slate-300 hidden sm:block truncate mt-0.5">
                      {isFoguinho
                        ? 'Mais resistência e tanque extra'
                        : 'Corre e resgata mais rápido'}
                    </p>
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
            className="text-xs font-bold text-amber-200/90 drop-shadow px-0.5"
          >
            Escolha a operação
          </h2>

          {/* Mobile Tabbed Switcher (< md) */}
          <div className="md:hidden space-y-2">
            <div className="grid grid-cols-3 gap-1 bg-slate-950/75 p-1 rounded-xl border border-white/10 backdrop-blur-md">
              {MISSIONS_CATALOG.map((m) => {
                const isActive = mobileMissionId === m.id;
                const activeClass =
                  m.accent === 'orange'
                    ? 'bg-orange-500 text-slate-950'
                    : m.accent === 'emerald'
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-sky-400 text-slate-950';

                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setMobileMissionId(m.id);
                    }}
                    className={`min-h-[38px] px-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition cursor-pointer truncate ${
                      isActive ? activeClass : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>{m.badgeEmoji}</span>
                    <span className="truncate">{m.title.split(' ')[0]}</span>
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

      {/* 4. QUIET FOOTER */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-300/80 border-t border-white/10 gap-0.5 text-center shrink-0">
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
