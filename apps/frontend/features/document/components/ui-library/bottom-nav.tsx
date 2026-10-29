'use client';

import * as React from 'react';
import type { IconComponent } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface LibraryBottomNavItem {
  label: string;
  id: string;
  icon: IconComponent;
  badge?: number | string;
}

export interface LibraryBottomNavProps {
  items: LibraryBottomNavItem[];
  activeId: string;
  onSelect: (id: string) => void;
  className?: string;
}

export function LibraryBottomNav({ items, activeId, onSelect, className }: LibraryBottomNavProps) {
  return (
    <nav
      aria-label="Bottom Navigation Demo"
      className={cn(
        'flex h-16 w-full items-center justify-around rounded-2xl border border-slate-200/80 bg-white/90 px-2 text-slate-800 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),_0_2px_12px_rgba(0,0,0,0.03)] backdrop-blur-xl',
        className,
      )}
    >
      {items.slice(0, 5).map((item) => {
        const isActive = activeId === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={cn(
              'group relative flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-xl px-3.5 py-1 text-xs font-semibold transition-all select-none focus-visible:outline-none',
              isActive
                ? 'bg-[#0056FF] text-white shadow-[0_2px_8px_rgba(0,86,255,0.25)]'
                : 'text-slate-600 hover:bg-slate-100/60 hover:text-slate-900',
            )}
          >
            <div className="relative">
              <Icon className="size-5 shrink-0" />
              {item.badge !== undefined && (
                <span className="absolute -top-1 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="max-w-[64px] truncate text-[11px] leading-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
