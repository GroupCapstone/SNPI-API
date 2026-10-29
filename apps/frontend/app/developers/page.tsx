'use client';

import * as React from 'react';
import Link from 'next/link';

import { Check, Copy, ExternalLink, Server, Shield } from '@/components/icons';
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

const API_DOC_ITEMS: ApiDocItem[] = [
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
    id: 'auth-me',
    method: 'GET',
    path: '/api/v1/auth/me',
    title: '2. Authenticated Profile & Scopes',
    summary: 'Retrieve authenticated user identity, assigned roles, permissions set, and authorized branch IDs.',
    permission: 'Authenticated Session',
    scopeHeader: false,
    responseBody: {
      success: true,
      message: 'Current user profile retrieved',
      data: {
        id: '6720d1a...',
        username: 'admin_local',
        roles: ['super_admin'],
        permissions: ['*'],
        branchAccess: 'all',
      },
    },
  },
  {
    id: 'students-list',
    method: 'GET',
    path: '/api/v1/students',
    title: '3. Students Directory Query',
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
    id: 'student-create',
    method: 'POST',
    path: '/api/v1/students',
    title: '4. Register New Student Record',
    summary: 'Create a student admission profile with demographic details, birth date, and primary guardian data.',
    permission: 'student.create.own_branch',
    scopeHeader: true,
    requestBody: {
      firstNameEn: 'Dara',
      lastNameEn: 'Sok',
      firstNameKh: 'ដារ៉ា',
      lastNameKh: 'សុខ',
      gender: 'male',
      dob: '2012-05-15',
      status: 'active',
    },
    responseBody: {
      success: true,
      message: 'Student registered successfully',
      data: {
        id: '6720d9...',
        studentCode: 'STU-2026-0001',
        fullName: 'Sok Dara',
        status: 'active',
      },
    },
  },
  {
    id: 'enrollments-list',
    method: 'GET',
    path: '/api/v1/enrollments',
    title: '5. Student Class Enrollments',
    summary: 'Retrieve active student enrollments mapped to classes, academic years, and study periods.',
    permission: 'enrollment.view.own_branch',
    scopeHeader: true,
    responseBody: {
      success: true,
      message: 'Enrollments retrieved successfully',
      data: [],
      meta: { page: 1, limit: 20, total: 0 },
    },
  },
  {
    id: 'attendance-list',
    method: 'GET',
    path: '/api/v1/attendance',
    title: '6. Daily Attendance Records',
    summary: 'Query student roll-call records by classId, specific calendar date, and attendance status.',
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
    id: 'payments-list',
    method: 'GET',
    path: '/api/v1/payments',
    title: '7. Tuition Payments & Receipts',
    summary: 'Retrieve tuition fee payment transactions, invoice receipt numbers, and payment method details.',
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
    id: 'permissions-list',
    method: 'GET',
    path: '/api/v1/permissions',
    title: '8. Canonical Permissions Registry',
    summary: 'List the complete canonical system permissions matrix (356 permissions across 47 domains).',
    permission: 'permission.view.all_branches',
    scopeHeader: false,
    responseBody: {
      success: true,
      message: 'Permissions retrieved successfully',
      data: [
        { code: 'school.view.all_branches', category: 'school', action: 'view' },
        { code: 'student.create.own_branch', category: 'student', action: 'create' },
      ],
      meta: { total: 356 },
    },
  },
  {
    id: 'health-probes',
    method: 'GET',
    path: '/api/v1/health',
    title: '9. Health Checks & Probes',
    summary: 'Inspect API service vitality and live MongoDB replica set connectivity.',
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

export default function DevelopersPage() {
  const [activeEndpointId, setActiveEndpointId] = React.useState<string>('auth-login');
  const [codeType, setCodeType] = React.useState<'curl' | 'ts' | 'json'>('curl');
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  // Live tester states
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
    <div className="min-h-screen bg-[#090d16] text-[#e2e8f0] font-sans antialiased selection:bg-blue-600/30 selection:text-blue-200 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <BrandMark size={28} />
            <div className="flex items-center gap-2 font-mono">
              <span className="text-sm font-bold tracking-tight text-white">SNP-SMS Open API</span>
              <span className="text-xs text-slate-500">|</span>
              <span className="text-xs text-slate-400 font-medium">Docs</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-800/50">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              v0.1.0 · 100% Online
            </span>
            <Link href="/dashboard">
              <Button
                size="sm"
                className="text-xs h-7 px-3 bg-white text-slate-950 hover:bg-slate-200 font-medium"
              >
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Grid: On This Page Sidebar + Body Content */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 px-4 sm:px-6 py-8 gap-8">
        {/* Left Column: On This Page Table of Contents */}
        <aside className="w-56 shrink-0 hidden md:block">
          <div className="sticky top-20 space-y-4 font-mono text-xs text-slate-400">
            <p className="text-[11px] font-bold tracking-wider uppercase text-slate-500">
              ON THIS PAGE
            </p>

            <nav className="space-y-1 text-slate-400">
              <a href="#changelogs" className="block py-1 hover:text-white transition-colors">
                Change Logs
              </a>
              <a href="#introduction" className="block py-1 hover:text-white transition-colors">
                Introduction
              </a>
              <div className="pl-2 space-y-0.5 text-slate-500">
                <a href="#purpose" className="block py-0.5 hover:text-slate-300">
                  1. Purpose
                </a>
                <a href="#scope" className="block py-0.5 hover:text-slate-300">
                  2. Scope
                </a>
                <a href="#overall-api" className="block py-0.5 hover:text-slate-300">
                  3. Overall API
                </a>
              </div>

              <div className="pt-2">
                <a href="#api-doc" className="block py-1 font-semibold text-slate-300 hover:text-white">
                  API Documentation
                </a>
                <div className="pl-2 space-y-0.5 text-slate-500">
                  <a href="#status-codes" className="block py-0.5 hover:text-slate-300">
                    Status Codes
                  </a>
                  {API_DOC_ITEMS.map((item, idx) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={() => setActiveEndpointId(item.id)}
                      className={`block py-0.5 truncate transition-colors ${
                        activeEndpointId === item.id ? 'text-blue-400 font-bold' : 'hover:text-slate-300'
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
          <section id="changelogs" className="space-y-3 scroll-mt-20">
            <h2 className="text-sm font-bold tracking-tight text-white font-mono">Change Logs</h2>
            <div className="rounded-lg border border-slate-800 bg-[#0e1422] overflow-hidden text-xs">
              <table className="w-full text-left font-mono">
                <thead className="bg-[#141b2d] border-b border-slate-800 text-slate-400 text-[11px]">
                  <tr>
                    <th className="p-2.5 w-24">Version</th>
                    <th className="p-2.5 w-28">Date</th>
                    <th className="p-2.5">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {CHANGE_LOGS.map((log) => (
                    <tr key={log.version} className="hover:bg-slate-800/30">
                      <td className="p-2.5 text-blue-400 font-semibold">{log.version}</td>
                      <td className="p-2.5 text-slate-400">{log.date}</td>
                      <td className="p-2.5 text-slate-300 leading-relaxed font-sans">{log.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Introduction Section */}
          <section id="introduction" className="space-y-6 scroll-mt-20 border-t border-slate-800/80 pt-8">
            <h2 className="text-base font-bold tracking-tight text-white">Introduction</h2>

            {/* 1. Purpose */}
            <div id="purpose" className="space-y-2 scroll-mt-20">
              <h3 className="text-xs font-bold font-mono text-slate-300">1. Purpose</h3>
              <p className="text-xs leading-relaxed text-slate-400 font-sans">
                This document describes the technical REST API specification of the SNP Integrated
                Multi-Branch School Management System (SNP-SMS). The expected readers are internal
                engineering teams, mobile application developers, and authorized third-party integrators
                connecting administrative, academic, and financial client applications.
              </p>
            </div>

            {/* 2. Scope */}
            <div id="scope" className="space-y-2 scroll-mt-20">
              <h3 className="text-xs font-bold font-mono text-slate-300">2. Scope</h3>
              <p className="text-xs leading-relaxed text-slate-400 font-sans">
                This specification covers the core REST endpoints across all 47 domain modules,
                including authentication tokens, multi-branch data isolation via standard headers,
                payload validation schemas, RBAC permission codes, and live request/response formats.
              </p>
            </div>

            {/* 3. Overall API */}
            <div id="overall-api" className="space-y-3 scroll-mt-20">
              <h3 className="text-xs font-bold font-mono text-slate-300">3. Overall API</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="rounded-lg border border-slate-800 bg-[#0e1422] p-3 space-y-1">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider">Base URL</span>
                  <p className="text-blue-400 font-bold truncate">http://localhost:4000/api/v1</p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-[#0e1422] p-3 space-y-1">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider">Data Format</span>
                  <p className="text-slate-300 font-bold">JSON (application/json)</p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-[#0e1422] p-3 space-y-1">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider">Authorization</span>
                  <p className="text-amber-400 font-bold">Bearer &lt;access_token&gt;</p>
                </div>
                <div className="rounded-lg border border-slate-800 bg-[#0e1422] p-3 space-y-1">
                  <span className="text-[11px] text-slate-500 uppercase tracking-wider">Campus Isolation</span>
                  <p className="text-emerald-400 font-bold">X-Branch-Id: &lt;branch_id&gt;</p>
                </div>
              </div>
            </div>
          </section>

          {/* API Documentation Section */}
          <section id="api-doc" className="space-y-8 scroll-mt-20 border-t border-slate-800/80 pt-8">
            <h2 className="text-base font-bold tracking-tight text-white">API Documentation</h2>

            {/* Status Codes Table */}
            <div id="status-codes" className="space-y-3 scroll-mt-20">
              <h3 className="text-xs font-bold font-mono text-slate-300">Status Code</h3>
              <div className="rounded-lg border border-slate-800 bg-[#0e1422] overflow-hidden text-xs">
                <table className="w-full text-left font-mono">
                  <thead className="bg-[#141b2d] border-b border-slate-800 text-slate-400 text-[11px]">
                    <tr>
                      <th className="p-2.5 w-24">HTTP Code</th>
                      <th className="p-2.5 w-32">Status</th>
                      <th className="p-2.5">Meaning & Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="p-2.5 text-emerald-400 font-bold">200</td>
                      <td className="p-2.5">OK</td>
                      <td className="p-2.5 text-slate-400 font-sans">The request succeeded and returned the requested payload.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-emerald-400 font-bold">201</td>
                      <td className="p-2.5">Created</td>
                      <td className="p-2.5 text-slate-400 font-sans">New entity created successfully.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-amber-400 font-bold">400</td>
                      <td className="p-2.5">Bad Request</td>
                      <td className="p-2.5 text-slate-400 font-sans">Payload validation failed against Zod schema.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-amber-400 font-bold">401</td>
                      <td className="p-2.5">Unauthorized</td>
                      <td className="p-2.5 text-slate-400 font-sans">Missing, expired, or invalid JWT Bearer token.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-rose-400 font-bold">403</td>
                      <td className="p-2.5">Forbidden</td>
                      <td className="p-2.5 text-slate-400 font-sans">User lacks the required RBAC permission or branch scope.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-rose-400 font-bold">404</td>
                      <td className="p-2.5">Not Found</td>
                      <td className="p-2.5 text-slate-400 font-sans">Requested route or resource identifier does not exist.</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 text-amber-400 font-bold">429</td>
                      <td className="p-2.5">Too Many Requests</td>
                      <td className="p-2.5 text-slate-400 font-sans">Rate limit exceeded (standard draft-8 headers provided).</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Individual Endpoints Specifications */}
            <div className="space-y-8 pt-4">
              {API_DOC_ITEMS.map((item) => {
                const liveRes = testResults[item.id];
                const isTestingThis = testingEndpointId === item.id;
                return (
                  <div
                    key={item.id}
                    id={item.id}
                    className="rounded-xl border border-slate-800 bg-[#0e1422] p-5 space-y-4 scroll-mt-20"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono text-[10px] font-extrabold px-2 py-0.5 rounded ${
                              item.method === 'GET'
                                ? 'bg-blue-950 text-blue-400 border border-blue-800/60'
                                : 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                            }`}
                          >
                            {item.method}
                          </span>
                          <span className="font-mono text-xs font-bold text-white">{item.path}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-200">{item.title}</p>
                        <p className="text-xs text-slate-400 font-sans">{item.summary}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTest(item)}
                          disabled={isTestingThis}
                          className="text-xs h-7 border-slate-700 bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700"
                        >
                          <Server className="size-3 mr-1 text-blue-400" />
                          {isTestingThis ? 'Testing...' : 'Test Live'}
                        </Button>
                      </div>
                    </div>

                    {/* Metadata Badges */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                      <div className="px-2 py-1 rounded bg-[#141b2d] border border-slate-800 text-slate-300">
                        Permission: <strong className="text-amber-400">{item.permission}</strong>
                      </div>
                      <div className="px-2 py-1 rounded bg-[#141b2d] border border-slate-800 text-slate-300">
                        Scope Header:{' '}
                        <strong className={item.scopeHeader ? 'text-blue-400' : 'text-slate-500'}>
                          {item.scopeHeader ? 'X-Branch-Id Required' : 'None'}
                        </strong>
                      </div>
                    </div>

                    {/* Live Test Output Display */}
                    {liveRes && (
                      <div className="rounded-lg border border-slate-700 bg-[#090d16] p-3 text-xs font-mono space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span
                            className={
                              liveRes.status === 200 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'
                            }
                          >
                            Live Response: HTTP {liveRes.status}
                          </span>
                          <span className="text-slate-500">{liveRes.latency}ms</span>
                        </div>
                        <pre className="max-h-32 overflow-y-auto text-[11px] text-slate-300 bg-black/40 p-2 rounded">
                          {JSON.stringify(liveRes.body, null, 2)}
                        </pre>
                      </div>
                    )}

                    {/* Code Snippet Card */}
                    <div className="rounded-lg border border-slate-800 bg-[#070b13] overflow-hidden">
                      <div className="flex items-center justify-between px-3 py-1.5 bg-[#121929] border-b border-slate-800/80 text-xs font-mono">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setCodeType('curl')}
                            className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                              codeType === 'curl' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            cURL
                          </button>
                          <button
                            type="button"
                            onClick={() => setCodeType('ts')}
                            className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                              codeType === 'ts' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            TypeScript
                          </button>
                          <button
                            type="button"
                            onClick={() => setCodeType('json')}
                            className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                              codeType === 'json' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            Response
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCopy(generateSnippet(item, codeType), item.id)}
                          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700"
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

                      <pre className="p-3 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed max-h-64">
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

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#070b13] py-6 text-xs font-mono text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>SNP International School · Open API Technical Specification</span>
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-slate-300">
              Administrative Console
            </Link>
            <a
              href="https://snp.edu.kh"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300"
            >
              snp.edu.kh
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
