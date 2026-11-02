'use client';

import * as React from 'react';
import {
  BrandConceptBlueprint,
  LibrarySnackbar,
  NativeSnackbarInline,
  type SnackbarVariant,
  LibrarySwitch,
  LibraryChip,
  LibraryDropdown,
  COMPONENT_LIBRARY_REGISTRY,
  COMPONENT_CATEGORIES,
  GeometricButton,
  GeometricInput,
  GeometricHeaderStamp,
  HookSidebarDemo,
  GooeyNavDemo,
  CyberArmorNavDemo,
  DurationPickerDemo,
  PasswordInputDemo,
  ThemeSelectorDemo,
  NotificationBellDemo,
  FolderDemo,
  StepPlayerDemo,
  AnimatedCounterDemo,
  VoiceNoteDemo,
  FaqDemo,
  GridRevealDemo,
  MarqueeSectionDemo,
  FloatingLabelFormDemo,
  MultiStepWizardDemo,
  FileDropzoneDemo,
  DataTableDemo,
  CipherTextDecoderDemo,
  ToastStackDemo,
  StatusPage404Demo,
  SkeletonLoadingScreenDemo,
  RichTextEditorDemo,
  HookSidebar,
  type HookSidebarItem,
  generateAiAgentPrompt,
  RadiantIntegrationHub,
  TactileFolderShowcase,
} from '@/features/document/components/ui-library';
import {
  Home,
  Search,
  Folder,
  Plus,
  MapPin,
  Check,
  Copy,
  Sparkles,
  Eye,
  EyeOff,
  User,
  Monitor,
  FileText,
  LayoutGrid,
  ChevronDown,
  ChevronRight,
  X,
  Terminal,
  ArrowRight,
  Compass,
  Layers,
  Bot,
  Zap,
  ShieldCheck,
  Globe,
  Radio,
  SquarePen,
  Table,
  Bell,
  Sliders,
} from '@/components/icons';
import { useDocsNav } from './docs-nav-context';
import { cn } from '@/lib/utils';

/**
 * Universal bulletproof clipboard copy helper with hidden textarea execCommand fallback.
 * Works seamlessly across mobile Safari, iOS Chrome, Android, iframes, and local network IP contexts.
 */
async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  // 1. Modern Navigator Clipboard API
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to execCommand fallback
    }
  }

  // 2. Reliable DOM Textarea fallback
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.style.fontSize = '16px';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, text.length);

    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('All clipboard copy methods failed:', err);
    return false;
  }
}

