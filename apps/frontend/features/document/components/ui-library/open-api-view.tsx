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
import { GeometricHeaderStamp } from '@/features/document/components/ui-library';
import { cn } from '@/lib/utils';

// ============================================================================
// DATA STRUCTURES: ONE-WAY GUIDE SPECIFICATIONS
// ============================================================================

interface PublicFeedSpec {
  id: string;
  title: string;
  category: 'Announcements & News' | 'Emergency Alerts' | 'Credentials Ledger';
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
    title: 'Institutional News & Academic Notices RSS',
    category: 'Announcements & News',
    format: 'RSS 2.0 (XML)',
    endpoint: '/api/v1/public/rss/announcements.xml',
    refreshInterval: '5 minutes cache',
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
    refreshInterval: 'Real-time (60s polling / SSE)',
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
    id: 'feed-ledger-rest',
    title: 'Public Certificate Verification Ledger',
    category: 'Credentials Ledger',
    format: 'REST API',
    endpoint: '/api/v1/verify/certificates/:code',
    refreshInterval: 'Instant (Zero Cache)',
    description:
      'Cryptographically anchored public diploma and transcript verification endpoint with tamper-proof signature check.',
    sampleJson: {
      success: true,
      verified: true,
      certificate: {
        code: 'SNPI-2026-CS-8891',
        studentName: 'Sokha Chan',
        program: 'Bachelor of Computer Science',
        graduationDate: '2026-08-15',
        hashSignature: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      },
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
];

const GUIDE_NAV_ITEMS = [
  { id: 'open-api-head', label: 'Overview & Syndication Standards', tag: '01' },
  { id: 'public-feeds', label: 'Public Feeds & RSS 2.0', tag: '02' },
  { id: 'class-catalog-registration', label: 'Class Roster & Frontsite Studio', tag: '03' },
  { id: 'developer-embed', label: 'Developer Embed Studio', tag: '04' },
  { id: 'realtime-stream', label: 'Real-Time SSE Stream', tag: '05' },
];

// ============================================================================
// MAIN COMPONENT: OPEN API MINIMAL ONE-WAY GUIDE
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
    'feed-ledger-rest': 'json',
  });

  // Class Roster filter state (read-only search)
  const [classSearch, setClassSearch] = React.useState<string>('');
  const [classFilterStatus, setClassFilterStatus] = React.useState<string>('All');

  // Embed Studio format state
  const [embedFormat, setEmbedFormat] = React.useState<'iframe' | 'webcomponent' | 'react'>(
    'iframe',
  );

  // SSE Stream telemetry metrics
  const [streamLatency, setStreamLatency] = React.useState<number>(14);
  const [streamSubscribers, setStreamSubscribers] = React.useState<number>(1428);
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
        {/* MINIMAL LEFT NAVIGATION (5 ANCHORS ONLY) */}
        {/* =================================================================== */}
        <aside className="sticky top-28 hidden w-64 shrink-0 space-y-4 self-start md:block">
          <div className="rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] p-3 shadow-sm">
            <div className="mb-2 flex items-center justify-between border-b border-[#CAD3F5] px-3 py-2">
              <span className="text-[11px] font-black tracking-widest text-[#0056FF] uppercase">
                Guide Navigation
              </span>
              <span className="rounded bg-[#E3E7FC] px-1.5 py-0.5 text-[10px] font-bold text-[#0056FF]">
                One-Way
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
              Real-time public syndicate catalog designed for external school portal and frontsite
              display.
            </p>
          </div>
        </aside>

        {/* =================================================================== */}
        {/* MAIN ONE-WAY GUIDE CONTENT (MAX-W-5XL) */}
        {/* =================================================================== */}
        <main className="max-w-5xl min-w-0 flex-1 space-y-12 pb-24">
          {/* ----------------------------------------------------------------- */}
          {/* SECTION 1: OVERVIEW & SYNDICATION STANDARDS */}
          {/* ----------------------------------------------------------------- */}
          <section id="open-api-head" className="space-y-6 pt-2">
            <div className="flex flex-col gap-4 border-b border-[#CAD3F5] pb-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-1 text-xs font-bold tracking-wider text-[#0056FF] uppercase">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Public Syndication Guide · Display Only</span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-[#0A1A4A] sm:text-4xl">
                  Open API & Syndication Guide
                </h1>
                <p className="text-sm leading-relaxed font-medium text-[#0A1A4A]">
                  SNPI-SMS syndicated developer services and streaming endpoints for external school
                  portals and frontsite applications.
                </p>
              </div>
              <div className="shrink-0">
                <GeometricHeaderStamp
                  codeA="20"
                  titleA="OPEN"
                  codeB="26"
                  titleB="API"
                  className="rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-3"
                />
              </div>
            </div>

            {/* Protocol Status Banner */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-4">
                <span className="mb-1 block text-[11px] font-bold text-[#0056FF] uppercase">
                  Delivery Mode
                </span>
                <span className="text-sm font-bold text-[#0A1A4A]">Public Syndication Only</span>
              </div>
              <div className="rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-4">
                <span className="mb-1 block text-[11px] font-bold text-[#0056FF] uppercase">
                  Operation Scope
                </span>
                <span className="text-sm font-bold text-[#0A1A4A]">Display-Only Data</span>
              </div>
              <div className="rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-4">
                <span className="mb-1 block text-[11px] font-bold text-[#0056FF] uppercase">
                  Stream Transport
                </span>
                <span className="text-sm font-bold text-[#0A1A4A]">
                  Server-Sent Events (HTTP/2)
                </span>
              </div>
            </div>

            {/* 4 Core Features Quick Cards */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <button
                onClick={() => scrollToSection('public-feeds')}
                className="group rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] p-5 text-left shadow-sm transition-all hover:border-[#0056FF] hover:bg-[#EFF5FF]"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded bg-[#E3E7FC] px-2 py-0.5 text-xs font-bold text-[#0056FF]">
                    Feature 01
                  </span>
                  <ArrowRight className="h-4 w-4 text-[#0056FF] transition-transform group-hover:translate-x-1" />
                </div>
                <h3 className="mb-1 text-base font-bold text-[#0A1A4A] group-hover:text-[#0056FF]">
                  Public Feeds & RSS 2.0
                </h3>
                <p className="text-xs leading-relaxed text-[#0A1A4A]">
                  Live XML and JSON syndication feeds for emergency alerts, announcements, and
                  certificates.
                </p>
              </button>

              <button
                onClick={() => scrollToSection('class-catalog-registration')}
                className="group rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] p-5 text-left shadow-sm transition-all hover:border-[#0056FF] hover:bg-[#EFF5FF]"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded bg-[#E3E7FC] px-2 py-0.5 text-xs font-bold text-[#0056FF]">
                    Feature 02
                  </span>
                  <ArrowRight className="h-4 w-4 text-[#0056FF] transition-transform group-hover:translate-x-1" />
                </div>
                <h3 className="mb-1 text-base font-bold text-[#0A1A4A] group-hover:text-[#0056FF]">
                  Class Roster & Frontsite Studio
                </h3>
                <p className="text-xs leading-relaxed text-[#0A1A4A]">
                  Syndicated live catalog, real-time SSE updates, and school frontsite integration.
                </p>
              </button>

              <button
                onClick={() => scrollToSection('developer-embed')}
                className="group rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] p-5 text-left shadow-sm transition-all hover:border-[#0056FF] hover:bg-[#EFF5FF]"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded bg-[#E3E7FC] px-2 py-0.5 text-xs font-bold text-[#0056FF]">
                    Feature 03
                  </span>
                  <ArrowRight className="h-4 w-4 text-[#0056FF] transition-transform group-hover:translate-x-1" />
                </div>
                <h3 className="mb-1 text-base font-bold text-[#0A1A4A] group-hover:text-[#0056FF]">
                  Developer Embed Studio
                </h3>
                <p className="text-xs leading-relaxed text-[#0A1A4A]">
                  Embed responsive widgets in iFrame, Web Component, or React formats with live
                  sandbox controls.
                </p>
              </button>

              <button
                onClick={() => scrollToSection('realtime-stream')}
                className="group rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] p-5 text-left shadow-sm transition-all hover:border-[#0056FF] hover:bg-[#EFF5FF]"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded bg-[#E3E7FC] px-2 py-0.5 text-xs font-bold text-[#0056FF]">
                    Feature 04
                  </span>
                  <ArrowRight className="h-4 w-4 text-[#0056FF] transition-transform group-hover:translate-x-1" />
                </div>
                <h3 className="mb-1 text-base font-bold text-[#0A1A4A] group-hover:text-[#0056FF]">
                  Real-Time SSE Stream
                </h3>
                <p className="text-xs leading-relaxed text-[#0A1A4A]">
                  Server-Sent Events event terminal with latency metrics and live packet
                  broadcasting.
                </p>
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
                alerts, and certificate verification records into external CMS platforms.
              </p>
            </div>

            <div className="space-y-6">
              {PUBLIC_FEEDS_SPECS.map((feed) => {
                const currentFormat = feedFormatTab[feed.id] || (feed.sampleXml ? 'xml' : 'json');
                const hasXml = Boolean(feed.sampleXml);

                return (
                  <div
                    key={feed.id}
                    className="overflow-hidden rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] shadow-sm"
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
                        {hasXml && (
                          <div className="flex items-center gap-1 rounded-lg border border-[#CAD3F5] bg-[#EFF5FF] p-1">
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
                              JSON Specimen
                            </button>
                          </div>
                        )}
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
          {/* SECTION 3: CLASS ROSTER & FRONTSITE STUDIO */}
          {/* ----------------------------------------------------------------- */}
          <section
            id="class-catalog-registration"
            className="space-y-6 border-t border-[#CAD3F5] pt-8"
          >
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 text-xs font-bold tracking-wider text-[#0056FF] uppercase">
                <Layers className="h-3.5 w-3.5" />
                <span>Public Course Catalog & Seat Counts</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-[#0A1A4A]">
                Class Roster & Frontsite Studio
              </h2>
              <p className="text-sm leading-relaxed font-medium text-[#0A1A4A]">
                Syndicated class catalog and seat metrics designed for partner school student
                portals; updates stream automatically without user parameter tampering.
              </p>
            </div>

            {/* Display-Only Filter & Table */}
            <div className="overflow-hidden rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] shadow-sm">
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

            {/* Syndication Integration Specimen Box */}
            <div className="space-y-3 rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider text-[#0056FF] uppercase">
                  Frontsite Integration Pattern (Public Catalog Display)
                </span>
                <span className="font-mono text-[11px] text-[#0A1A4A]/70">
                  GET /api/v1/public/classes
                </span>
              </div>
              <pre className="overflow-x-auto rounded-lg border border-[#CAD3F5] bg-[#FFFFFF] p-4 font-mono text-xs leading-relaxed text-[#0A1A4A]">
                {`// School Frontsite Portal Integration Example
import type { ClassRosterItem } from '@snp/shared';

export async function fetchSyndicatedClasses(): Promise<ClassRosterItem[]> {
  const response = await fetch('https://api.snp.edu.kh/api/v1/public/classes?branch=BR-01', {
    headers: {
      'Accept': 'application/json',
    },
    next: { revalidate: 60 },
  });
  const json = await response.json();
  return json.data.classes;
}`}
              </pre>
              <p className="text-xs leading-relaxed text-[#0A1A4A]">
                Notice: Class roster information is provided as a display-only public catalog for
                frontsite portals.
              </p>
            </div>
          </section>

          {/* ----------------------------------------------------------------- */}
          {/* SECTION 4: DEVELOPER EMBED STUDIO */}
          {/* ----------------------------------------------------------------- */}
          <section id="developer-embed" className="space-y-6 border-t border-[#CAD3F5] pt-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 text-xs font-bold tracking-wider text-[#0056FF] uppercase">
                <Code className="h-3.5 w-3.5" />
                <span>Standardized Responsive Embeds · Display Specification</span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-[#0A1A4A]">
                Developer Embed Studio
              </h2>
              <p className="text-sm leading-relaxed font-medium text-[#0A1A4A]">
                Embed institutional course schedules and notices into third-party portals using
                standardized iFrame, Web Component, or React markup.
              </p>
            </div>

            {/* Standardized Embed Snippets */}
            <div className="overflow-hidden rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] shadow-sm">
              <div className="flex items-center justify-between border-b border-[#CAD3F5] bg-[#EFF5FF] p-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEmbedFormat('iframe')}
                    className={cn(
                      'rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors',
                      embedFormat === 'iframe'
                        ? 'border-[#0056FF] bg-[#0056FF] text-[#FFFFFF]'
                        : 'border-[#CAD3F5] bg-[#FFFFFF] text-[#0A1A4A] hover:bg-[#E3E7FC]',
                    )}
                  >
                    iFrame Embed
                  </button>
                  <button
                    onClick={() => setEmbedFormat('webcomponent')}
                    className={cn(
                      'rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors',
                      embedFormat === 'webcomponent'
                        ? 'border-[#0056FF] bg-[#0056FF] text-[#FFFFFF]'
                        : 'border-[#CAD3F5] bg-[#FFFFFF] text-[#0A1A4A] hover:bg-[#E3E7FC]',
                    )}
                  >
                    Web Component
                  </button>
                  <button
                    onClick={() => setEmbedFormat('react')}
                    className={cn(
                      'rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors',
                      embedFormat === 'react'
                        ? 'border-[#0056FF] bg-[#0056FF] text-[#FFFFFF]'
                        : 'border-[#CAD3F5] bg-[#FFFFFF] text-[#0A1A4A] hover:bg-[#E3E7FC]',
                    )}
                  >
                    React Component
                  </button>
                </div>

                <button
                  onClick={() =>
                    handleCopy(
                      embedFormat === 'iframe'
                        ? '<iframe src="https://embed.snp.edu.kh/v1/classes?branch=BR-01&theme=light" width="100%" height="480" frameborder="0" loading="lazy"></iframe>'
                        : embedFormat === 'webcomponent'
                          ? '<script type="module" src="https://cdn.snp.edu.kh/embed/snp-catalog.js"></script>\n<snp-class-catalog branch-id="BR-01" limit="5" theme="light"></snp-class-catalog>'
                          : 'import { SnpClassCatalog } from \'@snp/embed-react\';\n\nexport function CampusPortal() {\n  return <SnpClassCatalog branchId="BR-01" limit={5} theme="light" />;\n}',
                      'embed-code',
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#CAD3F5] bg-[#FFFFFF] px-3 py-1.5 text-xs font-semibold text-[#0056FF] transition-colors hover:bg-[#E3E7FC]"
                >
                  {copiedId === 'embed-code' ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Snippet</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 sm:p-5">
                <pre className="overflow-x-auto rounded-lg border border-[#CAD3F5] bg-[#EFF5FF] p-4 font-mono text-xs leading-relaxed text-[#0A1A4A]">
                  {embedFormat === 'iframe' &&
                    `<iframe
  src="https://embed.snp.edu.kh/v1/classes?branch=BR-01&theme=light"
  width="100%"
  height="480"
  frameborder="0"
  loading="lazy"
  title="SNP Institute Syndicated Class Catalog"
></iframe>`}
                  {embedFormat === 'webcomponent' &&
                    `<!-- Include SNP Syndicated Web Component Library -->
<script type="module" src="https://cdn.snp.edu.kh/embed/snp-catalog.js"></script>

<!-- Render Responsive Class Schedule Widget -->
<snp-class-catalog
  branch-id="BR-01"
  limit="5"
  theme="light"
></snp-class-catalog>`}
                  {embedFormat === 'react' &&
                    `import { SnpClassCatalog } from '@snp/embed-react';

export function SchoolPortal() {
  return (
    <div className="portal-schedule-container">
      <SnpClassCatalog
        branchId="BR-01"
        limit={5}
        theme="light"
      />
    </div>
  );
}`}
                </pre>
              </div>
            </div>

            {/* Display-Only Sandbox Preview */}
            <div className="overflow-hidden rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] shadow-sm">
              <div className="flex items-center justify-between border-b border-[#CAD3F5] bg-[#EFF5FF] p-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#CAD3F5]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#CAD3F5]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#CAD3F5]" />
                  </div>
                  <span className="font-mono text-[11px] text-[#0A1A4A]/70">
                    https://partner-portal.edu.kh/embed/classes
                  </span>
                </div>
                <span className="rounded bg-[#E3E7FC] px-2 py-0.5 text-[10px] font-bold text-[#0056FF]">
                  Viewport Preview (Display Only)
                </span>
              </div>

              {/* Simulated Embedded Widget */}
              <div className="bg-[#EFF5FF]/40 p-6">
                <div className="mx-auto max-w-2xl space-y-4 rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] p-5 shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#CAD3F5] pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-[#0A1A4A]">
                        SNP Institute · Syndicated Class Schedule
                      </h4>
                      <span className="text-[11px] text-[#0A1A4A]/70">
                        Term 1 2026-2027 · Main Campus
                      </span>
                    </div>
                    <span className="rounded bg-[#E3E7FC] px-2 py-0.5 text-[10px] font-bold text-[#0056FF]">
                      Live Syndication
                    </span>
                  </div>

                  <div className="space-y-2">
                    {SAMPLE_CLASSES_CATALOG.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-lg border border-[#CAD3F5] bg-[#FFFFFF] p-3"
                      >
                        <div>
                          <span className="block font-mono text-xs font-bold text-[#0056FF]">
                            {item.code}
                          </span>
                          <span className="text-xs font-semibold text-[#0A1A4A]">{item.name}</span>
                          <span className="block text-[11px] text-[#0A1A4A]/70">
                            {item.schedule}
                          </span>
                        </div>
                        <span className="rounded bg-[#E3E7FC] px-2 py-1 text-[10px] font-bold text-[#0056FF]">
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-center">
                    <span className="text-[11px] text-[#0A1A4A]/60">
                      Powered by SNPI-SMS Open API · Syndicated Sandbox Specimen
                    </span>
                  </div>
                </div>
              </div>
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
                Real-Time SSE Stream
              </h2>
              <p className="text-sm leading-relaxed font-medium text-[#0A1A4A]">
                Persistent Server-Sent Events channel streaming live academic mutations and campus
                telemetry directly to subscriber client applications.
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
            <div className="overflow-hidden rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] shadow-sm">
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
          {/* OPTIONAL / COMPACT SECTION: CHANGELOGS ANCHOR */}
          {/* ----------------------------------------------------------------- */}
          <section id="changelogs" className="space-y-4 border-t border-[#CAD3F5] pt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-[#0056FF]" />
                <h3 className="text-base font-bold text-[#0A1A4A]">Syndication API Releases</h3>
              </div>
              <span className="rounded border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 text-xs font-semibold text-[#0056FF]">
                v0.2.7 Active
              </span>
            </div>
            <div className="space-y-2 rounded-xl border border-[#CAD3F5] bg-[#FFFFFF] p-4 text-xs text-[#0A1A4A]">
              <div className="flex items-center justify-between font-bold text-[#0056FF]">
                <span>Latest Update — {CHANGE_LOGS[0]?.version || 'v0.2.7'}</span>
                <span>{CHANGE_LOGS[0]?.date || '2026-10-31'}</span>
              </div>
              <p className="leading-relaxed">
                {CHANGE_LOGS[0]?.description ||
                  'Open API syndicated guide redesigned for minimal one-way reference.'}
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
