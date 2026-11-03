# Culinary Component Taxonomy Architecture

## Executive Summary & Architectural Overview

The SNP-SMS Design System employs a 6-tier culinary component taxonomy—an evolution of Brad Frost's Atomic Design adapted for modern enterprise TypeScript/React monorepos. By structuring user interface elements along a strict dependency progression from **Ingredients** to the **Cookbook**, the design system ensures zero circular dependencies, high testability, seamless component composition, and enterprise maintainability.

```
+-------------------------------------------------------------------------+
|                              06. COOKBOOK                               |
|        Design System Governance, Maintenance SLAs & Quality Gates       |
+-------------------------------------------------------------------------+
                                    |
+-------------------------------------------------------------------------+
|                               05. PAGES                                 |
|       Production Screens with Live APIs, Backend Models & RBAC          |
+-------------------------------------------------------------------------+
                                    |
+-------------------------------------------------------------------------+
|                             04. TEMPLATES                               |
|       Layout Scaffolds, Responsive Rails, Grid Panes & Safety Insets    |
+-------------------------------------------------------------------------+
                                    |
+-------------------------------------------------------------------------+
|                              03. ENTREES                                |
|       Compound Organisms: Data Tables, Modals, Nav Bars, Form Cards     |
+-------------------------------------------------------------------------+
                                    |
+-------------------------------------------------------------------------+
|                              02. RECIPES                                |
|       Atomic UI Primitives: Buttons, Inputs, Switches, Badges, Links    |
+-------------------------------------------------------------------------+
                                    |
+-------------------------------------------------------------------------+
|                            01. INGREDIENTS                              |
|       Design Tokens: Colors, Typography Scales, Spacing, Motion, SVGs   |
+-------------------------------------------------------------------------+
```

---

## 1. The 6 Architectural Tiers

### Tier 01: Ingredients (Tokens & Atoms)
- **Role**: Pure, irreducible design constants and raw assets.
- **Concept**: The foundational building blocks of the visual language. An ingredient possesses zero business logic, zero layout orchestration, and cannot be decomposed into smaller units without losing semantic meaning.
- **Artifacts**:
  - Color Ramps & Semantic Tokens: `#0056FF` (Royal Brand Blue), `#0A1A4A` (Deep Slate Navy), `#CAD3F5` (Keyline Border).
  - Typography Scales: Google Sans 36px/30px/24px/16px/14px/12px, font-mono line-heights.
  - Spacing Increments: 4px mathematical grid (`xs: 4px`, `sm: 8px`, `md: 16px`, `lg: 24px`, `xl: 32px`).
  - Elevation & Z-Index Tokens: `shadow-2xs`, `shadow-xs`, `z-10` to `z-50` layer stack.
  - Motion Curves: `cubic-bezier(0.16, 1, 0.3, 1)` ease-out, `150ms-300ms` duration ceilings.
  - Iconography: Material Symbols Outlined, 24px default viewport, stroke-width 2.0.
- **Checklist Mapping**: Foundations (`0/26` verification checks: Color 0/4, Layout 0/4, Typography 0/5, Elevation 0/3, Motion 0/3, Iconography 0/7).
- **Mandatory Invariants**:
  - Irreducible: Must not import or embed other components.
  - Stateless: Must be plain serializable values or SVG vectors.
  - Single Source of Truth: Defined in Tailwind configs, CSS custom properties, or token JSON.

### Tier 02: Recipes (Atomic UI Primitives)
- **Role**: Single-purpose, reusable UI primitives.
- **Concept**: A specific, focused combination of ingredients (e.g. padding token + border token + color token + typography token + SVG icon) that produces a standalone interactive control with one singular responsibility.
- **Artifacts**:
  - `Button`: Default, Primary, Destructive, Subtle, Link variants with focus rings and state layers.
  - `Text field`: Single-line input with clear button, prefix icon, and error validation states.
  - `Input radio`: Radio circle with linked accessible label and keyboard arrow navigation.
  - `Switch`: Tactile binary toggle with immediate state change and keyboard trigger.
  - `Checkbox`: Tri-state square (checked, unchecked, indeterminate) with accessible click target.
  - `Badge`: Metadata pill tag (New, Updated, Coming, Completed).
  - `Avatar`: Circular representation with image, fallback initials, and status dot.
  - `Tooltip`: Floating helper bubble anchored to trigger element via `aria-describedby`.
  - `Link`: Accessible anchor with hover underline transition and external icon decorator.
  - `Divider`: Hairline keyline separator with optional centered text label.
