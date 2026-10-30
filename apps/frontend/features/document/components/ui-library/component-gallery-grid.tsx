'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, Home, User, Zap, AlertTriangle, ArrowRight } from '@/components/icons';

export interface GalleryComponentItem {
  id: string;
  name: string;
  variantsCount: number;
  category: string;
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
    | 'tooltip'
    | 'hanging-tabs-nav'
    | 'input';
}

export const GALLERY_COMPONENTS: GalleryComponentItem[] = [
  {
    id: 'accordion',
    name: 'Accordion',
    variantsCount: 6,
    category: 'Data Display',
    description: 'Vertically stacked disclosure panels for collapsible long-form content.',
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
    description: 'User and entity visual representations with status indicators.',
    iconType: 'avatar',
  },
  {
    id: 'badge',
    name: 'Badge',
    variantsCount: 316,
    category: 'Data Display',
    description: 'Compact status counters and indicators.',
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
    description: 'Secondary hierarchical path navigation displaying location within SNPI-SMS.',
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
    description: 'Ephemeral feedback snackbar with instant Undo action.',
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
    description: 'Thumb-reachable primary destination navigation bar.',
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
    description: 'Compact interactive tags for filtering and selection.',
    iconType: 'chip',
  },
  {
    id: 'fab',
    name: 'Floating Action Button (FAB)',
    variantsCount: 18,
    category: 'Core UI 10',
    description: 'Primary action button floating above surface for highest priority task.',
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
  {
    id: 'hanging-tabs-nav',
    name: 'Hanging Tabs Nav',
    variantsCount: 12,
    category: 'Core UI 10',
    description: 'Inverted trapezoid folder tabs suspended from the ceiling.',
    iconType: 'hanging-tabs-nav',
  },
  {
    id: 'input',
    name: 'Pill Input & Search',
    variantsCount: 30,
    category: 'Core UI 10',
    description:
      'Capsule pill text input and search bar with continuous 2px border and brand colors.',
    iconType: 'input',
  },
];

interface ComponentGalleryGridProps {
  onSelectComponent: (id: string) => void;
  selectedId?: string;
}

export function ComponentGalleryGrid({ onSelectComponent, selectedId }: ComponentGalleryGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {GALLERY_COMPONENTS.map((item) => {
        const isSelected = selectedId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectComponent(item.id)}
            className={cn(
              'group flex flex-col overflow-hidden rounded-2xl border text-left transition-all duration-300 ease-out',
              'bg-white/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),_0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-md',
              'hover:-translate-y-1 hover:border-[#0056FF]/40 hover:shadow-[0_12px_28px_rgba(0,86,255,0.08)]',
              isSelected
                ? 'border-[#0056FF] shadow-md ring-2 ring-[#0056FF]/20'
                : 'border-slate-200/80',
            )}
          >
            {/* Schematic Illustration Canvas - Apple Liquid Glass Style */}
            <div className="relative flex h-48 w-full items-center justify-center overflow-hidden bg-[#F6F8FA] p-6 transition-all duration-300 group-hover:bg-[#F0F4FF]/70">
              {/* Subtle Dot Grid */}
              <div
                className="absolute inset-0 opacity-40 transition-opacity group-hover:opacity-60"
                style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, #CBD5E1 1px, transparent 0)',
                  backgroundSize: '16px 16px',
                }}
              />

              {/* Schematic Wireframe */}
              <div className="relative z-10 w-full max-w-[200px] transition-transform duration-300 ease-out group-hover:scale-105">
                {renderSchematicIllustration(item.iconType)}
              </div>
            </div>

            {/* Card Content - Clean Typography without symbols or underscores */}
            <div className="flex flex-1 flex-col justify-between p-5">
              <div>
                <h3 className="font-sans text-base font-bold text-slate-900 transition-colors group-hover:text-[#0056FF]">
                  {item.name}
                </h3>
                <div className="mt-1 flex items-center gap-2 font-mono text-xs text-slate-500">
                  <span className="font-bold text-slate-700">{item.variantsCount}</span>
                  <span className="h-3 w-[1.5px] bg-[#0056FF]" />
                  <span className="tracking-wider uppercase">VARIANTS</span>
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Schematic wireframe illustrations in clean light mode
 */
function renderSchematicIllustration(type: GalleryComponentItem['iconType']) {
  switch (type) {
    case 'accordion':
      return (
        <div className="space-y-2">
          <div className="flex h-6 w-full items-center justify-between rounded-lg border border-slate-200/80 bg-white px-3 shadow-xs">
            <div className="h-2 w-20 rounded-full bg-slate-300" />
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          <div className="h-12 w-full rounded-lg border border-[#0056FF]/30 bg-blue-50/60 p-2.5 shadow-xs">
            <div className="h-2 w-24 rounded-full bg-slate-400" />
            <div className="mt-2 h-1.5 w-32 rounded-full bg-slate-300" />
          </div>
          <div className="flex h-6 w-full items-center justify-between rounded-lg border border-slate-200/80 bg-white px-3 shadow-xs">
            <div className="h-2 w-20 rounded-full bg-slate-300" />
            <div className="h-2 w-2 rounded-full bg-slate-300" />
          </div>
        </div>
      );

    case 'activity-feed':
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white p-2 shadow-xs">
            <span className="h-5 w-5 rounded-full bg-amber-400" />
            <div className="h-2 w-24 rounded-full bg-slate-300" />
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white p-2 shadow-xs">
            <span className="h-5 w-5 rounded-full bg-[#0056FF]" />
            <div className="h-2 w-28 rounded-full bg-slate-300" />
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white p-2 shadow-xs">
            <span className="h-5 w-5 rounded-full bg-purple-500" />
            <div className="h-2 w-20 rounded-full bg-slate-300" />
          </div>
        </div>
      );

    case 'alert-toast':
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 shadow-xs">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <div className="h-2 w-24 rounded-full bg-slate-300" />
          </div>
          <div className="flex items-center gap-2.5 rounded-lg border border-amber-200 bg-white px-3 py-1.5 shadow-xs">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <div className="h-2 w-28 rounded-full bg-slate-300" />
          </div>
          <div className="flex items-center gap-2.5 rounded-lg border border-emerald-200 bg-white px-3 py-1.5 shadow-xs">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <div className="h-2 w-20 rounded-full bg-slate-300" />
          </div>
        </div>
      );

    case 'avatar':
      return (
        <div className="flex items-center justify-center">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-slate-200 bg-white shadow-xs">
            <User className="h-12 w-12 text-slate-400" />
            <span className="absolute right-1.5 bottom-1.5 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" />
          </div>
        </div>
      );

    case 'badge':
      return (
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 py-1.5 shadow-xs">
            <span className="h-3 w-3 rounded-full bg-[#FF7036]" />
            <div className="h-2 w-20 rounded-full bg-slate-300" />
          </div>
          <div className="flex items-center gap-2.5 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 shadow-xs">
            <Zap className="h-3.5 w-3.5 text-[#0056FF]" />
            <div className="h-2 w-24 rounded-full bg-slate-400" />
          </div>
          <div className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 py-1.5 shadow-xs">
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
            <div className="h-2 w-16 rounded-full bg-slate-300" />
          </div>
        </div>
      );

    case 'banner':
      return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-red-400" />
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
          </div>
          <div className="flex items-center gap-2 border-b border-amber-100 bg-amber-50 px-3 py-2">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            <div className="h-2 w-28 rounded-full bg-amber-200" />
          </div>
          <div className="p-3">
            <div className="h-2 w-full rounded-full bg-slate-200" />
          </div>
        </div>
      );

    case 'breadcrumbs':
      return (
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-xs">
          <Home className="h-4 w-4 text-[#0056FF]" />
          <span className="font-bold text-slate-300">/</span>
          <div className="h-2 w-12 rounded-full bg-slate-300" />
          <span className="font-bold text-slate-300">/</span>
          <div className="h-2 w-14 rounded-full bg-[#0056FF]" />
        </div>
      );

    case 'button':
      return (
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="relative inline-flex h-10 items-center justify-center rounded-xl bg-[#0056FF] px-7 text-xs font-bold text-white shadow-sm transition-transform group-hover:scale-105">
            <span>Button</span>
            <span className="absolute -right-2 -bottom-2 flex h-6 w-6 items-center justify-center">
              <svg
                className="h-5 w-5 text-[#0056FF] drop-shadow-md"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M3 3l7 18 3-7 7-3L3 3z" />
              </svg>
            </span>
          </div>
          <div className="h-2 w-16 rounded-full bg-slate-200" />
        </div>
      );

    case 'button-group':
      return (
        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-xs">
          <div className="h-8 rounded-lg px-3.5 py-1.5 text-xs font-medium text-slate-500">
            View
          </div>
          <div className="h-8 rounded-lg bg-[#FF7036] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs">
            Edit
          </div>
          <div className="h-8 rounded-lg px-3.5 py-1.5 text-xs font-medium text-slate-500">
            Share
          </div>
        </div>
      );

    case 'snackbar':
      return (
        <div className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-md">
          <div className="h-2 w-24 rounded-full bg-slate-300" />
          <span className="rounded-md bg-[#0056FF] px-2.5 py-1 font-mono text-[10px] font-bold text-white">
            Undo
          </span>
        </div>
      );

    case 'bottom-sheet':
      return (
        <div className="relative h-20 w-full overflow-hidden rounded-t-2xl border-x border-t border-slate-200 bg-white p-2.5 shadow-sm">
          <div className="mx-auto h-1 w-10 rounded-full bg-slate-300" />
          <div className="mt-3 space-y-2">
            <div className="h-2 w-28 rounded-full bg-slate-300" />
            <div className="h-1.5 w-36 rounded-full bg-slate-200" />
          </div>
        </div>
      );

    case 'dialog':
      return (
        <div className="w-full rounded-xl border border-slate-200 bg-white p-3.5 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="h-2.5 w-20 rounded-full bg-slate-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          </div>
          <div className="space-y-1.5 py-2.5">
            <div className="h-2 w-full rounded-full bg-slate-200" />
            <div className="h-2 w-3/4 rounded-full bg-slate-200" />
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <div className="h-5 w-12 rounded-md bg-slate-100" />
            <div className="h-5 w-14 rounded-md bg-[#0056FF]" />
          </div>
        </div>
      );

    case 'bottom-nav':
      return (
        <div className="flex w-full items-center justify-around rounded-xl border border-slate-200 bg-white p-2.5 shadow-xs">
          <div className="h-5 w-5 rounded-md bg-slate-200" />
          <div className="h-5 w-5 rounded-md bg-[#0056FF]" />
          <div className="h-5 w-5 rounded-md bg-slate-200" />
        </div>
      );

    case 'switch':
      return (
        <div className="flex items-center justify-center">
          <div className="relative h-8 w-14 rounded-full bg-[#0056FF] p-1 shadow-inner">
            <span className="absolute top-1 right-1 h-6 w-6 rounded-full bg-white shadow-md" />
          </div>
        </div>
      );

    case 'chip':
      return (
        <div className="flex items-center justify-center gap-2">
          <div className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600 shadow-xs">
            Passive
          </div>
          <div className="rounded-full bg-[#0056FF] px-3 py-1 text-xs font-bold text-white shadow-xs">
            Active
          </div>
        </div>
      );

    case 'fab':
      return (
        <div className="flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0056FF] text-white shadow-lg transition-transform group-hover:scale-110">
            <span className="text-2xl font-bold">+</span>
          </div>
        </div>
      );

    case 'card':
      return (
        <div className="w-full rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
          <div className="h-10 w-full rounded-lg bg-gradient-to-r from-blue-100 to-[#0056FF]" />
          <div className="mt-2.5 h-2.5 w-24 rounded-full bg-slate-400" />
          <div className="mt-1.5 h-2 w-32 rounded-full bg-slate-200" />
        </div>
      );

    case 'dropdown':
      return (
        <div className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs shadow-xs">
          <span className="text-slate-600">Select Option</span>
          <span className="text-xs text-slate-400">&darr;</span>
        </div>
      );

    case 'tooltip':
      return (
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="rounded-md bg-slate-900 px-3 py-1 font-mono text-[11px] text-white shadow-md">
            Shortcut: Cmd+K
          </div>
          <div className="h-2 w-2 rotate-45 bg-slate-900" />
        </div>
      );

    case 'hanging-tabs-nav':
      return (
        <div className="flex items-center justify-center gap-1">
          <div className="rounded-b-lg border-2 border-slate-300 bg-slate-100 px-3 py-1.5 text-[10px] font-bold text-slate-600">
            Map
          </div>
          <div className="rounded-b-lg border-2 border-[#0056FF] bg-blue-50/60 px-3 py-1.5 text-[10px] font-bold text-[#0056FF]">
            Newswire
          </div>
        </div>
      );

    case 'input':
      return (
        <div className="flex w-full items-center gap-2 rounded-full border-2 border-[#0056FF] bg-white px-3 py-1.5 text-xs text-slate-700 shadow-xs">
          <span className="font-bold text-[#0056FF]">Q</span>
          <span className="text-slate-500">Search components...</span>
        </div>
      );

    default:
      return <div className="h-12 w-28 rounded-lg bg-slate-100" />;
  }
}
