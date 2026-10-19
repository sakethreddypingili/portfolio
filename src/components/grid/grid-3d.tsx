import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

const COLS = 28
const ROWS = 16
const CELL_COUNT = COLS * ROWS
const RADIUS = 220

export function Grid3D({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cellsRef = useRef<(HTMLDivElement | null)[]>([])
  const reduceMotionRef = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduceMotionRef.current = mq.matches
    mq.addEventListener('change', (e: MediaQueryListEvent) => {
      reduceMotionRef.current = e.matches
    })
    return () => mq.removeEventListener('change', (e: MediaQueryListEvent) => {
      reduceMotionRef.current = e.matches
    })
  }, [])

  useEffect(() => {
    if (reduceMotionRef.current) return
    const container = containerRef.current
    if (!container) return

    const pointer = { x: -9999, y: -9999, vx: 0, vy: 0, active: false }
    const last = { x: 0, y: 0, t: 0 }
    let raf = 0

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const now = performance.now()
      if (last.t) {
        const dt = Math.max(1, now - last.t)
        pointer.vx = (x - last.x) / dt * 16
        pointer.vy = (y - last.y) / dt * 16
      }
      last.x = x
      last.y = y
      last.t = now
      pointer.x = x
      pointer.y = y
      pointer.active = true
    }

    const reset = () => {
      pointer.active = false
      pointer.vx = 0
      pointer.vy = 0
    }

    const tick = () => {
      const cells = cellsRef.current
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i]
        if (!cell) continue
        const rect = cell.getBoundingClientRect()
        const cx = rect.left + rect.width / 2 - container.getBoundingClientRect().left
        const cy = rect.top + rect.height / 2 - container.getBoundingClientRect().top
        if (pointer.active) {
          const dx = cx - pointer.x
          const dy = cy - pointer.y
          const dist = Math.hypot(dx, dy)
          const radius = RADIUS
          const falloff = Math.max(0, 1 - dist / radius)
          const smooth = falloff * falloff * (3 - 2 * falloff)
          if (smooth > 0.02) {
            const mv = Math.hypot(pointer.vx, pointer.vy) + 0.0001
            const intensity = smooth * smooth
            const rippleDelay = Math.min(dist / radius * 0.15, 0.12)

            // Main square lift, tilt, rotate
            cell.style.setProperty('--lift', `${intensity * 8}px`)
            cell.style.setProperty('--tilt-x', `${intensity * 0.15 * (pointer.vy / mv)}rad`)
            cell.style.setProperty('--tilt-y', `${intensity * 0.15 * (-pointer.vx / Math.hypot(pointer.vx, pointer.vy))}rad`)
            cell.style.setProperty('--rotate', `${intensity * 0.3}rad`)

            // Geometric slice variables
            cell.style.setProperty('--slice-rotate', `${intensity * 0.35}rad`)
            cell.style.setProperty('--slice-delay', `${rippleDelay}s`)
            cell.style.setProperty('--slice-opacity', '0.5')
          } else {
            cell.style.setProperty('--lift', '0px')
            cell.style.setProperty('--tilt-x', '0rad')
            cell.style.setProperty('--tilt-y', '0rad')
            cell.style.setProperty('--rotate', '0rad')
            cell.style.setProperty('--slice-rotate', '0rad')
            cell.style.setProperty('--slice-delay', '0s')
            cell.style.setProperty('--slice-opacity', '0')
          }
        } else {
          cell.style.setProperty('--lift', '0px')
          cell.style.setProperty('--tilt-x', '0rad')
          cell.style.setProperty('--tilt-y', '0rad')
          cell.style.setProperty('--rotate', '0rad')
          cell.style.setProperty('--slice-rotate', '0rad')
          cell.style.setProperty('--slice-delay', '0s')
          cell.style.setProperty('--slice-opacity', '0')
        }
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerMove, { passive: true })
    window.addEventListener('pointerleave', reset, { passive: true })
    window.addEventListener('blur', reset)
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerMove)
      window.removeEventListener('pointerleave', reset)
      window.removeEventListener('blur', reset)
    }
  }, [])

  const cells: React.ReactNode[] = []
  for (let i = 0; i < CELL_COUNT; i++) {
    cells.push(
      <div
        key={i}
        ref={(el) => { cellsRef.current[i] = el }}
        className={cn(
          'relative aspect-square',
          'border border-foreground/[0.08]',
          'bg-transparent',
          'transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
          'will-change-transform',
          'origin-center'
        )}
        style={{
          '--lift': '0px',
          '--tilt-x': '0rad',
          '--tilt-y': '0rad',
          '--rotate': '0rad',
          '--slice-rotate': '0rad',
          '--slice-delay': '0s',
          '--slice-opacity': '0',
          transform: 'translate3d(0, var(--lift), 0) rotateX(var(--tilt-x)) rotateY(var(--tilt-y)) rotateZ(var(--rotate))',
        } as React.CSSProperties}
      >
        {/* Top-left geometric slice */}
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 0 100%)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 60%)',
            opacity: 'var(--slice-opacity, 0)',
            transform: 'rotate(var(--slice-rotate, 0rad))',
            transformOrigin: 'top left',
            transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1) var(--slice-delay, 0s), opacity 0.35s ease-out',
          }}
        />

        {/* Bottom-right geometric slice */}
        <div
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{
            clipPath: 'polygon(100% 0, 100% 100%, 0 100%)',
            background: 'linear-gradient(45deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 60%)',
            opacity: 'var(--slice-opacity, 0)',
            transform: 'rotate(calc(var(--slice-rotate, 0rad) * -0.7))',
            transformOrigin: 'bottom right',
            transition: 'transform 0.5s cubic-bezier(0.22,1,0.36,1) calc(var(--slice-delay, 0s) + 0.03s), opacity 0.35s ease-out 0.03s',
          }}
        />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn(
        'pointer-events-none fixed inset-0 z-0',
        'grid',
        `grid-cols-[repeat(${COLS},1fr)]`,
        `grid-rows-[repeat(${ROWS},1fr)]`,
        className
      )}
      style={{ perspective: '900px', transformStyle: 'preserve-3d' } as React.CSSProperties}
    >
      {cells}
    </div>
  )
}
