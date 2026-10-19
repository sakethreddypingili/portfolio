import { GitFork, Link2, Mail } from 'lucide-react'
import { motion } from 'motion/react'

import { socials, site } from '@/data/site'
import { transition } from '@/lib/motion'

const year = new Date().getFullYear()

const iconMap: Record<string, typeof Mail> = {
  github: GitFork,
  linkedin: Link2,
  email: Mail,
}

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground sm:flex-row">
        <p>© {year} {site.name}</p>
        <ul className="flex items-center gap-4">
          {socials.map((s) => {
            const Icon = iconMap[s.icon] ?? Mail
            return (
              <li key={s.label}>
                <motion.a
                  href={s.href}
                  aria-label={s.label}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.92 }}
                  transition={transition.fast}
                  className="inline-flex transition-colors hover:text-foreground"
                >
                  <Icon className="size-4" />
                </motion.a>
              </li>
            )
          })}
        </ul>
      </div>
    </footer>
  )
}
