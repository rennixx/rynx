import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/* ═══════════════════════════════════════════════════════════════
   #4  "Cosmic Web" — Large-Scale Structure of the Universe
   Galaxy clusters at nodes connected by dark-matter filaments,
   with energy pulses flowing along the web. Subtle parallax on
   mouse movement reveals depth.
   ═══════════════════════════════════════════════════════════════ */

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function tempColour(seed: number): [number, number, number] {
  if (seed < 0.15) return [155, 175, 255];
  if (seed < 0.35) return [200, 215, 255];
  if (seed < 0.6) return [255, 250, 245];
  if (seed < 0.8) return [255, 225, 185];
  return [255, 185, 145];
}

/* --- types --- */
interface WebNode {
  x: number; y: number;
  baseX: number; baseY: number;
  depth: number;           // 0 = far, 1 = near (parallax layer)
  mass: number;            // 0.3–1  → determines halo size & brightness
  haloRadius: number;
  pulsePhase: number;
  pulseSpeed: number;
  colour: [number, number, number];
}

interface Filament {
  a: number;               // index into nodes[]
  b: number;
  width: number;
  pulseOffset: number;
}

interface EnergyPulse {
  filament: number;        // index into filaments[]
  t: number;               // 0→1 position along filament
  speed: number;
  size: number;
  forward: boolean;        // direction
}

interface BackgroundStar {
  x: number; y: number; r: number;
  colour: [number, number, number];
  twinkle: number;
  twinkleSpeed: number;
  depth: number;
}

