import { lazy, Suspense } from 'react'
import { Hero } from '@/components/sections'
import { SectionDivider } from '@/components/effects'

const Projects = lazy(() => import('@/components/sections/Projects'))
const Skills = lazy(() => import('@/components/sections/Skills'))
const About = lazy(() => import('@/components/sections/About'))
const Contact = lazy(() => import('@/components/sections/Contact'))

export function Page() {
  return (
    <main id="main-content">
      <Hero />
      <Suspense>
        <SectionDivider />
        <Projects />
        <SectionDivider />
        <Skills />
        <SectionDivider />
        <About />
        <SectionDivider />
        <Contact />
      </Suspense>
    </main>
  )
}
