'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface RadiantHubNode {
  id: string;
  label: string;
  sublabel?: string;
  icon?: React.ReactNode;
  tag?: string;
  badge?: string;
  tooltip?: string;
}

export interface RadiantIntegrationHubProps {
  center?: {
    title?: string;
    subtitle?: string;
    icon?: React.ReactNode;
    badge?: string;
  };
  leftNodes: RadiantHubNode[];
  rightNodes: RadiantHubNode[];
  activeNodeId?: string;
  onSelectNode?: (id: string) => void;
  className?: string;
}

// 6 Kinetic Brand Card Visual Styles (Exact Archetype from Status Page 404 Mode 5)
const CARD_PALETTE = [
  // 0: Soft Ice Tint
  {
    bg: 'bg-[#EFF5FF]',
    border: 'border-2 border-[#CAD3F5]',
    text: 'text-[#0056FF]',
    accent: '#0056FF',
    subtext: 'text-blue-500',
    tag: 'BÉZIER SPEC',
    height: 'h-44 sm:h-48',
    width: 'w-32 sm:w-36',
    tumbledRotate: -7.5,
    tumbledY: 10,
    shadow: 'shadow-[0_12px_28px_rgba(0,86,255,0.14)]',
  },
  // 1: Solid Brand Royal Blue
  {
    bg: 'bg-[#0056FF]',
    border: 'border-none',
    text: 'text-white',
    accent: '#FFFFFF',
    subtext: 'text-blue-200',
    tag: 'SYSTEM CORE',
    height: 'h-48 sm:h-52',
    width: 'w-34 sm:w-38',
    tumbledRotate: -3.5,
    tumbledY: -2,
    shadow: 'shadow-[0_16px_36px_rgba(0,86,255,0.25)]',
  },
  // 2: Signal / Sunny Yellow (Center Elevated Card)
  {
    bg: 'bg-[#FACC15]',
    border: 'border-none',
    text: 'text-[#0A1A4A]',
    accent: '#0A1A4A',
    subtext: 'text-amber-950/70',
    tag: 'TOKEN SPEC',
    height: 'h-52 sm:h-56',
    width: 'w-36 sm:w-40',
    tumbledRotate: 0.5,
    tumbledY: -12,
    shadow: 'shadow-[0_18px_38px_rgba(250,204,21,0.3)]',
  },
  // 3: Solid Interactive Azure Blue
  {
    bg: 'bg-[#2277FF]',
    border: 'border-none',
    text: 'text-white',
    accent: '#FFFFFF',
    subtext: 'text-sky-100',
    tag: 'LAYOUT MESH',
    height: 'h-46 sm:h-50',
    width: 'w-34 sm:w-38',
    tumbledRotate: 4.5,
    tumbledY: 4,
    shadow: 'shadow-[0_16px_36px_rgba(34,119,255,0.25)]',
  },
  // 4: Mint Emerald
  {
    bg: 'bg-[#10B981]',
    border: 'border-none',
    text: 'text-white',
    accent: '#FFFFFF',
    subtext: 'text-emerald-100',
    tag: 'ACTION SPEC',
    height: 'h-44 sm:h-48',
    width: 'w-32 sm:w-36',
    tumbledRotate: 8,
    tumbledY: 10,
    shadow: 'shadow-[0_14px_30px_rgba(16,185,129,0.25)]',
  },
  // 5: Soft Lavender / White Mesh
  {
    bg: 'bg-[#F8FAFC]',
    border: 'border-2 border-[#CAD3F5]',
    text: 'text-[#0056FF]',
    accent: '#0056FF',
    subtext: 'text-slate-500',
    tag: 'INTELLIGENCE',
    height: 'h-46 sm:h-50',
    width: 'w-32 sm:w-36',
    tumbledRotate: 11.5,
    tumbledY: 16,
    shadow: 'shadow-[0_12px_28px_rgba(10,26,74,0.1)]',
  },
];

/**
 * RadiantIntegrationHub (Kinetic Tumbled Cards Archetype)
 * Minimalist, zero-icon kinetic brand cards:
 * - Zero top buttons, zero header title row, zero bottom active-module bar.
 * - Zero icons inside the cards; minimal high-impact typography only.
 * - Staggered heights, organic gravity tilts, and smooth spring elevation on hover/active.
 * - Stable in-place state with zero section scrolling or page jumping.
 */
