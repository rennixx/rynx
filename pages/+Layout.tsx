import { useEffect } from 'react'
import '@fontsource-variable/inter'
import '@fontsource-variable/jetbrains-mono'
import '@/index.css'
import QueryProvider from '@/providers/QueryProvider'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import { Header, Footer } from '@/components/layout'
import { CursorTrail } from '@/components/effects'
import { SmoothScroll } from '@/components/animations'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { NavItem } from '@/types'
import { Analytics } from '@vercel/analytics/react'
import { injectSpeedInsights } from '@vercel/speed-insights'

const navItems: NavItem[] = [
  { label: 'Home', href: '#hero' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const speedInsights = injectSpeedInsights()
    if (speedInsights) {
      speedInsights.setRoute(window.location.pathname)
    }
  }, [])

  return (
    <ErrorBoundary>
      <QueryProvider>
        <SmoothScroll enabled={!prefersReducedMotion}>
          <div className="min-h-screen bg-black relative">
            {/* Skip to content link for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-md focus:text-sm focus:font-medium"
            >
              Skip to main content
            </a>

            {/* Cursor Trail */}
            <CursorTrail />

            {/* Main Content */}
            <div className="relative z-10">
              <Header navItems={navItems} />

              {children}

              <Footer />
            </div>

            <Analytics />
          </div>
        </SmoothScroll>
      </QueryProvider>
    </ErrorBoundary>
  )
}
