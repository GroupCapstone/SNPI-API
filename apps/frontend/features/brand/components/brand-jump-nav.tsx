'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface JumpSectionItem {
  id: string;
  label: string;
}

export const JUMP_SECTIONS: JumpSectionItem[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'events', label: 'Events' },
  { id: 'templates', label: 'Templates' },
  { id: 'ads-marketing', label: 'Ads & Marketing' },
  { id: 'writing', label: 'Writing' },
  { id: 'for-red-hatters', label: 'For Red Hatters' },
  { id: 'for-creatives', label: 'For Creatives' },
  { id: 'for-press', label: 'For The Press' },
  { id: 'foundations', label: 'Foundations' },
  { id: 'logos', label: 'Logos' },
  { id: 'design-language', label: 'Design Language' },
  { id: 'handbooks', label: 'Handbooks' },
  { id: 'resources', label: 'Resources' },
  { id: 'whats-new', label: "What's New" },
];

export function BrandJumpNav({
  activeSection = 'featured',
  onSelect,
  className,
}: {
  activeSection?: string;
  onSelect?: (id: string) => void;
  className?: string;
}) {
  const [active, setActive] = React.useState(activeSection);

  const handleClick = (id: string) => {
    setActive(id);
    onSelect?.(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div
      className={cn(
        'sticky top-[68px] z-40 w-full border-b border-[#CAD3F5] bg-white/95 backdrop-blur-md',
        className,
      )}
    >
      <div className="mx-auto flex max-w-[1560px] items-center gap-2 overflow-x-auto px-4 py-2.5 sm:px-6 lg:px-8">
        <span className="shrink-0 font-mono text-[11px] font-bold text-slate-500 uppercase">
          Jump to section:
        </span>
        <div className="flex items-center gap-1.5">
          {JUMP_SECTIONS.map((sec) => {
            const isCurrent = active === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => handleClick(sec.id)}
                className={cn(
                  'shrink-0 rounded-[4px] px-3 py-1 font-sans text-xs font-bold transition-all duration-150',
                  isCurrent
                    ? 'bg-[#0056FF] text-white shadow-2xs'
                    : 'bg-[#E3E7FC]/40 text-slate-800 hover:bg-[#E3E7FC] hover:text-[#0056FF]',
                )}
              >
                {sec.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
