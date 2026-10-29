'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TocHeadingItem {
  id: string;
  title: string;
  level?: 1 | 2 | 3;
}

interface LineTrackerTocProps {
  items: TocHeadingItem[];
  activeId: string;
  onSelect: (id: string) => void;
  title?: string;
}

export function LineTrackerToc({
  items,
  activeId,
  onSelect,
  title = 'ON THIS PAGE',
}: LineTrackerTocProps) {
  return (
    <div className="sticky top-24 space-y-3 font-sans text-xs">
      {/* Table of contents title */}
      <p className="font-mono text-[11px] font-bold tracking-wider text-[#A3B4F0] uppercase">
        {title}
      </p>

      {/* Cloudflare-inspired Track & Line Marker */}
      <div className="relative pl-3">
        {/* Continuous Background Vertical Line */}
        <div className="absolute top-1 bottom-1 left-0 w-[2px] rounded-full bg-[#0F357D]/50" />

        {/* Navigation list */}
        <nav className="space-y-1.5">
          {items.map((item) => {
            const isActive = activeId === item.id;
            const isSubItem = item.level === 2 || item.level === 3;

            return (
              <div key={item.id} className="group relative">
                {/* Active Sliding / Stationary Highlight Marker on the line */}
                {isActive && (
                  <span className="absolute top-1 bottom-1 -left-3 w-[2.5px] rounded-full bg-[#0056FF] shadow-[0_0_8px_rgba(0,86,255,0.6)]" />
                )}

                <button
                  type="button"
                  onClick={() => onSelect(item.id)}
                  className={cn(
                    'block w-full text-left transition-colors duration-150',
                    isSubItem ? 'pl-2 text-[11px]' : 'text-xs',
                    isActive ? 'font-bold text-[#0056FF]' : 'text-[#C4CEF8] hover:text-white',
                  )}
                >
                  <span className="truncate">{item.title}</span>
                </button>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
