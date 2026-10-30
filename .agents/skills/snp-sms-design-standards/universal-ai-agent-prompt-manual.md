# Universal AI Agent Prompt & MVP Component Generation Manual

Authoritative architectural specification for procedural AI Agent Prompt generation, interface contracts, and the `[ Preview | Prompt ]` UI pattern in the SNP-SMS Design System.

---

## 1. Core Philosophy & Architectural Intent

In modern agentic pair-programming and design systems, documentation must be **directly executable by autonomous AI coding assistants** (such as Antigravity, Cursor, Claude 3.5 Sonnet, ChatGPT 4o, GitHub Copilot, and v0).

Raw code snippets in component documentation often suffer from:
1. Missing local imports, context wrappers, and environment variables.
2. Unclear accessibility (ARIA) and keyboard contracts.
3. Undocumented state machines and edge cases.
4. Framework mismatches when pasting between projects.

The **Universal AI Agent Prompt Standard** solves this by converting every component's metadata, architecture, states, and guidelines into a complete, self-contained **MVP Prompt Text Skill**. When copied into any AI agent, the agent receives an unambiguous blueprint to generate a production-ready, accessible, standalone component from scratch in one shot.

---

## 2. Universal Prompt Specification Architecture

Every generated AI Agent Prompt adheres strictly to the following 9-part structured markdown schema:

### 2.1 Header & Hook
```markdown
<Category> · Component Template
<Component Name>
<One-line Purpose & Value Proposition>

Copy the prompt, paste it, ship it.
```

### 2.2 Core Concept & Design Paradigm
- Detailed mental model explaining what the component is, why it exists, and its foundational metaphor (e.g. Google Maps Bottom Sheet, Raycast Command Palette, TradingView Canvas).
- Mathematical tokens and surface depth rules.

### 2.3 What's Inside & Architectural Pillars (01 to 08)
Numbered engineering requirements defining:
- **01 Container Architecture**: Dimensions, borders, elevation, responsive bounds.
- **02 Accessibility (a11y)**: Semantic ARIA roles (`role="dialog"`, `aria-modal="true"`, `aria-live`, `aria-expanded`), keyboard trap, Escape dismissal, and focus restoration to the trigger element (`document.activeElement`).
- **03 Design Tokens**: Mathematical padding, 1px keyline borders, zero box-shadows in dark mode, and surface lightness hierarchy.
- **04 Micro-Interactions**: Sub-300ms interface timing rule, spring physics (`stiffness: 400`, `damping: 30`), and `prefers-reduced-motion` fallbacks.
- **05 State Transitions**: Enter/exit animation states, two-phase removals, and mount zero-guards.
- **06 Touch & Ergonomics**: Minimum 44x44px touch targets on all interactive controls.
- **07 Theme Adaptation**: Seamless dual-theme rendering (Light: `#FFFFFF` / `#F8FAFC`; Dark: `#0B0F19` / `#0F172A`).
- **08 Programmatic Control**: Exposed callback contracts (`onClose`, `onSelect`, `onChange`).

### 2.4 Supported States & Interactions
Explicit enumeration of all visual and behavioral states:
- `Default / Idle`
- `Active / Pressed`
- `Hover`
- `Focus-Visible`
- `Disabled / Loading`
- Domain-specific states (e.g., `Peek`, `Expanded`, `Dismissed`, `Burst Active`).

### 2.5 Component Props & Interface Contract
Typed TypeScript interface specification including:
- Prop name, type, default value, and behavioral description.
- Generic type parameters where applicable (`<T>`).

### 2.6 Usage Guidelines (DO and DON'T)
- **USE THIS WHEN (+)**: Clear real-world criteria for when this pattern is the optimal choice.
- **DO NOT USE WHEN (-)**: Explicit anti-patterns and simpler alternatives (e.g. when native HTML elements suffice).

### 2.7 Real-World Production Scenarios
Concrete institutional and enterprise use cases (e.g. Registrar student dossiers, classroom facility reservations, fee payment receipts).

### 2.8 UX Psychology & Human Interface Laws
Empirical cognitive principles governing the interaction:
- Fitts's Law (touch target size and proximity).
- Hick's Law (progressive disclosure to minimize decision time).
- Miller's Law (chunking information into 7 +- 2 units).
- Doherty Threshold (<400ms feedback loop for continuous flow state).
- Postel's Law (liberal input parsing, conservative output formatting).

### 2.9 Principal AI Agent Instructions
Mandatory closing directive instructing the consuming AI model:
```markdown
Act as a Principal UI/UX Architect & Design System Engineer.
Build the "<Component Name>" component from scratch as a clean, single-file, production-ready React component with TypeScript and Tailwind CSS.

Mandatory Requirements:
1. Self-Contained MVP: Single-file implementation with zero imaginary dependencies.
2. Accessibility (WCAG 2.1 AA/AAA): Include all required ARIA attributes, keyboard navigation, and visible focus rings.
3. Micro-Interactions: Follow the sub-300ms interface timing rule with spring physics or smooth transitions. Support prefers-reduced-motion.
4. Dual Theme: Ensure clean contrast and visual fidelity across both light and dark surfaces.
5. Export both the primary component and an interactive demo showcase component.
```

---

## 3. UI Component Toolbar Standard

In the Public Developer Documentation Library (`apps/frontend/features/document/components/ui-library/`):

1. **Segmented Mode Toggle**:
   - `[ Preview | Prompt ]` (or `[ Preview | AI Prompt ]`).
   - `Preview` displays the live interactive canvas with device viewports and theme toggles.
   - `Prompt` displays the full universal AI prompt inside a dark, technical code terminal.
2. **Dedicated 1-Click Action Button**:
   - `[ Copy Prompt ]` with a `Sparkles` or `Copy` icon.
   - Positioned in the header alongside the segmented toggle.
   - Shows dynamic copy confirmation: `Prompt Copied!` with `Check` icon for 2.5 seconds.
3. **No Refresh / Reload Buttons**:
   - Reload/refresh buttons (`RotateCcw`) are strictly omitted to eliminate visual clutter and redundant controls.
   - Viewport frame re-mounting is handled automatically via dynamic React keys (`${comp.id}-${viewport}-${theme}`).

---

## 4. Programmatic Generation Engine (`generateAiAgentPrompt`)

The generator function resides in `component-registry.tsx`:

```typescript
export function generateAiAgentPrompt(comp: ComponentItemDoc): string {
  // Procedurally compiles metadata, props, states, guidelines, and AI directives
  // into a standardized universal prompt string.
}
```

This ensures that whenever a component definition is added or updated in the registry, its AI Agent Prompt is updated automatically in real-time with zero manual maintenance.
