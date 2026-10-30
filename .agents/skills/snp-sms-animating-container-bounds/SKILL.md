---
name: snp-sms-animating-container-bounds
description: >-
  A Living Manual for Animating Container Bounds: Smooth Width & Height Transitions with Motion and ResizeObserver.
  Authoritative specification for decoupling container measurement from animation, two-div architecture,
  zero-dependency useMeasure hook, variable-width buttons, and expandable accordion containers in SNP-SMS.
---

# Animating Container Bounds: Two-Div Architecture & ResizeObserver Pattern

This skill governs smooth, non-snapping container width and height animations across dynamic buttons, expandable cards, accordions, and variable-length text containers in the SNP-SMS repository.

---

## 1. Core Architecture: The Two-Div Separation

1. **Outer Container (`<motion.div>`)**:
   - Driven by Motion's `animate` prop (`width` or `height`).
   - Receives target bounds dynamically from `useMeasure`.
   - Controls clipping and border geometry.
2. **Inner Wrapper (`<div>`)**:
   - Holds the `ref` from `useMeasure`.
   - Renders at intrinsic content size with zero distortion or scale transformations.
   - **Loop Guard**: Never place the `ref` and `animate` prop on the same DOM element.

---

## 2. Essential Gotchas & Code Patterns

### 2.1 The Mount Zero-Guard
```tsx
// MANDATORY: Guard against initial 0px flash before ResizeObserver fires
<motion.div
  animate={{
    width: bounds.width > 0 ? bounds.width : "auto",
    height: bounds.height > 0 ? bounds.height : "auto",
  }}
/>
```

### 2.2 Fluid Chase Timing
* Apply `delay: 0.05s` with `ease: [0.19, 1, 0.22, 1]` so the container smoothly glides to fit newly arrived content without feeling rigid.

---

## 3. Standard Use Cases

* **Dynamic Buttons**: Label shifts between loading, action, and confirmed states.
* **Accordions & Drawers**: Expanding and collapsing FAQ panels and card details.
* **Notification Badges**: Smooth horizontal expansion when numeric counts increase.
