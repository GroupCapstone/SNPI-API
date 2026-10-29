'use client';

import * as React from 'react';
import { Award, CheckCircle2, ShieldCheck } from '@/components/icons';
import { useParams } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  React.useEffect(() => {
    void verifyCertificate(params.code)
      .then((response) => setResult(response.data))
      .catch((reason: unknown) =>
        setError(reason instanceof Error ? reason.message : 'Certificate verification failed'),
      );
  }, [params.code]);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12">
      <Card className="mx-auto max-w-2xl border-slate-200 bg-white">
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
              <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
                <CheckCircle2 className="size-5" /> This certificate is valid and active.
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
                  <p className="text-xs leading-4 font-semibold text-slate-500">Academic Period</p>
                  <p className="text-sm leading-5 text-slate-950">
                    {read(result.academic, 'academicYear')} / {read(result.academic, 'period')}
                  </p>
                </div>
                <div>
                  <p className="text-xs leading-4 font-semibold text-slate-500">Completion Date</p>
                  <p className="text-sm leading-5 text-slate-950">{result.completionDate ?? '-'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 border-t border-slate-200 pt-4 text-xs leading-4 text-slate-500">
                <Award className="size-4" /> Issued by {read(result.issuer, 'nameEn')} on{' '}
                {new Date(result.generatedAt).toLocaleDateString()}.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
