import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Animation configurations
export const ANIMATION_CONFIG = {
  duration: {
    fast: 0.2,
    normal: 0.4,
    slow: 0.6,
    loading: 2,
  },
  easing: {
    smooth: 'power2.out',
    bounce: 'back.out(1.7)',
    elastic: 'elastic.out(1, 0.3)',
  },
  stagger: {
    fast: 0.05,
    normal: 0.1,
    slow: 0.15,
  },
};

// Common animation variants for Framer Motion
export const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 },
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 },
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

export const slideInFromBottom = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0 },
};

// Stagger container variants
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: ANIMATION_CONFIG.stagger.normal,
    },
  },
};

// Performance optimized animation settings
export const getAnimationProps = (prefersReducedMotion: boolean) => ({
  initial: prefersReducedMotion ? false : 'hidden',
  animate: prefersReducedMotion ? false : 'visible',
  transition: {
    duration: prefersReducedMotion ? 0 : ANIMATION_CONFIG.duration.normal,
    ease: ANIMATION_CONFIG.easing.smooth,
  },
});

// Hardware acceleration utility
export const enableHardwareAcceleration = (element: HTMLElement) => {
  element.style.transform = 'translateZ(0)';
  element.style.willChange = 'transform, opacity';
};

// Clean up hardware acceleration
export const disableHardwareAcceleration = (element: HTMLElement) => {
  element.style.willChange = 'auto';
};
