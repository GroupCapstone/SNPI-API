'use client';

import * as React from 'react';
import Link from 'next/link';

import {
  Check,
  Copy,
  Server,
  Search,
  Calendar,
  CircleAlert,
  CircleCheck,
  Code,
  Layers,
  Radio,
  ShieldCheck,
  User,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  BookOpen,
  Terminal,
  FileText,
  Info,
  Lock,
  Zap,
} from '@/components/icons';
import { CHANGE_LOGS } from '@/features/document/changelog-data';
import { cn } from '@/lib/utils';

// ============================================================================
// DATA STRUCTURES: BACKEND API & SYNDICATION SPECIFICATIONS
// ============================================================================

interface PublicFeedSpec {
  id: string;
  title: string;
  category: 'Announcements & News' | 'Emergency Alerts' | 'Academic Calendar';
  format: 'RSS 2.0 (XML)' | 'JSON Feed' | 'REST API';
  endpoint: string;
  refreshInterval: string;
  description: string;
  sampleXml?: string;
  sampleJson: Record<string, unknown>;
}

const PUBLIC_FEEDS_SPECS: PublicFeedSpec[] = [
  {
    id: 'feed-news-rss',
    title: 'News & Academic Notices RSS 2.0',
    category: 'Announcements & News',
    format: 'RSS 2.0 (XML)',
    endpoint: '/api/v1/public/rss/announcements.xml',
    refreshInterval: '5m cache',
    description:
      'Verified institutional announcements, academic period dates, and holiday advisories.',
    sampleXml: `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SNP Institute Official News &amp; Announcements</title>
    <link>https://snp.edu.kh</link>
    <description>Live updates and academic announcements from SNP Institute</description>
    <language>en-US</language>
    <item>
      <title>Semester 1 2026-2027 Registration Opens</title>
      <link>https://snp.edu.kh/announcements/ann-2026-001</link>
      <pubDate>Fri, 30 Oct 2026 08:00:00 GMT</pubDate>
      <guid>ANN-2026-001</guid>
      <description>Online intake registration is now open for all branches.</description>
    </item>
  </channel>
</rss>`,
    sampleJson: {
      status: 'success',
      feed: 'announcements',
      updatedAt: '2026-10-31T08:00:00Z',
      items: [
        {
          id: 'ANN-2026-001',
          title: 'Semester 1 2026-2027 Registration Opens',
          category: 'Academics',
          publishedAt: '2026-10-30T08:00:00Z',
          summary: 'Online intake registration is now open for all branches.',
        },
      ],
    },
  },
  {
    id: 'feed-alerts-json',
    title: 'Emergency & Operational Alerts',
    category: 'Emergency Alerts',
    format: 'JSON Feed',
    endpoint: '/api/v1/public/feed/alerts.json',
    refreshInterval: 'Real-time (60s)',
    description:
      'Campus weather warnings, entrance maintenance notices, and exam reschedule alerts.',
    sampleJson: {
      status: 'active',
      count: 1,
      alerts: [
        {
          id: 'ALT-2026-904',
          severity: 'advisory',
          headline: 'Gate 2 Entrance Maintenance Notice',
          branchId: 'BR-01',
          effectiveUntil: '2026-11-02T18:00:00Z',
          actionUrl: 'https://snp.edu.kh/alerts/904',
        },
      ],
    },
  },
  {
    id: 'feed-calendar-json',
    title: 'Academic Calendar Milestones',
    category: 'Academic Calendar',
    format: 'JSON Feed',
    endpoint: '/api/v1/public/feed/academic-calendar.json',
    refreshInterval: '1h cache',
    description: 'Semester milestones, examination windows, and national holiday closures.',
    sampleJson: {
      academicYear: '2026-2027',
      term: 'Semester 1',
      milestones: [
        {
          code: 'MLS-2026-T1-START',
          title: 'Orientation & Classes Commence',
          date: '2026-11-16',
          category: 'instructional',
        },
        {
          code: 'MLS-2026-T1-EXAM',
          title: 'Midterm Examination Window',
          date: '2027-01-11',
          category: 'examination',
        },
      ],
    },
  },
];

