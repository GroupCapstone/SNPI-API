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
  const [activeView, setActiveView] = React.useState<'components' | 'blueprint'>('components');

  // Preview Stage Background: 'dark' (Move Green #0F3B27) vs 'light' (Soft White #F7F9F7)
  const [stageBg, setStageBg] = React.useState<'move-green' | 'soft-white'>('move-green');

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
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/20 bg-[#0F3B27] px-4 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-[#144d33]"
            >
              <Mail className="h-4 w-4 text-[#92FF5F]" />
              <span>Simulate Archive Student</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSnackbarMessage('Grade batch saved successfully.');
                setSnackbarOpen(true);
              }}
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#92FF5F] px-4 text-xs font-bold text-[#0B2518] shadow-xs transition-colors hover:bg-[#7ceb49]"
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
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#92FF5F] px-4 text-xs font-bold text-[#0B2518] shadow-xs transition-colors hover:bg-[#7ceb49]"
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
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#FF7036] px-4 text-xs font-bold text-[#0B2518] shadow-xs transition-colors hover:bg-[#e65c22]"
            >
              <span>Trigger Delete Dialog</span>
            </button>
          </div>
        );

      case 'bottom-nav':
        return (
          <div className="w-full max-w-md py-4">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0F3B27] p-2">
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
                          ? 'bg-[#92FF5F] font-bold text-[#0B2518]'
                          : 'text-[#C5E3D5] hover:text-white',
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-mono text-[11px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mt-2 text-center font-mono text-xs text-[#7DAF99]">
              Active Screen: <span className="font-bold text-[#92FF5F] uppercase">{activeTab}</span>
            </div>
          </div>
        );

      case 'switch':
        return (
          <div className="w-full max-w-sm space-y-2.5 py-4">
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0F3B27] px-4 py-2.5">
              <span className="text-xs font-medium text-white">Airplane Mode</span>
              <LibrarySwitch checked={airplaneMode} onCheckedChange={setAirplaneMode} />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0F3B27] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-[#92FF5F]" />
                <span className="text-xs font-medium text-white">Campus Wi-Fi Sync</span>
              </div>
              <LibrarySwitch checked={wifiEnabled} onCheckedChange={setWifiEnabled} />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#0F3B27] px-4 py-2.5">
              <span className="text-xs font-medium text-white">Push Notifications</span>
              <LibrarySwitch checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </div>
        );

      case 'chip':
        return (
          <div className="space-y-3 py-6 text-center">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {chipOptions.map((opt) => {
                const isSelected = selectedChip === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSelectedChip(opt)}
                    className={cn(
                      'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-xs font-semibold transition-all',
                      isSelected
                        ? 'bg-[#92FF5F] text-[#0B2518]'
                        : 'border border-white/20 bg-[#0F3B27] text-[#C5E3D5] hover:border-[#92FF5F]/50 hover:text-white',
                    )}
                  >
                    <Tag className="h-3 w-3" />
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
            <div className="font-mono text-xs text-[#7DAF99]">
              Active Filter: <span className="font-bold text-[#92FF5F]">{selectedChip}</span>
            </div>
          </div>
        );

      case 'fab':
        return (
          <div className="flex flex-wrap items-center justify-center gap-4 py-6">
            <button
              type="button"
              onClick={() => setFabCount((c) => c + 1)}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#92FF5F] text-[#0B2518] shadow-md transition-transform hover:scale-105 active:scale-95"
              aria-label="Add"
            >
              <Plus className="h-6 w-6 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={() => setFabCount((c) => c + 1)}
              className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#FF7036] px-5 font-mono text-xs font-bold text-[#0B2518] shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              <Calendar className="h-4 w-4" />
              <span>New Academic Event</span>
            </button>

            <div className="w-full text-center font-mono text-xs text-[#7DAF99]">
              Actions Triggered: <span className="font-bold text-[#92FF5F]">{fabCount}</span>
            </div>
          </div>
        );

      case 'card':
        return (
          <div className="w-full max-w-sm py-4">
            <div
              onClick={() => setCardLiked((l) => !l)}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#0F3B27] transition-all hover:border-[#92FF5F]/50"
            >
              <div className="flex h-32 items-center justify-center bg-[#071D13] p-4 text-center">
                <div className="flex items-center gap-2 font-mono text-xs text-[#92FF5F]">
                  <Sparkles className="h-4 w-4 text-[#92FF5F]" />
                  <span>Academic Science Block B · Lab 4</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Robotics & Autonomous Systems
                    </h3>
                    <p className="mt-0.5 text-xs text-[#7DAF99]">
                      Grade 11 · Term 1 Curricular Track
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCardLiked((l) => !l);
                    }}
                    className="p-1 text-[#7DAF99] hover:text-[#92FF5F]"
                  >
                    <Star className={cn('h-4 w-4', cardLiked && 'fill-[#92FF5F] text-[#92FF5F]')} />
                  </button>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                  <span className="font-mono text-xs text-[#7DAF99]">32 Seats Enrolled</span>
                  <span className="rounded bg-[#92FF5F] px-2 py-0.5 font-mono text-xs font-bold text-[#0B2518]">
                    $350 / Term
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'dropdown':
        return (
          <div className="w-full max-w-xs py-6">
            <div className="space-y-1.5">
              <label className="block font-mono text-xs font-bold text-[#92FF5F] uppercase">
                Typography Family
              </label>
              <select
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value)}
                className="h-10 w-full rounded-xl border border-white/20 bg-[#0F3B27] px-3 font-mono text-xs text-white focus:border-[#92FF5F] focus:outline-none"
              >
                {fontOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#0F3B27] text-white">
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
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-[#0F3B27] text-sm font-bold text-white transition-colors hover:border-[#92FF5F] hover:bg-[#144d33] hover:text-[#92FF5F]"
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
      <div className="flex flex-col gap-4 border-b border-[#1A4530] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-2xl border border-[#1A4530] bg-[#071D13] p-1.5">
          <button
            type="button"
            onClick={() => setActiveView('components')}
            className={cn(
              'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all',
              activeView === 'components'
                ? 'bg-[#92FF5F] text-[#0B2518]'
                : 'text-[#7DAF99] hover:text-white',
            )}
          >
            <Layers className="h-4 w-4" />
            <span>Interactive Components</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('blueprint')}
            className={cn(
              'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all',
              activeView === 'blueprint'
                ? 'bg-[#92FF5F] text-[#0B2518]'
                : 'text-[#7DAF99] hover:text-white',
            )}
          >
            <Palette className="h-4 w-4" />
            <span>Brand Concept Blueprint</span>
          </button>
        </div>

        <div className="font-mono text-xs text-[#7DAF99]">
          Domain Scope: <span className="font-bold text-[#92FF5F]">docs.snpi.edu.kh</span> (Docs &
          Library Isolated)
        </div>
      </div>

      {/* VIEW 1: Brand Concept Blueprint */}
      {activeView === 'blueprint' && <BrandConceptBlueprint />}

      {/* VIEW 2: Interactive Component Sandbox */}
      {activeView === 'components' && (
        <div className="flex flex-col items-start gap-8 lg:flex-row">
          {/* Left Component Library Sidebar */}
          <aside className="w-full shrink-0 rounded-2xl border border-[#1A4530] bg-[#0F3B27] p-4 lg:w-64">
            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-[#7DAF99]" />
              <input
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full rounded-xl border border-[#1A4530] bg-[#071D13] pr-3 pl-8 text-xs text-white placeholder-[#5A8771] focus:border-[#92FF5F] focus:outline-none"
              />
            </div>

            {/* Grouped Component List */}
            <nav className="space-y-5">
              {COMPONENT_CATEGORIES.map((category) => {
                const items = filteredComponents.filter((c) => c.category === category);
                if (items.length === 0) return null;

                return (
                  <div key={category} className="space-y-1">
                    <p className="px-2 font-mono text-[11px] font-bold tracking-wider text-[#92FF5F]/80 uppercase">
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
                              'flex w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-left text-xs font-medium transition-colors',
                              isSelected
                                ? 'bg-[#92FF5F] font-bold text-[#0B2518]'
                                : 'text-[#C5E3D5] hover:bg-[#144d33] hover:text-white',
                            )}
                          >
                            <span className="truncate">{item.name}</span>
                            {isSelected && <ChevronRight className="h-3.5 w-3.5 text-[#0B2518]" />}
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
                <span className="rounded-md border border-[#92FF5F]/30 bg-[#92FF5F] px-2.5 py-0.5 font-mono text-xs font-bold text-[#0B2518]">
                  {activeComponent.category}
                </span>
                <span className="rounded-md border border-white/20 bg-[#0F3B27] px-2.5 py-0.5 font-mono text-xs font-semibold text-[#BFF2F0]">
                  {activeComponent.paradigm}
                </span>
              </div>

              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                {activeComponent.name}
              </h1>
              <p className="max-w-3xl text-sm leading-relaxed text-[#A9D4C2] sm:text-base">
                {activeComponent.description}
              </p>
            </div>

            {/* Interactive Preview Sandbox Card */}
            <div className="overflow-hidden rounded-3xl border border-[#1A4530] bg-[#0F3B27]">
              {/* Background Canvas Selector Ribbon */}
              <div className="flex items-center justify-between border-b border-[#1A4530] bg-[#071D13] px-4 py-2">
                <span className="font-mono text-[11px] font-semibold text-[#7DAF99]">
                  PREVIEW STAGE CANVAS
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setStageBg('move-green')}
                    className={cn(
                      'rounded-md px-2 py-0.5 font-mono text-[11px] transition-colors',
                      stageBg === 'move-green'
                        ? 'bg-[#92FF5F] font-bold text-[#0B2518]'
                        : 'text-[#7DAF99] hover:text-white',
                    )}
                  >
                    Move Green (#0F3B27)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStageBg('soft-white')}
                    className={cn(
                      'rounded-md px-2 py-0.5 font-mono text-[11px] transition-colors',
                      stageBg === 'soft-white'
                        ? 'bg-[#92FF5F] font-bold text-[#0B2518]'
                        : 'text-[#7DAF99] hover:text-white',
                    )}
                  >
                    Soft White (#F7F9F7)
                  </button>
                </div>
              </div>

              {/* Card Preview Body */}
              <div
                className={cn(
                  'flex min-h-[220px] items-center justify-center p-6 transition-colors sm:p-10',
                  stageBg === 'move-green' ? 'bg-[#0F3B27]' : 'bg-[#F7F9F7] text-slate-900',
                )}
              >
                {renderInteractiveLiveComponent(activeComponent.id)}
              </div>

              {/* Action Ribbon: Show Code & Copy Button */}
              <div className="flex items-center justify-between border-t border-[#1A4530] bg-[#071D13] px-4 py-2.5">
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#92FF5F] transition-colors hover:text-[#BFF2F0]"
                >
                  <Code className="h-4 w-4" />
                  <span>{showCode ? 'Hide Code' : 'Show Code'}</span>
                </button>

                {showCode && (
                  <button
                    type="button"
                    onClick={() => handleCopyCode(activeComponent.codeSnippet)}
                    className="inline-flex items-center gap-1 rounded-md border border-[#1A4530] bg-[#0F3B27] px-2.5 py-1 font-mono text-[11px] text-[#92FF5F] transition-colors hover:bg-[#144d33]"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-[#92FF5F]" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    <span>{copied ? 'Copied' : 'Copy Snippet'}</span>
                  </button>
                )}
              </div>

              {/* Expandable Code Snippet Block */}
              {showCode && (
                <div className="overflow-x-auto border-t border-[#1A4530] bg-[#05140D] p-4 font-mono text-xs text-[#92FF5F]">
                  <pre className="leading-relaxed">
                    <code>{activeComponent.codeSnippet}</code>
                  </pre>
                </div>
              )}
            </div>

            {/* Props & API Reference Specification Table */}
            <div className="space-y-3">
              <h2 className="text-base font-bold tracking-tight text-white">
                Props & API Reference
              </h2>
              <div className="overflow-hidden rounded-2xl border border-[#1A4530] bg-[#0F3B27]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead className="border-b border-[#1A4530] bg-[#071D13] text-[11px] font-bold text-[#92FF5F] uppercase">
                      <tr>
                        <th className="px-4 py-2.5">Prop</th>
                        <th className="px-4 py-2.5">Type</th>
                        <th className="px-4 py-2.5">Default</th>
                        <th className="px-4 py-2.5 font-sans font-medium text-[#7DAF99]">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1A4530]">
                      {activeComponent.props.map((prop) => (
                        <tr key={prop.name} className="transition-colors hover:bg-[#144d33]/50">
                          <td className="px-4 py-3 font-bold text-[#92FF5F]">{prop.name}</td>
                          <td className="px-4 py-3">
                            <span className="rounded bg-[#071D13] px-2 py-0.5 text-[11px] text-[#BFF2F0]">
                              {prop.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-[#FF7036]">{prop.default || '—'}</td>
                          <td className="px-4 py-3 font-sans text-xs leading-relaxed text-[#D4EADE]">
                            {prop.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Linear Navigation Footer */}
            <div className="flex items-center justify-between border-t border-[#1A4530] pt-6">
              {prevComponent ? (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(prevComponent.id);
                    setShowCode(false);
                  }}
                  className="group inline-flex flex-col items-start gap-1 text-left"
                >
                  <span className="font-mono text-[11px] text-[#7DAF99] group-hover:text-white">
                    &larr; Previous
                  </span>
                  <span className="text-sm font-bold text-[#C5E3D5] transition-colors group-hover:text-[#92FF5F]">
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
                  <span className="font-mono text-[11px] text-[#7DAF99] group-hover:text-white">
                    Next &rarr;
                  </span>
                  <span className="text-sm font-bold text-[#C5E3D5] transition-colors group-hover:text-[#92FF5F]">
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
          <p className="text-sm leading-relaxed text-[#A9D4C2]">
            Located in Academic Building B, 2nd Floor. Fully equipped with dual robotic testbenches
            and high-speed telemetry terminals.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-[#071D13] p-3 text-center">
              <span className="font-mono text-xs text-[#7DAF99]">CAPACITY</span>
              <div className="mt-0.5 text-base font-bold text-white">45 Students</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#071D13] p-3 text-center">
              <span className="font-mono text-xs text-[#7DAF99]">STATUS</span>
              <div className="mt-0.5 text-base font-bold text-[#92FF5F]">Active Session</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSheetOpen(false)}
            className="flex h-10 w-full items-center justify-center rounded-xl bg-[#92FF5F] text-xs font-bold text-[#0B2518] transition-colors hover:bg-[#7ceb49]"
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
