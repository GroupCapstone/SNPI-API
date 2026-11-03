'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  LibrarySwitch,
  LibraryChip,
  LibraryDropdown,
  COMPONENT_LIBRARY_REGISTRY,
  COMPONENT_CATEGORIES,
  COMPONENT_GROUPS_NAV,
  type ComponentGroupNav,
  M3_COMPONENTS_NAV,
  PLATFORM_COMPONENTS_NAV,
  type M3NavItem,
  GeometricButton,
  GeometricInput,
  GeometricHeaderStamp,
  HookSidebarDemo,
  GooeyNavDemo,
  CyberArmorNavDemo,
  DurationPickerDemo,
  PasswordInputDemo,
  NotificationBellDemo,
  FolderDemo,
  StepPlayerDemo,
  AnimatedCounterDemo,
  VoiceNoteDemo,
  GridRevealDemo,
  MarqueeSectionDemo,
  FloatingLabelFormDemo,
  MultiStepWizardDemo,
  FileDropzoneDemo,
  DataTableDemo,
  ToastStackDemo,
  StatusPage404Demo,
  SkeletonLoadingScreenDemo,
  RichTextEditorDemo,
  HookSidebar,
  type HookSidebarItem,
  generateAiAgentPrompt,
  RadiantIntegrationHub,
  LibraryTooltip,
  BlankFutureComponent,
  type ComponentItemDoc,
  type ComponentFreshness,
  getComponentFreshness,
  getCategoryHierarchicalNodes,
  getNavIcon,
  getParentGroupIcon,
  getParentCategoryTheme,
} from '@/features/document/components/ui-library';
import {
  Home,
  Search,
  Folder,
  MapPin,
  Check,
  Copy,
  Sparkles,
  Eye,
  EyeOff,
  User,
  Monitor,
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
  Building2,
  GraduationCap,
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
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Cmd/Ctrl + K or / to focus search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      } else if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Per-component tab view state: 'preview' | 'prompt'
  const [componentTabs] = React.useState<Record<string, 'preview' | 'prompt'>>({});
  const getCompTab = (id: string): 'preview' | 'prompt' => componentTabs[id] || 'preview';

  // Sidebar category expansion state: default all collapsed (no dropdown open initially)
  const [expandedCategories, setExpandedCategories] = React.useState<Record<string, boolean>>({});
  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
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

  // 1. Bottom Sheet state
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
  const [dropdownCampus, setDropdownCampus] = React.useState('phnom-penh');

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

  // Menu Category Filter: 'all' | 'ready' | 'coming'
  const [menuFilter, setMenuFilter] = React.useState<'all' | 'ready' | 'coming'>('all');

  // Category group collapse state: default expanded (all open initially)
  const [collapsedGroups, setCollapsedGroups] = React.useState<Record<string, boolean>>({});

  const toggleCategoryGroup = (groupId: string) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  // Parent group expansion state: default collapsed (no child dropdown open initially)
  const [expandedParents, setExpandedParents] = React.useState<Record<string, boolean>>({});

  const toggleParentGroup = (parentId: string) => {
    setExpandedParents((prev) => ({
      ...prev,
      [parentId]: !prev[parentId],
    }));
  };

  // Filter components in real-time with search query
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

  // Live Feed: strictly built components only (never render unbuilt future component stages until requested)
  const feedCategories = React.useMemo(() => {
    return COMPONENT_CATEGORIES.map((category, index) => {
      const comps = COMPONENT_LIBRARY_REGISTRY.filter(
        (c) => c.category === category && !c.isFuture,
      );
      const categorySlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return {
        category,
        categoryId: `cat-${categorySlug}`,
        groupNumber: index + 1,
        components: comps,
      };
    }).filter((group) => group.components.length > 0);
  }, []);

  // Filter Component Groups with real-time search query
  const filteredComponentGroups = React.useMemo(() => {
    if (!searchQuery.trim()) return COMPONENT_GROUPS_NAV;
    const q = searchQuery.toLowerCase().trim();

    return COMPONENT_GROUPS_NAV.map((group) => {
      const matchesGroup = group.group.toLowerCase().includes(q);
      const matchingItems = group.items
        .map((item) => {
          if (matchesGroup) return item;
          if (item.isParent && item.children) {
            const matchesParent = item.name.toLowerCase().includes(q);
            const matchingChildren = item.children.filter((c) => c.name.toLowerCase().includes(q));
            if (matchesParent) {
              return item;
            }
            if (matchingChildren.length > 0) {
              return {
                ...item,
                children: matchingChildren,
              };
            }
            return null;
          }
          if (item.name.toLowerCase().includes(q)) {
            return item;
          }
          return null;
        })
        .filter((item): item is M3NavItem => item !== null);

      return {
        ...group,
        items: matchingItems,
      };
    }).filter((group) => group.items.length > 0);
  }, [searchQuery]);

  // Backward compatibility filter fallbacks if needed
  const filteredM3Components = React.useMemo(() => {
    if (!searchQuery.trim()) return M3_COMPONENTS_NAV;
    const q = searchQuery.toLowerCase().trim();
    return M3_COMPONENTS_NAV.filter((item) => item.name.toLowerCase().includes(q));
  }, [searchQuery]);

  const filteredPlatformComponents = React.useMemo(() => {
    if (!searchQuery.trim()) return PLATFORM_COMPONENTS_NAV;
    const q = searchQuery.toLowerCase().trim();
    return PLATFORM_COMPONENTS_NAV.filter((item) => item.name.toLowerCase().includes(q));
  }, [searchQuery]);

  // Auto-expand parent group on scroll when encountering child section
  React.useEffect(() => {
    if (!activeSectionId) return;

    for (const group of COMPONENT_GROUPS_NAV) {
      for (const item of group.items) {
        if (item.isParent && item.children) {
          const isChildActive = item.children.some(
            (c) => c.targetId === activeSectionId || `comp-${c.id}` === activeSectionId,
          );
          if (isChildActive) {
            setExpandedParents((prev) => {
              if (prev[item.id]) return prev;
              return { ...prev, [item.id]: true };
            });
          }
        }
      }
    }
  }, [activeSectionId]);

  // Auto-expand parent group if search query matches child
  React.useEffect(() => {
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase().trim();
    for (const group of COMPONENT_GROUPS_NAV) {
      for (const item of group.items) {
        if (item.isParent && item.children) {
          if (
            item.name.toLowerCase().includes(q) ||
            item.children.some((c) => c.name.toLowerCase().includes(q))
          ) {
            setExpandedParents((prev) => ({ ...prev, [item.id]: true }));
          }
        }
      }
    }
  }, [searchQuery]);

  // Interactive Hero Paradigm Toggle Mode (Flat 0px vs Living Motion FX)
  const [heroInteractiveMode, setHeroInteractiveMode] = React.useState<'flat' | 'spring'>('spring');

  // Section IDs for active tracking in Left Sticky Menu (strictly linear sequential flow)
  const scrollSectionIds = React.useMemo(() => {
    const ids = ['ui-library-head', 'interactive-feed'];
    feedCategories.forEach((group) => {
      ids.push(group.categoryId);
      group.components.forEach((comp) => {
        ids.push(`comp-${comp.id}`);
      });
    });
    ids.push('brand-identity', 'brand-blueprint', 'design-principles', 'touch-targets');
    return ids;
  }, [feedCategories]);

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
              {/* Modern Minimalist Search Bar (Clean Blueprint Standard) */}
              <div className="group relative flex items-center">
                <Search className="pointer-events-none absolute left-3 size-4 text-[#0056FF]" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search components..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9.5 w-full rounded-xl border border-[#CAD3F5] bg-[#F8FAFC] py-2 pr-12 pl-9 font-sans text-xs font-medium text-[#0A1A4A] shadow-2xs transition-all placeholder:font-normal placeholder:text-slate-400 hover:border-slate-300 hover:bg-white focus:border-[#0056FF] focus:bg-white focus:shadow-xs focus:ring-2 focus:ring-[#0056FF]/15 focus:outline-none focus-visible:outline-none"
                  style={{ outline: 'none' }}
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    title="Clear search"
                    className="absolute right-2.5 flex size-5 cursor-pointer items-center justify-center rounded-md text-[#0056FF] transition-colors hover:bg-blue-50 active:scale-95"
                  >
                    <X className="size-3.5 stroke-[2.5]" />
                  </button>
                ) : (
                  <kbd className="pointer-events-none absolute right-2.5 inline-flex items-center gap-0.5 rounded-md border border-[#CAD3F5] bg-white px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-400 shadow-2xs transition-colors select-none group-focus-within:border-[#0056FF]/40 group-focus-within:text-[#0056FF]">
                    <span className="font-sans text-[11px]">⌘</span>K
                  </kbd>
                )}
              </div>

              {/* Top Hierarchy Identity (Adobe React Spectrum Specification) */}
              <div className="border-b border-slate-100 pb-2">
                <span className="block font-sans text-[11px] font-bold tracking-wider text-slate-400 uppercase select-none">
                  Web
                </span>
                <span className="block font-sans text-sm font-black tracking-tight text-slate-950 select-none">
                  SNPI System
                </span>
              </div>

              {/* COMPONENT GROUPS (Clean React Spectrum Navigation - Icons on Parent Only, Zero Noise) */}
              <div className="space-y-3 font-sans text-xs">
                {filteredComponentGroups.length === 0 ? (
                  <div className="px-3 py-4 text-center font-sans text-xs text-slate-400">
                    No matching components found
                  </div>
                ) : (
                  filteredComponentGroups.map((group) => {
                    const ParentGroupIcon = getParentGroupIcon(group.groupId);
                    const isGroupCollapsed = Boolean(collapsedGroups[group.groupId]);
                    return (
                      <div key={group.groupId} className="space-y-1">
                        {/* Parent Group Header (Collapsible Trigger with Blue Parent Icon) */}
                        <button
                          type="button"
                          onClick={() => toggleCategoryGroup(group.groupId)}
                          className="group flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-left font-sans text-xs font-bold text-slate-900 transition-colors select-none hover:bg-slate-100"
                        >
                          <div className="flex items-center gap-2">
                            <ParentGroupIcon className="size-3.5 shrink-0 text-[#0056FF]" />
                            <span className="font-bold text-slate-900">{group.group}</span>
                          </div>
                          <div className="flex items-center">
                            {!isGroupCollapsed ? (
                              <ChevronDown className="size-3 text-[#0056FF] transition-colors" />
                            ) : (
                              <ChevronRight className="size-3 text-[#0056FF] transition-colors" />
                            )}
                          </div>
                        </button>

                        {/* Group Items (Pure Clean Typography - Icons on Parent Only, Zero Coming Tags) */}
                        {!isGroupCollapsed && (
                          <div className="space-y-0.5 pt-0.5 pl-1">
                            {group.items.map((item) => {
                              if (item.isParent && item.children) {
                                const isExpanded = Boolean(expandedParents[item.id]);
                                const isParentActive = item.children.some(
                                  (c) =>
                                    activeSectionId === c.targetId ||
                                    activeSectionId === `comp-${c.id}`,
                                );

                                return (
                                  <div key={item.id} className="space-y-0.5">
                                    {/* Parent Sub-Group Trigger */}
                                    <button
                                      type="button"
                                      onClick={() => toggleParentGroup(item.id)}
                                      className={cn(
                                        'group flex w-full cursor-pointer items-center justify-between rounded-md py-1.5 pr-2 pl-3 text-left font-sans text-xs transition-colors select-none',
                                        isParentActive
                                          ? 'bg-slate-100/70 font-bold text-slate-950'
                                          : 'font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-950',
                                      )}
                                    >
                                      <span className="text-left leading-snug break-words whitespace-normal">
                                        {item.name}
                                      </span>
                                      {isExpanded ? (
                                        <ChevronDown className="ml-1 size-3 shrink-0 text-[#0056FF]" />
                                      ) : (
                                        <ChevronRight className="ml-1 size-3 shrink-0 text-[#0056FF]" />
                                      )}
                                    </button>

                                    {/* Sub-Group Child Items (Clean Indented Text, Zero Icons) */}
                                    {isExpanded && (
                                      <div className="ml-2 space-y-0.5 py-0.5 pl-2">
                                        {item.children.map((child: M3NavItem) => {
                                          const freshness = getComponentFreshness(child);
                                          const target = child.targetId || `comp-${child.id}`;
                                          const isChildActive = activeSectionId === target;

                                          return (
                                            <div
                                              key={child.id}
                                              onClick={() => scrollToSection(target)}
                                              className={cn(
                                                'group relative flex w-full cursor-pointer items-center justify-between rounded-md py-1.5 pr-2 pl-3.5 text-left transition-colors select-none',
                                                isChildActive
                                                  ? 'bg-slate-100/80 font-bold text-slate-950 before:absolute before:top-1.5 before:bottom-1.5 before:left-0 before:w-[3px] before:rounded-full before:bg-slate-950'
                                                  : 'font-normal text-slate-600 hover:bg-slate-50 hover:text-slate-950',
                                              )}
                                            >
                                              <span className="text-left font-sans text-xs leading-snug break-words whitespace-normal">
                                                {child.name}
                                              </span>
                                              {freshness === 'new' && (
                                                <span className="py-0.2 ml-1.5 shrink-0 rounded-full border border-emerald-300/80 bg-emerald-50 px-1.5 font-sans text-[9px] leading-none font-bold text-emerald-700 uppercase">
                                                  New
                                                </span>
                                              )}
                                              {freshness === 'coming' && (
                                                <span className="ml-1.5 shrink-0 rounded-[3px] border border-slate-200/90 bg-slate-100/70 px-1 py-0.5 font-mono text-[8px] leading-none font-semibold tracking-wider text-slate-400 uppercase">
                                                  Coming
                                                </span>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              }

                              // Direct Standalone Component Item (Exact React Spectrum | Active Bar)
                              const freshness = getComponentFreshness(item);
                              const target = item.targetId || `comp-${item.id}`;
                              const isActive = activeSectionId === target;

                              return (
                                <div
                                  key={item.id}
                                  onClick={() => scrollToSection(target)}
                                  className={cn(
                                    'group relative flex w-full cursor-pointer items-center justify-between rounded-md py-1.5 pr-2 pl-3.5 text-left transition-colors select-none',
                                    isActive
                                      ? 'bg-slate-100/80 font-bold text-slate-950 before:absolute before:top-1.5 before:bottom-1.5 before:left-0 before:w-[3px] before:rounded-full before:bg-slate-950'
                                      : 'font-normal text-slate-600 hover:bg-slate-50 hover:text-slate-950',
                                  )}
                                >
                                  <span className="text-left font-sans text-xs leading-snug break-words whitespace-normal">
                                    {item.name}
                                  </span>
                                  {freshness === 'new' && (
                                    <span className="py-0.2 ml-1.5 shrink-0 rounded-full border border-emerald-300/80 bg-emerald-50 px-1.5 font-sans text-[9px] leading-none font-bold text-emerald-700 uppercase">
                                      New
                                    </span>
                                  )}
                                  {freshness === 'coming' && (
                                    <span className="ml-1.5 shrink-0 rounded-[3px] border border-slate-200/90 bg-slate-100/70 px-1 py-0.5 font-mono text-[8px] leading-none font-semibold tracking-wider text-slate-400 uppercase">
                                      Coming
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </aside>

          {/* COLUMN 2: Center Main Interactive Component Feed (1-Column Continuous Scroll Feed) */}
          <main className="min-w-0 flex-1 space-y-10">
            {/* HERO HEAD TITLE: Ultra-Creative Interactive Engine Hero (References 3 & 4) */}
            <section id="ui-library-head" className="scroll-mt-36 space-y-4">
              <div className="relative overflow-visible bg-transparent py-2 sm:py-4">
                <div className="relative z-10 space-y-6 sm:space-y-8">
                  {/* Creative Centerpiece Headline with Embedded Toggle Switch (Image 4 Reference) */}
                  <div className="flex flex-col gap-3">
                    <div>
                      <h1 className="font-sans text-3xl leading-none font-black tracking-tight text-[#0A1A4A] select-none sm:text-5xl md:text-6xl">
                        <span className="block tracking-tight">CREATIVE</span>
                        <span className="my-1 flex items-center gap-2 sm:gap-3">
                          <span>PR</span>
                          <button
                            type="button"
                            onClick={() =>
                              setHeroInteractiveMode((prev) =>
                                prev === 'flat' ? 'spring' : 'flat',
                              )
                            }
                            className="group relative inline-flex h-8 w-18 cursor-pointer items-center rounded-full border border-[#CAD3F5] bg-[#EFF5FF] p-1 shadow-inner transition-all active:scale-95 sm:h-11 sm:w-22 md:h-12 md:w-24"
                            title="Toggle Interactive Design Paradigm (Flat vs Spring FX)"
                            aria-label="Toggle Interactive Design Paradigm"
                          >
                            <span
                              className={cn(
                                'inline-flex size-6 items-center justify-center rounded-full bg-[#0056FF] font-mono text-[10px] font-black text-white shadow-xs transition-all duration-300 sm:size-8 sm:text-xs md:size-9',
                                heroInteractiveMode === 'flat'
                                  ? 'translate-x-0 bg-slate-500'
                                  : 'translate-x-9 bg-[#0056FF] sm:translate-x-11 md:translate-x-12',
                              )}
                            >
                              FX
                            </span>
                          </button>
                          <span>DUCT</span>
                        </span>
                        <span className="block text-[#0056FF]">SYSTEM</span>
                      </h1>
                    </div>
                  </div>

                  {/* KINETIC TUMBLED CARDS MODULE DECK */}
                  <RadiantIntegrationHub
                    center={{
                      title: 'SNPI DESIGN ENGINE',
                      subtitle: 'Mathematical Token Matrix',
                      icon: <Layers className="size-7 stroke-[2.2]" />,
                      badge: '73P',
                    }}
                    leftNodes={[
                      {
                        id: 'cat-navigation',
                        label: 'Navigation',
                        tag: '01 · NAV',
                        badge: 'CYBER ARMOR',
                        tooltip: 'Navigation & Docks (Cyber Armor & Line Tracker)',
                        icon: <Compass className="size-8 stroke-[2]" />,
                      },
                      {
                        id: 'cat-feedback',
                        label: 'Feedback',
                        tag: '02 · DIALOG',
                        badge: 'SNACKBAR & MODAL',
                        tooltip: 'Feedback & Overlays (Snackbars, Dialogs & Modals)',
                        icon: <Bell className="size-8 stroke-[2]" />,
                      },
                      {
                        id: 'cat-forms',
                        label: 'Inputs',
                        tag: '03 · INPUT',
                        badge: 'SWITCH & CHIP',
                        tooltip: 'Inputs & Controls (Switches, Chips & Fields)',
                        icon: <Sliders className="size-8 stroke-[2]" />,
                      },
                    ]}
                    rightNodes={[
                      {
                        id: 'cat-display',
                        label: 'Containers',
                        tag: '04 · CARD',
                        badge: 'TACTILE FOLDERS',
                        tooltip: 'Cards & Containers (Tactile Folders & Tables)',
                        icon: <Folder className="size-8 stroke-[2]" />,
                      },
                      {
                        id: 'cat-buttons',
                        label: 'Actions',
                        tag: '05 · ACTION',
                        badge: 'GEOMETRIC FAB',
                        tooltip: 'Buttons & Actions (Geometric Buttons & FABs)',
                        icon: <Zap className="size-8 stroke-[2]" />,
                      },
                      {
                        id: 'cat-ai-kit',
                        label: 'AI Prompts',
                        tag: '06 · AI',
                        badge: 'GENUI SPEC',
                        tooltip: 'AI Agent Prompts (Procedural Synthesis & Blueprints)',
                        icon: <Bot className="size-8 stroke-[2]" />,
                      },
                    ]}
                    activeNodeId={activeSectionId}
                    onSelectNode={(id) => setActiveSectionId(id)}
                  />
                </div>
              </div>
            </section>

            {/* COMPONENT DEMOS FEED (Clean Open Feed with Signature Parent Colors & Pseudo-Random Stage Canvas) */}
            <div className="w-full space-y-16">
              {feedCategories.map((group) => {
                const parentTheme = getParentCategoryTheme(group.category);

                return (
                  <div
                    key={group.category}
                    id={group.categoryId}
                    className="scroll-mt-36 space-y-12"
                  >
                    {/* Category Header Divider with Signature Parent Accent */}
                    <div
                      className={cn(
                        'flex items-center gap-2.5 border-b pt-4 pb-3',
                        parentTheme.borderColor,
                      )}
                    >
                      <h3
                        className="font-sans text-xs font-black tracking-widest uppercase"
                        style={{ color: parentTheme.accent }}
                      >
                        {group.category}
                      </h3>
                    </div>

                    {/* Demos Inside This Category (Single-Layer 4px Radius Card Feed Grouped by Parent Category Theme) */}
                    <div className="space-y-8 sm:space-y-10">
                      {group.components.map((comp) => {
                        const sectionId = `comp-${comp.id}`;
                        const freshness = getComponentFreshness(comp);
                        const isActive = activeSectionId === sectionId;

                        return (
                          <section
                            key={comp.id}
                            id={sectionId}
                            className={cn(
                              'group relative flex w-full scroll-mt-28 flex-col rounded-[4px] border p-6 shadow-2xs transition-all sm:p-8',
                              parentTheme.cardBg,
                              parentTheme.cardBorder,
                            )}
                            style={{ borderRadius: '4px' }}
                          >
                            {/* Top Title inside the Card */}
                            <div className="mb-6 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <h2
                                  className={cn(
                                    'font-sans text-xl font-black transition-colors sm:text-2xl',
                                    isActive ? 'text-[#0056FF]' : 'text-[#0A1A4A]',
                                  )}
                                >
                                  {comp.name}
                                </h2>
                                {freshness && (
                                  <span
                                    className={cn(
                                      'rounded-[4px] px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider uppercase',
                                      freshness === 'new' &&
                                        'border border-emerald-300/80 bg-emerald-50 text-emerald-700',
                                      freshness === 'updated' &&
                                        'border border-amber-300/80 bg-amber-50 text-amber-700',
                                    )}
                                    style={{ borderRadius: '4px' }}
                                  >
                                    {freshness === 'new' ? 'NEW' : 'UPDATED'}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Component Demo Stage (Single-Layer Direct Surface) */}
                            <div className="relative z-10 flex min-h-[220px] w-full items-center justify-center overflow-x-auto py-2 sm:min-h-[280px]">
                              {renderFeedComponentDemo(comp.id, stateBundle, comp)}
                            </div>

                            {/* Bottom-Left Install Command UI Button */}
                            <div className="mt-6 flex items-center justify-start border-t border-black/[0.06] pt-4">
                              <div
                                className="flex items-center gap-2 rounded-[4px] border border-black/10 bg-white/90 px-3 py-1.5 shadow-2xs backdrop-blur-xs transition-all hover:border-[#0056FF]/40"
                                style={{ borderRadius: '4px' }}
                              >
                                <Terminal className="size-3.5 shrink-0 text-[#0056FF]" />
                                <code className="font-mono text-xs font-bold text-[#0056FF]">
                                  npx snpi-ui@latest add {comp.id}
                                </code>
                                <button
                                  type="button"
                                  title="Copy install command"
                                  onClick={() =>
                                    handleCopyInstall(comp.id, `npx snpi-ui@latest add ${comp.id}`)
                                  }
                                  className="ml-1 cursor-pointer text-[#0A1A4A]/60 transition-colors hover:text-[#0056FF]"
                                  aria-label={`Copy install command for ${comp.name}`}
                                >
                                  {copiedInstallId === comp.id ? (
                                    <Check className="size-3.5 stroke-[2.5] text-emerald-600" />
                                  ) : (
                                    <Copy className="size-3.5 stroke-[2]" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </section>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* SECTION: Design Standards Relocation Callout */}
            <section id="brand-identity" className="scroll-mt-24 border-t border-slate-200/80 pt-8">
              <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#CAD3F5] bg-[#EFF5FF]/40 p-6 sm:flex-row sm:items-center">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                    Authoritative Design Hub
                  </span>
                  <h3 className="font-sans text-base font-bold text-[#0A1A4A]">
                    Brand Blueprint &amp; Design Standards
                  </h3>
                  <p className="max-w-xl font-sans text-xs leading-relaxed text-slate-600 sm:text-sm">
                    The 5 Brand Color Tokens, institutional seal, flat design policies, and touch
                    target standards have moved to the dedicated Design System page.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('release');
                    setTimeout(() => {
                      document
                        .getElementById('brand-blueprint')
                        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                  }}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#0056FF] px-4 py-2 font-sans text-xs font-bold text-white transition-colors hover:bg-[#2277FF]"
                >
                  <span>Explore Design System</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </section>
          </main>
        </div>
      </div>
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
  comp?: ComponentItemDoc,
) {
  if (comp?.isFuture) {
    return (
      <BlankFutureComponent
        id={comp.id}
        name={comp.name}
        category={comp.category}
        paradigm={comp.paradigm}
        description={comp.description}
      />
    );
  }

  switch (id) {
    case 'chip':
      return (
        <div className="flex w-full flex-wrap items-center justify-center gap-2 py-4">
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
      );

    case 'switch':
      return (
        <div className="w-full max-w-xl space-y-3 py-4 font-sans">
          {[
            {
              id: 'sync',
              title: 'Auto Sync Telemetry',
              checked: state.switchAutoSync,
              setter: state.setSwitchAutoSync,
            },
            {
              id: 'biometric',
              title: 'Biometric Terminal Active',
              checked: state.switchBiometric,
              setter: state.setSwitchBiometric,
            },
          ].map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-[#CAD3F5] bg-white p-3.5 shadow-2xs transition-all hover:border-[#0056FF]"
            >
              <span className="text-xs font-bold text-[#0A1A4A]">{item.title}</span>
              <LibrarySwitch checked={item.checked} onCheckedChange={item.setter} />
            </div>
          ))}
        </div>
      );

    case 'dropdown': {
      const activeCampusMeta = {
        'phnom-penh': {
          label: 'Phnom Penh Innovation Hub',
          badge: 'PP-01',
          desc: '3,120 Enrolled Students · Tech Tower · Cyber Security Lab',
          enrolled: '3,120',
          labs: '22 Labs',
          latency: '4 ms',
          region: 'Capital Hub · Tower A',
          icon: Building2,
        },
        'siem-reap': {
          label: 'Siem Reap Main Campus',
          badge: 'SR-01',
          desc: '2,450 Enrolled Students · Science Wing · High Performance Cluster',
          enrolled: '2,450',
          labs: '18 Labs',
          latency: '6 ms',
          region: 'Heritage Center · Science Wing',
          icon: GraduationCap,
        },
        battambang: {
          label: 'Battambang Regional Center',
          badge: 'BB-01',
          desc: '1,080 Enrolled Students · Campus A · Agro-Tech Innovation',
          enrolled: '1,080',
          labs: '12 Labs',
          latency: '8 ms',
          region: 'Northwest Hub · Agro-Tech',
          icon: Compass,
        },
        'kampong-cham': {
          label: 'Kampong Cham Learning Center',
          badge: 'KC-01',
          desc: '890 Enrolled Students · Campus B · Digital Media Center',
          enrolled: '890',
          labs: '8 Labs',
          latency: '11 ms',
          region: 'Mekong Central · Media Lab',
          icon: Globe,
        },
      }[state.dropdownCampus] || {
        label: 'Phnom Penh Innovation Hub',
        badge: 'PP-01',
        desc: '3,120 Enrolled Students · Tech Tower · Cyber Security Lab',
        enrolled: '3,120',
        labs: '22 Labs',
        latency: '4 ms',
        region: 'Capital Hub · Tower A',
        icon: Building2,
      };

      const CampusIcon = activeCampusMeta.icon;

      return (
        <div className="flex w-full flex-col items-center">
          <div className="w-full max-w-xl space-y-4 rounded-2xl border-2 border-[#CAD3F5] bg-white p-5 shadow-xs sm:p-6">
            <LibraryDropdown
              label="Campus Location Branch"
              value={state.dropdownCampus}
              onChange={(val) => state.setDropdownCampus(val)}
              options={[
                {
                  value: 'phnom-penh',
                  label: 'Phnom Penh Innovation Hub',
                  badge: 'PP-01',
                  description: '3,120 Enrolled Students · Tech Tower · Cyber Security Lab',
                  icon: Building2,
                },
                {
                  value: 'siem-reap',
                  label: 'Siem Reap Main Campus',
                  badge: 'SR-01',
                  description: '2,450 Enrolled Students · Science Wing · High Performance Cluster',
                  icon: GraduationCap,
                },
                {
                  value: 'battambang',
                  label: 'Battambang Regional Center',
                  badge: 'BB-01',
                  description: '1,080 Enrolled Students · Campus A · Agro-Tech Innovation',
                  icon: Compass,
                },
                {
                  value: 'kampong-cham',
                  label: 'Kampong Cham Learning Center',
                  badge: 'KC-01',
                  description: '890 Enrolled Students · Campus B · Digital Media Center',
                  icon: Globe,
                },
              ]}
            />

            {/* Real-time Campus Content & Telemetry Card (Standard Color Blueprint) */}
            <div className="rounded-2xl border-2 border-[#CAD3F5] bg-[#EFF5FF]/70 p-5 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    SELECTED CAMPUS
                  </span>
                  <span className="py-0.2 rounded border border-[#CAD3F5] bg-[#E3E7FC] px-1.5 font-mono text-[9px] font-bold text-[#0056FF]">
                    {activeCampusMeta.badge}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
                  <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                  <span>ACTIVE BRANCH</span>
                </div>
              </div>

              <div className="mt-3 flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#CAD3F5] bg-white text-[#0056FF] shadow-2xs">
                  <CampusIcon className="size-5 stroke-[2]" />
                </div>
                <div>
                  <h4 className="font-sans text-base font-black text-[#0A1A4A] sm:text-lg">
                    {activeCampusMeta.label}
                  </h4>
                  <p className="mt-0.5 font-sans text-xs leading-relaxed text-slate-600">
                    {activeCampusMeta.desc}
                  </p>
                </div>
              </div>

              {/* Institutional Metrics Grid */}
              <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[#CAD3F5]/80 pt-3.5 font-mono sm:grid-cols-4">
                <div className="rounded-xl border border-[#CAD3F5]/80 bg-white p-2.5 text-center shadow-2xs">
                  <span className="block text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                    Enrolled
                  </span>
                  <span className="mt-0.5 block font-sans text-sm font-black text-[#0056FF]">
                    {activeCampusMeta.enrolled}
                  </span>
                </div>
                <div className="rounded-xl border border-[#CAD3F5]/80 bg-white p-2.5 text-center shadow-2xs">
                  <span className="block text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                    Active Labs
                  </span>
                  <span className="mt-0.5 block font-sans text-sm font-black text-[#0A1A4A]">
                    {activeCampusMeta.labs}
                  </span>
                </div>
                <div className="rounded-xl border border-[#CAD3F5]/80 bg-white p-2.5 text-center shadow-2xs">
                  <span className="block text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                    Latency
                  </span>
                  <span className="mt-0.5 block font-sans text-sm font-black text-emerald-600">
                    {activeCampusMeta.latency}
                  </span>
                </div>
                <div className="rounded-xl border border-[#CAD3F5]/80 bg-white p-2.5 text-center shadow-2xs">
                  <span className="block text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                    Region
                  </span>
                  <span className="mt-0.5 block font-mono text-xs font-bold text-[#0056FF]">
                    {activeCampusMeta.badge}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

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
    case 'step-player':
      return <StepPlayerDemo />;
    case 'animated-counter':
      return <AnimatedCounterDemo />;
    case 'voice-note':
      return <VoiceNoteDemo />;
    case 'data-table':
      return <DataTableDemo />;

    // ==========================================
    // AI KIT GROUP (Interactive Demos)
    // ==========================================
    case 'grid-reveal':
      return <GridRevealDemo />;

    // ==========================================
    // SECTIONS (Component Templates)
    // ==========================================
    case 'marquee-section':
    case 'logo-marquee':
    case 'marquee':
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
      return comp ? (
        <BlankFutureComponent
          id={comp.id}
          name={comp.name}
          category={comp.category}
          paradigm={comp.paradigm}
          description={comp.description}
        />
      ) : null;
  }
}
