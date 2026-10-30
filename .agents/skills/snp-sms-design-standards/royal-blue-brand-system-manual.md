# Royal Blue Brand Colors, Gradients & Zero-Dot UI Standards Manual

Authoritative design standard and architectural specification for the Royal Blue Brand System, Futurewave Gradients, Light Day First policy, and Zero-Dot UI Standards in the SNP-SMS repository.

---

## 1. Authoritative Color Tokens & Gradients

The interface across all documentation surfaces (`/document/*`) and developer libraries enforces the strict brand color architecture:

```
+------------------------------------------------------------------------+
| 01 ROYAL BLUE (#0056FF) - Primary Base Brand Color                     |
+------------------------------------+-----------------------------------+
| 02 AZURE BLUE (#2277FF)            | 03 BLACK (#000000)                |
+------------------------------------+-----------------------------------+
| 04 SOFT LAVENDER (#E3E7FC)         | 05 WHITE (#FFFFFF)                |
+------------------------------------+-----------------------------------+
| GRADIENT 1: FUTUREWAVE             | #2277FF  -->  #AEC2FF             |
| GRADIENT 2: MIDNIGHT SURGE         | #000B26  -->  #0056FF             |
+------------------------------------+-----------------------------------+
| GEOMETRIC STAMP                    | 20 | BRAND 26 | BLUE              |
+------------------------------------+-----------------------------------+
```

### 1.1 Mathematical Color Token Matrix

| Token Index | Token Name | Hex Code | Semantic Role | Surface Contrast (Light) |
| :--- | :--- | :--- | :--- | :--- |
| **01** | **Royal Blue** | `#0056FF` | Primary CTA, brand anchor, active state, focused keyline | Exceeds 4.5:1 on white (`#FFFFFF`) |
| **02** | **Azure Blue** | `#2277FF` | Secondary button, interactive hover, gradient start | High-energy secondary accent |
| **03** | **Black** | `#000000` | Headings, high-contrast typography, obsidian badges | WCAG AAA 21:1 on white (`#FFFFFF`) |
| **04** | **Soft Lavender** | `#E3E7FC` | Subtle card background, badge pill, keyline tint (`#CAD3F5`) | Eye-friendly soft contrast surface |
| **05** | **White** | `#FFFFFF` | Primary viewport canvas, card container, light stage | Base reflective day light surface |

### 1.2 Mathematical Gradients

- **Gradient 1 (Futurewave)**:
  `linear-gradient(135deg, #2277FF, #5C93FF, #AEC2FF)`
  High-energy forward-looking gradient applied to hero banners, progress indicators, and highlight badges.
- **Gradient 2 (Midnight Surge)**:
  `linear-gradient(135deg, #000B26, #002D8A, #0056FF)`
  Deep contrast obsidian-to-royal gradient for terminal blocks, dark mode accents, and technical card surfaces.

### 1.3 Sora Brand Typography

- **Font Family**: `'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;`
- **Typographic Scale**:
  - H1: `2.25rem` (36px), `font-weight: 800`, `letter-spacing: -0.025em`
  - H2: `1.65rem` (26px), `font-weight: 800`, `letter-spacing: -0.02em`
  - H3: `1.35rem` (21px), `font-weight: 700`
  - Body: `0.975rem` (15.6px), `line-height: 1.65`
  - Buttons / Controls: `0.875rem` (14px), `font-weight: 700`, `letter-spacing: 0.025em`
- **Brand Stamp**: `20 | BRAND 26 | BLUE` rendered via `GeometricHeaderStamp`.

---

## 2. Light Day First Policy (MANDATORY)

- **Default Theme = Light Day**: All documentation portals, design libraries, and interactive stages must strictly initialize in pure **Light Day Mode** (`#FFFFFF` canvas, `#F8FAFC` stage backgrounds, `#CAD3F5` subtle borders).
- **Zero Murky Stages**: Dark mode is available as a secondary test toggle, but never the default landing experience.
- **Surface Elevation in Light Mode**:
  - Level 0 (Canvas): Pure White `#FFFFFF`
  - Level 1 (Stage Card): Subsurface Neutral `#F8FAFC`
  - Level 2 (Accents / Badges): Soft Lavender `#E3E7FC` with `#CAD3F5` border
  - Level 3 (Active / CTA): Royal Blue `#0056FF` with white text

---

## 3. Strict Zero-Dot Style Rule (ABSOLUTE RULE)

Under no circumstances should circular dot indicators (`rounded-full bg-*`, `size-1.5`, `size-2`, ping dots) be used anywhere in user interface chrome, navigation menus, headers, or component demos:

