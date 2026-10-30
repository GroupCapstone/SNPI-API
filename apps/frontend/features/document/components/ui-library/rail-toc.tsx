'use client';

import * as React from 'react';
import { motion, useSpring } from 'motion/react';
import { cn } from '@/lib/utils';

export interface RailTocItem {
  id: string;
  label: string;
  depth?: number;
}

export interface RailTocProps {
  /** Headings in document order. Each id must match an element id in the content. */
  items: RailTocItem[];
  /** Scroll container to track and scroll within. Defaults to window when omitted. */
  containerRef?: React.RefObject<HTMLElement | null>;
  /** Distance in pixels below scroller top edge where heading counts as reached. */
  offset?: number;
  /** Horizontal step in pixels for each depth level. Default: 16. */
  indent?: number;
  /** Text above the list and accessibility label. Default: "On this page". */
  title?: string;
  /** Extra classes merged onto root nav. */
  className?: string;
  /** Active heading override for controlled mode. */
  activeId?: string;
  /** Callback fired when user clicks or scrolls into a heading. */
  onSelect?: (id: string) => void;
}

/**
 * Rail TOC with a Paper Plane that flies along the indented rail.
 * Behind it is solid, passed headings fill in, ahead is dashed.
 * Turns around when scrolling up.
 */
