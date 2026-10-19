'use client';

import { useEffect, useRef } from 'react';
import './Cubes.css';

interface CubesProps {
  gridSize?: number;
  faceColor?: string;
  edgeColor?: string;
  faceOpacity?: number;
  radius?: number;
  speed?: number;
  bounce?: number;
  rippleOnClick?: boolean;
  rippleColor?: string;
  className?: string;
}

export default function Cubes({
  gridSize = 16,
  faceColor = '#f8f9fa',
  edgeColor = '#e2e7ec',
  faceOpacity = 0.95,
  radius = 4,
  speed = 1.2,
  bounce = 0.5,
  rippleOnClick = true,
  rippleColor = '#e0e6ed',
  className = '',
}: CubesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let cellSize = 40;
    let dpr = 1;

    // Simulation states
    let depth: Float32Array = new Float32Array(0);
    let velocity: Float32Array = new Float32Array(0);
    let targetDepth: Float32Array = new Float32Array(0);
    let sheen: Float32Array = new Float32Array(0);

    const pointer = { x: -9999, y: -9999, active: false };
    const ripples: { x: number; y: number; radius: number; maxRadius: number; strength: number }[] = [];

    const allocate = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      if (width <= 0 || height <= 0) return;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      // Integer cell size for crisp, razor-sharp 1px grid lines
      cellSize = Math.max(14, Math.floor(width / gridSize));
      cols = Math.ceil(width / cellSize) + 1;
      rows = Math.ceil(height / cellSize) + 1;
      const count = cols * rows;

      depth = new Float32Array(count);
      velocity = new Float32Array(count);
      targetDepth = new Float32Array(count);
      sheen = new Float32Array(count);
    };

    allocate();

    let raf = 0;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min(0.04, (now - lastTime) / 1000);
      lastTime = now;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      // Update ripples
      for (let r = ripples.length - 1; r >= 0; r--) {
        const rip = ripples[r];
        rip.radius += 180 * speed * dt;
        rip.strength *= Math.exp(-dt * 3.5);
        if (rip.radius > rip.maxRadius || rip.strength < 0.01) {
          ripples.splice(r, 1);
        }
      }

      const stiffness = 140 * speed * speed;
      const damping = 2 * (1 - 0.75 * bounce) * Math.sqrt(stiffness);
      const influenceRadius = radius * cellSize;

      let isMoving = false;

      // Physics update
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const idx = row * cols + col;
          const cx = col * cellSize + cellSize / 2;
          const cy = row * cellSize + cellSize / 2;

          let target = 0;
          let targetSheen = 0;

          // Pointer jelly indentation
          if (pointer.active) {
            const dist = Math.hypot(cx - pointer.x, cy - pointer.y);
            if (dist < influenceRadius) {
              const norm = dist / influenceRadius;
              const press = Math.exp(-norm * norm * 3.5);
              target = press * 12; // 12px elastic depression
              targetSheen = press * 0.4;
            }
          }

          // Ripple waves
          for (let r = 0; r < ripples.length; r++) {
            const rip = ripples[r];
            const dist = Math.hypot(cx - rip.x, cy - rip.y);
            const waveDiff = Math.abs(dist - rip.radius);
            if (waveDiff < cellSize * 1.5) {
              const wave = Math.cos((waveDiff / (cellSize * 1.5)) * Math.PI) * rip.strength;
              target += wave * 8;
              targetSheen = Math.max(targetSheen, rip.strength * 0.5);
            }
          }

          targetDepth[idx] = target;

          // Spring simulation
          const force = stiffness * (targetDepth[idx] - depth[idx]) - damping * velocity[idx];
          velocity[idx] += force * dt;
          depth[idx] += velocity[idx] * dt;
          sheen[idx] += (targetSheen - sheen[idx]) * (1 - Math.exp(-dt * 8));

          if (Math.abs(depth[idx] - targetDepth[idx]) > 0.1 || Math.abs(velocity[idx]) > 0.1) {
            isMoving = true;
          }
        }
      }

      // 1. Draw solid continuous surface of the slab
      ctx.fillStyle = faceColor;
      ctx.globalAlpha = 1;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw resting surface cut lines (razor-thin incisions scored into the surface)
      ctx.strokeStyle = edgeColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.55;

      ctx.beginPath();
      for (let c = 0; c <= cols; c++) {
        const x = c * cellSize;
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let r = 0; r <= rows; r++) {
        const y = r * cellSize;
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // 3. Render surface incision yawning & clay depression ONLY in deformed areas
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const idx = row * cols + col;
          const d = depth[idx];
          const sh = sheen[idx];

          if (d <= 0.05 && sh <= 0.01) continue;

          const x = col * cellSize;
          const y = row * cellSize;

          // Incision seam yawning: cuts open slightly at the crease as the slab dents
          // Keep it strictly at the surface level (max 2.5px yawn)
          const yawn = Math.min(2.5, d * 0.22);

          // Subtle depression shading on the clay surface around the dent
          ctx.fillStyle = 'rgba(0, 0, 0, 0.025)';
          ctx.globalAlpha = Math.min(0.5, d * 0.05);
          ctx.fillRect(x, y, cellSize, cellSize);

          // Scored cut crease shadows (the inner V-groove shadow of the slice)
          if (yawn > 0.2) {
            // Horizontal cut shadow crease
            ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
            ctx.globalAlpha = Math.min(0.7, d * 0.08);
            ctx.fillRect(x, y - yawn * 0.5, cellSize, yawn);

            // Vertical cut shadow crease
            ctx.fillRect(x - yawn * 0.5, y, yawn, cellSize);

            // Soft highlight on the opposite lip of the cut (light catching the edge of the slice)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.globalAlpha = Math.min(0.8, d * 0.08);
            ctx.fillRect(x + yawn * 0.5, y + yawn * 0.5, cellSize - yawn, 1);
            ctx.fillRect(x + yawn * 0.5, y + yawn * 0.5, 1, cellSize - yawn);
          }

          // Subtle tactile sheen / deflection highlight
          if (sh > 0.02) {
            ctx.fillStyle = rippleColor;
            ctx.globalAlpha = Math.min(0.4, sh * 0.5);
            ctx.fillRect(x + yawn, y + yawn, cellSize - yawn * 2, cellSize - yawn * 2);
          }
        }
      }

      ctx.restore();

      if (isMoving || pointer.active || ripples.length > 0) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = 0;
      }
    };

    const wake = () => {
      if (!raf) {
        lastTime = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
      wake();
    };

    const onPointerLeave = () => {
      pointer.active = false;
      wake();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!rippleOnClick) return;
      const rect = container.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;
      ripples.push({
        x: px,
        y: py,
        radius: 0,
        maxRadius: Math.max(width, height) * 0.8,
        strength: 1,
      });
      wake();
    };

    const resizeObserver = new ResizeObserver(() => {
      allocate();
      wake();
    });

    resizeObserver.observe(container);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('pointerdown', onPointerDown);

    wake();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [gridSize, faceColor, edgeColor, faceOpacity, radius, speed, bounce, rippleOnClick, rippleColor]);

  return (
    <div ref={containerRef} className={`cubes-container ${className}`}>
      <canvas ref={canvasRef} className="cubes-canvas" aria-hidden="true" />
    </div>
  );
}


