'use client';

import * as React from 'react';
import { CapsuleDockNav } from './capsule-dock-nav';

export interface DocsStickyHeaderProps {
  activeTab?: 'openapi' | 'library' | 'document';
}

/**
 * Official Real Document Header: Floating 3-Island Capsule Dock Navigation
 * Replaces the legacy hanging trapezoid header with modern floating dark capsule islands.
 */
export function DocsStickyHeader(_props: DocsStickyHeaderProps = {}) {
  return <CapsuleDockNav />;
}
