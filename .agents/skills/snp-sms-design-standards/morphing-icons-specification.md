# Morphing Icons: The Three-Line SVG Transformation System

Authoritative engineering and design specification for true shape-morphing icons based on shared three-line SVG topology across the SNP-SMS platform.

---

## 1. The Morphing Principle: Beyond Crossfades

Standard interface icon transitions rely on crossfades (opacity fades) or scale-out/scale-in replacements. Crossfades momentarily blur both states, creating visual noise and perceptual delay.

True shape morphing interpolates vector coordinates directly. Inspired by Benji Taylor's experiments with Claude, this system enforces a universal geometric invariant:
* **Universal 3-Line Invariant**: **Every icon in the system is defined by exactly three SVG lines.**
* **Invisible Collapse**: Icons requiring fewer than three lines (e.g. `minus`, `plus`, `chevron`, `check`) collapse the unused lines to an invisible point at the center $(7, 7)$ with `opacity: 0`.
* **Zero DOM Churn**: Because every icon shares the exact same DOM node topology (`<svg><motion.g><line /><line /><line /></motion.g></svg>`), Motion interpolates $(x_1, y_1)$ and $(x_2, y_2)$ coordinate attributes continuously without mounting or unmounting elements.

---

## 2. Geometric Coordinates & Icon Catalog

All icons operate on a standardized $14 \times 14$ grid with center origin $(7, 7)$:
* **Collapsed Anchor**: `{ x1: 7, y1: 7, x2: 7, y2: 7, opacity: 0 }`

| Icon Name | Line 1 Coordinates | Line 2 Coordinates | Line 3 Coordinates | Rotation / Family |
| :--- | :--- | :--- | :--- | :--- |
| **menu** | `(2, 3.5) -> (12, 3.5)` | `(2, 7.0) -> (12, 7.0)` | `(2, 10.5) -> (12, 10.5)` | None |
| **plus** | `(7, 2.0) -> (7, 12.0)` | `(2, 7.0) -> (12, 7.0)` | Collapsed `(7, 7)` | Rotation: $0^\circ$ (`plus-cross`) |
| **cross** | `(7, 2.0) -> (7, 12.0)` | `(2, 7.0) -> (12, 7.0)` | Collapsed `(7, 7)` | Rotation: $45^\circ$ (`plus-cross`) |
| **minus** | `(2, 7.0) -> (12, 7.0)` | Collapsed `(7, 7)` | Collapsed `(7, 7)` | None |
| **equals** | `(2, 5.0) -> (12, 5.0)` | `(2, 9.0) -> (12, 9.0)` | Collapsed `(7, 7)` | None |
| **asterisk** | `(7, 2.0) -> (7, 12.0)` | `(2.67, 4.5) -> (11.33, 9.5)` | `(11.33, 4.5) -> (2.67, 9.5)` | None |
| **more** | `(3, 7.0) -> (3, 7.0)` | `(7, 7.0) -> (7, 7.0)` | `(11, 7.0) -> (11, 7.0)` | Dots (collapsed lengths) |
| **check** | `(2, 7.5) -> (5.5, 11.0)` | `(5.5, 11.0) -> (12, 3.0)` | Collapsed `(7, 7)` | None |
| **play** | `(4, 2.5) -> (4, 11.5)` | `(4, 2.5) -> (11.5, 7.0)` | `(4, 11.5) -> (11.5, 7.0)` | Triangle perimeter |
| **pause** | `(4, 2.5) -> (4, 11.5)` | `(10, 2.5) -> (10, 11.5)` | Collapsed `(7, 7)` | Parallel bars |
| **download** | `(7, 2.0) -> (7, 10.0)` | `(3.5, 6.5) -> (7, 10.0)` | `(10.5, 6.5) -> (7, 10.0)` | None |
| **upload** | `(7, 12.0) -> (7, 4.0)` | `(3.5, 7.5) -> (7, 4.0)` | `(10.5, 7.5) -> (7, 4.0)` | None |
| **external** | `(3, 11.0) -> (11, 3.0)` | `(5, 3.0) -> (11, 3.0)` | `(11, 3.0) -> (11, 9.0)` | Diagonal arrow + head |
| **arrow-right** | `(2, 7.0) -> (12, 7.0)` | `(7.5, 2.5) -> (12, 7.0)` | `(7.5, 11.5) -> (12, 7.0)` | Rotation: $0^\circ$ (`arrow`) |
| **arrow-down** | `(2, 7.0) -> (12, 7.0)` | `(7.5, 2.5) -> (12, 7.0)` | `(7.5, 11.5) -> (12, 7.0)` | Rotation: $90^\circ$ (`arrow`) |
| **arrow-left** | `(2, 7.0) -> (12, 7.0)` | `(7.5, 2.5) -> (12, 7.0)` | `(7.5, 11.5) -> (12, 7.0)` | Rotation: $180^\circ$ (`arrow`) |
| **arrow-up** | `(2, 7.0) -> (12, 7.0)` | `(7.5, 2.5) -> (12, 7.0)` | `(7.5, 11.5) -> (12, 7.0)` | Rotation: $-90^\circ$ (`arrow`) |
| **chevron-right** | `(5, 2.5) -> (9.5, 7.0)` | `(5, 11.5) -> (9.5, 7.0)` | Collapsed `(7, 7)` | Rotation: $0^\circ$ (`chevron`) |
| **chevron-down** | `(5, 2.5) -> (9.5, 7.0)` | `(5, 11.5) -> (9.5, 7.0)` | Collapsed `(7, 7)` | Rotation: $90^\circ$ (`chevron`) |
| **chevron-left** | `(5, 2.5) -> (9.5, 7.0)` | `(5, 11.5) -> (9.5, 7.0)` | Collapsed `(7, 7)` | Rotation: $180^\circ$ (`chevron`) |
| **chevron-up** | `(5, 2.5) -> (9.5, 7.0)` | `(5, 11.5) -> (9.5, 7.0)` | Collapsed `(7, 7)` | Rotation: $-90^\circ$ (`chevron`) |
| **grip** | `(7, 3.0) -> (7, 3.0)` | `(7, 7.0) -> (7, 7.0)` | `(7, 11.0) -> (7, 11.0)` | Vertical handle dots |
| **slash** | `(11, 3.0) -> (3, 11.0)` | Collapsed `(7, 7)` | Collapsed `(7, 7)` | Diagonal divider |
| **corner** | `(4, 3.0) -> (4, 11.0)` | `(4, 11.0) -> (11, 11.0)` | Collapsed `(7, 7)` | L-bracket |

