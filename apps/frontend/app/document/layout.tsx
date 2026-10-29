import type { Metadata } from 'next';
import localFont from 'next/font/local';

export const metadata: Metadata = {
  title: {
    default: 'SNP-SMS Open API & Design Library',
    template: '%s · SNP-SMS Docs',
  },
  description: 'Enterprise API documentation, developer guidelines, and UI component standards.',
};

const docsInter = localFont({
  src: './fonts/inter.ttf',
  variable: '--font-docs-inter',
  display: 'swap',
});

export default function DocumentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={docsInter.variable}
      style={{
        fontFamily: 'var(--font-docs-inter), ui-sans-serif, system-ui, sans-serif',
        ['--font-sans' as string]: 'var(--font-docs-inter), ui-sans-serif, system-ui, sans-serif',
      }}
    >
      {children}
    </div>
  );
}
