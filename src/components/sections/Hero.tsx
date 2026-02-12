import { motion } from 'framer-motion';
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
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
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

  /* ── Proof-bar items (above-fold trust signals) ── */
  const proofItems = [
    {
      href: `https://github.com/${personalInfo.githubUsername}`,
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      ),
      label: 'GitHub',
    },
    {
      href: `mailto:${personalInfo.email}`,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Email',
    },
    {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: personalInfo.location,
      isStatic: true,
    },
    {
      icon: <div className="w-2 h-2 rounded-full bg-success animate-pulse" />,
      label: 'Available for hire',
      isStatic: true,
      highlight: true,
    },
  ];

  const badgeCls = (highlight?: boolean) =>
    'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors duration-200 ' +
    (highlight
      ? 'border-success/30 text-success bg-success/10'
      : 'border-border-subtle text-text-secondary hover:text-foreground hover:border-border-default bg-surface-1/60');

  /* ──────────── Shared JSX blocks ──────────── */
  const kicker = (
    <p className="text-sm font-mono tracking-widest uppercase text-text-tertiary mb-6">
      {personalInfo.title}
    </p>
  );

  const headline = (
    <h1 className="heading-hero text-foreground mb-4">
      I build fast, accessible{' '}
      <br className="hidden sm:block" />
      web&nbsp;experiences
    </h1>
  );

  const subHeadline = (
    <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-8 text-balance leading-relaxed">
      Full-stack developer specialising in React&nbsp;&amp;&nbsp;TypeScript.
      I turn complex problems into clean, performant interfaces that users love.
    </p>
  );

  const proofBar = (
    <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
      {proofItems.map((item, i) =>
        item.isStatic ? (
          <span key={i} className={badgeCls(item.highlight)}>
            {item.icon}
            {item.label}
          </span>
        ) : (
          <a
            key={i}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={badgeCls(item.highlight)}
          >
            {item.icon}
            {item.label}
          </a>
        ),
      )}
    </div>
  );

  const ctaButtons = (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      <AnimatedButton
        variant="solid"
        size="lg"
        effect={prefersReducedMotion ? 'none' : 'magnetic'}
        onClick={() => scrollToSection('#projects')}
      >
        View My Work
      </AnimatedButton>
      <AnimatedButton
        variant="outline"
        size="lg"
        effect={prefersReducedMotion ? 'none' : 'glitch'}
        onClick={() => scrollToSection('#contact')}
      >
        Get In Touch
      </AnimatedButton>
    </div>
  );

  /* ──────────── Reduced-motion ──────────── */
  if (prefersReducedMotion) {
    return (
      <section id="hero" className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
        <AnimatedCells />
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            {kicker}
            {headline}
            {subHeadline}
            {proofBar}
            {ctaButtons}
          </div>
        </div>
      </section>
    );
  }

  /* ──────────── Animated ──────────── */
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <AnimatedCells />

      <div className="container relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>{kicker}</motion.div>
          <motion.div variants={itemVariants}>{headline}</motion.div>
          <motion.div variants={itemVariants}>{subHeadline}</motion.div>
          <motion.div variants={itemVariants}>{proofBar}</motion.div>
          <motion.div variants={itemVariants}>{ctaButtons}</motion.div>

          {/* Scroll indicator */}
          <motion.div className="flex justify-center mt-16" variants={itemVariants}>
            <motion.button
              onClick={() => scrollToSection('#projects')}
              className="text-text-tertiary hover:text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md p-2"
              aria-label="Scroll to projects"
              whileHover={{ y: -3 }}
              animate={{ y: [0, 5, 0] }}
              transition={{ y: { repeat: Infinity, duration: 2, ease: 'easeInOut' } }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;