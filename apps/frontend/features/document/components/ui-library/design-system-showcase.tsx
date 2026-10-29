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
} from '@/components/icons';
import { cn } from '@/lib/utils';

export function DesignSystemShowcase() {
  // Theme toggle state for the playground canvas
  const [canvasTheme, setCanvasTheme] = React.useState<'dark' | 'light'>('dark');

  // 1. Snackbar state
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('Thread #1042 archived.');

  // 2. Bottom Sheet state
  const [sheetOpen, setSheetOpen] = React.useState(false);

  // 3. Dialog state
  const [dialogOpen, setDialogOpen] = React.useState(false);

  // 4. Bottom Nav state
  const [activeTab, setActiveTab] = React.useState('home');
  const navItems: LibraryBottomNavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'academics', label: 'Academics', icon: Folder },
  ];

  // 5. Toggle switch states
  const [airplaneMode, setAirplaneMode] = React.useState(false);
  const [wifiEnabled, setWifiEnabled] = React.useState(true);
  const [notifications, setNotifications] = React.useState(true);

  // 6. Chips state
  const [selectedChip, setSelectedChip] = React.useState('All');
  const chipOptions = ['All', 'Academics', 'Students', 'Finance', 'Attendance', 'Exams'];

  // 7. FAB counter
  const [fabCount, setFabCount] = React.useState(0);

  // 8. Card interactive state
  const [cardLiked, setCardLiked] = React.useState(false);

  // 9. Dropdown state
  const [selectedFont, setSelectedFont] = React.useState('roboto');
  const fontOptions = [
    { value: 'roboto', label: 'Roboto', description: 'Clean sans-serif, standard M3 typography' },
    { value: 'inter', label: 'Inter', description: 'Modern interface typeface with tall x-height' },
    { value: 'lora', label: 'Lora', description: 'Contemporary serif with calligraphy roots' },
    { value: 'georgia', label: 'Georgia', description: 'Classic editorial serif for long-form reading' },
  ];

  const isDark = canvasTheme === 'dark';

  return (
    <div className="space-y-12">
      {/* Top Banner & Control Ribbon */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-900/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-emerald-600 uppercase tracking-wider dark:text-emerald-400">
              [PUBLIC DESIGN LIBRARY]
            </span>
            <span className="text-zinc-300 dark:text-zinc-700">·</span>
            <span className="font-mono text-xs text-zinc-500">10 UI Components Standard</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
            Interactive Component Showcase & Mathematical Tokens
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
            Flat component design, zero drop-shadows, surface luminance depth hierarchy, and strict touch target compliance.
          </p>
        </div>

        {/* Playground Theme Selector */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-800">
          <button
            type="button"
            onClick={() => setCanvasTheme('dark')}
            className={cn(
              'rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-colors',
              canvasTheme === 'dark'
                ? 'bg-zinc-900 text-emerald-400 dark:bg-zinc-950 dark:text-emerald-400'
                : 'text-slate-600 hover:text-slate-900',
            )}
          >
            Dark UI Canvas (#121214)
          </button>
          <button
            type="button"
            onClick={() => setCanvasTheme('light')}
            className={cn(
              'rounded-lg px-3 py-1.5 font-mono text-xs font-medium transition-colors',
              canvasTheme === 'light'
                ? 'bg-blue-50 text-[#023e8a] font-semibold'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400',
            )}
          >
            Light Canvas Preview
          </button>
        </div>
      </div>

      {/* Main Interactive Playground Box */}
      <div
        className={cn(
          'relative rounded-3xl border p-6 transition-colors duration-200 sm:p-10 shadow-none',
          isDark
            ? 'border-white/10 bg-[#121214] text-zinc-100'
            : 'border-slate-300 bg-[#F8F9FA] text-slate-900',
        )}
      >
        <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span>PLAYGROUND CANVAS ACTIVE: {isDark ? 'OBSIDIAN DARK (#121214)' : 'CLEAN LIGHT (#F8F9FA)'}</span>
          </div>
          <span className="font-mono text-xs text-zinc-400">10 / 10 COMPONENTS LOADED</span>
        </div>

        {/* 10 Components Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* COMPONENT 1: SNACKBAR */}
          <div className={cn('rounded-2xl border p-5', isDark ? 'border-white/10 bg-[#161619]' : 'border-slate-200 bg-white')}>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-medium text-emerald-400">01. SNACKBAR</span>
                <h3 className="text-base font-semibold">Quick Action Confirmation</h3>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[11px] text-zinc-400">
                Gmail Paradigm
              </span>
            </div>
            <p className="mt-2 text-xs text-zinc-400">
              A temporary bar at the bottom to confirm what you just did, disappearing after a few seconds. Includes an instant Undo action.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setSnackbarMessage('Student profile archived.');
                  setSnackbarOpen(true);
                }}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-[#202024] px-4 text-xs font-medium text-zinc-200 hover:bg-[#28282D] active:scale-95 transition-all"
              >
                <Mail className="h-4 w-4" />
                <span>Simulate Archive Student</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSnackbarMessage('Grade batch saved successfully.');
                  setSnackbarOpen(true);
                }}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-[#202024] px-4 text-xs font-medium text-zinc-200 hover:bg-[#28282D] active:scale-95 transition-all"
              >
                <Check className="h-4 w-4 text-emerald-400" />
                <span>Simulate Batch Save</span>
              </button>
            </div>
          </div>

          {/* COMPONENT 2: BOTTOM SHEET */}
          <div className={cn('rounded-2xl border p-5', isDark ? 'border-white/10 bg-[#161619]' : 'border-slate-200 bg-white')}>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-medium text-emerald-400">02. BOTTOM SHEET</span>
                <h3 className="text-base font-semibold">Contextual Action Panel</h3>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[11px] text-zinc-400">
                Google Maps Paradigm
              </span>
            </div>
            <p className="mt-2 text-xs text-zinc-400">
              A panel sliding from the bottom edge to show options or item details without leaving the current screen.
            </p>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-[#202024] px-4 text-xs font-medium text-zinc-200 hover:bg-[#28282D] active:scale-95 transition-all"
              >
                <MapPin className="h-4 w-4 text-emerald-400" />
                <span>Open Campus Details Sheet</span>
              </button>
            </div>
          </div>

          {/* COMPONENT 3: DIALOG */}
          <div className={cn('rounded-2xl border p-5', isDark ? 'border-white/10 bg-[#161619]' : 'border-slate-200 bg-white')}>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-medium text-emerald-400">03. DIALOG</span>
                <h3 className="text-base font-semibold">Critical Confirmation Interrupt</h3>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[11px] text-zinc-400">
                WhatsApp Paradigm
              </span>
            </div>
            <p className="mt-2 text-xs text-zinc-400">
              A modal box that pauses flow to confirm high-risk or irreversible operations.
            </p>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => setDialogOpen(true)}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 text-xs font-medium text-red-400 hover:bg-red-500/20 active:scale-95 transition-all"
              >
                <span>Trigger Delete Dialog</span>
              </button>
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
          </div>

          {/* COMPONENT 4: BOTTOM NAV */}
          <div className={cn('rounded-2xl border p-5', isDark ? 'border-white/10 bg-[#161619]' : 'border-slate-200 bg-white')}>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-medium text-emerald-400">04. BOTTOM NAV</span>
                <h3 className="text-base font-semibold">Thumb Navigation Bar</h3>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[11px] text-zinc-400">
                Spotify Paradigm
              </span>
            </div>
            <p className="mt-2 text-xs text-zinc-400">
              Fixed bar anchored where the thumb rests, switching between 3 to 5 core app destinations.
            </p>
            <div className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-[#121214] p-2">
              <LibraryBottomNav
                items={navItems}
                activeId={activeTab}
                onSelect={setActiveTab}
                className="relative border-none bg-transparent"
              />
            </div>
          </div>

          {/* COMPONENT 5: TOGGLE SWITCH */}
          <div className={cn('rounded-2xl border p-5', isDark ? 'border-white/10 bg-[#161619]' : 'border-slate-200 bg-white')}>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-medium text-emerald-400">05. TOGGLE SWITCH</span>
                <h3 className="text-base font-semibold">Instant Binary State Control</h3>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[11px] text-zinc-400">
                iPhone Settings Paradigm
              </span>
            </div>
            <p className="mt-2 text-xs text-zinc-400">
              Flip between on/off states instantly like a light switch with 44px touch targets.
            </p>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-[#202024] px-4 py-2.5">
                <span className="text-xs font-medium text-zinc-200">Airplane Mode</span>
                <LibrarySwitch checked={airplaneMode} onCheckedChange={setAirplaneMode} />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-[#202024] px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-zinc-400" />
                  <span className="text-xs font-medium text-zinc-200">Campus Wi-Fi Sync</span>
                </div>
                <LibrarySwitch checked={wifiEnabled} onCheckedChange={setWifiEnabled} />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-[#202024] px-4 py-2.5">
                <span className="text-xs font-medium text-zinc-200">Push Notifications</span>
                <LibrarySwitch checked={notifications} onCheckedChange={setNotifications} />
              </div>
            </div>
          </div>

          {/* COMPONENT 6: CHIPS */}
          <div className={cn('rounded-2xl border p-5', isDark ? 'border-white/10 bg-[#161619]' : 'border-slate-200 bg-white')}>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-medium text-emerald-400">06. CHIPS</span>
                <h3 className="text-base font-semibold">Tappable Filter Tokens</h3>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[11px] text-zinc-400">
                YouTube Paradigm
              </span>
            </div>
            <p className="mt-2 text-xs text-zinc-400">
              Small rounded tags used to filter feeds or pick options, easy to tap like poker chips.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
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
            <div className="mt-3 font-mono text-[11px] text-zinc-500">
              Active Category: <span className="text-emerald-400">{selectedChip}</span>
            </div>
          </div>

          {/* COMPONENT 7: FAB */}
          <div className={cn('rounded-2xl border p-5', isDark ? 'border-white/10 bg-[#161619]' : 'border-slate-200 bg-white')}>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-medium text-emerald-400">07. FAB</span>
                <h3 className="text-base font-semibold">Floating Action Button</h3>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[11px] text-zinc-400">
                Google Calendar Paradigm
              </span>
            </div>
            <p className="mt-2 text-xs text-zinc-400">
              Circular button floating above content for the one primary action, always in thumb reach.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <LibraryFab
                onClick={() => setFabCount((c) => c + 1)}
                icon={<Plus className="h-6 w-6" />}
              />
              <LibraryFab
                variant="secondary"
                label="New Event"
                onClick={() => setFabCount((c) => c + 1)}
                icon={<Calendar className="h-5 w-5" />}
              />
              <div className="font-mono text-xs text-zinc-400">
                Actions Triggered: <span className="font-bold text-emerald-400">{fabCount}</span>
              </div>
            </div>
          </div>

          {/* COMPONENT 8: CARD */}
          <div className={cn('rounded-2xl border p-5', isDark ? 'border-white/10 bg-[#161619]' : 'border-slate-200 bg-white')}>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-medium text-emerald-400">08. CARD</span>
                <h3 className="text-base font-semibold">Self-Contained Content Unit</h3>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[11px] text-zinc-400">
                Airbnb Paradigm
              </span>
            </div>
            <p className="mt-2 text-xs text-zinc-400">
              A box grouping photo, title, meta details, and price into one tappable rectangle.
            </p>
            <div className="mt-4">
              <LibraryCard interactive onClick={() => setCardLiked((l) => !l)}>
                <LibraryCardMedia>
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1C1C20] to-[#28282D]">
                    <div className="flex items-center gap-2 font-mono text-xs text-zinc-400">
                      <Sparkles className="h-4 w-4 text-emerald-400" />
                      <span>Classroom Block A · Lab 4</span>
                    </div>
                  </div>
                </LibraryCardMedia>
                <LibraryCardHeader>
                  <div>
                    <LibraryCardTitle>Robotics & Autonomous Systems</LibraryCardTitle>
                    <LibraryCardDescription>Grade 11 · Term 1 Curricular Track</LibraryCardDescription>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCardLiked((l) => !l);
                    }}
                    className="p-1 text-zinc-400 hover:text-amber-400"
                  >
                    <Star className={cn('h-4 w-4', cardLiked && 'fill-amber-400 text-amber-400')} />
                  </button>
                </LibraryCardHeader>
                <LibraryCardFooter>
                  <span className="font-mono text-xs text-zinc-400">32 Seats Enrolled</span>
                  <span className="font-mono text-xs font-semibold text-emerald-400">$350 / Term</span>
                </LibraryCardFooter>
              </LibraryCard>
            </div>
          </div>

          {/* COMPONENT 9: DROPDOWN */}
          <div className={cn('rounded-2xl border p-5', isDark ? 'border-white/10 bg-[#161619]' : 'border-slate-200 bg-white')}>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-medium text-emerald-400">09. DROPDOWN</span>
                <h3 className="text-base font-semibold">Roller Blind Choice Menu</h3>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[11px] text-zinc-400">
                Google Docs Paradigm
              </span>
            </div>
            <p className="mt-2 text-xs text-zinc-400">
              A button opening a clean list of choices, tucking away without cluttering the screen.
            </p>
            <div className="mt-4">
              <LibraryDropdown
                label="Typography Family"
                options={fontOptions}
                value={selectedFont}
                onChange={setSelectedFont}
              />
            </div>
          </div>

          {/* COMPONENT 10: TOOLTIP */}
          <div className={cn('rounded-2xl border p-5', isDark ? 'border-white/10 bg-[#161619]' : 'border-slate-200 bg-white')}>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-medium text-emerald-400">10. TOOLTIP</span>
                <h3 className="text-base font-semibold">Hover Action Label & Shortcut</h3>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[11px] text-zinc-400">
                Figma Paradigm
              </span>
            </div>
            <p className="mt-2 text-xs text-zinc-400">
              A tiny label appearing on hover or focus explaining what a tool does with keyboard shortcuts.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <LibraryTooltip content="Move tool" shortcut="V">
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#202024] text-zinc-300 hover:bg-[#28282D] hover:text-white"
                >
                  <span className="font-mono text-sm font-semibold">V</span>
                </button>
              </LibraryTooltip>
              <LibraryTooltip content="Hand / Pan viewport" shortcut="H">
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#202024] text-zinc-300 hover:bg-[#28282D] hover:text-white"
                >
                  <span className="font-mono text-sm font-semibold">H</span>
                </button>
              </LibraryTooltip>
              <LibraryTooltip content="Rectangle vector" shortcut="R">
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#202024] text-zinc-300 hover:bg-[#28282D] hover:text-white"
                >
                  <span className="font-mono text-sm font-semibold">R</span>
                </button>
              </LibraryTooltip>
              <LibraryTooltip content="Text frame tool" shortcut="T">
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#202024] text-zinc-300 hover:bg-[#28282D] hover:text-white"
                >
                  <span className="font-mono text-sm font-semibold">T</span>
                </button>
              </LibraryTooltip>
            </div>
          </div>
        </div>
      </div>

      {/* Mathematical Tokens & Dark UI Rules Spec Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/60">
        <h3 className="font-mono text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-zinc-500">
          MATHEMATICAL DESIGN SPECIFICATIONS & TOKENS
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">01. INNER RADIUS</span>
            <div className="mt-1 font-mono text-sm font-semibold text-slate-900 dark:text-zinc-100">
              R_inner = R_outer - Padding
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
              Ensures concentric geometric curves (e.g. 16px outer - 4px padding = 12px inner).
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">02. LINE HEIGHT</span>
            <div className="mt-1 font-mono text-sm font-semibold text-slate-900 dark:text-zinc-100">
              Line Height = Font Size × 1.4 – 1.6
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
              Optimal optical cadence preventing visual line collision across dark themes.
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">03. TOUCH TARGET</span>
            <div className="mt-1 font-mono text-sm font-semibold text-slate-900 dark:text-zinc-100">
              Minimum 44 × 44px
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
              Thumb ergonomic accessibility standard across buttons, toggles, chips, and nav items.
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">04. ELEVATION DEPTH</span>
            <div className="mt-1 font-mono text-sm font-semibold text-slate-900 dark:text-zinc-100">
              Zero Shadows · Surface Luminance
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400">
              L0 (#121214) &rarr; L1 (#161619) &rarr; L2 (#202024) &rarr; L3 (#28282D).
            </p>
          </div>
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
          <p className="text-sm text-zinc-300">
            Located in Academic Building B, 2nd Floor. Fully equipped with dual robotic testbenches and high-speed telemetry terminals.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/5 bg-[#202024] p-3 text-center">
              <span className="font-mono text-xs text-zinc-400">CAPACITY</span>
              <div className="mt-0.5 text-base font-semibold text-zinc-100">45 Students</div>
            </div>
            <div className="rounded-xl border border-white/5 bg-[#202024] p-3 text-center">
              <span className="font-mono text-xs text-zinc-400">STATUS</span>
              <div className="mt-0.5 text-base font-semibold text-emerald-400">Active Session</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSheetOpen(false)}
            className="flex h-11 w-full items-center justify-center rounded-xl bg-emerald-600 text-xs font-medium text-white hover:bg-emerald-500 transition-colors"
          >
            Close Sheet
          </button>
        </div>
      </LibraryBottomSheet>
    </div>
  );
}
