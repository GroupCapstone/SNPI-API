'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { IconComponent } from '@/components/icons';

export interface HangingTabItem {
  id: string;
  label: string;
  icon: IconComponent | React.ComponentType<{ className?: string }>;
  href?: string;
  badge?: number | string;
  badgeColor?: 'blue' | 'red' | 'emerald' | 'amber';
  onClick?: () => void;
}

export interface HangingTabsNavProps {
  items: HangingTabItem[];
  activeId: string;
  onSelect?: (id: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Hanging Trapezoid Tab Background SVG
 * Smooth continuous trapezoid with rounded bottom corners and zero border clipping
 */
const TabShape = React.memo(function TabShape({
  isActive,
  isHovered,
}: {
  isActive: boolean;
  isHovered: boolean;
}) {
  const fillColor = isActive ? '#FFFFFF' : isHovered ? '#F8FAFF' : '#E8EEFC';
  const strokeColor = isActive ? '#0056FF' : isHovered ? '#2563EB' : '#CAD3F5';

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible transition-colors duration-200"
      viewBox="0 0 100 52"
      preserveAspectRatio="none"
      fill="none"
    >
      <path
        d="M 0,0 L 100,0 L 88,44 Q 85,50 78,50 L 22,50 Q 15,50 12,44 Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={isActive ? 2 : 1.25}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
});

export function HangingTabsNav({
  items,
  activeId,
  onSelect,
  className,
  size = 'md',
}: HangingTabsNavProps) {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  const sizeClasses = {
    sm: 'h-12 min-w-[96px] px-3.5 pt-1.5 pb-2',
    md: 'h-[58px] min-w-[130px] px-5 pt-2 pb-2.5',
    lg: 'h-[66px] min-w-[150px] px-6 pt-2.5 pb-3',
  }[size];

  const iconSizes = {
    sm: 'size-4',
    md: 'size-5',
    lg: 'size-6',
  }[size];

  const textSizes = {
    sm: 'text-[11px]',
    md: 'text-xs',
    lg: 'text-sm',
  }[size];

  return (
    <nav
      aria-label="Top Navigation Hanging Tabs"
      className={cn('flex items-start gap-1.5 select-none', className)}
    >
      {items.map((tab) => {
        const isActive = activeId === tab.id;
        const isHovered = hoveredId === tab.id;
        const Icon = tab.icon;

        const content = (
          <div
            className={cn(
              'relative z-10 flex flex-col items-center justify-center text-center transition-all duration-200 ease-out',
              isActive ? 'translate-y-0.5' : '',
            )}
          >
            {/* Bare Icon with Kinetic Micro-Scale Event */}
            <div className="relative flex items-center justify-center">
              <Icon
                className={cn(
                  iconSizes,
                  'transition-all duration-200 ease-out',
                  isActive
                    ? 'scale-105 stroke-[2.2] text-[#0056FF]'
                    : isHovered
                      ? 'scale-110 stroke-[2] text-slate-900'
                      : 'stroke-[1.8] text-slate-600',
                )}
              />
            </div>

            {/* Typography Label (Pure Typography & Icon - Zero Dot Style) */}
            <div className="mt-1 flex items-center justify-center">
              <span
                className={cn(
                  'font-sans font-black tracking-tight transition-colors duration-200',
                  textSizes,
                  isActive ? 'text-slate-950' : isHovered ? 'text-slate-900' : 'text-slate-600',
                )}
              >
                {tab.label}
              </span>
            </div>
          </div>
        );

        const tabProps = {
          onMouseEnter: () => setHoveredId(tab.id),
          onMouseLeave: () => setHoveredId(null),
          onClick: (e: React.MouseEvent) => {
            if (tab.onClick) {
              if (!tab.href) {
                e.preventDefault();
              }
              tab.onClick();
            }
            onSelect?.(tab.id);
          },
          className: cn(
            'group relative flex items-center justify-center focus-visible:outline-none cursor-pointer select-none transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
            sizeClasses,
            isActive
              ? 'z-20 drop-shadow-[0_4px_12px_rgba(0,86,255,0.12)]'
              : 'z-10 hover:-translate-y-1 active:translate-y-0.5 active:scale-[0.98]',
          ),
        };

        if (tab.href) {
          return (
            <Link key={tab.id} href={tab.href} prefetch={true} {...tabProps}>
              <TabShape isActive={isActive} isHovered={isHovered} />
              {content}
            </Link>
          );
        }

        return (
          <button key={tab.id} type="button" {...tabProps}>
            <TabShape isActive={isActive} isHovered={isHovered} />
            {content}
          </button>
        );
      })}
    </nav>
  );
}
