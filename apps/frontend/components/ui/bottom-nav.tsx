'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { IconComponent } from '@/components/icons';

export interface BottomNavItem {
  label: string;
  href: string;
  icon: IconComponent;
  badge?: number | string;
}

export interface BottomNavProps {
  items: BottomNavItem[];
  className?: string;
}

export function BottomNav({ items, className }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Bottom Navigation"
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-slate-200 bg-white/95 px-2 backdrop-blur-md lg:hidden dark:border-white/10 dark:bg-[#161619]/95',
        className,
      )}
    >
      {items.slice(0, 5).map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'group relative flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-lg px-2 text-xs font-normal transition-colors focus-visible:outline-none',
              isActive
                ? 'font-medium text-[#00509d] dark:text-emerald-400'
                : 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200',
            )}
          >
            <div className="relative">
              <Icon className="size-5 shrink-0" />
              {item.badge !== undefined && (
                <span className="absolute -top-1 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="truncate max-w-[64px] text-[11px] leading-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
