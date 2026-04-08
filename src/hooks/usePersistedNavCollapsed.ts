import { useCallback, useEffect, useState } from 'react';
import {
  readNavCollapsed,
  writeNavCollapsed,
} from '../lib/navCollapsedStorage';

/**
 * Desktop sidebar collapsed state persisted in localStorage (LB-4).
 */
export function usePersistedNavCollapsed(): readonly [
  collapsed: boolean,
  toggleCollapsed: () => void,
] {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof localStorage === 'undefined') return false;
    return readNavCollapsed(localStorage) ?? false;
  });

  useEffect(() => {
    if (typeof localStorage === 'undefined') return;
    writeNavCollapsed(localStorage, collapsed);
  }, [collapsed]);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((c) => !c);
  }, []);

  return [collapsed, toggleCollapsed] as const;
}
