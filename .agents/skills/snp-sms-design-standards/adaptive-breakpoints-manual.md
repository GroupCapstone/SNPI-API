# Material 3 Adaptive Breakpoints & 5-Vector Transformation Manual

This manual is the authoritative specification for adaptive breakpoints, multi-device experiences, and the five layout transformation vectors across the SNPI-SMS platform.

---

## 1. Five Standard Breakpoint Classes

Material 3 classifies all display windows into five distinct breakpoint classes based on available horizontal width:

| Breakpoint | Window Width Range | Typical Devices & Form Factors | Canonical Pane Count |
| :--- | :--- | :--- | :--- |
| **Compact** | `< 600dp` | Mobile phones, folded foldable screens (portrait) | 1 Pane (Full-width drilldown) |
| **Medium** | `600dp – 839dp` | Small tablets, unfolded inner foldable screens | 1–2 Panes (Split or sheet overlay) |
| **Expanded** | `840dp – 1199dp` | Full-sized tablets, landscape foldables, small laptops | 2 Panes (Co-planar dual-pane) |
| **Large** | `1200dp – 1599dp` | Desktop monitors, large workstations, laptops | 2–3 Panes (Persistent rails & panes) |
| **Extra-Large** | `≥ 1600dp` | Ultra-wide monitors, 4K displays, multi-window setups | 3 Panes (Master-Detail-Supporting) |

### 1.1 Dynamic Window Dimensions
Breakpoints apply to the **application window size**, NOT physical screen hardware:
- Multi-window split-screen on a tablet can reduce the window class from `Expanded` to `Compact`.
- Unfolding a foldable smartphone dynamically elevates the window from `Compact` to `Medium` without page reloads.
- Desktop browser resizing smoothly transitions across `Expanded`, `Large`, and `Extra-Large`.

---

## 2. The Five Transformation Vectors

When moving across breakpoints, layouts transform by applying five canonical design vectors:

### 2.1 Vector 1: Reveal
- Exposes additional UI elements or auxiliary regions that were previously hidden behind drawers, menus, or modals.
- **Example**: At `Expanded` (≥840dp), a side navigation rail is permanently revealed, and secondary utility tools become immediately visible in the header.

### 2.2 Vector 2: Divide
- Splits a single sequential view into two or three co-planar panes side-by-side.
- **Pane Division Invariants**:
  - `< 840dp` (Compact & Medium): **1 Pane** (Single pane stack; tapping navigates to a new view).
  - `840dp – 1599dp` (Expanded & Large): **2 Panes** (Co-planar List-Detail or Primary + Supporting Pane).
  - `≥ 1600dp` (Extra-Large): **3 Panes** (Navigation Rail + List Pane + Detail Pane + Supporting Utility Pane).

### 2.3 Vector 3: Resize
- Fluidly stretches or constrains container dimensions to match ergonomic targets.
- **Readability Rule**: Typography lines must strictly be constrained to **40 to 60 characters per line** (approx 600–720px max-width) to prevent eye fatigue on wide displays. Cards and tables stretch fluidly, while long-form body text is bounded with centered or column-constrained layouts.

### 2.4 Vector 4: Reposition
- Shifts navigation and action elements to match device ergonomics.
- **Ergonomic Invariant**:
  - On **Compact** devices: Primary navigation and key actions sit at the **bottom** within easy thumb reach (Bottom Nav, Bottom App Bar).
  - On **Expanded & Desktop** devices: Primary navigation shifts to the **leading vertical edge** (Navigation Rail or Navigation Drawer) to leverage horizontal widescreen geometry.

### 2.5 Vector 5: Swap
- Substitutes a component with a functionally equivalent component optimized for the target window size.

---

## 3. Component Swapping Matrix Across Breakpoints

| Component Family | Compact (<600dp) | Medium (600–839dp) | Expanded+ (≥840dp) |
| :--- | :--- | :--- | :--- |
| **Navigation** | Bottom Navigation Bar | Collapsed Navigation Rail (Icons) | Expanded Navigation Rail / Drawer |
| **Auxiliary Content** | Modal Bottom Sheet | Side Sheet / Dropdown Menu | Permanent Supporting Pane (360dp docked) |
| **Dialogs & Modals** | Full-Screen Dialog | Standard Centered Modal Dialog | Standard Centered Modal Dialog |
| **Action Prompts** | Standard FAB | Standard FAB | Extended FAB (Icon + Text Label) |
| **Menus & Filters** | Full-width Bottom Picker | Dropdown Menu | Dropdown Menu / Filter Strip |

### 3.1 Prohibited Cross-Type Swaps
Under no circumstances should components be swapped across incompatible functional categories:
- Never swap a Button into a Chip or Menu item.
- Never swap a Dialog into a Snackbar.
- Never swap primary navigation into a hidden overflow menu on wide screens.
