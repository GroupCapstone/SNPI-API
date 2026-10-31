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
  generateAiAgentPrompt,
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
  Layers,
  FileText,
  Smartphone,
  LayoutGrid,
  BatteryMedium,
  Palette,
  ChevronDown,
  ChevronRight,
} from '@/components/icons';
import { useDocsNav } from './docs-nav-context';
import { cn } from '@/lib/utils';

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

  // Per-component preview mode: 'desktop' | 'mobile' | 'grid' (Inspired by React Bits / 21st.dev reference)
  const [demoModes, setDemoModes] = React.useState<Record<string, 'desktop' | 'mobile' | 'grid'>>({});
  const getDemoMode = (id: string): 'desktop' | 'mobile' | 'grid' => demoModes[id] || 'desktop';
  const setDemoMode = (id: string, mode: 'desktop' | 'mobile' | 'grid') => {
    setDemoModes((prev) => ({ ...prev, [id]: mode }));
  };

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

  const handleCopyPrompt = (id: string, text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
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
          {/* COLUMN 1: Left Sticky Sidebar Navigation (Knowledge Base Style - Images 3 & 4) */}
          <aside className="w-full shrink-0 lg:sticky lg:top-20 lg:z-30 lg:w-64 lg:self-start xl:w-72">
            <div
              ref={sidebarContainerRef}
              className="no-scrollbar max-h-[calc(100vh-5.5rem)] [scrollbar-width:none] space-y-4 overflow-y-auto pr-2 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {/* Knowledge Base Header (Images 3 & 4) */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-sans text-sm font-bold text-slate-900">
                  Knowledge base
                </span>
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
              <div className="space-y-1.5 font-sans text-xs pt-1">
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
                              ? 'bg-[#0056FF]/[0.08] text-[#0056FF]'
                              : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950',
                          )}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            {isCollapsed ? (
                              <ChevronRight className="size-3.5 shrink-0 text-slate-400" />
                            ) : (
                              <ChevronDown className="size-3.5 shrink-0 text-slate-400" />
                            )}
                            <Folder className="size-3.5 shrink-0 text-slate-500 group-hover:text-[#0056FF]" />
                            <span className="truncate">{group.category}</span>
                          </div>
                          <span className="font-mono text-[10px] text-slate-400 font-normal">
                            {group.components.length}
                          </span>
                        </button>

                        {/* Folder File Items */}
                        {!isCollapsed && (
                          <div className="space-y-0.5 pl-6 border-l border-slate-100 ml-3">
                            {group.components.map((comp) => {
                              const targetId = `comp-${comp.id}`;
                              const isCurrentActive = activeSectionId === targetId;
                              return (
                                <button
                                  key={comp.id}
                                  type="button"
                                  onClick={() => scrollToSection(targetId)}
                                  className={cn(
                                    'group flex w-full cursor-pointer items-center gap-2 rounded-lg py-1 px-2 text-left font-sans text-xs transition-all select-none',
                                    isCurrentActive
                                      ? 'bg-[#0056FF]/10 font-bold text-[#0056FF]'
                                      : 'font-normal text-slate-600 hover:bg-slate-50 hover:text-slate-950',
                                  )}
                                >
                                  <FileText className="size-3 shrink-0 text-slate-400 group-hover:text-[#0056FF]" />
                                  <span className="truncate">{comp.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}

                {/* Documentation Section Links */}
                <div className="border-t border-slate-100 pt-3 mt-3">
                  <div className="pb-1.5 font-mono text-[10px] font-bold text-slate-400 uppercase">
                    <span>Documentation</span>
                  </div>
                  <div className="space-y-0.5">
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
                            'group flex w-full cursor-pointer items-center gap-2 rounded-lg py-1.5 px-2 text-left font-sans text-xs transition-all select-none',
                            isCurrentActive
                              ? 'bg-[#0056FF]/10 font-bold text-[#0056FF]'
                              : 'font-normal text-slate-600 hover:bg-slate-50 hover:text-slate-950',
                          )}
                        >
                          <FileText className="size-3 shrink-0 text-slate-400" />
                          <span className="truncate">{doc.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Profile / Portal Info Card (Images 3 & 4) */}
              <div className="border-t border-slate-100 pt-3 mt-4">
                <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/70 p-2.5">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#0056FF] font-sans text-xs font-bold text-white shadow-2xs">
                    LM
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-sans text-xs font-bold text-slate-900">
                      Lena Marchetti
                    </p>
                    <p className="truncate font-sans text-[11px] text-slate-500">
                      Knowledge manager
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* COLUMN 2: Center Main Interactive Component Feed (1-Column Continuous Scroll Feed) */}
          <main className="min-w-0 flex-1 space-y-12">
            {/* HERO HEAD TITLE: Redesigned Home Section with Related Menu */}
            <section id="ui-library-head" className="scroll-mt-24 space-y-4">
              <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-10">
                <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                  <div>
                    <h1 className="font-sans text-4xl font-black tracking-tight text-slate-950 sm:text-6xl md:text-7xl">
                      UI Library
                    </h1>
                    <p className="mt-2 max-w-xl font-sans text-xs text-slate-600 sm:text-sm">
                      Interactive component catalog, enterprise design tokens, and AI agent prompt specifications.
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                    {/* Related Hub Navigation Menu (UI Library & Open API) */}
                    <div className="flex items-center gap-1 rounded-full border border-slate-200/90 bg-slate-100/90 p-1 shadow-inner">
                      <button
                        type="button"
                        onClick={() => setActiveTab('library', true)}
                        className={cn(
                          'flex items-center gap-2 rounded-full px-4 py-2 font-sans text-xs font-bold transition-all',
                          activeTab === 'library'
                            ? 'bg-[#0056FF] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900',
                        )}
                      >
                        <Layers className="size-3.5 stroke-[2.2]" />
                        <span>UI Library</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('openapi', true)}
                        className={cn(
                          'flex items-center gap-2 rounded-full px-4 py-2 font-sans text-xs font-bold transition-all',
                          activeTab === 'openapi'
                            ? 'bg-[#0056FF] text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900',
                        )}
                      >
                        <FileText className="size-3.5 stroke-[2]" />
                        <span>Open API</span>
                      </button>
                    </div>

                    <GeometricHeaderStamp
                      codeA={String(COMPONENT_LIBRARY_REGISTRY.length)}
                      titleA="COMPONENTS"
                      codeB="100%"
                      titleB="INTERACTIVE"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 2: Interactive UI Components & Templates */}
            <div
              id="interactive-feed"
              className="scroll-mt-24 space-y-1 border-t border-slate-200/80 pt-8 pb-2"
            >
              <h2 className="font-sans text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                Component Catalog
              </h2>
            </div>

            {/* COMPONENT DEMOS ARRANGED BY CATEGORY */}
            <div className="space-y-8">
              {groupedCategories.map((group) => {
                return (
                  <div
                    key={group.category}
                    id={group.categoryId}
                    className="scroll-mt-24 space-y-8"
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
                            className="scroll-mt-24 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs transition-all hover:border-[#0056FF]/40 sm:p-8"
                          >
                            {/* Minimal Top Header Row */}
                            <div className="mb-6 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2.5">
                                <span className="font-mono text-xs font-black text-[#0056FF]">
                                  0{group.groupNumber}.0{compIdx + 1}
                                </span>
                                <h2 className="font-sans text-lg font-black text-slate-950 sm:text-xl">
                                  {comp.name}
                                </h2>
                              </div>

                              <div className="flex shrink-0 items-center gap-2">
                                {/* 1. Direct 1-Click Copy AI Agent Prompt Button (Icons Only) */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCopyPrompt(comp.id, generateAiAgentPrompt(comp))
                                  }
                                  title={
                                    copiedPromptId === comp.id
                                      ? 'Prompt Copied to Clipboard!'
                                      : 'Copy AI Agent MVP Prompt'
                                  }
                                  aria-label="Copy AI Agent MVP Prompt"
                                  className={cn(
                                    'flex size-8 cursor-pointer items-center justify-center rounded-[6px] border transition-all active:scale-95',
                                    copiedPromptId === comp.id
                                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                      : 'border-slate-200 bg-white text-slate-600 hover:border-[#0056FF] hover:bg-[#E3E7FC]/40 hover:text-[#0056FF]',
                                  )}
                                >
                                  {copiedPromptId === comp.id ? (
                                    <Check className="size-3.5 stroke-[2.2] text-emerald-600" />
                                  ) : (
                                    <Copy className="size-3.5 stroke-[2]" />
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Clean Single-Box Stage Canvas (One Simple Layer - Reference Style) */}
                            {currentTab === 'preview' && (
                              <div className="flex min-h-[460px] w-full items-center justify-center py-4">
                                <div
                                  key={`${comp.id}-stage`}
                                  className="flex w-full max-w-3xl items-center justify-center"
                                >
                                  {renderFeedComponentDemo(comp.id, stateBundle)}
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
            <span>Surface: Light Card (#FFFFFF)</span>
            <span className="h-3 w-[1px] bg-slate-200" />
            <span>Touch: ≥ 44×44px</span>
          </div>
        </div>
      );

    case 'chip':
      return (
        <div className="flex w-full flex-col items-center gap-5">
          {/* Filter Stage */}
          <div className="w-full max-w-xl border-slate-200/90 bg-white p-6 shadow-md max-sm:rounded-none max-sm:border-x-0 max-sm:border-y sm:rounded-2xl sm:border">
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

            <div className="mt-5 rounded-[4px] border border-[#CAD3F5] bg-[#E3E7FC]/60 p-3.5 font-mono text-xs text-slate-700">
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
          <div className="w-full max-w-xl border-slate-200/90 bg-white p-6 shadow-md max-sm:rounded-none max-sm:border-x-0 max-sm:border-y sm:rounded-2xl sm:border">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-sans text-sm font-bold text-slate-900">
                  Campus Automation Telemetry Switches
                </h4>
                <p className="font-sans text-xs text-slate-500">
                  Toggle distributed microservices and hardware gate scanners
                </p>
              </div>
              <span className="rounded-[4px] border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#0056FF] uppercase">
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
                  className="flex items-center justify-between rounded-[4px] border border-slate-100 bg-slate-50 p-4 transition-all hover:border-slate-200 hover:bg-white"
                >
                  <div className="pr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{item.title}</span>
                      <span
                        className={cn(
                          'rounded-[4px] px-2 py-0.5 font-mono text-[9px] font-bold uppercase',
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

            <div className="mt-5 flex items-center justify-between rounded-[4px] border border-[#CAD3F5] bg-[#E3E7FC]/60 p-3.5 font-mono text-xs text-slate-700">
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
          <div className="w-full max-w-xl border-slate-200/90 bg-white p-6 shadow-md max-sm:rounded-none max-sm:border-x-0 max-sm:border-y sm:rounded-2xl sm:border">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-sans text-sm font-bold text-slate-900">
                  Design Tokens & Campus Selectors
                </h4>
                <p className="font-sans text-xs text-slate-500">
                  Select typography pairings and campus branch configurations
                </p>
              </div>
              <span className="rounded-[4px] border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#0056FF] uppercase">
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
            <div className="mt-5 rounded-[4px] border border-slate-200 bg-slate-50 p-4">
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

    case 'card':
      return (
        <div className="flex w-full flex-col items-center gap-5">
          {/* Card Presentation Mode Switcher */}
          <div className="flex flex-wrap items-center justify-center rounded-[4px] border border-slate-200 bg-white p-1 shadow-xs">
            <button
              type="button"
              onClick={() => state.setCardPresentationMode('folder')}
              className={cn(
                'cursor-pointer rounded-[4px] px-4 py-1.5 font-sans text-xs font-bold transition-all',
                state.cardPresentationMode === 'folder'
                  ? 'bg-[#0056FF] text-white shadow-none'
                  : 'text-slate-600 hover:text-slate-900',
              )}
            >
              Card Folder Mode
            </button>
            <button
              type="button"
              onClick={() => state.setCardPresentationMode('metrics')}
              className={cn(
                'cursor-pointer rounded-[4px] px-4 py-1.5 font-sans text-xs font-bold transition-all',
                state.cardPresentationMode === 'metrics'
                  ? 'bg-[#0056FF] text-white shadow-none'
                  : 'text-slate-600 hover:text-slate-900',
              )}
            >
              Daily Metrics Mode
            </button>
          </div>

          {state.cardPresentationMode === 'folder' ? (
            <div className="relative w-full max-w-lg pt-6 select-none">
              {/* Sliding Credit / Student Card */}
              <div
                onClick={() => state.setCardSlidOut(!state.cardSlidOut)}
                className={cn(
                  'relative mx-auto w-[94%] cursor-pointer rounded-2xl p-6 transition-all duration-300 ease-out',
                  'border border-[#0056FF] bg-[#0056FF]',
                  'text-white shadow-xl',
                  state.cardSlidOut ? '-translate-y-12 scale-[1.02]' : 'translate-y-0',
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black tracking-widest text-blue-100 uppercase">
                      SNPI-SMS STUDENT PASS
                    </span>
                  </div>
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
              <div className="relative z-20 -mt-16 w-full rounded-[4px] border border-slate-200/90 bg-white p-6 text-slate-900 shadow-xl">
                <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-4">
                  <button
                    type="button"
                    onClick={() => state.setCardRevealed(!state.cardRevealed)}
                    className="flex cursor-pointer items-center gap-2 rounded-[4px] border border-slate-200 px-3.5 py-1.5 font-sans text-xs font-semibold transition-all hover:border-[#0056FF]"
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
                    className="cursor-pointer rounded-[4px] border border-[#CAD3F5] bg-[#E3E7FC] px-4 py-1.5 font-sans text-xs font-bold text-[#0056FF] transition-all hover:bg-white active:scale-95"
                  >
                    {state.cardSlidOut ? 'Insert Card' : 'Pull Card'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* MODE 2: Daily Active Students Metrics Card (User Image 2 Reference) */
            <div className="w-full max-w-lg border-slate-200/90 bg-white p-6 shadow-md max-sm:rounded-none max-sm:border-x-0 max-sm:border-y sm:rounded-2xl sm:border">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-sans text-base font-black text-slate-900">
                    Daily active students
                  </h4>
                  <p className="font-sans text-xs text-slate-500">12,340 a day · Term 1 2026</p>
                </div>

                <div className="flex items-center rounded-[4px] border border-slate-200 bg-slate-50 p-1 font-mono text-xs">
                  {(['30D', '90D', '1Y', 'All'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => state.setMetricsTimeRange(r)}
                      className={cn(
                        'cursor-pointer rounded-[4px] px-2.5 py-0.5 font-bold transition-colors',
                        state.metricsTimeRange === r
                          ? 'bg-[#0056FF] text-white shadow-none'
                          : 'text-slate-600 hover:text-slate-950',
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-[4px] border border-[#CAD3F5] bg-[#E3E7FC]/60 p-4">
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
