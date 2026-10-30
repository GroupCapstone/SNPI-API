---
name: snp-sms-morphing-icons
description: >-
  Morphing Icons: The Three-Line SVG Transformation System.
  Authoritative specification for shape-interpolating vector icons using a universal 3-line invariant,
  invisible collapsed anchors, rotational groups, and zero-DOM-churn transitions in SNP-SMS.
---

# Morphing Icons: The Three-Line SVG Transformation System

This skill governs vector icon state transformations across all frontend views, interactive buttons, modal dismissals, and navigation bars in SNP-SMS.

---

## 1. The Core Principle

* **3-Line Universal Invariant**: Every icon consists of exactly three SVG `<line>` elements on a $14 \times 14$ grid.
* **Invisible Collapse**: Extra lines collapse to the center point $(7, 7)$ with `opacity: 0`.
* **Zero Crossfade Artifacts**: Coordinates interpolate directly through Motion (`<motion.line />`), providing fluid, mechanical shape morphs without crossfading.

---

## 2. Icon Groups & Rotation Handling

1. **Intra-Group Transitions (`arrow`, `chevron`, `plus-cross`)**:
   - Keeps vector line coordinates constant and smoothly animates the `<motion.g>` rotation angle ($0^\circ, 90^\circ, 180^\circ, -90^\circ$).
2. **Inter-Group Transitions**:
   - Snaps the group rotation instantaneously (`rotation.jump()`) while interpolating vector line endpoints to their destination coordinates.

---

## 3. Engineering Constraints

1. Keep stroke width consistent (`1.5px` default).
2. All lines must use `strokeLinecap="round"` and `strokeLinejoin="round"` to prevent jarring endpoint artifacts during mid-morph interpolation.
3. Automatically honor `useReducedMotion()`, collapsing duration to `0ms` when requested.
