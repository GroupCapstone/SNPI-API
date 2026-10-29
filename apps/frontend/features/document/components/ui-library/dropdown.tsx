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
    <div ref={containerRef} className={cn('relative inline-block w-full max-w-xs', className)}>
      {label && (
        <label className="mb-1.5 block text-xs font-semibold text-slate-700">{label}</label>
      )}

      {/* Trigger Button - 44px min height */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          'flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 text-sm text-slate-900 shadow-xs transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:outline-none',
          isOpen && 'border-[#0056FF] ring-1 ring-[#0056FF]',
          disabled && 'cursor-not-allowed bg-slate-50 opacity-50',
        )}
      >
        <span className={cn('truncate', !selectedOption && 'text-slate-500')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            'ml-2 h-4 w-4 text-slate-500 transition-transform duration-200',
            isOpen && 'rotate-180 text-slate-900',
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          tabIndex={-1}
          className="absolute right-0 left-0 z-50 mt-1.5 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg transition-all"
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
                  'flex min-h-[40px] w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors duration-100',
                  isSelected
                    ? 'bg-blue-50 font-semibold text-[#0056FF]'
                    : 'text-slate-800 hover:bg-slate-50',
                  option.disabled && 'cursor-not-allowed opacity-40',
                )}
              >
                <div className="flex flex-col">
                  <span>{option.label}</span>
                  {option.description && (
                    <span className="text-xs text-slate-500">{option.description}</span>
                  )}
                </div>
                {isSelected && <Check className="ml-2 h-4 w-4 shrink-0 text-[#0056FF]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
