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
  /** Headings in document order. Each id must match an element id in the content. Depth sets the indent level and defaults to 0. */
  items: RailTocItem[];
  /** Scroll container to track and scroll within. Defaults to the window when omitted. */
  containerRef?: React.RefObject<HTMLElement | null>;
  /** Distance in pixels below the scroller's top edge where a heading counts as reached. Default: 100. */
  offset?: number;
  /** Horizontal step in pixels for each depth level. Default: 16. */
  indent?: number;
  /** Text above the list. It also names the navigation for screen readers. Default: "On this page". */
  title?: string;
  /** Extra classes merged onto the root nav. Inner parts carry data-slot attributes (rail-toc-title, -list, -plane). */
  className?: string;
  /** Active heading override for controlled mode. */
  activeId?: string;
  /** Callback fired when user clicks or scrolls into a heading. */
  onSelect?: (id: string) => void;
  /** Show flight waypoint progress badge (e.g. "3 / 8"). Default: false. */
  showProgress?: boolean;
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
  showProgress = false,
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
        coords.push({ x, y: 18 + coords.length * 36 });
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
      if (currentScroll > lastScrollYRef.current + 2) {
        setScrollDirection('down');
      } else if (currentScroll < lastScrollYRef.current - 2) {
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
    let targetAngle = 90; // Default: pointing straight down along rail

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

      // Position along Bézier curve
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

      // First derivative tangent vector for smooth rotation angle
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
      targetAngle = nextP.x > curP.x ? 70 : 110;
    }

    // When scrolling up, plane turns around 180° to point backward!
    if (scrollDirection === 'up') {
      targetAngle = (targetAngle + 180) % 360;
    }

    planeX.set(targetX);
    planeY.set(targetY);
    planeRotate.set(targetAngle);
  }, [activeProgress, nodeCoords, scrollDirection, planeX, planeY, planeRotate]);

  // Construct SVG rail paths
  const maxDepth = items.reduce((max, it) => Math.max(max, it.depth || 0), 0);
  const svgWidth = Math.max(64, startX + maxDepth * indent + 20);
  const svgHeight = nodeCoords.length > 0 ? nodeCoords[nodeCoords.length - 1].y + 16 : 300;

  // 1. Build full dashed route ahead
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

  // 2. Build solid traversed path connecting from origin seamlessly to plane current position
  const activeIntIdx = Math.min(Math.floor(activeProgress), nodeCoords.length - 1);
  const frac = activeProgress - activeIntIdx;
  let solidPathD = '';
  if (nodeCoords.length > 0) {
    solidPathD = `M ${nodeCoords[0].x} ${nodeCoords[0].y}`;
    // Fully completed segments
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

    // Active partial segment using de Casteljau cubic Bézier subdivision
    if (frac > 0 && activeIntIdx < nodeCoords.length - 1) {
      const p1 = nodeCoords[activeIntIdx];
      const p2 = nodeCoords[activeIntIdx + 1];
      const dy = p2.y - p1.y;
      const t = frac;

      const cp1x = p1.x;
      const cp1y = p1.y + dy * 0.45;
      const cp2x = p2.x;
      const cp2y = p2.y - dy * 0.45;

      const q0x = (1 - t) * p1.x + t * cp1x;
      const q0y = (1 - t) * p1.y + t * cp1y;
      const q1x = (1 - t) * cp1x + t * cp2x;
      const q1y = (1 - t) * cp1y + t * cp2y;
      const q2x = (1 - t) * cp2x + t * p2.x;
      const q2y = (1 - t) * cp2y + t * p2.y;

      const r0x = (1 - t) * q0x + t * q1x;
      const r0y = (1 - t) * q0y + t * q1y;

      const bx = (1 - t) * r0x + t * ((1 - t) * q1x + t * q2x);
      const by = (1 - t) * r0y + t * ((1 - t) * q1y + t * q2y);

      solidPathD += ` C ${q0x} ${q0y}, ${r0x} ${r0y}, ${bx} ${by}`;
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

  const activeIdx = items.findIndex((it) => it.id === activeId);
  const currentStep = activeIdx >= 0 ? activeIdx + 1 : 1;

  return (
    <nav
      ref={rootNavRef}
      aria-label={title}
      data-slot="rail-toc"
      className={cn('relative font-sans text-xs select-none', className)}
    >
      {/* Header with Title and Document Outline Icon (Exact Image 2 Style) */}
      <div
        data-slot="rail-toc-title"
        className="mb-3.5 flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5"
      >
        <div className="flex items-center gap-2">
          {/* 3-Line Document Outline Menu Icon (Exact Image 2 Reference) */}
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            className="size-3.5 text-slate-700"
            aria-hidden="true"
          >
            <line x1="2" y1="4" x2="14" y2="4" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="2" y1="8" x2="11" y2="8" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="2" y1="12" x2="7" y2="12" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span className="font-sans text-xs font-semibold tracking-tight text-slate-900">
            {title}
          </span>
        </div>

        {/* Optional Progress Badge */}
        {showProgress && (
          <div className="flex items-center gap-1 rounded-[4px] bg-[#EFF5FF] px-2 py-0.5 font-mono text-[10px] font-bold text-[#0056FF]">
            <span>{currentStep}</span>
            <span className="opacity-40">/</span>
            <span>{items.length}</span>
          </div>
        )}
      </div>

      {/* Rail Canvas & Headings Container */}
      <div className="relative">
        {/* SVG Rail Track Canvas */}
        <svg
          className="pointer-events-none absolute top-0 left-0"
          width={svgWidth}
          height={svgHeight}
          aria-hidden="true"
        >
          {/* 1. Full Dashed Flight Route Ahead (Light Gray Dash) */}
          {fullPathD && (
            <path
              d={fullPathD}
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="1.75"
              strokeDasharray="3 3.5"
              strokeLinecap="round"
            />
          )}

          {/* 2. Solid Traversed Track Behind Plane (Royal Blue #0056FF) */}
          {solidPathD && (
            <path
              d={solidPathD}
              fill="none"
              stroke="#0056FF"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* 3. Heading Node Markers (Exact Image 2 Circular Rings) */}
          {nodeCoords.map((coord, i) => {
            const isPassed = i <= activeIntIdx;
            const isCurrent = i === activeIdx;

            return (
              <g key={i}>
                {/* Node Ring: Fills in when passed, stays hollow ahead */}
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r={isCurrent ? 3.5 : 2.5}
                  fill={isPassed ? '#0056FF' : '#FFFFFF'}
                  stroke={isPassed ? '#0056FF' : '#CBD5E1'}
                  strokeWidth="1.5"
                  className="transition-all duration-200"
                />
              </g>
            );
          })}
        </svg>

        {/* 4. Flying Origami Paper Plane (Exact Image 2 Reference) */}
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
          {/* Origami Paper Plane Silhouette (Nose points right at 0deg) */}
          <svg
            viewBox="0 0 24 24"
            className="size-4.5 filter-[drop-shadow(0_1px_2px_rgba(0,86,255,0.3))]"
            fill="none"
            aria-hidden="true"
          >
            {/* Top / Port Wing (Illuminated Azure) */}
            <path
              d="M 22 12 L 2 3 L 7 12 Z"
              fill="#2277FF"
              stroke="#0056FF"
              strokeWidth="0.5"
              strokeLinejoin="round"
            />
            {/* Bottom / Starboard Wing (Primary Royal Blue) */}
            <path
              d="M 22 12 L 2 21 L 7 12 Z"
              fill="#0056FF"
              stroke="#003ECC"
              strokeWidth="0.5"
              strokeLinejoin="round"
            />
            {/* Crisp Center Spine Crease */}
            <line
              x1="2"
              y1="12"
              x2="22"
              y2="12"
              stroke="#FFFFFF"
              strokeWidth="0.75"
              strokeLinecap="round"
            />
          </svg>
        </motion.div>

        {/* 5. Headings Interactive List */}
        <ul data-slot="rail-toc-list" className="space-y-1">
          {items.map((item, idx) => {
            const isActive = item.id === activeId;
            const isPassed = idx <= activeIntIdx;
            const depth = item.depth || 0;
            const leftPadding = startX + depth * indent + 16;

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
                    'group flex w-full cursor-pointer items-center justify-between rounded-[4px] py-1.5 pr-2.5 text-left font-sans text-xs transition-all duration-150 select-none focus-visible:ring-2 focus-visible:ring-[#0056FF] focus-visible:outline-hidden',
                    isActive
                      ? 'bg-[#EFF5FF] font-bold text-[#0056FF]'
                      : isPassed
                        ? 'font-medium text-slate-800 hover:bg-slate-50'
                        : 'font-normal text-slate-500 hover:bg-slate-50 hover:text-slate-900',
                  )}
                >
                  <span className="flex-1 truncate leading-snug">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export default RailToc;
