import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/* ═══════════════════════════════════════════════════════════════
   "Living Cosmos" — multi-depth space scene
   ─ Far:  Stars with realistic colour temperature & scintillation
   ─ Mid:  Perlin-noise nebula clouds (violet / indigo gas)
   ─ Near: Luminous cosmic dust motes with mouse parallax
   ─ Events: Shooting stars every ~8 s
   ═══════════════════════════════════════════════════════════════ */

// ── Minimal 2-D Perlin noise ───────────────────────────────────
const P = new Uint8Array(512);
(() => {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [p[i], p[j]] = [p[j], p[i]];
  }
  P.set(p);
  P.set(p, 256);
})();

function fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(a: number, b: number, t: number) { return a + t * (b - a); }
function grad(hash: number, x: number, y: number) {
  const h = hash & 3;
  return ((h & 1) === 0 ? x : -x) + ((h & 2) === 0 ? y : -y);
}
function noise(x: number, y: number) {
  const xi = x & 255, yi = y & 255;
  const xf = x - Math.floor(x), yf = y - Math.floor(y);
  const u = fade(xf), v = fade(yf);
  const a = P[P[xi] + yi], b = P[P[xi + 1] + yi];
  const c = P[P[xi] + yi + 1], d = P[P[xi + 1] + yi + 1];
  return lerp(lerp(grad(a, xf, yf), grad(b, xf - 1, yf), u),
              lerp(grad(c, xf, yf - 1), grad(d, xf - 1, yf - 1), u), v);
}

function fbm(x: number, y: number, octaves = 4) {
  let val = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < octaves; i++) {
    val += amp * noise(x * freq, y * freq);
    amp *= 0.5;
    freq *= 2;
  }
  return val;
}

// ── Star colour from temperature ───────────────────────────────
// Maps a 0-1 random → realistic hue: blue-white → white → amber → red
function starColour(seed: number): [number, number, number] {
  if (seed < 0.15) return [180, 180, 255];        // hot blue
  if (seed < 0.35) return [210, 220, 255];        // blue-white
  if (seed < 0.60) return [255, 250, 245];        // white / solar
  if (seed < 0.80) return [255, 220, 180];        // warm amber
  return [255, 180, 140];                          // red dwarf
}

// ── Types ──────────────────────────────────────────────────────
interface Star {
  x: number; y: number;
  r: number;
  colour: [number, number, number];
  twinklePhase: number;
  twinkleSpeed: number;
  layer: number; // 0 = far, 1 = mid, 2 = near
}

interface DustMote {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  opacity: number;
  layer: number;
}

interface ShootingStar {
  x: number; y: number;
  vx: number; vy: number;
  life: number;
  maxLife: number;
  length: number;
}

