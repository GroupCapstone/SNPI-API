# Easing Curves vs. Springs: A Design and Engineering Decision Framework

Authoritative engineering and design manual for deciding between easing curves and physics-based springs across the SNP-SMS platform.

---

## 1. The Core Decision Framework

Easing curves and springs are **not interchangeable tools**. They are not merely two different ways to animate the same property; they originate from fundamentally different paradigms and play distinct roles in software interfaces.

### The Primary Filter
Before touching curves, duration tokens, or animation libraries, evaluate this single question:

> **Is this motion reacting to the user, or is the system speaking?**

```
                     +---------------------------------------+
                     | Is this motion reacting to the user,  |
                     |       or is the system speaking?      |
                     +---------------------------------------+
                                    /         \
                                   /           \
                 [Reacting to User]             [System Speaking]
                         |                              |
         +-------------------------------+      +-------------------------------+
         | - Needs continuous attachment |      | - Announcing a state change   |
         | - Must survive interruption   |      | - Guiding user attention      |
         | - Preserves velocity/momentum |      | - Clear, predictable landing  |
         +-------------------------------+      +-------------------------------+
                         |                              |
                         v                              v
                     [SPRING]                    [EASING CURVE]
```

* **Springs (User Reacting)**: Choose when motion stays attached to the user, survives live interruptions, and preserves physical momentum (dragging, flicking, pressing, pinching, sheet tossing).
* **Easing Curves (System Speaking)**: Choose when the system announces a state change, guides attention, or lands an element predictably within a fixed time window.

---

## 2. Interaction Roles & Decision Matrix

| Role | Interaction Type | Recommended Engine | Primary Justification | Typical Token / Parameter |
| :--- | :--- | :--- | :--- | :--- |
| **None** | Typing, keyboard navigation, fast table toggles, high-frequency actions | **Instant (Zero Motion)** | Immediacy and predictability outweigh expressiveness; motion introduces perceived lag | `duration: 0ms` |
| **Spring** | Drag-and-drop, gesture sheets, pull-to-refresh, button press down/up, rubber-banding | **Physics Spring** | Preserves input momentum; resilient to sudden interruption; never assumes interaction is finished | `stiffness: 900, damping: 80, mass: 10` |
| **Linear** | Progress bars, loading spinners, video/audio scrubbers, held-action confirmations | **Linear Ease** | Preserves a strict 1:1 mathematical relationship between elapsed time and progress | `linear` |
| **Ease-Out** | Modal entrances, tooltips appearing, snackbar entrance, drawer reveal | **Cubic Bézier (Decel)** | Fast initial response captures eye; gradual landing provides time to parse content | `cubic-bezier(0.16, 1, 0.3, 1)` |
| **Ease-In** | Modal dismissals, snackbar exits, removing toast items, closing drawer | **Cubic Bézier (Accel)** | Starts calmly, accelerates away; clears the screen quickly without stealing focal attention | `cubic-bezier(0.7, 0, 0.84, 0)` |
| **Ease-In-Out** | Tab switching, view mode toggles, full-page layout transitions | **Cubic Bézier (Symmetric)** | Balances attention evenly across equal-weight transitions | `cubic-bezier(0.455, 0.03, 0.515, 0.955)` |

---

## 3. Detailed Role Breakdown

### 3.1 None (Deliberate Immediacy)
* **Principle**: Not everything requires motion. High-frequency interactions (data-entry inputs, keyboard shortcuts, dense grid filtering) feel slower and noisy when animated.
* **Guideline**: Choosing zero animation is an intentional engineering decision prioritizing speed, clarity, and zero cognitive friction.

### 3.2 Springs (Physical Continuity & Interruption)
* **Continuity & Interruption**: Easing curves break down when a user interrupts an ongoing animation (e.g., catching a falling sheet or tapping mid-flight). Easing curves assume an interaction is finished before running a pre-baked curve. Springs simulate mass, stiffness, and damping, allowing instantaneous redirection without visual jumps.
* **Energy Reflection**: A fast flick yields high initial velocity and a snappy rebound; a slow drag yields a gentle return.
* **Restraint Gate**: Springs can feel restless, nervous, or overly playful if used for simple system announcements. Do not apply spring overshoot to institutional alerts or data tables.

