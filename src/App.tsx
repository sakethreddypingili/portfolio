import { MotionConfig } from 'motion/react'

import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { SpotlightGrid } from '@/components/layout/spotlight-grid'
import { AboutSection } from '@/features/about/about-section'
import { ContactSection } from '@/features/contact/contact-section'
import { ExperienceSection } from '@/features/experience/experience-section'
import { HeroSection } from '@/features/hero/hero-section'
import { ProjectsSection } from '@/features/projects/projects-section'
import { SkillsSection } from '@/features/skills/skills-section'

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="relative min-h-svh bg-background text-foreground antialiased">
        <SpotlightGrid
          gridSize={32}
          className="fixed inset-0 z-0"
        />
        <Header />
        <main className="relative z-10">
          <HeroSection />
          <AboutSection />
          <ProjectsSection />
          <SkillsSection />
          <ExperienceSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  )
}
