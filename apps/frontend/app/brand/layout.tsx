import type { Metadata } from 'next';
import { BrandHeader } from '@/features/brand';
import { DocsFooter } from '@/features/document/components/ui-library';

export const metadata: Metadata = {
  title: {
    default: 'SNPI-SMS Brand Standards & Identity System',
    template: '%s · SNPI-SMS Brand',
  },
  description:
    'Official brand guidelines, foundations, logo lockups, marketing collateral, and the Royal Blue color standard.',
};

export default function BrandLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {/* Official Google Fonts Sora Preconnect & Stylesheet Links */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@100..800&display=swap"
        rel="stylesheet"
      />

      <div className="brand-root min-h-screen bg-white text-slate-900 antialiased selection:bg-[#0056FF] selection:text-white">
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .brand-root,
              .brand-root * {
                font-family: 'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important;
              }
              .brand-root {
                font-size: 16px;
                line-height: 1.6;
                letter-spacing: -0.01em;
              }
              .brand-root * {
                scrollbar-width: none !important;
                -ms-overflow-style: none !important;
              }
            `,
          }}
        />

        <BrandHeader />
        <main id="brand-main">{children}</main>
        <DocsFooter theme="light" />
      </div>
    </>
  );
}
