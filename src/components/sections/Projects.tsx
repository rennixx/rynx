import React from 'react';
import { motion } from 'framer-motion';
import AnimatedButton from '../ui/AnimatedButton';
import { personalInfo } from '../../data/portfolioData';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const Projects: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  if (prefersReducedMotion) {
    return (
      <section id="projects" className="section-padding bg-black">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Featured Projects
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto text-balance">
                Here are some of my recent projects that showcase my skills and passion for development.
              </p>
            </div>

            {/* GitHub Button */}
            <div className="text-center">
              <button
                onClick={() => window.open(`https://github.com/${personalInfo.githubUsername}`, '_blank')}
                className="bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-200 transition-colors text-lg"
              >
                View All on GitHub
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="section-padding bg-black">
      <div className="container">
        <motion.div 
          className="max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Section Header */}
          <motion.div 
            className="text-center mb-16"
            variants={itemVariants}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Featured Projects
            </h2>
          </motion.div>

          {/* GitHub Button */}
          <motion.div 
            className="text-center"
            variants={itemVariants}
          >
            <AnimatedButton
              effect="magnetic"
              size="lg"
              onClick={() => window.open(`https://github.com/${personalInfo.githubUsername}`, '_blank')}
            >
              View All on GitHub
            </AnimatedButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
