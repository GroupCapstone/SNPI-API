import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-6 text-center">
      <div>
        <p className="text-sm font-semibold text-slate-500">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-slate-500">This SNP-SMS page has not been created yet.</p>
        <Link href="/dashboard" className="mt-6 inline-block">
          <Button>Return to dashboard</Button>
        </Link>
      </div>
    </main>
  );
}
