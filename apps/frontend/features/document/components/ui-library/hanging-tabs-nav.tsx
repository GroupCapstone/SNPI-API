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
function TabShape({ isActive, isHovered }: { isActive: boolean; isHovered: boolean }) {
  const fillColor = isActive ? '#FFFFFF' : isHovered ? '#F8FAFC' : '#EDF2F7';

  const strokeColor = isActive ? '#0056FF' : isHovered ? '#94A3B8' : '#CBD5E1';

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible transition-colors duration-200"
      viewBox="0 0 100 52"
      preserveAspectRatio="none"
      fill="none"
    >
      {/* 
        Path coordinates:
        (0,0) -> top-left
        (100,0) -> top-right
        (88,44) -> slanted down-right
        Q (85,50) (78,50) -> bottom-right rounded corner
        (22,50) -> bottom-left flat edge
        Q (15,50) (12,44) -> bottom-left rounded corner
        Z -> close to (0,0)
      */}
      <path
        d="M 0,0 L 100,0 L 88,44 Q 85,50 78,50 L 22,50 Q 15,50 12,44 Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={isActive ? 1.75 : 1.25}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function HangingTabsNav({
  items,
  activeId,
  onSelect,
  className,
  size = 'md',
}: HangingTabsNavProps) {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  const sizeClasses = {
    sm: 'h-11 min-w-[70px] px-3 pt-1 pb-1.5',
    md: 'h-14 min-w-[84px] px-3.5 pt-1.5 pb-2',
    lg: 'h-16 min-w-[96px] px-4 pt-2 pb-2.5',
  }[size];

  const iconSizes = {
    sm: 'size-4',
    md: 'size-5',
    lg: 'size-6',
  }[size];

  return (
    <nav
      aria-label="Top Navigation Hanging Tabs"
      className={cn('flex items-start gap-1 select-none', className)}
    >
      {items.map((tab) => {
        const isActive = activeId === tab.id;
        const isHovered = hoveredId === tab.id;
        const Icon = tab.icon;

        const badgeBg = {
          blue: 'bg-[#0284C7]',
          red: 'bg-red-600',
          emerald: 'bg-emerald-600',
          amber: 'bg-amber-600',
        }[tab.badgeColor || 'blue'];

        const content = (
          <div
            className={cn(
              'relative z-10 flex flex-col items-center justify-center text-center transition-transform duration-150',
              isActive ? 'translate-y-0.5' : '',
            )}
          >
            {/* Icon + Floating Notification Badge */}
            <div className="relative flex items-center justify-center">
              <Icon
                className={cn(
                  iconSizes,
                  'transition-colors duration-150',
                  isActive ? 'text-[#0056FF]' : isHovered ? 'text-slate-900' : 'text-slate-600',
                )}
              />

              {/* Circular Badge with White Ring */}
              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'absolute -top-1.5 -right-3 flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 font-mono text-[9px] font-bold text-white ring-2 ring-white',
                    badgeBg,
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </div>

            {/* Label Underneath */}
            <span
              className={cn(
                'mt-1 font-sans text-[11px] font-bold tracking-tight transition-colors duration-150',
                isActive ? 'text-slate-950' : isHovered ? 'text-slate-800' : 'text-slate-600',
              )}
            >
              {tab.label}
            </span>
          </div>
        );

        const tabProps = {
          key: tab.id,
          onMouseEnter: () => setHoveredId(tab.id),
          onMouseLeave: () => setHoveredId(null),
          onClick: () => {
            tab.onClick?.();
            onSelect?.(tab.id);
          },
          className: cn(
            'group relative flex items-center justify-center focus-visible:outline-none',
            sizeClasses,
            isActive ? 'z-20' : 'z-10',
          ),
        };

        if (tab.href) {
          return (
            <Link href={tab.href} {...tabProps}>
              <TabShape isActive={isActive} isHovered={isHovered} />
              {content}
            </Link>
          );
        }

        return (
          <button type="button" {...tabProps}>
            <TabShape isActive={isActive} isHovered={isHovered} />
            {content}
          </button>
        );
      })}
    </nav>
  );
}
