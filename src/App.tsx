import { useState, useEffect } from 'react';
import QueryProvider from './providers/QueryProvider';
import ErrorBoundary from './components/common/ErrorBoundary';
import { Header, Footer } from './components/layout';
import { Hero, About, Skills, Projects, Contact } from './components/sections';
import { CursorTrail } from './components/effects';
import { SmoothScroll } from './components/animations';
import { useReducedMotion } from './hooks/useReducedMotion';
import type { NavItem } from './types';
import { Analytics } from '@vercel/analytics/react';
import { injectSpeedInsights } from '@vercel/speed-insights';

const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const navItems: NavItem[] = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    // Simulate app loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    // Inject SpeedInsights
    const speedInsights = injectSpeedInsights();
    if (speedInsights) {
      speedInsights.setRoute(window.location.pathname);
    }

    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="mt-4 text-gray-400 font-mono">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <QueryProvider>
        <SmoothScroll enabled={!prefersReducedMotion}>
          <div className="min-h-screen bg-black relative">
            {/* Skip to content link for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-md focus:text-sm focus:font-medium"
            >
              Skip to main content
            </a>

            {/* Cursor Trail */}
            <CursorTrail />

            {/* Main Content */}
            <div className="relative z-10">
              <Header navItems={navItems} />
              
              <main id="main-content">
                <Hero />
                <About />
                <Skills />
                <Projects />
                <Contact />
              </main>
              
              <Footer />
            </div>

            <Analytics />
          </div>
        </SmoothScroll>
      </QueryProvider>
    </ErrorBoundary>
  );
};

export default App;