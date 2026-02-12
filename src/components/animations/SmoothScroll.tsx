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
  const rafIdRef = useRef<number>(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!enabled || prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false,
    });

    lenisRef.current = lenis;

    // Tracked rAF loop
    function raf(time: number) {
      lenis.raf(time);
      rafIdRef.current = requestAnimationFrame(raf);
    }
    rafIdRef.current = requestAnimationFrame(raf);

    // Handle anchor links
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;

      // Anchor links
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href !== '#') {
          e.preventDefault();
          const el = document.querySelector(href) as HTMLElement | null;
          if (el) lenis.scrollTo(el, { offset: -80, duration: 1.2 });
        }
        return;
      }

      // Buttons with data-scroll-to
      const button = target.closest('button[data-scroll-to]') as HTMLButtonElement | null;
      if (button) {
        const scrollTarget = button.getAttribute('data-scroll-to');
        if (scrollTarget) {
          const el = document.querySelector(scrollTarget) as HTMLElement | null;
          if (el) lenis.scrollTo(el, { offset: -80, duration: 1.2 });
        }
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
      cancelAnimationFrame(rafIdRef.current);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [enabled, prefersReducedMotion]);

  return <>{children}</>;
};

export default SmoothScroll;
