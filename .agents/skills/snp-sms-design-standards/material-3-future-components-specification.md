# Material 3 Future Components & Blank Architecture Specification

This manual establishes the authoritative standard for registering, visualizing, and scaffolding Material 3 future components across the SNP-SMS developer documentation portal, design systems, and component registry.

---

## 1. Architectural Philosophy & Objectives

* **Zero Ghost Features**: Every planned or upcoming component in the Material 3 specification must have a visible, navigable, and structured presence in the component registry and sidebar.
* **Blank Architecture Standard**: Rather than hiding future components or rendering empty null voids, the system renders a standardized **Blank Future Component Stage Canvas** (`BlankFutureComponent`) displaying interactive geometric blueprint wireframes, M3 design paradigms, touch target metrics, and copyable specifications.
* **Strict Day-First Surfaces**: Maintain the official light-mode brand palette (`#0056FF`, `#2277FF`, `#CAD3F5`, `#EFF5FF`, `#FFFFFF`, `#0A1A4A`) with zero pure `#000000` dark surfaces, zero dark terminal backgrounds, and strictly zero emojis.

---

## 2. 35 Material 3 Future Components Inventory

The 35 components from the authoritative Material 3 specification are categorized into 5 primary groups:

### 2.1 Navigation (7 Components)
1. **App bars** (`app-bars`): Material 3 Top App Bar Standard. Small (56px), Medium, Large, and Center-aligned variants.
2. **Navigation bar** (`navigation-bar`): M3 Bottom Navigation Bar Standard. 64px-80px anchored mobile bar for 3-5 primary destinations with sliding pill indicators.
3. **Navigation drawer** (`navigation-drawer`): M3 Modal & Standard Drawer Standard. Deep institutional hierarchy with account and branch switchers.
4. **Navigation rail** (`navigation-rail`): M3 Side Navigation Rail Standard. 72px compact vertical bridge for desktop and tablet screens.
5. **Tabs** (`tabs`): M3 Primary & Secondary Tabs Standard. Segmented horizontal tab strip with spring-physics active indicator bars.
6. **Toolbars** (`toolbars`): M3 Action Toolbar Standard. Compact horizontal utility surface for document editing, filters, and batch tools.
7. **Menus** (`menus`): M3 Cascading Context Menu Standard. Level 2 elevated transient sheets with keyboard arrow navigation and escape dismiss.

### 2.2 Inputs & Buttons (14 Components)
8. **Buttons** (`buttons`): M3 5-tier button hierarchy (Elevated, Filled, Filled Tonal, Outlined, Text).
9. **All buttons** (`all-buttons`): Side-by-side design system catalog matrix of all 5 M3 button variants with AAA contrast validation.
10. **Button groups** (`button-groups`): Connected action cluster with 1px hairline dividers and rounded outer corners.
11. **Segmented buttons** (`segmented-buttons`): Multi-option pill control with active checkmark icons for 2 to 5 options.
12. **Split button** (`split-button`): Primary default action button combined with an attached dropdown arrow for secondary actions.
13. **FABs** (`fabs`): 56x56px prominent floating surface action button with Level 3 elevation.
14. **Extended FABs** (`extended-fabs`): Labelled floating action button combining iconography with explicit text, auto-collapsing on scroll.
15. **FAB menu** (`fab-menu`): Radial speed-dial menu expanding 2-4 sub-actions with backdrop blur.
16. **Icon buttons** (`icon-buttons`): 44x44px tactile micro-action buttons with pseudo-element hit-target expansion.
17. **Checkbox** (`checkbox`): Tri-state selection control (Checked, Unchecked, Indeterminate) with SVG spring paths.
18. **Radio button** (`radio-button`): Mutually exclusive selection control with 150ms inner dot scaling.
19. **Date pickers** (`date-pickers`): Modal and docked calendar grid with month navigation and manual text fallback.
20. **Time pickers** (`time-pickers`): Radial clock face dial and numeric hour/minute inputs with AM/PM toggle.
21. **Sliders** (`sliders`): Continuous and discrete range track control with 44px thumb touch targets and floating value bubbles.
22. **Search** (`search`): 48px rounded-full search bar transforming into an expanded autocomplete view.

