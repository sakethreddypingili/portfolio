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

      // 1. Draw continuous clean ambient grid everywhere
      ctx.strokeStyle = edgeColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.5;

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

      // 2. Render sliced-cube pop & incision ONLY in the active/displaced areas
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const idx = row * cols + col;
          const d = depth[idx];
          const sh = sheen[idx];

          // If this cell is not disturbed, it remains part of the continuous resting grid
          if (d <= 0.05 && sh <= 0.01) continue;

          const x = col * cellSize;
          const y = row * cellSize;

          // Sliced separation gap and 3D lift
          const lift = Math.min(18, d * 0.9);
          const cutGap = Math.min(cellSize * 0.28, d * 0.35);
          
          // Cube top-face shifts slightly up and left (natural light from top-left)
          const offsetX = -lift * 0.25;
          const offsetY = -lift * 0.45;
          
          const drawX = x + cutGap + offsetX;
          const drawY = y + cutGap + offsetY;
          const drawW = cellSize - cutGap * 2;
          const drawH = cellSize - cutGap * 2;

          if (drawW <= 1 || drawH <= 1) continue;

          // 1. Dark incision floor / crease left behind as cube lifts
          ctx.fillStyle = 'rgba(15, 23, 42, 0.12)';
          ctx.globalAlpha = Math.min(0.7, d * 0.08);
          ctx.fillRect(x, y, cellSize, cellSize);

          // 2. Realistic directional cast shadow beneath the elevated cube
          ctx.fillStyle = 'rgba(0, 0, 0, 0.14)';
          ctx.globalAlpha = Math.min(0.5, lift * 0.04);
          ctx.fillRect(drawX + lift * 0.3, drawY + lift * 0.5, drawW, drawH);

          // 3. 3D Bottom facet (extrusion depth)
          ctx.fillStyle = '#cbd5e1';
          ctx.globalAlpha = 1;
          ctx.beginPath();
          ctx.moveTo(drawX, drawY + drawH);
          ctx.lineTo(drawX - offsetX, drawY + drawH - offsetY);
          ctx.lineTo(drawX + drawW - offsetX, drawY + drawH - offsetY);
          ctx.lineTo(drawX + drawW, drawY + drawH);
          ctx.closePath();
          ctx.fill();

          // 4. 3D Right facet (extrusion depth)
          ctx.fillStyle = '#e2e8f0';
          ctx.beginPath();
          ctx.moveTo(drawX + drawW, drawY);
          ctx.lineTo(drawX + drawW - offsetX, drawY - offsetY);
          ctx.lineTo(drawX + drawW - offsetX, drawY + drawH - offsetY);
          ctx.lineTo(drawX + drawW, drawY + drawH);
          ctx.closePath();
          ctx.fill();

          // 5. 3D Top face of the cube
          ctx.fillStyle = faceColor;
          ctx.globalAlpha = 1;
          ctx.fillRect(drawX, drawY, drawW, drawH);

          // Top face edge highlight (light from above)
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.fillRect(drawX, drawY, drawW, 1.5);

          // Sheen / ripple wave reflection
          if (sh > 0.02) {
            ctx.fillStyle = rippleColor;
            ctx.globalAlpha = Math.min(0.6, sh * 0.7);
            ctx.fillRect(drawX, drawY, drawW, drawH);
          }

          // Crisp 3D cube top perimeter stroke
          ctx.strokeStyle = edgeColor;
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.8;
          ctx.strokeRect(drawX, drawY, drawW, drawH);
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