/* --- component --- */
const AnimatedCells: React.FC = () => {
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
    let nodes: WebNode[] = [];
    let filaments: Filament[] = [];
    let pulses: EnergyPulse[] = [];
    let bgStars: BackgroundStar[] = [];
    let ticks = 0;

    const NODE_COUNT_DESKTOP = 28;
    const NODE_COUNT_MOBILE = 16;
    const MAX_LINK_DIST_FRAC = 0.35;   // fraction of diagonal
    const MAX_CONNECTIONS = 4;
    const PULSE_SPAWN_RATE = 30;       // frames between new pulses
    const MAX_PULSES = 60;
    const BG_STARS_DESKTOP = 400;
    const BG_STARS_MOBILE = 200;

    const init = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      const isMobile = W < 768;
      const diag = Math.sqrt(W * W + H * H);
      const maxLink = diag * MAX_LINK_DIST_FRAC;
      const nodeCount = isMobile ? NODE_COUNT_MOBILE : NODE_COUNT_DESKTOP;

      /* generate nodes with Poisson-ish distribution (reject too-close) */
      nodes = [];
      const minDist = diag * 0.08;
      for (let attempts = 0; nodes.length < nodeCount && attempts < nodeCount * 20; attempts++) {
        const x = Math.random() * W;
        const y = Math.random() * H;
        let tooClose = false;
        for (const n of nodes) {
          if (Math.hypot(n.baseX - x, n.baseY - y) < minDist) { tooClose = true; break; }
        }
        if (tooClose) continue;
        const mass = 0.3 + Math.random() * 0.7;
        const depth = Math.random();
        nodes.push({
          x, y, baseX: x, baseY: y, depth, mass,
          haloRadius: (12 + mass * 30) * (isMobile ? 0.7 : 1),
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.008 + Math.random() * 0.012,
          colour: tempColour(Math.random()),
        });
      }

      /* build filament connections (Delaunay-esque: nearest neighbours) */
      filaments = [];
      const connectionCount = new Map<number, number>();
      for (let i = 0; i < nodes.length; i++) connectionCount.set(i, 0);

      // Sort candidate edges by distance
      const edges: { i: number; j: number; dist: number }[] = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].baseX - nodes[j].baseX, nodes[i].baseY - nodes[j].baseY);
          if (d < maxLink) edges.push({ i, j, dist: d });
        }
      }
      edges.sort((a, b) => a.dist - b.dist);

      for (const e of edges) {
        const ci = connectionCount.get(e.i) ?? 0;
        const cj = connectionCount.get(e.j) ?? 0;
        if (ci >= MAX_CONNECTIONS || cj >= MAX_CONNECTIONS) continue;
        filaments.push({
          a: e.i, b: e.j,
          width: lerp(0.3, 1.2, 1 - e.dist / maxLink),
          pulseOffset: Math.random() * Math.PI * 2,
        });
        connectionCount.set(e.i, ci + 1);
        connectionCount.set(e.j, cj + 1);
      }

      /* background stars */
      const starCount = isMobile ? BG_STARS_MOBILE : BG_STARS_DESKTOP;
      bgStars = [];
      for (let i = 0; i < starCount; i++) {
        bgStars.push({
          x: Math.random() * W, y: Math.random() * H,
          r: Math.random() * 0.8 + 0.2,
          colour: tempColour(Math.random()),
          twinkle: Math.random() * Math.PI * 2,
          twinkleSpeed: 0.005 + Math.random() * 0.015,
          depth: Math.random() * 0.5,
        });
      }

      pulses = [];
    };

    init();
    window.addEventListener('resize', init);
    const handleVis = () => { isVisibleRef.current = document.visibilityState === 'visible'; };
    document.addEventListener('visibilitychange', handleVis);
    const handleMouse = (e: MouseEvent) => { mouseRef.current = { x: e.clientX / W, y: e.clientY / H }; };
    document.addEventListener('mousemove', handleMouse);

    const frame = () => {
      animRef.current = requestAnimationFrame(frame);
      if (!isVisibleRef.current) return;
      ctx.clearRect(0, 0, W, H);
      ticks++;

      const mx = (mouseRef.current.x - 0.5) * 2;   // -1 to 1
      const my = (mouseRef.current.y - 0.5) * 2;

      /* parallax — shift nodes by depth */
      const parallaxStrength = 25;
      for (const n of nodes) {
        n.x = n.baseX + mx * n.depth * parallaxStrength;
        n.y = n.baseY + my * n.depth * parallaxStrength;
      }

      /* 1) Background stars with parallax */
      for (const s of bgStars) {
        s.twinkle += s.twinkleSpeed;
        const tw = Math.sin(s.twinkle) * 0.3 + 0.7;
        const sx = s.x + mx * s.depth * parallaxStrength * 0.5;
        const sy = s.y + my * s.depth * parallaxStrength * 0.5;
        const [r, g, b] = s.colour;
        ctx.fillStyle = `rgba(${r},${g},${b},${tw * 0.5})`;
        ctx.beginPath(); ctx.arc(sx, sy, s.r, 0, Math.PI * 2); ctx.fill();
      }

      /* 2) Filaments */
      for (let fi = 0; fi < filaments.length; fi++) {
        const f = filaments[fi];
        const na = nodes[f.a], nb = nodes[f.b];

        // Breathing alpha
        const breathe = Math.sin(ticks * 0.005 + f.pulseOffset) * 0.3 + 0.7;
        const alpha = 0.06 * f.width * breathe;

        // Draw filament as gradient line
        const grad = ctx.createLinearGradient(na.x, na.y, nb.x, nb.y);
        const avgDepth = (na.depth + nb.depth) / 2;
        const hue = 265 + avgDepth * 20;
        grad.addColorStop(0, `hsla(${hue}, 60%, 55%, ${alpha * (0.5 + na.mass * 0.5)})`);
        grad.addColorStop(0.5, `hsla(${hue + 10}, 50%, 45%, ${alpha * 0.4})`);
        grad.addColorStop(1, `hsla(${hue}, 60%, 55%, ${alpha * (0.5 + nb.mass * 0.5)})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = f.width * 1.5;
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);

        // Slight curve via midpoint offset for organic feel
        const midX = (na.x + nb.x) / 2 + Math.sin(ticks * 0.002 + fi) * 8;
        const midY = (na.y + nb.y) / 2 + Math.cos(ticks * 0.0015 + fi) * 6;
        ctx.quadraticCurveTo(midX, midY, nb.x, nb.y);
        ctx.stroke();

        // Outer glow
        ctx.strokeStyle = `hsla(${hue}, 50%, 50%, ${alpha * 0.15})`;
        ctx.lineWidth = f.width * 5;
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.quadraticCurveTo(midX, midY, nb.x, nb.y);
        ctx.stroke();
      }

      /* 3) Energy pulses along filaments */
      if (ticks % PULSE_SPAWN_RATE === 0 && pulses.length < MAX_PULSES && filaments.length > 0) {
        const fi = Math.floor(Math.random() * filaments.length);
        pulses.push({
          filament: fi,
          t: 0,
          speed: 0.003 + Math.random() * 0.005,
          size: 1.5 + Math.random() * 2,
          forward: Math.random() > 0.5,
        });
      }

      pulses = pulses.filter(p => {
        p.t += p.speed;
        if (p.t > 1) return false;

        const f = filaments[p.filament];
        const na = nodes[f.a], nb = nodes[f.b];
        const t = p.forward ? p.t : 1 - p.t;

        // Quadratic bezier position
        const midX = (na.x + nb.x) / 2 + Math.sin(ticks * 0.002 + p.filament) * 8;
        const midY = (na.y + nb.y) / 2 + Math.cos(ticks * 0.0015 + p.filament) * 6;
        const u = 1 - t;
        const px = u * u * na.x + 2 * u * t * midX + t * t * nb.x;
        const py = u * u * na.y + 2 * u * t * midY + t * t * nb.y;

        const fadeIn = Math.min(p.t * 10, 1);
        const fadeOut = Math.min((1 - p.t) * 10, 1);
        const alpha = fadeIn * fadeOut * 0.7;

        const glow = ctx.createRadialGradient(px, py, 0, px, py, p.size * 4);
        glow.addColorStop(0, `rgba(200,180,255,${alpha})`);
        glow.addColorStop(0.4, `rgba(150,120,255,${alpha * 0.4})`);
        glow.addColorStop(1, 'rgba(120,80,255,0)');
        ctx.fillStyle = glow;
        ctx.beginPath(); ctx.arc(px, py, p.size * 4, 0, Math.PI * 2); ctx.fill();

        // Bright core
        ctx.fillStyle = `rgba(230,220,255,${alpha * 0.9})`;
        ctx.beginPath(); ctx.arc(px, py, p.size * 0.6, 0, Math.PI * 2); ctx.fill();

        return true;
      });

      /* 4) Galaxy cluster nodes (halos + cores) */
      for (const n of nodes) {
        n.pulsePhase += n.pulseSpeed;
        const pulse = Math.sin(n.pulsePhase) * 0.2 + 0.8;
        const [r, g, b] = n.colour;

        // Dark matter halo (large soft glow)
        const haloR = n.haloRadius * pulse;
        const halo = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, haloR);
        halo.addColorStop(0, `rgba(${r},${g},${b},${0.08 * n.mass})`);
        halo.addColorStop(0.3, `rgba(${r},${g},${b},${0.04 * n.mass})`);
        halo.addColorStop(0.6, `rgba(${Math.max(0, r - 40)},${Math.max(0, g - 40)},${b},${0.015 * n.mass})`);
        halo.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = halo;
        ctx.beginPath(); ctx.arc(n.x, n.y, haloR, 0, Math.PI * 2); ctx.fill();

        // Cluster core — several tiny galaxies
        const coreCount = Math.ceil(n.mass * 4);
        for (let j = 0; j < coreCount; j++) {
          const angle = (j / coreCount) * Math.PI * 2 + n.pulsePhase * 0.1;
          const dist = n.mass * 4 * Math.sin(n.pulsePhase * 0.5 + j) * 0.5 + n.mass * 2;
          const gx = n.x + Math.cos(angle) * dist;
          const gy = n.y + Math.sin(angle) * dist;
          const gr = 0.6 + n.mass * 0.8;

          // Galaxy glow
          const gGlow = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr * 4);
          gGlow.addColorStop(0, `rgba(${r},${g},${b},${0.3 * pulse})`);
          gGlow.addColorStop(1, `rgba(${r},${g},${b},0)`);
          ctx.fillStyle = gGlow;
          ctx.beginPath(); ctx.arc(gx, gy, gr * 4, 0, Math.PI * 2); ctx.fill();

          // Galaxy core
          ctx.fillStyle = `rgba(${r},${g},${b},${0.8 * pulse})`;
          ctx.beginPath(); ctx.arc(gx, gy, gr, 0, Math.PI * 2); ctx.fill();
        }

        // Central bright point
        ctx.fillStyle = `rgba(255,250,255,${0.5 * pulse * n.mass})`;
        ctx.beginPath(); ctx.arc(n.x, n.y, 1.2 + n.mass, 0, Math.PI * 2); ctx.fill();
      }
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

export default AnimatedCells;