---

## 3. Rotational Morphing & Group Preservation

A critical challenge in vector morphing is preventing unnecessary disorientation. When morphing between members of the same semantic family:
1. **Intra-Family Rotations (`arrow`, `chevron`, `plus-cross`)**:
   - The line coordinates remain identical; only the container group `rotate` value animates ($0^\circ \to 90^\circ \to 180^\circ \to -90^\circ$).
2. **Inter-Family Transformations**:
   - When morphing between different families (e.g. `menu` &rarr; `cross` or `arrow` &rarr; `check`), the rotation instantaneously snaps (`rotation.jump()`) while the line endpoints animate to their new coordinates.

---

## 4. Production TypeScript Component Implementation

```tsx
// apps/frontend/components/ui/morphing-icon.tsx
"use client";

import { motion, useReducedMotion, useSpring, type Transition } from "motion/react";
import { useEffect, useMemo, useRef } from "react";

export interface IconLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity?: number;
}

export interface IconDefinition {
  lines: [IconLine, IconLine, IconLine];
  rotation?: number;
  group?: string;
}

const CENTER = 7;
const VIEWBOX_SIZE = 14;

const collapsed: IconLine = {
  x1: CENTER,
  y1: CENTER,
  x2: CENTER,
  y2: CENTER,
  opacity: 0,
};

const defaultTransition: Transition = {
  ease: [0.19, 1, 0.22, 1],
  duration: 0.35,
};

// Component Rendering 3 Animated SVG Lines
export function MorphingIcon({
  icon,
  size = 16,
  strokeWidth = 1.5,
  transition = defaultTransition,
}: {
  icon: IconName;
  size?: number;
  strokeWidth?: number;
  transition?: Transition;
}) {
  const definition = icons[icon];
  const reducedMotion = useReducedMotion() ?? false;
  const prevDefRef = useRef(definition);
  const activeTransition = reducedMotion ? { duration: 0 } : transition;

  const rotation = useSpring(definition.rotation ?? 0, activeTransition);

  const shouldRotate = useMemo(() => {
    const prev = prevDefRef.current;
    return Boolean(prev.group && definition.group && prev.group === definition.group);
  }, [definition]);

  useEffect(() => {
    if (shouldRotate) {
      rotation.set(definition.rotation ?? 0);
    } else {
      rotation.jump(definition.rotation ?? 0);
    }
    prevDefRef.current = definition;
  }, [definition, shouldRotate, rotation]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <motion.g style={{ rotate: rotation, transformOrigin: "center" }}>
        {definition.lines.map((line, idx) => (
          <motion.line
            key={idx}
            animate={{
              x1: line.x1,
              y1: line.y1,
              x2: line.x2,
              y2: line.y2,
              opacity: line.opacity ?? 1,
            }}
            transition={activeTransition}
          />
        ))}
      </motion.g>
    </svg>
  );
}
```

---

## 5. Architectural References

1. **Benji Taylor**: *Morphing Icons with Claude* (Three-line universal invariant experiment).
2. **Apple Human Interface Guidelines**: *Fluid Gestures and Shape Continuity*.
3. **Motion / Framer Motion**: *Declarative SVG attribute interpolation (`motion.line`)*.
