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

  return (
    <div className="space-y-10 text-slate-900">
      {/* Top Header / Document Introduction */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="rounded-md border border-blue-200 bg-blue-50 px-2.5 py-0.5 font-mono text-xs font-semibold text-[#023e8a]">
            Developer Documentation · UI Component Library
          </span>
          <span className="text-slate-300">·</span>
          <span className="font-mono text-xs text-slate-500">10 Core UI Components Standard</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
          10 Core UI Components & Design System
        </h1>
        <p className="max-w-4xl text-sm text-slate-600 sm:text-base leading-relaxed">
          Authoritative interactive specifications, mental models, and real-world paradigms for the 10 foundational UI components in the SNP-SMS platform. Styled using the default clean white document standard.
        </p>

        {/* Quick Jump Bar */}
        <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3.5 font-mono text-xs text-slate-700">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="font-bold text-slate-900">COMPONENTS:</span>
            <a href="#comp-snackbar" className="text-[#023e8a] hover:underline">1. Snackbar</a>
            <a href="#comp-bottom-sheet" className="text-[#023e8a] hover:underline">2. Bottom Sheet</a>
            <a href="#comp-dialog" className="text-[#023e8a] hover:underline">3. Dialog</a>
            <a href="#comp-bottom-nav" className="text-[#023e8a] hover:underline">4. Bottom Nav</a>
            <a href="#comp-switch" className="text-[#023e8a] hover:underline">5. Toggle Switch</a>
            <a href="#comp-chip" className="text-[#023e8a] hover:underline">6. Chips</a>
            <a href="#comp-fab" className="text-[#023e8a] hover:underline">7. FAB</a>
            <a href="#comp-card" className="text-[#023e8a] hover:underline">8. Card</a>
            <a href="#comp-dropdown" className="text-[#023e8a] hover:underline">9. Dropdown</a>
            <a href="#comp-tooltip" className="text-[#023e8a] hover:underline">10. Tooltip</a>
          </div>
        </div>
      </div>

      {/* 10 Components Interactive Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* COMPONENT 1: SNACKBAR */}
        <div id="comp-snackbar" className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-[#023e8a]">01. SNACKBAR</span>
              <h3 className="text-base font-bold text-slate-950">Quick Action Confirmation</h3>
            </div>
            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[11px] text-slate-600">
              Gmail Paradigm
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            A small bar that pops up at the bottom to confirm what you just did, then fades away after a few seconds. Includes an instant Undo action.
          </p>

          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <span className="mb-2 block font-mono text-[11px] font-semibold text-slate-500 uppercase">Interactive Demo</span>
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setSnackbarMessage('Student profile archived.');
                  setSnackbarOpen(true);
                }}
                className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 text-xs font-medium text-slate-800 shadow-xs hover:bg-slate-50 transition-colors"
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
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#023e8a] px-3.5 text-xs font-medium text-white shadow-xs hover:bg-[#00509d] transition-colors"
              >
                <Check className="h-4 w-4" />
                <span>Simulate Batch Save</span>
              </button>
            </div>
          </div>
        </div>

        {/* COMPONENT 2: BOTTOM SHEET */}
        <div id="comp-bottom-sheet" className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-[#023e8a]">02. BOTTOM SHEET</span>
              <h3 className="text-base font-bold text-slate-950">Contextual Action Panel</h3>
            </div>
            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[11px] text-slate-600">
              Google Maps Paradigm
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            A panel sliding up from the bottom edge to reveal more options, details, or maps without forcing the user to leave the current screen.
          </p>

          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <span className="mb-2 block font-mono text-[11px] font-semibold text-slate-500 uppercase">Interactive Demo</span>
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#023e8a] px-3.5 text-xs font-medium text-white shadow-xs hover:bg-[#00509d] transition-colors"
            >
              <MapPin className="h-4 w-4" />
              <span>Open Campus Details Sheet</span>
            </button>
          </div>
        </div>

        {/* COMPONENT 3: DIALOG */}
        <div id="comp-dialog" className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-[#023e8a]">03. DIALOG</span>
              <h3 className="text-base font-bold text-slate-950">Critical Confirmation Interrupt</h3>
            </div>
            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[11px] text-slate-600">
              WhatsApp Paradigm
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            A modal dialogue interrupting the user flow to confirm high-risk, irreversible operations like permanent deletions.
          </p>

          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <span className="mb-2 block font-mono text-[11px] font-semibold text-slate-500 uppercase">Interactive Demo</span>
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 text-xs font-semibold text-red-700 shadow-xs hover:bg-red-100 transition-colors"
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
        <div id="comp-bottom-nav" className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-[#023e8a]">04. BOTTOM NAV</span>
              <h3 className="text-base font-bold text-slate-950">Thumb Navigation Bar</h3>
            </div>
            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[11px] text-slate-600">
              Spotify Paradigm
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            A persistent bar at the bottom for jumping between 3 to 5 core application areas, right where the thumb naturally rests.
          </p>

          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/50 p-3">
            <span className="mb-2 block font-mono text-[11px] font-semibold text-slate-500 uppercase">Interactive Demo</span>
            <LibraryBottomNav
              items={navItems}
              activeId={activeTab}
              onSelect={setActiveTab}
            />
            <div className="mt-2 text-center font-mono text-xs text-slate-500">
              Active Screen: <span className="font-bold text-[#023e8a] uppercase">{activeTab}</span>
            </div>
          </div>
        </div>

        {/* COMPONENT 5: TOGGLE SWITCH */}
        <div id="comp-switch" className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-[#023e8a]">05. TOGGLE SWITCH</span>
              <h3 className="text-base font-bold text-slate-950">Instant Binary State Control</h3>
            </div>
            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[11px] text-slate-600">
              iPhone Settings Paradigm
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            An on or off control for a setting that applies instantly without requiring an extra "Save" click, like a wall light switch.
          </p>

          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4 space-y-2.5">
            <span className="block font-mono text-[11px] font-semibold text-slate-500 uppercase">Interactive Demo</span>
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
        </div>

        {/* COMPONENT 6: CHIPS */}
        <div id="comp-chip" className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-[#023e8a]">06. CHIPS</span>
              <h3 className="text-base font-bold text-slate-950">Tappable Filter Tokens</h3>
            </div>
            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[11px] text-slate-600">
              YouTube Paradigm
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Small, rounded, easy-to-tap tags used to filter lists or select from a compact set of options, shaped like poker chips.
          </p>

          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <span className="mb-2 block font-mono text-[11px] font-semibold text-slate-500 uppercase">Interactive Demo</span>
            <div className="flex flex-wrap gap-2">
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
            <div className="mt-3 font-mono text-xs text-slate-500">
              Selected: <span className="font-semibold text-[#023e8a]">{selectedChip}</span>
            </div>
          </div>
        </div>

        {/* COMPONENT 7: FAB */}
        <div id="comp-fab" className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-[#023e8a]">07. FAB (FLOATING ACTION BUTTON)</span>
              <h3 className="text-base font-bold text-slate-950">Primary Screen Action</h3>
            </div>
            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[11px] text-slate-600">
              Google Calendar Paradigm
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            A round button for the one main action on a screen, floating above content like a lifebuoy within comfortable thumb reach.
          </p>

          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <span className="mb-2 block font-mono text-[11px] font-semibold text-slate-500 uppercase">Interactive Demo</span>
            <div className="flex flex-wrap items-center gap-4">
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
                Actions Clicked: <span className="font-bold text-[#023e8a]">{fabCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* COMPONENT 8: CARD */}
        <div id="comp-card" className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-[#023e8a]">08. CARD</span>
              <h3 className="text-base font-bold text-slate-950">Self-Contained Content Unit</h3>
            </div>
            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[11px] text-slate-600">
              Airbnb Paradigm
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            A clean rectangular box grouping related information—such as a visual graphic, title, meta details, and price—into one tappable item.
          </p>

          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <span className="mb-2 block font-mono text-[11px] font-semibold text-slate-500 uppercase">Interactive Demo</span>
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
                  <LibraryCardDescription>Grade 11 · Term 1 Curricular Track</LibraryCardDescription>
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
        </div>

        {/* COMPONENT 9: DROPDOWN */}
        <div id="comp-dropdown" className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-[#023e8a]">09. DROPDOWN</span>
              <h3 className="text-base font-bold text-slate-950">Roller Blind Choice Menu</h3>
            </div>
            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[11px] text-slate-600">
              Google Docs Paradigm
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            A button opening a clean list of choices like a roller blind, letting users pick an option and tucking away without cluttering the screen.
          </p>

          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <span className="mb-2 block font-mono text-[11px] font-semibold text-slate-500 uppercase">Interactive Demo</span>
            <LibraryDropdown
              label="Typography Family"
              options={fontOptions}
              value={selectedFont}
              onChange={setSelectedFont}
            />
          </div>
        </div>

        {/* COMPONENT 10: TOOLTIP */}
        <div id="comp-tooltip" className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-xs font-bold text-[#023e8a]">10. TOOLTIP</span>
              <h3 className="text-base font-bold text-slate-950">Hover Action Label & Shortcut</h3>
            </div>
            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[11px] text-slate-600">
              Figma Paradigm
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            A tiny label appearing when you hover or focus, explaining what a tool does and providing its keyboard shortcut.
          </p>

          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <span className="mb-2 block font-mono text-[11px] font-semibold text-slate-500 uppercase">Interactive Demo</span>
            <div className="flex flex-wrap items-center gap-3">
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
          </div>
        </div>
      </div>

      {/* Mathematical Tokens & Specifications Card */}
      <section className="border-t border-slate-200 pt-8 space-y-4">
        <h2 className="text-base font-bold tracking-tight text-slate-950">
          Design Specifications & Mathematical Tokens
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="font-mono text-xs font-bold text-[#023e8a]">01. INNER RADIUS</span>
            <div className="mt-1 font-mono text-sm font-bold text-slate-950">
              R_inner = R_outer - Padding
            </div>
            <p className="mt-1 text-xs text-slate-600">
              Ensures concentric curves between cards and internal buttons.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="font-mono text-xs font-bold text-[#023e8a]">02. LINE HEIGHT</span>
            <div className="mt-1 font-mono text-sm font-bold text-slate-950">
              Font Size × 1.4 – 1.6
            </div>
            <p className="mt-1 text-xs text-slate-600">
              Optimal reading rhythm and line density across documentation.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="font-mono text-xs font-bold text-[#023e8a]">03. TOUCH TARGET</span>
            <div className="mt-1 font-mono text-sm font-bold text-slate-950">
              Minimum 44 × 44px
            </div>
            <p className="mt-1 text-xs text-slate-600">
              Meets WCAG AA accessibility standards across all interactive controls.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <span className="font-mono text-xs font-bold text-[#023e8a]">04. COLOR CONTRAST</span>
            <div className="mt-1 font-mono text-sm font-bold text-slate-950">
              (L1 + 0.05) / (L2 + 0.05) ≥ 4.5:1
            </div>
            <p className="mt-1 text-xs text-slate-600">
              Strict WCAG AA contrast ratio between text and white background.
            </p>
          </div>
        </div>
      </section>

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
          <p className="text-sm text-slate-600 leading-relaxed">
            Located in Academic Building B, 2nd Floor. Fully equipped with dual robotic testbenches and high-speed telemetry terminals.
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
            className="flex h-10 w-full items-center justify-center rounded-lg bg-[#023e8a] text-xs font-medium text-white hover:bg-[#00509d] transition-colors"
          >
            Close Sheet
          </button>
        </div>
      </LibraryBottomSheet>
    </div>
  );
}
