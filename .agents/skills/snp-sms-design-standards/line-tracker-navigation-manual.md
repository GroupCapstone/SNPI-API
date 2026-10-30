# Precision Line Tracker Navigation & Zero-Scrollbar Manual

Authoritative architectural specification for continuous vertical line-tracker navigation, dotless active indicators, and zero-scrollbar UI chrome in the SNP-SMS Design System.

---

## 1. Core Principles

Traditional Table of Contents (TOC) rails and sidebar navigation patterns frequently suffer from:
1. **Visual Noise from Circular Dots**: Bullet nodes, radio dots, and circular anchors create visual clutter that distracts from typography and hierarchical scanning.
2. **Ugly Browser Scrollbars**: Default browser gray scrollbar thumbs degrade modern dark and light interfaces with unstyled, high-contrast rectangles.
3. **Complex Trapezoid Suspensions**: Inverted trapezoids, hanging tabs, and angled SVG ceilings add DOM weight and awkward responsive breakpoints.

The **Precision Line Tracker Standard** replaces these with a clean, continuous vertical rail, an uninterrupted linear indicator, and completely invisible scroll chrome.

---

## 2. Precision Vertical Line Tracker Architecture

### 2.1 The Continuous Vertical Track
- **Track Geometry**: A continuous 2px solid left keyline running down the entire height of the navigation category group:
  ```html
  <div class="relative space-y-0.5 border-l-2 border-slate-200/90 pl-3 dark:border-slate-800">
    <!-- Navigation Item Buttons -->
  </div>
  ```
- **Zero Dots Invariant**: No circular dots, hollow discs, or status badges are rendered along the rail track. The track is a continuous, unbroken mathematical line.

### 2.2 The Active Indicator Segment
- When a navigation link is active, an absolute-positioned vertical indicator segment snaps directly onto the track line:
  ```html
  <span
    aria-hidden="true"
    className="absolute top-0 bottom-0 -left-[2px] w-[2.5px] rounded-full bg-[#0056FF] shadow-[0_0_8px_rgba(0,86,255,0.5)]"
  />
  ```
- **Active Row Styling**:
  - Background: subtle translucent accent wash (`bg-[#0056FF]/[0.07]`).
  - Typography: bold accent tone (`font-bold text-[#0056FF]`).
  - Alignment: negative left margin (`-ml-[2px]`) to overlap the active segment seamlessly onto the track.
- **Inactive Row Styling**:
  - Typography: neutral slate tone (`text-slate-600 dark:text-slate-400`).
  - Micro-Interaction: subtle 2px rightward translation on hover (`hover:translate-x-0.5 hover:bg-slate-50 hover:text-slate-950`).

---

## 3. Zero-Scrollbar Standard

All scrollable sidebars, code terminal boxes, and horizontal category pills must remain fully scrollable via mouse wheel, trackpad, and touch swipe, while completely hiding the browser's default scrollbar chrome:

```css
/* Utility Classes Applied */
.no-scrollbar {
  -ms-overflow-style: none; /* Internet Explorer 10+ */
  scrollbar-width: none; /* Firefox */
}
.no-scrollbar::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}
```

In Tailwind CSS:
```html
<aside className="no-scrollbar max-h-[calc(100vh-5.5rem)] [scrollbar-width:none] overflow-y-auto pr-2 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
  <!-- Navigation Content -->
</aside>
```

---

## 4. Single Feed & Header Hierarchy

1. **Header Purity**:
   - Navigation ceiling elements must use standard flat container cards with 1px border keylines.
   - Angled SVG trapezoids, hanging suspended tabs, and complex ceiling geometry are deprecated in favor of clean horizontal segmented pills and linear docks.
2. **Single Continuous Feed**:
   - Component catalogs and documentation pages must stack content in a single continuous vertical scroll feed (`space-y-14`).
   - Sticky left sidebar navigation remains permanently pinned alongside the feed with instant scroll synchronization (`scroll-mt-24`).
