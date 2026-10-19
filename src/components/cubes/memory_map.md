# Analysis & Memory Map: Cubes Collapse Bug

## The Root Cause of the Visual Glitch:
1. **Double Border / Grid Misalignment:**
   - In orthographic WebGL, each cube cell is drawn with `uSize` around `[-0.5, 0.5]`.
   - Drawing an edge line in fragment shader on each cube with UV boundaries creates overlapping lines and asymmetric lines because pixels don't align to integers.
2. **Infinite Resize / Allocate Loop:**
   - In `Cubes.tsx`, `allocateGrid` was being called during `resize()`, which altered array buffers while `ResizeObserver` was active, causing state instability.
3. **The User's Exact Requirement:**
   - The user wants a clean, static, uninterrupted graph/grid slab.
   - Zero gaps.
   - When cursor hovers or moves, adjacent squares smoothly depress / squish in depth (like a flexible silicone or jelly keyboard mat), without wild 3D tumbling, twisting, or collapsing borders.
