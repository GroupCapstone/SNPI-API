'use client';

import * as React from 'react';
import Link from 'next/link';

import { Check, Copy, ExternalLink, Server, Shield } from '@/components/icons';
import { BrandMark } from '@/components/shared/brand-mark';
import { Button } from '@/components/ui/button';
import { DEVELOPER_SECTIONS, type DevEndpoint } from '@/features/developers/developers-data';

export default function DevelopersPage() {
  const [activeSectionId, setActiveSectionId] = React.useState('quickstart');
  const [activeEndpointId, setActiveEndpointId] = React.useState('auth-login');
  const [codeFormat, setCodeFormat] = React.useState<'curl' | 'ts' | 'json'>('curl');
  const [copied, setCopied] = React.useState(false);
  const [isTesting, setIsTesting] = React.useState(false);
  const [testResult, setTestResult] = React.useState<{
    status: number;
    latency: number;
    body: unknown;
  } | null>(null);

  const activeSection =
    DEVELOPER_SECTIONS.find((s) => s.id === activeSectionId) || DEVELOPER_SECTIONS[0];
  const activeEndpoint: DevEndpoint =
    activeSection.endpoints.find((e) => e.id === activeEndpointId) || activeSection.endpoints[0];

  // Auto-select first endpoint when changing section
  const handleSelectSection = (sectionId: string) => {
    setActiveSectionId(sectionId);
    const section = DEVELOPER_SECTIONS.find((s) => s.id === sectionId);
    if (section && section.endpoints.length > 0) {
      setActiveEndpointId(section.endpoints[0].id);
    }
    setTestResult(null);
  };

  // Code snippets
  const curlCode = React.useMemo(() => {
    const isPost = activeEndpoint.method === 'POST' || activeEndpoint.method === 'PATCH';
    let cmd = `curl -X ${activeEndpoint.method} "http://localhost:4000${activeEndpoint.path}" \\\n`;
    cmd += `  -H "Accept: application/json"`;
    if (isPost) {
      cmd += ` \\\n  -H "Content-Type: application/json"`;
    }
    if (activeEndpoint.permission !== 'Public') {
      cmd += ` \\\n  -H "Authorization: Bearer <ACCESS_TOKEN>"`;
    }
    if (activeEndpoint.scopeHeader) {
      cmd += ` \\\n  -H "X-Branch-Id: <BRANCH_ID>"`;
    }
    if (isPost && activeEndpoint.requestBody) {
      cmd += ` \\\n  -d '${JSON.stringify(activeEndpoint.requestBody, null, 2)}'`;
    }
    return cmd;
  }, [activeEndpoint]);

  const tsCode = React.useMemo(() => {
    const isPost = activeEndpoint.method === 'POST' || activeEndpoint.method === 'PATCH';
    return `// SNP-SMS TypeScript Client
import type { ApiSuccessResponse } from '@snp/shared';

const response = await fetch('http://localhost:4000${activeEndpoint.path}', {
  method: '${activeEndpoint.method}',
  headers: {
    'Accept': 'application/json',${isPost ? "\n    'Content-Type': 'application/json'," : ''}
    'Authorization': \`Bearer \${accessToken}\`,${activeEndpoint.scopeHeader ? "\n    'X-Branch-Id': branchId," : ''}
  },${isPost && activeEndpoint.requestBody ? `\n  body: JSON.stringify(${JSON.stringify(activeEndpoint.requestBody, null, 4)}),` : ''}
});

const result: ApiSuccessResponse<unknown> = await response.json();
console.log(result.data);`;
  }, [activeEndpoint]);

  const jsonCode = React.useMemo(() => {
    return JSON.stringify(activeEndpoint.responseBody, null, 2);
  }, [activeEndpoint]);

  const activeSnippet =
    codeFormat === 'curl' ? curlCode : codeFormat === 'ts' ? tsCode : jsonCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestEndpoint = async () => {
    setIsTesting(true);
    setTestResult(null);
    const start = performance.now();
    try {
      const res = await fetch(activeEndpoint.path, {
        method: activeEndpoint.method === 'GET' ? 'GET' : 'HEAD',
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

      setTestResult({
        status: res.status,
        latency,
        body,
      });
    } catch (err) {
      const end = performance.now();
      setTestResult({
        status: 500,
        latency: Math.round(end - start),
        body: { error: err instanceof Error ? err.message : 'Network test error' },
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Clean Minimalist Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <BrandMark size={32} />
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-slate-950">SNP-SMS</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                Developers
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-100/80 px-2.5 py-1 rounded-full border border-slate-200/60">
              <span className="size-2 rounded-full bg-emerald-500" />
              v0.1.0 · 193 Endpoints
            </span>
            <Link href="/dashboard">
              <Button size="sm" variant="outline" className="text-xs border-slate-300">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6 py-8 space-y-6">
        {/* Short Executive Summary Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950">
                Developer Integration Hub
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
                REST API and TypeScript SDK contracts for the SNP School Management System. Standardized
                JSON envelopes, Bearer JWT authentication, and multi-branch scoping.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="text-slate-500">Base URL:</span>
              <span className="font-semibold text-[#023e8a]">http://localhost:4000/api/v1</span>
            </div>
          </div>
        </div>

        {/* 4 Clean Primary Section Tabs (Less Menu, Clearer Navigation) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DEVELOPER_SECTIONS.map((section) => {
            const isSelected = activeSectionId === section.id;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => handleSelectSection(section.id)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-[#023e8a] border-[#023e8a] text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <p className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {section.title}
                </p>
                <p
                  className={`text-[11px] truncate mt-0.5 ${
                    isSelected ? 'text-blue-100' : 'text-slate-500'
                  }`}
                >
                  {section.endpoints.length} endpoints
                </p>
              </button>
            );
          })}
        </div>

        {/* Two-Column Specification & Code View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Endpoint Selector & Details (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
              <div className="border-b border-slate-100 pb-2">
                <h2 className="text-sm font-bold text-slate-900">{activeSection.title}</h2>
                <p className="text-xs text-slate-500">{activeSection.description}</p>
              </div>

              {/* Endpoint List Buttons */}
              <div className="space-y-1.5">
                {activeSection.endpoints.map((ep) => {
                  const isSelected = activeEndpointId === ep.id;
                  return (
                    <button
                      key={ep.id}
                      type="button"
                      onClick={() => {
                        setActiveEndpointId(ep.id);
                        setTestResult(null);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all text-xs ${
                        isSelected
                          ? 'bg-blue-50/70 border-blue-300 text-slate-950 font-semibold'
                          : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono font-bold text-[10px] px-1.5 py-0.5 rounded ${
                            ep.method === 'GET'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {ep.method}
                        </span>
                        <span className="font-mono truncate">{ep.path}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{ep.summary}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Endpoint Quick Specs */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs text-xs space-y-3">
              <h3 className="font-bold text-slate-900">Endpoint Requirements</h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-md bg-slate-50 border border-slate-100">
                  <span className="text-slate-500">Permission:</span>
                  <code className="font-mono text-slate-800 font-semibold">
                    {activeEndpoint.permission}
                  </code>
                </div>

                <div className="flex items-center justify-between p-2 rounded-md bg-slate-50 border border-slate-100">
                  <span className="text-slate-500">Branch Header:</span>
                  <span className="font-medium text-slate-700">
                    {activeEndpoint.scopeHeader ? 'X-Branch-Id Required' : 'Not Required'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-md bg-slate-50 border border-slate-100">
                  <span className="text-slate-500">Response Envelope:</span>
                  <code className="font-mono text-slate-800">ApiSuccessResponse&lt;T&gt;</code>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleTestEndpoint}
                disabled={isTesting}
                className="w-full text-xs h-8 border-slate-300 hover:text-[#023e8a] hover:border-[#023e8a]"
              >
                <Server className="size-3.5 mr-1.5 text-blue-600" />
                {isTesting ? 'Sending Request...' : 'Send Live Test Request'}
              </Button>
            </div>
          </div>

          {/* Right: Code & Response Inspector (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Live Test Banner (if triggered) */}
            {testResult && (
              <div
                className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                  testResult.status === 200
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>Live API Response: HTTP {testResult.status}</span>
                  <span className="font-mono text-slate-600">{testResult.latency}ms</span>
                </div>
                <pre className="max-h-32 overflow-y-auto bg-white/80 p-2 rounded border border-slate-200 font-mono text-[11px] text-slate-800">
                  {JSON.stringify(testResult.body, null, 2)}
                </pre>
              </div>
            )}

            {/* Code Snippet Card */}
            <div className="rounded-xl border border-slate-900 bg-slate-950 text-slate-100 overflow-hidden shadow-sm">
              {/* Header Tab Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-2">
                <div className="flex items-center gap-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setCodeFormat('curl')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      codeFormat === 'curl'
                        ? 'bg-slate-800 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    cURL
                  </button>
                  <button
                    type="button"
                    onClick={() => setCodeFormat('ts')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      codeFormat === 'ts'
                        ? 'bg-slate-800 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    TypeScript
                  </button>
                  <button
                    type="button"
                    onClick={() => setCodeFormat('json')}
                    className={`px-3 py-1 rounded-md font-medium transition-colors ${
                      codeFormat === 'json'
                        ? 'bg-slate-800 text-white font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    JSON Response
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800/80 border border-slate-700/60"
                >
                  {copied ? (
                    <>
                      <Check className="size-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code Editor Body */}
              <pre className="p-4 overflow-x-auto text-xs font-mono leading-relaxed text-slate-200 max-h-[420px]">
                <code>{activeSnippet}</code>
              </pre>
            </div>

            {/* Standard Response Contract Notice */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs text-xs space-y-1.5 text-slate-600">
              <p className="font-bold text-slate-900">Standard Response Envelope</p>
              <p className="text-[11px] leading-relaxed">
                Every API call returns an envelope: <code className="text-slate-800 font-mono">success</code> (boolean),{' '}
                <code className="text-slate-800 font-mono">message</code> (human-readable string), and{' '}
                <code className="text-slate-800 font-mono">data</code> (payload or array). Paginated endpoints include{' '}
                <code className="text-slate-800 font-mono">meta: &#123; page, limit, total &#125;</code>.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Clean Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>SNP-SMS Developers · Phnom Penh, Cambodia</span>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hover:text-slate-800">
              Administrative Console
            </Link>
            <a
              href="https://snp.edu.kh"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-800"
            >
              School Website
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
