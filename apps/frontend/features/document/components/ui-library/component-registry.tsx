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
    props: [{ name: 'sections', type: 'Array<{id, number, title}>', description: 'List of milestones.' }],
    codeSnippet: `import { RailTocDemo } from '@/features/document/components/ui-library';\n\n<RailTocDemo />`,
    realWorldExamples: [{ title: 'Academic Syllabus', scenario: 'Students browse long course syllabi.', impact: 'Real-time progress.' }],
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
    realWorldExamples: [{ title: 'Workspace Nav', scenario: 'Teachers collapse the sidebar.', impact: 'Fluid feedback.' }],
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
    realWorldExamples: [{ title: 'Quick Ledger', scenario: 'Accountant peeks at daily ledger.', impact: 'Preserves context.' }],
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
    realWorldExamples: [{ title: 'Power User Nav', scenario: 'Staff navigates multi-branch tools.', impact: 'Maximum canvas area.' }],
    uxPsychology: [{ principle: 'Hick’s Law', detail: 'Keeps main viewport uncluttered.' }],
    usageGuidelines: [{ doItem: 'Smooth width transitions.', dontItem: 'Avoid abrupt layout shifts.' }],
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
    realWorldExamples: [{ title: 'Curriculum Reading', scenario: 'Student studies exam regulations.', impact: 'Clear completion signal.' }],
    uxPsychology: [{ principle: 'Goal Gradient Effect', detail: 'Accelerates completion motivation.' }],
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
    realWorldExamples: [{ title: 'Period Switcher', scenario: 'Registrar toggles Day/Week view.', impact: 'Delightful fluidity.' }],
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
    realWorldExamples: [{ title: 'Class Scheduling', scenario: 'Academic coordinator sets period length.', impact: 'One-tap presets.' }],
    uxPsychology: [{ principle: "Miller's Law", detail: 'Pre-chunked duration values.' }],
    usageGuidelines: [{ doItem: 'Provide common increments.', dontItem: 'Avoid freeform typing only.' }],
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
    realWorldExamples: [{ title: 'Account Verification', scenario: 'Director confirms privileged login.', impact: 'Zero typing friction.' }],
    uxPsychology: [{ principle: 'Immediate Feedback', detail: 'Auto-advance signals success.' }],
    usageGuidelines: [{ doItem: 'Handle paste event.', dontItem: 'Do not allow non-numeric input.' }],
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
    realWorldExamples: [{ title: 'Staff Onboarding', scenario: 'HR registers new employee credentials.', impact: 'Enforces security.' }],
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
    realWorldExamples: [{ title: 'User Preferences', scenario: 'Teacher selects dark mode.', impact: 'Instant tactile switch.' }],
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
    realWorldExamples: [{ title: 'Record Purge', scenario: 'Registrar deletes draft certificate.', impact: 'Zero accidental clicks.' }],
    uxPsychology: [{ principle: 'Error Prevention', detail: 'Two-step confirmation prevents slips.' }],
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
    realWorldExamples: [{ title: 'Campus Checklist', scenario: 'Branch manager completes daily opening tasks.', impact: 'Structured verification.' }],
    uxPsychology: [{ principle: 'Zeigarnik Effect', detail: 'Incomplete tasks drive completion.' }],
    usageGuidelines: [{ doItem: 'Strike through completed.', dontItem: 'Do not remove completed items immediately.' }],
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
    realWorldExamples: [{ title: 'Background Sync', scenario: 'Cloud MongoDB sync completes.', impact: 'Non-blocking confirmation.' }],
    uxPsychology: [{ principle: 'Non-intrusive Alerts', detail: 'Fades away without user effort.' }],
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
    realWorldExamples: [{ title: 'School Announcement', scenario: 'Parents react to sports day notice.', impact: 'High community engagement.' }],
    uxPsychology: [{ principle: 'Social Proof', detail: 'Visible counters validate shared sentiments.' }],
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
    props: [{ name: 'unreadCount', type: 'number', description: 'Number of unread notifications.' }],
    codeSnippet: `import { NotificationBellDemo } from '@/features/document/components/ui-library';\n\n<NotificationBellDemo />`,
    realWorldExamples: [{ title: 'Institutional Alerts', scenario: 'Teachers check daily attendance alerts.', impact: 'Zero missed notices.' }],
    uxPsychology: [{ principle: 'Attention Guidance', detail: 'Bright badge draws eye.' }],
    usageGuidelines: [{ doItem: 'Clear unread on open.', dontItem: 'Avoid loud persistent badges.' }],
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
    realWorldExamples: [{ title: 'Student Dossier', scenario: 'Admissions staff inspects identity files.', impact: 'Neat visual chunking.' }],
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
    realWorldExamples: [{ title: 'API Reference', scenario: 'Third-party developer copies curl command.', impact: '100% copy accuracy.' }],
    uxPsychology: [{ principle: 'Efficiency of Use', detail: '1-click clipboard integration.' }],
    usageGuidelines: [{ doItem: 'Provide copy button.', dontItem: 'Do not disable text selection.' }],
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
    realWorldExamples: [{ title: 'Interactive Title', scenario: 'Student touches banner on mobile portal.', impact: 'Playful engagement.' }],
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
    realWorldExamples: [{ title: 'Dev Portal Telemetry', scenario: 'Auditor verifies continuous deployment.', impact: 'Visible momentum.' }],
    uxPsychology: [{ principle: 'Streaks & Consistency', detail: 'Visual green blocks inspire progress.' }],
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
    realWorldExamples: [{ title: 'Student Enrollment', scenario: 'Registrar steps through admission stages.', impact: 'Zero skipped steps.' }],
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
    realWorldExamples: [{ title: 'Campus Dashboard', scenario: 'Director views live student enrollment totals.', impact: 'Live dynamism.' }],
    uxPsychology: [{ principle: 'Visual Salience', detail: 'Moving numbers convey live vitality.' }],
    usageGuidelines: [{ doItem: 'Format with commas.', dontItem: 'Avoid rapid flashing counters.' }],
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
    realWorldExamples: [{ title: 'Parent Communication', scenario: 'Teacher sends audio update on student progress.', impact: 'Personal connection.' }],
    uxPsychology: [{ principle: 'Multimodal Feedback', detail: 'Visual waveform confirms audio content.' }],
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
    realWorldExamples: [{ title: 'Help Portal', scenario: 'Students find tuition payment methods.', impact: 'Reduced support tickets.' }],
    uxPsychology: [{ principle: 'Progressive Disclosure', detail: 'Shows questions first, answers on demand.' }],
    usageGuidelines: [{ doItem: 'Collapse other items.', dontItem: 'Do not hide critical links inside FAQs.' }],
    implementationNotes: ['Smooth height transition with rotating icon.'],
    supportedStates: ['Collapsed', 'Expanded'],
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
    realWorldExamples: [{ title: 'AI Assistant', scenario: 'Student queries AI tutor for math problem.', impact: 'Futuristic presence.' }],
    uxPsychology: [{ principle: 'Anthropomorphic Feedback', detail: 'Breathing rhythm feels alive.' }],
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
    realWorldExamples: [{ title: 'Autonomous Agent Monitor', scenario: 'Admin monitors background reconciliation agents.', impact: 'Real-time confidence.' }],
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
    realWorldExamples: [{ title: 'Campus Security AI', scenario: 'Operator monitors AI automated gate checks.', impact: 'Immediate health check.' }],
    uxPsychology: [{ principle: 'Visual Anchor', detail: 'Rotating geometry indicates health.' }],
    usageGuidelines: [{ doItem: 'Show clear uptime percentage.', dontItem: 'Never hide downtime.' }],
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
    realWorldExamples: [{ title: 'Regulatory Search', scenario: 'Academic dean searches ministry accreditation decrees.', impact: 'Cited references.' }],
    uxPsychology: [{ principle: 'Source Verifiability', detail: 'Chips validate answer truth.' }],
    usageGuidelines: [{ doItem: 'Display domain badges.', dontItem: 'Never show unverified citations.' }],
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
    realWorldExamples: [{ title: 'Database Migration', scenario: 'System runs 52-collection tenant migration.', impact: 'Step-by-step transparency.' }],
    uxPsychology: [{ principle: 'Visibility of System Status', detail: 'Informs user of exact background phase.' }],
    usageGuidelines: [{ doItem: 'Use ping animation.', dontItem: 'Do not use ambiguous loading text.' }],
    implementationNotes: ['Pill with animated ping dot.'],
    supportedStates: ['Thinking', 'Querying', 'Synthesizing', 'Complete'],
  },
];