### 2.3 Feedback (7 Components)
23. **Dialogs** (`dialogs`): Basic and full-screen modal prompts with native `::backdrop` blur and focus trap.
24. **Bottom sheets** (`bottom-sheets`): Slide-up sheets with top drag handle pills for secondary actions and filters.
25. **Side sheets** (`side-sheets`): Coplanar and modal vertical panels anchored to the right viewport edge.
26. **Loading indicator** (`loading-indicator`): SVG circular indeterminate spinner for background async operations.
27. **Progress indicators** (`progress-indicators`): Linear and circular determinate progress tracks showing exact completion percentages.
28. **Tooltips** (`tooltips`): Plain and rich floating contextual capsules with collision detection and focus triggers.
29. **Snackbar** (`snackbar`): Transient notification capsule anchored to the bottom with single-line feedback and recovery action button ("Undo").

### 2.4 Display (5 Components)
30. **Badges** (`badges`): Small notification dots and large numeric count badges (`+99`) positioned at top-right anchors.
31. **Cards** (`cards`): Elevated, Filled, and Outlined subject containers with 16px corner radii and 1px Soft Lavender borders.
32. **Carousel** (`carousel`): Multi-browse horizontal card slider with CSS scroll-snap and trailing peek affordance.
33. **Divider** (`divider`): Full-bleed and inset 1px Soft Lavender hairline spatial separators.
34. **Lists** (`lists`): 1, 2, and 3-line structured vertical list rows with avatars, titles, subtitles, and chevron actions.

### 2.5 Forms (1 Component)
35. **Text fields** (`text-fields`): Filled and outlined text inputs with floating label animations and inline validation regions.

---

## 3. Blank Future Component Stage Architecture

Each future component renders via [`BlankFutureComponent`](file:///Users/Apple16/Desktop/SNP-SMS/apps/frontend/features/document/components/ui-library/blank-future-component.tsx):

```tsx
<BlankFutureComponent
  id={comp.id}
  name={comp.name}
  category={comp.category}
  paradigm={comp.paradigm}
  description={comp.description}
/>
```

### Stage Card Structure
1. **Header Row**:
   - `[Coming Soon]` pill badge (`bg-[#EFF5FF] text-[#0056FF] border border-[#CAD3F5]`).
   - Category badge and technical paradigm label.
   - `Copy Spec` action button with clipboard telemetry feedback.
2. **Interactive Blueprint Wireframe**:
   - Dashed Lavender boundary (`border-[#CAD3F5] bg-[#EFF5FF]/40`).
   - Geometric SVG/CSS layout representing the exact physical dimensions and state layers of the target component.
   - Interactive micro-actions (e.g., toggling checkbox/radio states, cycling button variants, switching nav segments).
3. **Specification Telemetry Strip**:
   - **Elevation**: Level 0/1/2 surface definition.
   - **Touch Target**: Mandatory &ge; 44&times;44px WCAG AAA compliant bounds.
   - **Contrast Ratio**: &ge; 7:1 against day surfaces.
   - **Readiness**: Spec Finalized · Scaffold Ready.

---

## 4. Component Registry Standards

Every future component must be registered in `FUTURE_M3_COMPONENTS` inside [`component-registry.tsx`](file:///Users/Apple16/Desktop/SNP-SMS/apps/frontend/features/document/components/ui-library/component-registry.tsx):

```ts
export interface ComponentItemDoc {
  id: string;
  name: string;
  category: string;
  description: string;
  paradigm: string;
  props: ComponentPropDoc[];
  codeSnippet: string;
  explanation: string;
  realWorldExamples: RealWorldExample[];
  uxPsychology: UxPrinciple[];
  usageGuidelines: UsageGuideline[];
  implementationNotes: string[];
  supportedStates: string[];
  isFuture?: boolean;
}
```

* Setting `isFuture: true` automatically routes the component in [`ui-library-view.tsx`](file:///Users/Apple16/Desktop/SNP-SMS/apps/frontend/features/document/components/ui-library/ui-library-view.tsx) to render [`BlankFutureComponent`](file:///Users/Apple16/Desktop/SNP-SMS/apps/frontend/features/document/components/ui-library/blank-future-component.tsx) and applies the `· Soon` sidebar marker.
