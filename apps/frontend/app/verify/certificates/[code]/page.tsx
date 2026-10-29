'use client';

import * as React from 'react';
import { Award, CheckCircle2, ShieldCheck, Code, FileText, Database } from '@/components/icons';
import { useParams } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JsonResponseViewer } from '@/components/ui/json-response-viewer';
import { verifyCertificate, type CertificateVerification } from '@/features/reports/api/report-api';

const read = (source: Record<string, unknown> | undefined, key: string): string =>
  source?.[key] === undefined ? '-' : String(source[key]);

const readStudentName = (student: Record<string, unknown> | undefined): string => {
  const name = read(student, 'name');
  return name !== '-' ? name : read(student, 'khmerName');
};

export default function CertificateVerificationPage() {
  const params = useParams<{ code: string }>();
  const [result, setResult] = React.useState<CertificateVerification | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<'visual' | 'api'>('visual');
  const [requestLatency, setRequestLatency] = React.useState<number | undefined>(undefined);

  React.useEffect(() => {
    const startTime = performance.now();
    void verifyCertificate(params.code)
      .then((response) => {
        setResult(response.data);
        setRequestLatency(Math.round(performance.now() - startTime));
      })
      .catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : 'Certificate verification failed');
        setRequestLatency(Math.round(performance.now() - startTime));
      });
  }, [params.code]);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-4">
        {/* View Mode Toggle Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              Verification Mode
            </span>
          </div>

          <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('visual')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === 'visual'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="size-3.5" />
              <span>Official Certificate</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('api')}
              className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                viewMode === 'api'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code className="size-3.5" />
              <span>GitHub API JSON View</span>
            </button>
          </div>
        </div>

        {/* Mode 1: Visual Certificate Card */}
        {viewMode === 'visual' && (
          <Card className="border-slate-200 bg-white shadow-xs">
            <CardHeader className="border-b border-slate-200 text-center">
              <ShieldCheck className="mx-auto mb-3 size-12 text-[#023e8a]" />
              <CardTitle className="text-2xl leading-8 text-slate-950">
                SNP-SMS Certificate Verification
              </CardTitle>
              <p className="text-sm leading-5 text-slate-600">លេខផ្ទៀងផ្ទាត់៖ {params.code}</p>
            </CardHeader>
            <CardContent className="p-6">
              {!result && !error && (
                <p className="text-center text-sm text-slate-600">Verifying record...</p>
              )}
              {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm leading-5 text-rose-700">
                  {error}
                </div>
              )}
              {result && (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                    <div className="flex items-center gap-2 font-semibold">
                      <CheckCircle2 className="size-5" /> This certificate is valid and active.
                    </div>
                    {result.ledger && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-emerald-300 bg-emerald-100/70 px-2.5 py-1 text-xs font-semibold text-emerald-900">
                        <Database className="size-3.5" />
                        <span>Ledger: {result.ledger.status}</span>
                      </span>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs leading-4 font-semibold text-slate-500">Student</p>
                      <p className="text-base leading-6 font-semibold text-slate-950">
                        {readStudentName(result.student)}
                      </p>
                      <p className="text-xs leading-4 text-slate-500">
                        {read(result.student, 'studentId')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs leading-4 font-semibold text-slate-500">
                        Program and Level
                      </p>
                      <p className="text-sm leading-5 font-medium text-slate-950">
                        {read(result.academic, 'program')} - {read(result.academic, 'level')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs leading-4 font-semibold text-slate-500">
                        Academic Period
                      </p>
                      <p className="text-sm leading-5 text-slate-950">
                        {read(result.academic, 'academicYear')} / {read(result.academic, 'period')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs leading-4 font-semibold text-slate-500">
                        Completion Date
                      </p>
                      <p className="text-sm leading-5 text-slate-950">
                        {result.completionDate ?? '-'}
                      </p>
                    </div>
                  </div>

                  {/* Cryptographic Ledger Summary */}
                  {result.ledger && (
                    <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3.5">
                      <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                        <span>Cryptographic Ledger Verification</span>
                        <span className="font-mono text-[11px] text-slate-500">
                          {result.ledger.network}
                        </span>
                      </div>
                      <div className="grid gap-2 font-mono text-xs text-slate-600 sm:grid-cols-2">
                        <div className="truncate">
                          <span className="text-slate-400">Hash: </span>
                          <span className="text-slate-800">{result.contentHash ?? '-'}</span>
                        </div>
                        <div className="truncate">
                          <span className="text-slate-400">TxID: </span>
                          <span className="text-slate-800">
                            {result.ledger.ledgerRecord.transactionId}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 border-t border-slate-200 pt-4 text-xs leading-4 text-slate-500">
                    <Award className="size-4" /> Issued by {read(result.issuer, 'nameEn')} on{' '}
                    {new Date(result.generatedAt).toLocaleDateString()}.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Mode 2: GitHub REST API Response Viewer */}
        {viewMode === 'api' && (
          <div className="space-y-3">
            <JsonResponseViewer
              data={
                result
                  ? {
                      success: true,
                      message: 'Certificate verification completed',
                      data: result,
                    }
                  : {
                      success: false,
                      message: error ?? 'Verifying certificate...',
                    }
              }
              url={`/api/v1/reports/certificates/verify/${params.code}?pretty=true`}
              statusCode={error ? 404 : 200}
              durationMs={requestLatency}
              title="Public REST API / Certificate Verification"
            />

            <div className="rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-600">
              <p className="mb-1 font-semibold text-slate-800">Public Verification Endpoint</p>
              <code className="block rounded border border-slate-100 bg-slate-50 p-2 font-mono text-[11px] text-slate-700 select-all">
                curl -H &quot;Accept: application/json&quot;
                &quot;https://snpis.kesararamwithdigital.tech/api/v1/reports/certificates/verify/
                {params.code}?pretty=true&quot;
              </code>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
