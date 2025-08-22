import { useState } from 'react';
import { motion } from 'framer-motion';
import TypewriterText from '../effects/TypewriterText';
import type { NavItem } from '../../types';
import { useReducedMotion } from '../../hooks/useReducedMotion';


interface HeaderProps {
  navItems: NavItem[];
}

const Header: React.FC<HeaderProps> = ({ navItems }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-sm border-b border-transparent">
      <div className="container">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            {prefersReducedMotion ? (
              <button
                onClick={() => scrollToSection('#hero')}
                className="text-xl sm:text-2xl font-bold text-white font-mono hover:text-gray-300 transition-colors duration-200"
                aria-label="Go to homepage"
                            >
                 <TypewriterText
                   texts={[">RYNX"]}
                   speed={150}
                   className="inline-block"
                   cursor="_"
                   loop={false}
                 />
              </button>
            ) : (
              <motion.button
                onClick={() => scrollToSection('#hero')}
                className="text-xl sm:text-2xl font-bold text-white font-mono hover:text-gray-300 transition-colors duration-200"
                aria-label="Go to homepage"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <TypewriterText
                  texts={[">RYNX"]}
                  speed={150}
                  className="inline-block"
                  cursor="_"
                  loop={false}
                />
              </motion.button>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8" role="navigation">
            {navItems.map((item, index) => (
              prefersReducedMotion ? (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="text-gray-300 hover:text-white font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 rounded-md px-2 py-1"
                >
                  {item.label}
                </button>
              ) : (
                <motion.button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="text-gray-300 hover:text-white font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 rounded-md px-2 py-1"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: 0.3 + index * 0.1,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                  whileHover={{ 
                    y: -2,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                </motion.button>
              )
            ))}
          </nav>

          {/* Mobile menu button */}
          {prefersReducedMotion ? (
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-200"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle navigation menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          ) : (
            <motion.button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-200"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle navigation menu"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </motion.button>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav
          id="mobile-menu"
          className="md:hidden bg-transparent border-t border-transparent"
          role="navigation"
        >
          <div className="container py-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className="text-left text-gray-300 hover:text-white font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 rounded-md px-2 py-2"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
