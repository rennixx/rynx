import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface Dot {
  x: number;
  y: number;
  z: number;
  originalX: number;
  originalY: number;
  originalZ: number;
  radius: number;
  pulsePhase: number;
  pulseSpeed: number;
  opacity: number;
  distanceFromCenter: number;
}

const AnimatedCells: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const animationFrameRef = useRef<number>(0);
  const isVisibleRef = useRef(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const initDots = () => {
      const isMobile = window.innerWidth < 768;
      const dotCount = isMobile ? 200 : 500;
      dotsRef.current = [];

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const sphereRadius = Math.min(canvas.width, canvas.height) * (isMobile ? 0.6 : 0.35);

      for (let i = 0; i < dotCount; i++) {
        const phi = Math.random() * Math.PI * 2;
        const cosTheta = Math.random() * 2 - 1;
        const theta = Math.acos(cosTheta);
        const r = sphereRadius;

        const x3d = r * Math.sin(theta) * Math.cos(phi);
        const y3d = r * Math.sin(theta) * Math.sin(phi);
        const z3d = r * Math.cos(theta);

        dotsRef.current.push({
          x: centerX + x3d,
          y: centerY + y3d,
          z: z3d,
          originalX: x3d,
          originalY: y3d,
          originalZ: z3d,
          radius: isMobile ? Math.random() * 4 + 3 : Math.random() * 2 + 1.5,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.002 + 0.0005,
          opacity: Math.random() * 0.3 + 0.7,
          distanceFromCenter: r,
        });
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initDots();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Pause when tab hidden
    const handleVisibility = () => {
      isVisibleRef.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibility);

    let time = 0;

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (!isVisibleRef.current) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isMobile = window.innerWidth < 768;
      time += isMobile ? 0.006 : 0.003;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const rotationAngle = time * 0.1;
      const cosRot = Math.cos(rotationAngle);
      const sinRot = Math.sin(rotationAngle);
      const perspective = 300;

      // Collect visible dots
      const visible: { x: number; y: number; r: number; o: number; s: number }[] = [];

      for (const dot of dotsRef.current) {
        dot.pulsePhase += dot.pulseSpeed;
        const pulse = Math.sin(dot.pulsePhase) * 0.03 + 0.97;

        const phi = Math.atan2(dot.originalY, dot.originalX);
        const theta = Math.acos(dot.originalZ / dot.distanceFromCenter);

        const latWave = Math.sin(time * 1.5 + theta * 3) * 0.15;
        const lonWave = Math.sin(time * 1.2 + phi * 2) * 0.12;
        const spiralWave = isMobile ? 0 : Math.sin(time * 0.8 + theta * 2 + phi * 1.5) * 0.1;
        const waveDisp = latWave + lonWave + spiralWave;
        const waveR = dot.distanceFromCenter * (1 + waveDisp);

        const wx = waveR * Math.sin(theta) * Math.cos(phi);
        const wy = waveR * Math.sin(theta) * Math.sin(phi);
        const wz = waveR * Math.cos(theta);

        const rx = wx * cosRot - wz * sinRot;
        const ry = wy;
        const rz = wx * sinRot + wz * cosRot;

        const currentRadius = dot.radius * pulse * (Math.abs(waveDisp) * 1.5 + 1);
        const scale = perspective / (perspective + rz);
        const fx = centerX + rx * scale + centerX * (1 - scale);
        const fy = centerY + ry * scale + centerY * (1 - scale);
        const fr = currentRadius * scale;

        if (fx < -50 || fx > canvas.width + 50 || fy < -50 || fy > canvas.height + 50 || fr < 0.3) continue;

        const depthO = Math.max(0.4, 1 - Math.abs(rz) / 150);
        const shimmer = isMobile ? 0.8 : Math.sin(time * 4 + phi * 2 + theta * 3) * 0.4 + 0.6;
        const bright = 1 + Math.abs(waveDisp) * (isMobile ? 2 : 3);
        const light = Math.max(0.5, (rz + 150) / 300);
        const finalO = Math.min(1, dot.opacity * depthO * shimmer * bright * light);

        visible.push({ x: fx, y: fy, r: fr, o: finalO, s: scale });
      }

      // Sort back-to-front
      visible.sort((a, b) => a.s - b.s);

      // Render — use accent-aligned palette (violet/indigo tones matching design tokens)
      for (let i = 0; i < visible.length; i++) {
        const d = visible[i];
        const waveH = Math.sin(time * 2 + i * 0.1) * 0.2;

        // Accent palette: violet/indigo tones
        const r = 130 + Math.abs(waveH) * 30;
        const g = 100 + Math.abs(waveH) * 40;
        const b = 220 + Math.abs(waveH) * 35;

        const glowR = d.r * 4;
        const gradient = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, glowR);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${d.o * 0.9})`);
        gradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${d.o * 0.5})`);
        gradient.addColorStop(0.8, `rgba(${r - 20}, ${g - 10}, ${b}, ${d.o * 0.2})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(d.x, d.y, glowR, 0, Math.PI * 2);
        ctx.fill();

        // Core dot
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(1, d.o * 0.95)})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();

        // Bright center
        ctx.fillStyle = `rgba(220, 210, 255, ${Math.min(1, d.o * 0.8)})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('visibilitychange', handleVisibility);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      style={{
        background: 'transparent',
        willChange: 'transform',
        transform: 'translateZ(0)',
      }}
    />
  );
};

export default AnimatedCells;
