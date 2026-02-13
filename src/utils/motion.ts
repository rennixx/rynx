import { motion, type Variants } from 'framer-motion'

/* ──────────── Shared animation variants ──────────── */

/** Stagger children on enter — use as a parent `variants` value. */
export const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

/** Fade-up item entrance — use as a child `variants` value. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
}

/* ──────────── Reduced-motion helper ──────────── */

/**
 * Returns properly-typed Wrapper / Item elements and wrapperProps
 * that respect the user's reduced-motion preference.
 *
 * - When `animated` is false, plain `"div"` elements are used with no
 *   animation props so nothing moves.
 * - When `animated` is true, `motion.div` elements are returned with
 *   `whileInView` scroll-triggered entrance.
 *
 * Pass `trigger: 'animate'` when the animation should fire immediately
 * on mount (e.g. Hero) instead of on scroll.
 */
export function motionElements(
  animated: boolean,
  trigger: 'whileInView' | 'animate' = 'whileInView',
) {
  const Wrapper = animated ? motion.div : ('div' as const)
  const Item = animated ? motion.div : ('div' as const)

  const wrapperProps = animated
    ? trigger === 'animate'
      ? { variants: stagger, initial: 'hidden' as const, animate: 'visible' as const }
      : {
          variants: stagger,
          initial: 'hidden' as const,
          whileInView: 'visible' as const,
          viewport: { once: true, amount: 0.15 },
        }
    : {}

  const itemProps = animated ? { variants: fadeUp } : {}

  return { Wrapper, Item, wrapperProps, itemProps } as const
}
