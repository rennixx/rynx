import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/* ═══════════════════════════════════════════════════════════════
   #3  "Stellar Nursery" — Star Birth / Death Lifecycle
   Gas pockets ignite into stars that drift, age, and occasionally
   go supernova.  Mass determines colour, size & lifespan.
   ═══════════════════════════════════════════════════════════════ */

/* ---------- helpers ---------- */
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

function tempColour(temp: number): [number, number, number] {
  if (temp > 0.85) return [155, 175, 255];
  if (temp > 0.65) return [200, 215, 255];
  if (temp > 0.45) return [255, 245, 230];
  if (temp > 0.25) return [255, 210, 160];
  return [255, 170, 130];
}

function cheapNoise(x: number, y: number, seed: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 43758.5453);
  return (n - Math.floor(n)) * 2 - 1;
}

function fbm(x: number, y: number, seed: number, octaves = 4): number {
  let v = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < octaves; i++) {
    v += amp * cheapNoise(x * freq, y * freq, seed + i * 7.3);
    freq *= 2; amp *= 0.5;
  }
  return v;
}

/* ---------- types ---------- */
const Phase = { GAS: 0, IGNITION: 1, MAIN_SEQ: 2, GIANT: 3, SUPERNOVA: 4, REMNANT: 5 } as const;
type Phase = (typeof Phase)[keyof typeof Phase];

interface ProtoStar {
  x: number; y: number;
  vx: number; vy: number;
  mass: number; temp: number;
  colour: [number, number, number];
  phase: Phase; age: number; lifespan: number;
  radius: number; maxRadius: number;
  supernovaTimer: number; supernovaRadius: number; supernovaAlpha: number;
  birth: { x: number; y: number; radius: number; alpha: number };
}

interface GasCloud {
  x: number; y: number; radius: number; seed: number;
  hue: number; alpha: number; pulse: number; pulseSpeed: number; drift: number;
}

interface BackgroundStar {
  x: number; y: number; r: number;
  colour: [number, number, number];
  twinkle: number; twinkleSpeed: number;
}

