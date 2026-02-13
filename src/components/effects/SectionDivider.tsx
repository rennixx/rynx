import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/** Subtle gradient divider placed between page sections. */
const SectionDivider: React.FC = () => {
  const reduced = useReducedMotion();

  return (
    <div className="flex justify-center py-6" aria-hidden="true">
      <motion.div
        className="h-px w-40 rounded-full"
        style={{
          background:
            'linear-gradient(90deg, transparent, oklch(0.546 0.245 275 / 0.35), transparent)',
        }}
        initial={reduced ? undefined : { scaleX: 0, opacity: 0 }}
        whileInView={reduced ? undefined : { scaleX: 1, opacity: 1 }}
        viewport={{ once: true, amount: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </div>
  );
};

export default SectionDivider;
