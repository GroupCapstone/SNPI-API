---
name: snp-sms-frontend-dark-ui-standards
description: >-
  Authoritative frontend folder structure and Dark UI design standards for
  SNP-SMS. Enforces flat component design without shadows, depth via surface
  luminance hierarchy, #000000 avoidance, dual theme support, desaturated 200-500
  color tones, eye-friendly typography, 44x44px touch targets, and strict
  mathematical design tokens.
---

# SNP-SMS Frontend Folder Architecture & Dark UI Standards

This specification establishes the authoritative frontend directory organization and Dark UI design system for the SNP-SMS Next.js web application.

---

## 1. Core Visual Philosophy

### 1.1 Flat Component Style — Zero Shadows
- **Prohibition of Drop Shadows**: In Dark Mode, drop shadows (`box-shadow`, `drop-shadow-*`, `shadow-md`, `shadow-lg`) are visually ineffective, create muddy edges, and are strictly prohibited.
- **Pure Flat Surfaces**: All cards, modals, buttons, tables, and dropdowns use clean flat fills, 1px subtle borders (`border-white/10` or `border-zinc-800`), or subtle surface luminance distinctions.

### 1.2 Depth & Elevation via Surface Luminance
In Dark Mode, visual hierarchy and elevation are expressed strictly through **surface lightness**, where elements closer to the user appear lighter:

| Elevation Level | Token Name | Hex Value | Usage |
| :--- | :--- | :--- | :--- |
| **Level 0 (Canvas)** | `--surface-canvas` | `#0E0E10` (or `#121212`) | Viewport body, main document canvas |
| **Level 1 (Subsurface)** | `--surface-card` | `#161619` (or `#18181B`) | Cards, sidebar, data tables, headers |
| **Level 2 (Elevated)** | `--surface-panel` | `#202024` (or `#27272A`) | Modals, flyouts, dropdown menus, popovers |
| **Level 3 (Interactive)** | `--surface-active` | `#2E2E33` (or `#3F3F46`) | Hover states, active tabs, selected rows |

### 1.3 Canvas Background Rule — Never `#000000`
- **Strict `#000000` Canvas Prohibition**: Under no circumstances should solid `#000000` be used as the page canvas or viewport background in Dark Mode.
- **Approved Canvas Tones**:
  - `#0E0E10` (Dark Obsidian, default)
  - `#121212` (Material Dark default)
  - `#0B0B0C` (Deep Slate Gray)
- **Permitted `#000000` Usage**: Only permitted for high-contrast text on light surfaces when in Light Mode.

### 1.4 Dual Theme Architecture — Option for Users
- **Persistent Theme Toggle**: The application must provide a persistent theme selection control (Dark / Light / System auto-detect) powered by CSS custom properties and `next-themes`.
- **System Synchronization**: Honors `prefers-color-scheme` automatically while persisting explicit user selection in `localStorage` and cookies to avoid hydration flashes.

### 1.5 Saturation Limits on Dark Surfaces
- **Vibration Prevention**: High-saturation neon colors vibrate against dark backgrounds and cause visual fatigue.
- **Tone Restriction (200–500 Scale)**: All accent, semantic, and status colors on dark surfaces must stay within the 200–500 luminance range:
  - Success: `emerald-400` (`#34D399`) / `green-400` (`#4ADE80`)
  - Warning: `amber-400` (`#FBBF24`)
  - Danger / Error: `rose-400` (`#FB7185`) / `red-400` (`#F87171`)
  - Info / Primary: `sky-400` (`#38BDF8`) / `blue-400` (`#60A5FA`)
  - Neutral Accent: `zinc-400` (`#A1A1AA`)

