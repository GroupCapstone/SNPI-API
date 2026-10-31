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
  Activity,
  Globe,
} from '@/components/icons';
import { CHANGE_LOGS } from '@/features/document/changelog-data';
import { GeometricHeaderStamp } from '@/features/document/components/ui-library';
import { useDocsNav } from './docs-nav-context';
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
    title: 'Institutional News & Notices RSS 2.0',
    category: 'Announcements & News',
    format: 'RSS 2.0 (XML)',
    endpoint: '/api/v1/public/rss/announcements.xml',
    refreshInterval: '5 minutes cache (RFC 7234)',
    description:
      'Public syndicate feed publishing verified institutional announcements, academic period start dates, and holiday advisories.',
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
    title: 'Campus Emergency & Operational Alerts Feed',
    category: 'Emergency Alerts',
    format: 'JSON Feed',
    endpoint: '/api/v1/public/feed/alerts.json',
    refreshInterval: 'Real-time (60s polling / SSE broadcast)',
    description:
      'High-priority broadcast feed for weather warnings, campus maintenance, gate status, and exam reschedule alerts.',
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
    title: 'Academic Calendar & Intake Milestones Feed',
    category: 'Academic Calendar',
    format: 'JSON Feed',
    endpoint: '/api/v1/public/feed/academic-calendar.json',
    refreshInterval: '1 hour cache',
    description:
      'Public syndicated schedule of semester milestones, examination windows, national holiday closures, and graduation ceremonies.',
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
    scope: 'Public (Unauthenticated)',
    rateLimit: '120 req / 1 min',
    cacheControl: 'no-store',
    description: 'Cluster health, MongoDB replica set status, and uptime metrics.',
  },
  {
    method: 'GET',
    path: '/api/v1/reports/certificates/verify/:code',
    scope: 'Public (Unauthenticated)',
    rateLimit: '60 req / 15 min',
    cacheControl: 'no-store',
    description: 'Cryptographic SHA-256 ledger proof & tamper-detection check (ADR-0006).',
  },
  {
    method: 'GET',
    path: '/api/v1/classes',
    scope: 'Public Projection',
    rateLimit: '120 req / 1 min',
    cacheControl: 'public, max-age=60, s-maxage=300',
    description: 'Syndicated course catalog, schedules, instructors, and seat metrics.',
  },
  {
    method: 'GET',
    path: '/api/v1/public/rss/announcements.xml',
    scope: 'Public (Unauthenticated)',
    rateLimit: '300 req / 5 min',
    cacheControl: 'public, max-age=300',
    description: 'Standard RSS 2.0 XML feed of campus news and notices.',
  },
  {
    method: 'GET',
    path: '/api/v1/public/feed/alerts.json',
    scope: 'Public (Unauthenticated)',
    rateLimit: '300 req / 5 min',
    cacheControl: 'public, max-age=60',
    description: 'JSON feed of high-priority emergency advisories and notices.',
  },
  {
    method: 'GET',
    path: '/api/v1/stream/events',
    scope: 'Public SSE Channel',
    rateLimit: '50 concurrent conn',
    cacheControl: 'no-cache, text/event-stream',
    description: 'Persistent Server-Sent Events channel streaming live mutations.',
  },
  {
    method: 'GET',
    path: '/api/v1/docs/openapi.json',
    scope: 'Public Specification',
    rateLimit: '120 req / 1 min',
    cacheControl: 'public, max-age=3600',
    description: 'Machine-readable OpenAPI 3.1.0 contract for all platform endpoints.',
  },
];

const GUIDE_NAV_ITEMS = [
  { id: 'open-api-head', label: 'Overview & Backend Standards', tag: '01' },
  { id: 'public-feeds', label: 'Public Feeds & RSS 2.0', tag: '02' },
  { id: 'class-catalog-api', label: 'Class Catalog REST API', tag: '03' },
  { id: 'certificate-ledger-api', label: 'Certificate Ledger API', tag: '04' },
  { id: 'realtime-stream', label: 'Real-Time SSE Stream', tag: '05' },
  { id: 'rest-api-directory', label: 'Backend API Directory', tag: '06' },
  { id: 'changelogs', label: 'Syndication Releases', tag: '07' },
];

// ============================================================================
// MAIN COMPONENT: OPEN API & SYNDICATION GUIDE
// ============================================================================

