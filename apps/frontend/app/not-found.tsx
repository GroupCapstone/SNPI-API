import { StatusPage404 } from '@/features/document/components/ui-library';

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4 sm:p-8 dark:bg-slate-950">
      <div className="w-full max-w-4xl">
        <StatusPage404
          mode="radar"
          statusCode={404}
          homeHref="/dashboard"
          homeLabel="Return to Dashboard"
          showControls={true}
        />
      </div>
    </main>
  );
}
