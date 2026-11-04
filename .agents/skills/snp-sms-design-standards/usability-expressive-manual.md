# Material 3 Usability & Expressive Architecture Manual

This manual is the authoritative specification for usability engineering, expressive design tactics, and interface calmness across the SNPI-SMS platform.

---

## 1. Nielsen Norman Group Five Usability Pillars

Usability governs how intuitive, straightforward, and satisfying an interface is for all humans. SNPI-SMS designs must satisfy all five pillars defined by the Nielsen Norman Group:

| Usability Pillar | Definition & Requirement | Implementation in SNPI-SMS |
| :--- | :--- | :--- |
| **1. Efficiency** | Speed and ease of performing repetitive tasks once learned | Keyboard shortcuts, batch selection, instant search filtering. |
| **2. Error Reduction** | Minimizing mistakes and providing effortless recovery | Strict input validation, clear confirmation dialogs, 1-click Undo toast. |
| **3. Learnability** | Obviousness of interface operations for first-time visitors | Familiar mental models, plain English labels, zero mystery icons. |
| **4. Memorability** | Effortless re-engagement after periods of absence | Predictable 5-token palette, consistent navigation bars, stable layout anchors. |
| **5. Satisfaction** | Pleasant, tactile, and frictionless aesthetic experience | Physics-based spring animations (<300ms), high contrast, zero clutter. |

### 1.1 Usability vs. Accessibility Distinction
- **Accessibility (a11y)**: Ensures people with disabilities can perceive, understand, navigate, and interact with the system (WCAG AAA contrast, screen reader labels, keyboard focus traversal).
- **Usability**: Ensures the interface is cognitively effortless, delightful, and efficient for *everyone* under all environmental conditions.

---

## 2. The Six M3 Expressive Design Tactics

M3 Expressive tactics guide user attention through intentional visual hierarchy:

```
+-----------------------------------------------------------------------------------------+
|                               6 M3 EXPRESSIVE DESIGN TACTICS                            |
+-----------------------------------------------------------------------------------------+
| 1. SIZE        | Scale hero elements to establish dominant visual anchors               |
| 2. CONTAINMENT | Frame related data inside cohesive surfaces, keylines, and cards       |
| 3. SHAPE       | Expressive corner radii (8px, 12px, 16px, 24px) signaling tapability   |
| 4. COLOR       | Semantic brand tones (#0056FF, #2277FF) drawing eyes to primary actions|
| 5. MOTION      | Physics-based springs (<300ms) conveying spatial continuity and weight |
| 6. TYPOGRAPHY  | Strict contrast hierarchy distinguishing headings, body, and metadata  |
+-----------------------------------------------------------------------------------------+
```

---

## 3. Goal Hierarchy Architecture: Primary, Secondary & Tertiary

Every screen in the system must establish an unambiguous goal hierarchy:

1. **Primary Goal (The Hero Action)**:
   - Exactly **ONE** primary goal per screen (e.g. "Take Attendance", "Submit Grades", "Enroll Student").
   - Rendered using the prominent Royal Blue CTA button (`#0056FF`, `px-6 py-3`, font-semibold, high elevation or distinct container).
2. **Secondary Goals (Contextual Actions)**:
   - Actions supporting the primary workflow (e.g. "Export CSV", "Filter Section", "View History").
   - Rendered using Outlined or Tonal secondary buttons (`#EFF5FF` fill with `#CAD3F5` border).
3. **Tertiary Goals (Settings & Preferences)**:
   - Infrequent configuration actions (e.g. "Column Visibility", "Table Settings").
   - Subordinated to a trailing icon button or overflow menu.

---

## 4. Calmness vs. Clutter: The Aura Case Study

The Aura holistic breathing experience demonstrates the difference between cluttered cognitive overload and calm, purposeful UX:

### 4.1 Anti-Pattern: V1 Cluttered Layout
- Exposes all metrics, toggles, graphs, and settings simultaneously on the same visual plane.
- Forces the user to parse 15 competing elements before understanding what action to take.
- Result: High cognitive load, anxiety, and decision paralysis.

### 4.2 Best Practice: V2 Calm & Focused Layout
- **Hero Moment Focus**: During an active workflow (e.g. breathing guidance, test taking), subordinate or hide all secondary metrics into progressive disclosure drawers.
- **Rhythmic White Space**: Surround the primary action with generous spacing (`spacing-3xl` / `spacing-4xl`).
- **Tactile Feedback**: Use smooth spring scaling on the hero element to guide the user's natural pace.
- **Post-Action Review**: Present analytics and progress reports *after* the hero moment completes, not during it.

---

## 5. Invariant Anti-Clutter Rules

1. **Zero Simultaneous Competing CTAs**: Never render two primary filled buttons (`#0056FF`) beside each other. One must always be primary filled, the other outlined or text.
2. **Minimal Guide Text**: Never write walls of explanatory text. Provide clear button labels and concise tooltips on icon hover.
3. **Motion Restraint**: Never trigger multiple competing animations simultaneously. Motion must direct attention to a single focal point.
