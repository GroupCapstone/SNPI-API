'use client';

import * as React from 'react';
import {
  LibrarySnackbar,
  LibraryBottomSheet,
  LibraryDialog,
  LibraryBottomNav,
  type LibraryBottomNavItem,
  LibrarySwitch,
  LibraryChip,
  LibraryFab,
  LibraryCard,
  LibraryCardHeader,
  LibraryCardTitle,
  LibraryCardDescription,
  LibraryCardMedia,
  LibraryCardFooter,
  LibraryDropdown,
  LibraryTooltip,
} from './index';
import {
  COMPONENT_LIBRARY_REGISTRY,
  COMPONENT_CATEGORIES,
  type ComponentItemDoc,
} from './component-registry';
import {
  Home,
  Search,
  Folder,
  Wifi,
  Plus,
  Star,
  MapPin,
  Calendar,
  Sparkles,
  Tag,
  Mail,
  Check,
  Code,
  Copy,
  Layers,
  ChevronRight,
} from '@/components/icons';
import { cn } from '@/lib/utils';

export function DesignSystemShowcase() {
  // Navigation / Selection State
  const [selectedId, setSelectedId] = React.useState<string>('snackbar');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [showCode, setShowCode] = React.useState<boolean>(false);
  const [copied, setCopied] = React.useState<boolean>(false);

  // Interactive Component States
  // 1. Snackbar
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('Thread #1042 archived.');

  // 2. Bottom Sheet
  const [sheetOpen, setSheetOpen] = React.useState(false);

  // 3. Dialog
  const [dialogOpen, setDialogOpen] = React.useState(false);

  // 4. Bottom Nav
  const [activeTab, setActiveTab] = React.useState('home');
  const navItems: LibraryBottomNavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'academics', label: 'Academics', icon: Folder },
  ];

  // 5. Toggle switch
  const [airplaneMode, setAirplaneMode] = React.useState(false);
  const [wifiEnabled, setWifiEnabled] = React.useState(true);
  const [notifications, setNotifications] = React.useState(true);

  // 6. Chips
  const [selectedChip, setSelectedChip] = React.useState('Academics');
  const chipOptions = ['All', 'Academics', 'Students', 'Finance', 'Attendance', 'Exams'];

  // 7. FAB
  const [fabCount, setFabCount] = React.useState(0);

  // 8. Card
  const [cardLiked, setCardLiked] = React.useState(false);

  // 9. Dropdown
  const [selectedFont, setSelectedFont] = React.useState('roboto');
  const fontOptions = [
    { value: 'roboto', label: 'Roboto', description: 'Clean sans-serif, standard M3 typography' },
    { value: 'inter', label: 'Inter', description: 'Modern interface typeface with tall x-height' },
    { value: 'lora', label: 'Lora', description: 'Contemporary serif with calligraphy roots' },
    {
      value: 'georgia',
      label: 'Georgia',
      description: 'Classic editorial serif for long-form reading',
    },
  ];

  // Active Component
  const activeComponent =
    COMPONENT_LIBRARY_REGISTRY.find((c) => c.id === selectedId) || COMPONENT_LIBRARY_REGISTRY[0];

  // Filtered Registry
  const filteredComponents = COMPONENT_LIBRARY_REGISTRY.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.paradigm.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    );
  });

  const handleCopyCode = (snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render Interactive Live Component based on ID
  const renderInteractiveLiveComponent = (id: string) => {
    switch (id) {
      case 'snackbar':
        return (
          <div className="flex flex-wrap items-center justify-center gap-3 py-6">
            <button
              type="button"
              onClick={() => {
                setSnackbarMessage('Student profile archived.');
                setSnackbarOpen(true);
              }}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 text-xs font-medium text-slate-800 shadow-xs transition-colors hover:bg-slate-50"
            >
              <Mail className="h-4 w-4 text-slate-600" />
              <span>Simulate Archive Student</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSnackbarMessage('Grade batch saved successfully.');
                setSnackbarOpen(true);
              }}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#023e8a] px-3.5 text-xs font-medium text-white shadow-xs transition-colors hover:bg-[#00509d]"
            >
              <Check className="h-4 w-4" />
              <span>Simulate Batch Save</span>
            </button>
          </div>
        );

      case 'bottom-sheet':
        return (
          <div className="flex items-center justify-center py-6">
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#023e8a] px-4 text-xs font-medium text-white shadow-xs transition-colors hover:bg-[#00509d]"
            >
              <MapPin className="h-4 w-4" />
              <span>Open Campus Details Sheet</span>
            </button>
          </div>
        );

      case 'dialog':
        return (
          <div className="flex items-center justify-center py-6">
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 text-xs font-semibold text-red-700 shadow-xs transition-colors hover:bg-red-100"
            >
              <span>Trigger Delete Dialog</span>
            </button>
          </div>
        );

      case 'bottom-nav':
        return (
          <div className="w-full max-w-md py-4">
            <LibraryBottomNav items={navItems} activeId={activeTab} onSelect={setActiveTab} />
            <div className="mt-2 text-center font-mono text-xs text-slate-500">
              Active Screen: <span className="font-bold text-[#023e8a] uppercase">{activeTab}</span>
            </div>
          </div>
        );

      case 'switch':
        return (
          <div className="w-full max-w-sm space-y-2.5 py-4">
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-2 shadow-xs">
              <span className="text-xs font-medium text-slate-800">Airplane Mode</span>
              <LibrarySwitch checked={airplaneMode} onCheckedChange={setAirplaneMode} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-2 shadow-xs">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-slate-600" />
                <span className="text-xs font-medium text-slate-800">Campus Wi-Fi Sync</span>
              </div>
              <LibrarySwitch checked={wifiEnabled} onCheckedChange={setWifiEnabled} />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-2 shadow-xs">
              <span className="text-xs font-medium text-slate-800">Push Notifications</span>
              <LibrarySwitch checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </div>
        );

      case 'chip':
        return (
          <div className="space-y-3 py-6 text-center">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {chipOptions.map((opt) => (
                <LibraryChip
                  key={opt}
                  active={selectedChip === opt}
                  onClick={() => setSelectedChip(opt)}
                  icon={<Tag className="h-3.5 w-3.5" />}
                >
                  {opt}
                </LibraryChip>
              ))}
            </div>
            <div className="font-mono text-xs text-slate-500">
              Active: <span className="font-semibold text-[#023e8a]">{selectedChip}</span>
            </div>
          </div>
        );

      case 'fab':
        return (
          <div className="flex flex-wrap items-center justify-center gap-4 py-6">
            <LibraryFab
              onClick={() => setFabCount((c) => c + 1)}
              icon={<Plus className="h-5 w-5" />}
            />
            <LibraryFab
              variant="secondary"
              label="New Event"
              onClick={() => setFabCount((c) => c + 1)}
              icon={<Calendar className="h-4 w-4" />}
            />
            <div className="font-mono text-xs text-slate-600">
              Actions Triggered: <span className="font-bold text-[#023e8a]">{fabCount}</span>
            </div>
          </div>
        );

      case 'card':
        return (
          <div className="w-full max-w-sm py-4">
            <LibraryCard interactive onClick={() => setCardLiked((l) => !l)}>
              <LibraryCardMedia>
                <div className="flex h-full w-full items-center justify-center bg-slate-100">
                  <div className="flex items-center gap-2 font-mono text-xs text-slate-600">
                    <Sparkles className="h-4 w-4 text-[#023e8a]" />
                    <span>Academic Science Block B · Lab 4</span>
                  </div>
                </div>
              </LibraryCardMedia>
              <LibraryCardHeader>
                <div>
                  <LibraryCardTitle>Robotics & Autonomous Systems</LibraryCardTitle>
                  <LibraryCardDescription>
                    Grade 11 · Term 1 Curricular Track
                  </LibraryCardDescription>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCardLiked((l) => !l);
                  }}
                  className="p-1 text-slate-400 hover:text-amber-500"
                >
                  <Star className={cn('h-4 w-4', cardLiked && 'fill-amber-400 text-amber-500')} />
                </button>
              </LibraryCardHeader>
              <LibraryCardFooter>
                <span className="font-mono text-xs text-slate-500">32 Seats Enrolled</span>
                <span className="font-mono text-xs font-bold text-[#023e8a]">$350 / Term</span>
              </LibraryCardFooter>
            </LibraryCard>
          </div>
        );

      case 'dropdown':
        return (
          <div className="w-full max-w-xs py-6">
            <LibraryDropdown
              label="Typography Family"
              options={fontOptions}
              value={selectedFont}
              onChange={setSelectedFont}
            />
          </div>
        );

      case 'tooltip':
        return (
          <div className="flex flex-wrap items-center justify-center gap-3 py-6">
            <LibraryTooltip content="Move tool" shortcut="V">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900"
              >
                <span className="font-mono text-xs font-bold">V</span>
              </button>
            </LibraryTooltip>
            <LibraryTooltip content="Hand tool" shortcut="H">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900"
              >
                <span className="font-mono text-xs font-bold">H</span>
              </button>
            </LibraryTooltip>
            <LibraryTooltip content="Rectangle tool" shortcut="R">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900"
              >
                <span className="font-mono text-xs font-bold">R</span>
              </button>
            </LibraryTooltip>
            <LibraryTooltip content="Text tool" shortcut="T">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900"
              >
                <span className="font-mono text-xs font-bold">T</span>
              </button>
            </LibraryTooltip>
          </div>
        );

      default:
        return null;
    }
  };

  // Calculate Next and Previous components for linear browsing
  const currentIndex = COMPONENT_LIBRARY_REGISTRY.findIndex((c) => c.id === selectedId);
  const prevComponent = currentIndex > 0 ? COMPONENT_LIBRARY_REGISTRY[currentIndex - 1] : null;
  const nextComponent =
    currentIndex < COMPONENT_LIBRARY_REGISTRY.length - 1
      ? COMPONENT_LIBRARY_REGISTRY[currentIndex + 1]
      : null;

  return (
    <div className="flex flex-col items-start gap-8 text-slate-900 lg:flex-row">
      {/* Left Component Library Sidebar */}
      <aside className="w-full shrink-0 rounded-xl border border-slate-200 bg-white p-4 shadow-xs lg:w-64">
        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pr-3 pl-8 text-xs text-slate-900 transition-colors placeholder:text-slate-400 focus:border-[#023e8a] focus:bg-white focus:outline-none"
          />
        </div>

        {/* Grouped Component List */}
        <nav className="space-y-5">
          {COMPONENT_CATEGORIES.map((category) => {
            const items = filteredComponents.filter((c) => c.category === category);
            if (items.length === 0) return null;

            return (
              <div key={category} className="space-y-1">
                <p className="px-2 font-mono text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  {category}
                </p>
                <div className="space-y-0.5">
                  {items.map((item) => {
                    const isSelected = selectedId === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSelectedId(item.id);
                          setShowCode(false);
                        }}
                        className={cn(
                          'flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs font-medium transition-colors',
                          isSelected
                            ? 'bg-blue-50 font-semibold text-[#023e8a]'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900',
                        )}
                      >
                        <span className="truncate">{item.name}</span>
                        {isSelected && <ChevronRight className="h-3.5 w-3.5 text-[#023e8a]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </aside>

      {/* Main Component Documentation & Interactive View */}
      <div className="w-full flex-1 space-y-8">
        {/* Component Header */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded border border-blue-200 bg-blue-50 px-2 py-0.5 font-mono text-xs font-semibold text-[#023e8a]">
              {activeComponent.category}
            </span>
            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-xs text-slate-600">
              {activeComponent.paradigm}
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {activeComponent.name}
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            {activeComponent.description}
          </p>
        </div>

        {/* Interactive Preview Sandbox Card */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
          {/* Card Preview Body */}
          <div className="flex min-h-[220px] items-center justify-center border-b border-slate-100 bg-slate-50/40 p-6 sm:p-10">
            {renderInteractiveLiveComponent(activeComponent.id)}
          </div>

          {/* Action Ribbon: Show Code & Copy Button */}
          <div className="flex items-center justify-between bg-white px-4 py-2.5">
            <button
              type="button"
              onClick={() => setShowCode(!showCode)}
              className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-slate-600 transition-colors hover:text-[#023e8a]"
            >
              <Code className="h-4 w-4" />
              <span>{showCode ? 'Hide Code' : 'Show Code'}</span>
            </button>

            {showCode && (
              <button
                type="button"
                onClick={() => handleCopyCode(activeComponent.codeSnippet)}
                className="inline-flex items-center gap-1 rounded border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-[11px] text-slate-700 transition-colors hover:bg-slate-100"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>

          {/* Expandable Code Snippet Block */}
          {showCode && (
            <div className="overflow-x-auto border-t border-slate-200 bg-slate-900 p-4 font-mono text-xs text-slate-200">
              <pre className="leading-relaxed">
                <code>{activeComponent.codeSnippet}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Props & API Reference Specification Table */}
        <div className="space-y-3">
          <h2 className="text-base font-bold tracking-tight text-slate-950">
            Props & API Reference
          </h2>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs text-slate-700">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase">
                  <tr>
                    <th className="px-4 py-2.5">Prop</th>
                    <th className="px-4 py-2.5">Type</th>
                    <th className="px-4 py-2.5">Default</th>
                    <th className="px-4 py-2.5 font-sans font-medium text-slate-600">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeComponent.props.map((prop) => (
                    <tr key={prop.name} className="transition-colors hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-semibold text-[#023e8a]">{prop.name}</td>
                      <td className="px-4 py-3 text-slate-600">
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-800">
                          {prop.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{prop.default || '—'}</td>
                      <td className="px-4 py-3 font-sans text-xs leading-relaxed text-slate-600">
                        {prop.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Next / Previous Component Navigation Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-6">
          {prevComponent ? (
            <button
              type="button"
              onClick={() => {
                setSelectedId(prevComponent.id);
                setShowCode(false);
              }}
              className="group inline-flex flex-col items-start gap-1 text-left"
            >
              <span className="font-mono text-[11px] text-slate-400 group-hover:text-slate-600">
                &larr; Previous
              </span>
              <span className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-[#023e8a]">
                {prevComponent.name}
              </span>
            </button>
          ) : (
            <div />
          )}

          {nextComponent && (
            <button
              type="button"
              onClick={() => {
                setSelectedId(nextComponent.id);
                setShowCode(false);
              }}
              className="group inline-flex flex-col items-end gap-1 text-right"
            >
              <span className="font-mono text-[11px] text-slate-400 group-hover:text-slate-600">
                Next &rarr;
              </span>
              <span className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-[#023e8a]">
                {nextComponent.name}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Global Overlays for active component interaction */}
      <LibrarySnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        actionLabel="Undo"
        onAction={() => setSnackbarOpen(false)}
        onClose={() => setSnackbarOpen(false)}
      />

      <LibraryBottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Siem Reap Central Campus · Science Lab"
      >
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-slate-600">
            Located in Academic Building B, 2nd Floor. Fully equipped with dual robotic testbenches
            and high-speed telemetry terminals.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
              <span className="font-mono text-xs text-slate-500">CAPACITY</span>
              <div className="mt-0.5 text-base font-bold text-slate-900">45 Students</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center">
              <span className="font-mono text-xs text-slate-500">STATUS</span>
              <div className="mt-0.5 text-base font-bold text-emerald-700">Active Session</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSheetOpen(false)}
            className="flex h-10 w-full items-center justify-center rounded-lg bg-[#023e8a] text-xs font-medium text-white transition-colors hover:bg-[#00509d]"
          >
            Close Sheet
          </button>
        </div>
      </LibraryBottomSheet>

      <LibraryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Delete enrollment record?"
        description="This will permanently revoke academic course registration for Student ID #2049. This action cannot be reversed."
        confirmLabel="Delete Record"
        cancelLabel="Cancel"
        isDestructive
        onConfirm={() => setDialogOpen(false)}
      />
    </div>
  );
}