interface ClassRosterItem {
  id: string;
  code: string;
  name: string;
  instructor: string;
  department: string;
  schedule: string;
  room: string;
  enrolled: number;
  capacity: number;
  status: 'Open' | 'Filling Fast' | 'Waitlist';
}

const SAMPLE_CLASSES_CATALOG: ClassRosterItem[] = [
  {
    id: 'cls-01',
    code: 'CLS-2026-CS101',
    name: 'Introduction to Computer Science & Algorithms',
    instructor: 'Dr. Vannak Keo',
    department: 'Software Engineering',
    schedule: 'Mon / Wed 08:00 - 10:00',
    room: 'Lab Room 302 (Main Campus)',
    enrolled: 26,
    capacity: 30,
    status: 'Open',
  },
  {
    id: 'cls-02',
    code: 'CLS-2026-NET201',
    name: 'Advanced Enterprise Network Architecture',
    instructor: 'Prof. Sophea Chhum',
    department: 'Network Engineering',
    schedule: 'Tue / Thu 10:30 - 12:30',
    room: 'Cisco Networking Lab A',
    enrolled: 29,
    capacity: 30,
    status: 'Filling Fast',
  },
  {
    id: 'cls-03',
    code: 'CLS-2026-DATA301',
    name: 'Distributed Database Systems & Sharding',
    instructor: 'Eng. Ratanak Tea',
    department: 'Data Engineering',
    schedule: 'Mon / Fri 13:30 - 15:30',
    room: 'Lecture Hall 104',
    enrolled: 24,
    capacity: 35,
    status: 'Open',
  },
  {
    id: 'cls-04',
    code: 'CLS-2026-SEC401',
    name: 'Applied Cryptography & Zero Trust Defenses',
    instructor: 'Dr. Mengly Sor',
    department: 'Cybersecurity',
    schedule: 'Wed / Fri 16:00 - 18:00',
    room: 'Security Operations Center (SOC)',
    enrolled: 25,
    capacity: 25,
    status: 'Waitlist',
  },
  {
    id: 'cls-05',
    code: 'CLS-2026-AI501',
    name: 'Autonomous AI Agent Architecture & Swarms',
    instructor: 'Lead Arch. Sokha Chan',
    department: 'Artificial Intelligence',
    schedule: 'Sat 08:30 - 12:00',
    room: 'AI Innovation Studio',
    enrolled: 18,
    capacity: 25,
    status: 'Open',
  },
];

interface LiveStreamEvent {
  id: string;
  timestamp: string;
  channel: string;
  eventName: string;
  payload: string;
}

const INITIAL_STREAM_EVENTS: LiveStreamEvent[] = [
  {
    id: 'ev-1',
    timestamp: '16:40:12',
    channel: 'announcements.live',
    eventName: 'announcement.published',
    payload: '{"id":"ANN-2026-001","title":"Semester 1 Registration Open"}',
  },
  {
    id: 'ev-2',
    timestamp: '16:41:04',
    channel: 'classes.roster.BR-01',
    eventName: 'class.seat_reserved',
    payload: '{"code":"CLS-2026-CS101","enrolled":27,"capacity":30,"status":"Filling Fast"}',
  },
  {
    id: 'ev-3',
    timestamp: '16:41:45',
    channel: 'alerts.emergency',
    eventName: 'alert.broadcast',
    payload: '{"id":"ALT-2026-904","headline":"Gate 2 Maintenance Notice","severity":"advisory"}',
  },
  {
    id: 'ev-4',
    timestamp: '16:42:10',
    channel: 'classes.roster.BR-01',
    eventName: 'class.seat_reserved',
    payload: '{"code":"CLS-2026-NET201","enrolled":30,"capacity":30,"status":"Waitlist"}',
  },
  {
    id: 'ev-5',
    timestamp: '16:43:02',
    channel: 'credentials.ledger',
    eventName: 'certificate.committed',
    payload: '{"code":"SNPI-2026-CS-8891","status":"COMMITTED_TAMPER_PROOF","height":18402}',
  },
];

interface RestEndpointSummary {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  scope: string;
  rateLimit: string;
  cacheControl: string;
  description: string;
}

