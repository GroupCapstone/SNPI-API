---
name: snp-sms-design-standards
description: >-
  Authoritative enterprise design system and Dark UI specification for SNP-SMS.
  Enforces single-folder design architecture, flat component design without shadows,
  depth via surface luminance hierarchy, #000000 avoidance, dual theme support,
  desaturated 200-500 color tones, eye-friendly typography, 44x44px touch targets,
  mathematical design tokens, and the 10 Core UI Components guide (I. 10 UI components.md).
---

# SNP-SMS Design Standards & Dark UI Specification

This skill is the single authoritative design standard and architectural specification for all frontend user interfaces, Dark UI standards, and component implementations in the SNP-SMS repository.

---

## 1. Single Folder Design Architecture

All design standards, specifications, and component guides must strictly reside within this single skill folder:
- **Root Skill**: `.agents/skills/snp-sms-design-standards/SKILL.md`
- **10 Core UI Components Guide**: `.agents/skills/snp-sms-design-standards/I. 10 UI components.md`

Do not fragment design rules across multiple folders. Maintain all design documentation in this single location.

---

## 2. Core Dark UI Visual Philosophy

### 2.1 Avoid Shadows — Pure Flat Style
* **Strict Prohibition of Drop Shadows**: In Dark Mode, drop shadows (`box-shadow`, `drop-shadow-*`, `shadow-md`, `shadow-lg`) blur into dark backgrounds, creating muddy and unreadable edges. Under no circumstances should drop shadows be used in Dark Mode.
* **Flat Components**: All cards, sheets, dialogs, buttons, tables, and dropdowns adopt a crisp, modern flat style (`shadow-none`).
* **Keyline Borders**: Separate flat surfaces using subtle 1px border keylines (`border-white/10` or `border-zinc-800`).

### 2.2 Consider Depth — Surface Luminance Elevation
Elevation in Dark Mode is expressed strictly through **surface lightness**, where components closer to the user are rendered in lighter tones to provide natural visual hierarchy:

| Elevation Level | Token Name | Hex Value | Semantic Usage |
| :--- | :--- | :--- | :--- |
| **Level 0 (Canvas)** | `--surface-canvas` | `#0E0E10` (or `#121212`) | Viewport body, main document canvas |
| **Level 1 (Subsurface)** | `--surface-card` | `#161619` (or `#18181B`) | Cards, sidebar, data tables, top headers |
| **Level 2 (Elevated)** | `--surface-panel` | `#202024` (or `#27272A`) | Modals, bottom sheets, snackbars, dropdowns |
| **Level 3 (Interactive)** | `--surface-active` | `#2E2E33` (or `#3F3F46`) | Hover states, active tabs, tooltips, switches |

### 2.3 Don't Use `#000000` for Canvas
* **Prohibition on Canvas**: Never use pure black (`#000000`) as the document or canvas background of a Dark UI. Pure black creates jarring contrast, eye strain, and causes OLED motion smearing.
* **Approved Canvas Tones**:
  * `#0E0E10` (Dark Obsidian, default)
  * `#121212` (Material Dark standard)
  * `#0B0B0C` (Deep Slate Gray)
* **Permitted `#000000` Usage**: Only permitted for high-contrast typography on pure white surfaces in Light Mode.

### 2.4 Option for Users — Dual Theme Support
* **User Preference Choice**: The interface must always give users the choice to select their preferred theme (Dark Mode, Light Mode, or System Auto-Detect).
* **Flicker-Free Theme Toggling**: Powered by synchronized `data-theme` and `dark` classes on `<html>`, persisted via `localStorage.getItem('snp-theme')`, and initialized via inline `<head>` script prior to first paint.

### 2.5 Limit Saturation — 200 to 500 Scale Only
* **Contrast Damage Prevention**: Saturated, electric neon colors vibrate against dark backgrounds and damage readability.
* **Tone Confinement (200–500 Scale)**: All semantic status and accent colors on dark surfaces must stay strictly within the 200–500 range:
  * **Success**: `emerald-400` (`#34D399`) or `emerald-500` (`#10B981`)
  * **Warning**: `amber-400` (`#FBBF24`)
  * **Danger / Error**: `rose-400` (`#FB7185`) or `rose-500` (`#F43F5E`)
  * **Info / Primary**: `sky-400` (`#38BDF8`) or `sky-500` (`#0EA5E9`)
  * **Neutral Accent**: `zinc-400` (`#A1A1AA`)

