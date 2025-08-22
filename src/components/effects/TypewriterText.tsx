import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface TypewriterTextProps {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  delayBetween?: number;
  delay?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  cursor?: string;
  loop?: boolean;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  texts,
  speed = 100,
  deleteSpeed = 50,
  delayBetween = 2000,
  delay = 0,
  className = '',
  prefix = '',
  suffix = '',
  cursor = '|',
  loop = true,
}) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setCurrentText(texts[0] || '');
      return;
    }

    // Initial delay before starting animation
    if (delay > 0 && currentText === '' && currentTextIndex === 0) {
      const initialTimeout = setTimeout(() => {
        setCurrentText('');
      }, delay);
      return () => clearTimeout(initialTimeout);
    }

    const currentFullText = texts[currentTextIndex] || '';
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < currentFullText.length) {
          setCurrentText(currentFullText.substring(0, currentText.length + 1));
        } else {
          // Start deleting after delay
          setTimeout(() => setIsDeleting(true), delayBetween);
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentText.substring(0, currentText.length - 1));
        } else {
          setIsDeleting(false);
          if (loop) {
            setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
          } else {
            // For non-looping, move to next text if available
            setCurrentTextIndex((prevIndex) => {
              const nextIndex = prevIndex + 1;
              return nextIndex < texts.length ? nextIndex : prevIndex;
            });
          }
        }
      }
    }, isDeleting ? deleteSpeed : speed);

    return () => clearTimeout(timeout);
  }, [
    currentText, 
    currentTextIndex, 
    isDeleting, 
    texts, 
    speed, 
    deleteSpeed, 
    delayBetween, 
    loop,
    prefersReducedMotion
  ]);

  // Cursor blinking effect
  useEffect(() => {
    if (prefersReducedMotion) return;

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <span className={className}>
        {prefix}{texts[0] || ''}{suffix}
      </span>
    );
  }

  return (
    <span className={className}>
      {prefix}
      <motion.span
        key={currentTextIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
      >
        {currentText}
      </motion.span>
      <motion.span
        animate={{ opacity: showCursor ? 1 : 0 }}
        transition={{ duration: 0.1 }}
        className="text-gray-600"
      >
        {cursor}
      </motion.span>
      {suffix}
    </span>
  );
};

export default TypewriterText;
