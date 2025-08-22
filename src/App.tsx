import { useState, useEffect } from 'react';
import QueryProvider from './providers/QueryProvider';
import ErrorBoundary from './components/common/ErrorBoundary';
import { Header, Footer } from './components/layout';
import { Hero, About, Projects, Contact } from './components/sections';
// import { MatrixRain, ParticleSystem, NeuralNetwork, DNAHelix } from './components/background';
import { CursorTrail } from './components/effects';
import { SmoothScroll } from './components/animations';
import { useReducedMotion } from './hooks/useReducedMotion';
import type { NavItem } from './types';
import { Analytics } from '@vercel/analytics/react';

const App: React.FC = () => {
  // const [backgroundEffect, setBackgroundEffect] = useState<'matrix' | 'particles' | 'neural' | 'dna' | 'none'>('particles');
  const [isLoaded, setIsLoaded] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const navItems: NavItem[] = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    // { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  useEffect(() => {
    // Simulate app loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  

  const renderBackgroundEffect = () => {
    // All background animations removed
    return null;
  };

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
            {/* Background Effects */}
            {renderBackgroundEffect()}
            
            {/* Cursor Trail */}
            <CursorTrail />

            {/* Main Content */}
            <div className="relative z-10">
              <Header navItems={navItems} />
              
              <main>
                <Hero />
                <About />
                {/* <Skills /> */}
                <Projects />
                <Contact />
              </main>
              
              <Footer />
            </div>

            {/* Background Effect Indicator - Removed */}
            <Analytics />
          </div>
        </SmoothScroll>
      </QueryProvider>
    </ErrorBoundary>
  );
};

export default App;