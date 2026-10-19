import { Trophy, Code2, Sparkles } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

import { experiences } from '@/data/site'
import { CountUp } from '@/components/motion/count-up'
import { Reveal } from '@/components/motion/reveal'
import { Stagger, StaggerItem } from '@/components/motion/stagger'
import { fadeUp, hoverLift, stagger, staggerContainer, transition } from '@/lib/motion'

export function ExperienceSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section id="experience" className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <Reveal>
        <h2 className="text-3xl font-bold tracking-tight">Experience & Achievements</h2>
      </Reveal>
      <motion.ol
        className="mt-8 border-l"
        initial={reduceMotion ? false : 'hidden'}
        whileInView={reduceMotion ? undefined : 'visible'}
        viewport={{ once: true, margin: '-80px' }}
        variants={staggerContainer(stagger.base)}
      >
        {experiences.map((exp) => (
          <motion.li key={exp.id} variants={fadeUp} className="relative pb-10 pl-8">
            <motion.span
              variants={{ hidden: { scale: 0 }, visible: { scale: 1 } }}
              transition={transition.springSoft}
              className="absolute -left-1.5 top-1.5 block size-3 rounded-full border-2 border-background bg-foreground"
            />
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-semibold">{exp.role} · {exp.company}</h3>
              <span className="font-mono text-sm text-muted-foreground">{exp.period}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{exp.summary}</p>
            {exp.highlights && (
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                {exp.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2">
                    <Sparkles className="size-3.5 text-foreground" /> {h}
                  </li>
                ))}
              </ul>
            )}
          </motion.li>
        ))}
      </motion.ol>
      <Stagger className="mt-8 grid gap-4 sm:grid-cols-3" delay={0.1}>
        <StaggerItem
          whileHover={hoverLift}
          transition={transition.fast}
          className="rounded-xl bg-card/95 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_10px_20px_-5px_rgba(0,0,0,0.03)] ring-1 ring-foreground/5 backdrop-blur-md transition-shadow hover:shadow-[0_4px_6px_rgba(0,0,0,0.05),0_14px_28px_-6px_rgba(0,0,0,0.06)]"
        >
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted/60 text-foreground ring-1 ring-foreground/5">
            <Trophy className="size-5" />
          </div>
          <p className="mt-3 font-semibold tracking-tight">Hackathon</p>
          <p className="text-sm text-muted-foreground">
            <CountUp to={2} suffix="nd" /> place, college-level
          </p>
        </StaggerItem>
        <StaggerItem
          whileHover={hoverLift}
          transition={transition.fast}
          className="rounded-xl bg-card/95 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_10px_20px_-5px_rgba(0,0,0,0.03)] ring-1 ring-foreground/5 backdrop-blur-md transition-shadow hover:shadow-[0_4px_6px_rgba(0,0,0,0.05),0_14px_28px_-6px_rgba(0,0,0,0.06)]"
        >
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted/60 text-foreground ring-1 ring-foreground/5">
            <Code2 className="size-5" />
          </div>
          <p className="mt-3 font-semibold tracking-tight">Competitive Programming</p>
          <p className="text-sm text-muted-foreground">
            CodeChef <CountUp to={1400} /> · Codeforces <CountUp to={1283} />
          </p>
        </StaggerItem>
        <StaggerItem
          whileHover={hoverLift}
          transition={transition.fast}
          className="rounded-xl bg-card/95 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_10px_20px_-5px_rgba(0,0,0,0.03)] ring-1 ring-foreground/5 backdrop-blur-md transition-shadow hover:shadow-[0_4px_6px_rgba(0,0,0,0.05),0_14px_28px_-6px_rgba(0,0,0,0.06)]"
        >
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted/60 text-foreground ring-1 ring-foreground/5">
            <Sparkles className="size-5" />
          </div>
          <p className="mt-3 font-semibold tracking-tight">Practice</p>
          <p className="text-sm text-muted-foreground">
            <CountUp to={150} suffix="+" /> HackerRank · <CountUp to={30} suffix="+" /> LeetCode
          </p>
        </StaggerItem>
      </Stagger>
    </section>
  )
}
