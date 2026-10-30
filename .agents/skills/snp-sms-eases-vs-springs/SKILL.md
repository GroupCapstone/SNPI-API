---
name: snp-sms-eases-vs-springs
description: >-
  Easing Curves vs. Springs: A Design and Engineering Decision Framework.
  Authoritative specification for choosing between cubic Bézier easing curves and physics-based springs,
  interaction role classifications (None, Springs, Linear, Ease-In, Ease-Out, Ease-InOut),
  <300ms timing rule, and interruption resilience in the SNP-SMS design system.
---

# Easing Curves vs. Springs: A Design and Engineering Decision Framework

This skill is the authoritative engineering and design standard for choosing between cubic Bézier curves and physics-based springs across all frontend components, transitions, and micro-interactions in SNP-SMS.

---

## 1. Primary Filter

Before adjusting curves, duration tokens, or spring parameters, ask:

> **Is this motion reacting to the user, or is the system speaking?**

1. **Reacting to the User (Springs)**:
   - Direct physical manipulation (drag, toss, pull-to-refresh, press).
   - Must survive unexpected user interruption without glitching or resetting.
   - Preserves user input velocity and momentum.
2. **System Speaking (Easing Curves)**:
   - System announcements, state changes, and arrivals.
   - Guides attention to new information with a predictable, calm landing.
   - Operates on fixed timeframes with predefined start and finish points.

---

## 2. Interaction Roles & Decision Matrix

| Role | Interaction Type | Engine | Primary Justification | Standard Token / Parameters |
| :--- | :--- | :--- | :--- | :--- |
| **None** | Data entry, typing, keyboard navigation, fast table toggles | **Instant** | Prioritizes immediacy and predictability over expressiveness | `duration: 0ms` |
| **Spring** | Drag-and-drop, gesture sheets, pull-to-refresh, tactile buttons | **Physics Spring** | Preserves momentum; interruptible; reflects energy of input | `stiffness: 900, damping: 80, mass: 10` |
| **Linear** | Progress meters, loaders, audio/video scrubbers, held buttons | **Linear Ease** | Preserves 1:1 mathematical relationship between time and progress | `linear` |
| **Ease-Out** | Modal entrances, tooltips appearing, snackbar arrivals, drawers | **Cubic Bézier (Decel)** | Fast initial start signals responsiveness; gradual landing allows eye to parse | `cubic-bezier(0.16, 1, 0.3, 1)` |
| **Ease-In** | Modal dismissals, snackbar exits, removing toast items | **Cubic Bézier (Accel)** | Starts calmly, accelerates away; clears screen quickly without trapping gaze | `cubic-bezier(0.7, 0, 0.84, 0)` |
| **Ease-In-Out** | Tab switching, view mode toggles, layout switching | **Cubic Bézier (Symmetric)** | Balances attention evenly across equal-weight transitions | `cubic-bezier(0.455, 0.03, 0.515, 0.955)` |

---

## 3. Technical Parameters & Under The Hood Mechanics

### 3.1 Easing Curves & Duration Standards
* **Cubic Bézier**: `transition-timing-function: cubic-bezier(x1, y1, x2, y2)`.
  * `x1, y1`: Responsiveness / Start moment. High $y_1$ eliminates perceptual delay.
  * `x2, y2`: Landing / Rest moment. High $y_2$ extends deceleration tail for calm settling.
* **Duration Thresholds (<300ms Rule)**:
  * **Hovers, presses, micro-toggles**: `120ms` to `180ms`.
  * **Small state changes (accordion, chips, dropdowns)**: `180ms` to `260ms`.
  * **Macro transitions (dialogs, sheets, page transitions)**: Maximum `300ms`.
  * *Never exceed 300ms for standard UI actions.*

### 3.2 Springs (Physical Parameters)
Springs resolve dynamically without a fixed duration:
```tsx
import { motion } from "motion/react";

// Standard Tactile Spring
export const tactileSpring = {
  type: "spring" as const,
  stiffness: 900, // Pull force toward rest state
  damping: 80,    // Resistance to oscillation
  mass: 10,       // Perceived object weight
};
```

---

## 4. Verification & Linting

When implementing motion in components:
1. Verify that typing and high-frequency data inputs use **zero animation**.
2. Verify that progress indicators and held actions use **linear timing**.
3. Verify that entrance dialogs use **ease-out** and exit dialogs use **ease-in**.
4. Verify that touch gestures and dragging elements use **spring physics**.