const BACKEND_PUBLIC_ENDPOINTS: RestEndpointSummary[] = [
  {
    method: 'GET',
    path: '/api/v1/health',
    scope: 'Public',
    rateLimit: '120 req / 1 min',
    cacheControl: 'no-store',
    description: 'Cluster health and MongoDB replica set status.',
  },
  {
    method: 'GET',
    path: '/api/v1/reports/certificates/verify/:code',
    scope: 'Public',
    rateLimit: '60 req / 15 min',
    cacheControl: 'no-store',
    description: 'SHA-256 ledger proof & tamper-detection verification (ADR-0006).',
  },
  {
    method: 'GET',
    path: '/api/v1/classes',
    scope: 'Public Projection',
    rateLimit: '120 req / 1 min',
    cacheControl: 'public, max-age=60',
    description: 'Syndicated course catalog, schedules, and seat quotas.',
  },
  {
    method: 'GET',
    path: '/api/v1/public/rss/announcements.xml',
    scope: 'Public',
    rateLimit: '300 req / 5 min',
    cacheControl: 'public, max-age=300',
    description: 'RSS 2.0 XML feed of campus news and notices.',
  },
  {
    method: 'GET',
    path: '/api/v1/public/feed/alerts.json',
    scope: 'Public',
    rateLimit: '300 req / 5 min',
    cacheControl: 'public, max-age=60',
    description: 'JSON feed of high-priority emergency advisories.',
  },
  {
    method: 'GET',
    path: '/api/v1/stream/events',
    scope: 'Public SSE',
    rateLimit: '50 concurrent',
    cacheControl: 'text/event-stream',
    description: 'Persistent Server-Sent Events stream for live mutations.',
  },
  {
    method: 'GET',
    path: '/api/v1/docs/openapi.json',
    scope: 'Public Contract',
    rateLimit: '120 req / 1 min',
    cacheControl: 'public, max-age=3600',
    description: 'OpenAPI 3.1.0 machine-readable specification.',
  },
];

const GUIDE_NAV_ITEMS = [
  { id: 'open-api-head', label: 'Overview', tag: '01' },
  { id: 'available-services', label: 'Core Services', tag: '02' },
  { id: 'public-feeds', label: 'Public Feeds (RSS 2.0)', tag: '03' },
  { id: 'class-catalog-api', label: 'Class Catalog REST API', tag: '04' },
  { id: 'certificate-ledger-api', label: 'Certificate Ledger API', tag: '05' },
  { id: 'realtime-stream', label: 'Real-Time SSE Stream', tag: '06' },
  { id: 'rest-api-directory', label: 'API Directory', tag: '07' },
  { id: 'changelogs', label: 'Releases', tag: '08' },
];

// ============================================================================
// MAIN COMPONENT: OPEN API & SYNDICATION GUIDE (MOBILE-FIRST HOOK HERO)
// ============================================================================