export function OpenApiView({ initialSection }: { initialSection?: string } = {}) {
  const { activeTab, setActiveTab } = useDocsNav();
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

  // Class Roster filter state (read-only search)
  const [classSearch, setClassSearch] = React.useState<string>('');
  const [classFilterStatus, setClassFilterStatus] = React.useState<string>('All');
  const [classCodeLanguage, setClassCodeLanguage] = React.useState<'curl' | 'typescript' | 'python'>(
    'curl',
  );

  // Verification Ledger state
  const [verifyStatusTab, setVerifyStatusTab] = React.useState<'valid' | 'tampered'>('valid');
  const [verifyCodeLanguage, setVerifyCodeLanguage] = React.useState<'curl' | 'typescript'>('curl');

  // SSE Stream telemetry metrics
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

  // Filtered classes for read-only table
  const filteredClasses = React.useMemo(() => {
    return SAMPLE_CLASSES_CATALOG.filter((item) => {
      const matchStatus =
        classFilterStatus === 'All' ||
        item.status.toLowerCase() === classFilterStatus.toLowerCase();
      if (!matchStatus) return false;
      if (!classSearch.trim()) return true;
      const q = classSearch.toLowerCase().trim();
      return (
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.instructor.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q) ||
        item.room.toLowerCase().includes(q)
      );
    });
  }, [classSearch, classFilterStatus]);

  return (
    <div ref={rootRef} className="min-h-screen w-full bg-[#FFFFFF] text-[#0A1A4A]">
      <div className="mx-auto flex max-w-7xl items-start gap-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* =================================================================== */}
        {/* MINIMAL LEFT NAVIGATION (7 ANCHORS) */}
        {/* =================================================================== */}
        <aside className="sticky top-28 hidden w-64 shrink-0 space-y-4 self-start md:block">
          <div className="rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] p-3 shadow-xs">
            <div className="mb-2 flex items-center justify-between border-b border-[#CAD3F5] px-3 py-2">
              <span className="text-[11px] font-black tracking-widest text-[#0056FF] uppercase">
                Backend API Guide
              </span>
              <span className="rounded bg-[#E3E7FC] px-1.5 py-0.5 text-[10px] font-bold text-[#0056FF]">
                Display Only
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

          {/* Syndication Specification Notice Card */}
          <div className="space-y-2 rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0056FF]">
              <Info className="h-3.5 w-3.5" />
              <span>Display-Only Specification</span>
            </div>
            <p className="text-[11px] leading-relaxed text-[#0A1A4A]">
              Authoritative backend REST API directory, public RSS syndication, cryptographic ledger
              verification, and streaming specifications for external developers.
            </p>
          </div>
        </aside>

        {/* =================================================================== */}
        {/* MAIN BACKEND API GUIDE CONTENT */}
        {/* =================================================================== */}
        <main className="max-w-5xl min-w-0 flex-1 space-y-12 pb-24">
          {/* ----------------------------------------------------------------- */}
          {/* SECTION 1: OVERVIEW & BACKEND SYNDICATION STANDARDS */}
          {/* ----------------------------------------------------------------- */}
          <section id="open-api-head" className="space-y-6 pt-2">
            <div className="flex flex-col gap-6 border-b border-[#CAD3F5] pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-1 text-xs font-bold tracking-wider text-[#0056FF] uppercase">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Public Syndication Guide · Display Only</span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-[#0A1A4A] sm:text-4xl">
                  Open API & Syndication
                </h1>
                <p className="text-sm leading-relaxed font-medium text-[#0A1A4A]">
                  Authoritative SNPI-SMS backend REST endpoints, XML/JSON public syndication feeds,
                  cryptographic ledger verification, and real-time SSE stream architecture.
                </p>
              </div>

              <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                {/* Related Hub Navigation Menu (UI Library & Open API) */}
                <div className="flex items-center gap-1 rounded-full border border-[#CAD3F5] bg-[#EFF5FF] p-1 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setActiveTab('library', true)}
                    className={cn(
                      'flex items-center gap-2 rounded-full px-4 py-2 font-sans text-xs font-bold transition-all',
                      activeTab === 'library'
                        ? 'bg-[#0056FF] text-white shadow-xs'
                        : 'text-[#0A1A4A] hover:bg-[#E3E7FC] hover:text-[#0056FF]',
                    )}
                  >
                    <Layers className="size-3.5 stroke-[2]" />
                    <span>UI Library</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('openapi', true)}
                    className={cn(
                      'flex items-center gap-2 rounded-full px-4 py-2 font-sans text-xs font-bold transition-all',
                      activeTab === 'openapi'
                        ? 'bg-[#0056FF] text-white shadow-xs'
                        : 'text-[#0A1A4A] hover:bg-[#E3E7FC] hover:text-[#0056FF]',
                    )}
                  >
                    <FileText className="size-3.5 stroke-[2.2]" />
                    <span>Open API</span>
                  </button>
                </div>

                <GeometricHeaderStamp
                  codeA="20"
                  titleA="OPEN"
                  codeB="26"
                  titleB="API"
                  className="rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-3"
                />
              </div>
            </div>

            {/* Protocol Status Metrics Banner */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-3.5">
                <span className="mb-1 block text-[10px] font-bold text-[#0056FF] uppercase">
                  Delivery Mode
                </span>
                <span className="block text-xs font-bold text-[#0A1A4A]">Public Syndication</span>
              </div>
              <div className="rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-3.5">
                <span className="mb-1 block text-[10px] font-bold text-[#0056FF] uppercase">
                  Operation Scope
                </span>
                <span className="block text-xs font-bold text-[#0A1A4A]">Display-Only Data</span>
              </div>
              <div className="rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-3.5">
                <span className="mb-1 block text-[10px] font-bold text-[#0056FF] uppercase">
                  Authentication Tier
                </span>
                <span className="block text-xs font-bold text-[#0A1A4A]">Zero-Credential Access</span>
              </div>
              <div className="rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-3.5">
                <span className="mb-1 block text-[10px] font-bold text-[#0056FF] uppercase">
                  Stream Protocol
                </span>
                <span className="block font-mono text-xs font-bold text-[#0A1A4A]">
                  SSE (HTTP/2)
                </span>
              </div>
            </div>

            {/* =============================================================== */}
            {/* 4 CORE FEATURES QUICK CARDS — REDESIGNED BACKEND API FOCUS */}
            {/* =============================================================== */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Feature 01: Public Feeds & RSS 2.0 */}
              <button
                onClick={() => scrollToSection('public-feeds')}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] p-5 text-left shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0056FF] hover:bg-[#EFF5FF] hover:shadow-[0_8px_20px_rgba(0,86,255,0.08)]"
              >
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-[#E3E7FC] px-2.5 py-1 text-xs font-bold text-[#0056FF]">
                        Feature 01
                      </span>
                      <span className="font-mono text-[10px] font-semibold text-[#0056FF] uppercase">
                        RSS 2.0 · XML / JSON
                      </span>
                    </div>
                    <div className="flex size-7 items-center justify-center rounded-lg border border-[#CAD3F5] bg-[#FFFFFF] text-[#0056FF] transition-all group-hover:border-[#0056FF] group-hover:bg-[#0056FF] group-hover:text-white">
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#0A1A4A] transition-colors group-hover:text-[#0056FF]">
                    Public Feeds & RSS 2.0
                  </h3>

                  <div className="mt-2 inline-flex items-center gap-1.5 rounded border border-[#CAD3F5] bg-[#FFFFFF] px-2.5 py-1 font-mono text-[11px] text-[#0A1A4A]">
                    <span className="font-bold text-[#0056FF]">GET</span>
                    <span className="truncate">/api/v1/public/rss/announcements.xml</span>
                  </div>

                  <p className="mt-2.5 text-xs leading-relaxed text-[#0A1A4A]/80">
                    Live XML and JSON syndication feeds for emergency alerts, announcements, and
                    academic milestones without user authentication.
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#CAD3F5]/60 pt-3 text-[11px]">
                  <span className="font-mono font-medium text-[#0056FF]">Cache: 5m TTL</span>
                  <span className="font-medium text-[#0A1A4A]/70">Public Syndicate</span>
                </div>
              </button>

              {/* Feature 02: Class Roster & Catalog REST API */}
              <button
                onClick={() => scrollToSection('class-catalog-api')}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] p-5 text-left shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0056FF] hover:bg-[#EFF5FF] hover:shadow-[0_8px_20px_rgba(0,86,255,0.08)]"
              >
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-[#E3E7FC] px-2.5 py-1 text-xs font-bold text-[#0056FF]">
                        Feature 02
                      </span>
                      <span className="font-mono text-[10px] font-semibold text-[#0056FF] uppercase">
                        REST API · Dynamic Catalog
                      </span>
                    </div>
                    <div className="flex size-7 items-center justify-center rounded-lg border border-[#CAD3F5] bg-[#FFFFFF] text-[#0056FF] transition-all group-hover:border-[#0056FF] group-hover:bg-[#0056FF] group-hover:text-white">
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#0A1A4A] transition-colors group-hover:text-[#0056FF]">
                    Class Roster & Catalog API
                  </h3>

                  <div className="mt-2 inline-flex items-center gap-1.5 rounded border border-[#CAD3F5] bg-[#FFFFFF] px-2.5 py-1 font-mono text-[11px] text-[#0A1A4A]">
                    <span className="font-bold text-[#0056FF]">GET</span>
                    <span className="truncate">/api/v1/classes?branch=&lt;BRANCH_ID&gt;</span>
                  </div>

                  <p className="mt-2.5 text-xs leading-relaxed text-[#0A1A4A]/80">
                    Syndicated live course catalog, real-time seat capacities, schedules, and
                    department queries for external portal integration.
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#CAD3F5]/60 pt-3 text-[11px]">
                  <span className="font-mono font-medium text-[#0056FF]">Rate: 120 req/min</span>
                  <span className="font-medium text-[#0A1A4A]/70">JSON Projection</span>
                </div>
              </button>

              {/* Feature 03: Cryptographic Certificate Ledger Verification API */}
              <button
                onClick={() => scrollToSection('certificate-ledger-api')}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] p-5 text-left shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0056FF] hover:bg-[#EFF5FF] hover:shadow-[0_8px_20px_rgba(0,86,255,0.08)]"
              >
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-[#E3E7FC] px-2 py-0.5 text-xs font-bold text-[#0056FF]">
                        Feature 03
                      </span>
                      <span className="font-mono text-[10px] font-semibold text-[#0056FF] uppercase">
                        SHA-256 Ledger Verification
                      </span>
                    </div>
                    <div className="flex size-7 items-center justify-center rounded-lg border border-[#CAD3F5] bg-[#FFFFFF] text-[#0056FF] transition-all group-hover:border-[#0056FF] group-hover:bg-[#0056FF] group-hover:text-white">
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#0A1A4A] transition-colors group-hover:text-[#0056FF]">
                    Certificate Ledger Verification API
                  </h3>

                  <div className="mt-2 inline-flex items-center gap-1.5 rounded border border-[#CAD3F5] bg-[#FFFFFF] px-2.5 py-1 font-mono text-[11px] text-[#0A1A4A]">
                    <span className="font-bold text-[#0056FF]">GET</span>
                    <span className="truncate">/api/v1/reports/certificates/verify/:code</span>
                  </div>

                  <p className="mt-2.5 text-xs leading-relaxed text-[#0A1A4A]/80">
                    Cryptographically anchored public diploma and transcript verification endpoint
                    with tamper-proof SHA-256 signature checks (ADR-0006).
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#CAD3F5]/60 pt-3 text-[11px]">
                  <span className="font-mono font-medium text-[#0056FF]">Zero-Cache Validation</span>
                  <span className="font-medium text-[#0A1A4A]/70">Tamper Proof</span>
                </div>
              </button>

              {/* Feature 04: Real-Time SSE Stream */}
              <button
                onClick={() => scrollToSection('realtime-stream')}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] p-5 text-left shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#0056FF] hover:bg-[#EFF5FF] hover:shadow-[0_8px_20px_rgba(0,86,255,0.08)]"
              >
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-[#E3E7FC] px-2.5 py-1 text-xs font-bold text-[#0056FF]">
                        Feature 04
                      </span>
                      <span className="font-mono text-[10px] font-semibold text-[#0056FF] uppercase">
                        HTTP/2 Server-Sent Events
                      </span>
                    </div>
                    <div className="flex size-7 items-center justify-center rounded-lg border border-[#CAD3F5] bg-[#FFFFFF] text-[#0056FF] transition-all group-hover:border-[#0056FF] group-hover:bg-[#0056FF] group-hover:text-white">
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-[#0A1A4A] transition-colors group-hover:text-[#0056FF]">
                    Real-Time SSE Stream
                  </h3>

                  <div className="mt-2 inline-flex items-center gap-1.5 rounded border border-[#CAD3F5] bg-[#FFFFFF] px-2.5 py-1 font-mono text-[11px] text-[#0A1A4A]">
                    <span className="font-bold text-[#0056FF]">GET</span>
                    <span className="truncate">/api/v1/stream/events?channel=...</span>
                  </div>

                  <p className="mt-2.5 text-xs leading-relaxed text-[#0A1A4A]/80">
                    Persistent Server-Sent Events channel streaming live academic mutations,
                    emergency alerts, and system telemetry to external client subscribers.
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#CAD3F5]/60 pt-3 text-[11px]">
                  <span className="font-mono font-medium text-[#0056FF]">Avg Latency: 14ms</span>
                  <span className="font-medium text-[#0A1A4A]/70">text/event-stream</span>
                </div>
              </button>
            </div>
          </section>

          {/* ----------------------------------------------------------------- */}
          {/* SECTION 2: PUBLIC FEEDS & RSS 2.0 */}
          {/* ----------------------------------------------------------------- */}
          <section id="public-feeds" className="space-y-6 border-t border-[#CAD3F5] pt-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 text-xs font-bold tracking-wider text-[#0056FF] uppercase">
                <Radio className="h-3.5 w-3.5" />
                <span>Live Public Syndication · XML & JSON Formats</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-[#0A1A4A]">
                Public Feeds & RSS 2.0
              </h2>
              <p className="text-sm leading-relaxed font-medium text-[#0A1A4A]">
                Subscribe to read-only XML and JSON feeds to ingest campus announcements, security
                advisories, and academic milestones directly into external CMS platforms or mobile apps.
              </p>
            </div>

            <div className="space-y-6">
              {PUBLIC_FEEDS_SPECS.map((feed) => {
                const currentFormat = feedFormatTab[feed.id] || (feed.sampleXml ? 'xml' : 'json');
                const hasXml = Boolean(feed.sampleXml);

                return (
                  <div
                    key={feed.id}
                    className="overflow-hidden rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] shadow-xs"
                  >
                    {/* Feed Header */}
                    <div className="flex flex-col gap-3 border-b border-[#CAD3F5] bg-[#EFF5FF] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-[#E3E7FC] px-2 py-0.5 text-xs font-bold text-[#0056FF]">
                            {feed.format}
                          </span>
                          <span className="rounded border border-[#CAD3F5] bg-[#FFFFFF] px-2 py-0.5 text-xs font-medium text-[#0A1A4A]">
                            {feed.refreshInterval}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-[#0A1A4A]">{feed.title}</h3>
                        <p className="text-xs text-[#0A1A4A]">{feed.description}</p>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <div className="flex items-center gap-2 rounded-lg border border-[#CAD3F5] bg-[#FFFFFF] px-3 py-1.5 font-mono text-xs text-[#0A1A4A]">
                          <span className="font-bold text-[#0056FF]">GET</span>
                          <span className="max-w-[200px] truncate">{feed.endpoint}</span>
                        </div>
                        <button
                          onClick={() => handleCopy(feed.endpoint, feed.id)}
                          className="rounded-lg border border-[#CAD3F5] bg-[#FFFFFF] p-2 text-[#0056FF] transition-colors hover:bg-[#E3E7FC]"
                          title="Copy Endpoint URL"
                        >
                          {copiedId === feed.id ? (
                            <Check className="h-4 w-4 text-[#0056FF]" />
                          ) : (
                            <Copy className="h-4 w-4 text-[#0056FF]" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Specimen Tabs & Code Container */}
                    <div className="space-y-3 p-4 sm:p-5">
                      <div className="flex items-center justify-between border-b border-[#CAD3F5] pb-2">
                        <span className="text-xs font-bold tracking-wider text-[#0056FF] uppercase">
                          Syndicated Response Specimen
                        </span>
                        <div className="flex items-center gap-1 rounded-lg border border-[#CAD3F5] bg-[#EFF5FF] p-1">
                          {hasXml && (
                            <button
                              onClick={() =>
                                setFeedFormatTab((prev) => ({ ...prev, [feed.id]: 'xml' }))
                              }
                              className={cn(
                                'rounded px-2.5 py-1 text-xs font-semibold transition-colors',
                                currentFormat === 'xml'
                                  ? 'bg-[#0056FF] text-[#FFFFFF]'
                                  : 'text-[#0A1A4A] hover:text-[#0056FF]',
                              )}
                            >
                              RSS XML
                            </button>
                          )}
                          <button
                            onClick={() =>
                              setFeedFormatTab((prev) => ({ ...prev, [feed.id]: 'json' }))
                            }
                            className={cn(
                              'rounded px-2.5 py-1 text-xs font-semibold transition-colors',
                              currentFormat === 'json'
                                ? 'bg-[#0056FF] text-[#FFFFFF]'
                                : 'text-[#0A1A4A] hover:text-[#0056FF]',
                            )}
                          >
                            JSON Feed
                          </button>
                        </div>
                      </div>

                      <pre className="max-h-56 overflow-x-auto rounded-lg border border-[#CAD3F5] bg-[#EFF5FF] p-4 font-mono text-xs leading-relaxed text-[#0A1A4A]">
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
          {/* SECTION 3: CLASS ROSTER & CATALOG REST API */}
          {/* ----------------------------------------------------------------- */}
          <section id="class-catalog-api" className="space-y-6 border-t border-[#CAD3F5] pt-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 text-xs font-bold tracking-wider text-[#0056FF] uppercase">
                <Layers className="h-3.5 w-3.5" />
                <span>Public Course Catalog & Seat Projections</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-[#0A1A4A]">
                Class Roster & Catalog REST API
              </h2>
              <p className="text-sm leading-relaxed font-medium text-[#0A1A4A]">
                Syndicated class catalog and seat metrics API for institutional course schedules,
                real-time seat counts, and department filtering across all campuses.
              </p>
            </div>

            {/* Endpoint Technical Specification Banner */}
            <div className="flex flex-col gap-3 rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-[#0056FF] px-2 py-0.5 text-xs font-bold text-white">
                    GET
                  </span>
                  <span className="font-mono text-xs font-bold text-[#0A1A4A]">
                    /api/v1/classes?branch=&lt;BRANCH_ID&gt;&amp;status=open
                  </span>
                </div>
                <p className="text-xs text-[#0A1A4A]/80">
                  Returns public projection of scheduled classes, active instructors, room locations, and seat quotas.
                </p>
              </div>

              <button
                onClick={() =>
                  handleCopy('curl -X GET "https://api.snp.edu.kh/api/v1/classes?branch=BR-01&status=open" -H "Accept: application/json"', 'copy-class-curl')
                }
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[#CAD3F5] bg-[#FFFFFF] px-3 py-1.5 text-xs font-semibold text-[#0056FF] transition-colors hover:bg-[#E3E7FC]"
              >
                {copiedId === 'copy-class-curl' ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Copied cURL</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy cURL</span>
                  </>
                )}
              </button>
            </div>

            {/* Display-Only Filter & Table */}
            <div className="overflow-hidden rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] shadow-xs">
              <div className="flex flex-col gap-3 border-b border-[#CAD3F5] bg-[#EFF5FF] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#0056FF]" />
                  <input
                    type="text"
                    value={classSearch}
                    onChange={(e) => setClassSearch(e.target.value)}
                    placeholder="Filter classes, codes, teachers..."
                    className="w-full rounded-lg border border-[#CAD3F5] bg-[#FFFFFF] py-1.5 pr-3 pl-9 text-xs text-[#0A1A4A] placeholder-[#0A1A4A]/50 focus:border-[#0056FF] focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-1.5 self-start sm:self-auto">
                  {['All', 'Open', 'Filling Fast', 'Waitlist'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setClassFilterStatus(status)}
                      className={cn(
                        'rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors',
                        classFilterStatus === status
                          ? 'border-[#0056FF] bg-[#0056FF] text-[#FFFFFF]'
                          : 'border-[#CAD3F5] bg-[#FFFFFF] text-[#0A1A4A] hover:bg-[#E3E7FC]',
                      )}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Display-Only Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[#CAD3F5] bg-[#FFFFFF] text-[11px] font-bold tracking-wider text-[#0056FF] uppercase">
                      <th className="px-4 py-3">Code / Dept</th>
                      <th className="px-4 py-3">Course Title & Instructor</th>
                      <th className="px-4 py-3">Schedule & Room</th>
                      <th className="px-4 py-3">Seat Capacity</th>
                      <th className="px-4 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#CAD3F5] text-xs font-medium text-[#0A1A4A]">
                    {filteredClasses.map((item) => {
                      const capacityPercent = Math.min(
                        100,
                        Math.round((item.enrolled / item.capacity) * 100),
                      );
                      return (
                        <tr key={item.id} className="transition-colors hover:bg-[#EFF5FF]">
                          <td className="px-4 py-3.5">
                            <span className="block font-mono font-bold text-[#0056FF]">
                              {item.code}
                            </span>
                            <span className="text-[11px] text-[#0A1A4A]/70">{item.department}</span>
                          </td>
                          <td className="max-w-xs px-4 py-3.5">
                            <span className="block font-bold">{item.name}</span>
                            <span className="text-[11px] text-[#0A1A4A]/70">{item.instructor}</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="block">{item.schedule}</span>
                            <span className="text-[11px] text-[#0A1A4A]/70">{item.room}</span>
                          </td>
                          <td className="w-36 px-4 py-3.5">
                            <div className="mb-1 flex items-center justify-between font-mono text-[11px]">
                              <span>
                                {item.enrolled} / {item.capacity}
                              </span>
                              <span>{capacityPercent}%</span>
                            </div>
                            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E3E7FC]">
                              <div
                                className="h-full rounded-full bg-[#0056FF] transition-all"
                                style={{ width: `${capacityPercent}%` }}
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <span
                              className={cn(
                                'rounded border px-2 py-0.5 text-[11px] font-bold',
                                item.status === 'Open'
                                  ? 'border-[#CAD3F5] bg-[#E3E7FC] text-[#0056FF]'
                                  : item.status === 'Filling Fast'
                                    ? 'border-[#CAD3F5] bg-[#EFF5FF] text-[#2277FF]'
                                    : 'border-[#CAD3F5] bg-[#EFF5FF] text-[#0A1A4A]',
                              )}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Backend Integration Code Snippets (cURL / TypeScript / Python) */}
            <div className="space-y-3 rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold tracking-wider text-[#0056FF] uppercase">
                    Backend API Client Integration Specimen
                  </span>
                </div>

                <div className="flex items-center gap-1 rounded-lg border border-[#CAD3F5] bg-[#FFFFFF] p-1">
                  <button
                    onClick={() => setClassCodeLanguage('curl')}
                    className={cn(
                      'rounded px-2.5 py-1 text-xs font-semibold transition-colors',
                      classCodeLanguage === 'curl'
                        ? 'bg-[#0056FF] text-white'
                        : 'text-[#0A1A4A] hover:text-[#0056FF]',
                    )}
                  >
                    cURL
                  </button>
                  <button
                    onClick={() => setClassCodeLanguage('typescript')}
                    className={cn(
                      'rounded px-2.5 py-1 text-xs font-semibold transition-colors',
                      classCodeLanguage === 'typescript'
                        ? 'bg-[#0056FF] text-white'
                        : 'text-[#0A1A4A] hover:text-[#0056FF]',
                    )}
                  >
                    TypeScript (Fetch)
                  </button>
                  <button
                    onClick={() => setClassCodeLanguage('python')}
                    className={cn(
                      'rounded px-2.5 py-1 text-xs font-semibold transition-colors',
                      classCodeLanguage === 'python'
                        ? 'bg-[#0056FF] text-white'
                        : 'text-[#0A1A4A] hover:text-[#0056FF]',
                    )}
                  >
                    Python (Requests)
                  </button>
                </div>
              </div>

              <pre className="overflow-x-auto rounded-lg border border-[#CAD3F5] bg-[#FFFFFF] p-4 font-mono text-xs leading-relaxed text-[#0A1A4A]">
                {classCodeLanguage === 'curl' &&
                  `curl -X GET "https://api.snp.edu.kh/api/v1/classes?branch=BR-01&status=open" \\
  -H "Accept: application/json" \\
  -H "User-Agent: EnterprisePortal-Syndicate/1.0"`}
                {classCodeLanguage === 'typescript' &&
                  `// Node.js / Next.js Server Integration
export async function getSyndicatedClasses(branchId: string = 'BR-01') {
  const response = await fetch(\`https://api.snp.edu.kh/api/v1/classes?branch=\${encodeURIComponent(branchId)}\`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'EnterprisePortal-Syndicate/1.0',
    },
    next: { revalidate: 60 }, // RFC 7234 cache revalidation
  });

  if (!response.ok) {
    throw new Error(\`Syndication API responded with status: \${response.status}\`);
  }

  const payload = await response.json();
  return payload.data.classes;
}`}
                {classCodeLanguage === 'python' &&
                  `# Python 3.11+ Requests Client
import requests

def fetch_syndicated_roster(branch_id: str = "BR-01"):
    url = "https://api.snp.edu.kh/api/v1/classes"
    params = {"branch": branch_id, "status": "open"}
    headers = {
        "Accept": "application/json",
        "User-Agent": "EnterprisePortal-Syndicate/1.0"
    }
    
    response = requests.get(url, params=params, headers=headers, timeout=5)
    response.raise_for_status()
    return response.json().get("data", {}).get("classes", [])`}
              </pre>
            </div>
          </section>

          {/* ----------------------------------------------------------------- */}
          {/* SECTION 4: CRYPTOGRAPHIC CERTIFICATE LEDGER API (ADR-0006) */}
          {/* ----------------------------------------------------------------- */}
          <section
            id="certificate-ledger-api"
            className="space-y-6 border-t border-[#CAD3F5] pt-8"
          >
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 text-xs font-bold tracking-wider text-[#0056FF] uppercase">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>ADR-0006 Standard · Cryptographic Verification</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-[#0A1A4A]">
                Certificate Ledger Verification API
              </h2>
              <p className="text-sm leading-relaxed font-medium text-[#0A1A4A]">
                Cryptographically anchored public diploma and transcript verification endpoint.
                Verifies SHA-256 payload hashes against immutable ledger records with zero credential leakage.
              </p>
            </div>

            {/* Architecture Invariants Card */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5 rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] p-4">
                <span className="text-[11px] font-bold text-[#0056FF] uppercase">
                  Four-Tier Isolation
                </span>
                <p className="text-xs text-[#0A1A4A]">
                  Public unauthenticated consumers receive content hashes and status only; internal Fabric credentials remain strictly isolated.
                </p>
              </div>
              <div className="space-y-1.5 rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] p-4">
                <span className="text-[11px] font-bold text-[#0056FF] uppercase">
                  Runtime SHA-256 Check
                </span>
                <p className="text-xs text-[#0A1A4A]">
                  Dynamically recalculates SHA-256 hash across diploma attributes and verifies exact match against the immutable ledger root.
                </p>
              </div>
              <div className="space-y-1.5 rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] p-4">
                <span className="text-[11px] font-bold text-[#0056FF] uppercase">
                  Tamper Detection
                </span>
                <p className="text-xs text-[#0A1A4A]">
                  Flags altered academic data immediately as TAMPER_DETECTED with valid: false and cryptographic discrepancy logs.
                </p>
              </div>
            </div>

            {/* Verification Specimen & Interactive Explorer */}
            <div className="overflow-hidden rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] shadow-xs">
              <div className="flex flex-col gap-3 border-b border-[#CAD3F5] bg-[#EFF5FF] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-[#0056FF] px-2 py-0.5 text-xs font-bold text-white">
                    GET
                  </span>
                  <span className="font-mono text-xs font-bold text-[#0A1A4A]">
                    /api/v1/reports/certificates/verify/:code
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setVerifyStatusTab('valid')}
                    className={cn(
                      'rounded-lg border px-3 py-1 text-xs font-semibold transition-colors',
                      verifyStatusTab === 'valid'
                        ? 'border-[#0056FF] bg-[#0056FF] text-white'
                        : 'border-[#CAD3F5] bg-[#FFFFFF] text-[#0A1A4A] hover:bg-[#E3E7FC]',
                    )}
                  >
                    Valid (Tamper-Proof)
                  </button>
                  <button
                    onClick={() => setVerifyStatusTab('tampered')}
                    className={cn(
                      'rounded-lg border px-3 py-1 text-xs font-semibold transition-colors',
                      verifyStatusTab === 'tampered'
                        ? 'border-[#0056FF] bg-[#0056FF] text-white'
                        : 'border-[#CAD3F5] bg-[#FFFFFF] text-[#0A1A4A] hover:bg-[#E3E7FC]',
                    )}
                  >
                    Tampered (Altered Data)
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold tracking-wider text-[#0056FF] uppercase">
                    Verification Ledger Response · {verifyStatusTab === 'valid' ? 'HTTP 200 OK' : 'HTTP 409 Conflict'}
                  </span>
                  <span className="font-mono text-[11px] text-[#0A1A4A]/70">
                    Engine: SNP-Fabric-SHA256
                  </span>
                </div>

                <pre className="max-h-72 overflow-x-auto rounded-lg border border-[#CAD3F5] bg-[#EFF5FF] p-4 font-mono text-xs leading-relaxed text-[#0A1A4A]">
                  {verifyStatusTab === 'valid'
                    ? JSON.stringify(
                        {
                          success: true,
                          verified: true,
                          status: 'COMMITTED_TAMPER_PROOF',
                          certificate: {
                            code: 'SNPI-2026-CS-8891',
                            studentName: 'Sokha Chan',
                            program: 'Bachelor of Computer Science',
                            graduationDate: '2026-08-15',
                            contentHash:
                              '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
                            merkleRoot:
                              '0x3a4f89d812b186b245c3b9dc9081e55dfc2d4b1fa3d677284addd200126d7781',
                            issuer: 'SNP Institute Office of the Registrar',
                          },
                          ledger: {
                            engine: 'SNP-Fabric-SHA256',
                            blockHeight: 18402,
                            timestamp: '2026-08-15T10:00:00Z',
                          },
                        },
                        null,
                        2,
                      )
                    : JSON.stringify(
                        {
                          success: false,
                          verified: false,
                          status: 'TAMPER_DETECTED',
                          certificate: {
                            code: 'SNPI-2026-CS-8891',
                            computedHash:
                              '0x992cb8311a3fe40081d5fbc74619d83ea74fc2194b15093721867123984ab104',
                            ledgerHash:
                              '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
                          },
                          error: {
                            code: 'HASH_MISMATCH',
                            message: 'Dynamic SHA-256 payload does not match anchored ledger record.',
                          },
                        },
                        null,
                        2,
                      )}
                </pre>
              </div>
            </div>

            {/* Verification Request Integration Code */}
            <div className="space-y-3 rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-[#0056FF] uppercase">
                  Verification API Integration Snippet
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      'curl -X GET "https://api.snp.edu.kh/api/v1/reports/certificates/verify/SNPI-2026-CS-8891" -H "Accept: application/json"',
                      'copy-verify-curl',
                    )
                  }
                  className="flex items-center gap-1 text-xs font-semibold text-[#0056FF] hover:underline"
                >
                  {copiedId === 'copy-verify-curl' ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  <span>{copiedId === 'copy-verify-curl' ? 'Copied' : 'Copy cURL'}</span>
                </button>
              </div>

              <pre className="overflow-x-auto rounded-lg border border-[#CAD3F5] bg-[#FFFFFF] p-4 font-mono text-xs leading-relaxed text-[#0A1A4A]">
                {`// Cryptographic Certificate Verification Example
async function verifyCertificate(certificateCode: string) {
  const endpoint = \`https://api.snp.edu.kh/api/v1/reports/certificates/verify/\${encodeURIComponent(certificateCode)}\`;
  const response = await fetch(endpoint, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });
  
  const payload = await response.json();
  if (payload.status === 'COMMITTED_TAMPER_PROOF') {
    console.log('[VERIFIED] Certificate is cryptographically authentic:', payload.certificate);
    return true;
  }
  
  console.warn('[FAILED] Certificate fails ledger signature check:', payload.error);
  return false;
}`}
              </pre>
            </div>
          </section>

          {/* ----------------------------------------------------------------- */}
          {/* SECTION 5: REAL-TIME SSE STREAM */}
          {/* ----------------------------------------------------------------- */}
          <section id="realtime-stream" className="space-y-6 border-t border-[#CAD3F5] pt-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 text-xs font-bold tracking-wider text-[#0056FF] uppercase">
                <Zap className="h-3.5 w-3.5" />
                <span>Real-Time Broadcast Stream · Display Only</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-[#0A1A4A]">
                Real-Time SSE Stream Architecture
              </h2>
              <p className="text-sm leading-relaxed font-medium text-[#0A1A4A]">
                Persistent Server-Sent Events channel streaming live academic mutations, emergency
                broadcasts, and system telemetry directly to subscriber client applications.
              </p>
            </div>

            {/* Connection Telemetry Specs */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-3.5">
                <span className="mb-1 block text-[10px] font-bold text-[#0056FF] uppercase">
                  Channel Route
                </span>
                <span className="block truncate font-mono text-xs font-bold text-[#0A1A4A]">
                  /api/v1/stream/events
                </span>
              </div>
              <div className="rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-3.5">
                <span className="mb-1 block text-[10px] font-bold text-[#0056FF] uppercase">
                  MIME Protocol
                </span>
                <span className="block font-mono text-xs font-bold text-[#0A1A4A]">
                  text/event-stream
                </span>
              </div>
              <div className="rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-3.5">
                <span className="mb-1 block text-[10px] font-bold text-[#0056FF] uppercase">
                  Active Subscribers
                </span>
                <span className="block font-mono text-xs font-bold text-[#0A1A4A]">
                  {streamSubscribers.toLocaleString()} clients
                </span>
              </div>
              <div className="rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-3.5">
                <span className="mb-1 block text-[10px] font-bold text-[#0056FF] uppercase">
                  Network Latency
                </span>
                <span className="block font-mono text-xs font-bold text-[#0056FF]">
                  {streamLatency}ms avg
                </span>
              </div>
            </div>

            {/* Live Packet Stream Monitor (Light Modern Design) */}
            <div className="overflow-hidden rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] shadow-xs">
              <div className="flex items-center justify-between border-b border-[#CAD3F5] bg-[#EFF5FF] p-3.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0056FF] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0056FF]" />
                  </span>
                  <span className="font-bold text-[#0A1A4A]">Live Broadcast Packet Monitor</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded border border-[#CAD3F5] bg-[#FFFFFF] px-2 py-0.5 font-mono text-[10px] font-bold text-[#0056FF]">
                    Cluster AP-01
                  </span>
                  <span className="rounded bg-[#E3E7FC] px-2 py-0.5 font-mono text-[10px] font-bold text-[#0056FF]">
                    One-Way Broadcast
                  </span>
                </div>
              </div>

              <div className="max-h-80 space-y-2.5 overflow-y-auto p-4">
                {streamEvents.map((ev) => (
                  <div
                    key={ev.id}
                    className="space-y-1.5 rounded-lg border border-[#CAD3F5] bg-[#EFF5FF] p-3 text-xs transition-colors hover:border-[#0056FF] hover:bg-[#EFF5FF]/80"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold text-[#0056FF]">
                        {ev.channel}
                      </span>
                      <span className="font-mono text-[10px] text-[#0A1A4A]/60">
                        {ev.timestamp}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
                      <span className="inline-block shrink-0 rounded border border-[#CAD3F5] bg-[#FFFFFF] px-2 py-0.5 font-mono text-[10px] font-bold text-[#0056FF]">
                        {ev.eventName}
                      </span>
                      <code className="block flex-1 truncate rounded border border-[#CAD3F5] bg-[#FFFFFF] px-2.5 py-1 font-mono text-[11px] text-[#0A1A4A]">
                        {ev.payload}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Subscription Code Container */}
            <div className="space-y-3 rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-[#0056FF] uppercase">
                  Client-Side EventSource Listener Specification
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      `const sse = new EventSource('https://api.snp.edu.kh/api/v1/stream/events?channel=classes.roster.BR-01');\n\nsse.addEventListener('class.seat_reserved', (event) => {\n  const payload = JSON.parse(event.data);\n  console.log('Real-time class update:', payload);\n});`,
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
              <pre className="overflow-x-auto rounded-lg border border-[#CAD3F5] bg-[#FFFFFF] p-4 font-mono text-xs leading-relaxed text-[#0A1A4A]">
                {`// Client-Side Server-Sent Events Listener
const eventSource = new EventSource(
  'https://api.snp.edu.kh/api/v1/stream/events?channel=classes.roster.BR-01'
);

eventSource.addEventListener('class.seat_reserved', (event) => {
  const packet = JSON.parse(event.data);
  console.log('Live seat mutation broadcast:', packet);
});

eventSource.onerror = (err) => {
  console.error('SSE Stream reconnecting via exponential backoff...', err);
};`}
              </pre>
              <p className="text-xs leading-relaxed text-[#0A1A4A]">
                Note: Direct packet injection and mutation dispatch are restricted to backend
                registrar workers. The client channel functions as a high-efficiency one-way
                broadcast.
              </p>
            </div>
          </section>

          {/* ----------------------------------------------------------------- */}
          {/* SECTION 6: BACKEND REST API DIRECTORY & RATE LIMITS */}
          {/* ----------------------------------------------------------------- */}
          <section id="rest-api-directory" className="space-y-6 border-t border-[#CAD3F5] pt-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 text-xs font-bold tracking-wider text-[#0056FF] uppercase">
                <Server className="h-3.5 w-3.5" />
                <span>REST Architecture · Open API 3.1.0 Contract</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-[#0A1A4A]">
                Backend REST API Directory
              </h2>
              <p className="text-sm leading-relaxed font-medium text-[#0A1A4A]">
                Complete reference table of public syndication, health diagnostics, ledger verification,
                and streaming endpoints across the SNP-SMS modular monolith.
              </p>
            </div>

            {/* Endpoints Table */}
            <div className="overflow-hidden rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[#CAD3F5] bg-[#EFF5FF] text-[11px] font-bold tracking-wider text-[#0056FF] uppercase">
                      <th className="px-4 py-3">Method & Route</th>
                      <th className="px-4 py-3">Access Tier</th>
                      <th className="px-4 py-3">Rate Limit</th>
                      <th className="px-4 py-3">Cache Policy</th>
                      <th className="px-4 py-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#CAD3F5] text-xs font-medium text-[#0A1A4A]">
                    {BACKEND_PUBLIC_ENDPOINTS.map((endpoint) => (
                      <tr key={endpoint.path} className="transition-colors hover:bg-[#EFF5FF]/60">
                        <td className="px-4 py-3 font-mono">
                          <span className="mr-2 inline-block rounded bg-[#E3E7FC] px-1.5 py-0.5 text-[10px] font-bold text-[#0056FF]">
                            {endpoint.method}
                          </span>
                          <span className="font-semibold">{endpoint.path}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded border border-[#CAD3F5] bg-[#FFFFFF] px-2 py-0.5 text-[11px] text-[#0A1A4A]">
                            {endpoint.scope}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] text-[#0056FF]">
                          {endpoint.rateLimit}
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] text-[#0A1A4A]/70">
                          {endpoint.cacheControl}
                        </td>
                        <td className="px-4 py-3 text-[11px] text-[#0A1A4A]/80">
                          {endpoint.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RFC 7807 Problem Details Error Contract Box */}
            <div className="space-y-3 rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-[#0056FF] uppercase">
                  RFC 7807 / RFC 9457 Error Response Specification
                </span>
                <span className="font-mono text-[11px] text-[#0A1A4A]/70">
                  Content-Type: application/problem+json
                </span>
              </div>
              <pre className="overflow-x-auto rounded-lg border border-[#CAD3F5] bg-[#FFFFFF] p-4 font-mono text-xs leading-relaxed text-[#0A1A4A]">
                {`{
  "type": "https://api.snp.edu.kh/errors/rate_limit_exceeded",
  "title": "Too Many Requests",
  "status": 429,
  "detail": "Rate limit quota exceeded. Retry after 60 seconds.",
  "instance": "/api/v1/classes?branch=BR-01",
  "retryAfter": 60
}`}
              </pre>
              <p className="text-xs leading-relaxed text-[#0A1A4A]">
                All non-2xx responses from SNP-SMS backend APIs adhere strictly to the RFC 7807 Problem Details standard with deterministic error codes and retry windows.
              </p>
            </div>
          </section>

          {/* ----------------------------------------------------------------- */}
          {/* SECTION 7: CHANGELOGS ANCHOR */}
          {/* ----------------------------------------------------------------- */}
          <section id="changelogs" className="space-y-4 border-t border-[#CAD3F5] pt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#0056FF]" />
                <h3 className="text-base font-bold text-[#0A1A4A]">Syndication API Releases</h3>
              </div>
              <span className="rounded border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 text-xs font-semibold text-[#0056FF]">
                v0.2.12 Active
              </span>
            </div>
            <div className="space-y-2 rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] p-4 text-xs text-[#0A1A4A]">
              <div className="flex items-center justify-between font-bold text-[#0056FF]">
                <span>Latest Update — {CHANGE_LOGS[0]?.version || 'v0.2.12'}</span>
                <span>{CHANGE_LOGS[0]?.date || '2026-10-31'}</span>
              </div>
              <p className="leading-relaxed">
                {CHANGE_LOGS[0]?.description ||
                  'Open API & Syndication Guide redesigned for backend REST API specifications, cryptographic ledger verification, and real-time streaming.'}
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
