/**
 * Heróis do Fogo: Hub de Operações CBMMG
 * Missão 1: Resgate nos 10 Andares (Ativa)
 * Missão 2: Operação Enchentes (Ativa)
 * Missão 3: Incêndio Florestal (Ativa)
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CharacterId, GameHUDState } from './game/types';
import { FLOORS_DATA } from './game/floorsData';
import { FOREST_SECTORS } from './game/forest/forestData';
import { FOREST_TOOLS } from './game/forest/forestTypes';
import { FLOOD_SECTORS } from './game/flood/floodData';
import { FLOOD_VEHICLES } from './game/flood/floodTypes';
import { calculateNextFireSpreadSpeed } from './game/fireMechanics';
import { PhaserGame, PhaserGameRef } from './game/PhaserGame';
import { TitleScreen } from './components/TitleScreen';
import { FloorBriefingModal } from './components/FloorBriefingModal';
import { GameHUD } from './components/GameHUD';
import { TouchControls } from './components/TouchControls';
import { FloorClearModal } from './components/FloorClearModal';
import { GameOverModal } from './components/GameOverModal';
import { GrandVictoryModal } from './components/GrandVictoryModal';
import { InstructionsModal } from './components/InstructionsModal';
import { PauseModal } from './components/PauseModal';
import { OfflineIndicator } from './pwa/OfflineIndicator';
import { sounds } from './audio/SoundManager';
import { useFullscreen } from './hooks/useFullscreen';
import { useVisualViewport } from './hooks/useVisualViewport';
import { getIsStandalone } from './pwa/usePWAInstall';
import { MISSIONS_BY_ID } from './hub/missionsCatalog';
import {
  loadHubSaveState,
  recordStageClear,
  resetHubSaveState,
  saveHubState,
} from './hub/hubProgress';
import { HubSaveState, MedalDefinition, MissionId } from './hub/types';

type GameState = 'title' | 'briefing' | 'playing' | 'paused' | 'floor_clear' | 'game_over' | 'grand_victory';

const INITIAL_HUD_STATE: GameHUDState = {
  currentFloor: 1,
  health: 100,
  maxHealth: 100,
  extinguisher: 100,
  maxExtinguisher: 100,
  heatMeter: 0,
  timeRemaining: 90,
  score: 0,
  stars: 3,
  rescuedCivilians: 0,
  totalCivilians: 1,
  rescuedPets: 0,
  totalPets: 0,
  extinguishedFires: 0,
  totalFires: 3,
  closedGasValves: 0,
  totalGasValves: 0,
  cutElectricPanels: 0,
  totalElectricPanels: 1,
  exitUnlocked: false,
  promptActionText: null,
  contextualAction: null,
};

export default function App() {
  // Sync real visible screen dimensions with CSS variables
  useVisualViewport();

  // Fullscreen mode controller to hide browser navigation bars
  const { isFullscreen, toggleFullscreen, enterFullscreen, isSupported: isFullscreenSupported } = useFullscreen();
  const [isStandalone] = useState(() => getIsStandalone());

  // Hub persistent state
  const [hubSave, setHubSave] = useState<HubSaveState>(() => loadHubSaveState());
  const [activeMissionId, setActiveMissionId] = useState<MissionId>('vertical_10');
  const [newlyUnlockedMedals, setNewlyUnlockedMedals] = useState<MedalDefinition[]>([]);

  const [gameState, setGameState] = useState<GameState>('title');
  const [currentFloor, setCurrentFloor] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [floorStars, setFloorStars] = useState<number>(3);
  const [gameOverReason, setGameOverReason] = useState<string>('');
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(sounds.getMuted());
  const [extraLift, setExtraLift] = useState<boolean>(() => !isStandalone && !isFullscreen);
  const [fireSpreadSpeed, setFireSpreadSpeed] = useState<number>(1.0);
  const [fireSpreadIncreased, setFireSpreadIncreased] = useState<boolean>(false);

  // HUD stats from Phaser engine
  const [hudState, setHudState] = useState<GameHUDState>(INITIAL_HUD_STATE);
  const hudStateRef = useRef<GameHUDState>(INITIAL_HUD_STATE);

  const phaserRef = useRef<PhaserGameRef>(null);

  const selectedCharacter = hubSave.selectedCharacter;
  const activeMission = MISSIONS_BY_ID[activeMissionId];

  // Sound mute toggle
  const handleToggleMute = useCallback(() => {
    const nextMuted = sounds.toggleMute();
    setIsMuted(nextMuted);
  }, []);

  // Persist character choice in Hub store
  const handleSelectCharacter = useCallback((charId: CharacterId) => {
    setHubSave(prev => {
      const next: HubSaveState = { ...prev, selectedCharacter: charId };
      saveHubState(next);
      return next;
    });
  }, []);

  const handleResetProgress = useCallback(() => {
    const fresh = resetHubSaveState();
    setHubSave(fresh);
  }, []);

  // Keyboard shortcut for Pause (Esc or P)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        if (gameState === 'playing') {
          setGameState('paused');
        } else if (gameState === 'paused') {
          setGameState('playing');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Launch a mission stage from Hub
  const handleLaunchMissionStage = useCallback((missionId: MissionId, stageNumber: number) => {
    const missionEntry = MISSIONS_BY_ID[missionId];
    if (!missionEntry || missionEntry.status !== 'playable') return;

    // If mobile browser, attempt to enter fullscreen on user click/tap
    if (isFullscreenSupported && !isFullscreen && !isStandalone && typeof window !== 'undefined' && window.innerWidth < 768) {
      enterFullscreen();
    }

    setActiveMissionId(missionId);
    setCurrentFloor(stageNumber);
    setScore(0);
    setFireSpreadSpeed(1.0);
    setFireSpreadIncreased(false);
    setNewlyUnlockedMedals([]);
    setHudState({ ...INITIAL_HUD_STATE, missionId, currentFloor: stageNumber });
    setGameState('briefing');
  }, [isFullscreenSupported, isFullscreen, isStandalone, enterFullscreen]);

  const handleStartFloor = useCallback(() => {
    setGameState('playing');
  }, []);

  const handleHudUpdate = useCallback((hud: GameHUDState) => {
    hudStateRef.current = hud;
    setHudState(hud);
    setScore(hud.score);
  }, []);

  const handleFloorClear = useCallback((clearedScore: number, stars: number, remainingHealth: number, maxHealth: number) => {
    setScore(clearedScore);
    setFloorStars(stars);

    const { nextSpeed, increased } = calculateNextFireSpreadSpeed(fireSpreadSpeed, remainingHealth, maxHealth);
    setFireSpreadSpeed(nextSpeed);
    setFireSpreadIncreased(increased);

    const latestHud = hudStateRef.current;
    setHubSave(prev => {
      const { nextSave, newlyUnlockedMedals: unlocked } = recordStageClear(prev, {
        missionId: activeMissionId,
        stageNumber: currentFloor,
        score: clearedScore,
        stars,
        civiliansSaved: latestHud.rescuedCivilians,
        petsSaved: latestHud.rescuedPets,
        firesExtinguished: activeMissionId === 'flood_rescue' ? 0 : latestHud.extinguishedFires,
      });
      setNewlyUnlockedMedals(unlocked);
      return nextSave;
    });

    if (currentFloor >= activeMission.totalStages) {
      setGameState('grand_victory');
    } else {
      setGameState('floor_clear');
    }
  }, [activeMission.totalStages, activeMissionId, currentFloor, fireSpreadSpeed]);

  const handleNextFloor = useCallback(() => {
    if (currentFloor < activeMission.totalStages) {
      setCurrentFloor(prev => prev + 1);
      setNewlyUnlockedMedals([]);
      setGameState('briefing');
    } else {
      setGameState('grand_victory');
    }
  }, [activeMission.totalStages, currentFloor]);

  const handleGameOver = useCallback((reason: string) => {
    setGameOverReason(reason);
    setGameState('game_over');
  }, []);

  const handleRetryFloor = useCallback(() => {
    setGameState('playing');
    phaserRef.current?.restartFloor();
  }, []);

  const handleReturnHome = useCallback(() => {
    setNewlyUnlockedMedals([]);
    setGameState('title');
  }, []);

  const currentFloorData = FLOORS_DATA.find(f => f.floorNumber === currentFloor) || FLOORS_DATA[0];
  const currentForestSector = FOREST_SECTORS.find(s => s.sectorNumber === currentFloor) || FOREST_SECTORS[0];
  const currentFloodSector = FLOOD_SECTORS.find(s => s.sectorNumber === currentFloor) || FLOOD_SECTORS[0];
  const activeTools =
    activeMissionId === 'forest_fire'
      ? FOREST_TOOLS
      : activeMissionId === 'flood_rescue' && currentFloodSector.vehiclePolicy === 'mixed'
        ? FLOOD_VEHICLES
        : undefined;

  return (
    <div
      className="fixed inset-0 w-full overflow-hidden bg-slate-950 font-sans select-none"
      style={{ height: 'var(--app-height, 100dvh)', width: 'var(--app-width, 100vw)' }}
    >
      {/* Offline Connectivity Notification */}
      <OfflineIndicator />

      {/* Instructions Modal (Available anytime) */}
      {showInstructions && (
        <InstructionsModal onClose={() => setShowInstructions(false)} />
      )}

      {/* 1. CBMMG Operations Hub (Title Screen) */}
      {gameState === 'title' && (
        <TitleScreen
          saveState={hubSave}
          onSelectCharacter={handleSelectCharacter}
          onLaunchMissionStage={handleLaunchMissionStage}
          onOpenInstructions={() => setShowInstructions(true)}
          onResetProgress={handleResetProgress}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          isFullscreen={isFullscreen}
          onToggleFullscreen={isFullscreenSupported ? toggleFullscreen : undefined}
          isStandalone={isStandalone}
        />
      )}

      {/* 2. Active Game Session (Mounted during playing, paused, briefing, floor_clear, game_over) */}
      {gameState !== 'title' && gameState !== 'grand_victory' && (
        <div className="relative w-full h-full">
          {/* Isolated Canvas Container */}
          <PhaserGame
            ref={phaserRef}
            missionId={activeMissionId}
            characterId={selectedCharacter}
            floorNumber={currentFloor}
            initialScore={score}
            fireSpreadSpeed={fireSpreadSpeed}
            onHudUpdate={handleHudUpdate}
            onFloorClear={handleFloorClear}
            onGameOver={handleGameOver}
          />

          {/* Low Occlusion Perimeter HUD */}
          <GameHUD
            hud={hudState}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onPause={() => setGameState('paused')}
            isFullscreen={isFullscreen}
            onToggleFullscreen={isFullscreenSupported ? toggleFullscreen : undefined}
            fireSpreadSpeed={fireSpreadSpeed}
            stageTerm={activeMission.stageTermSingular.toUpperCase()}
            totalStages={activeMission.totalStages}
            tools={activeTools}
            onSelectTool={(id) => phaserRef.current?.setTool(id)}
          />

          {/* Mobile Ergonomic Touch Controls */}
          {gameState === 'playing' && (
            <TouchControls
              onMove={(vx, vy) => phaserRef.current?.setMovement(vx, vy)}
              onSpray={(spraying) => phaserRef.current?.setSpraying(spraying)}
              onInteract={() => phaserRef.current?.triggerInteract()}
              contextualAction={hudState.contextualAction ?? null}
              currentFloor={currentFloor}
              extinguisherPercent={hudState.extinguisher}
              extraLift={extraLift}
              primaryControl={activeMission.primaryControl}
              tools={activeTools}
              activeToolId={hudState.activeToolId ?? (activeMissionId === 'flood_rescue' ? currentFloodSector.initialVehicle : 'water')}
              onSelectTool={(id) => phaserRef.current?.setTool(id)}
            />
          )}

          {/* Briefing Modal before entering stage */}
          {gameState === 'briefing' && (
            <FloorBriefingModal
              floor={currentFloorData}
              forestSector={activeMissionId === 'forest_fire' ? currentForestSector : undefined}
              floodSector={activeMissionId === 'flood_rescue' ? currentFloodSector : undefined}
              missionTitle={activeMission.title}
              stageTerm={activeMission.stageTermSingular.toUpperCase()}
              totalStages={activeMission.totalStages}
              onStartFloor={handleStartFloor}
              onBackToHub={handleReturnHome}
            />
          )}

          {/* Pause Modal */}
          {gameState === 'paused' && (
            <PauseModal
              floorNumber={currentFloor}
              score={score}
              isMuted={isMuted}
              missionId={activeMissionId}
              onResume={() => setGameState('playing')}
              onRestartFloor={handleRetryFloor}
              onHome={handleReturnHome}
              onToggleMute={handleToggleMute}
              isFullscreen={isFullscreen}
              onToggleFullscreen={isFullscreenSupported ? toggleFullscreen : undefined}
              extraLift={extraLift}
              onToggleExtraLift={() => setExtraLift(prev => !prev)}
              onOpenInstructions={() => setShowInstructions(true)}
            />
          )}

          {/* Floor Cleared Modal */}
          {gameState === 'floor_clear' && (
            <FloorClearModal
              floorNumber={currentFloor}
              score={score}
              stars={floorStars}
              missionId={activeMissionId}
              fireSpreadIncreased={fireSpreadIncreased}
              fireSpreadSpeed={fireSpreadSpeed}
              newlyUnlockedMedals={newlyUnlockedMedals}
              onNextFloor={handleNextFloor}
              onReturnHub={handleReturnHome}
            />
          )}

          {/* Game Over Modal */}
          {gameState === 'game_over' && (
            <GameOverModal
              floorNumber={currentFloor}
              reason={gameOverReason}
              score={score}
              missionId={activeMissionId}
              onRetry={handleRetryFloor}
              onHome={handleReturnHome}
            />
          )}
        </div>
      )}

      {/* 3. Grand Victory Modal */}
      {gameState === 'grand_victory' && (
        <GrandVictoryModal
          characterId={selectedCharacter}
          totalScore={score}
          missionId={activeMissionId}
          newlyUnlockedMedals={newlyUnlockedMedals}
          onPlayAgain={() => {
            setCurrentFloor(1);
            setScore(0);
            setFireSpreadSpeed(1.0);
            setFireSpreadIncreased(false);
            setNewlyUnlockedMedals([]);
            setGameState('briefing');
          }}
          onReturnHub={handleReturnHome}
        />
      )}
    </div>
  );
}
