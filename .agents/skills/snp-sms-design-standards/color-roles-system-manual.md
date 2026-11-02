# Material 3 Color Roles System & Semantic Color Architecture Manual

Authoritative engineering and design specification for the 26 standard Material 3 color roles organized across six core groups, tone-based surface container hierarchies, three contrast levels, and fixed accent colors.

---

## 1. System Overview & The Paint-by-Number Model

Color roles act as the connective tissue between UI elements and color tokens:
* **Tokenized Abstraction**: UI elements never hardcode hex values. They reference semantic color roles (e.g., `md.sys.color.primary-container`).
* **Pairing & Layering Integrity**: Elements must only be paired with their designated "On" colors (e.g., `on-primary` on `primary`, `on-primary-container` on `primary-container`) to preserve visual accessibility.
* **Three Levels of Contrast**:
  1. **Standard**: Default minimum contrast (3.0:1 for graphical objects, 4.5:1 for standard text).
  2. **Medium**: Enhanced contrast for outdoor viewing and moderate visual impairment.
  3. **High**: Maximum contrast (>= 7.0:1) meeting WCAG AAA requirements across all states.

---

## 2. Technical Palette Calibrations

* **Default Light Theme Surface**: Tone **98** (calibrated down from legacy tone 99) providing softer canvas contrast.
* **Neutral Palette Chroma**: Chroma **6** (increased from legacy chroma 4) enriching neutral surfaces with subtle color harmony.
* **Darkened Dark Theme Surfaces**: Tone values for dark theme surfaces are slightly darkened to deepen contrast with luminous accent containers.
* **Tone-Based Surfaces (Replacing Elevation Overlays)**:
  - Surface elevation no longer relies on semi-transparent white overlays.
  - Surfaces use discrete tone steps (`surface-container-lowest` through `surface-container-highest`), maintaining consistent hierarchy across all breakpoints and lighting environments.

---

## 3. The 26 Standard Color Roles in Six Groups

### 3.1 Primary Group (Prominent Actions & High-Emphasis CTAs)
* `primary`: High-emphasis fills, texts, and icons against surface (FABs, primary buttons, active indicator pills).
* `on-primary`: Text and icons against primary fill (guarantees >= 4.5:1 contrast).
* `primary-container`: Standout fill color against surface for key components like extended FABs.
* `on-primary-container`: High-contrast, colorful text and icons on primary container.

### 3.2 Secondary Group (Less Urgent & Supporting Elements)
* `secondary`: Less prominent fills, text, and icons against surface (filter chips, secondary actions).
* `on-secondary`: Text and icons against secondary fill.
* `secondary-container`: Recessive container fill color against surface (tonal buttons, selected chips).
* `on-secondary-container`: Colorful text and icons on secondary container.

### 3.3 Tertiary Group (Contrasting Accents & Balance)
* `tertiary`: Complementary fills, text, and icons against surface for distinctive accents.
* `on-tertiary`: Text and icons against tertiary fill.
* `tertiary-container`: Complementary container color against surface (input field accents, notifications).
* `on-tertiary-container`: Colorful text and icons on tertiary container.

### 3.4 Error Group (Attention-Grabbing Static Alerts)
* `error`: Urgent attention-grabbing color against surface for invalid states and alerts.
* `on-error`: Text and icons against error fill.
* `error-container`: Attention-grabbing container fill against surface.
* `on-error-container`: High-contrast text and icons on error container.
* *Note*: Error roles remain static across dynamic wallpaper extractions while adapting to light and dark themes.

### 3.5 Surface Group (Neutral Backgrounds & 5 Container Levels)
* `surface`: Default color for large low-emphasis canvas backgrounds.
* `on-surface`: Primary text and icons against any surface or surface container.
* `on-surface-variant`: Lower-emphasis secondary text, captions, and inactive icons.
* **The 5 Surface Container Roles**:
  1. `surface-container-lowest`: Lowest-emphasis container (cards recessed into canvas).
  2. `surface-container-low`: Low-emphasis container for surface card foundations.
  3. `surface-container`: Default container color for cards, sheets, and dialogs.
  4. `surface-container-high`: High-emphasis container for raised popovers and menus.
  5. `surface-container-highest`: Highest-emphasis container for floating dialogs and toolbars.