- **Checklist Mapping**: Core Components (`0/166` checks - Primitive/Atomic tier).
- **Mandatory Invariants**:
  - Atomic Scope: Serves exactly one interactive or visual task.
  - Framework Agnostic UI: Fully accessible via keyboard navigation and WCAG AA contrast.
  - Zero API Coupling: Driven strictly by React props and callbacks without direct fetches.

### Tier 03: Entrees (Compound Components & Organisms)
- **Role**: Multi-component structures that solve end-to-end user workflows.
- **Concept**: A complete, self-contained functional organism constructed by composing multiple recipes. Solves an end-to-end user interaction pattern, such as data browsing, filtering, confirmation dialogs, or notification stacking.
- **Artifacts**:
  - `Data Table`: Composes table head, sortable columns, row selection checkboxes, bulk action bar, and pagination.
  - `Modal Dialog`: Composes scrim backdrop, focus trap, title header, close button, scrollable body, and action buttons.
  - `Dropdown Menu`: Composes anchor trigger button, floating popover panel, search input, and selectable item list.
  - `Navigation Bar / Rail`: Composes logo, route links, count badges, user avatar, and active indicator bar.
  - `Accordion`: Composes collapsible trigger headers, chevron icons, and animated content panels.
  - `Toast Stack`: Composes notification queue, auto-dismiss timers, priority colors, and undo action buttons.
  - `Search Filter Bar`: Composes search input, filter chips, popover date pickers, and clear CTA.
- **Checklist Mapping**: Core Components (`0/166` checks - Compound/Organism tier).
- **Mandatory Invariants**:
  - Containment: Manages internal composite focus, keyboard traversal, and roving tab indexes.
  - Slot Architecture: Exposes semantic slots (`header`, `content`, `footer`, `actions`) for extensibility.
  - Controlled & Uncontrolled Modes: Supports controlled state overrides with fallback internal state.

### Tier 04: Templates (Layout Scaffolds & Page Shells)
- **Role**: Structural wireframes that arrange entrees and recipes across screen viewports.
- **Concept**: Defines how structural elements—Top App Bars, Side Rails, Navigation Drawers, Content Panes, and Floating Actions—reflow responsively across device breakpoints without dynamic application data.
- **Artifacts**:
  - `Dashboard Scaffold`: Fixed top header + collapsible side navigation rail + fluid 12-column content canvas.
  - `Settings Master-Detail`: 320px left navigation pane + right configuration form pane.
  - `Split Screen View`: 50/50 dual pane layout for side-by-side editing and previewing.
  - `Full-Bleed Media Layout`: Hero header + 840px max-width constrained reading column.
  - `Modal Form Template`: Centered modal dialog shell with fixed header and sticky bottom action bar.
- **Checklist Mapping**: Section 05: Material Design 3 Layout Scaffold Architecture (Compact, Medium, Expanded, Large, Extra Large).
- **Mandatory Invariants**:
  - Content Agnostic: Accepts components via slots; contains zero hardcoded student, teacher, or billing records.
  - Responsive Reflow: Seamlessly adapts navigation drawers (mobile) to side rails (desktop).
  - Safe Insets: Respects system status bars, dynamic islands, and desktop window borders.

### Tier 05: Pages (Production Real-World Views)
- **Role**: Fully instantiated concrete screens with live backend data and business logic.
- **Concept**: The final destination for users. Integrates dynamic database models, user authentication, role-based access control (RBAC), API error handling, and business state into templates.
- **Artifacts**:
  - `Campus Analytics Hub`: Real-time student enrollment metrics, lab utilization, and network latency statistics.
  - `Student Lifecycle Portal`: Student admission review, KYC verification, document uploads, and identity cards.
  - `Tuition Billing & Checkout`: Dynamic KHQR QR code generation, fee calculation, and receipt generation.
  - `Attendance Management`: Barcode scanner integration, classroom roster grid, and absence approvals.
  - `Examination & Gradebook`: Marks entry tables, distribution curves, and transcript issuance.
