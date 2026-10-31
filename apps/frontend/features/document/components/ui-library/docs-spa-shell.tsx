'use client';

import * as React from 'react';
import { useDocsNav, type DocsTab } from './docs-nav-context';
import { OpenApiView } from './open-api-view';
import { UiLibraryView } from './ui-library-view';

export interface DocsSpaShellProps {
  defaultTab?: DocsTab;
}

export function DocsSpaShell({ defaultTab }: DocsSpaShellProps) {
  const { activeTab, setActiveTab } = useDocsNav();

  // Sync defaultTab only on mount or when defaultTab changes
  React.useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab, false);
    }
  }, [defaultTab, setActiveTab]);

  return (
    <div className="w-full">
      <div className={activeTab === 'openapi' || activeTab === 'release' ? 'block' : 'hidden'}>
        <OpenApiView initialSection={activeTab === 'release' ? 'changelogs' : undefined} />
      </div>
      <div className={activeTab === 'library' ? 'block' : 'hidden'}>
        <UiLibraryView />
      </div>
    </div>
  );
}
