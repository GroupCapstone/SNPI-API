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
  Pause,
  Play,
  Radio,
  RotateCcw,
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
import {
  GeometricButton,
  GeometricInput,
  GeometricHeaderStamp,
} from '@/features/document/components/ui-library';
import { cn } from '@/lib/utils';

interface AccessRoleSpec {
  role: string;
  targetAudience: string;
  accessScope: string;
  allowedEndpoints: string;
  securityMethod: string;
}

const ACCESS_ROLES: AccessRoleSpec[] = [
  {
    role: 'Public / Guest',
    targetAudience: 'External verification portals, monitoring probes',
    accessScope: 'Public (Zero login required)',
    allowedEndpoints:
      'GET /api/v1/health, /health/liveness, /health/readiness, /verify/certificates/:code',
    securityMethod: 'IP Rate Limiting (2000 req / 15m), Read-only public projection',
  },
  {
    role: 'External Partner / Dev Service Account',
    targetAudience: 'Third-party LMS, biometric attendance devices, mobile apps',
    accessScope: 'Specific branch scoped via X-Branch-Id',
    allowedEndpoints:
      'GET /students, GET /classes, GET /attendance, POST /attendance, GET /academic-years',
    securityMethod:
      'Dedicated service account credentials, short-lived JWT, least-privilege permissions',
  },
  {
    role: 'Teachers & Academic Staff',
    targetAudience: 'Faculty mobile portal & web classroom dashboard',
    accessScope: 'Assigned classes and subjects only',
    allowedEndpoints: 'GET /classes, GET /attendance, POST /attendance, GET /scores, POST /scores',
    securityMethod: 'JWT Bearer auth, branch access check, teacher assignment verification',
  },
  {
    role: 'Cashier & Finance Officers',
    targetAudience: 'Campus tuition counter & cashier POS',
    accessScope: 'Own campus branch financial data',
    allowedEndpoints: 'GET /tuition-fees, GET /payment-plans, GET /payments, POST /payments',
    securityMethod: 'JWT Bearer auth, cashier shift check, ACID transaction sessions',
  },
  {
    role: 'Branch Directors & Principals',
    targetAudience: 'Campus leadership and academic directors',
    accessScope: 'Entire campus branch (all departments & students)',
    allowedEndpoints:
      'Full CRUD across campus students, employees, classes, reports, and attendance',
    securityMethod: 'JWT Bearer auth, branch.view.own_branch, strict X-Branch-Id validation',
  },
  {
    role: 'Super Administrator',
    targetAudience: 'Headquarters IT & institutional executive management',
    accessScope: 'All branches, all schools, all configurations (*)',
    allowedEndpoints: 'Unrestricted access to all 193 endpoints across all 47 modules',
    securityMethod: 'JWT Bearer auth + role super_admin + wildcard permission (*)',
  },
];

interface AvailableEndpoint {
  category: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  requiredPermission: string;
}

const AVAILABLE_ENDPOINTS_FOR_DEVS: AvailableEndpoint[] = [
  {
    category: 'Authentication',
    method: 'POST',
    path: '/api/v1/auth/login',
    description: 'Exchange service credentials for a 15-minute JWT access token',
    requiredPermission: 'Public',
  },
  {
    category: 'Authentication',
    method: 'GET',
    path: '/api/v1/auth/me',
    description: 'Inspect active token scopes, permissions set, and authorized branch IDs',
    requiredPermission: 'Authenticated Session',
  },
  {
    category: 'Students',
    method: 'GET',
    path: '/api/v1/students',
    description: 'Query paginated student profiles with multi-field search and status filters',
    requiredPermission: 'student.view.own_branch',
  },
  {
    category: 'Students',
    method: 'GET',
    path: '/api/v1/students/:id',
    description: 'Retrieve detailed student profile including demographic and guardian data',
    requiredPermission: 'student.view.own_branch',
  },
  {
    category: 'Enrollments',
    method: 'GET',
    path: '/api/v1/enrollments',
    description: 'Query active student class enrollment records for an academic year',
    requiredPermission: 'enrollment.view.own_branch',
  },
  {
    category: 'Classes & Academics',
    method: 'GET',
    path: '/api/v1/classes',
    description: 'Retrieve campus classes, grade levels, and room capacities',
    requiredPermission: 'class.view.own_branch',
  },
  {
    category: 'Classes & Academics',
    method: 'GET',
    path: '/api/v1/academic-years',
    description: 'Query active and historical school academic years and calendars',
    requiredPermission: 'academic_year.view.all_branches',
  },
  {
    category: 'Classes & Academics',
    method: 'GET',
    path: '/api/v1/academic-periods',
    description: 'Retrieve terms and semesters within an academic year',
    requiredPermission: 'academic_period.view.own_branch',
  },
  {
    category: 'Classes & Academics',
    method: 'GET',
    path: '/api/v1/subjects',
    description: 'List curricular subjects, credit weights, and course descriptions',
    requiredPermission: 'subject.view.all_branches',
  },
  {
    category: 'Attendance',
    method: 'GET',
    path: '/api/v1/attendance',
    description: 'Query daily roll-call records by class, student, or specific date',
    requiredPermission: 'attendance.view.own_branch',
  },
  {
    category: 'Attendance',
    method: 'POST',
    path: '/api/v1/attendance',
    description: 'Record biometric or batch roll-call attendance entries',
    requiredPermission: 'attendance.create.own_branch',
  },
  {
    category: 'Examinations & Scores',
    method: 'GET',
    path: '/api/v1/scores',
    description: 'Query student examination results and assessment score entries',
    requiredPermission: 'score.view.own_branch',
  },
  {
    category: 'Examinations & Scores',
    method: 'GET',
    path: '/api/v1/term-results',
    description: 'Retrieve computed term grades, GPA ranks, and promotion standings',
    requiredPermission: 'term_result.view.own_branch',
  },
  {
    category: 'Finance & Payments',
    method: 'GET',
    path: '/api/v1/tuition-fees',
    description: 'List published tuition fee catalog rates and installment schedules',
    requiredPermission: 'tuition.view.own_branch',
  },
  {
    category: 'Finance & Payments',
    method: 'GET',
    path: '/api/v1/payments',
    description: 'Query student tuition payment receipts and invoice statuses',
    requiredPermission: 'payment.view.own_branch',
  },
  {
    category: 'Health & Probes',
    method: 'GET',
    path: '/api/v1/health',
    description: 'Inspect API service vitality and MongoDB database connection state',
    requiredPermission: 'Public',
  },
];

interface ProtectedMutationSpec {
  domain: string;
  method: 'POST' | 'PATCH' | 'DELETE';
  path: string;
  purpose: string;
  whyProtected: string;
  defenseMechanisms: string;
}

const PROTECTED_MUTATION_ENDPOINTS: ProtectedMutationSpec[] = [
  {
    domain: 'Payments & Billing',
    method: 'POST',
    path: '/api/v1/payments',
    purpose: 'Record cash/KHQR payment and issue immutable receipt',
    whyProtected: 'Prevents financial balance tampering and unauthorized receipt fabrication',
    defenseMechanisms:
      'ACID transaction (runInTransaction), cashier shift lock, payment.create.own_branch',
  },
  {
    domain: 'Student Enrollment Status',
    method: 'PATCH',
    path: '/api/v1/students/:id',
    purpose: 'Modify student active, suspended, or transferred status',
    whyProtected: 'Protects academic history and prevents unauthorized student deactivations',
    defenseMechanisms:
      'Audit log event capture, student.edit.own_branch, historical correction record',
  },
  {
    domain: 'Grading & Scores',
    method: 'POST',
    path: '/api/v1/scores',
    purpose: 'Submit student examination scores',
    whyProtected: 'Prevents unauthorized grade alteration and ensures academic integrity',
    defenseMechanisms:
      'Teacher assignment verification, score.create.own_branch, mutation rate limiting',
  },
  {
    domain: 'Users & Roles',
    method: 'POST',
    path: '/api/v1/users',
    purpose: 'Create user accounts and assign RBAC roles',
    whyProtected: 'Prevents privilege escalation and unauthorized administrator provisioning',
    defenseMechanisms:
      'user.create.all_branches, Argon2/bcrypt password hashing, super_admin boundary',
  },
  {
    domain: 'School Institutional Profile',
    method: 'PATCH',
    path: '/api/v1/schools/:id',
    purpose: 'Update legal school profile, tax identifiers, and global settings',
    whyProtected: 'Governs high-level multi-campus institutional identity',
    defenseMechanisms: 'school.edit.all_branches, super_admin role check, audit logging',
  },
  {
    domain: 'System Permissions Matrix',
    method: 'PATCH',
    path: '/api/v1/roles/:id',
    purpose: 'Modify permission sets assigned to a role',
    whyProtected: 'Prevents unauthorized grant of system-wide privileges',
    defenseMechanisms: 'role.edit.all_branches, system role immutability, audit logging',
  },
];

const STATUS_CODES = [
  {
    code: '200',
    status: 'OK',
    desc: 'The request succeeded and returned the requested payload.',
  },
  {
    code: '201',
    status: 'Created',
    desc: 'New entity created successfully in database.',
  },
  {
    code: '400',
    status: 'Bad Request',
    desc: 'Payload validation failed against strict Zod schema.',
  },
  {
    code: '401',
    status: 'Unauthorized',
    desc: 'Missing, expired, or invalid JWT Bearer token.',
  },
  {
    code: '403',
    status: 'Forbidden',
    desc: 'Authenticated caller lacks required RBAC permission or branch scope.',
  },
  {
    code: '404',
    status: 'Not Found',
    desc: 'Requested route or resource identifier does not exist.',
  },
  {
    code: '429',
    status: 'Too Many Requests',
    desc: 'Rate limit exceeded (standard draft-8 headers provided).',
  },
];

interface ApiDocItem {
  id: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  title: string;
  summary: string;
  permission: string;
  scopeHeader: boolean;
  requestBody?: Record<string, unknown>;
  responseBody: Record<string, unknown>;
}

const INTERACTIVE_ITEMS: ApiDocItem[] = [
  {
    id: 'auth-login',
    method: 'POST',
    path: '/api/v1/auth/login',
    title: '1. User Sign In & Token Issuance',
    summary:
      'Authenticate credentials and obtain a short-lived (15m) JWT access token and HttpOnly refresh cookie.',
    permission: 'Public',
    scopeHeader: false,
    requestBody: {
      identifier: '<SERVICE_ACCOUNT_IDENTIFIER>',
      password: '<SECURE_AUTHENTICATION_CREDENTIAL>',
    },
    responseBody: {
      success: true,
      message: 'Login successful',
      data: {
        accessToken: '<JWT_ACCESS_TOKEN_SAMPLE>',
        user: {
          id: '<USER_UUID>',
          username: '<AUTHORIZED_OPERATOR>',
          email: '<AUTHORIZED_USER_EMAIL>',
          roles: ['super_admin'],
          branchAccess: 'all',
        },
      },
    },
  },
  {
    id: 'students-list',
    method: 'GET',
    path: '/api/v1/students',
    title: '2. Query Students Directory',
    summary:
      'Query paginated student records with search filtering, grade level, and enrollment status.',
    permission: 'student.view.own_branch',
    scopeHeader: true,
    responseBody: {
      success: true,
      message: 'Students retrieved successfully',
      data: [
        {
          id: '6720d9...',
          studentCode: 'STU-2026-0001',
          firstNameEn: 'Dara',
          lastNameEn: 'Sok',
          gender: 'male',
          status: 'enrolled',
        },
      ],
      meta: { page: 1, limit: 20, total: 1 },
    },
  },
  {
    id: 'classes-list',
    method: 'GET',
    path: '/api/v1/classes',
    title: '3. Query Classes & Classrooms',
    summary:
      'Query campus classes, classroom room codes, grade levels, and maximum seating capacity.',
    permission: 'class.view.own_branch',
    scopeHeader: true,
    responseBody: {
      success: true,
      message: 'Classes retrieved successfully',
      data: [],
      meta: { page: 1, limit: 20, total: 0 },
    },
  },
  {
    id: 'attendance-query',
    method: 'GET',
    path: '/api/v1/attendance',
    title: '4. Daily Attendance Records',
    summary:
      'Retrieve student attendance status (Present, Absent, Late, Excused) by class and date.',
    permission: 'attendance.view.own_branch',
    scopeHeader: true,
    responseBody: {
      success: true,
      message: 'Attendance retrieved successfully',
      data: [],
      meta: { page: 1, limit: 20, total: 0 },
    },
  },
  {
    id: 'payments-query',
    method: 'GET',
    path: '/api/v1/payments',
    title: '5. Tuition Payments & Invoices',
    summary:
      'Query tuition transaction history, receipt numbers, and payment reconciliation statuses.',
    permission: 'payment.view.own_branch',
    scopeHeader: true,
    responseBody: {
      success: true,
      message: 'Payments retrieved successfully',
      data: [],
      meta: { page: 1, limit: 20, total: 0 },
    },
  },
  {
    id: 'health-query',
    method: 'GET',
    path: '/api/v1/health',
    title: '6. System Health Probes',
    summary: 'Check API vitality and active MongoDB replica set connection state.',
    permission: 'Public',
    scopeHeader: false,
    responseBody: {
      success: true,
      message: 'Service is healthy',
      data: {
        service: 'SNPI-SMS API',
        status: 'healthy',
        database: 'connected',
        version: '0.2.7',
        timestamp: '2026-10-30T12:00:00.000Z',
      },
    },
  },
];

interface PublicFeedSpec {
  id: string;
  title: string;
  category: 'Announcements & News' | 'Emergency Alerts' | 'Class Catalog' | 'Credentials Ledger';
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
    id: 'feed-classes-rest',
    title: 'Public Class Catalog & Real-Time Capacity Feed',
    category: 'Class Catalog',
    format: 'REST API',
    endpoint: '/api/v1/public/classes',
    refreshInterval: '60s Edge cache',
    description:
      'Read-only public projection of active classes, schedule slots, room locations, and remaining capacity seats.',
    sampleJson: {
      success: true,
      data: {
        academicYear: '2026-2027',
        totalClasses: 48,
        classes: [
          {
            code: 'CLS-2026-CS101',
            name: 'Introduction to Computer Science & Algorithms',
            capacity: 30,
            enrolled: 26,
            seatsAvailable: 4,
          },
        ],
      },
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
    payload: '{"code":"CLS-2026-CS101","enrolled":27,"capacity":30}',
  },
  {
    id: 'ev-3',
    timestamp: '16:41:45',
    channel: 'alerts.emergency',
    eventName: 'alert.broadcast',
    payload: '{"id":"ALT-2026-904","headline":"Gate 2 Maintenance Notice"}',
  },
  {
    id: 'ev-4',
    timestamp: '16:42:10',
    channel: 'classes.roster.BR-01',
    eventName: 'class.seat_reserved',
    payload: '{"code":"CLS-2026-NET201","enrolled":29,"capacity":30}',
  },
];

const DOC_TOC_HEADINGS = [
  { id: 'open-api-head', title: 'Open API', level: 1 },
  { id: 'introduction', title: 'Introduction', level: 2 },
  { id: 'purpose', title: '1. Purpose', level: 2 },
  { id: 'scope', title: '2. Scope', level: 2 },
  { id: 'overall-api', title: '3. Overall API', level: 2 },
  { id: 'who-can-access', title: 'Who Can Access', level: 1 },
  { id: 'public-feeds', title: 'Public Feeds & RSS', level: 1 },
  { id: 'developer-embed', title: 'Developer Embed Studio', level: 1 },
  { id: 'class-catalog-registration', title: 'Class Roster & Frontsite Studio', level: 1 },
  { id: 'realtime-stream', title: 'Real-Time Stream Engine', level: 1 },
  { id: 'endpoints-available', title: 'Endpoints Catalog', level: 1 },
  { id: 'protected-endpoints', title: 'Protected Endpoints', level: 2 },
  { id: 'api-doc', title: 'API Documentation', level: 1 },
  { id: 'status-codes', title: 'Status Codes', level: 2 },
  { id: 'changelogs', title: 'Change Logs', level: 1 },
  { id: 'privacy-policy', title: 'Privacy Policy', level: 2 },
  { id: 'terms-of-service', title: 'Terms of Service', level: 2 },
];

async function executeApiProbe(item: ApiDocItem) {
  const start = performance.now();
  try {
    if (item.path === '/api/v1/health') {
      const res = await fetch('http://localhost:4000/api/v1/health');
      const data = await res.json();
      const latency = Math.round(performance.now() - start);
      return { status: res.status, latency, body: data };
    } else {
      await new Promise((r) => setTimeout(r, 180));
      const latency = Math.round(performance.now() - start);
      return { status: 200, latency, body: item.responseBody };
    }
  } catch {
    const latency = Math.round(performance.now() - start);
    return { status: 200, latency, body: item.responseBody };
  }
}

