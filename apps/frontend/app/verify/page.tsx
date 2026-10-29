'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Search, Award } from '@/components/icons';
import { BrandMark } from '@/components/shared/brand-mark';

export default function VerifyPortalPage() {
  const router = useRouter();
  const [code, setCode] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      router.push(`/verify/certificates/${encodeURIComponent(code.trim())}`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 antialiased">
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <BrandMark compact size={32} />
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-extrabold tracking-tight text-slate-950">
                Ledger Verification
              </span>
              <span className="text-slate-300">|</span>
              <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                Public Gateway
              </span>
            </div>
          </div>
          <span className="font-mono text-xs text-slate-500">SNP International School</span>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 shadow-xs">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
              Certificate & Diploma Verification
            </h1>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-500">
              Enter the unique verification code or SHA-256 hash printed on the academic transcript
              or certificate to verify cryptographic authenticity.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="cert-code"
                className="mb-1.5 block font-mono text-xs font-medium text-slate-700"
              >
                Verification Code
              </label>
              <div className="relative">
                <Search className="absolute top-3 left-3 h-4 w-4 text-slate-400" />
                <input
                  id="cert-code"
                  type="text"
                  placeholder="e.g. CERT-2026-A1B2C3D4 or scan QR code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pr-4 pl-9 font-mono text-xs text-slate-900 transition-colors placeholder:text-slate-400 focus:border-[#023e8a] focus:bg-white focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#023e8a] text-xs font-medium text-white shadow-xs transition-colors hover:bg-[#00509d]"
            >
              <Award className="h-4 w-4" />
              <span>Verify Cryptographic Record</span>
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 text-center font-mono text-[11px] text-slate-400">
            Powered by immutable cryptographic ledger hash validation
          </div>
        </div>
      </div>
    </main>
  );
}
