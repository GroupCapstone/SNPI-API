# Material 3 Grids, Spacing & Density Scaling Manual

This manual is the authoritative specification for grid layouts, mathematical spacing tokens, and component density scaling across the SNPI-SMS platform.

---

## 1. The Three Layout Pillars

Material 3 organizes interfaces through three interdependent layout pillars:

| Pillar | Architectural Role | Impact on User Experience |
| :--- | :--- | :--- |
| **Grids** | Consistent structural foundation | Adapts column counts and gutters fluidly across the 5 breakpoints. |
| **Spacing** | Semantic grouping & visual hierarchy | Directs user attention to primary actions via intentional proximity. |
| **Density** | Information throughput scaling | Enables users to see, compare, and manage large data volumes in dense tables. |

---

## 2. Adaptive Grid System Across Breakpoints

Layout grids use a 12-column adaptive grid that automatically scales columns, margins, and gutters based on active window size:

| Breakpoint Window | Column Count | Margins (`px` / `dp`) | Gutters (`px` / `dp`) | Typical Device Target |
| :--- | :--- | :--- | :--- | :--- |
| **Compact** (<600dp) | 4 Columns | 16dp | 16dp | Mobile phones, folded foldables (portrait) |
| **Medium** (600–839dp) | 8 Columns | 24dp | 24dp | Small tablets, unfolded foldables |
| **Expanded** (840–1199dp) | 12 Columns | 24dp | 24dp | Full-size tablets, landscape foldables, laptops |
| **Large** (1200–1599dp) | 12 Columns | 24dp | 24dp | Desktop monitors, large workstations |
| **Extra-Large** (≥1600dp) | 12 Columns | 32dp | 24dp | Ultra-wide monitors, multi-window desktop setups |

```tsx
// Adaptive Grid Implementation in Tailwind CSS
<div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-4 lg:gap-6 px-4 sm:px-6 lg:px-8">
  {/* Fluid Grid Content */}
</div>
```

---

## 3. Mathematical Spacing System & Tokens

Spacing tokens create predictable, rhythmic spacing relationships between elements:

| Token Name | dp / px Value | Semantic Application |
| :--- | :--- | :--- |
| `spacing-none` | 0dp | Zero margin / flush container alignment |
| `spacing-extra-small` | 4dp | Tight micro-spacing, badge offsets, icon-to-label gaps |
| `spacing-small` | 8dp | Internal padding for chips, compact buttons, text line groupings |
| `spacing-medium` | 12dp | Compact card padding, form control internal padding |
| `spacing-large` | 16dp | Standard container padding, card body insets, compact gutters |
| `spacing-extra-large` | 24dp | Section margins, grid gutters, modal dialog padding |
| `spacing-2xl` | 32dp | Major component block separation, hero section insets |
| `spacing-3xl` | 40dp | Page section vertical spacing, dashboard card separation |
| `spacing-4xl` | 48dp | Wide view padding, primary section dividers |
| `spacing-5xl` | 56dp | Major view header separation |
| `spacing-6xl` | 64dp | Full-screen hero section insets |

### 3.1 Proximity & Grouping Principles
- **Implicit Grouping**: Related items (e.g. avatar, name, and role) are placed within `4dp` to `8dp` of one another. Proximity signals related data without needing visible borders.
- **Explicit Grouping**: Discrete card containers, keylines (`1px solid #CAD3F5`), and surface tone variations (`#EFF5FF`) group multi-attribute data sets (e.g. student profile card).

---

## 4. Component Density Scale

Density allows users to adjust the amount of content visible on screen simultaneously, especially in data-dense tables, gradebooks, and student lists:

### 4.1 The 4-Level Density Scale
- **Density 0 (Default)**: Standard component height (e.g. 56dp for list items / text fields). Generous touch zones.
- **Density -1**: Reduces component vertical height and padding by `4dp` (52dp total height).
- **Density -2**: Reduces component vertical height and padding by `8dp` (48dp total height).
- **Density -3**: Reduces component vertical height and padding by `12dp` (44dp total height).

### 4.2 Invariant Rules of Density Scaling
1. **Never Shrink Typography**: Density scaling modifies **container vertical padding and bounds only**. Typography font sizes, line heights, and font weights must remain strictly unscaled to preserve legibility.
2. **Preserve Minimum Touch Targets**: Even at Density -3, interactive click/tap bounds must maintain a minimum of **44x44px** (using transparent `::before` or `::after` pseudo-element hit-target expansion).
3. **Prohibited Dense Components**:
   - Never apply high density (-2, -3) to focused selection menus, confirmation dialogs, bottom sheets, or snackbars.
4. **User Opt-In Preference**:
   - High density must strictly be a user-selectable toggle or table-specific view mode (e.g., `Compact Table View`), never forced onto first-time users.
