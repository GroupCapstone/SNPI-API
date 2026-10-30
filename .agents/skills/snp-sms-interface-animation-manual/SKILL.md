---
name: snp-sms-interface-animation-manual
description: >-
  A Living Manual for Better Interfaces: The 12 Principles of Animation for Web Interfaces.
  Authoritative specification for interface motion, transitions, micro-interactions, spring physics,
  <300ms timing rule, AnimatePresence exit protocols, and tactile feedback in the SNP-SMS design system.
---

# A Living Manual for Better Interfaces: The 12 Principles of Animation for Web Interfaces

This skill is the single authoritative motion and interaction standard for all frontend user interfaces, transitions, micro-interactions, and component animations in the SNP-SMS repository.

---

## 1. Core Motion Philosophy

Motion in software is communication, not decoration. Great interface animation is:
1. **Purposeful**: Clarifies state transitions, structural hierarchy, and causality.
2. **Invisible**: Users experience responsiveness and fluidity without analyzing curves.
3. **High Velocity (<300ms Rule)**: Every interaction must complete in under 300ms.
4. **Physically Grounded**: Simulates mass, momentum, spring physics, and natural deceleration.

---

## 2. The 12 Principles of Web Interface Animation

### 2.1 Squash and Stretch (Mass & Deformation)
* Conveys mass, weight, material, and energy through momentary deformation upon contact or state change.
* Momentary compression (`scale(0.96)`) on button click or card touch down, followed by an elastic spring back on release.
* **Restraint Gate**: Keep deformations subtle ($0.95 \le \text{scale} \le 1.05$) over durations $\le 180\text{ms}$. Never turn professional software into a cartoon.

### 2.2 Anticipation (Preparation for Action)
* Prepares the user for what comes next by providing subtle cues before the primary action executes.
* Pull-to-refresh elastic resistance hints, button compression before network dispatch, badge wiggle on incoming notification.
* **Restraint Gate**: Reserve anticipation strictly for high-value actions. Avoid wind-ups on basic toggles.

### 2.3 Staging (Directing User Attention)
* Orchestrates screen transitions so user attention lands exactly where action is required.
* Focus targets while dimming/blurring background surfaces.
* Animate container boundaries first, followed by staggered primary content, followed by secondary actions. Never animate everything simultaneously.

### 2.4 Straight Ahead Action & Pose to Pose (Keyframes & Restraint)
* Web animations operate pose-to-pose via keyframes and declarative state drivers.
* Focus on defining start, end, and transition curves.
* **Restraint Principle**: If an element does not need animation, do not animate it. Context menus must open **instantly** (zero entry animation) and only animate upon exit.

### 2.5 Follow Through & Overlapping Action (Inertia & Springs)
* Physical objects do not move as rigid units; connected parts continue moving after the primary body stops.
* Use damped harmonic springs (`stiffness: 400–500`, `damping: 28–32`) for overshoot-and-settle behavior.
* Stagger lists by 20ms to 40ms. Keep total cascade duration under 250ms to prevent latency.

### 2.6 Slow In & Slow Out (Natural Easing Curves)
* Natural forces accelerate and decelerate gradually due to inertia and friction.
* **Strict Linear Ban**: Never use `linear` transitions for UI element layouts.
* **Standard Easing Tokens**:
  * **Entrances**: `cubic-bezier(0.16, 1, 0.3, 1)` (snappy ease-out; arrives quickly, settles gently).
  * **Exits**: `cubic-bezier(0.7, 0, 0.84, 0)` (accelerate ease-in; momentum before departure).
  * **Movements**: `cubic-bezier(0.65, 0, 0.35, 1)` (deliberate ease-in-out; sliding panels).
  * **Springs**: `type: "spring", stiffness: 450, damping: 30` (switches, chips, bottom sheets).

### 2.7 Arcs (Organic Trajectories)
* Natural motion moves along subtle curved arcs rather than mechanical right angles.
* Use arcs for flyout menus, floating action buttons (FABs), and fluid morphing transitions.
* Use straight linear axes for high-density administrative data tables and enterprise forms.

### 2.8 Secondary Action (Feedback & Reassurance)
* Minor flourishes that reinforce the main action without stealing focus.
* Checkmark pop followed by subtle shimmer upon successful form submission.
* Deleted row fading out while adjacent rows slide upward to close the gap.
* Crisp audio click or subtle haptic pulse reinforcing touch execution.

### 2.9 Timing (The <300ms Rule & Scale Uniformity)
* **The <300ms Golden Rule**: All micro-interactions must complete in **120ms to 280ms**.
* **Standard Duration Tokens**:
  * `instant`: `80ms` – `120ms` (tooltips, toggle switches, hover borders).
  * `quick`: `150ms` – `180ms` (dropdowns, button compressions, tab bar switches).
  * `normal`: `200ms` – `240ms` (toasts, snackbars, chip selections, accordions).
  * `deliberate`: `260ms` – `300ms` (modal dialogs, bottom sheets, full sidebar drawers).
* **Uniformity Requirement**: Identical component types must share identical durations across the design system.

### 2.10 Exaggeration (Theatrical Clarity)
* Amplifying motion for high-stakes moments.
* Error shake on invalid PIN/password entry (`[-6px, 6px, -4px, 4px, 0px]` over 200ms).
* Celebratory scale bounce on institutional milestone completion (`scale(1.15)` settling to `1.0`).
* Empty state subtle breathing pulse drawing attention to primary creation triggers.

### 2.11 Solid Drawing (Volume, Depth & Spatial Integrity)
* Simulates 3D space, perspective, volume, and depth without fake clutter.
* Maintain consistent luminance hierarchy and 1px keylines rather than muddy drop shadows.
* Maintain consistent container perspective (`perspective: 1000px`) during 3D rotations or card flips.

### 2.12 Appeal (Craft as Competitive Differentiator)
* The cumulative synthesis of all 11 principles applied with taste, care, and restraint.
* Polish and tactile motion transform utilitarian interfaces into software users love.

---

## 3. Exit Animation & `AnimatePresence` Standard

When elements leave the DOM, they must animate out cleanly before removal:

```tsx
import { AnimatePresence, motion } from 'motion/react';

// Exit Modes
// 1. mode="sync": Simultaneous entrance and exit (crossfades)
// 2. mode="wait": Exiting element completes before entering element starts
// 3. mode="popLayout": Exiting element is removed from layout flow immediately
```

---

## 4. Design System Compliance Checklist

Every component author must verify:
- [ ] Total duration $\le 280\text{ms}$.
- [ ] Non-linear easing curves or damped springs applied.
- [ ] Pure light theme styling maintained on light surfaces (zero `#000000` buttons).
- [ ] Minimum $44 \times 44\text{px}$ touch target preserved throughout movement.
- [ ] Reduced motion `@media (prefers-reduced-motion: reduce)` respected.
