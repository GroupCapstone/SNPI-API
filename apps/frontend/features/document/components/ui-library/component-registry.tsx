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
  'Backgrounds',
  'Text Effects',
  'Cards',
  'Sections',
  'Forms',
  'Overlays',
] as const;

export type ComponentCategory = (typeof COMPONENT_CATEGORIES)[number];

export const COMPONENT_LIBRARY_REGISTRY: ComponentItemDoc[] = [
  {
    id: 'snackbar',
    name: 'Snackbar',
    category: 'Feedback',
    paradigm: 'Gmail Paradigm',
    description: 'Bottom feedback alert with optional instant Undo.',
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
    id: 'bottom-sheet',
    name: 'Bottom Sheet',
    category: 'Feedback',
    paradigm: 'Google Maps Paradigm',
    description: 'Slide-up mobile panel for contextual actions.',
    explanation:
      'The Bottom Sheet is a mobile-first surface anchored to the bottom viewport edge. Modeled after Google Maps location cards, it lets users inspect supplementary details, execute contextual actions, or configure filters while preserving full situational context of the underlying view.',
    supportedStates: ['Default', 'Open (Peek)', 'Expanded', 'Action Selected', 'Dismissed'],
    realWorldExamples: [
      {
        title: 'Campus Infrastructure & Room Booking',
        scenario: 'User taps a campus classroom building on the interactive facilities map.',
        impact:
          'A bottom sheet slides up displaying room capacity, available AC units, and projectors.',
      },
      {
        title: 'Quick Operations Action Sheet',
        scenario: 'Registrar taps operations trigger in the Student Directory table.',
        impact:
          'Sheet reveals options: Export Student Roster (CSV), Generate Attendance Matrix, Send SMS.',
      },
      {
        title: 'Mobile Grade Entry Sheet',
        scenario: 'Teacher grading exams on a mobile tablet during classroom rounds.',
        impact:
          'Sheet allows quick rubric selection without navigating away from the student list.',
      },
    ],
    uxPsychology: [
      {
        principle: 'Thumb Zone Ergonomics (Steven Hoober)',
        detail:
          'Anchoring interactions at the bottom edge places controls directly within the effortless natural sweep radius of the thumb.',
      },
      {
        principle: 'Spatial Continuity & Progressive Disclosure',
        detail:
          'Peeking from the bottom keeps the parent screen visible, assuring users they have not lost their place in the application.',
      },
    ],
    usageGuidelines: [
      {
        doItem:
          'Include a prominent 36x4px drag handle at the top center and support backdrop tap dismiss.',
        dontItem: 'Nest a vertical scrollable sheet inside another scrollable sheet.',
      },
      {
        doItem: 'Lock background body scroll while the bottom sheet is active.',
        dontItem: 'Use bottom sheets for complex multi-column forms on desktop viewports.',
      },
    ],
    implementationNotes: [
      'Uses rounded-t-2xl (16px) top radius with 1px border and flat backdrop bg-black/60 with backdrop-blur-xs.',
      'Supports keyboard Escape dismissal and touch swipe-down gestures.',
      'Traps focus inside modal sheet when fully expanded and restores focus to trigger on close.',
    ],
    codeSnippet: `import { LibraryBottomSheet } from '@/features/document/components/ui-library';

export function Example() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Quick Operations</button>
      <LibraryBottomSheet
        open={open}
        title="Quick Operations"
        onClose={() => setOpen(false)}
      >
        <div className="space-y-2">
          <button className="w-full text-left p-2 border rounded">Export Student Roster</button>
          <button className="w-full text-left p-2 border rounded">Generate Attendance Matrix</button>
        </div>
      </LibraryBottomSheet>
    </>
  );
}`,
    props: [
      {
        name: 'open',
        type: 'boolean',
        default: 'false',
        description: 'Controls whether the sheet panel is visible.',
      },
      {
        name: 'onClose',
        type: '() => void',
        default: '—',
        description: 'Callback invoked when backdrop or close button is clicked.',
      },
      {
        name: 'title',
        type: 'string',
        default: '—',
        description: 'Header title text displayed at top of sheet.',
      },
      {
        name: 'children',
        type: 'React.ReactNode',
        default: '—',
        description: 'Sheet body content and interactive elements.',
      },
    ],
  },
  {
    id: 'dialog',
    name: 'Dialog',
    category: 'Feedback',
    paradigm: 'WhatsApp Paradigm',
    description: 'Modal confirmation for critical or irreversible actions.',
    explanation:
      'The Dialog is a focused modal overlay that temporarily suspends background operations to demand an unambiguous user confirmation. By introducing deliberate cognitive friction, it prevents catastrophic accidental deletions, academic grade alterations, or unrecoverable tenant data drops.',
    supportedStates: [
      'Default',
      'Confirmation Required',
      'Loading / Processing',
      'Confirmed',
      'Cancelled',
    ],
    realWorldExamples: [
      {
        title: 'Student Enrollment Deferral',
        scenario: 'Administrator clicks to defer student STU-2026-0891 to Academic Year 2027.',
        impact:
          'Dialog clearly states that existing tuition fees are preserved while seat allocation is freed.',
      },
      {
        title: 'Term Gradebook Finalization',
        scenario: 'Headmaster locks term grades prior to generating official transcripts.',
        impact: 'Demands confirmation that teacher grade edits will be locked permanently.',
      },
      {
        title: 'Campus Branch Soft Deletion',
        scenario: 'Deleting an unused campus branch with child records.',
        impact:
          'Warns that all associated classrooms and rosters will be archived under soft-delete protection.',
      },
    ],
    uxPsychology: [
      {
        principle: 'Friction as a Safety Guardrail (Daniel Kahneman - System 2)',
        detail:
          'Deliberately interrupts automatic System 1 muscle memory to force conscious, deliberate System 2 evaluation of consequences.',
      },
      {
        principle: 'Action Verbs in Primary CTAs',
        detail:
          'Replacing generic "OK/Cancel" with descriptive action verbs ("Confirm Deferral") eliminates ambiguity and cognitive doubt.',
      },
    ],
    usageGuidelines: [
      {
        doItem: 'Use descriptive, verb-based action labels like "Confirm Deferral" or "Lock Term".',
        dontItem:
          'Use dialogs for routine, non-destructive actions like saving a draft—use a snackbar instead.',
      },
      {
        doItem:
          'Provide a clear Cancel button that safely exits without mutating any application state.',
        dontItem: 'Include complex, scrollable multi-tab forms inside a confirmation dialog.',
      },
    ],
    implementationNotes: [
      'Enforces role="dialog" and aria-modal="true" with complete focus trapping via Radix UI.',
      'Surface: Level 2 Elevated (#202024 / white) with 16px outer radius and 8px inner button radius.',
      'Zero box-shadows policy enforced: depth is established purely via surface luminance contrast against the backdrop.',
    ],
    codeSnippet: `import { LibraryDialog } from '@/features/document/components/ui-library';

export function Example() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Defer Enrollment</button>
      <LibraryDialog
        open={open}
        onOpenChange={setOpen}
        title="Confirm Enrollment Deferral"
        description="This will defer student STU-2026-0891 to Academic Term 2027. Tuition balances are preserved."
        confirmLabel="Confirm Deferral"
        cancelLabel="Cancel"
        onConfirm={() => console.log('Deferred')}
      />
    </>
  );
}`,
    props: [
      {
        name: 'open',
        type: 'boolean',
        default: 'false',
        description: 'Controls visibility of the dialog.',
      },
      {
        name: 'onOpenChange',
        type: '(open: boolean) => void',
        default: '—',
        description: 'State setter for open status.',
      },
      { name: 'title', type: 'string', default: '—', description: 'Dialog header title.' },
      {
        name: 'description',
        type: 'string',
        default: '—',
        description: 'Body explanation detailing the consequences.',
      },
      {
        name: 'confirmLabel',
        type: 'string',
        default: 'Confirm',
        description: 'Label for the affirmative action button.',
      },
      {
        name: 'cancelLabel',
        type: 'string',
        default: 'Cancel',
        description: 'Label for the neutral cancel button.',
      },
      {
        name: 'isDestructive',
        type: 'boolean',
        default: 'false',
        description: 'Renders confirm button in danger tones.',
      },
      {
        name: 'onConfirm',
        type: '() => void',
        default: '—',
        description: 'Callback triggered upon confirmation.',
      },
    ],
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    category: 'Feedback',
    paradigm: 'Figma Paradigm',
    description: 'Micro hover hint for icons and shortcuts.',
    explanation:
      'The Tooltip is a transient micro-surface that emerges on pointer hover or keyboard focus. Inspired by Figma canvas inspection, it provides concise contextual explanations and reveals power-user keyboard shortcuts (e.g. "Move Tool [V]"), keeping interface toolbars minimalist and uncluttered.',
    supportedStates: [
      'Default',
      'Hovered',
      'Focused',
      'Top Position',
      'Bottom Position',
      'Shortcut Revealed',
    ],
    realWorldExamples: [
      {
        title: 'Canvas Inspection & Tool Palette',
        scenario: 'Hovering over design and layout tools reveals name and hotkey shortcut.',
        impact:
          'Users discover keyboard shortcuts ("Move [V]", "Hand [H]") without leaving canvas.',
      },
      {
        title: 'RBAC Permission Security Badges',
        scenario: 'Hovering over a locked action button in the student management dashboard.',
        impact: 'Tooltip explains: "Requires school.finance.audit permission to export invoices".',
      },
      {
        title: 'Academic Term Progress Tracker',
        scenario: 'Hovering over term milestone status pills in the administrative header.',
        impact:
          'Displays exact start/end dates, holiday schedules, and remaining instructional days.',
      },
    ],
    uxPsychology: [
      {
        principle: 'Recognition Over Recall (Jakob Nielsen)',
        detail:
          'Relieves human working memory by placing instructional tips and keyboard shortcuts directly at the point of action.',
      },
      {
        principle: 'Zero Screen Clutter',
        detail:
          'Allows complex software to look clean and inviting for beginners while offering instantaneous depth for advanced power users.',
      },
    ],
    usageGuidelines: [
      {
        doItem: 'Include keyboard shortcut badges ("Cmd+I", "V") to train power users.',
        dontItem:
          'Put interactive links or buttons inside tooltips—tooltips are strictly read-only.',
      },
      {
        doItem:
          'Provide a brief 150ms delay to prevent visual jitter when sweeping the cursor across toolbar rows.',
        dontItem: 'Display tooltips on mobile touch devices where pointer hover does not exist.',
      },
    ],
    implementationNotes: [
      'Configured with role="tooltip" and aria-describedby linking the trigger to the tooltip text.',
      'Surface: Level 3 Interactive (#2E2E33 / dark slate) with 1px border, 6px radius, and 12px text size.',
      'Supports auto-flip detection when hovering near viewport boundaries.',
    ],
    codeSnippet: `import { LibraryTooltip } from '@/features/document/components/ui-library';

export function Example() {
  return (
    <LibraryTooltip content="Move Tool (Select & Transform)" shortcut="V">
      <button className="h-10 w-10 border rounded">V</button>
    </LibraryTooltip>
  );
}`,
    props: [
      {
        name: 'content',
        type: 'string',
        default: '—',
        description: 'Explanation text displayed in the tooltip.',
      },
      {
        name: 'shortcut',
        type: 'string',
        default: '—',
        description: 'Optional keyboard shortcut badge (e.g. "V", "Cmd+I").',
      },
      {
        name: 'position',
        type: "'top' | 'bottom' | 'left' | 'right'",
        default: "'top'",
        description: 'Preferred anchor direction.',
      },
      {
        name: 'delayMs',
        type: 'number',
        default: '150',
        description: 'Hover initiation delay before rendering.',
      },
      {
        name: 'children',
        type: 'React.ReactNode',
        default: '—',
        description: 'Target element that triggers the tooltip.',
      },
    ],
  },
  {
    id: 'fab',
    name: 'FAB (Floating Action Button)',
    category: 'Feedback',
    paradigm: 'Google Calendar Paradigm',
    description: 'Pinned action button for the primary screen task.',
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
    description: 'Compact interactive tag for filters and selection.',
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
    description: 'Instant binary toggle for settings and preferences.',
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
    description: 'Collapsible menu for single or multi-option selection.',
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
    id: 'bottom-nav',
    name: 'Bottom Nav',
    category: 'Navigation',
    paradigm: 'Spotify Paradigm',
    description: 'Thumb-accessible mobile destination bar.',
    explanation:
      'Bottom Navigation provides primary spatial navigation for mobile applications. Modeled after Spotify and Instagram mobile clients, it places 3 to 5 top-level destination tabs directly where the user’s thumb already rests, enabling instantaneous navigation without reaching for a hamburger menu.',
    supportedStates: [
      'Home Active',
      'Search Active',
      'Academics Active',
      'With Notification Badge',
      'Pill Switch Animation',
    ],
    realWorldExamples: [
      {
        title: 'Student Mobile Portal Hub',
        scenario: 'Student checks schedule, homework, and exam grades on mobile device.',
        impact: 'Effortless one-tap switching between "Home", "Classes", "Grades", and "Profile".',
      },
      {
        title: 'Teacher Daily Attendance App',
        scenario: 'Teacher moving through physical campus classrooms.',
        impact:
          'Quick bottom navigation between "Roster", "Attendance", "Timetable", and "Notices".',
      },
      {
        title: 'Campus Facilities Patrol',
        scenario: 'Security officer inspecting building perimeter.',
        impact:
          'Direct thumb switching between "Gate Pass", "Visitor Log", "Emergency", and "Map".',
      },
    ],
    uxPsychology: [
      {
        principle: 'Thumb-Driven Usability (Steven Hoober)',
        detail:
          'Over 75% of mobile users operate phones single-handed with one thumb; bottom positioning minimizes hand fatigue.',
      },
      {
        principle: 'Persistent Situational Orientation',
        detail:
          'Keeping the primary navigation perpetually visible ensures users never feel lost inside deep sub-views.',
      },
    ],
    usageGuidelines: [
      {
        doItem: 'Limit navigation strictly to between 3 and 5 top-level destinations.',
        dontItem: 'Include more than 5 tabs or horizontally scrollable tabs in bottom navigation.',
      },
      {
        doItem: 'Provide both an icon and a concise text label for unambiguous comprehension.',
        dontItem:
          'Use bottom navigation for transient actions like "Take Photo"—use a FAB instead.',
      },
    ],
    implementationNotes: [
      '64px fixed height with pb-safe padding to respect mobile home indicator insets.',
      'Active tab highlighted in Royal Blue (#0056FF) with bold typography and subtle surface tint.',
      'Supports numeric badge counters for unread announcements or urgent alerts.',
    ],
    codeSnippet: `import { LibraryBottomNav } from '@/features/document/components/ui-library';
import { Home, Search, Folder } from '@/components/icons';

export function Example() {
  const [tab, setTab] = React.useState('home');

  return (
    <LibraryBottomNav
      activeId={tab}
      onSelect={setTab}
      items={[
        { id: 'home', label: 'Home', icon: Home },
        { id: 'search', label: 'Search', icon: Search },
        { id: 'academics', label: 'Academics', icon: Folder },
      ]}
    />
  );
}`,
    props: [
      {
        name: 'items',
        type: 'LibraryBottomNavItem[]',
        default: '[]',
        description: 'Array of id, label, icon, and optional badge objects.',
      },
      {
        name: 'activeId',
        type: 'string',
        default: '—',
        description: 'Id of the currently active destination tab.',
      },
      {
        name: 'onSelect',
        type: '(id: string) => void',
        default: '—',
        description: 'Callback invoked when a tab is pressed.',
      },
    ],
  },
  {
    id: 'card',
    name: 'Card',
    category: 'Display',
    paradigm: 'Airbnb Paradigm',
    description: 'Structured flat container for related content.',
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
    id: 'hanging-tabs-nav',
    name: 'Hanging Tabs Nav',
    category: 'Navigation',
    paradigm: 'Trapezoid Ceiling Paradigm',
    description: 'Inverted trapezoid tabs anchored to the top header.',
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
          'Developers switch between "Open API", "Library", and "Changelog" in the top bar.',
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
    codeSnippet: `import { HangingTabsNav } from '@/features/document/components/ui-library';
import { Newspaper, Pin, FilePlus } from '@/components/icons';

export function Example() {
  const [tab, setTab] = React.useState('newswire');

  return (
    <HangingTabsNav
      activeId={tab}
      onSelect={setTab}
      size="md"
      items={[
        { id: 'map', label: 'Map', icon: Pin },
        { id: 'newswire', label: 'Newswire', icon: Newspaper },
        { id: 'post', label: 'Post', icon: FilePlus },
      ]}
    />
  );
}`,
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
    id: 'input',
    name: 'Pill Input & Search',
    category: 'Inputs',
    paradigm: 'Capsule Pill Standard',
    description: 'Rounded search and text input with inline actions.',
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
    name: 'Rail TOC (Primary)',
    category: 'Navigation',
    paradigm: 'Sticky Rail Standard',
    description: 'Vertical sticky rail track with reading progress and milestone pips.',
    explanation: 'Rail TOC anchors an interactive reading milestone track on the screen edge.',
    props: [
      { name: 'sections', type: 'Array<{id, number, title}>', description: 'List of milestones.' },
    ],
    codeSnippet: `import { RailTocDemo } from '@/features/document/components/ui-library';\n\n<RailTocDemo />`,
    realWorldExamples: [
      {
        title: 'Academic Syllabus',
        scenario: 'Students browse long course syllabi.',
        impact: 'Real-time progress.',
      },
    ],
    uxPsychology: [{ principle: "Fitts's Law", detail: 'Edge rail is easily acquired.' }],
    usageGuidelines: [{ doItem: 'Keep titles short.', dontItem: 'Avoid more than 8 sections.' }],
    implementationNotes: ['Smooth SVG vertical track with active pip.'],
    supportedStates: ['Default', 'Active', 'Hovered'],
  },
  {
    id: 'bounce-sidebar',
    name: 'Bounce Sidebar',
    category: 'Navigation',
    paradigm: 'Spring Physics Standard',
    description: 'Collapsible drawer with physics-based spring bounce transitions.',
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
    description: 'Side-anchored kinetic hook tab that slides out an operational drawer.',
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
    description: 'Expands from 48px icon rail to full sidebar when pointer nears edge.',
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
    description: 'Progress bar with chapter tick marks and remaining reading time.',
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
    description: 'Fluid liquid pill indicator that glides between active tabs.',
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

  // INPUTS GROUP
  {
    id: 'duration-picker',
    name: 'Duration Picker',
    category: 'Inputs',
    paradigm: 'Tactile Stepper Standard',
    description: 'Preset pills and fine-tuning stepper for class/meeting durations.',
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
    name: 'OTP Input',
    category: 'Inputs',
    paradigm: 'Multi-Cell 2FA Standard',
    description: '6-digit one-time code inputs with auto-advance and backspace handling.',
    explanation: 'Automates focus forwarding and backspace deletion across PIN cells.',
    props: [{ name: 'length', type: 'number', default: '6', description: 'Number of digits.' }],
    codeSnippet: `import { OtpInputDemo } from '@/features/document/components/ui-library';\n\n<OtpInputDemo />`,
    realWorldExamples: [
      {
        title: 'Account Verification',
        scenario: 'Director confirms privileged login.',
        impact: 'Zero typing friction.',
      },
    ],
    uxPsychology: [{ principle: 'Immediate Feedback', detail: 'Auto-advance signals success.' }],
    usageGuidelines: [
      { doItem: 'Handle paste event.', dontItem: 'Do not allow non-numeric input.' },
    ],
    implementationNotes: ['Ref array with auto-focus next.'],
    supportedStates: ['Incomplete', 'Valid'],
  },
  {
    id: 'password-input',
    name: 'Password Input',
    category: 'Inputs',
    paradigm: 'Strength Policy Standard',
    description: 'Password field with eye toggle, real-time meter, and criteria checklist.',
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
    description: 'Segmented visual tiles to switch between Light, Dark, and System modes.',
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
    description: 'Two-step confirmation button with cognitive friction for safe purging.',
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
    description: 'Operational checklist with animated checkmarks and inline task adding.',
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
    id: 'toast',
    name: 'Toast',
    category: 'Feedback',
    paradigm: 'Floating Stack Standard',
    description: 'Stackable micro-toasts with variant states and auto-dismiss countdown.',
    explanation: 'Transient floating alert banner notifying users of asynchronous background jobs.',
    props: [{ name: 'toasts', type: 'Array<{id, title, type}>', description: 'Toast items.' }],
    codeSnippet: `import { ToastDemo } from '@/features/document/components/ui-library';\n\n<ToastDemo />`,
    realWorldExamples: [
      {
        title: 'Background Sync',
        scenario: 'Cloud MongoDB sync completes.',
        impact: 'Non-blocking confirmation.',
      },
    ],
    uxPsychology: [
      { principle: 'Non-intrusive Alerts', detail: 'Fades away without user effort.' },
    ],
    usageGuidelines: [{ doItem: 'Auto-dismiss in 4s.', dontItem: 'Never block navigation.' }],
    implementationNotes: ['Stack array with timeout filters.'],
    supportedStates: ['Success', 'Warning', 'Info'],
  },
  {
    id: 'emoji-reaction',
    name: 'Emoji Reaction',
    category: 'Feedback',
    paradigm: 'Social Pill Paradigm',
    description: 'Tappable reaction pills with count badges and scale-pop feedback.',
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
    description: 'Animated bell with unread badge counter and instant notification dropdown.',
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
    description: 'Interactive document folder that expands to reveal inner files.',
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
    id: 'code-block',
    name: 'Code Block',
    category: 'Display',
    paradigm: 'Developer Syntax Standard',
    description: 'Dark syntax container with one-click clipboard copy and language badge.',
    explanation: 'Syntax-highlighted code container built for developer portal API schemas.',
    props: [{ name: 'code', type: 'string', description: 'Code string.' }],
    codeSnippet: `import { CodeBlockDemo } from '@/features/document/components/ui-library';\n\n<CodeBlockDemo />`,
    realWorldExamples: [
      {
        title: 'API Reference',
        scenario: 'Third-party developer copies curl command.',
        impact: '100% copy accuracy.',
      },
    ],
    uxPsychology: [{ principle: 'Efficiency of Use', detail: '1-click clipboard integration.' }],
    usageGuidelines: [
      { doItem: 'Provide copy button.', dontItem: 'Do not disable text selection.' },
    ],
    implementationNotes: ['Pre tag with copy feedback.'],
    supportedStates: ['Default', 'Copied'],
  },
  {
    id: 'gravity-letters',
    name: 'Gravity Letters',
    category: 'Display',
    paradigm: 'Physics Drop Standard',
    description: 'Newtonian physics drop simulation with ground bounce on letters.',
    explanation: 'Simulates gravitational acceleration and rotational displacement on typography.',
    props: [{ name: 'text', type: 'string', description: 'Letter string.' }],
    codeSnippet: `import { GravityLettersDemo } from '@/features/document/components/ui-library';\n\n<GravityLettersDemo />`,
    realWorldExamples: [
      {
        title: 'Interactive Title',
        scenario: 'Student touches banner on mobile portal.',
        impact: 'Playful engagement.',
      },
    ],
    uxPsychology: [{ principle: 'Tactile Delight', detail: 'Physics creates visceral reaction.' }],
    usageGuidelines: [{ doItem: 'Use on hero titles.', dontItem: 'Never use on body text.' }],
    implementationNotes: ['CSS transform with cubic bezier bounce.'],
    supportedStates: ['Resting', 'Dropped'],
  },
  {
    id: 'github-activity',
    name: 'GitHub Activity',
    category: 'Display',
    paradigm: 'Contribution Grid Standard',
    description: '52-week heat map matrix showing commit frequency and streaks.',
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
    description: 'Multi-stage stepper workflow with forward/back controls.',
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
    description: 'Rolling odometer metric counter with smooth increment animations.',
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
    description: 'Audio waveform player with animated bars and speed multipliers.',
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
    description: 'Smooth expanding Q&A accordion with rotating chevrons.',
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
      'Sticky header data table with debounced global search, tri-state column sorting, type-aware comparator, status pills, and boundary-clamped pagination.',
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
      '06 Status Pill: Colored badge with a leading dot for at-a-glance scanning of categorical values.',
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

  // AI KIT GROUP
  {
    id: 'fluid-orb',
    name: 'Fluid Orb',
    category: 'AI Kit',
    paradigm: 'Neural Luminescence Standard',
    description: 'Morphing gradient sphere with breathing glow pulse on interaction.',
    explanation: 'Luminescent morphing orb representing agentic thinking states.',
    props: [{ name: 'pulse', type: 'boolean', description: 'Pulse trigger.' }],
    codeSnippet: `import { FluidOrbDemo } from '@/features/document/components/ui-library';\n\n<FluidOrbDemo />`,
    realWorldExamples: [
      {
        title: 'AI Assistant',
        scenario: 'Student queries AI tutor for math problem.',
        impact: 'Futuristic presence.',
      },
    ],
    uxPsychology: [
      { principle: 'Anthropomorphic Feedback', detail: 'Breathing rhythm feels alive.' },
    ],
    usageGuidelines: [{ doItem: 'Use subtle glows.', dontItem: 'Avoid high-frequency strobe.' }],
    implementationNotes: ['CSS blur filters with radial gradients.'],
    supportedStates: ['Breathing', 'Active Pulse'],
  },
  {
    id: 'grid-reveal',
    name: 'Grid Reveal',
    category: 'AI Kit',
    paradigm: 'Cyber Matrix Standard',
    description: 'Matrix cards with horizontal scanning laser beam and active node highlights.',
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
    id: 'matrix-orb',
    name: 'Matrix Orb',
    category: 'AI Kit',
    paradigm: 'Cybernetic Telemetry Standard',
    description: 'Rotating concentric particle telemetry orb with live status readouts.',
    explanation: 'Cybernetic orb with dual rotating rings and telemetry readout.',
    props: [{ name: 'online', type: 'boolean', description: 'System health state.' }],
    codeSnippet: `import { MatrixOrbDemo } from '@/features/document/components/ui-library';\n\n<MatrixOrbDemo />`,
    realWorldExamples: [
      {
        title: 'Campus Security AI',
        scenario: 'Operator monitors AI automated gate checks.',
        impact: 'Immediate health check.',
      },
    ],
    uxPsychology: [{ principle: 'Visual Anchor', detail: 'Rotating geometry indicates health.' }],
    usageGuidelines: [
      { doItem: 'Show clear uptime percentage.', dontItem: 'Never hide downtime.' },
    ],
    implementationNotes: ['Concentric rotating border rings.'],
    supportedStates: ['Online', 'Standby'],
  },
  {
    id: 'web-search',
    name: 'Web Search',
    category: 'AI Kit',
    paradigm: 'Agentic Crawl Standard',
    description: 'Search bar with live regulatory sources citation chips.',
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
  {
    id: 'inline-ai-status',
    name: 'Inline AI Status',
    category: 'AI Kit',
    paradigm: 'Live Stream Pill Standard',
    description: 'Streaming status pill indicating real-time agent execution states.',
    explanation: 'Compact inline telemetry pill communicating autonomous sub-agent progress.',
    props: [{ name: 'step', type: 'number', description: 'Active agent phase.' }],
    codeSnippet: `import { InlineAiStatusDemo } from '@/features/document/components/ui-library';\n\n<InlineAiStatusDemo />`,
    realWorldExamples: [
      {
        title: 'Database Migration',
        scenario: 'System runs 52-collection tenant migration.',
        impact: 'Step-by-step transparency.',
      },
    ],
    uxPsychology: [
      {
        principle: 'Visibility of System Status',
        detail: 'Informs user of exact background phase.',
      },
    ],
    usageGuidelines: [
      { doItem: 'Use ping animation.', dontItem: 'Do not use ambiguous loading text.' },
    ],
    implementationNotes: ['Pill with animated ping dot.'],
    supportedStates: ['Thinking', 'Querying', 'Synthesizing', 'Complete'],
  },
  // ==========================================
  // NAVIGATION (Rare UI Floating Dock)
  // ==========================================
  {
    id: 'capsule-dock-nav',
    name: 'Navigation Menu (Rare UI Floating Dock)',
    category: 'Navigation',
    paradigm: 'Floating 3-Island Mega Menu Standard',
    description:
      'Floating 3-island header with brand pill, links pill opening mega menu panels with glyphs & summaries, and GitHub stars pill with theme circle.',
    explanation:
      'Site headers whose top level items open panels of links in a shared animated viewport. Features columns with summaries, glyphs, and a call-to-action button, mixing panel triggers with plain links.',
    props: [
      {
        name: 'viewport',
        type: 'boolean',
        description: 'Enable shared NavigationMenuViewport animation.',
      },
      { name: 'asChild', type: 'boolean', description: 'Radix twin anchor delegation.' },
      {
        name: 'render',
        type: '(props) => ReactNode',
        description: 'Base twin render prop delegation.',
      },
    ],
    codeSnippet: `import { RareUiNavigationMenu, NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from '@/features/document/components/ui-library';\n\n{/* Full 3-Island Rare UI Navigation Menu */}\n<RareUiNavigationMenu />`,
    realWorldExamples: [
      {
        title: 'Site Header Mega Panels',
        scenario: 'Top level items open panels of links for docs and components.',
        impact: 'Uncluttered scannability.',
      },
      {
        title: 'Columns with Summaries & Glyphs',
        scenario: 'Mega menu organizes featured items with glyphs and CTA button.',
        impact: 'High conversion.',
      },
    ],
    uxPsychology: [
      {
        principle: "Fitts's Law 3-Island Dock",
        detail: 'Centralized floating islands reduce eye travel distance.',
      },
      {
        principle: 'Progressive Disclosure',
        detail: 'Mega panels expand only on focused intent with zero visual clutter.',
      },
    ],
    usageGuidelines: [
      {
        doItem:
          'When to use: Site headers whose top level items open panels of links (docs, components, industry pages).',
        dontItem:
          'When not to use: Actions on the current page (edit, share, sign out): use Dropdown Menu.',
      },
      {
        doItem:
          'When to use: Mega menu panels laying out links with summaries in columns, glyphs, and a call to action button.',
        dontItem:
          'When not to use: Sections of a signed in app along the screen edge: use Sidebar.',
      },
      {
        doItem:
          'When to use: Header rows mixing panel triggers with plain top level links styled to match them.',
        dontItem:
          'When not to use: Complete pre-placed header with logo and Get Started button: use Navbar blocks.',
      },
    ],
    implementationNotes: [
      'NavigationMenuLink takes its anchor through render on the base twin and asChild on the radix twin; neither twin reads the other prop.',
      'Every href is a hash placeholder; point each NavigationMenuLink at a real route through your router link.',
      'The radix NavigationMenu opens panels in a shared NavigationMenuViewport unless viewport is false; base uses align.',
      'Floating 3-island architecture: [ 🌸 Rare UI ] (Left), [ Home | Components (Mega Menu) | Sponsors ] (Center), [ 🐙 1866 ] + [ 🌓 ] (Right).',
    ],
    supportedStates: ['Default', 'Mega Menu Active', 'Starred', 'Dark / Light'],
  },
  // ==========================================
  // BACKGROUNDS
  // ==========================================
  {
    id: 'dot-pattern',
    name: 'Dot Pattern',
    category: 'Backgrounds',
    paradigm: 'SVG Radial Grid Standard',
    description: 'Interactive dot matrix canvas with customizable radial size and pitch.',
    explanation: 'Mathematical radial dot grid providing structural depth for canvas cards.',
    props: [{ name: 'spacing', type: 'number', description: 'Distance between dots in px.' }],
    codeSnippet: `import { DotPatternDemo } from '@/features/document/components/ui-library';\n\n<DotPatternDemo />`,
    realWorldExamples: [
      {
        title: 'Admissions Canvas',
        scenario: 'Applicant reviews admission roadmap.',
        impact: 'Structured canvas texture.',
      },
    ],
    uxPsychology: [
      { principle: 'Subtle Grounding', detail: 'Dots ground floating cards without visual noise.' },
    ],
    usageGuidelines: [
      { doItem: 'Keep opacity under 40%.', dontItem: 'Never use dark opaque dots on white.' },
    ],
    implementationNotes: ['CSS radial-gradient pattern.'],
    supportedStates: ['Default', 'Dense', 'Spaced'],
  },
  {
    id: 'retro-grid',
    name: 'Retro Grid',
    category: 'Backgrounds',
    paradigm: 'Perspective 3D Plane Standard',
    description: 'Perspective cyber grid plane with gradient horizon falloff.',
    explanation: 'Isometric 3D grid evoking modern developer retro-futuristic dashboards.',
    props: [{ name: 'perspective', type: 'boolean', description: 'Enable 3D X-axis tilt.' }],
    codeSnippet: `import { RetroGridDemo } from '@/features/document/components/ui-library';\n\n<RetroGridDemo />`,
    realWorldExamples: [
      {
        title: 'Developer Portal Hero',
        scenario: 'API consumer lands on developer docs.',
        impact: 'High-tech aesthetic.',
      },
    ],
    uxPsychology: [
      { principle: 'Linear Perspective', detail: 'Creates illusion of infinite depth.' },
    ],
    usageGuidelines: [
      { doItem: 'Pair with subtle top horizon glow.', dontItem: 'Do not obscure core text.' },
    ],
    implementationNotes: ['CSS rotateX(60deg) grid plane.'],
    supportedStates: ['3D Active', '2D Flat'],
  },
  {
    id: 'aurora-waves',
    name: 'Aurora Waves',
    category: 'Backgrounds',
    paradigm: 'Luminescent Gaussian Mesh Standard',
    description: 'Morphing ambient glowing gradient mesh for hero presentation stages.',
    explanation: 'Multi-blob blurred radial gradients simulating atmospheric northern lights.',
    props: [{ name: 'pulse', type: 'boolean', description: 'Animate scale and opacity.' }],
    codeSnippet: `import { AuroraWavesDemo } from '@/features/document/components/ui-library';\n\n<AuroraWavesDemo />`,
    realWorldExamples: [
      {
        title: 'Executive Dashboard',
        scenario: 'Rector views annual KPI summary.',
        impact: 'Premium aesthetic.',
      },
    ],
    uxPsychology: [
      { principle: 'Aesthetic Usability', detail: 'Ambient glow increases perceived value.' },
    ],
    usageGuidelines: [
      { doItem: 'Use 60px+ blur radius.', dontItem: 'Never use high contrast unblurred colors.' },
    ],
    implementationNotes: ['Blur-3xl radial blobs.'],
    supportedStates: ['Calm', 'Pulse'],
  },
  {
    id: 'interactive-particles',
    name: 'Interactive Particles',
    category: 'Backgrounds',
    paradigm: 'Constellation Mesh Standard',
    description: 'Zero-overhead CSS keyframe floating nodes for technical dashboards.',
    explanation: 'Discrete node constellation providing subtle organic activity.',
    props: [{ name: 'count', type: 'number', description: 'Number of floating nodes.' }],
    codeSnippet: `import { InteractiveParticlesDemo } from '@/features/document/components/ui-library';\n\n<InteractiveParticlesDemo />`,
    realWorldExamples: [
      {
        title: 'System Telemetry',
        scenario: 'Admin monitors active microservice pods.',
        impact: 'Conveys live system state.',
      },
    ],
    uxPsychology: [
      { principle: 'Organic Motion', detail: 'Gentle pulsing conveys live connectivity.' },
    ],
    usageGuidelines: [
      { doItem: 'Limit to 32 nodes for performance.', dontItem: 'Avoid fast flickering.' },
    ],
    implementationNotes: ['Absolute positioned nodes with CSS pulse.'],
    supportedStates: ['16 Nodes', '32 Nodes'],
  },
  // ==========================================
  // TEXT EFFECTS
  // ==========================================
  {
    id: 'text-shimmer',
    name: 'Text Shimmer',
    category: 'Text Effects',
    paradigm: 'Gradient Wipe Keyframe Standard',
    description: 'Animated gradient shine passing across typographic text.',
    explanation: 'Dynamic linear background-clip animation drawing attention to key titles.',
    props: [{ name: 'speed', type: 'string', description: 'Shimmer speed preset.' }],
    codeSnippet: `import { TextShimmerDemo } from '@/features/document/components/ui-library';\n\n<TextShimmerDemo />`,
    realWorldExamples: [
      {
        title: 'Hero Headline',
        scenario: 'Landing page title introduces new campus launch.',
        impact: 'Eye-catching focal point.',
      },
    ],
    uxPsychology: [
      { principle: 'Visual Saliency', detail: 'Motion captures user visual focus within 200ms.' },
    ],
    usageGuidelines: [
      { doItem: 'Use subtle contrast sweep.', dontItem: 'Do not use jarring rainbow gradients.' },
    ],
    implementationNotes: ['background-clip: text with background-position animation.'],
    supportedStates: ['Normal', 'Fast'],
  },
  {
    id: 'number-ticker',
    name: 'Number Ticker',
    category: 'Text Effects',
    paradigm: 'Tabular Digit Odometer Standard',
    description: 'High-precision tabular digit odometer ticker for telemetry readouts.',
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
    description: 'Hover to trigger chromatic RGB split aberration with zero script overhead.',
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
    description: 'Cinematic Gaussian blur to sharp focus entrance for hero statements.',
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
  // ==========================================
  // CARDS
  // ==========================================
  {
    id: 'spotlight-card',
    name: 'Spotlight Card',
    category: 'Cards',
    paradigm: 'Radial Ray Illumination Standard',
    description: 'Mouse-following radial gradient layer illuminating mathematical borders.',
    explanation: 'Card surface tracking cursor coordinates to render dynamic radial spotlight.',
    props: [{ name: 'radius', type: 'number', description: 'Spotlight radius in px.' }],
    codeSnippet: `import { SpotlightCardDemo } from '@/features/document/components/ui-library';\n\n<SpotlightCardDemo />`,
    realWorldExamples: [
      {
        title: 'Featured Course',
        scenario: 'Prospective student hovers over degree program.',
        impact: 'Fluid spotlight highlight.',
      },
    ],
    uxPsychology: [
      { principle: 'Feedback Loop', detail: 'Follows cursor to confirm interactive affordance.' },
    ],
    usageGuidelines: [
      { doItem: 'Use subtle radial alpha.', dontItem: 'Do not overpower card text.' },
    ],
    implementationNotes: ['Mouse event tracking with radial-gradient layer.'],
    supportedStates: ['Resting', 'Hover Spotlight'],
  },
  {
    id: 'bento-card',
    name: 'Bento Grid Card',
    category: 'Cards',
    paradigm: 'Modular Container Standard',
    description: 'Apple-style modular bento card with icon badge and metric highlight.',
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
    description: 'Smooth CSS 3D pitch and yaw rotation driven by mouse vector coordinates.',
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
    id: 'border-beam',
    name: 'Border Beam Card',
    category: 'Cards',
    paradigm: 'Instrument Panel & 4-Dash SVG Physics',
    description:
      'Matte graphite card with one short amber beam tracing its perimeter at constant speed. Quiet until you look at it; hover to brighten.',
    explanation:
      'Constructed from four stacked SVG dashes on a single pathLength="100" path so the head always leads the tail and speed never changes at the corners. Features instrument-panel telemetry, tabular numerals, and document brand palette.',
    props: [
      {
        name: 'color',
        type: "'amber' | 'blue' | 'emerald' | 'rose'",
        description: 'Beam color token (amber default or docs royal blue).',
      },
      {
        name: 'duration',
        type: 'number',
        description: 'Seconds per perimeter loop (default: 7s constant velocity).',
      },
      {
        name: 'onAuthenticate',
        type: '(role, id) => void',
        description: 'Authentication callback for Login mode.',
      },
    ],
    codeSnippet: `import { BorderBeamLoginCard, BorderBeamPricingCard } from '@/features/document/components/ui-library';\n\n{/* Instrument Login Card */}\n<BorderBeamLoginCard color="amber" duration={7} />\n\n{/* Instrument Pricing Card */}\n<BorderBeamPricingCard color="amber" duration={7} />`,
    realWorldExamples: [
      {
        title: 'Operator Zero-Trust Gateway',
        scenario: 'Admin authenticates session into cluster terminal.',
        impact: 'Uncompromising instrument precision.',
      },
      {
        title: 'Cluster Infrastructure Tier',
        scenario: 'Institutions evaluate high-throughput dedicated nodes.',
        impact: 'Quiet, premium visual signature.',
      },
    ],
    uxPsychology: [
      {
        principle: 'Preattentive Attention',
        detail:
          'The quiet beam sits below distraction threshold until focused, whereupon it brightens to guide intent.',
      },
      {
        principle: 'Perceptual Constancy',
        detail:
          'Single path length normalization preserves linear speed through 24px rounded corners.',
      },
    ],
    usageGuidelines: [
      {
        doItem: 'Pair with matte graphite (#0B0F17) and hairline borders.',
        dontItem: 'Do not use uneven multi-path gradients that accelerate around corners.',
      },
    ],
    implementationNotes: [
      'Four stacked SVG dashes on single continuous rect with pathLength="100".',
      'Dash 1: Incandescent core tip (2% arc, strokeWidth 1.5).',
      'Dash 2: Saturated body beam (6% arc, strokeWidth 2.5).',
      'Dash 3: Trailing tail glow (12% arc, strokeWidth 4).',
      'Dash 4: Blurred ambient aura (20% arc, feGaussianBlur).',
      'CSS linear keyframes from stroke-dashoffset 0 to -100.',
    ],
    supportedStates: ['Quiet (35%)', 'Hovered (100%)', 'Amber Beam', 'Docs Blue Beam'],
  },
  // ==========================================
  // SECTIONS
  // ==========================================
  {
    id: 'hero-section',
    name: 'Hero Section',
    category: 'Sections',
    paradigm: 'Monumental Hero Standard',
    description: 'Monumental typographic hero with release badge and twin CTA buttons.',
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
    name: 'Feature Bento Section',
    category: 'Sections',
    paradigm: '3-Pillar Architecture Standard',
    description: 'Three-pillar modular feature showcase with numeric indicators.',
    explanation: 'Clean horizontal bento section grouping system capabilities.',
    props: [{ name: 'columns', type: 'number', description: 'Grid columns.' }],
    codeSnippet: `import { FeatureBentoDemo } from '@/features/document/components/ui-library';\n\n<FeatureBentoDemo />`,
    realWorldExamples: [
      {
        title: 'Product Overview',
        scenario: 'School board reviews system modules.',
        impact: 'Scannable benefits.',
      },
    ],
    uxPsychology: [
      { principle: 'Rule of Threes', detail: 'Trio of cards is proven most memorable.' },
    ],
    usageGuidelines: [
      { doItem: 'Keep text under 2 lines per card.', dontItem: 'Avoid uneven card heights.' },
    ],
    implementationNotes: ['Responsive grid with sm:grid-cols-3.'],
    supportedStates: ['Default', 'Selected'],
  },
  {
    id: 'pricing-matrix',
    name: 'Pricing Matrix Section',
    category: 'Sections',
    paradigm: 'SaaS License Switcher Standard',
    description: 'Monthly and Yearly toggle with standard and enterprise tiers.',
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
    description: 'Continuous horizontal partner ticker with scroll pause.',
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
    description: 'Material-style animated label transition adhering to 44px hit standards.',
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
    name: 'Multi-Step Wizard',
    category: 'Forms',
    paradigm: 'Progressive Disclosure Wizard Standard',
    description: 'Interactive 3-stage enrollment wizard with numeric breadcrumbs.',
    explanation: 'Divides lengthy enrollment questionnaires into 3 manageable stages.',
    props: [{ name: 'step', type: 'number', description: 'Active step 1-3.' }],
    codeSnippet: `import { MultiStepWizardDemo } from '@/features/document/components/ui-library';\n\n<MultiStepWizardDemo />`,
    realWorldExamples: [
      {
        title: 'Admissions Application',
        scenario: 'Applicant completes profile, guardian, and documents.',
        impact: 'Drastically lowers drop-off.',
      },
    ],
    uxPsychology: [
      {
        principle: "Hick's Law",
        detail: 'Breaking 20 fields into 3 steps prevents cognitive overload.',
      },
    ],
    usageGuidelines: [
      { doItem: 'Allow navigating back.', dontItem: 'Never discard entered data on back step.' },
    ],
    implementationNotes: ['Step indicator with previous/next controls.'],
    supportedStates: ['Step 1', 'Step 2', 'Step 3'],
  },
  {
    id: 'file-dropzone',
    name: 'File Dropzone',
    category: 'Forms',
    paradigm: 'Dashed Target Dropzone Standard',
    description: 'Drag-and-drop file upload target with file verification badges.',
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
    description: 'Credit card input with live holographic 3D card preview.',
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
  // ==========================================
  // OVERLAYS
  // ==========================================
  {
    id: 'command-palette',
    name: 'Command Palette KBD',
    category: 'Overlays',
    paradigm: 'Global Spotlight Search Standard',
    description: 'Command palette modal with search input, keyboard shortcuts, and action items.',
    explanation: 'Power-user search interface triggered via Cmd+K for zero-mouse operations.',
    props: [{ name: 'open', type: 'boolean', description: 'Dialog presence state.' }],
    codeSnippet: `import { CommandPaletteDemo } from '@/features/document/components/ui-library';\n\n<CommandPaletteDemo />`,
    realWorldExamples: [
      {
        title: 'Power User Dispatch',
        scenario: 'Principal presses Cmd+K to jump to staff record.',
        impact: 'Sub-second navigation.',
      },
    ],
    uxPsychology: [
      {
        principle: 'Doherty Threshold',
        detail: 'Instant command search sustains user flow state.',
      },
    ],
    usageGuidelines: [
      {
        doItem: 'Provide prominent keyboard shortcuts.',
        dontItem: 'Do not require mouse clicking.',
      },
    ],
    implementationNotes: ['Floating search list with kbd badge.'],
    supportedStates: ['Closed', 'Open with Suggestions'],
  },
  {
    id: 'confetti-cannon',
    name: 'Confetti Cannon',
    category: 'Overlays',
    paradigm: 'Celebration Particle Burst Standard',
    description: 'Interactive celebratory particle burst simulation on task completion.',
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
    description: 'Slide-over edge inspector sheet with backdrop blur and close controls.',
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
    description: 'Interactive image zoom lightbox modal with thumbnail transition.',
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
