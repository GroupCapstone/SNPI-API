'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  ChevronRight,
  Layers,
  Sparkles,
  ArrowRight,
  Check,
  AlertTriangle,
  Info,
  XCircle,
  Home,
  Star,
  User,
  Zap,
} from '@/components/icons';

export interface GalleryComponentItem {
  id: string;
  name: string;
  variantsCount: number;
  category: 'Core UI 10' | 'Actions & Inputs' | 'Feedback' | 'Navigation' | 'Data Display';
  description: string;
  iconType:
    | 'accordion'
    | 'activity-feed'
    | 'alert-toast'
    | 'avatar'
    | 'badge'
    | 'banner'
    | 'breadcrumbs'
    | 'button'
    | 'button-group'
    | 'snackbar'
    | 'bottom-sheet'
    | 'dialog'
    | 'bottom-nav'
    | 'switch'
    | 'chip'
    | 'fab'
    | 'card'
    | 'dropdown'
    | 'tooltip';
}

export const GALLERY_COMPONENTS: GalleryComponentItem[] = [
  {
    id: 'accordion',
    name: 'Accordion',
    variantsCount: 6,
    category: 'Data Display',
    description: 'Vertically stacked disclosure panels for collapsible long-form documentation.',
    iconType: 'accordion',
  },
  {
    id: 'activity-feed',
    name: 'Activity Feed',
    variantsCount: 15,
    category: 'Data Display',
    description: 'Chronological timeline of system events, audit records, and user actions.',
    iconType: 'activity-feed',
  },
  {
    id: 'alert-toast',
    name: 'Alert, Notification & Toast',
    variantsCount: 60,
    category: 'Feedback',
    description: 'Contextual feedback banners with success, warning, danger, and info states.',
    iconType: 'alert-toast',
  },
  {
    id: 'avatar',
    name: 'Avatar',
    variantsCount: 674,
    category: 'Data Display',
    description: 'User and entity visual representations with status dots and fallbacks.',
    iconType: 'avatar',
  },
  {
    id: 'badge',
    name: 'Badge',
    variantsCount: 316,
    category: 'Data Display',
    description: 'Compact status counters, category indicators, and metadata pills.',
    iconType: 'badge',
  },
  {
    id: 'banner',
    name: 'Banner',
    variantsCount: 20,
    category: 'Feedback',
    description: 'Full-width top announcements and persistent system status strips.',
    iconType: 'banner',
  },
  {
    id: 'breadcrumbs',
    name: 'Breadcrumbs',
    variantsCount: 18,
    category: 'Navigation',
    description: 'Secondary hierarchical path navigation displaying location within SNP-SMS.',
    iconType: 'breadcrumbs',
  },
  {
    id: 'button',
    name: 'Button',
    variantsCount: 540,
    category: 'Actions & Inputs',
    description: 'Primary interactive trigger with solid, outline, ghost, and loading states.',
    iconType: 'button',
  },
  {
    id: 'button-group',
    name: 'Button Group',
    variantsCount: 48,
    category: 'Actions & Inputs',
    description: 'Segmented set of related mutually exclusive actions or view toggles.',
    iconType: 'button-group',
  },
  {
    id: 'snackbar',
    name: 'Snackbar',
    variantsCount: 12,
    category: 'Core UI 10',
    description: 'Gmail paradigm ephemeral feedback snackbar with instant Undo action.',
    iconType: 'snackbar',
  },
  {
    id: 'bottom-sheet',
    name: 'Bottom Sheet',
    variantsCount: 8,
    category: 'Core UI 10',
    description: 'Mobile-first pull-up sheet anchored to bottom viewport for contextual details.',
    iconType: 'bottom-sheet',
  },
  {
    id: 'dialog',
    name: 'Dialog',
    variantsCount: 16,
    category: 'Core UI 10',
    description: 'Focused modal overlay interrupting user workflow for critical decisions.',
    iconType: 'dialog',
  },
  {
    id: 'bottom-nav',
    name: 'Bottom Nav',
    variantsCount: 10,
    category: 'Core UI 10',
    description: 'Thumb-reachable primary 3-to-5 destination navigation bar.',
    iconType: 'bottom-nav',
  },
  {
    id: 'switch',
    name: 'Toggle Switch',
    variantsCount: 14,
    category: 'Core UI 10',
    description: 'Physical light switch metaphor for instant binary state activation.',
    iconType: 'switch',
  },
  {
    id: 'chip',
    name: 'Chips',
    variantsCount: 24,
    category: 'Core UI 10',
    description: 'Compact interactive tags for filtering, tagging, and attribute selection.',
    iconType: 'chip',
  },
  {
    id: 'fab',
    name: 'Floating Action Button (FAB)',
    variantsCount: 18,
    category: 'Core UI 10',
    description: 'Circular primary action button floating above surface for highest priority task.',
    iconType: 'fab',
  },
  {
    id: 'card',
    name: 'Card',
    variantsCount: 32,
    category: 'Core UI 10',
    description: 'Flexible content container with media header, body text, and action footer.',
    iconType: 'card',
  },
  {
    id: 'dropdown',
    name: 'Dropdown & Select',
    variantsCount: 28,
    category: 'Core UI 10',
    description: 'Compact disclosure menu displaying a list of options upon click.',
    iconType: 'dropdown',
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    variantsCount: 16,
    category: 'Core UI 10',
    description: 'Informative popover showing keyboard shortcuts and descriptive hints on hover.',
    iconType: 'tooltip',
  },
];

