---
name: snp-sms-design-standards
description: >-
  Authoritative enterprise design system and Dark UI specification for SNP-SMS.
  Enforces single-folder design architecture, flat component design without shadows,
  depth via surface luminance hierarchy, #000000 avoidance, dual theme support,
  desaturated 200-500 color tones, eye-friendly typography, 44x44px touch targets,
  mathematical design tokens, and the 10 Core UI Components guide (10-ui-components.md).
---

# SNP-SMS Design Standards & Dark UI Specification

This skill is the single authoritative design standard and architectural specification for all frontend user interfaces, Dark UI standards, and component implementations in the SNP-SMS repository.

---

## 1. Single Folder Design Architecture

All design standards, specifications, and component guides must strictly reside within this single skill folder:
- **Root Skill**: `.agents/skills/snp-sms-design-standards/SKILL.md`
- **10 Core UI Components Guide**: `.agents/skills/snp-sms-design-standards/10-ui-components.md`
- **Living Interface Animation Manual**: `.agents/skills/snp-sms-design-standards/living-interface-animation-manual.md` (The 12 Principles of Animation, <300ms timing rule, and Motion standards)
- **Modern CSS Pseudo-Elements Manual**: `.agents/skills/snp-sms-design-standards/modern-css-pseudo-elements-manual.md` (::before/::after hit targets, View Transitions API, native dialog ::backdrop)
- **Easing Curves vs. Springs Guide**: `.agents/skills/snp-sms-design-standards/eases-vs-springs-guide.md` (User Reacting vs System Speaking, Interaction Roles, Bézier vs Spring Physics, <300ms timing rule)
- **Interface Sound Design Manual**: `.agents/skills/snp-sms-design-standards/interface-sound-design-manual.md` (Auditory speed advantage 25ms vs 250ms, complementary accessibility, interaction audio matrix, Web Audio API synthesis)
- **Procedural Audio Synthesis Manual**: `.agents/skills/snp-sms-design-standards/ai-sound-synthesis-manual.md` (Waveform primitives, bandpass noise clicks, exponential envelopes, zero-asset UI sound libraries)
- **Morphing Icons Specification**: `.agents/skills/snp-sms-design-standards/morphing-icons-specification.md` (Universal 3-line SVG invariant, collapsed invisible anchors, rotational groups, zero-DOM-churn transitions)
- **Animating Container Bounds Manual**: `.agents/skills/snp-sms-design-standards/animating-container-bounds-manual.md` (Two-div measurement/animation separation, zero-dependency useMeasure hook, mount zero-guard)
- **Laws of UX Psychology Manual**: `.agents/skills/snp-sms-design-standards/laws-of-ux-psychology-manual.md` (Fitts's Law, Hick's Law, Miller's Law, Doherty Threshold <400ms, Postel's Law)
- **Mastering Animate Presence Manual**: `.agents/skills/snp-sms-design-standards/mastering-animate-presence-manual.md` (Presence lifecycle, useIsPresent, usePresence safeToRemove async exits, propagate, sync/wait/popLayout modes)
- **Sidebar Architecture Manual**: `.agents/skills/snp-sms-design-standards/sidebar-design-manual.md` (Header, quick action pills, nested groups, count badges, sticky positioning)
- **Color Theory Standards Manual**: `.agents/skills/snp-sms-design-standards/color-theory-manual.md` (60-30-10 rule, functional palettes, accessible contrast, emotional psychology)
- **Button Design System Manual**: `.agents/skills/snp-sms-design-standards/button-design-system-manual.md` (4 states, 3 variants, 44x44px touch targets, full-width mobile CTAs)
- **Scroll Patterns Manual**: `.agents/skills/snp-sms-design-standards/scroll-patterns-manual.md` (9 core patterns: sticky, scroll snap, scroll driven, parallax, infinite scroll)
- **Profile Settings Manual**: `.agents/skills/snp-sms-design-standards/profile-settings-manual.md` (8 UX principles, categorization, universal icons, instant search filtering)
- **Dark Mode Elevation Manual**: `.agents/skills/snp-sms-design-standards/dark-mode-elevation-manual.md` (5-level elevation ladder, surface lightness, 87/60/38 typography ratios)
- **Linear Blur Glassmorphism Manual**: `.agents/skills/snp-sms-design-standards/linear-blur-glassmorphism-manual.md` (Progressive multi-layer blur, subtle borders, luminance highlights)
- **Production Deploy Checklist**: `.agents/skills/snp-sms-design-standards/production-deploy-checklist.md` (20-point pre-launch quality gate: responsiveness, SEO, a11y, CWV)
- **Foundational UX/UI Laws Manual**: `.agents/skills/snp-sms-design-standards/ux-ui-laws-manual.md` (Jakob's, Fitts's, Miller's, Hick's, Proximity, and Tesler's Laws)
- **Interactive Effects Catalog**: `.agents/skills/snp-sms-design-standards/interactive-effects-manual.md` (18+ effect styles: kinetic hook, gravity drop, NLE timeline, jiggle delete)
- **System Architecture Lexicon**: `.agents/skills/snp-sms-design-standards/system-architecture-lexicon.md` (1,111 concepts: systems, concurrency, cryptography, LLM, and AI agents)
- **Universal AI Agent Prompt Manual**: `.agents/skills/snp-sms-design-standards/universal-ai-agent-prompt-manual.md` (Procedural prompt synthesis, [Preview | Prompt] tabs, 1-click copy action, MVP component blueprints)
- **Precision Line Tracker Navigation Manual**: `.agents/skills/snp-sms-design-standards/line-tracker-navigation-manual.md` (Dotless continuous vertical rail, active indicator segment, zero-scrollbar standard)
- **Icon Bar & Blueprint Grid Manual**: `.agents/skills/snp-sms-design-standards/icon-bar-toolbar-manual.md` (54px horizontal toolbar, label bloom reveal, status dot indicator, roving tabindex, r4 radii, 44px banner suite)

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
👉 [**10-ui-components.md**](file:///Users/Apple16/Desktop/SNP-SMS/.agents/skills/snp-sms-design-standards/10-ui-components.md)

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

---

## 6. Subdomain Custom Font Architecture (Docs & Library Isolated)

To apply custom brand fonts to documentation and component library surfaces without polluting the main application:

- **Primary Font Storage**: `apps/frontend/app/document/fonts/` (e.g. `sora.woff2`)
- **Public Static Fallback**: `apps/frontend/public/fonts/docs/`
- **Scoped Loader Pattern (`apps/frontend/app/document/layout.tsx`)**:
  ```tsx
  import localFont from 'next/font/local';

  const docsSora = localFont({
    src: './fonts/sora.woff2',
    variable: '--font-docs-sora',
    display: 'swap',
  });

  export default function DocumentLayout({ children }: { children: React.ReactNode }) {
    return (
      <div
        className={docsSora.variable}
        style={{
          fontFamily: 'var(--font-docs-sora), ui-sans-serif, system-ui, sans-serif',
          ['--font-sans' as string]:
            'var(--font-docs-sora), ui-sans-serif, system-ui, sans-serif',
        }}
      >
        {children}
      </div>
    );
  }
  ```
- **Brand Blueprint Palette**:
  - `01 Royal Blue`: `#0056FF` (Hero Brand Accent)
  - `02 Azure Blue`: `#2277FF` (Interactive Links)
  - `03 Black`: `#000000` (High-Contrast Canvas)
  - `04 Soft Lavender`: `#E3E7FC` (Surface Tint & Badges)
  - `05 White`: `#FFFFFF` (Card Containers)
  - `Gradient 1 (Futurewave)`: `#2277FF` via `#5C93FF` to `#AEC2FF`
  - `Gradient 2 (Midnight Surge)`: `#000B26` via `#002D8A` to `#0056FF`
- **Zero Real Frontend Impact**: All admin dashboard routes (`/(dashboard)/*`) continue referencing Google Sans and system font stacks in `globals.css`.

---

## 7. Mathematical Design Specifications & Token Formulations

To ensure optical balance, mathematical harmony, and enterprise consistency across all components:

### 7.1 Border Radius Formula
Nested elements must maintain concentric curvature so that inner corners do not collide or look distorted:
$$\text{Inner Radius} = \text{Outer Radius} - \text{Padding}$$
- *Example*: Card outer radius = `24px`, internal padding = `8px` $\implies$ Inner button radius = `16px`.
- *Example*: Button outer radius = `12px`, internal icon padding = `4px` $\implies$ Inner icon badge radius = `8px`.

### 7.2 Typography & Scale Rules
- **Line Height**: $\text{Line Height} = \text{Font Size} \times (1.4 \text{ to } 1.6)$ (Body 16px uses 24px line-height).
- **Type Scale Ratio**: $\text{Current Size} \times 1.25$ (Major Third progression: 12px, 15px, 18.75px, 23.4px, 29.3px, 36.6px).
- **Spacing Scale**: Multiples of $4\text{px}$ or $8\text{px}$ (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`).
- **Touch Target Size**: Minimum $44 \times 44\text{px}$ bounding box for all interactive controls (using `::before` pseudo-element expansion for visually compact triggers).
- **Color Contrast Formula**:
  $$\text{Contrast Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}$$
  Enforce WCAG 2.1 AA compliance: $\ge 4.5:1$ for standard body text, $\ge 3.0:1$ for large text ($\ge 18\text{pt}$ or bold $\ge 14\text{pt}$) and active UI boundaries.

### 7.3 The 60-30-10 Color Balance System
- **60% Dominant (Canvas & Background)**: Deep obsidian canvas (`#0E0E10` or `#121212`) establishing visual calm.
- **30% Secondary (Cards & Structure)**: Elevated surfaces (`#161619` / `#1E1E1E`), sidebars, tables, and borders.
- **10% Accent (Action & Focus)**: Information Blue (`#2563EB`), Emerald Green (`#059669`), or Signal Gold (`#D97706`) reserved strictly for CTAs, selected tabs, active indicators, and status badges.

### 7.4 Dark Mode Elevation Ladder
Elevation is expressed through progressive surface lightness overlay rather than shadows:
- **0dp (Canvas Background)**: `#121212` (0% white overlay)
- **1dp (Cards & Tables)**: `#1E1E1E` (5% white overlay)
- **4dp (Elevated Modals & Popovers)**: `#272727` (9% white overlay)
- **8dp (Navigation Menus & Sheets)**: `#2E2E2E` (12% white overlay)
- **24dp (Dialogs & Tooltips)**: `#383838` (16% white overlay)

### 7.5 Typography Contrast Ratios in Dark Mode
To prevent visual fatigue and halo glare, avoid `#FFFFFF` for continuous reading:
- **High Emphasis Text (Headings, Active Labels)**: 87% White (`#E0E0E0` / `text-zinc-100`)
- **Medium Emphasis Text (Body, Descriptions)**: 60% White (`#A0A0A0` / `text-zinc-400`)
- **Disabled & Decorative Text (Hints, Icons)**: 38% White (`#6C6C6C` / `text-zinc-600`)


