'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Search, Home, User, Plus, Layers, ChevronDown, FileText } from '@/components/icons';

export interface GalleryComponentItem {
  id: string;
  name: string;
  category: string;
  description: string;
}

export const GALLERY_COMPONENTS: GalleryComponentItem[] = [
  {
    id: 'snackbar',
    name: 'Snackbar',
    category: 'Feedback & Overlays',
    description: 'Ephemeral feedback banner with auto-dismiss and instant Undo recovery.',
  },
  {
    id: 'bottom-sheet',
    name: 'Bottom Sheet',
    category: 'Mobile Navigation',
    description: 'Anchored pull-up drawer for contextual actions, filters, and records.',
  },
  {
    id: 'dialog',
    name: 'Dialog',
    category: 'Feedback & Overlays',
    description: 'Focused modal overlay interrupting user flow for critical confirmation.',
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    category: 'Feedback & Overlays',
    description: 'Contextual popover hint revealing keyboard shortcuts and helper text on hover.',
  },
  {
    id: 'fab',
    name: 'FAB (Floating Action Button)',
    category: 'Actions & Triggers',
    description: 'Elevated circular trigger floating above surface for the primary action.',
  },
  {
    id: 'chip',
    name: 'Chip',
    category: 'Selection & Filters',
    description: 'Compact interactive pill filters for multi-criteria search and tagging.',
  },
  {
    id: 'switch',
    name: 'Toggle Switch',
    category: 'Selection & Inputs',
    description: 'Physical switch metaphor for instant binary on/off state activation.',
  },
  {
    id: 'dropdown',
    name: 'Dropdown',
    category: 'Selection & Inputs',
    description: 'Compact disclosure menu displaying selectable options upon click.',
  },
  {
    id: 'bottom-nav',
    name: 'Bottom Nav',
    category: 'Mobile Navigation',
    description: 'Thumb-reachable mobile bottom navigation bar with active tab indicators.',
  },
  {
    id: 'card',
    name: 'Card',
    category: 'Layout & Containers',
    description: 'Interactive container with metrics, status pills, and sliding card layers.',
  },
  {
    id: 'hanging-tabs-nav',
    name: 'Hanging Tabs Nav',
    category: 'Header Navigation',
    description: 'Inverted trapezoid folder tabs suspended from the ceiling baseline.',
  },
  {
    id: 'icon-bar',
    name: 'Icon Bar',
    category: 'Navigation',
    description: 'Bloom-open label reveal horizontal toolbar with status dot and roving tabindex.',
  },
  {
    id: 'input',
    name: 'Pill Input & Search',
    category: 'Actions & Inputs',
    description: 'Capsule pill text input with continuous border and keyboard shortcut badge.',
  },
];

interface ComponentGalleryGridProps {
  onSelectComponent: (id: string) => void;
  selectedId?: string;
}

