# A Living Manual for Mastering Animate Presence: Presence State, Manual Exits, Nested Hierarchies, and Modes

Authoritative engineering and design specification for exit animations, presence lifecycle states, manual unmounting callbacks, and layout reflow modes using Motion's `AnimatePresence` across the SNP-SMS platform.

---

## 1. The Core DOM Departure Problem

When an element leaves the DOM in React, it unmounts immediately. As a result, CSS transitions cannot animate departing elements because an element that no longer exists in the DOM cannot render visual frames.

Motion's `AnimatePresence` resolves this by keeping departing components mounted until their exit animations finish:
* **Declarative Exit States**: Defining `initial`, `animate`, and `exit` props on direct children.
* **Beyond Basic Exits**: Production enterprise interfaces require components to query their departure status, delay removal for asynchronous persistence, coordinate parent-child dismissals, and prevent layout jumps during transitions.

---

## 2. Advanced Presence Lifecycles & Hooks

### 2.1 Reading Presence State (`useIsPresent`)
Components often need to know when they are actively departing (e.g. Disabling buttons, morphing text labels to "Closing...", halting network polling, or triggering exit haptics):

```tsx
import { AnimatePresence, motion, useIsPresent } from "motion/react";

function DismissableCard({ onDismiss }: { onDismiss: () => void }) {
  // Returns true during normal mounting; false during the exit transition
  const isPresent = useIsPresent();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
      className="rounded-xl border border-slate-200 bg-white p-4"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {isPresent ? "Card Active" : "Cleaning up & Exiting..."}
        </span>
        <button
          type="button"
          disabled={!isPresent} // Prevent double-clicks during unmount
          onClick={onDismiss}
          className="text-xs text-rose-600"
        >
          Dismiss
        </button>
      </div>
    </motion.div>
  );
}
```

* **Scope Constraint**: `useIsPresent` **must be invoked within a component that is a child of `AnimatePresence`**. It cannot be placed inline in the parent component containing the conditional boolean.

---

### 2.2 Manual Exit Control (`usePresence` & `safeToRemove`)
Standard exit animations run on a pre-baked timer. When an unmount requires asynchronous operations—saving draft data to localStorage, waiting on an HTTP mutation, or delegating to external engines (Web Audio synthesis or canvas teardown)—use `usePresence`:

```tsx
import { motion, usePresence } from "motion/react";
import { useEffect } from "react";

function AsyncModalDialog({ onSaveDraft }: { onSaveDraft: () => Promise<void> }) {
  const [isPresent, safeToRemove] = usePresence();

  useEffect(() => {
    if (!isPresent) {
      // Unmount has been initiated by parent state change
      let isMounted = true;

      void onSaveDraft().finally(() => {
        if (isMounted) {
          // Signals to Motion that async teardown is complete; unmount now proceeds
          safeToRemove();
        }
      });

      return () => {
        isMounted = false;
      };
    }
  }, [isPresent, safeToRemove, onSaveDraft]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <p className="text-sm text-slate-700">
          {isPresent ? "Editing Record" : "Persisting changes before unmount..."}
        </p>
      </div>
    </motion.div>
  );
}
```

* **Coordination**: The visual exit animation starts immediately in parallel with your async promise. The DOM node unmounts only when **both** the animation finishes and `safeToRemove()` has been executed.

---

### 2.3 Nested Exits & Hierarchy Propagation (`propagate`)
By default, when a parent `<AnimatePresence>` unmounts, child exit animations are discarded; the parent container abruptly truncates the nested tree.
* **The `propagate` Prop**:
  ```tsx
  <AnimatePresence>
    {showParent && (
      <motion.div key="parent-modal" exit={{ opacity: 0 }}>
        {/* Child AnimatePresence with propagate enabled */}
        <AnimatePresence propagate>
          {items.map((item) => (
            <motion.div key={item.id} exit={{ opacity: 0, filter: "blur(8px)" }}>
              {item.title}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    )}
  </AnimatePresence>
  ```
* When `propagate={true}`, unmounting the parent triggers coordinated exit animations on both the container and all nested list items simultaneously.

---

## 3. Transition Modes: `sync` vs. `wait` vs. `popLayout`

The `mode` prop on `<AnimatePresence>` governs temporal and layout orchestration between entering and exiting elements:

| Mode | Visual Behavior | Primary Use Case | Critical Architectural Consideration |
| :--- | :--- | :--- | :--- |
| **`sync` (Default)** | Entering and exiting components animate at the exact same moment. | Crossfades between identically sized overlays; image carousel cross-dissolves. | Both elements occupy DOM space simultaneously; requires absolute or grid overlay positioning to avoid vertical layout jumping. |
| **`wait`** | The entering element waits until the exiting element completes its exit animation. | Modal step wizards; full page transitions; tab switches of equal weight. | Total transition duration roughly doubles ($\text{Exit Duration} + \text{Enter Duration}$). Keep durations brief ($\le 180\text{ms}$). |
| **`popLayout`** | Exiting elements are immediately converted to `position: absolute`, freeing surrounding flow. | List item deletion, tag filtering, reordering, and animated container width updates. | Surrounding siblings reflow smoothly into place using `layout` animations without waiting for the departing element to complete its exit fade. |

---

## 4. Engineering Quality Gates

1. **Mandatory Unique Keys**: Every direct child of `<AnimatePresence>` MUST possess a unique, persistent `key` string. Keys based on array index trigger re-render artifacts.
2. **`mode="popLayout"` for Dynamic Lists**: Always apply `mode="popLayout"` when filtering or deleting cards in a grid so remaining items glide into position immediately.
3. **Sub-300ms Rule**: Exits should almost always animate faster than entrances ($\text{Exit Duration} \approx 0.75 \times \text{Entrance Duration}$) to respect user momentum.
