# SNP-SMS Foundational UX/UI Laws Framework

This manual establishes the cognitive psychology, usability principles, and interaction laws that govern interface design across all screens, modals, components, and workflows in the SNP-SMS platform.

---

## The 6 Foundational UX/UI Laws

```
+--------------------------------------------------------------------------+
| 01. Jakob's Law       | Users expect familiar patterns from other apps.  |
| 02. Fitts's Law       | Interaction speed depends on target size/distance|
| 03. Miller's Law      | Working memory is 7 +/- 2; chunk data logically. |
| 04. Hick's Law        | Decision time increases with options and clutter.|
| 05. Law of Proximity  | Related items group tightly; distant items separate
| 06. Tesler's Law      | Complexity cannot be destroyed; design must bear it
+--------------------------------------------------------------------------+
```

---

## 1. Jakob's Law (Familiarity & Conventions)
* **Statement**: Users spend most of their time on other applications and websites. Therefore, they expect your platform to work like all the other systems they already know.
* **SNP-SMS Architectural Rules**:
  - Top-left branding links back to the home or dashboard view.
  - Top-right corner houses user profile avatar, branch switcher, and notifications.
  - Standard keyboard shortcuts must be respected (`Esc` closes dialogs/drawers, `Cmd+K` opens command palette, `Enter` confirms primary dialog actions).
  - Do not reinvent standard navigational structures (e.g. breadcrumbs, tabs, search inputs). Maintain standard icon semantics (gear for settings, bell for alerts, magnifying glass for search).

---

## 2. Fitts's Law (Target Size & Distance)
* **Statement**: The time required to rapidly move to a target area is a function of the ratio between the distance to the target and the width of the target.
* **SNP-SMS Architectural Rules**:
  - **Minimum Touch Targets**: Every interactive element must be at least `44 × 44px`.
  - **Hit-Area Expansion**: For visually compact buttons, use CSS pseudo-elements (`::before` / `::after`) with `inset: -8px` to expand the hit target without altering visual density.
  - **Screen Edges & Corners**: Pin critical navigational controls (e.g. mobile bottom bars, sticky table headers, floating action buttons) to viewport perimeters where cursor overshooting is naturally bounded.
  - **Destructive Separation**: Destructive triggers (e.g. Delete Student, Terminate Session) must be placed far from frequent routine actions with explicit confirmation modals.

---

## 3. Miller's Law (Working Memory & Cognitive Chunking)
* **Statement**: The average human brain can only hold $7 \pm 2$ chunks of information in working memory simultaneously.
* **SNP-SMS Architectural Rules**:
  - **Form Chunking**: Break large multi-step registrations (e.g. Student Enrollment, Fee Invoice Creation) into 3 to 5 logical grouped steps.
  - **Navigation Chunking**: Main navigation menus must never exceed 7 top-level categories. Secondary items must be nested inside expandable groups.
  - **Data Display**: Tables and lists must present scannable card groups or paginated batches (10 to 25 rows), chunking complex IDs and phone numbers with formatting dividers (e.g. `SNP-2026-0042`, `012 345 678`).

---

## 4. Hick's Law (Decision Latency & Progressive Disclosure)
* **Statement**: The time it takes to make a decision increases logarithmically with the number and complexity of choices presented ($T = b \cdot \log_2(n + 1)$).
* **SNP-SMS Architectural Rules**:
  - **Progressive Disclosure**: Show only the primary actions required for the immediate task. Reveal advanced filtering, secondary parameters, and administrative controls on demand.
  - **Primary Action Limit**: Every card, table header, or modal view must have exactly **one** highlighted primary call-to-action button. Secondary choices must use ghost or subtle outlines.
  - **Search & Auto-Complete**: For datasets exceeding 6 options, replace standard static dropdowns with typeahead filterable comboboxes.

---

## 5. Law of Proximity (Gestalt Grouping & Spacing)
* **Statement**: Objects that are near, or proximate to each other, tend to be grouped together by human visual perception.
* **SNP-SMS Architectural Rules**:
  - **Label-Input Proximity**: Form field labels must sit significantly closer to their corresponding input (`gap-1.5` / 6px) than the gap between successive form fields (`gap-6` / 24px).
  - **Card Content Grouping**: Related metrics (e.g. Student Count, Attendance %, Fee Collection) must be grouped inside distinct flat card boundaries.
  - **Section Spacing Scale**: Spacing between unrelated functional sections must be at least $2\times$ to $3\times$ the internal padding of individual cards (`p-4` inside cards, `gap-8` between sections).

---

## 6. Tesler's Law (Conservation of Inherent Complexity)
* **Statement**: Every system has an inherent amount of irreducible complexity. The only question is who handles it: the engineer/system or the end user.
* **SNP-SMS Architectural Rules**:
  - **System Bears the Burden**: The backend and frontend logic must bear the operational complexity through smart defaults, auto-saving, background retries, and intelligent pre-population.
  - **Zero User Manual Mandate**: Enterprise workflows (e.g. grade entry, timetable scheduling) must be intuitive enough that staff, teachers, and administrators do not require external training manuals.
  - **Graceful Automation**: Pre-fill current academic terms, default school branch IDs from session context, and calculate tuition totals dynamically rather than requiring manual user entry.