```
[PROHIBITED - NEVER USE]
(•) Blue dot in menu tabs            --> REMOVED
(•) Ping dot next to version tag     --> REMOVED
(•) Pulse dot in status badges       --> REMOVED
(•) Circle nodes along TOC rail      --> REMOVED
(•) Radial-gradient dot backgrounds  --> REMOVED

[MANDATORY REPLACEMENTS]
[+] Pure typographic bolding & color transition
[+] Clean vertical precision indicator lines (h-3.5 w-1 rounded-[2px])
[+] Structured textual badges: [RELEASE], [API READY], [ACTIVE], [ONLINE]
[+] Continuous linear precision rails with horizontal notch ticks
[+] Mathematical linear grid lattices (linear-gradient)
```

### Specific Chrome Implementations:
1. **Header Navigation (`hanging-tabs-nav.tsx`)**: Active trapezoid tab is indicated solely by shape elevation, stroke, and `#0056FF` typography. Zero dots.
2. **Left Sidebar Menu (`ui-library-view.tsx`)**: Category buttons use a clean vertical indicator bar (`h-3.5 w-1 rounded-[2px]`). Active section lines use a straight precision line (`rounded-[1px]`). Zero dots.
3. **Table of Contents (`rail-toc.tsx`)**: SVG track renders an unbroken mathematical line with rectangular tick notches (`<line strokeLinecap="square"/>`). Zero circles.
4. **Data Tables (`data-table.tsx`)**: Status cells display bold text badges (`[PAID]`, `[PENDING]`, `[FAILED]`). Zero leading dots.
5. **Stage Canvas Backgrounds**: Render subtle linear grids (`linear-gradient(to right, #CAD3F5 1px, transparent 1px)`). Zero radial dots.

---

## 4. Say Less, Show More Result (Zero Hidden Elements)

All components must deliver immediate, live interactive results without hiding content behind collapsed toggles or requiring user clicks to discover:

- **Direct In-Stage Rendering**: Modal dialogs, drawer sheets, dropdown menus, and command palettes must render live in-stage previews directly on the canvas.
- **Drawer Sheet**: Defaults to open (`open: true`), revealing the complete student inspector, telemetry badges, and action buttons.
- **Modal Dialog**: Renders the live interactive confirmation surface on the stage with real-world student data and ledger commits.
- **Command Palette**: Displays instant interactive action cards directly on the stage canvas, alongside the ⌘K trigger.
- **No Truncation**: Generous viewport heights (`min-h-[440px]`), full interactive feedback, and immediate live execution states.

---

## 5. Single Primary Component Standard (Deduplication)

Keep only the primary canonical component ready to call and import anywhere in the monorepo:

| UI Need | Primary Canonical Component | File Path | Usage Pattern |
| :--- | :--- | :--- | :--- |
| **Modal / Dialog** | `LibraryDialog` | `ui-library/dialog.tsx` | `<LibraryDialog open={...} onConfirm={...} />` |
| **Bottom / Side Sheet** | `LibraryBottomSheet` | `ui-library/bottom-sheet.tsx` | `<LibraryBottomSheet open={...} title={...} />` |
| **Dropdown / Select** | `LibraryDropdown` | `ui-library/dropdown.tsx` | `<LibraryDropdown options={...} value={...} />` |
| **Snackbar / Toast** | `LibrarySnackbar` | `ui-library/snackbar.tsx` | `<LibrarySnackbar message={...} variant="success" />` |
| **Container Card** | `LibraryCard` | `ui-library/card.tsx` | `<LibraryCard interactive={...} />` |
| **Geometric Button** | `GeometricButton` | `ui-library/geometric-tag-primitives.tsx` | `<GeometricButton variant="blue" size="md" />` |
| **Geometric Input** | `GeometricInput` | `ui-library/geometric-tag-primitives.tsx` | `<GeometricInput variant="blue" clearable />` |

---

## 6. Standard Border Radius Geometry

- **Buttons & Inputs**: Strict standard `rounded-[4px]` (`border: 0; border-radius: 4px;` via `apps/frontend/app/document/layout.tsx`).
- **Cards & Dialogs**: `rounded-2xl` (16px) or `rounded-3xl` (24px) for hero containers.
- **Pills / Capsules**: `rounded-full` for toggle switches and navigation tabs.
- **Inner Radius Formula**: $\text{Inner Radius} = \max(0, \text{Outer Radius} - \text{Padding})$ ensuring concentric harmony.
