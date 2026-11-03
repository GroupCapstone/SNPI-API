'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Check, Search, X, Building2 } from '@/components/icons';

export interface LibraryDropdownOption {
  value: string;
  label: string;
  description?: string;
  badge?: string;
  meta?: string;
  icon?: React.ComponentType<{ className?: string }>;
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
  searchable?: boolean;
  searchPlaceholder?: string;
}

export function LibraryDropdown({
  label,
  placeholder = 'Select an institutional branch...',
  options,
  value,
  onChange,
  className,
  disabled = false,
  searchable = true,
  searchPlaceholder = 'Search campus name or branch code...',
}: LibraryDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState<number>(-1);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const listboxRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Filter options based on query
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase().trim();
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.badge && opt.badge.toLowerCase().includes(q)) ||
        (opt.description && opt.description.toLowerCase().includes(q)),
    );
  }, [options, searchQuery]);

  // Reset search when opening/closing
  React.useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      const initialIdx = filteredOptions.findIndex((opt) => opt.value === value);
      setActiveIndex(initialIdx >= 0 ? initialIdx : 0);
      // Auto focus search input
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, filteredOptions, value]);

  // Click outside and Escape handling
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent) {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;

      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
        break;

      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
        break;

      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < filteredOptions.length) {
          const chosen = filteredOptions[activeIndex];
          if (!chosen.disabled) {
            onChange(chosen.value);
            setIsOpen(false);
          }
        }
        break;

      default:
        break;
    }
  }

  // Auto scroll active option into view
  React.useEffect(() => {
    if (isOpen && listboxRef.current && activeIndex >= 0) {
      const activeEl = listboxRef.current.children[activeIndex] as HTMLElement | undefined;
      activeEl?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex, isOpen]);

  const TriggerIcon = selectedOption?.icon || Building2;

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={cn('relative inline-block w-full text-left', className)}
    >
      {/* Optional Top Label */}
      {label && (
        <div className="mb-2 flex items-center justify-between">
          <label className="font-sans text-xs font-bold text-[#0A1A4A]">{label}</label>
          <span className="font-mono text-[10px] font-semibold text-[#0056FF]">
            Standard Blueprint
          </span>
        </div>
      )}

      {/* Modern High-End Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          'group relative flex min-h-[54px] w-full cursor-pointer items-center justify-between gap-3 rounded-2xl border-2 px-3.5 py-2.5 transition-all select-none focus-visible:outline-none',
          isOpen
            ? 'border-[#0056FF] bg-white shadow-[0_8px_24px_rgba(0,86,255,0.12)] ring-3 ring-[#0056FF]/15'
            : 'border-[#CAD3F5] bg-white hover:border-[#0056FF] hover:bg-[#EFF5FF]/25 hover:shadow-2xs',
          disabled && 'cursor-not-allowed bg-slate-100 opacity-50',
        )}
      >
        {/* Left: Domain Campus Icon Badge */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div
            className={cn(
              'flex size-9 shrink-0 items-center justify-center rounded-xl border transition-transform duration-200 group-hover:scale-105',
              selectedOption
                ? 'border-[#CAD3F5] bg-[#EFF5FF] text-[#0056FF] shadow-2xs'
                : 'border-slate-200 bg-slate-50 text-slate-400',
            )}
          >
            <TriggerIcon className="size-4.5 stroke-[2]" />
          </div>

          {/* Center: Campus Details */}
          <div className="flex min-w-0 flex-col text-left">
            <span
              className={cn(
                'truncate font-sans text-xs font-bold sm:text-sm',
                selectedOption ? 'text-[#0A1A4A]' : 'font-normal text-slate-400',
              )}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            {selectedOption?.description && (
              <span className="truncate font-sans text-[11px] text-slate-500">
                {selectedOption.description}
              </span>
            )}
          </div>
        </div>

        {/* Right: Badges & Chevron */}
        <div className="flex shrink-0 items-center gap-2">
          {selectedOption?.badge && (
            <span className="rounded-md border border-[#CAD3F5] bg-[#E3E7FC] px-2 py-0.5 font-mono text-[10px] font-bold text-[#0056FF]">
              {selectedOption.badge}
            </span>
          )}

          {/* Active Status Ping */}
          {selectedOption && (
            <span className="flex size-2 items-center justify-center">
              <span className="size-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
            </span>
          )}

          {/* Rotating Chevron */}
          <div
            className={cn(
              'flex size-6 items-center justify-center rounded-lg transition-all duration-200',
              isOpen
                ? 'rotate-180 bg-[#EFF5FF] text-[#0056FF]'
                : 'text-slate-400 group-hover:text-[#0056FF]',
            )}
          >
            <ChevronDown className="size-4 stroke-[2.5]" />
          </div>
        </div>
      </button>

      {/* Dropdown Menu Popover Panel */}
      {isOpen && (
        <div
          role="listbox"
          tabIndex={-1}
          className="animate-in fade-in zoom-in-95 absolute right-0 left-0 z-50 mt-2 overflow-hidden rounded-2xl border-2 border-[#CAD3F5] bg-white shadow-[0_20px_50px_rgba(0,86,255,0.16)] transition-all"
        >
          {/* Top Quick Search Filter */}
          {searchable && (
            <div className="border-b border-slate-100 bg-[#F8FAFC] p-2.5">
              <div className="relative flex items-center">
                <Search className="absolute left-3 size-4 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="h-9 w-full rounded-xl border border-slate-200 bg-white pr-8 pl-9 font-sans text-xs font-medium text-slate-800 placeholder-slate-400 transition-all focus:border-[#0056FF] focus:bg-white focus:ring-2 focus:ring-[#0056FF]/20 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 flex size-5 cursor-pointer items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Directory Count Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-3 py-1.5 font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            <span>Institutional Branch Directory</span>
            <span>{filteredOptions.length} Campuses</span>
          </div>

          {/* Options Listbox */}
          <div ref={listboxRef} className="no-scrollbar max-h-72 space-y-1.5 overflow-y-auto p-2">
            {filteredOptions.length === 0 ? (
              <div className="py-8 text-center">
                <p className="font-sans text-xs font-bold text-slate-600">No campuses found</p>
                <p className="mt-0.5 font-sans text-[11px] text-slate-400">
                  Try adjusting your search terms
                </p>
              </div>
            ) : (
              filteredOptions.map((option, idx) => {
                const isSelected = option.value === value;
                const isKeyboardActive = activeIndex === idx;
                const OptionIcon = option.icon || Building2;

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
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={cn(
                      'group relative flex w-full cursor-pointer items-start justify-between gap-3 rounded-xl border p-3 text-left transition-all select-none',
                      isSelected
                        ? 'border-[#0056FF] bg-[#EFF5FF] shadow-xs'
                        : isKeyboardActive
                          ? 'border-[#CAD3F5] bg-[#EFF5FF]/40 text-[#0056FF]'
                          : 'border-transparent bg-white hover:border-[#CAD3F5] hover:bg-[#EFF5FF]/30',
                      option.disabled && 'cursor-not-allowed opacity-40',
                    )}
                  >
                    {/* Left Icon Badge */}
                    <div
                      className={cn(
                        'flex size-9 shrink-0 items-center justify-center rounded-xl border transition-colors',
                        isSelected
                          ? 'border-[#0056FF] bg-[#0056FF] text-white shadow-2xs'
                          : 'border-[#CAD3F5] bg-[#EFF5FF] text-[#0056FF]',
                      )}
                    >
                      <OptionIcon className="size-4.5 stroke-[2]" />
                    </div>

                    {/* Middle Campus Metadata */}
                    <div className="flex min-w-0 flex-1 flex-col pr-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={cn(
                            'font-sans text-xs font-bold sm:text-sm',
                            isSelected ? 'text-[#0056FF]' : 'text-[#0A1A4A]',
                          )}
                        >
                          {option.label}
                        </span>
                        {option.badge && (
                          <span
                            className={cn(
                              'py-0.2 rounded border px-1.5 font-mono text-[9px] font-bold',
                              isSelected
                                ? 'border-[#0056FF] bg-[#0056FF] text-white'
                                : 'border-[#CAD3F5] bg-[#E3E7FC] text-[#0056FF]',
                            )}
                          >
                            {option.badge}
                          </span>
                        )}
                      </div>

                      {option.description && (
                        <span className="mt-1 font-sans text-xs leading-relaxed text-slate-500">
                          {option.description}
                        </span>
                      )}
                    </div>

                    {/* Right: Selected Checkmark Indicator */}
                    <div className="flex shrink-0 items-center self-center">
                      {isSelected ? (
                        <span className="flex size-6 items-center justify-center rounded-lg bg-[#0056FF] text-white shadow-2xs">
                          <Check className="size-3.5 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="size-2 rounded-full bg-slate-200 group-hover:bg-[#0056FF]/40" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Bottom Footer Info Bar */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-[#F8FAFC] px-3.5 py-2 font-mono text-[10px] text-slate-500">
            <span>Use ↑ ↓ keys to navigate · Enter to select</span>
            <div className="flex items-center gap-1 font-bold text-[#0056FF]">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              <span>Replica Active</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
