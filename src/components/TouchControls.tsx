import React, { useRef, useState, useEffect, useCallback } from 'react';
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
        classes: 'bg-slate-900/85 border-amber-400/50 text-amber-300',
      };
    default:
      return {
        icon: '🤝',
        label: 'AÇÃO',
        classes: 'bg-slate-950/75 border-white/20 text-slate-200',
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
  const joystickZoneRef = useRef<HTMLDivElement>(null);
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const sprayBtnRef = useRef<HTMLButtonElement>(null);
  const interactBtnRef = useRef<HTMLButtonElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isAutoSprinting, setIsAutoSprinting] = useState(false);
  const [isSpraying, setIsSpraying] = useState(false);

  // Refs prevent re-attaching native listeners or causing React re-renders per touchmove
  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;
  const onSprayRef = useRef(onSpray);
  onSprayRef.current = onSpray;
  const onInteractRef = useRef(onInteract);
  onInteractRef.current = onInteract;

  const touchIdRef = useRef<number | null>(null);
  const mouseDraggingRef = useRef<boolean>(false);
  const autoSprintingRef = useRef<boolean>(false);
  const draggingRef = useRef<boolean>(false);
  const boundsRef = useRef<{ centerX: number; centerY: number; maxRadius: number } | null>(null);
  const rafPendingRef = useRef<number | null>(null);
  const latestStickRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const sprayTouchIdRef = useRef<number | null>(null);
  const sprayMinTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sprayPressedRef = useRef<boolean>(false);

  const applyKnobTransform = useCallback((x: number, y: number, animateReturn: boolean) => {
    const knob = knobRef.current;
    if (!knob) return;
    knob.style.transition = animateReturn ? 'transform 130ms ease-out' : 'none';
    knob.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
  }, []);

  const resetJoystick = useCallback(() => {
    touchIdRef.current = null;
    mouseDraggingRef.current = false;
    boundsRef.current = null;
    if (rafPendingRef.current !== null) {
      cancelAnimationFrame(rafPendingRef.current);
      rafPendingRef.current = null;
    }
    if (draggingRef.current) {
      draggingRef.current = false;
      setIsDragging(false);
    }
    if (autoSprintingRef.current) {
      autoSprintingRef.current = false;
      setIsAutoSprinting(false);
    }
    latestStickRef.current = { x: 0, y: 0 };
    applyKnobTransform(0, 0, true);
    onMoveRef.current(0, 0);
  }, [applyKnobTransform]);

  const updateJoystickFromCoords = useCallback(
    (clientX: number, clientY: number) => {
      let bounds = boundsRef.current;
      if (!bounds && joystickBaseRef.current) {
        const rect = joystickBaseRef.current.getBoundingClientRect();
        bounds = {
          centerX: rect.left + rect.width / 2,
          centerY: rect.top + rect.height / 2,
          maxRadius: Math.max(36, Math.min(46, rect.width * 0.42)),
        };
        boundsRef.current = bounds;
      }
      if (!bounds) return;

      const dx = clientX - bounds.centerX;
      const dy = clientY - bounds.centerY;
      const dist = Math.hypot(dx, dy);
      const clampedDist = Math.min(dist, bounds.maxRadius);
      const angle = Math.atan2(dy, dx);

      const stickX = dist > 0.001 ? Math.cos(angle) * clampedDist : 0;
      const stickY = dist > 0.001 ? Math.sin(angle) * clampedDist : 0;

      latestStickRef.current = { x: stickX, y: stickY };

      // Update visual knob directly on the compositor via rAF without React state re-render
      if (rafPendingRef.current === null) {
        rafPendingRef.current = requestAnimationFrame(() => {
          rafPendingRef.current = null;
          const pos = latestStickRef.current;
          applyKnobTransform(pos.x, pos.y, false);
        });
      }

      const normX = stickX / bounds.maxRadius;
      const normY = stickY / bounds.maxRadius;
      const nextAutoSprint = Math.hypot(normX, normY) >= 0.85;
      if (nextAutoSprint !== autoSprintingRef.current) {
        autoSprintingRef.current = nextAutoSprint;
        setIsAutoSprinting(nextAutoSprint);
      }

      onMoveRef.current(normX, normY);
    },
    [applyKnobTransform]
  );

  const startSpraying = useCallback(() => {
    sprayPressedRef.current = true;
    setIsSpraying(true);
    onSprayRef.current(true);

    if (sprayMinTimerRef.current) {
      clearTimeout(sprayMinTimerRef.current);
      sprayMinTimerRef.current = null;
    }
  }, []);

  const stopSpraying = useCallback(() => {
    sprayPressedRef.current = false;
    if (sprayMinTimerRef.current) clearTimeout(sprayMinTimerRef.current);
    sprayMinTimerRef.current = setTimeout(() => {
      if (!sprayPressedRef.current) {
        setIsSpraying(false);
        onSprayRef.current(false);
      }
    }, 240);
  }, []);

  // Native { passive: false } touch + window tracking so iOS Safari/PWA never throttles,
  // hijacks gestures, or loses the thumb when sliding off the joystick ring.
  useEffect(() => {
    const zone = joystickZoneRef.current;
    if (!zone) return;

    const handleNativeTouchStart = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      if (touchIdRef.current !== null) return;

      const touch = e.changedTouches[0];
      if (!touch) return;

      if (joystickBaseRef.current) {
        const rect = joystickBaseRef.current.getBoundingClientRect();
        boundsRef.current = {
          centerX: rect.left + rect.width / 2,
          centerY: rect.top + rect.height / 2,
          maxRadius: Math.max(36, Math.min(46, rect.width * 0.42)),
        };
      }

      touchIdRef.current = touch.identifier;
      if (!draggingRef.current) {
        draggingRef.current = true;
        setIsDragging(true);
      }
      updateJoystickFromCoords(touch.clientX, touch.clientY);
    };

    const handleWindowTouchMove = (e: TouchEvent) => {
      if (touchIdRef.current === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === touchIdRef.current) {
          if (e.cancelable) e.preventDefault();
          updateJoystickFromCoords(t.clientX, t.clientY);
          break;
        }
      }
    };

    const handleWindowTouchEnd = (e: TouchEvent) => {
      if (touchIdRef.current === null) return;
      let ended = false;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          ended = true;
          break;
        }
      }
      if (!ended) {
        // Safety net for iOS if a touch disappears from e.touches
        let stillActive = false;
        for (let i = 0; i < e.touches.length; i++) {
          if (e.touches[i].identifier === touchIdRef.current) {
            stillActive = true;
            break;
          }
        }
        ended = !stillActive;
      }
      if (ended) {
        resetJoystick();
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (touchIdRef.current !== null || e.button !== 0) return;
      e.preventDefault();
      if (joystickBaseRef.current) {
        const rect = joystickBaseRef.current.getBoundingClientRect();
        boundsRef.current = {
          centerX: rect.left + rect.width / 2,
          centerY: rect.top + rect.height / 2,
          maxRadius: Math.max(36, Math.min(46, rect.width * 0.42)),
        };
      }
      mouseDraggingRef.current = true;
      if (!draggingRef.current) {
        draggingRef.current = true;
        setIsDragging(true);
      }
      updateJoystickFromCoords(e.clientX, e.clientY);
    };

    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!mouseDraggingRef.current) return;
      updateJoystickFromCoords(e.clientX, e.clientY);
    };

    const handleWindowMouseUp = () => {
      if (!mouseDraggingRef.current) return;
      resetJoystick();
    };

    const handleVisibilityOrBlur = () => {
      if (touchIdRef.current !== null || mouseDraggingRef.current) {
        resetJoystick();
      }
      if (sprayPressedRef.current) {
        sprayTouchIdRef.current = null;
        stopSpraying();
      }
    };

    zone.addEventListener('touchstart', handleNativeTouchStart, { passive: false });
    zone.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('touchmove', handleWindowTouchMove, { passive: false });
    window.addEventListener('touchend', handleWindowTouchEnd, { passive: false });
    window.addEventListener('touchcancel', handleWindowTouchEnd, { passive: false });
    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);
    window.addEventListener('blur', handleVisibilityOrBlur);
    document.addEventListener('visibilitychange', handleVisibilityOrBlur);

    return () => {
      zone.removeEventListener('touchstart', handleNativeTouchStart);
      zone.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('touchmove', handleWindowTouchMove);
      window.removeEventListener('touchend', handleWindowTouchEnd);
      window.removeEventListener('touchcancel', handleWindowTouchEnd);
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
      window.removeEventListener('blur', handleVisibilityOrBlur);
      document.removeEventListener('visibilitychange', handleVisibilityOrBlur);
      if (rafPendingRef.current !== null) cancelAnimationFrame(rafPendingRef.current);
      if (sprayMinTimerRef.current) clearTimeout(sprayMinTimerRef.current);
    };
  }, [resetJoystick, stopSpraying, updateJoystickFromCoords]);

  // Native { passive: false } listeners for Spray & Interact buttons to isolate multi-touch on iPhone
  useEffect(() => {
    const sprayBtn = sprayBtnRef.current;
    const interactBtn = interactBtnRef.current;

    const onSprayTouchStart = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      const touch = e.changedTouches[0];
      if (touch) sprayTouchIdRef.current = touch.identifier;
      startSpraying();
    };

    const onSprayTouchEnd = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      if (sprayTouchIdRef.current === null) {
        stopSpraying();
        return;
      }
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === sprayTouchIdRef.current) {
          sprayTouchIdRef.current = null;
          stopSpraying();
          break;
        }
      }
    };

    const onInteractTouchStart = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      sounds.playClick();
      onInteractRef.current();
    };

    sprayBtn?.addEventListener('touchstart', onSprayTouchStart, { passive: false });
    sprayBtn?.addEventListener('touchend', onSprayTouchEnd, { passive: false });
    sprayBtn?.addEventListener('touchcancel', onSprayTouchEnd, { passive: false });
    interactBtn?.addEventListener('touchstart', onInteractTouchStart, { passive: false });

    return () => {
      sprayBtn?.removeEventListener('touchstart', onSprayTouchStart);
      sprayBtn?.removeEventListener('touchend', onSprayTouchEnd);
      sprayBtn?.removeEventListener('touchcancel', onSprayTouchEnd);
      interactBtn?.removeEventListener('touchstart', onInteractTouchStart);
    };
  }, [startSpraying, stopSpraying]);

  const actionMeta = getActionMeta(contextualAction, currentFloor);
  const activeTool = tools?.find((t) => t.id === activeToolId);
  const isTurboMode = primaryControl?.label === 'TURBO';
  const usesWater = !tools || activeToolId === 'water' || isTurboMode;
  const isTankEmpty = usesWater && extinguisherPercent <= 0;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 pointer-events-none z-40 select-none flex justify-between items-end px-3 sm:px-5 pt-2 ${
        extraLift
          ? 'pb-[max(2.25rem,calc(env(safe-area-inset-bottom)+24px))]'
          : 'pb-[max(0.85rem,calc(env(safe-area-inset-bottom)+8px))]'
      }`}
    >
      {/* Left: GPU-accelerated Virtual Joystick (generous touch zone, zero backdrop-blur stall on iOS) */}
      <div
        ref={joystickZoneRef}
        className="pointer-events-auto touch-none p-3 -m-3 select-none"
        style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none' }}
      >
        <div
          ref={joystickBaseRef}
          className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-950/70 border flex items-center justify-center shadow-xl ${
            isAutoSprinting
              ? 'border-amber-300 ring-2 ring-amber-400/40'
              : isDragging
                ? 'border-orange-400/85'
                : 'border-white/25'
          }`}
        >
          <div className="absolute w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 pointer-events-none" />

          <div
            ref={knobRef}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg border border-amber-200/80 flex items-center justify-center pointer-events-none will-change-transform"
            style={{ transform: 'translate3d(0px, 0px, 0)' }}
          >
            <span className="text-white text-sm font-bold">{isAutoSprinting ? '⚡' : '🚒'}</span>
          </div>
        </div>
      </div>

      {/* Right: Tool Bar + 2 Tactile Thumb Buttons */}
      <div className="pointer-events-auto flex flex-col items-end gap-2 touch-none">
        {tools && tools.length > 0 && onSelectTool && (
          <div className="flex items-center gap-1 bg-slate-950/80 border border-white/15 rounded-2xl p-1 shadow-xl">
            {tools.map((tool) => {
              const isSelected = tool.id === activeToolId;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onSelectTool(tool.id);
                  }}
                  className={`min-w-[42px] h-10 px-2 rounded-xl flex flex-col items-center justify-center touch-manipulation ${
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
            ref={interactBtnRef}
            type="button"
            onClick={() => {
              sounds.playClick();
              onInteract();
            }}
            className={`w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-2xl border flex flex-col items-center justify-center shadow-lg active:scale-95 transition-transform ${actionMeta.classes}`}
            title="Interagir com o objetivo próximo"
          >
            <span className="text-xl leading-none">{actionMeta.icon}</span>
            <span className="text-[9px] font-bold tracking-wide uppercase mt-1 leading-none">
              {actionMeta.label}
            </span>
          </button>

          {/* Primary Action Button */}
          <button
            ref={sprayBtnRef}
            type="button"
            onMouseDown={() => {
              startSpraying();
            }}
            onMouseUp={() => {
              stopSpraying();
            }}
            onMouseLeave={() => {
              if (sprayPressedRef.current) stopSpraying();
            }}
            className={`w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-3xl border flex flex-col items-center justify-center shadow-xl transition-transform ${
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
