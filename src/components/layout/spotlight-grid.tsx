import { useEffect, useRef } from 'react'

interface SpotlightGridProps {
  /** Size of each square grid cell in pixels. Default is 32 */
  gridSize?: number
  className?: string
}

/**
 * SpotlightGrid provides:
 * 1. A clean, subtle, static 2D square grid across the background.
 * 2. An ultra-lightweight, GPU-accelerated cursor spotlight (via CSS custom properties).
 * 3. Highlights the grid lines subtly directly in proximity to the cursor (160px radius) with smooth feathering.
 * 4. Fades away gracefully when pointer leaves or on touch / prefers-reduced-motion devices.
 * 5. Pointer-events: none so it never intercepts clicks, selections, or scroll.
 */
export function SpotlightGrid({ gridSize = 32, className = '' }: SpotlightGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Check media queries for reduced motion or coarse pointer (touch devices)
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const touchQuery = window.matchMedia('(pointer: coarse)')

    if (motionQuery.matches || touchQuery.matches) {
      // Keep static clean grid only
      container.style.setProperty('--spotlight-opacity', '0')
      return
    }

    let rafId = 0
    let targetX = -9999
    let targetY = -9999
    let targetOpacity = 0

    const updatePosition = () => {
      container.style.setProperty('--spotlight-x', `${targetX}px`)
      container.style.setProperty('--spotlight-y', `${targetY}px`)
      container.style.setProperty('--spotlight-opacity', `${targetOpacity}`)
      rafId = 0
    }

    const scheduleUpdate = () => {
      if (!rafId) {
        rafId = requestAnimationFrame(updatePosition)
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect()
      // Only track if pointer is within or near the container
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        targetX = Math.round(e.clientX - rect.left)
        targetY = Math.round(e.clientY - rect.top)
        targetOpacity = 1
      } else {
        targetOpacity = 0
      }
      scheduleUpdate()
    }

    const onPointerLeave = () => {
      targetOpacity = 0
      scheduleUpdate()
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerleave', onPointerLeave)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        // Default hidden spotlight position
        '--spotlight-x': '-9999px',
        '--spotlight-y': '-9999px',
        '--spotlight-opacity': '0',
      } as React.CSSProperties}
      className={`pointer-events-none select-none ${className}`}
    >
      {/* 1. Base Static Ambient Grid: fine, light-grey square outlines (1px border-like grid) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
      />

      {/* 2. Soft Cursor Spotlight Layer: illuminates the grid smoothly under the pointer */}
      <div
        className="absolute inset-0 transition-opacity duration-300 ease-out"
        style={{
          opacity: 'var(--spotlight-opacity)',
          backgroundImage: `
            linear-gradient(to right, rgba(0, 0, 0, 0.16) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.16) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          maskImage: `radial-gradient(180px circle at var(--spotlight-x) var(--spotlight-y), black 0%, rgba(0,0,0,0.5) 45%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(180px circle at var(--spotlight-x) var(--spotlight-y), black 0%, rgba(0,0,0,0.5) 45%, transparent 100%)`,
        }}
      />

      {/* 3. Subtle ambient inner glow fill for highlighted square cells */}
      <div
        className="absolute inset-0 transition-opacity duration-300 ease-out"
        style={{
          opacity: 'var(--spotlight-opacity)',
          background: `radial-gradient(180px circle at var(--spotlight-x) var(--spotlight-y), rgba(0, 0, 0, 0.02) 0%, transparent 100%)`,
        }}
      />
    </div>
  )
}
export default SpotlightGrid
