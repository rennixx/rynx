import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface LoadingStatesProps {
  type?: 'spinner' | 'dots' | 'skeleton' | 'code';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingStates: React.FC<LoadingStatesProps> = ({
  type = 'spinner',
  size = 'md',
  className = '',
}) => {
  const prefersReducedMotion = useReducedMotion();

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  if (type === 'spinner') {
    return (
      <motion.div
        className={`${sizeClasses[size]} ${className}`}
        animate={prefersReducedMotion ? {} : { rotate: 360 }}
        transition={prefersReducedMotion ? {} : {
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <svg
          className="w-full h-full text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </motion.div>
    );
  }

  if (type === 'dots') {
    return (
      <div className={`flex space-x-2 ${className}`}>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={`bg-blue-600 rounded-full ${
              size === 'sm' ? 'w-2 h-2' : 
              size === 'md' ? 'w-3 h-3' : 'w-4 h-4'
            }`}
            animate={prefersReducedMotion ? {} : {
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={prefersReducedMotion ? {} : {
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </div>
    );
  }

  if (type === 'skeleton') {
    return (
      <div className={`space-y-3 ${className}`}>
        {[1, 2, 3].map((index) => (
          <motion.div
            key={index}
            className="h-4 bg-gray-200 rounded animate-pulse"
            style={{ width: `${100 - index * 10}%` }}
            animate={prefersReducedMotion ? {} : {
              opacity: [0.5, 1, 0.5],
            }}
            transition={prefersReducedMotion ? {} : {
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </div>
    );
  }

  if (type === 'code') {
    const codeChars = ['<', '/', '>', '{', '}', '[', ']'];
    
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        <span className="font-mono text-gray-600">Loading</span>
        {codeChars.map((char, index) => (
          <motion.span
            key={index}
            className="font-mono text-blue-600"
            animate={prefersReducedMotion ? {} : {
              opacity: [0, 1, 0],
              scale: [0.8, 1, 0.8],
            }}
            transition={prefersReducedMotion ? {} : {
              duration: 0.8,
              repeat: Infinity,
              delay: index * 0.1,
            }}
          >
            {char}
          </motion.span>
        ))}
      </div>
    );
  }

  return null;
};

// Skeleton components for different content types
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm ${className}`}>
      <motion.div
        className="h-48 bg-gray-200 rounded-lg mb-4"
        animate={prefersReducedMotion ? {} : {
          opacity: [0.5, 1, 0.5],
        }}
        transition={prefersReducedMotion ? {} : {
          duration: 1.5,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="h-4 bg-gray-200 rounded mb-2"
        animate={prefersReducedMotion ? {} : {
          opacity: [0.5, 1, 0.5],
        }}
        transition={prefersReducedMotion ? {} : {
          duration: 1.5,
          repeat: Infinity,
          delay: 0.2,
        }}
      />
      <motion.div
        className="h-4 bg-gray-200 rounded w-2/3"
        animate={prefersReducedMotion ? {} : {
          opacity: [0.5, 1, 0.5],
        }}
        transition={prefersReducedMotion ? {} : {
          duration: 1.5,
          repeat: Infinity,
          delay: 0.4,
        }}
      />
    </div>
  );
};

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 3, 
  className = '' 
}) => {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <motion.div
          key={index}
          className={`h-4 bg-gray-200 rounded ${
            index === lines - 1 ? 'w-2/3' : 'w-full'
          }`}
          animate={prefersReducedMotion ? {} : {
            opacity: [0.5, 1, 0.5],
          }}
          transition={prefersReducedMotion ? {} : {
            duration: 1.5,
            repeat: Infinity,
            delay: index * 0.2,
          }}
        />
      ))}
    </div>
  );
};

export default LoadingStates;
