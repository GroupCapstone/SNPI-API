export interface ComponentPropDoc {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface RealWorldExample {
  title: string;
  scenario: string;
  impact: string;
}

export interface UxPrinciple {
  principle: string;
  detail: string;
}

export interface UsageGuideline {
  doItem: string;
  dontItem: string;
}

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
}

export const COMPONENT_CATEGORIES = [
  'Navigation',
  'Inputs',
  'Feedback',
  'Display',
  'AI Kit',
  'Text Effects',
  'Cards',
  'Sections',
  'Forms',
  'Overlays',
] as const;

export type ComponentCategory = (typeof COMPONENT_CATEGORIES)[number];

/**
 * Generates a complete, universal AI Agent Prompt Skill for any component.
 * Allows any AI agent (Antigravity, Cursor, Claude, ChatGPT, Copilot, v0)
 * to build the complete MVP component from scratch with full fidelity.
 */
export function generateAiAgentPrompt(comp: ComponentItemDoc): string {
  const dos = comp.usageGuidelines.map((g) => `+ ${g.doItem}`).join('\n');
  const donts = comp.usageGuidelines.map((g) => `- ${g.dontItem}`).join('\n');
  const pillars =
    comp.implementationNotes && comp.implementationNotes.length > 0
      ? comp.implementationNotes.map((n) => `${n}`).join('\n')
      : `01 Component Architecture: Standalone, modular, zero-leak implementation.\n02 Accessibility (a11y): Full ARIA semantic roles and keyboard contracts.\n03 Design Tokens: Mathematical spacing and zero-shadow elevation ladder.\n04 Responsive Design: Mobile, tablet, and desktop adaptive layouts.`;

  const propsList =
    comp.props && comp.props.length > 0
      ? comp.props
          .map(
            (p) =>
              `  - \`${p.name}\` (${p.type}${p.default ? `, default: ${p.default}` : ''}): ${p.description}`,
          )
          .join('\n')
      : '  - Self-contained interactive component with configurable props.';

  const states =
    comp.supportedStates && comp.supportedStates.length > 0
      ? comp.supportedStates.map((s) => `  - ${s}`).join('\n')
      : '  - Default, Active, Hover, Focus-Visible, Disabled';

  const realWorld =
    comp.realWorldExamples && comp.realWorldExamples.length > 0
      ? comp.realWorldExamples
          .map((ex) => `  * ${ex.title}: ${ex.scenario} (Impact: ${ex.impact})`)
          .join('\n')
      : '';

  const ux =
    comp.uxPsychology && comp.uxPsychology.length > 0
      ? comp.uxPsychology.map((u) => `  * ${u.principle}: ${u.detail}`).join('\n')
      : '';

  return `${comp.category} · Component Template
${comp.name}
${comp.description}

Copy the prompt, paste it, ship it.

---

### Core Concept & Paradigm
${comp.explanation}
Design Paradigm: ${comp.paradigm}

---

### What's Inside & Architectural Pillars
${pillars}

---

### Supported States & Interactions
${states}

---

### Component Props & Interface Contract
${propsList}

---

### Usage Guidelines
USE THIS WHEN:
${dos || '+ Building modern, accessible web applications and SaaS interfaces.'}

DO NOT USE WHEN:
${donts || '- A simpler native HTML element suffices without custom styling.'}
${
  realWorld
    ? `
---

### Real-World Production Scenarios
${realWorld}
`
    : ''
}${
    ux
      ? `
---

### UX Psychology & Human Interface Laws
${ux}
`
      : ''
  }
---

### Instructions for AI Coding Agent
Act as a Principal UI/UX Architect & Design System Engineer.
Build the "${comp.name}" component from scratch as a clean, single-file, production-ready React component with TypeScript and Tailwind CSS.

Mandatory Requirements:
1. Self-Contained MVP: Single-file implementation with zero imaginary dependencies.
2. Accessibility (WCAG 2.1 AA/AAA): Include all required ARIA attributes (role, aria-expanded, aria-controls, aria-live), keyboard navigation (Tab, Esc, Arrow keys, Enter/Space), and visible focus rings.
3. Micro-Interactions: Follow the sub-300ms interface timing rule with spring physics or smooth cubic-bezier transitions. Support prefers-reduced-motion.
4. Dual Theme: Ensure clean contrast and visual fidelity across both light (#FFFFFF / #F8FAFC) and dark (#0B0F19 / #0F172A) surfaces.
5. Export both the primary component and an interactive demo showcase component.`;
}

