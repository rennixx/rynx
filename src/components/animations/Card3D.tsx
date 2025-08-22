import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  flipOnHover?: boolean;
  glowEffect?: boolean;
}

const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
  intensity = 0.1,
  flipOnHover = false,
  glowEffect = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateXValue = (mouseY / (rect.height / 2)) * -intensity * 100;
    const rotateYValue = (mouseX / (rect.width / 2)) * intensity * 100;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  if (prefersReducedMotion) {
    return (
      <div className={`relative ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      className={`relative perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        perspective: '1000px',
      }}
    >
      <motion.div
        className="relative w-full h-full transform-gpu"
        animate={{
          rotateX: flipOnHover && isHovered ? 180 : rotateX,
          rotateY: rotateY,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Front face */}
        <div
          className={`relative w-full h-full ${
            flipOnHover ? 'backface-hidden' : ''
          }`}
          style={{
            backfaceVisibility: flipOnHover ? 'hidden' : 'visible',
          }}
        >
          {children}
          
          {/* Glow effect */}
          {glowEffect && (
            <motion.div
              className="absolute inset-0 rounded-inherit pointer-events-none"
              animate={{
                boxShadow: isHovered
                  ? '0 20px 40px rgba(59, 130, 246, 0.3), 0 0 0 1px rgba(59, 130, 246, 0.1)'
                  : '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
              transition={{ duration: 0.3 }}
            />
          )}
          
          {/* Light reflection effect */}
          <motion.div
            className="absolute inset-0 rounded-inherit pointer-events-none overflow-hidden"
            style={{
              background: `linear-gradient(${
                rotateY * 2 + 45
              }deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)`,
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Back face (for flip effect) */}
        {flipOnHover && (
          <div
            className="absolute inset-0 w-full h-full backface-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateX(180deg)',
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 rounded-inherit flex items-center justify-center text-white">
              <div className="text-center">
                <div className="text-4xl mb-2">🚀</div>
                <p className="font-semibold">Hover to flip back!</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Card3D;
