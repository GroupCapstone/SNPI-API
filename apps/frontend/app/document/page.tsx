'use client';

import * as React from 'react';
import Link from 'next/link';

import { Check, Copy, Server, Layers } from '@/components/icons';
import { BrandMark } from '@/components/shared/brand-mark';
import { Button } from '@/components/ui/button';
import { CHANGE_LOGS } from '@/features/document/changelog-data';
import {
  GeometricHeaderStamp,
  DocsStickyHeader,
  GeometricButton,
  LineTrackerToc,
  type TocHeadingItem,
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
        version: '0.1.0',
        timestamp: '2026-10-29T12:00:00.000Z',
      },
    },
  },
];

const DOC_TOC_HEADINGS: TocHeadingItem[] = [
  { id: 'changelogs', title: 'Change Logs', level: 1 },
  { id: 'table-of-contents', title: 'Table of contents', level: 1 },
  { id: 'introduction', title: 'Introduction', level: 1 },
  { id: 'purpose', title: '1. Purpose', level: 2 },
  { id: 'scope', title: '2. Scope', level: 2 },
  { id: 'overall-api', title: '3. Overall API', level: 2 },
  { id: 'who-can-access', title: 'Who Can Access', level: 1 },
  { id: 'endpoints-available', title: 'Endpoints Catalog', level: 1 },
  { id: 'protected-endpoints', title: 'Protected Endpoints', level: 2 },
  { id: 'api-doc', title: 'API Documentation', level: 1 },
  { id: 'status-codes', title: 'Status Codes', level: 2 },
];

