'use client';

import * as React from 'react';
import Link from 'next/link';

import { Check, Copy, ExternalLink, Lock, Server, Shield } from '@/components/icons';
import { BrandMark } from '@/components/shared/brand-mark';
import { Button } from '@/components/ui/button';

interface ChangeLogEntry {
  version: string;
  date: string;
  description: string;
}

const CHANGE_LOGS: ChangeLogEntry[] = [
  {
    version: '0.1.0',
    date: '29.10.2026',
    description:
      'Initial release of SNP-SMS 7-layer modular monolith API. 193 endpoints across 47 domain modules, MongoDB rs0 ACID transactions, and @snp/shared contracts.',
  },
  {
    version: '0.0.9',
    date: '15.10.2026',
    description:
      'Standardized multi-tenant scoping via X-Branch-Id header and implemented granular 356 RBAC permissions.',
  },
  {
    version: '0.0.8',
    date: '01.10.2026',
    description:
      'Added tuition fee billing, payment plan installment schedules, and cashier shift reconciliation.',
  },
];

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
    allowedEndpoints: 'GET /api/v1/health, /health/liveness, /health/readiness, /verify/certificates/:code',
    securityMethod: 'IP Rate Limiting (2000 req / 15m), Read-only public projection',
  },
  {
    role: 'External Partner / Dev Service Account',
    targetAudience: 'Third-party LMS, biometric attendance devices, mobile apps',
    accessScope: 'Specific branch scoped via X-Branch-Id',
    allowedEndpoints: 'GET /students, GET /classes, GET /attendance, POST /attendance, GET /academic-years',
    securityMethod: 'Dedicated service account credentials, short-lived JWT, least-privilege permissions',
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
    allowedEndpoints: 'Full CRUD across campus students, employees, classes, reports, and attendance',
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
    defenseMechanisms: 'ACID transaction (runInTransaction), cashier shift lock, payment.create.own_branch',
  },
  {
    domain: 'Student Enrollment Status',
    method: 'PATCH',
    path: '/api/v1/students/:id',
    purpose: 'Modify student active, suspended, or transferred status',
    whyProtected: 'Protects academic history and prevents unauthorized student deactivations',
    defenseMechanisms: 'Audit log event capture, student.edit.own_branch, historical correction record',
  },
  {
    domain: 'Grading & Scores',
    method: 'POST',
    path: '/api/v1/scores',
    purpose: 'Submit student examination scores',
    whyProtected: 'Prevents unauthorized grade alteration and ensures academic integrity',
    defenseMechanisms: 'Teacher assignment verification, score.create.own_branch, mutation rate limiting',
  },
  {
    domain: 'Users & Roles',
    method: 'POST',
    path: '/api/v1/users',
    purpose: 'Create user accounts and assign RBAC roles',
    whyProtected: 'Prevents privilege escalation and unauthorized administrator provisioning',
    defenseMechanisms: 'user.create.all_branches, Argon2/bcrypt password hashing, super_admin boundary',
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
    summary: 'Authenticate credentials and obtain a short-lived (15m) JWT access token and HttpOnly refresh cookie.',
    permission: 'Public',
    scopeHeader: false,
    requestBody: {
      identifier: 'admin@snp.edu.kh',
      password: 'YourSecurePassword123',
    },
    responseBody: {
      success: true,
      message: 'Login successful',
      data: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '6720d1a...',
          username: 'admin_local',
          email: 'admin@snp.edu.kh',
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
    summary: 'Query paginated student records with search filtering, grade level, and enrollment status.',
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
    summary: 'Query campus classes, classroom room codes, grade levels, and maximum seating capacity.',
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
    summary: 'Retrieve student attendance status (Present, Absent, Late, Excused) by class and date.',
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
    summary: 'Query tuition transaction history, receipt numbers, and payment reconciliation statuses.',
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
        service: 'SNP-SMS API',
        status: 'healthy',
        database: 'connected',
        version: '0.1.0',
        timestamp: '2026-10-29T12:00:00.000Z',
      },
    },
  },
];

