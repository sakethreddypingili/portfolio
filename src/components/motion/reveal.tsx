import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

import { distance, transition } from '@/lib/motion'

type RevealProps = {
  children: ReactNode
  delay?: number
  className?: string
}

/**
 * Reveals its children once as they scroll into view.
 * For lists, prefer `Stagger` + `StaggerItem` to keep timing consistent.
 * Renders content immediately when the user prefers reduced motion.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance.base }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ ...transition.base, delay }}
    >
      {children}
    </motion.div>
  )
}
