import React, { useRef, useState, useEffect } from 'react';
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
    if (touchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;
    setIsDragging(true);
    updateJoystick(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === touchIdRef.current) {
        updateJoystick(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
        break;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
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
    const maxRadius = 45;

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
    <div className="absolute inset-0 pointer-events-none z-30 select-none flex justify-between items-end p-4 pb-6">
      {/* Left: Virtual Joystick */}
      <div className="pointer-events-auto touch-none">
        <div
          ref={joystickBaseRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          className="relative w-28 h-28 rounded-full bg-slate-900/60 border-2 border-orange-500/40 backdrop-blur-xs flex items-center justify-center shadow-2xl active:border-orange-400"
        >
          {/* Base guide marks */}
          <div className="absolute w-12 h-12 rounded-full border border-orange-500/20" />
          <div className="absolute top-1 text-[9px] text-orange-400/70 font-bold">▲</div>
          <div className="absolute bottom-1 text-[9px] text-orange-400/70 font-bold">▼</div>
          <div className="absolute left-1.5 text-[9px] text-orange-400/70 font-bold">◀</div>
          <div className="absolute right-1.5 text-[9px] text-orange-400/70 font-bold">▶</div>

          {/* Stick Knob */}
          <div
            className={`w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg border-2 border-amber-300 flex items-center justify-center transition-transform ${isDragging ? 'scale-95' : ''}`}
            style={{
              transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`,
              transition: isDragging ? 'none' : 'transform 0.15s ease-out'
            }}
          >
            <span className="text-white text-xs font-black">🚒</span>
          </div>
        </div>
      </div>

      {/* Right: Action Buttons */}
      <div className="pointer-events-auto flex items-end gap-3 touch-none">
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
          className={`w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center shadow-xl transition-all ${
            isSprinting
              ? 'bg-amber-500 border-amber-200 scale-95'
              : 'bg-slate-900/80 border-amber-500/60 text-amber-300'
          }`}
        >
          <span className="text-lg">⚡</span>
          <span className="text-[9px] font-bold tracking-tight">CORRER</span>
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
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 border-2 border-emerald-300/80 text-white flex flex-col items-center justify-center shadow-xl active:scale-95 transition-all"
        >
          <span className="text-xl">🤝</span>
          <span className="text-[10px] font-extrabold tracking-wider mt-0.5">SALVAR</span>
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
          className={`w-20 h-20 rounded-3xl border-3 flex flex-col items-center justify-center shadow-2xl transition-all ${
            isSpraying
              ? 'bg-gradient-to-br from-cyan-500 to-blue-600 border-cyan-200 scale-95 ring-4 ring-cyan-400/40'
              : 'bg-gradient-to-br from-orange-600 to-red-600 border-orange-300 text-white'
          }`}
        >
          <span className="text-2xl animate-pulse">🧯</span>
          <span className="text-[10px] font-black tracking-wider uppercase mt-0.5">EXTINGUIR</span>
        </button>
      </div>
    </div>
  );
};
