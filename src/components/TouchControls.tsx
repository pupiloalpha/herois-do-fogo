import React, { useRef, useState } from 'react';
import { sounds } from '../audio/SoundManager';

interface TouchControlsProps {
  onMove: (vx: number, vy: number) => void;
  onSpray: (spraying: boolean) => void;
  onSprint: (sprinting: boolean) => void;
  onInteract: () => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onMove,
  onSpray,
  onSprint,
  onInteract,
}) => {
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const [joystickPos, setJoystickPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const touchIdRef = useRef<number | null>(null);

  const [isSpraying, setIsSpraying] = useState(false);
  const [isSprinting, setIsSprinting] = useState(false);

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
    const maxRadius = 40;

    const dist = Math.hypot(dx, dy);
    const clampedDist = Math.min(dist, maxRadius);
    const angle = Math.atan2(dy, dx);

    const stickX = Math.cos(angle) * clampedDist;
    const stickY = Math.sin(angle) * clampedDist;

    setJoystickPos({ x: stickX, y: stickY });

    // Normalize -1 to 1 vector
    const normX = stickX / maxRadius;
    const normY = stickY / maxRadius;
    onMove(normX, normY);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 pointer-events-none z-40 select-none flex justify-between items-end p-2.5 sm:p-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      {/* Left: Virtual Joystick */}
      <div className="pointer-events-auto touch-none">
        <div
          ref={joystickBaseRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-slate-900/80 border-2 border-orange-500/50 backdrop-blur-xs flex items-center justify-center shadow-2xl active:border-orange-400"
        >
          {/* Base guide marks */}
          <div className="absolute w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-orange-500/30" />
          <div className="absolute top-1 text-[8px] sm:text-[9px] text-orange-400/80 font-bold">▲</div>
          <div className="absolute bottom-1 text-[8px] sm:text-[9px] text-orange-400/80 font-bold">▼</div>
          <div className="absolute left-1.5 text-[8px] sm:text-[9px] text-orange-400/80 font-bold">◀</div>
          <div className="absolute right-1.5 text-[8px] sm:text-[9px] text-orange-400/80 font-bold">▶</div>

          {/* Stick Knob */}
          <div
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 shadow-xl border-2 border-amber-300 flex items-center justify-center transition-transform ${isDragging ? 'scale-95 ring-4 ring-orange-500/30' : ''}`}
            style={{
              transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`,
              transition: isDragging ? 'none' : 'transform 0.15s ease-out'
            }}
          >
            <span className="text-white text-xs font-black">🚒</span>
          </div>
        </div>
      </div>

      {/* Right: Ergonomic Action Buttons */}
      <div className="pointer-events-auto flex items-end gap-2 sm:gap-3 touch-none">
        {/* Sprint Button */}
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            setIsSprinting(true);
            onSprint(true);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            setIsSprinting(false);
            onSprint(false);
          }}
          onMouseDown={() => {
            setIsSprinting(true);
            onSprint(true);
          }}
          onMouseUp={() => {
            setIsSprinting(false);
            onSprint(false);
          }}
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 flex flex-col items-center justify-center shadow-xl transition-all ${
            isSprinting
              ? 'bg-amber-500 border-amber-200 scale-95 ring-4 ring-amber-400/30'
              : 'bg-slate-900/85 border-amber-500/60 text-amber-300'
          }`}
          title="Correr"
        >
          <span className="text-base sm:text-lg">⚡</span>
          <span className="text-[8px] sm:text-[9px] font-black tracking-tight">CORRER</span>
        </button>

        {/* Interact / Rescue Button */}
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
          className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 border-2 border-emerald-300/80 text-white flex flex-col items-center justify-center shadow-xl active:scale-95 transition-all"
          title="Salvar / Interagir"
        >
          <span className="text-lg sm:text-xl">🤝</span>
          <span className="text-[9px] sm:text-[10px] font-extrabold tracking-wider mt-0.5">SALVAR</span>
        </button>

        {/* Extinguisher Spray Button */}
        <button
          onTouchStart={(e) => {
            e.preventDefault();
            setIsSpraying(true);
            onSpray(true);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            setIsSpraying(false);
            onSpray(false);
          }}
          onMouseDown={() => {
            setIsSpraying(true);
            onSpray(true);
          }}
          onMouseUp={() => {
            setIsSpraying(false);
            onSpray(false);
          }}
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl border-3 flex flex-col items-center justify-center shadow-2xl transition-all ${
            isSpraying
              ? 'bg-gradient-to-br from-cyan-500 to-blue-600 border-cyan-200 scale-95 ring-4 ring-cyan-400/50'
              : 'bg-gradient-to-br from-orange-600 to-red-600 border-orange-300 text-white'
          }`}
          title="Extinguir Chamas"
        >
          <span className="text-xl sm:text-2xl animate-pulse">🧯</span>
          <span className="text-[9px] sm:text-[10px] font-black tracking-wider uppercase mt-0.5">EXTINGUIR</span>
        </button>
      </div>
    </div>
  );
};