const StellarNursery: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const isVisibleRef = useRef(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = 0, H = 0;
    let bgStars: BackgroundStar[] = [];
    let clouds: GasCloud[] = [];
    let nurseryStars: ProtoStar[] = [];
    let ticks = 0;
    const CLOUD_COUNT = 6;
    const BG_DESKTOP = 500; const BG_MOBILE = 250;
    const MAX_NURSERY = 40; const SPAWN_INTERVAL = 90;

    const init = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      const isMobile = W < 768;
      const bgCount = isMobile ? BG_MOBILE : BG_DESKTOP;
      bgStars = [];
      for (let i = 0; i < bgCount; i++) {
        bgStars.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 0.9 + 0.3, colour: tempColour(Math.random()), twinkle: Math.random() * Math.PI * 2, twinkleSpeed: 0.006 + Math.random() * 0.014 });
      }
      clouds = [];
      for (let i = 0; i < CLOUD_COUNT; i++) {
        clouds.push({ x: W * 0.15 + Math.random() * W * 0.7, y: H * 0.15 + Math.random() * H * 0.7, radius: Math.max(W, H) * (0.12 + Math.random() * 0.14), seed: Math.random() * 999, hue: 260 + Math.random() * 40, alpha: 0.04 + Math.random() * 0.03, pulse: Math.random() * Math.PI * 2, pulseSpeed: 0.003 + Math.random() * 0.004, drift: Math.random() * Math.PI * 2 });
      }
      nurseryStars = [];
    };

    init();
    window.addEventListener('resize', init);
    const handleVis = () => { isVisibleRef.current = document.visibilityState === 'visible'; };
    document.addEventListener('visibilitychange', handleVis);

    function spawnStar() {
      if (nurseryStars.length >= MAX_NURSERY) return;
      const cloud = clouds[Math.floor(Math.random() * clouds.length)];
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * cloud.radius * 0.6;
      const mass = 0.3 + Math.random() * 0.7;
      const baseR = 1.5 + mass * 3;
      const lifespan = (1800 + (1 - mass) * 3000) | 0;
      nurseryStars.push({ x: cloud.x + Math.cos(angle) * dist, y: cloud.y + Math.sin(angle) * dist, vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.5) * 0.12, mass, temp: mass, colour: tempColour(mass), phase: Phase.GAS, age: 0, lifespan, radius: 0, maxRadius: baseR, supernovaTimer: 0, supernovaRadius: 0, supernovaAlpha: 0, birth: { x: cloud.x + Math.cos(angle) * dist, y: cloud.y + Math.sin(angle) * dist, radius: baseR * 8, alpha: 0.5 } });
    }

    function updateStar(s: ProtoStar): boolean {
      s.age++;
      const progress = s.age / s.lifespan;
      switch (s.phase) {
        case Phase.GAS: s.radius = lerp(0, s.maxRadius * 0.4, clamp(progress * 15, 0, 1)); s.birth.alpha = lerp(0.5, 0.9, clamp(progress * 15, 0, 1)); s.birth.radius *= 0.993; if (progress > 0.06) s.phase = Phase.IGNITION; break;
        case Phase.IGNITION: s.radius = lerp(s.maxRadius * 0.4, s.maxRadius * 1.6, clamp((progress - 0.06) * 30, 0, 1)); s.birth.alpha *= 0.96; if (progress > 0.1) { s.phase = Phase.MAIN_SEQ; s.radius = s.maxRadius; } break;
        case Phase.MAIN_SEQ: s.x += s.vx; s.y += s.vy; s.radius = s.maxRadius * (1 + Math.sin(s.age * 0.02) * 0.06); if (progress > 0.7) s.phase = Phase.GIANT; break;
        case Phase.GIANT: { s.x += s.vx * 0.5; s.y += s.vy * 0.5; const gP = (progress - 0.7) / 0.25; s.radius = s.maxRadius * lerp(1, 2.2, clamp(gP, 0, 1)); s.temp = lerp(s.mass, Math.max(s.mass - 0.4, 0.05), clamp(gP, 0, 1)); s.colour = tempColour(s.temp); if (progress > 0.92 && s.mass > 0.65) { s.phase = Phase.SUPERNOVA; s.supernovaTimer = 0; } else if (progress > 0.95) s.phase = Phase.REMNANT; break; }
        case Phase.SUPERNOVA: s.supernovaTimer++; s.supernovaRadius = lerp(0, Math.max(W, H) * 0.08 * s.mass, clamp(s.supernovaTimer / 40, 0, 1)); s.supernovaAlpha = s.supernovaTimer < 20 ? lerp(0, 0.7, s.supernovaTimer / 20) : lerp(0.7, 0, clamp((s.supernovaTimer - 20) / 60, 0, 1)); s.radius = s.maxRadius * Math.max(0, 1 - s.supernovaTimer / 80); if (s.supernovaTimer > 80) s.phase = Phase.REMNANT; break;
        case Phase.REMNANT: s.radius *= 0.97; s.supernovaAlpha *= 0.95; if (s.radius < 0.05 && s.supernovaAlpha < 0.01) return false; break;
      }
      return true;
    }

    const frame = () => {
      animRef.current = requestAnimationFrame(frame);
      if (!isVisibleRef.current) return;
      ctx.clearRect(0, 0, W, H);
      ticks++;

      for (const c of clouds) {
        c.pulse += c.pulseSpeed; c.drift += 0.0002;
        const ox = Math.cos(c.drift) * 8, oy = Math.sin(c.drift * 0.7) * 6;
        const pAlpha = c.alpha * (1 + Math.sin(c.pulse) * 0.3);
        const cloudX = c.x + ox, cloudY = c.y + oy;
        for (let layer = 0; layer < 3; layer++) {
          const r = c.radius * (0.5 + layer * 0.3), a = pAlpha * (1 - layer * 0.3);
          const grad = ctx.createRadialGradient(cloudX, cloudY, 0, cloudX, cloudY, r);
          const hue = c.hue + layer * 15 + Math.sin(c.pulse + layer) * 8;
          grad.addColorStop(0, `hsla(${hue}, 70%, 50%, ${a})`); grad.addColorStop(0.4, `hsla(${hue + 10}, 60%, 40%, ${a * 0.6})`); grad.addColorStop(0.7, `hsla(${hue + 20}, 50%, 30%, ${a * 0.2})`); grad.addColorStop(1, `hsla(${hue}, 40%, 20%, 0)`);
          ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(cloudX, cloudY, r, 0, Math.PI * 2); ctx.fill();
        }
        const step = 20;
        for (let gx = cloudX - c.radius; gx < cloudX + c.radius; gx += step) {
          for (let gy = cloudY - c.radius; gy < cloudY + c.radius; gy += step) {
            const dx = gx - cloudX, dy = gy - cloudY, d = Math.sqrt(dx * dx + dy * dy);
            if (d > c.radius) continue;
            const n = fbm(gx * 0.003, gy * 0.003, c.seed + ticks * 0.0003);
            if (n > 0.1) { const falloff = 1 - d / c.radius; ctx.fillStyle = `hsla(${c.hue + n * 30}, 60%, 55%, ${clamp(n * falloff * pAlpha * 1.5, 0, 0.08)})`; ctx.fillRect(gx, gy, step * 0.8, step * 0.8); }
          }
        }
      }

      for (const s of bgStars) { s.twinkle += s.twinkleSpeed; const tw = Math.sin(s.twinkle) * 0.3 + 0.7; const [r, g, b] = s.colour; ctx.fillStyle = `rgba(${r},${g},${b},${tw * 0.6})`; ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill(); }

      if (ticks % SPAWN_INTERVAL === 0) spawnStar();
      nurseryStars = nurseryStars.filter(updateStar);

      for (const s of nurseryStars) {
        const [r, g, b] = s.colour;
        if (s.birth.alpha > 0.01) { const bGrad = ctx.createRadialGradient(s.birth.x, s.birth.y, 0, s.birth.x, s.birth.y, s.birth.radius); bGrad.addColorStop(0, `rgba(${r},${g},${b},0)`); bGrad.addColorStop(0.5, `rgba(${r},${g},${b},${s.birth.alpha * 0.15})`); bGrad.addColorStop(0.8, `rgba(${r},${g},${b},${s.birth.alpha * 0.06})`); bGrad.addColorStop(1, `rgba(${r},${g},${b},0)`); ctx.fillStyle = bGrad; ctx.beginPath(); ctx.arc(s.birth.x, s.birth.y, s.birth.radius, 0, Math.PI * 2); ctx.fill(); }
        if (s.supernovaAlpha > 0.01) { const snGrad = ctx.createRadialGradient(s.x, s.y, s.supernovaRadius * 0.3, s.x, s.y, s.supernovaRadius); snGrad.addColorStop(0, `rgba(255,240,255,${s.supernovaAlpha})`); snGrad.addColorStop(0.3, `rgba(200,160,255,${s.supernovaAlpha * 0.7})`); snGrad.addColorStop(0.6, `rgba(140,80,255,${s.supernovaAlpha * 0.3})`); snGrad.addColorStop(1, 'rgba(80,40,200,0)'); ctx.fillStyle = snGrad; ctx.beginPath(); ctx.arc(s.x, s.y, s.supernovaRadius, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = `rgba(220,200,255,${s.supernovaAlpha * 0.5})`; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(s.x, s.y, s.supernovaRadius * 0.95, 0, Math.PI * 2); ctx.stroke(); }
        if (s.radius < 0.1) continue;
        const glowR = s.radius * 4; const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, glowR); glow.addColorStop(0, `rgba(${r},${g},${b},0.25)`); glow.addColorStop(0.5, `rgba(${r},${g},${b},0.06)`); glow.addColorStop(1, `rgba(${r},${g},${b},0)`); ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(s.x, s.y, glowR, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(${r},${g},${b},0.9)`; ctx.beginPath(); ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = `rgba(255,255,255,${s.phase === Phase.IGNITION ? 0.8 : 0.35})`; ctx.beginPath(); ctx.arc(s.x, s.y, s.radius * 0.4, 0, Math.PI * 2); ctx.fill();
      }
    };

    animRef.current = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', init); document.removeEventListener('visibilitychange', handleVis); };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-80" style={{ background: 'transparent', willChange: 'transform', transform: 'translateZ(0)' }} />;
};

export default StellarNursery;
