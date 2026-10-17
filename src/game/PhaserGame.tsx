import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import Phaser from 'phaser';
import { GameScene } from './GameScene';
import { CharacterId, GameHUDState } from './types';

export interface PhaserGameRef {
  setMovement: (vx: number, vy: number) => void;
  setSpraying: (spraying: boolean) => void;
  setSprinting: (sprinting: boolean) => void;
  triggerInteract: () => void;
  restartFloor: () => void;
}

interface PhaserGameProps {
  characterId: CharacterId;
  floorNumber: number;
  initialScore: number;
  onHudUpdate: (hud: GameHUDState) => void;
  onFloorClear: (score: number, stars: number) => void;
  onGameOver: (reason: string) => void;
}

export const PhaserGame = forwardRef<PhaserGameRef, PhaserGameProps>(({
  characterId,
  floorNumber,
  initialScore,
  onHudUpdate,
  onFloorClear,
  onGameOver
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<GameScene | null>(null);

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
    restartFloor: () => {
      if (gameRef.current && sceneRef.current) {
        sceneRef.current.scene.restart({
          characterId,
          floorNumber,
          initialScore,
          onHudUpdate,
          onFloorClear,
          onGameOver
        });
      }
    }
  }));

  useEffect(() => {
    if (!containerRef.current) return;

    // Responsive sizing matching container width/height
    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 600;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      width,
      height,
      backgroundColor: '#090d16',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          fps: 60,
          debug: false
        }
      },
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      scene: [GameScene]
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    // Start scene with initial parameters
    game.events.once('ready', () => {
      const activeScene = game.scene.getScene('GameScene') as GameScene;
      sceneRef.current = activeScene;
      activeScene.scene.start('GameScene', {
        characterId,
        floorNumber,
        initialScore,
        onHudUpdate,
        onFloorClear,
        onGameOver
      });
    });

    const handleResize = () => {
      if (gameRef.current && containerRef.current) {
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        gameRef.current.scale.resize(w, h);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
        sceneRef.current = null;
      }
    };
  }, [floorNumber, characterId]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full absolute inset-0 overflow-hidden bg-slate-950 cursor-crosshair select-none"
    />
  );
});
