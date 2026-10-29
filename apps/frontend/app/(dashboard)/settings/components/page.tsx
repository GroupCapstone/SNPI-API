'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Award,
  BookOpen,
  Calendar,
  ChevronLeft,
  CircleDollarSign,
  GraduationCap,
  Home,
  Info,
  Layers,
  Move,
  Plane,
  Plus,
  Search,
  Settings,
  Sparkles,
  Trash2,
  Undo2,
  User,
  Users,
} from '@/components/icons';
import {
  BottomNav,
  BottomSheet,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Chip,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dropdown,
  Fab,
  Snackbar,
  Switch,
  Tooltip,
} from '@/components/ui';

export default function UIComponentsGuidePage() {
  // State for Component 1: Snackbar
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('Message archived to inbox');

  // State for Component 2: Bottom Sheet
  const [sheetOpen, setSheetOpen] = React.useState(false);

  // State for Component 3: Dialog
  const [dialogOpen, setDialogOpen] = React.useState(false);

  // State for Component 4: Bottom Nav (Preview)
  const [activeBottomNav, setActiveBottomNav] = React.useState('/dashboard');

  // State for Component 5: Toggle Switch
  const [airplaneMode, setAirplaneMode] = React.useState(false);
  const [wifiState, setWifiState] = React.useState(true);

  // State for Component 6: Chips
  const [selectedChip, setSelectedChip] = React.useState('All');
  const [dismissableVisible, setDismissableVisible] = React.useState(true);

  // State for Component 7: FAB
  const [fabCount, setFabCount] = React.useState(0);

  // State for Component 9: Dropdown
  const [selectedFont, setSelectedFont] = React.useState('roboto');

  const FONT_OPTIONS = [
    { value: 'roboto', label: 'Roboto (Google Default)' },
    { value: 'arial', label: 'Arial (Classic Sans)' },
    { value: 'lora', label: 'Lora (Editorial Serif)' },
    { value: 'georgia', label: 'Georgia (Humanist Serif)' },
  ];

  const BOTTOM_NAV_ITEMS = [
    { label: 'Home', href: '/dashboard', icon: Home },
    { label: 'Search', href: '/search', icon: Search },
    { label: 'Library', href: '/library', icon: BookOpen },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="space-y-8 pb-24">
      {/* Page Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href="/settings"
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <ChevronLeft className="size-4" />
            <span>Back to Settings</span>
          </Link>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-zinc-100">
              10 Core UI Components Guide
            </h1>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Design Standards
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
            Interactive reference and live design standard adhering to Dark UI rules: flat style, zero shadows, luminance elevation, and 44x44px touch targets.
          </p>
        </div>
      </div>

      {/* Grid of 10 UI Components */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Component 1: Snackbar */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Component 01
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
                Seen in Gmail
              </span>
            </div>
            <CardTitle className="text-xl">1. Snackbar</CardTitle>
            <CardDescription>
              A small message that pops up at the bottom to confirm what you just did, then fades away.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-slate-200/70 bg-slate-50/50 p-3 text-xs text-slate-600 dark:border-white/5 dark:bg-[#161619] dark:text-zinc-300">
              <span className="font-semibold text-slate-900 dark:text-zinc-100">Why the name?</span> A quick bite of info: small, light, gone in seconds. Its older cousin, the toast, pops up like toast.
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSnackbarMessage('Email archived to inbox folder');
                  setSnackbarOpen(true);
                }}
              >
                Trigger Snackbar (Archive)
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSnackbarMessage('Student record saved successfully');
                  setSnackbarOpen(true);
                }}
              >
                Trigger Snackbar (Save)
              </Button>
            </div>
          </CardContent>
          <CardFooter className="text-xs text-slate-400 dark:text-zinc-500">
            Surface: Level 2 (#202024) | Auto-dismiss: 5000ms | Action: Undo
          </CardFooter>
        </Card>

        {/* Component 2: Bottom Sheet */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Component 02
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
                Seen in Google Maps
              </span>
            </div>
            <CardTitle className="text-xl">2. Bottom Sheet</CardTitle>
            <CardDescription>
              A panel that slides up from the bottom to show more options without leaving the screen.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-slate-200/70 bg-slate-50/50 p-3 text-xs text-slate-600 dark:border-white/5 dark:bg-[#161619] dark:text-zinc-300">
              <span className="font-semibold text-slate-900 dark:text-zinc-100">Why the name?</span> Like pulling a bedsheet up: it slides up from the bottom edge and covers part of the screen. Tap a place and details slide up.
            </div>
            <Button onClick={() => setSheetOpen(true)}>
              Open Bottom Sheet Panel
            </Button>
          </CardContent>
          <CardFooter className="text-xs text-slate-400 dark:text-zinc-500">
            Surface: Level 2 (#202024) | Grab Handle: 36x4px | Radius: 16px Top
          </CardFooter>
        </Card>

        {/* Component 3: Dialog */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Component 03
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
                Seen in WhatsApp
              </span>
            </div>
            <CardTitle className="text-xl">3. Dialog</CardTitle>
            <CardDescription>
              A box that interrupts you to confirm something important or risky.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-slate-200/70 bg-slate-50/50 p-3 text-xs text-slate-600 dark:border-white/5 dark:bg-[#161619] dark:text-zinc-300">
              <span className="font-semibold text-slate-900 dark:text-zinc-100">Why the name?</span> From the Greek for conversation: the app pauses everything to have a quick word with you before anything disappears.
            </div>
            <Button
              variant="outline"
              className="text-rose-500 hover:border-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
              onClick={() => setDialogOpen(true)}
            >
              <Trash2 className="mr-2 size-4" />
              Delete Message (Confirm)
            </Button>
          </CardContent>
          <CardFooter className="text-xs text-slate-400 dark:text-zinc-500">
            Surface: Level 2 (#202024) | Backdrop: blur-xs | Zero Shadow
          </CardFooter>
        </Card>

        {/* Component 4: Bottom Nav */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Component 04
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
                Seen in Spotify
              </span>
            </div>
            <CardTitle className="text-xl">4. Bottom Nav</CardTitle>
            <CardDescription>
              A bar at the bottom for jumping between the 3 to 5 main areas of an app.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-slate-200/70 bg-slate-50/50 p-3 text-xs text-slate-600 dark:border-white/5 dark:bg-[#161619] dark:text-zinc-300">
              <span className="font-semibold text-slate-900 dark:text-zinc-100">Why the name?</span> Navigation placed at the bottom, right where your thumb already rests. Home, Search and Library are always one tap away.
            </div>
            {/* Embedded Container Preview */}
            <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-[#161619]">
              <div className="flex h-14 items-center justify-around">
                {BOTTOM_NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeBottomNav === item.href;
                  return (
                    <button
                      key={item.href}
                      type="button"
                      onClick={() => setActiveBottomNav(item.href)}
                      className={`flex flex-col items-center gap-1 px-3 py-1 text-xs transition-colors ${
                        isActive
                          ? 'font-medium text-emerald-500 dark:text-emerald-400'
                          : 'text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                      }`}
                    >
                      <Icon className="size-4" />
                      <span className="text-[10px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-xs text-slate-400 dark:text-zinc-500">
            Height: 64px | Destinations: 3–5 items | Thumb ergonomics
          </CardFooter>
        </Card>

        {/* Component 5: Toggle Switch */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Component 05
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
                Seen in iPhone Settings
              </span>
            </div>
            <CardTitle className="text-xl">5. Toggle Switch</CardTitle>
            <CardDescription>
              An on or off control for a setting that applies instantly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-slate-200/70 bg-slate-50/50 p-3 text-xs text-slate-600 dark:border-white/5 dark:bg-[#161619] dark:text-zinc-300">
              <span className="font-semibold text-slate-900 dark:text-zinc-100">Why the name?</span> To toggle is to flip between two states, just like a light switch. Flip Airplane Mode and everything switches right away.
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-white/10">
                <div className="flex items-center gap-2.5">
                  <Plane className="size-4 text-slate-500 dark:text-zinc-400" />
                  <span className="text-sm font-medium text-slate-800 dark:text-zinc-200">
                    Airplane Mode
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-zinc-400">
                    {airplaneMode ? 'ON' : 'OFF'}
                  </span>
                  <Switch checked={airplaneMode} onCheckedChange={setAirplaneMode} />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3 dark:border-white/10">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="size-4 text-slate-500 dark:text-zinc-400" />
                  <span className="text-sm font-medium text-slate-800 dark:text-zinc-200">
                    Wi-Fi Connection
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-zinc-400">
                    {wifiState ? 'ON' : 'OFF'}
                  </span>
                  <Switch checked={wifiState} onCheckedChange={setWifiState} />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-xs text-slate-400 dark:text-zinc-500">
            Track: 48x28px | Active: Emerald-500 | Min Target: 44x44px
          </CardFooter>
        </Card>

        {/* Component 6: Chips */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Component 06
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
                Seen in YouTube
              </span>
            </div>
            <CardTitle className="text-xl">6. Chips</CardTitle>
            <CardDescription>
              Small tappable tags used to filter or pick from a few options.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-slate-200/70 bg-slate-50/50 p-3 text-xs text-slate-600 dark:border-white/5 dark:bg-[#161619] dark:text-zinc-300">
              <span className="font-semibold text-slate-900 dark:text-zinc-100">Why the name?</span> Small, rounded and easy to pick up, a bit like poker chips on a table. Tap Music or Gaming at the top to filter your home feed.
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {['All', 'Music', 'Gaming', 'Academics', 'Finance'].map((label) => (
                <Chip
                  key={label}
                  active={selectedChip === label}
                  onClick={() => setSelectedChip(label)}
                >
                  {label}
                </Chip>
              ))}

              {dismissableVisible && (
                <Chip
                  active={false}
                  onDismiss={() => setDismissableVisible(false)}
                >
                  Filter: Grade 10
                </Chip>
              )}
            </div>
          </CardContent>
          <CardFooter className="text-xs text-slate-400 dark:text-zinc-500">
            Height: 32px | Radius: Full Pill (9999px) | Min Target: 44x44px
          </CardFooter>
        </Card>

        {/* Component 7: FAB (Floating Action Button) */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Component 07
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
                Seen in Google Calendar
              </span>
            </div>
            <CardTitle className="text-xl">7. FAB</CardTitle>
            <CardDescription>
              Floating action button: a round button for the one main action on a screen.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-slate-200/70 bg-slate-50/50 p-3 text-xs text-slate-600 dark:border-white/5 dark:bg-[#161619] dark:text-zinc-300">
              <span className="font-semibold text-slate-900 dark:text-zinc-100">Why the name?</span> It floats above everything else like a lifebuoy, always within reach of your thumb. The plus button starts a new event.
            </div>

            <div className="flex items-center gap-4">
              <Fab
                icon={<Plus className="size-6" />}
                label="Create Event"
                onClick={() => setFabCount((c) => c + 1)}
                className="static! transform-none!"
              />
              <span className="text-xs text-slate-600 dark:text-zinc-300">
                Triggered: <span className="font-semibold text-emerald-500">{fabCount} times</span>
              </span>
            </div>
          </CardContent>
          <CardFooter className="text-xs text-slate-400 dark:text-zinc-500">
            Size: 56x56px circular | Accent: Sky-500 | Thumb target
          </CardFooter>
        </Card>

        {/* Component 8: Card */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Component 08
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
                Seen in Airbnb
              </span>
            </div>
            <CardTitle className="text-xl">8. Card</CardTitle>
            <CardDescription>
              A box that groups related info, like a photo, title and price, into one tappable unit.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-slate-200/70 bg-slate-50/50 p-3 text-xs text-slate-600 dark:border-white/5 dark:bg-[#161619] dark:text-zinc-300">
              <span className="font-semibold text-slate-900 dark:text-zinc-100">Why the name?</span> It looks like a playing card or a postcard: one small rectangle holding one idea. Every stay is a card: photo, title, price.
            </div>

            {/* Example Card Box */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-slate-300 dark:border-white/10 dark:bg-[#161619]">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Cosy cabin</h4>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">Siem Reap, Cambodia</p>
                </div>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">$80 / night</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="text-xs text-slate-400 dark:text-zinc-500">
            Surface: Level 1 (#161619) | Radius: 16px | 1px border-white/10
          </CardFooter>
        </Card>

        {/* Component 9: Dropdown */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Component 09
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
                Seen in Google Docs
              </span>
            </div>
            <CardTitle className="text-xl">9. Dropdown</CardTitle>
            <CardDescription>
              A button that opens a list of choices so you can pick one without cluttering the screen.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-slate-200/70 bg-slate-50/50 p-3 text-xs text-slate-600 dark:border-white/5 dark:bg-[#161619] dark:text-zinc-300">
              <span className="font-semibold text-slate-900 dark:text-zinc-100">Why the name?</span> Tap it and the list drops down like a pull-down roller blind, then tucks away again. Pick a font from a list that drops down.
            </div>

            <Dropdown
              options={FONT_OPTIONS}
              value={selectedFont}
              onChange={setSelectedFont}
              placeholder="Pick a typography font..."
            />
          </CardContent>
          <CardFooter className="text-xs text-slate-400 dark:text-zinc-500">
            Surface: Level 2 (#202024) | Trigger: 44px height | Radius: 8px
          </CardFooter>
        </Card>

        {/* Component 10: Tooltip */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Component 10
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-zinc-800 dark:text-zinc-300">
                Seen in Figma
              </span>
            </div>
            <CardTitle className="text-xl">10. Tooltip</CardTitle>
            <CardDescription>
              A tiny label that appears when you hover or press and hold, explaining what something does.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-slate-200/70 bg-slate-50/50 p-3 text-xs text-slate-600 dark:border-white/5 dark:bg-[#161619] dark:text-zinc-300">
              <span className="font-semibold text-slate-900 dark:text-zinc-100">Why the name?</span> A tip about a tool. Hover a tool and a tiny label tells you what it does, like Move (V).
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Tooltip content="Move tool (V)" position="top">
                <Button variant="outline" size="icon">
                  <Move className="size-4" />
                </Button>
              </Tooltip>

              <Tooltip content="Quick Info & Details" position="top">
                <Button variant="outline" size="icon">
                  <Info className="size-4" />
                </Button>
              </Tooltip>

              <Tooltip content="System Settings (Cmd+,)" position="right">
                <Button variant="outline" size="icon">
                  <Settings className="size-4" />
                </Button>
              </Tooltip>
            </div>
          </CardContent>
          <CardFooter className="text-xs text-slate-400 dark:text-zinc-500">
            Surface: Level 3 (#2E2E33) | Text: 12px | Radius: 6px | Zero Shadow
          </CardFooter>
        </Card>
      </div>

      {/* Interactive Bottom Sheet Instance */}
      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Cafe Rosa Directions & Details"
      >
        <div className="space-y-4 py-2">
          <p className="text-sm text-slate-600 dark:text-zinc-300">
            Cafe Rosa is located along Wat Bo Road. Drag the sheet up to see menu options, opening hours, and parking directions.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setSheetOpen(false);
                setSnackbarMessage('Directions copied to clipboard');
                setSnackbarOpen(true);
              }}
            >
              Copy Directions
            </Button>
            <Button
              onClick={() => {
                setSheetOpen(false);
                setSnackbarMessage('Saved to your favorites');
                setSnackbarOpen(true);
              }}
            >
              Save Place
            </Button>
          </div>
        </div>
      </BottomSheet>

      {/* Interactive Dialog Instance */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete message?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this message? This action pauses everything to verify before anything disappears.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setDialogOpen(false);
                setSnackbarMessage('Message deleted permanently');
                setSnackbarOpen(true);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Interactive Snackbar Instance */}
      <Snackbar
        open={snackbarOpen}
        message={snackbarMessage}
        actionLabel="Undo"
        onAction={() => {
          setSnackbarOpen(false);
        }}
        onClose={() => setSnackbarOpen(false)}
        duration={5000}
      />
    </div>
  );
}
