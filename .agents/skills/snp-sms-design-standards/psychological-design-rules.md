# Mandatory Psychological Design Rules for AI Agents

## Executive Mandate for AI Coding Agents

When designing, architecting, or implementing any user interface component, page view, interactive control, or data layout in the SNP-SMS repository, every AI coding agent MUST strictly follow and enforce the following human-computer interaction (HCI) cognitive psychology invariants and architectural standards.

---

## 1. The 5 Core Cognitive Psychology Invariants

### 1.1 Fitts's Law: Spatial & Temporal Target Acquisition
- **Mathematical Invariant**: $T = a + b \log_2(2D / W)$
- **Spatial Rule**: Every interactive element (button, link, tab, checkbox, radio, switch, icon control) MUST provide an effective touch target of $\ge 44 \times 44\text{px}$.
- **Pseudo-Element Hit Expansion**: For compact icon buttons ($\le 24\text{px}$), developers and AI agents MUST expand the clickable area to $\ge 44 \times 44\text{px}$ using relative positioning and `::before` pseudo-elements:
  ```css
  .icon-button {
    position: relative;
  }
  .icon-button::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 44px;
    min-height: 44px;
  }
  ```
- **Temporal Coyote Time**: In dropdown menus, hover tooltips, and popovers, maintain a $100\text{ms}$ buffer after cursor leave before dismissing the floating container, preventing accidental closure.

### 1.2 Hick's Law: Cognitive Decision Velocity & Progressive Disclosure
- **Mathematical Invariant**: $T = b \log_2(n + 1)$
- **Option Density Rule**: Never present users with an uncurated list of $> 5$ primary choices simultaneously.
- **Progressive Disclosure**:
  - Surface $3$ to $5$ high-frequency defaults as primary options.
  - Defer advanced, secondary, or infrequent options behind searchable pickers, expandable accordion panels, or segmented tabs.
  - Multi-step wizards must separate lengthy workflows into distinct sequential stages with clear progress indicators.

### 1.3 Miller's Law: Working Memory & Information Chunking
- **Baseline Invariant**: Working memory holds $7 \pm 2$ chunks of discrete information.
- **Form Chunking Rule**: Group dense forms (student admissions, guardian details, employee onboarding) into titled visual cards containing $\le 5$ fields per section. Never render continuous unsegmented walls of inputs.
- **Alphanumeric Chunking**: Segment dense identifiers into readable 3–4 character clusters:
  - Phone Numbers: `+855 12 345 678`
  - National IDs / Student Codes: `SNP-2026-0841`
  - Financial Ledgers: `$1,250,000.00`

### 1.4 Doherty Threshold: Perceived Velocity & Flow State
- **Timing Invariant**: Sustained interaction feedback cycle $\le 400\text{ms}$.
- **Tactile Response ($<100\text{ms}$)**: On `pointerdown`, interactive elements must trigger an immediate physical response:
  - Visual Scale: `active:scale-[0.96]` or `active:scale-[0.98]`
  - Background feedback: Instant state layer highlight (`#EFF5FF`)
- **Asynchronous Feedback ($>400\text{ms}$)**: For network requests, API queries, or file uploads:
  - Never display blank white screens or frozen interfaces.
  - Immediately render pulsing skeleton loading shimmers matching the target component dimensions.
  - Use optimistic UI updates for client actions (marking attendance, favoriting, toggling flags) before the backend acknowledgment returns.

### 1.5 Postel's Law: Robustness Principle in Data Entry
- **Principle**: *"Be conservative in what you send, be liberal in what you accept."*
- **Liberal Input Parsing**: Form inputs must generously parse and accept loose human representations:
  - Dates: Accept `"15 Jan 2026"`, `"01/15/2026"`, `"tomorrow"`, or `"2026-01-15"` and normalize automatically.
  - Phone Numbers: Accept spaced, hyphenated, or raw digits and auto-format to E.164.
  - Search Fields: Perform case-insensitive, diacritic-insensitive fuzzy matching.
