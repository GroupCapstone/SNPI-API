'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface RadiantHubNode {
  id: string;
  label: string;
  sublabel?: string;
  icon: React.ReactNode;
  tag?: string;
  badge?: string;
}

export interface RadiantIntegrationHubProps {
  center: {
    title: string;
    subtitle?: string;
    icon: React.ReactNode;
    badge?: string;
  };
  leftNodes: RadiantHubNode[];
  rightNodes: RadiantHubNode[];
  activeNodeId?: string;
  onSelectNode?: (id: string) => void;
  className?: string;
}

/**
 * RadiantIntegrationHub
 * Implements the radiant curved-line integration node network (Image 1 reference).
 * Features a central circular hub connecting via smooth S-curve cubic beziers to
 * 6 circular satellite nodes (3 on the left, 3 on the right) with live interactive state.
 */
export function RadiantIntegrationHub({
  center,
  leftNodes,
  rightNodes,
  activeNodeId,
  onSelectNode,
  className,
}: RadiantIntegrationHubProps) {
  const [hoveredNodeId, setHoveredNodeId] = React.useState<string | null>(null);

  // Default active to first left node if not provided
  const currentActiveId = activeNodeId || leftNodes[0]?.id || '';

  // 6 Node Coordinates in 900x320 SVG canvas:
  // Center: (450, 160), Radius: 48
  // Left Column: X=120, Nodes at Y=50, 160, 270 (Radius: 28)
  // Right Column: X=780, Nodes at Y=50, 160, 270 (Radius: 28)
  const leftPaths = [
    { id: leftNodes[0]?.id, d: 'M 402 160 C 310 160, 230 50, 148 50', endX: 120, endY: 50 },
    { id: leftNodes[1]?.id, d: 'M 402 160 L 148 160', endX: 120, endY: 160 },
    { id: leftNodes[2]?.id, d: 'M 402 160 C 310 160, 230 270, 148 270', endX: 120, endY: 270 },
  ];

  const rightPaths = [
    { id: rightNodes[0]?.id, d: 'M 498 160 C 590 160, 670 50, 752 50', endX: 780, endY: 50 },
    { id: rightNodes[1]?.id, d: 'M 498 160 L 752 160', endX: 780, endY: 160 },
    { id: rightNodes[2]?.id, d: 'M 498 160 C 590 160, 670 270, 752 270', endX: 780, endY: 270 },
  ];

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-3xl border border-[#CAD3F5] bg-gradient-to-b from-white via-[#EFF5FF]/40 to-white p-4 shadow-xs sm:p-8',
        className,
      )}
    >
      {/* Subtle Dot Grid Canvas Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.25]"
        style={{
          backgroundImage:
            'radial-gradient(#0056FF 0.75px, transparent 0.75px), radial-gradient(#0056FF 0.75px, #FFFFFF 0.75px)',
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
        }}
      />

      {/* =================================================================== */}
      {/* DESKTOP & TABLET: RADIANT CURVED S-BEZIER INTEGRATION CANVAS       */}
      {/* =================================================================== */}
      <div className="relative mx-auto hidden h-[340px] w-full max-w-4xl select-none md:block">
        {/* SVG Curved Vector Connectors Layer */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 900 320"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="hubGradientLeft" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#CAD3F5" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0056FF" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="hubGradientRight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0056FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#CAD3F5" stopOpacity="0.8" />
            </linearGradient>
            <filter id="hubGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Left Connectors */}
          {leftPaths.map((p, idx) => {
            const isHighlighted = hoveredNodeId === p.id || currentActiveId === p.id;
            return (
              <g key={`left-path-${idx}`}>
                {/* Base curve */}
                <path
                  d={p.d}
                  stroke={isHighlighted ? '#0056FF' : '#CAD3F5'}
                  strokeWidth={isHighlighted ? 2.5 : 1.75}
                  strokeDasharray={isHighlighted ? undefined : '5 5'}
                  className="transition-all duration-300"
                />
                {/* Active pulse highlight curve */}
                {isHighlighted && (
                  <path
                    d={p.d}
                    stroke="#2277FF"
                    strokeWidth={3}
                    filter="url(#hubGlow)"
                    opacity={0.6}
                  />
                )}
              </g>
            );
          })}

          {/* Right Connectors */}
          {rightPaths.map((p, idx) => {
            const isHighlighted = hoveredNodeId === p.id || currentActiveId === p.id;
            return (
              <g key={`right-path-${idx}`}>
                {/* Base curve */}
                <path
                  d={p.d}
                  stroke={isHighlighted ? '#0056FF' : '#CAD3F5'}
                  strokeWidth={isHighlighted ? 2.5 : 1.75}
                  strokeDasharray={isHighlighted ? undefined : '5 5'}
                  className="transition-all duration-300"
                />
                {/* Active pulse highlight curve */}
                {isHighlighted && (
                  <path
                    d={p.d}
                    stroke="#2277FF"
                    strokeWidth={3}
                    filter="url(#hubGlow)"
                    opacity={0.6}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Central Circular Hub Node */}
        <div className="absolute top-1/2 left-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
          <div className="group relative flex size-24 items-center justify-center rounded-full border-2 border-[#CAD3F5] bg-white p-2 shadow-[0_8px_30px_rgba(0,86,255,0.12)] transition-all duration-300 hover:scale-105 hover:border-[#0056FF] lg:size-28">
            {/* Center Circular Glow Background */}
            <div className="absolute inset-1.5 rounded-full bg-gradient-to-br from-[#EFF5FF] to-[#E3E7FC]/60" />
            <div className="relative z-10 flex size-14 items-center justify-center rounded-full border border-[#CAD3F5] bg-white text-[#0056FF] shadow-2xs transition-transform duration-300 group-hover:scale-110 lg:size-16">
              {center.icon}
            </div>

            {/* Pulse Live Beacon */}
            <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-emerald-100 ring-2 ring-white">
              <span className="size-2 rounded-full bg-emerald-500" />
            </span>
          </div>

          {/* Hub Title Label */}
          <div className="mt-3 flex flex-col items-center text-center">
            <span className="font-mono text-xs font-black tracking-wider text-[#0A1A4A] uppercase">
              {center.title}
            </span>
            {center.subtitle && (
              <span className="font-mono text-[10px] font-semibold text-[#0056FF]">
                {center.subtitle}
              </span>
            )}
          </div>
        </div>

        {/* 3 Left Circular Nodes */}
        <div className="absolute top-0 bottom-0 left-4 z-20 flex w-48 flex-col justify-between py-2 lg:left-8">
          {leftNodes.slice(0, 3).map((node) => {
            const isActive = currentActiveId === node.id;
            const isHovered = hoveredNodeId === node.id;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => onSelectNode?.(node.id)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                className="group flex cursor-pointer items-center gap-3 text-left focus:outline-none"
              >
                <div
                  className={cn(
                    'relative flex size-14 shrink-0 items-center justify-center rounded-full border bg-white shadow-[0_4px_16px_rgba(0,86,255,0.08)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_8px_24px_rgba(0,86,255,0.18)] lg:size-16',
                    isActive || isHovered
                      ? 'border-[#0056FF] ring-4 ring-[#0056FF]/15'
                      : 'border-[#CAD3F5] hover:border-[#0056FF]/60',
                  )}
                >
                  <div
                    className={cn(
                      'flex size-10 items-center justify-center rounded-full transition-colors lg:size-11',
                      isActive || isHovered
                        ? 'bg-[#0056FF] text-white'
                        : 'bg-[#EFF5FF] text-[#0056FF] group-hover:bg-[#E3E7FC]',
                    )}
                  >
                    {node.icon}
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[9px] font-bold text-[#0056FF] uppercase">
                      {node.tag || 'Service'}
                    </span>
                    {node.badge && (
                      <span className="rounded bg-[#E3E7FC] px-1 py-0.2 font-mono text-[8px] font-bold text-[#0056FF]">
                        {node.badge}
                      </span>
                    )}
                  </div>
                  <span
                    className={cn(
                      'block truncate text-xs font-bold transition-colors',
                      isActive ? 'text-[#0056FF]' : 'text-[#0A1A4A] group-hover:text-[#0056FF]',
                    )}
                  >
                    {node.label}
                  </span>
                  {node.sublabel && (
                    <span className="block truncate font-mono text-[10px] text-slate-500">
                      {node.sublabel}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* 3 Right Circular Nodes */}
        <div className="absolute top-0 right-4 bottom-0 z-20 flex w-48 flex-col justify-between py-2 lg:right-8">
          {rightNodes.slice(0, 3).map((node) => {
            const isActive = currentActiveId === node.id;
            const isHovered = hoveredNodeId === node.id;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => onSelectNode?.(node.id)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                className="group flex cursor-pointer flex-row-reverse items-center gap-3 text-right focus:outline-none"
              >
                <div
                  className={cn(
                    'relative flex size-14 shrink-0 items-center justify-center rounded-full border bg-white shadow-[0_4px_16px_rgba(0,86,255,0.08)] transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_8px_24px_rgba(0,86,255,0.18)] lg:size-16',
                    isActive || isHovered
                      ? 'border-[#0056FF] ring-4 ring-[#0056FF]/15'
                      : 'border-[#CAD3F5] hover:border-[#0056FF]/60',
                  )}
                >
                  <div
                    className={cn(
                      'flex size-10 items-center justify-center rounded-full transition-colors lg:size-11',
                      isActive || isHovered
                        ? 'bg-[#0056FF] text-white'
                        : 'bg-[#EFF5FF] text-[#0056FF] group-hover:bg-[#E3E7FC]',
                    )}
                  >
                    {node.icon}
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-end gap-1.5">
                    {node.badge && (
                      <span className="rounded bg-[#E3E7FC] px-1 py-0.2 font-mono text-[8px] font-bold text-[#0056FF]">
                        {node.badge}
                      </span>
                    )}
                    <span className="font-mono text-[9px] font-bold text-[#0056FF] uppercase">
                      {node.tag || 'Service'}
                    </span>
                  </div>
                  <span
                    className={cn(
                      'block truncate text-xs font-bold transition-colors',
                      isActive ? 'text-[#0056FF]' : 'text-[#0A1A4A] group-hover:text-[#0056FF]',
                    )}
                  >
                    {node.label}
                  </span>
                  {node.sublabel && (
                    <span className="block truncate font-mono text-[10px] text-slate-500">
                      {node.sublabel}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* =================================================================== */}
      {/* MOBILE ADAPTIVE VIEW (Screen widths under 768px)                   */}
      {/* =================================================================== */}
      <div className="flex flex-col items-center gap-5 md:hidden">
        {/* Mobile Center Hub */}
        <div className="flex flex-col items-center text-center">
          <div className="relative flex size-20 items-center justify-center rounded-full border-2 border-[#CAD3F5] bg-white p-2 shadow-[0_6px_20px_rgba(0,86,255,0.1)]">
            <div className="flex size-12 items-center justify-center rounded-full bg-[#EFF5FF] text-[#0056FF]">
              {center.icon}
            </div>
            <span className="absolute top-1 right-1 flex size-3.5 items-center justify-center rounded-full bg-emerald-100 ring-2 ring-white">
              <span className="size-1.5 rounded-full bg-emerald-500" />
            </span>
          </div>
          <span className="mt-2 font-mono text-xs font-black tracking-wider text-[#0A1A4A] uppercase">
            {center.title}
          </span>
          {center.subtitle && (
            <span className="font-mono text-[10px] font-semibold text-[#0056FF]">
              {center.subtitle}
            </span>
          )}
        </div>

        {/* Mobile 6-Node Grid */}
        <div className="grid w-full grid-cols-2 gap-2.5">
          {[...leftNodes, ...rightNodes].slice(0, 6).map((node) => {
            const isActive = currentActiveId === node.id;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => onSelectNode?.(node.id)}
                className={cn(
                  'flex items-center gap-2.5 rounded-2xl border p-2.5 text-left transition-all active:scale-95',
                  isActive
                    ? 'border-[#0056FF] bg-[#EFF5FF] shadow-xs'
                    : 'border-[#CAD3F5] bg-white hover:border-[#0056FF]/40',
                )}
              >
                <div
                  className={cn(
                    'flex size-9 shrink-0 items-center justify-center rounded-full text-xs transition-colors',
                    isActive ? 'bg-[#0056FF] text-white' : 'bg-[#EFF5FF] text-[#0056FF]',
                  )}
                >
                  {node.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <span
                    className={cn(
                      'block truncate text-xs font-bold',
                      isActive ? 'text-[#0056FF]' : 'text-[#0A1A4A]',
                    )}
                  >
                    {node.label}
                  </span>
                  <span className="block truncate font-mono text-[9px] text-slate-500">
                    {node.tag || 'Module'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
