'use client';

import * as React from 'react';
import {
  BrandConceptBlueprint,
  LibrarySnackbar,
  NativeSnackbarInline,
  type SnackbarVariant,
  BorderBeamInteractiveShowcase,
  LibraryBottomSheet,
  LibraryDialog,
  type LibraryBottomNavItem,
  LibrarySwitch,
  LibraryChip,
  LibraryFab,
  LibraryDropdown,
  LibraryTooltip,
  HangingTabsNav,
  COMPONENT_LIBRARY_REGISTRY,
  COMPONENT_CATEGORIES,
  GeometricButton,
  GeometricInput,
  GeometricHeaderStamp,
  RailTocDemo,
  BounceSidebarDemo,
  HookSidebarDemo,
  ProximitySidebarDemo,
  ScrollProgressDemo,
  GooeyNavDemo,
  DurationPickerDemo,
  OtpInputDemo,
  PasswordInputDemo,
  ThemeSelectorDemo,
  DeleteButtonDemo,
  TaskListDemo,
  ToastDemo,
  EmojiReactionDemo,
  NotificationBellDemo,
  FolderDemo,
  CodeBlockDemo,
  GravityLettersDemo,
  GitHubActivityDemo,
  StepPlayerDemo,
  AnimatedCounterDemo,
  VoiceNoteDemo,
  FaqDemo,
  FluidOrbDemo,
  GridRevealDemo,
  MatrixOrbDemo,
  WebSearchDemo,
  InlineAiStatusDemo,
  CapsuleDockDemo,
  DotPatternDemo,
  RetroGridDemo,
  AuroraWavesDemo,
  InteractiveParticlesDemo,
  TextShimmerDemo,
  NumberTickerDemo,
  GlitchTextDemo,
  BlurInDemo,
  SpotlightCardDemo,
  BentoCardDemo,
  TiltCardDemo,
  BorderBeamDemo,
  HeroSectionDemo,
  FeatureBentoDemo,
  PricingMatrixDemo,
  MarqueeSectionDemo,
  FloatingLabelFormDemo,
  MultiStepWizardDemo,
  FileDropzoneDemo,
  PaymentCardDemo,
  CommandPaletteDemo,
  ConfettiCannonDemo,
  DrawerSheetDemo,
  ImageLightboxDemo,
} from '@/features/document/components/ui-library';
import {
  Home,
  Search,
  Folder,
  Plus,
  MapPin,
  Check,
  Copy,
  Pin,
  Newspaper,
  FilePlus,
  Contacts,
  Eye,
  EyeOff,
  User,
  Smartphone,
  Tablet,
  Monitor,
  Moon,
  Sun,
  Maximize,
  RotateCcw,
} from '@/components/icons';
import { cn } from '@/lib/utils';

