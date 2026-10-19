import { motion } from 'motion/react'

import profileImage from '@/assets/profile.png'
import { site } from '@/data/site'
import { Stagger, StaggerItem } from '@/components/motion/stagger'
import { Button } from '@/components/ui/button'
import { distance, duration, ease, transition } from '@/lib/motion'

export function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden">
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 md:grid-cols-[1.1fr_0.9fr]">
        <Stagger by={0.08}>
          <StaggerItem>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl sm:leading-[1.1]">
              Hi, I'm <span className="text-foreground">{site.name.split(' ')[0]}</span>.
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="mt-4 max-w-xl text-xl font-medium tracking-tight text-foreground/90 sm:text-2xl">
              {site.headline}
            </p>
          </StaggerItem>
          <StaggerItem>
            <p className="mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
              {site.description}
            </p>
          </StaggerItem>
          <StaggerItem>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" asChild className="shadow-xs">
                <a href="#projects">View my work</a>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-card/80 backdrop-blur-sm">
                <a href="#contact">Get in touch</a>
              </Button>
              <Button size="lg" variant="ghost" asChild>
                <a href={`mailto:${site.email}`}>Resume</a>
              </Button>
            </div>
          </StaggerItem>
        </Stagger>
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: distance.base }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ ...transition.slow, delay: 0.2 }}
          className="mx-auto w-52 sm:w-60 md:w-full md:max-w-xs"
        >
          <motion.img
            src={profileImage}
            alt={`Portrait of ${site.name}`}
            width={800}
            height={800}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: ease.inOut }}
            className="aspect-square w-full rounded-2xl object-cover ring-1 ring-foreground/10 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.06)]"
          />
        </motion.div>
      </div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-8 hidden justify-center sm:flex"
        initial={{ opacity: 0, y: -distance.sm }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...transition.base, delay: duration.slow + 0.2 }}
      >
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: ease.inOut }}
          className="text-xs text-muted-foreground"
        >
          ↓
        </motion.span>
      </motion.div>
    </section>
  )
}
