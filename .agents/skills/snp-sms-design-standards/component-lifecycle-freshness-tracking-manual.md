# Component Lifecycle, 7-Day Freshness Tracking & Parent-Child Navigation Specification

This manual establishes the authoritative standard for component lifecycle tracking, 7-day automated badge expiration, psychological micro-labeling, and parent-child rail line synchronization across the SNP-SMS developer documentation portal and component registry.

---

## 1. Architectural Philosophy & Zero-Clutter Mandate

* **Psychological Micro-Labeling Over Count Bubbles**: Never display numerical count badges (e.g. `(57)`, `(22)`, `(35)`, `10 Documents`) on category headers, parent folders, or component rows. Numerical counts introduce cognitive clutter and anxiety without delivering operational value.
* **Text-Toned Micro-Labels Above Typography**: Component status indicators (`NEW`, `UPDATED`, `COMING`) must be styled as delicate micro-labels (`text-[8px] font-mono font-bold tracking-wider uppercase`) positioned directly above the component title, rendered in pure text colors matching brand psychology.
* **Strict Zero-Action Gate for Unbuilt Items**: Components that have not been constructed yet (`COMING` / `isFuture: true`) must never trigger navigation, page jumps, or state changes when tapped. Their cursor is non-interactive (`cursor-default`), and clicks execute zero actions.
* **Deferred UI Demo Rendering**: Unbuilt components must never render placeholder or mock demo stages in the live feed until explicitly commanded by the user. Only fully built, interactive components render in the live feed.

---

## 2. 7-Day Automated Freshness Expiration Algorithm

Component freshness is calculated dynamically against the current system time using a strict 7-day expiration gate ($7 \times 86,400 = 604,800\text{ seconds}$):

```ts
export const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000; // 604,800,000 ms

export type ComponentFreshness = 'new' | 'updated' | 'coming' | null;

export function getComponentFreshness(
  comp: { isFuture?: boolean; builtAt?: string; updatedAt?: string },
  now = new Date(),
): ComponentFreshness {
  // 1. Unbuilt / Future status takes precedence
  if (comp.isFuture) return 'coming';

  const nowMs = now.getTime();

  // 2. Updated status within 7 days
  if (comp.updatedAt) {
    const updatedMs = new Date(comp.updatedAt).getTime();
    if (nowMs >= updatedMs && nowMs - updatedMs <= SEVEN_DAYS_MS) {
      return 'updated';
    }
  }

  // 3. New status within 7 days of build
  if (comp.builtAt) {
    const builtMs = new Date(comp.builtAt).getTime();
    if (nowMs >= builtMs && nowMs - builtMs <= SEVEN_DAYS_MS) {
      return 'new';
    }
  }

  // 4. Expired (> 7 days): Clean mature component, zero label displayed
  return null;
}
```

### 2.1 Mathematical State Transitions

| Starting State | Event | Resulting State | Pill Badge | Color Token | Duration |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Specification** | Defined in registry | `COMING` | `Coming` | Slate (`border-slate-200 bg-slate-50 text-slate-400`) | Indefinite until built |
| `COMING` | Component constructed | `NEW` | `New` | Emerald (`border-emerald-300 bg-emerald-50 text-emerald-700`) | Exactly 7 days from `builtAt` |
| `NEW` | $t > \text{builtAt} + 7\text{d}$ | `STABLE` | *(None)* | *(None)* | Permanent mature state |
| `STABLE` | Refactored / enhanced | `UPDATED` | `Updated` | Slate Gray (`border-slate-300 bg-slate-100 text-slate-700`) | Exactly 7 days from `updatedAt` |
| `UPDATED` | $t > \text{updatedAt} + 7\text{d}$ | `STABLE` | *(None)* | *(None)* | Permanent mature state |

---

## 3. Right-Aligned Rounded Pill Badge Design System

All component status indicators are styled as delicate, right-aligned rounded pill badges (`rounded-full px-2 py-0.5 font-sans text-[11px] font-medium leading-none`) aligned horizontally to the right of the component title (`flex items-center justify-between w-full`):

1. **`New` — Emerald Pill (`border-emerald-300/80 bg-emerald-50/70 text-emerald-700`)**:
   - *Visual Style*: Soft mint emerald hairline border with light background fill.
   - *Typography*: Sentence case `New`, font-sans text-[11px] font-medium.
   - *Psychological Role*: Freshness, vitality, and confirmed availability.
2. **`Updated` — Neutral Slate Gray Pill (`border-slate-300 bg-slate-100/80 text-slate-700`)**:
   - *Visual Style*: Muted gray outline with subtle tint.
   - *Typography*: Sentence case `Updated`, font-sans text-[11px] font-medium.
   - *Psychological Role*: Awareness and modification without alarm.
3. **`Coming` — Subtle Outline Pill (`border-slate-200 bg-slate-50/60 text-slate-400`)**:
   - *Visual Style*: Light hairline outline with neutral text.
   - *Typography*: Sentence case `Coming`, font-sans text-[11px] font-medium.
   - *Psychological Role*: Calm, inactive anticipation; non-interactive.

---

## 4. Parent-Child Hierarchy & Automated Rail Tracking

### 4.1 Default Collapsed View
By default, all grouped parent components (e.g. `Buttons`, `Sheets`, `Loading & progress`, `Date & time pickers`, `Navigation`) display **only the parent title** in the sidebar. Child components remain collapsed to minimize initial cognitive load (Hick's Law).

### 4.2 Interactive Expansion (Tap)
Tapping a parent item toggles its accordion dropdown open or closed:
- An arrow glyph (`ChevronRight` / `ChevronDown`) indicates expansion state.
- Expanding renders child items indented with a dashed sub-rail line.

### 4.3 Automated Scroll Extraction (IntersectionObserver)
As the user scrolls down the document feed:
1. The active section is detected by the continuous line tracker rail (`HookSidebar` / `activeSectionId`).
2. If the active section matches any child of a parent group, the system **automatically expands the parent group** (`expandedParents[parentId] = true`).
3. The child item is highlighted in bold text with the active spring-physics rail line tracking precisely to its position.

### 4.4 Non-Interactive Gate for Unbuilt Items
- If `comp.isFuture` is true:
  ```tsx
  <div
    className="flex flex-col py-1 pr-2 pl-4 cursor-default select-none opacity-70"
    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
  >
    <span className="font-mono text-[8px] font-bold tracking-wider text-slate-400 uppercase">
      COMING
    </span>
    <span className="font-sans text-xs font-medium text-slate-400">
      {comp.name}
    </span>
  </div>
  ```
- Tapping triggers **zero navigation** and **zero side effects**.

---

## 5. Verification Checklist

1. [x] Zero number count labels on categories, parents, or component badges.
2. [x] Micro-labels rendered above text in psychological brand colors (`#0056FF`, `#D97706`, `#94A3B8`).
3. [x] 7-day automated expiration verified: `NEW` disappears at 7 days + 1 second.
4. [x] Parent-child groups collapsed by default; tap to expand.
5. [x] Auto-extraction: scrolling to a child section automatically opens parent in sidebar.
6. [x] Unbuilt components execute zero action when clicked and do not render demo stages in the feed.
