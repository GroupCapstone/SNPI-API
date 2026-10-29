---
name: snp-sms-ui-components-guide
description: >-
  Authoritative architectural reference and design specification for the 10
  core UI components: Snackbar, Bottom Sheet, Dialog, Bottom Nav, Toggle Switch,
  Chips, FAB, Card, Dropdown, and Tooltip. Covers purpose, etymology, real-world
  paradigms, and Dark UI flat styling standards.
---

# SNP-SMS 10 Core UI Components Guide

This specification defines the 10 foundational UI components, their mental models, etymological origins, real-world paradigms, and Dark UI flat-style implementation standards across the SNP-SMS platform.

---

## 1. Snackbar

### Definition & Purpose
A lightweight, transient feedback message that pops up at the bottom of the viewport to confirm an asynchronous user action and optionally provide an immediate recovery action (e.g. Undo), before fading out automatically.

* **Why the name?**: A quick bite of information—small, light, consumed in seconds, and gone. Its older desktop counterpart, the "toast", pops up from the toaster; the snackbar serves a quick snack of status.
* **Seen in**: *Gmail* — Archiving an email displays a bottom snackbar: `"Message archived"` with an `"Undo"` action, self-dismissing after 4 to 6 seconds.
* **Dark UI Specification**:
  * **Surface**: Level 2 Elevated (`#202024` or `#27272A`), flat fill with 1px `border-white/10`. Zero drop shadows.
  * **Typography**: Font size 14px (`leading-relaxed`), text `#F4F4F5`. Action link in `emerald-400` (`#34D399`).
  * **Radius**: 12px outer radius.
  * **ARIA Role**: `role="status"` or `role="alert"`, `aria-live="polite"`.

---

## 2. Bottom Sheet

### Definition & Purpose
A contextual modal or non-modal surface anchored to the bottom viewport edge that slides upward to expose supplementary actions, filters, or extended details without navigating the user away from their current screen.

* **Why the name?**: Like pulling a bedsheet upward: it slides from the bottom edge and covers a portion of the screen canvas.
* **Seen in**: *Google Maps* — Tapping a location slides up a half-sheet with quick actions (Directions, Save, Share). Dragging upward expands it to full screen.
* **Dark UI Specification**:
  * **Surface**: Level 2 Elevated (`#202024`), flat top-border `1px solid rgba(255,255,255,0.08)`. Zero shadows.
  * **Top Handle**: 36 × 4px pill in `zinc-600` (`#52525B`) centered 8px from top.
  * **Radius**: Top corners `rounded-t-2xl` (16px), bottom corners 0px.
  * **Touch Target**: Swipe and drag gesture zone $\ge 44\text{px}$ height.

---

## 3. Dialog

### Definition & Purpose
A blocking, modal window that interrupts the user workflow to require explicit confirmation, input, or acknowledgement before continuing, reserved for high-friction or irreversible actions (e.g. deletion, irreversible status changes).

* **Why the name?**: Originates from the Greek *dialogos* (conversation): the software stops all background interaction to hold a direct conversation with the user.
* **Seen in**: *WhatsApp* — Deleting a chat opens a centered dialog: `"Delete message? Cancel / Delete"` preventing accidental data destruction.
* **Dark UI Specification**:
  * **Surface**: Level 2 Elevated (`#202024`), 1px `border-white/10`, flat backdrop overlay (`bg-black/60`).
  * **Backdrop**: Backdrop blur `backdrop-blur-sm`, zero box shadows.
  * **Radius**: 16px outer radius; inner action buttons 8px radius ($\text{Inner} = \text{Outer} - \text{Padding}$).
  * **Actions**: Primary destructive button in desaturated `rose-500` / `rose-400`, cancel in transparent `zinc-800`.
  * **ARIA Role**: `role="dialog"`, `aria-modal="true"`, focus trapped within dialog.

---

## 4. Bottom Nav

### Definition & Purpose
A persistent horizontal navigation bar positioned along the bottom viewport edge designed for instant thumb switching between 3 to 5 top-level destination views of an application.

* **Why the name?**: Navigation placed directly at the bottom of the device, precisely where the ergonomic thumb zone naturally rests on mobile hardware.
* **Seen in**: *Spotify* — Bottom bar housing `"Home"`, `"Search"`, and `"Your Library"` accessible in a single tap from anywhere.
* **Dark UI Specification**:
  * **Surface**: Level 1 Subsurface (`#161619`), 1px `border-t border-white/5`.
  * **Height**: 64px with safe-area inset padding (`pb-safe`).
  * **Touch Targets**: Minimum 44 × 44px for each tab item.
  * **Active State**: Active icon/label in `emerald-400` or `zinc-100` (`font-medium`); inactive items in `zinc-400`.
  * **ARIA Role**: `<nav aria-label="Bottom Navigation">`.

---

## 5. Toggle Switch

### Definition & Purpose
A two-state digital control that immediately applies a binary setting (On / Off or Enabled / Disabled) without requiring a separate "Save" or "Apply" step.

