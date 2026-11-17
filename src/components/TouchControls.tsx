import React, { useRef, useState, useEffect } from 'react';
import { sounds } from '../audio/SoundManager';
import { ContextualActionType } from '../game/types';

interface TouchControlsProps {
  onMove: (vx: number, vy: number) => void;
  onSpray: (spraying: boolean) => void;
  onInteract: () => void;
  contextualAction?: ContextualActionType;
  currentFloor?: number;
  extinguisherPercent?: number;
  extraLift?: boolean;
}

function getActionMeta(action: ContextualActionType, currentFloor: number) {
  switch (action) {
    case 'civilian':
      return {
        icon: '🤝',
        label: 'SALVAR',
        classes: 'bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-200 text-white ring-4 ring-emerald-400/35 shadow-emerald-500/30',
      };
    case 'pet_dog':
      return {
        icon: '🐶',
        label: 'RESGATAR',
        classes: 'bg-gradient-to-br from-amber-400 to-orange-500 border-amber-100 text-slate-950 ring-4 ring-amber-400/35 shadow-amber-500/30',
      };
    case 'pet_cat':
      return {
        icon: '🐱',
        label: 'RESGATAR',
        classes: 'bg-gradient-to-br from-amber-400 to-orange-500 border-amber-100 text-slate-950 ring-4 ring-amber-400/35 shadow-amber-500/30',
      };
    case 'gas_valve':
      return {
        icon: '⚠️',
        label: 'FECHAR',
        classes: 'bg-gradient-to-br from-purple-600 to-fuchsia-700 border-purple-200 text-white ring-4 ring-purple-400/35 shadow-purple-500/30',
      };
    case 'electric_panel':
      return {
        icon: '⚡',
        label: 'CORTAR',
        classes: 'bg-gradient-to-br from-cyan-500 to-sky-600 border-cyan-100 text-slate-950 ring-4 ring-cyan-400/35 shadow-cyan-500/30',
      };
    case 'refill_station':
      return {
        icon: '🚰',
        label: 'RECARGA',
        classes: 'bg-gradient-to-br from-sky-400 to-cyan-600 border-cyan-100 text-slate-950 ring-4 ring-cyan-400/45 shadow-cyan-500/40 animate-pulse',
      };
    case 'exit_door':
      return {
        icon: currentFloor === 10 ? '🚁' : '🚪',
        label: 'SAIR',
        classes: 'bg-gradient-to-br from-emerald-400 to-green-600 border-emerald-100 text-slate-950 ring-4 ring-emerald-400/50 shadow-emerald-500/40 animate-pulse',
      };
    case 'exit_locked':
      return {
        icon: '🔒',
        label: 'METAS',
        classes: 'bg-slate-900/85 border-amber-500/60 text-amber-300',
      };
    default:
      return {
        icon: '🤝',
        label: 'AÇÃO',
        classes: 'bg-slate-900/70 border-slate-600/70 text-slate-300',
      };
  }
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onMove,
  onSpray,
  onInteract,
  contextualAction = null,
  currentFloor = 1,
  extinguisherPercent = 100,
  extraLift = false,
}) => {
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const [joystickPos, setJoystickPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoSprinting, setIsAutoSprinting] = useState(false);
  const touchIdRef = useRef<number | null>(null);

  const [isSpraying, setIsSpraying] = useState(false);
  const sprayMinTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sprayPressedRef = useRef<boolean>(false);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (sprayMinTimerRef.current) clearTimeout(sprayMinTimerRef.current);
    };
  }, []);

  // Joystick touch handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setIsDragging(true);
    updateJoystick(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        updateJoystick(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
        break;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        touchIdRef.current = null;
        setIsDragging(false);
        setIsAutoSprinting(false);
        setJoystickPos({ x: 0, y: 0 });
        onMove(0, 0);
        break;
      }
    }
  };

  const updateJoystick = (clientX: number, clientY: number) => {
    if (!joystickBaseRef.current) return;
    const rect = joystickBaseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const maxRadius = 42;

    const dist = Math.hypot(dx, dy);
    const clampedDist = Math.min(dist, maxRadius);
    const angle = Math.atan2(dy, dx);

    const stickX = Math.cos(angle) * clampedDist;
    const stickY = Math.sin(angle) * clampedDist;

    setJoystickPos({ x: stickX, y: stickY });

    // Normalize -1 to 1 vector
    const normX = stickX / maxRadius;
    const normY = stickY / maxRadius;
    setIsAutoSprinting(Math.hypot(normX, normY) >= 0.85);
    onMove(normX, normY);
  };

  // Spray button triggers with guaranteed minimum burst time
  const startSpraying = () => {
    sprayPressedRef.current = true;
    setIsSpraying(true);
    onSpray(true);

    if (sprayMinTimerRef.current) clearTimeout(sprayMinTimerRef.current);
  };

  const stopSpraying = () => {
    sprayPressedRef.current = false;
    if (sprayMinTimerRef.current) clearTimeout(sprayMinTimerRef.current);
    sprayMinTimerRef.current = setTimeout(() => {
      if (!sprayPressedRef.current) {
        setIsSpraying(false);
        onSpray(false);
      }
    }, 280);
  };

  const actionMeta = getActionMeta(contextualAction, currentFloor);
  const isTankEmpty = extinguisherPercent <= 0;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 pointer-events-none z-40 select-none flex justify-between items-end px-3 sm:px-5 pt-2 transition-all duration-200 ${
        extraLift
          ? 'pb-[max(2.25rem,calc(env(safe-area-inset-bottom)+24px))]'
          : 'pb-[max(0.85rem,calc(env(safe-area-inset-bottom)+8px))]'
      }`}
    >
      {/* Left: Virtual Joystick (Auto-sprints at >= 85% tilt) */}
      <div className="pointer-events-auto touch-none">
        <div
          ref={joystickBaseRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-950/75 backdrop-blur-sm border-2 flex items-center justify-center shadow-2xl transition-colors ${
            isAutoSprinting
              ? 'border-amber-400 ring-4 ring-amber-400/25'
              : 'border-orange-500/50 active:border-orange-400'
          }`}
        >
          {/* Base guide marks */}
          <div className="absolute w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-orange-500/25" />
          <div className="absolute top-1 text-[8px] text-orange-400/75 font-bold">▲</div>
          <div className="absolute bottom-1 text-[8px] text-orange-400/75 font-bold">▼</div>
          <div className="absolute left-1.5 text-[8px] text-orange-400/75 font-bold">◀</div>
          <div className="absolute right-1.5 text-[8px] text-orange-400/75 font-bold">▶</div>

          {/* Stick Knob */}
          <div
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 shadow-xl border-2 border-amber-300 flex items-center justify-center transition-transform ${
              isDragging ? 'scale-95 ring-4 ring-orange-500/30' : ''
            }`}
            style={{
              transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`,
              transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            }}
          >
            <span className="text-white text-xs font-black">{isAutoSprinting ? '⚡' : '🚒'}</span>
          </div>
        </div>
      </div>

      {/* Right: 2 Ergonomic Thumb Buttons (Contextual Action + Extinguisher Spray) */}
      <div className="pointer-events-auto flex items-end gap-3 touch-none">
        {/* Contextual Action Button */}
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            sounds.playClick();
            onInteract();
          }}
          onClick={() => {
            sounds.playClick();
            onInteract();
          }}
          className={`w-16 h-16 sm:w-[70px] sm:h-[70px] rounded-2xl border-2 flex flex-col items-center justify-center shadow-xl active:scale-95 transition-all ${actionMeta.classes}`}
          title="Interagir com o objetivo próximo"
        >
          <span className="text-xl leading-none">{actionMeta.icon}</span>
          <span className="text-[9px] font-black tracking-wide uppercase mt-1 leading-none">
            {actionMeta.label}
          </span>
        </button>

        {/* Primary Extinguisher Spray Button */}
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            startSpraying();
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            stopSpraying();
          }}
          onTouchCancel={(e) => {
            e.preventDefault();
            stopSpraying();
          }}
          onMouseDown={() => {
            startSpraying();
          }}
          onMouseUp={() => {
            stopSpraying();
          }}
          className={`w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-3xl border-2 flex flex-col items-center justify-center shadow-2xl transition-all ${
            isTankEmpty
              ? 'bg-red-950/90 border-red-400 text-red-200 active:scale-95'
              : isSpraying
                ? 'bg-gradient-to-br from-cyan-400 to-blue-600 border-cyan-100 text-white scale-95 ring-4 ring-cyan-400/50'
                : 'bg-gradient-to-br from-orange-600 to-red-600 border-orange-300 text-white active:scale-95'
          }`}
          title="Extinguir Chamas"
        >
          <span className={`text-2xl leading-none ${isSpraying ? 'scale-110' : ''}`}>🧯</span>
          <span className="text-[9px] font-black tracking-wider uppercase mt-1 leading-none">
            {isTankEmpty ? 'VAZIO' : isSpraying ? 'JATO' : 'EXTINTOR'}
          </span>
        </button>
      </div>
    </div>
  );
};
