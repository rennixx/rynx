import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface SmoothScrollProps {
  children: React.ReactNode;
  enabled?: boolean;
}

const SmoothScroll: React.FC<SmoothScrollProps> = ({ 
  children, 
  enabled = true 
}) => {
  const lenisRef = useRef<Lenis | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!enabled || prefersReducedMotion) return;

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // gestureDirection: 'vertical', // Removed as not supported in current version
      // smooth: true, // Removed as not supported in current version
      // mouseMultiplier: 1, // Removed as not supported in current version
      // smoothTouch: false, // Removed as not supported in current version
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Animation frame loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Handle anchor links
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement;
      
      if (anchor) {
        e.preventDefault();
        const href = anchor.getAttribute('href');
        if (href && href !== '#') {
          const element = document.querySelector(href) as HTMLElement;
          if (element) {
            lenis.scrollTo(element, {
              offset: -100, // Account for fixed header
              duration: 1.5,
            });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    // Handle button clicks for smooth scrolling
    const handleButtonClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const button = target.closest('button[data-scroll-to]') as HTMLButtonElement;
      
      if (button) {
        const scrollTarget = button.getAttribute('data-scroll-to');
        if (scrollTarget) {
          const element = document.querySelector(scrollTarget) as HTMLElement;
          if (element) {
            lenis.scrollTo(element, {
              offset: -100,
              duration: 1.5,
            });
          }
        }
      }
    };

    document.addEventListener('click', handleButtonClick);

    // Cleanup
    return () => {
      document.removeEventListener('click', handleAnchorClick);
      document.removeEventListener('click', handleButtonClick);
      lenis.destroy();
    };
  }, [enabled, prefersReducedMotion]);

  // Section snapping functionality
  useEffect(() => {
    if (!enabled || prefersReducedMotion || !lenisRef.current) return;

    const lenis = lenisRef.current;
    const sections = document.querySelectorAll('section[id]');
    
    if (sections.length === 0) return;

    let isSnapping = false;
    let snapTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      if (isSnapping) return;

      clearTimeout(snapTimeout);
      
      snapTimeout = setTimeout(() => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Don't snap if near the very top or bottom
        if (scrollY < 100 || scrollY > documentHeight - windowHeight - 100) {
          return;
        }

        let closestSection: Element | null = null;
        let closestDistance = Infinity;

        sections.forEach((section) => {
          const rect = section.getBoundingClientRect();
          const sectionTop = rect.top + scrollY;
          const distance = Math.abs(scrollY - sectionTop + 100); // Account for header offset

          if (distance < closestDistance) {
            closestDistance = distance;
            closestSection = section;
          }
        });

        // Only snap if we're reasonably close to a section
        if (closestSection && closestDistance < windowHeight * 0.3) {
          isSnapping = true;
          
          lenis.scrollTo(closestSection, {
            offset: -100,
            duration: 0.8,
            onComplete: () => {
              isSnapping = false;
            },
          });
        }
      }, 150); // Debounce scroll events
    };

    lenis.on('scroll', handleScroll);

    return () => {
      lenis.off('scroll', handleScroll);
      clearTimeout(snapTimeout);
    };
  }, [enabled, prefersReducedMotion]);

  return <>{children}</>;
};

export default SmoothScroll;
