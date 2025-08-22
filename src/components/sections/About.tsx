import React from 'react';
import { motion } from 'framer-motion';
import { personalInfo, experiences } from '../../data/portfolioData';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const About: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();



  // Get latest experience for current role display
  const currentRole = experiences[0];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
      <section id="about" className="section-padding bg-black">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                About Me
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto text-balance">
                I'm a dedicated developer with a passion for creating innovative solutions 
                that make a difference in people's lives.
              </p>
            </div>

            <div className="max-w-4xl mx-auto text-center">
              {/* Content */}
              <div className="space-y-6">
                {/* Current Role */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {personalInfo.title}
                  </h3>
                  <p className="text-green-400 text-sm font-mono">
                    {currentRole.position} @ {currentRole.company} • {currentRole.location}
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-300 leading-relaxed">
                    {personalInfo.bio}
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    I believe in writing clean, maintainable code and following best practices. 
                    Whether it's a complex web application or a simple landing page, I approach 
                    every project with attention to detail and a commitment to excellence.
                  </p>
                </div>

                {/* Divider Line */}
                <div className="flex justify-center pt-8">
                  <div className="w-32 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
                </div>


              </div>

              {/* Image placeholder */}
              <div className="order-first lg:order-last">
                <div className="aspect-square bg-gray-700 rounded-2xl flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <svg
                      className="w-16 h-16 mx-auto mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <p className="text-sm">Your Photo Here</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="about" className="section-padding bg-black">
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
              About Me
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto text-balance">
              I'm a dedicated developer with a passion for creating innovative solutions 
              that make a difference in people's lives.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto text-center">
            {/* Content */}
            <motion.div 
              className="space-y-6"
              variants={itemVariants}
            >
              {/* Current Role */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {personalInfo.title}
                </h3>
                <p className="text-green-400 text-sm font-mono">
                  {currentRole.position} @ {currentRole.company} • {currentRole.location}
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  {personalInfo.bio}
                </p>
              </div>

                              {/* Divider Line */}
                <div className="flex justify-center pt-8">
                  <div className="w-32 h-px bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
                </div>


            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
