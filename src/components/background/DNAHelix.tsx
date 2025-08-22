import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

// Removed unused interface

const DNAHelix: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const prefersReducedMotion = useReducedMotion();
  const timeRef = useRef(0);

  // DNA-like coding characters
  const dnaChars = ['A', 'T', 'G', 'C', '{', '}', '(', ')', '[', ']', '0', '1'];

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

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const helixHeight = canvas.height * 0.8;
      const helixWidth = 100;
      const points = 60;
      const rotationSpeed = 0.01;

      timeRef.current += rotationSpeed;

      // Draw double helix
      for (let strand = 0; strand < 2; strand++) {
        const strandOffset = strand * Math.PI;
        
        for (let i = 0; i < points; i++) {
          const t = (i / points) * Math.PI * 4; // Multiple turns
          const y = (i / points) * helixHeight - helixHeight / 2;
          
          // Calculate helix positions
          const x1 = centerX + Math.cos(t + timeRef.current + strandOffset) * helixWidth;
          const z1 = Math.sin(t + timeRef.current + strandOffset) * helixWidth;
          const x2 = centerX + Math.cos(t + timeRef.current + strandOffset + Math.PI) * helixWidth;
          const z2 = Math.sin(t + timeRef.current + strandOffset + Math.PI) * helixWidth;
          
          // Convert 3D to 2D (simple perspective)
          const perspective = 300;
          const scale1 = perspective / (perspective + z1);
          const scale2 = perspective / (perspective + z2);
          
          const screenX1 = x1 * scale1;
          const screenY1 = (centerY + y) * scale1;
          const screenX2 = x2 * scale2;
          const screenY2 = (centerY + y) * scale2;
          
          // Calculate opacity based on z-depth
          const opacity1 = (z1 + helixWidth) / (helixWidth * 2) * 0.6 + 0.2;
          const opacity2 = (z2 + helixWidth) / (helixWidth * 2) * 0.6 + 0.2;
          
          // Draw connection between strands (base pairs) - darker for white background
          if (i % 3 === 0) {
            const gradient = ctx.createLinearGradient(screenX1, screenY1, screenX2, screenY2);
            gradient.addColorStop(0, `rgba(30, 64, 175, ${opacity1 * 0.6})`);
            gradient.addColorStop(1, `rgba(124, 58, 237, ${opacity2 * 0.6})`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(screenX1, screenY1);
            ctx.lineTo(screenX2, screenY2);
            ctx.stroke();
          }
          
          // Draw strand points with characters
          const char1 = dnaChars[i % dnaChars.length];
          const char2 = dnaChars[(i + 1) % dnaChars.length];
          
          // First strand (darker for white background)
          ctx.font = '12px JetBrains Mono, monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = `rgba(30, 64, 175, ${Math.max(0.4, opacity1)})`;
          ctx.fillText(char1, screenX1, screenY1);
          
          // Second strand
          ctx.fillStyle = `rgba(124, 58, 237, ${Math.max(0.4, opacity2)})`;
          ctx.fillText(char2, screenX2, screenY2);
          
          // Add glow effect (darker for white background)
          ctx.shadowColor = strand === 0 ? 'rgba(30, 64, 175, 0.3)' : 'rgba(124, 58, 237, 0.3)';
          ctx.shadowBlur = 8;
          ctx.fillText(strand === 0 ? char1 : char2, strand === 0 ? screenX1 : screenX2, strand === 0 ? screenY1 : screenY2);
          ctx.shadowBlur = 0;
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [prefersReducedMotion, dnaChars]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-25"
      style={{ background: 'transparent' }}
    />
  );
};

export default DNAHelix;
