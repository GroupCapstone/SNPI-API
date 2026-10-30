# SNP-SMS Dark Mode Elevation System & Engineering Standards

This specification establishes the authoritative dark interface design standards, surface luminance elevation hierarchy, typography opacity rules, mathematical design tokens, and accessibility contrast requirements for the SNP-SMS platform.

---

## 1. Foundational Dark UI Directives

* **Avoid Pure Black (`#000000`) at All Costs**: Pure `#000000` causes high-contrast OLED black-smearing, severe ocular halation, and eliminates spatial depth. Use `#121212`, `#1A1A1A`, or colored darks like `#0E0E10` or `#0B0B0C`.
* **Zero Drop Shadows Policy**: Shadows are optically invisible on dark backgrounds. Express spatial depth strictly through **surface luminance hierarchy** (lighter surface = higher elevation) and subtle 1px border contrast.
* **Desaturate Colors (200-500 Tone Scale)**: Highly saturated colors vibrate harshly against dark surfaces and fail WCAG contrast ratios. Stay strictly within the 200-500 color tone band.
* **Dim Pure White Typography**: Pure `#FFFFFF` text on dark backgrounds causes visual vibration and eye strain. Use calibrated white opacities.

---

## 2. The 5-Tier Surface Luminance Elevation Ladder

In a dark user interface, elevation is communicated by increasing the lightness of the surface:

```
+--------------------------------------------------------------------------+
| Level 5: 24dp (Floating Dialogs, Critical Modals)  | Surface: #383838    |
+--------------------------------------------------------------------------+
| Level 4: 8dp  (Dropdown Menus, Tooltips, FAB Dial) | Surface: #2E2E2E    |
+--------------------------------------------------------------------------+
| Level 3: 4dp  (Sticky App Bar, Top Header Ceiling) | Surface: #272727    |
+--------------------------------------------------------------------------+
| Level 2: 1dp  (Data Cards, Feed Sections, Lists)   | Surface: #1E1E1E    |
+--------------------------------------------------------------------------+
| Level 1: 0dp  (Base Document Canvas Background)    | Surface: #121212    |
+--------------------------------------------------------------------------+
```

| Elevation Level | Elevation DP | Hex Surface Color | Typical Components | Border Property |
| :--- | :--- | :--- | :--- | :--- |
| **Level 1 (Base)** | `0dp` | `#121212` | Full-screen canvas, viewport background | None |
| **Level 2 (Cards)** | `1dp` | `#1E1E1E` | Data cards, table rows, form containers | `1px solid #2A2A2A` |
| **Level 3 (App Bar)** | `4dp` | `#272727` | Sticky header, top navigation, bottom bar | `1px solid #333333` |
| **Level 4 (Menus)** | `8dp` | `#2E2E2E` | Dropdown menus, popup popovers, floating sheets | `1px solid #3E3E3E` |
| **Level 5 (Dialogs)**| `24dp`| `#383838` | Modal dialogs, destructive alerts, lightbox | `1px solid #484848` |

---

## 3. Typography Opacity Ratios & Contrast Standards

Never apply flat generic gray to dark text. Use `#FFFFFF` at calibrated opacity levels to naturally blend with underlying surface tones:

| Text Role | Hex Equivalent | White Opacity | Minimum WCAG Contrast | Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Headlines & Body** | `#E0E0E0` | `87%` | `14.2 : 1` (Exceeds AAA) | H1-H4 headings, body paragraphs, active button labels |
| **Secondary Metadata** | `#A0A0A0` | `60%` | `7.2 : 1` (Exceeds AA) | Subtitles, timestamps, table column headers, helper text |
| **Disabled & Placeholders**| `#6C6C6C` | `38%` | `3.6 : 1` (Component boundary)| Disabled button text, inactive icons, input placeholders |

---

## 4. Mathematical Design Tokens & Specifications

All interface components must strictly adhere to the following mathematical formulas:

```
1. Inner Border Radius:
   Inner Radius = Outer Radius - Padding
   Example: Card with 24px outer radius and 8px padding -> Inner element radius = 16px.

2. Typographic Line Height:
   Line Height = Font Size × 1.4 to 1.6
   Example: 16px font -> Line height = 24px (1.5x).

3. Typographic Scale Ratio:
   Next Font Size = Current Size × 1.25 (Major Third Scale)
   12px -> 15px -> 18.75px -> 23.4px -> 29.3px -> 36.6px.

4. Spacing Scale:
   Spacing = multiples of 4px or 8px (4, 8, 12, 16, 24, 32, 48, 64px).

5. Accessible Touch Target Size:
   Physical Hit Area >= 44 × 44px on all touch surfaces.

6. Color Contrast Formula:
   Contrast Ratio = (L1 + 0.05) / (L2 + 0.05)
   Where L1 is the relative luminance of the lighter color and L2 is the darker color.
```

---

## 5. Subtle Blending Modes & Interactive Lighting

* **State Highlighting in Dark Mode**: Because shadows are unavailable, hover states are created by applying a 5% white overlay (`bg-white/5`) or shifting surface luminance to the next elevation level.
* **Glow & Border Accents**: Active inputs and focused buttons use a 1px solid Royal Blue border (`#0056FF`) with an optional subtle 2px soft accent ring (`ring-2 ring-[#0056FF]/30`).