### 1.6 Pure White Text Avoidance & Font Weights
- **No Harsh `#FFFFFF` Text**: Avoid 100% pure white (`#FFFFFF`) on dark backgrounds across paragraphs and body text. High contrast creates visual strain and halation.
- **Softened Text Tones**:
  - Primary Headings / Titles: `#F4F4F5` (`zinc-100`)
  - Body Text / Labels: `#E4E4E7` (`zinc-200`)
  - Secondary Text / Meta: `#A1A1AA` (`zinc-400`)
  - Muted / Disabled: `#71717A` (`zinc-500`)
- **Lighter Font Weights**: Fonts appear heavier on dark backgrounds due to optical pixel bleed. Use `font-normal` (400) or `font-medium` (500) rather than heavy bold (`font-bold`, 700) for body and UI elements.

---

## 2. Mathematical Design Token Specifications

All layout, typography, radius, and spacing parameters must adhere to these mathematical formulas:

### 2.1 Nested Corner Radii
$$\text{Inner Radius} = \max(0, \text{Outer Radius} - \text{Padding})$$
*Example*: Container with `rounded-2xl` (16px) and `p-2` (8px padding) requires inner children to have `rounded-lg` (8px radius) to prevent awkward corner distortion.

### 2.2 Line Height
$$\text{Line Height} = \text{Font Size} \times (1.4 \text{ to } 1.6)$$
*Example*:
- `14px` text $\to$ `20px` to `22px` line height (`leading-relaxed`).
- `16px` text $\to$ `24px` line height (`leading-normal`).
- `20px` text $\to$ `28px` to `30px` line height.

### 2.3 Typographic Scale
$$\text{Size}_{n+1} = \text{Size}_n \times 1.25 \quad (\text{Major Third Scale})$$
- Caption / Sub-micro: `10px`
- Secondary / Badges: `12px`
- Body Regular: `14px`
- Body Emphasized / Lead: `16px`
- Subheading / Section Title: `20px`
- Page Heading: `25px`
- Modal / Feature Title: `32px`
- Hero / Display: `40px`

### 2.4 Spacing Scale
All margins, paddings, gaps, and component heights must strictly resolve to multiples of **4px or 8px**:
`[4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px]`

### 2.5 Touch Target Size
$$\text{Width} \ge 44\text{px}, \quad \text{Height} \ge 44\text{px}$$
- All buttons, icon action triggers, pagination buttons, table action triggers, and mobile form inputs must maintain a minimum bounding tap area of `44 × 44px` (using transparent hit-slop padding if visually smaller).

### 2.6 Optical Alignment
- Visual elements with asymmetrical weight (e.g. play triangle icons, right-facing chevrons, rounded badge counts) must be optically centered by adjusting padding by `+1px` to `+2px` on the lighter side to counteract perceptual weight imbalance.

### 2.7 Color Contrast Formula (WCAG 2.1 AA)
$$\text{Contrast Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05} \ge 4.5:1 \quad (\text{Normal Text})$$
$$\text{Contrast Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05} \ge 3.0:1 \quad (\text{Large Text \& UI Components})$$

---

## 3. Frontend Architecture & Folder Structure (`apps/frontend/`)

The Next.js App Router frontend organizes into modular slices that mirror the backend domain architecture, ensuring seamless future changes and workflow skill integrations:

