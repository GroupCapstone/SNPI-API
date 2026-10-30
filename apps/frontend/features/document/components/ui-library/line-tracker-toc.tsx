'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TocHeadingItem {
  id: string;
  title: string;
  level?: 1 | 2 | 3;
}

export interface LineTrackerTocProps {
  items: TocHeadingItem[];
  activeId: string;
  onSelect: (id: string) => void;
  title?: string;
  className?: string;
}

export function LineTrackerToc({
  items,
  activeId,
  onSelect,
  title = 'ON THIS PAGE',
  className,
}: LineTrackerTocProps) {
  const navRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());
  const rafIdRef = React.useRef<number | null>(null);

  // Real-time interpolated vertical tracker progress
  const [trackerState, setTrackerState] = React.useState<{
    height: number;
    pipTop: number;
    isReady: boolean;
  }>({
    height: 0,
    pipTop: 0,
    isReady: false,
  });

  // Calculate real-time scroll loading progress
  React.useEffect(() => {
    const computeProgress = () => {
      if (!navRef.current || items.length === 0) return;

      // Collect bounding positions of the section elements
      const sectionMetrics: { id: string; top: number; bottom: number }[] = [];
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const top = window.scrollY + rect.top;
          sectionMetrics.push({ id: item.id, top, bottom: top + rect.height });
        }
      }

      // If page sections are not rendered in the DOM yet, fallback to activeId button
      if (sectionMetrics.length === 0) {
        const activeBtn = itemRefs.current.get(activeId);
        if (activeBtn) {
          const center = activeBtn.offsetTop + activeBtn.offsetHeight / 2;
          setTrackerState({ height: center, pipTop: center, isReady: true });
        }
        return;
      }

      // Viewport target offset: 140px below the ceiling sticky header
      const currentScroll = window.scrollY + 140;

      let activeIdx = 0;
      let segmentProgress = 0;

      if (currentScroll <= sectionMetrics[0].top) {
        // Before or at first section
        activeIdx = 0;
        segmentProgress = 0;
      } else if (currentScroll >= sectionMetrics[sectionMetrics.length - 1].top) {
        // At or past the final section
        activeIdx = sectionMetrics.length - 1;
        segmentProgress = 1;
      } else {
        // Between section i and section i + 1
        for (let i = 0; i < sectionMetrics.length - 1; i++) {
          const cur = sectionMetrics[i];
          const next = sectionMetrics[i + 1];

          if (currentScroll >= cur.top && currentScroll < next.top) {
            activeIdx = i;
            const distance = next.top - cur.top;
            segmentProgress = distance > 0 ? (currentScroll - cur.top) / distance : 0;
            break;
          }
        }
      }

      // Map segment progress to the TOC button vertical positions
      const curBtn = itemRefs.current.get(items[activeIdx]?.id);
      const nextBtn = itemRefs.current.get(items[activeIdx + 1]?.id);

      if (curBtn) {
        const curCenter = curBtn.offsetTop + curBtn.offsetHeight / 2;
        let targetCenter = curCenter;

        if (nextBtn && segmentProgress > 0) {
          const nextCenter = nextBtn.offsetTop + nextBtn.offsetHeight / 2;
          targetCenter = curCenter + segmentProgress * (nextCenter - curCenter);
        }

        setTrackerState({
          height: Math.max(0, targetCenter),
          pipTop: Math.max(0, targetCenter),
          isReady: true,
        });
      }
    };

    const handleScroll = () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      rafIdRef.current = requestAnimationFrame(computeProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    computeProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [items, activeId]);

  return (
    <div className={cn('sticky top-24 space-y-3 font-sans text-xs', className)}>
      {/* Title */}
      <p className="font-mono text-[11px] font-bold tracking-wider text-slate-400 uppercase">
        {title}
      </p>

      {/* Real-time Dynamic Scroll Loading Tracker Rail */}
      <div ref={navRef} className="relative pl-3.5">
        {/* Continuous Light Gray Background Rail */}
        <div className="absolute top-1.5 bottom-1.5 left-0 w-[2px] rounded-full bg-slate-200" />

        {/* Real-time Blue Progress Fill Line (Loads as user scrolls down) */}
        {trackerState.isReady && (
          <div
            className="absolute top-1.5 left-0 w-[2px] rounded-full bg-[#0056FF] transition-[height] duration-75 ease-out"
            style={{
              height: `${Math.max(0, trackerState.height - 6)}px`,
            }}
          />
        )}

        {/* Real-time Sliding Indicator Pip */}
        {trackerState.isReady && (
          <div
            className="pointer-events-none absolute -left-[4px] size-2.5 rounded-full bg-[#0056FF] shadow-xs ring-2 ring-white transition-transform duration-75 ease-out"
            style={{
              top: 0,
              transform: `translateY(${Math.max(0, trackerState.pipTop - 5)}px)`,
            }}
          />
        )}

        {/* Headings Navigation List */}
        <nav className="space-y-2">
          {items.map((item) => {
            const isActive = activeId === item.id;
            const isSubItem = item.level === 2 || item.level === 3;

            return (
              <button
                key={item.id}
                ref={(el) => {
                  if (el) itemRefs.current.set(item.id, el);
                  else itemRefs.current.delete(item.id);
                }}
                type="button"
                onClick={() => onSelect(item.id)}
                className={cn(
                  'flex w-full items-start text-left transition-colors duration-150 select-none',
                  isSubItem ? 'pl-2 text-[11px]' : 'text-xs',
                  isActive ? 'font-bold text-[#0056FF]' : 'text-slate-600 hover:text-slate-950',
                )}
              >
                <span className="leading-snug">{item.title}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
