'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Calendar, CalendarDays, ChevronLeft, ChevronRight, X, Check } from '@/components/icons';

export interface LocalDate {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
}

export type DateRange = {
  start: LocalDate | null;
  end: LocalDate | null;
};

// 08 Local-Date Model: Helper utilities operating purely in local calendar time
export function getTodayLocalDate(): LocalDate {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };
}

export function compareLocalDates(a: LocalDate, b: LocalDate): number {
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
}

export function isSameLocalDate(a: LocalDate | null, b: LocalDate | null): boolean {
  if (!a || !b) return false;
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

export function isLocalDateBetween(
  target: LocalDate,
  start: LocalDate | null,
  end: LocalDate | null,
): boolean {
  if (!start || !end) return false;
  return compareLocalDates(target, start) > 0 && compareLocalDates(target, end) < 0;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function formatLocalDate(d: LocalDate): string {
  const m = MONTH_NAMES[d.month - 1].slice(0, 3);
  return `${m} ${d.day}, ${d.year}`;
}

export function formatLocalDateRange(range: DateRange): string {
  if (!range.start && !range.end) return '';
  if (range.start && !range.end) return `${formatLocalDate(range.start)} – ...`;
  if (range.start && range.end) {
    if (isSameLocalDate(range.start, range.end)) {
      return formatLocalDate(range.start);
    }
    return `${formatLocalDate(range.start)} – ${formatLocalDate(range.end)}`;
  }
  return '';
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

export interface DatePickerProps {
  mode?: 'single' | 'range';
  value?: LocalDate | null;
  rangeValue?: DateRange;
  onChange?: (date: LocalDate | null) => void;
  onRangeChange?: (range: DateRange) => void;
  minDate?: LocalDate;
  maxDate?: LocalDate;
  placeholder?: string;
  theme?: 'light' | 'dark';
  className?: string;
  disabled?: boolean;
}

/**
 * DatePicker & DateRangePicker
 *
 * Implements the 8-pillar accessible calendar architecture:
 * 01 Trigger Field: aria-haspopup="dialog", aria-expanded, aria-controls wired to popover.
 * 02 Month Header: Prev/Next edge navigation with aria-live month title & out-of-bounds guards.
 * 03 ARIA Date Grid: role="grid", role="gridcell" with a single roving tabindex.
 * 04 Range Band: Solid start/end with squared inner corners and continuous translucent band.
 * 05 Hover Preview: Live range preview band after start date is picked before commit.
 * 06 Today Marker: Bold current day with cyan dot indicator + one-click Today shortcut.
 * 07 Min / Max Bounds: Out-of-bounds dates carry disabled and aria-disabled.
 * 08 Local-Date Model: Pure local calendar arithmetic avoiding UTC serialization shifts.
 */
export function DatePicker({
  mode = 'single',
  value = null,
  rangeValue = { start: null, end: null },
  onChange,
  onRangeChange,
  minDate,
  maxDate,
  placeholder = mode === 'range' ? 'Select date range...' : 'Select date...',
  theme = 'light',
  className,
  disabled = false,
}: DatePickerProps) {
  const isDark = theme === 'dark';
  const isRange = mode === 'range';
  const today = React.useMemo(() => getTodayLocalDate(), []);

  // Internal state
  const [isOpen, setIsOpen] = React.useState(false);
  const [internalDate, setInternalDate] = React.useState<LocalDate | null>(value);
  const [internalRange, setInternalRange] = React.useState<DateRange>(rangeValue);
  const [hoveredDate, setHoveredDate] = React.useState<LocalDate | null>(null);

  // Sync props to internal state
  React.useEffect(() => {
    if (!isRange) setInternalDate(value);
  }, [value, isRange]);

  React.useEffect(() => {
    if (isRange) setInternalRange(rangeValue);
  }, [rangeValue, isRange]);

  // Current viewing month & year
  const initialYear = internalDate?.year || internalRange.start?.year || today.year;
  const initialMonth = internalDate?.month || internalRange.start?.month || today.month;
  const [viewYear, setViewYear] = React.useState(initialYear);
  const [viewMonth, setViewMonth] = React.useState(initialMonth);

  // 03 ARIA Roving Tabindex: Exactly one focused day in the grid
  const [focusedDate, setFocusedDate] = React.useState<LocalDate>(
    internalDate || internalRange.start || today,
  );

  const containerRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const popoverId = React.useId();

  // Close popover on outside click
  React.useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  // Handle month edge bounds
  const canGoPrev = React.useMemo(() => {
    if (!minDate) return true;
    if (viewYear < minDate.year) return false;
    if (viewYear === minDate.year && viewMonth <= minDate.month) return false;
    return true;
  }, [minDate, viewYear, viewMonth]);

  const canGoNext = React.useMemo(() => {
    if (!maxDate) return true;
    if (viewYear > maxDate.year) return false;
    if (viewYear === maxDate.year && viewMonth >= maxDate.month) return false;
    return true;
  }, [maxDate, viewYear, viewMonth]);

  const handlePrevMonth = () => {
    if (!canGoPrev) return;
    if (viewMonth === 1) {
      setViewYear((y) => y - 1);
      setViewMonth(12);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (!canGoNext) return;
    if (viewMonth === 12) {
      setViewYear((y) => y + 1);
      setViewMonth(1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  // Check if a date is out of bounds
  const isDateDisabled = React.useCallback(
    (d: LocalDate) => {
      if (minDate && compareLocalDates(d, minDate) < 0) return true;
      if (maxDate && compareLocalDates(d, maxDate) > 0) return true;
      return false;
    },
    [minDate, maxDate],
  );

  // Selection handler
  const handleSelectDay = (day: LocalDate) => {
    if (isDateDisabled(day)) return;

    if (!isRange) {
      setInternalDate(day);
      onChange?.(day);
      setIsOpen(false);
      triggerRef.current?.focus();
      return;
    }

    // Range selection logic
    const { start, end } = internalRange;
    if (!start || (start && end)) {
      // Pick start date
      const newRange = { start: day, end: null };
      setInternalRange(newRange);
      onRangeChange?.(newRange);
    } else if (start && !end) {
      // Pick end date
      if (compareLocalDates(day, start) < 0) {
        // Swap or re-anchor
        const newRange = { start: day, end: null };
        setInternalRange(newRange);
        onRangeChange?.(newRange);
      } else {
        const newRange = { start, end: day };
        setInternalRange(newRange);
        onRangeChange?.(newRange);
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }
  };

  // 03 Keyboard Navigation Model on ARIA grid
  const handleGridKeyDown = (e: React.KeyboardEvent) => {
    let handled = false;
    const cur = { ...focusedDate };

    switch (e.key) {
      case 'ArrowLeft':
        cur.day -= 1;
        handled = true;
        break;
      case 'ArrowRight':
        cur.day += 1;
        handled = true;
        break;
      case 'ArrowUp':
        cur.day -= 7;
        handled = true;
        break;
      case 'ArrowDown':
        cur.day += 7;
        handled = true;
        break;
      case 'PageUp':
        if (canGoPrev) handlePrevMonth();
        handled = true;
        break;
      case 'PageDown':
        if (canGoNext) handleNextMonth();
        handled = true;
        break;
      case 'Home':
        cur.day = 1;
        handled = true;
        break;
      case 'End':
        cur.day = getDaysInMonth(viewYear, viewMonth);
        handled = true;
        break;
      case 'Enter':
      case ' ':
        handleSelectDay(focusedDate);
        handled = true;
        break;
      case 'Escape':
        setIsOpen(false);
        triggerRef.current?.focus();
        handled = true;
        break;
    }

    if (handled) {
      e.preventDefault();
      // Normalize date if moved outside month bounds
      const daysInCurrentMonth = getDaysInMonth(viewYear, viewMonth);
      if (cur.day < 1) {
        if (canGoPrev) {
          handlePrevMonth();
          const prevDays = getDaysInMonth(
            viewMonth === 1 ? viewYear - 1 : viewYear,
            viewMonth === 1 ? 12 : viewMonth - 1,
          );
          cur.day = Math.max(1, prevDays + cur.day);
        } else {
          cur.day = 1;
        }
      } else if (cur.day > daysInCurrentMonth) {
        if (canGoNext) {
          handleNextMonth();
          cur.day = Math.min(cur.day - daysInCurrentMonth, 28);
        } else {
          cur.day = daysInCurrentMonth;
        }
      }

      setFocusedDate(cur);
    }
  };

  // 06 Today shortcut
  const handleSelectToday = () => {
    setViewYear(today.year);
    setViewMonth(today.month);
    setFocusedDate(today);
    handleSelectDay(today);
  };

  const handleClear = () => {
    if (!isRange) {
      setInternalDate(null);
      onChange?.(null);
    } else {
      setInternalRange({ start: null, end: null });
      onRangeChange?.({ start: null, end: null });
    }
  };

  // Calculate days for the viewing month
  const totalDays = getDaysInMonth(viewYear, viewMonth);
  const firstDayOfWeek = getFirstDayOfWeek(viewYear, viewMonth);

  // Formatted display value for Trigger
  const displayValue = isRange
    ? formatLocalDateRange(internalRange)
    : internalDate
      ? formatLocalDate(internalDate)
      : '';

  return (
    <div
      ref={containerRef}
      className={cn('relative inline-block w-full max-w-sm select-none', className)}
    >
      {/* ======================================================== */}
      {/* 01 TRIGGER FIELD: Accessible Dialog Trigger Button       */}
      {/* ======================================================== */}
      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls={popoverId}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex w-full items-center justify-between gap-2.5 rounded-xl border px-3.5 py-2.5 font-sans text-xs font-medium transition-all duration-150 outline-none',
            'focus-visible:ring-2 focus-visible:ring-[#0056FF]',
            isOpen
              ? 'border-[#0056FF] ring-1 ring-[#0056FF]'
              : isDark
                ? 'border-slate-700 bg-slate-900/90 text-white hover:border-slate-600'
                : 'border-slate-300 bg-white text-slate-900 hover:border-slate-400',
            disabled && 'cursor-not-allowed opacity-50',
          )}
        >
          <div className="flex items-center gap-2.5 truncate">
            {isRange ? (
              <CalendarDays className="size-4 shrink-0 text-[#0056FF] dark:text-[#38BDF8]" />
            ) : (
              <Calendar className="size-4 shrink-0 text-[#0056FF] dark:text-[#38BDF8]" />
            )}
            <span
              className={cn(
                'truncate font-mono',
                displayValue
                  ? isDark
                    ? 'font-semibold text-white'
                    : 'font-semibold text-slate-950'
                  : 'text-slate-400',
              )}
            >
              {displayValue || placeholder}
            </span>
          </div>

          <span className="shrink-0 font-mono text-[10px] text-slate-400">
            {isRange ? '[RANGE]' : '[DATE]'}
          </span>
        </button>

        {/* Clear Button */}
        {displayValue && !disabled && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            aria-label="Clear date selection"
            className="absolute top-1/2 right-9 -translate-y-1/2 p-1 text-slate-400 transition-colors hover:text-slate-700 dark:hover:text-white"
          >
            <X className="size-3" />
          </button>
        )}
      </div>

      {/* ======================================================== */}
      {/* CALENDAR POPOVER DIALOG                                  */}
      {/* ======================================================== */}
      {isOpen && (
        <div
          id={popoverId}
          role="dialog"
          aria-modal="true"
          aria-label={isRange ? 'Date range picker' : 'Date picker'}
          className={cn(
            'absolute left-0 z-50 mt-2 w-full min-w-[300px] rounded-2xl border p-4 shadow-xl transition-all duration-150 sm:min-w-[340px]',
            isDark
              ? 'border-slate-800 bg-[#000B26] text-slate-100'
              : 'border-slate-200/90 bg-white text-slate-900',
          )}
        >
          {/* ======================================================== */}
          {/* 02 MONTH HEADER: Navigation & Live Month/Year Title      */}
          {/* ======================================================== */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={!canGoPrev}
              aria-label="Previous month"
              className={cn(
                'flex size-7 items-center justify-center rounded-lg border transition-colors',
                canGoPrev
                  ? isDark
                    ? 'border-slate-700 bg-slate-800 text-white hover:bg-slate-700'
                    : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                  : 'cursor-not-allowed border-transparent opacity-30',
              )}
            >
              <ChevronLeft className="size-3.5" />
            </button>

            {/* 02 Live Month Title */}
            <h2
              aria-live="polite"
              className="font-mono text-xs font-bold tracking-tight text-slate-950 uppercase dark:text-white"
            >
              {MONTH_NAMES[viewMonth - 1]} {viewYear}
            </h2>

            <button
              type="button"
              onClick={handleNextMonth}
              disabled={!canGoNext}
              aria-label="Next month"
              className={cn(
                'flex size-7 items-center justify-center rounded-lg border transition-colors',
                canGoNext
                  ? isDark
                    ? 'border-slate-700 bg-slate-800 text-white hover:bg-slate-700'
                    : 'border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100'
                  : 'cursor-not-allowed border-transparent opacity-30',
              )}
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>

          {/* ======================================================== */}
          {/* 03 ARIA DATE GRID: 7-Column Day Calendar Table           */}
          {/* ======================================================== */}
          <div
            role="grid"
            aria-label={`${MONTH_NAMES[viewMonth - 1]} ${viewYear}`}
            onKeyDown={handleGridKeyDown}
            className="mt-3 outline-none"
          >
            {/* Weekday Row */}
            <div role="row" className="mb-1 grid grid-cols-7 gap-1 text-center">
              {WEEKDAY_NAMES.map((w) => (
                <div
                  key={w}
                  role="columnheader"
                  className="py-1 font-mono text-[10px] font-bold text-slate-400"
                >
                  {w}
                </div>
              ))}
            </div>

            {/* Day Cells Grid */}
            <div className="grid grid-cols-7 gap-y-1">
              {/* Empty offset padding for days before the 1st */}
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} role="gridcell" className="size-9" />
              ))}

              {/* Day numbers */}
              {Array.from({ length: totalDays }).map((_, i) => {
                const dayNum = i + 1;
                const dateObj: LocalDate = {
                  year: viewYear,
                  month: viewMonth,
                  day: dayNum,
                };

                const isDisabled = isDateDisabled(dateObj);
                const isToday = isSameLocalDate(dateObj, today);

                // Single Selection check
                const isSingleSelected = !isRange && isSameLocalDate(dateObj, internalDate);

                // Range Selection checks
                const isRangeStart = isRange && isSameLocalDate(dateObj, internalRange.start);
                const isRangeEnd = isRange && isSameLocalDate(dateObj, internalRange.end);
                const isBetweenSelected =
                  isRange && isLocalDateBetween(dateObj, internalRange.start, internalRange.end);

                // 05 Hover Preview: would-be range before committing end date
                const isHoverPreview =
                  isRange &&
                  internalRange.start &&
                  !internalRange.end &&
                  hoveredDate &&
                  compareLocalDates(hoveredDate, internalRange.start) > 0 &&
                  isLocalDateBetween(dateObj, internalRange.start, hoveredDate);

                const isHoveredTarget =
                  isRange &&
                  internalRange.start &&
                  !internalRange.end &&
                  hoveredDate !== null &&
                  isSameLocalDate(dateObj, hoveredDate) &&
                  compareLocalDates(hoveredDate, internalRange.start) > 0;

                // 03 Roving tabindex check: only the active focused date has tabIndex=0
                const isFocused = isSameLocalDate(dateObj, focusedDate);

                return (
                  <div
                    key={dayNum}
                    role="gridcell"
                    className="relative flex items-center justify-center"
                    onMouseEnter={() => !isDisabled && setHoveredDate(dateObj)}
                    onMouseLeave={() => setHoveredDate(null)}
                  >
                    {/* 04 Range Band Background Layer */}
                    {isRange && (
                      <div
                        className={cn(
                          'pointer-events-none absolute inset-y-0 w-full transition-colors',
                          // Connecting band between start and end
                          isBetweenSelected && (isDark ? 'bg-cyan-500/20' : 'bg-cyan-500/15'),
                          // Hover Preview Band
                          isHoverPreview && (isDark ? 'bg-cyan-500/10' : 'bg-cyan-500/10'),
                          // Cap shaping
                          isRangeStart && internalRange.end && !isRangeEnd && 'left-1/2 w-1/2',
                          isRangeEnd && internalRange.start && !isRangeStart && 'right-1/2 w-1/2',
                          isRangeStart && isHoveredTarget && 'left-1/2 w-1/2',
                          isHoveredTarget && 'right-1/2 w-1/2',
                        )}
                      />
                    )}

                    {/* Day Button */}
                    <button
                      type="button"
                      role="button"
                      disabled={isDisabled}
                      tabIndex={isFocused ? 0 : -1}
                      aria-selected={
                        isSingleSelected || isRangeStart || isRangeEnd || isBetweenSelected
                      }
                      aria-disabled={isDisabled}
                      aria-label={`${MONTH_NAMES[viewMonth - 1]} ${dayNum}, ${viewYear}`}
                      onClick={() => handleSelectDay(dateObj)}
                      className={cn(
                        'relative z-10 flex size-9 items-center justify-center font-mono text-xs font-semibold tabular-nums transition-all outline-none',
                        // 04 Range Band Capping with squared inner corners
                        isSingleSelected && 'rounded-xl bg-[#0056FF] text-white shadow-xs',
                        isRangeStart &&
                          cn(
                            'bg-[#0056FF] text-white shadow-xs',
                            internalRange.end && !isRangeEnd
                              ? 'rounded-l-xl rounded-r-none'
                              : 'rounded-xl',
                          ),
                        isRangeEnd &&
                          cn(
                            'bg-[#0056FF] text-white shadow-xs',
                            internalRange.start && !isRangeStart
                              ? 'rounded-l-none rounded-r-xl'
                              : 'rounded-xl',
                          ),
                        isBetweenSelected && (isDark ? 'text-cyan-200' : 'text-cyan-900'),
                        isHoveredTarget &&
                          'rounded-r-xl border border-dashed border-[#0056FF] bg-cyan-500/20 text-[#0056FF]',
                        !isSingleSelected &&
                          !isRangeStart &&
                          !isRangeEnd &&
                          !isBetweenSelected &&
                          (isDark
                            ? 'rounded-xl text-slate-200 hover:bg-slate-800'
                            : 'rounded-xl text-slate-800 hover:bg-slate-100'),
                        // 07 Min/Max Bounds
                        isDisabled &&
                          'pointer-events-none cursor-not-allowed opacity-25 hover:bg-transparent',
                        // Focus ring
                        isFocused && 'ring-2 ring-[#0056FF]',
                      )}
                    >
                      {dayNum}

                      {/* 06 Today Marker: small underline bar under current day (Zero-Dot Standard) */}
                      {isToday && (
                        <span
                          className={cn(
                            'absolute bottom-1 h-0.5 w-3 rounded-[1px]',
                            isSingleSelected || isRangeStart || isRangeEnd
                              ? 'bg-white'
                              : 'bg-[#0056FF]',
                          )}
                        />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ======================================================== */}
          {/* FOOTER SHORTCUTS: One-click Today shortcut & Selected Info */}
          {/* ======================================================== */}
          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 font-mono text-[11px] dark:border-slate-800">
            <button
              type="button"
              onClick={handleSelectToday}
              className="flex items-center gap-1 font-bold text-[#0056FF] hover:underline dark:text-[#38BDF8]"
            >
              <span>Today</span>
            </button>

            <span className="text-slate-400">{isRange ? 'Range Mode' : 'Single Mode'}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * DatePickerDemo
 *
 * Interactive documentation library preview showcasing both Single and Range instances.
 */
export function DatePickerDemo() {
  const [singleDate, setSingleDate] = React.useState<LocalDate | null>({
    year: 2026,
    month: 10,
    day: 30,
  });

  const [dateRange, setDateRange] = React.useState<DateRange>({
    start: { year: 2026, month: 10, day: 24 },
    end: { year: 2026, month: 10, day: 30 },
  });

  return (
    <div className="w-full space-y-6">
      {/* Two Instances: Single Date & Date Range side by side */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Instance 1: Single Date Picker */}
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="space-y-1">
            <span className="font-mono text-[10px] font-bold tracking-wider text-[#0056FF] uppercase">
              Instance 01 &middot; Single Date
            </span>
            <h4 className="font-sans text-xs font-bold text-slate-900">
              Admissions Examination Date
            </h4>
          </div>

          <DatePicker mode="single" value={singleDate} onChange={setSingleDate} theme="light" />

          <div className="font-mono text-[11px] text-slate-400">
            Selected:{' '}
            <span className="font-bold text-slate-900">
              {singleDate ? formatLocalDate(singleDate) : 'None'}
            </span>
          </div>
        </div>

        {/* Instance 2: Date Range Picker */}
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="space-y-1">
            <span className="font-mono text-[10px] font-bold tracking-wider text-[#0056FF] uppercase">
              Instance 02 &middot; Date Range
            </span>
            <h4 className="font-sans text-xs font-bold text-slate-900">
              Academic Attendance Audit Window
            </h4>
          </div>

          <DatePicker
            mode="range"
            rangeValue={dateRange}
            onRangeChange={setDateRange}
            theme="light"
          />

          <div className="font-mono text-[11px] text-slate-400">
            Range:{' '}
            <span className="font-bold text-slate-900">
              {formatLocalDateRange(dateRange) || 'None'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
