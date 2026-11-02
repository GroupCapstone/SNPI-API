---
name: snp-sms-component-lifecycle
description: >-
  Authoritative specification for component lifecycle, 7-day automated freshness
  badge expiration, parent-child collapsed navigation, and automated scroll extraction.
---

# Component Lifecycle & Freshness Tracking Skill

Authoritative specification for tracking component freshness, managing 7-day badge lifecycles, and driving hierarchical sidebar navigation with automated scroll extraction.

## Core Rules

1. **7-Day Freshness Window & Right-Aligned Pill Badges**:
   - `New`: Triggered when `comp.builtAt` is within 7 days of system time ($t_{\text{now}} - t_{\text{built}} \le 604,800\text{s}$). Rendered as a right-aligned rounded-full pill in soft emerald (`border-emerald-300/80 bg-emerald-50/70 text-emerald-700`).
   - `Updated`: Triggered when `comp.updatedAt` is within 7 days. Rendered as a right-aligned rounded-full pill in neutral slate gray (`border-slate-300 bg-slate-100/80 text-slate-700`).
   - `Expired`: When $\Delta t > 7\text{ days}$, the badge automatically dissolves to null (clean mature item).
   - `Coming`: Applied to unbuilt specifications (`isFuture: true`). Rendered as a right-aligned rounded-full outline in subtle slate (`border-slate-200 bg-slate-50/60 text-slate-400`).

2. **Zero-Action Invariant for Unbuilt Items**:
   - Tapping a `Coming` component triggers zero action (`pointer-events-none` / inert / no-op). Never navigate or jump to non-existent sections.

3. **Parent-Child Hierarchy & Automated Extraction**:
   - Default state: All child items collapsed under parent.
   - Manual tap: Toggling parent expands children.
   - Automated scroll extraction: As the user scrolls through the document feed, the continuous rail tracker auto-expands the matching parent and highlights the active child.

4. **Zero Numerical Counts**:
   - Never render count numbers (`(57)`, `(22)`, `(35)`, `10 Documents`, `{count} Coming`) on categories, parents, or badges. Every row uses a clean horizontal flex line with `justify-between` and sentence-case pill badges (`New`, `Updated`, `Coming`).