export function RadiantIntegrationHub({
  leftNodes,
  rightNodes,
  activeNodeId,
  onSelectNode,
  className,
}: RadiantIntegrationHubProps) {
  const allNodes: RadiantHubNode[] = React.useMemo(() => {
    return [...leftNodes, ...rightNodes].slice(0, 6);
  }, [leftNodes, rightNodes]);

  const [internalActiveId, setInternalActiveId] = React.useState<string>(
    activeNodeId || allNodes[0]?.id || '',
  );
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (activeNodeId) {
      setInternalActiveId(activeNodeId);
    }
  }, [activeNodeId]);

  const activeIdx = Math.max(
    0,
    allNodes.findIndex((n) => n.id === internalActiveId),
  );

  const handleSelect = (idx: number) => {
    const node = allNodes[idx];
    if (node) {
      setInternalActiveId(node.id);
      onSelectNode?.(node.id);
    }
  };

  return (
    <div className={cn('relative w-full py-2 select-none', className)}>
      {/* =================================================================== */}
      {/* DESKTOP: 6 KINETIC TUMBLED CARDS (ZERO ICONS, MINIMAL TEXT)         */}
      {/* =================================================================== */}
      <div className="relative hidden h-64 w-full items-end justify-center gap-3 overflow-visible pb-2 select-none md:flex">
        {allNodes.map((node, idx) => {
          const isActive = idx === activeIdx;
          const isHovered = idx === hoveredIdx;
          const isElevated = isActive || isHovered;
          const style = CARD_PALETTE[idx % CARD_PALETTE.length];

          // Kinetic animation parameters matching the reference archetype
          const targetY = isElevated ? -24 : style.tumbledY;
          const targetRotate = isElevated ? 0 : style.tumbledRotate;
          const targetScale = isElevated ? 1.07 : 1;
          const targetZ = isElevated ? 30 : 10 + idx;

          return (
            <motion.div
              key={node.id}
              onClick={() => handleSelect(idx)}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              animate={{
                y: targetY,
                rotate: targetRotate,
                scale: targetScale,
                zIndex: targetZ,
              }}
              transition={{
                type: 'spring',
                stiffness: 340,
                damping: 22,
              }}
              style={{
                transformOrigin: 'bottom center',
              }}
              className={cn(
                'relative flex shrink-0 cursor-pointer flex-col justify-between rounded-2xl p-4 transition-shadow duration-200',
                style.width,
                style.height,
                style.bg,
                style.border,
                style.text,
                isElevated ? style.shadow : 'shadow-xs',
              )}
            >
              {/* Top: Minimal Category Tag & Pulse Dot */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold tracking-wider uppercase opacity-85">
                  0{idx + 1}
                </span>
                {isActive && <span className="flex size-2 animate-pulse rounded-full bg-current" />}
              </div>

              {/* Center: Clean Bold Title (ZERO ICONS) */}
              <div className="my-auto flex flex-col items-center justify-center py-2">
                <span className="text-center font-sans text-base leading-tight font-black tracking-tight sm:text-lg">
                  {node.label}
                </span>
              </div>

              {/* Bottom: Minimal Code / Badge */}
              <div className="flex items-center justify-between font-mono text-[9px] tracking-wider uppercase">
                <span className={style.subtext}>{node.badge || 'MOD 0' + (idx + 1)}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* =================================================================== */}
      {/* MOBILE: RESPONSIVE HORIZONTAL TOUCH DECK                            */}
      {/* =================================================================== */}
      <div className="no-scrollbar flex w-full snap-x gap-3 overflow-x-auto px-3 pt-2 pb-4 select-none md:hidden">
        {allNodes.map((node, idx) => {
          const isActive = idx === activeIdx;
          const style = CARD_PALETTE[idx % CARD_PALETTE.length];

          return (
            <motion.div
              key={node.id}
              onClick={() => handleSelect(idx)}
              whileTap={{ scale: 0.94 }}
              className={cn(
                'relative flex h-42 w-30 shrink-0 cursor-pointer snap-center flex-col justify-between rounded-2xl p-3.5 transition-all',
                style.bg,
                style.border,
                style.text,
                isActive ? style.shadow + ' ring-2 ring-current' : 'shadow-xs',
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] font-bold tracking-wider uppercase opacity-85">
                  0{idx + 1}
                </span>
                {isActive && (
                  <span className="flex size-1.5 animate-pulse rounded-full bg-current" />
                )}
              </div>

              <div className="my-auto flex flex-col items-center justify-center py-1">
                <span className="text-center font-sans text-sm leading-tight font-black tracking-tight">
                  {node.label}
                </span>
              </div>

              <div className="flex items-center justify-between font-mono text-[8px] tracking-wider uppercase">
                <span className={style.subtext}>{node.badge || 'MOD 0' + (idx + 1)}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
