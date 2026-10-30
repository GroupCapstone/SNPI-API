# SNP-SMS Button Design System & Interaction Manual

This specification establishes the structural anatomy, sizing tokens, hierarchy levels, border-radius psychology, and interaction state matrix for all button components across the SNP-SMS platform.

---

## 1. The 8 Foundational Button Principles

1. **Perfect Size & Touch Target**: All interactive buttons must maintain at least a `44 × 44px` physical touch target boundary for accessibility, with internal padding tuned for balanced optical weight.
2. **Font Size & Spacing Scale**: Button typography must use crisp font weights (600-800) with a line-height multiplier of `1.0` to `1.2` to prevent vertical drift.
3. **Comprehensive State Matrix**: Every button must explicitly handle `normal`, `hover`, `focus-visible`, `active (pressed)`, `disabled`, and `loading` states.
4. **Single Unified Component Architecture**: All button variants, sizes, and states must be consolidated into a single reusable component (`GeometricButton` or `Button`) using type-safe props.
5. **Contextual Placement**: Destructive buttons must be isolated from constructive actions. Primary submit actions must sit on the trailing edge (right for LTR).
6. **Strict 3-Tier Hierarchy**: Every view must feature at most ONE Primary action, with all secondary workflows delegated to Secondary (outline/soft) or Tertiary (ghost) buttons.
7. **Border Radius Psychology**:
   - `rounded-full` (Pill): Approachable, consumer-friendly, primary user actions.
   - `rounded-xl` (12px): Enterprise balance, professional dashboards, data-dense forms.
   - `rounded-md` (6px): Compact utility tools, code blocks, technical tables.
8. **Strict Single-Line Constraint**: Button text MUST NEVER wrap onto a second line. If text overflows on narrow viewports, it must truncate or use responsive compact labels.

---

## 2. Button Sizing & Padding Tokens

| Size Variant | Height | Horizontal Padding | Font Size | Font Weight | Minimum Touch Target |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`sm` (Compact)** | `32px` (`h-8`) | `12px` (`px-3`) | `11px` (`text-[11px]`) | Bold (`font-bold`) | `44 × 44px` (via `::before`) |
| **`md` (Standard)** | `40px` (`h-10`) | `16px` (`px-4`) | `13px` (`text-xs` / `text-sm`) | Bold (`font-bold`) | `44 × 44px` |
| **`lg` (Hero / CTA)**| `48px` (`h-12`) | `24px` (`px-6`) | `15px` (`text-sm` / `text-base`) | Black (`font-extrabold`) | `48 × 48px` |

---

## 3. Hierarchy & Visual Variants

### 1. Primary Button (High Importance)
* **Purpose**: The single primary action on a screen (e.g., "Save Student Profile", "Process Payment").
* **Light Styling**: `bg-[#0056FF] text-white border-transparent hover:bg-[#0047D4] active:scale-[0.98]`.
* **Dark Styling**: `bg-[#0056FF] text-white border-transparent hover:bg-[#2563EB] active:scale-[0.98]`.

### 2. Secondary Button (Medium Importance)
* **Purpose**: Alternative actions, cancellations, filters, or downloads.
* **Light Styling**: `bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50`.
* **Dark Styling**: `bg-[#1E1E1E] text-slate-200 border-[#2E2E2E] hover:border-slate-600 hover:bg-[#272727]`.

### 3. Soft / Tinted Button (Convenience)
* **Purpose**: Secondary actions with brand emphasis (e.g., "Preview", "Copy Hash").
* **Light Styling**: `bg-[#E3E7FC] text-[#0056FF] border-[#CAD3F5] hover:bg-[#D5DCFA]`.
* **Dark Styling**: `bg-[#1E293B] text-[#60A5FA] border-[#334155] hover:bg-[#334155]`.

### 4. Tertiary / Ghost Button (Low Importance)
* **Purpose**: Subtle utility actions inside tables, toolbars, or modal dismissals.
* **Styling**: `bg-transparent text-slate-600 border-transparent hover:bg-slate-100 active:bg-slate-200`.

### 5. Destructive Button (High Risk)
* **Purpose**: Permanent deletions, unenrollments, and privilege revocations.
* **Styling**: `bg-red-600 text-white border-transparent hover:bg-red-700 active:bg-red-800`.
