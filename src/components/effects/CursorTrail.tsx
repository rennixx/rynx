import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface TrailPoint {
  x: number;
  y: number;
  opacity: number;
  char: string;
  age: number;
}

const TRAIL_CHARS = ['<', '>', '{', '}', '[', ']', '(', ')', '/', '\\', '|', '-', '_', '+', '='];

const CursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailPointsRef = useRef<TrailPoint[]>([]);
  const animationFrameRef = useRef<number>(0);
  const isVisibleRef = useRef(true);
  const hasPointsRef = useRef(false);
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

    // Pause when tab hidden
    const handleVisibility = () => {
      isVisibleRef.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const handleMouseMove = (e: MouseEvent) => {
      trailPointsRef.current.push({
        x: e.clientX + (Math.random() - 0.5) * 20,
        y: e.clientY + (Math.random() - 0.5) * 20,
        opacity: 0.8,
        char: TRAIL_CHARS[Math.floor(Math.random() * TRAIL_CHARS.length)],
        age: 0,
      });

      if (trailPointsRef.current.length > 15) {
        trailPointsRef.current.shift();
      }
      hasPointsRef.current = true;
    };

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      // Skip work when hidden or no points
      if (!isVisibleRef.current) return;
      if (!hasPointsRef.current) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      trailPointsRef.current = trailPointsRef.current.filter(point => {
        point.age += 1;
        point.opacity = Math.max(0, 0.8 - point.age * 0.05);

        if (point.opacity > 0) {
          ctx.font = '16px "JetBrains Mono Variable", monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          const gradient = ctx.createRadialGradient(
            point.x, point.y, 0,
            point.x, point.y, 20
          );
          // Use primary/accent-ish palette (oklch values mapped to sRGB approximations)
          gradient.addColorStop(0, `rgba(160, 140, 255, ${point.opacity})`);
          gradient.addColorStop(0.5, `rgba(120, 90, 230, ${point.opacity * 0.7})`);
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
