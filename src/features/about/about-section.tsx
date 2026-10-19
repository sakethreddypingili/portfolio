import { skills } from '@/data/site'
import { Reveal } from '@/components/motion/reveal'
import { Stagger, StaggerItem } from '@/components/motion/stagger'
import { hoverLift, transition } from '@/lib/motion'

export function AboutSection() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <div className="grid gap-12 md:grid-cols-2">
        <Reveal>
          <h2 className="text-3xl font-bold tracking-tight">About me</h2>
          <p className="mt-4 max-w-prose text-muted-foreground">
            I'm a Computer Science (AI & ML) student at PW Institute of Innovation / Medhavi Skills University,
            graduating in 2029. I enjoy building full-stack web applications — from crafting responsive
            interfaces to designing secure, scalable backends.
          </p>
          <p className="mt-3 max-w-prose text-muted-foreground">
            Outside of code, I'm into generative AI and prompt engineering, competitive programming
            (CodeChef 1400, Codeforces 1283), and shipping side projects like Quizmarix, Garuda Wish Wall, and Garuda Pay.
          </p>
        </Reveal>
        <Stagger className="grid gap-4 sm:grid-cols-2">
          {skills.map((category) => (
            <StaggerItem
              key={category.name}
              whileHover={hoverLift}
              transition={transition.fast}
              className="rounded-xl bg-card/95 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_10px_20px_-5px_rgba(0,0,0,0.03)] ring-1 ring-foreground/5 backdrop-blur-md transition-shadow hover:shadow-[0_4px_6px_rgba(0,0,0,0.05),0_14px_28px_-6px_rgba(0,0,0,0.06)]"
            >
              <h3 className="font-semibold tracking-tight">{category.name}</h3>
              <ul className="mt-3 flex flex-wrap gap-2 text-sm text-muted-foreground">
                {category.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-foreground/80 ring-1 ring-foreground/5 transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
