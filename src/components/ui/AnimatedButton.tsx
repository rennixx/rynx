import { forwardRef, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import type { ButtonProps } from '../../types';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface AnimatedButtonProps extends ButtonProps {
  effect?: 'magnetic' | 'glitch' | 'morph' | 'none';
}

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ 
    children, 
    variant = 'solid', 
    size = 'md', 
    className = '', 
    disabled = false,
    type = 'button',
    onClick,
    effect = 'magnetic',
    ...props 
  }, ref) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const magnetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
    const prefersReducedMotion = useReducedMotion();

    const baseClasses = 'relative inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden';
    
    const variantClasses = {
      solid: 'bg-white text-black hover:bg-gray-200 active:bg-gray-300',
      outline: 'border-2 border-white text-white hover:bg-white hover:text-black active:bg-gray-200',
      ghost: 'text-white hover:bg-gray-800 active:bg-gray-700',
    };
    
    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    // Magnetic effect
    useEffect(() => {
      if (prefersReducedMotion || effect !== 'magnetic' || !buttonRef.current) return;

      const button = buttonRef.current;
      
      const handleMouseMove = (e: MouseEvent) => {
        const rect = button.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) * 0.3;
        const deltaY = (e.clientY - centerY) * 0.3;
        
        magnetRef.current = { x: deltaX, y: deltaY };
        
        gsap.to(button, {
          x: deltaX,
          y: deltaY,
          duration: 0.3,
          ease: 'power2.out',
        });
      };

      const handleMouseLeave = () => {
        gsap.to(button, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)',
        });
      };

      button.addEventListener('mousemove', handleMouseMove);
      button.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        button.removeEventListener('mousemove', handleMouseMove);
        button.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, [effect, prefersReducedMotion]);

    // Glitch effect
    const glitchAnimation = {
      hidden: { opacity: 1 },
      hover: {
        opacity: [1, 0.8, 1, 0.9, 1],
        x: [0, -2, 2, -1, 0],
      },
    };

    // Morph effect
    const morphAnimation = {
      hidden: { 
        borderRadius: '9999px',
        scale: 1,
      },
      hover: {
        borderRadius: ['9999px', '12px', '9999px'],
        scale: [1, 1.05, 1],
      },
    };

    const getAnimationProps = () => {
      if (prefersReducedMotion || effect === 'none') {
        return {};
      }

      switch (effect) {
        case 'glitch':
          return {
            variants: glitchAnimation,
            initial: 'hidden',
            whileHover: 'hover',
          };
        case 'morph':
          return {
            variants: morphAnimation,
            initial: 'hidden',
            whileHover: 'hover',
          };
        default:
          return {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 },
          };
      }
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
    
    return (
      <motion.button
        ref={(node) => {
          buttonRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        type={type}
        className={classes}
        disabled={disabled}
        onClick={onClick}
        {...getAnimationProps()}
        {...props}
      >
        {/* Ripple effect overlay */}
        <motion.div
          className="absolute inset-0 rounded-full"
          initial={{ scale: 0, opacity: 0 }}
          whileTap={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 0.2 }}
          style={{
            background: variant === 'solid' ? 'white' : 'currentColor',
          }}
        />
        
        {/* Glitch overlay for glitch effect */}
        {effect === 'glitch' && !prefersReducedMotion && (
          <>
            <motion.div
              className="absolute inset-0 bg-red-500 mix-blend-multiply opacity-0"
              animate={{
                opacity: [0, 0, 0, 0.1, 0],
                x: [0, -1, 1, 0, 0],
              }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            />
            <motion.div
              className="absolute inset-0 bg-blue-500 mix-blend-multiply opacity-0"
              animate={{
                opacity: [0, 0, 0.1, 0, 0],
                x: [0, 1, -1, 0, 0],
              }}
              transition={{
                duration: 0.3,
                repeat: Infinity,
                repeatDelay: 2.1,
              }}
            />
          </>
        )}
        
        <span className="relative z-10">{children}</span>
      </motion.button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';

export default AnimatedButton;
