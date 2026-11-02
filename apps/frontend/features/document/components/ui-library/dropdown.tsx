'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Check } from '@/components/icons';

export interface LibraryDropdownOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface LibraryDropdownProps {
  label?: string;
  placeholder?: string;
  options: LibraryDropdownOption[];
  value?: string;
  onChange: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

export function LibraryDropdown({
  label,
  placeholder = 'Select an option...',
  options,
  value,
  onChange,
  className,
  disabled = false,
}: LibraryDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cn('relative inline-block w-full', className)}>
      {label && (
        <label className="mb-2 block font-sans text-xs font-bold text-[#0A1A4A]">{label}</label>
      )}

      {/* Trigger Button - Clean Modern Border & Ice Tint Hover */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          'flex h-11 w-full items-center justify-between rounded-xl border border-[#CAD3F5] bg-white px-3.5 font-sans text-xs font-bold text-[#0A1A4A] transition-all select-none hover:border-[#0056FF] hover:bg-[#EFF5FF]/40 focus-visible:outline-none',
          isOpen && 'border-[#0056FF] bg-white shadow-xs ring-2 ring-[#0056FF]/20',
          disabled && 'cursor-not-allowed bg-slate-100 opacity-50',
        )}
      >
        <span className={cn('truncate', !selectedOption && 'font-normal text-slate-400')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            'ml-2 h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200',
            isOpen && 'rotate-180 text-[#0056FF]',
          )}
        />
      </button>

      {/* Dropdown Menu Popover */}
      {isOpen && (
        <div
          role="listbox"
          tabIndex={-1}
          className="animate-in fade-in slide-in-from-top-1 absolute right-0 left-0 z-50 mt-2 max-h-64 overflow-y-auto rounded-xl border border-[#CAD3F5] bg-white p-1.5 shadow-[0_12px_32px_rgba(0,86,255,0.08)] transition-all"
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={option.disabled}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'flex min-h-[44px] w-full items-center justify-between rounded-lg px-3 py-2 text-left font-sans text-xs transition-colors duration-150',
                  isSelected
                    ? 'border border-[#CAD3F5] bg-[#EFF5FF] font-bold text-[#0056FF]'
                    : 'text-slate-800 hover:bg-[#EFF5FF]/60 hover:text-[#0056FF]',
                  option.disabled && 'cursor-not-allowed opacity-40',
                )}
              >
                <div className="flex flex-col pr-2">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span>{option.label}</span>
                  </div>
                  {option.description && (
                    <span className="mt-0.5 font-mono text-[10px] text-slate-500">
                      {option.description}
                    </span>
                  )}
                </div>
                {isSelected && (
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-[#0056FF] text-white">
                    <Check className="size-3.5 stroke-[2.5]" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
