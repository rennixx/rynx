import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface TrailPoint {
  x: number;
  y: number;
  opacity: number;
  char: string;
  age: number;
}

const TRAIL_CHARS = ['<', '>', '{', '}', '/', '|', '·'];

const CursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailPointsRef = useRef<TrailPoint[]>([]);
  const animationFrameRef = useRef<number>(0);
  const isVisibleRef = useRef(true);
  const hasPointsRef = useRef(false);
  const lastSpawnRef = useRef(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleVisibility = () => {
      isVisibleRef.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      // Throttle spawning — one point every 60 ms
      if (now - lastSpawnRef.current < 60) return;
      lastSpawnRef.current = now;

      trailPointsRef.current.push({
        x: e.clientX + (Math.random() - 0.5) * 10,
        y: e.clientY + (Math.random() - 0.5) * 10,
        opacity: 0.45,
        char: TRAIL_CHARS[Math.floor(Math.random() * TRAIL_CHARS.length)],
        age: 0,
      });

      // Fewer simultaneous points for a lighter feel
      if (trailPointsRef.current.length > 6) {
        trailPointsRef.current.shift();
      }
      hasPointsRef.current = true;
    };

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return;
      if (!hasPointsRef.current) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      trailPointsRef.current = trailPointsRef.current.filter(point => {
        point.age += 1;
        // Faster decay — disappears in ~5 frames instead of ~16
        point.opacity = Math.max(0, 0.45 - point.age * 0.09);

        if (point.opacity > 0) {
          ctx.font = '11px "JetBrains Mono Variable", monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          const gradient = ctx.createRadialGradient(
            point.x, point.y, 0,
            point.x, point.y, 12
          );
          gradient.addColorStop(0, `rgba(160, 140, 255, ${point.opacity})`);
          gradient.addColorStop(0.6, `rgba(130, 105, 240, ${point.opacity * 0.5})`);
          gradient.addColorStop(1, `rgba(160, 140, 255, 0)`);

          ctx.fillStyle = gradient;
          ctx.fillText(point.char, point.x, point.y);
          return true;
        }
        return false;
      });

      hasPointsRef.current = trailPointsRef.current.length > 0;
    };

    document.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ background: 'transparent' }}
    />
  );
};

export default CursorTrail;
