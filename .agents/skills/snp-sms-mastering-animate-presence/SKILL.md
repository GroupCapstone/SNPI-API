---
name: snp-sms-mastering-animate-presence
description: >-
  A Living Manual for Mastering Animate Presence: Presence State, Manual Exits, Nested Hierarchies, and Modes.
  Authoritative specification for Motion's AnimatePresence, useIsPresent state tracking,
  usePresence safeToRemove async teardowns, propagate nested exits, and sync/wait/popLayout modes in SNP-SMS.
---

# Mastering Animate Presence: Lifecycles, Manual Exits, and Reflow Modes

This skill governs element unmounting transitions, presence hooks, asynchronous exit teardowns, and layout modes across all dynamic views, dialogs, lists, and drawers in the SNP-SMS platform.

---

## 1. Core Presence Lifecycle Hooks

1. **`useIsPresent()`**:
   - Returns boolean presence state.
   - Used to disable user interactions, switch labels, or stop data listeners during departure.
   - Must be called from a component that is a child of `<AnimatePresence>`.
2. **`usePresence()` & `safeToRemove()`**:
   - Grants manual control over unmounting.
   - Component remains in DOM until `safeToRemove()` is explicitly executed, enabling asynchronous cache synchronization, draft saves, or external animation coordination.

---

## 2. Transition Modes Matrix

* **`mode="sync"`**: Entering and exiting elements animate concurrently. Requires absolute overlay positioning to prevent layout jump.
* **`mode="wait"`**: Entering element waits until exiting element finishes unmounting. Ideal for multi-step wizards.
* **`mode="popLayout"`**: Exiting element pops out of document flow via `position: absolute`, allowing adjacent siblings to reflow smoothly via `layout` transitions.

---

## 3. Nested Exit Propagation

* Set `propagate={true}` on child `<AnimatePresence>` instances to ensure nested elements animate their exit states when their parent container is unmounted.
