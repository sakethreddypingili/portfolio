import { skills } from '@/data/site'
import { Reveal } from '@/components/motion/reveal'
import { Stagger, StaggerItem } from '@/components/motion/stagger'
import { hoverLift, transition } from '@/lib/motion'

export function SkillsSection() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <Reveal>
        <h2 className="text-3xl font-bold tracking-tight">Skills</h2>
      </Reveal>
      <Stagger className="mt-8 grid gap-4 sm:grid-cols-2">
        {skills.map((category) => (
          <StaggerItem
            key={category.name}
            whileHover={hoverLift}
            transition={transition.fast}
            className="rounded-xl bg-card/95 p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_10px_20px_-5px_rgba(0,0,0,0.03)] ring-1 ring-foreground/5 backdrop-blur-md transition-shadow hover:shadow-[0_4px_6px_rgba(0,0,0,0.05),0_14px_28px_-6px_rgba(0,0,0,0.06)]"
          >
            <h3 className="font-semibold tracking-tight">{category.name}</h3>
            <ul className="mt-4 flex flex-wrap gap-2 text-sm text-muted-foreground">
              {category.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full bg-muted/60 px-3 py-1 text-xs font-medium text-foreground/80 ring-1 ring-foreground/5 transition-[transform,color,background-color] hover:scale-[1.04] hover:bg-muted hover:text-foreground motion-reduce:hover:scale-100"
                >
                  {item}
                </li>
              ))}
            </ul>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}
