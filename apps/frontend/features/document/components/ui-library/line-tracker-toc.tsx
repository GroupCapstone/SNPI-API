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
  onActiveChange?: (id: string) => void;
  title?: string;
  className?: string;
}

export function LineTrackerToc({
  items,
  activeId,
  onSelect,
  onActiveChange,
  title = 'ON THIS PAGE',
  className,
}: LineTrackerTocProps) {
  const navRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());
  const rafIdRef = React.useRef<number | null>(null);
  const onActiveChangeRef = React.useRef(onActiveChange);

  React.useEffect(() => {
    onActiveChangeRef.current = onActiveChange;
  }, [onActiveChange]);

  // Real-time interpolated vertical tracker progress
  const [trackerState, setTrackerState] = React.useState<{
    height: number;
    indicatorTop: number;
    isReady: boolean;
  }>({
    height: 0,
    indicatorTop: 0,
    isReady: false,
  });

  // Calculate real-time scroll loading progress
  React.useEffect(() => {
    const computeProgress = () => {
      if (!navRef.current || items.length === 0) return;

      // Collect bounding positions using real absolute page coordinates
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
          setTrackerState({ height: center, indicatorTop: center - 8, isReady: true });
        }
        return;
      }

      // Viewport target offset: 140px below the ceiling sticky header
      const currentScroll = window.scrollY + 140;

      let activeIdx = 0;
      let segmentProgress = 0;

      if (currentScroll <= sectionMetrics[0].top) {
        activeIdx = 0;
        segmentProgress = 0;
      } else if (currentScroll >= sectionMetrics[sectionMetrics.length - 1].top) {
        activeIdx = sectionMetrics.length - 1;
        segmentProgress = 1;
      } else {
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

      // Sync active section in real-time
      const detectedActiveId = items[activeIdx]?.id;
      if (detectedActiveId && onActiveChangeRef.current) {
        onActiveChangeRef.current(detectedActiveId);
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
          indicatorTop: Math.max(0, targetCenter - 8),
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
    <div className={cn('sticky top-24 space-y-3 font-sans text-xs select-none', className)}>
      {/* Title */}
      <p className="font-mono text-[11px] font-bold tracking-wider text-slate-400 uppercase">
        {title}
      </p>

      {/* Real-time Dynamic Scroll Loading Tracker Rail */}
      <div ref={navRef} className="relative pl-3">
        {/* Continuous Light Gray Background Rail (Sleek 1.5px) */}
        <div className="absolute top-1 bottom-1 left-0 w-[1.5px] rounded-full bg-slate-200/80" />

        {/* Real-time Blue Progress Fill Line (Loads as user scrolls down) */}
        {trackerState.isReady && (
          <div
            className="absolute top-1 left-0 w-[1.5px] rounded-full bg-[#0056FF] transition-[height] duration-75 ease-out"
            style={{
              height: `${Math.max(0, trackerState.height)}px`,
            }}
          />
        )}

        {/* Real-time Sleek Active Bar Indicator (Sleek 2px vertical bar beside active item) */}
        {trackerState.isReady && (
          <div
            className="pointer-events-none absolute -left-[0.25px] h-4 w-[2px] rounded-full bg-[#0056FF] transition-transform duration-75 ease-out"
            style={{
              top: 0,
              transform: `translateY(${Math.max(0, trackerState.indicatorTop)}px)`,
            }}
          />
        )}

        {/* Headings Navigation List */}
        <nav className="space-y-1.5">
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
                  'flex w-full items-start py-0.5 text-left transition-colors duration-150 select-none',
                  isSubItem ? 'pl-2 text-[10.5px]' : 'text-[11.5px]',
                  isActive
                    ? 'font-bold text-[#0056FF]'
                    : 'font-medium text-slate-600 hover:text-slate-950',
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
