import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import type PhaserType from 'phaser';
import type { GameScene as GameSceneType } from './GameScene';
import type { ForestScene as ForestSceneType } from './forest/ForestScene';
import type { FloodScene as FloodSceneType } from './flood/FloodScene';
import { CharacterId, GameHUDState } from './types';
import { MissionId } from '../hub/types';

type ActiveSceneInstance = GameSceneType | ForestSceneType | FloodSceneType;

export interface PhaserGameRef {
  setMovement: (vx: number, vy: number) => void;
  setSpraying: (spraying: boolean) => void;
  setSprinting: (sprinting: boolean) => void;
  triggerInteract: () => void;
  setTool: (toolId: string) => void;
  restartFloor: () => void;
}

interface PhaserGameProps {
  missionId?: MissionId;
  characterId: CharacterId;
  floorNumber: number;
  initialScore: number;
  fireSpreadSpeed?: number;
  onHudUpdate: (hud: GameHUDState) => void;
  onFloorClear: (score: number, stars: number, remainingHealth: number, maxHealth: number) => void;
  onGameOver: (reason: string) => void;
}

export const PhaserGame = forwardRef<PhaserGameRef, PhaserGameProps>(({
  missionId = 'vertical_10',
  characterId,
  floorNumber,
  initialScore,
  fireSpreadSpeed = 1.0,
  onHudUpdate,
  onFloorClear,
  onGameOver,
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<PhaserType.Game | null>(null);
  const sceneRef = useRef<ActiveSceneInstance | null>(null);
  const [isEngineReady, setIsEngineReady] = useState(false);

  const latestSpreadSpeedRef = useRef<number>(fireSpreadSpeed);
  latestSpreadSpeedRef.current = fireSpreadSpeed;

  const latestInitialScoreRef = useRef<number>(initialScore);
  latestInitialScoreRef.current = initialScore;

  const callbacksRef = useRef({ onHudUpdate, onFloorClear, onGameOver });
  callbacksRef.current = { onHudUpdate, onFloorClear, onGameOver };

  // Expose imperative handle for mobile touch controls
  useImperativeHandle(ref, () => ({
    setMovement: (vx: number, vy: number) => {
      sceneRef.current?.setMovement(vx, vy);
    },
    setSpraying: (spraying: boolean) => {
      sceneRef.current?.setSpraying(spraying);
    },
    setSprinting: (sprinting: boolean) => {
      sceneRef.current?.setSprinting(sprinting);
    },
    triggerInteract: () => {
      sceneRef.current?.triggerInteract();
    },
    setTool: (toolId: string) => {
      if (sceneRef.current && 'setTool' in sceneRef.current && typeof sceneRef.current.setTool === 'function') {
        sceneRef.current.setTool(toolId);
      }
    },
    restartFloor: () => {
      if (gameRef.current && sceneRef.current) {
        sceneRef.current.scene.restart({
          characterId,
          floorNumber,
          initialScore: latestInitialScoreRef.current,
          fireSpreadSpeed: latestSpreadSpeedRef.current,
          onHudUpdate: (hud: GameHUDState) => callbacksRef.current.onHudUpdate(hud),
          onFloorClear: (s: number, st: number, rh: number, mh: number) =>
            callbacksRef.current.onFloorClear(s, st, rh, mh),
          onGameOver: (reason: string) => callbacksRef.current.onGameOver(reason),
        });
      }
    },
  }));

  useEffect(() => {
    let isCancelled = false;
    let resizeCleanup: (() => void) | null = null;
    setIsEngineReady(false);

    async function mountMissionEngine() {
      if (!containerRef.current) return;

      const isForest = missionId === 'forest_fire';
      const isFlood = missionId === 'flood_rescue';
      const [{ default: Phaser }, sceneModule] = await Promise.all([
        import('phaser'),
        isForest
          ? import('./forest/ForestScene')
          : isFlood
            ? import('./flood/FloodScene')
            : import('./GameScene'),
      ]);

      if (isCancelled || !containerRef.current) return;

      const SceneClass = isForest
        ? (sceneModule as typeof import('./forest/ForestScene')).ForestScene
        : isFlood
          ? (sceneModule as typeof import('./flood/FloodScene')).FloodScene
          : (sceneModule as typeof import('./GameScene')).GameScene;
      const sceneKey = isForest ? 'ForestScene' : isFlood ? 'FloodScene' : 'GameScene';

      const width = containerRef.current.clientWidth || 800;
      const height = containerRef.current.clientHeight || 600;

      const config: PhaserType.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: containerRef.current,
        width,
        height,
        backgroundColor: isForest ? '#1a2e05' : isFlood ? '#082f49' : '#090d16',
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { x: 0, y: 0 },
            fps: 60,
            debug: false,
          },
        },
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        scene: [SceneClass],
      };

      const game = new Phaser.Game(config);
      gameRef.current = game;

      game.events.once('ready', () => {
        if (isCancelled) return;
        const activeScene = game.scene.getScene(sceneKey) as ActiveSceneInstance;
        sceneRef.current = activeScene;
        activeScene.scene.start(sceneKey, {
          characterId,
          floorNumber,
          initialScore: latestInitialScoreRef.current,
          fireSpreadSpeed: latestSpreadSpeedRef.current,
          onHudUpdate: (hud: GameHUDState) => callbacksRef.current.onHudUpdate(hud),
          onFloorClear: (s: number, st: number, rh: number, mh: number) =>
            callbacksRef.current.onFloorClear(s, st, rh, mh),
          onGameOver: (reason: string) => callbacksRef.current.onGameOver(reason),
        });
        setIsEngineReady(true);
      });

      const handleResize = () => {
        if (gameRef.current && containerRef.current) {
          const w = containerRef.current.clientWidth;
          const h = containerRef.current.clientHeight;
          gameRef.current.scale.resize(w, h);
        }
      };

      window.addEventListener('resize', handleResize);
      window.visualViewport?.addEventListener('resize', handleResize);

      resizeCleanup = () => {
        window.removeEventListener('resize', handleResize);
        window.visualViewport?.removeEventListener('resize', handleResize);
      };
    }

    mountMissionEngine();

    return () => {
      isCancelled = true;
      resizeCleanup?.();
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
        sceneRef.current = null;
      }
    };
  }, [missionId, floorNumber, characterId]);

  return (
    <div className="w-full h-full absolute inset-0 overflow-hidden bg-slate-950 select-none">
      <div
        ref={containerRef}
        className="w-full h-full absolute inset-0 overflow-hidden bg-slate-950 cursor-crosshair select-none"
      />
      {!isEngineReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 text-slate-300 z-10 pointer-events-none gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
          <span className="text-xs font-semibold tracking-wide text-slate-400">
            Preparando operação...
          </span>
        </div>
      )}
    </div>
  );
});
