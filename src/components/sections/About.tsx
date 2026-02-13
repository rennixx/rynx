import { useRef, useEffect, useState } from 'react'
import { personalInfo, experiences, skills } from '../../data/portfolioData'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { fadeUp, motionElements } from '../../utils/motion'

/* ──── Animated counter ──── */
function AnimatedNum({ value, animated }: { value: number; animated: boolean }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    if (!animated) {
      setCount(value)
      return
    }

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1200
          const start = performance.now()

          function tick(now: number) {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
            setCount(Math.round(eased * value))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [value, animated])

  return <span ref={ref}>{count}</span>
}

/* ──── Main component ──── */
const About: React.FC = () => {
  const prefersReducedMotion = useReducedMotion()
  const animated = !prefersReducedMotion

  const currentRole = experiences[0]
  const yearsOfExperience = new Date().getFullYear() - 2021
  const totalProjects = 10
  const topSkillsCount = skills.filter((s) => s.level >= 80).length

  const stats = [
    { value: yearsOfExperience, suffix: '+', label: 'Years Experience' },
    { value: totalProjects, suffix: '+', label: 'Projects Shipped' },
    { value: topSkillsCount, suffix: '', label: 'Core Technologies' },
  ]

  const timeline = experiences.map((exp) => ({
    role: exp.position,
    company: exp.company,
    period: `${new Date(exp.startDate).getFullYear()} – ${
      exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'
    }`,
    achievements: exp.achievements,
    tech: exp.technologies.slice(0, 5),
  }))

  const { Wrapper, Item, wrapperProps } = motionElements(animated)

  return (
    <section id="about" className="section-padding">
      <div className="container">
        <Wrapper className="max-w-5xl mx-auto" {...wrapperProps}>
          {/* Header */}
          <Item {...(animated ? { variants: fadeUp } : {})}>
            <div className="mb-12">
              <p className="text-overline text-primary mb-3">About</p>
              <h2 className="text-heading-1 text-foreground">A bit about me</h2>
            </div>
          </Item>

          {/* ── Bento: Bio + Stats ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
            {/* Bio card — spans 2 cols */}
            <Item
              className="md:col-span-2 glass rounded-2xl p-6 md:p-8"
              {...(animated ? { variants: fadeUp } : {})}
            >
              <div className="flex items-center gap-2 mb-5">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm font-medium text-success">
                  {currentRole.position} @ {currentRole.company}
                </span>
              </div>
              <p className="text-body-lg text-text-secondary leading-relaxed text-balance">
                {personalInfo.bio}
              </p>
            </Item>

            {/* Stats column — stacked 1x1 cards */}
            <div className="grid grid-cols-3 md:grid-cols-1 gap-4 md:gap-6">
              {stats.map((stat) => (
                <Item
                  key={stat.label}
                  className="glass rounded-2xl p-5 text-center md:text-left flex flex-col justify-center"
                  {...(animated ? { variants: fadeUp } : {})}
                >
                  <div className="text-heading-2 text-foreground font-mono tabular-nums">
                    <AnimatedNum value={stat.value} animated={animated} />
                    {stat.suffix}
                  </div>
                  <div className="text-caption text-text-tertiary mt-1 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </Item>
              ))}
            </div>
          </div>

          {/* ── Experience timeline ── */}
          <Item {...(animated ? { variants: fadeUp } : {})}>
            <div className="glass rounded-2xl p-6 md:p-8">
              <h3 className="text-heading-3 text-foreground mb-6">Experience</h3>
              <div className="relative space-y-8 pl-6 border-l border-border-default">
                {timeline.map((item, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[calc(0.75rem+1.5px)] top-1.5 w-3 h-3 rounded-full border-2 border-primary bg-background" />
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="font-semibold text-foreground">{item.role}</span>
                        <span className="text-text-tertiary text-sm">@ {item.company}</span>
                      </div>
                      <p className="text-caption text-text-muted font-mono">{item.period}</p>
                      {item.achievements.length > 0 && (
                        <ul className="mt-2 space-y-1.5">
                          {item.achievements.map((a, j) => (
                            <li
                              key={j}
                              className="text-body-sm text-text-secondary flex items-start gap-2"
                            >
                              <span className="text-primary mt-0.5 shrink-0">›</span>
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
          </Item>
        </Wrapper>
      </div>
    </section>
  )
}

export default About
