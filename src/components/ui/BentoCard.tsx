import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type SpanSize = '1x1' | '2x1' | '1x2' | '2x2'

interface BentoCardProps {
  children: ReactNode
  span?: SpanSize
  className?: string
  hover?: boolean
  as?: 'div' | 'article' | 'section'
}

const spanClasses: Record<SpanSize, string> = {
  '1x1': 'col-span-1 row-span-1',
  '2x1': 'col-span-1 md:col-span-2 row-span-1',
  '1x2': 'col-span-1 row-span-1 md:row-span-2',
  '2x2': 'col-span-1 md:col-span-2 row-span-1 md:row-span-2',
}

export default function BentoCard({
  children,
  span = '1x1',
  className = '',
  hover = true,
  as = 'div',
}: BentoCardProps) {
  const prefersReducedMotion = useReducedMotion()
  const Tag = motion.create(as)

  return (
    <Tag
      className={`
        relative overflow-hidden rounded-2xl
        bg-[var(--glass-bg)] border border-[var(--glass-border)]
        backdrop-blur-[var(--glass-blur)]
        ${hover ? 'transition-colors duration-300 hover:bg-[var(--glass-bg-hover)] hover:border-[var(--glass-border-hover)]' : ''}
        ${spanClasses[span]}
        ${className}
      `}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </Tag>
  )
}
