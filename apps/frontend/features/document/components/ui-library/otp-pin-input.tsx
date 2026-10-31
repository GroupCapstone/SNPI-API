'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Key, Smartphone, ShieldCheck, Check, RotateCcw, CircleAlert } from '@/components/icons';

export interface OtpPinInputProps {
  length?: number;
  expectedPin?: string;
  theme?: 'light' | 'dark';
  className?: string;
  onComplete?: (pin: string) => void;
  onError?: (pin: string) => void;
  autoFocus?: boolean;
}

/**
 * OtpPinInput
 *
 * Implements the 8-pillar OTP / PIN Code Input architecture:
 * 01 Segmented Cells: Six independent inputs in a row, each holding exactly one numeric character with stable tabular widths.
 * 02 Auto-Advance: Typing a digit instantly forwards focus to the next empty cell.
 * 03 Smart Paste: Pasting a 6-digit code anywhere in the row strips non-digits and distributes one character per cell.
 * 04 Backspace Step-Back: Backspace on an empty cell jumps focus to the previous one and clears it.
 * 05 Filled vs. Empty: Filled cells get a subtle cyan tint so partial progress is obvious at a glance.
 * 06 Error Shake: A 500ms horizontal shake plus red recolor signals invalid codes without disrupting page layout.
 * 07 SMS Auto-Fill: autocomplete="one-time-code" lets iOS, Safari, and Chrome offer SMS codes inline above the keyboard.
 * 08 Live Status Region: An aria-live polite status line announces success or error without stealing focus.
 */
