'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Check,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Edit2,
  User,
  Building,
  Lock,
  FileText,
} from '@/components/icons';

export interface WizardFormData {
  // Step 1: Identity
  fullName: string;
  email: string;
  role: string;
  // Step 2: Campus
  branch: string;
  phone: string;
  idNumber: string;
  // Step 3: Preferences
  notificationChannel: string;
  mfaMethod: string;
  term: string;
  // Step 4: Summary / Confirmation
  termsAccepted: boolean;
}

export const INITIAL_WIZARD_DATA: WizardFormData = {
  fullName: '',
  email: '',
  role: 'Student Applicant',
  branch: 'Main Campus (Phnom Penh)',
  phone: '',
  idNumber: '',
  notificationChannel: 'Email & SMS',
  mfaMethod: 'Time-Based Authenticator (TOTP)',
  term: 'Semester 1 - 2026/2027',
  termsAccepted: false,
};

const STORAGE_KEY = 'snp_multi_step_wizard_form_state_v1';

export interface MultiStepWizardProps {
  theme?: 'light' | 'dark';
  className?: string;
  onComplete?: (data: WizardFormData) => void;
}

export const WIZARD_STEPS = [
  { id: 1, title: 'Identity', subtitle: 'Legal Details', icon: User },
  { id: 2, title: 'Campus', subtitle: 'Branch & Phone', icon: Building },
  { id: 3, title: 'Security', subtitle: 'MFA & Term', icon: Lock },
  { id: 4, title: 'Review', subtitle: 'Final Summary', icon: FileText },
];

/**
 * MultiStepWizard
 *
 * Implements the 10-point Multi-Step Form Wizard architecture:
 * 01 Step Indicator: Numbered dots switching between pending, active, complete states.
 * 02 Progress Bar: 2px gradient fill across the top indicating completion.
 * 03 Step Panel: Scoped fieldsets with headings and aria-labelledby.
 * 04 Validation: Per-field validation with inline error regions via aria-live.
 * 05 Next / Back: Controls that advance/rewind, next disabled until current step is valid.
 * 06 Summary Step: Final read-only review with inline Edit links to jump back.
 * 07 Persistence: Mirrored to sessionStorage so page refresh preserves progress.
 * 08 ARIA Live: Inline error messages & success panel announce without stealing focus.
 * 09 Transitions: Horizontal slide with cubic-bezier ease & reduced motion fallback.
 * 10 Success State: Animated check, confirmation copy, and restart button.
 */
