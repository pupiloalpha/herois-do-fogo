import React, { useRef, useState, useEffect } from 'react';
import { sounds } from '../audio/SoundManager';
import { ContextualActionType } from '../game/types';
import { PrimaryControlMeta } from '../hub/types';

export interface TouchToolOption {
  id: string;
  icon: string;
  label: string;
}

interface TouchControlsProps {
  onMove: (vx: number, vy: number) => void;
  onSpray: (spraying: boolean) => void;
  onInteract: () => void;
  contextualAction?: ContextualActionType;
  currentFloor?: number;
  extinguisherPercent?: number;
  extraLift?: boolean;
  primaryControl?: PrimaryControlMeta;
  tools?: TouchToolOption[];
  activeToolId?: string;
  onSelectTool?: (toolId: string) => void;
}

function getActionMeta(action: ContextualActionType, currentFloor: number) {
  switch (action) {
    case 'civilian':
      return {
        icon: '🤝',
        label: 'SALVAR',
        classes: 'bg-emerald-500 border-emerald-200 text-slate-950 ring-2 ring-emerald-400/50 shadow-lg',
      };
    case 'pet_dog':
      return {
        icon: '🐶',
        label: 'RESGATAR',
        classes: 'bg-amber-400 border-amber-100 text-slate-950 ring-2 ring-amber-300/50 shadow-lg',
      };
    case 'pet_cat':
      return {
        icon: '🐱',
        label: 'RESGATAR',
        classes: 'bg-amber-400 border-amber-100 text-slate-950 ring-2 ring-amber-300/50 shadow-lg',
      };
    case 'wildlife':
      return {
        icon: '🦊',
        label: 'SALVAR',
        classes: 'bg-amber-400 border-amber-100 text-slate-950 ring-2 ring-amber-300/55 shadow-lg',
      };
    case 'hiker':
      return {
        icon: '🤝',
        label: 'RESGATAR',
        classes: 'bg-emerald-500 border-emerald-200 text-slate-950 ring-2 ring-emerald-400/50 shadow-lg',
      };
    case 'smoldering_log':
      return {
        icon: '🪣',
        label: 'ENTERRAR',
        classes: 'bg-orange-400 border-amber-100 text-slate-950 ring-2 ring-orange-300/50 shadow-lg',
      };
    case 'flood_victim':
      return {
        icon: '🛟',
        label: 'RESGATAR',
        classes: 'bg-sky-400 border-sky-100 text-slate-950 ring-2 ring-sky-300/55 shadow-lg',
      };
    case 'flood_shelter':
      return {
        icon: '🏥',
        label: 'ABRIGO',
        classes: 'bg-emerald-400 border-emerald-100 text-slate-950 ring-2 ring-emerald-300/55 shadow-lg',
      };
    case 'flood_swap_vehicle':
      return {
        icon: '🔄',
        label: 'VEÍCULO',
        classes: 'bg-sky-500 border-sky-200 text-slate-950 ring-2 ring-sky-300/50 shadow-lg',
      };
    case 'gas_valve':
      return {
        icon: '⚠️',
        label: 'FECHAR',
        classes: 'bg-purple-500 border-purple-200 text-white ring-2 ring-purple-300/50 shadow-lg',
      };
    case 'electric_panel':
      return {
        icon: '⚡',
        label: 'CORTAR',
        classes: 'bg-cyan-400 border-cyan-100 text-slate-950 ring-2 ring-cyan-300/50 shadow-lg',
      };
    case 'refill_station':
      return {
        icon: '🚰',
        label: 'RECARGA',
        classes: 'bg-sky-400 border-sky-100 text-slate-950 ring-2 ring-sky-300/55 shadow-lg',
      };
    case 'exit_door':
      return {
        icon: currentFloor === 10 ? '🚁' : '🚪',
        label: 'SAIR',
        classes: 'bg-emerald-400 border-emerald-100 text-slate-950 ring-2 ring-emerald-300/60 shadow-lg',
      };
    case 'exit_locked':
      return {
        icon: '🔒',
        label: 'METAS',
        classes: 'bg-slate-900/75 border-amber-400/50 text-amber-300',
      };
    default:
      return {
        icon: '🤝',
        label: 'AÇÃO',
        classes: 'bg-slate-950/60 border-white/20 text-slate-200',
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
  primaryControl,
  tools,
  activeToolId,
  onSelectTool,
}) => {
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const [joystickPos, setJoystickPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoSprinting, setIsAutoSprinting] = useState(false);
  const touchIdRef = useRef<number | null>(null);

  const [isSpraying, setIsSpraying] = useState(false);
  const sprayMinTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sprayPressedRef = useRef<boolean>(false);

  useEffect(() => {
    return () => {
      if (sprayMinTimerRef.current) clearTimeout(sprayMinTimerRef.current);
    };
  }, []);

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

    const normX = stickX / maxRadius;
    const normY = stickY / maxRadius;
    setIsAutoSprinting(Math.hypot(normX, normY) >= 0.85);
    onMove(normX, normY);
  };

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
  const activeTool = tools?.find((t) => t.id === activeToolId);
  const isTurboMode = primaryControl?.label === 'TURBO';
  const usesWater = !tools || activeToolId === 'water' || isTurboMode;
  const isTankEmpty = usesWater && extinguisherPercent <= 0;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 pointer-events-none z-40 select-none flex justify-between items-end px-3 sm:px-5 pt-2 transition-all duration-200 ${
        extraLift
          ? 'pb-[max(2.25rem,calc(env(safe-area-inset-bottom)+24px))]'
          : 'pb-[max(0.85rem,calc(env(safe-area-inset-bottom)+8px))]'
      }`}
    >
      {/* Left: Lightweight Frosted Virtual Joystick */}
      <div className="pointer-events-auto touch-none">
        <div
          ref={joystickBaseRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-950/55 backdrop-blur-sm border flex items-center justify-center shadow-xl transition-colors ${
            isAutoSprinting
              ? 'border-amber-300 ring-2 ring-amber-400/40'
              : isDragging
                ? 'border-orange-400/80'
                : 'border-white/20'
          }`}
        >
          <div className="absolute w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10" />

          <div
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg border border-amber-200/80 flex items-center justify-center transition-transform ${
              isDragging ? 'scale-95' : ''
            }`}
            style={{
              transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`,
              transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            }}
          >
            <span className="text-white text-sm font-bold">{isAutoSprinting ? '⚡' : '🚒'}</span>
          </div>
        </div>
      </div>

      {/* Right: Tool Bar + 2 Tactile Thumb Buttons */}
      <div className="pointer-events-auto flex flex-col items-end gap-2 touch-none">
        {tools && tools.length > 0 && onSelectTool && (
          <div className="flex items-center gap-1 bg-slate-950/70 backdrop-blur-md border border-white/15 rounded-2xl p-1 shadow-xl">
            {tools.map((tool) => {
              const isSelected = tool.id === activeToolId;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onTouchStart={(e) => {
                    e.preventDefault();
                    sounds.playClick();
                    onSelectTool(tool.id);
                  }}
                  onClick={() => {
                    sounds.playClick();
                    onSelectTool(tool.id);
                  }}
                  className={`min-w-[42px] h-10 px-2 rounded-xl flex flex-col items-center justify-center transition ${
                    isSelected
                      ? 'bg-emerald-400 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title={tool.label}
                >
                  <span className="text-sm leading-none">{tool.icon}</span>
                  <span className="text-[8px] font-bold uppercase mt-0.5 leading-none">
                    {tool.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex items-end gap-2.5">
          {/* Contextual Action Button */}
          <button
            type="button"
            onTouchStart={(e) => {
              e.preventDefault();
              sounds.playClick();
              onInteract();
            }}
            onClick={() => {
              sounds.playClick();
              onInteract();
            }}
            className={`w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-2xl border backdrop-blur-sm flex flex-col items-center justify-center shadow-lg active:scale-95 transition-all ${actionMeta.classes}`}
            title="Interagir com o objetivo próximo"
          >
            <span className="text-xl leading-none">{actionMeta.icon}</span>
            <span className="text-[9px] font-bold tracking-wide uppercase mt-1 leading-none">
              {actionMeta.label}
            </span>
          </button>

          {/* Primary Action Button */}
          <button
            type="button"
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
            className={`w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-3xl border flex flex-col items-center justify-center shadow-xl transition-all ${
              isTankEmpty
                ? 'bg-rose-950/90 border-rose-400 text-rose-200 active:scale-95'
                : isSpraying
                  ? 'bg-gradient-to-br from-sky-400 to-blue-600 border-sky-200 text-white scale-95 ring-2 ring-sky-300/60'
                  : 'bg-gradient-to-br from-orange-500 to-red-600 border-orange-300/80 text-white active:scale-95'
            }`}
            title={activeTool?.label ?? primaryControl?.label ?? 'Extinguir Chamas'}
          >
            <span className={`text-2xl leading-none ${isSpraying ? 'scale-110' : ''}`}>
              {activeTool && !isTurboMode
                ? activeTool.icon
                : isSpraying && primaryControl?.activeIcon
                  ? primaryControl.activeIcon
                  : primaryControl?.icon ?? '🧯'}
            </span>
            <span className="text-[9px] font-bold tracking-wider uppercase mt-1 leading-none">
              {isTankEmpty
                ? primaryControl?.emptyLabel ?? 'VAZIO'
                : isSpraying
                  ? primaryControl?.activeLabel ?? 'JATO'
                  : (activeTool && !isTurboMode ? activeTool.label : undefined) ?? primaryControl?.label ?? 'EXTINTOR'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
