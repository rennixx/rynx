import React from 'react';
import { motion } from 'framer-motion';
import { skills } from '../../data/portfolioData';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const categories = [
  { key: 'frontend', label: 'Frontend', accent: 'border-blue-500/40 bg-blue-500/10 text-blue-300' },
  { key: 'backend', label: 'Backend', accent: 'border-green-500/40 bg-green-500/10 text-green-300' },
  { key: 'database', label: 'Database', accent: 'border-orange-500/40 bg-orange-500/10 text-orange-300' },
  { key: 'devops', label: 'DevOps', accent: 'border-purple-500/40 bg-purple-500/10 text-purple-300' },
  { key: 'design', label: 'Design', accent: 'border-pink-500/40 bg-pink-500/10 text-pink-300' },
  { key: 'tool', label: 'Tools', accent: 'border-border-default bg-surface-1 text-text-secondary' },
] as const;

const Skills: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  const groupedSkills = categories.reduce((acc, category) => {
    acc[category.key] = skills.filter((s) => s.category === category.key);
    return acc;
  }, {} as Record<string, typeof skills>);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const } },
  };

  /* ── Shared content ── */
  const header = (
    <>
      <h2 className="heading-section text-foreground mb-4">Skills &amp; Technologies</h2>
      <p className="text-lg text-text-secondary max-w-2xl mx-auto text-balance">
        The technologies and tools I reach for when building modern web applications.
      </p>
    </>
  );

  const skillGrid = (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((cat) => {
        const items = groupedSkills[cat.key];
        if (!items?.length) return null;

        return (
          <div
            key={cat.key}
            className="rounded-xl border border-border-subtle bg-surface-1/50 p-5 space-y-3"
          >
            {/* Category label */}
            <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold border ${cat.accent}`}>
              {cat.label}
            </span>

            {/* Skills as compact chips */}
            <div className="flex flex-wrap gap-2">
              {items.map((skill) => (
                <span
                  key={skill.name}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm bg-surface-2 text-foreground border border-border-subtle hover:border-border-default transition-colors"
                >
                  {skill.name}
                  <span className="text-text-muted text-xs">{skill.yearsOfExperience}y</span>
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  /* ──────────── Reduced-motion ──────────── */
  if (prefersReducedMotion) {
    return (
      <section id="skills" className="section-padding bg-background">
        <div className="container">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center">{header}</div>
            {skillGrid}
          </div>
        </div>
      </section>
    );
  }

  /* ──────────── Animated ──────────── */
  return (
    <section id="skills" className="section-padding bg-background">
      <div className="container">
        <motion.div
          className="max-w-5xl mx-auto space-y-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div className="text-center" variants={itemVariants}>
            {header}
          </motion.div>

          <motion.div variants={itemVariants}>{skillGrid}</motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