export function RailToc({
  items,
  containerRef,
  offset = 100,
  indent = 16,
  title = 'On this page',
  className,
  activeId: controlledActiveId,
  onSelect,
}: RailTocProps) {
  const rootNavRef = React.useRef<HTMLElement>(null);
  const itemRefs = React.useRef<Map<string, HTMLButtonElement>>(new Map());

  // Internal active section tracking
  const [activeSectionId, setActiveSectionId] = React.useState<string>(items[0]?.id || '');
  const activeId = controlledActiveId !== undefined ? controlledActiveId : activeSectionId;

  // Track scroll direction: 'down' | 'up'
  const [scrollDirection, setScrollDirection] = React.useState<'down' | 'up'>('down');
  const lastScrollYRef = React.useRef<number>(0);

  // Position coordinates of all heading nodes
  const [nodeCoords, setNodeCoords] = React.useState<{ x: number; y: number }[]>([]);
  const [activeProgress, setActiveProgress] = React.useState<number>(0);

  // Spring animations for paper plane motion
  const startX = 14;
  const planeX = useSpring(startX, { stiffness: 350, damping: 28 });
  const planeY = useSpring(18, { stiffness: 350, damping: 28 });
  const planeRotate = useSpring(90, { stiffness: 300, damping: 24 });

  // Measure heading node positions within the TOC container
  const measureNodes = React.useCallback(() => {
    if (!rootNavRef.current) return;
    const coords: { x: number; y: number }[] = [];

    items.forEach((item) => {
      const btn = itemRefs.current.get(item.id);
      const depth = item.depth || 0;
      const x = startX + depth * indent;

      if (btn) {
        const y = btn.offsetTop + btn.offsetHeight / 2;
        coords.push({ x, y });
      } else {
        coords.push({ x, y: 18 + coords.length * 34 });
      }
    });

    setNodeCoords(coords);
  }, [items, indent, startX]);

  React.useEffect(() => {
    measureNodes();
    window.addEventListener('resize', measureNodes);
    return () => window.removeEventListener('resize', measureNodes);
  }, [measureNodes]);

  // Handle active heading detection and scroll-tracking
  React.useEffect(() => {
    const handleScroll = () => {
      let currentScroll = 0;
      if (containerRef && containerRef.current) {
        currentScroll = containerRef.current.scrollTop + offset;
      } else {
        currentScroll = window.scrollY + offset;
      }

      // Determine scroll direction
      if (currentScroll > lastScrollYRef.current) {
        setScrollDirection('down');
      } else if (currentScroll < lastScrollYRef.current) {
        setScrollDirection('up');
      }
      lastScrollYRef.current = currentScroll;

      // Detect active heading index and fractional progress
      let currentIdx = 0;
      let fractional = 0;

      const sectionPositions: { id: string; top: number }[] = [];
      items.forEach((item) => {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const top =
            containerRef && containerRef.current
              ? containerRef.current.scrollTop + rect.top
              : window.scrollY + rect.top;
          sectionPositions.push({ id: item.id, top });
        }
      });

      if (sectionPositions.length > 0) {
        if (currentScroll <= sectionPositions[0].top) {
          currentIdx = 0;
          fractional = 0;
        } else if (currentScroll >= sectionPositions[sectionPositions.length - 1].top) {
          currentIdx = sectionPositions.length - 1;
          fractional = 0;
        } else {
          for (let i = 0; i < sectionPositions.length - 1; i++) {
            const cur = sectionPositions[i];
            const next = sectionPositions[i + 1];
            if (currentScroll >= cur.top && currentScroll < next.top) {
              currentIdx = i;
              const span = next.top - cur.top;
              fractional = span > 0 ? (currentScroll - cur.top) / span : 0;
              break;
            }
          }
        }

        const newActiveId = sectionPositions[currentIdx]?.id;
        if (newActiveId && newActiveId !== activeId && controlledActiveId === undefined) {
          setActiveSectionId(newActiveId);
          onSelect?.(newActiveId);
        }
      } else {
        // Fallback when DOM elements are not rendered
        const idx = items.findIndex((it) => it.id === activeId);
        if (idx !== -1) currentIdx = idx;
      }

      setActiveProgress(currentIdx + fractional);
    };

    const targetEl = containerRef?.current || window;
    targetEl.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => targetEl.removeEventListener('scroll', handleScroll);
  }, [items, containerRef, offset, activeId, controlledActiveId, onSelect]);

  // Update animated plane position and rotation based on activeProgress & nodeCoords
  React.useEffect(() => {
    if (nodeCoords.length === 0) return;

    const baseIdx = Math.min(Math.floor(activeProgress), nodeCoords.length - 1);
    const frac = activeProgress - baseIdx;
    const curP = nodeCoords[baseIdx];
    const nextP = nodeCoords[Math.min(baseIdx + 1, nodeCoords.length - 1)];

    let targetX = curP.x;
    let targetY = curP.y;
    let targetAngle = 90; // Default facing downwards

    if (curP && nextP && frac > 0) {
      // Smooth S-curve interpolation between nodes
      const dy = nextP.y - curP.y;
      const t = frac;
      const invT = 1 - t;

      // Cubic Bézier control points
      const cp1x = curP.x;
      const cp1y = curP.y + dy * 0.45;
      const cp2x = nextP.x;
      const cp2y = nextP.y - dy * 0.45;

      // Position along Bézier
      targetX =
        invT * invT * invT * curP.x +
        3 * invT * invT * t * cp1x +
        3 * invT * t * t * cp2x +
        t * t * t * nextP.x;
      targetY =
        invT * invT * invT * curP.y +
        3 * invT * invT * t * cp1y +
        3 * invT * t * t * cp2y +
        t * t * t * nextP.y;

      // Tangent vector for rotation
      const dX =
        3 * invT * invT * (cp1x - curP.x) +
        6 * invT * t * (cp2x - cp1x) +
        3 * t * t * (nextP.x - cp2x);
      const dY =
        3 * invT * invT * (cp1y - curP.y) +
        6 * invT * t * (cp2y - cp1y) +
        3 * t * t * (nextP.y - cp2y);

      targetAngle = (Math.atan2(dY, dX) * 180) / Math.PI;
    } else if (curP && nextP && nextP.x !== curP.x) {
      targetAngle = nextP.x > curP.x ? 65 : 115;
    }

    // When scrolling up, the paper plane turns around!
    if (scrollDirection === 'up') {
      targetAngle = (targetAngle + 180) % 360;
    }

    planeX.set(targetX);
    planeY.set(targetY);
    planeRotate.set(targetAngle);
  }, [activeProgress, nodeCoords, scrollDirection, planeX, planeY, planeRotate]);

  // Construct SVG paths
  const svgWidth = Math.max(50, startX + 3 * indent + 10);
  const svgHeight = nodeCoords.length > 0 ? nodeCoords[nodeCoords.length - 1].y + 16 : 300;

  // Build full dashed path
  let fullPathD = '';
  if (nodeCoords.length > 0) {
    fullPathD = `M ${nodeCoords[0].x} ${nodeCoords[0].y}`;
    for (let i = 0; i < nodeCoords.length - 1; i++) {
      const p1 = nodeCoords[i];
      const p2 = nodeCoords[i + 1];
      if (p1.x === p2.x) {
        fullPathD += ` L ${p2.x} ${p2.y}`;
      } else {
        const dy = p2.y - p1.y;
        fullPathD += ` C ${p1.x} ${p1.y + dy * 0.45}, ${p2.x} ${p2.y - dy * 0.45}, ${p2.x} ${p2.y}`;
      }
    }
  }

  // Build solid path behind the active position
  const activeIntIdx = Math.min(Math.floor(activeProgress), nodeCoords.length - 1);
  let solidPathD = '';
  if (nodeCoords.length > 0) {
    solidPathD = `M ${nodeCoords[0].x} ${nodeCoords[0].y}`;
    for (let i = 0; i < activeIntIdx; i++) {
      const p1 = nodeCoords[i];
      const p2 = nodeCoords[i + 1];
      if (p1.x === p2.x) {
        solidPathD += ` L ${p2.x} ${p2.y}`;
      } else {
        const dy = p2.y - p1.y;
        solidPathD += ` C ${p1.x} ${p1.y + dy * 0.45}, ${p2.x} ${p2.y - dy * 0.45}, ${p2.x} ${p2.y}`;
      }
    }
  }

  const handleHeadingClick = (id: string) => {
    setActiveSectionId(id);
    onSelect?.(id);

    const el = document.getElementById(id);
    if (!el) return;

    if (containerRef && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const targetScroll = containerRef.current.scrollTop + elRect.top - containerRect.top - offset;
      containerRef.current.scrollTo({ top: targetScroll, behavior: 'smooth' });
    } else {
      const elTop = window.scrollY + el.getBoundingClientRect().top - offset;
      window.scrollTo({ top: elTop, behavior: 'smooth' });
    }
  };

  return (
    <nav
      ref={rootNavRef}
      aria-label={title}
      data-slot="rail-toc"
      className={cn('relative font-sans text-xs select-none', className)}
    >
      {/* Title */}
      <div data-slot="rail-toc-title" className="mb-3 flex items-center gap-2">
        {/* Modern 3-line hamburger menu icon */}
        <svg
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className="size-3.5 text-slate-500"
          aria-hidden="true"
        >
          <path d="M2 4h12M2 8h12M2 12h12" strokeLinecap="round" />
        </svg>
        <span className="font-sans text-xs font-semibold text-slate-700 dark:text-slate-200">
          {title}
        </span>
      </div>

      {/* Rail & Headings Container */}
      <div className="relative">
        {/* SVG Rail Track Canvas */}
        <svg
          className="pointer-events-none absolute top-0 left-0"
          width={svgWidth}
          height={svgHeight}
          aria-hidden="true"
        >
          {/* 1. Full Dashed Background Path (The rail ahead) */}
          {fullPathD && (
            <path
              d={fullPathD}
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="1.5"
              strokeDasharray="2 3"
              className="dark:stroke-slate-700"
            />
          )}

          {/* 2. Solid Path Behind Paper Plane */}
          {solidPathD && (
            <path
              d={solidPathD}
              fill="none"
              stroke="#0056FF"
              strokeWidth="1.8"
              className="dark:stroke-[#3B82F6]"
            />
          )}

          {/* 3. Heading Node Circles */}
          {nodeCoords.map((coord, i) => {
            const isPassed = i <= activeIntIdx;
            return (
              <circle
                key={i}
                cx={coord.x}
                cy={coord.y}
                r="3"
                className={cn(
                  'transition-all duration-200',
                  isPassed
                    ? 'fill-[#0056FF] stroke-[#0056FF] dark:fill-[#3B82F6] dark:stroke-[#3B82F6]'
                    : 'fill-white stroke-slate-400 dark:fill-[#0B0F19] dark:stroke-slate-600',
                )}
                strokeWidth="1.5"
              />
            );
          })}
        </svg>

        {/* 4. Flying Paper Plane with Spring Physics */}
        <motion.div
          data-slot="rail-toc-plane"
          className="pointer-events-none absolute z-20"
          style={{
            x: planeX,
            y: planeY,
            rotate: planeRotate,
            translateX: '-50%',
            translateY: '-50%',
          }}
          aria-hidden="true"
        >
          {/* Origami Paper Plane Silhouette pointing in flight direction */}
          <svg
            viewBox="0 0 24 24"
            className="size-4 -rotate-90 fill-slate-900 drop-shadow-xs dark:fill-white"
            aria-hidden="true"
          >
            {/* Standard folded paper airplane */}
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </motion.div>

        {/* 5. Headings Interactive List */}
        <ul data-slot="rail-toc-list" className="space-y-0.5">
          {items.map((item, idx) => {
            const isActive = item.id === activeId;
            const isPassed = idx <= activeIntIdx;
            const depth = item.depth || 0;
            const leftPadding = startX + depth * indent + 14;

            return (
              <li key={item.id} className="relative">
                <button
                  ref={(el) => {
                    if (el) itemRefs.current.set(item.id, el);
                    else itemRefs.current.delete(item.id);
                  }}
                  type="button"
                  onClick={() => handleHeadingClick(item.id)}
                  style={{ paddingLeft: `${leftPadding}px` }}
                  className={cn(
                    'block w-full cursor-pointer py-1.5 text-left font-sans text-xs transition-colors duration-150 select-none',
                    isActive
                      ? 'font-bold text-slate-950 dark:text-white'
                      : isPassed
                        ? 'font-medium text-slate-800 dark:text-slate-300'
                        : 'font-normal text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200',
                  )}
                >
                  <span className="leading-snug">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
