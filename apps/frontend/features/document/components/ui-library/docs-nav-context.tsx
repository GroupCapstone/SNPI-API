'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';

export type DocsTab = 'openapi' | 'library';

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
  const isLibraryPath = pathname?.startsWith('/document/design-system');
  const pathDerivedTab: DocsTab = isLibraryPath ? 'library' : 'openapi';

  const [activeTab, setActiveTabState] = React.useState<DocsTab>(defaultTab || pathDerivedTab);

  React.useEffect(() => {
    setActiveTabState(pathDerivedTab);
  }, [pathDerivedTab]);

  React.useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const isLib = window.location.pathname.startsWith('/document/design-system');
        setActiveTabState(isLib ? 'library' : 'openapi');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const setActiveTab = React.useCallback((tab: DocsTab, updateHistory = true) => {
    setActiveTabState(tab);
    if (updateHistory && typeof window !== 'undefined') {
      const targetPath = tab === 'library' ? '/document/design-system' : '/document';
      if (window.location.pathname !== targetPath) {
        window.history.pushState(null, '', targetPath);
      }
    }
  }, []);

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
