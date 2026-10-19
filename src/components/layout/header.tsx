import { GitFork, Link2, Mail } from 'lucide-react'
import { motion } from 'motion/react'

import { socials, site } from '@/data/site'
import { ScrollProgress } from '@/components/layout/scroll-progress'
import { useActiveSection } from '@/hooks/use-active-section'
import { transition } from '@/lib/motion'

const iconMap: Record<string, typeof Mail> = {
  github: GitFork,
  linkedin: Link2,
  email: Mail,
}

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
] as const

const NAV_IDS = NAV_ITEMS.map((item) => item.id)

export function Header() {
  const active = useActiveSection(NAV_IDS)

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={transition.slow}
      className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#" className="font-semibold tracking-tight">
          {site.name}
        </a>
        <ul className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className="relative py-1 transition-colors hover:text-foreground aria-[current]:text-foreground"
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      transition={transition.springSoft}
                      className="absolute inset-x-0 -bottom-0.5 h-px bg-foreground"
                    />
                  )}
                </a>
              </li>
            )
          })}
        </ul>
        <ul className="flex items-center gap-3 text-muted-foreground">
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
      </nav>
      <ScrollProgress />
    </motion.header>
  )
}
