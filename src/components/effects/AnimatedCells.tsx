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
  const animationFrameRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize dots on the surface of a 3D sphere (hollow ball)
    const initDots = () => {
      console.log('🔬 Initializing 3D sphere surface with water waves...');
      
      // Adaptive dot count based on screen size and performance
      const isMobile = window.innerWidth < 768;
      const dotCount = isMobile ? 250 : 600; // Slightly fewer but bigger dots on mobile
      dotsRef.current = [];
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const centerZ = 0;
      const sphereRadius = Math.min(canvas.width, canvas.height) * (isMobile ? 0.6 : 0.35); // Much larger on mobile for better zoom

      for (let i = 0; i < dotCount; i++) {
        // Generate points ONLY on the sphere surface using spherical coordinates
        const phi = Math.random() * Math.PI * 2; // Azimuthal angle (0 to 2π)
        const cosTheta = Math.random() * 2 - 1; // cos(polar angle) (-1 to 1)
        const theta = Math.acos(cosTheta); // Polar angle (0 to π)
        
        // All dots are exactly on the surface (no random radius)
        const r = sphereRadius;
        
        // Convert spherical to cartesian coordinates
        const x3d = r * Math.sin(theta) * Math.cos(phi);
        const y3d = r * Math.sin(theta) * Math.sin(phi);
        const z3d = r * Math.cos(theta);
        
        const dot: Dot = {
          x: centerX + x3d,
          y: centerY + y3d,
          z: centerZ + z3d,
          originalX: x3d, // Store relative positions (sphere surface coordinates)
          originalY: y3d,
          originalZ: z3d,
          radius: isMobile ? Math.random() * 4 + 3 : Math.random() * 2 + 1.5, // Much bigger dots on mobile
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.002 + 0.0005, // Slower on mobile
          opacity: Math.random() * 0.3 + 0.7, // Higher opacity on mobile
          distanceFromCenter: r // All dots are at sphere radius
        };
        
        dotsRef.current.push(dot);
      }
      
      console.log(`✅ Created ${dotsRef.current.length} dots for the cell (${isMobile ? 'Mobile' : 'Desktop'} optimized)`);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initDots(); // Reinitialize dots when canvas resizes
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let time = 0;
    let frameCount = 0;
    const animate = () => {
      if (prefersReducedMotion) {
        console.log('❌ Reduced motion is ON - animation disabled');
        return;
      }

      // Clear canvas for animation
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isMobile = window.innerWidth < 768;
      time += isMobile ? 0.006 : 0.003; // Faster on mobile, normal on desktop
      frameCount++;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Rotation for 3D effect - slower on mobile
      const rotationSpeed = isMobile ? 0.12 : 0.1; // Faster rotation on mobile
      const rotationAngle = time * rotationSpeed;

      // Performance optimization: batch similar operations
      const visibleDots: Array<{x: number, y: number, radius: number, opacity: number, scale: number}> = [];

      // First pass: calculate positions and filter visible dots
      dotsRef.current.forEach((dot, index) => {
        // Individual dot pulse animation - less frequent on mobile
        if (frameCount % (isMobile ? 4 : 2) === 0 || index % (isMobile ? 4 : 2) === frameCount % (isMobile ? 4 : 2)) {
          dot.pulsePhase += dot.pulseSpeed;
        }
        
        // Individual dot pulsing (very subtle)
        const individualPulse = Math.sin(dot.pulsePhase) * 0.03 + 0.97; // Less movement on mobile
        
        // Spherical coordinates for wave calculations
        const phi = Math.atan2(dot.originalY, dot.originalX); // Azimuthal angle
        const theta = Math.acos(dot.originalZ / dot.distanceFromCenter); // Polar angle
        
        // Water wave calculations ON THE SPHERE SURFACE - simplified for mobile
        // Multiple wave patterns that travel across the sphere surface
        
        // Longitudinal waves (travel around the sphere like latitude lines)
        const latitudeWave = Math.sin(time * (isMobile ? 2.5 : 1.5) + theta * 3) * (isMobile ? 0.12 : 0.15);
        
        // Meridional waves (travel from pole to pole like longitude lines)  
        const longitudeWave = Math.sin(time * (isMobile ? 2.0 : 1.2) + phi * 2) * (isMobile ? 0.1 : 0.12);
        
        // Spiral waves that wrap around the sphere - simplified on mobile
        const spiralWave = isMobile ? 0 : Math.sin(time * 0.8 + theta * 2 + phi * 1.5) * 0.1;
        
        // Combined wave displacement - waves modify the radius slightly
        const waveDisplacement = latitudeWave + longitudeWave + spiralWave;
        
        // Apply wave displacement to sphere radius (waves on surface)
        const waveRadius = dot.distanceFromCenter * (1 + waveDisplacement);
        
        // Recalculate position with wave-modified radius
        const waveX = waveRadius * Math.sin(theta) * Math.cos(phi);
        const waveY = waveRadius * Math.sin(theta) * Math.sin(phi);
        const waveZ = waveRadius * Math.cos(theta);
        
        // Apply gentle rotation to the entire sphere
        const cosRot = Math.cos(rotationAngle);
        const sinRot = Math.sin(rotationAngle);
        
        const rotatedX = waveX * cosRot - waveZ * sinRot;
        const rotatedY = waveY;
        const rotatedZ = waveX * sinRot + waveZ * cosRot;
        
        // Size effects - dots get slightly bigger at wave peaks
        const waveIntensity = Math.abs(waveDisplacement) * 1.5 + 1; // Less intense on mobile
        const currentRadius = dot.radius * individualPulse * waveIntensity;
        
        // Final position - sphere stays centered, only surface waves
        const x3d = rotatedX;
        const y3d = rotatedY;
        const z3d = rotatedZ;

        // Keep cell centered while applying internal animations
        const projectedX = centerX + x3d;
        const projectedY = centerY + y3d;
        const projectedZ = z3d;
        
        // Simple perspective for depth
        const perspective = 300;
        const scale = perspective / (perspective + projectedZ);
        const finalX = projectedX * scale + (centerX * (1 - scale));
        const finalY = projectedY * scale + (centerY * (1 - scale));
        const projectedRadius = currentRadius * scale;

        // Early culling: skip dots outside screen or too small
        if (finalX < -50 || finalX > canvas.width + 50 || 
            finalY < -50 || finalY > canvas.height + 50 ||
            projectedRadius < (isMobile ? 0.5 : 0.3)) return;

        // Calculate depth-based opacity for 3D sphere effect
        const depthOpacity = Math.max(0.4, 1 - Math.abs(projectedZ) / 150);
        
        // Wave-based shimmer effect - dots shimmer at wave peaks (simplified on mobile)
        const waveShimmer = isMobile ? 0.8 : Math.sin(time * 4 + phi * 2 + theta * 3) * 0.4 + 0.6;
        
        // Wave brightness - dots get brighter at wave peaks
        const waveBrightness = 1 + Math.abs(waveDisplacement) * (isMobile ? 2 : 3);
        
        // Surface lighting effect - dots facing "forward" are brighter
        const lightingEffect = Math.max(0.5, (projectedZ + 150) / 300);
        
        const finalOpacity = Math.min(1, dot.opacity * depthOpacity * waveShimmer * waveBrightness * lightingEffect);

        visibleDots.push({
          x: finalX,
          y: finalY,
          radius: projectedRadius,
          opacity: finalOpacity,
          scale
        });
      });

      // Sort by depth for proper rendering (only visible dots)
      visibleDots.sort((a, b) => a.scale - b.scale);

      // Second pass: render visible dots with water-like effects
      visibleDots.forEach((dot, index) => {
        // Water-like glow with gentle shimmer
        const glowRadius = dot.radius * (isMobile ? 4 : 4); // Bigger glow on mobile for better visibility
        
        const gradient = ctx.createRadialGradient(
          dot.x, dot.y, 0,
          dot.x, dot.y, glowRadius
        );
        
        // Water sphere colors - much brighter and more visible
        const waveHeight = Math.sin(time * (isMobile ? 1.5 : 2) + index * 0.1) * 0.2; // Simpler wave on mobile
        const baseBlue = 150 + Math.abs(waveHeight) * 80; // Much brighter blue
        const baseGreen = 220 + Math.abs(waveHeight) * 35; // Much brighter green
        
        gradient.addColorStop(0, `rgba(34, ${baseGreen}, ${baseBlue}, ${dot.opacity * 0.9})`);
        gradient.addColorStop(0.4, `rgba(34, ${baseGreen}, ${baseBlue}, ${dot.opacity * 0.6})`);
        gradient.addColorStop(0.8, `rgba(34, 197, 94, ${dot.opacity * 0.3})`);
        gradient.addColorStop(1, 'rgba(34, 197, 94, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Main dot with water shimmer - much brighter
        const brightness = 0.95 + Math.sin(time * (isMobile ? 3 : 4) + index * 0.2) * 0.05;
        ctx.fillStyle = `rgba(34, ${baseGreen}, ${baseBlue}, ${Math.min(1, dot.opacity * brightness)})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fill();

        // Very bright center with water-like sparkle
        const centerShimmer = 0.8 + Math.sin(time * (isMobile ? 4 : 6) + index * 0.3) * 0.2;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, dot.opacity * centerShimmer)})`;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius * 0.5, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      style={{ 
        background: 'transparent',
        willChange: 'transform', // Optimize for animations
        transform: 'translateZ(0)' // Force hardware acceleration
      }}
    />
  );
};

export default AnimatedCells;