* **Why the name?**: "To toggle" means to alternate between two physical states, mimicking a physical wall toggle light switch.
* **Seen in**: *iPhone Settings* — Toggling Airplane Mode or Wi-Fi instantly flips system radio state without a confirmation step.
* **Dark UI Specification**:
  * **Track**: 48 × 28px pill; inactive `#27272A` (`zinc-800`), active `emerald-500` (`#10B981`) or `sky-500`.
  * **Thumb**: 22 × 22px circle in `#F4F4F5`, translating horizontally with 150ms cubic ease.
  * **Touch Target**: Hit-slop area $\ge 44 \times 44\text{px}$.
  * **ARIA Role**: `role="switch"`, `aria-checked="true|false"`.

---

## 6. Chips

### Definition & Purpose
Compact, interactive pill elements that represent discrete attributes, filters, selections, or input tokens, allowing users to quickly filter content feeds or trigger lightweight tags.

* **Why the name?**: Compact, rounded, tactile tokens reminiscent of casino poker chips arranged across a felt table.
* **Seen in**: *YouTube* — Filter chips along the top feed (`"All"`, `"Music"`, `"Gaming"`, `"Podcasts"`) that dynamically scope video content.
* **Dark UI Specification**:
  * **Surface**: Inactive `#202024` with 1px `border-white/5`, text `zinc-300`; active `#2E2E33` with 1px `border-zinc-500`, text `zinc-100`.
  * **Height**: 32px height with min 44px click hit-slop.
  * **Radius**: Full pill (`rounded-full`, 9999px).
  * **Typography**: 13px bold/medium, single-line text with trailing optional dismissal `×` icon.

---

## 7. Floating Action Button (FAB)

### Definition & Purpose
A prominent, elevated circular action button positioned over viewport content that provides persistent one-tap access to the single primary or most frequent action on a screen.

* **Why the name?**: It floats above the document canvas like a lifebuoy on water, remaining fixed in the primary thumb reach zone during vertical scrolling.
* **Seen in**: *Google Calendar* — A persistent bottom-right circular `+` button that initiates creating a new event or reminder.
* **Dark UI Specification**:
  * **Surface**: Primary accent fill (`sky-500` or `emerald-500`), flat contrast border `1px solid rgba(255,255,255,0.15)`. Zero shadows.
  * **Dimensions**: 56 × 56px circle (exceeds 44 × 44px minimum touch target).
  * **Placement**: Fixed `bottom-6 right-6` with safe-area margins.
  * **Icon**: Optically centered 24 × 24px SVG vector glyph in high-contrast `#0E0E10` or `#FFFFFF`.

---

## 8. Card

### Definition & Purpose
A modular surface container that groups related pieces of heterogeneous information—such as a visual photo, title, metadata badge, rating, and call-to-action—into a single, scannable, and often tappable unit.

* **Why the name?**: Modeled after physical index cards or playing cards: one self-contained rectangle holding a single coherent idea or record.
* **Seen in**: *Airbnb* — Every lodging stay is presented as a card containing cover photography, location title, pricing per night, and guest rating.
* **Dark UI Specification**:
  * **Surface**: Level 1 Subsurface (`#161619`), 1px `border-white/10`. Zero drop shadows.
  * **Radius**: 16px outer radius (`rounded-2xl`).
  * **Inner Padding**: Standardized 16px (`p-4`) or 20px (`p-5`).
  * **Inner Radius Rule**: Inner image or nested block radius = `16px - 16px = 0px` (or nested container `rounded-xl`).
  * **Hover Elevation**: Lighter surface luminance transition to Level 2 (`#202024`) with 120ms ease.

---

## 9. Dropdown

### Definition & Purpose
A compact button or input trigger that toggles a floating menu list of selectable options, allowing users to choose one or multiple items without consuming permanent screen real estate.

* **Why the name?**: Activating the trigger causes the menu list to drop downward like a roller window blind, collapsing away once a choice is finalized.
* **Seen in**: *Google Docs* — Selecting font family opens a vertical menu dropping down from the toolbar to reveal typographic options.
* **Dark UI Specification**:
  * **Trigger**: Level 1 Subsurface (`#161619`), height 44px, 1px `border-white/10`.
  * **Menu Surface**: Level 2 Elevated (`#202024`), 1px `border-white/10`, 8px radius, zero box-shadows.
  * **Item Row**: 36px height, text `zinc-200`, active/hover `#2E2E33` (`zinc-700`).
  * **ARIA Role**: `role="combobox"` or `role="menu"`, `aria-expanded="true|false"`.

---

## 10. Tooltip

### Definition & Purpose
A transient, non-interactive micro-label that appears upon pointer hover or keyboard focus, providing a concise explanation, label, or keyboard shortcut for an otherwise ambiguous icon or tool.

* **Why the name?**: A literal tip about a tool: hover a tool icon and a tiny badge explains what that tool does.
* **Seen in**: *Figma* — Hovering the cursor tool reveals a compact label: `"Move (V)"` displaying the tool name and keyboard acceleration shortcut.
* **Dark UI Specification**:
  * **Surface**: Level 3 Interactive Surface (`#2E2E33` or `#3F3F46`), 1px `border-white/10`.
  * **Typography**: 12px font size, line-height 16px, text `#F4F4F5`.
  * **Padding**: 4px vertical, 8px horizontal (`px-2 py-1`).
  * **Radius**: 6px radius (`rounded-md`).
  * **Pointer Events**: `pointer-events-none` to prevent accidental click interference.
  * **ARIA Role**: `role="tooltip"`, linked via `aria-describedby`.
