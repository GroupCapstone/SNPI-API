'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface LibraryTooltipProps {
  content: React.ReactNode;
  shortcut?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactElement<{
    onMouseEnter?: React.MouseEventHandler;
    onMouseLeave?: React.MouseEventHandler;
    onFocus?: React.FocusEventHandler;
    onBlur?: React.FocusEventHandler;
  }>;
  className?: string;
  delayMs?: number;
}

export function LibraryTooltip({
  content,
  shortcut,
  position = 'top',
  children,
  className,
  delayMs = 200,
}: LibraryTooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delayMs);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const childWithProps = React.cloneElement(children, {
    onMouseEnter: (e: React.MouseEvent) => {
      showTooltip();
      children.props.onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      hideTooltip();
      children.props.onMouseLeave?.(e);
    },
    onFocus: (e: React.FocusEvent) => {
      showTooltip();
      children.props.onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent) => {
      hideTooltip();
      children.props.onBlur?.(e);
    },
  });

  return (
    <div className="relative inline-flex items-center justify-center">
      {childWithProps}
      {isVisible && (
        <div
          role="tooltip"
          className={cn(
            'pointer-events-none absolute z-50 flex items-center gap-1.5 whitespace-nowrap rounded-md border border-white/15 bg-[#2E2E33] px-2.5 py-1 text-xs font-normal text-zinc-200 shadow-none animate-in fade-in zoom-in-95 duration-100',
            positionStyles[position],
            className,
          )}
        >
          <span>{content}</span>
          {shortcut && (
            <kbd className="rounded border border-white/20 bg-white/10 px-1 py-0.5 text-[10px] font-mono uppercase text-zinc-300">
              {shortcut}
            </kbd>
          )}
        </div>
      )}
    </div>
  );
}
