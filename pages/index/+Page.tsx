import { Hero, About, Skills, Projects, Contact } from '@/components/sections'

export function Page() {
  return (
    <main id="main-content">
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
    </main>
  )
}
