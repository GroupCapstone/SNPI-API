'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface LibraryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function LibraryCard({
  interactive = false,
  className,
  children,
  ...props
}: LibraryCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border-2 border-slate-200 bg-white p-5 text-slate-900 shadow-xs transition-all duration-200',
        interactive &&
          'cursor-pointer [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,0_100%)] hover:-translate-y-1 hover:border-[#0056FF] hover:bg-white hover:shadow-lg',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function LibraryCardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-3 flex items-start justify-between gap-3', className)} {...props}>
      {children}
    </div>
  );
}

export function LibraryCardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-base font-bold tracking-tight text-slate-900', className)} {...props}>
      {children}
    </h3>
  );
}

export function LibraryCardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-xs leading-relaxed text-slate-600', className)} {...props}>
      {children}
    </p>
  );
}

export function LibraryCardMedia({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative mb-3 aspect-video w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function LibraryCardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'mt-4 flex items-center justify-between border-t border-slate-100 pt-3',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
