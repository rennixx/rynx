import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationsProps {
  children: React.ReactNode;
  animation?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'scaleIn' | 'slideInFromBottom';
  delay?: number;
  duration?: number;
  trigger?: string;
  start?: string;
  end?: string;
  stagger?: number;
  className?: string;
}

const ScrollAnimations: React.FC<ScrollAnimationsProps> = ({
  children,
  animation = 'fadeInUp',
  delay = 0,
  duration = 0.6,
  trigger,
  start = 'top 80%',
  end = 'bottom 20%',
  stagger = 0,
  className = '',
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !elementRef.current) return;

    const element = elementRef.current;
    const triggerElement = trigger ? document.querySelector(trigger) : element;
    
    if (!triggerElement) return;

    // Define animation presets
    const animations = {
      fadeInUp: {
        from: { opacity: 0, y: 60 },
        to: { opacity: 1, y: 0 },
      },
      fadeInLeft: {
        from: { opacity: 0, x: -60 },
        to: { opacity: 1, x: 0 },
      },
      fadeInRight: {
        from: { opacity: 0, x: 60 },
        to: { opacity: 1, x: 0 },
      },
      scaleIn: {
        from: { opacity: 0, scale: 0.8 },
        to: { opacity: 1, scale: 1 },
      },
      slideInFromBottom: {
        from: { opacity: 0, y: 100 },
        to: { opacity: 1, y: 0 },
      },
    };

    const animationConfig = animations[animation];
    
    // Set initial state
    gsap.set(element, animationConfig.from);

    // Create scroll trigger animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start,
        end,
        toggleActions: 'play none none reverse',
        markers: false, // Set to true for debugging
      },
    });

    if (stagger > 0) {
      // Animate children with stagger
      const children = element.children;
      tl.to(children, {
        ...animationConfig.to,
        duration,
        delay,
        stagger,
        ease: 'power2.out',
      });
    } else {
      // Animate the element itself
      tl.to(element, {
        ...animationConfig.to,
        duration,
        delay,
        ease: 'power2.out',
      });
    }

    return () => {
      tl.kill();
    };
  }, [animation, delay, duration, trigger, start, end, stagger, prefersReducedMotion]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};

// Utility component for batch animations
export const ScrollStagger: React.FC<{
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}> = ({ children, staggerDelay = 0.1, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !containerRef.current) return;

    const container = containerRef.current;
    const items = container.children;

    // Set initial state for all items
    gsap.set(items, {
      opacity: 0,
      y: 30,
    });

    // Create staggered animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: staggerDelay,
      ease: 'power2.out',
    });

    return () => {
      tl.kill();
    };
  }, [staggerDelay, prefersReducedMotion]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

// Parallax component
export const ParallaxElement: React.FC<{
  children: React.ReactNode;
  speed?: number;
  className?: string;
}> = ({ children, speed = 0.5, className = '' }) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !elementRef.current) return;

    const element = elementRef.current;

    gsap.to(element, {
      yPercent: -50 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [speed, prefersReducedMotion]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};

export default ScrollAnimations;
