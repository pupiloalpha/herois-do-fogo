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
  Info,
  Star,
  ListChecks,
  Award,
  Clock,
  ChevronRight,
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

  const selectedCharacter = saveState.selectedCharacter;
  const totalStars = getTotalHubStars(saveState);
  const careerRank = getCareerRank(totalStars.earned);

  return (
    <div className="relative w-full h-full min-h-[100dvh] bg-slate-950 text-white flex flex-col justify-between overflow-y-auto overscroll-contain p-3 sm:p-6 md:p-8 pb-10 select-none">
      {/* Background backdrop */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 filter blur-[2px] scale-105 pointer-events-none"
        style={{ backgroundImage: `url('/banner.jpg')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/90 pointer-events-none" />

      {/* Top Bar: CBMMG Hub Header & Utilities */}
      <header className="relative z-10 flex items-center justify-between w-full max-w-6xl mx-auto shrink-0 gap-3 mb-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src="/assets/aistudio/LogoCorpoDeBombeiros_57dfdd49.png"
            alt="Brasão CBMMG"
            className="w-10 h-10 sm:w-11 sm:h-11 drop-shadow-md rounded-full object-contain shrink-0"
          />
          <div className="min-w-0">
            <span className="text-xs sm:text-sm font-bold tracking-wide text-amber-400 block leading-tight truncate">
              CBMMG · Central de Operações
            </span>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:block truncate">
              Corpo de Bombeiros Militar de Minas Gerais
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Career & Rank Trigger */}
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setShowCareer(true);
            }}
            className="min-h-[44px] sm:min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-amber-500/35 text-xs font-semibold text-slate-100 flex items-center gap-1.5 transition active:scale-95 whitespace-nowrap"
            title="Carreira, Patente e Medalhas"
          >
            <span>{careerRank.current.insignia}</span>
            <span className="hidden md:inline text-slate-200">{careerRank.current.title}</span>
            <span className="text-slate-600 hidden md:inline" aria-hidden="true">·</span>
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
            <span className="font-mono tabular-nums text-amber-300 font-bold">
              {totalStars.earned}/{totalStars.max}
            </span>
          </button>

          <PWAInstallButton />

          {onToggleFullscreen && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onToggleFullscreen();
              }}
              className="min-w-[44px] min-h-[44px] sm:min-w-[40px] sm:min-h-[40px] p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-amber-400 hover:text-white transition shadow-sm active:scale-95 flex items-center justify-center gap-1.5 whitespace-nowrap"
              title={isFullscreen ? 'Sair da Tela Cheia' : 'Jogar em Tela Cheia'}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              <span className="hidden lg:inline text-xs font-bold">
                {isFullscreen ? 'Janela' : 'Tela Cheia'}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onOpenInstructions();
            }}
            className="min-w-[44px] min-h-[44px] sm:min-w-[40px] sm:min-h-[40px] p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition shadow-sm active:scale-95 flex items-center justify-center"
            title="Como Jogar"
            aria-label="Como jogar"
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onToggleMute();
            }}
            className="min-w-[44px] min-h-[44px] sm:min-w-[40px] sm:min-h-[40px] p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white transition shadow-sm active:scale-95 flex items-center justify-center"
            title={isMuted ? 'Ativar Som' : 'Silenciar'}
            aria-label={isMuted ? 'Ativar Som' : 'Silenciar'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            )}
          </button>
        </div>
      </header>

      {/* Browser Bar Avoidance Tip Banner (only in normal browser mode) */}
      {!isStandalone && (
        <div className="relative z-10 w-full max-w-6xl mx-auto mb-4">
          <div className="bg-slate-900/80 border border-amber-500/35 rounded-2xl px-3.5 py-2.5 shadow-lg flex items-center justify-between gap-2.5 backdrop-blur-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-base shrink-0">📱</span>
              <p className="text-xs text-slate-300 truncate">
                <strong className="text-amber-300">Dica de Tela:</strong> As barras do navegador cobrem o jogo?
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {onToggleFullscreen && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onToggleFullscreen();
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold active:scale-95 transition flex items-center gap-1 whitespace-nowrap"
                >
                  <Maximize className="w-3.5 h-3.5" />
                  <span>Tela Cheia</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setShowGuide(true);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold active:scale-95 transition flex items-center gap-1 whitespace-nowrap"
              >
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span>Como Ocultar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Hub Workspace */}
      <main className="relative z-10 w-full max-w-6xl mx-auto my-auto space-y-6 py-2">
        {/* Hub Title & Intro */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="space-y-1.5 max-w-2xl">
            <p className="text-xs font-semibold text-orange-400 tracking-wide">
              Academia de Operações · 3 Frentes de Missão
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none text-white">
              <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
                HERÓIS DO FOGO
              </span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Escolha seu bombeiro militar, acompanhe suas estrelas e escolha a operação de salvamento.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setShowCareer(true);
            }}
            className="self-start md:self-auto min-h-[44px] px-4 py-2.5 rounded-2xl bg-slate-900/85 hover:bg-slate-800 border border-slate-700/80 text-xs sm:text-sm font-semibold text-slate-200 flex items-center gap-2 transition active:scale-95 whitespace-nowrap"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>
              Carreira & Medalhas ({saveState.unlockedMedals.length})
            </span>
          </button>
        </section>

        {/* Global Hero Selector */}
        <section aria-labelledby="hero-select-heading" className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 id="hero-select-heading" className="text-xs font-bold uppercase tracking-wider text-slate-400">
              1. Escolha o Bombeiro da Equipe
            </h2>
            <span className="text-xs text-slate-400">
              Ativo: <strong className="text-white">{CHARACTERS[selectedCharacter].name}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                  className={`text-left rounded-2xl p-3.5 transition-all border flex items-center gap-3.5 ${
                    isSelected
                      ? isFoguinho
                        ? 'bg-slate-900/95 border-amber-400 ring-2 ring-amber-400/25 shadow-xl'
                        : 'bg-slate-900/95 border-orange-500 ring-2 ring-orange-500/25 shadow-xl'
                      : 'bg-slate-900/55 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src={char.avatarUrl}
                    alt={char.name}
                    className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl object-cover shrink-0 border-2 ${
                      isFoguinho ? 'border-amber-400/60' : 'border-orange-500/60'
                    }`}
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-base sm:text-lg font-black text-white truncate">
                        {char.name}
                      </span>
                      <span
                        className={`text-[11px] font-bold ${
                          isSelected
                            ? isFoguinho
                              ? 'text-amber-300'
                              : 'text-orange-400'
                            : 'text-slate-500'
                        }`}
                      >
                        {isSelected ? 'Selecionado' : 'Selecionar'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">
                      {char.role} · {isFoguinho ? `${char.maxHealth} HP · -45% dano` : `${char.speed} vel · +60% resgate`}
                    </p>
                    <p className="text-[11px] text-slate-300 line-clamp-1">
                      {char.specialTrait}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Operations Showcase (3 Missions) */}
        <section aria-labelledby="missions-heading" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 id="missions-heading" className="text-xs font-bold uppercase tracking-wider text-slate-400">
              2. Missões Disponíveis no Hub
            </h2>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Progresso salvo automaticamente no dispositivo
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            {MISSIONS_CATALOG.map((mission) => {
              const summary = getMissionProgressSummary(saveState, mission.id);
              const isPlayable = mission.status === 'playable';

              const borderClass =
                mission.accent === 'orange'
                  ? 'border-orange-500/50 bg-slate-900/90'
                  : mission.accent === 'cyan'
                    ? 'border-cyan-500/35 bg-slate-900/75'
                    : 'border-emerald-500/35 bg-slate-900/75';

              const accentText =
                mission.accent === 'orange'
                  ? 'text-orange-400'
                  : mission.accent === 'cyan'
                    ? 'text-cyan-400'
                    : 'text-emerald-400';

              const progressPercent = Math.round(
                (summary.completedStages / summary.totalStages) * 100
              );

              const primaryCtaLabel =
                summary.completedStages >= summary.totalStages
                  ? 'Jogar Novamente'
                  : summary.completedStages > 0
                    ? `Continuar · ${mission.stageTermSingular} ${summary.nextStageToPlay}`
                    : `Iniciar ${mission.stageTermSingular} 1`;

              return (
                <article
                  key={mission.id}
                  className={`rounded-3xl border p-5 flex flex-col justify-between gap-4 shadow-xl ${borderClass}`}
                >
                  <div className="space-y-3">
                    {/* Mission Kicker & Title */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <span className={`font-semibold ${accentText}`}>{mission.subtitle}</span>
                          <span aria-hidden="true">·</span>
                          <span>
                            {isPlayable ? 'Disponível' : 'Em preparação'}
                          </span>
                        </div>
                        <h3 className="text-xl font-black text-white mt-0.5 leading-tight">
                          {mission.badgeEmoji} {mission.title}
                        </h3>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {mission.shortDescription}
                    </p>

                    {/* Mechanics List */}
                    <ul className="space-y-1 text-xs text-slate-300 pt-1">
                      {mission.mechanicsHighlight.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className={`${accentText} font-bold`} aria-hidden="true">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Character Synergy Note */}
                    <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                      <strong className="text-slate-200">{CHARACTERS[selectedCharacter].name}:</strong>{' '}
                      {mission.characterPerks[selectedCharacter]}
                    </div>
                  </div>

                  {/* Bottom Progress + Actions */}
                  <div className="space-y-3 pt-2 border-t border-slate-800/90">
                    {isPlayable ? (
                      <>
                        {/* Progress metrics */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-300 font-medium">
                              {summary.completedStages}/{summary.totalStages} {mission.stageTermPlural.toLowerCase()}
                            </span>
                            <span className="font-mono tabular-nums text-amber-300 font-bold flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              {summary.earnedStars}/{summary.maxStars}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                            <div
                              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>

                        {/* Play & Stage Select Buttons */}
                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={() => {
                              sounds.playClick();
                              onLaunchMissionStage(mission.id, summary.nextStageToPlay);
                            }}
                            className="w-full min-h-[48px] px-4 py-3 rounded-2xl bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 text-slate-950 font-black text-sm shadow-lg hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                          >
                            <Play className="w-4 h-4 fill-slate-950 text-slate-950 shrink-0" />
                            <span>{primaryCtaLabel}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              sounds.playClick();
                              setStageSelectMission(mission);
                            }}
                            className="w-full min-h-[44px] px-4 py-2 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition active:scale-[0.98] whitespace-nowrap"
                          >
                            <ListChecks className="w-4 h-4 text-orange-400 shrink-0" />
                            <span>Selecionar {mission.stageTermSingular} (1–{mission.totalStages})</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{mission.totalStages} {mission.stageTermPlural.toLowerCase()} planejados</span>
                          </span>
                          <span className="font-semibold text-slate-300">Próxima etapa</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            sounds.playClick();
                            setPreviewMission(mission);
                          }}
                          className="w-full min-h-[46px] px-4 py-2.5 rounded-2xl bg-slate-950/85 hover:bg-slate-800 border border-slate-700 text-slate-100 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition active:scale-[0.98] whitespace-nowrap"
                        >
                          <span>Ver Plano da Operação</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-4 mt-4 border-t border-slate-900 gap-1 text-center shrink-0">
        <span>Corpo de Bombeiros Militar de Minas Gerais (CBMMG)</span>
        <span>Hub Arcade PWA Offline · Controles Desktop e Mobile</span>
      </footer>

      {/* Modals */}
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
