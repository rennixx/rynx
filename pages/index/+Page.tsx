import { lazy, Suspense } from 'react'
import { Hero } from '@/components/sections'

const Projects = lazy(() => import('@/components/sections/Projects'))
const Skills = lazy(() => import('@/components/sections/Skills'))
const About = lazy(() => import('@/components/sections/About'))
const Contact = lazy(() => import('@/components/sections/Contact'))

export function Page() {
  return (
    <main id="main-content">
      <Hero />
      <Suspense>
        <Projects />
        <Skills />
        <About />
        <Contact />
      </Suspense>
    </main>
  )
}
