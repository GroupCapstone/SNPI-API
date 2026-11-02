# Material 3 Canonical Layout Archetypes Manual

This manual is the authoritative specification for canonical screen layouts, pane composition, and adaptive archetypes across the SNPI-SMS platform.

---

## 1. Overview of Canonical Layouts

Canonical layouts provide standard, proven starting points for common application workflows across all five window breakpoints. Interfaces in SNPI-SMS must strictly build upon one of three canonical archetypes:

```
+-----------------------------------------------------------------------------------------+
|                                CANONICAL LAYOUT ARCHETYPES                              |
+------------------------------+------------------------------+---------------------------+
| 1. FEED ARCHETYPE            | 2. LIST-DETAIL ARCHETYPE     | 3. SUPPORTING PANE        |
| - Continuous content stream  | - Parent-child data models   | - Focus + auxiliary context|
| - 1 to 4 fluid columns       | - 1-pane stack -> 2-pane split| - 2/3 primary + 1/3 docked|
+------------------------------+------------------------------+---------------------------+
```

---

## 2. Archetype 1: Feed Layout

The Feed layout organizes cards, documents, announcements, or metrics into an adaptive multi-column grid:

| Breakpoint | Column Count | Gutter Width | Typical Usage |
| :--- | :--- | :--- | :--- |
| **Compact** (<600dp) | 1 Column | 16dp | Mobile feed, single vertical scroll stream |
| **Medium** (600–839dp) | 2 Columns | 24dp | Tablet grid, two-card side-by-side feed |
| **Expanded** (840–1199dp) | 2–3 Columns | 24dp | Standard dashboard card grid |
| **Large** (1200–1599dp) | 3 Columns | 24dp | Desktop dashboard overview |
| **Extra-Large** (≥1600dp) | 3–4 Columns | 24dp | Enterprise analytics and data feed |

### 2.1 Invariant Rules of Feed Layouts
- **Fluid Card Widths**: Cards must expand fluidly to fill their assigned column width.
- **Uniform Row Heights**: Card grids must align vertically via masonry or uniform grid heights to prevent jagged reading lines.
- **Scroll Anchoring**: Scroll position must be preserved during column reflow when window resize occurs.

---

## 3. Archetype 2: List-Detail Layout

The List-Detail layout is strictly designed for **parent-child data models** (e.g. Student Directory -> Student Record, Course Catalog -> Course Syllabus, Inbox -> Message Thread):

### 3.1 Behavior Across Breakpoints
1. **Compact & Medium (<840dp)**:
   - **Single-Pane Stack**: Displays the List pane full-screen.
   - Tapping an item navigates to the Detail pane view.
   - The Top App Bar provides a prominent Back navigation button to return to the list.
2. **Expanded, Large & Extra-Large (≥840dp)**:
   - **Co-Planar Dual Pane**: Displays List and Detail panes side-by-side on the same visual plane.
   - The selected item in the list displays an **active selection indicator** (Royal Blue `#0056FF` left border, Ice Tint `#EFF5FF` surface fill).
   - Tapping a different list item immediately updates the Detail pane without page transition.
   - **Independent Scrolling**: The List pane and Detail pane maintain independent vertical scroll contexts.

### 3.2 Anti-Pattern Invariant
- **Never Use List-Detail for Non-Parent-Child Workflows**: Never use a dual-pane layout when the two panes do not share an explicit parent-child relationship.

---

## 4. Archetype 3: Supporting Pane Layout

The Supporting Pane layout provides an asymmetric workspace comprising a primary focus pane and an auxiliary supporting pane:

### 4.1 Structural Composition
- **Primary Canvas**: Occupies approximately **2/3 of available horizontal width** (min 600px). Hosts the user's primary task (e.g. Gradebook editor, Curriculum builder, Student exam grading).
- **Supporting Pane**: Occupies approximately **1/3 of available horizontal width** (strictly **min-width 360dp**, max-width 480dp). Hosts contextual auxiliary tools (e.g. grading rubric, student notes, activity history, quick calculation inspector).

### 4.2 Behavior Across Breakpoints
- **Compact & Medium (<840dp)**:
  - The supporting content stacks vertically below the primary canvas or opens via a dismissible **Modal Bottom Sheet**.
- **Expanded+ (≥840dp)**:
  - The supporting pane docks permanently on the trailing edge (right in LTR, left in RTL).
  - Can be toggled open/closed via a header utility button.

---

## 5. Advanced Layering & Levitate Strategy

For task-focused auxiliary workflows that require temporary user attention (e.g. confirmation modals, detailed filter pickers, batch operations):
- **Levitate Architecture**: Auxiliary content floats above the underlying pane scaffold.
- **Scrim Overlay**: Apply a semi-transparent scrim (`bg-black/40` or `bg-slate-900/50`) over the background panes to focus attention on the elevated modal.
- **Elevation Z-Index Ladder**:
  - Base Panes: `z-0` to `z-10`
  - Sticky Headers & Navigation Rails: `z-20`
  - Floating Action Buttons (FABs): `z-30`
  - Elevated Sheets & Drawers: `z-40`
  - Modal Dialogs & Levitate Panels: `z-50`
  - Snackbars & Toast Notifications: `z-60`
