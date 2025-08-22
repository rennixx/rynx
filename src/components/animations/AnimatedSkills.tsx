import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import type { Skill } from '../../types';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedSkillsProps {
  skills: Skill[];
  variant?: 'progress' | 'nodes' | 'bars';
}

const AnimatedSkills: React.FC<AnimatedSkillsProps> = ({ 
  skills, 
  variant = 'progress' 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { ref: intersectionRef, hasIntersected } = useIntersectionObserver({
    threshold: 0.3,
  });
  const prefersReducedMotion = useReducedMotion();

  const skillLevels = {
    beginner: 25,
    intermediate: 50,
    advanced: 75,
    expert: 90,
  };

  useEffect(() => {
    if (prefersReducedMotion || !hasIntersected || !containerRef.current) return;

    const container = containerRef.current;
    const progressBars = container.querySelectorAll('.progress-bar');
    const skillItems = container.querySelectorAll('.skill-item');

    // Animate progress bars
    progressBars.forEach((bar, index) => {
      const skill = skills[index];
      if (!skill?.level) return;

      const percentage = skillLevels[skill.level];
      
      gsap.fromTo(bar, 
        { width: '0%' },
        {
          width: `${percentage}%`,
          duration: 1.5,
          ease: 'power2.out',
          delay: index * 0.1,
        }
      );
    });

    // Animate skill items
    gsap.fromTo(skillItems,
      { 
        opacity: 0, 
        y: 30,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'back.out(1.7)',
        stagger: 0.1,
      }
    );

  }, [hasIntersected, skills, skillLevels, prefersReducedMotion]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.9,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
    },
  };

  if (variant === 'progress') {
    return (
      <div 
        ref={(node) => {
          containerRef.current = node;
          intersectionRef.current = node;
        }}
        className="space-y-6"
      >
        <motion.div
          variants={containerVariants}
          initial={prefersReducedMotion ? 'visible' : 'hidden'}
          animate={hasIntersected ? 'visible' : 'hidden'}
          className="grid gap-4"
        >
          {skills.map((skill) => (
            <motion.div
              key={skill.id}
              variants={itemVariants}
              className="skill-item"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-white">{skill.name}</span>
                <span className="text-sm text-gray-400 capitalize">
                  {skill.level}
                </span>
              </div>
              <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="progress-bar absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                  initial={{ width: '0%' }}
                  style={{ width: '0%' }}
                />
                {/* Animated shine effect */}
                <motion.div
                  className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                    ease: 'linear',
                  }}
                  style={{ width: '30%' }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  }

  if (variant === 'nodes') {
    return (
      <div 
        ref={(node) => {
          containerRef.current = node;
          intersectionRef.current = node;
        }}
        className="relative"
      >
        <motion.div
          variants={containerVariants}
          initial={prefersReducedMotion ? 'visible' : 'hidden'}
          animate={hasIntersected ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {skills.map((skill, index) => (
            <motion.div
              key={skill.id}
              variants={itemVariants}
              className="skill-item relative group"
            >
              <motion.div
                className="relative p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                whileHover={{ 
                  scale: prefersReducedMotion ? 1 : 1.05,
                  rotateY: prefersReducedMotion ? 0 : 5,
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Skill level indicator */}
                <div className="absolute top-2 right-2">
                  <motion.div
                    className={`w-3 h-3 rounded-full ${
                      skill.level === 'expert' ? 'bg-green-500' :
                      skill.level === 'advanced' ? 'bg-blue-500' :
                      skill.level === 'intermediate' ? 'bg-yellow-500' :
                      'bg-gray-400'
                    }`}
                    animate={{
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  />
                </div>

                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {skill.name}
                  </h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {skill.level}
                  </p>
                </div>

                {/* Hover effect overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-xl opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  }

  return null;
};

export default AnimatedSkills;
