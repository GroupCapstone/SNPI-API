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
  Bookmark,
  Heart,
  Share2,
  Search,
  ThumbsUp,
  ExternalLink,
} from '@/components/icons';
import { TactileFolderShowcase } from '../tactile-folder-showcase';

// ============================================================================
// 0. CONTENT CARD COMPONENT (Content, Educational & Research — NOT Payment)
// ============================================================================

export function ContentCardDemo() {
  const [activeArticleId, setActiveArticleId] = React.useState<
    'consensus' | 'security' | 'gateway'
  >('consensus');
  const [bookmarked, setBookmarked] = React.useState(false);
  const [claps, setClaps] = React.useState(48);
  const [hasClapped, setHasClapped] = React.useState(false);
  const [shareFeedback, setShareFeedback] = React.useState(false);

  const articles = {
    consensus: {
      topic: 'DISTRIBUTED CONSENSUS',
      duration: '5 min read',
      date: 'Oct 2026',
      title: 'Consensus-Driven MongoDB Replica Set Transactions in High-Throughput Monoliths',
      abstract:
        'Detailed architectural benchmark analyzing 47 domain modules under concurrent transaction isolation sessions, zero-leak connection pools, and constant-time HMAC verification across multi-campus branches.',
      author: 'Dr. Sovanarith Keo',
      role: 'Chief Systems Architect · Faculty of ICT',
      initials: 'SK',
      tags: ['MongoDB rs0', 'TypeScript', 'ACID Sessions'],
    },
    security: {
      topic: 'CRYPTOGRAPHIC AUDITING',
      duration: '7 min read',
      date: 'Oct 2026',
      title: 'Zero-Trust Token Hygiene & Timing-Safe RBAC Authorization Contracts',
      abstract:
        'Mathematical formulation of constant-time timingSafeEqual verification, single-source-of-truth permission enforcement in @snp/shared, and automated GitLab CI security bots for enterprise student registrars.',
      author: 'Prof. Kimhorng Heng',
      role: 'Head of Cybersecurity & Cryptography',
      initials: 'KH',
      tags: ['Timing-Safe', 'RBAC Scopes', 'Zero Trust'],
    },
    gateway: {
      topic: 'EDGE COMPUTE',
      duration: '4 min read',
      date: 'Nov 2026',
      title: 'Hybrid Serverless & Long-Running Container Deployment Topologies',
      abstract:
        'Next.js 15 App Router serverless edge routing combined with persistent Docker container backend clusters to deliver sub-10ms response times for nationwide academic institutions.',
      author: 'Dara Sok',
      role: 'Principal Cloud Infrastructure Engineer',
      initials: 'DS',
      tags: ['Next.js 15', 'Docker Monolith', 'Edge Proxy'],
    },
  };

  const article = articles[activeArticleId];

  const handleClap = () => {
    setClaps((prev) => prev + 1);
    setHasClapped(true);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareFeedback(true);
    setTimeout(() => setShareFeedback(false), 2000);
  };

  return (
    <div className="w-full max-w-xl space-y-4">
      {/* Category Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-[#F8FAFC] p-2">
        <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">
          Select Content Archetype:
        </span>
        <div className="flex items-center gap-1">
          {[
            { id: 'consensus', label: 'Research Paper' },
            { id: 'security', label: 'Security Charter' },
            { id: 'gateway', label: 'Cloud Architecture' },
          ].map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setActiveArticleId(mode.id as typeof activeArticleId)}
              className={cn(
                'cursor-pointer rounded-md px-2.5 py-1 font-sans text-xs font-bold transition-all active:scale-95',
                activeArticleId === mode.id
                  ? 'border border-[#0056FF] bg-[#0056FF] text-white shadow-2xs'
                  : 'border border-transparent text-slate-600 hover:bg-slate-200/60',
              )}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Production-Grade Content Card Component */}
      <div className="relative overflow-hidden rounded-2xl border border-[#CAD3F5] bg-white p-5 shadow-xs transition-all hover:border-[#0056FF]/40 sm:p-6">
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-[#CAD3F5] bg-[#EFF5FF] px-2 py-0.5 font-mono text-[10px] font-bold text-[#0056FF]">
              {article.topic}
            </span>
            <span className="font-mono text-[10px] text-slate-400">
              {article.duration} · {article.date}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setBookmarked(!bookmarked)}
            className={cn(
              'flex size-8 cursor-pointer items-center justify-center rounded-lg border transition-all active:scale-95',
              bookmarked
                ? 'border-[#0056FF] bg-[#EFF5FF] text-[#0056FF]'
                : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-700',
            )}
            title={bookmarked ? 'Remove Bookmark' : 'Save to Reading List'}
          >
            <Bookmark className={cn('size-4', bookmarked && 'fill-[#0056FF]')} />
          </button>
        </div>

        {/* Title & Abstract */}
        <h3 className="mt-3.5 font-sans text-base font-black text-[#0A1A4A] sm:text-lg">
          {article.title}
        </h3>
        <p className="mt-2 font-sans text-xs leading-relaxed text-slate-600">{article.abstract}</p>

        {/* Technical Topic Badges */}
        <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded border border-slate-200/60 bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-600"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Author Metadata Row */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-full bg-[#0056FF] font-mono text-xs font-bold text-white shadow-2xs">
              {article.initials}
            </div>
            <div>
              <h4 className="font-sans text-xs font-bold text-[#0A1A4A]">{article.author}</h4>
              <p className="font-sans text-[11px] text-slate-500">{article.role}</p>
            </div>
          </div>

          {/* Interactive Claps & Share Bar */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleClap}
              title={`Endorse research paper (${claps} endorsements)`}
              className={cn(
                'flex cursor-pointer items-center gap-1 rounded-md border px-2.5 py-1 font-mono text-xs font-bold transition-all active:scale-95',
                hasClapped
                  ? 'border-rose-200 bg-rose-50 text-rose-600'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-rose-200 hover:text-rose-600',
              )}
            >
              <Heart className={cn('size-3.5', hasClapped && 'fill-rose-600')} />
              <span>{claps}</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="flex size-7 cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition-all hover:border-[#0056FF] hover:bg-[#EFF5FF] hover:text-[#0056FF] active:scale-95"
              title="Copy Article Link"
            >
              {shareFeedback ? (
                <Check className="size-3.5 text-emerald-600" />
              ) : (
                <Share2 className="size-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 1. FOLDER COMPONENT (Tactile 3D Documents Folder Container)
// ============================================================================

export function FolderDemo() {
  const [activeFolderTab, setActiveFolderTab] = React.useState<number>(0);

  const folderCards = [
    {
      id: 'curriculum',
      title: 'Curriculum_Master_Roster_2026.pdf',
      badge: 'VERIFIED',
      description: 'Official academic timetable verified by Central Academic Council.',
      content: (
        <div className="space-y-3 font-sans text-xs text-slate-700">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-mono text-[10px] text-slate-400">DOCUMENT ID</span>
            <span className="font-mono text-[10px] font-bold text-[#0056FF]">DOC-CUR-2026-01</span>
          </div>
          <p className="leading-relaxed">
            Standardized 4-year curriculum frameworks for Software Engineering, Applied AI, and
            Cloud Monolith Infrastructure across all 4 regional campuses.
          </p>
          <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
            <div className="rounded border border-slate-100 bg-slate-50 p-1.5">
              <span className="block text-slate-400">TOTAL CREDITS</span>
              <span className="font-bold text-slate-900">128 Credits</span>
            </div>
            <div className="rounded border border-slate-100 bg-slate-50 p-1.5">
              <span className="block text-slate-400">SEMESTERS</span>
              <span className="font-bold text-slate-900">8 Terms</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'tuition',
      title: 'Tuition_Ledger_Reconciliation_Q1.xlsx',
      badge: 'LEDGER READY',
      description: 'Consolidated batch tuition transaction hashes and ledger entries.',
      content: (
        <div className="space-y-3 font-sans text-xs text-slate-700">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-mono text-[10px] text-slate-400">RECONCILIATION</span>
            <span className="font-mono text-[10px] font-bold text-emerald-600">100% MATCH</span>
          </div>
          <p className="leading-relaxed">
            Automated bank statement reconciliation verifying 3,120 student tuition transfers with
            zero discrepancies recorded across Cambodian banking gateways.
          </p>
          <div className="rounded-lg bg-[#EFF5FF] p-2 font-mono text-[10px] text-[#0056FF]">
            SHA-256: 8f9b2c0192a834e7...d2a1
          </div>
        </div>
      ),
    },
    {
      id: 'passbook',
      title: 'Cryptographic_Student_Passbook_STU-0891.json',
      badge: 'HMAC SIGNED',
      description: 'Verifiable student credential ledger with cryptographic seal.',
      content: (
        <div className="space-y-3 font-sans text-xs text-slate-700">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-mono text-[10px] text-slate-400">CREDENTIAL ID</span>
            <span className="font-mono text-[10px] font-bold text-[#0056FF]">STU-2026-0891</span>
          </div>
          <p className="leading-relaxed">
            Immutable academic transcript passbook containing verified grades, department honors,
            and biometric RFID gate access tokens.
          </p>
          <div className="flex items-center gap-2 rounded border border-emerald-200 bg-emerald-50 p-1.5 font-mono text-[10px] text-emerald-700">
            <Check className="size-3" />
            <span>Constant-Time Signature Authenticated</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full max-w-xl space-y-4">
      {/* Folder Control Strip */}
      <div className="flex items-center justify-between rounded-xl border border-[#CAD3F5] bg-white p-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <Folder className="size-4 text-[#0056FF]" />
          <span className="font-sans text-xs font-bold text-[#0A1A4A]">
            Tactile Document Folder
          </span>
        </div>
        <div className="flex items-center gap-1 font-mono text-[10px]">
          <span className="text-slate-400">Tap cards to bring forward:</span>
          <span className="rounded bg-[#EFF5FF] px-2 py-0.5 font-bold text-[#0056FF]">
            {folderCards.length} Documents
          </span>
        </div>
      </div>

      {/* 3D Tactile Folder Showcase */}
      <TactileFolderShowcase cards={folderCards} initialActiveIndex={activeFolderTab} />
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
    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[#CAD3F5] bg-white text-left shadow-none">
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

// 5. Step Player Component
export function StepPlayerDemo() {
  const [currentStep, setCurrentStep] = React.useState(2);
  const steps = ['Data Intake', 'Verify Roles', 'Commit Ledger', 'Dispatch Notice'];

  return (
    <div className="w-full max-w-md space-y-4 rounded-2xl border border-[#CAD3F5] bg-white p-5 shadow-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 font-mono text-xs">
        <span className="text-slate-500">PROGRESS:</span>
        <span className="font-bold text-[#0056FF]">
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
                  isCurrent && 'border-2 border-[#0056FF] bg-[#0056FF] text-white',
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
    <div className="w-full max-w-md space-y-4 rounded-2xl border border-[#CAD3F5] bg-white p-5 text-center shadow-none">
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

// 7. Voice Note Audio Waveform Player (Tactile Dispatch Studio)
export function VoiceNoteDemo() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [speed, setSpeed] = React.useState<'1x' | '1.25x' | '1.5x' | '2x'>('1x');
  const [currentTime, setCurrentTime] = React.useState(42);
  const [showTranscript, setShowTranscript] = React.useState(false);

  // Dynamic waveform bars with natural frequencies
  const baseBars = [
    24, 48, 65, 92, 78, 45, 88, 100, 60, 52, 80, 95, 42, 35, 70, 55, 90, 68, 40, 85, 62, 45,
  ];

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => (prev >= 135 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const progressPercent = Math.min(100, (currentTime / 135) * 100);

  return (
    <div className="w-full max-w-xl space-y-4 rounded-2xl border border-[#CAD3F5] bg-white p-5 shadow-xs sm:p-6">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-[#0056FF] text-white">
            <Volume className="size-4" />
          </div>
          <div>
            <h4 className="font-sans text-xs font-bold text-[#0A1A4A]">Faculty Voice Memo #089</h4>
            <p className="font-mono text-[10px] text-slate-500">
              Prof. Kimhorng Heng · Dean of ICT
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <span className="rounded border border-slate-200/60 bg-slate-100 px-2 py-0.5 font-bold text-slate-600">
            48kHz Lossless
          </span>
          <span className="font-bold text-[#0056FF]">{formatTime(currentTime)} / 2:15</span>
        </div>
      </div>

      {/* Main Interactive Audio Player Console */}
      <div className="rounded-2xl border border-slate-200/90 bg-[#F8FAFC] p-4 transition-all hover:border-[#0056FF]/40">
        <div className="flex items-center gap-3">
          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-[#0056FF] text-white shadow-xs transition-all hover:bg-[#2277FF] active:scale-95"
            aria-label={isPlaying ? 'Pause voice memo' : 'Play voice memo'}
          >
            {isPlaying ? <Pause className="size-5" /> : <Play className="ml-0.5 size-5" />}
          </button>

          {/* Interactive Scrubbable Waveform */}
          <div
            className="relative flex h-12 flex-1 cursor-pointer items-center gap-1 overflow-hidden px-1"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const ratio = Math.max(0, Math.min(1, clickX / rect.width));
              setCurrentTime(Math.round(ratio * 135));
            }}
          >
            {baseBars.map((h, i) => {
              const barProgress = (i / baseBars.length) * 100;
              const isPast = barProgress <= progressPercent;
              return (
                <div
                  key={i}
                  className={cn(
                    'w-1.5 rounded-full transition-all duration-200',
                    isPast ? 'bg-[#0056FF]' : 'bg-slate-300 hover:bg-slate-400',
                    isPlaying && isPast && 'animate-pulse',
                  )}
                  style={{
                    height: isPlaying ? `${Math.max(25, h * (0.7 + (i % 3) * 0.15))}%` : `${h}%`,
                  }}
                />
              );
            })}
          </div>

          {/* Speed Multiplier Pill */}
          <button
            type="button"
            onClick={() =>
              setSpeed(
                speed === '1x'
                  ? '1.25x'
                  : speed === '1.25x'
                    ? '1.5x'
                    : speed === '1.5x'
                      ? '2x'
                      : '1x',
              )
            }
            className="cursor-pointer rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-mono text-[11px] font-bold text-slate-700 transition-all hover:border-[#CAD3F5] hover:bg-[#EFF5FF] hover:text-[#0056FF] active:scale-95"
          >
            {speed}
          </button>
        </div>
      </div>

      {/* Transcript Drawer Toggle */}
      <div>
        <button
          type="button"
          onClick={() => setShowTranscript(!showTranscript)}
          className="flex cursor-pointer items-center gap-1.5 font-mono text-[11px] font-bold text-[#0056FF] hover:underline"
        >
          <FileText className="size-3.5" />
          <span>
            {showTranscript ? 'Hide Audio Transcript' : 'Inspect Voice-to-Text Transcript'}
          </span>
        </button>

        {showTranscript && (
          <div className="animate-in fade-in mt-2 rounded-xl border border-[#CAD3F5] bg-[#EFF5FF]/40 p-3.5 font-sans text-xs leading-relaxed text-[#0A1A4A]">
            <p className="font-semibold italic">
              &quot;Good morning faculty chairs. Please ensure all student semester exam matrices
              for Term 1 are verified and signed off before Friday 17:00 UTC. Biometric turnstile
              logs must be synchronized to the central campus database.&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// 8. FAQ Accordion Component (Interactive Institutional Knowledge Hub)
export function FaqDemo() {
  const [openIdx, setOpenIdx] = React.useState<number | null>(0);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState<
    'All' | 'Architecture' | 'Security' | 'Deployment'
  >('All');
  const [helpfulFeedback, setHelpfulFeedback] = React.useState<Record<number, boolean>>({});

  const faqs = [
    {
      id: 0,
      category: 'Architecture',
      q: 'How does the modular monolith preserve tenant isolation?',
      a: 'Every Mongoose schema automatically enforces mandatory schoolId and branchId filters on all reads, updates, and ACID transactions. Express middleware guarantees client-supplied scopes are never trusted.',
    },
    {
      id: 1,
      category: 'Security',
      q: 'Are permissions enforced client-side or server-side?',
      a: 'All RBAC scopes are strictly verified server-side inside Express middleware against @snp/shared contracts using constant-time crypto.timingSafeEqual comparison for token hashes.',
    },
    {
      id: 2,
      category: 'Deployment',
      q: 'How do responsive device previews work in this library?',
      a: 'The Phone and Web toggles adjust the preview viewport container in real-time with CSS container queries without modifying application code or affecting live production routes.',
    },
    {
      id: 3,
      category: 'Architecture',
      q: 'Why are all UI components built developer-library first?',
      a: 'Per repository policy, all new components, dark modes, and designs are built and demoed in the developer portal (/document/design-system) first. They are never injected into the real dashboard without explicit user commands.',
    },
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch =
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-xl space-y-4 rounded-2xl border border-[#CAD3F5] bg-white p-5 shadow-xs sm:p-6">
      {/* Search & Filter Header */}
      <div className="space-y-3 border-b border-slate-100 pb-4">
        <div className="flex items-center justify-between">
          <h4 className="font-sans text-xs font-bold text-[#0A1A4A]">
            Institutional Knowledge FAQ
          </h4>
          <span className="font-mono text-[10px] text-slate-400">
            {filteredFaqs.length} Questions Found
          </span>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <Search className="absolute top-2.5 left-3 size-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search architectural questions or security rules..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pr-3 pl-9 font-sans text-xs text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:border-[#0056FF] focus:bg-white"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(['All', 'Architecture', 'Security', 'Deployment'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'cursor-pointer rounded-md px-2.5 py-1 font-mono text-[10px] font-bold transition-all active:scale-95',
                activeCategory === cat
                  ? 'border border-[#0056FF] bg-[#0056FF] text-white shadow-2xs'
                  : 'border border-slate-200 bg-slate-50 text-slate-600 hover:border-[#CAD3F5] hover:bg-[#EFF5FF] hover:text-[#0056FF]',
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion Questions List */}
      <div className="space-y-2.5">
        {filteredFaqs.length === 0 ? (
          <div className="py-8 text-center font-mono text-xs text-slate-400">
            No matching FAQ entries found for &quot;{searchQuery}&quot;.
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = openIdx === faq.id;
            return (
              <div
                key={faq.id}
                className={cn(
                  'overflow-hidden rounded-xl border transition-all duration-200',
                  isOpen
                    ? 'border-[#0056FF] bg-[#EFF5FF]/30 shadow-2xs'
                    : 'border-slate-200 bg-white hover:border-[#CAD3F5]',
                )}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : faq.id)}
                  className="flex w-full cursor-pointer items-center justify-between p-3.5 text-left transition-colors"
                >
                  <div className="flex items-center gap-2 pr-2">
                    <span className="rounded border border-slate-200/60 bg-slate-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#0056FF] uppercase">
                      {faq.category}
                    </span>
                    <span className="font-sans text-xs font-bold text-[#0A1A4A]">{faq.q}</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      'size-4 shrink-0 transition-transform duration-200',
                      isOpen ? 'rotate-180 text-[#0056FF]' : 'text-slate-400',
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="animate-in fade-in border-t border-slate-100 bg-white p-4 font-sans text-xs leading-relaxed text-slate-700">
                    <p>{faq.a}</p>

                    {/* Helpful Vote Buttons */}
                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                      <span className="font-mono text-[10px] text-slate-400">
                        Was this explanation helpful?
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setHelpfulFeedback({ ...helpfulFeedback, [faq.id]: true })}
                          className={cn(
                            'cursor-pointer rounded px-2 py-0.5 font-mono text-[10px] font-bold transition-all',
                            helpfulFeedback[faq.id]
                              ? 'border border-emerald-300 bg-emerald-50 text-emerald-700'
                              : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100',
                          )}
                        >
                          {helpfulFeedback[faq.id] ? 'Thank You!' : 'Yes'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
