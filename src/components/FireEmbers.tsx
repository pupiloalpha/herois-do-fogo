import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  angle: number;
  angularSpeed: number;
  opacity: number;
  maxOpacity: number;
  color: string;
  glow: string;
}

interface FireEmbersProps {
  count?: number;
  className?: string;
}

export const FireEmbers: React.FC<FireEmbersProps> = ({
  count = 35,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const colors = [
      { fill: 'rgba(254, 240, 138, ', glow: 'rgba(250, 204, 21, 0.9)' }, // yellow-200 / gold
      { fill: 'rgba(253, 186, 116, ', glow: 'rgba(251, 146, 60, 0.9)' }, // orange-300
      { fill: 'rgba(251, 146, 60, ',  glow: 'rgba(249, 115, 22, 0.9)' }, // orange-400
      { fill: 'rgba(248, 113, 113, ', glow: 'rgba(239, 68, 68, 0.8)' },  // red-400
      { fill: 'rgba(252, 211, 77, ',  glow: 'rgba(245, 158, 11, 0.9)' }, // amber-300
    ];

    const createParticle = (spawnAnywhere = false): Particle => {
      const colorScheme = colors[Math.floor(Math.random() * colors.length)];
      return {
        x: Math.random() * width,
        y: spawnAnywhere ? Math.random() * height : height + Math.random() * 25,
        size: Math.random() * 2.4 + 1.2,
        speedY: -(Math.random() * 1.3 + 0.6),
        speedX: (Math.random() - 0.5) * 0.5,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.035,
        opacity: Math.random() * 0.35 + 0.1,
        maxOpacity: Math.random() * 0.55 + 0.4,
        color: colorScheme.fill,
        glow: colorScheme.glow,
      };
    };

    const particles: Particle[] = Array.from({ length: count }, () =>
      createParticle(true)
    );

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          p.y += p.speedY;
          p.angle += p.angularSpeed;
          p.x += Math.sin(p.angle) * 0.8 + p.speedX;

          // Fade in near bottom, fade out near top
          const progress = p.y / height;
          if (progress > 0.8) {
            p.opacity = Math.min(p.maxOpacity, p.opacity + 0.02);
          } else if (progress < 0.25) {
            p.opacity = Math.max(0, p.opacity - 0.012);
          }
        }

        if (p.y < -15 || p.x < -15 || p.x > width + 15 || p.opacity <= 0) {
          particles[i] = createParticle(false);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.shadowBlur = p.size * 3.5;
        ctx.shadowColor = p.glow;
        ctx.fill();
        ctx.restore();
      }

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
      aria-hidden="true"
    />
  );
};