* **Inverse Surface Roles**:
  - `inverse-surface`: High-contrast background fill for contrasting elements (snackbars).
  - `inverse-on-surface`: Text and icons against inverse surface.
  - `inverse-primary`: Actionable text buttons displayed against inverse surface.

### 3.6 Outline Group (Boundaries & Dividers)
* `outline`: Important visual boundaries (text field borders, card borders requiring 3.0:1 contrast).
* `outline-variant`: Decorative elements, list dividers, and chip borders where internal text provides contrast.

---

## 4. Add-On Color Roles (Fixed Accents & Surface Extenders)

### 4.1 Fixed Accent Colors
Fixed colors maintain constant tonal lightness between light and dark themes (unlike standard container colors which invert):
* **Primary Fixed Suite**: `primary-fixed`, `primary-fixed-dim`, `on-primary-fixed`, `on-primary-fixed-variant`.
* **Secondary Fixed Suite**: `secondary-fixed`, `secondary-fixed-dim`, `on-secondary-fixed`, `on-secondary-fixed-variant`.
* **Tertiary Fixed Suite**: `tertiary-fixed`, `tertiary-fixed-dim`, `on-tertiary-fixed`, `on-tertiary-fixed-variant`.
* *Usage Constraint*: Use only where identical color presence is required across both light and dark themes (e.g., persistent FABs, branded media banners).

### 4.2 Bright & Dim Surface Roles
* `surface-dim`: Dimmest surface color across both light and dark themes (recessed sidebars).
* `surface-bright`: Brightest surface color across both light and dark themes (active document area).

---

## 5. The 14 Affected Components & Role Assignments

| Component | Container Role | Text / Icon Role | Border / Outline Role |
| :--- | :--- | :--- | :--- |
| **Badges** | `error` or `tertiary` | `on-error` or `on-tertiary` | None |
| **Buttons (Filled)** | `primary` | `on-primary` | None |
| **Buttons (Tonal)** | `secondary-container` | `on-secondary-container` | None |
| **Buttons (Outlined)** | `surface` | `primary` | `outline` |
| **Extended FAB** | `primary-container` | `on-primary-container` | None |
| **FAB** | `primary-container` | `on-primary-container` | None |
| **Icon Buttons** | `surface-container-low` | `on-surface-variant` | `outline-variant` |
| **Segmented Buttons** | `surface-container` (sel: `secondary-container`) | `on-secondary-container` | `outline` |
| **Chips (Filter/Assist)** | `surface-container-low` (sel: `secondary-container`) | `on-surface` (sel: `on-secondary-container`) | `outline-variant` |
| **Lists** | `surface` | `on-surface` / `on-surface-variant` | `outline-variant` (dividers) |
| **Menus** | `surface-container-high` | `on-surface` | None (elevation 2) |
| **Navigation Bar** | `surface-container` | `on-surface-variant` (active: `on-secondary-container`) | None |
| **Navigation Drawer** | `surface-container-low` | `on-surface-variant` (active: `on-secondary-container`) | None |
| **Navigation Rail** | `surface` (active pill: `secondary-container`) | `on-secondary-container` | None |
| **Switches** | Track: `surface-container-highest` (on: `primary`) | Thumb: `on-primary` (off: `outline`) | `outline` |
| **Toolbars** | `surface-container-highest` | `on-surface` | None |

---

## 6. Pairing & Layering Invariants Matrix

| Layer Type | Base Fill Token | Allowed Child Content Tokens | Prohibited Combinations |
| :--- | :--- | :--- | :--- |
| **Primary Base** | `primary` | `on-primary` | `on-surface`, `primary-container` |
| **Primary Container**| `primary-container` | `on-primary-container` | `on-primary`, `on-surface-variant` |
| **Secondary Container**| `secondary-container` | `on-secondary-container` | `on-surface`, `secondary` |
| **Tertiary Container** | `tertiary-container` | `on-tertiary-container` | `on-tertiary`, `primary` |
| **Surface Containers** | `surface-container-*` | `on-surface`, `on-surface-variant` | `on-primary`, `on-secondary` |
| **Inverse Surface** | `inverse-surface` | `inverse-on-surface`, `inverse-primary` | Standard `on-surface`, `primary` |
