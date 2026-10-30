'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { IconComponent } from '@/components/icons';

export interface HangingTabItem {
  id: string;
  label: string;
  icon?: IconComponent | React.ComponentType<{ className?: string }>;
  href?: string;
  badge?: number | string;
  onClick?: () => void;
}

export interface HangingTabsNavProps {
  items: HangingTabItem[];
  activeId: string;
  onSelect?: (id: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcons?: boolean;
}

/**
 * Cyber Armor Mecha SVG Chassis
 * High-tech aerospace / mecha console with dual top stepped armor wings,
 * drop bottom bracket, chamfered 45° corner caps, and debossed tech grooves.
 */
function CyberChassisSvg({ className }: { className?: string }) {
  return (
    <svg
      className={cn('pointer-events-none absolute inset-0 h-full w-full overflow-visible', className)}
      viewBox="0 0 1000 68"
      preserveAspectRatio="none"
      fill="none"
    >
      <defs>
        {/* Metallic Light Mech Gradient */}
        <linearGradient id="cyberChassisLightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#F8FAFC" />
          <stop offset="85%" stopColor="#EEF2F8" />
          <stop offset="100%" stopColor="#E2E8F4" />
        </linearGradient>

        {/* Ambient Royal Blue Glow Filter */}
        <filter id="royalGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#0056FF" floodOpacity="0.45" />
        </filter>
      </defs>

      {/* Main Outer Chassis Path (Chamfered Ears, Dual Top Wings, Bottom Drop Bracket) */}
      <path
        d="M 18,10 
           L 220,10 
           L 240,0 
           L 360,0 
           L 380,10 
           L 620,10 
           L 640,0 
           L 760,0 
           L 780,10 
           L 982,10 
           L 1000,28 
           L 1000,40 
           L 982,58 
           L 760,58 
           L 740,68 
           L 260,68 
           L 240,58 
           L 18,58 
           L 0,40 
           L 0,28 
           Z"
        fill="url(#cyberChassisLightGrad)"
        stroke="#CAD3F5"
        strokeWidth="1.75"
        vectorEffect="non-scaling-stroke"
      />

      {/* Top Inner Bevel Highlight (1px Milled Aluminum Glint) */}
      <path
        d="M 19,11 
           L 220,11 
           L 240,1.5 
           L 360,1.5 
           L 380,11 
           L 620,11 
           L 640,1.5 
           L 760,1.5 
           L 780,11 
           L 981,11"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        opacity="0.95"
      />

      {/* Left Wing Debossed Tech Slot & Royal Blue Accent */}
      <rect x="264" y="3.5" width="72" height="3" rx="1.5" fill="#CAD3F5" />
      <rect x="270" y="4" width="22" height="2" rx="1" fill="#0056FF" filter="url(#royalGlow)" />

      {/* Right Wing Debossed Tech Slot & Royal Blue Accent */}
      <rect x="664" y="3.5" width="72" height="3" rx="1.5" fill="#CAD3F5" />
      <rect x="708" y="4" width="22" height="2" rx="1" fill="#0056FF" filter="url(#royalGlow)" />

      {/* Bottom Drop Bracket Milled Groove */}
      <line
        x1="285"
        y1="64"
        x2="715"
        y2="64"
        stroke="#CAD3F5"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Left Stepped Ear Notches */}
      <line x1="3" y1="30" x2="3" y2="38" stroke="#CAD3F5" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="7" y1="26" x2="7" y2="42" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />

      {/* Right Stepped Ear Notches */}
      <line x1="997" y1="30" x2="997" y2="38" stroke="#CAD3F5" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="993" y1="26" x2="993" y2="42" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

/**
 * CyberArmorNav (also exported as HangingTabsNav for full backwards compatibility)
 * High-tech modular cyber / mecha dock navigation bar matching the reference design.
 * Features:
 * - Stepped mecha armor chassis with angled chamfers
 * - Physical double-seam dividers between modular buttons
 * - Luminous Royal Blue active glow bar indicator
 * - Full light day mode brand aesthetic (#0056FF, #2277FF, #E3E7FC, #FFFFFF)
 * - Zero dots standard
 */
export function CyberArmorNav({
  items,
  activeId,
  onSelect,
  className,
  size = 'md',
  showIcons = true,
}: HangingTabsNavProps) {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  const containerHeights = {
    sm: 'h-[44px]',
    md: 'h-[50px]',
    lg: 'h-[56px]',
  }[size];

  const buttonHeights = {
    sm: 'h-[32px] px-3.5',
    md: 'h-[36px] px-5 sm:px-6',
    lg: 'h-[42px] px-6 sm:px-8',
  }[size];

  const textSizes = {
    sm: 'text-[11px]',
    md: 'text-xs sm:text-[13px]',
    lg: 'text-sm sm:text-base',
  }[size];

  return (
    <nav
      aria-label="Modular Mecha Cyber Navigation"
      className={cn(
        'relative inline-flex items-center justify-center p-[8px_16px] select-none',
        'drop-shadow-[0_4px_16px_rgba(0,0,0,0.06)]',
        containerHeights,
        className,
      )}
    >
      {/* 1. Underlying Armored Cyber Chassis */}
      <CyberChassisSvg />

      {/* 2. Overlaid Button Cell Segments */}
      <div className="relative z-10 flex h-full items-center">
        {items.map((tab, idx) => {
          const isActive = activeId === tab.id;
          const isHovered = hoveredId === tab.id;
          const Icon = tab.icon;
          const isLast = idx === items.length - 1;

          const buttonContent = (
            <div className="relative flex items-center justify-center gap-2">
              {/* Optional Kinetic Micro-Icon */}
              {showIcons && Icon && (
                <Icon
                  className={cn(
                    'size-3.5 transition-transform duration-150',
                    isActive
                      ? 'stroke-[2.2] text-[#0056FF]'
                      : isHovered
                        ? 'scale-110 stroke-[2] text-slate-900'
                        : 'stroke-[1.8] text-slate-500',
                  )}
                />
              )}

              {/* High-Contrast Bold Sora Label (Zero-Dot Standard) */}
              <span
                className={cn(
                  'font-sans font-black tracking-wider uppercase transition-colors duration-150',
                  textSizes,
                  isActive
                    ? 'text-slate-950'
                    : isHovered
                      ? 'text-[#0056FF]'
                      : 'text-slate-600',
                )}
              >
                {tab.label}
              </span>

              {/* Active Tab Underline Indicator Bar (Royal Blue Glow) */}
              {isActive && (
                <span
                  className={cn(
                    'absolute -bottom-2 left-1/2 h-[3.5px] w-4/5 -translate-x-1/2 rounded-full',
                    'bg-gradient-to-r from-[#0056FF] via-[#2277FF] to-[#0056FF]',
                    'shadow-[0_0_10px_rgba(0,86,255,0.7),0_1px_3px_rgba(0,86,255,0.4)]',
                  )}
                />
              )}
            </div>
          );

          const sharedClasses = cn(
            'group relative flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-[0.98]',
            buttonHeights,
            isActive
              ? 'bg-gradient-to-b from-white/90 via-white to-[#F0F5FF]'
              : 'hover:bg-[#E3E7FC]/40',
          );

          return (
            <React.Fragment key={tab.id}>
              {tab.href ? (
                <Link
                  href={tab.href}
                  onMouseEnter={() => setHoveredId(tab.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => {
                    tab.onClick?.();
                    onSelect?.(tab.id);
                  }}
                  className={sharedClasses}
                >
                  {buttonContent}
                </Link>
              ) : (
                <button
                  type="button"
                  onMouseEnter={() => setHoveredId(tab.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => {
                    tab.onClick?.();
                    onSelect?.(tab.id);
                  }}
                  className={sharedClasses}
                >
                  {buttonContent}
                </button>
              )}

              {/* Physical Vertical Seam: 1px Darker Line + 1px White Milled Highlight */}
              {!isLast && (
                <div className="relative flex h-5 w-[2px] items-center">
                  <span className="h-full w-[1px] bg-slate-300/80" />
                  <span className="h-full w-[1px] bg-white" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}

// Full backwards compatibility export
export { CyberArmorNav as HangingTabsNav };
