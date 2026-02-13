import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion'
import { skills } from '../../data/portfolioData'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { fadeUp, motionElements } from '../../utils/motion'

const categories = [
  { key: 'frontend', label: 'Frontend', color: 'oklch(0.65 0.2 250)' },
  { key: 'backend', label: 'Backend', color: 'oklch(0.65 0.18 155)' },
  { key: 'database', label: 'Database', color: 'oklch(0.70 0.18 55)' },
  { key: 'devops', label: 'DevOps', color: 'oklch(0.60 0.22 300)' },
  { key: 'design', label: 'Design', color: 'oklch(0.65 0.2 340)' },
  { key: 'tool', label: 'Tools', color: 'oklch(0.55 0 0)' },
] as const

/* ──────────── Skill bar with animated width ──────────── */
function SkillBar({
  name,
  level,
  years,
  color,
  animated,
}: {
  name: string
  level: number
  years: number
  color: string
  animated: boolean
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-foreground">{name}</span>
        <span className="text-caption text-text-tertiary">{years}y</span>
      </div>
      <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
        {animated ? (
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
            initial={{ width: 0 }}
            whileInView={{ width: `${level}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          />
        ) : (
          <div
            className="h-full rounded-full"
            style={{ backgroundColor: color, width: `${level}%` }}
          />
        )}
      </div>
    </div>
  )
}

/* ──────────── 3D tilt card ──────────── */
function TiltCard({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  const prefersReducedMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), {
    stiffness: 200,
    damping: 20,
  })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), {
    stiffness: 200,
    damping: 20,
  })

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      className={`${className}`}
      style={
        prefersReducedMotion
          ? {}
          : { rotateX, rotateY, transformPerspective: 800 }
      }
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {children}
    </motion.div>
  )
}

/* ──────────── Skills section ──────────── */
const Skills: React.FC = () => {
  const prefersReducedMotion = useReducedMotion()

  const grouped = categories.reduce(
    (acc, cat) => {
      acc[cat.key] = skills.filter((s) => s.category === cat.key)
      return acc
    },
    {} as Record<string, typeof skills>,
  )

  const { Wrapper, Item, wrapperProps } = motionElements(!prefersReducedMotion)

  return (
    <section id="skills" className="section-padding">
      <div className="container">
        <Wrapper className="max-w-5xl mx-auto" {...wrapperProps}>
          {/* Header */}
          <Item {...(prefersReducedMotion ? {} : { variants: fadeUp })}>
            <div className="mb-12">
              <p className="text-overline text-primary mb-3">Expertise</p>
              <h2 className="text-heading-1 text-foreground">Skills & Technologies</h2>
            </div>
          </Item>

          {/* Bento grid of skill categories */}
          <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const items = grouped[cat.key]
              if (!items?.length) return null

              return (
                <Item
                  key={cat.key}
                  {...(prefersReducedMotion ? {} : { variants: fadeUp })}
                >
                  <TiltCard className="glass rounded-2xl p-5 h-full">
                    {/* Category label */}
                    <div className="flex items-center gap-2 mb-4">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-caption font-semibold uppercase tracking-wider text-text-secondary">
                        {cat.label}
                      </span>
                    </div>

                    {/* Skill bars */}
                    <div className="space-y-3">
                      {items.map((skill) => (
                        <SkillBar
                          key={skill.name}
                          name={skill.name}
                          level={skill.level}
                          years={skill.yearsOfExperience}
                          color={cat.color}
                          animated={!prefersReducedMotion}
                        />
                      ))}
                    </div>
                  </TiltCard>
                </Item>
              )
            })}
          </div>
        </Wrapper>
      </div>
    </section>
  )
}

export default Skills