export function OpenApiView({ initialSection }: { initialSection?: string } = {}) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const isManualScrollRef = React.useRef<boolean>(false);
  const scrollTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const [activeDocSection, setActiveDocSection] = React.useState<string>(
    initialSection || 'open-api-head',
  );
  const [expandedChangelog, setExpandedChangelog] = React.useState<boolean>(
    initialSection === 'changelogs',
  );
  const [codeType, setCodeType] = React.useState<'curl' | 'ts' | 'json'>('curl');
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (initialSection === 'changelogs') {
      setExpandedChangelog(true);
      const timer = setTimeout(() => {
        const el = document.getElementById('changelogs');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [initialSection]);

  // Search query & Category filter for Left Sidebar Navigation (Matching UI Library)
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('All Modules');

  const categories = React.useMemo(() => {
    const counts: Record<string, number> = {};
    for (const ep of AVAILABLE_ENDPOINTS_FOR_DEVS) {
      counts[ep.category] = (counts[ep.category] || 0) + 1;
    }
    const list = Object.entries(counts).map(([name, count]) => ({ name, count }));
    return [{ name: 'All Modules', count: AVAILABLE_ENDPOINTS_FOR_DEVS.length }, ...list];
  }, []);

  const filteredEndpoints = React.useMemo(() => {
    return AVAILABLE_ENDPOINTS_FOR_DEVS.filter((ep) => {
      const matchCat =
        selectedCategory === 'All' ||
        selectedCategory === 'All Modules' ||
        ep.category === selectedCategory;
      if (!matchCat) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        ep.path.toLowerCase().includes(q) ||
        ep.description.toLowerCase().includes(q) ||
        ep.category.toLowerCase().includes(q) ||
        ep.method.toLowerCase().includes(q) ||
        ep.requiredPermission.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedCategory]);

  const scrollToDocSection = (id: string) => {
    setActiveDocSection(id);
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

  React.useEffect(() => {
    const handleScroll = () => {
      if (!rootRef.current || rootRef.current.offsetParent === null || isManualScrollRef.current) {
        return;
      }

      const isAtBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;
      if (isAtBottom) {
        setActiveDocSection('changelogs');
        return;
      }

      const scrollPosition = window.scrollY + 140;
      for (let i = DOC_TOC_HEADINGS.length - 1; i >= 0; i--) {
        const item = DOC_TOC_HEADINGS[i];
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPosition >= top) {
            setActiveDocSection(item.id);
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

  // Live test states
  const [testingEndpointId, setTestingEndpointId] = React.useState<string | null>(null);
  const [testResults, setTestResults] = React.useState<
    Record<string, { status: number; latency: number; body: unknown }>
  >({});

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTest = async (item: ApiDocItem) => {
    setTestingEndpointId(item.id);
    try {
      const result = await executeApiProbe(item);
      setTestResults((prev) => ({
        ...prev,
        [item.id]: result,
      }));
    } finally {
      setTestingEndpointId(null);
    }
  };

  const generateSnippet = (item: ApiDocItem, format: 'curl' | 'ts' | 'json') => {
    const isPost = item.method === 'POST';
    if (format === 'curl') {
      let cmd = `curl -X ${item.method} "http://localhost:4000${item.path}" \\\n`;
      cmd += `  -H "Accept: application/json"`;
      if (isPost) cmd += ` \\\n  -H "Content-Type: application/json"`;
      if (item.permission !== 'Public') {
        cmd += ` \\\n  -H "Authorization: Bearer <ACCESS_TOKEN>"`;
      }
      if (item.scopeHeader) {
        cmd += ` \\\n  -H "X-Branch-Id: <BRANCH_ID>"`;
      }
      if (isPost && item.requestBody) {
        cmd += ` \\\n  -d '${JSON.stringify(item.requestBody, null, 2)}'`;
      }
      return cmd;
    }
    if (format === 'ts') {
      return `// TypeScript fetch client
import type { ApiSuccessResponse } from '@snp/shared';

const res = await fetch('http://localhost:4000${item.path}', {
  method: '${item.method}',
  headers: {
    'Accept': 'application/json',${isPost ? "\n    'Content-Type': 'application/json'," : ''}
    'Authorization': \`Bearer \${accessToken}\`,${item.scopeHeader ? "\n    'X-Branch-Id': branchId," : ''}
  },${isPost && item.requestBody ? `\n  body: JSON.stringify(${JSON.stringify(item.requestBody, null, 4)}),` : ''}
});

const payload: ApiSuccessResponse<unknown> = await res.json();
console.log(payload.data);`;
    }
    return JSON.stringify(item.responseBody, null, 2);
  };

  // Public Feed format preview tabs (per feed id: 'rss' | 'json')
  const [activeFeedFormat, setActiveFeedFormat] = React.useState<Record<string, 'rss' | 'json'>>({
    'feed-news-rss': 'rss',
    'feed-alerts-json': 'json',
    'feed-classes-rest': 'json',
    'feed-ledger-rest': 'json',
  });

  // Developer Embed Studio state
  const [embedFormat, setEmbedFormat] = React.useState<'iframe' | 'webcomponent' | 'react' | 'rss'>(
    'iframe',
  );
  const [embedViewport, setEmbedViewport] = React.useState<'desktop' | 'tablet' | 'mobile'>(
    'desktop',
  );
  const [embedBranch, setEmbedBranch] = React.useState<string>('BR-01');
  const [embedTheme, setEmbedTheme] = React.useState<'light' | 'dark'>('light');
  const [embedLimit, setEmbedLimit] = React.useState<number>(5);

  // Interactive Class Catalog Table & Frontsite Integration Studio state
  const [classesList, setClassesList] = React.useState<ClassRosterItem[]>(SAMPLE_CLASSES_CATALOG);
  const [classSearch, setClassSearch] = React.useState<string>('');
  const [classFilterStatus, setClassFilterStatus] = React.useState<string>('All');
  const [selectedFrontsiteClass, setSelectedFrontsiteClass] = React.useState<ClassRosterItem>(
    SAMPLE_CLASSES_CATALOG[0],
  );
  const [frontsiteStudioTab, setFrontsiteStudioTab] = React.useState<
    'preview-ui' | 'json-feed' | 'code-snippets' | 'auth-policy'
  >('preview-ui');
  const [integrationCodeTab, setIntegrationCodeTab] = React.useState<
    'react' | 'types' | 'nextjs' | 'curl'
  >('react');
  const [isSimulatingSseUpdate, setIsSimulatingSseUpdate] = React.useState<boolean>(false);
  const [lastSseUpdatedClassCode, setLastSseUpdatedClassCode] = React.useState<string | null>(null);
  const [frontsiteCopied, setFrontsiteCopied] = React.useState<string | null>(null);

  // Real-Time Event Stream Simulator state
  const [isStreamActive, setIsStreamActive] = React.useState<boolean>(true);
  const [streamEvents, setStreamEvents] = React.useState<LiveStreamEvent[]>(INITIAL_STREAM_EVENTS);
  const [streamConnectedClients, setStreamConnectedClients] = React.useState<number>(1428);
  const [streamLatency, setStreamLatency] = React.useState<number>(14);

  // Access Control Simulator Role state
  const [simulatedRoleIndex, setSimulatedRoleIndex] = React.useState<number>(0);
  const [simulatedTestFeedback, setSimulatedTestFeedback] = React.useState<{
    endpoint: string;
    status: number;
    message: string;
  } | null>(null);

  React.useEffect(() => {
    if (!isStreamActive) return;
    const interval = setInterval(() => {
      setStreamLatency(Math.floor(11 + Math.random() * 8));
      setStreamConnectedClients((prev) => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 4500);
    return () => clearInterval(interval);
  }, [isStreamActive]);

  // Filtered classes for interactive table
  const filteredClasses = React.useMemo(() => {
    return classesList.filter((item) => {
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
  }, [classesList, classSearch, classFilterStatus]);

  // Simulate real-time background SSE stream event from external server
  const handleSimulateRealtimeSseUpdate = () => {
    setIsSimulatingSseUpdate(true);
    const targetIdx = Math.floor(Math.random() * classesList.length);
    const target = classesList[targetIdx];

    setTimeout(() => {
      setClassesList((prev) =>
        prev.map((c, i) => {
          if (i === targetIdx) {
            const nextEnrolled = Math.min(c.capacity, c.enrolled + 1);
            return {
              ...c,
              enrolled: nextEnrolled,
              status:
                nextEnrolled >= c.capacity
                  ? 'Waitlist'
                  : nextEnrolled >= c.capacity - 2
                    ? 'Filling Fast'
                    : 'Open',
            };
          }
          return c;
        }),
      );
      setLastSseUpdatedClassCode(target.code);
      setIsSimulatingSseUpdate(false);

      // Prepend event to the stream inspector
      const newEvent: LiveStreamEvent = {
        id: `ev-${Date.now()}`,
        timestamp: new Date().toTimeString().slice(0, 8),
        channel: `classes.roster.BR-01`,
        eventName: 'class.seat_reserved',
        payload: JSON.stringify({
          ticket: `REG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          code: target.code,
          enrolled: Math.min(target.capacity, target.enrolled + 1),
          capacity: target.capacity,
          channel: 'sse.stream',
        }),
      };
      setStreamEvents((prev) => [newEvent, ...prev.slice(0, 9)]);

      setTimeout(() => {
        setLastSseUpdatedClassCode(null);
      }, 3500);
    }, 300);
  };

  const handleResetCatalog = () => {
    setClassesList(SAMPLE_CLASSES_CATALOG);
    setLastSseUpdatedClassCode(null);
  };

  const handleCopyFrontsiteContent = (text: string, type: string) => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setFrontsiteCopied(type);
    setTimeout(() => setFrontsiteCopied(null), 2000);
  };

  const handleTriggerTestEvent = (eventName: string, sampleData: Record<string, unknown>) => {
    const newEvent: LiveStreamEvent = {
      id: `ev-${Date.now()}`,
      timestamp: new Date().toTimeString().slice(0, 8),
      channel: 'live.broadcast',
      eventName,
      payload: JSON.stringify(sampleData),
    };
    setStreamEvents((prev) => [newEvent, ...prev.slice(0, 9)]);
  };

  const generateEmbedSnippet = () => {
    const baseUrl = 'https://snp.edu.kh';
    if (embedFormat === 'iframe') {
      return `<!-- SNP-SMS Live Class Embed Widget (iFrame) -->
<iframe
  src="${baseUrl}/embed/classes?branch=${embedBranch}&theme=${embedTheme}&limit=${embedLimit}"
  width="100%"
  height="460"
  style="border: 0; border-radius: 12px; overflow: hidden;"
  title="SNP Institute Live Class Catalog"
  loading="lazy"
></iframe>`;
    }
    if (embedFormat === 'webcomponent') {
      return `<!-- SNP-SMS Vanilla Web Component Script -->
<script src="${baseUrl}/embed/v1/widget.js" async></script>

<!-- Live Embed Element -->
<snp-class-catalog
  branch-id="${embedBranch}"
  theme="${embedTheme}"
  max-items="${embedLimit}"
></snp-class-catalog>`;
    }
    if (embedFormat === 'react') {
      return `// React / Next.js Embed Component
import { SnpClassCatalog } from '@snp/embed-react';

export function AcademicPortal() {
  return (
    <SnpClassCatalog
      branchId="${embedBranch}"
      theme="${embedTheme}"
      maxItems={${embedLimit}}
      onRegisterClick={(classCode) => console.log('Enrolling in:', classCode)}
    />
  );
}`;
    }
    return `<!-- Syndicate RSS Feed URL for External CMS / Aggregators -->
${baseUrl}/api/v1/public/rss/announcements.xml?branch=${embedBranch}`;
  };

  const currentHeadingObj = DOC_TOC_HEADINGS.find((h) => h.id === activeDocSection);
  const currentBreadcrumbLabel = currentHeadingObj ? currentHeadingObj.title : 'Overview';

  return (
    <div
      ref={rootRef}
      className="min-h-screen bg-white text-[#0A1A4A] selection:bg-[#0056FF] selection:text-white"
    >
      {/* Nextra Docs Container (Authentic 3-Column Markdown-Powered Docs Architecture) */}
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* COLUMN 1: Nextra Left Sidebar Navigation Tree */}
          <aside className="sticky top-20 hidden max-h-[calc(100vh-6rem)] w-64 shrink-0 [scrollbar-width:thin] overflow-y-auto pr-3 lg:block">
            <div className="space-y-5">
              {/* Nextra Search Input */}
              <div className="relative">
                <div className="relative flex items-center">
                  <Search className="absolute left-2.5 size-3.5 text-[#2277FF]" />
                  <input
                    type="text"
                    placeholder="Search docs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-md border border-[#CAD3F5] bg-[#EFF5FF] py-1.5 pr-8 pl-8 font-sans text-xs text-[#0A1A4A] transition-all placeholder:text-[#2277FF] focus:border-[#0056FF] focus:bg-white focus:outline-none"
                  />
                  <kbd className="absolute right-2 rounded border border-[#CAD3F5] bg-white px-1.5 py-0.5 font-mono text-[10px] text-[#2277FF] shadow-2xs">
                    /
                  </kbd>
                </div>
              </div>

              {/* Group 1: Getting Started */}
              <div className="space-y-1">
                <div className="px-2.5 py-1 font-mono text-[10.5px] font-bold tracking-wider text-[#2277FF] uppercase">
                  Getting Started
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All Modules');
                    setSearchQuery('');
                    scrollToDocSection('open-api-head');
                  }}
                  className={cn(
                    'group flex w-full cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-left font-sans text-xs transition-colors',
                    activeDocSection === 'open-api-head'
                      ? 'bg-[#0056FF]/10 font-bold text-[#0056FF]'
                      : 'font-medium text-[#0A1A4A]/70 hover:bg-[#EFF5FF] hover:text-[#0A1A4A]',
                  )}
                >
                  <span className="truncate">Overview</span>
                </button>
                <button
                  type="button"
                  onClick={() => scrollToDocSection('introduction')}
                  className={cn(
                    'group flex w-full cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-left font-sans text-xs transition-colors',
                    activeDocSection === 'introduction' ||
                      ['purpose', 'scope', 'overall-api'].includes(activeDocSection)
                      ? 'bg-[#0056FF]/10 font-bold text-[#0056FF]'
                      : 'font-medium text-[#0A1A4A]/70 hover:bg-[#EFF5FF] hover:text-[#0A1A4A]',
                  )}
                >
                  <span className="truncate">Introduction &amp; Scope</span>
                </button>
                <button
                  type="button"
                  onClick={() => scrollToDocSection('who-can-access')}
                  className={cn(
                    'group flex w-full cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-left font-sans text-xs transition-colors',
                    activeDocSection === 'who-can-access'
                      ? 'bg-[#0056FF]/10 font-bold text-[#0056FF]'
                      : 'font-medium text-[#0A1A4A]/70 hover:bg-[#EFF5FF] hover:text-[#0A1A4A]',
                  )}
                >
                  <span className="truncate">Access Control (RBAC)</span>
                </button>
              </div>

              {/* Group 2: Public Syndication */}
              <div className="space-y-1 pt-2">
                <div className="px-2.5 py-1 font-mono text-[10.5px] font-bold tracking-wider text-[#2277FF] uppercase">
                  Public Syndication
                </div>
                <button
                  type="button"
                  onClick={() => scrollToDocSection('public-feeds')}
                  className={cn(
                    'group flex w-full cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-left font-sans text-xs transition-colors',
                    activeDocSection === 'public-feeds'
                      ? 'bg-[#0056FF]/10 font-bold text-[#0056FF]'
                      : 'font-medium text-[#0A1A4A]/70 hover:bg-[#EFF5FF] hover:text-[#0A1A4A]',
                  )}
                >
                  <span className="truncate">Public Feeds &amp; RSS 2.0</span>
                </button>
                <button
                  type="button"
                  onClick={() => scrollToDocSection('developer-embed')}
                  className={cn(
                    'group flex w-full cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-left font-sans text-xs transition-colors',
                    activeDocSection === 'developer-embed'
                      ? 'bg-[#0056FF]/10 font-bold text-[#0056FF]'
                      : 'font-medium text-[#0A1A4A]/70 hover:bg-[#EFF5FF] hover:text-[#0A1A4A]',
                  )}
                >
                  <span className="truncate">Developer Embed Studio</span>
                </button>
              </div>

              {/* Group 3: Academic Engines */}
              <div className="space-y-1 pt-2">
                <div className="px-2.5 py-1 font-mono text-[10.5px] font-bold tracking-wider text-[#2277FF] uppercase">
                  Academic Services
                </div>
                <button
                  type="button"
                  onClick={() => scrollToDocSection('class-catalog-registration')}
                  className={cn(
                    'group flex w-full cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-left font-sans text-xs transition-colors',
                    activeDocSection === 'class-catalog-registration'
                      ? 'bg-[#0056FF]/10 font-bold text-[#0056FF]'
                      : 'font-medium text-[#0A1A4A]/70 hover:bg-[#EFF5FF] hover:text-[#0A1A4A]',
                  )}
                >
                  <span className="truncate">Class Roster &amp; Frontsite Studio</span>
                </button>
                <button
                  type="button"
                  onClick={() => scrollToDocSection('realtime-stream')}
                  className={cn(
                    'group flex w-full cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-left font-sans text-xs transition-colors',
                    activeDocSection === 'realtime-stream'
                      ? 'bg-[#0056FF]/10 font-bold text-[#0056FF]'
                      : 'font-medium text-[#0A1A4A]/70 hover:bg-[#EFF5FF] hover:text-[#0A1A4A]',
                  )}
                >
                  <span className="truncate">Real-Time Stream (SSE)</span>
                </button>
              </div>

              {/* Group 4: REST API Modules */}
              <div className="space-y-1 pt-2">
                <div className="flex items-center justify-between px-2.5 py-1 font-mono text-[10.5px] font-bold tracking-wider text-[#2277FF] uppercase">
                  <span>REST Endpoints</span>
                  <span className="font-mono text-[10px] text-[#0056FF]">{categories.length}</span>
                </div>
                <div className="space-y-0.5">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.name;
                    return (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat.name);
                          setSearchQuery('');
                          scrollToDocSection('endpoints-available');
                        }}
                        className={cn(
                          'group flex w-full cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-left font-sans text-xs transition-colors',
                          isSelected
                            ? 'bg-[#0056FF]/10 font-bold text-[#0056FF]'
                            : 'font-normal text-[#0A1A4A]/70 hover:bg-[#EFF5FF] hover:text-[#0A1A4A]',
                        )}
                      >
                        <span className="truncate">{cat.name}</span>
                        <span
                          className={cn(
                            'py-0.2 rounded px-1.5 font-mono text-[10px]',
                            isSelected
                              ? 'bg-[#0056FF]/20 font-bold text-[#0056FF]'
                              : 'bg-[#EFF5FF] text-[#2277FF]',
                          )}
                        >
                          {cat.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Group 5: Developer Reference */}
              <div className="space-y-1 pt-2">
                <div className="px-2.5 py-1 font-mono text-[10.5px] font-bold tracking-wider text-[#2277FF] uppercase">
                  Developer Reference
                </div>
                <button
                  type="button"
                  onClick={() => scrollToDocSection('api-doc')}
                  className={cn(
                    'group flex w-full cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-left font-sans text-xs transition-colors',
                    activeDocSection === 'api-doc'
                      ? 'bg-[#0056FF]/10 font-bold text-[#0056FF]'
                      : 'font-medium text-[#0A1A4A]/70 hover:bg-[#EFF5FF] hover:text-[#0A1A4A]',
                  )}
                >
                  <span className="truncate">Interactive API Probe</span>
                </button>
                <button
                  type="button"
                  onClick={() => scrollToDocSection('protected-endpoints')}
                  className={cn(
                    'group flex w-full cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-left font-sans text-xs transition-colors',
                    activeDocSection === 'protected-endpoints'
                      ? 'bg-[#0056FF]/10 font-bold text-[#0056FF]'
                      : 'font-medium text-[#0A1A4A]/70 hover:bg-[#EFF5FF] hover:text-[#0A1A4A]',
                  )}
                >
                  <span className="truncate">Protected Endpoints</span>
                </button>
                <button
                  type="button"
                  onClick={() => scrollToDocSection('status-codes')}
                  className={cn(
                    'group flex w-full cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-left font-sans text-xs transition-colors',
                    activeDocSection === 'status-codes'
                      ? 'bg-[#0056FF]/10 font-bold text-[#0056FF]'
                      : 'font-medium text-[#0A1A4A]/70 hover:bg-[#EFF5FF] hover:text-[#0A1A4A]',
                  )}
                >
                  <span className="truncate">HTTP Status Codes</span>
                </button>
                <button
                  type="button"
                  onClick={() => scrollToDocSection('changelogs')}
                  className={cn(
                    'group flex w-full cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-left font-sans text-xs transition-colors',
                    activeDocSection === 'changelogs'
                      ? 'bg-[#0056FF]/10 font-bold text-[#0056FF]'
                      : 'font-medium text-[#0A1A4A]/70 hover:bg-[#EFF5FF] hover:text-[#0A1A4A]',
                  )}
                >
                  <span className="truncate">API Change Logs</span>
                </button>
              </div>
            </div>
          </aside>

          {/* COLUMN 2: Nextra Center Main Markdown Prose */}
          <main className="max-w-5xl min-w-0 flex-1 space-y-10 lg:px-4">
            {/* Nextra Breadcrumb Bar */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 font-sans text-xs text-[#2277FF]"
            >
              <button
                type="button"
                onClick={() => scrollToDocSection('open-api-head')}
                className="cursor-pointer transition-colors hover:text-[#0A1A4A]/80"
              >
                Docs
              </button>
              <span className="text-[#CAD3F5]">/</span>
              <button
                type="button"
                onClick={() => scrollToDocSection('open-api-head')}
                className="cursor-pointer transition-colors hover:text-[#0A1A4A]/80"
              >
                Open API
              </button>
              <span className="text-[#CAD3F5]">/</span>
              <span className="font-semibold text-[#0A1A4A]">{currentBreadcrumbLabel}</span>
            </nav>

            {/* Nextra Clean Document Header */}
            <header
              id="open-api-head"
              className="scroll-mt-24 space-y-3 border-b border-[#CAD3F5] pb-6"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-[#CAD3F5] bg-[#E3E7FC] px-2 py-0.5 font-mono text-[11px] font-bold text-[#0056FF]">
                  Nextra Docs Starter Kit
                </span>
                <span className="font-sans text-xs text-[#2277FF]">
                  REST &amp; Syndication v1.4
                </span>
              </div>
              <h1 className="group flex items-center font-sans text-3xl font-extrabold tracking-tight text-[#0A1A4A] sm:text-4xl">
                <span>Open API Reference</span>
                <a
                  href="#open-api-head"
                  className="ml-2 text-[#CAD3F5] opacity-0 transition-opacity group-hover:opacity-100"
                >
                  #
                </a>
              </h1>
              <p className="max-w-3xl font-sans text-sm leading-relaxed text-[#0A1A4A]/70 sm:text-base">
                Simple, powerful and flexible markdown-powered docs site. Built with Next.js.
                Exposes public RSS 2.0 XML and JSON syndication feeds, responsive developer embed
                widgets, live academic class catalogs, and real-time Server-Sent Events (SSE).
              </p>
            </header>

            {/* Nextra Callout: Multi-Branch & Security */}
            <div className="rounded-lg border border-[#CAD3F5] bg-[#EFF5FF] p-4 text-[#0A1A4A]">
              <div className="flex gap-3">
                <div className="mt-0.5 size-5 shrink-0 text-[#0056FF]">
                  <CircleAlert className="size-5" />
                </div>
                <div className="space-y-1 text-xs sm:text-sm">
                  <p className="font-semibold text-[#0056FF]">
                    Multi-Branch Scoping &amp; Public Rate Limits
                  </p>
                  <p className="leading-relaxed text-[#0A1A4A]/70">
                    Public syndication feeds and read-only catalogs require no authorization headers
                    and are safeguarded by edge rate limits (2,000 req / 15m). Authenticated
                    administrative mutations require{' '}
                    <code className="rounded bg-[#E3E7FC] px-1 py-0.5 font-mono text-xs text-[#0056FF]">
                      Authorization: Bearer &lt;token&gt;
                    </code>{' '}
                    and{' '}
                    <code className="rounded bg-[#E3E7FC] px-1 py-0.5 font-mono text-xs text-[#0056FF]">
                      X-Branch-Id: &lt;branch&gt;
                    </code>
                    .
                  </p>
                </div>
              </div>
            </div>

            {/* Nextra Feature Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div
                onClick={() => scrollToDocSection('public-feeds')}
                className="group cursor-pointer rounded-lg border border-[#CAD3F5] bg-white p-4.5 transition-all hover:border-[#0056FF] hover:shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-8 items-center justify-center rounded-md border border-[#CAD3F5] bg-[#E3E7FC] text-[#0056FF]">
                    <Radio className="size-4" />
                  </div>
                  <span className="font-mono text-xs text-[#2277FF] transition-all group-hover:translate-x-0.5 group-hover:text-[#0056FF]">
                    →
                  </span>
                </div>
                <h3 className="mt-3 font-sans text-sm font-bold text-[#0A1A4A] transition-colors group-hover:text-[#0056FF]">
                  Public Feeds &amp; RSS 2.0
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#2277FF]">
                  Live XML and JSON syndication feeds for emergency alerts, announcements, and
                  certificates.
                </p>
              </div>

              <div
                onClick={() => scrollToDocSection('developer-embed')}
                className="group cursor-pointer rounded-lg border border-[#CAD3F5] bg-white p-4.5 transition-all hover:border-[#0056FF] hover:shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-8 items-center justify-center rounded-md border border-[#CAD3F5] bg-[#E3E7FC] text-[#0056FF]">
                    <Code className="size-4" />
                  </div>
                  <span className="font-mono text-xs text-[#2277FF] transition-all group-hover:translate-x-0.5 group-hover:text-[#0056FF]">
                    →
                  </span>
                </div>
                <h3 className="mt-3 font-sans text-sm font-bold text-[#0A1A4A] transition-colors group-hover:text-[#0056FF]">
                  Developer Embed Studio
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#2277FF]">
                  Embed responsive widgets in iFrame, Web Component, or React formats with live
                  sandbox controls.
                </p>
              </div>

              <div
                onClick={() => scrollToDocSection('class-catalog-registration')}
                className="group cursor-pointer rounded-lg border border-[#CAD3F5] bg-white p-4.5 transition-all hover:border-[#0056FF] hover:shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-8 items-center justify-center rounded-md border border-[#CAD3F5] bg-[#E3E7FC] text-[#0056FF]">
                    <Layers className="size-4" />
                  </div>
                  <span className="font-mono text-xs text-[#2277FF] transition-all group-hover:translate-x-0.5 group-hover:text-[#0056FF]">
                    →
                  </span>
                </div>
                <h3 className="mt-3 font-sans text-sm font-bold text-[#0A1A4A] transition-colors group-hover:text-[#0056FF]">
                  Class Roster &amp; Frontsite Studio
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#2277FF]">
                  Syndicated live catalog, real-time SSE updates, and school frontsite integration.
                </p>
              </div>

              <div
                onClick={() => scrollToDocSection('realtime-stream')}
                className="group cursor-pointer rounded-lg border border-[#CAD3F5] bg-white p-4.5 transition-all hover:border-[#0056FF] hover:shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-8 items-center justify-center rounded-md border border-[#CAD3F5] bg-[#E3E7FC] text-[#0056FF]">
                    <Terminal className="size-4" />
                  </div>
                  <span className="font-mono text-xs text-[#2277FF] transition-all group-hover:translate-x-0.5 group-hover:text-[#0056FF]">
                    →
                  </span>
                </div>
                <h3 className="mt-3 font-sans text-sm font-bold text-[#0A1A4A] transition-colors group-hover:text-[#0056FF]">
                  Real-Time SSE Stream
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#2277FF]">
                  Server-Sent Events event terminal with latency metrics and live packet
                  broadcasting.
                </p>
              </div>
            </div>

            {/* Nextra Steps Quickstart */}
            <div className="space-y-4 rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-5">
              <h3 className="font-sans text-sm font-bold text-[#0A1A4A]">
                Integration Quickstart in 3 Steps
              </h3>
              <div className="relative ml-3 space-y-5 border-l-2 border-[#CAD3F5] pl-6">
                <div className="relative">
                  <div className="absolute top-0 -left-[31px] flex size-6 items-center justify-center rounded-full border-2 border-white bg-[#0056FF] font-mono text-xs font-bold text-white shadow-xs">
                    1
                  </div>
                  <h4 className="font-sans text-xs font-bold text-[#0A1A4A]">
                    Choose Your Data Ingestion Channel
                  </h4>
                  <p className="mt-0.5 font-sans text-xs leading-relaxed text-[#0A1A4A]/70">
                    Subscribe to public XML RSS feeds, consume JSON endpoints, or open a live SSE
                    stream connection for instant updates.
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute top-0 -left-[31px] flex size-6 items-center justify-center rounded-full border-2 border-white bg-[#0056FF] font-mono text-xs font-bold text-white shadow-xs">
                    2
                  </div>
                  <h4 className="font-sans text-xs font-bold text-[#0A1A4A]">
                    Scope Requests by Campus Branch
                  </h4>
                  <p className="mt-0.5 font-sans text-xs leading-relaxed text-[#0A1A4A]/70">
                    Append{' '}
                    <code className="rounded bg-[#EFF5FF] px-1 py-0.5 font-mono text-[11px] text-[#0056FF]">
                      ?branch=BR-01
                    </code>{' '}
                    or header{' '}
                    <code className="rounded bg-[#EFF5FF] px-1 py-0.5 font-mono text-[11px] text-[#0A1A4A]/80">
                      X-Branch-Id: BR-01
                    </code>{' '}
                    to target your local campus.
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute top-0 -left-[31px] flex size-6 items-center justify-center rounded-full border-2 border-white bg-[#0056FF] font-mono text-xs font-bold text-white shadow-xs">
                    3
                  </div>
                  <h4 className="font-sans text-xs font-bold text-[#0A1A4A]">
                    Embed Widgets or Handle Events
                  </h4>
                  <p className="mt-0.5 font-sans text-xs leading-relaxed text-[#0A1A4A]/70">
                    Copy pre-built snippets from the Developer Embed Studio to drop class rosters
                    and registration forms directly into your CMS.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 1: Introduction */}
            <section id="introduction" className="scroll-mt-24 space-y-6">
              <h2 className="text-base font-bold tracking-tight text-[#0A1A4A]">Introduction</h2>

              {/* 1. Purpose */}
              <div id="purpose" className="scroll-mt-24 space-y-2">
                <h3 className="font-mono text-xs font-bold tracking-wider text-[#0A1A4A] uppercase">
                  1. Purpose
                </h3>
                <p className="font-sans text-xs leading-relaxed text-[#0A1A4A]/70">
                  This document describes the technical REST API specification of the SNPI
                  Integrated Multi-Branch School Management System (SNPI-SMS). The primary audience
                  is third-party integrators, mobile developers, campus IT staff, and administrative
                  client systems.
                </p>
              </div>

              {/* 2. Scope */}
              <div id="scope" className="scroll-mt-24 space-y-2">
                <h3 className="font-mono text-xs font-bold tracking-wider text-[#0A1A4A] uppercase">
                  2. Scope
                </h3>
                <p className="font-sans text-xs leading-relaxed text-[#0A1A4A]/70">
                  Defines all accessible API surfaces, multi-branch scoping headers (X-Branch-Id),
                  who can access each resource, authentication and token refresh lifecycles, and
                  defense mechanisms safeguarding sensitive financial and academic mutations.
                </p>
              </div>

              {/* 3. Overall API */}
              <div id="overall-api" className="scroll-mt-24 space-y-3">
                <h3 className="font-mono text-xs font-bold tracking-wider text-[#0A1A4A] uppercase">
                  3. Overall API
                </h3>
                <div className="grid grid-cols-1 gap-3 font-mono text-xs sm:grid-cols-2">
                  <div className="space-y-1 rounded-xl border border-[#CAD3F5] bg-white p-3.5 transition-all hover:border-[#0056FF]">
                    <span className="text-[11px] font-semibold tracking-wider text-[#2277FF] uppercase">
                      Base URL
                    </span>
                    <p className="truncate font-bold text-[#0056FF]">
                      http://localhost:4000/api/v1
                    </p>
                  </div>
                  <div className="space-y-1 rounded-xl border border-[#CAD3F5] bg-white p-3.5 transition-all hover:border-[#0056FF]">
                    <span className="text-[11px] font-semibold tracking-wider text-[#2277FF] uppercase">
                      Payload Format
                    </span>
                    <p className="font-bold text-[#0A1A4A]">JSON (application/json)</p>
                  </div>
                  <div className="space-y-1 rounded-xl border border-[#CAD3F5] bg-white p-3.5 transition-all hover:border-[#0056FF]">
                    <span className="text-[11px] font-semibold tracking-wider text-[#2277FF] uppercase">
                      Authorization
                    </span>
                    <p className="font-bold text-[#0A1A4A]">Bearer &lt;access_token&gt;</p>
                  </div>
                  <div className="space-y-1 rounded-xl border border-[#CAD3F5] bg-white p-3.5 transition-all hover:border-[#0056FF]">
                    <span className="text-[11px] font-semibold tracking-wider text-[#2277FF] uppercase">
                      Campus Isolation
                    </span>
                    <p className="font-bold text-[#0056FF]">X-Branch-Id: &lt;branch_id&gt;</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Who Can Access The API (Modern Card Grid - No Table) */}
            <section
              id="who-can-access"
              className="scroll-mt-24 space-y-4 border-t border-[#CAD3F5] pt-8"
            >
              <div>
                <h2 className="text-base font-bold tracking-tight text-[#0A1A4A]">
                  Who Can Access The API
                </h2>
                <p className="mt-1 text-xs text-[#2277FF]">
                  Access is strictly governed by Role-Based Access Control (RBAC) and campus branch
                  boundaries.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {ACCESS_ROLES.map((role) => (
                  <div
                    key={role.role}
                    className="flex flex-col justify-between rounded-xl border border-[#CAD3F5] bg-white p-4.5 transition-all duration-150 hover:border-[#0056FF] hover:bg-[#EFF5FF]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-3 py-1 font-sans text-xs font-bold text-[#0056FF]">
                          {role.role}
                        </span>
                        <span className="font-mono text-[10px] font-semibold text-[#2277FF] uppercase">
                          RBAC Scope
                        </span>
                      </div>
                      <p className="mt-2.5 font-sans text-xs font-semibold text-[#0A1A4A]">
                        {role.targetAudience}
                      </p>
                      <div className="mt-3 space-y-1.5 rounded-lg border border-[#CAD3F5] bg-[#EFF5FF] p-3">
                        <div className="font-sans text-[11px] font-bold text-[#0A1A4A]">
                          {role.accessScope}
                        </div>
                        <p className="font-mono text-[11px] leading-relaxed text-[#0A1A4A]/70">
                          {role.allowedEndpoints}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3.5 border-t border-[#CAD3F5] pt-2.5">
                      <span className="font-sans text-[11px] text-[#2277FF]">
                        <strong className="font-semibold text-[#0A1A4A]/80">Security: </strong>
                        {role.securityMethod}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Interactive Access Control & Scope Simulator */}
              <div className="mt-6 space-y-4 rounded-2xl border border-[#CAD3F5] bg-[#EFF5FF] p-5">
                <div className="flex flex-col justify-between gap-3 border-b border-[#CAD3F5] pb-3 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="flex items-center gap-2 font-sans text-sm font-bold text-[#0A1A4A]">
                      <ShieldCheck className="size-4 text-[#0056FF]" />
                      <span>Access Control &amp; Token Scope Simulator</span>
                    </h3>
                    <p className="font-sans text-xs text-[#2277FF]">
                      Select an actor role to inspect generated request headers and test
                      authorization defense boundaries.
                    </p>
                  </div>
                  <span className="rounded-md border border-[#CAD3F5] bg-white px-2.5 py-1 font-mono text-xs font-bold text-[#0056FF]">
                    Active: {ACCESS_ROLES[simulatedRoleIndex].role}
                  </span>
                </div>

                {/* Role Tabs */}
                <div className="flex flex-wrap gap-1.5">
                  {ACCESS_ROLES.map((r, idx) => (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => {
                        setSimulatedRoleIndex(idx);
                        setSimulatedTestFeedback(null);
                      }}
                      className={cn(
                        'rounded-[4px] border-0 px-3 py-1 font-sans text-xs font-bold transition-all',
                        simulatedRoleIndex === idx
                          ? 'bg-[#0056FF] text-white shadow-xs'
                          : 'border border-[#CAD3F5] bg-white text-[#0A1A4A]/80 hover:bg-[#E3E7FC]',
                      )}
                    >
                      {r.role}
                    </button>
                  ))}
                </div>

                {/* Simulated Headers & Actions */}
                <div className="grid grid-cols-1 gap-4 pt-1 font-sans text-xs md:grid-cols-2">
                  <div className="space-y-1.5">
                    <span className="font-mono text-[10px] font-bold text-[#2277FF] uppercase">
                      Generated Client Headers
                    </span>
                    <div className="space-y-1 rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-3 font-mono text-[11px] text-[#CAD3F5]">
                      <div>
                        <span className="text-[#2277FF]">Accept:</span> application/json
                      </div>
                      <div>
                        <span className="text-[#2277FF]">Authorization:</span>{' '}
                        {simulatedRoleIndex === 0
                          ? '<None — Anonymous Guest>'
                          : `Bearer snp_token_${ACCESS_ROLES[simulatedRoleIndex].role.toLowerCase().replace(/[^a-z]/g, '_')}_active`}
                      </div>
                      <div>
                        <span className="text-[#2277FF]">X-Branch-Id:</span>{' '}
                        {simulatedRoleIndex === 0 ? '<None>' : 'BR-01 (Phnom Penh Main)'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-mono text-[10px] font-bold text-[#2277FF] uppercase">
                      Test Authorization Response
                    </span>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSimulatedTestFeedback({
                              endpoint: 'GET /api/v1/health',
                              status: 200,
                              message:
                                'HTTP 200 OK — Allowed: Public endpoint accessible without session',
                            });
                          }}
                          className="rounded-[4px] border border-0 border-[#CAD3F5] bg-white px-2.5 py-1 font-mono text-[11px] font-bold text-[#0A1A4A] hover:border-[#0056FF]"
                        >
                          GET /api/v1/health
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSimulatedTestFeedback({
                              endpoint: 'GET /api/v1/classes',
                              status: 200,
                              message:
                                'HTTP 200 OK — Allowed: Scoped to BR-01 class schedule catalog',
                            });
                          }}
                          className="rounded-[4px] border border-0 border-[#CAD3F5] bg-white px-2.5 py-1 font-mono text-[11px] font-bold text-[#0A1A4A] hover:border-[#0056FF]"
                        >
                          GET /api/v1/classes
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const isAllowed = simulatedRoleIndex === 3 || simulatedRoleIndex === 5; // Cashier or Super Admin
                            setSimulatedTestFeedback({
                              endpoint: 'POST /api/v1/payments',
                              status: isAllowed ? 201 : 403,
                              message: isAllowed
                                ? 'HTTP 201 Created — Allowed: Authorized payment cashier session'
                                : 'HTTP 403 Forbidden — Blocked: Missing permission payment.create.own_branch',
                            });
                          }}
                          className="rounded-[4px] border border-0 border-[#CAD3F5] bg-white px-2.5 py-1 font-mono text-[11px] font-bold text-[#0A1A4A] hover:border-[#0056FF]"
                        >
                          POST /api/v1/payments
                        </button>
                      </div>

                      {simulatedTestFeedback && (
                        <div
                          className={cn(
                            'rounded-xl border p-3 font-mono text-[11px]',
                            simulatedTestFeedback.status === 200 ||
                              simulatedTestFeedback.status === 201
                              ? 'border-[#CAD3F5] bg-[#EFF5FF] text-[#0A1A4A]'
                              : 'border-[#0056FF] bg-[#EFF5FF] text-[#0A1A4A]',
                          )}
                        >
                          <div className="font-bold">{simulatedTestFeedback.endpoint}</div>
                          <div className="mt-0.5">{simulatedTestFeedback.message}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Public Feeds & Live Syndication (RSS & JSON) */}
            <section
              id="public-feeds"
              className="scroll-mt-24 space-y-6 border-t border-[#CAD3F5] pt-8"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-md border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 font-mono text-[11px] font-bold text-[#0056FF]">
                      SYNDICATION & FEEDS
                    </span>
                    <span className="font-mono text-xs text-[#2277FF]">Zero Auth Required</span>
                  </div>
                  <h2 className="mt-2 text-xl font-bold tracking-tight text-[#0A1A4A] sm:text-2xl">
                    Public APIs & Live Data Feeds
                  </h2>
                  <p className="mt-1 max-w-2xl text-xs text-[#2277FF]">
                    Expose standardized RSS 2.0 XML, JSON syndication, and public REST endpoints for
                    external CMS platforms, mobile widgets, news aggregators, and credential
                    verification.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {PUBLIC_FEEDS_SPECS.map((feed) => {
                  const format =
                    activeFeedFormat[feed.id] || (feed.format.includes('RSS') ? 'rss' : 'json');
                  const isXmlAvailable = Boolean(feed.sampleXml);

                  return (
                    <div
                      key={feed.id}
                      className="flex flex-col justify-between rounded-2xl border border-[#CAD3F5] bg-white p-5 shadow-xs transition-all duration-150 hover:border-[#0056FF] hover:bg-[#EFF5FF]/50"
                    >
                      <div>
                        {/* Header metadata */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded-full border border-[#CAD3F5] bg-[#EFF5FF] px-2.5 py-0.5 font-sans text-[11px] font-semibold text-[#0A1A4A]/80">
                            {feed.category}
                          </span>
                          <span className="font-mono text-[10px] font-bold text-[#0056FF]">
                            {feed.refreshInterval}
                          </span>
                        </div>

                        <h3 className="mt-2.5 font-sans text-sm font-bold text-[#0A1A4A]">
                          {feed.title}
                        </h3>
                        <p className="mt-1 font-sans text-xs leading-relaxed text-[#0A1A4A]/70">
                          {feed.description}
                        </p>

                        {/* Endpoint Box */}
                        <div className="mt-3.5 flex items-center justify-between rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] px-3 py-2 font-mono text-xs">
                          <div className="truncate font-bold text-[#0A1A4A]">
                            <span className="mr-2 text-[#0056FF]">GET</span>
                            {feed.endpoint}
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(`https://snp.edu.kh${feed.endpoint}`, feed.id)
                            }
                            className="ml-2 inline-flex items-center gap-1 rounded-[4px] border-0 bg-white px-2 py-1 font-mono text-[11px] font-semibold text-[#0A1A4A]/80 shadow-xs hover:text-[#0056FF]"
                          >
                            {copiedId === feed.id ? (
                              <>
                                <Check className="size-3 text-[#0056FF]" />
                                <span>Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="size-3 text-[#2277FF]" />
                                <span>Copy URL</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Format Switcher */}
                        {isXmlAvailable && (
                          <div className="mt-3 flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold text-[#2277FF] uppercase">
                              Format:
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setActiveFeedFormat((prev) => ({ ...prev, [feed.id]: 'rss' }))
                              }
                              className={cn(
                                'rounded-[4px] border-0 px-2 py-0.5 font-mono text-[11px] font-bold transition-colors',
                                format === 'rss'
                                  ? 'bg-[#0056FF] text-white'
                                  : 'bg-[#EFF5FF] text-[#0A1A4A]/70 hover:bg-[#E3E7FC]',
                              )}
                            >
                              XML RSS 2.0
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setActiveFeedFormat((prev) => ({ ...prev, [feed.id]: 'json' }))
                              }
                              className={cn(
                                'rounded-[4px] border-0 px-2 py-0.5 font-mono text-[11px] font-bold transition-colors',
                                format === 'json'
                                  ? 'bg-[#0056FF] text-white'
                                  : 'bg-[#EFF5FF] text-[#0A1A4A]/70 hover:bg-[#E3E7FC]',
                              )}
                            >
                              JSON Feed
                            </button>
                          </div>
                        )}

                        {/* Code preview */}
                        <div className="mt-3 max-h-44 overflow-y-auto rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-3 font-mono text-[11px] text-[#CAD3F5]">
                          <pre className="overflow-x-auto whitespace-pre">
                            {format === 'rss' && feed.sampleXml
                              ? feed.sampleXml
                              : JSON.stringify(feed.sampleJson, null, 2)}
                          </pre>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between border-t border-[#CAD3F5] pt-3">
                        <span className="font-mono text-[11px] text-[#2277FF]">
                          Format: <strong className="text-[#0A1A4A]">{feed.format}</strong>
                        </span>
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-[#0056FF]">
                          <CircleCheck className="size-3" />
                          Public Access
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section 4: Developer Embed Studio & Live Sandbox */}
            <section
              id="developer-embed"
              className="scroll-mt-24 space-y-6 border-t border-[#CAD3F5] pt-8"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-md border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 font-mono text-[11px] font-bold text-[#0056FF]">
                      EMBED STUDIO
                    </span>
                    <span className="font-mono text-xs text-[#2277FF]">
                      Third-Party Integration
                    </span>
                  </div>
                  <h2 className="mt-2 text-xl font-bold tracking-tight text-[#0A1A4A] sm:text-2xl">
                    Developer Embed Studio &amp; Live Sandbox
                  </h2>
                  <p className="mt-1 max-w-2xl text-xs text-[#2277FF]">
                    Embed live institutional schedules, academic rosters, and notices into any
                    external web application using plug-and-play iFrames, Web Components, or React
                    widgets.
                  </p>
                </div>
              </div>

              {/* Embed Configuration Panel */}
              <div className="space-y-5 rounded-2xl border border-[#CAD3F5] bg-white p-5 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#CAD3F5] pb-4">
                  {/* Format Tabs */}
                  <div className="flex items-center gap-1.5 rounded-lg border border-[#CAD3F5] bg-[#EFF5FF] p-1">
                    <button
                      type="button"
                      onClick={() => setEmbedFormat('iframe')}
                      className={cn(
                        'rounded-[4px] border-0 px-3 py-1 font-sans text-xs font-bold transition-all',
                        embedFormat === 'iframe'
                          ? 'bg-[#0056FF] text-white shadow-xs'
                          : 'text-[#0A1A4A]/70 hover:text-[#0A1A4A]',
                      )}
                    >
                      iFrame
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmbedFormat('webcomponent')}
                      className={cn(
                        'rounded-[4px] border-0 px-3 py-1 font-sans text-xs font-bold transition-all',
                        embedFormat === 'webcomponent'
                          ? 'bg-[#0056FF] text-white shadow-xs'
                          : 'text-[#0A1A4A]/70 hover:text-[#0A1A4A]',
                      )}
                    >
                      Web Component
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmbedFormat('react')}
                      className={cn(
                        'rounded-[4px] border-0 px-3 py-1 font-sans text-xs font-bold transition-all',
                        embedFormat === 'react'
                          ? 'bg-[#0056FF] text-white shadow-xs'
                          : 'text-[#0A1A4A]/70 hover:text-[#0A1A4A]',
                      )}
                    >
                      React
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmbedFormat('rss')}
                      className={cn(
                        'rounded-[4px] border-0 px-3 py-1 font-sans text-xs font-bold transition-all',
                        embedFormat === 'rss'
                          ? 'bg-[#0056FF] text-white shadow-xs'
                          : 'text-[#0A1A4A]/70 hover:text-[#0A1A4A]',
                      )}
                    >
                      RSS URL
                    </button>
                  </div>

                  {/* Viewport switchers */}
                  <div className="flex items-center gap-1.5 font-sans text-xs">
                    <span className="mr-1 font-mono text-[10px] font-bold text-[#2277FF] uppercase">
                      Viewport:
                    </span>
                    <button
                      type="button"
                      onClick={() => setEmbedViewport('desktop')}
                      className={cn(
                        'rounded-[4px] border-0 px-2.5 py-1 font-semibold transition-colors',
                        embedViewport === 'desktop'
                          ? 'bg-[#0056FF] text-white'
                          : 'bg-[#EFF5FF] text-[#0A1A4A]/70 hover:bg-[#E3E7FC]',
                      )}
                    >
                      Desktop (100%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmbedViewport('tablet')}
                      className={cn(
                        'rounded-[4px] border-0 px-2.5 py-1 font-semibold transition-colors',
                        embedViewport === 'tablet'
                          ? 'bg-[#0056FF] text-white'
                          : 'bg-[#EFF5FF] text-[#0A1A4A]/70 hover:bg-[#E3E7FC]',
                      )}
                    >
                      Tablet (768px)
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmbedViewport('mobile')}
                      className={cn(
                        'rounded-[4px] border-0 px-2.5 py-1 font-semibold transition-colors',
                        embedViewport === 'mobile'
                          ? 'bg-[#0056FF] text-white'
                          : 'bg-[#EFF5FF] text-[#0A1A4A]/70 hover:bg-[#E3E7FC]',
                      )}
                    >
                      Mobile (380px)
                    </button>
                  </div>
                </div>

                {/* Props Customizer Toolbar */}
                <div className="grid grid-cols-1 gap-3 font-sans text-xs sm:grid-cols-3">
                  <div>
                    <label className="block font-mono text-[10px] font-bold text-[#2277FF] uppercase">
                      Campus Branch
                    </label>
                    <select
                      value={embedBranch}
                      onChange={(e) => setEmbedBranch(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-[#CAD3F5] bg-white px-3 py-1.5 font-semibold text-[#0A1A4A] focus:border-[#0056FF] focus:outline-none"
                    >
                      <option value="BR-01">BR-01 (Main Campus)</option>
                      <option value="BR-02">BR-02 (Tuol Kork)</option>
                      <option value="BR-03">BR-03 (Sen Sok)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] font-bold text-[#2277FF] uppercase">
                      Theme Palette
                    </label>
                    <select
                      value={embedTheme}
                      onChange={(e) => setEmbedTheme(e.target.value as 'light' | 'dark')}
                      className="mt-1 w-full rounded-lg border border-[#CAD3F5] bg-white px-3 py-1.5 font-semibold text-[#0A1A4A] focus:border-[#0056FF] focus:outline-none"
                    >
                      <option value="light">Light Day (Default)</option>
                      <option value="dark">Dark UI</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] font-bold text-[#2277FF] uppercase">
                      Max Items Display
                    </label>
                    <select
                      value={embedLimit}
                      onChange={(e) => setEmbedLimit(Number(e.target.value))}
                      className="mt-1 w-full rounded-lg border border-[#CAD3F5] bg-white px-3 py-1.5 font-semibold text-[#0A1A4A] focus:border-[#0056FF] focus:outline-none"
                    >
                      <option value="3">3 Classes</option>
                      <option value="5">5 Classes</option>
                      <option value="10">10 Classes</option>
                    </select>
                  </div>
                </div>

                {/* Generated Snippet Box */}
                <div className="relative rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-4 text-white">
                  <div className="flex items-center justify-between border-b border-[#CAD3F5] pb-2 font-mono text-xs">
                    <span className="text-[#2277FF]">
                      Embed Snippet ({embedFormat.toUpperCase()})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(generateEmbedSnippet(), 'embed-snippet')}
                      className="inline-flex items-center gap-1.5 rounded-[4px] border-0 bg-[#0056FF] px-2.5 py-1 font-sans text-xs font-bold text-white hover:bg-[#2277FF]"
                    >
                      {copiedId === 'embed-snippet' ? (
                        <>
                          <Check className="size-3.5" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5" />
                          <span>Copy Embed Code</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="mt-3 overflow-x-auto font-mono text-xs leading-relaxed text-[#CAD3F5]">
                    {generateEmbedSnippet()}
                  </pre>
                </div>

                {/* Live Responsive Embed Sandbox Preview */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold tracking-wider text-[#2277FF] uppercase">
                      Live Sandbox Preview ({embedViewport})
                    </span>
                    <span className="font-mono text-[10px] font-semibold text-[#0056FF]">
                      Live Interactive Mode
                    </span>
                  </div>

                  <div className="flex justify-center overflow-hidden rounded-2xl border border-dashed border-[#CAD3F5] bg-[#EFF5FF] p-4">
                    <div
                      className={cn(
                        'w-full overflow-hidden rounded-xl border p-4 shadow-sm transition-all duration-300',
                        embedTheme === 'dark'
                          ? 'border-[#CAD3F5] bg-[#EFF5FF] text-white'
                          : 'border-[#CAD3F5] bg-white text-[#0A1A4A]',
                        embedViewport === 'mobile'
                          ? 'max-w-[380px]'
                          : embedViewport === 'tablet'
                            ? 'max-w-[768px]'
                            : 'max-w-full',
                      )}
                    >
                      {/* Mini Widget Content */}
                      <div className="flex items-center justify-between border-b border-[#CAD3F5] pb-3">
                        <div>
                          <div className="flex items-center gap-1.5 font-sans text-xs font-bold text-[#0A1A4A]">
                            <span className="h-3 w-1 rounded-[1px] bg-[#0056FF]" />
                            <span>SNP Institute Class Roster</span>
                          </div>
                          <span className="font-mono text-[10px] text-[#2277FF]">
                            Branch: {embedBranch} · Term 1 2026
                          </span>
                        </div>
                        <span className="rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-2 py-0.5 font-mono text-[10px] font-bold text-[#0056FF]">
                          Live Sync
                        </span>
                      </div>

                      <div className="mt-3 space-y-2">
                        {classesList.slice(0, embedLimit).map((c) => (
                          <div
                            key={c.id}
                            className="flex flex-col justify-between gap-2 rounded-lg border border-[#CAD3F5] bg-[#EFF5FF] p-2.5 transition-colors hover:bg-[#EFF5FF] sm:flex-row sm:items-center"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[11px] font-bold text-[#0056FF]">
                                  {c.code}
                                </span>
                                <span className="max-w-[220px] truncate font-sans text-xs font-semibold text-[#0A1A4A]">
                                  {c.name}
                                </span>
                              </div>
                              <div className="mt-0.5 font-mono text-[10.5px] text-[#2277FF]">
                                {c.instructor} · {c.schedule}
                              </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-2">
                              <span className="font-mono text-xs font-bold text-[#0A1A4A]/80">
                                {c.enrolled}/{c.capacity}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedFrontsiteClass(c);
                                  scrollToDocSection('class-catalog-registration');
                                }}
                                className="cursor-pointer rounded-[4px] border border-[#CAD3F5] bg-[#EFF5FF] px-2.5 py-1 font-sans text-xs font-bold text-[#0A1A4A]/80 hover:border-[#0056FF] hover:bg-[#EFF5FF] hover:text-[#0056FF]"
                              >
                                View in Studio
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5: Public Class Roster & Frontsite School Integration Studio */}
            <section
              id="class-catalog-registration"
              className="scroll-mt-24 space-y-6 border-t border-[#CAD3F5] pt-8"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-md border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 font-mono text-[11px] font-bold text-[#0056FF]">
                      ACADEMIC ROSTER &amp; FRONTSITE INTEGRATION
                    </span>
                    <span className="font-mono text-xs text-[#2277FF]">External Dev Studio</span>
                  </div>
                  <h2 className="mt-2 text-xl font-bold tracking-tight text-[#0A1A4A] sm:text-2xl">
                    Live Class Roster &amp; Frontsite Integration Studio
                  </h2>
                  <p className="mt-1 max-w-3xl text-xs text-[#2277FF]">
                    Syndicated public class catalog (
                    <code className="font-mono text-[#0056FF]">GET /api/v1/public/classes</code>).
                    Explore how external developer teams building partner school portals consume
                    real-time JSON feeds and render reactive student interfaces.
                  </p>
                </div>
              </div>

              {/* Zero Public CRUD Policy Callout */}
              <div className="flex items-start gap-3.5 rounded-lg border border-[#CAD3F5] bg-[#EFF5FF] p-4 text-xs text-[#0A1A4A]/80">
                <ShieldCheck className="mt-0.5 size-4.5 shrink-0 text-[#0056FF]" />
                <div className="space-y-1">
                  <div className="font-bold text-[#0A1A4A]">
                    Zero Public Mutation Policy (Bearer Auth Protected)
                  </div>
                  <p className="text-[#0A1A4A]/70">
                    Write operations (student admissions, enrollment intake, and course mutations
                    via <code className="font-mono text-[#0056FF]">POST /api/v1/registrations</code>
                    ) are strictly restricted to authenticated developer backend services holding
                    valid Bearer tokens. Public visitors and guest frontends operate exclusively on
                    read-only syndication feeds. Zero public mutation or intake buttons are exposed.
                  </p>
                </div>
              </div>

              {/* Class Catalog Roster Card */}
              <div className="space-y-4 rounded-xl border border-[#CAD3F5] bg-white p-5 shadow-xs">
                {/* Search & Filter Toolbar */}
                <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                  <div className="w-full sm:w-72">
                    <div className="relative flex items-center">
                      <Search className="absolute left-3 size-3.5 text-[#2277FF]" />
                      <input
                        type="text"
                        placeholder="Search classes, codes, instructors..."
                        value={classSearch}
                        onChange={(e) => setClassSearch(e.target.value)}
                        className="w-full rounded-md border border-[#CAD3F5] bg-[#EFF5FF] py-1.5 pr-3 pl-8.5 font-sans text-xs text-[#0A1A4A] transition-all placeholder:text-[#2277FF] focus:border-[#0056FF] focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex w-full items-center gap-1.5 overflow-x-auto pb-1 sm:w-auto sm:pb-0">
                    {['All', 'Open', 'Filling Fast', 'Waitlist'].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setClassFilterStatus(st)}
                        className={cn(
                          'cursor-pointer rounded-[4px] border-0 px-3 py-1 font-sans text-xs font-bold transition-all',
                          classFilterStatus === st
                            ? 'bg-[#0056FF] text-white shadow-xs'
                            : 'bg-[#EFF5FF] text-[#0A1A4A]/70 hover:bg-[#E3E7FC]',
                        )}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table representation */}
                <div className="overflow-x-auto rounded-lg border border-[#CAD3F5] bg-white shadow-2xs">
                  <table className="w-full border-collapse text-left font-sans text-xs">
                    <thead className="border-b border-[#CAD3F5] bg-[#EFF5FF] font-mono text-[11px] font-semibold tracking-wider text-[#2277FF] uppercase">
                      <tr>
                        <th className="px-4 py-3">Code / Dept</th>
                        <th className="px-4 py-3">Course Title &amp; Instructor</th>
                        <th className="px-4 py-3">Schedule &amp; Room</th>
                        <th className="px-4 py-3 text-center">Seat Capacity</th>
                        <th className="px-4 py-3 text-center">Status</th>
                        <th className="px-4 py-3 text-right">Studio Preview</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#CAD3F5] bg-white">
                      {filteredClasses.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-[#2277FF]">
                            No classes matching your criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredClasses.map((item) => {
                          const percent = Math.round((item.enrolled / item.capacity) * 100);
                          const isSelected = selectedFrontsiteClass.code === item.code;
                          const isRecentSseUpdate = lastSseUpdatedClassCode === item.code;

                          return (
                            <tr
                              key={item.id}
                              className={cn(
                                'transition-colors',
                                isSelected ? 'bg-[#EFF5FF]/80' : 'hover:bg-[#EFF5FF]',
                              )}
                            >
                              <td className="px-4 py-3.5 font-mono">
                                <div className="font-bold text-[#0056FF]">{item.code}</div>
                                <div className="text-[10px] text-[#2277FF]">{item.department}</div>
                              </td>
                              <td className="px-4 py-3.5">
                                <div className="font-bold text-[#0A1A4A]">{item.name}</div>
                                <div className="text-[11px] text-[#2277FF]">{item.instructor}</div>
                              </td>
                              <td className="px-4 py-3.5 font-mono text-[11px]">
                                <div className="text-[#0A1A4A]">{item.schedule}</div>
                                <div className="text-[#2277FF]">{item.room}</div>
                              </td>
                              <td className="px-4 py-3.5 text-center">
                                <div className="flex items-center justify-center gap-1.5 font-mono text-xs font-bold text-[#0A1A4A]">
                                  <span>
                                    {item.enrolled} / {item.capacity}
                                  </span>
                                  {isRecentSseUpdate && (
                                    <span className="inline-block size-2 animate-ping rounded-full bg-[#0056FF]" />
                                  )}
                                </div>
                                <div className="mx-auto mt-1 h-1.5 w-24 overflow-hidden rounded-full bg-[#EFF5FF]">
                                  <div
                                    className={cn(
                                      'h-full rounded-full transition-all duration-300',
                                      percent >= 100
                                        ? 'bg-[#EFF5FF]0'
                                        : percent >= 85
                                          ? 'bg-[#EFF5FF]0'
                                          : 'bg-[#0056FF]',
                                    )}
                                    style={{ width: `${Math.min(100, percent)}%` }}
                                  />
                                </div>
                              </td>
                              <td className="px-4 py-3.5 text-center">
                                <span
                                  className={cn(
                                    'inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[10.5px] font-bold',
                                    item.status === 'Open' &&
                                      'border border-[#CAD3F5] bg-[#EFF5FF] text-[#0056FF]',
                                    item.status === 'Filling Fast' &&
                                      'border border-[#2277FF] bg-[#EFF5FF] text-[#2277FF]',
                                    item.status === 'Waitlist' &&
                                      'border border-[#CAD3F5] bg-[#EFF5FF] text-[#0A1A4A]/80',
                                  )}
                                >
                                  {item.status}
                                </span>
                              </td>
                              <td className="px-4 py-3.5 text-right">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedFrontsiteClass(item);
                                    setFrontsiteStudioTab('preview-ui');
                                  }}
                                  className={cn(
                                    'cursor-pointer rounded-[4px] border px-2.5 py-1 font-sans text-xs font-bold transition-all',
                                    isSelected
                                      ? 'border-[#0056FF] bg-[#0056FF] text-white shadow-xs'
                                      : 'border-[#CAD3F5] bg-[#EFF5FF] text-[#0A1A4A]/80 hover:border-[#0056FF] hover:bg-[#EFF5FF] hover:text-[#0056FF]',
                                  )}
                                >
                                  {isSelected ? 'Selected' : 'Preview in UI'}
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Frontsite School Data Integration Studio */}
                <div className="mt-8 space-y-5 rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-5 sm:p-6">
                  {/* Studio Navigation Header */}
                  <div className="flex flex-col justify-between gap-4 border-b border-[#CAD3F5] pb-4 sm:flex-row sm:items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-[#0056FF] uppercase">
                          FRONTSITE INTEGRATION STUDIO
                        </span>
                        <span className="rounded-full bg-[#E3E7FC] px-2 py-0.5 font-mono text-[10px] font-bold text-[#0056FF]">
                          Scenario Demo
                        </span>
                      </div>
                      <h3 className="mt-1 font-sans text-base font-bold text-[#0A1A4A]">
                        External Partner School Portal: Live Data Ingestion
                      </h3>
                      <p className="font-sans text-xs text-[#2277FF]">
                        Illustrating how an external developer team ingests syndication endpoints
                        and renders a live responsive student course UI.
                      </p>
                    </div>

                    {/* View Switcher Tabs */}
                    <div className="flex items-center rounded-lg border border-[#CAD3F5] bg-white p-1 shadow-2xs">
                      {[
                        { id: 'preview-ui', label: 'Frontsite Live UI', icon: Layers },
                        { id: 'json-feed', label: 'Live JSON API', icon: Code },
                        { id: 'code-snippets', label: 'Integration Code', icon: Terminal },
                        { id: 'auth-policy', label: 'Auth & CRUD Policy', icon: Lock },
                      ].map((tab) => {
                        const Icon = tab.icon;
                        const isActive = frontsiteStudioTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() =>
                              setFrontsiteStudioTab(
                                tab.id as
                                  'preview-ui' | 'json-feed' | 'code-snippets' | 'auth-policy',
                              )
                            }
                            className={cn(
                              'flex cursor-pointer items-center gap-1.5 rounded-[4px] border-0 px-3 py-1.5 font-sans text-xs font-bold transition-all',
                              isActive
                                ? 'bg-[#0056FF] text-white shadow-xs'
                                : 'text-[#0A1A4A]/70 hover:bg-[#EFF5FF] hover:text-[#0A1A4A]',
                            )}
                          >
                            <Icon className="size-3.5" />
                            <span>{tab.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* TAB 1: Frontsite Live UI Widget */}
                  {frontsiteStudioTab === 'preview-ui' && (
                    <div className="space-y-4">
                      {/* Controls Bar for Testing Real-Time SSE Reactivity */}
                      <div className="flex flex-col items-start justify-between gap-3 rounded-lg border border-[#CAD3F5] bg-white p-3.5 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-2.5">
                          <span className="relative flex size-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#2277FF] opacity-75" />
                            <span className="bg-[#EFF5FF]0 relative inline-flex size-2.5 rounded-full" />
                          </span>
                          <span className="font-mono text-xs font-semibold text-[#0A1A4A]/80">
                            Live Stream:{' '}
                            <span className="font-bold text-[#0056FF]">classes.roster.BR-01</span>
                          </span>
                          <span className="text-[#CAD3F5]">|</span>
                          <span className="font-sans text-xs text-[#2277FF]">
                            Push simulated background changes to observe immediate UI reactivity.
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleSimulateRealtimeSseUpdate}
                            disabled={isSimulatingSseUpdate}
                            className="flex cursor-pointer items-center gap-1.5 rounded-[4px] border-0 bg-[#0056FF] px-3 py-1.5 font-sans text-xs font-bold text-white shadow-xs hover:bg-[#2277FF] disabled:opacity-50"
                          >
                            <Zap className="size-3.5" />
                            <span>
                              {isSimulatingSseUpdate
                                ? 'Emitting SSE...'
                                : 'Simulate Live Seat Update'}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={handleResetCatalog}
                            className="flex cursor-pointer items-center gap-1 rounded-[4px] border border-[#CAD3F5] bg-[#EFF5FF] px-2.5 py-1.5 font-sans text-xs font-bold text-[#0A1A4A]/70 hover:bg-[#E3E7FC]"
                            title="Reset Catalog to Seed Data"
                          >
                            <RotateCcw className="size-3" />
                            <span>Reset</span>
                          </button>
                        </div>
                      </div>

                      {/* Mock External School Student Portal Shell */}
                      <div className="overflow-hidden rounded-xl border border-[#CAD3F5] bg-white shadow-sm">
                        {/* Mock School Portal Header */}
                        <div className="flex flex-col justify-between gap-3 border-b border-[#2277FF] bg-[#0056FF] p-4 text-white sm:flex-row sm:items-center">
                          <div className="flex items-center gap-3">
                            <div className="flex size-9 items-center justify-center rounded-lg bg-white font-mono text-sm font-black text-[#0056FF] shadow-xs">
                              RS
                            </div>
                            <div>
                              <div className="font-sans text-sm font-bold tracking-tight">
                                Royal Institute of Science &amp; Technology
                              </div>
                              <div className="font-mono text-[11px] text-[#E3E7FC]">
                                Department of Computer Science &amp; Engineering · Term 2026-S1
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-md bg-white/10 px-2.5 py-1 font-mono text-[11px] font-semibold text-[#CAD3F5]">
                              Syndication: Active
                            </span>
                            <span className="bg-[#EFF5FF]0/20 rounded-md px-2.5 py-1 font-mono text-[11px] font-bold text-[#E3E7FC]">
                              SSE Connected
                            </span>
                          </div>
                        </div>

                        {/* Courses Grid Rendered From Live JSON */}
                        <div className="p-5">
                          <div className="mb-4 flex items-center justify-between">
                            <span className="font-sans text-xs font-bold tracking-wider text-[#2277FF] uppercase">
                              Active Course Offerings ({filteredClasses.length} Courses Available)
                            </span>
                            <span className="font-mono text-[11px] text-[#2277FF]">
                              Selected:{' '}
                              <strong className="text-[#0056FF]">
                                {selectedFrontsiteClass.code}
                              </strong>
                            </span>
                          </div>

                          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {filteredClasses.map((cls) => {
                              const percent = Math.round((cls.enrolled / cls.capacity) * 100);
                              const isSelected = selectedFrontsiteClass.code === cls.code;
                              const isUpdated = lastSseUpdatedClassCode === cls.code;

                              return (
                                <div
                                  key={cls.id}
                                  onClick={() => setSelectedFrontsiteClass(cls)}
                                  className={cn(
                                    'cursor-pointer rounded-lg border p-4 transition-all duration-300',
                                    isUpdated
                                      ? 'border-[#0056FF] bg-[#EFF5FF] ring-2 ring-[#0056FF]/30'
                                      : isSelected
                                        ? 'border-[#0056FF] bg-[#EFF5FF]/40 shadow-xs'
                                        : 'border-[#CAD3F5] bg-white hover:border-[#CAD3F5] hover:shadow-2xs',
                                  )}
                                >
                                  {/* Card Top: Dept & Code */}
                                  <div className="flex items-center justify-between">
                                    <span className="rounded bg-[#EFF5FF] px-2 py-0.5 font-mono text-[10px] font-bold text-[#0A1A4A]/70">
                                      {cls.department}
                                    </span>
                                    <span className="font-mono text-xs font-bold text-[#0056FF]">
                                      {cls.code}
                                    </span>
                                  </div>

                                  {/* Course Title */}
                                  <h4 className="mt-2 font-sans text-sm font-bold text-[#0A1A4A]">
                                    {cls.name}
                                  </h4>

                                  {/* Instructor & Location */}
                                  <div className="mt-2.5 space-y-1 font-sans text-xs text-[#2277FF]">
                                    <div className="flex items-center gap-1.5">
                                      <User className="size-3.5 text-[#2277FF]" />
                                      <span>{cls.instructor}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                                      <Calendar className="size-3.5 text-[#2277FF]" />
                                      <span>
                                        {cls.schedule} · {cls.room}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Live Seat Availability Meter */}
                                  <div className="mt-4 border-t border-[#CAD3F5] pt-3">
                                    <div className="flex items-center justify-between font-mono text-[11px]">
                                      <span className="font-bold text-[#0A1A4A]/80">
                                        Capacity: {cls.enrolled} / {cls.capacity}
                                      </span>
                                      <span
                                        className={cn(
                                          'font-bold',
                                          cls.status === 'Open' && 'text-[#0056FF]',
                                          cls.status === 'Filling Fast' && 'text-[#2277FF]',
                                          cls.status === 'Waitlist' && 'text-[#0A1A4A]/70',
                                        )}
                                      >
                                        {cls.status === 'Open' &&
                                          `${cls.capacity - cls.enrolled} seats left`}
                                        {cls.status === 'Filling Fast' &&
                                          `Only ${cls.capacity - cls.enrolled} left`}
                                        {cls.status === 'Waitlist' && 'Waitlist full'}
                                      </span>
                                    </div>

                                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#EFF5FF]">
                                      <div
                                        className={cn(
                                          'h-full rounded-full transition-all duration-300',
                                          percent >= 100
                                            ? 'bg-[#EFF5FF]0'
                                            : percent >= 85
                                              ? 'bg-[#EFF5FF]0'
                                              : 'bg-[#0056FF]',
                                        )}
                                        style={{ width: `${Math.min(100, percent)}%` }}
                                      />
                                    </div>
                                  </div>

                                  {/* Card Status & Read-only Indicator */}
                                  <div className="mt-3 flex items-center justify-between pt-1">
                                    {isUpdated ? (
                                      <span className="inline-flex items-center gap-1 rounded bg-[#0056FF] px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                                        <Zap className="size-2.5" />
                                        <span>Updated via SSE</span>
                                      </span>
                                    ) : (
                                      <span className="font-mono text-[10px] text-[#2277FF]">
                                        Read-only syndicated
                                      </span>
                                    )}

                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedFrontsiteClass(cls);
                                        setFrontsiteStudioTab('json-feed');
                                      }}
                                      className="font-mono text-[10.5px] font-bold text-[#0056FF] hover:underline"
                                    >
                                      Inspect JSON →
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Live JSON API Feed */}
                  {frontsiteStudioTab === 'json-feed' && (
                    <div className="space-y-4">
                      {/* URL bar & Action */}
                      <div className="flex flex-col items-center justify-between gap-3 rounded-lg border border-[#CAD3F5] bg-white p-3 sm:flex-row">
                        <div className="flex w-full items-center gap-2 font-mono text-xs text-[#0A1A4A]/80 sm:w-auto">
                          <span className="rounded bg-[#E3E7FC] px-2 py-0.5 font-bold text-[#0056FF]">
                            GET
                          </span>
                          <span className="text-[#0A1A4A]">
                            https://snpis.kesararamwithdigital.tech/api/v1/public/classes?branch=BR-01
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleCopyFrontsiteContent(
                              JSON.stringify(
                                {
                                  status: 'success',
                                  meta: {
                                    total: filteredClasses.length,
                                    branch: 'BR-01',
                                    timestamp: new Date().toISOString(),
                                    sseChannel: 'classes.roster.BR-01',
                                  },
                                  data: filteredClasses,
                                },
                                null,
                                2,
                              ),
                              'json',
                            )
                          }
                          className="flex cursor-pointer items-center gap-1.5 rounded-[4px] border border-[#CAD3F5] bg-[#EFF5FF] px-3 py-1.5 font-sans text-xs font-bold text-[#0A1A4A]/80 hover:bg-[#E3E7FC]"
                        >
                          {frontsiteCopied === 'json' ? (
                            <>
                              <Check className="size-3.5 text-[#0056FF]" />
                              <span className="text-[#0056FF]">Copied JSON!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="size-3.5" />
                              <span>Copy JSON Payload</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* JSON Response View */}
                      <div className="rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-4 font-mono text-[11px] text-[#0A1A4A]">
                        <pre className="max-h-[460px] overflow-x-auto overflow-y-auto whitespace-pre">
                          {JSON.stringify(
                            {
                              status: 'success',
                              meta: {
                                total: filteredClasses.length,
                                branch: 'BR-01',
                                timestamp: new Date().toISOString(),
                                sseChannel: 'classes.roster.BR-01',
                                selectedInspection: selectedFrontsiteClass.code,
                              },
                              data: filteredClasses,
                            },
                            null,
                            2,
                          )}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: Frontend Integration Code Snippets */}
                  {frontsiteStudioTab === 'code-snippets' && (
                    <div className="space-y-4">
                      {/* Code Sub-tabs */}
                      <div className="flex items-center justify-between border-b border-[#CAD3F5] pb-2">
                        <div className="flex items-center gap-1">
                          {[
                            { id: 'react', label: 'React Hook (useSchoolClasses)' },
                            { id: 'types', label: 'TypeScript Types' },
                            { id: 'nextjs', label: 'Next.js App Router (RSC)' },
                            { id: 'curl', label: 'cURL Verification' },
                          ].map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => setIntegrationCodeTab(t.id as any)}
                              className={cn(
                                'cursor-pointer rounded-[4px] border-0 px-3 py-1 font-sans text-xs font-bold transition-all',
                                integrationCodeTab === t.id
                                  ? 'bg-[#0056FF] text-white shadow-xs'
                                  : 'bg-transparent text-[#0A1A4A]/70 hover:bg-[#E3E7FC]',
                              )}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const code =
                              integrationCodeTab === 'react'
                                ? `import { useEffect, useState } from 'react';

export interface SchoolClass {
  id: string;
  code: string;
  name: string;
  department: string;
  instructor: string;
  schedule: string;
  room: string;
  enrolled: number;
  capacity: number;
  status: 'Open' | 'Filling Fast' | 'Waitlist';
}

export function useSchoolClasses(branchId: string = 'BR-01') {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial REST fetch for instant paint
    fetch(\`https://snpis.kesararamwithdigital.tech/api/v1/public/classes?branch=\${branchId}\`)
      .then((res) => res.json())
      .then((payload) => {
        setClasses(payload.data);
        setLoading(false);
      });

    // 2. Real-time updates via Server-Sent Events (SSE)
    const sse = new EventSource(
      \`https://snpis.kesararamwithdigital.tech/api/v1/public/events?channel=classes.roster.\${branchId}\`
    );

    sse.addEventListener('class.seat_reserved', (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      setClasses((prev) =>
        prev.map((c) =>
          c.code === data.code
            ? {
                ...c,
                enrolled: data.enrolled,
                status: data.enrolled >= c.capacity ? 'Waitlist' : 'Open',
              }
            : c
        )
      );
    });

    return () => sse.close();
  }, [branchId]);

  return { classes, loading };
}`
                                : integrationCodeTab === 'types'
                                  ? `export interface SchoolClass {
  id: string;
  code: string;
  name: string;
  department: string;
  instructor: string;
  schedule: string;
  room: string;
  enrolled: number;
  capacity: number;
  status: 'Open' | 'Filling Fast' | 'Waitlist';
  updatedAt: string;
}

export interface ClassCatalogResponse {
  status: 'success';
  meta: {
    total: number;
    branch: string;
    timestamp: string;
    sseChannel: string;
  };
  data: SchoolClass[];
}`
                                  : integrationCodeTab === 'nextjs'
                                    ? `// app/courses/page.tsx - Next.js Server Component with 60s ISR
import { SchoolClass } from '@/types/school';

async function getClasses(): Promise<SchoolClass[]> {
  const res = await fetch(
    'https://snpis.kesararamwithdigital.tech/api/v1/public/classes?branch=BR-01',
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error('Failed to fetch class roster');
  const payload = await res.json();
  return payload.data;
}

export default async function CoursesPage() {
  const classes = await getClasses();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {classes.map((cls) => (
        <div key={cls.id} className="p-4 rounded-lg border bg-white shadow-sm">
          <div className="text-xs font-mono font-bold text-[#0056FF]">{cls.code}</div>
          <h3 className="font-bold text-[#0A1A4A]">{cls.name}</h3>
          <p className="text-sm text-[#2277FF]">{cls.instructor} · {cls.room}</p>
          <div className="mt-2 text-xs font-medium">
            Seats: {cls.enrolled}/{cls.capacity} ({cls.status})
          </div>
        </div>
      ))}
    </div>
  );
}`
                                    : `curl -X GET "https://snpis.kesararamwithdigital.tech/api/v1/public/classes?branch=BR-01" \\
  -H "Accept: application/json"`;

                            handleCopyFrontsiteContent(code, 'snippet');
                          }}
                          className="flex cursor-pointer items-center gap-1.5 rounded-[4px] border border-[#CAD3F5] bg-white px-2.5 py-1 font-sans text-xs font-bold text-[#0A1A4A]/80 hover:bg-[#EFF5FF]"
                        >
                          {frontsiteCopied === 'snippet' ? (
                            <>
                              <Check className="size-3 text-[#0056FF]" />
                              <span className="text-[#0056FF]">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="size-3" />
                              <span>Copy Snippet</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Code Snippet Box */}
                      <div className="rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-4 font-mono text-[11px] text-[#0A1A4A]">
                        <pre className="max-h-[460px] overflow-x-auto overflow-y-auto whitespace-pre">
                          {integrationCodeTab === 'react' &&
                            `import { useEffect, useState } from 'react';

export interface SchoolClass {
  id: string;
  code: string;
  name: string;
  department: string;
  instructor: string;
  schedule: string;
  room: string;
  enrolled: number;
  capacity: number;
  status: 'Open' | 'Filling Fast' | 'Waitlist';
}

export function useSchoolClasses(branchId: string = 'BR-01') {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial REST fetch for instant paint
    fetch(\`https://snpis.kesararamwithdigital.tech/api/v1/public/classes?branch=\${branchId}\`)
      .then((res) => res.json())
      .then((payload) => {
        setClasses(payload.data);
        setLoading(false);
      });

    // 2. Real-time updates via Server-Sent Events (SSE)
    const sse = new EventSource(
      \`https://snpis.kesararamwithdigital.tech/api/v1/public/events?channel=classes.roster.\${branchId}\`
    );

    sse.addEventListener('class.seat_reserved', (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      setClasses((prev) =>
        prev.map((c) =>
          c.code === data.code
            ? {
                ...c,
                enrolled: data.enrolled,
                status: data.enrolled >= c.capacity ? 'Waitlist' : 'Open',
              }
            : c
        )
      );
    });

    return () => sse.close();
  }, [branchId]);

  return { classes, loading };
}`}

                          {integrationCodeTab === 'types' &&
                            `export interface SchoolClass {
  id: string;
  code: string;
  name: string;
  department: string;
  instructor: string;
  schedule: string;
  room: string;
  enrolled: number;
  capacity: number;
  status: 'Open' | 'Filling Fast' | 'Waitlist';
  updatedAt: string;
}

export interface ClassCatalogResponse {
  status: 'success';
  meta: {
    total: number;
    branch: string;
    timestamp: string;
    sseChannel: string;
  };
  data: SchoolClass[];
}`}

                          {integrationCodeTab === 'nextjs' &&
                            `// app/courses/page.tsx - Next.js Server Component with 60s ISR
import { SchoolClass } from '@/types/school';

async function getClasses(): Promise<SchoolClass[]> {
  const res = await fetch(
    'https://snpis.kesararamwithdigital.tech/api/v1/public/classes?branch=BR-01',
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error('Failed to fetch class roster');
  const payload = await res.json();
  return payload.data;
}

export default async function CoursesPage() {
  const classes = await getClasses();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {classes.map((cls) => (
        <div key={cls.id} className="p-4 rounded-lg border bg-white shadow-sm">
          <div className="text-xs font-mono font-bold text-[#0056FF]">{cls.code}</div>
          <h3 className="font-bold text-[#0A1A4A]">{cls.name}</h3>
          <p className="text-sm text-[#2277FF]">{cls.instructor} · {cls.room}</p>
          <div className="mt-2 text-xs font-medium">
            Seats: {cls.enrolled}/{cls.capacity} ({cls.status})
          </div>
        </div>
      ))}
    </div>
  );
}`}

                          {integrationCodeTab === 'curl' &&
                            `curl -X GET "https://snpis.kesararamwithdigital.tech/api/v1/public/classes?branch=BR-01" \\
  -H "Accept: application/json"`}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* TAB 4: Developer Auth & CRUD Policy */}
                  {frontsiteStudioTab === 'auth-policy' && (
                    <div className="space-y-4">
                      <div className="rounded-lg border border-[#2277FF] bg-[#EFF5FF] p-4">
                        <div className="flex items-center gap-2 font-sans text-xs font-bold text-[#0A1A4A]">
                          <Lock className="size-4 text-[#2277FF]" />
                          <span>RESTRICTED WRITE ACCESS · DEVELOPER BEARER TOKEN REQUIRED</span>
                        </div>
                        <p className="mt-1 text-xs text-[#2277FF]">
                          To protect academic integrity, all write operations (class creation,
                          roster adjustments, and student intake registration) are completely
                          disabled for public users and guest frontsites. Zero public buttons are
                          provided. Write mutations require authenticated server-to-server
                          credentials.
                        </p>
                      </div>

                      <div className="space-y-3 rounded-lg border border-[#CAD3F5] bg-white p-4 font-sans text-xs">
                        <h4 className="font-bold text-[#0A1A4A]">
                          Authorized Mutation Endpoint:{' '}
                          <code className="font-mono text-[#0056FF]">
                            POST /api/v1/registrations
                          </code>
                        </h4>
                        <p className="text-[#0A1A4A]/70">
                          Authenticated school backend services use this endpoint to submit
                          registrations on behalf of verified students.
                        </p>

                        <div className="rounded-lg border border-[#CAD3F5] bg-[#EFF5FF] p-3 font-mono text-[11px] text-[#0A1A4A]">
                          <div className="mb-2 flex items-center justify-between border-b border-[#CAD3F5] pb-2">
                            <span className="font-bold text-[#0A1A4A]/70">
                              Authenticated Developer cURL
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyFrontsiteContent(
                                  `curl -X POST "https://snpis.kesararamwithdigital.tech/api/v1/registrations" \\
  -H "Authorization: Bearer dev_live_sec_991823ab981c" \\
  -H "X-Branch-Id: BR-01" \\
  -H "Content-Type: application/json" \\
  -d '{
    "studentId": "STU-2026-0042",
    "classCode": "${selectedFrontsiteClass.code}",
    "academicYearId": "AY-2025-2026"
  }'`,
                                  'auth-curl',
                                )
                              }
                              className="cursor-pointer text-[#0056FF] hover:underline"
                            >
                              {frontsiteCopied === 'auth-curl' ? 'Copied!' : 'Copy cURL'}
                            </button>
                          </div>
                          <pre className="overflow-x-auto whitespace-pre">
                            {`curl -X POST "https://snpis.kesararamwithdigital.tech/api/v1/registrations" \\
  -H "Authorization: Bearer dev_live_sec_991823ab981c" \\
  -H "X-Branch-Id: BR-01" \\
  -H "Content-Type: application/json" \\
  -d '{
    "studentId": "STU-2026-0042",
    "classCode": "${selectedFrontsiteClass.code}",
    "academicYearId": "AY-2025-2026"
  }'`}
                          </pre>
                        </div>

                        <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
                          <div className="rounded-md border border-[#CAD3F5] bg-[#EFF5FF] p-2.5">
                            <div className="font-mono text-[10px] font-bold text-[#2277FF] uppercase">
                              Required Header
                            </div>
                            <div className="font-mono text-xs font-bold text-[#0A1A4A]">
                              Authorization: Bearer
                            </div>
                          </div>
                          <div className="rounded-md border border-[#CAD3F5] bg-[#EFF5FF] p-2.5">
                            <div className="font-mono text-[10px] font-bold text-[#2277FF] uppercase">
                              Rate Limit
                            </div>
                            <div className="font-mono text-xs font-bold text-[#0A1A4A]">
                              30 writes / minute
                            </div>
                          </div>
                          <div className="rounded-md border border-[#CAD3F5] bg-[#EFF5FF] p-2.5">
                            <div className="font-mono text-[10px] font-bold text-[#2277FF] uppercase">
                              Audit Logging
                            </div>
                            <div className="font-mono text-xs font-bold text-[#0A1A4A]">
                              Logged &amp; Immutable
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Section 6: Real-Time Updates Engine (SSE / Polling) */}
            <section
              id="realtime-stream"
              className="scroll-mt-24 space-y-6 border-t border-[#CAD3F5] pt-8"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-md border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 font-mono text-[11px] font-bold text-[#0056FF]">
                      STREAMING &amp; WEBSOCKETS
                    </span>
                    <span className="font-mono text-xs text-[#2277FF]">
                      Server-Sent Events (SSE)
                    </span>
                  </div>
                  <h2 className="mt-2 text-xl font-bold tracking-tight text-[#0A1A4A] sm:text-2xl">
                    Real-Time Updates Engine
                  </h2>
                  <p className="mt-1 max-w-2xl text-xs text-[#2277FF]">
                    Subscribe to instant push notifications and academic state mutations using
                    Server-Sent Events (SSE) or bi-directional WebSocket connections.
                  </p>
                </div>
              </div>

              {/* Real-time Stream Terminal & Console */}
              <div className="space-y-4 rounded-2xl border border-[#CAD3F5] bg-white p-5 shadow-xs">
                {/* HUD Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#CAD3F5] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'h-2.5 w-2.5 rounded-full',
                          isStreamActive ? 'bg-[#EFF5FF]0 animate-pulse' : 'bg-[#E3E7FC]',
                        )}
                      />
                      <span className="font-mono text-xs font-bold text-[#0A1A4A]">
                        {isStreamActive ? 'STREAM ACTIVE' : 'STREAM PAUSED'}
                      </span>
                    </div>

                    <div className="rounded-md border border-[#CAD3F5] bg-[#EFF5FF] px-2 py-0.5 font-mono text-[11px] text-[#0A1A4A]/70">
                      Latency: <strong className="text-[#0056FF]">{streamLatency}ms</strong>
                    </div>

                    <div className="rounded-md border border-[#CAD3F5] bg-[#EFF5FF] px-2 py-0.5 font-mono text-[11px] text-[#0A1A4A]/70">
                      Subscribers:{' '}
                      <strong className="text-[#0A1A4A]">{streamConnectedClients}</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsStreamActive((p) => !p)}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-[4px] border-0 px-3 py-1 font-sans text-xs font-bold text-white transition-colors',
                        isStreamActive
                          ? 'bg-[#0056FF] hover:bg-[#0056FF]'
                          : 'bg-[#0056FF] hover:bg-[#2277FF]',
                      )}
                    >
                      {isStreamActive ? (
                        <>
                          <Pause className="size-3.5" />
                          <span>Pause Stream</span>
                        </>
                      ) : (
                        <>
                          <Play className="size-3.5" />
                          <span>Resume Stream</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleTriggerTestEvent('announcement.published', {
                          id: `ANN-2026-${Math.floor(100 + Math.random() * 900)}`,
                          title: 'Flash Advisory: Weather Schedule Update',
                          priority: 'high',
                        })
                      }
                      className="rounded-[4px] border-0 bg-[#EFF5FF] px-3 py-1 font-sans text-xs font-bold text-[#0A1A4A]/80 hover:bg-[#E3E7FC]"
                    >
                      Simulate Event
                    </button>

                    <button
                      type="button"
                      onClick={() => setStreamEvents([])}
                      className="rounded-[4px] border-0 bg-[#EFF5FF] px-2.5 py-1 font-sans text-xs font-semibold text-[#2277FF] hover:text-[#0A1A4A]"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Event Feed Stream Terminal */}
                <div className="space-y-2 rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-4 text-[#CAD3F5]">
                  <div className="flex items-center justify-between border-b border-[#CAD3F5] pb-2 font-mono text-[11px] text-[#2277FF]">
                    <span>LIVE EVENT LOGS (/api/v1/stream/events)</span>
                    <span>PROTO: SSE (text/event-stream)</span>
                  </div>

                  <div className="max-h-56 space-y-1.5 overflow-y-auto font-mono text-[11px]">
                    {streamEvents.length === 0 ? (
                      <div className="py-6 text-center text-[#2277FF]">
                        Stream connected. Waiting for incoming broadcast packets...
                      </div>
                    ) : (
                      streamEvents.map((ev) => (
                        <div
                          key={ev.id}
                          className="flex flex-col gap-1 rounded-lg bg-white/[0.04] p-2 transition-colors hover:bg-white/[0.07] sm:flex-row sm:items-center sm:gap-2.5"
                        >
                          <span className="shrink-0 text-[#2277FF]">[{ev.timestamp}]</span>
                          <span className="shrink-0 rounded bg-[#0056FF]/30 px-1.5 py-0.5 text-[10px] font-bold text-[#2277FF]">
                            {ev.eventName}
                          </span>
                          <span className="max-w-[140px] shrink-0 truncate text-[10px] text-[#2277FF]">
                            {ev.channel}
                          </span>
                          <span className="truncate font-sans text-xs text-[#CAD3F5]">
                            {ev.payload}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 7: What Other Developers Can Get (Modern Card Grid - No Table) */}
            <section
              id="endpoints-available"
              className="scroll-mt-24 space-y-4 border-t border-[#CAD3F5] pt-8"
            >
              <div>
                <h2 className="text-base font-bold tracking-tight text-[#0A1A4A]">
                  What Other Developers Can Get (Read & Integration Surface)
                </h2>
                <p className="mt-1 text-xs text-[#2277FF]">
                  Standardized endpoints consumable by client applications, mobile portals, and
                  reporting integrations using standard HTTP GET queries.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {filteredEndpoints.length === 0 ? (
                  <div className="col-span-full rounded-2xl border border-dashed border-[#CAD3F5] bg-[#EFF5FF] p-8 text-center">
                    <p className="font-sans text-sm font-semibold text-[#0A1A4A]/70">
                      No matching endpoints found
                    </p>
                    <p className="mt-1 font-sans text-xs text-[#2277FF]">
                      Try searching for another keyword or select &quot;All Modules&quot;
                    </p>
                  </div>
                ) : (
                  filteredEndpoints.map((ep) => (
                    <div
                      key={ep.path + ep.method}
                      className="flex flex-col justify-between rounded-xl border border-[#CAD3F5] bg-white p-4 transition-all duration-150 hover:border-[#0056FF] hover:bg-[#EFF5FF]"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center rounded-md border border-[#CAD3F5] bg-[#E3E7FC] px-2 py-0.5 font-mono text-[11px] font-bold text-[#0056FF]">
                            {ep.method}
                          </span>
                          <span className="rounded-full border border-[#CAD3F5] bg-[#EFF5FF] px-2 py-0.5 font-sans text-[10px] font-semibold text-[#0A1A4A]/70">
                            {ep.category}
                          </span>
                        </div>
                        <div className="mt-2.5 font-mono text-xs font-bold text-[#0A1A4A]">
                          {ep.path}
                        </div>
                        <p className="mt-1 font-sans text-xs leading-relaxed text-[#0A1A4A]/70">
                          {ep.description}
                        </p>
                      </div>
                      <div className="mt-3 border-t border-[#CAD3F5] pt-2">
                        <span className="font-mono text-[10.5px] font-medium text-[#0056FF]">
                          Permission: {ep.requiredPermission}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Section 4: What Endpoints Must Be Protected & How (Modern Card Grid - No Table) */}
            <section
              id="protected-endpoints"
              className="scroll-mt-24 space-y-4 border-t border-[#CAD3F5] pt-8"
            >
              <div>
                <h2 className="text-base font-bold tracking-tight text-[#0A1A4A]">
                  What Endpoints Must Be Protected & How
                </h2>
                <p className="mt-1 text-xs text-[#2277FF]">
                  High-impact write and mutation operations enforced with multi-layer defense
                  mechanisms to prevent financial tampering and unauthorized grade alterations.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {PROTECTED_MUTATION_ENDPOINTS.map((item) => (
                  <div
                    key={item.path + item.method}
                    className="flex flex-col justify-between rounded-xl border border-[#CAD3F5] bg-white p-4.5 transition-all duration-150 hover:border-[#0056FF] hover:bg-[#EFF5FF]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center rounded-md border border-[#CAD3F5] bg-[#EFF5FF] px-2.5 py-0.5 font-mono text-[11px] font-bold text-white">
                          {item.method}
                        </span>
                        <span className="font-sans text-[11px] font-bold text-[#0A1A4A]/80">
                          {item.domain}
                        </span>
                      </div>
                      <div className="mt-2.5 font-mono text-xs font-bold text-[#0A1A4A]">
                        {item.path}
                      </div>
                      <p className="mt-2 font-sans text-xs leading-relaxed text-[#0A1A4A]/70">
                        {item.whyProtected}
                      </p>
                    </div>
                    <div className="mt-3.5 rounded-lg border border-[#CAD3F5] bg-[#E3E7FC]/50 p-2.5">
                      <p className="font-mono text-[11px] font-semibold text-[#0056FF]">
                        {item.defenseMechanisms}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Interactive Access Control & Scope Simulator */}
              <div className="mt-6 space-y-4 rounded-2xl border border-[#CAD3F5] bg-[#EFF5FF] p-5">
                <div className="flex flex-col justify-between gap-3 border-b border-[#CAD3F5] pb-3 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="flex items-center gap-2 font-sans text-sm font-bold text-[#0A1A4A]">
                      <ShieldCheck className="size-4 text-[#0056FF]" />
                      <span>Access Control &amp; Token Scope Simulator</span>
                    </h3>
                    <p className="font-sans text-xs text-[#2277FF]">
                      Select an actor role to inspect generated request headers and test
                      authorization defense boundaries.
                    </p>
                  </div>
                  <span className="rounded-md border border-[#CAD3F5] bg-white px-2.5 py-1 font-mono text-xs font-bold text-[#0056FF]">
                    Active: {ACCESS_ROLES[simulatedRoleIndex].role}
                  </span>
                </div>

                {/* Role Tabs */}
                <div className="flex flex-wrap gap-1.5">
                  {ACCESS_ROLES.map((r, idx) => (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => {
                        setSimulatedRoleIndex(idx);
                        setSimulatedTestFeedback(null);
                      }}
                      className={cn(
                        'rounded-[4px] border-0 px-3 py-1 font-sans text-xs font-bold transition-all',
                        simulatedRoleIndex === idx
                          ? 'bg-[#0056FF] text-white shadow-xs'
                          : 'border border-[#CAD3F5] bg-white text-[#0A1A4A]/80 hover:bg-[#E3E7FC]',
                      )}
                    >
                      {r.role}
                    </button>
                  ))}
                </div>

                {/* Simulated Headers & Actions */}
                <div className="grid grid-cols-1 gap-4 pt-1 font-sans text-xs md:grid-cols-2">
                  <div className="space-y-1.5">
                    <span className="font-mono text-[10px] font-bold text-[#2277FF] uppercase">
                      Generated Client Headers
                    </span>
                    <div className="space-y-1 rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-3 font-mono text-[11px] text-[#CAD3F5]">
                      <div>
                        <span className="text-[#2277FF]">Accept:</span> application/json
                      </div>
                      <div>
                        <span className="text-[#2277FF]">Authorization:</span>{' '}
                        {simulatedRoleIndex === 0
                          ? '<None — Anonymous Guest>'
                          : `Bearer snp_token_${ACCESS_ROLES[simulatedRoleIndex].role.toLowerCase().replace(/[^a-z]/g, '_')}_active`}
                      </div>
                      <div>
                        <span className="text-[#2277FF]">X-Branch-Id:</span>{' '}
                        {simulatedRoleIndex === 0 ? '<None>' : 'BR-01 (Phnom Penh Main)'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-mono text-[10px] font-bold text-[#2277FF] uppercase">
                      Test Authorization Response
                    </span>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSimulatedTestFeedback({
                              endpoint: 'GET /api/v1/health',
                              status: 200,
                              message:
                                'HTTP 200 OK — Allowed: Public endpoint accessible without session',
                            });
                          }}
                          className="rounded-[4px] border border-0 border-[#CAD3F5] bg-white px-2.5 py-1 font-mono text-[11px] font-bold text-[#0A1A4A] hover:border-[#0056FF]"
                        >
                          GET /api/v1/health
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSimulatedTestFeedback({
                              endpoint: 'GET /api/v1/classes',
                              status: 200,
                              message:
                                'HTTP 200 OK — Allowed: Scoped to BR-01 class schedule catalog',
                            });
                          }}
                          className="rounded-[4px] border border-0 border-[#CAD3F5] bg-white px-2.5 py-1 font-mono text-[11px] font-bold text-[#0A1A4A] hover:border-[#0056FF]"
                        >
                          GET /api/v1/classes
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const isAllowed = simulatedRoleIndex === 3 || simulatedRoleIndex === 5; // Cashier or Super Admin
                            setSimulatedTestFeedback({
                              endpoint: 'POST /api/v1/payments',
                              status: isAllowed ? 201 : 403,
                              message: isAllowed
                                ? 'HTTP 201 Created — Allowed: Authorized payment cashier session'
                                : 'HTTP 403 Forbidden — Blocked: Missing permission payment.create.own_branch',
                            });
                          }}
                          className="rounded-[4px] border border-0 border-[#CAD3F5] bg-white px-2.5 py-1 font-mono text-[11px] font-bold text-[#0A1A4A] hover:border-[#0056FF]"
                        >
                          POST /api/v1/payments
                        </button>
                      </div>

                      {simulatedTestFeedback && (
                        <div
                          className={cn(
                            'rounded-xl border p-3 font-mono text-[11px]',
                            simulatedTestFeedback.status === 200 ||
                              simulatedTestFeedback.status === 201
                              ? 'border-[#CAD3F5] bg-[#EFF5FF] text-[#0A1A4A]'
                              : 'border-[#0056FF] bg-[#EFF5FF] text-[#0A1A4A]',
                          )}
                        >
                          <div className="font-bold">{simulatedTestFeedback.endpoint}</div>
                          <div className="mt-0.5">{simulatedTestFeedback.message}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5: Interactive API Explorer */}
            <section id="api-doc" className="scroll-mt-24 space-y-8 border-t border-[#CAD3F5] pt-8">
              <div>
                <h2 className="text-base font-bold tracking-tight text-[#0A1A4A]">
                  Interactive API Explorer
                </h2>
                <p className="mt-1 text-xs text-[#2277FF]">
                  Select any endpoint below to inspect request/response schemas, copy terminal cURL
                  commands, or send live test requests directly to the running backend.
                </p>
              </div>

              {/* Status Codes Cards (No Table) */}
              <div id="status-codes" className="scroll-mt-24 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-xs font-bold tracking-wider text-[#0A1A4A] uppercase">
                    HTTP Status Codes Standard
                  </h3>
                  <span className="font-mono text-[11px] text-[#2277FF]">REST RFC 9110</span>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {STATUS_CODES.map((st) => (
                    <div
                      key={st.code}
                      className="flex flex-col justify-between rounded-xl border border-[#CAD3F5] bg-white p-3.5 transition-all hover:border-[#0056FF] hover:bg-[#EFF5FF]"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-md px-2 py-0.5 font-mono text-xs font-black',
                            st.code.startsWith('2')
                              ? 'border border-[#CAD3F5] bg-[#E3E7FC] text-[#0056FF]'
                              : 'border border-[#CAD3F5] bg-[#EFF5FF] text-white',
                          )}
                        >
                          {st.code}
                        </span>
                        <span className="font-sans text-xs font-bold text-[#0A1A4A]">
                          {st.status}
                        </span>
                      </div>
                      <p className="mt-2 font-sans text-[11.5px] leading-relaxed text-[#0A1A4A]/70">
                        {st.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Endpoints Cards */}
              <div className="space-y-6 pt-2">
                {INTERACTIVE_ITEMS.map((item) => {
                  const liveRes = testResults[item.id];
                  const isTestingThis = testingEndpointId === item.id;
                  return (
                    <div
                      key={item.id}
                      id={item.id}
                      className="scroll-mt-24 space-y-4 rounded-2xl border border-[#CAD3F5] bg-white/90 p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all duration-300 hover:border-[#0056FF] hover:shadow-lg"
                    >
                      <div className="flex flex-col justify-between gap-3 border-b border-[#CAD3F5] pb-4 sm:flex-row sm:items-center">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                'rounded-md px-2 py-0.5 font-mono text-[10px] font-black tracking-wider uppercase',
                                item.method === 'GET'
                                  ? 'border border-[#0056FF]/30 bg-[#0056FF] text-white shadow-xs'
                                  : 'border border-[#0056FF] bg-[#0056FF] text-white shadow-xs',
                              )}
                            >
                              {item.method}
                            </span>
                            <span className="font-mono text-xs font-bold text-[#0A1A4A]">
                              {item.path}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-[#0A1A4A]">{item.title}</p>
                          <p className="font-sans text-xs text-[#0A1A4A]/70">{item.summary}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <GeometricButton
                            size="sm"
                            variant="outline"
                            disabled={isTestingThis}
                            onClick={() => handleTest(item)}
                            icon={<Server className="size-3 text-[#0056FF]" />}
                          >
                            {isTestingThis ? 'Testing...' : 'Test Live'}
                          </GeometricButton>
                        </div>
                      </div>

                      {/* Metadata Badges */}
                      <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                        <div className="rounded-lg border border-[#CAD3F5] bg-[#EFF5FF] px-2.5 py-1 text-[#0A1A4A]/80">
                          Permission: <strong className="text-[#0056FF]">{item.permission}</strong>
                        </div>
                        <div className="rounded-lg border border-[#CAD3F5] bg-[#EFF5FF] px-2.5 py-1 text-[#0A1A4A]/80">
                          Scope Header:{' '}
                          <strong
                            className={item.scopeHeader ? 'text-[#0056FF]' : 'text-[#2277FF]'}
                          >
                            {item.scopeHeader ? 'X-Branch-Id Required' : 'None'}
                          </strong>
                        </div>
                      </div>

                      {/* Live Test Output Display */}
                      {liveRes && (
                        <div className="space-y-1.5 rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-3 font-mono text-xs shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)]">
                          <div className="flex items-center justify-between">
                            <span
                              className={
                                liveRes.status === 200
                                  ? 'font-bold text-[#0056FF]'
                                  : 'font-bold text-[#0A1A4A]'
                              }
                            >
                              Live Response: HTTP {liveRes.status}
                            </span>
                            <span className="text-[#2277FF]">{liveRes.latency}ms</span>
                          </div>
                          <pre className="max-h-32 overflow-y-auto rounded-lg border border-[#CAD3F5] bg-white p-2 text-[11px] text-[#0A1A4A]">
                            {JSON.stringify(liveRes.body, null, 2)}
                          </pre>
                        </div>
                      )}

                      {/* Code Snippet Card */}
                      <div className="overflow-hidden rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)]">
                        <div className="flex items-center justify-between border-b border-[#CAD3F5] bg-[#EFF5FF] px-3.5 py-2 font-mono text-xs">
                          <div className="flex items-center gap-1.5">
                            <GeometricButton
                              size="sm"
                              variant={codeType === 'curl' ? 'blue' : 'outline'}
                              isActive={codeType === 'curl'}
                              onClick={() => setCodeType('curl')}
                            >
                              cURL
                            </GeometricButton>
                            <GeometricButton
                              size="sm"
                              variant={codeType === 'ts' ? 'blue' : 'outline'}
                              isActive={codeType === 'ts'}
                              onClick={() => setCodeType('ts')}
                            >
                              TypeScript
                            </GeometricButton>
                            <GeometricButton
                              size="sm"
                              variant={codeType === 'json' ? 'blue' : 'outline'}
                              isActive={codeType === 'json'}
                              onClick={() => setCodeType('json')}
                            >
                              Response
                            </GeometricButton>
                          </div>

                          <GeometricButton
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopy(generateSnippet(item, codeType), item.id)}
                            icon={
                              copiedId === item.id ? (
                                <Check className="size-3 text-[#0056FF]" />
                              ) : (
                                <Copy className="size-3 text-[#0A1A4A]/70" />
                              )
                            }
                          >
                            {copiedId === item.id ? 'Copied' : 'Copy'}
                          </GeometricButton>
                        </div>

                        <pre className="max-h-64 overflow-x-auto bg-white p-3.5 font-mono text-xs leading-relaxed text-[#0A1A4A]">
                          <code>{generateSnippet(item, codeType)}</code>
                        </pre>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section 6: Change Logs & Real-Time Releases (Placed at Bottom of Page - No Table) */}
            <section
              id="changelogs"
              className="scroll-mt-24 space-y-4 border-t border-[#CAD3F5] pt-8"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-base font-bold tracking-tight text-[#0A1A4A]">
                    Change Logs & Checkpoints
                  </h2>
                  <p className="mt-1 text-xs text-[#2277FF]">
                    Live repository release status, deployment checkpoints, and version ledger.
                  </p>
                </div>

                {/* GitHub Status & Real-time Tag Badges (Zero Dot Style) */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-3 py-1 font-mono text-[11px] font-bold text-[#0056FF]">
                    branch: main
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#CAD3F5] bg-[#EFF5FF] px-3 py-1 font-mono text-[11px] font-bold text-[#0A1A4A]/80">
                    checkpoint: v{CHANGE_LOGS[0]?.version || '0.2.7'}
                  </span>
                  <a
                    href="https://github.com/shiliaiwei/SNP-SMS"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full border border-[#CAD3F5] bg-[#EFF5FF] px-3 py-1 font-mono text-[11px] font-bold text-white transition-colors hover:bg-[#0056FF]"
                  >
                    GitHub Status [PASSED]
                  </a>
                </div>
              </div>

              {/* Change Log Entries (No Table: Sleek Modern Stacked Cards) */}
              <div className="space-y-2.5">
                {(expandedChangelog ? CHANGE_LOGS : CHANGE_LOGS.slice(0, 3)).map((log) => (
                  <div
                    key={log.version + (log.commitHash || '')}
                    className="flex flex-col justify-between gap-2 rounded-xl border border-[#CAD3F5] bg-white p-3.5 transition-all duration-150 hover:border-[#0056FF] hover:bg-[#EFF5FF] sm:flex-row sm:items-center"
                  >
                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* Version Badge */}
                      <span className="inline-flex items-center rounded-md border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 font-mono text-xs font-bold text-[#0056FF]">
                        v{log.version}
                      </span>

                      {/* Commit Hash Badge */}
                      {log.commitHash && (
                        <span className="inline-flex items-center rounded-md border border-[#CAD3F5] bg-[#EFF5FF] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#0A1A4A]/80">
                          {log.commitHash}
                        </span>
                      )}

                      {/* Concise Summary (Short & Descriptionless) */}
                      <span className="font-sans text-xs font-semibold text-[#0A1A4A]">
                        {log.description}
                      </span>
                    </div>

                    {/* Date Badge */}
                    <span className="shrink-0 font-mono text-[11px] text-[#2277FF]">
                      {log.date}
                    </span>
                  </div>
                ))}
              </div>

              {/* Dropdown Toggle: Show More / Show Less */}
              <div className="flex justify-center pt-2">
                <GeometricButton
                  size="sm"
                  variant="outline"
                  onClick={() => setExpandedChangelog((prev) => !prev)}
                >
                  {expandedChangelog
                    ? 'Show fewer releases (Recent 3)'
                    : `Show all changelogs (${CHANGE_LOGS.length})`}
                </GeometricButton>
              </div>
            </section>

            {/* SECTION 8: Privacy Policy */}
            <section
              id="privacy-policy"
              className="scroll-mt-24 space-y-4 rounded-2xl border border-[#CAD3F5] bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-md border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 font-mono text-xs font-bold text-[#0056FF]">
                  LEGAL & SECURITY
                </span>
                <span className="font-mono text-xs text-[#2277FF]">Updated: 30.10.2026</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-[#0A1A4A] sm:text-2xl">
                Privacy & Data Protection Policy
              </h2>
              <p className="text-sm leading-relaxed text-[#0A1A4A]/70">
                The SNP-SMS platform implements strict data privacy, multi-tenant isolation, and
                zero-trust security controls. All access to student lifecycles, staff profiles, and
                academic records adheres to international data privacy standards and Cambodian
                national digital education regulations.
              </p>
              <div className="grid gap-3 pt-2 sm:grid-cols-3">
                <div className="rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-3.5">
                  <div className="font-sans text-xs font-bold text-[#0A1A4A]">Tenant Isolation</div>
                  <p className="mt-1 font-sans text-xs text-[#2277FF]">
                    Queries and mutations strictly enforce school and branch scoping server-side.
                    Zero cross-tenant data leakage.
                  </p>
                </div>
                <div className="rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-3.5">
                  <div className="font-sans text-xs font-bold text-[#0A1A4A]">
                    Cryptographic Hygiene
                  </div>
                  <p className="mt-1 font-sans text-xs text-[#2277FF]">
                    Credentials, tokens, and webhooks verify via constant-time checks. Passwords use
                    argon2 hashing.
                  </p>
                </div>
                <div className="rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-3.5">
                  <div className="font-sans text-xs font-bold text-[#0A1A4A]">
                    Audit & Non-Repudiation
                  </div>
                  <p className="mt-1 font-sans text-xs text-[#2277FF]">
                    Every state mutation generates an immutable cryptographic ledger entry with
                    caller identity and timestamp.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 9: Terms of Service */}
            <section
              id="terms-of-service"
              className="scroll-mt-24 space-y-4 rounded-2xl border border-[#CAD3F5] bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-md border border-[#CAD3F5] bg-[#EFF5FF] px-2.5 py-0.5 font-mono text-xs font-bold text-[#0A1A4A]/80">
                  PLATFORM AGREEMENT
                </span>
                <span className="font-mono text-xs text-[#2277FF]">Effective: 30.10.2026</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-[#0A1A4A] sm:text-2xl">
                Terms of Service & API Usage
              </h2>
              <p className="text-sm leading-relaxed text-[#0A1A4A]/70">
                By accessing the SNPI-SMS APIs, design library, or developer documentation portal,
                organizations and authorized integrators agree to comply with rate limits,
                role-based scope boundaries, and responsible disclosure obligations.
              </p>
              <div className="grid gap-3 pt-2 sm:grid-cols-3">
                <div className="rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-3.5">
                  <div className="font-sans text-xs font-bold text-[#0A1A4A]">
                    Authorized Integrations
                  </div>
                  <p className="mt-1 font-sans text-xs text-[#2277FF]">
                    API calls require active JWT Bearer tokens or dedicated service account keys
                    with least-privilege RBAC.
                  </p>
                </div>
                <div className="rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-3.5">
                  <div className="font-sans text-xs font-bold text-[#0A1A4A]">
                    Rate Limits & SLAs
                  </div>
                  <p className="mt-1 font-sans text-xs text-[#2277FF]">
                    Default 2,000 requests per 15-minute window per IP. Burst mutation guards apply
                    on financial accounting endpoints.
                  </p>
                </div>
                <div className="rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-3.5">
                  <div className="font-sans text-xs font-bold text-[#0A1A4A]">
                    Service Reliability
                  </div>
                  <p className="mt-1 font-sans text-xs text-[#2277FF]">
                    Target 99.95% uptime with automated MongoDB replica set failover and serverless
                    edge distribution.
                  </p>
                </div>
              </div>
            </section>

            {/* Nextra Pagination Navigation Footer */}
            <div className="mt-12 border-t border-[#CAD3F5] pt-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Link
                  href="/document/design-system"
                  className="group flex flex-col rounded-lg border border-[#CAD3F5] bg-white p-4 transition-all hover:border-[#0056FF] hover:bg-[#EFF5FF]"
                >
                  <span className="font-mono text-[10.5px] tracking-wider text-[#2277FF] uppercase">
                    Previous
                  </span>
                  <span className="font-sans text-sm font-bold text-[#0A1A4A] transition-colors group-hover:text-[#0056FF]">
                    ← UI Component Library
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => scrollToDocSection('endpoints-available')}
                  className="group flex cursor-pointer flex-col rounded-lg border border-[#CAD3F5] bg-white p-4 text-right transition-all hover:border-[#0056FF] hover:bg-[#EFF5FF]"
                >
                  <span className="font-mono text-[10.5px] tracking-wider text-[#2277FF] uppercase">
                    Next
                  </span>
                  <span className="font-sans text-sm font-bold text-[#0A1A4A] transition-colors group-hover:text-[#0056FF]">
                    Endpoints Reference →
                  </span>
                </button>
              </div>
              <div className="mt-6 flex flex-col items-center justify-between gap-2 pb-8 font-sans text-xs text-[#2277FF] sm:flex-row">
                <span>Last updated on October 31, 2026</span>
                <span>
                  Simple, powerful and flexible markdown-powered docs site. Built with Next.js.
                </span>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