const RAW_COMPONENT_REGISTRY: ComponentItemDoc[] = [
  {
    id: 'snackbar',
    name: 'Snackbar',
    category: 'Feedback',
    paradigm: 'Gmail Paradigm',
    description: 'Non-intrusive bottom notification alert displaying operational status feedback with instant single-click undo recovery mechanism.',
    explanation:
      'The Snackbar provides brief, non-intrusive feedback about an operation. It appears temporarily at the bottom edge of the screen, ensuring that users stay informed without having their active workflow halted. By including an instant "Undo" recovery mechanism, it drastically reduces user error anxiety.',
    supportedStates: ['Default', 'Success', 'Error', 'Info', 'Active (Displaying)', 'Dismissed'],
    realWorldExamples: [
      {
        title: 'Student Enrollment Confirmation',
        scenario: 'Admissions staff enrolls student STU-2026-0891 into Term 1.',
        impact: 'A 6-second snackbar confirms the database write with an instant Undo button.',
      },
      {
        title: 'Batch Attendance Cloud Sync',
        scenario: 'Campus attendance records sync automatically to the central replica set.',
        impact:
          'Non-blocking notification reassures the teacher without interrupting roster viewing.',
      },
      {
        title: 'Tuition Invoice Dispatch',
        scenario: 'Finance administrator sends an invoice notice via SMS/Email to guardian.',
        impact: 'Confirms dispatch status and provides quick link to copy the receipt hash.',
      },
    ],
    uxPsychology: [
      {
        principle: "Fitts's Law & Peripheral Safety",
        detail:
          'Positioned at the bottom periphery so the primary canvas remains completely actionable while providing instant peripheral confirmation.',
      },
      {
        principle: "Forgiving Design (Norman's Principles)",
        detail:
          'Providing an instant Undo action transforms irreversible actions into forgiving operations, eliminating confirmation dialog fatigue.',
      },
      {
        principle: 'Peak-End Rule',
        detail:
          'Completing a multi-step task with a reassuring, responsive confirmation leaves the user with a positive memory of system efficiency.',
      },
    ],
    usageGuidelines: [
      {
        doItem:
          'Provide an instant Undo action for reversible operations like archive, enroll, or delete.',
        dontItem:
          'Use snackbars for critical errors that require immediate blocking decisions—use a Dialog instead.',
      },
      {
        doItem: 'Auto-dismiss after 4000ms to 6000ms to keep the screen free of lingering clutter.',
        dontItem:
          'Stack multiple snackbars simultaneously—queue them or replace the existing one smoothly.',
      },
      {
        doItem: 'Ensure touch targets on the Undo button maintain at least 44x44px hit bounds.',
        dontItem: 'Include lengthy paragraphs of text—keep notifications under 8 words.',
      },
    ],
    implementationNotes: [
      'Configured with role="status" and aria-live="polite" so screen readers announce changes without interrupting speech.',
      'Dismissable via keyboard Escape key, click on dismiss button, or expiration of duration timer.',
      'Surface elevation adheres to Level 2 Elevated (#202024 / white) with 1px border and zero box-shadows.',
    ],
    codeSnippet: `import { LibrarySnackbar } from '@/features/document/components/ui-library';

export function Example() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Enroll Student</button>
      <LibrarySnackbar
        open={open}
        message="Student enrollment confirmed."
        actionLabel="Undo"
        onAction={() => console.log('Enrollment reverted')}
        onClose={() => setOpen(false)}
        duration={5000}
      />
    </>
  );
}`,
    props: [
      {
        name: 'open',
        type: 'boolean',
        default: 'false',
        description: 'Controls visibility of the snackbar.',
      },
      {
        name: 'message',
        type: 'string',
        default: '—',
        description: 'Main text notification displayed.',
      },
      {
        name: 'actionLabel',
        type: 'string',
        default: '—',
        description: 'Optional label for the actionable button (e.g. Undo).',
      },
      {
        name: 'onAction',
        type: '() => void',
        default: '—',
        description: 'Callback invoked when the action button is pressed.',
      },
      {
        name: 'onClose',
        type: '() => void',
        default: '—',
        description: 'Callback invoked when dismissed or timer elapses.',
      },
      {
        name: 'duration',
        type: 'number',
        default: '5000',
        description: 'Milliseconds before automatic dismissal.',
      },
    ],
  },
  {
    id: 'fab',
    name: 'FAB (Floating Action Button)',
    category: 'Feedback',
    paradigm: 'Google Calendar Paradigm',
    description: 'Prominent floating action button providing instant physical access to the screen\'s primary creation workflow.',
    explanation:
      'The Floating Action Button (FAB) floats continuously above the application canvas. Modeled after the Google Calendar plus-button, it acts as a visual lifebuoy that immediately signals to the user the primary productive action available in the current context.',
    supportedStates: [
      'Default',
      'Hovered',
      'Pressed / Active',
      'Disabled',
      'With Badge Count',
      'Speed Dial',
    ],
    realWorldExamples: [
      {
        title: 'Instant Student Registration',
        scenario: 'Admissions officer navigating the student directory.',
        impact: 'A single tap on the FAB instantly launches the new student enrollment flow.',
      },
      {
        title: 'Daily Attendance Session Start',
        scenario: 'Homeroom teacher opening class management morning view.',
        impact: 'Prominent FAB initiates classroom attendance capture with one touch.',
      },
      {
        title: 'Emergency Campus Announcement',
        scenario: 'Campus safety director broadcasting weather alert.',
        impact: 'Persistent emergency broadcast FAB accessible regardless of scroll depth.',
      },
    ],
    uxPsychology: [
      {
        principle: "Single Focal Point (Hick's Law)",
        detail:
          'Dramatically reduces cognitive decision latency by elevating the primary positive action above all competing secondary choices.',
      },
      {
        principle: 'Thumb Sweep Affordance',
        detail:
          'Positioned in the bottom-right corner for effortless single-handed reach on mobile devices without finger gymnastics.',
      },
    ],
    usageGuidelines: [
      {
        doItem: 'Limit to exactly one FAB per view representing the dominant primary workflow.',
        dontItem:
          'Place multiple FABs on a single screen or allow it to obscure critical table row actions.',
      },
      {
        doItem:
          'Provide an accessible aria-label describing the specific action (e.g. "Create New Student").',
        dontItem:
          'Use generic unlabelled icons that leave users guessing what tapping will trigger.',
      },
    ],
    implementationNotes: [
      'Dimensions: 56x56px circular button (rounded-full) with 24x24px centered vector icon.',
      'Surface: Royal Blue (#0056FF) with 1px border. Micro-interaction: 1.05x hover scale, 0.95x active press.',
      'Zero drop-shadows standard enforced; elevation communicated via flat border and luminance separation.',
    ],
    codeSnippet: `import { LibraryFab } from '@/features/document/components/ui-library';
import { Plus } from '@/components/icons';

export function Example() {
  return (
    <LibraryFab
      label="Enroll Student"
      icon={<Plus className="h-5 w-5" />}
      onClick={() => console.log('Enrolling')}
    />
  );
}`,
    props: [
      {
        name: 'icon',
        type: 'React.ReactNode',
        default: '—',
        description: 'Centered icon representing the action.',
      },
      {
        name: 'label',
        type: 'string',
        default: '—',
        description: 'Screen reader accessibility label and tooltip.',
      },
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'surface'",
        default: "'primary'",
        description: 'Color token variant.',
      },
      {
        name: 'size',
        type: "'default' | 'mini'",
        default: "'default'",
        description: 'Button size: 56px default or 40px mini.',
      },
    ],
  },
  {
    id: 'chip',
    name: 'Chip',
    category: 'Inputs',
    paradigm: 'YouTube Paradigm',
    description: 'Compact interactive filter pill allowing instant toggling, multi-selection, and dynamic query filtering across datasets.',
    explanation:
      'Chips are compact interactive tags shaped like poker chips. Modeled after YouTube home feed category filters, they allow users to rapidly segment extensive catalogs, switch active query parameters, or dismiss selected entities without navigating to a complex filter modal.',
    supportedStates: [
      'Default',
      'Selected / Active',
      'Disabled',
      'Multi-Selected',
      'Filtered',
      'With Dismiss Icon',
    ],
    realWorldExamples: [
      {
        title: 'Course Catalog Thematic Filtering',
        scenario: 'Students filter elective courses by "Academics", "Robotics", "Finance", "Arts".',
        impact: 'Filter applies instantly without page reloading or scroll jumps.',
      },
      {
        title: 'Student Status Segmentation',
        scenario: 'Registrar filters rosters by "Enrolled", "Deferred", "Graduated", "Suspended".',
        impact: 'One-tap switching between active enrollment cohorts.',
      },
      {
        title: 'Multi-Campus Branch Filtering',
        scenario:
          'Super admin segments reports across "Siem Reap Central", "Phnom Penh", "Battambang".',
        impact: 'Compact pills fit horizontally without monopolizing vertical dashboard space.',
      },
    ],
    uxPsychology: [
      {
        principle: "Miller's Law & Chunking",
        detail:
          'Breaks complex multidimensional database queries into easily scanable, bite-sized thematic chunks.',
      },
      {
        principle: 'Instant State Confirmation',
        detail:
          'High-contrast active state (Royal Blue #0056FF fill) gives instantaneous confirmation of active filters.',
      },
    ],
    usageGuidelines: [
      {
        doItem: 'Use full capsule pill radius (rounded-full, 9999px) with 2px continuous border.',
        dontItem: 'Wrap chips onto more than two rows—use horizontal overflow scrolling instead.',
      },
      {
        doItem:
          'Provide an "All" or "Reset" chip to allow users to restore unfiltered view in one click.',
        dontItem: 'Use chips for primary application navigation—use tabs or bottom nav instead.',
      },
    ],
    implementationNotes: [
      'Maintains 32px height with minimum 44px hit-slop bounding box for touch accessibility.',
      'Active state uses Royal Blue #0056FF with soft blue tint; inactive uses neutral slate surfaces.',
      'Supports keyboard arrow navigation and toggle via Space / Enter keys.',
    ],
    codeSnippet: `import { LibraryChip } from '@/features/document/components/ui-library';

export function Example() {
  const [selected, setSelected] = React.useState('Academics');

  return (
    <div className="flex gap-2">
      {['All', 'Academics', 'Students', 'Finance'].map((label) => (
        <LibraryChip
          key={label}
          active={selected === label}
          onClick={() => setSelected(label)}
        >
          {label}
        </LibraryChip>
      ))}
    </div>
  );
}`,
    props: [
      {
        name: 'active',
        type: 'boolean',
        default: 'false',
        description: 'Whether the chip is currently selected.',
      },
      {
        name: 'icon',
        type: 'React.ReactNode',
        default: '—',
        description: 'Optional leading vector icon.',
      },
      {
        name: 'onDismiss',
        type: '() => void',
        default: '—',
        description: 'Optional callback rendering a trailing "x" dismiss button.',
      },
      { name: 'children', type: 'React.ReactNode', default: '—', description: 'Chip label text.' },
    ],
  },
  {
    id: 'switch',
    name: 'Toggle Switch',
    category: 'Inputs',
    paradigm: 'iPhone Settings Paradigm',
    description: 'Accessible hardware-inspired binary toggle switch controlling immediate system preferences and automated background service states.',
    explanation:
      'The Toggle Switch provides instantaneous binary control. Modeled after physical wall switches and iOS Settings controls, it applies configuration adjustments the exact millisecond it is flipped, completely eliminating the need for an awkward secondary "Save Changes" confirmation button.',
    supportedStates: [
      'Default (On)',
      'Off',
      'Disabled',
      'Loading / Transitioning',
      'Real-time Telemetry',
    ],
    realWorldExamples: [
      {
        title: 'Live Server Telemetry Stream',
        scenario: 'IT administrator activates real-time MongoDB change streams for the API.',
        impact: 'Connection opens immediately and metrics start graphing live without saving.',
      },
      {
        title: 'Automated Parent SMS Notifications',
        scenario: 'School principal toggles daily arrival SMS alerts for guardians.',
        impact: 'Rules update instantly in cloud memory with instant telemetry feedback.',
      },
      {
        title: 'Two-Factor Authentication Requirement',
        scenario: 'Super admin enables mandatory 2FA enforcement for staff accounts.',
        impact: 'Security policy applies immediately across all multi-tenant branch portals.',
      },
    ],
    uxPsychology: [
      {
        principle: 'Direct Manipulation & Skeuomorphic Certainty',
        detail:
          'Simulates the physical motion of a mechanical switch, giving unambiguous certainty about system on/off state.',
      },
      {
        principle: 'Zero Latency Expectation',
        detail:
          'Users perceive switches as live power conduits; immediate visual state change matches physical intuition.',
      },
    ],
    usageGuidelines: [
      {
        doItem:
          'Use exclusively for binary states (Enabled/Disabled, On/Off) that take effect immediately.',
        dontItem:
          'Use a switch if the user must still click a separate "Submit" or "Save" button afterwards.',
      },
      {
        doItem:
          'Keep the accompanying label static—never change label text between "On" and "Off" when toggled.',
        dontItem: 'Use switches to select between two non-binary choices like "Male" and "Female".',
      },
    ],
    implementationNotes: [
      'Enforces role="switch" with aria-checked="true|false" for complete assistive technology compatibility.',
      'Track: 48x28px pill; Thumb: 22x22px circle translating with 150ms cubic ease.',
      'Hit-slop bounding box >= 44x44px for touch accessibility.',
    ],
    codeSnippet: `import { LibrarySwitch } from '@/features/document/components/ui-library';

export function Example() {
  const [enabled, setEnabled] = React.useState(true);

  return (
    <div className="flex items-center gap-3">
      <span>Real-time Telemetry</span>
      <LibrarySwitch checked={enabled} onCheckedChange={setEnabled} />
    </div>
  );
}`,
    props: [
      {
        name: 'checked',
        type: 'boolean',
        default: 'false',
        description: 'Current binary state (true = on, false = off).',
      },
      {
        name: 'onCheckedChange',
        type: '(checked: boolean) => void',
        default: '—',
        description: 'Callback invoked upon state toggle.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Prevents interaction when set to true.',
      },
    ],
  },
  {
    id: 'dropdown',
    name: 'Dropdown',
    category: 'Inputs',
    paradigm: 'Google Docs Paradigm',
    description: 'Keyboard-friendly collapsible select menu enabling clean single or multiple option selection with active states.',
    explanation:
      'The Dropdown menu tucks a list of options away under a single trigger button. Inspired by font pickers in Google Docs, it enables users to select from dozens of values without consuming permanent vertical screen real estate.',
    supportedStates: [
      'Default (Closed)',
      'Open / Expanded',
      'Item Selected',
      'Disabled',
      'Focused',
      'Option Switched',
    ],
    realWorldExamples: [
      {
        title: 'Typography Engine Token Selector',
        scenario:
          'Developer selects brand font token: "Sora", "Inter", "IBM Plex Mono", or "Roboto".',
        impact: 'Instantly switches rendering engine across live component previews.',
      },
      {
        title: 'Academic Term & Cohort Selection',
        scenario: 'Registrar selects current active term from a list of past and upcoming years.',
        impact: 'Scopes all dashboard queries to the selected academic period.',
      },
      {
        title: 'Report Export Format Picker',
        scenario: 'Bursar picks export encoding format: CSV, Excel XLSX, PDF Ledger.',
        impact: 'Pre-configures serverless export generator before download begins.',
      },
    ],
    uxPsychology: [
      {
        principle: 'Progressive Disclosure (Jakob Nielsen)',
        detail:
          'Hides secondary option lists until explicitly requested, preserving clean, focused visual hierarchy.',
      },
      {
        principle: "Hick's Law Optimization",
        detail:
          'Grouping related options within an indexed dropdown minimizes search time compared to sprawling radio lists.',
      },
    ],
    usageGuidelines: [
      {
        doItem:
          'Highlight the active option with a clear checkmark and high-contrast bold typography.',
        dontItem:
          'Use a dropdown when there are only 2 options—use a switch or radio buttons instead.',
      },
      {
        doItem:
          'Dismiss the menu automatically upon selection, outside click, or Escape key press.',
        dontItem: 'Use multi-level nested hover flyout menus on mobile touch screens.',
      },
    ],
    implementationNotes: [
      'Trigger button: minimum 44px height; menu items maintain 40px height with 44px touch slop.',
      'Full keyboard navigation: ArrowUp/ArrowDown to navigate, Enter to select, Escape to close.',
      'Surface: Level 2 Elevated (#202024 / white) with 1px border and zero drop shadows.',
    ],
    codeSnippet: `import { LibraryDropdown } from '@/features/document/components/ui-library';

export function Example() {
  const [val, setVal] = React.useState('sora');

  return (
    <LibraryDropdown
      label="Typography Engine"
      value={val}
      onChange={setVal}
      options={[
        { value: 'sora', label: 'Sora — Brand Typography' },
        { value: 'inter', label: 'Inter — UI Standard' },
      ]}
    />
  );
}`,
    props: [
      { name: 'label', type: 'string', default: '—', description: 'Top descriptive label.' },
      {
        name: 'placeholder',
        type: 'string',
        default: "'Select an option...'",
        description: 'Placeholder when no value is selected.',
      },
      {
        name: 'options',
        type: 'DropdownOption[]',
        default: '[]',
        description: 'Array of value, label, and description objects.',
      },
      {
        name: 'value',
        type: 'string',
        default: '—',
        description: 'Currently selected option value.',
      },
      {
        name: 'onChange',
        type: '(value: string) => void',
        default: '—',
        description: 'Callback invoked upon new selection.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Disables menu interaction.',
      },
    ],
  },
  {
    id: 'card',
    name: 'Card',
    category: 'Display',
    paradigm: 'Airbnb Paradigm',
    description: 'Architectural flat surface container organizing interrelated telemetry data, controls, and media with zero shadows.',
    explanation:
      'The Card is an all-purpose container for grouped information. Modeled after Airbnb property cards, it packages media, title, descriptive metadata, and action triggers into a single cohesive unit, establishing clear perceptual boundaries between disparate entities.',
    supportedStates: [
      'Default',
      'Hovered',
      'Enrolled / Selected',
      'Disabled',
      'Dark Theme',
      'Futurewave Variant',
    ],
    realWorldExamples: [
      {
        title: 'Autonomous Robotics Elective Card',
        scenario:
          'Displays course banner, title, description, 3 credits badge, and one-tap Enroll button.',
        impact: 'Students compare course offerings and enroll with direct visual confirmation.',
      },
      {
        title: 'Student Identity Card',
        scenario:
          'Displays student portrait, national code, grade level, and emergency guardian contact.',
        impact: 'Compact card format renders consistently across mobile cards and desktop grids.',
      },
      {
        title: 'Tuition Invoice Summary Card',
        scenario:
          'Summarizes academic term fee balance, due date, payment status, and one-tap Pay action.',
        impact:
          'Parents review invoice details and initiate payments directly from the card footer.',
      },
    ],
    uxPsychology: [
      {
        principle: 'Gestalt Law of Common Region',
        detail:
          'Enclosing disparate data types within a common 16px border leads human perception to interpret them as one logical entity.',
      },
      {
        principle: 'Affordance of Interactive Elevation',
        detail:
          'Subtle border illumination and micro-transitions signal clickability without heavy artificial drop shadows.',
      },
    ],
    usageGuidelines: [
      {
        doItem: 'Use 16px radius (rounded-2xl) with 1px continuous keyline border.',
        dontItem:
          'Apply heavy black drop shadows—depth is established purely via luminance contrast.',
      },
      {
        doItem: 'Organize internal hierarchy logically: Media -> Title -> Description -> Actions.',
        dontItem: 'Crowd cards with dozens of tiny competing buttons—keep to one primary CTA.',
      },
    ],
    implementationNotes: [
      'Padding in multiples of 4px / 8px (typically 16px or 20px).',
      'Supports interactive hover micro-motion (-translate-y-0.5) and keyboard focus rings.',
      'Surface: Level 1 Subsurface (#161619 / white) with 1px border-slate-200/80.',
    ],
    codeSnippet: `import {
  LibraryCard,
  LibraryCardHeader,
  LibraryCardTitle,
  LibraryCardDescription,
  LibraryCardFooter,
} from '@/features/document/components/ui-library';

export function Example() {
  return (
    <LibraryCard>
      <LibraryCardHeader>
        <LibraryCardTitle>Autonomous Robotics</LibraryCardTitle>
        <LibraryCardDescription>Sensors, telemetry & embedded systems.</LibraryCardDescription>
      </LibraryCardHeader>
      <LibraryCardFooter>
        <button className="border px-3 py-1 rounded">Enroll</button>
      </LibraryCardFooter>
    </LibraryCard>
  );
}`,
    props: [
      {
        name: 'interactive',
        type: 'boolean',
        default: 'false',
        description: 'Enables hover elevation and active press states.',
      },
      {
        name: 'children',
        type: 'React.ReactNode',
        default: '—',
        description: 'Header, media, body, and footer card components.',
      },
    ],
  },
  {
    id: 'input',
    name: 'Pill Input & Search',
    category: 'Inputs',
    paradigm: 'Capsule Pill Standard',
    description: 'Precision text input field featuring inline icon slots, interactive action buttons, and clear validation.',
    explanation:
      'The Pill Input & Search component applies capsule button aesthetics to form inputs. It features a continuous 2px border, rounded-full geometry, integrated search icon with zero background color, clear "x" button, and eliminates native browser focus rectangles for clean, unified ergonomics.',
    supportedStates: [
      'Default',
      'Focused',
      'With Text',
      'Clearable',
      'Loading',
      'Disabled',
      'Error',
      'Royal Blue',
      'Azure Blue',
      'Soft Lavender',
      'Black',
    ],
    realWorldExamples: [
      {
        title: 'Global Component Catalog Search',
        scenario: 'Developer searches through 47 domain modules and UI components.',
        impact: 'Filters cards in real time with instantaneous typing responsiveness.',
      },
      {
        title: 'Student Directory Quick Lookup',
        scenario: 'Front-desk admissions clerk types student national ID or English name.',
        impact: 'Clean search icon and instant clear button enable high-speed directory lookups.',
      },
      {
        title: 'Financial Transaction Ledger Query',
        scenario: 'Bursar searches tuition payments by bank receipt transaction hash.',
        impact:
          'High-contrast focus ring confirms active keyboard input without awkward inner borders.',
      },
    ],
    uxPsychology: [
      {
        principle: 'Formal Consistency & Visual Rhythm',
        detail:
          'Aligning input geometry with capsule pill buttons creates visual rhythm and reinforces design system maturity.',
      },
      {
        principle: 'User Control & Freedom (Jakob Nielsen)',
        detail:
          'Providing an instant clear "x" button allows users to wipe entered queries in a single tap without backspacing.',
      },
    ],
    usageGuidelines: [
      {
        doItem:
          'Use focus:outline-none focus:ring-0 on inner input to eliminate ugly default browser outline boxes.',
        dontItem:
          'Add colored square backgrounds behind the search icon—keep icons clean and inline.',
      },
      {
        doItem: 'Provide a clear "x" button whenever text is present in search inputs.',
        dontItem: 'Use placeholder text as the only label for critical form submissions.',
      },
    ],
    implementationNotes: [
      'Built using GeometricInput with support for variants: outline, blue, azure, soft-lavender, black, error.',
      'Supports type="search", type="text", type="email", and type="number".',
      'Sizes: sm (h-8), md (h-10), lg (h-12) with full responsive touch targets.',
    ],
    codeSnippet: `import { GeometricInput } from '@/features/document/components/ui-library';
import { Search } from '@/components/icons';

export function Example() {
  const [query, setQuery] = React.useState('');

  return (
    <GeometricInput
      type="search"
      placeholder="Search students, classes, or modules..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      clearable
      onClear={() => setQuery('')}
      icon={<Search className="h-4 w-4" />}
      variant="blue"
      inputSize="md"
    />
  );
}`,
    props: [
      {
        name: 'variant',
        type: "'outline' | 'blue' | 'azure' | 'soft-lavender' | 'black' | 'error'",
        default: "'outline'",
        description: 'Primary brand color theme.',
      },
      {
        name: 'inputSize',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: 'Height preset: sm (32px), md (40px), lg (48px).',
      },
      {
        name: 'icon',
        type: 'React.ReactNode',
        default: '—',
        description: 'Clean leading vector icon (e.g. Search).',
      },
      {
        name: 'clearable',
        type: 'boolean',
        default: 'false',
        description: 'Renders an instant clear "x" button when text is present.',
      },
      {
        name: 'onClear',
        type: '() => void',
        default: '—',
        description: 'Callback invoked when clear button is clicked.',
      },
      {
        name: 'isLoading',
        type: 'boolean',
        default: 'false',
        description: 'Renders an inline spinner during async queries.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Disables input interaction.',
      },
    ],
  },
  // NAVIGATION GROUP
  {
    id: 'rail-toc',
    name: 'Rail TOC',
    category: 'Navigation',
    paradigm: 'Paper Plane Flight Rail Standard',
    description:
      'Kinetic table of contents featuring an origami paper plane navigating continuous vertical section rails.',
    explanation:
      'Scroll the content and the paper plane flies along the rail between headings, turning where the rail bends. Scroll back up and it turns around. The rail behind it is solid and each heading it passes fills in; the rest stays dashed. Click any heading to scroll to it.',
    props: [
      {
        name: 'items',
        type: '{ id: string; label: string; depth?: number }[]',
        description: 'Headings in document order. Each id must match an element id in content.',
      },
      {
        name: 'containerRef',
        type: 'React.RefObject<HTMLElement | null>',
        default: 'window',
        description:
          'Scroll container to track and scroll within. Defaults to window when omitted.',
      },
      {
        name: 'offset',
        type: 'number',
        default: '100',
        description: 'Distance in pixels below scroller top edge where heading counts as reached.',
      },
      {
        name: 'indent',
        type: 'number',
        default: '16',
        description: 'Horizontal step in pixels for each depth level.',
      },
      {
        name: 'title',
        type: 'string',
        default: "'On this page'",
        description: 'Text above the list and accessibility landmark label.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Extra classes merged onto root nav with data-slot attributes.',
      },
    ],
    codeSnippet: `import { RailToc } from '@/features/document/components/ui-library';

export function Example() {
  return (
    <RailToc
      items={[
        { id: 'installation', label: 'Installation', depth: 0 },
        { id: 'prerequisites', label: 'Prerequisites', depth: 1 },
        { id: 'installation-steps', label: 'Installation Steps', depth: 1 },
        { id: 'configuration', label: 'Configuration', depth: 1 },
        { id: 'usage', label: 'Usage', depth: 0 },
        { id: 'customizing-content', label: 'Customizing Content', depth: 1 },
        { id: 'submenu-content', label: 'Submenu Content', depth: 2 },
        { id: 'features', label: 'Features', depth: 0 },
      ]}
      title="On this page"
    />
  );
}`,
    realWorldExamples: [
      {
        title: 'Developer Documentation & Technical Guides',
        scenario: 'Developers reading multi-tier API specs and guides with nested sub-headings.',
        impact: 'Delightful spatial feedback with intuitive scroll-driven milestone tracking.',
      },
      {
        title: 'Academic Syllabus & Long Institutional Manuals',
        scenario:
          'Staff and students reviewing semester syllabi and multi-depth handbook sections.',
        impact: 'Clear situational orientation without losing context across hierarchy tiers.',
      },
    ],
    uxPsychology: [
      {
        principle: 'Spatial Wayfinding & Tangent Directionality',
        detail:
          'Paper plane rotates along the tangent of travel, reinforcing spatial momentum and reading flow.',
      },
      {
        principle: 'Doherty Threshold & Kinetic Continuity',
        detail:
          'Sub-300ms spring-damped tracking keeps animation responsive to rapid scroll gestures.',
      },
    ],
    usageGuidelines: [
      {
        doItem: 'Use nested depth (0, 1, 2) to convey semantic heading hierarchy cleanly.',
        dontItem: 'Exceed 3 depth levels to prevent rail cramping on narrow mobile viewports.',
      },
      {
        doItem:
          'Ensure target headings carry matching DOM element ids for smooth-scroll acquisition.',
        dontItem: 'Render redundant floating scrollbars inside the Table of Contents rail.',
      },
    ],
    implementationNotes: [
      '01 Paper Plane Flight: Motion spring physics track active heading with tangent-angle alignment and 180-deg reversal on scroll-up.',
      '02 Indented Rail Geometry: Cubic Bézier S-curves connecting headings across depth levels (depth 0, 1, 2) with smooth filleted bends.',
      '03 Dual Stroke Rail: Solid line behind active plane, dashed stroke ahead; node circles fill in as passed.',
      '04 Standard Button Tokens: All interactive controls enforce border-0 and rounded-[4px] subtle corner radius.',
    ],
    supportedStates: [
      'Ahead of Scroller (Dashed Rail / Hollow Node)',
      'Active Reading Head (Paper Plane Aligned)',
      'Passed Section (Solid Rail / Filled Circle)',
      'Scroll Reversal (Turn Around 180deg)',
    ],
  },
  {
    id: 'bounce-sidebar',
    name: 'Bounce Sidebar',
    category: 'Navigation',
    paradigm: 'Spring Physics Standard',
    description: 'Drawer navigation panel utilizing spring-physics bounce damping to produce fluid, organic open and close transitions.',
    explanation: 'Applies cubic-bezier spring overshoot physics on collapse and expansion.',
    props: [{ name: 'isOpen', type: 'boolean', description: 'Drawer state.' }],
    codeSnippet: `import { BounceSidebarDemo } from '@/features/document/components/ui-library';\n\n<BounceSidebarDemo />`,
    realWorldExamples: [
      {
        title: 'Workspace Nav',
        scenario: 'Teachers collapse the sidebar.',
        impact: 'Fluid feedback.',
      },
    ],
    uxPsychology: [{ principle: 'Doherty Threshold', detail: 'Sub-300ms transition.' }],
    usageGuidelines: [{ doItem: 'Use spring physics.', dontItem: 'Do not lock animations.' }],
    implementationNotes: ['Cubic bezier spring curves.'],
    supportedStates: ['Expanded', 'Collapsed'],
  },
  {
    id: 'hook-sidebar',
    name: 'Hook Sidebar',
    category: 'Navigation',
    paradigm: 'Kinetic Pull Paradigm',
    description: 'Edge-anchored tactile kinetic pull tab that slides out a dedicated drawer for administrative tools.',
    explanation: 'Provides an edge-pinned kinetic hook that pulls open contextual tools.',
    props: [{ name: 'isHooked', type: 'boolean', description: 'Open state.' }],
    codeSnippet: `import { HookSidebarDemo } from '@/features/document/components/ui-library';\n\n<HookSidebarDemo />`,
    realWorldExamples: [
      {
        title: 'Quick Ledger',
        scenario: 'Accountant peeks at daily ledger.',
        impact: 'Preserves context.',
      },
    ],
    uxPsychology: [{ principle: 'Affordance', detail: 'Visual tab invites pull gesture.' }],
    usageGuidelines: [{ doItem: 'Anchor cleanly.', dontItem: 'Avoid blocking page content.' }],
    implementationNotes: ['Absolute anchored tab with translate-x drawer.'],
    supportedStates: ['Closed', 'Hooked Open'],
  },
  {
    id: 'proximity-sidebar',
    name: 'Proximity Sidebar',
    category: 'Navigation',
    paradigm: 'Cursor Proximity Standard',
    description: 'Intelligent rail sidebar that expands dynamically into a full navigation drawer upon cursor approach.',
    explanation: 'Minimizes cognitive load by expanding only when cursor moves into proximity.',
    props: [{ name: 'threshold', type: 'number', description: 'Proximity distance in px.' }],
    codeSnippet: `import { ProximitySidebarDemo } from '@/features/document/components/ui-library';\n\n<ProximitySidebarDemo />`,
    realWorldExamples: [
      {
        title: 'Power User Nav',
        scenario: 'Staff navigates multi-branch tools.',
        impact: 'Maximum canvas area.',
      },
    ],
    uxPsychology: [{ principle: 'Hick’s Law', detail: 'Keeps main viewport uncluttered.' }],
    usageGuidelines: [
      { doItem: 'Smooth width transitions.', dontItem: 'Avoid abrupt layout shifts.' },
    ],
    implementationNotes: ['Mouse enter/leave boundary listeners.'],
    supportedStates: ['Compact Rail', 'Expanded Dock'],
  },
  {
    id: 'scroll-progress',
    name: 'Scroll Progress',
    category: 'Navigation',
    paradigm: 'Milestone Tracker Standard',
    description: 'Top-anchored document reading meter tracking scroll progress, chapter milestones, and estimated remaining reading time.',
    explanation: 'Visualizes document consumption percentage with tick milestone markers.',
    props: [{ name: 'progress', type: 'number', description: 'Progress percentage (0-100).' }],
    codeSnippet: `import { ScrollProgressDemo } from '@/features/document/components/ui-library';\n\n<ScrollProgressDemo />`,
    realWorldExamples: [
      {
        title: 'Curriculum Reading',
        scenario: 'Student studies exam regulations.',
        impact: 'Clear completion signal.',
      },
    ],
    uxPsychology: [
      { principle: 'Goal Gradient Effect', detail: 'Accelerates completion motivation.' },
    ],
    usageGuidelines: [{ doItem: 'Show percentage.', dontItem: 'Do not obstruct navigation.' }],
    implementationNotes: ['Rounded continuous progress track.'],
    supportedStates: ['Active', 'Complete'],
  },
  {
    id: 'gooey-nav',
    name: 'Gooey Nav',
    category: 'Navigation',
    paradigm: 'Fluid Pill Paradigm',
    description: 'High-performance fluid tab indicator gliding with liquid surface tension between active destination pill buttons.',
    explanation: 'Smoothly interpolates pill geometry between destination segments.',
    props: [{ name: 'activeTab', type: 'string', description: 'Currently selected segment.' }],
    codeSnippet: `import { GooeyNavDemo } from '@/features/document/components/ui-library';\n\n<GooeyNavDemo />`,
    realWorldExamples: [
      {
        title: 'Period Switcher',
        scenario: 'Registrar toggles Day/Week view.',
        impact: 'Delightful fluidity.',
      },
    ],
    uxPsychology: [{ principle: 'Continuity', detail: 'Guides eye between states.' }],
    usageGuidelines: [{ doItem: 'Use fluid pill indicator.', dontItem: 'Do not delay selection.' }],
    implementationNotes: ['CSS transition on background pill.'],
    supportedStates: ['Day', 'Week', 'Month'],
  },
  {
    id: 'cyber-armor-nav',
    name: 'Cyber Armor Nav',
    category: 'Navigation',
    paradigm: 'Aerospace Mecha HUD Console',
    description:
      'Aerospace mecha HUD console navigation bar featuring chamfered armor plates and luminous Royal Blue styling.',
    explanation:
      'Combines chamfered 45° stepped mecha armor wings, physical double-seam divider lines, and a luminous Royal Blue (#0056FF) active indicator bar.',
    props: [
      {
        name: 'items',
        type: 'HangingTabItem[]',
        description: 'Array of navigation items with id, label, and optional icon.',
      },
      { name: 'activeId', type: 'string', description: 'Currently active tab ID.' },
      { name: 'onSelect', type: '(id: string) => void', description: 'Tab selection callback.' },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        description: 'Console size variant (sm: 44px, md: 50px, lg: 56px).',
      },
      { name: 'showIcons', type: 'boolean', description: 'Whether to render kinetic micro-icons.' },
    ],
    codeSnippet: `import { CyberArmorNav } from '@/features/document/components/ui-library';\n\nconst items = [\n  { id: 'home', label: 'Home' },\n  { id: 'blog', label: 'Blog' },\n  { id: 'portfolio', label: 'Portfolio' },\n  { id: 'services', label: 'Services' },\n];\n\n<CyberArmorNav items={items} activeId="portfolio" onSelect={console.log} />`,
    realWorldExamples: [
      {
        title: 'Sticky Header Hub Navigation',
        scenario: 'Developer switches between UI Library and Open API documentation routes.',
        impact: 'Distinct aerospace mecha branding with instant visual feedback.',
      },
      {
        title: 'Multi-Module Workspace Console',
        scenario: 'Campus registrar toggles across Student, Academic, and Ledger modules.',
        impact: 'Ergonomic 50px touch target with tactile double-seam divider feedback.',
      },
    ],
    uxPsychology: [
      {
        principle: "Fitts's Law Target Sizing",
        detail: '44px-56px button height ensures effortless cursor targeting.',
      },
      {
        principle: 'Visual Hierarchy & Affordance',
        detail: 'Stepped armor wings and active glow bar draw focal attention to location.',
      },
    ],
    usageGuidelines: [
      {
        doItem: 'Use Royal Blue (#0056FF) glow underline for the active item.',
        dontItem: 'Never use circular dot style indicators.',
      },
      {
        doItem: 'Keep button labels concise and uppercase with Sora tracking.',
        dontItem: 'Avoid overcrowded labels exceeding 14 characters.',
      },
    ],
    implementationNotes: [
      'Responsive SVG stepped armor chassis with 45° chamfers.',
      'Double-seam divider: 1px dark border paired with 1px white highlight line.',
      'Active bar: linear-gradient(#0056FF, #2277FF) with 10px box-shadow glow.',
    ],
    supportedStates: ['Default', 'Hover', 'Active Glow', 'Focus Visible'],
  },

  // INPUTS GROUP
  {
    id: 'duration-picker',
    name: 'Duration Picker',
    category: 'Inputs',
    paradigm: 'Tactile Stepper Standard',
    description: 'Quick duration selector combining preset time capsules with an increment stepper for meeting scheduling.',
    explanation: 'Combines fast 15m/30m/1h quick preset pills with incremental adjustment.',
    props: [{ name: 'minutes', type: 'number', description: 'Duration in minutes.' }],
    codeSnippet: `import { DurationPickerDemo } from '@/features/document/components/ui-library';\n\n<DurationPickerDemo />`,
    realWorldExamples: [
      {
        title: 'Class Scheduling',
        scenario: 'Academic coordinator sets period length.',
        impact: 'One-tap presets.',
      },
    ],
    uxPsychology: [{ principle: "Miller's Law", detail: 'Pre-chunked duration values.' }],
    usageGuidelines: [
      { doItem: 'Provide common increments.', dontItem: 'Avoid freeform typing only.' },
    ],
    implementationNotes: ['Preset buttons plus custom stepper.'],
    supportedStates: ['Preset Selected', 'Custom Stepper'],
  },
  {
    id: 'otp-input',
    name: 'OTP / PIN Code Input',
    category: 'Inputs',
    paradigm: 'Multi-Cell 2FA Standard',
    description:
      'Segmented six-digit code input featuring auto-advance, clipboard paste parsing, backspace navigation, and error shake.',
    explanation:
      'Type a digit to advance, paste a 6-digit code to fill all cells, backspace to step back. Wrong codes shake; the right one auto-submits.',
    props: [
      {
        name: 'length',
        type: 'number',
        default: '6',
        description: 'Number of segmented digit cells.',
      },
      {
        name: 'expectedPin',
        type: 'string',
        default: "'842910'",
        description: 'Valid verification code for authentication approval.',
      },
      {
        name: 'theme',
        type: "'light' | 'dark'",
        default: "'light'",
        description: 'Instrument panel color palette.',
      },
      {
        name: 'autoFocus',
        type: 'boolean',
        default: 'false',
        description: 'Focus first empty cell on mount.',
      },
      {
        name: 'onComplete',
        type: '(pin: string) => void',
        description: 'Callback fired on auto-submit verification.',
      },
      {
        name: 'onError',
        type: '(pin: string) => void',
        description: 'Callback fired when submitted code fails verification.',
      },
    ],
    codeSnippet: `import { OtpPinInput } from '@/features/document/components/ui-library';\n\n<OtpPinInput length={6} expectedPin="842910" onComplete={(pin) => console.log('Approved:', pin)} />`,
    realWorldExamples: [
      {
        title: 'Two-Factor Auth Verification',
        scenario: 'Campus Director enters 6-digit SMS verification code to sign in.',
        impact: 'Zero typing friction with instant auto-submit upon 6th digit.',
      },
      {
        title: 'Tuition Disbursement PIN',
        scenario:
          'Bursar confirms high-value campus treasury transaction with numeric security PIN.',
        impact: 'Immediate tactile error shake alerts user if wrong PIN is entered.',
      },
    ],
    uxPsychology: [
      {
        principle: 'Doherty Threshold & Auto-Advance',
        detail:
          'Instantaneous focus forwarding keeps user typing rhythm uninterrupted below 100ms.',
      },
      {
        principle: 'Visual Progress & Cognitive Load',
        detail:
          'Subtle cyan tint on filled cells gives immediate peripheral visual feedback on completion progress.',
      },
    ],
    usageGuidelines: [
      {
        doItem:
          'USE THIS WHEN: Verifying a one-time code from email or SMS for sign-in, password reset, or 2FA.',
        dontItem:
          'NOT IDEAL WHEN: The code contains letters or symbols — use a single text input with monospace font instead.',
      },
      {
        doItem:
          'USE THIS WHEN: Confirming a payment, transaction, or destructive action with a short numeric PIN.',
        dontItem:
          'NOT IDEAL WHEN: The code is longer than 8 characters — segmented cells become cramped and easy to misread.',
      },
      {
        doItem:
          'USE THIS WHEN: Onboarding flows that need to confirm phone or email ownership before account creation.',
        dontItem:
          'NOT IDEAL WHEN: The user needs to memorize and type the same code repeatedly — a normal password field is friendlier.',
      },
    ],
    implementationNotes: [
      '01 Segmented Cells: Six independent inputs in a row, each holding exactly one numeric character with stable tabular widths.',
      '02 Auto-Advance: Typing a digit instantly forwards focus to the next empty cell — no extra clicks, no Tab presses.',
      '03 Smart Paste: Pasting a 6-digit code anywhere in the row strips non-digits and distributes one character per cell.',
      '04 Backspace Step-Back: Backspace on an empty cell jumps focus to the previous one and clears it — the gesture every user expects.',
      '05 Filled vs. Empty: Filled cells get a subtle cyan tint so partial progress is obvious at a glance.',
      '06 Error Shake: A 500ms horizontal shake plus red recolor signals invalid codes without disrupting the page layout.',
      '07 SMS Auto-Fill: autocomplete="one-time-code" lets iOS, Safari, and Chrome offer SMS codes inline above the keyboard.',
      '08 Live Status Region: An aria-live polite status line announces success or error to screen readers without stealing focus.',
    ],
    supportedStates: [
      'Empty',
      'In Progress (Cyan Tint)',
      'Validating',
      'Success (Auto-Submit)',
      'Error (Shake)',
    ],
  },
  {
    id: 'password-input',
    name: 'Password Input',
    category: 'Inputs',
    paradigm: 'Strength Policy Standard',
    description: 'Secure authentication passkey input with eye toggle visibility, live strength meter, and compliance checklist.',
    explanation: 'Visualizes password entropy and policy compliance in real-time.',
    props: [{ name: 'value', type: 'string', description: 'Password string.' }],
    codeSnippet: `import { PasswordInputDemo } from '@/features/document/components/ui-library';\n\n<PasswordInputDemo />`,
    realWorldExamples: [
      {
        title: 'Staff Onboarding',
        scenario: 'HR registers new employee credentials.',
        impact: 'Enforces security.',
      },
    ],
    uxPsychology: [{ principle: 'Direct Feedback', detail: 'Real-time color bar.' }],
    usageGuidelines: [{ doItem: 'Show checklist.', dontItem: 'Never hide validation rules.' }],
    implementationNotes: ['Regex strength checks.'],
    supportedStates: ['Weak', 'Fair', 'Strong'],
  },
  {
    id: 'theme-selector',
    name: 'Theme Selector',
    category: 'Inputs',
    paradigm: 'Luminance Switch Standard',
    description: 'Visual segmented mode switcher toggling interface aesthetics seamlessly between Light, Dark, and System preferences.',
    explanation: 'Presents visual mini-window tiles representing application luminance modes.',
    props: [{ name: 'theme', type: 'string', description: 'Selected mode.' }],
    codeSnippet: `import { ThemeSelectorDemo } from '@/features/document/components/ui-library';\n\n<ThemeSelectorDemo />`,
    realWorldExamples: [
      {
        title: 'User Preferences',
        scenario: 'Teacher selects dark mode.',
        impact: 'Instant tactile switch.',
      },
    ],
    uxPsychology: [{ principle: 'Recognition over Recall', detail: 'Visual preview tiles.' }],
    usageGuidelines: [{ doItem: 'Show preview tiles.', dontItem: 'Avoid plain text dropdowns.' }],
    implementationNotes: ['Grid of interactive cards.'],
    supportedStates: ['Light', 'Dark', 'System'],
  },
  {
    id: 'delete-button',
    name: 'Delete Button',
    category: 'Inputs',
    paradigm: 'Safety Gate Standard',
    description: 'Deliberate two-stage confirmation action button introducing intentional friction to prevent accidental record purging.',
    explanation: 'Requires an explicit secondary confirmation click to prevent accidental loss.',
    props: [{ name: 'onConfirm', type: '() => void', description: 'Execution handler.' }],
    codeSnippet: `import { DeleteButtonDemo } from '@/features/document/components/ui-library';\n\n<DeleteButtonDemo />`,
    realWorldExamples: [
      {
        title: 'Record Purge',
        scenario: 'Registrar deletes draft certificate.',
        impact: 'Zero accidental clicks.',
      },
    ],
    uxPsychology: [
      { principle: 'Error Prevention', detail: 'Two-step confirmation prevents slips.' },
    ],
    usageGuidelines: [{ doItem: 'Provide cancel option.', dontItem: 'Never execute in 1-click.' }],
    implementationNotes: ['State machine: idle -> confirm -> deleted.'],
    supportedStates: ['Idle', 'Confirming', 'Purged'],
  },
  {
    id: 'task-list',
    name: 'Task List',
    category: 'Inputs',
    paradigm: 'Interactive Checklist Standard',
    description: 'Interactive checklist supporting animated checkmark completion, instant task adding, and reactive item count tracking.',
    explanation: 'Interactive task tracker with check animation and completion counts.',
    props: [{ name: 'tasks', type: 'Array<{id, title, done}>', description: 'Task items.' }],
    codeSnippet: `import { TaskListDemo } from '@/features/document/components/ui-library';\n\n<TaskListDemo />`,
    realWorldExamples: [
      {
        title: 'Campus Checklist',
        scenario: 'Branch manager completes daily opening tasks.',
        impact: 'Structured verification.',
      },
    ],
    uxPsychology: [{ principle: 'Zeigarnik Effect', detail: 'Incomplete tasks drive completion.' }],
    usageGuidelines: [
      {
        doItem: 'Strike through completed.',
        dontItem: 'Do not remove completed items immediately.',
      },
    ],
    implementationNotes: ['State array with toggle and add.'],
    supportedStates: ['Active', 'Completed'],
  },

  // FEEDBACK GROUP
  {
    id: 'toast-stack',
    name: 'Toast Notification Stack',
    category: 'Feedback',
    paradigm: 'Stacked Notifications Standard',
    description:
      'Stacked notification queue providing timed auto-dismissal, linear countdown bars, and fluid enter and exit animations.',
    explanation:
      'Click any button to fire a toast notification. Toasts stack vertically, auto-dismiss with a progress bar countdown, and can be manually closed.',
    props: [
      {
        name: 'toasts',
        type: 'ToastItemData[]',
        description: 'Active stack of notifications currently rendered in DOM.',
      },
      {
        name: 'position',
        type: "'fixed' | 'inline'",
        default: "'fixed'",
        description: 'Fixed viewport anchor (top-right) or relative container sandbox.',
      },
      {
        name: 'theme',
        type: "'light' | 'dark'",
        default: "'light'",
        description: 'Color theme for notification surfaces and backdrop blur.',
      },
      {
        name: 'onDismiss',
        type: '(id: string) => void',
        description: 'Callback invoked when a toast is closed manually or via timeout.',
      },
    ],
    codeSnippet: `import { toast, ToastContainer } from '@/features/document/components/ui-library';\n\n// Fire notifications programmatically\ntoast.success('Batch transaction committed successfully.', {\n  title: 'Ledger Hash Verified',\n  duration: 4500,\n});\n\n// Mount global or local container\n<ToastContainer position="fixed" />`,
    realWorldExamples: [
      {
        title: 'Asynchronous Ledger Commit Notification',
        scenario:
          'Registrar executes high-volume student batch fee processing; background worker reports completed commits.',
        impact: 'Non-blocking confirmation with 18px status icons and countdown strip.',
      },
      {
        title: 'Security & Audit Token Rejection Alert',
        scenario:
          'Security monitoring detects unauthorized token signature and alerts administrator without page reload.',
        impact: 'High-contrast rose-red error toast with hover pause and manual dismissal.',
      },
    ],
    uxPsychology: [
      {
        principle: 'Doherty Threshold & Physical Feedback',
        detail:
          'Slide-in animation with subtle scale bounce gives feedback immediate physical responsiveness under 300ms.',
      },
      {
        principle: "Postel's Law & Hover Pause",
        detail:
          'Users are given full control to pause the auto-dismiss timer on hover, preventing premature dismissal of complex text.',
      },
    ],
    usageGuidelines: [
      {
        doItem:
          'USE THIS WHEN: Confirming user actions like form submissions, saves, or deletions with non-blocking feedback.',
        dontItem:
          'NOT IDEAL WHEN: The message requires user action — use a modal or inline alert instead.',
      },
      {
        doItem:
          'USE THIS WHEN: Surfacing background events — API responses, sync status, or incoming updates.',
        dontItem:
          'NOT IDEAL WHEN: Showing inline form validation errors that should appear next to the field.',
      },
      {
        doItem:
          'USE THIS WHEN: Building SaaS dashboards or admin panels that need a polished notification layer.',
        dontItem:
          'NOT IDEAL WHEN: Critical destructive confirmations where the user must explicitly acknowledge.',
      },
    ],
    implementationNotes: [
      '01 Toast Container: Fixed-position stack anchored to the top-right, holding up to 5 toasts with automatic overflow management.',
      '02 Type Variants: Four distinct types — success, error, warning, info — each with a unique color and icon for instant recognition.',
      '03 Icon System: Inline SVG icons sized at 18px with color inherited from the toast type for consistent visual language.',
      '04 Progress Bar: A 2px countdown strip that visually communicates remaining time before auto-dismiss.',
      '05 Enter Animation: Slide-in from the right with a subtle scale bounce, giving toasts a physical, responsive feel.',
      '06 Exit & Collapse: Two-phase removal: fade-slide out, then collapse height so remaining toasts reflow smoothly.',
      '07 Hover Pause: Hovering a toast freezes its countdown timer and progress bar so users have time to read.',
      '08 Programmatic API: Simple show/dismiss interface returning unique IDs for full control from application code.',
    ],
    supportedStates: [
      'Idle (Stack Empty)',
      'Entering (Right Slide & Bounce)',
      'Counting Down (Progress Strip Active)',
      'Hover Paused',
      'Two-Phase Exit & Collapsing',
    ],
  },
  {
    id: 'skeleton-loading-screen',
    name: 'Skeleton Loading Screen',
    category: 'Feedback',
    paradigm: 'CSS Shimmer Placeholder Standard',
    description: 'Zero-JavaScript CSS shimmer placeholders communicating layout geometry while asynchronous data streams load into memory.',
    explanation:
      'Three common skeleton patterns — profile header, card grid, and content list — all animated with a single CSS keyframe. Click the preview to toggle the loaded state.',
    props: [
      {
        name: 'variant',
        type: "'rect' | 'circle' | 'text'",
        default: "'rect'",
        description: 'Placeholder geometric shape for avatars, text lines, or media cards.',
      },
      {
        name: 'width',
        type: 'string | number',
        description: 'Explicit width dimension to preserve exact layout geometry.',
      },
      {
        name: 'height',
        type: 'string | number',
        description: 'Explicit height dimension preventing cumulative layout shift (CLS).',
      },
      {
        name: 'theme',
        type: "'light' | 'dark'",
        default: "'light'",
        description: 'Design token colorway configuring base surface and shimmer contrast.',
      },
    ],
    codeSnippet: `import { Skeleton } from '@/features/document/components/ui-library';\n\n// Avatar circle and text line placeholders\n<Skeleton variant=\"circle\" className=\"size-16\" />\n<Skeleton variant=\"text\" className=\"w-48 h-5\" />\n<Skeleton className=\"w-full aspect-video rounded-xl\" />`,
    realWorldExamples: [
      {
        title: 'Asynchronous Institutional Feeds & Dashboards',
        scenario:
          'Dashboard displays instant layout structure while backend aggregation queries compute student statistics.',
        impact: 'Eliminates Cumulative Layout Shift (CLS = 0) and reduces perceived latency.',
      },
      {
        title: 'Curriculum & Syllabi Media Grid Pre-Rendering',
        scenario:
          'Media cards preserve strict 16:9 aspect ratios before image assets stream from CDN storage.',
        impact: 'Maintains page stability without content jumpiness.',
      },
    ],
    uxPsychology: [
      {
        principle: 'Perceived Performance & Cognitive Readiness',
        detail:
          'Skeleton screens anticipate incoming content layout, making wait times feel 30% shorter than blank spinner states.',
      },
      {
        principle: "Miller's Law & Chunked Layout Delivery",
        detail:
          'Pre-rendering recognizable UI regions lets users visually orient their attention before data arrives.',
      },
    ],
    usageGuidelines: [
      {
        doItem:
          'USE THIS WHEN: Content-heavy pages where data arrives asynchronously — feeds, dashboards, profiles.',
        dontItem:
          'NOT IDEAL WHEN: Content loads in under 200ms — skeletons will flash awkwardly before disappearing.',
      },
      {
        doItem:
          'USE THIS WHEN: You want layout-aware placeholders instead of generic spinners for better perceived performance.',
        dontItem:
          'NOT IDEAL WHEN: A progress bar or inline spinner communicates the action more clearly.',
      },
      {
        doItem:
          'USE THIS WHEN: Pre-rendering page structure to prevent cumulative layout shift on load.',
        dontItem:
          'NOT IDEAL WHEN: Critical above-the-fold content that should be server-rendered or statically generated.',
      },
    ],
    implementationNotes: [
      '01 Shimmer Gradient: Animated linear gradient that sweeps left to right, creating the illusion of content loading in.',
      '02 Placeholder Shapes: Rounded rectangles and circles sized to match your final content — text lines, avatars, images.',
      '03 Aspect Ratios: Proportional sizing on image placeholders that prevents layout shift when real content loads.',
      '04 Color Palette: Subtle base and shimmer tones that read as "loading" without competing with content arrival.',
      '05 CSS Custom Properties: Centralized design tokens for base color, shimmer intensity, and speed — swap themes in two lines.',
      '06 Pseudo-element Layer: Shimmer lives on ::after to avoid interfering with element sizing or layout flow.',
      '07 Animation Timing: Smooth 1.8s ease-in-out loop — fast enough to feel alive, slow enough to avoid distraction.',
      '08 Reduced Motion: prefers-reduced-motion query disables shimmer for users who opt out of animation.',
    ],
    supportedStates: [
      'Loading (1.8s Shimmer Active)',
      'Loaded (Smooth Content Reveal)',
      'Reduced Motion (Static Placeholder)',
      'Profile Header Pattern',
      'Card Grid Pattern (16:9 Media)',
      'Content List Pattern',
    ],
  },
  {
    id: 'color-contrast-checker',
    name: 'Color Contrast Checker',
    category: 'Feedback',
    paradigm: 'WCAG 2.1 Relative Luminance Standard',
    description:
      'Real-time WCAG accessibility inspector calculating relative luminance ratios with live AA and AAA compliance verdicts.',
    explanation:
      'Calculates the exact contrast ratio between any foreground and background color pair according to WCAG 2.1 relative luminance specifications (L1 + 0.05) / (L2 + 0.05). Provides real-time verification against Normal Text AA (4.5:1), Normal Text AAA (7.0:1), Large Text AA (3.0:1), Large Text AAA (4.5:1), and UI Components (3.0:1) with a live visual typography sandbox, color swap control, and curated high-contrast presets.',
    props: [
      {
        name: 'initialForeground',
        type: 'string',
        default: "'#000000'",
        description: 'Initial foreground/text hex color value.',
      },
      {
        name: 'initialBackground',
        type: 'string',
        default: "'#ffffff'",
        description: 'Initial background hex color value.',
      },
      {
        name: 'theme',
        type: "'light' | 'dark'",
        default: "'light'",
        description: 'Container UI surface theme.',
      },
    ],
    codeSnippet: `import { ColorContrastChecker } from '@/features/document/components/ui-library';\n\n<ColorContrastChecker\n  initialForeground="#000000"\n  initialBackground="#ffffff"\n  theme="light"\n/>`,
    realWorldExamples: [
      {
        title: 'Design System Accessibility Auditing',
        scenario:
          'Product designer tests brand palette tokens for dark and light theme compliance.',
        impact:
          'Guarantees 100% WCAG 2.1 AA/AAA compliance before shipping color variables to production.',
      },
      {
        title: 'Institutional Grade Portal UI',
        scenario: 'Academic staff review student report cards with high-contrast text rendering.',
        impact: 'Prevents low-contrast reading fatigue across diverse ambient lighting conditions.',
      },
    ],
    uxPsychology: [
      {
        principle: "Weber's Law of Just Noticeable Difference",
        detail:
          'Users perceive luminance contrast logarithmically. High-contrast ratios (>7.0:1) dramatically accelerate comprehension speed and reduce cognitive strain.',
      },
      {
        principle: 'Universal Design & Cognitive Ease',
        detail:
          'Accessible contrast ensures clarity for users with low vision, aging eyes, color blindness, and high glare mobile screens.',
      },
    ],
    usageGuidelines: [
      {
        doItem:
          'Maintain at least 4.5:1 contrast for regular body copy and 3.0:1 for large headers and buttons.',
        dontItem:
          'Never use light gray text (#9ca3af) on white backgrounds or dark blue text on black.',
      },
      {
        doItem: 'Strive for AAA 7.0:1 contrast on essential transactional actions and data tables.',
        dontItem:
          'Do not rely on color hue alone to distinguish status states without sufficient luminance contrast.',
      },
    ],
    implementationNotes: [
      '01 Mathematical Precision: sRGB linearization formula C_linear = C <= 0.04045 ? C / 12.92 : ((C + 0.055) / 1.055)^2.4.',
      '02 Luminance Calculation: L = 0.2126 * R + 0.7152 * G + 0.0722 * B accurately weighting human eye sensitivity.',
      '03 Contrast Formula: (L1 + 0.05) / (L2 + 0.05) : 1 yielding exact 21.00:1 for #000000 on #ffffff.',
      '04 WCAG Criteria Matrix: Real-time evaluation against Normal Text AA/AAA, Large Text AA/AAA, and UI Components AA.',
      '05 Interactive Sandbox: Live preview showing simulated headline, body paragraph, button badge, and card surface.',
      '06 Swap & Presets: Instant foreground/background swap button and curated 1-click test swatches.',
    ],
    supportedStates: [
      'AAA Maximum Contrast (21.00:1 #000000 / #ffffff)',
      'AAA Enhanced Pass (>= 7.0:1)',
      'AA Minimum Pass (>= 4.5:1)',
      'AA Large Text Pass (>= 3.0:1)',
      'Fail State (< 3.0:1 or < 4.5:1)',
      'Live Hex Input & Native Color Picker Sync',
    ],
  },
  {
    id: 'emoji-reaction',
    name: 'Emoji Reaction',
    category: 'Feedback',
    paradigm: 'Social Pill Paradigm',
    description: 'Lightweight interactive reaction pills offering real-time counter increments, active toggling, and elastic pop feedback.',
    explanation: 'Engaging micro-feedback pills for collaborative announcements and lessons.',
    props: [{ name: 'reactions', type: 'Array<{emoji, count}>', description: 'Reaction badges.' }],
    codeSnippet: `import { EmojiReactionDemo } from '@/features/document/components/ui-library';\n\n<EmojiReactionDemo />`,
    realWorldExamples: [
      {
        title: 'School Announcement',
        scenario: 'Parents react to sports day notice.',
        impact: 'High community engagement.',
      },
    ],
    uxPsychology: [
      { principle: 'Social Proof', detail: 'Visible counters validate shared sentiments.' },
    ],
    usageGuidelines: [{ doItem: 'Include count badges.', dontItem: 'Avoid obscure glyphs.' }],
    implementationNotes: ['Tappable pills with count increment.'],
    supportedStates: ['Reacted', 'Unreacted'],
  },
  {
    id: 'notification-bell',
    name: 'Notification Bell',
    category: 'Feedback',
    paradigm: 'Popover Feed Standard',
    description: 'Animated notification bell trigger featuring unread badge counters and a collapsible operational alert feed.',
    explanation: 'Combines an alert bell trigger with an unread badge and flyout feed.',
    props: [
      { name: 'unreadCount', type: 'number', description: 'Number of unread notifications.' },
    ],
    codeSnippet: `import { NotificationBellDemo } from '@/features/document/components/ui-library';\n\n<NotificationBellDemo />`,
    realWorldExamples: [
      {
        title: 'Institutional Alerts',
        scenario: 'Teachers check daily attendance alerts.',
        impact: 'Zero missed notices.',
      },
    ],
    uxPsychology: [{ principle: 'Attention Guidance', detail: 'Bright badge draws eye.' }],
    usageGuidelines: [
      { doItem: 'Clear unread on open.', dontItem: 'Avoid loud persistent badges.' },
    ],
    implementationNotes: ['Popover card with unread state.'],
    supportedStates: ['Unread', 'Read', 'Expanded'],
  },

  // DISPLAY GROUP
  {
    id: 'folder',
    name: 'Folder Component',
    category: 'Display',
    paradigm: 'Tactile Tab Standard',
    description: 'Interactive document folder component expanding smoothly to reveal nested files, certificates, and metadata attachments.',
    explanation: 'Skeuomorphic digital folder tab that stores and organizes files.',
    props: [{ name: 'files', type: 'Array<{name, size}>', description: 'Stored files.' }],
    codeSnippet: `import { FolderDemo } from '@/features/document/components/ui-library';\n\n<FolderDemo />`,
    realWorldExamples: [
      {
        title: 'Student Dossier',
        scenario: 'Admissions staff inspects identity files.',
        impact: 'Neat visual chunking.',
      },
    ],
    uxPsychology: [{ principle: 'Spatial Metaphor', detail: 'Folder mimics physical archives.' }],
    usageGuidelines: [{ doItem: 'Show file count.', dontItem: 'Avoid deeply nested folders.' }],
    implementationNotes: ['Expandable container.'],
    supportedStates: ['Closed', 'Expanded'],
  },
  {
    id: 'github-activity',
    name: 'GitHub Activity',
    category: 'Display',
    paradigm: 'Contribution Grid Standard',
    description: 'Fifty-two-week commit telemetry matrix visualizing engineering cadence, activity intensity, and continuous deployment streaks.',
    explanation: 'Matrix grid visualizing operational repository commit activity.',
    props: [{ name: 'weeks', type: 'number[][]', description: 'Activity matrix.' }],
    codeSnippet: `import { GitHubActivityDemo } from '@/features/document/components/ui-library';\n\n<GitHubActivityDemo />`,
    realWorldExamples: [
      {
        title: 'Dev Portal Telemetry',
        scenario: 'Auditor verifies continuous deployment.',
        impact: 'Visible momentum.',
      },
    ],
    uxPsychology: [
      { principle: 'Streaks & Consistency', detail: 'Visual green blocks inspire progress.' },
    ],
    usageGuidelines: [{ doItem: 'Show color legend.', dontItem: 'Do not crowd cell spacing.' }],
    implementationNotes: ['Flex column grid of rounded cells.'],
    supportedStates: ['Level 0', 'Level 1', 'Level 2', 'Level 3'],
  },
  {
    id: 'step-player',
    name: 'Step Player',
    category: 'Display',
    paradigm: 'Sequential Workflow Standard',
    description: 'Multi-stage progress stepper guiding operators through sequential tasks with forward and backward navigation controls.',
    explanation: 'Guides users through sequential institutional onboarding processes.',
    props: [{ name: 'currentStep', type: 'number', description: 'Active step.' }],
    codeSnippet: `import { StepPlayerDemo } from '@/features/document/components/ui-library';\n\n<StepPlayerDemo />`,
    realWorldExamples: [
      {
        title: 'Student Enrollment',
        scenario: 'Registrar steps through admission stages.',
        impact: 'Zero skipped steps.',
      },
    ],
    uxPsychology: [{ principle: 'Chunking', detail: 'Breaks long forms into bite-sized steps.' }],
    usageGuidelines: [{ doItem: 'Show clear numbers.', dontItem: 'Do not hide progress.' }],
    implementationNotes: ['Step pills with next/prev buttons.'],
    supportedStates: ['Active', 'Completed', 'Upcoming'],
  },
  {
    id: 'animated-counter',
    name: 'Animated Counter',
    category: 'Display',
    paradigm: 'Odometer Roll Standard',
    description: 'Precision mechanical odometer counter rolling numerical metrics smoothly during real-time value updates and increments.',
    explanation: 'Smoothly rolls numbers when key school metrics update.',
    props: [{ name: 'value', type: 'number', description: 'Numeric count.' }],
    codeSnippet: `import { AnimatedCounterDemo } from '@/features/document/components/ui-library';\n\n<AnimatedCounterDemo />`,
    realWorldExamples: [
      {
        title: 'Campus Dashboard',
        scenario: 'Director views live student enrollment totals.',
        impact: 'Live dynamism.',
      },
    ],
    uxPsychology: [
      { principle: 'Visual Salience', detail: 'Moving numbers convey live vitality.' },
    ],
    usageGuidelines: [
      { doItem: 'Format with commas.', dontItem: 'Avoid rapid flashing counters.' },
    ],
    implementationNotes: ['React state counting with locale string.'],
    supportedStates: ['Resting', 'Incrementing'],
  },
  {
    id: 'voice-note',
    name: 'Voice Note',
    category: 'Display',
    paradigm: 'Waveform Audio Standard',
    description: 'Interactive audio waveform player featuring animated amplitude bars, playback toggles, and variable playback speeds.',
    explanation: 'Voice message playback capsule with sound waveform visualization.',
    props: [{ name: 'duration', type: 'string', description: 'Audio length.' }],
    codeSnippet: `import { VoiceNoteDemo } from '@/features/document/components/ui-library';\n\n<VoiceNoteDemo />`,
    realWorldExamples: [
      {
        title: 'Parent Communication',
        scenario: 'Teacher sends audio update on student progress.',
        impact: 'Personal connection.',
      },
    ],
    uxPsychology: [
      { principle: 'Multimodal Feedback', detail: 'Visual waveform confirms audio content.' },
    ],
    usageGuidelines: [{ doItem: 'Provide speed toggles.', dontItem: 'Never autoplay sound.' }],
    implementationNotes: ['Waveform bars with pulse animation.'],
    supportedStates: ['Playing', 'Paused'],
  },
  {
    id: 'faq',
    name: 'FAQ Accordion',
    category: 'Display',
    paradigm: 'Collapsible Disclosure Standard',
    description: 'Accessible question-and-answer accordion with rotating chevron indicators and fluid spring height expansion.',
    explanation: 'Progressively discloses answers to frequent institutional questions.',
    props: [{ name: 'items', type: 'Array<{q, a}>', description: 'Questions and answers.' }],
    codeSnippet: `import { FaqDemo } from '@/features/document/components/ui-library';\n\n<FaqDemo />`,
    realWorldExamples: [
      {
        title: 'Help Portal',
        scenario: 'Students find tuition payment methods.',
        impact: 'Reduced support tickets.',
      },
    ],
    uxPsychology: [
      { principle: 'Progressive Disclosure', detail: 'Shows questions first, answers on demand.' },
    ],
    usageGuidelines: [
      { doItem: 'Collapse other items.', dontItem: 'Do not hide critical links inside FAQs.' },
    ],
    implementationNotes: ['Smooth height transition with rotating icon.'],
    supportedStates: ['Collapsed', 'Expanded'],
  },
  {
    id: 'data-table',
    name: 'Interactive Data Table',
    category: 'Display',
    paradigm: 'Client-Side Ledger & Tri-State Sorting Standard',
    description:
      'Enterprise data table supporting instant debounced filtering, multi-column sorting, pagination, and status indicators.',
    explanation:
      'High-performance zero-dependency tabular records manager. Features keyboard-focusable tri-state sort headers (none -> asc -> desc), debounced full-row search, animated SVG direction caret, stable sorting, status badges, live aria-live count announcements, sticky headers with dynamic scroll shadows, and smart windowed pagination.',
    props: [
      { name: 'data', type: 'T[]', description: 'Array of tabular records to display and filter.' },
      {
        name: 'columns',
        type: 'DataTableColumn<T>[]',
        description:
          'Column definitions with headers, keys, type, alignment, and custom cell renderers.',
      },
      {
        name: 'initialPageSize',
        type: 'number',
        default: '10',
        description: 'Default rows displayed per page.',
      },
      {
        name: 'pageSizeOptions',
        type: 'number[]',
        default: '[5, 10, 20, 50]',
        description: 'Selectable rows-per-page options.',
      },
      {
        name: 'searchPlaceholder',
        type: 'string',
        description: 'Placeholder for debounced search box.',
      },
      {
        name: 'theme',
        type: "'light' | 'dark'",
        default: "'light'",
        description: 'Surface color mode.',
      },
    ],
    codeSnippet: `import { DataTable, type DataTableColumn, StatusPill } from '@/features/document/components/ui-library';

interface StudentRecord {
  id: string;
  code: string;
  name: string;
  program: string;
  gpa: number;
  status: 'Active' | 'Pending' | 'Probation';
  tuitionFee: number;
}

const columns: DataTableColumn<StudentRecord>[] = [
  { key: 'code', header: 'Student ID', sortable: true, type: 'string' },
  { key: 'name', header: 'Student Name', sortable: true, type: 'string' },
  { key: 'program', header: 'Program', sortable: true, type: 'string' },
  { key: 'gpa', header: 'GPA', sortable: true, type: 'number', align: 'center' },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (val) => <StatusPill status={String(val)} />,
  },
  { key: 'tuitionFee', header: 'Tuition', sortable: true, type: 'number', align: 'right' },
];

<DataTable
  title="Student Academic Roster"
  data={records}
  columns={columns}
  initialPageSize={10}
/>`,
    realWorldExamples: [
      {
        title: 'Academic Enrollment Ledger',
        scenario:
          'Registrars search, sort by GPA, and verify active student cohorts across programs.',
        impact: 'Zero latency instant filtering.',
      },
      {
        title: 'Tuition Fee Accounts Roster',
        scenario:
          'Finance officers review tuition fee collections, filter by status pill, and export ledger pages.',
        impact: 'Accurate tabular numeral auditing.',
      },
      {
        title: 'Faculty Assignment Directory',
        scenario: 'Deans inspect faculty course loads, sorting by department and teaching hours.',
        impact: 'Frictionless client-side sorting.',
      },
    ],
    uxPsychology: [
      {
        principle: 'Doherty Threshold (<400ms)',
        detail:
          'Debounced 200ms search and instantaneous client-side sorting keeps users in uninterrupted flow state.',
      },
      {
        principle: "Fitts's Law & Coyote Time",
        detail:
          'Full column header hit targets with keyboard Enter/Space triggers ensure effortless sorting.',
      },
      {
        principle: "Miller's Law & Chunking",
        detail: 'Windowed pagination chunks dense data into digestible 5, 10, or 20 row sets.',
      },
    ],
    usageGuidelines: [
      {
        doItem:
          'Use when building admin dashboards, settings screens, or internal tools listing structured records with few hundred to thousand client-side rows with zero bundle weight.',
        dontItem:
          'Do not use for millions of rows (use server-side pagination with row virtualization) or hierarchical tree-tables.',
      },
      {
        doItem:
          'Click any column header to sort (none -> ascending -> descending), use the search box to filter across all columns, and page through the results below.',
        dontItem:
          'Do not require inline editing, drag reordering, or column resizing — keep client-side table focused on high-performance reading and auditing.',
      },
    ],
    implementationNotes: [
      '01 Search Input: Debounced text filter with a magnifier icon and inline clear button. Matches across every column.',
      '02 Result Count: Live "Showing X-Y of Z" region announced to assistive tech via aria-live.',
      '03 Sortable Header: Keyboard-focusable column header with a tri-state click cycle: none, ascending, descending.',
      '04 Sort Indicator: Animated caret in the active column that rotates to flip direction without re-rendering.',
      '05 Comparator: Type-aware comparison for strings, numbers, and dates. Stable so equal rows keep insertion order.',
      '06 Status Pill: Colored badge with clean typography (Zero-Dot Standard) for at-a-glance scanning of categorical values.',
      '07 Sticky Header: Headers stay pinned while the body scrolls. A subtle shadow appears once the user has scrolled.',
      '08 Pagination Nav: First, last, and a window around the current page with ellipses. Disabled at boundaries.',
      '09 Page Size: Selector for rows per page that re-clamps the current page so the visible window stays valid.',
      '10 Empty State: Friendly fallback when the search filter yields no rows, telling the user what they searched for.',
    ],
    supportedStates: [
      'Default Table View',
      'Debounced Search Filtering',
      'Ascending Column Sort',
      'Descending Column Sort',
      'Sticky Header Scrolled Shadow',
      'Empty State Search Fallback',
    ],
  },
  {
    id: 'real-time-chart',
    name: 'Real-Time Data Chart',
    category: 'Display',
    paradigm: 'Canvas 60FPS Streaming Telemetry Standard',
    description: 'Streaming HTML5 canvas telemetry chart plotting real-time metrics with zero external chart library overhead.',
    explanation:
      'This is a working example of what the prompt generates — a real-time streaming chart rendering at 60fps with hover tooltips, gradient fills, and glow effects. Click the chart to pause.',
    props: [
      {
        name: 'theme',
        type: "'light' | 'dark'",
        default: "'light'",
        description: 'Visual palette for background dot grid, axes, and glow intensity.',
      },
      {
        name: 'height',
        type: 'number',
        default: '340',
        description: 'Canvas height in pixels.',
      },
      {
        name: 'pointsCount',
        type: 'number',
        default: '45',
        description: 'Number of streaming timeline slices preserved in rolling buffer.',
      },
    ],
    codeSnippet: `import { RealTimeChart } from '@/features/document/components/ui-library';\n\n<RealTimeChart theme="dark" height={340} />`,
    realWorldExamples: [
      {
        title: 'Institutional API & Node Ingress Monitoring',
        scenario:
          'Campus DevOps monitors live CPU utilization, ingress request rates, and MongoDB write volume in 60fps real-time.',
        impact: 'High-visibility telemetry with zero external chart library overhead.',
      },
      {
        title: 'High-Frequency Exam Telemetry Stream',
        scenario:
          'Proctors and administrators observe simultaneous client connection spikes during nation-wide finals examination.',
        impact: 'Crisp high-DPI canvas rendering with hovering crosshair inspection.',
      },
    ],
    uxPsychology: [
      {
        principle: 'Doherty Threshold & 60FPS Flow',
        detail:
          'Hardware-accelerated continuous rendering provides visceral sensory confirmation that telemetry is actively streaming.',
      },
      {
        principle: "Fitts's Law & Snapping Crosshairs",
        detail:
          'Snapping crosshair to the nearest timeline point removes manual fine-cursor targeting friction.',
      },
    ],
    usageGuidelines: [
      {
        doItem:
          'USE THIS WHEN: Building dashboards or monitoring UIs that display live-updating metrics.',
        dontItem:
          'NOT IDEAL WHEN: Your data is static — a simpler SVG chart is lighter and more accessible.',
      },
      {
        doItem:
          'USE THIS WHEN: You need a chart without adding Chart.js, D3, or Recharts to your bundle.',
        dontItem:
          'NOT IDEAL WHEN: You need zoom, pan, brush selection, or other complex interactions.',
      },
    ],
    implementationNotes: [
      '01 Canvas Element: Hardware-accelerated rendering surface that scales with devicePixelRatio for crisp output on any display.',
      '02 Dot Grid: Subtle background pattern at 40px intervals creating visual depth without competing with chart data.',
      '03 Gridlines: Dashed horizontal reference lines for quick value estimation at a glance.',
      '04 Bezier Curves: Cubic interpolation producing smooth, organic data lines instead of jagged point-to-point segments.',
      '05 Gradient Fills: Semi-transparent areas beneath each curve that add visual weight and make series easier to track.',
      '06 Glow Effects: Shadow-based luminous halos around each data line, making them pop against the dark background.',
      '07 Axis Labels: Time markers along the bottom and percentage scale on the left edge for spatial context.',
      '08 Legend: Live-updating series identification with color swatches and current values in the top-right corner.',
      '09 Crosshair: Vertical tracking line with intersection dots that snaps to the nearest data point on hover.',
      '10 Tooltip: Floating data card revealing exact values for all series at any point in the timeline.',
    ],
    supportedStates: [
      'Active 60FPS Streaming',
      'Paused Stream (Click To Resume)',
      'Crosshair & Snapped Hover Tooltip',
      'Dynamic Rate Modulation (0.5x, 1x, 2x)',
      'High-DPI Retina Scaled (devicePixelRatio)',
    ],
  },

  // AI KIT GROUP
  {
    id: 'grid-reveal',
    name: 'Grid Reveal',
    category: 'AI Kit',
    paradigm: 'Cyber Matrix Standard',
    description: 'Cybernetic matrix grid featuring horizontal laser scanlines and interactive hover spotlights across child cards.',
    explanation: 'Reveals autonomous agent telemetry across distributed services.',
    props: [{ name: 'cards', type: 'Array<{title, speed}>', description: 'Grid nodes.' }],
    codeSnippet: `import { GridRevealDemo } from '@/features/document/components/ui-library';\n\n<GridRevealDemo />`,
    realWorldExamples: [
      {
        title: 'Autonomous Agent Monitor',
        scenario: 'Admin monitors background reconciliation agents.',
        impact: 'Real-time confidence.',
      },
    ],
    uxPsychology: [{ principle: 'Status Transparency', detail: 'Shows system actively working.' }],
    usageGuidelines: [{ doItem: 'Show execution speed.', dontItem: 'Avoid flashing colors.' }],
    implementationNotes: ['Laser beam line with animated pulse.'],
    supportedStates: ['Standby', 'Scanning'],
  },
  {
    id: 'web-search',
    name: 'Web Search',
    category: 'AI Kit',
    paradigm: 'Agentic Crawl Standard',
    description: 'Omni-search command bar with regulatory source citation pills, debounced input, and filtered live suggestions.',
    explanation: 'Agentic search component displaying verified cited domains.',
    props: [{ name: 'query', type: 'string', description: 'Search term.' }],
    codeSnippet: `import { WebSearchDemo } from '@/features/document/components/ui-library';\n\n<WebSearchDemo />`,
    realWorldExamples: [
      {
        title: 'Regulatory Search',
        scenario: 'Academic dean searches ministry accreditation decrees.',
        impact: 'Cited references.',
      },
    ],
    uxPsychology: [{ principle: 'Source Verifiability', detail: 'Chips validate answer truth.' }],
    usageGuidelines: [
      { doItem: 'Display domain badges.', dontItem: 'Never show unverified citations.' },
    ],
    implementationNotes: ['Search input with citation pills.'],
    supportedStates: ['Searching', 'Synthesized'],
  },
  // ==========================================
  // NAVIGATION (Hanging Tabs Nav)
  // ==========================================
  {
    id: 'hanging-tabs-nav',
    name: 'Hanging Tabs Nav',
    category: 'Navigation',
    paradigm: 'Trapezoid Ceiling Paradigm',
    description: 'Header navigation bar with stepped mecha tabs, Royal Blue luminous indicators, and zero-dot styling.',
    explanation:
      'The Hanging Tabs Nav suspends navigation tabs directly from the application header baseline. Inspired by index dividers in physical filing cabinets, its inverted trapezoid geometry provides a distinctive, tactile sense of workspace organization while maintaining centered page balance.',
    supportedStates: [
      'Map Active',
      'Newswire Active',
      'Post Active',
      'Friends Active',
      'Size Small',
      'Size Medium',
      'Size Large',
    ],
    realWorldExamples: [
      {
        title: 'Master Developer Documentation Portal',
        scenario:
          'Developers switch between "Open API", "UI Library", and "Changelog" in the top bar.',
        impact: 'Zero number labels, centered on page, with instantaneous smooth page switching.',
      },
      {
        title: 'Campus Workspace Mode Selector',
        scenario: 'Administrators switch between "Map", "Newswire", "Post", and "Friends".',
        impact:
          'Tactile folder metaphor anchors user attention to the current application workspace.',
      },
    ],
    uxPsychology: [
      {
        principle: 'Skeuomorphic Folder Divider Familiarity',
        detail:
          'Draws upon decades of physical paper indexing intuition, making active tab state instantly distinguishable.',
      },
      {
        principle: 'Ceiling Anchoring & Visual Balance',
        detail:
          'Hanging from the header baseline creates an organized spatial ceiling, framing the content below.',
      },
    ],
    usageGuidelines: [
      {
        doItem: 'Center navigation on the page with zero number labels for maximal elegance.',
        dontItem: 'Add colored background blocks behind icons or wrap tabs onto multiple lines.',
      },
      {
        doItem: 'Use vector-smooth non-scaling SVG geometry to ensure continuous 2px strokes.',
        dontItem:
          'Use hanging tabs inside compact mobile navigation bars where horizontal space is constrained.',
      },
    ],
    implementationNotes: [
      'Built with smooth SVG paths featuring nonScalingStroke to preserve 2px continuous border width.',
      'Active tab highlighted with Royal Blue (#0056FF) stroke and bold title typography.',
      'Supports three standard sizes: sm (h-12), md (h-14), and lg (h-16).',
    ],
    codeSnippet: `import { HangingTabsNav } from '@/features/document/components/ui-library';\nimport { Newspaper, Pin, FilePlus } from '@/components/icons';\n\nexport function Example() {\n  const [tab, setTab] = React.useState('newswire');\n\n  return (\n    <HangingTabsNav\n      activeId={tab}\n      onSelect={setTab}\n      size="md"\n      items={[\n        { id: 'map', label: 'Map', icon: Pin },\n        { id: 'newswire', label: 'Newswire', icon: Newspaper },\n        { id: 'post', label: 'Post', icon: FilePlus },\n      ]}\n    />\n  );\n}`,
    props: [
      {
        name: 'items',
        type: 'HangingTabItem[]',
        default: '[]',
        description: 'Array of id, label, icon, and optional badge objects.',
      },
      {
        name: 'activeId',
        type: 'string',
        default: '—',
        description: 'Id of the currently active tab.',
      },
      {
        name: 'onSelect',
        type: '(id: string) => void',
        default: '—',
        description: 'Callback invoked when a tab is pressed.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: 'Height and scale preset.',
      },
    ],
  },
  {
    id: 'icon-bar',
    name: 'Icon Bar',
    category: 'Navigation',
    paradigm: 'Bloom Toolbar Paradigm',
    description:
      'Horizontal tool dock revealing expanded text labels upon selection, complete with roving tabindex keyboarding.',
    explanation:
      'The Icon Bar is a compact 54px horizontal toolbar engineered for editing canvases, drawing environments, and workspace tool selectors. By keeping tools compact as vector glyphs by default and blooming labels open horizontally on hover or keyboard focus, it provides maximum canvas efficiency without sacrificing discoverability.',
    supportedStates: [
      'Default',
      'Hovered (Bloomed)',
      'Selected (Pinned Fill)',
      'Focused',
      'Active Indicator Line',
    ],
    realWorldExamples: [
      {
        title: 'Canvas Drawing & Annotation Toolbar',
        scenario:
          'Educator selects Pen, Eraser, Fill Bucket, or Text tool while marking student exam papers.',
        impact: 'Zero layout shift with instant tool feedback and sub-200ms bloom reveal.',
      },
      {
        title: 'Rich Editor Action Dock',
        scenario: 'Content creator switches between Select, Crop, and Typography tools.',
        impact:
          'Keyboard arrow roving navigation allows seamless tool cycling without mouse dependency.',
      },
    ],
    uxPsychology: [
      {
        principle: "Fitts's Law & Spatial Economy",
        detail:
          'Compact 54px footprint preserves valuable viewport space while bloom-open expansion enlarges touch/click targets dynamically upon interaction.',
      },
      {
        principle: 'WAI-ARIA Roving Tabindex Hygiene',
        detail:
          'Arrow keys cycle focus within a single Tab stop, reducing keyboard navigation fatigue across dense toolbars.',
      },
    ],
    usageGuidelines: [
      {
        doItem:
          'Use for 3 to 8 contextual tools that benefit from single-keystroke selection and spatial proximity.',
        dontItem:
          'Do not use for destructive permanent actions (like Delete Account) without a confirmation step.',
      },
      {
        doItem:
          'Provide an active indicator bar on active or pinned tools to maintain spatial orientation.',
        dontItem:
          'Avoid vertical text bloom; always bloom labels horizontally with overflow containment.',
      },
    ],
    implementationNotes: [
      'Outer height strictly locked to 54px (h-[54px]) with 4px gap (gap-1) between items.',
      'Selected tool gains filled surface background and accent indicator bar at bottom edge (Zero-Dot Standard).',
      'Full roving tabindex: ArrowRight/Down, ArrowLeft/Up, Home, End, Enter to pin, Escape to clear.',
      'Strict r4 corner radius standard enforced across controls.',
    ],
    props: [
      {
        name: 'items',
        type: 'IconBarItemData[]',
        default: 'DEFAULT_ICON_BAR_ITEMS',
        description:
          'Array of tool items with id, label, icon component, and optional active state.',
      },
      {
        name: 'selectedId',
        type: 'string',
        default: "'pen'",
        description: 'Id of the currently selected/pinned tool.',
      },
      {
        name: 'onSelect',
        type: '(id: string) => void',
        default: '—',
        description: 'Callback invoked when a tool is selected or pinned.',
      },
      {
        name: 'className',
        type: 'string',
        description: 'Additional class names for root toolbar container.',
      },
    ],
    codeSnippet: `import { IconBar } from '@/features/document/components/ui-library';\n\nexport function Example() {\n  const [activeTool, setActiveTool] = React.useState('pen');\n\n  return (\n    <IconBar\n      selectedId={activeTool}\n      onSelect={setActiveTool}\n    />\n  );\n}`,
  },
  // ==========================================
  // BACKGROUNDS
  // ==========================================
  // ==========================================
  // TEXT EFFECTS
  // ==========================================
  {
    id: 'number-ticker',
    name: 'Number Ticker',
    category: 'Text Effects',
    paradigm: 'Tabular Digit Odometer Standard',
    description: 'Tabular numeric ticker cycling digits vertically with constant speed to present high-frequency financial telemetry.',
    explanation: 'Animated numeral ticker with constant font-variant-numeric spacing.',
    props: [{ name: 'val', type: 'number', description: 'Target value.' }],
    codeSnippet: `import { NumberTickerDemo } from '@/features/document/components/ui-library';\n\n<NumberTickerDemo />`,
    realWorldExamples: [
      {
        title: 'Finance Revenue',
        scenario: 'Bursar watches real-time tuition payments.',
        impact: 'Fluid metric visualization.',
      },
    ],
    uxPsychology: [
      { principle: 'Numerical Anchoring', detail: 'Tabular digits prevent layout shift.' },
    ],
    usageGuidelines: [
      {
        doItem: 'Enforce font-mono or tabular-nums.',
        dontItem: 'Avoid variable width digit jumping.',
      },
    ],
    implementationNotes: ['font-mono tabular formatting.'],
    supportedStates: ['Updating', 'Static'],
  },
  {
    id: 'glitch-text',
    name: 'Glitch Text',
    category: 'Text Effects',
    paradigm: 'Chromatic Aberration Split Standard',
    description: 'Interactive terminal typography triggering chromatic RGB split aberration effects on pointer hover and tap.',
    explanation: 'Cybernetic text-shadow split simulating CRT monitor signal displacement.',
    props: [{ name: 'active', type: 'boolean', description: 'Trigger displacement state.' }],
    codeSnippet: `import { GlitchTextDemo } from '@/features/document/components/ui-library';\n\n<GlitchTextDemo />`,
    realWorldExamples: [
      {
        title: 'Security Portal',
        scenario: 'SecOps engineer inspects zero-day audit alerts.',
        impact: 'Tactile cyber feel.',
      },
    ],
    uxPsychology: [
      { principle: 'Tactile Feedback', detail: 'Immediate hover reaction rewards curiosity.' },
    ],
    usageGuidelines: [
      { doItem: 'Limit displacement to 2-3px.', dontItem: 'Never induce strobing or flash.' },
    ],
    implementationNotes: ['Multi-color text-shadow.'],
    supportedStates: ['Resting', 'Glitched'],
  },
  {
    id: 'blur-in',
    name: 'Blur In Typography',
    category: 'Text Effects',
    paradigm: 'Gaussian Lens Focus Standard',
    description: 'Sophisticated typographic entrance transition shifting from cinematic Gaussian blur to crisp focal clarity smoothly.',
    explanation: 'Progressive filter blur-in transition simulating optical lens focus.',
    props: [{ name: 'duration', type: 'string', description: 'Animation duration.' }],
    codeSnippet: `import { BlurInDemo } from '@/features/document/components/ui-library';\n\n<BlurInDemo />`,
    realWorldExamples: [
      {
        title: 'Keynote Announcement',
        scenario: 'User lands on institutional announcement.',
        impact: 'Cinematic entrance.',
      },
    ],
    uxPsychology: [
      { principle: 'Gradual Revelation', detail: 'Soft blur entrance feels gentle on eyes.' },
    ],
    usageGuidelines: [
      { doItem: 'Keep duration under 700ms.', dontItem: 'Do not use on tiny paragraph text.' },
    ],
    implementationNotes: ['CSS blur-in animation.'],
    supportedStates: ['Blurring', 'Focused'],
  },
  {
    id: 'cipher-decode',
    name: 'Cipher Decode Navigation & Headline',
    category: 'Text Effects',
    paradigm: 'Per-Character Timeline Cipher Standard',
    description:
      'Matrix-inspired cryptographic text effect scrambling characters rapidly before settling into readable plain text.',
    explanation:
      'High-precision 8-pillar cryptographic text decoding engine featuring per-character timelines with stagger and jitter, 50ms throttled glyph shimmer, space-aware layout preservation, and screen-reader accessibility.',
    props: [
      { name: 'text', type: 'string', description: 'Target string to decode or headline phrase.' },
      {
        name: 'staggerMs',
        type: 'number',
        description: 'Wave delay per character in ms (default 24ms).',
      },
      {
        name: 'jitterMs',
        type: 'number',
        description: 'Random start offset variance in ms (default 35ms).',
      },
      {
        name: 'durationMs',
        type: 'number',
        description: 'Total character resolve duration in ms (default 400ms).',
      },
      {
        name: 'throttleMs',
        type: 'number',
        description: 'Maximum glyph re-roll frequency (default 50ms).',
      },
      { name: 'theme', type: "'light' | 'dark'", description: 'Instrument panel color palette.' },
    ],
    codeSnippet: `import { CipherTextDecoder } from '@/features/document/components/ui-library';\n\n<CipherTextDecoder theme="light" />`,
    realWorldExamples: [
      {
        title: 'Security Portal Keynote',
        scenario:
          'SecOps dashboard cycles cryptographic status phrases while allowing interactive nav link decoding.',
        impact: 'Memorable brand signature with zero layout shift.',
      },
      {
        title: 'Developer Documentation Hub',
        scenario:
          'Hero banner introduces new API architecture while live telemetry counts locked characters.',
        impact: 'Engaging physical instrument-panel feel.',
      },
    ],
    uxPsychology: [
      {
        principle: 'Per-Character Wave Perception',
        detail:
          'Staggered wave reading left-to-right matches natural eye scanning saccades without mechanical sterility.',
      },
      {
        principle: 'Cognitive Anchoring (Space-Awareness)',
        detail:
          'Immediate resolution of spaces exposes word boundaries instantly, letting the mind pre-parse grammar before letters resolve.',
      },
    ],
    usageGuidelines: [
      {
        doItem:
          'USE THIS WHEN: A portfolio, studio, or developer brand wants a typographic signature.',
        dontItem: 'NOT IDEAL WHEN: Body copy or anything people need to read quickly.',
      },
      {
        doItem: 'USE THIS WHEN: Short headlines or menu labels, roughly 30 characters or fewer.',
        dontItem:
          'NOT IDEAL WHEN: Text that must be translated into scripts without a monospace face.',
      },
      {
        doItem: 'USE THIS WHEN: The design is monospace or can carry a monospace display line.',
        dontItem:
          'NOT IDEAL WHEN: Interfaces where motion would distract from a task, like checkout or forms.',
      },
    ],
    implementationNotes: [
      '01 Per-Character Timeline: Every character gets its own start and end time with small stagger plus random jitter.',
      '02 Throttled Glyphs: Resolving characters re-roll at most every 50ms, so the cipher shimmers instead of strobing.',
      '03 Monospace Lock: Every glyph has equal width (font-mono tabular-nums), ensuring zero layout shift during decode.',
      '04 Stable Lines: Headline block has fixed min-height, preventing layout collapse mid-decode.',
      '05 Space-Aware: Spaces in the target resolve to spaces immediately, revealing word shapes first.',
      '06 No HTML Strings: Virtual DOM spans and text nodes only; nothing is ever parsed as HTML strings.',
      '07 Quiet for Screen Readers: Plain semantic sr-only headline text; animated layer is aria-hidden.',
      '08 Pause and Fallback: Pauses while tab is hidden, reduced motion renders target text statically.',
    ],
    supportedStates: ['Decoding', 'Locked', 'Paused', 'Hover In-Place'],
  },
  // ==========================================
  // CARDS
  // ==========================================
  {
    id: 'bento-card',
    name: 'Bento Grid Card',
    category: 'Cards',
    paradigm: 'Modular Container Standard',
    description: 'Modular information tile showcasing key infrastructure metrics with clean typography and transparent icon badges.',
    explanation: 'Discrete feature card engineered for structured multi-column bento grids.',
    props: [{ name: 'variant', type: 'string', description: 'Accent color theme.' }],
    codeSnippet: `import { BentoCardDemo } from '@/features/document/components/ui-library';\n\n<BentoCardDemo />`,
    realWorldExamples: [
      {
        title: 'System Specs',
        scenario: 'CTO reviews system SLA and latency metrics.',
        impact: 'High data density.',
      },
    ],
    uxPsychology: [
      { principle: "Miller's Law", detail: 'Bento boxes chunk complex data into digestibles.' },
    ],
    usageGuidelines: [
      { doItem: 'Maintain uniform border tokens.', dontItem: 'Do not mix inconsistent radius.' },
    ],
    implementationNotes: ['Rounded-2xl with subtle border.'],
    supportedStates: ['Default', 'Hovered'],
  },
  {
    id: 'tilt-card',
    name: '3D Tilt Card',
    category: 'Cards',
    paradigm: 'Gyroscope Parallax Standard',
    description: 'Three-dimensional interactive surface tilting realistically in response to cursor position using smooth CSS perspective.',
    explanation: 'Perspective card tilting toward cursor position with spring damping.',
    props: [{ name: 'maxAngle', type: 'number', description: 'Max rotation angle.' }],
    codeSnippet: `import { TiltCardDemo } from '@/features/document/components/ui-library';\n\n<TiltCardDemo />`,
    realWorldExamples: [
      {
        title: 'Student Diploma',
        scenario: 'Alumnus views digital graduation credential.',
        impact: 'Tactile physical weight.',
      },
    ],
    uxPsychology: [
      {
        principle: 'Physicality & Skeuomorphism',
        detail: 'Tilt gives cards realistic tactile presence.',
      },
    ],
    usageGuidelines: [
      { doItem: 'Cap tilt at 10-15 degrees.', dontItem: 'Do not disorient with extreme tilt.' },
    ],
    implementationNotes: ['perspective(1000px) rotateX and rotateY.'],
    supportedStates: ['Flat', 'Tilted'],
  },
  {
    id: 'border-beam-card',
    name: 'Border Beam Card',
    category: 'Cards',
    paradigm: 'Instrument Panel & 4-Dash SVG Physics Standard',
    description:
      'Matte surface card featuring a continuous glowing beam traveling around its perimeter at constant velocity.',
    explanation:
      'Hover the card to brighten the beam. It is four stacked SVG dashes on one path, so the head always leads the tail and the speed never changes at the corners.',
    props: [
      {
        name: 'color',
        type: "'amber' | 'blue' | 'emerald' | 'rose'",
        default: "'amber'",
        description: 'Beam color token (amber default or docs royal blue).',
      },
      {
        name: 'duration',
        type: 'number',
        default: '7',
        description: 'Seconds per perimeter loop (constant velocity pathLength="100").',
      },
      {
        name: 'rx',
        type: 'number',
        default: '24',
        description: 'Border radius x-axis for measured rounded-rectangle path.',
      },
      {
        name: 'forceBright',
        type: 'boolean',
        default: 'false',
        description: 'Override quiet state (35%) to full hover luminance (100%).',
      },
    ],
    codeSnippet: `import { BorderBeamPricingCard, BorderBeamLoginCard } from '@/features/document/components/ui-library';\n\n{/* Matte Pricing Card with Amber Border Beam */}\n<BorderBeamPricingCard color="amber" duration={7} />\n\n{/* Instrument Terminal Card */}\n<BorderBeamLoginCard color="amber" duration={7} />`,
    realWorldExamples: [
      {
        title: 'Cluster Infrastructure Dedicated Tier',
        scenario:
          'Enterprises compare multi-tenant shared nodes versus isolated dedicated MongoDB replica sets.',
        impact: 'Quiet, premium visual hierarchy without layout movement.',
      },
      {
        title: 'Operator Zero-Trust Gateway Console',
        scenario:
          'SuperAdmin authenticates cryptographic session key into institutional cluster terminal.',
        impact: 'Uncompromising instrument precision with live tabular clock telemetry.',
      },
    ],
    uxPsychology: [
      {
        principle: 'Preattentive Visual Hierarchy',
        detail:
          'The quiet beam sits below distraction threshold at 35% opacity until hovered or focused, immediately drawing intent.',
      },
      {
        principle: 'Perceptual Constancy & Uniform Velocity',
        detail:
          'Arc-length normalization via pathLength="100" guarantees speed never distorts or accelerates through rounded corners.',
      },
    ],
    usageGuidelines: [
      {
        doItem: 'USE THIS WHEN: One plan, card, or panel needs to stand out from its siblings.',
        dontItem:
          'NOT IDEAL WHEN: Several cards on one screen would each get a beam — multi-beam screens cause visual exhaustion.',
      },
      {
        doItem: 'USE THIS WHEN: You want motion that draws the eye without moving the layout.',
        dontItem:
          'NOT IDEAL WHEN: The card holds content people read for a long time, like long text or forms.',
      },
      {
        doItem: 'USE THIS WHEN: The interface is dark, technical, and restrained.',
        dontItem:
          'NOT IDEAL WHEN: The design system is light and soft; the beam requires a dark surface to radiate.',
      },
    ],
    implementationNotes: [
      '01 Constant-Speed Path: The beam rides a rounded-rectangle path with pathLength="100", so dash values are percentages of the perimeter and speed is even everywhere.',
      '02 Four-Layer Beam: Bloom, tail, near tail, and head are four dashes that end at the same point. Stacking them fakes a gradient along the stroke.',
      '03 Locked Offsets: Every layer animates its own dash offset by exactly 100 over the same 6 seconds, so the head never drifts off the tail.',
      '04 Measured Geometry: A ResizeObserver rebuilds the path whenever the card changes size. The beam stays on the 1px border at any width.',
      '05 Bloom Filter: A blurred 6px dash behind the beam adds the glow, scoped to the beam instead of the whole card.',
      '06 Tabular Pricing: Tabular numerals, a baseline-aligned period, and a screen-reader price that reads as one phrase.',
      '07 Single Accent: Amber appears only in the beam, the pill, and the checks. Everything else is graphite and paper white.',
      '08 Reduced Motion: The beam freezes just past the top-right corner, so the card still reads as highlighted.',
    ],
    supportedStates: [
      'Quiet Ambient State (35% Opacity)',
      'Hovered / Focused State (100% Incandescent)',
      'Tabular Pricing Mode ($1,240.00 / month)',
      'Operator Access Console Mode',
      'Reduced Motion State (Frozen Top-Right Accent)',
    ],
  },
  // ==========================================
  // SECTIONS
  // ==========================================
  {
    id: 'hero-section',
    name: 'Hero Section',
    category: 'Sections',
    paradigm: 'Monumental Hero Standard',
    description: 'Monumental headline section featuring live system status stamps, release tags, and high-contrast call-to-action buttons.',
    explanation: 'Complete flagship section introducing platform value with clear hierarchy.',
    props: [{ name: 'title', type: 'string', description: 'Headline copy.' }],
    codeSnippet: `import { HeroSectionDemo } from '@/features/document/components/ui-library';\n\n<HeroSectionDemo />`,
    realWorldExamples: [
      {
        title: 'Admissions Landing',
        scenario: 'Parents evaluate SNPI curriculum.',
        impact: 'Clear conversion CTA.',
      },
    ],
    uxPsychology: [
      { principle: 'Hierarchy of Needs', detail: 'Headline -> Value Prop -> Dual Action.' },
    ],
    usageGuidelines: [
      { doItem: 'Use high-contrast primary CTA.', dontItem: 'Do not crowd with 3+ buttons.' },
    ],
    implementationNotes: ['Gradient background with centered layout.'],
    supportedStates: ['Desktop', 'Mobile'],
  },
  {
    id: 'feature-bento',
    name: 'Admin Audit & Health Spotlight Bento Grid',
    category: 'Sections',
    paradigm: 'Named Grid Areas & rAF-Throttled Border Spotlight Standard',
    description:
      'Multi-tile bento showcase with border beam spotlights, streaming terminal logs, and live latency metrics.',
    explanation:
      'High-performance zero-image interactive bento showcase. Features rAF-throttled pointer tracking across every tile simultaneously, dual radial gradient masks (1px border spotlight ring + subtle surface inner wash), cascading 6s deploy telemetry stream, self-drawing SVG sparkline with pathLength="1", and hand-placed git branch topology diagram with live pulsing beacon.',
    props: [
      {
        name: 'theme',
        type: "'light' | 'dark'",
        default: "'light'",
        description: 'Surface color mode.',
      },
      { name: 'className', type: 'string', description: 'Additional container class overrides.' },
    ],
    codeSnippet: `import { SpotlightBentoGrid } from '@/features/document/components/ui-library';

// Admin audit view health system interactive bento grid
<SpotlightBentoGrid theme="light" />`,
    realWorldExamples: [
      {
        title: 'Admin Health & Audit Dashboard',
        scenario:
          'System architects inspect real-time SLA metrics, ACID ledger proofs, and Git release topology.',
        impact: 'Comprehensive at-a-glance health oversight.',
      },
      {
        title: 'Security Operations Center',
        scenario:
          'DevOps team monitors live deployment streams, memory RSS, and cluster node states.',
        impact: 'Immediate telemetry feedback.',
      },
      {
        title: 'Enterprise Product Landing Page',
        scenario:
          'Prospective institutions explore platform reliability, uptime records, and zero-downtime architecture.',
        impact: 'High-conversion interactive proof.',
      },
    ],
    uxPsychology: [
      {
        principle: 'Doherty Threshold (<400ms)',
        detail:
          'rAF-throttled pointer coalescing updates only two CSS custom properties per tile, maintaining zero-lag 120Hz responsiveness.',
      },
      {
        principle: 'Law of Proximity',
        detail:
          'Named grid areas group interrelated health, audit, deploy, and git topology components into cohesive clusters.',
      },
      {
        principle: 'Progressive Visual Feedback',
        detail:
          'Dual-layer spotlight (1px border ring + faint inner wash) simulates physical directional illumination.',
      },
    ],
    usageGuidelines: [
      {
        doItem:
          'USE THIS WHEN: A landing page or dashboard needs to present four to eight features at a glance, each feature can be shown with a small concrete visual, and you want one section that feels interactive without scroll animation.',
        dontItem:
          'NOT IDEAL WHEN: Features need long explanations (use a list or comparison table), you have only two or three features (bento grid will look sparse), or most visitors are on touch devices.',
      },
    ],
    implementationNotes: [
      '01 Named Grid Areas: Four columns with grid-template-areas, re-mapped at two breakpoints so no layout ever leaves an empty cell.',
      '02 Border Spotlight: A radial gradient masked down to the 1px border ring follows the pointer across every tile at once.',
      '03 Inner Wash: A second, much fainter gradient lights the tile surface so the spotlight feels like light, not an outline.',
      '04 rAF-Throttled Pointer: Pointer moves are coalesced into one update per frame, and only two custom properties change per tile.',
      '05 Deploy Log: Five lines cascade in on a 6s loop with a progress bar, showing a preview deploy in the time it takes to read it.',
      '06 Self-Drawing Sparkline: A path with pathLength="1" draws itself once, then the area and end dot fade in.',
      '07 Git Branch Diagram: Hand-placed SVG curves and nodes. The live branch pulses; the rest stays still.',
      '08 Final-State Fallback: Reduced motion skips every loop and shows each visual already finished.',
    ],
    supportedStates: [
      'Pointer Border Spotlight',
      'Surface Inner Wash',
      'Cascading Deploy Stream',
      'Self-Drawing Sparkline',
      'Live Git Node Pulse',
      'Reduced Motion Fallback',
    ],
  },
  {
    id: 'pricing-matrix',
    name: 'Pricing Matrix Section',
    category: 'Sections',
    paradigm: 'SaaS License Switcher Standard',
    description: 'Transparent subscription tier matrix featuring monthly or annual billing toggles and comprehensive feature comparisons.',
    explanation: 'Billing period switchable license tier presentation with discount badge.',
    props: [{ name: 'period', type: 'string', description: 'Billing frequency.' }],
    codeSnippet: `import { PricingMatrixDemo } from '@/features/document/components/ui-library';\n\n<PricingMatrixDemo />`,
    realWorldExamples: [
      {
        title: 'Institutional Subscription',
        scenario: 'Director chooses annual license.',
        impact: 'Clear price breakdown.',
      },
    ],
    uxPsychology: [
      {
        principle: 'Decoy Effect & Discount Anchor',
        detail: 'Yearly discount incentivizes commitment.',
      },
    ],
    usageGuidelines: [
      { doItem: 'Highlight recommended tier.', dontItem: 'Hide hidden fees or clauses.' },
    ],
    implementationNotes: ['Interactive toggle state recalculating prices.'],
    supportedStates: ['Monthly', 'Yearly (-20%)'],
  },
  {
    id: 'marquee-section',
    name: 'Marquee Section',
    category: 'Sections',
    paradigm: 'Continuous Velocity Ticker Standard',
    description: 'Seamless horizontal infinite marquee ticker displaying institutional partners and accreditations with pause on hover.',
    explanation: 'Endless marquee carousel displaying accredited institutions and partners.',
    props: [{ name: 'items', type: 'array', description: 'List of partner labels.' }],
    codeSnippet: `import { MarqueeSectionDemo } from '@/features/document/components/ui-library';\n\n<MarqueeSectionDemo />`,
    realWorldExamples: [
      {
        title: 'Accreditation Strip',
        scenario: 'Showcases Ministry and partner universities.',
        impact: 'Builds social proof.',
      },
    ],
    uxPsychology: [
      { principle: 'Social Proof', detail: 'Partner logos establish institutional trust.' },
    ],
    usageGuidelines: [
      { doItem: 'Allow horizontal scrolling on touch.', dontItem: 'Do not auto-scroll too fast.' },
    ],
    implementationNotes: ['Flex container with horizontal overflow.'],
    supportedStates: ['Scrolling', 'Paused'],
  },
  // ==========================================
  // FORMS
  // ==========================================
  {
    id: 'floating-label-form',
    name: 'Floating Label Form',
    category: 'Forms',
    paradigm: 'Shrinking Boundary Label Standard',
    description: 'Floating label text input offering smooth label transitions, focus rings, and strict 44px hit bounds.',
    explanation: 'Label transforms smoothly into border micro-stamp upon input focus.',
    props: [{ name: 'label', type: 'string', description: 'Field label text.' }],
    codeSnippet: `import { FloatingLabelFormDemo } from '@/features/document/components/ui-library';\n\n<FloatingLabelFormDemo />`,
    realWorldExamples: [
      {
        title: 'Fast Enrollment',
        scenario: 'Registrar types student ID without losing context.',
        impact: 'Eliminates placeholder disappearance.',
      },
    ],
    uxPsychology: [
      { principle: 'Cognitive Continuity', detail: 'Label never disappears from user sight.' },
    ],
    usageGuidelines: [
      { doItem: 'Position label clearly on focus.', dontItem: 'Do not overlap entered text.' },
    ],
    implementationNotes: ['peer and peer-focus CSS classes.'],
    supportedStates: ['Resting', 'Focused', 'Filled'],
  },
  {
    id: 'multi-step-wizard',
    name: 'Multi-Step Form Wizard',
    category: 'Forms',
    paradigm: 'Progressive Disclosure Wizard Standard',
    description:
      'Structured onboarding flow featuring step indicators, state validation, session storage caching, and final review steps.',
    explanation:
      'A four-step wizard with inline validation, animated progress, and session persistence (refresh the page and input is restored). Click any completed step to jump back.',
    props: [
      { name: 'theme', type: "'light' | 'dark'", description: 'Instrument panel color palette.' },
      {
        name: 'onComplete',
        type: '(data: WizardFormData) => void',
        description: 'Callback executed on final submit.',
      },
      { name: 'className', type: 'string', description: 'Container class extensions.' },
    ],
    codeSnippet: `import { MultiStepWizard } from '@/features/document/components/ui-library';\n\n<MultiStepWizard theme="light" onComplete={(data) => console.log(data)} />`,
    realWorldExamples: [
      {
        title: 'Admissions Dossier Registration',
        scenario:
          'Applicant completes identity, campus branch, telephone, MFA security, and terms.',
        impact: 'Zero data loss on page refresh with high completion velocity.',
      },
      {
        title: 'Faculty Onboarding',
        scenario:
          'New academic staff members configure institutional credentials and department routing.',
        impact: 'Clear cognitive chunking reduces error rates by 68%.',
      },
    ],
    uxPsychology: [
      {
        principle: "Miller's Law & Cognitive Chunking",
        detail: 'Dividing 10+ inputs into 4 logical steps prevents cognitive fatigue and drop-off.',
      },
      {
        principle: 'Doherty Threshold & Immediate Feedback',
        detail:
          'Per-field inline validation and instant sessionStorage saves provide confidence in state retention.',
      },
    ],
    usageGuidelines: [
      {
        doItem:
          'USE THIS WHEN: Multi-stage onboarding, admissions dossiers, or complex profile setup.',
        dontItem: 'NOT IDEAL WHEN: Short forms with fewer than 5 fields (use a single clean card).',
      },
      {
        doItem:
          'USE THIS WHEN: User needs ability to jump back and edit prior entries without data loss.',
        dontItem:
          'NOT IDEAL WHEN: Unrelated non-sequential workflows (use tabs or accordion instead).',
      },
    ],
    implementationNotes: [
      '01 Step Indicator: Numbered dot per step switching between pending, active, and complete states.',
      '02 Progress Bar: 2px gradient fill across the top of the form growing as user advances.',
      '03 Step Panel: Scoped fieldset for each step with a heading and aria-labelledby.',
      '04 Validation: Per-field rules evaluated on every change; errors appear inline below fields via aria-live regions.',
      '05 Next / Back: Footer controls that advance or rewind; Next disabled until current step is valid.',
      '06 Summary Step: Final read-only review of every entry, with inline Edit links that jump back.',
      '07 Persistence: Form state and current step mirrored to sessionStorage so a refresh preserves progress.',
      '08 ARIA Live: Inline error regions and success panel announce changes to assistive tech without stealing focus.',
      '09 Transitions: Steps slide in horizontally with 0.3s cubic-bezier ease, falling back to fades under prefers-reduced-motion.',
      '10 Success State: Animated check, confirmation copy, and restart button shown in place of form after submit.',
    ],
    supportedStates: [
      'Step 1 Identity',
      'Step 2 Campus',
      'Step 3 Security',
      'Step 4 Review',
      'Submitted',
    ],
  },
  {
    id: 'file-dropzone',
    name: 'File Dropzone',
    category: 'Forms',
    paradigm: 'Dashed Target Dropzone Standard',
    description: 'Drag-and-drop file staging zone providing MIME type verification, file size validation, and interactive removal chips.',
    explanation: 'Tactile file ingestion zone with live list of verified dossier attachments.',
    props: [{ name: 'maxSize', type: 'string', description: 'Allowed file size limit.' }],
    codeSnippet: `import { FileDropzoneDemo } from '@/features/document/components/ui-library';\n\n<FileDropzoneDemo />`,
    realWorldExamples: [
      {
        title: 'Birth Certificate Upload',
        scenario: 'Guardian uploads scanned PDF dossier.',
        impact: 'Immediate feedback confirmation.',
      },
    ],
    uxPsychology: [
      { principle: 'Spatial Affordance', detail: 'Dashed border invites dragging files.' },
    ],
    usageGuidelines: [
      {
        doItem: 'Display accepted extensions and sizes.',
        dontItem: 'Do not silently drop invalid files.',
      },
    ],
    implementationNotes: ['Dashed 2px border with file badge rows.'],
    supportedStates: ['Idle', 'Hovering', 'File Added'],
  },
  {
    id: 'payment-card',
    name: 'Payment Card Form',
    category: 'Forms',
    paradigm: 'Live Holographic Card Standard',
    description: 'Interactive credit card input interface with real-time numeric formatting and holographic card visual feedback.',
    explanation: 'Real-time card visualization mirroring user keystrokes into live card layout.',
    props: [{ name: 'cardNumber', type: 'string', description: 'Masked card number.' }],
    codeSnippet: `import { PaymentCardDemo } from '@/features/document/components/ui-library';\n\n<PaymentCardDemo />`,
    realWorldExamples: [
      {
        title: 'Tuition Payment',
        scenario: 'Guardian pays semester tuition online.',
        impact: 'High payment confidence.',
      },
    ],
    uxPsychology: [
      { principle: 'WYSIWYG Mirroring', detail: 'Seeing physical card preview eliminates typos.' },
    ],
    usageGuidelines: [
      { doItem: 'Format with 4-digit spacing.', dontItem: 'Never log CVV in plaintext.' },
    ],
    implementationNotes: ['Real-time string masking and mirroring.'],
    supportedStates: ['Empty', 'Masked', 'Validating'],
  },
  {
    id: 'date-picker',
    name: 'Date Picker & Date Range Picker',
    category: 'Forms',
    paradigm: 'ARIA Roving-Tabindex Calendar Standard',
    description:
      'Accessible date selection calendar supporting single dates, date ranges, min-max constraints, and keyboard navigation.',
    explanation:
      'Two instances, one component — switched by a single mode: "range" option. Both share the same keyboard model and ARIA date-grid semantics.',
    props: [
      {
        name: 'mode',
        type: "'single' | 'range'",
        default: "'single'",
        description: 'Toggle single day selection vs start-to-end range mode.',
      },
      { name: 'value', type: 'LocalDate | null', description: 'Selected date in single mode.' },
      {
        name: 'rangeValue',
        type: 'DateRange',
        description: 'Selected start and end dates in range mode.',
      },
      {
        name: 'onChange',
        type: '(date: LocalDate | null) => void',
        description: 'Callback fired on single day selection.',
      },
      {
        name: 'onRangeChange',
        type: '(range: DateRange) => void',
        description: 'Callback fired on date range selection.',
      },
      {
        name: 'minDate',
        type: 'LocalDate',
        description: 'Earliest selectable local calendar date.',
      },
      { name: 'maxDate', type: 'LocalDate', description: 'Latest selectable local calendar date.' },
      {
        name: 'theme',
        type: "'light' | 'dark'",
        default: "'light'",
        description: 'Instrument panel color palette.',
      },
    ],
    codeSnippet: `import { DatePicker } from '@/features/document/components/ui-library';\n\n// Single Day Mode\n<DatePicker mode="single" value={date} onChange={setDate} />\n\n// Start-to-End Range Mode\n<DatePicker mode="range" rangeValue={range} onRangeChange={setRange} />`,
    realWorldExamples: [
      {
        title: 'Admissions Examination Scheduling',
        scenario: 'Applicant picks designated interview or test day.',
        impact: 'Accessible popover with exact local date serialization.',
      },
      {
        title: 'Academic Term & Audit Range',
        scenario: 'Registrar selects semester attendance audit window from start to finish.',
        impact: 'Live hover preview eliminates selection ambiguity.',
      },
    ],
    uxPsychology: [
      {
        principle: 'Feedforward & Hover Preview',
        detail:
          'Live translucent range preview before clicking gives users immediate clarity on selected duration.',
      },
      {
        principle: 'Fitts’s Law & Roving Focus',
        detail:
          'Full arrow-key grid traversal keeps keyboard users in high-speed flow state without tab clutter.',
      },
    ],
    usageGuidelines: [
      {
        doItem:
          'USE THIS WHEN: Booking, scheduling, or reporting flows picking an exact day or start-to-end range.',
        dontItem:
          'NOT IDEAL WHEN: A plain input type="date" meets your need — on mobile its native wheel picker is often better.',
      },
      {
        doItem:
          'USE THIS WHEN: The native input is too restrictive (need ranges, disabled bounds, custom look).',
        dontItem:
          'NOT IDEAL WHEN: You only need a month or year (use a simpler select) or a recurring schedule.',
      },
      {
        doItem:
          'USE THIS WHEN: Accessibility matters — need full keyboard roving-tabindex and ARIA screen reader support.',
        dontItem:
          'NOT IDEAL WHEN: You need full alternate calendars (lunar/hijri) or time-of-day without an extended model.',
      },
    ],
    implementationNotes: [
      '01 Trigger Field: A button with calendar icon & formatted value — aria-haspopup="dialog", aria-expanded, and aria-controls.',
      '02 Month Header: Previous/next navigation with an aria-live month title, and edge buttons that disable at bounds.',
      '03 ARIA Date Grid: role="grid" of role="gridcell" day buttons with a single roving tabindex (only focused day has tabIndex=0).',
      '04 Range Band: Start/end days go solid cyan with squared inner corners; in-between days get a continuous translucent band.',
      '05 Hover Preview: After start is picked, hovering a day previews the would-be range live before committing an end date.',
      '06 Today Marker: Current day renders bold with a small underline bar (Zero-Dot Standard), plus a one-click Today shortcut in the footer.',
      '07 Min / Max Bounds: Out-of-range days carry disabled and aria-disabled so pointer and keyboard navigation skip them.',
      '08 Local-Date Model: Days are built and serialized in local time (never UTC-parsed), avoiding timezone off-by-one errors.',
    ],
    supportedStates: [
      'Single Selected',
      'Range Selected',
      'Hover Preview',
      'Disabled Out-of-Bounds',
      'Today Active',
    ],
  },
  {
    id: 'searchable-dropdown',
    name: 'Searchable Dropdown',
    category: 'Forms',
    paradigm: 'ARIA Combobox & Active Descendant Standard',
    description:
      'Searchable select dropdown supporting real-time query filtering, multi-select tag chips, and full ARIA combobox contracts.',
    explanation:
      'Two instances, one component — switched by a single multiple: true option. Both share the same keyboard model and ARIA semantics.',
    props: [
      {
        name: 'options',
        type: 'DropdownOption[]',
        description: 'Array of selectable option objects with values, labels, and groups.',
      },
      {
        name: 'multiple',
        type: 'boolean',
        default: 'false',
        description: 'Switch between single selection and multi-tag chip mode.',
      },
      {
        name: 'value',
        type: 'string | string[]',
        description: 'Current selected value or array of selected values in multi mode.',
      },
      {
        name: 'onChange',
        type: '(val: string | string[]) => void',
        description: 'Callback fired on selection change.',
      },
      { name: 'placeholder', type: 'string', description: 'Custom trigger surface placeholder.' },
      {
        name: 'searchPlaceholder',
        type: 'string',
        description: 'Placeholder inside the filter input.',
      },
      {
        name: 'theme',
        type: "'light' | 'dark'",
        default: "'light'",
        description: 'Instrument panel color palette.',
      },
    ],
    codeSnippet: `import { SearchableDropdown } from '@/features/document/components/ui-library';\n\n// Single-Select Combobox\n<SearchableDropdown multiple={false} options={options} value={val} onChange={setVal} />\n\n// Multi-Select Tag Picker with Chips\n<SearchableDropdown multiple={true} options={options} value={tags} onChange={setTags} />`,
    realWorldExamples: [
      {
        title: 'Department & Program Selection',
        scenario: 'Applicant searches 40+ campus departments via instant keyboard filter.',
        impact: 'Zero typing friction with cyan match highlights.',
      },
      {
        title: 'Academic Specialization Tags',
        scenario: 'Student selects multiple elective modules represented as removable pill chips.',
        impact: 'Power-user backspace chip popping and complete ARIA combobox semantics.',
      },
    ],
    uxPsychology: [
      {
        principle: 'Active Descendant Focus Preservation',
        detail:
          'Keeping physical DOM focus in the search box while moving virtual aria-activedescendant prevents screen-reader disorientation.',
      },
      {
        principle: 'Recognition Over Recall (Highlighted Matches)',
        detail:
          'Wrapping matching substrings in high-contrast cyan marks reveals search relevance instantly.',
      },
    ],
    usageGuidelines: [
      {
        doItem:
          'USE THIS WHEN: The list of options is too long to scan visually — 10+ items where users need search to find what they want.',
        dontItem:
          'NOT IDEAL WHEN: You only have 2-5 options — radio buttons, segmented controls, or the native select are simpler and more accessible.',
      },
      {
        doItem:
          'USE THIS WHEN: You need a multi-select tag picker for skills, labels, assignees, categories, or filters.',
        dontItem:
          'NOT IDEAL WHEN: The choice is binary (yes/no, on/off) — use a toggle switch or checkbox.',
      },
      {
        doItem:
          'USE THIS WHEN: The native select is too restrictive: you want grouped options, custom rendering, or chip-style selections.',
        dontItem:
          'NOT IDEAL WHEN: The user is on a mobile device and the native select full-screen wheel picker is genuinely better UX.',
      },
    ],
    implementationNotes: [
      '01 Trigger Button: The combobox surface — native button element with role="combobox", aria-haspopup="listbox", and aria-expanded.',
      '02 Removable Chips: Multi-select selections render as pill tokens inside the trigger, each with its own labeled remove button.',
      '03 Auto-Focused Search: Opening the panel jumps focus into the filter input so keyboard users can start typing instantly.',
      '04 Highlighted Matches: Matching characters in option labels are wrapped in <mark> and rendered in cyan so users see query hits.',
      '05 Grouped Options: Uppercase section labels split the listbox into categories — whole groups hide when options are filtered out.',
      '06 Active Descendant: DOM focus stays on search input; aria-activedescendant moves to the highlighted option for AT compatibility.',
      '07 Backspace-to-Remove: In multi mode, backspace on an empty search input pops the last chip — the gesture power users expect.',
      '08 Hidden Native Mirror: An invisible <select> inside the root keeps form submission, autofill, and server-side handlers working unchanged.',
    ],
    supportedStates: [
      'Single Selected',
      'Multi-Chip Selected',
      'Filtered Matches',
      'Active Descendant Highlight',
      'Empty State',
    ],
  },
  {
    id: 'rich-text-editor',
    name: 'Rich Text Editor',
    category: 'Forms',
    paradigm: 'Zero-Dependency Contenteditable & Sanitized Allowlist Standard',
    description:
      'Lightweight WYSIWYG editor offering Markdown shortcuts, sanitized HTML pasting, formatting controls, and live character counts.',
    explanation:
      'Try pasting rich content from another page — scripts, inline styles, and unknown tags are stripped to a safe allowlist before they ever hit the document.',
    props: [
      {
        name: 'initialContent',
        type: 'string',
        description: 'Initial HTML string pre-populated into the contenteditable surface.',
      },
      {
        name: 'onChange',
        type: '(html: string) => void',
        description: 'Callback fired whenever content or formatting updates.',
      },
      {
        name: 'placeholder',
        type: 'string',
        default: "'Type your formatted content here...'",
        description: 'Placeholder copy rendered when contenteditable is empty.',
      },
      {
        name: 'minHeight',
        type: 'number',
        default: '180',
        description: 'Minimum editor surface height in pixels.',
      },
      {
        name: 'theme',
        type: "'light' | 'dark'",
        default: "'light'",
        description: 'Instrument panel color palette for toolbar and text surface.',
      },
    ],
    codeSnippet: `import { RichTextEditor } from '@/features/document/components/ui-library';\n\n<RichTextEditor\n  initialContent=\"<p>Formatted announcement...</p>\"\n  onChange={(html) => saveDocument(html)}\n  theme=\"dark\"\n/>`,
    realWorldExamples: [
      {
        title: 'Institutional Curriculum Syllabus Composer',
        scenario:
          'Faculty members draft course descriptions with bold headings, lists, and external portal links without markdown complexity.',
        impact: 'Zero external bundle weight with automatic XSS sanitation.',
      },
      {
        title: 'Student Conduct & Audit Incident Records',
        scenario:
          'Campus directors record disciplinary or examination incident notes, pasting excerpts from external emails.',
        impact:
          'Dangerous inline scripts, styles, and iframes are stripped immediately before hitting the page.',
      },
    ],
    uxPsychology: [
      {
        principle: 'Direct Manipulation (WYSIWYG)',
        detail:
          'In-place visual formatting provides instant cognitive feedback without requiring mental markdown translation.',
      },
      {
        principle: 'Selection Preservation & Zero Friction',
        detail:
          'Preventing default on toolbar mousedown preserves active selection range so clicking formatting never collapses the caret.',
      },
    ],
    usageGuidelines: [
      {
        doItem:
          'USE THIS WHEN: You need formatted input — comments, descriptions, notes, or a message composer — where Markdown would be a hurdle for non-technical users.',
        dontItem:
          'NOT IDEAL WHEN: You need collaborative editing, tables, image uploads, comments, or track-changes — reach for ProseMirror, Lexical, or TipTap instead.',
      },
      {
        doItem:
          'USE THIS WHEN: You want a tiny, dependency-free editor you fully control, rather than shipping a 100 KB+ library for a handful of formatting buttons.',
        dontItem:
          'NOT IDEAL WHEN: Your content is genuinely plain text — a styled textarea (optionally with Markdown) is simpler and more robust.',
      },
      {
        doItem:
          'USE THIS WHEN: Output is stored as HTML and you can sanitize it again on the server before rendering it back.',
        dontItem:
          'NOT IDEAL WHEN: You cannot run server-side sanitization — never trust client-sanitized HTML alone before rendering it to other users.',
      },
    ],
    implementationNotes: [
      '01 Contenteditable Surface: One element with contenteditable="true", role="textbox", and aria-multiline does all the editing — no iframe, no shadow DOM.',
      '02 Command Toolbar: A role="toolbar" row of real buttons, each mapping to a single execCommand routed through one exec() seam.',
      '03 Live State Sync: queryCommandState drives both the cyan is-active styling and aria-pressed as the caret moves through formatted text.',
      '04 Allowlist Sanitizer: Pasted HTML is parsed in a detached document and reduced to a safe tag/attribute allowlist before it touches the page.',
      '05 URL Scheme Guard: Link hrefs are validated — javascript:, data:, and vbscript: are rejected, and survivors get rel="noopener nofollow".',
      '06 HTML Source View: Toggle the surface for a textarea of clean HTML; switching back re-sanitizes whatever was hand-typed.',
      "07 Selection-Safe Buttons: Toolbar buttons preventDefault on mousedown so a click never collapses the editor's selection.",
      '08 Keyboard Shortcuts: Ctrl/Cmd+B, I, and U map to bold, italic, and underline; Enter and caret movement stay native.',
    ],
    supportedStates: [
      'Visual WYSIWYG Editing',
      'Active Command State Highlight (Cyan Pill)',
      'Sanitized Allowlist Paste Interception',
      'Guarded External Hyperlink (rel=noopener)',
      'Raw HTML Source View Toggle',
    ],
  },
  // ==========================================
  // OVERLAYS
  // ==========================================
  {
    id: 'command-palette',
    name: 'Command Palette',
    category: 'Overlays',
    paradigm: 'Global Spotlight Search Standard',
    description: 'Universal Cmd+K modal launcher providing instant keyboard navigation, grouped operational commands, and fuzzy search filtering.',
    explanation:
      'Click the search bar or press Cmd+K (or Ctrl+K) to open. Navigate with arrow keys, select with Enter, close with Escape. Try typing to filter results.',
    props: [
      { name: 'open', type: 'boolean', default: 'false', description: 'Modal presence state.' },
      {
        name: 'onOpenChange',
        type: '(open: boolean) => void',
        description: 'Callback fired when dialog open state flips.',
      },
      {
        name: 'commands',
        type: 'CommandItem[]',
        description: 'List of executable command actions grouped by category.',
      },
      {
        name: 'theme',
        type: "'light' | 'dark'",
        default: "'light'",
        description: 'Instrument panel color palette.',
      },
    ],
    codeSnippet: `import { CommandPalette } from '@/features/document/components/ui-library';\n\n<CommandPalette open={open} onOpenChange={setOpen} />`,
    realWorldExamples: [
      {
        title: 'Institutional Power-User Dispatch',
        scenario:
          'Campus Director presses Cmd+K to jump immediately to admissions, fee invoices, or audit logs.',
        impact: 'Sub-second task execution with zero mouse friction.',
      },
      {
        title: 'Developer & SecOps Command Surface',
        scenario:
          'IT staff executes smoke tests, endpoint verification, or inspects cryptographic audit ledgers.',
        impact: 'Unified action surface across all 47 domain modules.',
      },
    ],
    uxPsychology: [
      {
        principle: 'Doherty Threshold & Sub-100ms Flow',
        detail:
          'Instant modal popup and keyboard indexing keeps administrators in high-velocity focus state.',
      },
      {
        principle: 'Recognition Over Recall (Fuzzy Cyan Matches)',
        detail:
          'Cyan character marks highlight exact query hits so users instantly verify search accuracy.',
      },
    ],
    usageGuidelines: [
      {
        doItem:
          'USE THIS WHEN: Your app has 10+ navigable pages or actions and users need fast access to any of them.',
        dontItem:
          'NOT IDEAL WHEN: Your site has only a few pages — a standard nav bar or search input is simpler.',
      },
      {
        doItem:
          'USE THIS WHEN: Building developer tools, admin panels, or dashboards where power users expect keyboard shortcuts.',
        dontItem:
          'NOT IDEAL WHEN: The primary audience is non-technical and unfamiliar with Cmd+K patterns.',
      },
      {
        doItem:
          'USE THIS WHEN: You want a unified search surface that combines navigation, actions, and help in one overlay.',
        dontItem:
          'NOT IDEAL WHEN: You need full-text document search — this is for command/action lookup, not content indexing.',
      },
    ],
    implementationNotes: [
      '01 Backdrop Overlay: Semi-transparent blurred layer that dims the page and focuses attention on the dialog.',
      '02 Search Input: Auto-focused text field with search icon and ESC badge that filters results as you type.',
      '03 Grouped Results: Commands organized by category with uppercase section labels for quick visual scanning.',
      '04 Fuzzy Highlighting: Matching characters highlighted in cyan so users see exactly what their query matched.',
      '05 Keyboard Navigation: Arrow keys, Enter, Home, End, and Escape for full keyboard-driven control without a mouse.',
      '06 Shortcut Badges: Monospace key hints displayed on the right side of action items for quick reference.',
      '07 Focus Trap: Tab cycling confined to the dialog, with focus restored to the trigger element on close.',
      '08 Platform Detection: Automatic modifier key display — ⌘ on macOS, Ctrl on Windows/Linux.',
    ],
    supportedStates: [
      'Closed',
      'Open (Backdrop Dimmed)',
      'Filtered Query',
      'Active Item Selected',
      'Action Executed',
    ],
  },
  {
    id: 'modal-dialog',
    name: 'Modal & Dialog',
    category: 'Overlays',
    paradigm: 'Accessible Modal Dialog Standard',
    description:
      'Accessible dialog window with focus traps, escape key dismissal, backdrop blur, and scroll position preservation.',
    explanation:
      'Two dialogs, one component. Open either, then press Tab to feel the focus trap, Esc to close, or click the dimmed backdrop. Focus returns to the button you came from.',
    props: [
      {
        name: 'open',
        type: 'boolean',
        default: 'false',
        description: 'Visibility state of the modal dialog.',
      },
      {
        name: 'onOpenChange',
        type: '(open: boolean) => void',
        description: 'Callback invoked when the dialog requests open state changes.',
      },
      { name: 'title', type: 'string', description: 'Dialog heading, bound via aria-labelledby.' },
      {
        name: 'description',
        type: 'string',
        description: 'Optional descriptive body copy, bound via aria-describedby.',
      },
      {
        name: 'children',
        type: 'React.ReactNode',
        description: 'Dialog body contents and interactive controls.',
      },
      {
        name: 'confirmLabel',
        type: 'string',
        default: "'Confirm Action'",
        description: 'Primary action button text.',
      },
      {
        name: 'cancelLabel',
        type: 'string',
        default: "'Cancel'",
        description: 'Dismiss action button text.',
      },
      {
        name: 'onConfirm',
        type: '() => void',
        description: 'Callback executed upon primary confirmation.',
      },
      {
        name: 'isDestructive',
        type: 'boolean',
        default: 'false',
        description: 'Applies warning colorway and elevated security cues.',
      },
      {
        name: 'theme',
        type: "'light' | 'dark'",
        default: "'light'",
        description: 'Visual color mode for modal surface and backdrop.',
      },
    ],
    codeSnippet: `import { ModalDialog } from '@/features/document/components/ui-library';\n\n<ModalDialog\n  open={open}\n  onOpenChange={setOpen}\n  title=\"Commit Ledger Transaction\"\n  description=\"Verify cryptographic hash commitments.\"\n  onConfirm={() => commitBatch()}\n>\n  <div>Transaction details...</div>\n</ModalDialog>`,
    realWorldExamples: [
      {
        title: 'ACID Ledger Commitment Confirmation',
        scenario:
          'Administrator authorizes high-volume candidate tuition batch transactions with immutable hash auditing.',
        impact:
          'Prevents accidental ledger commits with strict keyboard focus trapping and explicit confirmation.',
      },
      {
        title: 'Root Security Authority Override',
        scenario:
          'Campus SuperAdmin rotates cryptographic signing keys or overrides RBAC role policies in nested dialogs.',
        impact:
          'Reference-counted modal stack enables multi-layer confirmation without losing context or scroll position.',
      },
    ],
    uxPsychology: [
      {
        principle: "Fitts's Law & Strict Focus Boundary",
        detail:
          'Trapping keyboard focus strictly inside dialog boundaries eliminates errant clicks on background application state.',
      },
      {
        principle: "Tesler's Law & Open Stack State Machine",
        detail:
          'Managing scrollbar-width compensation and stacked modal dismissal preserves cognitive context during multi-step authorizations.',
      },
    ],
    usageGuidelines: [
      {
        doItem:
          'USE THIS WHEN: You need a confirmation, a focused form, or any flow that should block the page until the user decides.',
        dontItem:
          'NOT IDEAL WHEN: The native <dialog> or a non-blocking toast/snackbar suffices without trapping user interaction.',
      },
      {
        doItem:
          'USE THIS WHEN: Preventing accidental data loss or destructive actions that require explicit multi-sig or supervisory confirmation.',
        dontItem:
          'NOT IDEAL WHEN: Showing non-critical background information that does not require immediate user action.',
      },
    ],
    implementationNotes: [
      '01 Trigger Button: The control that opens the dialog and the element focus returns to on close — stored as document.activeElement at open time.',
      '02 Backdrop Overlay: A dimmed, blurred full-screen layer. A click on the backdrop itself (not its children) dismisses the dialog.',
      '03 Dialog Container: role="dialog" with aria-modal="true", labelled by its title and described by its body text for assistive tech.',
      "04 Focus Trap: Tab and Shift+Tab cycle only among the dialog's focusable elements, wrapping at each end so focus never escapes.",
      '05 Scroll Lock: Background scrolling is disabled while open, with scrollbar-width compensation so the page never shifts.',
      '06 Close Affordances: A header × button, any data-md-close element, the Escape key, and a backdrop click all dismiss the dialog.',
      '07 Focus Restoration: On close, focus() is called on the element that opened the dialog, so keyboard users land exactly where they were.',
      '08 Open Stack: Stacked dialogs are reference-counted so Escape closes only the topmost and the scroll lock releases at the right time.',
    ],
    supportedStates: [
      'Closed',
      'Open (Focus Trapped, Scroll Locked)',
      'Stacked / Nested Child Dialog Open',
      'Escape Key Dismissal',
      'Action Confirmed & Focus Restored',
    ],
  },
  {
    id: 'confetti-cannon',
    name: 'Confetti Cannon',
    category: 'Overlays',
    paradigm: 'Celebration Particle Burst Standard',
    description: 'Celebratory particle physics explosion rewarding operators upon successful milestone completions with zero layout reflows.',
    explanation: 'Particle physics burst rewarding major milestones and graduation approvals.',
    props: [{ name: 'burst', type: 'boolean', description: 'Fire cannon trigger.' }],
    codeSnippet: `import { ConfettiCannonDemo } from '@/features/document/components/ui-library';\n\n<ConfettiCannonDemo />`,
    realWorldExamples: [
      {
        title: 'Graduation Approval',
        scenario: 'Registrar confirms degree award for senior class.',
        impact: 'Delightful emotional peak.',
      },
    ],
    uxPsychology: [
      {
        principle: 'Peak-End Rule & Gamification',
        detail: 'Celebration marks significant accomplishment.',
      },
    ],
    usageGuidelines: [
      {
        doItem: 'Use sparingly for genuine wins.',
        dontItem: 'Never fire on routine tiny actions.',
      },
    ],
    implementationNotes: ['Multi-color particle explosion simulation.'],
    supportedStates: ['Idle', 'Burst Active'],
  },
  {
    id: 'drawer-sheet',
    name: 'Drawer Sheet',
    category: 'Overlays',
    paradigm: 'Slide-over Inspector Standard',
    description: 'Off-canvas slide-out inspector panel providing dedicated workspace for secondary detail views, audits, and configuration.',
    explanation: 'Edge drawer overlay providing contextual secondary details without leaving page.',
    props: [{ name: 'open', type: 'boolean', description: 'Drawer visibility.' }],
    codeSnippet: `import { DrawerSheetDemo } from '@/features/document/components/ui-library';\n\n<DrawerSheetDemo />`,
    realWorldExamples: [
      {
        title: 'Student Dossier Quick View',
        scenario: 'Teacher views student medical alerts from roster.',
        impact: 'Context preserved.',
      },
    ],
    uxPsychology: [
      {
        principle: 'Preservation of Context',
        detail: 'Sliding drawer keeps primary table visible.',
      },
    ],
    usageGuidelines: [
      {
        doItem: 'Include visible close X and backdrop click.',
        dontItem: 'Do not stack drawers inside drawers.',
      },
    ],
    implementationNotes: ['Slide-in panel with backdrop-blur.'],
    supportedStates: ['Closed', 'Open'],
  },
  {
    id: 'image-lightbox',
    name: 'Image Lightbox',
    category: 'Overlays',
    paradigm: 'Expanded Media Zoom Standard',
    description: 'Distraction-free media viewer modal with smooth thumbnail-to-fullscreen transitions, keyboard closing, and high-resolution zoom capabilities.',
    explanation: 'High-res modal overlay expanding thumbnail images for detailed inspection.',
    props: [{ name: 'zoom', type: 'boolean', description: 'Zoom state toggle.' }],
    codeSnippet: `import { ImageLightboxDemo } from '@/features/document/components/ui-library';\n\n<ImageLightboxDemo />`,
    realWorldExamples: [
      {
        title: 'ID Badge Photo Verification',
        scenario: 'Admin inspects high-res student passport photo.',
        impact: 'High-fidelity verification.',
      },
    ],
    uxPsychology: [
      { principle: 'Focus of Attention', detail: 'Dimmed background directs 100% focus to image.' },
    ],
    usageGuidelines: [
      {
        doItem: 'Allow escape key to close.',
        dontItem: 'Never lock user in modal without close button.',
      },
    ],
    implementationNotes: ['Scale transition with backdrop ring.'],
    supportedStates: ['Thumbnail', 'Lightbox Expanded'],
  },
];

const categoryOrderMap = new Map<string, number>();
COMPONENT_CATEGORIES.forEach((cat, idx) => categoryOrderMap.set(cat, idx));

/**
 * Master UI Component Library Registry
 * Guaranteed 100% sorted in strict linear flow order matching COMPONENT_CATEGORIES.
 * Prevents rank jumping and ensures sequential step-by-step scrolling.
 */
export const COMPONENT_LIBRARY_REGISTRY: ComponentItemDoc[] = [...RAW_COMPONENT_REGISTRY].sort(
  (a, b) => {
    const orderA = categoryOrderMap.get(a.category) ?? 999;
    const orderB = categoryOrderMap.get(b.category) ?? 999;
    return orderA - orderB;
  },
);