export function UiLibraryView() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const isManualScrollRef = React.useRef<boolean>(false);
  const scrollTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Search query to filter components
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  // Per-component tab view state: 'preview' | 'code'
  const [componentTabs, setComponentTabs] = React.useState<Record<string, 'preview' | 'code'>>({});
  const getCompTab = (id: string): 'preview' | 'code' => componentTabs[id] || 'preview';
  const setCompTab = (id: string, tab: 'preview' | 'code') => {
    setComponentTabs((prev) => ({ ...prev, [id]: tab }));
  };

  // Per-component device preview mode: 'mobile' | 'tablet' | 'desktop'
  const [compDeviceModes, setCompDeviceModes] = React.useState<
    Record<string, 'mobile' | 'tablet' | 'desktop'>
  >({});
  const getCompDevice = (id: string): 'mobile' | 'tablet' | 'desktop' =>
    compDeviceModes[id] || 'desktop';
  const setCompDevice = (id: string, mode: 'mobile' | 'tablet' | 'desktop') => {
    setCompDeviceModes((prev) => ({ ...prev, [id]: mode }));
  };

  // Per-component dark / light stage theme mode
  const [compThemeModes, setCompThemeModes] = React.useState<Record<string, 'light' | 'dark'>>({});
  const getCompTheme = (id: string): 'light' | 'dark' => compThemeModes[id] || 'light';
  const toggleCompTheme = (id: string) => {
    setCompThemeModes((prev) => ({
      ...prev,
      [id]: prev[id] === 'dark' ? 'light' : 'dark',
    }));
  };

  // Per-component expanded canvas state
  const [compExpandedModes, setCompExpandedModes] = React.useState<Record<string, boolean>>({});
  const getCompExpanded = (id: string): boolean => compExpandedModes[id] || false;
  const toggleCompExpanded = (id: string) => {
    setCompExpandedModes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Per-component reset keys for re-mounting and tactile refresh
  const [compResetKeys, setCompResetKeys] = React.useState<Record<string, number>>({});
  const [compSpinning, setCompSpinning] = React.useState<Record<string, boolean>>({});
  const getCompResetKey = (id: string): number => compResetKeys[id] || 0;
  const resetComp = (id: string) => {
    setCompResetKeys((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    setCompSpinning((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCompSpinning((prev) => ({ ...prev, [id]: false }));
    }, 600);
  };

  // Hanging tabs demo device mode: 'mobile' | 'tablet' | 'desktop'
  const [hangingNavDevice, setHangingNavDevice] = React.useState<'mobile' | 'tablet' | 'desktop'>(
    'desktop',
  );
  const [hangingNavTheme, setHangingNavTheme] = React.useState<'light' | 'dark'>('light');
  const [hangingNavTabMode, setHangingNavTabMode] = React.useState<'preview' | 'code'>('preview');
  const [hangingNavResetKey, setHangingNavResetKey] = React.useState(0);
  const [hangingNavSpinning, setHangingNavSpinning] = React.useState(false);

  // Active section for Line Tracker
  const [activeSectionId, setActiveSectionId] = React.useState<string>('interactive-feed');

  // Copy tracking states
  const [copiedCodeId, setCopiedCodeId] = React.useState<string | null>(null);
  const [copiedInstallId, setCopiedInstallId] = React.useState<string | null>(null);

  // --- Interactive State for Real Demos in the Feed ---

  // 1. Snackbar state
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMsg, setSnackbarMsg] = React.useState(
    'Student enrollment confirmed for STU-2026-0891.',
  );
  const [snackbarVariant, setSnackbarVariant] = React.useState<SnackbarVariant>('success');

  // 2. Bottom Sheet state
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [bottomSheetChoice, setBottomSheetChoice] = React.useState(
    'Export Student Roster (CSV / PDF)',
  );

  // 3. Dialog state
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogDecision, setDialogDecision] = React.useState('Pending Review');
  const [deferralReason, setDeferralReason] = React.useState('Medical Leave of Absence');

  // 4. Tooltip state
  const [activeTool, setActiveTool] = React.useState('Move Tool (V)');
  const [tooltipPosition, setTooltipPosition] = React.useState<'top' | 'bottom'>('top');

  // 5. FAB state
  const [fabCount, setFabCount] = React.useState(0);
  const [fabSpeedDialOpen, setFabSpeedDialOpen] = React.useState(false);
  const [fabActionCounts, setFabActionCounts] = React.useState({
    student: 4,
    attendance: 28,
    invoice: 12,
    qr: 156,
  });

  // 6. Chip state
  const [selectedChips, setSelectedChips] = React.useState<string[]>([
    'All',
    'Software Engineering',
  ]);

  const toggleChip = (label: string) => {
    if (label === 'All') {
      setSelectedChips(['All']);
      return;
    }
    const withoutAll = selectedChips.filter((c) => c !== 'All');
    if (withoutAll.includes(label)) {
      const next = withoutAll.filter((c) => c !== label);
      setSelectedChips(next.length === 0 ? ['All'] : next);
    } else {
      setSelectedChips([...withoutAll, label]);
    }
  };

  // 7. Toggle Switch states
  const [switchAutoSync, setSwitchAutoSync] = React.useState(true);
  const [switchBiometric, setSwitchBiometric] = React.useState(true);
  const [switchSMSAlerts, setSwitchSMSAlerts] = React.useState(false);
  const [switchAuditLog, setSwitchAuditLog] = React.useState(true);

  // 8. Dropdown state
  const [dropdownValue, setDropdownValue] = React.useState('sora');
  const [dropdownCampus, setDropdownCampus] = React.useState('siem-reap');

  // 9. Bottom Nav state
  const [bottomNavTab, setBottomNavTab] = React.useState('home');
  const [bottomNavBadge, setBottomNavBadge] = React.useState(8);

  const bottomNavItems: LibraryBottomNavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'academics', label: 'Academics', icon: Folder },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // 10. Card interactive states (Folder mode & Metrics mode)
  const [cardPresentationMode, setCardPresentationMode] = React.useState<
    'border-beam' | 'folder' | 'metrics'
  >('border-beam');
  const [cardRevealed, setCardRevealed] = React.useState(false);
  const [cardSlidOut, setCardSlidOut] = React.useState(false);
  const [metricsTimeRange, setMetricsTimeRange] = React.useState<'30D' | '90D' | '1Y' | 'All'>(
    '30D',
  );

  // 11. Hanging Tabs state
  const [hangingNavTab, setHangingNavTab] = React.useState('newswire');
  const [hangingNavSize, setHangingNavSize] = React.useState<'sm' | 'md' | 'lg'>('md');

  // 12. Input & Search state
  const [inputDemoText, setInputDemoText] = React.useState('Dara Sok');
  const [inputDemoVariant, setInputDemoVariant] = React.useState<
    'blue' | 'azure' | 'soft-lavender' | 'black' | 'outline'
  >('blue');
  const [inputDemoSize, setInputDemoSize] = React.useState<'sm' | 'md' | 'lg'>('md');
  const [inputDemoLoading, setInputDemoLoading] = React.useState(false);
  const [inputDemoDisabled, setInputDemoDisabled] = React.useState(false);

  // Section IDs for active tracking in Left Sticky Menu (40 components)
  const scrollSectionIds = React.useMemo(
    () => [
      'ui-library-head',
      'top-nav-style',
      'interactive-feed',
      ...COMPONENT_LIBRARY_REGISTRY.map((c) => `comp-${c.id}`),
      'brand-blueprint',
      'design-principles',
      'touch-targets',
    ],
    [],
  );

  // Filter 40 components in real-time
  const filteredComponents = React.useMemo(() => {
    if (!searchQuery.trim()) return COMPONENT_LIBRARY_REGISTRY;
    const q = searchQuery.toLowerCase().trim();
    return COMPONENT_LIBRARY_REGISTRY.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  // Smooth scroll helper with header offset clearance
  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    isManualScrollRef.current = true;
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      isManualScrollRef.current = false;
    }, 800);

    requestAnimationFrame(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

  // Real-time scroll spy tracking for Left Sticky Navigation
  React.useEffect(() => {
    const handleScroll = () => {
      if (!rootRef.current || rootRef.current.offsetParent === null || isManualScrollRef.current) {
        return;
      }

      const isAtBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;
      if (isAtBottom) {
        setActiveSectionId('touch-targets');
        return;
      }

      const scrollPosition = window.scrollY + 140;
      for (let i = scrollSectionIds.length - 1; i >= 0; i--) {
        const id = scrollSectionIds[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPosition >= top) {
            setActiveSectionId(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, [scrollSectionIds]);

  const handleCopyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleCopyInstall = (id: string, cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedInstallId(id);
    setTimeout(() => setCopiedInstallId(null), 2000);
  };

  const stateBundle = {
    snackbarOpen,
    setSnackbarOpen,
    snackbarMsg,
    setSnackbarMsg,
    snackbarVariant,
    setSnackbarVariant,
    sheetOpen,
    setSheetOpen,
    bottomSheetChoice,
    setBottomSheetChoice,
    dialogOpen,
    setDialogOpen,
    dialogDecision,
    setDialogDecision,
    deferralReason,
    setDeferralReason,
    activeTool,
    setActiveTool,
    tooltipPosition,
    setTooltipPosition,
    fabCount,
    setFabCount,
    fabSpeedDialOpen,
    setFabSpeedDialOpen,
    fabActionCounts,
    setFabActionCounts,
    selectedChips,
    setSelectedChips,
    toggleChip,
    switchAutoSync,
    setSwitchAutoSync,
    switchBiometric,
    setSwitchBiometric,
    switchSMSAlerts,
    setSwitchSMSAlerts,
    switchAuditLog,
    setSwitchAuditLog,
    dropdownValue,
    setDropdownValue,
    dropdownCampus,
    setDropdownCampus,
    bottomNavTab,
    setBottomNavTab,
    bottomNavBadge,
    setBottomNavBadge,
    bottomNavItems,
    cardPresentationMode,
    setCardPresentationMode,
    cardRevealed,
    setCardRevealed,
    cardSlidOut,
    setCardSlidOut,
    metricsTimeRange,
    setMetricsTimeRange,
    hangingNavTab,
    setHangingNavTab,
    hangingNavSize,
    setHangingNavSize,
    inputDemoText,
    setInputDemoText,
    inputDemoVariant,
    setInputDemoVariant,
    inputDemoSize,
    setInputDemoSize,
    inputDemoLoading,
    setInputDemoLoading,
    inputDemoDisabled,
    setInputDemoDisabled,
  };

  return (
    <div
      ref={rootRef}
      className="min-h-screen bg-white text-slate-900 selection:bg-[#0056FF] selection:text-white"
    >
      {/* Main Grid Container */}
      <div className="mx-auto max-w-[1560px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* COLUMN 1: Left Sticky Sidebar Navigation (Permanently Pinned Like Navbar) */}
          <aside className="w-full shrink-0 lg:sticky lg:top-20 lg:z-30 lg:w-60 lg:self-start xl:w-64">
            <div className="max-h-[calc(100vh-5.5rem)] space-y-6 overflow-y-auto pr-1">
              {/* Filter Input */}
              <GeometricInput
                inputSize="sm"
                placeholder="Filter components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-3.5 w-3.5 text-[#0056FF]" />}
              />

              {/* 40 Core UI Components Grouped By 5 Categories */}
              <div className="space-y-4 font-sans text-xs">
                <div className="flex items-center justify-between pb-1 font-mono text-[10px] font-bold text-slate-400 uppercase">
                  <span>Components</span>
                  <span className="rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-2 py-0.5 text-[10px] font-black text-[#0056FF]">
                    {filteredComponents.length} Active
                  </span>
                </div>

                {filteredComponents.length === 0 ? (
                  <div className="px-3 py-4 text-center font-sans text-xs text-slate-400">
                    No matching components found
                  </div>
                ) : (
                  COMPONENT_CATEGORIES.map((category) => {
                    const categoryComps = filteredComponents.filter((c) => c.category === category);
                    if (categoryComps.length === 0) return null;

                    return (
                      <div key={category} className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between px-1.5 py-0.5">
                          <span className="font-sans text-xs font-bold text-slate-900">
                            {category}{' '}
                            <span className="font-mono font-black text-[#FF5500]">
                              [{categoryComps.length}]
                            </span>
                          </span>
                        </div>
                        <div className="space-y-1">
                          {categoryComps.map((comp) => {
                            const targetId = `comp-${comp.id}`;
                            const isCurrentActive = activeSectionId === targetId;
                            return (
                              <button
                                key={comp.id}
                                type="button"
                                onClick={() => {
                                  if (searchQuery.trim()) {
                                    setSearchQuery('');
                                  }
                                  scrollToSection(targetId);
                                }}
                                className={cn(
                                  'flex w-full cursor-pointer items-center justify-between rounded-full border px-3 py-1.5 text-left font-sans text-xs font-semibold transition-all',
                                  isCurrentActive
                                    ? 'border-[#0056FF] bg-[#0056FF] text-white shadow-xs'
                                    : 'border-slate-200/90 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
                                )}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  <span
                                    className={cn(
                                      'size-1.5 shrink-0 rounded-full transition-colors',
                                      isCurrentActive ? 'bg-white' : 'bg-slate-400',
                                    )}
                                  />
                                  <span className="truncate">{comp.name}</span>
                                </div>
                                {comp.id === 'rail-toc' && (
                                  <span
                                    className={cn(
                                      'py-0.2 rounded-full px-1.5 font-mono text-[8px] font-bold uppercase',
                                      isCurrentActive
                                        ? 'bg-white text-[#0056FF]'
                                        : 'bg-[#E3E7FC] text-[#0056FF]',
                                    )}
                                  >
                                    Primary
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Documentation Section Links */}
                <div className="border-t border-slate-200/80 pt-3">
                  <div className="pb-2 font-mono text-[10px] font-bold text-slate-400 uppercase">
                    <span>Documentation</span>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { id: 'brand-blueprint', label: 'Brand Blueprint' },
                      { id: 'design-principles', label: 'Design Standards' },
                      { id: 'touch-targets', label: 'Touch Targets' },
                    ].map((doc) => {
                      const isCurrentActive = activeSectionId === doc.id;
                      return (
                        <button
                          key={doc.id}
                          type="button"
                          onClick={() => scrollToSection(doc.id)}
                          className={cn(
                            'flex w-full cursor-pointer items-center gap-2.5 rounded-full border px-3.5 py-1.5 text-left font-sans text-xs font-semibold transition-all',
                            isCurrentActive
                              ? 'border-[#0056FF] bg-[#0056FF] text-white shadow-xs'
                              : 'border-slate-200/90 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
                          )}
                        >
                          <span
                            className={cn(
                              'size-1.5 rounded-full transition-colors',
                              isCurrentActive ? 'bg-white' : 'bg-slate-400',
                            )}
                          />
                          <span className="truncate">{doc.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* COLUMN 2: Center Main Interactive Component Feed (1-Column Continuous Scroll Feed) */}
          <main className="min-w-0 flex-1 space-y-12">
            {/* HERO HEAD TITLE: Specific to UI Library (Monumental Big As Footer Style) */}
            <section id="ui-library-head" className="scroll-mt-24 space-y-4">
              <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-b from-white via-slate-50/50 to-[#E3E7FC]/30 p-6 shadow-xs sm:p-10">
                <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                  <div>
                    <h1 className="font-sans text-5xl font-black tracking-tight text-slate-950 sm:text-6xl md:text-7xl lg:text-8xl">
                      UI Library
                    </h1>
                  </div>

                  <div className="shrink-0">
                    <GeometricHeaderStamp
                      codeA="65"
                      titleA="COMPONENTS"
                      codeB="100%"
                      titleB="INTERACTIVE"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 2: Top Navigation Hanging Tabs Style */}
            <section
              id="top-nav-style"
              className="scroll-mt-24 space-y-4 border-t border-slate-200/80 pt-8"
            >
              <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-xs font-bold tracking-wider text-[#0056FF] uppercase">
                    Header Navigation Architecture
                  </span>
                  <h2 className="font-sans text-xl font-bold text-slate-950 sm:text-2xl">
                    Top Navigation Hanging Tabs Style
                  </h2>
                  <p className="font-sans text-xs text-slate-600">
                    Inverted trapezoid tabs suspended from the top header baseline with
                    vector-smooth SVG geometry.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* 1. Preview | Code Segmented Pill */}
                  <div className="flex items-center rounded-xl bg-[#F1F5F9] p-1 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setHangingNavTabMode('preview')}
                      className={cn(
                        'cursor-pointer rounded-lg px-3.5 py-1 font-sans text-xs font-bold transition-all',
                        hangingNavTabMode === 'preview'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900',
                      )}
                    >
                      Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => setHangingNavTabMode('code')}
                      className={cn(
                        'cursor-pointer rounded-lg px-3.5 py-1 font-sans text-xs font-bold transition-all',
                        hangingNavTabMode === 'code'
                          ? 'bg-white text-slate-900 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900',
                      )}
                    >
                      Code
                    </button>
                  </div>

                  {/* 2. Device Viewport Switcher */}
                  {hangingNavTabMode === 'preview' && (
                    <div className="flex items-center gap-0.5 rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setHangingNavDevice('mobile')}
                        title="Mobile Phone Viewport (380px)"
                        className={cn(
                          'flex size-7 items-center justify-center rounded-lg transition-all',
                          hangingNavDevice === 'mobile'
                            ? 'bg-slate-100 text-slate-900 shadow-2xs'
                            : 'text-slate-500 hover:text-slate-900',
                        )}
                      >
                        <Smartphone className="size-4 stroke-[1.8]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setHangingNavDevice('tablet')}
                        title="Tablet Viewport (680px)"
                        className={cn(
                          'flex size-7 items-center justify-center rounded-lg transition-all',
                          hangingNavDevice === 'tablet'
                            ? 'bg-slate-100 text-slate-900 shadow-2xs'
                            : 'text-slate-500 hover:text-slate-900',
                        )}
                      >
                        <Tablet className="size-4 stroke-[1.8]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setHangingNavDevice('desktop')}
                        title="Desktop Monitor"
                        className={cn(
                          'flex size-7 items-center justify-center rounded-lg transition-all',
                          hangingNavDevice === 'desktop'
                            ? 'bg-slate-100 text-slate-900 shadow-2xs'
                            : 'text-slate-500 hover:text-slate-900',
                        )}
                      >
                        <Monitor className="size-4 stroke-[1.8]" />
                      </button>
                    </div>
                  )}

                  {/* 3. Dark / Light Mode Toggle */}
                  {hangingNavTabMode === 'preview' && (
                    <button
                      type="button"
                      onClick={() =>
                        setHangingNavTheme(hangingNavTheme === 'dark' ? 'light' : 'dark')
                      }
                      title={
                        hangingNavTheme === 'dark'
                          ? 'Switch to Light Stage'
                          : 'Switch to Dark Stage'
                      }
                      className="flex size-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-2xs transition-all hover:bg-slate-50 active:scale-95"
                    >
                      {hangingNavTheme === 'dark' ? (
                        <Sun className="size-4 stroke-[1.8] text-amber-500" />
                      ) : (
                        <Moon className="size-4 stroke-[1.8]" />
                      )}
                    </button>
                  )}

                  {/* 4. Reset Button */}
                  {hangingNavTabMode === 'preview' && (
                    <button
                      type="button"
                      onClick={() => {
                        setHangingNavResetKey((k) => k + 1);
                        setHangingNavTab('newswire');
                        setHangingNavSpinning(true);
                        setTimeout(() => setHangingNavSpinning(false), 600);
                      }}
                      title="Reset Navigation State"
                      className="flex size-9 cursor-pointer items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 shadow-2xs ring-2 ring-slate-200/60 transition-all hover:bg-slate-50 active:scale-95"
                    >
                      <RotateCcw
                        className={cn(
                          'size-4 stroke-[2] transition-transform duration-500',
                          hangingNavSpinning && 'rotate-[-360deg]',
                        )}
                      />
                    </button>
                  )}
                </div>
              </div>

              {/* Live Interactive Header Bar Stage */}
              {hangingNavTabMode === 'preview' ? (
                <div
                  className={cn(
                    'overflow-hidden rounded-2xl border p-4 shadow-inner transition-colors sm:p-6',
                    hangingNavTheme === 'dark'
                      ? 'border-slate-800 bg-[#0B0F19] text-white'
                      : 'border-slate-200/90 bg-[#F8FAFC] text-slate-900',
                  )}
                >
                  {hangingNavDevice === 'mobile' ? (
                    <div className="mx-auto w-full max-w-[390px] overflow-hidden rounded-[38px] border-[6px] border-slate-900 bg-white shadow-xl">
                      <div className="flex justify-center bg-white pt-2.5 pb-1">
                        <div className="flex h-4 w-24 items-center justify-end rounded-full bg-slate-950 pr-2">
                          <div className="size-2 rounded-full bg-slate-900 ring-1 ring-slate-800" />
                        </div>
                      </div>
                      {/* Header Ceiling Strip (Textured Slate Bar) */}
                      <div className="border-b border-slate-300 bg-gradient-to-b from-slate-100 to-slate-200/90 px-3 pt-3 pb-0">
                        <div className="flex items-center pb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-[#0056FF]" />
                            <span className="font-sans text-[10px] font-bold tracking-wider text-slate-800 uppercase">
                              Workspace Ceiling
                            </span>
                          </div>
                        </div>
                        <div className="flex items-end justify-center overflow-x-auto pb-0">
                          <HangingTabsNav
                            items={[
                              { id: 'map', label: 'Map', icon: MapPin },
                              { id: 'newswire', label: 'Newswire', icon: Newspaper },
                              { id: 'post', label: 'Post', icon: FilePlus },
                              { id: 'friends', label: 'Friends', icon: Contacts },
                            ]}
                            activeId={hangingNavTab}
                            onSelect={(tabId) => setHangingNavTab(tabId)}
                            size="sm"
                          />
                        </div>
                      </div>
                      {/* Phone Screen Area */}
                      <div className="min-h-[140px] bg-slate-50 p-4 text-center">
                        <span className="font-mono text-xs text-slate-500">Active View: </span>
                        <span className="font-mono text-xs font-bold text-[#0056FF] uppercase">
                          {hangingNavTab}
                        </span>
                      </div>
                      <div className="flex justify-center bg-white py-2">
                        <div className="h-1 w-28 rounded-full bg-slate-300" />
                      </div>
                    </div>
                  ) : hangingNavDevice === 'tablet' ? (
                    <div className="mx-auto w-full max-w-[680px] overflow-hidden rounded-[32px] border-[6px] border-slate-800 bg-white shadow-xl">
                      <div className="border-b border-slate-300 bg-gradient-to-b from-slate-100 to-slate-200/90 px-5 pt-3.5 pb-0">
                        <div className="flex items-center pb-2.5">
                          <div className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-[#0056FF]" />
                            <span className="font-sans text-[11px] font-bold tracking-wider text-slate-800 uppercase">
                              Tablet Workspace Ceiling
                            </span>
                          </div>
                        </div>
                        <div className="flex items-end justify-center">
                          <HangingTabsNav
                            items={[
                              { id: 'map', label: 'Map', icon: MapPin },
                              { id: 'newswire', label: 'Newswire', icon: Newspaper },
                              { id: 'post', label: 'Post', icon: FilePlus },
                              { id: 'friends', label: 'Friends', icon: Contacts },
                            ]}
                            activeId={hangingNavTab}
                            onSelect={(tabId) => setHangingNavTab(tabId)}
                            size="md"
                          />
                        </div>
                      </div>
                      <div className="min-h-[160px] bg-slate-50 p-6 text-center">
                        <span className="font-mono text-xs text-slate-500">Active View: </span>
                        <span className="font-mono text-xs font-bold text-[#0056FF] uppercase">
                          {hangingNavTab}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-xs">
                      {/* Header Ceiling Strip (Textured Slate Bar) */}
                      <div className="border-b border-slate-300 bg-gradient-to-b from-slate-100 to-slate-200/90 px-6 pt-4 pb-0">
                        <div className="flex items-center pb-3">
                          <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full bg-[#0056FF]" />
                            <span className="font-sans text-xs font-bold tracking-wider text-slate-800 uppercase">
                              Application Workspace Ceiling
                            </span>
                          </div>
                        </div>

                        <div className="flex items-end justify-center">
                          <HangingTabsNav
                            items={[
                              { id: 'map', label: 'Map', icon: MapPin },
                              { id: 'newswire', label: 'Newswire', icon: Newspaper },
                              { id: 'post', label: 'Post', icon: FilePlus },
                              { id: 'friends', label: 'Friends', icon: Contacts },
                            ]}
                            activeId={hangingNavTab}
                            onSelect={(tabId) => setHangingNavTab(tabId)}
                            size={hangingNavSize}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sub-bar Controls */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-5 py-3 font-sans">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-500">Active Tab:</span>
                      <span className="rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 font-mono text-xs font-bold text-[#0056FF] uppercase">
                        {hangingNavTab}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs text-slate-500">
                      <span>Interactive Tabs: Map, Newswire, Post, Friends</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-50 p-4 text-slate-800 shadow-xs">
                  <pre className="max-h-72 overflow-auto font-mono text-xs leading-relaxed text-slate-800">
                    <code>{`<HangingTabsNav
  items={[
    { id: 'map', label: 'Map', icon: MapPin },
    { id: 'newswire', label: 'Newswire', icon: Newspaper },
    { id: 'post', label: 'Post', icon: FilePlus },
    { id: 'friends', label: 'Friends', icon: Contacts },
  ]}
  activeId={activeTab}
  onSelect={(id) => setActiveTab(id)}
  size="md"
/>`}</code>
                  </pre>
                </div>
              )}
            </section>

            {/* SECTION 3: 65 Interactive UI Components & Templates Single Scroll Feed */}
            <div
              id="interactive-feed"
              className="scroll-mt-24 space-y-2 border-t border-slate-200/80 pt-8 pb-2"
            >
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                  Single Feed Mode
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  65 Interactive Demos & Templates · Live Keyboard Ready
                </span>
              </div>
              <h2 className="font-sans text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                Component Catalog (65 Interactive Components & Templates)
              </h2>
              <p className="font-sans text-xs text-slate-600">
                Full-stack design systems, navigation docks, backgrounds, text effects, cards,
                sections, forms, and overlays.
              </p>
            </div>

            {/* THE 12 REAL INTERACTIVE COMPONENT DEMOS (STACKED VERTICALLY IN ONE CONTINUOUS FEED) */}
            <div className="space-y-14">
              {filteredComponents.map((comp, idx) => {
                const sectionId = `comp-${comp.id}`;
                const currentTab = getCompTab(comp.id);

                return (
                  <section
                    key={comp.id}
                    id={sectionId}
                    className="scroll-mt-24 space-y-4 rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:border-[#0056FF]/40 sm:p-6"
                  >
                    {/* Component Card Header */}
                    <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-black text-[#0056FF]">
                            0{idx + 1}.
                          </span>
                          <h2 className="font-sans text-xl font-black text-slate-950">
                            {comp.name}
                          </h2>
                          <span className="rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                            {comp.paradigm}
                          </span>
                          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600 uppercase">
                            {comp.category}
                          </span>
                        </div>
                        <p className="mt-1 font-sans text-xs text-slate-600">{comp.description}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* 1. Preview | Code Segmented Pill (User Screenshot Style) */}
                        <div className="flex items-center rounded-xl bg-[#F1F5F9] p-1 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => setCompTab(comp.id, 'preview')}
                            className={cn(
                              'cursor-pointer rounded-lg px-3.5 py-1 font-sans text-xs font-bold transition-all',
                              currentTab === 'preview'
                                ? 'bg-white text-slate-900 shadow-xs'
                                : 'text-slate-500 hover:text-slate-900',
                            )}
                          >
                            Preview
                          </button>
                          <button
                            type="button"
                            onClick={() => setCompTab(comp.id, 'code')}
                            className={cn(
                              'cursor-pointer rounded-lg px-3.5 py-1 font-sans text-xs font-bold transition-all',
                              currentTab === 'code'
                                ? 'bg-white text-slate-900 shadow-xs'
                                : 'text-slate-500 hover:text-slate-900',
                            )}
                          >
                            Code
                          </button>
                        </div>

                        {/* 2. Device Viewport Switcher [Mobile | Tablet | Desktop] */}
                        {currentTab === 'preview' && (
                          <div className="flex items-center gap-0.5 rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => setCompDevice(comp.id, 'mobile')}
                              title="Mobile Phone Viewport (380px)"
                              className={cn(
                                'flex size-7 items-center justify-center rounded-lg transition-all',
                                getCompDevice(comp.id) === 'mobile'
                                  ? 'bg-slate-100 text-slate-900 shadow-2xs'
                                  : 'text-slate-500 hover:text-slate-900',
                              )}
                            >
                              <Smartphone className="size-4 stroke-[1.8]" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setCompDevice(comp.id, 'tablet')}
                              title="Tablet Viewport (680px)"
                              className={cn(
                                'flex size-7 items-center justify-center rounded-lg transition-all',
                                getCompDevice(comp.id) === 'tablet'
                                  ? 'bg-slate-100 text-slate-900 shadow-2xs'
                                  : 'text-slate-500 hover:text-slate-900',
                              )}
                            >
                              <Tablet className="size-4 stroke-[1.8]" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setCompDevice(comp.id, 'desktop')}
                              title="Desktop Viewport"
                              className={cn(
                                'flex size-7 items-center justify-center rounded-lg transition-all',
                                getCompDevice(comp.id) === 'desktop'
                                  ? 'bg-slate-100 text-slate-900 shadow-2xs'
                                  : 'text-slate-500 hover:text-slate-900',
                              )}
                            >
                              <Monitor className="size-4 stroke-[1.8]" />
                            </button>
                          </div>
                        )}

                        {/* 3. Dark / Light Mode Toggle */}
                        {currentTab === 'preview' && (
                          <button
                            type="button"
                            onClick={() => toggleCompTheme(comp.id)}
                            title={
                              getCompTheme(comp.id) === 'dark'
                                ? 'Switch to Light Stage'
                                : 'Switch to Dark Stage'
                            }
                            className="flex size-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-2xs transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95"
                          >
                            {getCompTheme(comp.id) === 'dark' ? (
                              <Sun className="size-4 stroke-[1.8] text-amber-500" />
                            ) : (
                              <Moon className="size-4 stroke-[1.8]" />
                            )}
                          </button>
                        )}

                        {/* 4. Fullscreen / Maximize Toggle */}
                        {currentTab === 'preview' && (
                          <button
                            type="button"
                            onClick={() => toggleCompExpanded(comp.id)}
                            title={getCompExpanded(comp.id) ? 'Collapse Stage' : 'Expand Stage'}
                            className={cn(
                              'flex size-9 cursor-pointer items-center justify-center rounded-xl border transition-all active:scale-95',
                              getCompExpanded(comp.id)
                                ? 'border-[#0056FF] bg-[#0056FF]/10 text-[#0056FF]'
                                : 'border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900',
                            )}
                          >
                            <Maximize className="size-4 stroke-[1.8]" />
                          </button>
                        )}

                        {/* 5. Reset / Reload Button */}
                        {currentTab === 'preview' && (
                          <button
                            type="button"
                            onClick={() => resetComp(comp.id)}
                            title="Reset Component State"
                            className="flex size-9 cursor-pointer items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 shadow-2xs ring-2 ring-slate-200/60 transition-all hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 active:scale-95"
                          >
                            <RotateCcw
                              className={cn(
                                'size-4 stroke-[2] transition-transform duration-500',
                                compSpinning[comp.id] && 'rotate-[-360deg]',
                              )}
                            />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* TAB CONTENT: PREVIEW */}
                    {currentTab === 'preview' && (
                      <div className="space-y-4">
                        {/* Live Interactive Stage Canvas (Responsive Viewport & Theme Aware) */}
                        <div
                          className={cn(
                            'relative flex w-full items-center justify-center overflow-hidden rounded-3xl border p-4 shadow-inner transition-all duration-300 sm:p-8',
                            getCompExpanded(comp.id) ? 'min-h-[620px]' : 'min-h-[440px]',
                            getCompTheme(comp.id) === 'dark'
                              ? 'border-slate-800 bg-[#0B0F19] text-white'
                              : 'border-slate-200/90 bg-[#F8FAFC] text-slate-900',
                          )}
                        >
                          {/* Subtle Dot Grid */}
                          <div
                            className={cn(
                              'pointer-events-none absolute inset-0',
                              getCompTheme(comp.id) === 'dark' ? 'opacity-20' : 'opacity-30',
                            )}
                            style={{
                              backgroundImage:
                                getCompTheme(comp.id) === 'dark'
                                  ? 'radial-gradient(circle at 1px 1px, #1E293B 1px, transparent 0)'
                                  : 'radial-gradient(circle at 1px 1px, #CAD3F5 1px, transparent 0)',
                              backgroundSize: '16px 16px',
                            }}
                          />

                          {getCompDevice(comp.id) === 'mobile' ? (
                            /* Realistic Mobile Phone Viewport Frame */
                            <div className="relative z-10 mx-auto w-full max-w-[380px] overflow-hidden rounded-[44px] border-[8px] border-slate-900 bg-white shadow-2xl ring-1 ring-slate-900/10">
                              <div className="flex justify-center bg-white pt-2.5 pb-1">
                                <div className="flex h-4 w-24 items-center justify-end rounded-full bg-slate-950 pr-2">
                                  <div className="size-2 rounded-full bg-slate-900 ring-1 ring-slate-800" />
                                </div>
                              </div>
                              <div
                                key={getCompResetKey(comp.id)}
                                className={cn(
                                  'flex min-h-[460px] w-full flex-col items-center justify-center overflow-y-auto p-4 transition-colors',
                                  getCompTheme(comp.id) === 'dark'
                                    ? 'bg-[#0F172A] text-white'
                                    : 'bg-slate-50/50 text-slate-900',
                                )}
                              >
                                {renderFeedComponentDemo(comp.id, stateBundle)}
                              </div>
                              <div className="flex justify-center bg-white py-2">
                                <div className="h-1 w-28 rounded-full bg-slate-300" />
                              </div>
                            </div>
                          ) : getCompDevice(comp.id) === 'tablet' ? (
                            /* Realistic Tablet Viewport Frame */
                            <div className="relative z-10 mx-auto w-full max-w-[680px] overflow-hidden rounded-[32px] border-[6px] border-slate-800 bg-white shadow-2xl">
                              <div className="flex justify-center bg-slate-900 py-1.5">
                                <div className="size-2 rounded-full bg-slate-700" />
                              </div>
                              <div
                                key={getCompResetKey(comp.id)}
                                className={cn(
                                  'flex min-h-[460px] w-full flex-col items-center justify-center overflow-y-auto p-6 transition-colors',
                                  getCompTheme(comp.id) === 'dark'
                                    ? 'bg-[#0F172A] text-white'
                                    : 'bg-slate-50/40 text-slate-900',
                                )}
                              >
                                {renderFeedComponentDemo(comp.id, stateBundle)}
                              </div>
                            </div>
                          ) : (
                            /* Desktop Monitor Stage */
                            <div
                              key={getCompResetKey(comp.id)}
                              className={cn(
                                'relative z-10 flex w-full flex-col items-center justify-center',
                                getCompExpanded(comp.id) ? 'max-w-4xl' : 'max-w-2xl',
                              )}
                            >
                              {renderFeedComponentDemo(comp.id, stateBundle)}
                            </div>
                          )}
                        </div>

                        {/* Supported States & Install Banner */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs">
                          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
                            <span className="font-bold text-slate-400 uppercase">States:</span>
                            {comp.supportedStates.map((st) => (
                              <span
                                key={st}
                                className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-semibold text-slate-700"
                              >
                                {st}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-2">
                            <code className="font-mono text-[11px] text-[#0056FF]">
                              npx @snp/cli add {comp.id}
                            </code>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyInstall(comp.id, `npx @snp/cli add ${comp.id}`)
                              }
                              className="rounded-full border border-slate-200 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-600 hover:border-[#0056FF] hover:text-[#0056FF]"
                            >
                              {copiedInstallId === comp.id ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB CONTENT: CODE (With Props Specifications & Mental Model) */}
                    {currentTab === 'code' && (
                      <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-slate-700">
                            React / TypeScript Source
                          </span>
                          <GeometricButton
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopyCode(comp.id, comp.codeSnippet)}
                            icon={
                              copiedCodeId === comp.id ? (
                                <Check className="size-3 text-[#0056FF]" />
                              ) : (
                                <Copy className="size-3 text-slate-600" />
                              )
                            }
                          >
                            {copiedCodeId === comp.id ? 'Copied' : 'Copy Code'}
                          </GeometricButton>
                        </div>

                        <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-50 p-4 text-slate-800 shadow-xs">
                          <pre className="max-h-80 overflow-auto font-mono text-xs leading-relaxed text-slate-800">
                            <code>{comp.codeSnippet}</code>
                          </pre>
                        </div>

                        {/* Mental Model & Specs */}
                        <div className="space-y-1.5 rounded-xl border border-slate-200/90 bg-[#F8FAFC] p-4">
                          <h4 className="font-sans text-xs font-bold tracking-wider text-slate-900 uppercase">
                            Mental Model & Paradigm
                          </h4>
                          <p className="font-sans text-xs leading-relaxed text-slate-600">
                            {comp.explanation}
                          </p>
                        </div>

                        {/* Real-world Scenarios */}
                        <div className="space-y-2">
                          <h4 className="font-sans text-xs font-bold tracking-wider text-slate-900 uppercase">
                            Production Scenarios
                          </h4>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                            {comp.realWorldExamples.map((ex, i) => (
                              <div
                                key={i}
                                className="rounded-xl border border-slate-200/90 bg-white p-3 text-xs"
                              >
                                <span className="font-mono text-[10px] font-bold text-[#0056FF]">
                                  0{i + 1}. {ex.title}
                                </span>
                                <p className="mt-1 font-sans text-[11px] text-slate-600">
                                  {ex.scenario}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Best Practices & Anti-Patterns */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div className="space-y-1.5 rounded-xl border border-[#CAD3F5] bg-[#E3E7FC]/40 p-3 text-xs">
                            <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                              Best Practices (DO)
                            </span>
                            <ul className="space-y-1 font-sans text-[11px] text-slate-700">
                              {comp.usageGuidelines.map((g, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="mt-1 size-1 shrink-0 rounded-full bg-[#0056FF]" />
                                  <span>{g.doItem}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-1.5 rounded-xl border border-rose-200 bg-rose-50/60 p-3 text-xs text-rose-950">
                            <span className="font-mono text-[10px] font-bold text-rose-600 uppercase">
                              Anti-Patterns (DON&apos;T)
                            </span>
                            <ul className="space-y-1 font-sans text-[11px] text-slate-700">
                              {comp.usageGuidelines.map((g, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="mt-1 size-1 shrink-0 rounded-full bg-rose-400" />
                                  <span>{g.dontItem}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </section>
                );
              })}
            </div>

            {/* SECTION: Brand Colors Blueprint */}
            <section
              id="brand-blueprint"
              className="scroll-mt-24 space-y-4 border-t border-slate-200/80 pt-8"
            >
              <BrandConceptBlueprint />
            </section>

            {/* SECTION: Design Standards & Policies */}
            <section
              id="design-principles"
              className="scroll-mt-24 space-y-4 border-t border-slate-200/80 pt-8"
            >
              <h2 className="font-sans text-xl font-bold text-slate-950">
                Flat Design & Zero Shadows Policy
              </h2>
              <p className="font-sans text-sm leading-relaxed text-slate-600">
                Every component adheres to strict flat design principles without dropped blur
                shadows (`box-shadow: none`). Spatial depth is established strictly through 1px
                border contrast and background elevation hierarchy.
              </p>

              <div id="touch-targets" className="scroll-mt-24 space-y-2 pt-2">
                <h3 className="font-sans text-sm font-bold text-slate-900">
                  Touch Targets & Accessibility
                </h3>
                <p className="font-sans text-sm leading-relaxed text-slate-600">
                  All interactive elements provide a minimum 44×44px hit target area and exceed WCAG
                  AA contrast ratios of 4.5:1 on light surfaces.
                </p>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Global Interactive Overlays */}
      <LibrarySnackbar
        open={snackbarOpen}
        message={snackbarMsg}
        variant={snackbarVariant}
        actionLabel="Undo"
        onAction={() => setSnackbarOpen(false)}
        onClose={() => setSnackbarOpen(false)}
      />

      <LibraryBottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Campus Infrastructure Operations"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Siem Reap Science Wing B · Active student roster exports and telemetry diagnostics.
          </p>
          <GeometricButton variant="blue" className="w-full" onClick={() => setSheetOpen(false)}>
            Close Sheet
          </GeometricButton>
        </div>
      </LibraryBottomSheet>

      <LibraryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Revoke enrollment?"
        description="Permanently revokes course registration for this academic term."
        confirmLabel="Confirm Revoke"
        cancelLabel="Cancel"
        isDestructive
        onConfirm={() => {
          setDialogOpen(false);
          setDialogDecision('Revocation Confirmed');
        }}
      />
    </div>
  );
}

/**
 * Dedicated Real Interactive Component Demos inside the Single Scroll Feed
 * STRICTLY using the docs brand palette (#0056FF, #2277FF, #000B26, #E3E7FC, #CAD3F5, #FFFFFF)
 */
function renderFeedComponentDemo(
  id: string,
  state: {
    snackbarOpen: boolean;
    setSnackbarOpen: (o: boolean) => void;
    snackbarMsg: string;
    setSnackbarMsg: (m: string) => void;
    snackbarVariant: SnackbarVariant;
    setSnackbarVariant: (v: SnackbarVariant) => void;
    sheetOpen: boolean;
    setSheetOpen: (o: boolean) => void;
    bottomSheetChoice: string;
    setBottomSheetChoice: (c: string) => void;
    dialogOpen: boolean;
    setDialogOpen: (o: boolean) => void;
    dialogDecision: string;
    setDialogDecision: (d: string) => void;
    deferralReason: string;
    setDeferralReason: (r: string) => void;
    activeTool: string;
    setActiveTool: (t: string) => void;
    tooltipPosition: 'top' | 'bottom';
    setTooltipPosition: (p: 'top' | 'bottom') => void;
    fabCount: number;
    setFabCount: React.Dispatch<React.SetStateAction<number>>;
    fabSpeedDialOpen: boolean;
    setFabSpeedDialOpen: (o: boolean) => void;
    fabActionCounts: { student: number; attendance: number; invoice: number; qr: number };
    setFabActionCounts: React.Dispatch<
      React.SetStateAction<{ student: number; attendance: number; invoice: number; qr: number }>
    >;
    selectedChips: string[];
    setSelectedChips: (chips: string[]) => void;
    toggleChip: (l: string) => void;
    switchAutoSync: boolean;
    setSwitchAutoSync: (s: boolean) => void;
    switchBiometric: boolean;
    setSwitchBiometric: (s: boolean) => void;
    switchSMSAlerts: boolean;
    setSwitchSMSAlerts: (s: boolean) => void;
    switchAuditLog: boolean;
    setSwitchAuditLog: (s: boolean) => void;
    dropdownValue: string;
    setDropdownValue: (v: string) => void;
    dropdownCampus: string;
    setDropdownCampus: (c: string) => void;
    bottomNavTab: string;
    setBottomNavTab: (t: string) => void;
    bottomNavBadge: number;
    setBottomNavBadge: React.Dispatch<React.SetStateAction<number>>;
    bottomNavItems: LibraryBottomNavItem[];
    cardPresentationMode: 'border-beam' | 'folder' | 'metrics';
    setCardPresentationMode: (m: 'border-beam' | 'folder' | 'metrics') => void;
    cardRevealed: boolean;
    setCardRevealed: (r: boolean) => void;
    cardSlidOut: boolean;
    setCardSlidOut: (s: boolean) => void;
    metricsTimeRange: '30D' | '90D' | '1Y' | 'All';
    setMetricsTimeRange: (r: '30D' | '90D' | '1Y' | 'All') => void;
    hangingNavTab: string;
    setHangingNavTab: (t: string) => void;
    hangingNavSize: 'sm' | 'md' | 'lg';
    setHangingNavSize: (s: 'sm' | 'md' | 'lg') => void;
    inputDemoText: string;
    setInputDemoText: (t: string) => void;
    inputDemoVariant: 'blue' | 'azure' | 'soft-lavender' | 'black' | 'outline';
    setInputDemoVariant: (v: 'blue' | 'azure' | 'soft-lavender' | 'black' | 'outline') => void;
    inputDemoSize: 'sm' | 'md' | 'lg';
    setInputDemoSize: (s: 'sm' | 'md' | 'lg') => void;
    inputDemoLoading: boolean;
    setInputDemoLoading: (l: boolean) => void;
    inputDemoDisabled: boolean;
    setInputDemoDisabled: (d: boolean) => void;
  },
) {
  switch (id) {
    case 'snackbar':
      return (
        <div className="flex w-full flex-col items-center gap-6">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <GeometricButton
              variant="blue"
              size="sm"
              onClick={() => {
                state.setSnackbarMsg('Student enrollment confirmed for STU-2026-0891.');
                state.setSnackbarVariant('success');
                state.setSnackbarOpen(true);
              }}
            >
              <Check className="h-3.5 w-3.5" />
              <span>Trigger Success (Undo)</span>
            </GeometricButton>
            <GeometricButton
              variant="azure"
              size="sm"
              onClick={() => {
                state.setSnackbarMsg('Batch telemetry sync active across 4 MongoDB cluster nodes.');
                state.setSnackbarVariant('info');
                state.setSnackbarOpen(true);
              }}
            >
              <span>Trigger Info</span>
            </GeometricButton>
            <GeometricButton
              variant="soft-lavender"
              size="sm"
              onClick={() => {
                state.setSnackbarMsg('Security authentication token will expire in 5 minutes.');
                state.setSnackbarVariant('warning');
                state.setSnackbarOpen(true);
              }}
            >
              <span>Trigger Warning</span>
            </GeometricButton>
            <GeometricButton
              variant="outline"
              size="sm"
              onClick={() => {
                state.setSnackbarMsg('Tuition payment gateway timed out (HTTP 504 Gateway Error).');
                state.setSnackbarVariant('error');
                state.setSnackbarOpen(true);
              }}
            >
              <span>Trigger Error</span>
            </GeometricButton>
            <GeometricButton
              variant="outline"
              size="sm"
              onClick={() => {
                state.setSnackbarOpen(false);
                state.setSnackbarMsg('Notification dismissed.');
              }}
            >
              <span>Dismiss</span>
            </GeometricButton>
          </div>

          {/* Official Native Snackbar In-Stage Demo (Obsidian Surface & Material Standards) */}
          <NativeSnackbarInline
            message={state.snackbarMsg}
            variant={state.snackbarVariant}
            actionLabel="Undo"
            onAction={() => {
              state.setSnackbarMsg('Enrollment action reverted successfully.');
              state.setSnackbarVariant('info');
            }}
            onClose={() => state.setSnackbarOpen(false)}
          />

          {/* Real-time Status Card */}
          <div className="flex w-full max-w-lg items-center justify-between rounded-xl border border-slate-200/90 bg-white px-4 py-2.5 font-mono text-[11px] text-slate-600 shadow-xs">
            <span>
              Global State:{' '}
              <strong className="text-[#0056FF]">
                {state.snackbarOpen ? 'ACTIVE (BOTTOM-CENTER)' : 'IDLE (DISMISSED)'}
              </strong>
            </span>
            <span className="h-3 w-[1px] bg-slate-200" />
            <span>Surface: Level 2 Obsidian (#0F172A)</span>
            <span className="h-3 w-[1px] bg-slate-200" />
            <span>Touch: ≥ 44×44px</span>
          </div>
        </div>
      );

    case 'bottom-sheet':
      return (
        <div className="flex w-full flex-col items-center gap-5">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <GeometricButton variant="blue" size="sm" onClick={() => state.setSheetOpen(true)}>
              <MapPin className="h-3.5 w-3.5" />
              <span>Open Modal Sheet</span>
            </GeometricButton>
            <GeometricButton
              variant="outline"
              size="sm"
              onClick={() => state.setBottomSheetChoice('Export Student Roster (CSV / PDF)')}
            >
              <span>Reset Option</span>
            </GeometricButton>
          </div>

          {/* Interactive In-Stage Phone Surface */}
          <div className="w-full max-w-xl rounded-3xl border border-slate-200/90 bg-white p-6 shadow-md">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-300" />
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-sans text-sm font-bold text-slate-900">
                  Campus Operations Sheet
                </h4>
                <p className="font-sans text-xs text-slate-500">
                  Siem Reap Main Campus · Science Wing B
                </p>
              </div>
              <span className="rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                4 Actions
              </span>
            </div>

            <div className="mt-3.5 space-y-2 font-sans text-xs">
              {[
                {
                  title: 'Export Student Roster (CSV / PDF)',
                  desc: 'Generate complete enrolled roster for Term 1 2026',
                  tag: 'CSV / PDF',
                },
                {
                  title: 'Generate Monthly Attendance Matrix',
                  desc: 'Compile biometric check-in data with absence logs',
                  tag: 'TELEMETRY',
                },
                {
                  title: 'Batch Dispatch Parent SMS Announcement',
                  desc: 'Trigger bulk notifications to registered guardians',
                  tag: 'SMS HUB',
                },
                {
                  title: 'Archive Current Academic Term Records',
                  desc: 'Lock grades and create encrypted audit snapshot',
                  tag: 'SECURITY',
                },
              ].map((opt) => {
                const isSelected = state.bottomSheetChoice === opt.title;
                return (
                  <button
                    key={opt.title}
                    type="button"
                    onClick={() => state.setBottomSheetChoice(opt.title)}
                    className={cn(
                      'flex w-full cursor-pointer items-center justify-between rounded-2xl border p-3.5 text-left transition-all',
                      isSelected
                        ? 'border-[#0056FF] bg-[#E3E7FC]/80 text-[#0056FF] shadow-xs'
                        : 'border-slate-100 bg-slate-50 text-slate-700 hover:border-slate-200 hover:bg-white',
                    )}
                  >
                    <div>
                      <span className="block font-bold">{opt.title}</span>
                      <span className="text-[11px] text-slate-500">{opt.desc}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 font-mono text-[9px] font-bold text-slate-600 uppercase">
                        {opt.tag}
                      </span>
                      {isSelected && (
                        <span className="flex size-4 items-center justify-center rounded-full bg-[#0056FF] text-white">
                          <Check className="size-2.5" />
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="font-mono text-[11px] text-slate-500">
                Selected: <strong className="text-slate-800">{state.bottomSheetChoice}</strong>
              </span>
              <button
                type="button"
                onClick={() => state.setBottomSheetChoice('Operation Executed Successfully')}
                className="rounded-full border border-[#0056FF] bg-[#0056FF] px-4 py-1.5 font-sans text-xs font-bold text-white transition-all hover:bg-[#2277FF] active:scale-95"
              >
                Execute Action
              </button>
            </div>
          </div>
        </div>
      );

    case 'dialog':
      return (
        <div className="flex w-full flex-col items-center gap-5">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <GeometricButton variant="blue" size="sm" onClick={() => state.setDialogOpen(true)}>
              <span>Open Modal Dialog</span>
            </GeometricButton>
            <GeometricButton
              variant="outline"
              size="sm"
              onClick={() => {
                state.setDialogDecision('Pending Review');
                state.setDeferralReason('Medical Leave of Absence');
              }}
            >
              <span>Reset State</span>
            </GeometricButton>
          </div>

          {/* Interactive In-Stage Modal Card */}
          <div className="w-full max-w-xl rounded-3xl border border-slate-200/90 bg-white p-6 text-left shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-sans text-base font-black text-slate-950">
                  Confirm Academic Deferral
                </h4>
                <p className="font-sans text-xs text-slate-500">
                  Student: Dara Sok (STU-2026-0891) · Software Engineering
                </p>
              </div>
              <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 font-mono text-[10px] font-bold text-red-600 uppercase">
                Action Required
              </span>
            </div>

            <p className="mt-3 font-sans text-xs leading-relaxed text-slate-600">
              This action defers student STU-2026-0891 to Academic Term 2027. Pending tuition fees
              will be preserved and classroom seat allocation released.
            </p>

            {/* Interactive Deferral Reason Picker */}
            <div className="mt-4 space-y-2">
              <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Select Reason for Deferral:
              </span>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {[
                  'Medical Leave of Absence',
                  'International Exchange',
                  'Financial Reassessment',
                ].map((reason) => {
                  const isSelected = state.deferralReason === reason;
                  return (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => state.setDeferralReason(reason)}
                      className={cn(
                        'cursor-pointer rounded-xl border p-2.5 text-center font-sans text-xs font-semibold transition-all',
                        isSelected
                          ? 'border-[#0056FF] bg-[#E3E7FC] text-[#0056FF] shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white',
                      )}
                    >
                      {reason}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
              <GeometricButton
                size="sm"
                variant="outline"
                onClick={() => state.setDialogDecision('Cancelled: Deferral dismissed')}
              >
                Cancel
              </GeometricButton>
              <GeometricButton
                size="sm"
                variant="blue"
                onClick={() =>
                  state.setDialogDecision(`Confirmed: Approved (${state.deferralReason})`)
                }
              >
                Confirm Deferral
              </GeometricButton>
            </div>
          </div>

          <div className="flex w-full max-w-xl items-center justify-between rounded-xl border border-slate-200/90 bg-white px-4 py-2 font-mono text-[11px] text-slate-600 shadow-xs">
            <span>
              Decision: <strong className="text-[#0056FF]">{state.dialogDecision}</strong>
            </span>
            <span className="text-slate-400">Reason: {state.deferralReason}</span>
          </div>
        </div>
      );

    case 'tooltip':
      return (
        <div className="flex w-full flex-col items-center gap-5">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {(['top', 'bottom'] as const).map((pos) => (
              <GeometricButton
                key={pos}
                size="sm"
                variant={state.tooltipPosition === pos ? 'blue' : 'outline'}
                isActive={state.tooltipPosition === pos}
                onClick={() => state.setTooltipPosition(pos)}
              >
                Anchor {pos.toUpperCase()}
              </GeometricButton>
            ))}
          </div>

          {/* Interactive Toolbelt */}
          <div className="w-full max-w-xl rounded-3xl border border-slate-200/90 bg-white p-6 text-center shadow-md">
            <span className="mb-3 block font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Interactive Canvas Toolbelt (Hover or Tap for Tooltip)
            </span>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { label: 'Pointer Tool (Select & Move)', key: 'V', code: 'Move Tool (V)' },
                { label: 'Frame Tool (Slice Artboards)', key: 'F', code: 'Frame Tool (F)' },
                { label: 'Vector Pen Tool (Bezier Curves)', key: 'P', code: 'Vector Pen (P)' },
                { label: 'Typography Engine (Live Text)', key: 'T', code: 'Text Tool (T)' },
                { label: 'Export Record to CSV/PDF', key: '⌘E', code: 'Export Record (⌘E)' },
                { label: 'Save Database Snapshot', key: '⌘S', code: 'Save Record (⌘S)' },
              ].map((tool) => {
                const isSelected = state.activeTool === tool.code;
                return (
                  <LibraryTooltip
                    key={tool.code}
                    content={tool.label}
                    shortcut={tool.key}
                    position={state.tooltipPosition}
                  >
                    <button
                      type="button"
                      onClick={() => state.setActiveTool(tool.code)}
                      className={cn(
                        'flex h-12 w-12 cursor-pointer items-center justify-center rounded-2xl border text-sm font-bold transition-all select-none',
                        isSelected
                          ? 'scale-105 border-[#0056FF] bg-[#0056FF] text-white shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-800 hover:border-[#0056FF] hover:bg-white',
                      )}
                    >
                      {tool.key.replace('⌘', '')}
                    </button>
                  </LibraryTooltip>
                );
              })}
            </div>

            <div className="mt-5 rounded-xl border border-[#CAD3F5] bg-[#E3E7FC]/60 p-3 font-mono text-xs text-slate-700">
              Selected Active Tool: <strong className="text-[#0056FF]">{state.activeTool}</strong> ·
              Anchor: {state.tooltipPosition.toUpperCase()}
            </div>
          </div>
        </div>
      );

    case 'fab':
      return (
        <div className="flex w-full flex-col items-center gap-5">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <GeometricButton
              variant="outline"
              size="sm"
              onClick={() => state.setFabSpeedDialOpen(!state.fabSpeedDialOpen)}
            >
              Toggle Speed Dial
            </GeometricButton>
            <GeometricButton
              variant="outline"
              size="sm"
              onClick={() => {
                state.setFabCount(0);
                state.setFabActionCounts({ student: 0, attendance: 0, invoice: 0, qr: 0 });
              }}
            >
              Reset Counters
            </GeometricButton>
          </div>

          {/* Interactive Workspace Canvas with Speed-Dial */}
          <div className="relative w-full max-w-xl rounded-3xl border border-slate-200/90 bg-white p-6 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-sans text-sm font-bold text-slate-900">
                  Campus Quick Action Hub
                </h4>
                <p className="font-sans text-xs text-slate-500">
                  Tap actions below to trigger live increments
                </p>
              </div>
              <span className="rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#0056FF]">
                Total Taps: {state.fabCount}
              </span>
            </div>

            {/* Metric Counters Grid */}
            <div className="mt-4 grid grid-cols-2 gap-3 font-sans text-xs sm:grid-cols-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center">
                <span className="block font-mono text-[10px] text-slate-400 uppercase">
                  Students
                </span>
                <strong className="mt-1 block font-sans text-lg font-black text-[#0056FF]">
                  {state.fabActionCounts.student}
                </strong>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center">
                <span className="block font-mono text-[10px] text-slate-400 uppercase">
                  Attendance
                </span>
                <strong className="mt-1 block font-sans text-lg font-black text-[#0056FF]">
                  {state.fabActionCounts.attendance}
                </strong>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center">
                <span className="block font-mono text-[10px] text-slate-400 uppercase">
                  Invoices
                </span>
                <strong className="mt-1 block font-sans text-lg font-black text-[#0056FF]">
                  {state.fabActionCounts.invoice}
                </strong>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center">
                <span className="block font-mono text-[10px] text-slate-400 uppercase">
                  QR Scans
                </span>
                <strong className="mt-1 block font-sans text-lg font-black text-[#0056FF]">
                  {state.fabActionCounts.qr}
                </strong>
              </div>
            </div>

            {/* Speed Dial Action Bar */}
            <div className="mt-5 flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
              {state.fabSpeedDialOpen && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      state.setFabActionCounts((prev) => ({ ...prev, student: prev.student + 1 }));
                      state.setFabCount((c) => c + 1);
                    }}
                    className="cursor-pointer rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-3 py-1 font-sans text-xs font-bold text-[#0056FF] transition-all hover:bg-white active:scale-95"
                  >
                    + Add Student
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      state.setFabActionCounts((prev) => ({
                        ...prev,
                        attendance: prev.attendance + 1,
                      }));
                      state.setFabCount((c) => c + 1);
                    }}
                    className="cursor-pointer rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-3 py-1 font-sans text-xs font-bold text-[#0056FF] transition-all hover:bg-white active:scale-95"
                  >
                    + Attendance
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      state.setFabActionCounts((prev) => ({ ...prev, invoice: prev.invoice + 1 }));
                      state.setFabCount((c) => c + 1);
                    }}
                    className="cursor-pointer rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-3 py-1 font-sans text-xs font-bold text-[#0056FF] transition-all hover:bg-white active:scale-95"
                  >
                    + Invoice
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      state.setFabActionCounts((prev) => ({ ...prev, qr: prev.qr + 1 }));
                      state.setFabCount((c) => c + 1);
                    }}
                    className="cursor-pointer rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-3 py-1 font-sans text-xs font-bold text-[#0056FF] transition-all hover:bg-white active:scale-95"
                  >
                    + Scan QR
                  </button>
                </div>
              )}

              <LibraryFab
                label="Quick Action"
                icon={
                  <Plus
                    className={cn(
                      'h-5 w-5 transition-transform duration-200',
                      state.fabSpeedDialOpen ? 'rotate-45' : '',
                    )}
                  />
                }
                onClick={() => {
                  state.setFabSpeedDialOpen(!state.fabSpeedDialOpen);
                  state.setFabCount((c) => c + 1);
                }}
                className="bg-[#0056FF] text-white hover:bg-[#2277FF]"
              />
            </div>
          </div>
        </div>
      );

    case 'chip':
      return (
        <div className="flex w-full flex-col items-center gap-5">
          {/* Filter Stage */}
          <div className="w-full max-w-xl rounded-3xl border border-slate-200/90 bg-white p-6 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-sans text-sm font-bold text-slate-900">
                  Student Discipline Filter Chips
                </h4>
                <p className="font-sans text-xs text-slate-500">
                  Select tags to query matching student enrollment profiles
                </p>
              </div>
              <button
                type="button"
                onClick={() => state.setSelectedChips(['All'])}
                className="font-mono text-xs font-bold text-[#0056FF] hover:underline"
              >
                Reset All
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <span className="mb-2 block font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Academic Disciplines:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    'All',
                    'Software Engineering',
                    'Computer Science',
                    'Cybersecurity',
                    'Information Systems',
                    'Data Science',
                  ].map((label) => {
                    const isActive = state.selectedChips.includes(label);
                    return (
                      <LibraryChip
                        key={label}
                        active={isActive}
                        onClick={() => state.toggleChip(label)}
                      >
                        {label}
                      </LibraryChip>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="mb-2 block font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Enrollment Status:
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {['Enrolled', 'Active Term', 'Graduating 2026', 'On Leave'].map((label) => {
                    const isActive = state.selectedChips.includes(label);
                    return (
                      <LibraryChip
                        key={label}
                        active={isActive}
                        onClick={() => state.toggleChip(label)}
                      >
                        {label}
                      </LibraryChip>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-[#CAD3F5] bg-[#E3E7FC]/60 p-3.5 font-mono text-xs text-slate-700">
              Query Result:{' '}
              <strong className="text-[#0056FF]">
                {state.selectedChips.includes('All') ? '1,840' : state.selectedChips.length * 312}
              </strong>{' '}
              active student records matching filters:{' '}
              <strong>[{state.selectedChips.join(', ')}]</strong>
            </div>
          </div>
        </div>
      );

    case 'switch':
      return (
        <div className="flex w-full flex-col items-center gap-5">
          {/* Master Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <GeometricButton
              variant="blue"
              size="sm"
              onClick={() => {
                state.setSwitchAutoSync(true);
                state.setSwitchBiometric(true);
                state.setSwitchSMSAlerts(true);
                state.setSwitchAuditLog(true);
              }}
            >
              <span>Enable All Systems</span>
            </GeometricButton>
            <GeometricButton
              variant="outline"
              size="sm"
              onClick={() => {
                state.setSwitchAutoSync(false);
                state.setSwitchBiometric(false);
                state.setSwitchSMSAlerts(false);
                state.setSwitchAuditLog(false);
              }}
            >
              <span>Disable All Systems</span>
            </GeometricButton>
          </div>

          {/* Interactive Switches Panel */}
          <div className="w-full max-w-xl rounded-3xl border border-slate-200/90 bg-white p-6 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-sans text-sm font-bold text-slate-900">
                  Campus Automation Telemetry Switches
                </h4>
                <p className="font-sans text-xs text-slate-500">
                  Toggle distributed microservices and hardware gate scanners
                </p>
              </div>
              <span className="rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                Enterprise Mode
              </span>
            </div>

            <div className="mt-4 space-y-3 font-sans">
              {[
                {
                  id: 'sync',
                  title: 'Auto Sync Telemetry',
                  desc: 'MongoDB rs0 replica set real-time change stream socket',
                  checked: state.switchAutoSync,
                  setter: state.setSwitchAutoSync,
                },
                {
                  id: 'biometric',
                  title: 'Biometric Terminal Active',
                  desc: 'High-speed optical turnstile gate hardware bridge',
                  checked: state.switchBiometric,
                  setter: state.setSwitchBiometric,
                },
                {
                  id: 'sms',
                  title: 'SMS Parent Alerts',
                  desc: 'Automated guardian notifications on unexcused absence',
                  checked: state.switchSMSAlerts,
                  setter: state.setSwitchSMSAlerts,
                },
                {
                  id: 'audit',
                  title: 'Immutable Audit Log Streaming',
                  desc: 'Cryptographic SHA-256 tamper-evident compliance audit trail',
                  checked: state.switchAuditLog,
                  setter: state.setSwitchAuditLog,
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-slate-200 hover:bg-white"
                >
                  <div className="pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{item.title}</span>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase',
                          item.checked
                            ? 'border border-[#CAD3F5] bg-[#E3E7FC] text-[#0056FF]'
                            : 'border border-slate-200 bg-slate-100 text-slate-500',
                        )}
                      >
                        {item.checked ? 'Active · 100% Operational' : 'Paused · Standby'}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-500">{item.desc}</p>
                  </div>
                  <LibrarySwitch checked={item.checked} onCheckedChange={item.setter} />
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between rounded-2xl border border-[#CAD3F5] bg-[#E3E7FC]/60 p-3.5 font-mono text-xs text-slate-700">
              <span>
                Active Services:{' '}
                <strong className="text-[#0056FF]">
                  {
                    [
                      state.switchAutoSync,
                      state.switchBiometric,
                      state.switchSMSAlerts,
                      state.switchAuditLog,
                    ].filter(Boolean).length
                  }
                  /4
                </strong>
              </span>
              <span>
                Cluster Latency: <strong className="text-slate-900">12ms</strong>
              </span>
              <span>
                Health: <strong className="text-emerald-700">OPTIMAL</strong>
              </span>
            </div>
          </div>
        </div>
      );

    case 'dropdown':
      return (
        <div className="flex w-full flex-col items-center gap-5">
          <div className="w-full max-w-xl rounded-3xl border border-slate-200/90 bg-white p-6 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-sans text-sm font-bold text-slate-900">
                  Design Tokens & Campus Selectors
                </h4>
                <p className="font-sans text-xs text-slate-500">
                  Select typography pairings and campus branch configurations
                </p>
              </div>
              <span className="rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                Live Selection
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <LibraryDropdown
                label="Brand Typography Engine"
                value={state.dropdownValue}
                onChange={(val) => state.setDropdownValue(val)}
                options={[
                  {
                    value: 'sora',
                    label: 'Sora — Geometric Sans',
                    description: 'Official Google Fonts identity sans',
                  },
                  {
                    value: 'inter',
                    label: 'Inter — UI Standard Sans',
                    description: 'Functional high-density micro UI',
                  },
                  {
                    value: 'mono',
                    label: 'IBM Plex Mono — Code Standards',
                    description: 'High-contrast data display',
                  },
                  {
                    value: 'syne',
                    label: 'Syne — Distinctive Editorial Sans',
                    description: 'Expressive headings typography',
                  },
                ]}
              />

              <LibraryDropdown
                label="Campus Location Branch"
                value={state.dropdownCampus}
                onChange={(val) => state.setDropdownCampus(val)}
                options={[
                  {
                    value: 'siem-reap',
                    label: 'Siem Reap Main Campus',
                    description: '2,450 Enrolled Students · Science Wing',
                  },
                  {
                    value: 'phnom-penh',
                    label: 'Phnom Penh Innovation Hub',
                    description: '3,120 Enrolled Students · Tech Tower',
                  },
                  {
                    value: 'battambang',
                    label: 'Battambang Regional Center',
                    description: '1,080 Enrolled Students · Campus A',
                  },
                ]}
              />
            </div>

            {/* Real-time Font Preview */}
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between pb-2 font-mono text-[10px] text-slate-400 uppercase">
                <span>Selected Typography Sample</span>
                <span className="font-bold text-[#0056FF]">
                  {state.dropdownValue.toUpperCase()}
                </span>
              </div>
              <div
                className="font-sans text-xl font-black text-slate-950"
                style={{
                  fontFamily:
                    state.dropdownValue === 'mono'
                      ? 'monospace'
                      : state.dropdownValue === 'inter'
                        ? 'Inter, sans-serif'
                        : 'Sora, sans-serif',
                }}
              >
                SNPI-SMS Higher Education Portal 2026
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Active Branch:{' '}
                <strong className="text-slate-800">
                  {state.dropdownCampus === 'siem-reap'
                    ? 'Siem Reap Main Campus'
                    : state.dropdownCampus === 'phnom-penh'
                      ? 'Phnom Penh Innovation Hub'
                      : 'Battambang Regional Center'}
                </strong>
              </p>
            </div>
          </div>
        </div>
      );

    case 'bottom-nav':
      return (
        <div className="flex w-full flex-col items-center gap-5">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <GeometricButton
              variant="blue"
              size="sm"
              onClick={() => state.setBottomNavBadge((b) => b + 1)}
            >
              <span>+1 Alert Badge</span>
            </GeometricButton>
            <GeometricButton variant="outline" size="sm" onClick={() => state.setBottomNavBadge(0)}>
              <span>Clear Badges</span>
            </GeometricButton>
          </div>

          {/* Interactive Mobile Device Viewport */}
          <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-md">
            {/* Mobile Header Bar */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-900">13:25</span>
                <span className="size-1.5 rounded-full bg-emerald-500" />
              </div>
              <span className="font-sans text-xs font-black tracking-tight text-slate-900">
                SNPI-SMS Mobile
              </span>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500">
                <span>5G</span>
                <span>98%</span>
              </div>
            </div>

            {/* Dynamic Screen Body based on Active Screen */}
            <div className="min-h-[180px] bg-white p-5">
              {state.bottomNavTab === 'home' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="font-sans text-sm font-bold text-slate-900">Campus Overview</h5>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
                      99.2% Present
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5 font-sans">
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <span className="text-[10px] text-slate-400 uppercase">Check-ins</span>
                      <strong className="block text-base font-black text-[#0056FF]">
                        1,420 Students
                      </strong>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <span className="text-[10px] text-slate-400 uppercase">Turnstiles</span>
                      <strong className="block text-base font-black text-slate-900">
                        8 Gates Active
                      </strong>
                    </div>
                  </div>
                </div>
              )}

              {state.bottomNavTab === 'search' && (
                <div className="space-y-3">
                  <h5 className="font-sans text-sm font-bold text-slate-900">Search Directory</h5>
                  <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                    <Search className="size-3.5 text-[#0056FF]" />
                    <span className="text-xs text-slate-400">
                      Search students, faculty, classrooms...
                    </span>
                  </div>
                  <div className="space-y-1.5 font-sans text-xs">
                    <div className="flex items-center justify-between rounded-lg border border-slate-100 p-2">
                      <span className="font-bold">Dara Sok (STU-2026-0891)</span>
                      <span className="text-[10px] text-slate-400">Software Eng.</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-slate-100 p-2">
                      <span className="font-bold">Bopha Chan (STU-2026-0422)</span>
                      <span className="text-[10px] text-slate-400">Cybersecurity</span>
                    </div>
                  </div>
                </div>
              )}

              {state.bottomNavTab === 'academics' && (
                <div className="space-y-3 font-sans">
                  <h5 className="text-sm font-bold text-slate-900">Academic Progress</h5>
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span>CS-301 Distributed Systems</span>
                        <span className="text-[#0056FF]">84%</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100">
                        <div className="h-full w-[84%] rounded-full bg-[#0056FF]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span>SE-402 Cloud Architectures</span>
                        <span className="text-[#0056FF]">92%</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100">
                        <div className="h-full w-[92%] rounded-full bg-[#0056FF]" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {state.bottomNavTab === 'profile' && (
                <div className="flex items-center gap-4 font-sans">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-[#0056FF] text-xl font-black text-white shadow-md">
                    DS
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-950">Dara Sok</h5>
                    <p className="font-mono text-xs text-slate-500">ID: STU-2026-0891</p>
                    <span className="mt-1 inline-block rounded-full bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
                      Verified Active Student
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Nav Bar */}
            <div className="border-t border-slate-200 bg-slate-50/80 p-2">
              <div className="flex items-center justify-around">
                {state.bottomNavItems.map((item) => {
                  const isActive = state.bottomNavTab === item.id;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => state.setBottomNavTab(item.id)}
                      className={cn(
                        'relative flex cursor-pointer flex-col items-center gap-1 rounded-2xl px-4 py-2 transition-all select-none',
                        isActive
                          ? 'bg-[#0056FF] font-bold text-white shadow-xs'
                          : 'text-slate-600 hover:bg-white hover:text-slate-950',
                      )}
                    >
                      <div className="relative">
                        <Icon className="h-4 w-4" />
                        {item.id === 'profile' && state.bottomNavBadge > 0 && (
                          <span className="absolute -top-1 -right-1 flex size-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
                            {state.bottomNavBadge}
                          </span>
                        )}
                      </div>
                      <span className="font-sans text-[10px] tracking-wider uppercase">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );

    case 'card':
      return (
        <div className="flex w-full flex-col items-center gap-5">
          {/* Card Presentation Mode Switcher */}
          <div className="flex flex-wrap items-center justify-center rounded-full border border-slate-200 bg-white p-1 shadow-xs">
            <button
              type="button"
              onClick={() => state.setCardPresentationMode('border-beam')}
              className={cn(
                'cursor-pointer rounded-full px-4 py-1.5 font-sans text-xs font-bold transition-all',
                state.cardPresentationMode === 'border-beam'
                  ? 'bg-[#0056FF] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900',
              )}
            >
              Border Beam Card
            </button>
            <button
              type="button"
              onClick={() => state.setCardPresentationMode('folder')}
              className={cn(
                'cursor-pointer rounded-full px-4 py-1.5 font-sans text-xs font-bold transition-all',
                state.cardPresentationMode === 'folder'
                  ? 'bg-[#0056FF] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900',
              )}
            >
              Card Folder Mode
            </button>
            <button
              type="button"
              onClick={() => state.setCardPresentationMode('metrics')}
              className={cn(
                'cursor-pointer rounded-full px-4 py-1.5 font-sans text-xs font-bold transition-all',
                state.cardPresentationMode === 'metrics'
                  ? 'bg-[#0056FF] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900',
              )}
            >
              Daily Metrics Mode
            </button>
          </div>

          {/* MODE 1: Border Beam Card (Instrument Panel & 4-Dash Constant Velocity Physics) */}
          {state.cardPresentationMode === 'border-beam' ? (
            <BorderBeamInteractiveShowcase />
          ) : state.cardPresentationMode === 'folder' ? (
            <div className="relative w-full max-w-lg pt-6 select-none">
              {/* Sliding Credit / Student Card */}
              <div
                onClick={() => state.setCardSlidOut(!state.cardSlidOut)}
                className={cn(
                  'relative mx-auto w-[94%] cursor-pointer rounded-3xl p-6 transition-all duration-300 ease-out',
                  'border border-slate-700/60 bg-gradient-to-br from-[#0B0E14] via-[#000B26] to-[#0056FF]',
                  'text-white shadow-2xl',
                  state.cardSlidOut ? '-translate-y-12 scale-[1.02]' : 'translate-y-0',
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black tracking-widest text-slate-300 uppercase">
                      SNPI-SMS STUDENT PASS
                    </span>
                  </div>
                  <div className="h-7 w-9 rounded-md border border-amber-300/40 bg-amber-400/30 shadow-inner" />
                </div>

                <div className="mt-8 font-mono text-xl font-black tracking-widest text-slate-100 sm:text-2xl">
                  {state.cardRevealed ? '9420 8124 0092 0891' : '•••• •••• •••• 0891'}
                </div>

                <div className="mt-6 flex items-end justify-between font-mono text-xs">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase">Student Name</span>
                    <span className="text-sm font-bold text-slate-100">DARA SOK</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] text-slate-400 uppercase">Valid Thru</span>
                    <span className="text-sm font-bold text-slate-100">08/29</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] text-slate-400 uppercase">CVV</span>
                    <span className="text-sm font-bold text-[#CAD3F5]">
                      {state.cardRevealed ? '742' : '•••'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Curved Folder Pocket Base */}
              <div className="relative z-20 -mt-16 w-full rounded-3xl border border-slate-200/90 bg-white p-6 text-slate-900 shadow-xl">
                <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-4">
                  <button
                    type="button"
                    onClick={() => state.setCardRevealed(!state.cardRevealed)}
                    className="flex cursor-pointer items-center gap-2 rounded-full border border-slate-200 px-3.5 py-1.5 font-sans text-xs font-semibold transition-all hover:border-[#0056FF]"
                  >
                    {state.cardRevealed ? (
                      <EyeOff className="size-3.5 text-[#0056FF]" />
                    ) : (
                      <Eye className="size-3.5 text-slate-600" />
                    )}
                    <span>{state.cardRevealed ? 'Hide Details' : 'Reveal Details'}</span>
                  </button>

                  <div className="flex items-center gap-4 font-mono text-xs">
                    <div>
                      <span className="block text-[9px] text-slate-400 uppercase">Expiry</span>
                      <strong className="text-slate-800">08/29</strong>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-400 uppercase">CVV</span>
                      <strong className="text-slate-800">
                        {state.cardRevealed ? '742' : '•••'}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-sans text-sm font-bold text-slate-900">Dara Sok</h4>
                    <p className="font-mono text-xs text-slate-500">
                      {state.cardRevealed ? '9420 8124 0092 0891' : '•••• •••• •••• 0891'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => state.setCardSlidOut(!state.cardSlidOut)}
                    className="cursor-pointer rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-4 py-1.5 font-sans text-xs font-bold text-[#0056FF] transition-all hover:bg-white active:scale-95"
                  >
                    {state.cardSlidOut ? 'Insert Card' : 'Pull Card'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* MODE 2: Daily Active Students Metrics Card (User Image 2 Reference) */
            <div className="w-full max-w-lg rounded-3xl border border-slate-200/90 bg-white p-6 shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-sans text-base font-black text-slate-900">
                    Daily active students
                  </h4>
                  <p className="font-sans text-xs text-slate-500">12,340 a day · Term 1 2026</p>
                </div>

                <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 p-1 font-mono text-xs">
                  {(['30D', '90D', '1Y', 'All'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => state.setMetricsTimeRange(r)}
                      className={cn(
                        'cursor-pointer rounded-full px-2.5 py-0.5 font-bold transition-colors',
                        state.metricsTimeRange === r
                          ? 'bg-[#0056FF] text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-950',
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-[#CAD3F5] bg-[#E3E7FC]/60 p-4">
                <div className="flex items-center justify-between font-mono text-xs text-slate-500">
                  <span>Saturday, Oct 30, 2026</span>
                  <span className="font-bold text-[#0056FF]">+8.5% growth</span>
                </div>
                <div className="mt-1 font-sans text-3xl font-black text-slate-950">
                  10,119 students
                </div>
                <p className="mt-0.5 font-sans text-xs text-slate-600">
                  14,002 seven day average vs a week earlier
                </p>
              </div>

              {/* Bar Graph Simulation */}
              <div className="mt-5 flex h-20 w-full items-end gap-2 pt-2">
                {[38, 45, 42, 58, 64, 60, 72, 68, 85, 92, 88, 100].map((val, i) => (
                  <div
                    key={i}
                    style={{ height: `${val}%` }}
                    className={cn(
                      'flex-1 cursor-pointer rounded-t-sm transition-all duration-200 hover:opacity-80',
                      i >= 8 ? 'bg-[#0056FF]' : 'bg-[#E3E7FC]',
                    )}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      );

    case 'hanging-tabs-nav':
      return (
        <div className="flex w-full flex-col items-center gap-5">
          {/* Controls Bar */}
          <div className="flex items-center justify-center gap-2">
            {(['sm', 'md', 'lg'] as const).map((sz) => (
              <GeometricButton
                key={sz}
                size="sm"
                variant={state.hangingNavSize === sz ? 'blue' : 'outline'}
                isActive={state.hangingNavSize === sz}
                onClick={() => state.setHangingNavSize(sz)}
              >
                Size {sz.toUpperCase()}
              </GeometricButton>
            ))}
          </div>

          <div className="w-full max-w-xl rounded-3xl border border-slate-200/90 bg-white p-6 shadow-md">
            <div className="rounded-t-2xl border-b border-slate-200 bg-slate-50 px-6 pt-4 pb-0">
              <div className="flex items-center justify-between pb-3">
                <span className="font-sans text-xs font-bold tracking-wider text-slate-700 uppercase">
                  Header Navigation Ceiling
                </span>
                <span className="font-mono text-[10px] text-slate-500">
                  SNPI-SMS Hanging Tabs Standard
                </span>
              </div>
              <div className="-mb-[1px] flex justify-center">
                <HangingTabsNav
                  activeId={state.hangingNavTab}
                  onSelect={state.setHangingNavTab}
                  size={state.hangingNavSize}
                  items={[
                    { id: 'map', label: 'Map', icon: Pin },
                    { id: 'newswire', label: 'Newswire', icon: Newspaper },
                    { id: 'post', label: 'Post', icon: FilePlus },
                    { id: 'friends', label: 'Friends', icon: Contacts },
                  ]}
                />
              </div>
            </div>
            <div className="p-5 text-center">
              <span className="font-mono text-xs text-slate-600">
                Active Tab:{' '}
                <strong className="text-[#0056FF]">{state.hangingNavTab.toUpperCase()}</strong>
              </span>
            </div>
          </div>
        </div>
      );

    case 'input':
      return (
        <div className="flex w-full flex-col items-center gap-5">
          {/* Variant Selector */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {(['blue', 'azure', 'soft-lavender', 'black', 'outline'] as const).map((v) => (
              <GeometricButton
                key={v}
                variant={state.inputDemoVariant === v ? 'blue' : 'outline'}
                size="sm"
                isActive={state.inputDemoVariant === v}
                onClick={() => state.setInputDemoVariant(v)}
              >
                {v === 'blue'
                  ? 'Royal Blue'
                  : v === 'azure'
                    ? 'Azure'
                    : v === 'soft-lavender'
                      ? 'Lavender'
                      : v === 'black'
                        ? 'Black'
                        : 'Outline'}
              </GeometricButton>
            ))}
          </div>

          <div className="w-full max-w-xl space-y-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-md">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-sans text-sm font-bold text-slate-900">
                  Pill Input & Search Bar
                </h4>
                <p className="font-sans text-xs text-slate-500">
                  Capsule contour with 2px brand border tokens
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => state.setInputDemoLoading(!state.inputDemoLoading)}
                  className="rounded-full border border-slate-200 px-2.5 py-0.5 font-mono text-[10px] text-slate-600 hover:border-[#0056FF]"
                >
                  {state.inputDemoLoading ? 'Loading ON' : 'Loading OFF'}
                </button>
                <button
                  type="button"
                  onClick={() => state.setInputDemoDisabled(!state.inputDemoDisabled)}
                  className="rounded-full border border-slate-200 px-2.5 py-0.5 font-mono text-[10px] text-slate-600 hover:border-[#0056FF]"
                >
                  {state.inputDemoDisabled ? 'Disabled' : 'Enabled'}
                </button>
              </div>
            </div>

            <GeometricInput
              type="search"
              placeholder="Search components, students, or endpoints..."
              value={state.inputDemoText}
              onChange={(e) => state.setInputDemoText(e.target.value)}
              clearable
              onClear={() => state.setInputDemoText('')}
              icon={<Search className="h-4 w-4 text-[#0056FF]" />}
              variant={state.inputDemoVariant}
              inputSize={state.inputDemoSize}
              isLoading={state.inputDemoLoading}
              disabled={state.inputDemoDisabled}
            />

            <div className="flex items-center justify-between rounded-2xl border border-[#CAD3F5] bg-[#E3E7FC]/60 p-3.5 font-mono text-xs text-slate-700">
              <span>
                Value: &quot;<strong className="text-[#0056FF]">{state.inputDemoText}</strong>&quot;
              </span>
              <span>
                Length: <strong>{state.inputDemoText.length} chars</strong>
              </span>
              <span>
                Variant: <strong className="uppercase">{state.inputDemoVariant}</strong>
              </span>
            </div>
          </div>
        </div>
      );

    // ==========================================
    // NAVIGATION GROUP (Interactive Demos)
    // ==========================================
    case 'rail-toc':
      return <RailTocDemo />;
    case 'bounce-sidebar':
      return <BounceSidebarDemo />;
    case 'hook-sidebar':
      return <HookSidebarDemo />;
    case 'proximity-sidebar':
      return <ProximitySidebarDemo />;
    case 'scroll-progress':
      return <ScrollProgressDemo />;
    case 'gooey-nav':
      return <GooeyNavDemo />;

    // ==========================================
    // INPUTS GROUP (Interactive Demos)
    // ==========================================
    case 'duration-picker':
      return <DurationPickerDemo />;
    case 'otp-input':
      return <OtpInputDemo />;
    case 'password-input':
      return <PasswordInputDemo />;
    case 'theme-selector':
      return <ThemeSelectorDemo />;
    case 'delete-button':
      return <DeleteButtonDemo />;
    case 'task-list':
      return <TaskListDemo />;

    // ==========================================
    // FEEDBACK GROUP (Interactive Demos)
    // ==========================================
    case 'toast':
      return <ToastDemo />;
    case 'emoji-reaction':
      return <EmojiReactionDemo />;
    case 'notification-bell':
      return <NotificationBellDemo />;

    // ==========================================
    // DISPLAY GROUP (Interactive Demos)
    // ==========================================
    case 'folder':
      return <FolderDemo />;
    case 'code-block':
      return <CodeBlockDemo />;
    case 'gravity-letters':
      return <GravityLettersDemo />;
    case 'github-activity':
      return <GitHubActivityDemo />;
    case 'step-player':
      return <StepPlayerDemo />;
    case 'animated-counter':
      return <AnimatedCounterDemo />;
    case 'voice-note':
      return <VoiceNoteDemo />;
    case 'faq':
      return <FaqDemo />;

    // ==========================================
    // AI KIT GROUP (Interactive Demos)
    // ==========================================
    case 'fluid-orb':
      return <FluidOrbDemo />;
    case 'grid-reveal':
      return <GridRevealDemo />;
    case 'matrix-orb':
      return <MatrixOrbDemo />;
    case 'web-search':
      return <WebSearchDemo />;
    case 'inline-ai-status':
      return <InlineAiStatusDemo />;

    // ==========================================
    // NAVIGATION MENU (Rare UI Floating 3-Island Header)
    // ==========================================
    case 'capsule-dock-nav':
    case 'navigation-menu':
      return <CapsuleDockDemo />;

    // ==========================================
    // BACKGROUNDS (Component Templates)
    // ==========================================
    case 'dot-pattern':
      return <DotPatternDemo />;
    case 'retro-grid':
      return <RetroGridDemo />;
    case 'aurora-waves':
      return <AuroraWavesDemo />;
    case 'interactive-particles':
      return <InteractiveParticlesDemo />;

    // ==========================================
    // TEXT EFFECTS (Component Templates)
    // ==========================================
    case 'text-shimmer':
      return <TextShimmerDemo />;
    case 'number-ticker':
      return <NumberTickerDemo />;
    case 'glitch-text':
      return <GlitchTextDemo />;
    case 'blur-in':
      return <BlurInDemo />;

    // ==========================================
    // CARDS (Component Templates)
    // ==========================================
    case 'spotlight-card':
      return <SpotlightCardDemo />;
    case 'bento-card':
      return <BentoCardDemo />;
    case 'tilt-card':
      return <TiltCardDemo />;
    case 'border-beam':
      return <BorderBeamDemo />;

    // ==========================================
    // SECTIONS (Component Templates)
    // ==========================================
    case 'hero-section':
      return <HeroSectionDemo />;
    case 'feature-bento':
      return <FeatureBentoDemo />;
    case 'pricing-matrix':
      return <PricingMatrixDemo />;
    case 'marquee-section':
      return <MarqueeSectionDemo />;

    // ==========================================
    // FORMS (Component Templates)
    // ==========================================
    case 'floating-label-form':
      return <FloatingLabelFormDemo />;
    case 'multi-step-wizard':
      return <MultiStepWizardDemo />;
    case 'file-dropzone':
      return <FileDropzoneDemo />;
    case 'payment-card':
      return <PaymentCardDemo />;

    // ==========================================
    // OVERLAYS (Component Templates)
    // ==========================================
    case 'command-palette':
      return <CommandPaletteDemo />;
    case 'confetti-cannon':
      return <ConfettiCannonDemo />;
    case 'drawer-sheet':
      return <DrawerSheetDemo />;
    case 'image-lightbox':
      return <ImageLightboxDemo />;

    default:
      return null;
  }
}
