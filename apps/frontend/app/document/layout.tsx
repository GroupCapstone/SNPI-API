import type { Metadata } from 'next';
import localFont from 'next/font/local';

export const metadata: Metadata = {
  title: {
    default: 'SNP-SMS Open API & Design Library',
    template: '%s · SNP-SMS Docs',
  },
  description:
    'Enterprise API documentation, developer guidelines, and UI component standards with Royal Blue & Sora typography.',
};

const docsSora = localFont({
  src: './fonts/sora.woff2',
  variable: '--font-docs-sora',
  display: 'swap',
});

export default function DocumentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={docsSora.variable}
      style={{
        fontFamily: 'var(--font-docs-sora), ui-sans-serif, system-ui, sans-serif',
        ['--font-sans' as string]: 'var(--font-docs-sora), ui-sans-serif, system-ui, sans-serif',
      }}
    >
      {children}
    </div>
  );
}
