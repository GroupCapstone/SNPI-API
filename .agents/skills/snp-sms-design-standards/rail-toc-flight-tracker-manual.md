# Rail TOC & Flight Rail Tracker Navigation Manual

This specification establishes the authoritative engineering and design standard for the **Rail TOC (Table of Contents)** navigation pattern across the SNP-SMS platform and developer documentation.

---

## 1. Architectural Concept & Interaction Design

The **Rail TOC** represents a kinetic navigation tracker featuring an origami paper plane that navigates along a multi-level vector rail between document sections as the user scrolls.

### Kinetic Flight Behavior
- **Continuous Rail Navigation**: The paper plane glides along an SVG path connecting all document headings.
- **Directional Orientation**: The plane rotates dynamically in the direction of flight. When scrolling down, it angles forward; when scrolling up, it turns around 180 degrees.
- **Solid vs. Dashed Rail State**:
  - The rail traversed *above* or *behind* the current flight position renders as a continuous solid stroke (`stroke-solid`, 1.5px).
  - Passed heading node indicators fill in solid with accent fill (`#0056FF` or theme cyan).
  - The rail *ahead* of the flight position remains dashed (`stroke-dasharray="3 4"`).
- **Depth Indentation (Hierarchy)**: Sub-headings (`depth > 0`) step horizontally by a calibrated `indent` offset (default: 12px per level) with smooth Bézier curve bends connecting depth changes.
- **Click-to-Scroll Anchor Interception**: Clicking any heading smoothly animates the viewport to the target element with calibrated top offset.

---

## 2. Component API & Props Specification

```typescript
export interface RailTocItem {
  id: string;
  label: string;
  depth?: number;
}

export interface RailTocProps {
  /** Headings in document order. Each id must match an element id in the content. */
  items: RailTocItem[];
  /** Scroll container to track and scroll within. Defaults to window when omitted. */
  containerRef?: React.RefObject<HTMLElement | null>;
  /** Distance in pixels below scroller top edge where heading counts as reached. Default: 80px. */
  offset?: number;
  /** Horizontal step in pixels for each depth level. Default: 12px. */
  indent?: number;
  /** Text above the list; also labels the navigation for screen readers. */
  title?: string;
  /** Extra CSS classes merged onto the root nav element. */
  className?: string;
}
```

### Data Slot Selectors
Inner structural elements must expose `data-slot` attributes for CSS customization:
- `data-slot="rail-toc-title"`: Title typography container.
- `data-slot="rail-toc-list"`: Navigation list wrapper.
- `data-slot="rail-toc-rail"`: SVG track containing solid and dashed path segments.
- `data-slot="rail-toc-plane"`: Animated paper plane vector container.
- `data-slot="rail-toc-item"`: Interactive section heading anchor.

---

## 3. Mathematical Coordinate Calculation

Given items with vertical spacing \(H = 32\text{px}\) and indent \(w_d = \text{depth} \times \text{indent}\):
- Each node center: \(P_i = (x_i, y_i) = (w_d + \text{railOffset}, i \times H + H/2)\).
- Path connections use cubic Bézier curves:
  \[
  C(P_{i-1}, P_i) = \text{M } x_{i-1} \, y_{i-1} \text{ C } x_{i-1} \, \frac{y_{i-1}+y_i}{2}, \, x_i \, \frac{y_{i-1}+y_i}{2}, \, x_i \, y_i
  \]
- Paper plane orientation angle \(\theta\):
  \[
  \theta = \text{atan2}(\Delta y, \Delta x) \times \frac{180}{\pi}
  \]
  Adjusted by +180 degrees during reverse (scroll-up) velocity.

---

## 4. Standard Button Architecture Rule (Mandatory)

All buttons, CTAs, and interactive form triggers across the documentation and platform adhere to the subtle mathematical border radius standard:

| Element Type | Border Width | All Corners Radius | Logic |
| :--- | :--- | :--- | :--- |
| **Standard Button** | `0px` (`border-0` / none) | `4px` (`rounded-[4px]`) | Consistent subtle rounding, flat luminance depth, zero shadow. |
| **Form Inputs** | `1px` (`border`) | `4px` (`rounded-[4px]`) | Clean structural framing. |
| **Pills / Badges** | `1px` (`border`) | `9999px` (`rounded-full`) | Status indicators and tags only. |

---

## 5. Accessibility & Performance Guard

1. **Roving Tabindex & Keyboard Navigation**: ArrowUp / ArrowDown cycles through TOC headings with Enter triggering smooth scroll.
2. **Reduced Motion Graceful Degradation**: When `prefers-reduced-motion` is active, the paper plane transitions instantaneously without continuous flight rotation.
3. **IntersectionObserver Performance**: Uses `IntersectionObserver` with calibrated thresholds to calculate active heading index without layout thrashing.
