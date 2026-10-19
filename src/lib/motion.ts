import type { Transition, Variants } from 'motion/react'

/**
 * Motion design system.
 *
 * Keep movement subtle and consistent across the app. Only `opacity` and
 * `transform` are animated so every transition stays on the compositor.
 */

export const duration = {
  instant: 0.08,
  fast: 0.16,
  base: 0.32,
  slow: 0.5,
  slower: 0.8,
} as const

type Ease = [number, number, number, number]

export const ease: { out: Ease; inOut: Ease; in: Ease } = {
  /** Standard decelerate — entrances. */
  out: [0.22, 1, 0.36, 1],
  /** Symmetric — moves and toggles. */
  inOut: [0.65, 0, 0.35, 1],
  /** Accelerate — exits. */
  in: [0.4, 0, 1, 1],
}

export const transition = {
  fast: { duration: duration.fast, ease: ease.out } satisfies Transition,
  base: { duration: duration.base, ease: ease.out } satisfies Transition,
  slow: { duration: duration.slow, ease: ease.out } satisfies Transition,
  inOut: { duration: duration.base, ease: ease.inOut } satisfies Transition,
  exit: { duration: duration.fast, ease: ease.in } satisfies Transition,
  spring: { type: 'spring', stiffness: 400, damping: 30 } satisfies Transition,
  springSoft: { type: 'spring', stiffness: 260, damping: 26 } satisfies Transition,
}

/** Gap between siblings in a staggered group. */
export const stagger = {
  tight: 0.04,
  base: 0.06,
  loose: 0.1,
} as const

/** How far an entering element travels, in px. */
export const distance = {
  sm: 12,
  base: 20,
  lg: 32,
} as const

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transition.base },
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: distance.base },
  visible: { opacity: 1, y: 0, transition: transition.base },
}

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -distance.sm },
  visible: { opacity: 1, y: 0, transition: transition.base },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: transition.base },
}

/** Parent that staggers its `StaggerItem` children on scroll into view. */
export function staggerContainer(staggerBy: number = stagger.base, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: staggerBy, delayChildren },
    },
  }
}

/** Shared interaction presets — transform-only, compositor friendly. */
export const hoverLift = { y: -4 } as const
export const pressScale = { scale: 0.97 } as const