### 2.6 Avoid Pure White for Body Text — Lighter Font Weights
* **Halation Prevention**: Contrast between pure black and pure white strains the eyes. Soften text to prevent visual halation:
  * Headings: `#F4F4F5` (`zinc-100`)
  * Body Text: `#E4E4E7` (`zinc-200`)
  * Secondary / Meta: `#A1A1AA` (`zinc-400`)
  * Muted / Placeholder: `#71717A` (`zinc-500`)
* **Lighter Font Weights**: Fonts appear optically thicker and heavier in dark mode due to white pixel bleed. Use `font-normal` (400) or `font-medium` (500) rather than heavy bold weights for body text.

---

## 3. Mathematical Design Token Specifications

All spacing, typography, radii, and interactive target parameters must strictly follow these mathematical formulas:

### 3.1 Inner Radius Formula
$$\text{Inner Radius} = \max(0, \text{Outer Radius} - \text{Padding})$$
*Example*: A card with `rounded-2xl` (16px outer radius) and `p-2` (8px padding) requires inner elements to have `rounded-lg` ($16 - 8 = 8\text{px}$) for concentric, optical harmony.

### 3.2 Line Height Formula
$$\text{Line Height} = \text{Font Size} \times (1.4 \text{ to } 1.6)$$
* `14px` text $\to$ `20px` to `22px` (`leading-relaxed`)
* `16px` text $\to$ `24px` (`leading-normal`)
* `20px` text $\to$ `28px` to `30px`

### 3.3 Font Size Scale Formula
$$\text{Size}_{n+1} = \text{Size}_n \times 1.25 \quad (\text{Major Third Scale})$$
`[10px, 12px, 14px, 16px, 20px, 25px, 32px, 40px]`

### 3.4 Spacing Scale
All margins, paddings, gaps, and component heights must strictly resolve to multiples of **4px or 8px**:
`[4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px]`

### 3.5 Touch Target Size
$$\text{Width} \ge 44\text{px}, \quad \text{Height} \ge 44\text{px}$$
All interactive buttons, chips, switches, inputs, and icon triggers must provide at least `44 × 44px` physical hit area.

### 3.6 Optical Alignment
Practice-based optical balancing: asymmetrical icons (e.g. play arrows, right chevrons, rounded badge counts) must be optically centered by applying `+1px` to `+2px` padding on the lighter side.

### 3.7 Color Contrast Formula
$$\text{Contrast Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05} \ge 4.5:1 \quad (\text{WCAG AA})$$
Where $L_1$ is the relative luminance of the lighter color and $L_2$ is the relative luminance of the darker color.

---

## 4. Extensible UI Components Library Architecture

The component definitions, etymology, real-world paradigms, and flat styling are codified in:
👉 [**I. 10 UI components.md**](file:///Users/Apple16/Desktop/SNP-SMS/.agents/skills/snp-sms-design-standards/I.%2010%20UI%20components.md)

Components are organized into an extensible categorization system without fixed count limitations:
- **Feedback & Overlays**: Snackbar, Bottom Sheet, Dialog, Tooltip
- **Actions**: Floating Action Button (FAB), Chip, Toggle Switch
- **Selection**: Dropdown, Checkbox, Radio, Select
- **Navigation**: Bottom Nav
- **Layout & Containers**: Card

As new UI components are created, they are added directly to the component registry (`component-registry.tsx`) and displayed in the categorized developer library.

---

## 5. Live Interactive Showcase & Developer Library First Protocol

- **Public Design System Library Route**: `/document/design-system`
- **Developer Documentation Integration**: Accessible directly from `/document` (Header navigation, sidebar, and table of contents).
- **Mandatory Prototyping Sandbox**: All new UI components, dark mode variants, and layouts must be prototyped and demoed in this developer library first.
- **Strict Prohibition on Real Frontend**: Do NOT touch or apply new designs to the real frontend (`/(dashboard)/*`, `apps/frontend/components/`, `globals.css`) until the user explicitly inspects the developer library demo and commands application.
- **Immediate Revert Gate**: Any changes applied to real frontend prior to explicit user command must be reverted immediately.
