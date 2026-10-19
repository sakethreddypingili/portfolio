import { Mail, MapPin, Phone } from 'lucide-react'

import { site } from '@/data/site'
import { Reveal } from '@/components/motion/reveal'
import { Stagger, StaggerItem } from '@/components/motion/stagger'
import { Button } from '@/components/ui/button'

export function ContactSection() {
  return (
    <section id="contact" className="mx-auto max-w-6xl px-6 pb-12 sm:pb-16">
      <Reveal>
        <div className="rounded-2xl bg-card/95 p-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.04),0_12px_24px_-6px_rgba(0,0,0,0.04)] ring-1 ring-foreground/5 backdrop-blur-md sm:p-12">
          <h2 className="text-3xl font-bold tracking-tight">Let's build something</h2>
          <p className="mx-auto mt-3 max-w-prose text-muted-foreground">
            I'm open to internships, collaborations, and interesting side projects.
          </p>
          <Stagger
            by={0.05}
            delay={0.15}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm"
          >
            <StaggerItem className="flex items-center gap-2 rounded-full bg-muted/60 px-4 py-1.5 text-muted-foreground ring-1 ring-foreground/5 transition-colors hover:bg-muted hover:text-foreground">
              <Mail className="size-4 text-foreground/70" /> {site.email}
            </StaggerItem>
            <StaggerItem className="flex items-center gap-2 rounded-full bg-muted/60 px-4 py-1.5 text-muted-foreground ring-1 ring-foreground/5 transition-colors hover:bg-muted hover:text-foreground">
              <Phone className="size-4 text-foreground/70" /> {site.phone}
            </StaggerItem>
            <StaggerItem className="flex items-center gap-2 rounded-full bg-muted/60 px-4 py-1.5 text-muted-foreground ring-1 ring-foreground/5 transition-colors hover:bg-muted hover:text-foreground">
              <MapPin className="size-4 text-foreground/70" /> {site.location}
            </StaggerItem>
          </Stagger>
          <div className="mt-8">
            <Button size="lg" asChild className="shadow-xs">
              <a href={`mailto:${site.email}`}>Say hello</a>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
