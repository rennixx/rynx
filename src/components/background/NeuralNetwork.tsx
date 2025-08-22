import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  connections: number[];
  pulse: number;
  pulseSpeed: number;
}

const NeuralNetwork: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const initNodes = () => {
      const nodeCount = 30;
      nodesRef.current = [];

      for (let i = 0; i < nodeCount; i++) {
        const node: Node = {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 4 + 2,
          connections: [],
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.02 + 0.01,
        };

        nodesRef.current.push(node);
      }

      // Create connections between nearby nodes
      nodesRef.current.forEach((node, i) => {
        const connectionCount = Math.floor(Math.random() * 3) + 1;
        const possibleConnections = nodesRef.current
          .map((_, index) => index)
          .filter(index => {
            if (index === i) return false;
            const other = nodesRef.current[index];
            const dx = node.x - other.x;
            const dy = node.y - other.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < 150;
          });

        for (let j = 0; j < Math.min(connectionCount, possibleConnections.length); j++) {
          const randomIndex = Math.floor(Math.random() * possibleConnections.length);
          const connectionIndex = possibleConnections.splice(randomIndex, 1)[0];
          if (!node.connections.includes(connectionIndex)) {
            node.connections.push(connectionIndex);
          }
        }
      });
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawConnections = () => {
      nodesRef.current.forEach((node) => {
        node.connections.forEach((connectionIndex) => {
          const connectedNode = nodesRef.current[connectionIndex];
          if (!connectedNode) return;

          const dx = node.x - connectedNode.x;
          const dy = node.y - connectedNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200) {
            const opacity = (1 - distance / 200) * 0.4;
            const pulseIntensity = (Math.sin(node.pulse) + 1) / 2;
            
            // Create gradient for the connection (much more visible)
            const gradient = ctx.createLinearGradient(node.x, node.y, connectedNode.x, connectedNode.y);
            gradient.addColorStop(0, `rgba(59, 130, 246, ${opacity * pulseIntensity * 2})`);
            gradient.addColorStop(0.5, `rgba(139, 92, 246, ${opacity * 1.5})`);
            gradient.addColorStop(1, `rgba(6, 182, 212, ${opacity * pulseIntensity * 2})`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2 + pulseIntensity * 2;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(connectedNode.x, connectedNode.y);
            ctx.stroke();

            // Add data flow effect
            const progress = (Date.now() * 0.001) % 1;
            const flowX = node.x + (connectedNode.x - node.x) * progress;
            const flowY = node.y + (connectedNode.y - node.y) * progress;
            
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
            ctx.beginPath();
            ctx.arc(flowX, flowY, 1, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      


      // Draw connections
      drawConnections();

      // Update and draw nodes
      nodesRef.current.forEach((node) => {
        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) {
          node.vx = -node.vx;
        }
        if (node.y < 0 || node.y > canvas.height) {
          node.vy = -node.vy;
        }

        // Keep nodes in bounds
        node.x = Math.max(node.radius, Math.min(canvas.width - node.radius, node.x));
        node.y = Math.max(node.radius, Math.min(canvas.height - node.radius, node.y));

        // Update pulse
        node.pulse += node.pulseSpeed;

        // Draw node with pulsing effect
        const pulseIntensity = (Math.sin(node.pulse) + 1) / 2;
        const nodeRadius = node.radius + pulseIntensity * 2;
        
        // Node glow (much more visible)
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, nodeRadius * 3
        );
        gradient.addColorStop(0, `rgba(59, 130, 246, ${0.8 * pulseIntensity})`);
        gradient.addColorStop(0.5, `rgba(139, 92, 246, ${0.5 * pulseIntensity})`);
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Node core (much more visible)
        ctx.fillStyle = `rgba(59, 130, 246, ${0.9 + pulseIntensity * 0.1})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius * 1.5, 0, Math.PI * 2);
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
      className="fixed inset-0 pointer-events-none z-0 opacity-35"
      style={{ background: 'transparent' }}
    />
  );
};

export default NeuralNetwork;