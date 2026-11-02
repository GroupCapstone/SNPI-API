# Material 3 Interaction States & State Layers Manual

This manual is the authoritative specification for interaction states, state layers, component inheritance, and visual feedback across all user interfaces in the SNPI-SMS platform.

---

## 1. Overview of Interaction States

Interaction states communicate the real-time operational status of a component or UI element. Every interactive element exists in one of six canonical states at any given moment:

| State | Semantic Meaning | Visual Communication | State Layer Opacity |
| :--- | :--- | :--- | :--- |
| **Enabled** | Ready for user engagement | Default component styling and base elevation | 0% (Base Surface) |
| **Disabled** | Non-interactive / unavailable | Desaturated color, reduced elevation, pointer-events none | 0% (Contrast Exempt) |
| **Hover** | Pointer hovering over surface | Content-color tint overlay on container surface | 8% (`opacity-8`) |
| **Focused** | Keyboard or input focus active | 2px solid `#0056FF` focus ring with 2px offset + tint | 12% (`opacity-12`) |
| **Pressed** | Pointer down or keypress engagement | Deep content-color tint overlay + ripple effect | 12% (`opacity-12`) |
| **Dragged** | Element picked up / reordered | State layer overlay + elevated surface shadow/tint | 16% (`opacity-16`) |

---

## 2. State Layers Architecture

A state layer is a semi-transparent color overlay applied over an interactive component's container surface to communicate state changes without altering the underlying base container token:
- **Color Selection**: The state layer color is strictly derived from the component's **content color** (`on-surface`, `on-primary`, `on-secondary`, `on-tertiary`, `on-error`).
- **Luminance Invariant**: State layers preserve underlying icon and text contrast.
- **Opacity Matrix**:
  - Hover: `0.08` (8% opacity)
  - Focused: `0.12` (12% opacity)
  - Pressed: `0.12` (12% opacity)
  - Dragged: `0.16` (16% opacity)

```tsx
// Canonical State Layer Container Wrapper in React/Tailwind
<button className="relative overflow-hidden rounded-xl bg-[#0056FF] px-4 py-2 text-white transition-colors">
  {/* Base Content */}
  <span className="relative z-10 font-medium">Action Label</span>
  {/* State Layer Overlay */}
  <span className="absolute inset-0 bg-white opacity-0 transition-opacity duration-200 hover:opacity-[0.08] active:opacity-[0.12] focus-visible:opacity-[0.12]" />
</button>
```

---

## 3. Component Inheritance & Exclusion Matrix

State inheritance defines which components propagate states to their children and which components maintain localized states:

### 3.1 Inheriting Components (Action, Selection, Input)
These components inherit states directly across their entire interactive bounds:
- **Buttons**: Filled, Elevated, Tonal, Outlined, Text buttons
- **Selection Controls**: Checkboxes, Radio buttons, Switches
- **Chips**: Assist, Filter, Input, Suggestion chips
- **Text Fields**: Filled and Outlined text fields
- **List Items**: Interactive single-line, two-line, and three-line rows
- **Cards**: Clickable elevated and outlined cards
- **Segmented Buttons**: Single-select and multi-select button strips

### 3.2 Non-Inheriting Container Shells (Containment, Communication, Navigation)
Container chrome components do **NOT** inherit states as a whole. Instead, state layers and interaction states are strictly applied only to the individual child interactive elements within them:
- **Top App Bars**: The bar itself never receives hover/press; only action icons and navigation buttons inside it do.
- **Navigation Rails & Drawers**: The container shell does not have a hover state; only individual destination pills receive states.
- **Bottom Navigation Bars**: Only the individual active/inactive tab buttons receive states.
- **Dialogs & Bottom Sheets**: The modal surface does not inherit hover/pressed; only embedded buttons and action chips do.
- **Badges**: Badges communicate status or counts and are non-interactive; they never receive interaction states.
- **Toolbars & Action Strips**: Only the discrete tool buttons inside receive states.

---

## 4. The Disabled State Invariants

1. **Visual Demarcation**:
   - Communicated strictly through color desaturation (`text-slate-400`, `bg-slate-100`, `border-slate-200`) and reduction to flat zero elevation.
2. **Contrast Exemption**:
   - Disabled components are **explicitly exempt** from standard WCAG / Material contrast ratio requirements (3:1 or 4.5:1), ensuring users do not mistake them for active elements.
3. **Event Suppression**:
   - Disabled elements must strictly disable pointer events (`pointer-events: none`), remove tabindex (`tabIndex={-1}` or `disabled` attribute), and never emit hover, focus, press, or drag events.
4. **Floating Action Button (FAB) Hide Rule**:
   - When a primary action represented by a Floating Action Button is unavailable, the FAB must **hide completely** rather than render as a disabled button. Disabled FABs clutter the screen without providing actionable utility.

---

## 5. Layout Exclusivity & Compound States

### 5.1 Single Active State Exclusivity
To prevent visual confusion across the layout:
- Strictly **one hover state** may be active across the layout at any given moment.
- Strictly **one keyboard focus ring** may be active at any given moment.
- Strictly **one pressed state** may be active at any given moment.
- Strictly **one dragged element** may be active at any given moment.

### 5.2 Valid Compound States
A component may exhibit compound states when multiple interaction conditions occur simultaneously:
- **Hover + Focused**: When a user navigates via keyboard to a component and subsequently moves the mouse cursor over it. Both the 2px focus ring and the 8% hover tint render simultaneously.
- **Selected + Hover**: When an active navigation item or filter chip is hovered. The active background remains tinted while the hover layer overlays on top.
- **Selected + Pressed**: When an active toggle item is pressed down.

---

## 6. Focus Ring Specification for Keyboard Navigation

For keyboard accessibility compliance:
- Focus rings must strictly be visible on `:focus-visible` only (never on mouse click focus).
- Style: `outline: 2px solid #0056FF; outline-offset: 2px;`
- In Dark Mode: `outline: 2px solid #2277FF; outline-offset: 2px;`
- Never suppress outline without providing an equivalent high-contrast focus indicator.
