# I. 10 UI Components, Explained

This document is the authoritative component-level design specification for the 10 core UI components across the SNP-SMS platform, documenting their mental models, etymological origins, real-world paradigms, and Dark UI implementation standards.

---

## 1. Snackbar

### Definition & Purpose
A small message that pops up at the bottom of the screen to confirm what you just did, then fades away automatically.

* **Why the name?**: A quick bite of info: small, light, gone in seconds. Its older cousin, the toast, pops up like toast.
* **Seen in**: *Gmail* — Archive an email and a bar appears with "Undo", gone after a few seconds.
* **Dark UI Standards**:
  * **Surface**: Level 2 Elevated (`#202024` or `#27272A`), flat fill with 1px `border-white/10`. Zero drop shadows.
  * **Typography**: Font size 14px (`leading-relaxed`), text `#F4F4F5` (`zinc-100`). Action label in `emerald-400` (`#34D399`).
  * **Position**: Fixed bottom-6, centered horizontally or aligned right on desktop.
  * **Touch Target**: Dismiss and Action buttons maintain $\ge 44 \times 44\text{px}$ hit areas.
  * **ARIA Role**: `role="status"`, `aria-live="polite"`.
  * **Timeout**: 4,000ms to 6,000ms auto-dismiss.

---

## 2. Bottom Sheet

### Definition & Purpose
A panel that slides up from the bottom of the screen to show more options without leaving the current screen.

* **Why the name?**: Like pulling a bedsheet up: it slides up from the bottom edge and covers part of the screen.
* **Seen in**: *Google Maps* — Tap a place and its details slide up. Drag the sheet up to see more.
* **Dark UI Standards**:
  * **Surface**: Level 2 Elevated (`#202024`), flat top border with `1px border-white/10`. Zero shadows.
  * **Top Grab Handle**: 36 × 4px pill in `zinc-600` (`#52525B`) centered horizontally.
  * **Radius**: Top corners `rounded-t-2xl` (16px), bottom corners 0px.
  * **Backdrop**: Translucent flat overlay `bg-black/60` with `backdrop-blur-xs`.
  * **Touch Target**: Drag and swipe handle area $\ge 44\text{px}$ height.
  * **Keyboard Support**: Closes on `Escape` key press.

---

## 3. Dialog

### Definition & Purpose
A box that interrupts you to confirm something important or risky before anything proceeds.

* **Why the name?**: From the Greek *dialogos* (conversation): the app pauses everything to have a quick word with you before anything disappears.
* **Seen in**: *WhatsApp* — "Delete message?" asks you to confirm before anything disappears permanently.
* **Dark UI Standards**:
  * **Surface**: Level 2 Elevated (`#202024`), 1px `border-white/10`, flat backdrop `bg-black/60`.
  * **Elevation**: Pure luminance contrast. Strictly zero box shadows.
  * **Radius**: 16px outer radius; inner action buttons 8px radius ($\text{Inner} = \text{Outer} - \text{Padding}$).
  * **Action Hierarchy**: Destructive action in desaturated `rose-500` / `rose-400`, cancel in transparent `zinc-800`.
  * **ARIA Role**: `role="dialog"`, `aria-modal="true"`. Focus is trapped inside the dialog until dismissed.

---

## 4. Bottom Nav

### Definition & Purpose
A bar at the bottom for jumping between the 3 to 5 main areas of an application.

* **Why the name?**: Navigation placed at the bottom, right where your thumb already rests on a mobile device.
* **Seen in**: *Spotify* — "Home", "Search", and "Your Library" are always one tap away at the bottom.
* **Dark UI Standards**:
  * **Surface**: Level 1 Subsurface (`#161619`), 1px `border-t border-white/10`.
  * **Height**: 64px fixed height with safe-area bottom inset (`pb-safe`).
  * **Target Count**: Exactly 3 to 5 top-level destination tabs.
  * **Touch Targets**: Minimum 44 × 44px for each tab button.
  * **Active State**: Active icon and text in `emerald-400` or `zinc-100` (`font-medium`); inactive items in `zinc-400`.
  * **Badge Support**: Optional numeric badge counter in `rose-500` for notifications.

---

## 5. Toggle Switch

### Definition & Purpose
An on or off control for a setting that applies instantly without requiring a separate "Save" step.

* **Why the name?**: To toggle is to flip between two states, just like a physical wall light switch.
* **Seen in**: *iPhone Settings* — Flip Airplane Mode and everything switches right away.
* **Dark UI Standards**:
  * **Track Dimensions**: 48 × 28px pill; inactive `#27272A` (`zinc-800`), active `emerald-500` (`#10B981`) or `sky-500`.
  * **Thumb Dimensions**: 22 × 22px circle in `#F4F4F5`, translating horizontally with smooth 150ms cubic ease.
  * **Touch Target**: Hit-slop bounding box $\ge 44 \times 44\text{px}$.
  * **ARIA Role**: `role="switch"`, `aria-checked="true|false"`.

---

## 6. Chips

### Definition & Purpose
Small tappable tags used to filter or pick from a few options.

* **Why the name?**: Small, rounded and easy to pick up, a bit like poker chips on a table.
* **Seen in**: *YouTube* — Tap "Music" or "Gaming" at the top to filter your home feed.
* **Dark UI Standards**:
  * **Height**: 32px height, full pill radius (`rounded-full`, 9999px).
  * **Inactive Surface**: Level 2 (`#202024`) with `border-white/5` and text `#D4D4D8` (`zinc-300`).
  * **Active Surface**: Level 3 (`#2E2E33`) with `border-zinc-500` and text `#F4F4F5` (`zinc-100`, `font-medium`).
  * **Dismiss Action**: Optional trailing `x` icon button with minimum 28px tap width.
  * **Touch Target**: Minimum bounding touch area of 44 × 44px.