export function OpenApiView({ initialSection }: { initialSection?: string } = {}) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const isManualScrollRef = React.useRef<boolean>(false);
  const scrollTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const [activeSection, setActiveSection] = React.useState<string>(
    initialSection || 'open-api-head',
  );
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  // Feed preview format state (xml or json)
  const [feedFormatTab, setFeedFormatTab] = React.useState<Record<string, 'xml' | 'json'>>({
    'feed-news-rss': 'xml',
    'feed-alerts-json': 'json',
    'feed-calendar-json': 'json',
  });

  // Class Roster filter state
  const [classSearch, setClassSearch] = React.useState<string>('');
  const [classFilterStatus, setClassFilterStatus] = React.useState<string>('All');
  const [classCodeLanguage, setClassCodeLanguage] = React.useState<
    'curl' | 'typescript' | 'python'
  >('curl');

  // Verification Ledger state
  const [verifyStatusTab, setVerifyStatusTab] = React.useState<'valid' | 'tampered'>('valid');

  // SSE Stream telemetry
  const [streamLatency] = React.useState<number>(14);
  const [streamSubscribers] = React.useState<number>(1428);
  const [streamEvents] = React.useState<LiveStreamEvent[]>(INITIAL_STREAM_EVENTS);

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Smooth scroll handler
  const scrollToSection = (id: string) => {
    setActiveSection(id);
    isManualScrollRef.current = true;
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      isManualScrollRef.current = false;
    }, 800);

    requestAnimationFrame(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

  // Scroll listener for sticky active anchor
  React.useEffect(() => {
    const handleScroll = () => {
      if (!rootRef.current || rootRef.current.offsetParent === null || isManualScrollRef.current) {
        return;
      }
      const scrollPosition = window.scrollY + 140;
      for (let i = GUIDE_NAV_ITEMS.length - 1; i >= 0; i--) {
        const item = GUIDE_NAV_ITEMS[i];
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPosition >= top) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen w-full bg-[#FFFFFF] text-[#0A1A4A]">
      <div className="mx-auto flex max-w-7xl items-start gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* =================================================================== */}
        {/* MINIMAL LEFT NAVIGATION (DESKTOP ONLY) */}
        {/* =================================================================== */}
        <aside className="sticky top-28 hidden w-60 shrink-0 space-y-4 self-start md:block">
          <div className="rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] p-3 shadow-xs">
            <div className="mb-2 border-b border-[#CAD3F5] px-3 py-2">
              <span className="text-[11px] font-black tracking-widest text-[#0056FF] uppercase">
                Directory
              </span>
            </div>

            <nav className="space-y-1">
              {GUIDE_NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold transition-colors',
                      isActive
                        ? 'border-l-2 border-[#0056FF] bg-[#EFF5FF] text-[#0056FF]'
                        : 'text-[#0A1A4A] hover:bg-[#EFF5FF] hover:text-[#0056FF]',
                    )}
                  >
                    <span className="truncate">{item.label}</span>
                    <span className="font-mono text-[10px] text-[#0056FF] opacity-60">
                      {item.tag}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Info Box */}
          <div className="space-y-1.5 rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#0056FF]">
              <Info className="h-3.5 w-3.5" />
              <span>Public Access</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#0A1A4A]/80">
              Zero tokens or auth headers needed. Projections are open and cached at edge CDN nodes.
            </p>
          </div>
        </aside>

        {/* =================================================================== */}
        {/* MAIN GUIDE CONTENT — MOBILE-FIRST WELCOME & HOOK */}
        {/* =================================================================== */}
        <main className="max-w-5xl min-w-0 flex-1 space-y-8 pb-24 sm:space-y-10">
          {/* ----------------------------------------------------------------- */}
          {/* SECTION 1: STANDALONE WELCOME HERO SCREEN (MOBILE ONE-SECTION)   */}
          {/* ----------------------------------------------------------------- */}
          <section
            id="open-api-head"
            className="flex min-h-[calc(100vh-92px)] flex-col justify-between pt-1 pb-4 sm:min-h-0 sm:pb-6"
          >
            {/* The Integrated Standalone Welcome Card */}
            <div className="flex flex-1 flex-col justify-between rounded-3xl border border-[#CAD3F5] bg-[#EFF5FF] p-6 shadow-xs sm:p-10">
              {/* Top Context & Headline */}
              <div className="space-y-4">
                {/* Big Clear Headline */}
                <h1 className="text-3xl leading-[1.12] font-black tracking-tight text-[#0A1A4A] sm:text-5xl lg:text-6xl">
                  Welcome to SNP Open API
                </h1>

                {/* Less Description: Concise, punchy, high-impact */}
                <p className="max-w-xl text-sm font-medium leading-relaxed text-[#0A1A4A]/75 sm:text-base">
                  Free public REST APIs and live feeds for campus announcements, course schedules, and certificate verification.
                </p>

                {/* 3 Quick Value Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#CAD3F5] bg-[#FFFFFF] px-3 py-1.5 text-xs font-semibold text-[#0A1A4A]">
                    <Check className="size-3.5 text-[#0056FF]" />
                    <span>No API Key Required</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#CAD3F5] bg-[#FFFFFF] px-3 py-1.5 text-xs font-semibold text-[#0A1A4A]">
                    <Check className="size-3.5 text-[#0056FF]" />
                    <span>Live Campus Feeds</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 rounded-lg border border-[#CAD3F5] bg-[#FFFFFF] px-3 py-1.5 text-xs font-semibold text-[#0A1A4A]">
                    <Check className="size-3.5 text-[#0056FF]" />
                    <span>Tamper-Proof Verification</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions: Glide to Services Button */}
              <div className="mt-8">
                {/* Dedicated Scroll Cue to Screen 2 */}
                <button
                  onClick={() => scrollToSection('available-services')}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#CAD3F5] bg-[#FFFFFF] py-3.5 text-xs font-bold text-[#0056FF] shadow-xs transition-all hover:bg-[#EFF5FF] active:scale-[0.99] sm:w-auto sm:px-8"
                >
                  <span>Explore 4 Core Services</span>
                  <ArrowRight className="size-4 rotate-90 sm:rotate-0" />
                </button>
              </div>
            </div>
          </section>

          {/* ----------------------------------------------------------------- */}
          {/* SECTION 2: 4 CORE SERVICES OVERVIEW (SCREEN TWO ON MOBILE)        */}
          {/* ----------------------------------------------------------------- */}
          <section id="available-services" className="scroll-mt-24 space-y-3 pt-4 sm:pt-6">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-black tracking-wider text-[#0056FF] uppercase">
                Available Services & Endpoints
              </span>
              <span className="text-[11px] font-medium text-[#0A1A4A]/60">4 Core Services</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3.5">
              {/* Card 01: Campus Announcements & Feeds */}
              <button
                onClick={() => scrollToSection('public-feeds')}
                className="group flex w-full flex-col justify-between rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] p-3.5 text-left shadow-xs transition-all hover:border-[#0056FF] hover:bg-[#EFF5FF] active:scale-[0.99] sm:p-4"
              >
                <div className="flex w-full items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E3E7FC] text-[#0056FF] transition-colors group-hover:bg-[#0056FF] group-hover:text-white">
                      <Radio className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                          01 · Feeds
                        </span>
                        <span className="rounded border border-[#CAD3F5]/60 bg-[#EFF5FF] px-1.5 py-0.5 text-[9px] font-semibold text-[#0056FF]">
                          RSS 2.0 & JSON
                        </span>
                      </div>
                      <h3 className="truncate text-sm font-bold text-[#0A1A4A] group-hover:text-[#0056FF]">
                        Campus News & RSS Feeds
                      </h3>
                    </div>
                  </div>
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-[#CAD3F5] bg-white text-[#0056FF] transition-all group-hover:border-[#0056FF] group-hover:bg-[#0056FF] group-hover:text-white">
                    <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

                <p className="mt-1 text-xs text-[#0A1A4A]/70 truncate">
                  Live announcements and emergency alerts.
                </p>

                <div className="mt-2.5 flex items-center justify-between border-t border-[#CAD3F5]/60 pt-2">
                  <span className="font-mono text-[11px] text-[#0056FF]">
                    GET /public/rss/announcements.xml
                  </span>
                  <span className="text-[10px] font-semibold text-[#0A1A4A]/60">5m Cache</span>
                </div>
              </button>

              {/* Card 02: Class Roster & Catalog */}
              <button
                onClick={() => handleCopy('https://api.snp.edu.kh/api/v1/classes', 'card-classes')}
                className="group flex w-full flex-col justify-between rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] p-3.5 text-left shadow-xs transition-all hover:border-[#0056FF] hover:bg-[#EFF5FF] active:scale-[0.99] sm:p-4"
              >
                <div className="flex w-full items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E3E7FC] text-[#0056FF] transition-colors group-hover:bg-[#0056FF] group-hover:text-white">
                      <Layers className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                          02 · Catalog
                        </span>
                        <span className="rounded border border-[#CAD3F5]/60 bg-[#EFF5FF] px-1.5 py-0.5 text-[9px] font-semibold text-[#0056FF]">
                          REST API
                        </span>
                      </div>
                      <h3 className="truncate text-sm font-bold text-[#0A1A4A] group-hover:text-[#0056FF]">
                        Class Roster & Catalog
                      </h3>
                    </div>
                  </div>
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-[#CAD3F5] bg-white text-[#0056FF] transition-all group-hover:border-[#0056FF] group-hover:bg-[#0056FF] group-hover:text-white">
                    {copiedId === 'card-classes' ? (
                      <Check className="size-3.5" />
                    ) : (
                      <Copy className="size-3.5 transition-transform group-hover:scale-110" />
                    )}
                  </div>
                </div>

                <p className="mt-1 text-xs text-[#0A1A4A]/70 truncate">
                  Active course schedules and live seat quotas.
                </p>

                <div className="mt-2.5 flex items-center justify-between border-t border-[#CAD3F5]/60 pt-2">
                  <span className="font-mono text-[11px] text-[#0056FF]">GET /api/v1/classes</span>
                  <span className="text-[10px] font-semibold text-[#0A1A4A]/60">Live Seats</span>
                </div>
              </button>

              {/* Card 03: Certificate Ledger API */}
              <button
                onClick={() =>
                  handleCopy(
                    'https://api.snp.edu.kh/api/v1/reports/certificates/verify/:code',
                    'card-certs',
                  )
                }
                className="group flex w-full flex-col justify-between rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] p-3.5 text-left shadow-xs transition-all hover:border-[#0056FF] hover:bg-[#EFF5FF] active:scale-[0.99] sm:p-4"
              >
                <div className="flex w-full items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E3E7FC] text-[#0056FF] transition-colors group-hover:bg-[#0056FF] group-hover:text-white">
                      <ShieldCheck className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                          03 · Ledger
                        </span>
                        <span className="rounded border border-[#CAD3F5]/60 bg-[#EFF5FF] px-1.5 py-0.5 text-[9px] font-semibold text-[#0056FF]">
                          SHA-256 Ledger
                        </span>
                      </div>
                      <h3 className="truncate text-sm font-bold text-[#0A1A4A] group-hover:text-[#0056FF]">
                        Certificate Verification
                      </h3>
                    </div>
                  </div>
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-[#CAD3F5] bg-white text-[#0056FF] transition-all group-hover:border-[#0056FF] group-hover:bg-[#0056FF] group-hover:text-white">
                    {copiedId === 'card-certs' ? (
                      <Check className="size-3.5" />
                    ) : (
                      <Copy className="size-3.5 transition-transform group-hover:scale-110" />
                    )}
                  </div>
                </div>

                <p className="mt-1 text-xs text-[#0A1A4A]/70 truncate">
                  Tamper-proof student diploma validation.
                </p>

                <div className="mt-2.5 flex items-center justify-between border-t border-[#CAD3F5]/60 pt-2">
                  <span className="font-mono text-[11px] text-[#0056FF]">
                    GET /reports/certificates/verify/:code
                  </span>
                  <span className="text-[10px] font-semibold text-[#0A1A4A]/60">
                    Proof Verified
                  </span>
                </div>
              </button>

              {/* Card 04: Real-Time SSE Stream */}
              <button
                onClick={() => scrollToSection('realtime-stream')}
                className="group flex w-full flex-col justify-between rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] p-3.5 text-left shadow-xs transition-all hover:border-[#0056FF] hover:bg-[#EFF5FF] active:scale-[0.99] sm:p-4"
              >
                <div className="flex w-full items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#E3E7FC] text-[#0056FF] transition-colors group-hover:bg-[#0056FF] group-hover:text-white">
                      <Zap className="size-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                          04 · Stream
                        </span>
                        <span className="rounded border border-[#CAD3F5]/60 bg-[#EFF5FF] px-1.5 py-0.5 text-[9px] font-semibold text-[#0056FF]">
                          HTTP/2 SSE
                        </span>
                      </div>
                      <h3 className="truncate text-sm font-bold text-[#0A1A4A] group-hover:text-[#0056FF]">
                        Real-Time SSE Stream
                      </h3>
                    </div>
                  </div>
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-[#CAD3F5] bg-white text-[#0056FF] transition-all group-hover:border-[#0056FF] group-hover:bg-[#0056FF] group-hover:text-white">
                    <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>

                <p className="mt-1 text-xs text-[#0A1A4A]/70 truncate">
                  Instant push events with zero polling.
                </p>

                <div className="mt-2.5 flex items-center justify-between border-t border-[#CAD3F5]/60 pt-2">
                  <span className="font-mono text-[11px] text-[#0056FF]">
                    GET /api/v1/stream/events
                  </span>
                  <span className="text-[10px] font-semibold text-[#0A1A4A]/60">
                    Sub-50ms Latency
                  </span>
                </div>
              </button>
            </div>
          </section>

          {/* ----------------------------------------------------------------- */}
          {/* SECTION 2: PUBLIC FEEDS & RSS 2.0 */}
          {/* ----------------------------------------------------------------- */}
          <section id="public-feeds" className="space-y-4 border-t border-[#CAD3F5] pt-8">
            <div className="space-y-1">
              <span className="font-mono text-xs font-bold tracking-wider text-[#0056FF] uppercase">
                Feeds & Syndication
              </span>
              <h2 className="text-xl font-bold tracking-tight text-[#0A1A4A] sm:text-2xl">
                Public Feeds & RSS 2.0
              </h2>
              <p className="text-xs font-medium text-[#0A1A4A]/75">
                Subscribe to read-only XML and JSON feeds to ingest campus announcements, security
                alerts, and milestones.
              </p>
            </div>

            <div className="space-y-3.5">
              {PUBLIC_FEEDS_SPECS.map((feed) => {
                const currentFormat = feedFormatTab[feed.id] || (feed.sampleXml ? 'xml' : 'json');
                const hasXml = Boolean(feed.sampleXml);

                return (
                  <div
                    key={feed.id}
                    className="overflow-hidden rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] shadow-xs"
                  >
                    {/* Feed Header */}
                    <div className="flex flex-col gap-2.5 border-b border-[#CAD3F5] bg-[#EFF5FF] p-3.5 sm:flex-row sm:items-center sm:justify-between sm:p-4">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-[#E3E7FC] px-2 py-0.5 text-xs font-bold text-[#0056FF]">
                            {feed.format}
                          </span>
                          <span className="text-xs font-bold text-[#0A1A4A]">{feed.title}</span>
                        </div>
                        <p className="text-xs text-[#0A1A4A]/75">{feed.description}</p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <div className="flex items-center gap-1.5 rounded-lg border border-[#CAD3F5] bg-[#FFFFFF] px-2.5 py-1 font-mono text-xs text-[#0A1A4A]">
                          <span className="font-bold text-[#0056FF]">GET</span>
                          <span className="max-w-[180px] truncate sm:max-w-[200px]">
                            {feed.endpoint}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopy(feed.endpoint, feed.id)}
                          className="rounded-lg border border-[#CAD3F5] bg-[#FFFFFF] p-1.5 text-[#0056FF] transition-colors hover:bg-[#E3E7FC]"
                          title="Copy Endpoint URL"
                        >
                          {copiedId === feed.id ? (
                            <Check className="h-3.5 w-3.5 text-[#0056FF]" />
                          ) : (
                            <Copy className="h-3.5 w-3.5 text-[#0056FF]" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Specimen Tabs & Code Container */}
                    <div className="space-y-2 p-3.5 sm:p-4">
                      <div className="flex items-center justify-between border-b border-[#CAD3F5] pb-2">
                        <span className="text-[11px] font-bold tracking-wider text-[#0056FF] uppercase">
                          Sample Response
                        </span>
                        <div className="flex items-center gap-1 rounded-lg border border-[#CAD3F5] bg-[#EFF5FF] p-0.5">
                          {hasXml && (
                            <button
                              onClick={() =>
                                setFeedFormatTab((prev) => ({ ...prev, [feed.id]: 'xml' }))
                              }
                              className={cn(
                                'rounded px-2.5 py-0.5 text-xs font-semibold transition-colors',
                                currentFormat === 'xml'
                                  ? 'bg-[#0056FF] text-[#FFFFFF]'
                                  : 'text-[#0A1A4A] hover:text-[#0056FF]',
                              )}
                            >
                              XML
                            </button>
                          )}
                          <button
                            onClick={() =>
                              setFeedFormatTab((prev) => ({ ...prev, [feed.id]: 'json' }))
                            }
                            className={cn(
                              'rounded px-2.5 py-0.5 text-xs font-semibold transition-colors',
                              currentFormat === 'json'
                                ? 'bg-[#0056FF] text-[#FFFFFF]'
                                : 'text-[#0A1A4A] hover:text-[#0056FF]',
                            )}
                          >
                            JSON
                          </button>
                        </div>
                      </div>

                      <pre className="max-h-52 overflow-x-auto rounded-lg border border-[#CAD3F5] bg-[#EFF5FF] p-3 font-mono text-xs leading-relaxed text-[#0A1A4A]">
                        {currentFormat === 'xml' && feed.sampleXml
                          ? feed.sampleXml
                          : JSON.stringify(feed.sampleJson, null, 2)}
                      </pre>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ----------------------------------------------------------------- */}
          {/* SECTION 4: REAL-TIME SSE STREAM */}
          {/* ----------------------------------------------------------------- */}
          <section id="realtime-stream" className="space-y-4 border-t border-[#CAD3F5] pt-8">
            <div className="space-y-1">
              <span className="font-mono text-xs font-bold tracking-wider text-[#0056FF] uppercase">
                Server-Sent Events
              </span>
              <h2 className="text-xl font-bold tracking-tight text-[#0A1A4A] sm:text-2xl">
                Real-Time SSE Stream
              </h2>
              <p className="text-xs font-medium text-[#0A1A4A]/75">
                HTTP/2 Server-Sent Events channel streaming live academic mutations and alerts.
              </p>
            </div>

            {/* Live Packet Stream Monitor (Light Modern Design) */}
            <div className="overflow-hidden rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] shadow-xs">
              <div className="flex items-center justify-between border-b border-[#CAD3F5] bg-[#EFF5FF] p-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0056FF] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0056FF]" />
                  </span>
                  <span className="font-bold text-[#0A1A4A]">Live Packet Monitor</span>
                  <span className="text-[11px] text-[#0A1A4A]/60">({streamLatency}ms avg)</span>
                </div>
                <span className="rounded bg-[#E3E7FC] px-2 py-0.5 font-mono text-[10px] font-bold text-[#0056FF]">
                  text/event-stream
                </span>
              </div>

              <div className="max-h-56 space-y-2 overflow-y-auto p-3">
                {streamEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="flex flex-col gap-1 rounded-lg border border-[#CAD3F5] bg-[#EFF5FF] p-2.5 text-xs sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-[#FFFFFF] px-2 py-0.5 font-mono text-[10px] font-bold text-[#0056FF]">
                        {ev.eventName}
                      </span>
                      <span className="font-mono text-[11px] text-[#0A1A4A]/80">{ev.channel}</span>
                    </div>
                    <code className="truncate font-mono text-[11px] text-[#0A1A4A]">
                      {ev.payload}
                    </code>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Listener Code */}
            <div className="space-y-2 rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-[#0056FF] uppercase">
                  EventSource Listener
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      `const sse = new EventSource('https://api.snp.edu.kh/api/v1/stream/events?channel=classes.roster.BR-01');\nsse.addEventListener('class.seat_reserved', (e) => console.log(JSON.parse(e.data)));`,
                      'sse-spec',
                    )
                  }
                  className="flex items-center gap-1 text-xs font-semibold text-[#0056FF] hover:underline"
                >
                  {copiedId === 'sse-spec' ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  <span>{copiedId === 'sse-spec' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="overflow-x-auto rounded-lg border border-[#CAD3F5] bg-[#FFFFFF] p-3 font-mono text-xs leading-relaxed text-[#0A1A4A]">
                {`const sse = new EventSource('https://api.snp.edu.kh/api/v1/stream/events?channel=classes.roster.BR-01');
sse.addEventListener('class.seat_reserved', (event) => {
  const packet = JSON.parse(event.data);
  console.log('Live seat mutation:', packet);
});`}
              </pre>
            </div>
          </section>

          {/* ----------------------------------------------------------------- */}
          {/* SECTION 5: RELEASES */}
          {/* ----------------------------------------------------------------- */}
          <section id="changelogs" className="space-y-3 border-t border-[#CAD3F5] pt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#0056FF]" />
                <h3 className="text-base font-bold text-[#0A1A4A]">Syndication Releases</h3>
              </div>
              <span className="rounded border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 text-xs font-semibold text-[#0056FF]">
                v0.2.12 Active
              </span>
            </div>
            <div className="space-y-1.5 rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] p-3.5 text-xs text-[#0A1A4A]">
              <div className="flex items-center justify-between font-bold text-[#0056FF]">
                <span>{CHANGE_LOGS[0]?.version || 'v0.2.12'}</span>
                <span>{CHANGE_LOGS[0]?.date || '2026-10-31'}</span>
              </div>
              <p className="leading-relaxed text-[#0A1A4A]/80">
                {CHANGE_LOGS[0]?.description ||
                  'Open API & Syndication Guide redesigned with mobile-first welcome hook and tactile service cards.'}
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
