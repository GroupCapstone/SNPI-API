# SNP-SMS Scroll Patterns & Interaction Architecture

This manual provides the definitive architectural framework and engineering standards for the 9 core scroll patterns used across web interfaces in the SNP-SMS platform.

---

## The 9 Core Interface Scroll Patterns

```
+--------------------------------------------------------------------------+
| 01. Sticky Positioning   | Headers pin, then hand off sequentially.      |
| 02. Scroll Snap          | Viewport locks cleanly into designated panels.|
| 03. Scroll Triggered     | Micro-interactions fade in on viewport entry. |
| 04. Infinite Scroll      | Paginated batches load near threshold edge.   |
| 05. Scroll Driven        | Progress bars and transformations follow axis.|
| 06. Zoom on Scroll       | Scale increases proportionally during pass.   |
| 07. Parallax             | Multi-layer depth with differentiated speeds. |
| 08. Horizontal Scroll    | Vertical wheel translates to sideways track.  |
| 09. Scrollytelling       | Graphic stage pins while step panels advance. |
+--------------------------------------------------------------------------+
```

---

## 1. Sticky Positioning (Pin & Sequential Hand-Off)
* **Behavior**: Elements remain in document flow until reaching an offset threshold, then freeze in the viewport until pushed out by a sibling section.
* **SNP-SMS Standard**:
  - Sticky Headers: `sticky top-0 z-50 backdrop-blur-xl`.
  - Sticky Sidebars: `lg:sticky lg:top-20 lg:z-30 lg:self-start max-h-[calc(100vh-5.5rem)] overflow-y-auto`.
  - Section Headers: `scroll-mt-24` to account for the 64px sticky navbar and leave 32px breathing clearance.

---

## 2. Scroll Snap (Panel Viewport Locking)
* **Behavior**: The scroll container smoothly snaps to defined alignment coordinates (`start`, `center`, `end`) when scrolling decelerates.
* **CSS Implementation**:
  ```css
  .snap-container {
    scroll-snap-type: y mandatory;
    overflow-y: scroll;
  }
  .snap-section {
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }
  ```
* **Use Case**: Multi-stage onboarding carousels, full-bleed data cards, and metric presentation dashboards.

---

## 3. Scroll Triggered (Entrance Transitions)
* **Behavior**: Elements enter the viewport in a collapsed or faded state, and animate to full opacity and scale when entering a 15% intersection boundary.
* **Engine**: Browser-native `IntersectionObserver` with a fallback threshold of `0.15`.
* **Standard**: Maximum animation duration `< 300ms` with spring or ease-out curve. Never delay user reading flow.

---

## 4. Infinite Scroll (Proactive Threshold Loading)
* **Behavior**: New paginated data chunks are requested automatically when the user scrolls within `300px` of the feed footer.
* **Architecture**: Virtualized lists (`TanStack Virtual` or `react-window`) to avoid DOM bloat, keeping memory footprint constant.

---

## 5. Scroll-Driven Progress & Animations
* **Behavior**: Animation timeline is mapped directly to the vertical scroll percentage (`scrollY / (scrollHeight - innerHeight)`).
* **Modern CSS Implementation**:
  ```css
  @keyframes progressGrow {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
  }
  .scroll-progress-bar {
    animation: progressGrow auto linear;
    animation-timeline: scroll();
    transform-origin: left;
  }
  ```

---

## 6. Zoom on Scroll (Focal Hero Scaling)
* **Behavior**: Focal graphic or image scales subtly (from `scale(1.0)` to `scale(1.08)`) as the user scrolls past, conveying physical presence and depth.

---

## 7. Parallax Depth (Differentiated Layer Velocities)
* **Behavior**: Background surfaces move at `0.2x` scroll velocity, midground data cards move at `1.0x`, and foreground sticky HUD controls remain at `0.0x`.
* **Accessibility Rule**: Strictly respect `prefers-reduced-motion` media queries by collapsing parallax translations to standard static positioning.

---

## 8. Horizontal Scroll Tracks
* **Behavior**: Vertical mouse wheel or trackpad movement translates smoothly into horizontal sliding across multi-column data galleries or timeline boards.
* **Implementation**: Sticky container wrapping an inner flex row with `overflow-x-auto` or programmatic transform interpolation.

---

## 9. Scrollytelling (Pinned Stage & Sequential Steps)
* **Behavior**: A visual demo canvas or architectural diagram stays pinned in place while textual explanation blocks scroll past, dynamically driving state changes in the pinned scene.
