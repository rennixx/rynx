import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/* ═══════════════════════════════════════════════════════════════
   "Event Horizon" — Gravitational Lensing Black Hole
   ═══════════════════════════════════════════════════════════════ */

function starColour(seed: number): [number, number, number] {
  if (seed < 0.12) return [170, 180, 255];
  if (seed < 0.30) return [210, 220, 255];
  if (seed < 0.55) return [255, 250, 245];
  if (seed < 0.78) return [255, 225, 185];
  return [255, 185, 145];
}

interface Star {
  angle: number;
  dist: number;
  r: number;
  colour: [number, number, number];
  twinklePhase: number;
  twinkleSpeed: number;
}

interface AccretionParticle {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  brightness: number;
  hueShift: number;
}

const EventHorizon: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const isVisibleRef = useRef(true);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0, cx = 0, cy = 0, maxR = 0;
    let stars: Star[] = [];
    let accretion: AccretionParticle[] = [];
    const EVENT_R = 0.06;
    const LENS_R = 0.35;

    const init = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      cx = W / 2; cy = H / 2;
      maxR = Math.sqrt(cx * cx + cy * cy);
      const isMobile = W < 768;
      const starCount = isMobile ? 350 : 800;
      stars = [];
      for (let i = 0; i < starCount; i++) {
        const dist = Math.random() * 0.95 + 0.05;
        const layerR = dist < 0.3 ? Math.random() * 0.6 + 0.4 : dist < 0.6 ? Math.random() * 0.9 + 0.5 : Math.random() * 1.2 + 0.6;
        stars.push({ angle: Math.random() * Math.PI * 2, dist, r: isMobile ? layerR * 0.8 : layerR, colour: starColour(Math.random()), twinklePhase: Math.random() * Math.PI * 2, twinkleSpeed: 0.008 + Math.random() * 0.018 });
      }
      const accCount = isMobile ? 80 : 200;
      accretion = [];
      for (let i = 0; i < accCount; i++) {
        const radius = EVENT_R * maxR * (1.6 + Math.random() * 2.5);
        accretion.push({ angle: Math.random() * Math.PI * 2, radius, speed: (0.0008 + Math.random() * 0.0015) * (1 + 0.5 / (radius / maxR + 0.1)), size: Math.random() * 1.5 + 0.4, brightness: Math.random() * 0.5 + 0.3, hueShift: Math.random() });
      }
    };

    init();
    window.addEventListener('resize', init);
    const handleVis = () => { isVisibleRef.current = document.visibilityState === 'visible'; };
    document.addEventListener('visibilitychange', handleVis);
    const handleMouse = (e: MouseEvent) => { mouseRef.current = { x: e.clientX / W, y: e.clientY / H }; };
    document.addEventListener('mousemove', handleMouse);

    let rotation = 0;

    function lensPosition(sx: number, sy: number, hcx: number, hcy: number, strength: number): [number, number, number] {
      const dx = sx - hcx, dy = sy - hcy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const lensRadius = LENS_R * maxR;
      if (dist > lensRadius) return [sx, sy, 1];
      const normDist = dist / lensRadius;
      if (normDist < EVENT_R / LENS_R) return [sx, sy, 0];
      const bendStrength = strength * (1 - normDist) * (1 - normDist);
      const tangentAngle = Math.atan2(dy, dx) + Math.PI / 2;
      const displace = bendStrength * lensRadius * 0.3;
      return [sx + Math.cos(tangentAngle) * displace, sy + Math.sin(tangentAngle) * displace, Math.min(1 + bendStrength * 2.5, 3)];
    }

    const frame = () => {
      animRef.current = requestAnimationFrame(frame);
      if (!isVisibleRef.current) return;
      ctx.clearRect(0, 0, W, H);
      rotation += 0.0003;
      const mouseDx = (mouseRef.current.x - 0.5) * 0.15, mouseDy = (mouseRef.current.y - 0.5) * 0.15;
      const mouseDistFromCenter = Math.sqrt((mouseRef.current.x - 0.5) ** 2 + (mouseRef.current.y - 0.5) ** 2);
      const warpBoost = 1 + (1 - Math.min(mouseDistFromCenter * 2, 1)) * 0.6;
      const holeCx = cx + mouseDx * maxR * 0.3, holeCy = cy + mouseDy * maxR * 0.3;
      const voidR = EVENT_R * maxR * 2.5;
      const voidGrad = ctx.createRadialGradient(holeCx, holeCy, 0, holeCx, holeCy, voidR);
      voidGrad.addColorStop(0, 'rgba(0,0,0,1)'); voidGrad.addColorStop(0.4, 'rgba(0,0,0,0.95)'); voidGrad.addColorStop(0.7, 'rgba(5,2,15,0.5)'); voidGrad.addColorStop(1, 'rgba(10,5,25,0)');

      for (const p of accretion) {
        p.angle += p.speed;
        const tiltAngle = p.angle + rotation * 3;
        const px = holeCx + Math.cos(tiltAngle) * p.radius, py = holeCy + Math.sin(tiltAngle) * p.radius * 0.35;
        const isFront = Math.sin(tiltAngle) < 0.2;
        const heat = 1 - (p.radius - EVENT_R * maxR * 1.6) / (EVENT_R * maxR * 2.5);
        const r = Math.min(255, 140 + heat * 115) | 0, g = Math.min(255, 80 + heat * 100 + p.hueShift * 20) | 0;
        const alpha = p.brightness * (isFront ? 0.7 : 0.2);
        const glow = ctx.createRadialGradient(px, py, 0, px, py, p.size * 6);
        glow.addColorStop(0, `rgba(${r},${g},255,${alpha})`); glow.addColorStop(0.5, `rgba(${r},${g},255,${alpha * 0.3})`); glow.addColorStop(1, `rgba(${r},${g},255,0)`);
        ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(px, py, p.size * 6, 0, Math.PI * 2); ctx.fill();
      }

      ctx.save(); ctx.translate(holeCx, holeCy); ctx.rotate(rotation * 0.5); ctx.scale(1, 0.35);
      const ringR = EVENT_R * maxR * 3.2;
      const ringGrad = ctx.createRadialGradient(0, 0, ringR * 0.5, 0, 0, ringR);
      ringGrad.addColorStop(0, 'rgba(160,120,255,0)'); ringGrad.addColorStop(0.4, 'rgba(160,120,255,0.06)'); ringGrad.addColorStop(0.7, 'rgba(130,90,255,0.12)'); ringGrad.addColorStop(0.9, 'rgba(100,60,220,0.04)'); ringGrad.addColorStop(1, 'rgba(80,40,200,0)');
      ctx.fillStyle = ringGrad; ctx.beginPath(); ctx.arc(0, 0, ringR, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      for (const s of stars) {
        s.twinklePhase += s.twinkleSpeed;
        const a = s.angle + rotation;
        const [lx, ly, mag] = lensPosition(cx + Math.cos(a) * s.dist * maxR, cy + Math.sin(a) * s.dist * maxR, holeCx, holeCy, warpBoost);
        if (mag === 0) continue;
        const twinkle = Math.sin(s.twinklePhase) * 0.3 + 0.7;
        const colourShift = Math.sin(s.twinklePhase * 0.5) * 10;
        const r = s.colour[0] + colourShift, g = s.colour[1] + colourShift * 0.5, b = s.colour[2];
        const radius = s.r * (1 + Math.sin(s.twinklePhase * 1.7) * 0.12) * Math.min(mag, 2);
        const brightness = twinkle * Math.min(mag, 2.5);
        if (radius > 0.7) { const glow = ctx.createRadialGradient(lx, ly, 0, lx, ly, radius * 3.5); glow.addColorStop(0, `rgba(${r},${g},${b},${brightness * 0.25})`); glow.addColorStop(1, `rgba(${r},${g},${b},0)`); ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(lx, ly, radius * 3.5, 0, Math.PI * 2); ctx.fill(); }
        ctx.fillStyle = `rgba(${r},${g},${b},${brightness * 0.85})`; ctx.beginPath(); ctx.arc(lx, ly, radius, 0, Math.PI * 2); ctx.fill();
      }

      ctx.fillStyle = voidGrad; ctx.beginPath(); ctx.arc(holeCx, holeCy, voidR, 0, Math.PI * 2); ctx.fill();
      const photonR = EVENT_R * maxR * 1.8;
      ctx.save(); ctx.translate(holeCx, holeCy); ctx.rotate(rotation * 0.5); ctx.scale(1, 0.35);
      ctx.strokeStyle = 'rgba(200,180,255,0.2)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(0, 0, photonR, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = 'rgba(220,200,255,0.12)'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(0, 0, photonR * 0.85, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
      const glowR = EVENT_R * maxR * 5;
      const outerGlow = ctx.createRadialGradient(holeCx, holeCy, EVENT_R * maxR, holeCx, holeCy, glowR);
      outerGlow.addColorStop(0, 'rgba(100,60,200,0.08)'); outerGlow.addColorStop(0.3, 'rgba(80,40,180,0.04)'); outerGlow.addColorStop(1, 'rgba(60,30,160,0)');
      ctx.fillStyle = outerGlow; ctx.beginPath(); ctx.arc(holeCx, holeCy, glowR, 0, Math.PI * 2); ctx.fill();
    };

    animRef.current = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', init); document.removeEventListener('visibilitychange', handleVis); document.removeEventListener('mousemove', handleMouse); };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-80" style={{ background: 'transparent', willChange: 'transform', transform: 'translateZ(0)' }} />;
};

export default EventHorizon;
