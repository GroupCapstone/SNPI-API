# SNP-SMS Sidebar Architecture & Navigation Manual

This specification defines the authoritative design, layout, interaction, and accessibility standards for desktop and responsive sidebars across the SNP-SMS platform.

---

## 1. Core Purpose & Definition

A sidebar is a persistent, vertical navigation and functional surface that displays:
1. **Primary Platform Navigation**: Direct links to top-level modules and workflows.
2. **Supplementary Context**: Branch selectors, search filters, and active scope indicators.
3. **Workspace Tools & Quick Actions**: Fast shortcuts and bottom-anchored actions.

---

## 2. Structural Anatomy & Section Layout

Every standard SNP-SMS sidebar comprises five distinct, stacked vertical sections:

```
+------------------------------------------+
| 01. Brand & Tenant Identity              |
|     Logo + School Name + Scope Badge     |
+------------------------------------------+
| 02. Workspace Context & Search Filter    |
|     Branch Selector + Fast Query Input   |
+------------------------------------------+
| 03. Primary Navigation Group             |
|     Icon + Label + Active Pill Indicator |
|     (Expandable Multi-Level Trees)       |
+------------------------------------------+
| 04. Secondary Navigation & Utilities     |
|     Documentation + Help + Settings      |
+------------------------------------------+
| 05. Bottom Anchored Actions & CTA Card   |
|     Upgrade Card / Account / Collapse    |
+------------------------------------------+
```

### Component Breakdown
1. **Brand Identity Header**: Fixed top ceiling containing the institution logo, application name (`SNPI-SMS`), and current academic year badge.
2. **Workspace & Quick Filter Input**: A compact search field (`GeometricInput` sm) allowing immediate filtering of long navigation trees.
3. **Main Navigation Items**: Vertically stacked capsule buttons with 44x44px touch targets, leading icons, and active status indicators.
4. **Secondary Level Items**: Expandable child lists indented under primary items with subtle leading lines to communicate structural hierarchy.
5. **Call to Action (CTA) Section**: Anchored at the bottom of the sidebar. Dedicated to promotional banners, cloud sync status, or plan tier indicators.
6. **Workspace Settings & Collapse Toggle**: Footer utilities for toggling collapsed/expanded rail states and accessing profile settings.

---

## 3. Hierarchy & Multi-Level Navigation Rules

* **Maximum 2 Levels**: Strictly limit navigation to two hierarchical tiers: `Primary Item -> Secondary Child Item`. Never introduce a third nested sub-level in sidebars to prevent cognitive overload.
* **Expandable Accordion Groups**: Clicking a parent item smoothly animates open its child list while rotating a chevron indicator by 90 degrees.
* **Visual Leading Lines**: Nested secondary items must display a 1px vertical guide rail (`border-l border-slate-200`) with a 12px indentation to reinforce visual parentage.
* **Active Status Persistence**: When a secondary child route is active, its parent group must maintain a persistent subtle highlight to preserve context.

---

## 4. Spacing, Geometry & Sticky Screen Pinning

* **Width Standards**:
  - Expanded Sidebar: `240px` (`w-60`) to `256px` (`xl:w-64`).
  - Collapsed Rail: `64px` (`w-16`) displaying centered icons with tooltips.
* **Screen Pinning Rule (`position: sticky`)**:
  - The sidebar MUST remain permanently pinned on the screen during document scrolling:
    ```css
    position: sticky;
    top: 5rem; /* 80px, clearing 64px navbar with 16px breathing room */
    max-height: calc(100vh - 5.5rem);
    overflow-y: auto;
    ```
  - The parent flex wrapper MUST avoid `items-start` so the sidebar container stretches to the full document height.
* **Internal Scroll Isolation**: If the list of navigation items exceeds the viewport height, the sidebar must scroll independently with a hidden or sleek scrollbar (`no-scrollbar`).

---

## 5. Interaction States & Visual Tokens

| State | Background Surface | Border Property | Text Color | Indicator Dot |
| :--- | :--- | :--- | :--- | :--- |
| **Default / Inactive** | `#FFFFFF` (White) | `1px solid rgba(226, 232, 240, 0.9)` | `#334155` (Slate-700) | `bg-slate-400` |
| **Hover** | `#F8FAFC` (Slate-50) | `1px solid #CBD5E1` (Slate-300) | `#0F172A` (Slate-900) | `bg-slate-500` |
| **Active / Selected** | `#0056FF` (Royal Blue) | `1px solid #0056FF` | `#FFFFFF` (Pure White) | `bg-white` |
| **Focused (Keyboard)** | `#FFFFFF` | `2px solid #0056FF` | `#0056FF` | `bg-[#0056FF]` |
| **Disabled** | `#F1F5F9` (Slate-100) | `1px solid #E2E8F0` | `#94A3B8` (Slate-400) | `bg-slate-300` |
