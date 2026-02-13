import { motion, useReducedMotion as fmReducedMotion } from 'framer-motion'
import AnimatedCells from '../effects/AnimatedCells'
import { personalInfo } from '../../data/portfolioData'
import { GitHubIcon, MailIcon, LocationIcon } from '../icons'
import { fadeUp, motionElements } from '../../utils/motion'

const wordReveal = {
  hidden: { opacity: 0, y: 40, rotateX: 45 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.7,
      delay: 0.4 + i * 0.08,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  }),
}

/* ──────────── Proof bar badge ──────────── */
function GlassPill({
  href,
  children,
  highlight,
  label,
}: {
  href?: string
  children: React.ReactNode
  highlight?: boolean
  label?: string
}) {
  const cls = `inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium
    backdrop-blur-md transition-all duration-200
    ${
      highlight
        ? 'border border-success/30 text-success bg-success/10'
        : 'border border-[var(--glass-border)] text-text-secondary bg-[var(--glass-bg)] hover:text-foreground hover:border-[var(--glass-border-hover)]'
    }`

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} aria-label={label}>
        {children}
      </a>
    )
  }
  return <span className={cls}>{children}</span>
}

/* ──────────── Hero ──────────── */
const Hero: React.FC = () => {
  const prefersReducedMotion = fmReducedMotion()

  const headline = 'I build things for the web.'
  const words = headline.split(' ')

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <HeroBackground />
      <HeroContent words={words} animated={!prefersReducedMotion} />
    </section>
  )
}

/* ──────────── Background layer ──────────── */
function HeroBackground() {
  return (
    <>
      <AnimatedCells />
      {/* Radial violet glow behind text */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.546 0.245 275 / 6%) 0%, transparent 70%)',
        }}
      />
      {/* Bottom fade for section bleed */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-[1]" />
    </>
  )
}

/* ──────────── Content ──────────── */
function HeroContent({ words, animated }: { words: string[]; animated: boolean }) {
  const { Wrapper, Item, wrapperProps } = motionElements(animated, 'animate')

  return (
    <div className="container relative z-10">
      <Wrapper className="max-w-4xl mx-auto text-center" {...wrapperProps}>
        {/* Overline */}
        <Item {...(animated ? { variants: fadeUp } : {})}>
          <p className="text-overline text-text-tertiary mb-6">
            {personalInfo.title}
          </p>
        </Item>

        {/* Headline — word-by-word reveal */}
        <h1
          className="text-display text-foreground mb-5"
          style={{ perspective: '800px' }}
        >
          {words.map((word, i) => {
            if (!animated) {
              return (
                <span key={i} className="inline-block mr-[0.3em]">
                  {word}
                </span>
              )
            }
            return (
              <motion.span
                key={i}
                className="inline-block mr-[0.3em] origin-bottom"
                variants={wordReveal}
                custom={i}
                initial="hidden"
                animate="visible"
              >
                {word}
              </motion.span>
            )
          })}
        </h1>

        {/* Sub-headline */}
        <Item {...(animated ? { variants: fadeUp } : {})}>
          <p className="text-body-lg text-text-secondary max-w-xl mx-auto mb-10 text-balance">
            {personalInfo.title} — React, TypeScript, Node.js
          </p>
        </Item>

        {/* Proof bar */}
        <Item {...(animated ? { variants: fadeUp } : {})}>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <GlassPill
              href={personalInfo.githubUrl}
              label="GitHub profile"
            >
              <GitHubIcon />
              GitHub
            </GlassPill>

            <GlassPill href={`mailto:${personalInfo.email}`} label="Send email">
              <MailIcon />
              Email
            </GlassPill>

            <GlassPill>
              <LocationIcon />
              {personalInfo.location}
            </GlassPill>

            <GlassPill highlight>
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              Open to work
            </GlassPill>
          </div>
        </Item>

        {/* CTA */}
        <Item {...(animated ? { variants: fadeUp } : {})}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-medium text-sm
                bg-primary text-primary-foreground
                hover:bg-primary-hover transition-colors duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              See my work
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </a>
            <a
              href="#contact"
              className="text-sm text-text-secondary hover:text-foreground transition-colors duration-200 underline underline-offset-4 decoration-border-subtle hover:decoration-foreground"
            >
              or get in touch
            </a>
          </div>
        </Item>

        {/* Scroll indicator — mouse wheel style */}
        {animated && (
          <motion.div
            className="flex justify-center mt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
          >
            <motion.div
              className="w-5 h-8 rounded-full border-2 border-text-tertiary/40 flex justify-center pt-1.5"
              aria-hidden="true"
            >
              <motion.div
                className="w-1 h-1.5 rounded-full bg-text-tertiary"
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              />
            </motion.div>
          </motion.div>
        )}
      </Wrapper>
    </div>
  )
}

export default Hero