- **Checklist Mapping**: Production Full-Stack SNP-SMS Applications (Admin, Teacher, Student, Parent).
- **Mandatory Invariants**:
  - State Complete: Handles loading skeleton, empty states, error boundaries, and optimistic updates.
  - Security Guarded: Enforces authentication and authorization checks prior to data rendering.
  - Fully Localized: Employs Khmer & English internationalization tokens without hardcoded English strings.

### Tier 06: Cookbook (The Complete Design System)
- **Role**: Master governance handbook, token registry, and maintenance standards.
- **Concept**: The overarching operational framework that governs how all ingredients, recipes, entrees, templates, and pages are authored, tested, versioned, and maintained.
- **Artifacts**:
  - Brand Blueprint: Vision, Principles, Tone of Voice, Terminology, Assets (5/5 Completed).
  - Design Guidelines: Accessibility (WCAG 2.1 AA), Writing, Microcopy, Terminology, i18n (0/5).
  - Foundations: 26 token checks for Color, Layout, Typography, Elevation, Motion, Icons (0/26).
  - Core Components Manual: 166 verification checks across 29 primitives with live interactive demos (0/166).
  - Maintenance Manual: 28 checks across Documentation, Local libs, Team processes, Community, RFCs (0/28).
  - Quality Gates: Semantic versioning, pre-push verification gates, zero-emoji policy, and browser compatibility matrices.
- **Checklist Mapping**: The Complete 4-Phase Open-Source Design System Checklist (230 total verification checkpoints).

---

## 2. Dependency Hierarchy & Import Rules

To prevent circular dependencies and spaghetti architecture, components MUST strictly adhere to one-way downward imports:

```
Cookbook  ->  Imports Guidelines, Foundations, Components & Maintenance
Pages     ->  Imports Templates, Entrees, Recipes, Ingredients
Templates ->  Imports Entrees, Recipes, Ingredients (NEVER Pages)
Entrees   ->  Imports Recipes, Ingredients (NEVER Templates or Pages)
Recipes   ->  Imports Ingredients (NEVER Entrees, Templates, or Pages)
Ingredients -> Pure Values (Imports NOTHING)
```

### Prohibited Anti-Patterns:
1. **Never Import Upward**: An atomic recipe (e.g. `Button`) must NEVER import an entree (e.g. `Modal`) or template.
2. **Never Hardcode Domain State in Recipes or Entrees**: Reusable UI components must accept data via props, never through hardcoded domain fetches.
3. **Never Bypass Ingredients**: Never write arbitrary inline hex codes (`#123456`) or custom pixel spacing (`margin: 17px`) inside recipes or entrees. Always reference standardized design tokens.

---

## 3. Alignment with the Open-Source Design System Checklist

| Checklist Macro-Phase | Total Checks | Primary Culinary Tiers | Key Artifacts |
| :--- | :--- | :--- | :--- |
| **01. Design Language** | **5/10** | Tier 01, Tier 06 | Brand Blueprint (5/5 Completed: Vision, Principles, Voice, Terms, Assets), Guidelines (0/5) |
| **02. Foundations** | **0/26** | Tier 01 (Ingredients) | Color Ramps (0/4), Layout (0/4), Typography (0/5), Elevation (0/3), Motion (0/3), Icons (0/7) |
| **03. Core Components** | **0/166** | Tier 02 & Tier 03 | 29 Primitives (Accordion, Alert, Avatar, Badge, Button, Modal, Toast, Switch, etc.) |
| **04. Maintenance** | **0/28** | Tier 06 (Cookbook) | Documentation (0/10), Local Libs (0/4), Team Processes (0/6), Community (0/4), Contribution (0/4) |
| **TOTAL ECOSYSTEM** | **230 Checks** | **Tiers 01–06** | **Unified SNP-SMS Design System Standard** |
