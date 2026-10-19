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

      const stiffness = 120 * speed * speed;
      const damping = 2 * (1 - 0.7 * bounce) * Math.sqrt(stiffness);
      // Wider influence radius so 5-7 rows and cols participate in the cloth funnel
      const influenceRadius = Math.max(radius * cellSize * 1.8, cellSize * 5.5);

      let isMoving = false;

      // Physics update
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const idx = row * cols + col;
          const cx = col * cellSize + cellSize / 2;
          const cy = row * cellSize + cellSize / 2;

          let target = 0;
          let targetSheen = 0;

          // Pointer cloth indentation
          if (pointer.active) {
            const dist = Math.hypot(cx - pointer.x, cy - pointer.y);
            if (dist < influenceRadius) {
              const norm = dist / influenceRadius;
              // Smooth cosine/cubic falloff for natural cloth drape
              const press = Math.cos(norm * (Math.PI / 2));
              target = press * 24; // Deeper 24px cloth indentation
              targetSheen = press * 0.5;
            }
          }

          // Ripple waves
          for (let r = 0; r < ripples.length; r++) {
            const rip = ripples[r];
            const dist = Math.hypot(cx - rip.x, cy - rip.y);
            const waveDiff = Math.abs(dist - rip.radius);
            if (waveDiff < cellSize * 2) {
              const wave = Math.cos((waveDiff / (cellSize * 2)) * Math.PI) * rip.strength;
              target += wave * 12;
              targetSheen = Math.max(targetSheen, rip.strength * 0.6);
            }
          }

          targetDepth[idx] = target;

          // Spring simulation
          const force = stiffness * (targetDepth[idx] - depth[idx]) - damping * velocity[idx];
          velocity[idx] += force * dt;
          depth[idx] += velocity[idx] * dt;
          sheen[idx] += (targetSheen - sheen[idx]) * (1 - Math.exp(-dt * 8));

          if (Math.abs(depth[idx] - targetDepth[idx]) > 0.05 || Math.abs(velocity[idx]) > 0.05) {
            isMoving = true;
          }
        }
      }

      // 1. Draw solid background
      ctx.fillStyle = faceColor;
      ctx.globalAlpha = 1;
      ctx.fillRect(0, 0, width, height);

      // 2. Pre-calculate warped vertices for the continuous cloth surface
      // Vertices are at (col * cellSize, row * cellSize)
      // Each cube (col, row) is defined by its 4 corners
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const idx = row * cols + col;
          const d = Math.max(0, depth[idx]);
          const sh = sheen[idx];

          const cx = col * cellSize + cellSize / 2;
          const cy = row * cellSize + cellSize / 2;
          const x = col * cellSize;
          const y = row * cellSize;

          if (d <= 0.05 && sh <= 0.01) {
            // Resting cube: clean 1px stroke
            ctx.strokeStyle = edgeColor;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.55;
            ctx.strokeRect(x, y, cellSize, cellSize);
            continue;
          }

          // Inward vector towards cursor (pulling cloth inward as it sinks)
          const dx = pointer.x - cx;
          const dy = pointer.y - cy;
          const dist = Math.hypot(dx, dy) || 1;
          const pull = Math.min(cellSize * 0.35, (d / 24) * cellSize * 0.35);
          const shiftX = (dx / dist) * pull;
          const shiftY = (dy / dist) * pull;

          // Sinking depth creates funnel shadow
          const sinkDepth = Math.min(18, d);

          // Deep valley ambient occlusion shadow inside the depression funnel
          ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
          ctx.globalAlpha = Math.min(0.8, (sinkDepth / 24) * 0.85);
          ctx.fillRect(x, y, cellSize, cellSize);

          // Shifted top cube face
          const gap = 1;
          const topX = x + gap + shiftX;
          const topY = y + gap + shiftY;
          const topW = cellSize - gap * 2;
          const topH = cellSize - gap * 2;

          // 3D Extrusion bevel wall towards the rim (visible slope of the dip)
          if (sinkDepth > 0.5) {
            ctx.fillStyle = '#dcdcdc';
            ctx.globalAlpha = Math.min(0.9, (sinkDepth / 24) * 1.1);

            // Slope facet opposite to the pull
            ctx.beginPath();
            if (Math.abs(shiftX) > 0.3) {
              const startX = shiftX > 0 ? x : x + cellSize;
              const edgeX = shiftX > 0 ? topX : topX + topW;
              ctx.moveTo(startX, y);
              ctx.lineTo(edgeX, topY);
              ctx.lineTo(edgeX, topY + topH);
              ctx.lineTo(startX, y + cellSize);
              ctx.closePath();
              ctx.fill();
            }
            if (Math.abs(shiftY) > 0.3) {
              const startY = shiftY > 0 ? y : y + cellSize;
              const edgeY = shiftY > 0 ? topY : topY + topH;
              ctx.moveTo(x, startY);
              ctx.lineTo(topX, edgeY);
              ctx.lineTo(topX + topW, edgeY);
              ctx.lineTo(x + cellSize, startY);
              ctx.closePath();
              ctx.fill();
            }
          }

          // Top cube face
          ctx.fillStyle = faceColor;
          ctx.globalAlpha = 1;
          ctx.fillRect(topX, topY, topW, topH);

          // Top rim highlight catching direct overhead light
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.fillRect(topX, topY, topW, 1);

          // Cube edge outline (clearly visible clean monochrome border)
          ctx.strokeStyle = '#cccccc';
          ctx.lineWidth = 1;
          ctx.globalAlpha = Math.min(0.95, 0.55 + (sinkDepth / 24) * 0.4);
          ctx.strokeRect(topX, topY, topW, topH);

          // Sheen wave reflection
          if (sh > 0.02) {
            ctx.fillStyle = rippleColor;
            ctx.globalAlpha = Math.min(0.4, sh * 0.5);
            ctx.fillRect(topX, topY, topW, topH);
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


