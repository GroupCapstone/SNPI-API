'use client';

import * as React from 'react';
import { ChevronDown, Check } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  disabled = false,
  className,
}: DropdownProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [open]);

  return (
    <div ref={containerRef} className={cn('relative w-full max-w-xs', className)}>
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'flex h-11 w-full min-h-[44px] items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-colors hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-[#161619] dark:text-zinc-100 dark:hover:border-white/20',
        )}
      >
        <span className={cn('truncate', !selectedOption && 'text-slate-400 dark:text-zinc-500')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn('size-4 shrink-0 text-slate-400 transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="animate-in fade-in zoom-in-95 absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow-none transition-all dark:border-white/10 dark:bg-[#202024]"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  if (!opt.disabled) {
                    onChange(opt.value);
                    setOpen(false);
                  }
                }}
                className={cn(
                  'flex h-9 min-h-[36px] cursor-pointer items-center justify-between rounded-md px-3 text-sm transition-colors',
                  isSelected
                    ? 'bg-slate-100 font-medium text-slate-900 dark:bg-[#2E2E33] dark:text-zinc-100'
                    : 'text-slate-700 hover:bg-slate-50 dark:text-zinc-300 dark:hover:bg-[#2E2E33]/60',
                  opt.disabled && 'cursor-not-allowed opacity-50',
                )}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check className="size-4 shrink-0 text-emerald-500" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