---

## 7. FAB (Floating Action Button)

### Definition & Purpose
Floating action button: a round button for the one main action on a screen.

* **Why the name?**: It floats above everything else like a lifebuoy, always within reach of your thumb.
* **Seen in**: *Google Calendar* — The plus button starts a new event.
* **Dark UI Standards**:
  * **Dimensions**: 56 × 56px circular button (`rounded-full`).
  * **Placement**: Fixed `bottom-6 right-6` on mobile, or anchored inside desktop content canvas.
  * **Surface Fill**: Single dominant action color in `sky-500` (`#0EA5E9`) or `emerald-500` (`#10B981`) with flat 1px white border (`border-white/15`).
  * **Shadow**: Zero drop shadows (`shadow-none`). Micro-interaction via subtle 1.05x hover scale and 0.95x active press.
  * **Icon**: 24 × 24px icon centered inside.

---

## 8. Card

### Definition & Purpose
A box that groups related info, like a photo, title and price, into one tappable unit.

* **Why the name?**: It looks like a playing card or a postcard: one small rectangle holding one idea.
* **Seen in**: *Airbnb* — Every stay is a card: photo, title, price and rating in one tappable box.
* **Dark UI Standards**:
  * **Surface**: Level 1 Subsurface (`#161619`), 1px keyline border `border-white/10` (or `border-zinc-800`).
  * **Elevation**: Strictly zero box shadows. Depth achieved purely via luminance contrast against the Level 0 canvas (`#0E0E10`).
  * **Outer Radius**: 16px (`rounded-2xl`).
  * **Padding**: Multiples of 4px or 8px (typically 16px or 20px).
  * **Content Hierarchy**: High-contrast title `#F4F4F5`, metadata in `#A1A1AA`, badges in desaturated 200–500 tones.

---

## 9. Dropdown

### Definition & Purpose
A button that opens a list of choices so you can pick one without cluttering the screen.

* **Why the name?**: Tap it and the list drops down like a pull-down roller blind, then tucks away again.
* **Seen in**: *Google Docs* — Pick a font from a list that drops down from the toolbar.
* **Dark UI Standards**:
  * **Trigger Button**: Minimum 44px height, Level 1 subsurface (`#161619`) with 8px radius (`rounded-lg`).
  * **Dropdown Menu**: Level 2 Elevated (`#202024`), 1px `border-white/10`, 8px radius, zero box shadow.
  * **Selected Indicator**: Trailing checkmark icon beside the currently selected item.
  * **Item Row**: 40px height with 44px touch slop, hover state in Level 3 (`#2E2E33`).
  * **Dismiss**: Closes on item selection, outside click, or `Escape` key press.

---

## 10. Tooltip

### Definition & Purpose
A tiny label that appears when you hover or press and hold, explaining what something does.

* **Why the name?**: A tip about a tool. Hover a tool and a tiny label tells you what it does.
* **Seen in**: *Figma* — Hover a tool and a tiny label shows its name and keyboard shortcut, like "Move (V)".
* **Dark UI Standards**:
  * **Surface**: Level 3 Interactive (`#2E2E33`), flat 1px `border-white/10`. Zero drop shadows.
  * **Dimensions**: Padding `px-2 py-1`, radius 6px (`rounded-md`).
  * **Typography**: 12px text size, text `#F4F4F5`, `leading-none`.
  * **Triggers**: Pointer hover (`onMouseEnter`/`onMouseLeave`) and keyboard focus (`onFocus`/`onBlur`).
  * **ARIA Role**: `role="tooltip"`, `pointer-events-none`.

---

## Summary Matrix

| Component | Real-World Paradigm | Dark UI Surface Token | Hex Value | Primary Ergonomics |
| :--- | :--- | :--- | :--- | :--- |
| **Snackbar** | Gmail (Undo Archive) | `--surface-panel` (L2) | `#202024` | Auto-dismissing bottom toast with recovery |
| **Bottom Sheet** | Google Maps (Place Card) | `--surface-panel` (L2) | `#202024` | Bottom slide-up panel with grab handle |
| **Dialog** | WhatsApp (Delete Chat) | `--surface-panel` (L2) | `#202024` | High-friction blocking confirmation |
| **Bottom Nav** | Spotify (Home/Search/Library)| `--surface-card` (L1) | `#161619` | Ergonomic thumb switching across 3–5 tabs |
| **Toggle Switch**| iPhone Settings (Airplane) | Track: `#27272A` / `#10B981`| Level 3/Accent | Instant binary on/off flip |
| **Chips** | YouTube (Music/Gaming) | Inactive: L2 / Active: L3 | `#202024` / `#2E2E33` | Tappable filter pills with full radius |
| **FAB** | Google Calendar (+ Event) | Flat Sky-500 / Emerald-500| `#0EA5E9` / `#10B981` | 56x56px circular thumb lifebuoy action |
| **Card** | Airbnb (Cosy Cabin Stay) | `--surface-card` (L1) | `#161619` | 16px radius grouped info container |
| **Dropdown** | Google Docs (Font Picker) | `--surface-panel` (L2) | `#202024` | Roller blind menu with checkmarks |
| **Tooltip** | Figma (Move Tool [V]) | `--surface-active` (L3) | `#2E2E33` | Micro-label on hover and keyboard focus |
