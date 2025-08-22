import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface TrailPoint {
  x: number;
  y: number;
  opacity: number;
  char: string;
  age: number;
}

const CursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailPointsRef = useRef<TrailPoint[]>([]);
  const animationFrameRef = useRef<number>(0);
  const prefersReducedMotion = useReducedMotion();
  const [isActive, setIsActive] = useState(false);

  const trailChars = ['<', '>', '{', '}', '[', ']', '(', ')', '/', '\\', '|', '-', '_', '+', '='];

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

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setIsActive(true);

      // Add new trail point
      trailPointsRef.current.push({
        x: mouseX + (Math.random() - 0.5) * 20,
        y: mouseY + (Math.random() - 0.5) * 20,
        opacity: 0.8,
        char: trailChars[Math.floor(Math.random() * trailChars.length)],
        age: 0,
      });

      // Limit trail points
      if (trailPointsRef.current.length > 15) {
        trailPointsRef.current.shift();
      }
    };

    const handleMouseLeave = () => {
      setIsActive(false);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw trail points
      trailPointsRef.current = trailPointsRef.current.filter(point => {
        point.age += 1;
        point.opacity = Math.max(0, 0.8 - (point.age * 0.05));

        if (point.opacity > 0) {
          ctx.font = '16px JetBrains Mono, monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          // Create gradient effect
          const gradient = ctx.createRadialGradient(
            point.x, point.y, 0,
            point.x, point.y, 20
          );
          gradient.addColorStop(0, `rgba(59, 130, 246, ${point.opacity})`);
          gradient.addColorStop(0.5, `rgba(139, 92, 246, ${point.opacity * 0.7})`);
          gradient.addColorStop(1, `rgba(59, 130, 246, 0)`);
          
          ctx.fillStyle = gradient;
          ctx.fillText(point.char, point.x, point.y);
          
          return true;
        }
        return false;
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [prefersReducedMotion, trailChars]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-50 transition-opacity duration-300 ${
        isActive ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ background: 'transparent' }}
    />
  );
};

export default CursorTrail;
