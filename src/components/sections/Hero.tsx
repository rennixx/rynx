import { motion } from 'framer-motion';
import AnimatedButton from '../ui/AnimatedButton';
import AnimatedCells from '../effects/AnimatedCells';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { personalInfo } from '../../data/portfolioData';
import { GitHubIcon, MailIcon, LocationIcon } from '../icons';

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
      icon: <GitHubIcon />,
      label: 'GitHub',
    },
    {
      href: `mailto:${personalInfo.email}`,
      icon: <MailIcon />,
      label: 'Email',
    },
    {
      icon: <LocationIcon />,
      label: personalInfo.location,
      isStatic: true,
    },
    {
      icon: <div className="w-2 h-2 rounded-full bg-success animate-pulse" />,
      label: 'Open to work',
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
      I turn complex problems into clean, performant interfaces
      using React&nbsp;&amp;&nbsp;TypeScript.
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
            aria-label={item.label}
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