export function MultiStepWizard({ theme = 'light', className, onComplete }: MultiStepWizardProps) {
  const isDark = theme === 'dark';

  // 07 Persistence: Form state and step mirrored to sessionStorage
  const [formData, setFormData] = React.useState<WizardFormData>(INITIAL_WIZARD_DATA);
  const [step, setStep] = React.useState<number>(1);
  const [direction, setDirection] = React.useState<'forward' | 'backward'>('forward');
  const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false);
  const [submissionId, setSubmissionId] = React.useState<string>('');
  const [touchedFields, setTouchedFields] = React.useState<Record<string, boolean>>({});

  // 09 Reduced Motion Fallback
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mq.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mq.addEventListener?.('change', listener);
      return () => mq.removeEventListener?.('change', listener);
    }
  }, []);

  // Hydrate from sessionStorage once on mount
  React.useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.data) setFormData(parsed.data);
        if (parsed.step && parsed.step >= 1 && parsed.step <= 4) setStep(parsed.step);
      }
    } catch {
      // sessionStorage unavailable
    }
  }, []);

  // Save changes to sessionStorage
  React.useEffect(() => {
    if (isSubmitted) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ data: formData, step }));
    } catch {
      // storage quota or private browsing
    }
  }, [formData, step, isSubmitted]);

  // 04 Validation: Real-time per-field rules
  const errors = React.useMemo(() => {
    const errs: Record<string, string> = {};

    // Step 1 rules
    if (!formData.fullName.trim()) {
      errs.fullName = 'Full legal name is required.';
    } else if (formData.fullName.trim().length < 3) {
      errs.fullName = 'Name must be at least 3 characters.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Institutional email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    // Step 2 rules
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!/^\+?[0-9\s-]{8,15}$/.test(formData.phone.trim())) {
      errs.phone = 'Enter a valid telephone number (8-15 digits).';
    }

    if (!formData.idNumber.trim()) {
      errs.idNumber = 'National ID or passport number is required.';
    } else if (formData.idNumber.trim().length < 6) {
      errs.idNumber = 'Identification must be at least 6 characters.';
    }

    // Step 4 rules
    if (step === 4 && !formData.termsAccepted) {
      errs.termsAccepted = 'You must accept the enrollment terms.';
    }

    return errs;
  }, [formData, step]);

  // Determine if current step is fully valid
  const isCurrentStepValid = React.useMemo(() => {
    if (step === 1) return !errors.fullName && !errors.email;
    if (step === 2) return !errors.phone && !errors.idNumber;
    if (step === 3) return true; // Dropdowns have valid defaults
    if (step === 4) return formData.termsAccepted;
    return true;
  }, [step, errors, formData.termsAccepted]);

  const handleChange = (
    field: keyof WizardFormData,
    value: WizardFormData[keyof WizardFormData],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: string) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  const goToStep = (targetStep: number) => {
    if (targetStep < step) {
      setDirection('backward');
      setStep(targetStep);
    } else if (targetStep > step && isCurrentStepValid) {
      setDirection('forward');
      setStep(targetStep);
    }
  };

  const handleNext = () => {
    if (!isCurrentStepValid) return;
    if (step < 4) {
      setDirection('forward');
      setStep((s) => s + 1);
    } else {
      // 10 Success State
      const txId = `SNPI-APP-${Date.now().toString(36).toUpperCase()}`;
      setSubmissionId(txId);
      setIsSubmitted(true);
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
      onComplete?.(formData);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setDirection('backward');
      setStep((s) => s - 1);
    }
  };

  const handleRestart = () => {
    setFormData(INITIAL_WIZARD_DATA);
    setStep(1);
    setDirection('forward');
    setIsSubmitted(false);
    setTouchedFields({});
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  // 02 Progress Bar Percentage (Step 1: 25%, Step 2: 50%, Step 3: 75%, Step 4: 100%)
  const progressPercent = (step / 4) * 100;

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden border-slate-200/90 bg-white text-slate-900 transition-colors duration-150 max-sm:rounded-none max-sm:border-x-0 max-sm:border-y sm:rounded-2xl sm:border',
        className,
      )}
    >
      {/* ======================================================== */}
      {/* 02 PROGRESS BAR: 2px solid Royal Blue fill across top of form */}
      {/* ======================================================== */}
      <div className="relative h-[2px] w-full overflow-hidden bg-slate-100">
        <div
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-full bg-[#0056FF] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* ======================================================== */}
      {/* 01 STEP INDICATOR: Pending, Active, Complete states       */}
      {/* ======================================================== */}
      <div
        className={cn(
          'border-b px-5 py-4 sm:px-8',
          isDark ? 'border-slate-800 bg-slate-900/40' : 'border-slate-100 bg-slate-50/50',
        )}
      >
        <div className="flex items-center justify-between">
          {WIZARD_STEPS.map((s, idx) => {
            const isCompleted = step > s.id;
            const isActive = step === s.id;
            const isPending = step < s.id;

            return (
              <React.Fragment key={s.id}>
                <button
                  type="button"
                  onClick={() => goToStep(s.id)}
                  disabled={isPending}
                  aria-current={isActive ? 'step' : undefined}
                  className={cn(
                    'group flex items-center gap-2.5 transition-all outline-none',
                    isPending
                      ? 'cursor-not-allowed opacity-50'
                      : 'cursor-pointer hover:opacity-100',
                  )}
                >
                  {/* Numbered Indicator Dot */}
                  <span
                    className={cn(
                      'flex size-7 items-center justify-center rounded-[4px] font-mono text-xs font-bold transition-all duration-200',
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isActive
                          ? 'border-2 border-[#0056FF] bg-[#0056FF] text-white shadow-xs'
                          : isDark
                            ? 'border border-slate-700 bg-slate-800 text-slate-400'
                            : 'border border-slate-300 bg-white text-slate-500',
                    )}
                  >
                    {isCompleted ? <Check className="size-3.5 stroke-[2.5]" /> : s.id}
                  </span>

                  {/* Step Title & Subtitle */}
                  <div className="hidden text-left sm:block">
                    <p
                      className={cn(
                        'font-mono text-[11px] font-bold tracking-tight uppercase',
                        isActive
                          ? isDark
                            ? 'text-white'
                            : 'text-slate-950'
                          : isCompleted
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-slate-400',
                      )}
                    >
                      {s.title}
                    </p>
                    <p className="font-sans text-[10px] text-slate-500">{s.subtitle}</p>
                  </div>
                </button>

                {/* Connecting Track Line */}
                {idx < WIZARD_STEPS.length - 1 && (
                  <div
                    className={cn(
                      'mx-2 h-[1px] flex-1 transition-colors duration-200',
                      step > s.id ? 'bg-emerald-600/70' : isDark ? 'bg-slate-800' : 'bg-slate-200',
                    )}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 10 SUCCESS STATE: Rendered after submit                   */}
      {/* ======================================================== */}
      {isSubmitted ? (
        <div
          role="status"
          aria-live="polite"
          className="flex flex-col items-center justify-center space-y-4 p-8 text-center sm:p-12"
        >
          {/* Animated SVG Checkmark */}
          <div className="relative flex size-16 items-center justify-center rounded-[4px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <svg
              className="size-10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <div className="space-y-1">
            <h3 className="font-sans text-xl font-bold tracking-tight text-slate-950 sm:text-2xl dark:text-white">
              Admissions Dossier Registered
            </h3>
            <p className="max-w-sm font-sans text-xs text-slate-500">
              Your application has been logged into the SNPI multi-branch admissions database.
            </p>
          </div>

          {/* Reference Stamp */}
          <div
            className={cn(
              'space-y-1 rounded-[4px] border p-3 font-mono text-xs',
              isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-slate-50',
            )}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-slate-400">REF:</span>
              <span className="font-bold text-[#0056FF] dark:text-[#38BDF8]">{submissionId}</span>
            </div>
            <div className="text-[10px] text-slate-400">
              CANDIDATE: {formData.fullName} ({formData.role})
            </div>
          </div>

          {/* Restart button */}
          <button
            type="button"
            onClick={handleRestart}
            className="flex items-center gap-2 rounded-[4px] border-0 bg-[#0056FF] px-4 py-2 font-mono text-xs font-bold text-white shadow-xs transition-colors hover:bg-blue-700"
          >
            <RotateCcw className="size-3.5" />
            <span>START NEW SUBMISSION</span>
          </button>
        </div>
      ) : (
        /* ======================================================== */
        /* 03 STEP PANELS & 09 TRANSITIONS (Direction-Aware Slide)  */
        /* ======================================================== */
        <div className="p-6 sm:p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleNext();
            }}
          >
            {/* STEP 1: Identity & Legal Name */}
            {step === 1 && (
              <fieldset
                aria-labelledby="step1-heading"
                className={cn(
                  'space-y-4',
                  prefersReducedMotion
                    ? 'transition-opacity duration-200'
                    : 'animate-in fade-in-50 duration-300',
                  direction === 'forward' ? 'slide-in-from-right-4' : 'slide-in-from-left-4',
                )}
              >
                <legend id="step1-heading" className="space-y-1 pb-2">
                  <span className="font-mono text-[10px] font-bold tracking-wider text-[#0056FF] uppercase dark:text-[#38BDF8]">
                    Step 01 / 04 &middot; Identification
                  </span>
                  <h3 className="font-sans text-lg font-bold text-slate-950 dark:text-white">
                    Personal & Applicant Details
                  </h3>
                </legend>

                {/* Full Legal Name */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="fullName"
                    className="block font-mono text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    Full Legal Name *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    onBlur={() => handleBlur('fullName')}
                    aria-invalid={touchedFields.fullName && !!errors.fullName}
                    aria-describedby={
                      touchedFields.fullName && errors.fullName ? 'fullName-error' : undefined
                    }
                    placeholder="e.g. Chan Dara"
                    className={cn(
                      'w-full rounded-[4px] border px-3.5 py-2 font-sans text-xs transition-colors outline-none',
                      touchedFields.fullName && errors.fullName
                        ? 'border-red-500 focus:border-red-500'
                        : isDark
                          ? 'border-slate-700 bg-slate-900 text-white focus:border-[#38BDF8]'
                          : 'border-slate-300 bg-white text-slate-900 focus:border-[#0056FF]',
                    )}
                  />
                  {/* 08 ARIA Live Inline Error */}
                  {touchedFields.fullName && errors.fullName && (
                    <p
                      id="fullName-error"
                      role="status"
                      aria-live="polite"
                      className="font-mono text-[11px] text-red-500"
                    >
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Institutional Email */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="block font-mono text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    Institutional Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    aria-invalid={touchedFields.email && !!errors.email}
                    aria-describedby={
                      touchedFields.email && errors.email ? 'email-error' : undefined
                    }
                    placeholder="applicant@campus.snpi.edu.kh"
                    className={cn(
                      'w-full rounded-[4px] border px-3.5 py-2 font-sans text-xs transition-colors outline-none',
                      touchedFields.email && errors.email
                        ? 'border-red-500 focus:border-red-500'
                        : isDark
                          ? 'border-slate-700 bg-slate-900 text-white focus:border-[#38BDF8]'
                          : 'border-slate-300 bg-white text-slate-900 focus:border-[#0056FF]',
                    )}
                  />
                  {/* 08 ARIA Live Inline Error */}
                  {touchedFields.email && errors.email && (
                    <p
                      id="email-error"
                      role="status"
                      aria-live="polite"
                      className="font-mono text-[11px] text-red-500"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Role / Affiliation */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="role"
                    className="block font-mono text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    Applicant Affiliation
                  </label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                    className={cn(
                      'w-full rounded-[4px] border px-3.5 py-2 font-sans text-xs transition-colors outline-none',
                      isDark
                        ? 'border-slate-700 bg-slate-900 text-white focus:border-[#38BDF8]'
                        : 'border-slate-300 bg-white text-slate-900 focus:border-[#0056FF]',
                    )}
                  >
                    <option value="Student Applicant">Student Applicant</option>
                    <option value="Faculty Staff">Faculty Staff</option>
                    <option value="Department Admin">Department Admin</option>
                    <option value="Lab Researcher">Lab Researcher</option>
                  </select>
                </div>
              </fieldset>
            )}

            {/* STEP 2: Campus & Contact Details */}
            {step === 2 && (
              <fieldset
                aria-labelledby="step2-heading"
                className={cn(
                  'space-y-4',
                  prefersReducedMotion
                    ? 'transition-opacity duration-200'
                    : 'animate-in fade-in-50 duration-300',
                  direction === 'forward' ? 'slide-in-from-right-4' : 'slide-in-from-left-4',
                )}
              >
                <legend id="step2-heading" className="space-y-1 pb-2">
                  <span className="font-mono text-[10px] font-bold tracking-wider text-[#0056FF] uppercase dark:text-[#38BDF8]">
                    Step 02 / 04 &middot; Campus & Contact
                  </span>
                  <h3 className="font-sans text-lg font-bold text-slate-950 dark:text-white">
                    Campus Branch & Telephone
                  </h3>
                </legend>

                {/* Campus Branch */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="branch"
                    className="block font-mono text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    Designated Branch Campus *
                  </label>
                  <select
                    id="branch"
                    value={formData.branch}
                    onChange={(e) => handleChange('branch', e.target.value)}
                    className={cn(
                      'w-full rounded-[4px] border px-3.5 py-2 font-sans text-xs transition-colors outline-none',
                      isDark
                        ? 'border-slate-700 bg-slate-900 text-white focus:border-[#38BDF8]'
                        : 'border-slate-300 bg-white text-slate-900 focus:border-[#0056FF]',
                    )}
                  >
                    <option value="Main Campus (Phnom Penh)">Main Campus (Phnom Penh)</option>
                    <option value="Siem Reap Branch">Siem Reap Branch</option>
                    <option value="Battambang Campus">Battambang Campus</option>
                    <option value="Kompong Cham Center">Kompong Cham Center</option>
                  </select>
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="phone"
                    className="block font-mono text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    Telephone / Telegram Number *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    aria-invalid={touchedFields.phone && !!errors.phone}
                    aria-describedby={
                      touchedFields.phone && errors.phone ? 'phone-error' : undefined
                    }
                    placeholder="+855 12 345 678"
                    className={cn(
                      'w-full rounded-[4px] border px-3.5 py-2 font-sans text-xs transition-colors outline-none',
                      touchedFields.phone && errors.phone
                        ? 'border-red-500 focus:border-red-500'
                        : isDark
                          ? 'border-slate-700 bg-slate-900 text-white focus:border-[#38BDF8]'
                          : 'border-slate-300 bg-white text-slate-900 focus:border-[#0056FF]',
                    )}
                  />
                  {touchedFields.phone && errors.phone && (
                    <p
                      id="phone-error"
                      role="status"
                      aria-live="polite"
                      className="font-mono text-[11px] text-red-500"
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* ID Number */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="idNumber"
                    className="block font-mono text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    National ID / Passport Number *
                  </label>
                  <input
                    id="idNumber"
                    type="text"
                    required
                    value={formData.idNumber}
                    onChange={(e) => handleChange('idNumber', e.target.value)}
                    onBlur={() => handleBlur('idNumber')}
                    aria-invalid={touchedFields.idNumber && !!errors.idNumber}
                    aria-describedby={
                      touchedFields.idNumber && errors.idNumber ? 'idNumber-error' : undefined
                    }
                    placeholder="KH-9842104"
                    className={cn(
                      'w-full rounded-[4px] border px-3.5 py-2 font-sans text-xs transition-colors outline-none',
                      touchedFields.idNumber && errors.idNumber
                        ? 'border-red-500 focus:border-red-500'
                        : isDark
                          ? 'border-slate-700 bg-slate-900 text-white focus:border-[#38BDF8]'
                          : 'border-slate-300 bg-white text-slate-900 focus:border-[#0056FF]',
                    )}
                  />
                  {touchedFields.idNumber && errors.idNumber && (
                    <p
                      id="idNumber-error"
                      role="status"
                      aria-live="polite"
                      className="font-mono text-[11px] text-red-500"
                    >
                      {errors.idNumber}
                    </p>
                  )}
                </div>
              </fieldset>
            )}

            {/* STEP 3: Preferences & MFA Security */}
            {step === 3 && (
              <fieldset
                aria-labelledby="step3-heading"
                className={cn(
                  'space-y-4',
                  prefersReducedMotion
                    ? 'transition-opacity duration-200'
                    : 'animate-in fade-in-50 duration-300',
                  direction === 'forward' ? 'slide-in-from-right-4' : 'slide-in-from-left-4',
                )}
              >
                <legend id="step3-heading" className="space-y-1 pb-2">
                  <span className="font-mono text-[10px] font-bold tracking-wider text-[#0056FF] uppercase dark:text-[#38BDF8]">
                    Step 03 / 04 &middot; Security & Preferences
                  </span>
                  <h3 className="font-sans text-lg font-bold text-slate-950 dark:text-white">
                    Two-Factor Auth & Term
                  </h3>
                </legend>

                {/* MFA Method */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="mfaMethod"
                    className="block font-mono text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    Authentication Protection Method
                  </label>
                  <select
                    id="mfaMethod"
                    value={formData.mfaMethod}
                    onChange={(e) => handleChange('mfaMethod', e.target.value)}
                    className={cn(
                      'w-full rounded-[4px] border px-3.5 py-2 font-sans text-xs transition-colors outline-none',
                      isDark
                        ? 'border-slate-700 bg-slate-900 text-white focus:border-[#38BDF8]'
                        : 'border-slate-300 bg-white text-slate-900 focus:border-[#0056FF]',
                    )}
                  >
                    <option value="Time-Based Authenticator (TOTP)">
                      Time-Based Authenticator (TOTP)
                    </option>
                    <option value="Hardware Security Key (FIDO2)">
                      Hardware Security Key (FIDO2)
                    </option>
                    <option value="SMS Verification Code">SMS Verification Code</option>
                  </select>
                </div>

                {/* Academic Term */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="term"
                    className="block font-mono text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    Enrollment Academic Term
                  </label>
                  <select
                    id="term"
                    value={formData.term}
                    onChange={(e) => handleChange('term', e.target.value)}
                    className={cn(
                      'w-full rounded-[4px] border px-3.5 py-2 font-sans text-xs transition-colors outline-none',
                      isDark
                        ? 'border-slate-700 bg-slate-900 text-white focus:border-[#38BDF8]'
                        : 'border-slate-300 bg-white text-slate-900 focus:border-[#0056FF]',
                    )}
                  >
                    <option value="Semester 1 - 2026/2027">Semester 1 - 2026/2027</option>
                    <option value="Semester 2 - 2026/2027">Semester 2 - 2026/2027</option>
                    <option value="Summer Intensive 2026">Summer Intensive 2026</option>
                  </select>
                </div>

                {/* Notification Channel */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="notificationChannel"
                    className="block font-mono text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    Notification Delivery Preference
                  </label>
                  <select
                    id="notificationChannel"
                    value={formData.notificationChannel}
                    onChange={(e) => handleChange('notificationChannel', e.target.value)}
                    className={cn(
                      'w-full rounded-[4px] border px-3.5 py-2 font-sans text-xs transition-colors outline-none',
                      isDark
                        ? 'border-slate-700 bg-slate-900 text-white focus:border-[#38BDF8]'
                        : 'border-slate-300 bg-white text-slate-900 focus:border-[#0056FF]',
                    )}
                  >
                    <option value="Email & SMS">Email & SMS</option>
                    <option value="Email Only">Email Only</option>
                    <option value="SMS Only">SMS Only</option>
                  </select>
                </div>
              </fieldset>
            )}

            {/* ======================================================== */}
            {/* 06 SUMMARY STEP: Read-only review with inline edit links */}
            {/* ======================================================== */}
            {step === 4 && (
              <fieldset
                aria-labelledby="step4-heading"
                className={cn(
                  'space-y-4',
                  prefersReducedMotion
                    ? 'transition-opacity duration-200'
                    : 'animate-in fade-in-50 duration-300',
                  direction === 'forward' ? 'slide-in-from-right-4' : 'slide-in-from-left-4',
                )}
              >
                <legend id="step4-heading" className="space-y-1 pb-2">
                  <span className="font-mono text-[10px] font-bold tracking-wider text-[#0056FF] uppercase dark:text-[#38BDF8]">
                    Step 04 / 04 &middot; Summary & Review
                  </span>
                  <h3 className="font-sans text-lg font-bold text-slate-950 dark:text-white">
                    Review Application Details
                  </h3>
                </legend>

                {/* Group 1 Review Card */}
                <div
                  className={cn(
                    'rounded-[4px] border p-4 transition-colors',
                    isDark
                      ? 'border-slate-800 bg-slate-900/50'
                      : 'border-slate-200/90 bg-slate-50/70',
                  )}
                >
                  <div className="mb-2 flex items-center justify-between border-b border-slate-200/60 pb-2 dark:border-slate-800">
                    <span className="font-mono text-xs font-bold text-[#0056FF] dark:text-[#38BDF8]">
                      01. IDENTITY DETAILS
                    </span>
                    <button
                      type="button"
                      onClick={() => goToStep(1)}
                      className="flex items-center gap-1 font-mono text-[11px] font-bold text-slate-500 transition-colors hover:text-[#0056FF]"
                    >
                      <Edit2 className="size-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                  <dl className="grid grid-cols-2 gap-2 font-sans text-xs">
                    <div>
                      <dt className="text-slate-400">Name:</dt>
                      <dd className="font-medium text-slate-900 dark:text-white">
                        {formData.fullName || '—'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-400">Email:</dt>
                      <dd className="truncate font-medium text-slate-900 dark:text-white">
                        {formData.email || '—'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-400">Role:</dt>
                      <dd className="font-medium text-slate-900 dark:text-white">
                        {formData.role}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Group 2 Review Card */}
                <div
                  className={cn(
                    'rounded-[4px] border p-4 transition-colors',
                    isDark
                      ? 'border-slate-800 bg-slate-900/50'
                      : 'border-slate-200/90 bg-slate-50/70',
                  )}
                >
                  <div className="mb-2 flex items-center justify-between border-b border-slate-200/60 pb-2 dark:border-slate-800">
                    <span className="font-mono text-xs font-bold text-[#0056FF] dark:text-[#38BDF8]">
                      02. CAMPUS ALLOCATION
                    </span>
                    <button
                      type="button"
                      onClick={() => goToStep(2)}
                      className="flex items-center gap-1 font-mono text-[11px] font-bold text-slate-500 transition-colors hover:text-[#0056FF]"
                    >
                      <Edit2 className="size-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                  <dl className="grid grid-cols-2 gap-2 font-sans text-xs">
                    <div>
                      <dt className="text-slate-400">Branch:</dt>
                      <dd className="font-medium text-slate-900 dark:text-white">
                        {formData.branch}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-400">Phone:</dt>
                      <dd className="font-medium text-slate-900 dark:text-white">
                        {formData.phone || '—'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-400">ID / Passport:</dt>
                      <dd className="font-medium text-slate-900 dark:text-white">
                        {formData.idNumber || '—'}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Group 3 Review Card */}
                <div
                  className={cn(
                    'rounded-[4px] border p-4 transition-colors',
                    isDark
                      ? 'border-slate-800 bg-slate-900/50'
                      : 'border-slate-200/90 bg-slate-50/70',
                  )}
                >
                  <div className="mb-2 flex items-center justify-between border-b border-slate-200/60 pb-2 dark:border-slate-800">
                    <span className="font-mono text-xs font-bold text-[#0056FF] dark:text-[#38BDF8]">
                      03. SECURITY & PREFERENCES
                    </span>
                    <button
                      type="button"
                      onClick={() => goToStep(3)}
                      className="flex items-center gap-1 font-mono text-[11px] font-bold text-slate-500 transition-colors hover:text-[#0056FF]"
                    >
                      <Edit2 className="size-3" />
                      <span>Edit</span>
                    </button>
                  </div>
                  <dl className="grid grid-cols-2 gap-2 font-sans text-xs">
                    <div>
                      <dt className="text-slate-400">MFA Method:</dt>
                      <dd className="font-medium text-slate-900 dark:text-white">
                        {formData.mfaMethod}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-400">Term:</dt>
                      <dd className="font-medium text-slate-900 dark:text-white">
                        {formData.term}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Terms Checkbox */}
                <div className="pt-2">
                  <label className="flex cursor-pointer items-start gap-2.5">
                    <input
                      type="checkbox"
                      checked={formData.termsAccepted}
                      onChange={(e) => handleChange('termsAccepted', e.target.checked)}
                      className="mt-0.5 size-4 rounded border-slate-300 text-[#0056FF] focus:ring-[#0056FF]"
                    />
                    <span className="font-sans text-xs text-slate-600 dark:text-slate-400">
                      I certify that all provided details are authentic and comply with SNPI-SMS
                      institutional admissions governance.
                    </span>
                  </label>
                  {touchedFields.termsAccepted && errors.termsAccepted && (
                    <p
                      role="status"
                      aria-live="polite"
                      className="mt-1 font-mono text-[11px] text-red-500"
                    >
                      {errors.termsAccepted}
                    </p>
                  )}
                </div>
              </fieldset>
            )}

            {/* ======================================================== */}
            {/* 05 NEXT / BACK: Footer controls with validation gating    */}
            {/* ======================================================== */}
            <div
              className={cn(
                'mt-6 flex items-center justify-between border-t pt-4',
                isDark ? 'border-slate-800' : 'border-slate-100',
              )}
            >
              <button
                type="button"
                onClick={handleBack}
                disabled={step === 1}
                className={cn(
                  'flex items-center gap-1.5 rounded-[4px] border px-3.5 py-2 font-mono text-xs font-bold transition-colors outline-none',
                  step === 1
                    ? 'cursor-not-allowed opacity-40'
                    : isDark
                      ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-[#0056FF]',
                )}
              >
                <ArrowLeft className="size-3.5" />
                <span>BACK</span>
              </button>

              <div className="flex items-center gap-3">
                <span className="hidden font-mono text-[11px] text-slate-400 sm:inline-block">
                  Step {step} of 4
                </span>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isCurrentStepValid}
                  className={cn(
                    'flex items-center gap-1.5 rounded-[4px] border-0 px-4 py-2 font-mono text-xs font-bold shadow-xs transition-all outline-none',
                    !isCurrentStepValid
                      ? 'cursor-not-allowed bg-slate-300 text-slate-500 opacity-60 dark:bg-slate-800 dark:text-slate-500'
                      : 'bg-[#0056FF] text-white hover:bg-blue-700 active:scale-[0.98]',
                  )}
                >
                  <span>{step === 4 ? 'CONFIRM & SUBMIT' : 'NEXT STEP'}</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

/**
 * MultiStepWizardInteractiveDemo
 *
 * Demo wrapper featuring theme toggle, persistence reset, and status header.
 */
export function MultiStepWizardInteractiveDemo() {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-500 uppercase">
          <span>Candidate Enrollment Pipeline</span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
          <span className="inline-flex items-center rounded-[4px] border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
            SESSION ACTIVE
          </span>
          <span>sessionStorage Persistence Active</span>
        </div>
      </div>

      <MultiStepWizard theme="light" />
    </div>
  );
}
