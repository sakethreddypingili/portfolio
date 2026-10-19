import { motion, useReducedMotion, type HTMLMotionProps } from 'motion/react'
import type { ReactNode } from 'react'

import { fadeUp, staggerContainer } from '@/lib/motion'

type StaggerProps = {
  children: ReactNode
  /** Gap between siblings, in seconds. */
  by?: number
  /** Delay before the first child animates, in seconds. */
  delay?: number
  className?: string
}

/**
 * Reveals `StaggerItem` children in sequence as they scroll into view.
 * Renders content immediately when the user prefers reduced motion.
 */
export function Stagger({ children, by, delay = 0, className }: StaggerProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={staggerContainer(by, delay)}
    >
      {children}
    </motion.div>
  )
}

type StaggerItemProps = Omit<HTMLMotionProps<'div'>, 'variants' | 'children' | 'className'> & {
  children: ReactNode
  className?: string
}

/** A single child of `Stagger`. Inherits the parent's stagger timing. */
export function StaggerItem({ children, className, ...rest }: StaggerItemProps) {
  return (
    <motion.div className={className} variants={fadeUp} {...rest}>
      {children}
    </motion.div>
  )
}
