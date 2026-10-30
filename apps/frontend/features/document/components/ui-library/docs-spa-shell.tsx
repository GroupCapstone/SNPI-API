'use client';

import * as React from 'react';
import { useDocsNav } from './docs-nav-context';
import { OpenApiView } from './open-api-view';
import { UiLibraryView } from './ui-library-view';

export interface DocsSpaShellProps {
  defaultTab?: 'openapi' | 'library';
}

export function DocsSpaShell({ defaultTab }: DocsSpaShellProps) {
  const { activeTab, setActiveTab } = useDocsNav();

  // If defaultTab is provided and differs on mount, sync it without pushing duplicate history
  React.useEffect(() => {
    if (defaultTab && defaultTab !== activeTab) {
      setActiveTab(defaultTab, false);
    }
  }, [defaultTab, activeTab, setActiveTab]);

  return (
    <div className="w-full">
      <div className={activeTab === 'openapi' ? 'block' : 'hidden'}>
        <OpenApiView />
      </div>
      <div className={activeTab === 'library' ? 'block' : 'hidden'}>
        <UiLibraryView />
      </div>
    </div>
  );
}
