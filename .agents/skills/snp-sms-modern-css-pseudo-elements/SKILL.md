---
name: snp-sms-modern-css-pseudo-elements
description: >-
  A Living Manual for Modern CSS Pseudo-Elements & Native Browser Transitions.
  Authoritative specification for ::before/::after hit-target expansion, View Transitions API
  (::view-transition-*), native dialog/popover ::backdrop, ::file-selector-button, and scroll-markers.
---

# A Living Manual for Modern CSS Pseudo-Elements & Native Browser Transitions

This skill is the authoritative standard for modern CSS pseudo-elements, browser-native styling hooks, and the View Transitions API in the SNP-SMS repository.

---

## 1. Core Native-First Philosophy

Modern CSS provides direct hooks into browser-native UI primitives, eliminating the need for heavyweight JavaScript animation runtimes and wrapper divs:
1. **Zero DOM Bloat**: Use `::before` and `::after` for decorative layers, hover halos, and hit-target expansions.
2. **GPU-Accelerated View Transitions**: Use `document.startViewTransition()` and `::view-transition-*` to morph between states natively.
3. **Native Primitive Styling**: Style `<dialog>`, popovers, and inputs via `::backdrop`, `::file-selector-button`, and `::picker(select)`.

---

## 2. Foundational Pseudo-Elements: `::before` & `::after`

* **WCAG 44×44px Hit Target Expansion**: Apply `::before` with `min-width: 44px; min-height: 44px;` centered over compact icons to expand tap targets without altering visual geometry.
* **Tactile Button Hover Halos**: Position `::before` at `inset: 0; scale(0.95); opacity: 0;` and transition to `scale(1); opacity: 1;` on hover.

---

## 3. The View Transitions API & Pseudo-Element Tree

* **Tree Hierarchy**:
  * `::view-transition`: Root overlay.
  * `::view-transition-group(<name>)`: Animates position, size, and geometry.
  * `::view-transition-image-pair(<name>)`: Isolation layer.
  * `::view-transition-old(<name>)`: Outgoing snapshot.
  * `::view-transition-new(<name>)`: Incoming live state.
* **Morphing Interaction**:
  ```css
  ::view-transition-group(card) {
    animation-duration: 260ms;
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  }
  ```

---

## 4. Modern Native UI Pseudo-Elements

* `::backdrop`: Styles the top-layer backdrop behind native `<dialog>` and `[popover]`.
* `::file-selector-button`: Styles `<input type="file">` button with Royal Blue (`#0056FF`) and Soft Lavender (`#E3E7FC`).
* `::selection`: Standardizes text highlights with `#0056FF` background and `#FFFFFF` text.
* `::placeholder`: Maintains minimum 4.5:1 text contrast for input hints.
* `::scroll-marker` & `::scroll-marker-group`: Native scroll-driven carousel and section pagination with zero JavaScript.

---

## 5. Compliance Checklist

- [ ] Use `::before` for hit-target expansion to $\ge 44 \times 44\text{px}$.
- [ ] Use native `::backdrop` for dialogs and popovers instead of custom portal overlays.
- [ ] Clean up temporary `view-transition-name` assignments after transitions complete.
- [ ] Ensure all pseudo-element styling complies with the pure-light design standards (zero black buttons).
