'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';

export type DocsTab = 'openapi' | 'library' | 'release';

interface DocsNavContextValue {
  activeTab: DocsTab;
  setActiveTab: (tab: DocsTab, updateHistory?: boolean) => void;
}

const DocsNavContext = React.createContext<DocsNavContextValue | undefined>(undefined);

export function DocsNavProvider({
  children,
  defaultTab,
}: {
  children: React.ReactNode;
  defaultTab?: DocsTab;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isLibraryPath = pathname?.startsWith('/document/design-system');
  const isChangelogPath = pathname?.startsWith('/document/changelog');
  const pathDerivedTab: DocsTab = isLibraryPath
    ? 'library'
    : isChangelogPath
      ? 'release'
      : 'openapi';

  const [activeTab, setActiveTabState] = React.useState<DocsTab>(defaultTab || pathDerivedTab);

  React.useEffect(() => {
    setActiveTabState(pathDerivedTab);
  }, [pathDerivedTab]);

  React.useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const isLib = window.location.pathname.startsWith('/document/design-system');
        const isChange = window.location.pathname.startsWith('/document/changelog');
        setActiveTabState(isLib ? 'library' : isChange ? 'release' : 'openapi');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const setActiveTab = React.useCallback(
    (tab: DocsTab, updateHistory = true) => {
      setActiveTabState(tab);
      if (updateHistory) {
        const targetPath =
          tab === 'library'
            ? '/document/design-system'
            : tab === 'release'
              ? '/document/changelog'
              : '/document';
        if (pathname !== targetPath) {
          router.push(targetPath);
        }
      }
    },
    [pathname, router],
  );

  const value = React.useMemo(() => ({ activeTab, setActiveTab }), [activeTab, setActiveTab]);

  return <DocsNavContext.Provider value={value}>{children}</DocsNavContext.Provider>;
}

export function useDocsNav(): DocsNavContextValue {
  const ctx = React.useContext(DocsNavContext);
  if (!ctx) {
    return {
      activeTab: 'openapi',
      setActiveTab: () => {},
    };
  }
  return ctx;
}