interface ComponentGalleryGridProps {
  onSelectComponent: (id: string) => void;
  selectedId?: string;
}

export function ComponentGalleryGrid({ onSelectComponent, selectedId }: ComponentGalleryGridProps) {
  const [filterCategory, setFilterCategory] = React.useState<string>('All');
  const [search, setSearch] = React.useState<string>('');

  const categories = [
    'All',
    'Core UI 10',
    'Actions & Inputs',
    'Feedback',
    'Navigation',
    'Data Display',
  ];

  const filteredItems = GALLERY_COMPONENTS.filter((item) => {
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Category Pills & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={cn(
                'rounded-full px-3 py-1 font-mono text-xs font-semibold transition-all',
                filterCategory === cat
                  ? 'bg-[#0056FF] text-white shadow-xs'
                  : 'bg-[#001338] text-[#C4CEF8] hover:bg-[#002266] hover:text-white',
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="font-mono text-xs text-[#A3B4F0]">
          Showing <span className="font-bold text-white">{filteredItems.length}</span> components ·{' '}
          <span className="font-bold text-[#2277FF]">
            {filteredItems.reduce((acc, curr) => acc + curr.variantsCount, 0)}
          </span>{' '}
          total variants
        </div>
      </div>

      {/* 3-Column Schematic Card Grid (Image 1 Style) */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => {
          const isSelected = selectedId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectComponent(item.id)}
              className={cn(
                'group flex flex-col overflow-hidden rounded-2xl border text-left transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg',
                isSelected
                  ? 'border-[#0056FF] bg-[#001744] ring-2 ring-[#0056FF]/40'
                  : 'border-[#0F357D] bg-[#001338] hover:border-[#2277FF] hover:bg-[#001744]',
              )}
            >
              {/* Schematic Illustration Canvas (Image 1 Wireframe Visuals) */}
              <div className="relative flex h-44 w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#000B26]/80 to-[#001338] p-4 transition-colors group-hover:from-[#000E30]">
                {/* Subtle Grid Dot Background */}
                <div
                  className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 1px 1px, #2277FF 1px, transparent 0)',
                    backgroundSize: '16px 16px',
                  }}
                />

                {/* Render Schematic Wireframe based on iconType */}
                <div className="relative z-10 w-full max-w-[200px]">
                  {renderSchematicIllustration(item.iconType)}
                </div>

                {/* Badge Category */}
                <span className="absolute top-3 left-3 rounded-md bg-[#000B26]/80 px-2 py-0.5 font-mono text-[10px] font-semibold text-[#A3B4F0] backdrop-blur-xs">
                  {item.category}
                </span>

                {/* Hover Arrow Indicator */}
                <span className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#0056FF]/0 text-[#2277FF] transition-all group-hover:bg-[#0056FF] group-hover:text-white">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>

              {/* Card Footer: Title & Variant Count */}
              <div className="flex flex-1 flex-col justify-between border-t border-[#0F357D]/60 p-4">
                <div>
                  <h3 className="font-sans text-base font-bold text-white transition-colors group-hover:text-[#2277FF]">
                    {item.name}
                  </h3>
                  <p className="mt-0.5 line-clamp-1 text-xs text-[#A3B4F0]">{item.description}</p>
                </div>

                <div className="mt-3 flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#C4CEF8]">{item.variantsCount} variants</span>
                  <span className="font-semibold text-[#2277FF] group-hover:underline">
                    View Demo &rarr;
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Renders schematic wireframe illustrations matching the style of Image 1
 */
function renderSchematicIllustration(type: GalleryComponentItem['iconType']) {
  switch (type) {
    case 'accordion':
      return (
        <div className="space-y-1.5">
          <div className="flex h-5 w-full items-center justify-between rounded-lg bg-white/10 px-2">
            <div className="h-1.5 w-16 rounded-full bg-white/30" />
            <div className="h-2 w-2 rounded-full bg-[#2277FF]" />
          </div>
          <div className="h-10 w-full rounded-lg border border-[#0056FF]/40 bg-[#0056FF]/20 p-2">
            <div className="h-1.5 w-24 rounded-full bg-white/40" />
            <div className="mt-1.5 h-1.5 w-32 rounded-full bg-white/20" />
          </div>
          <div className="flex h-5 w-full items-center justify-between rounded-lg bg-white/10 px-2">
            <div className="h-1.5 w-20 rounded-full bg-white/30" />
            <div className="h-2 w-2 rounded-full bg-white/30" />
          </div>
        </div>
      );

    case 'activity-feed':
      return (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 rounded-xl bg-white/10 p-1.5">
            <span className="h-5 w-5 rounded-full bg-amber-400/80" />
            <div className="h-2 w-24 rounded-full bg-white/30" />
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white/10 p-1.5">
            <span className="h-5 w-5 rounded-full bg-[#2277FF]" />
            <div className="h-2 w-28 rounded-full bg-white/30" />
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-white/10 p-1.5">
            <span className="h-5 w-5 rounded-full bg-purple-400/80" />
            <div className="h-2 w-20 rounded-full bg-white/30" />
          </div>
        </div>
      );

    case 'alert-toast':
      return (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-950/30 px-2 py-1">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            <div className="h-1.5 w-24 rounded-full bg-white/40" />
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-950/30 px-2 py-1">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <div className="h-1.5 w-28 rounded-full bg-white/40" />
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/30 px-2 py-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <div className="h-1.5 w-20 rounded-full bg-white/40" />
          </div>
        </div>
      );

    case 'avatar':
      return (
        <div className="flex items-center justify-center">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/20 bg-white/10">
            <User className="h-10 w-10 text-white/50" />
            <span className="absolute right-1 bottom-1 h-3.5 w-3.5 rounded-full border-2 border-[#000B26] bg-[#0056FF]" />
          </div>
        </div>
      );

    case 'badge':
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
            <span className="h-2.5 w-2.5 rounded-full bg-[#FF7036]" />
            <div className="h-1.5 w-16 rounded-full bg-white/40" />
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[#0056FF]/20 px-3 py-1">
            <Zap className="h-3 w-3 text-[#2277FF]" />
            <div className="h-1.5 w-20 rounded-full bg-white/50" />
          </div>
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <div className="h-1.5 w-14 rounded-full bg-white/40" />
          </div>
        </div>
      );

    case 'banner':
      return (
        <div className="overflow-hidden rounded-xl border border-white/20 bg-white/5">
          <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/10 px-2 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </div>
          <div className="flex items-center gap-2 bg-[#FF7036]/20 p-2">
            <AlertTriangle className="h-3.5 w-3.5 text-[#FF7036]" />
            <div className="h-1.5 w-28 rounded-full bg-white/50" />
          </div>
          <div className="p-3">
            <div className="h-2 w-full rounded-full bg-white/10" />
          </div>
        </div>
      );

    case 'breadcrumbs':
      return (
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2">
          <Home className="h-3.5 w-3.5 text-[#2277FF]" />
          <span className="text-white/40">/</span>
          <div className="h-1.5 w-10 rounded-full bg-white/40" />
          <span className="text-white/40">/</span>
          <div className="h-1.5 w-12 rounded-full bg-[#0056FF]" />
        </div>
      );

    case 'button':
      return (
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="relative inline-flex h-9 items-center justify-center rounded-xl bg-[#0056FF] px-6 text-xs font-bold text-white shadow-md">
            <span>Button</span>
            {/* Visual Pointer Cursor */}
            <span className="absolute -right-2 -bottom-2 flex h-6 w-6 items-center justify-center">
              <svg
                className="h-5 w-5 text-white drop-shadow-md"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3 3l7 18 3-7 7-3L3 3z" />
              </svg>
            </span>
          </div>
          <div className="h-1.5 w-16 rounded-full bg-white/20" />
        </div>
      );

    case 'button-group':
      return (
        <div className="inline-flex rounded-xl border border-white/15 bg-white/10 p-1">
          <div className="h-7 rounded-lg px-3 py-1 text-[11px] font-medium text-white/60">View</div>
          <div className="h-7 rounded-lg bg-[#FF7036] px-3 py-1 text-[11px] font-bold text-white shadow-xs">
            Edit
          </div>
          <div className="h-7 rounded-lg px-3 py-1 text-[11px] font-medium text-white/60">
            Share
          </div>
        </div>
      );

    case 'snackbar':
      return (
        <div className="flex w-full items-center justify-between rounded-xl border border-[#0F357D] bg-[#001744] p-2.5 shadow-lg">
          <div className="h-2 w-20 rounded-full bg-white/50" />
          <span className="rounded-md bg-[#0056FF] px-2 py-0.5 font-mono text-[10px] font-bold text-white">
            Undo
          </span>
        </div>
      );

    case 'bottom-sheet':
      return (
        <div className="relative h-20 w-full overflow-hidden rounded-t-2xl border-x border-t border-[#0056FF]/50 bg-[#001744] p-2">
          <div className="mx-auto h-1 w-8 rounded-full bg-white/30" />
          <div className="mt-2 space-y-1.5">
            <div className="h-2 w-24 rounded-full bg-white/40" />
            <div className="h-1.5 w-36 rounded-full bg-white/20" />
          </div>
        </div>
      );

    case 'dialog':
      return (
        <div className="w-full rounded-xl border border-white/20 bg-[#001744] p-3 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="h-2 w-16 rounded-full bg-white/60" />
            <span className="h-2 w-2 rounded-full bg-red-400" />
          </div>
          <div className="space-y-1 py-2">
            <div className="h-1.5 w-full rounded-full bg-white/20" />
            <div className="h-1.5 w-3/4 rounded-full bg-white/20" />
          </div>
          <div className="mt-1 flex justify-end gap-1.5">
            <div className="h-4 w-10 rounded-md bg-white/10" />
            <div className="h-4 w-12 rounded-md bg-[#0056FF]" />
          </div>
        </div>
      );

    case 'bottom-nav':
      return (
        <div className="flex w-full items-center justify-around rounded-xl border border-white/15 bg-white/10 p-2">
          <div className="h-4 w-4 rounded-md bg-white/30" />
          <div className="h-4 w-4 rounded-md bg-[#0056FF]" />
          <div className="h-4 w-4 rounded-md bg-white/30" />
        </div>
      );

    case 'switch':
      return (
        <div className="flex items-center justify-center">
          <div className="relative h-7 w-12 rounded-full bg-[#0056FF] p-1">
            <span className="absolute top-1 right-1 h-5 w-5 rounded-full bg-white shadow-sm" />
          </div>
        </div>
      );

    case 'chip':
      return (
        <div className="flex items-center justify-center gap-1.5">
          <div className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] text-white">
            Passive
          </div>
          <div className="rounded-full bg-[#0056FF] px-2.5 py-1 text-[10px] font-bold text-white shadow-xs">
            Active
          </div>
        </div>
      );

    case 'fab':
      return (
        <div className="flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0056FF] text-white shadow-lg">
            <span className="text-xl font-bold">+</span>
          </div>
        </div>
      );

    case 'card':
      return (
        <div className="w-full rounded-xl border border-[#0F357D] bg-white/5 p-2.5">
          <div className="h-8 w-full rounded-lg bg-gradient-to-r from-[#000B26] to-[#0056FF]" />
          <div className="mt-2 h-2 w-20 rounded-full bg-white/40" />
          <div className="mt-1 h-1.5 w-28 rounded-full bg-white/20" />
        </div>
      );

    case 'dropdown':
      return (
        <div className="flex w-full items-center justify-between rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs">
          <span className="text-white/60">Select Option</span>
          <span className="text-xs text-white/40">&darr;</span>
        </div>
      );

    case 'tooltip':
      return (
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="rounded-md bg-[#0056FF] px-2 py-0.5 font-mono text-[10px] text-white shadow-md">
            Shortcut: ⌘K
          </div>
          <div className="h-1.5 w-1.5 rotate-45 bg-[#0056FF]" />
        </div>
      );

    default:
      return <div className="h-10 w-24 rounded-lg bg-white/10" />;
  }
}
