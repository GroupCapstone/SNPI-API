# A Living Manual for Modern CSS Pseudo-Elements & Native Browser Transitions

This manual is the authoritative standard for leveraging modern CSS pseudo-elements, browser-native styling hooks, and the View Transitions API across the SNP-SMS design system. By utilizing browser-native capabilities, we eliminate redundant DOM wrappers, reduce JavaScript runtime overhead, and achieve hardware-accelerated 60fps animations directly in CSS.

---

## Executive Summary: Zero-Dependency Native Architecture

Modern CSS eliminates the need for heavyweight animation and modal libraries:
1. **Zero DOM Bloat**: Pseudo-elements keep HTML semantics pure while enabling rich layering, hover halos, and hit-target expansion.
2. **GPU-Accelerated View Transitions**: Native `::view-transition-*` pseudo-elements handle complex geometric morphing and layout interpolation without manual coordinate tracking.
3. **Native Element Styling**: Native `<dialog>`, popovers, and form pickers can be styled directly via `::backdrop`, `::file-selector-button`, and `::picker(select)`.

---

## 1. Foundational Pseudo-Elements: `::before` & `::after`

These create anonymous inline-block/block elements as the first or last child of a parent element. They require `content: ""` to render.

### 1.1 Expanding Hit Targets to Meet WCAG 44×44px Standard
When styling compact icons, chips, or links that visually measure under 44px (e.g. a 24px icon button), use `::before` to expand the clickable boundary without altering layout geometry:

```css
.touch-target-expanded {
  position: relative;
}

.touch-target-expanded::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 44px;
  min-height: 44px;
  transform: translate(-50%, -50%);
  pointer-events: auto;
}
```

### 1.2 Zero-Markup Tactile Button Hover Halo
Inject subtle scale and elevation halos behind interactive elements without extra DOM elements:

```css
.btn-tactile {
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.btn-tactile::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background-color: rgba(0, 86, 255, 0.08); /* Royal Blue tint */
  transform: scale(0.95);
  opacity: 0;
  transition: transform 180ms cubic-bezier(0.16, 1, 0.3, 1),
              opacity 180ms cubic-bezier(0.16, 1, 0.3, 1);
  z-index: -1;
}

.btn-tactile:hover::before {
  transform: scale(1);
  opacity: 1;
}
```

---

## 2. The View Transitions API & Pseudo-Element Tree

The View Transitions API (`document.startViewTransition()`) captures DOM state before and after a mutation, generates an isolated pseudo-element tree on the root, and interpolates between the two states.

### 2.1 The Generated Pseudo-Element Tree Hierarchy
```
::view-transition
 └─ ::view-transition-group(root)
     └─ ::view-transition-image-pair(root)
         ├─ ::view-transition-old(root)   /* Screenshot of outgoing state */
         └─ ::view-transition-new(root)   /* Live representation of incoming state */
```

When custom elements specify `view-transition-name: <custom-ident>`, the browser creates dedicated sibling branches:
```
::view-transition
 ├─ ::view-transition-group(root)
 └─ ::view-transition-group(card-morph)
     └─ ::view-transition-image-pair(card-morph)
         ├─ ::view-transition-old(card-morph)
         └─ ::view-transition-new(card-morph)
```

### 2.2 Canonical Implementation: Thumbnail-to-Modal Card Morph

```tsx
// 1. Triggering in React 19 / Modern JavaScript
function openModal(thumbnailElement: HTMLElement) {
  // Assign transition name to departing element
  thumbnailElement.style.viewTransitionName = 'card-morph';

  if (!document.startViewTransition) {
    setModalOpen(true);
    return;
  }

  const transition = document.startViewTransition(() => {
    // In React 19: flushSync or state update
    ReactDOM.flushSync(() => {
      setModalOpen(true);
    });
  });

  transition.finished.finally(() => {
    // Clean up temporary names after transition settles
    thumbnailElement.style.viewTransitionName = 'none';
  });
}
```

```css
/* 2. Styling the View Transition Group */
::view-transition-group(card-morph) {
  animation-duration: 260ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1); /* Snappy ease-out */
}

/* Control crossfade timing between old and new snapshots */
::view-transition-old(card-morph) {
  animation: 100ms cubic-bezier(0.7, 0, 0.84, 0) both fade-out;
}

::view-transition-new(card-morph) {
  animation: 260ms cubic-bezier(0.16, 1, 0.3, 1) both scale-in;
}

@keyframes fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes scale-in {
  from {
    transform: scale(0.96);
    opacity: 0.8;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
```

---

## 3. Modern Native UI Pseudo-Elements

### 3.1 `::backdrop` (Native `<dialog>` & Popover API)
Replaces custom full-screen background overlay elements. Targets the native backdrop layer generated behind top-layer elements:

```css
dialog::backdrop,
[popover]::backdrop {
  background-color: rgba(14, 14, 16, 0.45);
  backdrop-filter: blur(4px);
  opacity: 0;
  transition: opacity 200ms cubic-bezier(0.16, 1, 0.3, 1),
              display 200ms allow-discrete,
              overlay 200ms allow-discrete;
}

dialog[open]::backdrop,
[popover]:popover-open::backdrop {
  opacity: 1;
}

@starting-style {
  dialog[open]::backdrop,
  [popover]:popover-open::backdrop {
    opacity: 0;
  }
}
```

### 3.2 `::file-selector-button` (Native File Inputs)
Directly styles the button inside `<input type="file">` to match institutional Royal Blue tokens:

```css
input[type="file"]::file-selector-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 0 16px;
  border-radius: 9999px;
  border: 1px solid #CAD3F5;
  background-color: #E3E7FC;
  color: #0056FF;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 150ms cubic-bezier(0.16, 1, 0.3, 1);
}

input[type="file"]::file-selector-button:hover {
  background-color: #0056FF;
  color: #FFFFFF;
  border-color: #0056FF;
}
```

### 3.3 `::selection` (Brand-Compliant Selection)
Standardizes text highlights across the institutional portal:

```css
::selection {
  background-color: #0056FF;
  color: #FFFFFF;
}
```

### 3.4 `::placeholder` (Accessible Form Hints)
Enforces minimum 4.5:1 text contrast on inputs while maintaining readable placeholder text:

```css
input::placeholder,
textarea::placeholder {
  color: #94A3B8;
  font-weight: 400;
  opacity: 1;
}
```

### 3.5 Emerging Native Navigation: `::scroll-marker` & `::scroll-marker-group`
Enables carousel indicators and section pagers with zero JavaScript scroll-listeners:

```css
/* Container creates scroll-marker-group */
.carousel-track {
  scroll-marker-group: after;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}

.carousel-slide::scroll-marker {
  content: "";
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background-color: #CBD5E1;
  transition: background-color 150ms ease;
}

.carousel-slide::scroll-marker:checked {
  width: 20px;
  background-color: #0056FF;
}
```

---

## 4. Enforcement Checklist for Developers

- [ ] **No Unnecessary Wrapper Divs**: Use `::before` / `::after` for purely decorative halos, keylines, and badges.
- [ ] **Native Backdrops**: Use `dialog::backdrop` rather than custom portal overlays.
- [ ] **View Transitions Naming**: Clear `view-transition-name` after transition resolution to prevent stale snapshots.
- [ ] **Touch Target Integrity**: Verify `::before` expands compact action hit targets to $\ge 44 \times 44\text{px}$.
- [ ] **Light Theme Discipline**: Never inject dark `#000000` or `#000B26` backgrounds inside pseudo-elements on light surfaces.
