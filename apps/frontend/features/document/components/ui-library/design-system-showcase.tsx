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
  BrandConceptBlueprint,
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
  Palette,
} from '@/components/icons';
import { cn } from '@/lib/utils';

export function DesignSystemShowcase() {
  // Main View Selector: 'blueprint' (Colors & Concept) vs 'components' (Interactive Sandbox)
  const [activeView, setActiveView] = React.useState<'blueprint' | 'components'>('blueprint');

  // Preview Stage Background: 'midnight' (#000B26), 'lavender' (#E3E7FC), or 'white' (#FFFFFF)
  const [stageBg, setStageBg] = React.useState<'midnight' | 'lavender' | 'white'>('midnight');

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
  const [selectedFont, setSelectedFont] = React.useState('sora');
  const fontOptions = [
    { value: 'sora', label: 'Sora', description: 'Authoritative brand typeface, geometric sans' },
    { value: 'inter', label: 'Inter', description: 'Tall x-height, neutral UI sans' },
    { value: 'roboto', label: 'Roboto', description: 'Standard M3 typography' },
  ];

  // Active Component
  const activeComponent =
    COMPONENT_LIBRARY_REGISTRY.find((c) => c.id === selectedId) || COMPONENT_LIBRARY_REGISTRY[0];

  // Filtered Components for search
  const filteredComponents = COMPONENT_LIBRARY_REGISTRY.filter((c) => {
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
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/20 bg-[#001338] px-4 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#002266]"
            >
              <Mail className="h-4 w-4 text-[#2277FF]" />
              <span>Simulate Archive Student</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSnackbarMessage('Grade batch saved successfully.');
                setSnackbarOpen(true);
              }}
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#0056FF] px-4 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#2277FF]"
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
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#0056FF] px-4 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#2277FF]"
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
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#0056FF] px-4 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#2277FF]"
            >
              <span>Trigger Delete Dialog</span>
            </button>
          </div>
        );

      case 'bottom-nav':
        return (
          <div className="w-full max-w-md py-4">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#001338] p-2">
              <div className="flex items-center justify-around">
                {navItems.map((item) => {
                  const isActive = activeTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      className={cn(
                        'flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-colors',
                        isActive
                          ? 'bg-[#0056FF] font-bold text-white'
                          : 'text-[#C4CEF8] hover:text-white',
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-mono text-[11px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mt-2 text-center font-mono text-xs text-[#A3B4F0]">
              Active Screen: <span className="font-bold text-[#0056FF] uppercase">{activeTab}</span>
            </div>
          </div>
        );

      case 'switch':
        return (
          <div className="w-full max-w-sm space-y-2.5 py-4">
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#001338] px-4 py-2.5">
              <span className="text-xs font-medium text-white">Airplane Mode</span>
              <LibrarySwitch checked={airplaneMode} onCheckedChange={setAirplaneMode} />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#001338] px-4 py-2.5">
              <span className="text-xs font-medium text-white">Campus High-Speed Wi-Fi</span>
              <LibrarySwitch checked={wifiEnabled} onCheckedChange={setWifiEnabled} />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#001338] px-4 py-2.5">
              <span className="text-xs font-medium text-white">Push Notifications</span>
              <LibrarySwitch checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </div>
        );

      case 'chip':
        return (
          <div className="flex flex-wrap items-center justify-center gap-2 py-6">
            {chipOptions.map((opt) => (
              <LibraryChip
                key={opt}
                active={selectedChip === opt}
                onClick={() => setSelectedChip(opt)}
              >
                {opt}
              </LibraryChip>
            ))}
          </div>
        );

      case 'fab':
        return (
          <div className="flex flex-col items-center justify-center gap-3 py-6">
            <div className="flex items-center gap-4">
              <LibraryFab
                label="New Course"
                icon={<Plus className="h-5 w-5" />}
                onClick={() => setFabCount((c) => c + 1)}
                className="bg-[#0056FF] text-white hover:bg-[#2277FF]"
              />
            </div>
            <span className="font-mono text-xs text-[#A3B4F0]">FAB Click Count: {fabCount}</span>
          </div>
        );

      case 'card':
        return (
          <div className="w-full max-w-sm py-4">
            <LibraryCard className="border border-[#0F357D] bg-[#001338] text-white">
              <LibraryCardMedia className="relative flex h-28 w-full items-start justify-between bg-gradient-to-r from-[#000B26] via-[#002D8A] to-[#0056FF] p-3">
                <span className="rounded-md bg-[#0056FF] px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                  ADVANCED STEM
                </span>
                <span className="font-mono text-[10px] text-white/80">SNPI-2026</span>
              </LibraryCardMedia>
              <LibraryCardHeader>
                <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-[#2277FF]">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>TERM 1 · SEMESTER 2026</span>
                </div>
                <LibraryCardTitle className="text-base font-bold text-white">
                  Robotics & Autonomous Drones
                </LibraryCardTitle>
                <LibraryCardDescription className="text-xs text-[#C4CEF8]">
                  Hands-on engineering lab covering flight telemetry, RTOS, and sensor fusion.
                </LibraryCardDescription>
              </LibraryCardHeader>
              <LibraryCardFooter className="flex items-center justify-between border-t border-white/10 pt-3">
                <span className="font-mono text-xs font-bold text-[#E3E7FC]">3 Credits · SNPI</span>
                <button
                  type="button"
                  onClick={() => setCardLiked(!cardLiked)}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors',
                    cardLiked
                      ? 'bg-[#0056FF] text-white'
                      : 'bg-white/10 text-white hover:bg-white/20',
                  )}
                >
                  <Star className="h-3.5 w-3.5" />
                  <span>{cardLiked ? 'Enrolled' : 'Enroll'}</span>
                </button>
              </LibraryCardFooter>
            </LibraryCard>
          </div>
        );

      case 'dropdown':
        return (
          <div className="w-full max-w-xs py-6">
            <div className="space-y-1.5">
              <label className="font-mono text-[11px] font-semibold tracking-wider text-[#A3B4F0] uppercase">
                Typography Family
              </label>
              <select
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value)}
                className="h-10 w-full rounded-xl border border-white/20 bg-[#001338] px-3 font-mono text-xs text-white focus:border-[#0056FF] focus:outline-none"
              >
                {fontOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#000B26] text-white">
                    {opt.label} — {opt.description}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 'tooltip':
        return (
          <div className="flex flex-wrap items-center justify-center gap-3 py-6">
            {['V (Move)', 'H (Hand)', 'R (Rectangle)', 'T (Text)'].map((tool) => (
              <button
                key={tool}
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-[#001338] text-sm font-bold text-white transition-colors hover:border-[#0056FF] hover:bg-[#002266] hover:text-[#2277FF]"
              >
                {tool.charAt(0)}
              </button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  // Linear Navigation
  const currentIndex = COMPONENT_LIBRARY_REGISTRY.findIndex((c) => c.id === selectedId);
  const prevComponent = currentIndex > 0 ? COMPONENT_LIBRARY_REGISTRY[currentIndex - 1] : null;
  const nextComponent =
    currentIndex < COMPONENT_LIBRARY_REGISTRY.length - 1
      ? COMPONENT_LIBRARY_REGISTRY[currentIndex + 1]
      : null;

  return (
    <div className="space-y-8">
      {/* Top Mode Selector Tabs */}
      <div className="flex flex-col gap-4 border-b border-[#0F357D] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-2xl border border-[#0F357D] bg-[#000B26] p-1.5">
          <button
            type="button"
            onClick={() => setActiveView('blueprint')}
            className={cn(
              'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all',
              activeView === 'blueprint'
                ? 'bg-[#0056FF] text-white shadow-xs'
                : 'text-[#A3B4F0] hover:text-white',
            )}
          >
            <Palette className="h-4 w-4" />
            <span>Brand Color Blueprint</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('components')}
            className={cn(
              'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all',
              activeView === 'components'
                ? 'bg-[#0056FF] text-white shadow-xs'
                : 'text-[#A3B4F0] hover:text-white',
            )}
          >
            <Layers className="h-4 w-4" />
            <span>Interactive Components</span>
          </button>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-[#A3B4F0]">
          <span>Scope:</span>
          <span className="font-bold text-[#2277FF]">docs.snpi.edu.kh</span>
          <span className="rounded-md bg-[#0056FF]/20 px-2 py-0.5 font-bold text-[#E3E7FC]">
            Sora Font
          </span>
        </div>
      </div>

      {/* VIEW 1: Brand Concept Blueprint */}
      {activeView === 'blueprint' && <BrandConceptBlueprint />}

      {/* VIEW 2: Interactive Component Sandbox */}
      {activeView === 'components' && (
        <div className="flex flex-col items-start gap-8 lg:flex-row">
          {/* Left Component Library Sidebar */}
          <aside className="w-full shrink-0 rounded-2xl border border-[#0F357D] bg-[#001338] p-4 lg:w-64">
            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-[#A3B4F0]" />
              <input
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full rounded-xl border border-[#0F357D] bg-[#000B26] pr-3 pl-8 text-xs text-white placeholder-[#5D72B0] focus:border-[#0056FF] focus:outline-none"
              />
            </div>

            {/* Categorized Component List */}
            <nav className="space-y-4">
              {COMPONENT_CATEGORIES.map((category) => {
                const categoryComponents = filteredComponents.filter(
                  (c) => c.category === category,
                );
                if (categoryComponents.length === 0) return null;

                return (
                  <div key={category} className="space-y-1.5">
                    <span className="font-mono text-[10px] font-bold tracking-wider text-[#A3B4F0] uppercase">
                      {category}
                    </span>
                    <div className="space-y-0.5">
                      {categoryComponents.map((item) => {
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
                              'flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-left text-xs font-medium transition-colors',
                              isSelected
                                ? 'bg-[#0056FF] font-bold text-white'
                                : 'text-[#C4CEF8] hover:bg-[#002266] hover:text-white',
                            )}
                          >
                            <span className="truncate">{item.name}</span>
                            {isSelected && <ChevronRight className="h-3.5 w-3.5 text-white" />}
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
          <div className="w-full flex-1 space-y-6">
            {/* Component Header */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-[#0056FF]/40 bg-[#0056FF] px-2.5 py-0.5 font-mono text-xs font-bold text-white">
                  {activeComponent.category}
                </span>
                <span className="rounded-md border border-[#0F357D] bg-[#001338] px-2.5 py-0.5 font-mono text-xs font-semibold text-[#E3E7FC]">
                  {activeComponent.paradigm}
                </span>
              </div>

              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                {activeComponent.name}
              </h1>
              <p className="max-w-3xl text-sm leading-relaxed text-[#C4CEF8] sm:text-base">
                {activeComponent.description}
              </p>
            </div>

            {/* Interactive Preview Sandbox Card */}
            <div className="overflow-hidden rounded-3xl border border-[#0F357D] bg-[#001338]">
              {/* Background Canvas Selector Ribbon */}
              <div className="flex items-center justify-between border-b border-[#0F357D] bg-[#000B26] px-4 py-2">
                <span className="font-mono text-[11px] font-semibold text-[#A3B4F0]">
                  PREVIEW STAGE CANVAS
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setStageBg('midnight')}
                    className={cn(
                      'rounded-md px-2 py-0.5 font-mono text-[11px] transition-colors',
                      stageBg === 'midnight'
                        ? 'bg-[#0056FF] font-bold text-white'
                        : 'text-[#A3B4F0] hover:text-white',
                    )}
                  >
                    Midnight Surge (#000B26)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStageBg('lavender')}
                    className={cn(
                      'rounded-md px-2 py-0.5 font-mono text-[11px] transition-colors',
                      stageBg === 'lavender'
                        ? 'bg-[#0056FF] font-bold text-white'
                        : 'text-[#A3B4F0] hover:text-white',
                    )}
                  >
                    Soft Lavender (#E3E7FC)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStageBg('white')}
                    className={cn(
                      'rounded-md px-2 py-0.5 font-mono text-[11px] transition-colors',
                      stageBg === 'white'
                        ? 'bg-[#0056FF] font-bold text-white'
                        : 'text-[#A3B4F0] hover:text-white',
                    )}
                  >
                    White (#FFFFFF)
                  </button>
                </div>
              </div>

              {/* Card Preview Body */}
              <div
                className={cn(
                  'flex min-h-[220px] items-center justify-center p-6 transition-colors sm:p-10',
                  stageBg === 'midnight' && 'bg-[#000B26] text-white',
                  stageBg === 'lavender' && 'bg-[#E3E7FC] text-[#000B26]',
                  stageBg === 'white' && 'bg-[#FFFFFF] text-slate-900',
                )}
              >
                {renderInteractiveLiveComponent(activeComponent.id)}
              </div>

              {/* Action Ribbon: Show Code & Copy Button */}
              <div className="flex items-center justify-between border-t border-[#0F357D] bg-[#000B26] px-4 py-2.5">
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#2277FF] transition-colors hover:text-white"
                >
                  <Code className="h-4 w-4" />
                  <span>{showCode ? 'Hide Code' : 'Show Code'}</span>
                </button>

                {showCode && (
                  <button
                    type="button"
                    onClick={() => handleCopyCode(activeComponent.codeSnippet)}
                    className="inline-flex items-center gap-1 rounded-md border border-[#0F357D] bg-[#001338] px-2.5 py-1 font-mono text-[11px] text-[#2277FF] transition-colors hover:bg-[#002266] hover:text-white"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-white" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span>{copied ? 'Copied snippet' : 'Copy snippet'}</span>
                  </button>
                )}
              </div>

              {/* Collapsible Source Code View */}
              {showCode && (
                <div className="border-t border-[#0F357D] bg-[#00081C] p-4">
                  <pre className="overflow-x-auto font-mono text-xs text-[#E3E7FC]">
                    <code>{activeComponent.codeSnippet}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Component Anatomy & Etymology Card */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-[#0F357D] bg-[#001338] p-5">
                <span className="font-mono text-[11px] font-bold text-[#A3B4F0] uppercase">
                  ET YMOLOGY & REAL-WORLD PARADIGM
                </span>
                <p className="mt-2 text-xs leading-relaxed text-[#C4CEF8]">
                  {activeComponent.paradigm}: {activeComponent.description}
                </p>
              </div>

              <div className="rounded-2xl border border-[#0F357D] bg-[#001338] p-5">
                <span className="font-mono text-[11px] font-bold text-[#A3B4F0] uppercase">
                  FLAT DESIGN & ELEVATION RULE
                </span>
                <p className="mt-2 text-xs leading-relaxed text-[#C4CEF8]">
                  Zero dropped blur shadows. Depth is achieved purely through 1px border contrast
                  and surface luminance hierarchy.
                </p>
              </div>
            </div>

            {/* Linear Component Navigation Links */}
            <div className="flex items-center justify-between border-t border-[#0F357D] pt-6">
              {prevComponent ? (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(prevComponent.id);
                    setShowCode(false);
                  }}
                  className="group inline-flex flex-col items-start gap-1 text-left"
                >
                  <span className="font-mono text-[11px] text-[#A3B4F0] group-hover:text-white">
                    &larr; Previous
                  </span>
                  <span className="text-sm font-bold text-[#E3E7FC] transition-colors group-hover:text-[#2277FF]">
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
                  <span className="font-mono text-[11px] text-[#A3B4F0] group-hover:text-white">
                    Next &rarr;
                  </span>
                  <span className="text-sm font-bold text-[#E3E7FC] transition-colors group-hover:text-[#2277FF]">
                    {nextComponent.name}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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
          <p className="text-sm leading-relaxed text-[#C4CEF8]">
            Located in Academic Building B, 2nd Floor. Fully equipped with dual robotic testbenches
            and high-speed telemetry terminals.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-[#000B26] p-3 text-center">
              <span className="font-mono text-xs text-[#A3B4F0]">CAPACITY</span>
              <div className="mt-0.5 text-base font-bold text-white">45 Students</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#000B26] p-3 text-center">
              <span className="font-mono text-xs text-[#A3B4F0]">STATUS</span>
              <div className="mt-0.5 text-base font-bold text-[#2277FF]">Active Session</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSheetOpen(false)}
            className="flex h-10 w-full items-center justify-center rounded-xl bg-[#0056FF] text-xs font-bold text-white transition-colors hover:bg-[#2277FF]"
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
