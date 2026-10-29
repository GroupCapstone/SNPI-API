import * as React from 'react';

export interface ComponentPropDoc {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface ComponentItemDoc {
  id: string;
  name: string;
  category: string;
  description: string;
  paradigm: string;
  props: ComponentPropDoc[];
  codeSnippet: string;
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
    codeSnippet: `import { LibrarySnackbar } from '@/features/document/components/ui-library';

export function Example() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Archive Thread</button>
      <LibrarySnackbar
        open={open}
        message="Thread archived."
        actionLabel="Undo"
        onAction={() => alert('Undone!')}
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
    codeSnippet: `import { LibraryBottomSheet } from '@/features/document/components/ui-library';

export function Example() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>View Location Details</button>
      <LibraryBottomSheet
        open={open}
        title="Siem Reap Central Campus"
        onClose={() => setOpen(false)}
      >
        <p>Campus details, room capacities, and directions.</p>
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
    codeSnippet: `import { LibraryDialog } from '@/features/document/components/ui-library';

export function Example() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Delete Record</button>
      <LibraryDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete enrollment record?"
        description="This action cannot be reversed."
        confirmLabel="Delete Record"
        cancelLabel="Cancel"
        isDestructive
        onConfirm={() => console.log('Deleted')}
      />
    </>
  );
}`,
    props: [
      {
        name: 'open',
        type: 'boolean',
        default: 'false',
        description: 'Controls modal visibility.',
      },
      {
        name: 'onOpenChange',
        type: '(open: boolean) => void',
        default: '—',
        description: 'State change handler for open/closed states.',
      },
      { name: 'title', type: 'string', default: '—', description: 'Dialog header title.' },
      {
        name: 'description',
        type: 'string',
        default: '—',
        description: 'Supporting explanatory text.',
      },
      {
        name: 'confirmLabel',
        type: 'string',
        default: "'Confirm'",
        description: 'Label for the primary affirmation button.',
      },
      {
        name: 'cancelLabel',
        type: 'string',
        default: "'Cancel'",
        description: 'Label for the dismissal button.',
      },
      {
        name: 'isDestructive',
        type: 'boolean',
        default: 'false',
        description: 'Styles the primary action in danger red.',
      },
      {
        name: 'onConfirm',
        type: '() => void',
        default: '—',
        description: 'Callback invoked when confirmation button is pressed.',
      },
    ],
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    category: 'Feedback & Overlays',
    paradigm: 'Figma Paradigm',
    description:
      'A compact label that appears upon mouse hover or keyboard focus, providing micro-copy guidance and keyboard shortcut bindings.',
    codeSnippet: `import { LibraryTooltip } from '@/features/document/components/ui-library';

export function Example() {
  return (
    <LibraryTooltip content="Move tool" shortcut="V" position="top">
      <button className="h-10 w-10 border rounded-lg">V</button>
    </LibraryTooltip>
  );
}`,
    props: [
      {
        name: 'content',
        type: 'React.ReactNode',
        default: '—',
        description: 'Label text or node displayed inside tooltip.',
      },
      {
        name: 'shortcut',
        type: 'string',
        default: '—',
        description: 'Optional keyboard shortcut rendered in kbd badge.',
      },
      {
        name: 'position',
        type: "'top' | 'bottom' | 'left' | 'right'",
        default: "'top'",
        description: 'Orientation relative to target element.',
      },
      {
        name: 'delayMs',
        type: 'number',
        default: '200',
        description: 'Hover delay in milliseconds before appearance.',
      },
      {
        name: 'children',
        type: 'React.ReactElement',
        default: '—',
        description: 'Target element wrapped by tooltip.',
      },
    ],
  },
  {
    id: 'fab',
    name: 'FAB (Floating Action Button)',
    category: 'Actions',
    paradigm: 'Google Calendar Paradigm',
    description:
      'A primary circular or pill-shaped floating action button representing the single most critical or common action on a screen.',
    codeSnippet: `import { LibraryFab } from '@/features/document/components/ui-library';
import { Plus } from '@/components/icons';

export function Example() {
  return (
    <div className="flex gap-4">
      <LibraryFab icon={<Plus className="h-5 w-5" />} />
      <LibraryFab variant="secondary" label="New Event" icon={<Plus className="h-4 w-4" />} />
    </div>
  );
}`,
    props: [
      {
        name: 'icon',
        type: 'React.ReactNode',
        default: '<Plus />',
        description: 'Center icon element.',
      },
      {
        name: 'label',
        type: 'string',
        default: '—',
        description: 'Optional label making it an Extended FAB pill.',
      },
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'surface'",
        default: "'primary'",
        description: 'Visual appearance variant.',
      },
      {
        name: 'size',
        type: "'default' | 'small'",
        default: "'default'",
        description: 'Standard 48px or compact 40px dimensions.',
      },
    ],
  },
  {
    id: 'chip',
    name: 'Chip',
    category: 'Actions',
    paradigm: 'YouTube Paradigm',
    description:
      'Compact, interactive filter pills used to select categories, toggle options, or display removable active query parameters.',
    codeSnippet: `import { LibraryChip } from '@/features/document/components/ui-library';

export function Example() {
  const [active, setActive] = React.useState(false);

  return (
    <LibraryChip
      active={active}
      onClick={() => setActive(!active)}
      onDismiss={() => alert('Removed')}
    >
      Academics
    </LibraryChip>
  );
}`,
    props: [
      {
        name: 'active',
        type: 'boolean',
        default: 'false',
        description: 'Whether the chip is currently selected/active.',
      },
      {
        name: 'icon',
        type: 'React.ReactNode',
        default: '—',
        description: 'Leading icon displayed before the label.',
      },
      {
        name: 'onDismiss',
        type: '() => void',
        default: '—',
        description: 'When provided, renders a dismiss (X) button.',
      },
      {
        name: 'children',
        type: 'React.ReactNode',
        default: '—',
        description: 'Chip text or node content.',
      },
    ],
  },
  {
    id: 'switch',
    name: 'Toggle Switch',
    category: 'Selection',
    paradigm: 'iPhone Settings Paradigm',
    description:
      'A binary control that flips between on and off states immediately without requiring an additional submission step.',
    codeSnippet: `import { LibrarySwitch } from '@/features/document/components/ui-library';

export function Example() {
  const [checked, setChecked] = React.useState(false);

  return (
    <div className="flex items-center justify-between">
      <span>Airplane Mode</span>
      <LibrarySwitch checked={checked} onCheckedChange={setChecked} />
    </div>
  );
}`,
    props: [
      {
        name: 'checked',
        type: 'boolean',
        default: 'false',
        description: 'The binary state (true = on, false = off).',
      },
      {
        name: 'onCheckedChange',
        type: '(checked: boolean) => void',
        default: '—',
        description: 'Callback invoked upon toggling.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Prevents user interaction when true.',
      },
    ],
  },
  {
    id: 'dropdown',
    name: 'Dropdown',
    category: 'Selection',
    paradigm: 'Google Docs Paradigm',
    description:
      'A button that expands an options list like a pull-down roller blind, enabling the user to choose an item without cluttering the screen.',
    codeSnippet: `import { LibraryDropdown } from '@/features/document/components/ui-library';

export function Example() {
  const [val, setVal] = React.useState('roboto');

  return (
    <LibraryDropdown
      label="Font"
      value={val}
      onChange={setVal}
      options={[
        { value: 'roboto', label: 'Roboto', description: 'Standard sans-serif' },
        { value: 'inter', label: 'Inter', description: 'Modern UI font' },
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
        type: 'LibraryDropdownOption[]',
        default: '[]',
        description: 'Array of selectable option objects.',
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
        description: 'Selection handler callback.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Disables the dropdown trigger when true.',
      },
    ],
  },
  {
    id: 'bottom-nav',
    name: 'Bottom Nav',
    category: 'Navigation',
    paradigm: 'Spotify Paradigm',
    description:
      'A persistent navigation bar anchored at the bottom edge, enabling quick thumb switching between primary destinations.',
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
        { id: 'library', label: 'Library', icon: Folder },
      ]}
    />
  );
}`,
    props: [
      {
        name: 'items',
        type: 'LibraryBottomNavItem[]',
        default: '[]',
        description: 'Destination items (up to 5).',
      },
      {
        name: 'activeId',
        type: 'string',
        default: '—',
        description: 'Active destination identifier.',
      },
      {
        name: 'onSelect',
        type: '(id: string) => void',
        default: '—',
        description: 'Destination switch callback.',
      },
    ],
  },
  {
    id: 'card',
    name: 'Card',
    category: 'Layout & Containers',
    paradigm: 'Airbnb Paradigm',
    description:
      'A self-contained box grouping related visual media, title, metadata, and actions into a unified tappable container.',
    codeSnippet: `import {
  LibraryCard,
  LibraryCardMedia,
  LibraryCardHeader,
  LibraryCardTitle,
  LibraryCardDescription,
  LibraryCardFooter,
} from '@/features/document/components/ui-library';

export function Example() {
  return (
    <LibraryCard interactive>
      <LibraryCardMedia>Preview Banner</LibraryCardMedia>
      <LibraryCardHeader>
        <LibraryCardTitle>Robotics Class</LibraryCardTitle>
        <LibraryCardDescription>Grade 11</LibraryCardDescription>
      </LibraryCardHeader>
      <LibraryCardFooter>
        <span>32 Seats</span>
        <span>$350 / Term</span>
      </LibraryCardFooter>
    </LibraryCard>
  );
}`,
    props: [
      {
        name: 'interactive',
        type: 'boolean',
        default: 'false',
        description: 'Applies interactive hover states and pointer cursor.',
      },
      {
        name: 'children',
        type: 'React.ReactNode',
        default: '—',
        description: 'Card body and sub-components.',
      },
    ],
  },
  {
    id: 'hanging-tabs-nav',
    name: 'Hanging Tabs Nav',
    category: 'Navigation',
    paradigm: 'Hanging Trapezoid Top Navigation',
    description:
      'Inverted trapezoid folder tabs suspended from the top header bar with vector-smooth continuous borders, icon and title stacking, and circular notification badges.',
    codeSnippet: `import { HangingTabsNav } from '@/features/document/components/ui-library';
import { Pin, Newspaper, FilePlus, Contacts } from '@/components/icons';

export function Example() {
  const [activeTab, setActiveTab] = React.useState('newswire');

  return (
    <HangingTabsNav
      activeId={activeTab}
      onSelect={setActiveTab}
      size="md"
      items={[
        { id: 'map', label: 'Map', icon: Pin },
        { id: 'newswire', label: 'Newswire', icon: Newspaper, badge: 8, badgeColor: 'blue' },
        { id: 'post', label: 'Post', icon: FilePlus },
        { id: 'friends', label: 'Friends', icon: Contacts },
      ]}
    />
  );
}`,
    props: [
      {
        name: 'items',
        type: 'HangingTabItem[]',
        default: '[]',
        description:
          'Array of navigation tab items with icon, label, optional badge, and optional href.',
      },
      {
        name: 'activeId',
        type: 'string',
        default: '—',
        description: 'Identifier of the currently selected/active tab.',
      },
      {
        name: 'onSelect',
        type: '(id: string) => void',
        default: '—',
        description: 'Callback invoked when a tab is clicked.',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        description: 'Size variant controlling tab dimensions and padding.',
      },
    ],
  },
];