export default function DocumentPage() {
  const [activeEndpointId, setActiveEndpointId] = React.useState<string>('auth-login');
  const [codeType, setCodeType] = React.useState<'curl' | 'ts' | 'json'>('curl');
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

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
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900 flex flex-col">
      {/* Top Navigation Bar - Light Theme */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <BrandMark size={32} />
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-slate-950 font-mono">
                SNP-SMS Open API
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-[#023e8a] border border-blue-200">
                Document
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="size-2 rounded-full bg-emerald-500" />
              v0.1.0 · 193 Endpoints · 100% Online
            </span>
            <Link href="/dashboard">
              <Button
                size="sm"
                className="text-xs h-8 px-3.5 bg-[#023e8a] text-white hover:bg-[#00509d] font-medium"
              >
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Grid: On This Page Sidebar + Body Content */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 px-4 sm:px-6 py-8 gap-8">
        {/* Left Column: On This Page Table of Contents */}
        <aside className="w-60 shrink-0 hidden md:block">
          <div className="sticky top-24 space-y-4 font-mono text-xs text-slate-600">
            <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400">
              ON THIS PAGE
            </p>

            <nav className="space-y-1 text-slate-600">
              <a href="#changelogs" className="block py-1 hover:text-[#023e8a] transition-colors">
                Change Logs
              </a>
              <a href="#introduction" className="block py-1 hover:text-[#023e8a] transition-colors">
                Introduction
              </a>
              <div className="pl-2 space-y-0.5 text-slate-500">
                <a href="#purpose" className="block py-0.5 hover:text-slate-900">
                  1. Purpose
                </a>
                <a href="#scope" className="block py-0.5 hover:text-slate-900">
                  2. Scope
                </a>
                <a href="#overall-api" className="block py-0.5 hover:text-slate-900">
                  3. Overall API
                </a>
              </div>

              <a
                href="#who-can-access"
                className="block py-1 hover:text-[#023e8a] transition-colors font-semibold text-slate-800"
              >
                Who Can Access The API
              </a>

              <a
                href="#endpoints-available"
                className="block py-1 hover:text-[#023e8a] transition-colors font-semibold text-slate-800"
              >
                What Other Devs Can Get
              </a>

              <a
                href="#protected-endpoints"
                className="block py-1 hover:text-[#023e8a] transition-colors font-semibold text-slate-800"
              >
                What Endpoints Are Protected
              </a>

              <div className="pt-2">
                <a href="#api-doc" className="block py-1 font-semibold text-slate-800 hover:text-[#023e8a]">
                  Interactive API Explorer
                </a>
                <div className="pl-2 space-y-0.5 text-slate-500">
                  <a href="#status-codes" className="block py-0.5 hover:text-slate-900">
                    Status Codes
                  </a>
                  {INTERACTIVE_ITEMS.map((item, idx) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={() => setActiveEndpointId(item.id)}
                      className={`block py-0.5 truncate transition-colors ${
                        activeEndpointId === item.id
                          ? 'text-[#023e8a] font-bold'
                          : 'hover:text-slate-900'
                      }`}
                    >
                      {idx + 1}. {item.title.split('. ')[1] || item.title}
                    </a>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </aside>

        {/* Right / Main Content Area */}
        <main className="flex-1 min-w-0 space-y-12 pb-16">
          {/* Change Logs Section */}
          <section id="changelogs" className="space-y-3 scroll-mt-24">
            <h2 className="text-sm font-bold tracking-tight text-slate-950 font-mono">Change Logs</h2>
            <div className="rounded-lg border border-slate-200 bg-white overflow-hidden text-xs shadow-xs">
              <table className="w-full text-left font-mono">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 text-[11px] font-bold">
                  <tr>
                    <th className="p-2.5 w-24">Version</th>
                    <th className="p-2.5 w-28">Date</th>
                    <th className="p-2.5">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {CHANGE_LOGS.map((log) => (
                    <tr key={log.version} className="hover:bg-slate-50">
                      <td className="p-2.5 text-[#023e8a] font-bold">{log.version}</td>
                      <td className="p-2.5 text-slate-500">{log.date}</td>
                      <td className="p-2.5 text-slate-700 leading-relaxed font-sans">{log.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Introduction Section */}
          <section id="introduction" className="space-y-6 scroll-mt-24 border-t border-slate-200 pt-8">
            <h2 className="text-base font-bold tracking-tight text-slate-950">Introduction</h2>

            {/* 1. Purpose */}
            <div id="purpose" className="space-y-2 scroll-mt-24">
              <h3 className="text-xs font-bold font-mono text-slate-800">1. Purpose</h3>
              <p className="text-xs leading-relaxed text-slate-600 font-sans">
                This document describes the technical REST API specification of the SNP Integrated
                Multi-Branch School Management System (SNP-SMS). The primary audience is third-party
                integrators, mobile developers, campus IT staff, and administrative client systems.
              </p>
            </div>

            {/* 2. Scope */}
            <div id="scope" className="space-y-2 scroll-mt-24">
              <h3 className="text-xs font-bold font-mono text-slate-800">2. Scope</h3>
              <p className="text-xs leading-relaxed text-slate-600 font-sans">
                Defines all accessible API surfaces, multi-branch scoping headers (X-Branch-Id), who can
                access each resource, authentication and token refresh lifecycles, and defense mechanisms
                safeguarding sensitive financial and academic mutations.
              </p>
            </div>

            {/* 3. Overall API */}
            <div id="overall-api" className="space-y-3 scroll-mt-24">
              <h3 className="text-xs font-bold font-mono text-slate-800">3. Overall API</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="rounded-lg border border-slate-200 bg-white p-3 space-y-1 shadow-xs">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                    Base URL
                  </span>
                  <p className="text-[#023e8a] font-bold truncate">http://localhost:4000/api/v1</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3 space-y-1 shadow-xs">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                    Payload Format
                  </span>
                  <p className="text-slate-800 font-bold">JSON (application/json)</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3 space-y-1 shadow-xs">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                    Authorization
                  </span>
                  <p className="text-amber-700 font-bold">Bearer &lt;access_token&gt;</p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white p-3 space-y-1 shadow-xs">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                    Campus Isolation
                  </span>
                  <p className="text-emerald-700 font-bold">X-Branch-Id: &lt;branch_id&gt;</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Who Can Access The API */}
          <section id="who-can-access" className="space-y-4 scroll-mt-24 border-t border-slate-200 pt-8">
            <div>
              <h2 className="text-base font-bold tracking-tight text-slate-950">Who Can Access The API</h2>
              <p className="text-xs text-slate-500 mt-1">
                Access is strictly governed by Role-Based Access Control (RBAC) and campus branch boundaries.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white overflow-hidden text-xs shadow-xs">
              <table className="w-full text-left font-mono">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 text-[11px] font-bold">
                  <tr>
                    <th className="p-2.5 w-36">Client Type / Role</th>
                    <th className="p-2.5 w-40">Target Audience</th>
                    <th className="p-2.5">Access Scope & Endpoints</th>
                    <th className="p-2.5 w-52">Security & Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
                  {ACCESS_ROLES.map((role) => (
                    <tr key={role.role} className="hover:bg-slate-50">
                      <td className="p-2.5 font-mono font-bold text-[#023e8a]">{role.role}</td>
                      <td className="p-2.5 text-slate-500 text-xs">{role.targetAudience}</td>
                      <td className="p-2.5 text-xs">
                        <p className="text-slate-900 font-semibold">{role.accessScope}</p>
                        <p className="font-mono text-[11px] text-slate-600 mt-0.5">{role.allowedEndpoints}</p>
                      </td>
                      <td className="p-2.5 text-xs text-slate-600">{role.securityMethod}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section: What Other Devs Can Get */}
          <section id="endpoints-available" className="space-y-4 scroll-mt-24 border-t border-slate-200 pt-8">
            <div>
              <h2 className="text-base font-bold tracking-tight text-slate-950">
                What Other Developers Can Get (Read & Integration Surface)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                These standardized endpoints can be consumed by external client applications, mobile apps,
                and reporting integrations using standard HTTP GET queries.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white overflow-hidden text-xs shadow-xs">
              <table className="w-full text-left font-mono">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 text-[11px] font-bold">
                  <tr>
                    <th className="p-2.5 w-32">Domain Category</th>
                    <th className="p-2.5 w-20">Method</th>
                    <th className="p-2.5 w-52">Endpoint Path</th>
                    <th className="p-2.5">Description & Purpose</th>
                    <th className="p-2.5 w-44">Required Permission</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {AVAILABLE_ENDPOINTS_FOR_DEVS.map((ep) => (
                    <tr key={ep.path + ep.method} className="hover:bg-slate-50">
                      <td className="p-2.5 text-slate-600 font-semibold">{ep.category}</td>
                      <td className="p-2.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            ep.method === 'GET'
                              ? 'bg-blue-50 text-[#023e8a] border border-blue-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {ep.method}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-900 font-bold">{ep.path}</td>
                      <td className="p-2.5 text-slate-600 font-sans text-xs">{ep.description}</td>
                      <td className="p-2.5 text-amber-700 text-[11px] font-mono font-medium">
                        {ep.requiredPermission}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section: What Endpoints Must Be Protected & How */}
          <section id="protected-endpoints" className="space-y-4 scroll-mt-24 border-t border-slate-200 pt-8">
            <div>
              <h2 className="text-base font-bold tracking-tight text-slate-950">
                What Endpoints Must Be Protected & How
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                High-impact write and mutation operations are enforced with multi-layer defense mechanisms
                to prevent financial tampering, unauthorized grade alterations, and privilege escalations.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white overflow-hidden text-xs shadow-xs">
              <table className="w-full text-left font-mono">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 text-[11px] font-bold">
                  <tr>
                    <th className="p-2.5 w-36">Domain</th>
                    <th className="p-2.5 w-48">Endpoint</th>
                    <th className="p-2.5">Why It Must Be Protected</th>
                    <th className="p-2.5 w-60">Defense Guardrails Implemented</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
                  {PROTECTED_MUTATION_ENDPOINTS.map((item) => (
                    <tr key={item.path + item.method} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900 font-mono">{item.domain}</td>
                      <td className="p-2.5 font-mono text-xs">
                        <span className="text-amber-700 font-bold mr-1.5">{item.method}</span>
                        <span className="text-slate-800 font-semibold">{item.path}</span>
                      </td>
                      <td className="p-2.5 text-xs text-slate-600">{item.whyProtected}</td>
                      <td className="p-2.5 text-xs text-emerald-800 font-mono text-[11px]">
                        {item.defenseMechanisms}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Interactive API Explorer Section */}
          <section id="api-doc" className="space-y-8 scroll-mt-24 border-t border-slate-200 pt-8">
            <div>
              <h2 className="text-base font-bold tracking-tight text-slate-950">
                Interactive API Explorer
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Select any endpoint below to inspect request/response schemas, copy terminal cURL commands,
                or send live test requests directly to the running backend.
              </p>
            </div>

            {/* Status Codes Table */}
            <div id="status-codes" className="space-y-3 scroll-mt-24">
              <h3 className="text-xs font-bold font-mono text-slate-800">HTTP Status Codes Standard</h3>
              <div className="rounded-lg border border-slate-200 bg-white overflow-hidden text-xs shadow-xs">
                <table className="w-full text-left font-mono">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 text-[11px] font-bold">
                    <tr>
                      <th className="p-2.5 w-24">HTTP Code</th>
                      <th className="p-2.5 w-32">Status</th>
                      <th className="p-2.5">Meaning & Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="p-2.5 text-emerald-700 font-bold">200</td>
                      <td className="p-2.5">OK</td>
                      <td className="p-2.5 text-slate-600 font-sans">
                        The request succeeded and returned the requested payload.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-emerald-700 font-bold">201</td>
                      <td className="p-2.5">Created</td>
                      <td className="p-2.5 text-slate-600 font-sans">New entity created successfully.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-amber-700 font-bold">400</td>
                      <td className="p-2.5">Bad Request</td>
                      <td className="p-2.5 text-slate-600 font-sans">
                        Payload validation failed against Zod schema.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-amber-700 font-bold">401</td>
                      <td className="p-2.5">Unauthorized</td>
                      <td className="p-2.5 text-slate-600 font-sans">
                        Missing, expired, or invalid JWT Bearer token.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-rose-700 font-bold">403</td>
                      <td className="p-2.5">Forbidden</td>
                      <td className="p-2.5 text-slate-600 font-sans">
                        User lacks the required RBAC permission or branch scope.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-rose-700 font-bold">404</td>
                      <td className="p-2.5">Not Found</td>
                      <td className="p-2.5 text-slate-600 font-sans">
                        Requested route or resource identifier does not exist.
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-amber-700 font-bold">429</td>
                      <td className="p-2.5">Too Many Requests</td>
                      <td className="p-2.5 text-slate-600 font-sans">
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
                    className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 scroll-mt-24 shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono text-[10px] font-extrabold px-2 py-0.5 rounded ${
                              item.method === 'GET'
                                ? 'bg-blue-50 text-[#023e8a] border border-blue-200'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {item.method}
                          </span>
                          <span className="font-mono text-xs font-bold text-slate-900">{item.path}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-800">{item.title}</p>
                        <p className="text-xs text-slate-600 font-sans">{item.summary}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTest(item)}
                          disabled={isTestingThis}
                          className="text-xs h-8 border-slate-300 text-slate-700 hover:text-[#023e8a] hover:border-[#023e8a]"
                        >
                          <Server className="size-3.5 mr-1 text-[#023e8a]" />
                          {isTestingThis ? 'Testing...' : 'Test Live'}
                        </Button>
                      </div>
                    </div>

                    {/* Metadata Badges */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                      <div className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-slate-700">
                        Permission: <strong className="text-amber-700">{item.permission}</strong>
                      </div>
                      <div className="px-2.5 py-1 rounded bg-slate-50 border border-slate-200 text-slate-700">
                        Scope Header:{' '}
                        <strong className={item.scopeHeader ? 'text-[#023e8a]' : 'text-slate-400'}>
                          {item.scopeHeader ? 'X-Branch-Id Required' : 'None'}
                        </strong>
                      </div>
                    </div>

                    {/* Live Test Output Display */}
                    {liveRes && (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs font-mono space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span
                            className={
                              liveRes.status === 200
                                ? 'text-emerald-700 font-bold'
                                : 'text-amber-700 font-bold'
                            }
                          >
                            Live Response: HTTP {liveRes.status}
                          </span>
                          <span className="text-slate-500">{liveRes.latency}ms</span>
                        </div>
                        <pre className="max-h-32 overflow-y-auto text-[11px] text-slate-800 bg-white p-2 rounded border border-slate-200">
                          {JSON.stringify(liveRes.body, null, 2)}
                        </pre>
                      </div>
                    )}

                    {/* Code Snippet Card */}
                    <div className="rounded-lg border border-slate-900 bg-slate-950 overflow-hidden shadow-xs">
                      <div className="flex items-center justify-between px-3.5 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setCodeType('curl')}
                            className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                              codeType === 'curl'
                                ? 'bg-slate-800 text-white font-bold'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            cURL
                          </button>
                          <button
                            type="button"
                            onClick={() => setCodeType('ts')}
                            className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                              codeType === 'ts'
                                ? 'bg-slate-800 text-white font-bold'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            TypeScript
                          </button>
                          <button
                            type="button"
                            onClick={() => setCodeType('json')}
                            className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                              codeType === 'json'
                                ? 'bg-slate-800 text-white font-bold'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Response
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopy(generateSnippet(item, codeType), item.id)}
                          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800 border border-slate-700"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="size-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="size-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <pre className="p-3.5 overflow-x-auto text-xs font-mono text-slate-100 leading-relaxed max-h-64">
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
      <footer className="border-t border-slate-200 bg-white py-6 text-xs font-mono text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>SNP International School · Open API Technical Document</span>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-slate-900 font-sans">
              Administrative Console
            </Link>
            <a
              href="https://snp.edu.kh"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-900 font-sans"
            >
              snp.edu.kh
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