export default function DocumentPage() {
  const [activeEndpointId, setActiveEndpointId] = React.useState<string>('auth-login');
  const [activeDocSection, setActiveDocSection] = React.useState<string>('changelogs');
  const [codeType, setCodeType] = React.useState<'curl' | 'ts' | 'json'>('curl');
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const scrollToDocSection = (id: string) => {
    setActiveDocSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (let i = DOC_TOC_HEADINGS.length - 1; i >= 0; i--) {
        const item = DOC_TOC_HEADINGS[i];
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveDocSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
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
    const start = performance.now();
    try {
      const res = await fetch(item.path, {
        method: item.method === 'GET' ? 'GET' : 'HEAD',
        headers: { Accept: 'application/json' },
      });
      const end = performance.now();
      const latency = Math.round(end - start);

      let body: unknown = null;
      try {
        body = await res.json();
      } catch {
        body = { status: res.status, statusText: res.statusText };
      }

      setTestResults((prev) => ({
        ...prev,
        [item.id]: { status: res.status, latency, body },
      }));
    } catch (err) {
      const end = performance.now();
      setTestResults((prev) => ({
        ...prev,
        [item.id]: {
          status: 500,
          latency: Math.round(end - start),
          body: { error: err instanceof Error ? err.message : 'Network test error' },
        },
      }));
    } finally {
      setTestingEndpointId(null);
    }
  };

  const generateSnippet = (item: ApiDocItem, format: 'curl' | 'ts' | 'json'): string => {
    const isPost = item.method === 'POST' || item.method === 'PATCH';
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
    <div className="flex min-h-screen flex-col bg-white text-slate-900 antialiased selection:bg-[#0056FF] selection:text-white">
      {/* Main Grid: On This Page Sidebar + Body Content */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4 py-8 sm:px-6">
        {/* Left Column: On This Page Table of Contents with Real-time Tracker Line */}
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="sticky top-24 space-y-4">
            <GeometricButton
              href="/document/design-system"
              variant="blue"
              size="sm"
              icon={<Layers className="size-3.5" />}
              className="w-full justify-center"
            >
              UI Library
            </GeometricButton>

            <LineTrackerToc
              items={DOC_TOC_HEADINGS}
              activeId={activeDocSection}
              onSelect={scrollToDocSection}
              title="ON THIS PAGE"
            />
          </div>
        </aside>

        {/* Right / Main Content Area */}
        <main className="min-w-0 flex-1 space-y-10 pb-16">
          {/* Nextra-inspired Brand Header & Summary */}
          <div className="space-y-3 border-b border-slate-200 pb-8">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-2 font-mono text-xl font-bold tracking-tight text-slate-950">
                SNPI-SMS Documentation
              </span>
            </div>
            <p className="max-w-3xl font-sans text-sm leading-relaxed text-slate-600">
              <Link
                href="/document"
                className="font-medium text-slate-900 transition-colors hover:text-[#0056FF]"
              >
                SNPI-SMS Open API
              </Link>{' '}
              provides unified programmatic access to the SNPI-SMS modular monolith backend. It
              enables partner developers, mobile apps, and institutional integrations to securely
              interact with student profiles, academic calendars, attendance registries, and fee
              records through standardized REST endpoints.
            </p>
          </div>

          {/* Change Logs Section */}
          <section id="changelogs" className="scroll-mt-24 space-y-3">
            <h2 className="font-mono text-sm font-bold tracking-tight text-slate-950">
              Change Logs
            </h2>
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white text-xs shadow-xs">
              <table className="w-full text-left font-mono">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-700">
                  <tr>
                    <th className="w-20 p-2.5">Version</th>
                    <th className="w-24 p-2.5">Date</th>
                    <th className="w-24 p-2.5">Commit</th>
                    <th className="p-2.5">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {CHANGE_LOGS.map((log) => (
                    <tr key={log.version + (log.commitHash || '')} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-[#0056FF]">{log.version}</td>
                      <td className="p-2.5 text-slate-500">{log.date}</td>
                      <td className="p-2.5">
                        {log.commitHash ? (
                          <span className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-700">
                            {log.commitHash}
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">-</span>
                        )}
                      </td>
                      <td className="p-2.5 font-sans leading-relaxed text-slate-700">
                        {log.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Table of contents Section */}
          <section
            id="table-of-contents"
            className="scroll-mt-24 space-y-3 border-t border-slate-200 pt-8"
          >
            <h2 className="font-mono text-sm font-bold tracking-tight text-slate-950">
              Table of contents
            </h2>
            <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4 font-mono text-xs text-slate-700">
              <ol className="list-inside list-decimal space-y-1.5">
                <li>
                  <Link
                    href="/document/design-system"
                    className="font-semibold text-emerald-700 transition-colors hover:text-emerald-800"
                  >
                    UI Component Library & Design System Showcase &rarr;
                  </Link>
                </li>
                <li>
                  <a
                    href="#introduction"
                    className="text-[#0056FF] transition-colors hover:text-[#0040C0]"
                  >
                    Introduction (Purpose, Scope, Overall API)
                  </a>
                </li>
                <li>
                  <a
                    href="#who-can-access"
                    className="text-[#0056FF] transition-colors hover:text-[#0040C0]"
                  >
                    Who Can Access The API (RBAC Roles & Matrix)
                  </a>
                </li>
                <li>
                  <a
                    href="#endpoints-available"
                    className="text-[#0056FF] transition-colors hover:text-[#0040C0]"
                  >
                    What Other Developers Can Get (Read & Query Endpoints)
                  </a>
                </li>
                <li>
                  <a
                    href="#protected-endpoints"
                    className="text-[#0056FF] transition-colors hover:text-[#0040C0]"
                  >
                    What Endpoints Are Protected & How (Mutation Defense Guardrails)
                  </a>
                </li>
                <li>
                  <a
                    href="#status-codes"
                    className="text-[#0056FF] transition-colors hover:text-[#0040C0]"
                  >
                    HTTP Status Codes Standard
                  </a>
                </li>
                <li>
                  <a
                    href="#api-doc"
                    className="text-[#0056FF] transition-colors hover:text-[#0040C0]"
                  >
                    Interactive API Documentation & Explorer
                  </a>
                </li>
              </ol>
            </div>
          </section>

          {/* Introduction Section */}
          <section
            id="introduction"
            className="scroll-mt-24 space-y-6 border-t border-slate-200 pt-8"
          >
            <h2 className="text-base font-bold tracking-tight text-slate-950">Introduction</h2>

            {/* 1. Purpose */}
            <div id="purpose" className="scroll-mt-24 space-y-2">
              <h3 className="font-mono text-xs font-bold text-slate-800">1. Purpose</h3>
              <p className="font-sans text-xs leading-relaxed text-slate-600">
                This document describes the technical REST API specification of the SNPI Integrated
                Multi-Branch School Management System (SNPI-SMS). The primary audience is
                third-party integrators, mobile developers, campus IT staff, and administrative
                client systems.
              </p>
            </div>

            {/* 2. Scope */}
            <div id="scope" className="scroll-mt-24 space-y-2">
              <h3 className="font-mono text-xs font-bold text-slate-800">2. Scope</h3>
              <p className="font-sans text-xs leading-relaxed text-slate-600">
                Defines all accessible API surfaces, multi-branch scoping headers (X-Branch-Id), who
                can access each resource, authentication and token refresh lifecycles, and defense
                mechanisms safeguarding sensitive financial and academic mutations.
              </p>
            </div>

            {/* 3. Overall API */}
            <div id="overall-api" className="scroll-mt-24 space-y-3">
              <h3 className="font-mono text-xs font-bold text-slate-800">3. Overall API</h3>
              <div className="grid grid-cols-1 gap-3 font-mono text-xs sm:grid-cols-2">
                <div className="space-y-1 rounded-lg border border-slate-200 bg-white p-3 shadow-xs">
                  <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                    Base URL
                  </span>
                  <p className="truncate font-bold text-[#0056FF]">http://localhost:4000/api/v1</p>
                </div>
                <div className="space-y-1 rounded-lg border border-slate-200 bg-white p-3 shadow-xs">
                  <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                    Payload Format
                  </span>
                  <p className="font-bold text-slate-800">JSON (application/json)</p>
                </div>
                <div className="space-y-1 rounded-lg border border-slate-200 bg-white p-3 shadow-xs">
                  <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                    Authorization
                  </span>
                  <p className="font-bold text-amber-700">Bearer &lt;access_token&gt;</p>
                </div>
                <div className="space-y-1 rounded-lg border border-slate-200 bg-white p-3 shadow-xs">
                  <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
                    Campus Isolation
                  </span>
                  <p className="font-bold text-emerald-700">X-Branch-Id: &lt;branch_id&gt;</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Who Can Access The API */}
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

            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white text-xs shadow-xs">
              <table className="w-full text-left font-mono">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-700">
                  <tr>
                    <th className="w-36 p-2.5">Client Type / Role</th>
                    <th className="w-40 p-2.5">Target Audience</th>
                    <th className="p-2.5">Access Scope & Endpoints</th>
                    <th className="w-52 p-2.5">Security & Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans text-slate-700">
                  {ACCESS_ROLES.map((role) => (
                    <tr key={role.role} className="hover:bg-slate-50">
                      <td className="p-2.5 font-mono font-bold text-[#0056FF]">{role.role}</td>
                      <td className="p-2.5 text-xs text-slate-500">{role.targetAudience}</td>
                      <td className="p-2.5 text-xs">
                        <p className="font-semibold text-slate-900">{role.accessScope}</p>
                        <p className="mt-0.5 font-mono text-[11px] text-slate-600">
                          {role.allowedEndpoints}
                        </p>
                      </td>
                      <td className="p-2.5 text-xs text-slate-600">{role.securityMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section: What Other Devs Can Get */}
          <section
            id="endpoints-available"
            className="scroll-mt-24 space-y-4 border-t border-slate-200 pt-8"
          >
            <div>
              <h2 className="text-base font-bold tracking-tight text-slate-950">
                What Other Developers Can Get (Read & Integration Surface)
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                These standardized endpoints can be consumed by external client applications, mobile
                apps, and reporting integrations using standard HTTP GET queries.
              </p>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white text-xs shadow-xs">
              <table className="w-full text-left font-mono">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-700">
                  <tr>
                    <th className="w-32 p-2.5">Domain Category</th>
                    <th className="w-20 p-2.5">Method</th>
                    <th className="w-52 p-2.5">Endpoint Path</th>
                    <th className="p-2.5">Description & Purpose</th>
                    <th className="w-44 p-2.5">Required Permission</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {AVAILABLE_ENDPOINTS_FOR_DEVS.map((ep) => (
                    <tr key={ep.path + ep.method} className="hover:bg-slate-50">
                      <td className="p-2.5 font-semibold text-slate-600">{ep.category}</td>
                      <td className="p-2.5">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            ep.method === 'GET'
                              ? 'border border-blue-200 bg-blue-50 text-[#0056FF]'
                              : 'border border-emerald-200 bg-emerald-50 text-emerald-800'
                          }`}
                        >
                          {ep.method}
                        </span>
                      </td>
                      <td className="p-2.5 font-bold text-slate-900">{ep.path}</td>
                      <td className="p-2.5 font-sans text-xs text-slate-600">{ep.description}</td>
                      <td className="p-2.5 font-mono text-[11px] font-medium text-amber-700">
                        {ep.requiredPermission}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section: What Endpoints Must Be Protected & How */}
          <section
            id="protected-endpoints"
            className="scroll-mt-24 space-y-4 border-t border-slate-200 pt-8"
          >
            <div>
              <h2 className="text-base font-bold tracking-tight text-slate-950">
                What Endpoints Must Be Protected & How
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                High-impact write and mutation operations are enforced with multi-layer defense
                mechanisms to prevent financial tampering, unauthorized grade alterations, and
                privilege escalations.
              </p>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white text-xs shadow-xs">
              <table className="w-full text-left font-mono">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-700">
                  <tr>
                    <th className="w-36 p-2.5">Domain</th>
                    <th className="w-48 p-2.5">Endpoint</th>
                    <th className="p-2.5">Why It Must Be Protected</th>
                    <th className="w-60 p-2.5">Defense Guardrails Implemented</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans text-slate-700">
                  {PROTECTED_MUTATION_ENDPOINTS.map((item) => (
                    <tr key={item.path + item.method} className="hover:bg-slate-50">
                      <td className="p-2.5 font-mono font-bold text-slate-900">{item.domain}</td>
                      <td className="p-2.5 font-mono text-xs">
                        <span className="mr-1.5 font-bold text-amber-700">{item.method}</span>
                        <span className="font-semibold text-slate-800">{item.path}</span>
                      </td>
                      <td className="p-2.5 text-xs text-slate-600">{item.whyProtected}</td>
                      <td className="p-2.5 font-mono text-xs text-[11px] text-emerald-800">
                        {item.defenseMechanisms}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Interactive API Explorer Section */}
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

            {/* Status Codes Table */}
            <div id="status-codes" className="scroll-mt-24 space-y-3">
              <h3 className="font-mono text-xs font-bold text-slate-800">
                HTTP Status Codes Standard
              </h3>
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-white text-xs shadow-xs">
                <table className="w-full text-left font-mono">
                  <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-700">
                    <tr>
                      <th className="w-24 p-2.5">HTTP Code</th>
                      <th className="w-32 p-2.5">Status</th>
                      <th className="p-2.5">Meaning & Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="p-2.5 font-bold text-emerald-700">200</td>
                      <td className="p-2.5">OK</td>
                      <td className="p-2.5 font-sans text-slate-600">
                        The request succeeded and returned the requested payload.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-emerald-700">201</td>
                      <td className="p-2.5">Created</td>
                      <td className="p-2.5 font-sans text-slate-600">
                        New entity created successfully.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-amber-700">400</td>
                      <td className="p-2.5">Bad Request</td>
                      <td className="p-2.5 font-sans text-slate-600">
                        Payload validation failed against Zod schema.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-amber-700">401</td>
                      <td className="p-2.5">Unauthorized</td>
                      <td className="p-2.5 font-sans text-slate-600">
                        Missing, expired, or invalid JWT Bearer token.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-rose-700">403</td>
                      <td className="p-2.5">Forbidden</td>
                      <td className="p-2.5 font-sans text-slate-600">
                        User lacks the required RBAC permission or branch scope.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-rose-700">404</td>
                      <td className="p-2.5">Not Found</td>
                      <td className="p-2.5 font-sans text-slate-600">
                        Requested route or resource identifier does not exist.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-amber-700">429</td>
                      <td className="p-2.5">Too Many Requests</td>
                      <td className="p-2.5 font-sans text-slate-600">
                        Rate limit exceeded (standard draft-8 headers provided).
                      </td>
                    </tr>
                  </tbody>
                </table>
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
                                : 'border border-emerald-600/30 bg-emerald-600 text-white shadow-xs',
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
                        Permission: <strong className="text-amber-700">{item.permission}</strong>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-700">
                        Scope Header:{' '}
                        <strong className={item.scopeHeader ? 'text-[#0056FF]' : 'text-slate-400'}>
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
                                ? 'font-bold text-emerald-700'
                                : 'font-bold text-amber-700'
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

                    {/* Code Snippet Card - 100% Light Mode */}
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
                              <Check className="size-3 text-emerald-600" />
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
        </main>
      </div>

      {/* Footer - Light Theme */}
      <footer className="border-t border-slate-200 bg-white py-6 font-mono text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <span>Open API Technical Document</span>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="font-sans hover:text-slate-900">
              Administrative Console
            </Link>
            <a
              href="https://snp.edu.kh"
              target="_blank"
              rel="noreferrer"
              className="font-sans hover:text-slate-900"
            >
              snp.edu.kh
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
