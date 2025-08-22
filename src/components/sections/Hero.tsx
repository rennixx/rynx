import { motion } from 'framer-motion';
import { Button } from '../ui';
import AnimatedButton from '../ui/AnimatedButton';
import AnimatedCells from '../effects/AnimatedCells';

import { useReducedMotion } from '../../hooks/useReducedMotion';
import { personalInfo } from '../../data/portfolioData';

const Hero: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };



  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  if (prefersReducedMotion) {
    return (
      <section id="hero" className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
        <AnimatedCells />
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              <span className="block">Hi, I'm</span>
              <span className="block text-gray-400 font-mono">
                &lt;{personalInfo.name.split(' ')[0]} /&gt;
              </span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              {personalInfo.bio}
            </p>
            
            {/* Stats Row */}
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Button variant="solid" size="lg" onClick={() => scrollToSection('#projects')}>
                View My Work
              </Button>
              <Button variant="outline" size="lg" onClick={() => scrollToSection('#contact')}>
                Get In Touch
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      <AnimatedCells />
      
      <div className="container relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main heading */}
          <motion.div 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 space-y-4"
            variants={itemVariants}
          >
            <motion.div 
              className="block font-mono text-center"
              variants={itemVariants}
            >
              Hi, I'm Ren
            </motion.div>
            <motion.div 
              className="text-2xl sm:text-3xl lg:text-4xl text-gray-400 font-mono block text-center"
              variants={itemVariants}
            >
               Software Engineer | Full-Stack Developer
            </motion.div>
            <motion.div 
              className="text-lg sm:text-xl lg:text-2xl text-gray-500 font-mono block text-center"
              variants={itemVariants}
            >
                            Passionate about creating innovative solutions with React, TypeScript, and modern web technologies
            </motion.div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            variants={itemVariants}
          >
            <AnimatedButton
              variant="solid"
              size="lg"
              effect="magnetic"
              onClick={() => scrollToSection('#projects')}
            >
              View My Work
            </AnimatedButton>
            
            <AnimatedButton
              variant="outline"
              size="lg"
              effect="glitch"
              onClick={() => scrollToSection('#contact')}
            >
              Get In Touch
            </AnimatedButton>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div 
            className="flex justify-center"
            variants={itemVariants}
          >
            <motion.button
              onClick={() => scrollToSection('#about')}
              className="text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 rounded-md p-2"
              aria-label="Scroll to about section"
              whileHover={{ y: -3 }}
              animate={{ y: [0, 5, 0] }}
              transition={{ 
                y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
              }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;