- **Strict Output Transmission**: Always normalize to strict ISO strings, integers, or standardized enums before dispatching to backend APIs.

---

## 2. The 6-Tier Culinary Component Architecture Invariant

Every AI agent must classify and organize components strictly according to the 6-tier progression:

1. **Tier 01: Ingredients** (Tokens & Atoms): Color hexes (`#0056FF`, `#0A1A4A`), typography scales (Google Sans), spacing (4px grid), elevation z-indexes, motion timing, raw SVGs.
2. **Tier 02: Recipes** (Atomic UI Primitives): Button, Text field, Checkbox, Radio, Switch, Badge, Avatar, Link, Divider, Tooltip.
3. **Tier 03: Entrees** (Compound Organisms): Data Table, Modal Dialog, Navigation Bar/Rail, Accordion, Toast Stack, Carousel, Search Filter Bar.
4. **Tier 04: Templates** (Layout Scaffolds): Viewport wireframes without dynamic data (Dashboard Scaffold, Split Panes, Settings Master-Detail).
5. **Tier 05: Pages** (Concrete Production Views): Live screens with real backend models & RBAC (Campus Analytics, Student Lifecycle, Billing, Attendance).
6. **Tier 06: Cookbook** (Master Design System): Complete governance rulebook, brand blueprint, component manuals, contribution RFCs, maintenance SLAs.

### Mandatory Import Invariant:
- **Strict Downward Dependency Only**: Higher tiers may import lower tiers.
- **PROHIBITION**: A lower tier component (e.g. `Button` or `Modal`) MUST NEVER import an upper tier component (e.g. `DashboardScaffold` or `CampusAnalyticsPage`).
- Components in Tiers 01 to 03 must remain stateless regarding backend API models and accept data purely via React props and callbacks.

---

## 3. Checklist-Specific Component Invariants

When implementing any of the 29 core components, the agent must ensure:
1. **Accordion**: Active state icon distinct, smooth grid toggle transition, trigger focus announces content context via `aria-controls` and `aria-expanded`.
2. **Alert**: High contrast (WCAG AAA $\ge 7:1$), role-differentiated styling (info, success, warning, danger), title support, and distinct role icon.
3. **Button**: 4 states (Enabled, Hover, Active, Disabled), $\ge 44\times 44\text{px}$ touch target, sub-300ms transition.
4. **Input Radio**: Associated `<label>` clickable, error text displayed on invalid state, grouped by `name`, keyboard arrow navigation supported.
5. **Progress Bar**: Accessible label (`aria-valuenow`, `aria-valuemin`, `aria-valuemax`), determinable vs indeterminable modes.
6. **Skeleton**: Matches target component shape and dimensions to eliminate layout shifts (CLS), respects `prefers-reduced-motion`.
7. **Switch**: Immediate binary toggle on click/space, `<label>` linked, `aria-checked` synchronized, disabled state visual feedback.
8. **Toast**: Ephemeral auto-dismiss with generous timeout ($\ge 4000\text{ms}$), stacked queue, contextual action CTA (e.g. Undo), keyboard focusable action.
9. **Tooltip**: Non-modal informative text, `aria-describedby` linkage, $100\text{ms}$ coyote time exit buffer.

---

## 4. AI Agent Pre-Implementation Quality Checklist

Before writing any new component or view, verify:
- [ ] Is the touch target $\ge 44\times 44\text{px}$? (Fitts's Law)
- [ ] Are visible primary options $\le 5$? (Hick's Law)
- [ ] Are fields grouped into cards of $\le 5$ items? (Miller's Law)
- [ ] Does pointerdown provide feedback within $<100\text{ms}$? (Doherty Threshold)
- [ ] Does the input tolerate loose user formatting? (Postel's Law)
- [ ] Does the component respect one-way downward import rules? (Culinary Invariant)
- [ ] Are all 5 primary brand tokens respected (`#0056FF`, `#0A1A4A`, `#CAD3F5`, `#FFFFFF`, `#EFF5FF`)?
- [ ] Strictly ZERO EMOJIS in code, comments, and copy?