### 3.3 Linear (Representing Time and Progress)
* **1:1 Time Mapping**: Spatial motion using linear curves feels robotic because physical objects do not instantly accelerate to constant velocity. However, when motion represents **time itself**, linear is mandatory.
* **Held Confirmation Buttons**: A "Hold to Delete" button filling a stroke over 1500ms must use linear easing so the user accurately perceives the exact time remaining before execution. Easing in or out distorts perceived time.

### 3.4 Ease-Out (Responsive Entrances)
* **Behavior**: Rapid initial displacement that decelerates smoothly into place.
* **Use Case**: Surface appearances, dialog popups, dropdown menus. The fast start signals responsiveness (<50ms perception), while the extended landing gives human visual processing time to parse the arriving content.

### 3.5 Ease-In (Unobtrusive Exits)
* **Behavior**: Starts slowly and accelerates rapidly off-screen.
* **Use Case**: Dismissing banners, closing dialogs, unmounting cards. Lingering on exit traps user focus on disappearing content. Accelerating away acknowledges the dismissal and clears the viewport immediately.

### 3.6 Ease-In-Out (State-to-State Symmetry)
* **Behavior**: Slow start, fast mid-point, slow finish.
* **Use Case**: Switching between two views of equal importance (e.g., switching between Grid View and Table View).
* **Warning**: Easy to overuse. Pervasive ease-in-out makes interfaces feel sluggish, indecisive, and overly polite.

---

## 4. Under The Hood: Technical Implementations

### 4.1 Easing Curves (Cubic Bézier Mechanics)
Easing curves define how motion progresses over a **fixed duration**:
$$\text{transition-timing-function}: \text{cubic-bezier}(x_1, y_1, x_2, y_2)$$

* **Initial Control Point ($x_1, y_1$) — Responsiveness**:
  * Lower $y_1$ values ease in gradually, feeling deliberate or hesitant.
  * Higher $y_1$ values ramp progress immediately, eliminating perceptual lag on hover and press states.
* **Terminal Control Point ($x_2, y_2$) — Landing**:
  * Higher $y_2$ values extend the deceleration tail, creating calm, composed landings.
  * Lower $y_2$ values abruptly truncate deceleration, creating sharp, tense stops.

#### Duration Standards (<300ms Rule)
If an easing animation feels slow, the curve is rarely the issue; **the duration is too long**.
* **Micro-Interactions (Hovers, presses, icon toggles)**: `120ms` to `180ms`
* **Small State Changes (Chips, accordion expand, dropdown menus)**: `180ms` to `260ms`
* **Macro Transitions (Modal sheets, view slides, drawer reveals)**: Maximum `300ms`
* *Beyond 300ms, motion transitions from feeling reactive to feeling cinematic and obstructive.*

### 4.2 Springs (Physical Parameterization)
Springs do not possess a fixed duration; motion terminates naturally when physical energy drops below a perception threshold.

```tsx
// Framer Motion / Motion for React Spring Specification
const snappySpring = {
  type: "spring",
  stiffness: 900, // Pull force toward target (controls onset speed)
  damping: 80,    // Friction/drag coefficient (prevents endless oscillation)
  mass: 10,       // Perceived object inertia
};

const gentleSheetSpring = {
  type: "spring",
  stiffness: 400,
  damping: 38,
  mass: 1,
};
```

* **Stiffness**: Defines how aggressively the spring pulls toward its rest state. Higher stiffness increases responsiveness.
* **Damping**: Suppresses oscillation. Low damping produces bouncy overshoots; high damping produces critical settling without bounce.
* **Mass**: Amplifies inertia. Higher mass makes the spring feel heavier and slower to accelerate or decelerate.

---

## 5. Architectural References

1. **Nielsen Norman Group**: *Animation for Attention and Comprehension* (Research on motion utility vs. cognitive clutter).
2. **Apple Human Interface Guidelines**: *Motion* (Prioritizing physics-based springs for continuous gestural feedback).
3. **Apple WWDC 2023**: *Animate with springs* (Velocity preservation and interruption mechanics).
4. **Freya Holmér**: *The Beauty of Bézier Curves* (Mathematical breakdown of Bernstein polynomials and control points).
5. **Google Material Design 3**: *Motion System* (Expressive easing curves, exit acceleration, and entrance deceleration).
