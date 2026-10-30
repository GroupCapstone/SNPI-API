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
  'Feedback & Overlays',
  'Actions',
  'Selection',
  'Navigation',
  'Layout & Containers',
] as const;

export type ComponentCategory = (typeof COMPONENT_CATEGORIES)[number];

export const COMPONENT_LIBRARY_REGISTRY: ComponentItemDoc[] = [
  {
    id: 'snackbar',
    name: 'Snackbar',
    category: 'Feedback & Overlays',
    paradigm: 'Gmail Paradigm',
    description:
      'A small message that pops up at the bottom of the screen to confirm an action, then automatically fades away after a duration. Supports an optional instant Undo action.',
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
    category: 'Feedback & Overlays',
    paradigm: 'Google Maps Paradigm',
    description:
      'A panel that slides up from the bottom edge to display supplementary details, action options, or forms without navigating away from the current view.',
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
    category: 'Feedback & Overlays',
    paradigm: 'WhatsApp Paradigm',
    description:
      'A modal interruption that pauses user workflow to confirm high-risk, destructive, or important decisions before changes take effect.',
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
    category: 'Feedback & Overlays',
    paradigm: 'Figma Paradigm',
    description:
      'A tiny label that appears when you hover or focus on an element, explaining what it does and displaying keyboard shortcuts.',
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
    category: 'Actions',
    paradigm: 'Google Calendar Paradigm',
    description:
      'Floating action button: a prominent round button representing the single primary action on a screen, anchored within thumb reach.',
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
    category: 'Selection',
    paradigm: 'YouTube Paradigm',
    description:
      'Small tappable tags used to filter data catalogs, select options, or represent entered entities with full capsule pill geometry.',
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
    category: 'Selection',
    paradigm: 'iPhone Settings Paradigm',
    description:
      'An instant on/off control modeled after physical wall rocker switches that applies state changes immediately without a separate Save step.',
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
    category: 'Selection',
    paradigm: 'Google Docs Paradigm',
    description:
      'A compact menu button that unfolds a list of choices like a roller blind, conserving screen space until active selection begins.',
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
    description:
      'A persistent horizontal navigation bar anchored to the bottom edge of mobile viewports for thumb-driven switching between 3 to 5 destinations.',
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
    category: 'Layout & Containers',
    paradigm: 'Airbnb Paradigm',
    description:
      'A modular surface container that binds heterogeneous data elements into a single scannable, cohesive, and interactive rectangular unit.',
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
    description:
      'Inverted trapezoid folder tabs suspended from the header ceiling, built with smooth vector SVG geometry, continuous non-scaling strokes, and clean centered alignment.',
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
    category: 'Actions',
    paradigm: 'Capsule Pill Standard',
    description:
      'Capsule pill text input and search bar with continuous 2px border, rounded-full geometry, clean inline icon, clear button, and primary brand color integration.',
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
];
