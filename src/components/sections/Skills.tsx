import React from 'react';
import { motion } from 'framer-motion';
import { skills } from '../../data/portfolioData';
// import { AnimatedSkills } from '../animations';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const Skills: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  const categories = [
    { key: 'frontend', label: 'Frontend', color: 'bg-blue-500/20 text-blue-300' },
    { key: 'backend', label: 'Backend', color: 'bg-green-500/20 text-green-300' },
    { key: 'database', label: 'Database', color: 'bg-orange-500/20 text-orange-300' },
    { key: 'devops', label: 'DevOps', color: 'bg-purple-500/20 text-purple-300' },
    { key: 'design', label: 'Design', color: 'bg-pink-500/20 text-pink-300' },
    { key: 'tool', label: 'Tools', color: 'bg-gray-500/20 text-gray-300' },
  ] as const;

  const groupedSkills = categories.reduce((acc, category) => {
    acc[category.key] = skills.filter(skill => skill.category === category.key);
    return acc;
  }, {} as Record<string, typeof skills>);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const getSkillLevelDots = (level: number) => {
    const dots = [];
    for (let i = 1; i <= 4; i++) {
      dots.push(
        <div
          key={i}
          className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
            i <= Math.ceil(level / 25) ? 'bg-green-400' : 'bg-gray-600'
          }`}
        />
      );
    }
    return dots;
  };

  if (prefersReducedMotion) {
    return (
      <section id="skills" className="section-padding bg-black">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Skills & Technologies
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto text-balance">
                Here are the technologies and tools I work with to bring ideas to life.
              </p>
            </div>



            {/* Skills Grid */}
            <div className="space-y-12">
              {categories.map((category) => {
                const categorySkills = groupedSkills[category.key];
                if (!categorySkills?.length) return null;

                return (
                  <div key={category.key} className="space-y-6">
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${category.color}`}>
                        {category.label}
                      </span>
                      <div className="h-px bg-gray-700 flex-1"></div>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {categorySkills.map((skill) => (
                        <div
                          key={skill.name}
                          className="group p-4 bg-gray-900 hover:bg-gray-800 rounded-lg transition-all duration-300 text-center border border-gray-700"
                        >
                          <div className="font-medium text-white text-sm mb-1">
                            {skill.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {skill.yearsOfExperience}+ years
                          </div>
                          
                          {/* Skill level indicator */}
                          <div className="mt-2 flex justify-center">
                            <div className="flex space-x-1">
                              {getSkillLevelDots(skill.level)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Additional Info */}
            <div className="mt-16 text-center">
              <p className="text-gray-400">
                Always learning and exploring new technologies to stay current with industry trends.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="section-padding bg-black">
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
              Skills & Technologies
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto text-balance">
              Here are the technologies and tools I work with to bring ideas to life.
            </p>
          </motion.div>



          {/* Skills Grid */}
          <div className="space-y-12">
            {categories.map((category, categoryIndex) => {
              const categorySkills = groupedSkills[category.key];
              if (!categorySkills?.length) return null;

              return (
                <motion.div 
                  key={category.key} 
                  className="space-y-6"
                  variants={itemVariants}
                  transition={{ delay: categoryIndex * 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${category.color}`}>
                      {category.label}
                    </span>
                    <div className="h-px bg-gray-700 flex-1"></div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {categorySkills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill.name}
                        className="group p-4 bg-gray-900 hover:bg-gray-800 rounded-lg transition-all duration-300 text-center border border-gray-700"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          delay: categoryIndex * 0.1 + skillIndex * 0.05,
                          duration: 0.4 
                        }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="font-medium text-white text-sm mb-1">
                          {skill.name}
                        </div>
                        <div className="text-xs text-gray-400">
                          {skill.yearsOfExperience}+ years
                        </div>
                        
                        {/* Skill level indicator */}
                        <div className="mt-2 flex justify-center">
                          <div className="flex space-x-1">
                            {getSkillLevelDots(skill.level)}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Additional Info */}
          <motion.div 
            className="mt-16 text-center"
            variants={itemVariants}
          >
            <p className="text-gray-400">
              Always learning and exploring new technologies to stay current with industry trends.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
