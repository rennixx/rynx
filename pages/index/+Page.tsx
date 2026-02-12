import { Hero, Projects, Skills, About, Contact } from '@/components/sections'

export function Page() {
  return (
    <main id="main-content">
      <Hero />
      <Projects />
      <Skills />
      <About />
      <Contact />
    </main>
  )
}