```
apps/frontend/
├── app/                              # Next.js App Router (Routes & Layouts)
│   ├── (auth)/                       # Authentication Route Group
│   │   ├── login/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/                  # Authenticated Admin & Staff Dashboard
│   │   ├── layout.tsx                # App Shell (Sidebar, TopBar, ThemeProvider)
│   │   ├── classes/page.tsx          # Pillar 2: Class Management
│   │   ├── attendance/page.tsx       # Pillar 3: Attendance Tracking
│   │   ├── scores/page.tsx           # Pillar 4: Grade Management
│   │   ├── reports/page.tsx          # Academic & Document Reports
│   │   ├── students/page.tsx         # Student Directory
│   │   ├── finance/page.tsx          # Tuition Fees & Ledger
│   │   └── settings/page.tsx         # System Configuration & Preferences
│   ├── (public)/                     # Public Verification & Landing
│   │   └── verify/page.tsx           # Public Verification Portal
│   ├── layout.tsx                    # Root Layout (Font, Theme Script, Providers)
│   └── globals.css                   # Tailwind Base + Theme CSS Custom Properties
│
├── components/                       # Shared Presentation Components
│   ├── ui/                           # Flat Atomic Primitives (Zero Shadow)
│   │   ├── button.tsx                # 44x44px touch target, flat elevation
│   │   ├── card.tsx                  # Flat surface-card, 1px border-white/10
│   │   ├── input.tsx                 # Flat surface-canvas background, 44px
│   │   ├── dialog.tsx                # Flat surface-panel modal overlay
│   │   ├── tabs.tsx                  # Flat pill tabs with active surface
│   │   ├── badge.tsx                 # 200-500 desaturated semantic pill
│   │   └── theme-toggle.tsx          # Dark/Light mode switcher
│   ├── layout/                       # Structural Shell Components
│   │   ├── topbar.tsx                # Header bar, branch selector, user profile
│   │   ├── sidebar.tsx               # Primary navigation with active indicators
│   │   └── breadcrumbs.tsx           # Hierarchical navigation trail
│   └── shared/                       # Composite Reusable Widgets
│       ├── data-table.tsx            # Multi-tenant scoped table with pagination
│       ├── metric-card.tsx           # KPI metric card with trend indicator
│       ├── empty-state.tsx           # Zero-data illustrative placeholder
│       └── optical-icon.tsx          # Optically aligned icon wrapper
│
├── features/                         # Modular Domain Feature Slices (Match Backend)
│   ├── classes/                      # Class Management Feature Slice
│   │   ├── components/               # ClassTable, ClassHeader, ScheduleGrid
│   │   ├── hooks/                    # useClasses, useClassDetails
│   │   └── api.ts                    # REST client calls to /api/v1/classes
│   ├── attendance/                   # Attendance Tracking Feature Slice
│   │   ├── components/               # AttendanceSheet, RollCallGrid, Matrix
│   │   ├── hooks/                    # useAttendance, useMonthlySummary
│   │   └── api.ts                    # REST client calls to /api/v1/attendance
│   ├── scores/                       # Grade Management Feature Slice
│   │   ├── components/               # ScoreMatrix, BatchEntryRow, GradeReport
│   │   ├── hooks/                    # useScores, useBatchGradeSave
│   │   └── api.ts                    # REST client calls to /api/v1/scores
│   └── reports/                      # Academic & Official Documents Slice
│       ├── components/               # ReportCenter, CertificateViewer
│       ├── hooks/                    # useReports, useTermResults
│       └── api.ts                    # REST client calls to /api/v1/term-results
│
├── hooks/                            # Global Shared Hooks
│   ├── use-theme.ts                  # Theme mode and listener hook
│   ├── use-debounce.ts               # Search input debouncing
│   └── use-media-query.ts            # Viewport responsive breakpoint hook
│
├── lib/                              # Core Utility Functions
│   ├── utils.ts                      # cn() class merge utility
│   ├── tokens.ts                     # Mathematical token calculation helpers
│   ├── contrast.ts                   # WCAG contrast ratio validators
│   └── env.ts                        # Client & Server environment validator
│
└── styles/                           # Global Design Tokens
    ├── tokens.css                    # Surface luminance and radius CSS variables
    └── themes.css                    # [data-theme="dark"] and [data-theme="light"]
```

---

## 4. Operational Guardrails

- **Skill Only Mode**: This skill defines the standards for future frontend development and UI redesign tasks.
- **Zero Premature Modification**: Do NOT modify existing UI files, components, or styling until explicitly commanded by the user.
- **Strict Adherence Upon Command**: When the user gives the direct command to apply these frontend dark UI standards, all new components and refactored views must follow this skill 100% without exception.
