import { type ReactNode } from 'react'

interface BentoGridProps {
  children: ReactNode
  cols?: 2 | 3 | 4
  className?: string
}

const colClasses = {
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

export default function BentoGrid({
  children,
  cols = 3,
  className = '',
}: BentoGridProps) {
  return (
    <div
      className={`grid gap-4 md:gap-6 ${colClasses[cols]} ${className}`}
    >
      {children}
    </div>
  )
}
