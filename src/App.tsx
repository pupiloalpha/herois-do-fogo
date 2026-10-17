/**
 * Heróis do Fogo: Missão 10 Andares
 * Jogo Arcade PWA com Foguinho e Faísca (CBMMG)
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CharacterId, GameHUDState } from './game/types';
import { FLOORS_DATA } from './game/floorsData';
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

type GameState = 'title' | 'briefing' | 'playing' | 'paused' | 'floor_clear' | 'game_over' | 'grand_victory';

export default function App() {
  // Sync real visible screen dimensions with CSS variables
  useVisualViewport();

  // Fullscreen mode controller to hide browser navigation bars
  const { isFullscreen, toggleFullscreen, enterFullscreen, isSupported: isFullscreenSupported } = useFullscreen();
  const [isStandalone] = useState(() => getIsStandalone());

  const [gameState, setGameState] = useState<GameState>('title');
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterId>('foguinho');
  const [currentFloor, setCurrentFloor] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [floorStars, setFloorStars] = useState<number>(3);
  const [gameOverReason, setGameOverReason] = useState<string>('');
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(sounds.getMuted());

  // HUD stats from Phaser engine
  const [hudState, setHudState] = useState<GameHUDState>({
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
  });

  const phaserRef = useRef<PhaserGameRef>(null);

  // Sound mute toggle
  const handleToggleMute = useCallback(() => {
    const nextMuted = sounds.toggleMute();
    setIsMuted(nextMuted);
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

  // Handlers for game flow
  const handleStartFromTitle = useCallback(() => {
    // If mobile browser, attempt to enter fullscreen on user click/tap
    if (isFullscreenSupported && !isFullscreen && !isStandalone && typeof window !== 'undefined' && window.innerWidth < 768) {
      enterFullscreen();
    }
    setCurrentFloor(1);
    setScore(0);
    setGameState('briefing');
  }, [isFullscreenSupported, isFullscreen, isStandalone, enterFullscreen]);

  const handleStartFloor = useCallback(() => {
    setGameState('playing');
  }, []);

  const handleHudUpdate = useCallback((hud: GameHUDState) => {
    setHudState(hud);
    setScore(hud.score);
  }, []);

  const handleFloorClear = useCallback((clearedScore: number, stars: number) => {
    setScore(clearedScore);
    setFloorStars(stars);
    if (currentFloor >= 10) {
      setGameState('grand_victory');
    } else {
      setGameState('floor_clear');
    }
  }, [currentFloor]);

  const handleNextFloor = useCallback(() => {
    if (currentFloor < 10) {
      setCurrentFloor(prev => prev + 1);
      setGameState('briefing');
    } else {
      setGameState('grand_victory');
    }
  }, [currentFloor]);

  const handleGameOver = useCallback((reason: string) => {
    setGameOverReason(reason);
    setGameState('game_over');
  }, []);

  const handleRetryFloor = useCallback(() => {
    setGameState('playing');
    phaserRef.current?.restartFloor();
  }, []);

  const handleReturnHome = useCallback(() => {
    setGameState('title');
  }, []);

  const currentFloorData = FLOORS_DATA.find(f => f.floorNumber === currentFloor) || FLOORS_DATA[0];

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

      {/* 1. Title Screen */}
      {gameState === 'title' && (
        <TitleScreen
          selectedCharacter={selectedCharacter}
          onSelectCharacter={setSelectedCharacter}
          onStartGame={handleStartFromTitle}
          onOpenInstructions={() => setShowInstructions(true)}
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
            characterId={selectedCharacter}
            floorNumber={currentFloor}
            initialScore={score}
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
          />

          {/* Mobile Ergonomic Touch Controls */}
          {gameState === 'playing' && (
            <TouchControls
              onMove={(vx, vy) => phaserRef.current?.setMovement(vx, vy)}
              onSpray={(spraying) => phaserRef.current?.setSpraying(spraying)}
              onSprint={(sprinting) => phaserRef.current?.setSprinting(sprinting)}
              onInteract={() => phaserRef.current?.triggerInteract()}
              isStandalone={isStandalone}
              isFullscreen={isFullscreen}
            />
          )}

          {/* Briefing Modal before entering floor */}
          {gameState === 'briefing' && (
            <FloorBriefingModal
              floor={currentFloorData}
              onStartFloor={handleStartFloor}
            />
          )}

          {/* Pause Modal */}
          {gameState === 'paused' && (
            <PauseModal
              floorNumber={currentFloor}
              score={score}
              isMuted={isMuted}
              onResume={() => setGameState('playing')}
              onRestartFloor={handleRetryFloor}
              onHome={handleReturnHome}
              onToggleMute={handleToggleMute}
              isFullscreen={isFullscreen}
              onToggleFullscreen={isFullscreenSupported ? toggleFullscreen : undefined}
            />
          )}

          {/* Floor Cleared Modal */}
          {gameState === 'floor_clear' && (
            <FloorClearModal
              floorNumber={currentFloor}
              score={score}
              stars={floorStars}
              onNextFloor={handleNextFloor}
            />
          )}

          {/* Game Over Modal */}
          {gameState === 'game_over' && (
            <GameOverModal
              floorNumber={currentFloor}
              reason={gameOverReason}
              score={score}
              onRetry={handleRetryFloor}
              onHome={handleReturnHome}
            />
          )}
        </div>
      )}

      {/* 3. Grand Rooftop Helicopter Evacuation Victory Modal */}
      {gameState === 'grand_victory' && (
        <GrandVictoryModal
          characterId={selectedCharacter}
          totalScore={score}
          onPlayAgain={() => {
            setCurrentFloor(1);
            setScore(0);
            setGameState('title');
          }}
        />
      )}
    </div>
  );
}
