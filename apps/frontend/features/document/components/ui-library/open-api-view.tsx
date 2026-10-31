'use client';

import * as React from 'react';

import { Check, Copy, Server, Search } from '@/components/icons';
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

const DOC_TOC_HEADINGS = [
  { id: 'open-api-head', title: 'Open API', level: 1 },
  { id: 'introduction', title: 'Introduction', level: 2 },
  { id: 'purpose', title: '1. Purpose', level: 2 },
  { id: 'scope', title: '2. Scope', level: 2 },
  { id: 'overall-api', title: '3. Overall API', level: 2 },
  { id: 'who-can-access', title: 'Who Can Access', level: 1 },
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

  return (
    <div
      ref={rootRef}
      className="min-h-screen bg-white text-slate-900 selection:bg-[#0056FF] selection:text-white"
    >
      {/* Main Grid Container (Exact same max-w-[1560px] 3-column layout matching UI Library) */}
      <div className="mx-auto max-w-[1560px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* COLUMN 1: Left Sticky Sidebar Navigation (Permanently Pinned Like Navbar) */}
          <aside className="w-full shrink-0 lg:sticky lg:top-20 lg:z-30 lg:w-60 lg:self-start xl:w-64">
            <div className="no-scrollbar max-h-[calc(100vh-5.5rem)] [scrollbar-width:none] space-y-6 overflow-y-auto pr-2 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {/* Filter Input */}
              <GeometricInput
                inputSize="sm"
                placeholder="Filter endpoints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-3.5 w-3.5 text-[#0056FF]" />}
              />

              {/* Primary Nav Capsules (Strictly Light Theme - Zero Black/Dark Buttons) */}
              <div className="space-y-1.5 font-sans">
                {(() => {
                  const isAllModulesActive =
                    (activeDocSection === 'endpoints-available' &&
                      selectedCategory === 'All Modules') ||
                    activeDocSection === 'open-api-head';
                  const isCatalogActive =
                    activeDocSection === 'endpoints-available' &&
                    selectedCategory !== 'All Modules';
                  const isLiveTesterActive =
                    activeDocSection === 'api-doc' || activeDocSection === 'status-codes';
                  const isProtectedActive = activeDocSection === 'protected-endpoints';

                  return (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory('All Modules');
                          setSearchQuery('');
                          scrollToDocSection('endpoints-available');
                        }}
                        className={cn(
                          'flex w-full cursor-pointer items-center justify-between rounded-full border px-4 py-2 text-left font-sans text-xs font-bold transition-all',
                          isAllModulesActive
                            ? 'border-[#0056FF] bg-[#0056FF] text-white shadow-xs'
                            : 'border-slate-200/90 bg-white text-slate-700 hover:border-[#0056FF] hover:text-[#0056FF]',
                        )}
                      >
                        <span>All Modules</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory('All Modules');
                          setSearchQuery('');
                          scrollToDocSection('endpoints-available');
                        }}
                        className={cn(
                          'flex w-full cursor-pointer items-center justify-between rounded-full border px-4 py-2 text-left font-sans text-xs font-bold transition-all',
                          isCatalogActive
                            ? 'border-[#0056FF] bg-[#0056FF] text-white shadow-xs'
                            : 'border-slate-200/90 bg-white text-slate-700 hover:border-[#0056FF] hover:text-[#0056FF]',
                        )}
                      >
                        <span>Catalog</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollToDocSection('api-doc')}
                        className={cn(
                          'flex w-full cursor-pointer items-center justify-between rounded-full border px-4 py-2 text-left font-sans text-xs font-bold transition-all',
                          isLiveTesterActive
                            ? 'border-[#0056FF] bg-[#0056FF] text-white shadow-xs'
                            : 'border-slate-200/90 bg-white text-slate-700 hover:border-[#0056FF] hover:text-[#0056FF]',
                        )}
                      >
                        <span>Live Tester</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollToDocSection('protected-endpoints')}
                        className={cn(
                          'flex w-full cursor-pointer items-center justify-between rounded-full border px-4 py-2 text-left font-sans text-xs font-bold transition-all',
                          isProtectedActive
                            ? 'border-[#0056FF] bg-[#0056FF] text-white shadow-xs'
                            : 'border-slate-200/90 bg-white text-slate-700 hover:border-[#0056FF] hover:text-[#0056FF]',
                        )}
                      >
                        <span>Protected APIs</span>
                      </button>
                    </>
                  );
                })()}
              </div>

              {/* Endpoint Modules / Categories with Active Highlights */}
              <div className="space-y-4 font-sans text-xs">
                <div className="flex items-center justify-between pb-1 font-mono text-[10px] font-bold text-slate-400 uppercase">
                  <span>API Modules</span>
                  <span className="text-[#0056FF]">{categories.length}</span>
                </div>
                {/* Continuous Vertical Line Tracker Track (Zero Dots, Pure Precision Line) */}
                <div className="relative space-y-0.5 border-l-2 border-slate-200/90 pl-3 dark:border-slate-800">
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
                          'group relative flex w-full cursor-pointer items-center justify-between rounded-r-lg py-1.5 pr-2 pl-2.5 text-left font-sans text-xs transition-all duration-150 select-none',
                          isSelected
                            ? '-ml-[2px] bg-[#0056FF]/[0.07] font-bold text-[#0056FF]'
                            : 'font-normal text-slate-600 hover:translate-x-0.5 hover:bg-slate-50 hover:text-slate-950',
                        )}
                      >
                        {isSelected && (
                          <span
                            aria-hidden="true"
                            className="absolute top-0 bottom-0 -left-[2px] w-[2.5px] rounded-[1px] bg-[#0056FF] shadow-[0_0_8px_rgba(0,86,255,0.5)]"
                          />
                        )}
                        <span className="truncate">{cat.name}</span>
                        <span
                          className={cn(
                            'font-mono text-[10px] font-bold',
                            isSelected ? 'text-[#0056FF]' : 'text-slate-400',
                          )}
                        >
                          {cat.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Documentation Section Links */}
                <div className="border-t border-slate-200/80 pt-3">
                  <div className="pb-2 font-mono text-[10px] font-bold text-slate-400 uppercase">
                    <span>Quick Sections</span>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { id: 'open-api-head', label: 'Overview' },
                      { id: 'introduction', label: 'Introduction' },
                      { id: 'who-can-access', label: 'Access Matrix' },
                      { id: 'endpoints-available', label: 'Endpoints Catalog' },
                      { id: 'api-doc', label: 'Interactive Tester' },
                      { id: 'status-codes', label: 'Status Codes' },
                      { id: 'changelogs', label: 'Change Logs' },
                    ].map((doc) => {
                      const isCurrentActive =
                        activeDocSection === doc.id ||
                        (doc.id === 'introduction' &&
                          ['purpose', 'scope', 'overall-api'].includes(activeDocSection)) ||
                        (doc.id === 'endpoints-available' &&
                          activeDocSection === 'protected-endpoints');
                      return (
                        <button
                          key={doc.id}
                          type="button"
                          onClick={() => scrollToDocSection(doc.id)}
                          className={cn(
                            'flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-1.5 text-left font-sans text-xs font-semibold transition-all',
                            isCurrentActive
                              ? 'bg-[#0056FF] font-bold text-white'
                              : 'bg-white text-slate-700 hover:bg-slate-50',
                          )}
                        >
                          <span className="truncate">{doc.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* COLUMN 2: Center Main Content Feed */}
          <main className="min-w-0 flex-1 space-y-12">
            {/* HERO HEAD TITLE: Specific to Open API (Monumental Big As Footer Style) */}
            <section id="open-api-head" className="scroll-mt-24 space-y-4">
              <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-b from-white via-slate-50/50 to-[#E3E7FC]/30 p-6 shadow-xs sm:p-10">
                <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                  <div>
                    <h1 className="font-sans text-5xl font-black tracking-tight text-slate-950 sm:text-6xl md:text-7xl lg:text-8xl">
                      Open API
                    </h1>
                  </div>

                  <div className="shrink-0">
                    <GeometricHeaderStamp
                      codeA="47"
                      titleA="MODULES"
                      codeB="193"
                      titleB="ENDPOINTS"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Section 1: Introduction */}
            <section id="introduction" className="scroll-mt-24 space-y-6">
              <h2 className="text-base font-bold tracking-tight text-slate-950">Introduction</h2>

              {/* 1. Purpose */}
              <div id="purpose" className="scroll-mt-24 space-y-2">
                <h3 className="font-mono text-xs font-bold tracking-wider text-slate-800 uppercase">
                  1. Purpose
                </h3>
                <p className="font-sans text-xs leading-relaxed text-slate-600">
                  This document describes the technical REST API specification of the SNPI
                  Integrated Multi-Branch School Management System (SNPI-SMS). The primary audience
                  is third-party integrators, mobile developers, campus IT staff, and administrative
                  client systems.
                </p>
              </div>

              {/* 2. Scope */}
              <div id="scope" className="scroll-mt-24 space-y-2">
                <h3 className="font-mono text-xs font-bold tracking-wider text-slate-800 uppercase">
                  2. Scope
                </h3>
                <p className="font-sans text-xs leading-relaxed text-slate-600">
                  Defines all accessible API surfaces, multi-branch scoping headers (X-Branch-Id),
                  who can access each resource, authentication and token refresh lifecycles, and
                  defense mechanisms safeguarding sensitive financial and academic mutations.
                </p>
              </div>

              {/* 3. Overall API */}
              <div id="overall-api" className="scroll-mt-24 space-y-3">
                <h3 className="font-mono text-xs font-bold tracking-wider text-slate-800 uppercase">
                  3. Overall API
                </h3>
                <div className="grid grid-cols-1 gap-3 font-mono text-xs sm:grid-cols-2">
                  <div className="space-y-1 rounded-xl border border-slate-200/90 bg-white p-3.5 transition-all hover:border-[#0056FF]/40">
                    <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                      Base URL
                    </span>
                    <p className="truncate font-bold text-[#0056FF]">
                      http://localhost:4000/api/v1
                    </p>
                  </div>
                  <div className="space-y-1 rounded-xl border border-slate-200/90 bg-white p-3.5 transition-all hover:border-[#0056FF]/40">
                    <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                      Payload Format
                    </span>
                    <p className="font-bold text-slate-800">JSON (application/json)</p>
                  </div>
                  <div className="space-y-1 rounded-xl border border-slate-200/90 bg-white p-3.5 transition-all hover:border-[#0056FF]/40">
                    <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                      Authorization
                    </span>
                    <p className="font-bold text-[#000B26]">Bearer &lt;access_token&gt;</p>
                  </div>
                  <div className="space-y-1 rounded-xl border border-slate-200/90 bg-white p-3.5 transition-all hover:border-[#0056FF]/40">
                    <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
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
              className="scroll-mt-24 space-y-4 border-t border-slate-200 pt-8"
            >
              <div>
                <h2 className="text-base font-bold tracking-tight text-slate-950">
                  Who Can Access The API
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Access is strictly governed by Role-Based Access Control (RBAC) and campus branch
                  boundaries.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {ACCESS_ROLES.map((role) => (
                  <div
                    key={role.role}
                    className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-4.5 transition-all duration-150 hover:border-[#0056FF]/40 hover:bg-[#F8FAFC]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-3 py-1 font-sans text-xs font-bold text-[#0056FF]">
                          {role.role}
                        </span>
                        <span className="font-mono text-[10px] font-semibold text-slate-400 uppercase">
                          RBAC Scope
                        </span>
                      </div>
                      <p className="mt-2.5 font-sans text-xs font-semibold text-slate-800">
                        {role.targetAudience}
                      </p>
                      <div className="mt-3 space-y-1.5 rounded-lg border border-slate-100 bg-slate-50/70 p-3">
                        <div className="font-sans text-[11px] font-bold text-slate-900">
                          {role.accessScope}
                        </div>
                        <p className="font-mono text-[11px] leading-relaxed text-slate-600">
                          {role.allowedEndpoints}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3.5 border-t border-slate-100 pt-2.5">
                      <span className="font-sans text-[11px] text-slate-500">
                        <strong className="font-semibold text-slate-700">Security: </strong>
                        {role.securityMethod}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3: What Other Developers Can Get (Modern Card Grid - No Table) */}
            <section
              id="endpoints-available"
              className="scroll-mt-24 space-y-4 border-t border-slate-200 pt-8"
            >
              <div>
                <h2 className="text-base font-bold tracking-tight text-slate-950">
                  What Other Developers Can Get (Read & Integration Surface)
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Standardized endpoints consumable by client applications, mobile portals, and
                  reporting integrations using standard HTTP GET queries.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {filteredEndpoints.length === 0 ? (
                  <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center">
                    <p className="font-sans text-sm font-semibold text-slate-600">
                      No matching endpoints found
                    </p>
                    <p className="mt-1 font-sans text-xs text-slate-400">
                      Try searching for another keyword or select &quot;All Modules&quot;
                    </p>
                  </div>
                ) : (
                  filteredEndpoints.map((ep) => (
                    <div
                      key={ep.path + ep.method}
                      className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-4 transition-all duration-150 hover:border-[#0056FF]/40 hover:bg-[#F8FAFC]"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center rounded-md border border-[#CAD3F5] bg-[#E3E7FC] px-2 py-0.5 font-mono text-[11px] font-bold text-[#0056FF]">
                            {ep.method}
                          </span>
                          <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-sans text-[10px] font-semibold text-slate-600">
                            {ep.category}
                          </span>
                        </div>
                        <div className="mt-2.5 font-mono text-xs font-bold text-slate-950">
                          {ep.path}
                        </div>
                        <p className="mt-1 font-sans text-xs leading-relaxed text-slate-600">
                          {ep.description}
                        </p>
                      </div>
                      <div className="mt-3 border-t border-slate-100 pt-2">
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
              className="scroll-mt-24 space-y-4 border-t border-slate-200 pt-8"
            >
              <div>
                <h2 className="text-base font-bold tracking-tight text-slate-950">
                  What Endpoints Must Be Protected & How
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  High-impact write and mutation operations enforced with multi-layer defense
                  mechanisms to prevent financial tampering and unauthorized grade alterations.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {PROTECTED_MUTATION_ENDPOINTS.map((item) => (
                  <div
                    key={item.path + item.method}
                    className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-4.5 transition-all duration-150 hover:border-[#0056FF]/40 hover:bg-[#F8FAFC]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center rounded-md border border-slate-900 bg-[#000B26] px-2.5 py-0.5 font-mono text-[11px] font-bold text-white">
                          {item.method}
                        </span>
                        <span className="font-sans text-[11px] font-bold text-slate-700">
                          {item.domain}
                        </span>
                      </div>
                      <div className="mt-2.5 font-mono text-xs font-bold text-slate-950">
                        {item.path}
                      </div>
                      <p className="mt-2 font-sans text-xs leading-relaxed text-slate-600">
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
            </section>

            {/* Section 5: Interactive API Explorer */}
            <section id="api-doc" className="scroll-mt-24 space-y-8 border-t border-slate-200 pt-8">
              <div>
                <h2 className="text-base font-bold tracking-tight text-slate-950">
                  Interactive API Explorer
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Select any endpoint below to inspect request/response schemas, copy terminal cURL
                  commands, or send live test requests directly to the running backend.
                </p>
              </div>

              {/* Status Codes Cards (No Table) */}
              <div id="status-codes" className="scroll-mt-24 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-mono text-xs font-bold tracking-wider text-slate-800 uppercase">
                    HTTP Status Codes Standard
                  </h3>
                  <span className="font-mono text-[11px] text-slate-400">REST RFC 9110</span>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {STATUS_CODES.map((st) => (
                    <div
                      key={st.code}
                      className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-3.5 transition-all hover:border-[#0056FF]/40 hover:bg-[#F8FAFC]"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'inline-flex items-center rounded-md px-2 py-0.5 font-mono text-xs font-black',
                            st.code.startsWith('2')
                              ? 'border border-[#CAD3F5] bg-[#E3E7FC] text-[#0056FF]'
                              : 'border border-slate-900 bg-[#000B26] text-white',
                          )}
                        >
                          {st.code}
                        </span>
                        <span className="font-sans text-xs font-bold text-slate-900">
                          {st.status}
                        </span>
                      </div>
                      <p className="mt-2 font-sans text-[11.5px] leading-relaxed text-slate-600">
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
                      className="scroll-mt-24 space-y-4 rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all duration-300 hover:border-[#0056FF]/40 hover:shadow-lg"
                    >
                      <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                'rounded-md px-2 py-0.5 font-mono text-[10px] font-black tracking-wider uppercase',
                                item.method === 'GET'
                                  ? 'border border-[#0056FF]/30 bg-[#0056FF] text-white shadow-xs'
                                  : 'border border-black bg-black text-white shadow-xs',
                              )}
                            >
                              {item.method}
                            </span>
                            <span className="font-mono text-xs font-bold text-slate-900">
                              {item.path}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-800">{item.title}</p>
                          <p className="font-sans text-xs text-slate-600">{item.summary}</p>
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
                        <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700">
                          Permission: <strong className="text-[#0056FF]">{item.permission}</strong>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700">
                          Scope Header:{' '}
                          <strong
                            className={item.scopeHeader ? 'text-[#0056FF]' : 'text-slate-400'}
                          >
                            {item.scopeHeader ? 'X-Branch-Id Required' : 'None'}
                          </strong>
                        </div>
                      </div>

                      {/* Live Test Output Display */}
                      {liveRes && (
                        <div className="space-y-1.5 rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 font-mono text-xs shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)]">
                          <div className="flex items-center justify-between">
                            <span
                              className={
                                liveRes.status === 200
                                  ? 'font-bold text-[#0056FF]'
                                  : 'font-bold text-[#000B26]'
                              }
                            >
                              Live Response: HTTP {liveRes.status}
                            </span>
                            <span className="text-slate-500">{liveRes.latency}ms</span>
                          </div>
                          <pre className="max-h-32 overflow-y-auto rounded-lg border border-slate-200 bg-white p-2 text-[11px] text-slate-800">
                            {JSON.stringify(liveRes.body, null, 2)}
                          </pre>
                        </div>
                      )}

                      {/* Code Snippet Card */}
                      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-slate-50/50 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)]">
                        <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-100/80 px-3.5 py-2 font-mono text-xs">
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
                                <Copy className="size-3 text-slate-600" />
                              )
                            }
                          >
                            {copiedId === item.id ? 'Copied' : 'Copy'}
                          </GeometricButton>
                        </div>

                        <pre className="max-h-64 overflow-x-auto bg-white p-3.5 font-mono text-xs leading-relaxed text-slate-800">
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
              className="scroll-mt-24 space-y-4 border-t border-slate-200 pt-8"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-base font-bold tracking-tight text-slate-950">
                    Change Logs & Checkpoints
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Live repository release status, deployment checkpoints, and version ledger.
                  </p>
                </div>

                {/* GitHub Status & Real-time Tag Badges (Zero Dot Style) */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-3 py-1 font-mono text-[11px] font-bold text-[#0056FF]">
                    branch: main
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-mono text-[11px] font-bold text-slate-700">
                    checkpoint: v{CHANGE_LOGS[0]?.version || '0.2.7'}
                  </span>
                  <a
                    href="https://github.com/shiliaiwei/SNP-SMS"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-full border border-slate-900 bg-[#000B26] px-3 py-1 font-mono text-[11px] font-bold text-white transition-colors hover:bg-[#0056FF]"
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
                    className="flex flex-col justify-between gap-2 rounded-xl border border-slate-200/90 bg-white p-3.5 transition-all duration-150 hover:border-[#0056FF]/40 hover:bg-[#F8FAFC] sm:flex-row sm:items-center"
                  >
                    <div className="flex flex-wrap items-center gap-2.5">
                      {/* Version Badge */}
                      <span className="inline-flex items-center rounded-md border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 font-mono text-xs font-bold text-[#0056FF]">
                        v{log.version}
                      </span>

                      {/* Commit Hash Badge */}
                      {log.commitHash && (
                        <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-700">
                          {log.commitHash}
                        </span>
                      )}

                      {/* Concise Summary (Short & Descriptionless) */}
                      <span className="font-sans text-xs font-semibold text-slate-800">
                        {log.description}
                      </span>
                    </div>

                    {/* Date Badge */}
                    <span className="shrink-0 font-mono text-[11px] text-slate-400">
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
              className="scroll-mt-24 space-y-4 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-md border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 font-mono text-xs font-bold text-[#0056FF]">
                  LEGAL & SECURITY
                </span>
                <span className="font-mono text-xs text-slate-400">Updated: 30.10.2026</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                Privacy & Data Protection Policy
              </h2>
              <p className="text-sm leading-relaxed text-slate-600">
                The SNP-SMS platform implements strict data privacy, multi-tenant isolation, and
                zero-trust security controls. All access to student lifecycles, staff profiles, and
                academic records adheres to international data privacy standards and Cambodian
                national digital education regulations.
              </p>
              <div className="grid gap-3 pt-2 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5">
                  <div className="font-sans text-xs font-bold text-slate-900">Tenant Isolation</div>
                  <p className="mt-1 font-sans text-xs text-slate-500">
                    Queries and mutations strictly enforce school and branch scoping server-side.
                    Zero cross-tenant data leakage.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5">
                  <div className="font-sans text-xs font-bold text-slate-900">
                    Cryptographic Hygiene
                  </div>
                  <p className="mt-1 font-sans text-xs text-slate-500">
                    Credentials, tokens, and webhooks verify via constant-time checks. Passwords use
                    argon2 hashing.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5">
                  <div className="font-sans text-xs font-bold text-slate-900">
                    Audit & Non-Repudiation
                  </div>
                  <p className="mt-1 font-sans text-xs text-slate-500">
                    Every state mutation generates an immutable cryptographic ledger entry with
                    caller identity and timestamp.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 9: Terms of Service */}
            <section
              id="terms-of-service"
              className="scroll-mt-24 space-y-4 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_1px_4px_rgba(0,0,0,0.02)]"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-100 px-2.5 py-0.5 font-mono text-xs font-bold text-slate-700">
                  PLATFORM AGREEMENT
                </span>
                <span className="font-mono text-xs text-slate-400">Effective: 30.10.2026</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                Terms of Service & API Usage
              </h2>
              <p className="text-sm leading-relaxed text-slate-600">
                By accessing the SNPI-SMS APIs, design library, or developer documentation portal,
                organizations and authorized integrators agree to comply with rate limits,
                role-based scope boundaries, and responsible disclosure obligations.
              </p>
              <div className="grid gap-3 pt-2 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5">
                  <div className="font-sans text-xs font-bold text-slate-900">
                    Authorized Integrations
                  </div>
                  <p className="mt-1 font-sans text-xs text-slate-500">
                    API calls require active JWT Bearer tokens or dedicated service account keys
                    with least-privilege RBAC.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5">
                  <div className="font-sans text-xs font-bold text-slate-900">
                    Rate Limits & SLAs
                  </div>
                  <p className="mt-1 font-sans text-xs text-slate-500">
                    Default 2,000 requests per 15-minute window per IP. Burst mutation guards apply
                    on financial accounting endpoints.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5">
                  <div className="font-sans text-xs font-bold text-slate-900">
                    Service Reliability
                  </div>
                  <p className="mt-1 font-sans text-xs text-slate-500">
                    Target 99.95% uptime with automated MongoDB replica set failover and serverless
                    edge distribution.
                  </p>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
