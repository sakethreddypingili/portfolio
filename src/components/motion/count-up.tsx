import { animate, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { cn } from 'cn'

import { duration as durations, ease } from '@/lib/motion'

type CountUpProps = {
  to: number
  from?: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}

/**
 * Animates a number into view. Writes to the DOM node directly so per-frame
 * updates never trigger React re-renders, and reserves the final width with an
 * invisible copy so counting never shifts the surrounding layout.
 */
export function CountUp({
  to,
  from = 0,
  prefix = '',
  suffix = '',
  duration = durations.slower,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const render = (value: number) => {
      node.textContent = `${prefix}${Math.round(value).toLocaleString()}${suffix}`
    }

    if (!inView || reduceMotion) {
      render(to)
      return
    }

    const controls = animate(from, to, {
      duration,
      ease: ease.out,
      onUpdate: render,
    })

    return () => controls.stop()
  }, [inView, reduceMotion, from, to, prefix, suffix, duration])

  return (
    <span className={cn('relative inline-block tabular-nums', className)}>
      <span aria-hidden className="invisible">
        {prefix}
        {to.toLocaleString()}
        {suffix}
      </span>
      <span ref={ref} className="absolute inset-y-0 left-0" />
    </span>
  )
}