// ── Component ──────────────────────────────────────────────────
const LivingCosmos: React.FC = () => {
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

    let W = 0, H = 0;
    let stars: Star[] = [];
    let dust: DustMote[] = [];
    let shootingStars: ShootingStar[] = [];
    let nextShoot = 5000 + Math.random() * 6000;
    let elapsed = 0;

    // ── Init ────────────────────────────────────────────────
    const init = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;

      const isMobile = W < 768;
      const starCount = isMobile ? 250 : 600;
      const dustCount = isMobile ? 20 : 50;

      stars = [];
      for (let i = 0; i < starCount; i++) {
        const layer = Math.random() < 0.55 ? 0 : Math.random() < 0.7 ? 1 : 2;
        const baseR = layer === 0 ? Math.random() * 0.8 + 0.3
                    : layer === 1 ? Math.random() * 1.0 + 0.6
                    : Math.random() * 1.4 + 0.9;
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: baseR,
          colour: starColour(Math.random()),
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.005 + Math.random() * 0.02,
          layer,
        });
      }

      dust = [];
      for (let i = 0; i < dustCount; i++) {
        dust.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.1,
          r: Math.random() * 1.8 + 0.6,
          opacity: Math.random() * 0.25 + 0.08,
          layer: 2 + Math.random(),
        });
      }
    };

    init();
    window.addEventListener('resize', init);

    const handleVis = () => { isVisibleRef.current = document.visibilityState === 'visible'; };
    document.addEventListener('visibilitychange', handleVis);

    const handleMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX / W, y: e.clientY / H };
    };
    document.addEventListener('mousemove', handleMouse);

    // ── Draw helpers ────────────────────────────────────────
    const drawNebula = (time: number) => {
      // Low-res off-screen buffer for performance
      const scale = 4;
      const nw = Math.ceil(W / scale);
      const nh = Math.ceil(H / scale);
      const img = ctx.createImageData(nw, nh);
      const d = img.data;
      const t = time * 0.00004;

      for (let py = 0; py < nh; py++) {
        for (let px = 0; px < nw; px++) {
          const nx = px * 0.008 + t;
          const ny = py * 0.008 + t * 0.7;

          const n1 = fbm(nx, ny, 4) * 0.5 + 0.5;       // primary cloud
          const n2 = fbm(nx * 1.5 + 50, ny * 1.5, 3) * 0.5 + 0.5; // secondary wisp

          const density = Math.pow(n1, 2.2) * 0.7 + Math.pow(n2, 3) * 0.3;

          // Violet / deep indigo palette
          const r = Math.min(255, density * 120 + n2 * 40) | 0;
          const g = Math.min(255, density * 50 + n2 * 25) | 0;
          const b = Math.min(255, density * 200 + n1 * 55) | 0;
          const a = Math.min(255, density * 55) | 0; // very subtle

          const idx = (py * nw + px) * 4;
          d[idx] = r; d[idx + 1] = g; d[idx + 2] = b; d[idx + 3] = a;
        }
      }

      // Draw scaled up
      const offscreen = new OffscreenCanvas(nw, nh);
      const octx = offscreen.getContext('2d')!;
      octx.putImageData(img, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'low';
      ctx.drawImage(offscreen, 0, 0, W, H);
    };

    const spawnShootingStar = () => {
      const angle = -Math.PI * 0.15 + (Math.random() - 0.5) * 0.5; // mostly top-right → bottom-left
      const speed = 6 + Math.random() * 8;
      shootingStars.push({
        x: Math.random() * W * 0.8 + W * 0.1,
        y: Math.random() * H * 0.3,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 40 + Math.random() * 30,
        length: 60 + Math.random() * 80,
      });
    };

    // ── Main loop ───────────────────────────────────────────
    let last = performance.now();

    const frame = (now: number) => {
      animRef.current = requestAnimationFrame(frame);
      if (!isVisibleRef.current) { last = now; return; }

      const dt = Math.min(now - last, 50);
      last = now;
      elapsed += dt;

      ctx.clearRect(0, 0, W, H);

      // Parallax offsets from mouse
      const mx = (mouseRef.current.x - 0.5) * 2;
      const my = (mouseRef.current.y - 0.5) * 2;

      // 1) Nebula
      drawNebula(elapsed);

      // 2) Stars
      for (const s of stars) {
        s.twinklePhase += s.twinkleSpeed;

        // Scintillation: brightness + slight colour shift + size jitter
        const twinkle = Math.sin(s.twinklePhase) * 0.35 + 0.65;
        const sizeJitter = 1 + Math.sin(s.twinklePhase * 1.7) * 0.15;
        const colourShift = Math.sin(s.twinklePhase * 0.6) * 12;

        // Parallax per layer
        const parallax = s.layer * 3 + 1;
        const px = s.x + mx * parallax;
        const py = s.y + my * parallax;

        const r = s.colour[0] + colourShift;
        const g = s.colour[1] + colourShift * 0.5;
        const b = s.colour[2];
        const radius = s.r * sizeJitter;

        // Soft glow
        if (radius > 0.8) {
          const glow = ctx.createRadialGradient(px, py, 0, px, py, radius * 3.5);
          glow.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${twinkle * 0.3})`);
          glow.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(px, py, radius * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Core
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${twinkle * 0.9})`;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3) Cosmic dust motes
      for (const d of dust) {
        d.x += d.vx;
        d.y += d.vy;
        // Wrap
        if (d.x < -20) d.x = W + 20;
        if (d.x > W + 20) d.x = -20;
        if (d.y < -20) d.y = H + 20;
        if (d.y > H + 20) d.y = -20;

        const px = d.x + mx * d.layer * 6;
        const py = d.y + my * d.layer * 6;

        const glow = ctx.createRadialGradient(px, py, 0, px, py, d.r * 5);
        glow.addColorStop(0, `rgba(180, 160, 255, ${d.opacity})`);
        glow.addColorStop(0.4, `rgba(140, 120, 230, ${d.opacity * 0.4})`);
        glow.addColorStop(1, 'rgba(140, 120, 230, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(px, py, d.r * 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4) Shooting stars
      nextShoot -= dt;
      if (nextShoot <= 0) {
        spawnShootingStar();
        nextShoot = 6000 + Math.random() * 10000;
      }

      shootingStars = shootingStars.filter(s => {
        s.life++;
        s.x += s.vx;
        s.y += s.vy;

        const progress = s.life / s.maxLife;
        if (progress > 1) return false;

        // Brightness curve: quick ramp up, long fade
        const brightness = progress < 0.15
          ? progress / 0.15
          : 1 - (progress - 0.15) / 0.85;

        const tailLen = s.length * brightness;
        const angle = Math.atan2(-s.vy, -s.vx);

        const tx = s.x + Math.cos(angle) * tailLen;
        const ty = s.y + Math.sin(angle) * tailLen;

        const grad = ctx.createLinearGradient(s.x, s.y, tx, ty);
        grad.addColorStop(0, `rgba(255, 255, 255, ${brightness * 0.9})`);
        grad.addColorStop(0.15, `rgba(200, 190, 255, ${brightness * 0.7})`);
        grad.addColorStop(0.5, `rgba(160, 140, 230, ${brightness * 0.25})`);
        grad.addColorStop(1, 'rgba(140, 120, 220, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5 * brightness + 0.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();

        // Bright head
        const headGlow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 4);
        headGlow.addColorStop(0, `rgba(255, 255, 255, ${brightness * 0.8})`);
        headGlow.addColorStop(1, 'rgba(200, 190, 255, 0)');
        ctx.fillStyle = headGlow;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 4, 0, Math.PI * 2);
        ctx.fill();

        return true;
      });
    };

    animRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', init);
      document.removeEventListener('visibilitychange', handleVis);
      document.removeEventListener('mousemove', handleMouse);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      style={{ background: 'transparent', willChange: 'transform', transform: 'translateZ(0)' }}
    />
  );
};

export default LivingCosmos;
