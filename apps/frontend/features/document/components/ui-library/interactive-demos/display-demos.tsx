'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Folder,
  FileText,
  Copy,
  Check,
  Play,
  Pause,
  RotateCcw,
  Volume,
  ChevronDown,
  ArrowRight,
  Sparkles,
} from '@/components/icons';

// 1. Folder Component (Interactive Expanding Folder Tab)
export function FolderDemo() {
  const [isOpen, setIsOpen] = React.useState(false);

  const files = [
    { name: 'Enrollment_Report_2026.pdf', size: '2.4 MB', type: 'PDF' },
    { name: 'Tuition_Ledger_Q1.xlsx', size: '1.1 MB', type: 'XLSX' },
    { name: 'Teacher_Syllabus.docx', size: '850 KB', type: 'DOCX' },
  ];

  return (
    <div className="w-full max-w-lg space-y-4 max-sm:rounded-none max-sm:border-y max-sm:border-x-0 sm:rounded-2xl sm:border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <span className="font-sans text-xs font-bold tracking-wider text-slate-800 uppercase">
          Interactive Document Folder
        </span>
        <span className="font-mono text-[10px] text-slate-400">Institutional Archive</span>
      </div>

      <div className="w-full text-left">
        <div
          className={cn(
            'rounded-[4px] border p-4 transition-all',
            isOpen
              ? 'border-[#0056FF] bg-[#E3E7FC]/20 shadow-xs'
              : 'border-slate-200 bg-slate-50/70 hover:border-slate-300',
          )}
        >
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex w-full items-center justify-between text-left focus:outline-none cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Folder className="size-5 text-[#0056FF]" />
              <div>
                <h4 className="font-sans text-sm font-bold text-slate-900">
                  Academic Records / Term 1
                </h4>
                <span className="font-mono text-[10px] text-slate-500">3 Verified Documents</span>
              </div>
            </div>
            <span className="rounded-[4px] border border-slate-200 bg-white px-2.5 py-1 font-mono text-[10px] font-bold text-[#0056FF]">
              {isOpen ? 'Close Folder' : 'Open Folder'}
            </span>
          </button>

          {isOpen && (
            <div className="animate-in fade-in slide-in-from-top-1 mt-3.5 space-y-2 border-t border-slate-200/80 pt-3">
              {files.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-[4px] border border-slate-200/60 bg-white px-3 py-2 text-xs transition-colors hover:border-[#0056FF]/40"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="size-4 text-slate-500" />
                    <span className="font-sans font-medium text-slate-800">{f.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-[4px] bg-slate-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-600">
                      {f.type}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">{f.size}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 2. Code Block Component
export function CodeBlockDemo() {
  const [copied, setCopied] = React.useState(false);
  const code = `import { DatabasePool } from '@snp/shared';

export const ledgerConfig = {
  replicaSet: 'rs0',
  maxPoolSize: 100,
  timeoutMs: 5000,
};`;

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-md">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="rounded-[3px] bg-slate-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-700">
            CODE
          </span>
          <span className="font-mono text-[10px] font-bold text-slate-600">ledger.ts</span>
        </div>
        <button
          type="button"
          onClick={copyCode}
          className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 font-mono text-[10px] text-slate-700 hover:bg-slate-50"
        >
          {copied ? <Check className="size-3 text-emerald-600" /> : <Copy className="size-3" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#09172B]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// 3. Gravity Letters Component
export function GravityLettersDemo() {
  const [dropped, setDropped] = React.useState(false);
  const letters = 'SNPI-SMS ACADEMICS'.split('');

  return (
    <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <span className="font-sans text-xs font-bold tracking-wider text-slate-800 uppercase">
          Gravity Letters Simulation
        </span>
        <button
          type="button"
          onClick={() => setDropped(!dropped)}
          className="rounded-full bg-[#E3E7FC] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#0056FF]"
        >
          {dropped ? 'Reset Position' : 'Trigger Gravity'}
        </button>
      </div>

      <div className="flex min-h-[90px] items-center justify-center gap-1 overflow-hidden py-4 select-none">
        {letters.map((char, idx) => {
          const rotation = dropped ? ((idx % 3) - 1) * 14 : 0;
          const dropY = dropped ? 18 + (idx % 4) * 5 : 0;

          return (
            <span
              key={idx}
              className={cn(
                'inline-block font-sans text-xl font-black text-[#0056FF] transition-all duration-300 sm:text-2xl',
                char === ' ' ? 'w-2' : '',
              )}
              style={{
                transform: `translateY(${dropY}px) rotate(${rotation}deg)`,
                transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              {char}
            </span>
          );
        })}
      </div>

      <p className="font-sans text-xs text-slate-500">
        Simulates physics-based Newtonian drop and ground bounce on typography.
      </p>
    </div>
  );
}

// 4. GitHub Activity Component (Contribution Heat Map)
export function GitHubActivityDemo() {
  const weeks = Array.from({ length: 18 }, () =>
    Array.from({ length: 5 }, () => Math.floor(Math.random() * 4)),
  );

  const colors = [
    'bg-slate-100', // 0
    'bg-blue-200', // 1
    'bg-blue-400', // 2
    'bg-[#0056FF]', // 3
  ];

  return (
    <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <span className="font-sans text-xs font-bold tracking-wider text-slate-800 uppercase">
          Monorepo Git Activity Heatmap
        </span>
        <span className="font-mono text-xs font-bold text-[#0056FF]">342 Commits</span>
      </div>

      <div className="flex justify-center gap-1 overflow-x-auto py-2">
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-1">
            {week.map((level, dIdx) => (
              <div
                key={dIdx}
                className={cn(
                  'size-3 rounded-xs transition-transform hover:scale-125',
                  colors[level],
                )}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
        <span>Less</span>
        <div className="flex gap-1">
          {colors.map((c, i) => (
            <div key={i} className={cn('size-2.5 rounded-xs', c)} />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}

// 5. Step Player Component
export function StepPlayerDemo() {
  const [currentStep, setCurrentStep] = React.useState(2);
  const steps = ['Data Intake', 'Verify Roles', 'Commit Ledger', 'Dispatch Notice'];

  return (
    <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <span className="font-sans text-xs font-bold tracking-wider text-slate-800 uppercase">
          Step Player Workflow
        </span>
        <span className="font-mono text-xs font-bold text-[#0056FF]">
          Step {currentStep} of {steps.length}
        </span>
      </div>

      <div className="flex items-center justify-between gap-1 py-2">
        {steps.map((st, idx) => {
          const stepNum = idx + 1;
          const isDone = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;

          return (
            <div key={idx} className="flex flex-1 flex-col items-center gap-1.5 text-center">
              <div
                className={cn(
                  'flex size-7 items-center justify-center rounded-full font-mono text-xs font-bold transition-all',
                  isDone && 'bg-emerald-500 text-white',
                  isCurrent && 'border-2 border-[#0056FF] bg-[#0056FF] text-white shadow-xs',
                  !isDone && !isCurrent && 'bg-slate-100 text-slate-400',
                )}
              >
                {isDone ? <Check className="size-3.5" /> : stepNum}
              </div>
              <span
                className={cn(
                  'font-sans text-[10px] font-semibold',
                  isCurrent ? 'text-slate-900' : 'text-slate-400',
                )}
              >
                {st}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between gap-2 pt-2">
        <button
          type="button"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          className="rounded-xl border border-slate-200 px-3 py-1 font-sans text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
          className="rounded-xl bg-[#0056FF] px-4 py-1 font-sans text-xs font-bold text-white hover:bg-blue-700"
        >
          Next Step
        </button>
      </div>
    </div>
  );
}

// 6. Animated Counter (Odometer Roll Simulation)
export function AnimatedCounterDemo() {
  const [count, setCount] = React.useState(12840);

  return (
    <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xs">
      <span className="font-sans text-xs font-bold tracking-wider text-slate-800 uppercase">
        Animated Metric Counter
      </span>

      <div className="py-2">
        <span className="font-mono text-4xl font-black tracking-tight text-[#0056FF] sm:text-5xl">
          {count.toLocaleString()}
        </span>
        <span className="mt-1 block font-sans text-xs text-slate-500">
          Total Validated Enrolled Students
        </span>
      </div>

      <div className="flex justify-center gap-2">
        <button
          type="button"
          onClick={() => setCount(count + 250)}
          className="rounded-[4px] border-0 bg-[#0056FF] px-3.5 py-1.5 font-sans text-xs font-bold text-white hover:bg-blue-700"
        >
          +250 Students
        </button>
        <button
          type="button"
          onClick={() => setCount(12840)}
          className="rounded-[4px] border border-slate-200 px-3 py-1.5 font-sans text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

// 7. Voice Note Audio Waveform Player
export function VoiceNoteDemo() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [speed, setSpeed] = React.useState<'1x' | '1.5x' | '2x'>('1x');
  const bars = [30, 60, 45, 90, 70, 40, 80, 100, 65, 50, 85, 95, 40, 30, 75, 50, 90, 60];

  return (
    <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <Volume className="size-4 text-[#0056FF]" />
          <span className="font-sans text-xs font-bold tracking-wider text-slate-800 uppercase">
            Voice Note Dispatch
          </span>
        </div>
        <span className="font-mono text-xs font-bold text-slate-500">0:42 / 2:15</span>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#0056FF] text-white shadow-xs hover:bg-blue-700"
        >
          {isPlaying ? <Pause className="size-4" /> : <Play className="ml-0.5 size-4" />}
        </button>

        {/* Waveform Bars */}
        <div className="flex h-10 flex-1 items-center gap-1">
          {bars.map((h, i) => (
            <div
              key={i}
              className={cn(
                'w-1.5 rounded-full transition-all duration-150',
                i < 8 ? 'bg-[#0056FF]' : 'bg-slate-300',
                isPlaying && i < 8 && 'animate-pulse',
              )}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => setSpeed(speed === '1x' ? '1.5x' : speed === '1.5x' ? '2x' : '1x')}
          className="rounded-lg border border-slate-200 bg-white px-2 py-1 font-mono text-[10px] font-bold text-slate-700 hover:bg-slate-100"
        >
          {speed}
        </button>
      </div>
    </div>
  );
}

// 8. FAQ Accordion Component
export function FaqDemo() {
  const [openIdx, setOpenIdx] = React.useState<number | null>(0);
  const faqs = [
    {
      q: 'How does the modular monolith preserve tenant isolation?',
      a: 'Every Mongoose schema automatically enforces mandatory schoolId and branchId filters on all reads and transactions.',
    },
    {
      q: 'Are permissions enforced client-side or server-side?',
      a: 'All RBAC scopes are strictly verified server-side inside Express middleware against @snp/shared contracts.',
    },
    {
      q: 'How do responsive device previews work in this library?',
      a: 'The Phone and Web toggles adjust the preview viewport container in real-time without modifying application code.',
    },
  ];

  return (
    <div className="w-full max-w-lg space-y-4 max-sm:rounded-none max-sm:border-y max-sm:border-x-0 sm:rounded-2xl sm:border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <span className="font-sans text-xs font-bold tracking-wider text-slate-800 uppercase">
          Institutional FAQ Accordion
        </span>
        <span className="font-mono text-[10px] text-slate-400">3 Questions</span>
      </div>

      <div className="space-y-2">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="overflow-hidden rounded-[4px] border border-slate-200 bg-white transition-all"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className={cn(
                  'flex w-full items-center justify-between p-3.5 text-left font-sans text-xs font-bold transition-colors cursor-pointer',
                  isOpen ? 'bg-[#E3E7FC]/30 text-[#0056FF]' : 'bg-slate-50/70 text-slate-900 hover:bg-slate-100/70',
                )}
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={cn(
                    'size-4 shrink-0 transition-transform duration-200',
                    isOpen ? 'rotate-180 text-[#0056FF]' : 'text-slate-400',
                  )}
                />
              </button>
              {isOpen && (
                <div className="animate-in fade-in border-t border-slate-100 bg-white p-3.5 font-sans text-xs leading-relaxed text-slate-600">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