export function ComponentGalleryGrid({ onSelectComponent, selectedId }: ComponentGalleryGridProps) {
  // Mini interactive state for each card inside the catalog
  const [miniSnackbarUndone, setMiniSnackbarUndone] = React.useState(false);
  const [miniSwitch, setMiniSwitch] = React.useState(true);
  const [miniSelectedChip, setMiniSelectedChip] = React.useState('All');
  const [miniBottomNav, setMiniBottomNav] = React.useState('home');
  const [miniHangingTab, setMiniHangingTab] = React.useState('openapi');
  const [miniCardFlipped, setMiniCardFlipped] = React.useState(false);
  const [miniDropdownOpen, setMiniDropdownOpen] = React.useState(false);
  const [miniDropdownVal, setMiniDropdownVal] = React.useState('Siem Reap Campus');
  const [miniSearchQuery, setMiniSearchQuery] = React.useState('');

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {GALLERY_COMPONENTS.map((item) => {
        const isSelected = selectedId === item.id;
        return (
          <div
            key={item.id}
            onClick={() => onSelectComponent(item.id)}
            className={cn(
              'group flex cursor-pointer flex-col overflow-hidden rounded-2xl border text-left transition-all duration-200 select-none',
              'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]',
              'hover:-translate-y-0.5 hover:border-[#0056FF]/50 hover:shadow-[0_8px_20px_rgba(0,86,255,0.06)]',
              isSelected ? 'border-[#0056FF] ring-2 ring-[#0056FF]/20' : 'border-slate-200/90',
            )}
          >
            {/* Real Live Mini Interactive Preview Canvas */}
            <div className="relative flex h-44 w-full items-center justify-center overflow-hidden border-b border-slate-100 bg-[#F8FAFC] p-4 transition-colors group-hover:bg-[#F0F4FF]/50">
              {/* Subtle Dot Grid */}
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, #CAD3F5 1px, transparent 0)',
                  backgroundSize: '16px 16px',
                }}
              />

              {/* Real Interactive Mini Component Preview */}
              <div
                className="relative z-10 w-full max-w-[240px]"
                onClick={(e) => {
                  // Allow interactions inside the card while also selecting
                  e.stopPropagation();
                  onSelectComponent(item.id);
                }}
              >
                {renderRealMiniDemo(item.id, {
                  miniSnackbarUndone,
                  setMiniSnackbarUndone,
                  miniSwitch,
                  setMiniSwitch,
                  miniSelectedChip,
                  setMiniSelectedChip,
                  miniBottomNav,
                  setMiniBottomNav,
                  miniHangingTab,
                  setMiniHangingTab,
                  miniCardFlipped,
                  setMiniCardFlipped,
                  miniDropdownOpen,
                  setMiniDropdownOpen,
                  miniDropdownVal,
                  setMiniDropdownVal,
                  miniSearchQuery,
                  setMiniSearchQuery,
                })}
              </div>
            </div>

            {/* Card Content Footer */}
            <div className="flex flex-1 flex-col justify-between p-4">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-sans text-sm font-bold text-slate-950 transition-colors group-hover:text-[#0056FF]">
                    {item.name}
                  </h3>
                  <span className="rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-2 py-0.5 font-mono text-[10px] font-bold text-[#0056FF]">
                    {item.category}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 font-sans text-xs leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 font-mono text-[10px] text-slate-500">
                <span className="font-semibold text-[#0056FF]">Live Interactive</span>
                <span>44px touch · zero shadows</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Renders real interactive mini components for every catalog card
 * STRICTLY using the docs brand palette (#0056FF, #2277FF, #000B26, #E3E7FC, #FFFFFF)
 */
function renderRealMiniDemo(
  id: string,
  state: {
    miniSnackbarUndone: boolean;
    setMiniSnackbarUndone: React.Dispatch<React.SetStateAction<boolean>>;
    miniSwitch: boolean;
    setMiniSwitch: React.Dispatch<React.SetStateAction<boolean>>;
    miniSelectedChip: string;
    setMiniSelectedChip: React.Dispatch<React.SetStateAction<string>>;
    miniBottomNav: string;
    setMiniBottomNav: React.Dispatch<React.SetStateAction<string>>;
    miniHangingTab: string;
    setMiniHangingTab: React.Dispatch<React.SetStateAction<string>>;
    miniCardFlipped: boolean;
    setMiniCardFlipped: React.Dispatch<React.SetStateAction<boolean>>;
    miniDropdownOpen: boolean;
    setMiniDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
    miniDropdownVal: string;
    setMiniDropdownVal: React.Dispatch<React.SetStateAction<string>>;
    miniSearchQuery: string;
    setMiniSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  },
) {
  switch (id) {
    case 'snackbar':
      return (
        <div className="flex w-full items-center justify-between rounded-xl border border-slate-900 bg-[#000B26] px-3 py-2 text-white shadow-md">
          <div className="flex items-center gap-2">
            <span className="size-1.5 animate-pulse rounded-full bg-[#0056FF]" />
            <span className="font-sans text-[11px] font-medium text-slate-200">
              {state.miniSnackbarUndone ? 'Action undone' : 'STU-2026 enrolled'}
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              state.setMiniSnackbarUndone(!state.miniSnackbarUndone);
            }}
            className="rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-2 py-0.5 font-mono text-[10px] font-bold text-[#0056FF] transition-transform active:scale-95"
          >
            {state.miniSnackbarUndone ? 'Reset' : 'Undo'}
          </button>
        </div>
      );

    case 'bottom-sheet':
      return (
        <div className="w-full rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-sm">
          {/* Sheet Handle */}
          <div className="mx-auto h-1 w-8 rounded-full bg-slate-300" />
          <div className="mt-2 text-center font-sans text-[11px] font-bold text-slate-900">
            Campus Actions
          </div>
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between rounded-lg bg-[#E3E7FC]/50 px-2 py-1 text-[10.5px] font-semibold text-[#0056FF]">
              <span>Export Student Roster</span>
              <span className="font-mono text-[9px]">PDF</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-slate-50 px-2 py-1 text-[10.5px] font-medium text-slate-700">
              <span>Biometric Sync</span>
              <span className="font-mono text-[9px]">LIVE</span>
            </div>
          </div>
        </div>
      );

    case 'dialog':
      return (
        <div className="w-full rounded-xl border border-slate-200/90 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-1.5 font-sans text-xs font-bold text-slate-950">
            <span className="size-2 rounded-full bg-[#0056FF]" />
            <span>Revoke enrollment?</span>
          </div>
          <p className="mt-1 font-sans text-[10.5px] text-slate-600">
            Cancel student seat for Term 1?
          </p>
          <div className="mt-2.5 flex items-center justify-end gap-1.5">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[9.5px] font-semibold text-slate-600">
              Cancel
            </span>
            <span className="rounded-full border border-[#0056FF] bg-[#0056FF] px-2 py-0.5 font-mono text-[9.5px] font-bold text-white">
              Confirm
            </span>
          </div>
        </div>
      );

    case 'tooltip':
      return (
        <div className="flex flex-col items-center gap-1.5">
          {/* Popover Bubble */}
          <div className="relative rounded-lg border border-slate-900 bg-[#000B26] px-2.5 py-1 text-center font-mono text-[10px] text-white shadow-sm">
            <span>Save roster changes (⌘S)</span>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#000B26]" />
          </div>
          {/* Anchor Button */}
          <div className="rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-3 py-1 font-sans text-xs font-bold text-[#0056FF]">
            Save Record
          </div>
        </div>
      );

    case 'fab':
      return (
        <div className="flex items-center justify-center py-2">
          <div className="relative flex size-12 items-center justify-center rounded-full border border-[#0056FF] bg-[#0056FF] text-white shadow-[0_4px_14px_rgba(0,86,255,0.4)] transition-transform hover:scale-105 active:scale-95">
            <Plus className="size-5 stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full border border-white bg-[#000B26] font-mono text-[9px] font-bold text-white">
              +
            </span>
          </div>
        </div>
      );

    case 'chip':
      return (
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          {['All', 'Enrolled', 'Grade 10'].map((chip) => {
            const isChipSelected = state.miniSelectedChip === chip;
            return (
              <button
                key={chip}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  state.setMiniSelectedChip(chip);
                }}
                className={cn(
                  'rounded-full px-2.5 py-1 font-sans text-[11px] font-bold transition-all duration-150',
                  isChipSelected
                    ? 'border border-[#0056FF] bg-[#0056FF] text-white'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-[#CAD3F5] hover:bg-[#E3E7FC]/40',
                )}
              >
                {chip}
              </button>
            );
          })}
        </div>
      );

    case 'switch':
      return (
        <div className="flex items-center justify-between rounded-xl border border-slate-200/90 bg-white px-3 py-2 shadow-xs">
          <div className="flex flex-col">
            <span className="font-sans text-[11px] font-bold text-slate-900">Auto Sync</span>
            <span className="font-mono text-[9px] text-slate-500">
              {state.miniSwitch ? 'ACTIVE' : 'PAUSED'}
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              state.setMiniSwitch(!state.miniSwitch);
            }}
            className={cn(
              'relative h-6 w-11 rounded-full p-0.5 transition-colors duration-200 focus:outline-none',
              state.miniSwitch ? 'bg-[#0056FF]' : 'bg-slate-300',
            )}
          >
            <div
              className={cn(
                'size-5 rounded-full bg-white shadow-xs transition-transform duration-200',
                state.miniSwitch ? 'translate-x-5' : 'translate-x-0',
              )}
            />
          </button>
        </div>
      );

    case 'dropdown':
      return (
        <div className="relative w-full">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              state.setMiniDropdownOpen(!state.miniDropdownOpen);
            }}
            className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-left font-sans text-xs font-bold text-slate-800 shadow-xs hover:border-[#0056FF]"
          >
            <span className="truncate">{state.miniDropdownVal}</span>
            <ChevronDown className="size-3.5 text-slate-400" />
          </button>
          {state.miniDropdownOpen && (
            <div className="absolute top-full z-20 mt-1 w-full rounded-xl border border-slate-200 bg-white p-1 text-xs shadow-lg">
              {['Siem Reap Campus', 'Phnom Penh Branch', 'Battambang Wing'].map((campus) => (
                <div
                  key={campus}
                  onClick={(e) => {
                    e.stopPropagation();
                    state.setMiniDropdownVal(campus);
                    state.setMiniDropdownOpen(false);
                  }}
                  className={cn(
                    'cursor-pointer rounded-lg px-2 py-1 font-sans text-[11px] font-semibold',
                    state.miniDropdownVal === campus
                      ? 'bg-[#E3E7FC] text-[#0056FF]'
                      : 'text-slate-700 hover:bg-slate-50',
                  )}
                >
                  {campus}
                </div>
              ))}
            </div>
          )}
        </div>
      );

    case 'bottom-nav':
      return (
        <div className="flex w-full items-center justify-around rounded-xl border border-slate-200 bg-white py-1.5 shadow-xs">
          {[
            { id: 'home', label: 'Home', icon: Home },
            { id: 'search', label: 'Search', icon: Search },
            { id: 'profile', label: 'Profile', icon: User },
          ].map((tab) => {
            const isTabActive = state.miniBottomNav === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  state.setMiniBottomNav(tab.id);
                }}
                className={cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1 font-sans text-[10px] font-bold transition-colors',
                  isTabActive ? 'text-[#0056FF]' : 'text-slate-400 hover:text-slate-700',
                )}
              >
                <Icon className="size-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      );

    case 'card':
      return (
        <div className="w-full rounded-xl border border-slate-200/90 bg-white p-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">
              Students Active
            </span>
            <span className="py-0.2 rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-1.5 font-mono text-[9px] font-bold text-[#0056FF]">
              +8.5%
            </span>
          </div>
          <div className="mt-1 font-sans text-base font-black text-slate-950">10,119</div>
          <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-1.5">
            <span className="font-sans text-[10px] text-slate-500">Term 1 2026</span>
            <span className="rounded-full bg-[#0056FF] px-2 py-0.5 font-sans text-[9.5px] font-bold text-white">
              Inspect
            </span>
          </div>
        </div>
      );

    case 'hanging-tabs-nav':
      return (
        <div className="flex items-start justify-center gap-1.5 pt-1">
          <div className="relative flex h-11 w-20 flex-col items-center justify-center rounded-b-xl border border-t-0 border-[#0056FF] bg-white pt-1">
            <FileText className="size-3.5 text-[#0056FF]" />
            <span className="mt-0.5 font-sans text-[9px] font-bold text-[#0056FF]">Open API</span>
          </div>
          <div className="relative flex h-11 w-20 flex-col items-center justify-center rounded-b-xl border border-t-0 border-slate-300 bg-slate-100/80 pt-1">
            <Layers className="size-3.5 text-slate-600" />
            <span className="mt-0.5 font-sans text-[9px] font-bold text-slate-600">Library</span>
          </div>
        </div>
      );

    case 'icon-bar':
      return (
        <div className="flex items-center justify-center pt-2">
          <div className="flex h-8 items-center gap-1 rounded-xl border border-slate-800 bg-[#0A0D14] px-2 text-[10px] text-white">
            <span className="relative flex items-center gap-1 rounded-lg bg-white/10 px-2 py-0.5 font-bold">
              <span className="size-1 rounded-full bg-[#818CF8]" />
              <span>Pen</span>
            </span>
            <span className="px-1 font-mono text-slate-500">Eraser</span>
            <span className="px-1 font-mono text-slate-500">Fill</span>
          </div>
        </div>
      );

    case 'input':
      return (
        <div className="relative w-full">
          <div className="flex items-center rounded-full border-2 border-[#0056FF] bg-white px-3 py-1.5 shadow-xs">
            <Search className="size-3.5 text-[#0056FF]" />
            <input
              type="text"
              readOnly
              value="Filter records..."
              className="ml-2 w-full bg-transparent font-sans text-xs text-slate-800 outline-none"
            />
            <span className="rounded-md border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-500">
              ⌘K
            </span>
          </div>
        </div>
      );

    default:
      return null;
  }
}
