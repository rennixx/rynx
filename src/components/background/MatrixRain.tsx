import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface Particle {
  x: number;
  y: number;
  speed: number;
  char: string;
  opacity: number;
  age: number;
  maxAge: number;
}

const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const prefersReducedMotion = useReducedMotion();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Matrix characters including binary, brackets, and coding symbols
  const characters = [
    '0', '1', '{', '}', '[', ']', '(', ')', '<', '>',
    '/', '\\', '|', '-', '_', '+', '=', '*', '&', '%',
    '$', '#', '@', '!', '?', ';', ':', '.', ',', '"',
    "'", '`', '~', '^', 'A', 'B', 'C', 'D', 'E', 'F'
  ];

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || !dimensions.width || !dimensions.height) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Initialize particles
    const initParticles = () => {
      const particleCount = Math.min(100, Math.floor(dimensions.width / 20));
      particlesRef.current = [];

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          speed: Math.random() * 2 + 0.5,
          char: characters[Math.floor(Math.random() * characters.length)],
          opacity: Math.random() * 0.5 + 0.1,
          age: 0,
          maxAge: Math.random() * 200 + 100,
        });
      }
    };

    initParticles();

    const animate = () => {
      // Clear canvas with slight fade for trailing effect (black background)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
      


      ctx.font = '14px JetBrains Mono, monospace';
      ctx.textAlign = 'center';

      particlesRef.current.forEach((particle) => {
        // Update particle
        particle.y += particle.speed;
        particle.age++;

        // Reset particle if it goes off screen or reaches max age
        if (particle.y > dimensions.height + 20 || particle.age > particle.maxAge) {
          particle.x = Math.random() * dimensions.width;
          particle.y = -20;
          particle.speed = Math.random() * 2 + 0.5;
          particle.char = characters[Math.floor(Math.random() * characters.length)];
          particle.opacity = Math.random() * 0.5 + 0.1;
          particle.age = 0;
          particle.maxAge = Math.random() * 200 + 100;
        }

        // Calculate fade effect based on age
        const fadeOpacity = particle.age < 50 
          ? particle.opacity * (particle.age / 50)
          : particle.opacity * (1 - (particle.age - 50) / (particle.maxAge - 50));

        // Draw particle with green matrix-style color (darker for visibility on white)
        ctx.fillStyle = `rgba(0, 180, 0, ${Math.max(0.3, fadeOpacity)})`;
        ctx.fillText(particle.char, particle.x, particle.y);

        // Add trailing effect
        if (particle.age > 10) {
          ctx.fillStyle = `rgba(0, 150, 0, ${Math.max(0.1, fadeOpacity * 0.4)})`;
          ctx.fillText(
            characters[Math.floor(Math.random() * characters.length)], 
            particle.x, 
            particle.y - 20
          );
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dimensions, prefersReducedMotion, characters]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40"
      style={{ background: 'transparent' }}
    />
  );
};

export default MatrixRain;
