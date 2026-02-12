import React from 'react';
import { motion } from 'framer-motion';
import { personalInfo, experiences, skills } from '../../data/portfolioData';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const About: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();

  const currentRole = experiences[0];
  const yearsOfExperience = new Date().getFullYear() - 2021; // started 2021
  const totalProjects = 10; // approximate
  const topSkillsCount = skills.filter(s => s.level >= 80).length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
    },
  };

  /* ── Stats cards ── */
  const stats = [
    { value: `${yearsOfExperience}+`, label: 'Years Experience' },
    { value: `${totalProjects}+`, label: 'Projects Shipped' },
    { value: `${topSkillsCount}`, label: 'Core Technologies' },
  ];

  /* ── Experience timeline ── */
  const timeline = experiences.map((exp) => ({
    role: exp.position,
    company: exp.company,
    period: `${new Date(exp.startDate).getFullYear()} – ${exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}`,
    description: exp.description,
    achievements: exp.achievements,
    tech: exp.technologies.slice(0, 5),
  }));

  /* ── Shared content blocks ── */
  const header = (
    <>
      <h2 className="heading-section text-foreground mb-4">About Me</h2>
      <p className="text-lg text-text-secondary max-w-2xl mx-auto text-balance leading-relaxed">
        {personalInfo.bio}
      </p>
    </>
  );

  const currentRoleBadge = (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-success/30 bg-success/10 text-success text-sm font-medium mt-6">
      <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
      {currentRole.position} @ {currentRole.company}
    </div>
  );

  const statsRow = (
    <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <div className="text-3xl font-bold text-foreground font-mono">{stat.value}</div>
          <div className="text-xs text-text-tertiary mt-1 uppercase tracking-wide">{stat.label}</div>
        </div>
      ))}
    </div>
  );

  const experienceTimeline = (
    <div className="max-w-2xl mx-auto space-y-8">
      <h3 className="text-lg font-semibold text-foreground text-center">Experience</h3>
      <div className="relative space-y-6 pl-6 border-l border-border-default">
        {timeline.map((item, i) => (
          <div key={i} className="relative">
            {/* Timeline dot */}
            <div className="absolute -left-[calc(0.75rem+1.5px)] top-1.5 w-3 h-3 rounded-full border-2 border-primary bg-background" />

            <div className="space-y-1">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-semibold text-foreground">{item.role}</span>
                <span className="text-text-tertiary text-sm">@ {item.company}</span>
              </div>
              <p className="text-xs text-text-muted font-mono">{item.period}</p>
              {item.achievements.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {item.achievements.map((a, j) => (
                    <li key={j} className="text-sm text-text-secondary flex items-start gap-2">
                      <span className="text-primary mt-0.5">›</span>
                      {a}
                    </li>
                  ))}
                </ul>
              )}
              {item.tech.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {item.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 text-xs rounded bg-surface-1 text-text-tertiary border border-border-subtle"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ──────────── Reduced-motion ──────────── */
  if (prefersReducedMotion) {
    return (
      <section id="about" className="section-padding bg-background">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div>{header}{currentRoleBadge}</div>
            {statsRow}
            {experienceTimeline}
          </div>
        </div>
      </section>
    );
  }

  /* ──────────── Animated ──────────── */
  return (
    <section id="about" className="section-padding bg-background">
      <div className="container">
        <motion.div
          className="max-w-4xl mx-auto text-center space-y-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.div variants={itemVariants}>
            {header}
            {currentRoleBadge}
          </motion.div>
          <motion.div variants={itemVariants}>{statsRow}</motion.div>
          <motion.div variants={itemVariants}>{experienceTimeline}</motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
