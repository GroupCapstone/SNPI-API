# A Living Manual for Animating Container Bounds: Smooth Width & Height Transitions with Motion and ResizeObserver

Authoritative engineering and design manual for animating dynamic container bounds, expandable panels, variable-width buttons, and accordions without layout snapping across the SNP-SMS platform.

---

## 1. The Core Layout Snapping Problem

In standard CSS and animation libraries, animating `width` or `height` between a fixed dimension and `"auto"` fails because browsers cannot mathematically interpolate between a numeric pixel value and intrinsic content dimensions.

When content arrives dynamically:
* **The Snapping Anti-Pattern**: Inner text fades or translates gracefully, but the outer container abruptly snaps to its new bounds, creating jarring layout jumps.
* **The Two-Div Measurement Solution**: By decoupling **measurement** from **animation** using an outer motion container and an inner intrinsic wrapper, containers glide smoothly to wrap dynamic content.

---

## 2. The Two-Div Architecture

```
+-----------------------------------------------------------+
| OUTER CONTAINER (<motion.div>)                            |
| - Controls animated width/height via Motion animate prop  |
| - Receives bounds from useMeasure hook                    |
| - Handles overflow and rounded border clipping            |
|                                                           |
|   +---------------------------------------------------+   |
|   | INNER WRAPPER (<div>)                             |   |
|   | - Holds the useMeasure ref                        |   |
|   | - Expands freely to intrinsic content dimensions  |   |
|   | - Never clipped or scaled directly                |   |
|   |   [ Dynamic Content: Text, Badges, Lists ]        |   |
|   +---------------------------------------------------+   |
+-----------------------------------------------------------+
```

### The Strict Separation Rule
* **The Ref goes on the Inner Wrapper.**
* **The `animate` prop goes on the Outer Motion Container.**
* **Never combine both on the same element**: Placing `ref` and `animate` on the same node creates an infinite recursive loop (animation changes geometry &rarr; triggers ResizeObserver &rarr; re-renders &rarr; triggers animation).

---

## 3. Zero-Dependency `useMeasure` Hook

A lightweight, zero-dependency hook utilizing native browser `ResizeObserver` without external packages:

```typescript
// apps/frontend/shared/hooks/use-measure.ts
import { useCallback, useEffect, useState } from 'react';

export interface ElementBounds {
  width: number;
  height: number;
}

export function useMeasure<T extends HTMLElement = HTMLDivElement>(): [
  (node: T | null) => void,
  ElementBounds
] {
  const [element, setElement] = useState<T | null>(null);
  const [bounds, setBounds] = useState<ElementBounds>({ width: 0, height: 0 });

  const ref = useCallback((node: T | null) => {
    setElement(node);
  }, []);

  useEffect(() => {
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      setBounds({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  return [ref, bounds];
}
```

---

## 4. Implementation Patterns

### 4.1 Variable-Width Dynamic Buttons
Used for buttons transitioning between state labels (e.g. "Save", "Saving...", "Saved", or dynamic notification count badges):

```tsx
import { motion, MotionConfig } from 'motion/react';
import { useMeasure } from '@/shared/hooks/use-measure';

export function DynamicWidthButton({ label }: { label: string }) {
  const [ref, bounds] = useMeasure();

  return (
    <MotionConfig
      transition={{
        duration: 0.4,
        ease: [0.19, 1, 0.22, 1],
        delay: 0.05, // Subtle delay allows container to chase content
      }}
    >
      <motion.button
        animate={{
          width: bounds.width > 0 ? bounds.width : 'auto',
        }}
        className="relative overflow-hidden rounded-full bg-[#0056FF] px-4 py-2 text-white"
      >
        <div ref={ref} className="inline-flex items-center gap-2 whitespace-nowrap">
          <span>{label}</span>
        </div>
      </motion.button>
    </MotionConfig>
  );
}
```

### 4.2 Expandable Accordions & Cards
Used for collapsible FAQs, table row details, and expandable notification previews:

```tsx
import { AnimatePresence, motion, MotionConfig } from 'motion/react';
import { useState } from 'react';
import { useMeasure } from '@/shared/hooks/use-measure';

export function ExpandableCard({ title, fullText }: { title: string; fullText: string }) {
  const [expanded, setExpanded] = useState(false);
  const [ref, bounds] = useMeasure();

  return (
    <MotionConfig transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}>
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h4 className="text-base font-semibold text-slate-900">{title}</h4>
        
        {/* Outer animated container */}
        <motion.div
          animate={{
            height: bounds.height > 0 ? bounds.height : 'auto',
          }}
          className="overflow-hidden"
        >
          {/* Inner measured wrapper */}
          <div ref={ref} className="pt-2 text-sm text-slate-600">
            <AnimatePresence mode="popLayout">
              {expanded ? (
                <motion.p
                  key="full"
                  initial={{ opacity: 0, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(6px)' }}
                >
                  {fullText}
                </motion.p>
              ) : (
                <p key="summary" className="line-clamp-2">
                  {fullText}
                </p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-3 text-xs font-semibold text-[#0056FF]"
        >
          {expanded ? 'Show Less' : 'Read More'}
        </button>
      </div>
    </MotionConfig>
  );
}
```

---

## 5. Engineering Gotchas & Quality Gates

1. **The Initial Mount Guard (`bounds > 0 ? bounds : 'auto'`)**:
   - On initial render, `bounds.width` and `bounds.height` are `0` before the `ResizeObserver` evaluates.
   - Always guard with `bounds > 0 ? bounds : 'auto'`. Omitting this produces an unwanted mount animation starting from `0px`.
2. **Subtle Lag Timing (`delay: 0.05s`)**:
   - Adding a slight $50\text{ms}$ delay creates the natural aesthetic of the container border chasing and settling around the newly rendered content.
3. **Restraint Gate**:
   - Do not wrap every element in a measurement observer. Reserve strictly for user-driven interactions: accordions, expandable summary cards, dynamic label buttons, and multi-step dialogs.