export function UiLibraryView() {
  const { activeTab, setActiveTab } = useDocsNav();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const isManualScrollRef = React.useRef<boolean>(false);
  const scrollTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Search query to filter components
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  // Per-component tab view state: 'preview' | 'prompt'
  const [componentTabs] = React.useState<Record<string, 'preview' | 'prompt'>>({});
  const getCompTab = (id: string): 'preview' | 'prompt' => componentTabs[id] || 'preview';

  // Sidebar collapsible category state (Inspired by Knowledge Base reference)
  const [collapsedCategories, setCollapsedCategories] = React.useState<Record<string, boolean>>({});
  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Active section for Line Tracker
  const [activeSectionId, setActiveSectionId] = React.useState<string>('interactive-feed');

  // Copy tracking states
  const [copiedPromptId, setCopiedPromptId] = React.useState<string | null>(null);
  const [copiedInstallId, setCopiedInstallId] = React.useState<string | null>(null);

  const handleCopyPrompt = async (id: string, text: string) => {
    const success = await copyTextToClipboard(text);
    if (success) {
      setCopiedPromptId(id);
      setTimeout(() => setCopiedPromptId(null), 2500);
    }
  };

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

  // 10. Card interactive states (Folder mode & Metrics mode)
  const [cardPresentationMode, setCardPresentationMode] = React.useState<'folder' | 'metrics'>(
    'folder',
  );
  const [cardRevealed, setCardRevealed] = React.useState(false);
  const [cardSlidOut, setCardSlidOut] = React.useState(false);
  const [metricsTimeRange, setMetricsTimeRange] = React.useState<'30D' | '90D' | '1Y' | 'All'>(
    '30D',
  );

  const sidebarContainerRef = React.useRef<HTMLDivElement>(null);

  // Filter 73 components in real-time (preserves canonical COMPONENT_CATEGORIES order)
  const filteredComponents = React.useMemo(() => {
    if (!searchQuery.trim()) return COMPONENT_LIBRARY_REGISTRY;
    const q = searchQuery.toLowerCase().trim();
    return COMPONENT_LIBRARY_REGISTRY.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  // Group filtered components strictly by flow group (category) matching the menu
  const groupedCategories = React.useMemo(() => {
    return COMPONENT_CATEGORIES.map((category, index) => {
      const comps = filteredComponents.filter((c) => c.category === category);
      const categorySlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return {
        category,
        categoryId: `cat-${categorySlug}`,
        groupNumber: index + 1,
        components: comps,
      };
    }).filter((group) => group.components.length > 0);
  }, [filteredComponents]);

  // Interactive Hero Paradigm Toggle Mode (Flat 0px vs Living Motion FX)
  const [heroInteractiveMode, setHeroInteractiveMode] = React.useState<'flat' | 'spring'>('flat');

  // Section IDs for active tracking in Left Sticky Menu (strictly linear sequential flow)
  const scrollSectionIds = React.useMemo(() => {
    const ids = ['ui-library-head', 'interactive-feed'];
    groupedCategories.forEach((group) => {
      ids.push(group.categoryId);
      group.components.forEach((comp) => {
        ids.push(`comp-${comp.id}`);
      });
    });
    ids.push('brand-identity', 'brand-blueprint', 'design-principles', 'touch-targets');
    return ids;
  }, [groupedCategories]);

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

  // Keep active item gently visible within Left Sticky Sidebar
  React.useEffect(() => {
    if (!sidebarContainerRef.current || isManualScrollRef.current) return;
    const container = sidebarContainerRef.current;
    const activeEl = container.querySelector<HTMLElement>(`[data-section-id="${activeSectionId}"]`);
    if (!activeEl) return;

    const containerRect = container.getBoundingClientRect();
    const elRect = activeEl.getBoundingClientRect();

    if (elRect.top < containerRect.top + 45) {
      container.scrollTop += elRect.top - containerRect.top - 45;
    } else if (elRect.bottom > containerRect.bottom - 45) {
      container.scrollTop += elRect.bottom - containerRect.bottom + 45;
    }
  }, [activeSectionId]);

  const handleCopyInstall = async (id: string, cmd: string) => {
    const success = await copyTextToClipboard(cmd);
    if (success) {
      setCopiedInstallId(id);
      setTimeout(() => setCopiedInstallId(null), 2500);
    }
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
    cardPresentationMode,
    setCardPresentationMode,
    cardRevealed,
    setCardRevealed,
    cardSlidOut,
    setCardSlidOut,
    metricsTimeRange,
    setMetricsTimeRange,
  };

  return (
    <div
      ref={rootRef}
      className="min-h-screen bg-white text-slate-900 selection:bg-[#0056FF] selection:text-white"
    >
      {/* Main Grid Container */}
      <div className="mx-auto max-w-[1560px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* COLUMN 1: Left Sticky Sidebar Navigation (Knowledge Base Style - Desktop Only, Hidden on Mobile for Clean Homepage) */}
          <aside className="hidden lg:sticky lg:top-20 lg:z-30 lg:block lg:w-64 lg:shrink-0 lg:self-start xl:w-72">
            <div
              ref={sidebarContainerRef}
              className="no-scrollbar max-h-[calc(100vh-5.5rem)] [scrollbar-width:none] space-y-4 overflow-y-auto pr-2 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {/* Knowledge Base Header (Images 3 & 4) */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-sans text-sm font-bold text-slate-900">Knowledge base</span>
                <button
                  type="button"
                  title="Total Components"
                  className="flex size-6 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                >
                  <Plus className="size-3.5 stroke-[2]" />
                </button>
              </div>

              {/* Clean Search Documents Input (Images 3 & 4) */}
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search documents"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pr-3 pl-8.5 font-sans text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0056FF] focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Collapsible Folder Categories Tree */}
              <div className="space-y-1.5 pt-1 font-sans text-xs">
                {groupedCategories.length === 0 ? (
                  <div className="px-3 py-4 text-center font-sans text-xs text-slate-400">
                    No matching documents found
                  </div>
                ) : (
                  groupedCategories.map((group) => {
                    const isCollapsed = collapsedCategories[group.category];
                    const isCategoryActive =
                      activeSectionId === group.categoryId ||
                      group.components.some((c) => activeSectionId === `comp-${c.id}`);

                    return (
                      <div key={group.category} className="space-y-0.5">
                        {/* Folder Header */}
                        <button
                          type="button"
                          onClick={() => toggleCategory(group.category)}
                          className={cn(
                            'group flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-left font-sans text-xs font-semibold transition-all select-none',
                            isCategoryActive
                              ? 'bg-slate-100 font-bold text-slate-950'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950',
                          )}
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            {isCollapsed ? (
                              <ChevronRight className="size-3.5 shrink-0 text-slate-400" />
                            ) : (
                              <ChevronDown className="size-3.5 shrink-0 text-slate-400" />
                            )}
                            <Folder
                              className={cn(
                                'size-3.5 shrink-0 transition-colors',
                                isCategoryActive
                                  ? 'text-slate-900'
                                  : 'text-slate-500 group-hover:text-slate-900',
                              )}
                            />
                            <span className="truncate">{group.category}</span>
                          </div>
                          <span className="font-mono text-[10px] font-normal text-slate-400">
                            {group.components.length}
                          </span>
                        </button>

                        {/* Folder File Items (Hook Sidebar with Dashed Rail Style) */}
                        {!isCollapsed && (
                          <div className="ml-3 pl-1">
                            <HookSidebar
                              items={group.components.map((comp) => ({
                                label: comp.name,
                                icon: (
                                  <FileText className="size-3 shrink-0 text-slate-400 group-hover:text-slate-900" />
                                ),
                                onClick: () => scrollToSection(`comp-${comp.id}`),
                              }))}
                              value={group.components.findIndex(
                                (c) => activeSectionId === `comp-${c.id}`,
                              )}
                              onChange={(idx) => {
                                const comp = group.components[idx];
                                if (comp) scrollToSection(`comp-${comp.id}`);
                              }}
                              dashed={true}
                              color="#0056FF"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}

                {/* Documentation Section Links (Hook Sidebar Dashed Rail Style) */}
                <div className="mt-3 border-t border-slate-100 pt-3">
                  <div className="pb-1.5 font-mono text-[10px] font-bold text-slate-400 uppercase">
                    <span>Documentation</span>
                  </div>
                  <div className="ml-1">
                    <HookSidebar
                      items={[
                        {
                          label: 'Brand Blueprint',
                          icon: (
                            <FileText className="size-3 shrink-0 text-slate-400 group-hover:text-slate-900" />
                          ),
                          onClick: () => scrollToSection('brand-blueprint'),
                        },
                        {
                          label: 'Design Standards',
                          icon: (
                            <FileText className="size-3 shrink-0 text-slate-400 group-hover:text-slate-900" />
                          ),
                          onClick: () => scrollToSection('design-principles'),
                        },
                        {
                          label: 'Touch Targets',
                          icon: (
                            <FileText className="size-3 shrink-0 text-slate-400 group-hover:text-slate-900" />
                          ),
                          onClick: () => scrollToSection('touch-targets'),
                        },
                      ]}
                      value={['brand-blueprint', 'design-principles', 'touch-targets'].indexOf(
                        activeSectionId,
                      )}
                      onChange={(idx) => {
                        const docs = ['brand-blueprint', 'design-principles', 'touch-targets'];
                        if (docs[idx]) scrollToSection(docs[idx]);
                      }}
                      dashed={true}
                      color="#0056FF"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* COLUMN 2: Center Main Interactive Component Feed (1-Column Continuous Scroll Feed) */}
          <main className="min-w-0 flex-1 space-y-10">
            {/* STICKY CATEGORY NAVIGATION RAIL (Zero Dot, Zero Title Clutter) */}
            <div className="sticky top-[68px] z-30 -mx-4 border-y border-slate-200/90 bg-white/95 px-4 py-2 shadow-2xs backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
              {/* Mobile & PC Quick-Jump Category Menu Rail */}
              <div className="no-scrollbar flex w-full items-center gap-1.5 overflow-x-auto py-0.5">
                <button
                  type="button"
                  onClick={() => scrollToSection('ui-library-head')}
                  className={cn(
                    'shrink-0 rounded-full px-3 py-1 font-sans text-xs font-bold transition-all select-none',
                    activeSectionId === 'ui-library-head'
                      ? 'bg-[#0056FF] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-950',
                  )}
                >
                  Home
                </button>
                {groupedCategories.map((grp) => {
                  const isCurrent =
                    activeSectionId === grp.categoryId ||
                    grp.components.some((c) => activeSectionId === `comp-${c.id}`);
                  return (
                    <button
                      key={grp.category}
                      type="button"
                      onClick={() => scrollToSection(grp.categoryId)}
                      className={cn(
                        'shrink-0 rounded-full px-3 py-1 font-sans text-xs font-bold transition-all select-none',
                        isCurrent
                          ? 'bg-[#0056FF] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-950',
                      )}
                    >
                      {grp.category}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* HERO HEAD TITLE: Ultra-Creative Interactive Engine Hero (References 3 & 4) */}
            <section id="ui-library-head" className="scroll-mt-36 space-y-4">
              <div className="relative overflow-hidden rounded-3xl border border-[#CAD3F5] bg-gradient-to-b from-white via-[#EFF5FF]/40 to-white p-5 shadow-xs sm:p-10">
                {/* Subtle Geometric Background Dot Grid */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.35]"
                  style={{
                    backgroundImage:
                      'radial-gradient(#0056FF 0.75px, transparent 0.75px), radial-gradient(#0056FF 0.75px, #FFFFFF 0.75px)',
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 10px 10px',
                  }}
                />

                <div className="relative z-10 space-y-6 sm:space-y-8">
                  {/* Creative Centerpiece Headline with Embedded Toggle Switch (Image 4 Reference) */}
                  <div className="flex flex-col gap-3">
                    <div>
                      <h1 className="font-sans text-4xl leading-none font-black tracking-tight text-[#0A1A4A] select-none sm:text-6xl md:text-7xl">
                        <span className="block tracking-tight">CREATIVE</span>
                        <span className="my-1 flex items-center gap-2 sm:gap-4">
                          <span>PR</span>
                          <button
                            type="button"
                            onClick={() =>
                              setHeroInteractiveMode((prev) =>
                                prev === 'flat' ? 'spring' : 'flat',
                              )
                            }
                            className="group relative inline-flex h-9 w-20 cursor-pointer items-center rounded-full border-2 border-[#0056FF] bg-[#EFF5FF] p-1 shadow-inner transition-all active:scale-95 sm:h-14 sm:w-28 md:h-16 md:w-32"
                            title="Toggle Interactive Design Paradigm (0px Flat vs Spring FX)"
                            aria-label="Toggle Interactive Design Paradigm"
                          >
                            <span
                              className={cn(
                                'inline-flex size-7 items-center justify-center rounded-full bg-[#0056FF] font-mono text-[10px] font-black text-white shadow-xs transition-all duration-300 sm:size-11 sm:text-sm md:size-13',
                                heroInteractiveMode === 'flat'
                                  ? 'translate-x-0'
                                  : 'translate-x-9 bg-[#2277FF] sm:translate-x-14 md:translate-x-16',
                              )}
                            >
                              {heroInteractiveMode === 'flat' ? '0px' : 'FX'}
                            </span>
                          </button>
                          <span>DUCT</span>
                        </span>
                        <span className="block text-[#0056FF]">SYSTEM</span>
                      </h1>
                    </div>
                  </div>

                  {/* ============================================================= */}
                  {/* 1. RADIANT 6-NODE INTEGRATION HUB (IMAGE 1 REFERENCE)         */}
                  {/* ============================================================= */}
                  <RadiantIntegrationHub
                    center={{
                      title: 'SNPI DESIGN ENGINE',
                      subtitle: 'Mathematical Token Matrix',
                      icon: <Layers className="size-7 stroke-[2.2]" />,
                      badge: '73 Primitives',
                    }}
                    leftNodes={[
                      {
                        id: 'cat-navigation',
                        label: 'Navigation & Docks',
                        sublabel: 'Cyber Armor & Rails',
                        tag: '01 · Nav',
                        badge: 'Dock',
                        icon: <Compass className="size-5" />,
                      },
                      {
                        id: 'cat-feedback',
                        label: 'Feedback & Overlays',
                        sublabel: 'Snackbar & Dialog',
                        tag: '02 · Dialog',
                        badge: 'Motion',
                        icon: <Bell className="size-5" />,
                      },
                      {
                        id: 'cat-forms',
                        label: 'Inputs & Controls',
                        sublabel: 'Switches & Chips',
                        tag: '03 · Input',
                        badge: 'Forms',
                        icon: <Sliders className="size-5" />,
                      },
                    ]}
                    rightNodes={[
                      {
                        id: 'cat-display',
                        label: 'Cards & Containers',
                        sublabel: 'Tactile Folders & Tables',
                        tag: '04 · Card',
                        badge: 'Display',
                        icon: <Folder className="size-5" />,
                      },
                      {
                        id: 'cat-buttons',
                        label: 'Buttons & Actions',
                        sublabel: 'Geometric & FAB',
                        tag: '05 · Action',
                        badge: '0px',
                        icon: <Zap className="size-5" />,
                      },
                      {
                        id: 'cat-ai-kit',
                        label: 'AI Agent Prompts',
                        sublabel: 'Procedural Prompts',
                        tag: '06 · AI',
                        badge: 'GenUI',
                        icon: <Bot className="size-5" />,
                      },
                    ]}
                    activeNodeId={activeSectionId}
                    onSelectNode={(id) => scrollToSection(id)}
                  />

                  {/* ============================================================= */}
                  {/* 2. TACTILE FOLDER SHOWCASE & SWITCHER DOCK (IMAGE 2 REFERENCE) */}
                  {/* ============================================================= */}
                  <div className="pt-2">
                    <TactileFolderShowcase
                      cards={[
                        {
                          id: 'card-controls-switch',
                          title: 'Controls & Micro-Interactions',
                          badge: 'Interactive Demo',
                          content: (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-200">
                                <div className="space-y-0.5">
                                  <span className="block font-sans text-xs font-bold text-slate-900">
                                    Biometric Session
                                  </span>
                                  <span className="block font-mono text-[10px] text-slate-500">
                                    WebAuthn Key Access
                                  </span>
                                </div>
                                <LibrarySwitch
                                  checked={switchBiometric}
                                  onCheckedChange={setSwitchBiometric}
                                  aria-label="Biometric Session"
                                />
                              </div>

                              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 border border-slate-200">
                                <div className="space-y-0.5">
                                  <span className="block font-sans text-xs font-bold text-slate-900">
                                    Auto Synchronize
                                  </span>
                                  <span className="block font-mono text-[10px] text-slate-500">
                                    Sub-10ms SQLite Cache
                                  </span>
                                </div>
                                <LibrarySwitch
                                  checked={switchAutoSync}
                                  onCheckedChange={setSwitchAutoSync}
                                  aria-label="Auto Synchronize"
                                />
                              </div>

                              <div className="flex flex-wrap gap-1.5 pt-1">
                                <LibraryChip
                                  active={selectedChips.includes('flat')}
                                  onClick={() => toggleChip('flat')}
                                >
                                  0px Flat
                                </LibraryChip>
                                <LibraryChip
                                  active={selectedChips.includes('contrast')}
                                  onClick={() => toggleChip('contrast')}
                                >
                                  AAA Contrast
                                </LibraryChip>
                                <LibraryChip
                                  active={selectedChips.includes('spring')}
                                  onClick={() => toggleChip('spring')}
                                >
                                  &lt;300ms Spring
                                </LibraryChip>
                              </div>
                            </div>
                          ),
                        },
                        {
                          id: 'card-feedback-overlay',
                          title: 'Feedback & Overlay Action',
                          badge: 'Live Snackbars',
                          content: (
                            <div className="space-y-3">
                              <p className="font-sans text-[11px] text-slate-600">
                                Living feedback notifications with spring exit physics and zero DOM
                                churn.
                              </p>
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSnackbarMsg('Operation completed successfully');
                                    setSnackbarVariant('success');
                                    setSnackbarOpen(true);
                                  }}
                                  className="flex-1 cursor-pointer rounded-xl bg-emerald-600 px-3 py-2 text-center font-sans text-xs font-bold text-white transition-all hover:bg-emerald-700 active:scale-95"
                                >
                                  Test Success
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSnackbarMsg('Attention: Review academic policy');
                                    setSnackbarVariant('warning');
                                    setSnackbarOpen(true);
                                  }}
                                  className="flex-1 cursor-pointer rounded-xl bg-amber-500 px-3 py-2 text-center font-sans text-xs font-bold text-white transition-all hover:bg-amber-600 active:scale-95"
                                >
                                  Test Warning
                                </button>
                              </div>
                              <div className="rounded-lg bg-slate-100 p-2 font-mono text-[10px] text-slate-600">
                                Active Status: {snackbarOpen ? `Open (${snackbarVariant})` : 'Idle'}
                              </div>
                            </div>
                          ),
                        },
                        {
                          id: 'card-cyber-armor',
                          title: 'Cyber Armor Mecha Plate',
                          badge: '45° Chamfers',
                          content: (
                            <div className="space-y-3">
                              <p className="font-sans text-[11px] text-slate-600">
                                Precision aerospace mecha console with milled double seams and zero
                                scrollbars.
                              </p>
                              <div className="flex items-center justify-between rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-3">
                                <div className="flex items-center gap-2">
                                  <span className="size-2 rounded-full bg-[#0056FF]" />
                                  <span className="font-mono text-xs font-black text-[#0A1A4A]">
                                    ARMOR-PLATE // V2
                                  </span>
                                </div>
                                <span className="rounded bg-[#0056FF] px-2 py-0.5 font-mono text-[9px] font-bold text-white">
                                  ROYAL BLUE
                                </span>
                              </div>
                              <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-[9px]">
                                <div className="rounded bg-slate-100 p-1.5 text-slate-700">
                                  CHAMFER: 45°
                                </div>
                                <div className="rounded bg-slate-100 p-1.5 text-slate-700">
                                  DEPTH: 0px
                                </div>
                                <div className="rounded bg-slate-100 p-1.5 text-slate-700">
                                  SPRING: 280ms
                                </div>
                              </div>
                            </div>
                          ),
                        },
                      ]}
                    />
                  </div>


                </div>
              </div>
            </section>

            {/* COMPONENT DEMOS ARRANGED BY CATEGORY */}
            <div className="space-y-12">
              {groupedCategories.map((group) => {
                return (
                  <div
                    key={group.category}
                    id={group.categoryId}
                    className="scroll-mt-36 space-y-8"
                  >
                    {/* Demos Inside This Category */}
                    <div className="space-y-8">
                      {group.components.map((comp, compIdx) => {
                        const sectionId = `comp-${comp.id}`;
                        const currentTab = getCompTab(comp.id);

                        return (
                          <section
                            key={comp.id}
                            id={sectionId}
                            className="scroll-mt-24 rounded-3xl border border-slate-200/90 bg-white p-3.5 shadow-xs transition-all hover:border-[#0056FF]/40 sm:p-8"
                          >
                            {/* Top Header Row with Number, Name, Category Badge, Description */}
                            <div className="mb-4">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono text-xs font-black text-[#0056FF]">
                                  0{group.groupNumber}.0{compIdx + 1}
                                </span>
                                <h2 className="font-sans text-lg font-black text-slate-950 sm:text-xl">
                                  {comp.name}
                                </h2>
                                <span className="rounded-[4px] border border-slate-200 px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-wider text-slate-500 uppercase">
                                  {comp.category}
                                </span>
                              </div>
                              {comp.description && (
                                <p className="mt-1 hidden font-sans text-xs text-slate-500 sm:block sm:text-sm">
                                  {comp.description}
                                </p>
                              )}

                              {/* Subtle Divider Line */}
                              <div className="mt-4 border-b border-slate-100" />
                            </div>

                            {/* Clean Stage Canvas (Default Full Size) & NPX Install Bar Below */}
                            {currentTab === 'preview' && (
                              <div className="space-y-3">
                                {/* Default Full Size Stage (Overflow-Visible to prevent dropdown/popover clipping) */}
                                <div className="relative flex min-h-[320px] w-full items-center justify-center rounded-2xl bg-[#FAFAFA] p-2.5 sm:min-h-[420px] sm:p-8">
                                  {/* Subtle Background Grid Pattern */}
                                  <div
                                    className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl opacity-[0.35]"
                                    style={{
                                      backgroundImage:
                                        'radial-gradient(#0056FF 0.75px, transparent 0.75px), radial-gradient(#0056FF 0.75px, #FAFAFA 0.75px)',
                                      backgroundSize: '24px 24px',
                                      backgroundPosition: '0 0, 12px 12px',
                                    }}
                                  />

                                  {/* Full Size Component Render */}
                                  <div className="no-scrollbar relative z-10 flex w-full max-w-full items-center justify-center overflow-x-auto px-1 py-2 sm:py-6">
                                    {renderFeedComponentDemo(comp.id, stateBundle)}
                                  </div>
                                </div>

                                {/* Component Specific NPX Command Bar Below Demo */}
                                <div className="flex flex-col gap-2.5 rounded-xl border border-slate-200/90 bg-[#F8FAFC] p-3 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-2.5">
                                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                                    <div className="flex items-center gap-1.5 text-slate-500">
                                      <Terminal className="size-3.5 text-[#0056FF]" />
                                      <span className="shrink-0 font-mono text-[10px] font-bold tracking-wider uppercase">
                                        Install:
                                      </span>
                                    </div>
                                    <code className="rounded-md border border-[#CAD3F5] bg-[#E3E7FC]/60 px-2.5 py-1 font-mono text-xs font-bold break-all text-[#0056FF] sm:break-normal">
                                      npx snpi-ui@latest add {comp.id}
                                    </code>
                                  </div>

                                  <div className="flex w-full items-center gap-2 sm:w-auto">
                                    {/* Copy Install Command Button */}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleCopyInstall(
                                          comp.id,
                                          `npx snpi-ui@latest add ${comp.id}`,
                                        )
                                      }
                                      className={cn(
                                        'flex flex-1 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs font-bold transition-all active:scale-95 sm:flex-none sm:py-1',
                                        copiedInstallId === comp.id
                                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                          : 'border-slate-200 bg-white text-slate-700 hover:border-[#0056FF] hover:bg-[#EFF5FF] hover:text-[#0056FF]',
                                      )}
                                      title={`Copy install command for ${comp.name}`}
                                    >
                                      {copiedInstallId === comp.id ? (
                                        <>
                                          <Check className="size-3.5 stroke-[2.2] text-emerald-600" />
                                          <span>Command Copied!</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="size-3.5 stroke-[2]" />
                                          <span>Copy Command</span>
                                        </>
                                      )}
                                    </button>

                                    {/* 1-Click Copy AI Agent Prompt Button */}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleCopyPrompt(comp.id, generateAiAgentPrompt(comp))
                                      }
                                      className={cn(
                                        'flex flex-1 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs font-bold transition-all active:scale-95 sm:flex-none sm:py-1',
                                        copiedPromptId === comp.id
                                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                          : 'border-slate-200 bg-white text-slate-700 hover:border-[#0056FF] hover:bg-[#EFF5FF] hover:text-[#0056FF]',
                                      )}
                                      title={`Copy AI agent prompt specification for ${comp.name}`}
                                    >
                                      {copiedPromptId === comp.id ? (
                                        <>
                                          <Check className="size-3.5 stroke-[2.2] text-emerald-600" />
                                          <span>Prompt Copied!</span>
                                        </>
                                      ) : (
                                        <>
                                          <Sparkles className="size-3.5 stroke-[2] text-[#0056FF]" />
                                          <span>Copy Prompt Text</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* TAB CONTENT: PROMPT (Universal AI Agent MVP Specification Skill) */}
                            {currentTab === 'prompt' && (
                              <div className="space-y-4 pt-2">
                                {/* Prompt Header & 1-Click Copy Banner */}
                                <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-[#F8FAFC] p-4 sm:flex-row sm:items-center sm:justify-between">
                                  <div className="flex items-center gap-3">
                                    <span className="flex size-9 items-center justify-center rounded-[4px] bg-[#0056FF] text-white shadow-xs">
                                      <Sparkles className="size-4 stroke-[2]" />
                                    </span>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <h3 className="font-sans text-xs font-bold text-slate-900">
                                          Universal AI Agent MVP Prompt Skill
                                        </h3>
                                        <span className="rounded-[4px] border border-[#CAD3F5] bg-[#E3E7FC] px-2 py-0.5 font-mono text-[9px] font-bold text-[#0056FF] uppercase">
                                          {comp.category}
                                        </span>
                                      </div>
                                      <p className="font-sans text-[11px] text-slate-500">
                                        Direct MVP instructions for Antigravity, Cursor, Claude 3.5,
                                        ChatGPT, Copilot, or v0.
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <GeometricButton
                                      size="sm"
                                      variant={copiedPromptId === comp.id ? 'blue' : 'outline'}
                                      onClick={() =>
                                        handleCopyPrompt(comp.id, generateAiAgentPrompt(comp))
                                      }
                                      icon={
                                        copiedPromptId === comp.id ? (
                                          <Check className="size-3 stroke-[2.2] text-white" />
                                        ) : (
                                          <Copy className="size-3 stroke-[2] text-slate-600" />
                                        )
                                      }
                                    >
                                      {copiedPromptId === comp.id
                                        ? 'Prompt Copied!'
                                        : 'Copy AI Prompt'}
                                    </GeometricButton>
                                  </div>
                                </div>

                                {/* Complete Monospace Prompt Box */}
                                <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-[#F8FAFC] p-5 text-slate-900 shadow-2xs">
                                  <div className="mb-3 flex items-center justify-between border-b border-slate-200 pb-3">
                                    <div className="flex items-center gap-2">
                                      <span className="rounded-[3px] bg-[#0056FF]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#0056FF]">
                                        SPEC
                                      </span>
                                      <span className="font-mono text-[11px] font-semibold text-slate-600">
                                        {comp.id}-ai-agent-mvp-prompt.md
                                      </span>
                                    </div>
                                    <span className="rounded-md border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#0056FF]">
                                      Universal AI Prompt
                                    </span>
                                  </div>

                                  <pre className="max-h-96 [scrollbar-width:thin] overflow-auto font-mono text-xs leading-relaxed text-slate-800 select-all">
                                    <code>{generateAiAgentPrompt(comp)}</code>
                                  </pre>
                                </div>

                                {/* 3 Step Workflow */}
                                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                                  <div className="rounded-xl border border-slate-200/90 bg-white p-3 text-xs">
                                    <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                                      01. 1-Click Copy
                                    </span>
                                    <p className="mt-1 font-sans text-[11px] text-slate-600">
                                      Copy the complete structured prompt with full interface
                                      contract and behavioral rules.
                                    </p>
                                  </div>
                                  <div className="rounded-xl border border-slate-200/90 bg-white p-3 text-xs">
                                    <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                                      02. Paste to Any Agent
                                    </span>
                                    <p className="mt-1 font-sans text-[11px] text-slate-600">
                                      Paste directly into Antigravity, Cursor, Claude 3.5, ChatGPT,
                                      Copilot, or v0 without modification.
                                    </p>
                                  </div>
                                  <div className="rounded-xl border border-slate-200/90 bg-white p-3 text-xs">
                                    <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                                      03. Ship Instant MVP
                                    </span>
                                    <p className="mt-1 font-sans text-[11px] text-slate-600">
                                      The AI agent generates the complete standalone component with
                                      states, a11y, and zero shadows.
                                    </p>
                                  </div>
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
                                          <span className="mt-1.5 size-1 shrink-0 rounded-[1px] bg-[#0056FF]" />
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
                                          <span className="mt-1.5 size-1 shrink-0 rounded-[1px] bg-rose-400" />
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
                  </div>
                );
              })}
            </div>

            {/* SECTION: Brand Identity & Colors */}
            <section
              id="brand-identity"
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
    cardPresentationMode: 'folder' | 'metrics';
    setCardPresentationMode: (m: 'folder' | 'metrics') => void;
    cardRevealed: boolean;
    setCardRevealed: (r: boolean) => void;
    cardSlidOut: boolean;
    setCardSlidOut: (s: boolean) => void;
    metricsTimeRange: '30D' | '90D' | '1Y' | 'All';
    setMetricsTimeRange: (r: '30D' | '90D' | '1Y' | 'All') => void;
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

          {/* Official Native Snackbar In-Stage Demo */}
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
        </div>
      );

    case 'chip':
      return (
        <div className="flex w-full flex-col items-center">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs sm:p-6">
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              {[
                'All Disciplines',
                'Software Engineering',
                'Cybersecurity',
                'Computer Science',
                'Information Systems',
                'Data Science',
                'Artificial Intelligence',
              ].map((label) => {
                const isActive = state.selectedChips.includes(label);
                return (
                  <LibraryChip
                    key={label}
                    active={isActive}
                    onClick={() => {
                      if (label === 'All Disciplines') {
                        state.setSelectedChips(['All Disciplines']);
                      } else {
                        const next = state.selectedChips.filter((c) => c !== 'All Disciplines');
                        if (next.includes(label)) {
                          const filtered = next.filter((c) => c !== label);
                          state.setSelectedChips(
                            filtered.length === 0 ? ['All Disciplines'] : filtered,
                          );
                        } else {
                          state.setSelectedChips([...next, label]);
                        }
                      }
                    }}
                  >
                    {label}
                  </LibraryChip>
                );
              })}
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
          <div className="w-full max-w-xl rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-xs sm:p-6">
            <div className="space-y-2.5 font-sans">
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
              ].map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 transition-all hover:border-slate-200 hover:bg-white sm:p-3.5"
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <span className="text-xs font-bold text-slate-900">{item.title}</span>
                      <span
                        className={cn(
                          'rounded-[4px] px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase',
                          item.checked
                            ? 'border border-[#CAD3F5] bg-[#E3E7FC] text-[#0056FF]'
                            : 'border border-slate-200 bg-slate-100 text-slate-500',
                        )}
                      >
                        <span className="sm:hidden">{item.checked ? 'Active' : 'Standby'}</span>
                        <span className="hidden sm:inline">
                          {item.checked ? 'Active · 100% Operational' : 'Paused · Standby'}
                        </span>
                      </span>
                    </div>
                    <p className="mt-0.5 hidden text-[11px] text-slate-500 sm:block">{item.desc}</p>
                  </div>
                  <LibrarySwitch checked={item.checked} onCheckedChange={item.setter} />
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'dropdown':
      return (
        <div className="flex w-full flex-col items-center">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs sm:p-6">
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
                {
                  value: 'kampong-cham',
                  label: 'Kampong Cham Learning Center',
                  description: '890 Enrolled Students · Campus B',
                },
              ]}
            />

            {/* Real-time Campus Summary Card */}
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between font-mono text-[10px] text-slate-400 uppercase">
                <span>Selected Campus</span>
                <span className="font-bold text-[#0056FF]">ACTIVE BRANCH</span>
              </div>
              <div className="mt-1 font-sans text-base font-black text-slate-950 sm:text-lg">
                {state.dropdownCampus === 'siem-reap'
                  ? 'Siem Reap Main Campus'
                  : state.dropdownCampus === 'phnom-penh'
                    ? 'Phnom Penh Innovation Hub'
                    : state.dropdownCampus === 'battambang'
                      ? 'Battambang Regional Center'
                      : 'Kampong Cham Learning Center'}
              </div>
              <p className="mt-1 font-mono text-xs text-slate-500">
                {state.dropdownCampus === 'siem-reap'
                  ? '2,450 Enrolled Students · Science Wing · High Performance Cluster'
                  : state.dropdownCampus === 'phnom-penh'
                    ? '3,120 Enrolled Students · Tech Tower · Cyber Security Lab'
                    : state.dropdownCampus === 'battambang'
                      ? '1,080 Enrolled Students · Campus A · Agro-Tech Innovation'
                      : '890 Enrolled Students · Campus B · Digital Media Center'}
              </p>
            </div>
          </div>
        </div>
      );

    case 'card':
      return (
        <div className="flex w-full flex-col items-center">
          <div className="relative w-full max-w-lg pt-4 select-none">
            {/* Sliding Student Credential Card */}
            <div
              onClick={() => state.setCardSlidOut(!state.cardSlidOut)}
              className={cn(
                'relative mx-auto w-[94%] cursor-pointer rounded-2xl p-6 transition-all duration-300 ease-out',
                'border border-[#0056FF] bg-[#0056FF]',
                'text-white shadow-none',
                state.cardSlidOut ? '-translate-y-12 scale-[1.02]' : 'translate-y-0',
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black tracking-widest text-blue-100 uppercase">
                  SNPI-SMS STUDENT PASS
                </span>
                <div className="h-7 w-9 rounded-[4px] border border-amber-300/40 bg-amber-400/30 shadow-inner" />
              </div>

              <div className="mt-8 font-mono text-xl font-black tracking-widest text-white sm:text-2xl">
                {state.cardRevealed ? '9420 8124 0092 0891' : '•••• •••• •••• 0891'}
              </div>

              <div className="mt-6 flex items-end justify-between font-mono text-xs">
                <div>
                  <span className="block text-[10px] text-blue-200 uppercase">Student Name</span>
                  <span className="text-sm font-bold text-white">DARA SOK</span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-blue-200 uppercase">Valid Thru</span>
                  <span className="text-sm font-bold text-white">08/29</span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-blue-200 uppercase">CVV</span>
                  <span className="text-sm font-bold text-blue-100">
                    {state.cardRevealed ? '742' : '•••'}
                  </span>
                </div>
              </div>
            </div>

            {/* Curved Folder Pocket Base */}
            <div className="relative z-20 -mt-16 w-full rounded-2xl border border-[#CAD3F5] bg-white p-5 text-slate-900 shadow-none sm:p-6">
              <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-4">
                <button
                  type="button"
                  onClick={() => state.setCardRevealed(!state.cardRevealed)}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3.5 py-1.5 font-sans text-xs font-semibold transition-all hover:border-[#0056FF]"
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
                    <strong className="text-slate-800">{state.cardRevealed ? '742' : '•••'}</strong>
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
                  className="cursor-pointer rounded-lg border border-[#CAD3F5] bg-[#E3E7FC] px-4 py-1.5 font-sans text-xs font-bold text-[#0056FF] transition-all hover:bg-white active:scale-95"
                >
                  {state.cardSlidOut ? 'Insert Pass' : 'Pull Pass'}
                </button>
              </div>
            </div>
          </div>
        </div>
      );

    // ==========================================
    // NAVIGATION GROUP (Interactive Demos)
    // ==========================================
    case 'hook-sidebar':
      return <HookSidebarDemo />;
    case 'gooey-nav':
      return <GooeyNavDemo />;
    case 'cyber-armor-nav':
      return <CyberArmorNavDemo />;

    // ==========================================
    // INPUTS GROUP (Interactive Demos)
    // ==========================================
    case 'duration-picker':
      return <DurationPickerDemo />;
    case 'password-input':
      return <PasswordInputDemo />;
    case 'theme-selector':
      return <ThemeSelectorDemo />;

    // ==========================================
    // FEEDBACK GROUP (Interactive Demos)
    // ==========================================
    case 'toast':
    case 'toast-stack':
      return <ToastStackDemo />;
    case 'skeleton-loading-screen':
      return <SkeletonLoadingScreenDemo />;
    case 'notification-bell':
      return <NotificationBellDemo />;
    case 'status-404':
      return <StatusPage404Demo />;

    // ==========================================
    // DISPLAY GROUP (Interactive Demos)
    // ==========================================
    case 'folder':
      return <FolderDemo />;
    case 'step-player':
      return <StepPlayerDemo />;
    case 'animated-counter':
      return <AnimatedCounterDemo />;
    case 'voice-note':
      return <VoiceNoteDemo />;
    case 'faq':
      return <FaqDemo />;
    case 'data-table':
      return <DataTableDemo />;

    // ==========================================
    // AI KIT GROUP (Interactive Demos)
    // ==========================================
    case 'grid-reveal':
      return <GridRevealDemo />;

    // ==========================================
    // TEXT EFFECTS (Component Templates)
    // ==========================================
    case 'cipher-decode':
      return <CipherTextDecoderDemo />;

    // ==========================================
    // SECTIONS (Component Templates)
    // ==========================================
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
    case 'rich-text-editor':
      return <RichTextEditorDemo />;

    default:
      return null;
  }
}