export function OtpPinInput({
  length = 6,
  expectedPin = '842910',
  theme = 'light',
  className,
  onComplete,
  onError,
  autoFocus = false,
}: OtpPinInputProps) {
  const [digits, setDigits] = React.useState<string[]>(Array(length).fill(''));
  const [status, setStatus] = React.useState<'idle' | 'validating' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = React.useState<string>(
    'Enter 6-digit verification code.',
  );
  const [isShaking, setIsShaking] = React.useState<boolean>(false);
  const inputsRef = React.useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first empty cell on mount if autoFocus is true
  React.useEffect(() => {
    if (autoFocus) {
      const firstEmpty = digits.findIndex((d) => d === '');
      const idx = firstEmpty !== -1 ? firstEmpty : 0;
      inputsRef.current[idx]?.focus();
    }
  }, [autoFocus]);

  // 06 Error Shake: 500ms timeout
  const triggerShake = React.useCallback((msg: string) => {
    setIsShaking(true);
    setStatus('error');
    setStatusMessage(msg);
    const timer = setTimeout(() => {
      setIsShaking(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Check pin verification
  const evaluatePin = React.useCallback(
    (pin: string) => {
      setStatus('validating');
      setStatusMessage('Validating one-time security code...');

      setTimeout(() => {
        if (pin === expectedPin) {
          setStatus('success');
          setStatusMessage('Security PIN verified successfully. Authentication approved.');
          onComplete?.(pin);
        } else {
          triggerShake(
            `Invalid verification code (${pin}). Check your SMS or email and try again.`,
          );
          onError?.(pin);
        }
      }, 350);
    },
    [expectedPin, onComplete, onError, triggerShake],
  );

  // 02 Auto-Advance Handler
  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const sanitized = rawValue.replace(/\D/g, '');

    if (!sanitized) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      setStatus('idle');
      setStatusMessage(`${newDigits.filter(Boolean).length} of ${length} digits entered.`);
      return;
    }

    // Extract the latest character
    const char = sanitized.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);

    const filledCount = newDigits.filter(Boolean).length;
    setStatus('idle');
    setStatusMessage(`${filledCount} of ${length} digits entered.`);

    // Auto-advance to next cell if not at the end
    if (index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    // Auto-submit when all cells are filled
    if (newDigits.every((d) => d !== '')) {
      const fullPin = newDigits.join('');
      evaluatePin(fullPin);
    }
  };

  // 04 Backspace Step-Back & Arrow Keys Navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        // Backspace on empty cell jumps focus to previous cell and clears it
        e.preventDefault();
        const newDigits = [...digits];
        newDigits[index - 1] = '';
        setDigits(newDigits);
        inputsRef.current[index - 1]?.focus();
        setStatus('idle');
        setStatusMessage(`${newDigits.filter(Boolean).length} of ${length} digits entered.`);
      } else if (digits[index]) {
        // Backspace on filled cell clears it in place
        const newDigits = [...digits];
        newDigits[index] = '';
        setDigits(newDigits);
        setStatus('idle');
        setStatusMessage(`${newDigits.filter(Boolean).length} of ${length} digits entered.`);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      inputsRef.current[index + 1]?.focus();
    }
  };

  // 03 Smart Paste: Strips non-digits and distributes across cells
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const numericOnly = pastedData.replace(/\D/g, '').slice(0, length);

    if (!numericOnly) return;

    const newDigits = [...digits];
    const chars = numericOnly.split('');
    chars.forEach((c, idx) => {
      newDigits[idx] = c;
    });

    setDigits(newDigits);

    // Focus either the next empty cell or the last cell
    const nextEmptyIndex = newDigits.findIndex((d) => d === '');
    if (nextEmptyIndex !== -1 && nextEmptyIndex < length) {
      inputsRef.current[nextEmptyIndex]?.focus();
      setStatus('idle');
      setStatusMessage(`${newDigits.filter(Boolean).length} of ${length} digits entered.`);
    } else {
      inputsRef.current[length - 1]?.focus();
      // Auto-submit if all filled
      if (newDigits.every((d) => d !== '')) {
        evaluatePin(newDigits.join(''));
      }
    }
  };

  const handleClear = () => {
    setDigits(Array(length).fill(''));
    setStatus('idle');
    setStatusMessage('Enter 6-digit verification code.');
    inputsRef.current[0]?.focus();
  };

  const handleQuickPaste = (code: string) => {
    const chars = code.replace(/\D/g, '').slice(0, length).split('');
    const newDigits = Array(length).fill('');
    chars.forEach((c, idx) => {
      newDigits[idx] = c;
    });
    setDigits(newDigits);
    inputsRef.current[length - 1]?.focus();
    if (newDigits.every((d) => d !== '')) {
      evaluatePin(newDigits.join(''));
    }
  };

  return (
    <div
      className={cn(
        'relative w-full max-w-lg overflow-hidden border-slate-200/90 bg-white text-slate-900 transition-colors duration-150 max-sm:rounded-none max-sm:border-x-0 max-sm:border-y sm:rounded-2xl sm:border',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <Key className="size-4 shrink-0 text-[#0056FF]" />
          <div>
            <h4 className="font-sans text-xs font-bold tracking-tight text-slate-950">
              Two-Factor Authentication
            </h4>
            <p className="font-mono text-[10px] text-slate-400">07 SMS Auto-Fill (one-time-code)</p>
          </div>
        </div>

        {/* State Badge */}
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-[4px] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase transition-colors',
            status === 'success'
              ? 'border border-emerald-500/20 bg-emerald-50 text-emerald-700'
              : status === 'error'
                ? 'border border-red-500/20 bg-red-50 text-red-700'
                : digits.some(Boolean)
                  ? 'border border-[#CAD3F5] bg-[#E3E7FC] text-[#0056FF]'
                  : 'bg-slate-100 text-slate-600',
          )}
        >
          {status === 'success' ? (
            <>
              <Check className="size-3" />
              <span>[VERIFIED]</span>
            </>
          ) : status === 'error' ? (
            <>
              <CircleAlert className="size-3" />
              <span>[INVALID CODE]</span>
            </>
          ) : digits.every(Boolean) ? (
            <span>[AUTO-CHECK]</span>
          ) : (
            <span>
              [{digits.filter(Boolean).length}/{length} DIGITS]
            </span>
          )}
        </span>
      </div>

      <div className="space-y-6 p-6 sm:p-8">
        <div className="space-y-1 text-center">
          <p className="font-sans text-xs font-semibold text-slate-900">
            Enter the 6-digit verification code sent to your registered telephone.
          </p>
          <p className="font-mono text-[11px] text-slate-400">
            SMS Target: +855 &bull;&bull; &bull;&bull;&bull; 678 &middot; Expected PIN:{' '}
            {expectedPin}
          </p>
        </div>

        {/* ======================================================== */}
        {/* 01 SEGMENTED CELLS & 06 ERROR SHAKE CONTAINER            */}
        {/* ======================================================== */}
        <div
          className={cn(
            'flex items-center justify-center gap-2 transition-transform sm:gap-3',
            isShaking && 'animate-shake',
          )}
          style={{
            animation: isShaking ? 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both' : undefined,
          }}
        >
          {digits.map((digit, idx) => {
            const isFilled = digit !== '';
            const isError = status === 'error';
            const isSuccess = status === 'success';

            return (
              <input
                key={idx}
                ref={(el) => {
                  inputsRef.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                // 07 SMS Auto-Fill
                autoComplete={idx === 0 ? 'one-time-code' : 'off'}
                value={digit}
                onChange={(e) => handleChange(idx, e)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                aria-label={`Digit ${idx + 1} of ${length}`}
                disabled={status === 'success'}
                className={cn(
                  // 01 Segmented Cells: Tabular width and fixed height
                  'size-11 rounded-[4px] border text-center font-mono text-xl font-bold tabular-nums transition-all duration-150 outline-none select-none sm:size-14 sm:text-2xl',
                  'focus:border-[#0056FF] focus:ring-2 focus:ring-[#0056FF]/30',
                  // 06 Error Shake Recolor
                  isError
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : isSuccess
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : isFilled
                        ? 'border-[#0056FF] bg-[#E3E7FC]/40 text-[#0056FF]'
                        : 'border-slate-300 bg-white text-slate-900 placeholder-slate-400',
                )}
              />
            );
          })}
        </div>

        {/* 08 Live Status Region: Announces status to assistive tech without stealing focus */}
        <div
          role="status"
          aria-live="polite"
          className={cn(
            'min-h-[20px] text-center font-mono text-xs font-medium transition-colors',
            status === 'error'
              ? 'font-bold text-red-600'
              : status === 'success'
                ? 'font-bold text-emerald-600'
                : 'text-slate-500',
          )}
        >
          {statusMessage}
        </div>

        {/* Interactive Testing Quick-Actions */}
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-[4px] border border-slate-200 bg-slate-50/70 p-3 font-mono text-[11px] text-slate-600">
          <span className="font-bold text-slate-400">Quick Test:</span>
          <button
            type="button"
            onClick={() => handleQuickPaste('842910')}
            className="rounded-[4px] border border-emerald-500/30 bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700 transition-colors hover:bg-emerald-100"
          >
            Paste 842910 (Valid)
          </button>
          <button
            type="button"
            onClick={() => handleQuickPaste('000000')}
            className="rounded-[4px] border border-red-500/30 bg-red-50 px-2 py-0.5 font-bold text-red-700 transition-colors hover:bg-red-100"
          >
            Paste 000000 (Shake)
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="rounded-[4px] border border-slate-300 bg-white px-2 py-0.5 font-bold text-slate-700 transition-colors hover:text-slate-950"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Footer Details */}
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3 font-mono text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <Smartphone className="size-3.5 text-slate-400" />
          <span>Didn&apos;t receive code? Resend SMS in 42s</span>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <span className="text-slate-400">&bull;</span>
          <span>Security Protocol FIDO2/RFC 6238</span>
        </div>
      </div>

      {/* CSS Keyframe for Error Shake */}
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          15%,
          45%,
          75% {
            transform: translateX(-6px);
          }
          30%,
          60%,
          90% {
            transform: translateX(6px);
          }
        }
      `}</style>
    </div>
  );
}

/**
 * OtpPinInputInteractiveDemo
 *
 * Interactive documentation library preview wrapper with light/dark toggle.
 */
export function OtpPinInputInteractiveDemo() {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-500 uppercase">
          <span>6-Digit Institutional Passcode</span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
          <ShieldCheck className="size-3 text-emerald-500" />
          <span>Auto-Advance & Smart Paste Active</span>
        </div>
      </div>

      <div className="flex justify-center py-4">
        <OtpPinInput theme="light" />
      </div>
    </div>
  );
}
