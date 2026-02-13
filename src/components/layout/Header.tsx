import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { NavItem } from '../../types'
import { useReducedMotion } from '../../hooks/useReducedMotion'

interface HeaderProps {
  navItems: NavItem[]
}

const Header: React.FC<HeaderProps> = ({ navItems }) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const prefersReducedMotion = useReducedMotion()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const lastScrollY = useRef(0)

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    toggleRef.current?.focus()
  }, [])

  /* ── Escape to close ── */
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [menuOpen, closeMenu])

  /* ── Hide on scroll-down, show on scroll-up ── */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 50)
      setVisible(y < 50 || y < lastScrollY.current)
      lastScrollY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── Active section detection via IntersectionObserver ── */
  useEffect(() => {
    const ids = navItems.map((n) => n.href.replace('#', ''))
    const observers: IntersectionObserver[] = []

    for (const id of ids) {
      const el = document.getElementById(id)
      if (!el) continue
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id)
        },
        { rootMargin: '-40% 0px -55% 0px' },
      )
      obs.observe(el)
      observers.push(obs)
    }
    return () => observers.forEach((o) => o.disconnect())
  }, [navItems])

  const navTranslateY = visible ? 0 : -100

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="container flex justify-center pt-4">
        {/* ── Floating pill ── */}
        <motion.nav
          className={`
            pointer-events-auto inline-flex items-center gap-1
            rounded-full px-2 py-1.5
            border transition-all duration-300
            ${
              scrolled
                ? 'bg-background/70 backdrop-blur-xl border-[var(--glass-border)] shadow-lg shadow-black/20'
                : 'bg-background/30 backdrop-blur-sm border-transparent'
            }
          `}
          role="navigation"
          aria-label="Main navigation"
          initial={prefersReducedMotion ? false : { opacity: 0, y: -20 }}
          animate={
            prefersReducedMotion
              ? { y: navTranslateY }
              : { opacity: 1, y: navTranslateY }
          }
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Logo */}
          <a
            href="#hero"
            className="px-3 py-1.5 text-sm font-bold font-[var(--font-display)] text-foreground tracking-tight hover:text-primary transition-colors"
            aria-label="Go to homepage"
          >
            RYNX
          </a>

          {/* Divider */}
          <div className="w-px h-4 bg-border-subtle hidden sm:block" />

          {/* Desktop nav links */}
          <div className="hidden sm:flex items-center gap-0.5">
            {navItems
              .filter((n) => n.label !== 'Home')
              .map((item) => {
                const sectionId = item.href.replace('#', '')
                const isActive = activeSection === sectionId
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`relative px-3 py-1.5 text-sm rounded-full transition-colors duration-200 ${
                      isActive
                        ? 'text-foreground'
                        : 'text-text-secondary hover:text-foreground'
                    }`}
                  >
                    {item.label}
                    {/* Active dot */}
                    {isActive && (
                      <motion.span
                        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                        layoutId="nav-dot"
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </a>
                )
              })}
          </div>

          {/* Divider */}
          <div className="w-px h-4 bg-border-subtle hidden sm:block" />

          {/* Contact CTA */}
          <a
            href="#contact"
            className="hidden sm:inline-flex px-4 py-1.5 text-xs font-medium rounded-full
              bg-primary text-primary-foreground hover:bg-primary-hover transition-colors"
          >
            Contact
          </a>

          {/* Mobile hamburger */}
          <button
            ref={toggleRef}
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden p-2 rounded-full text-text-secondary hover:text-foreground transition-colors"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </motion.nav>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="pointer-events-auto sm:hidden fixed inset-x-0 top-16 mx-4"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
          >
            <div className="rounded-2xl bg-background/90 backdrop-blur-xl border border-[var(--glass-border)] shadow-xl shadow-black/30 p-4 space-y-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => closeMenu()}
                  className={`block px-4 py-2.5 rounded-xl text-sm transition-colors ${
                    activeSection === item.href.replace('#', '')
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-text-secondary hover:bg-surface-1 hover:text-foreground'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header
