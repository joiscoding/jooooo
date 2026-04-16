import { useCallback, useEffect, useState } from 'react';
import { LOOKBOOK_NAV_COLLAPSED_STORAGE_KEY } from '../constants/navStorage';

function readCollapsed(): boolean {
  try {
    const raw = window.localStorage.getItem(LOOKBOOK_NAV_COLLAPSED_STORAGE_KEY);
    if (raw === '1') return true;
    if (raw === '0') return false;
  } catch {
    /* private mode / blocked storage */
  }
  return false;
}

function writeCollapsed(collapsed: boolean): void {
  try {
    window.localStorage.setItem(
      LOOKBOOK_NAV_COLLAPSED_STORAGE_KEY,
      collapsed ? '1' : '0',
    );
  } catch {
    /* ignore */
  }
}

/**
 * Desktop sidebar collapsed flag, persisted across sessions (localStorage).
 */
export function usePersistedNavCollapsed() {
  const [collapsed, setCollapsedState] = useState(false);

  useEffect(() => {
    setCollapsedState(readCollapsed());
  }, []);

  const setCollapsed = useCallback((next: boolean) => {
    setCollapsedState(next);
    writeCollapsed(next);
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsedState((prev) => {
      const next = !prev;
      writeCollapsed(next);
      return next;
    });
  }, []);

  return { collapsed, setCollapsed, toggleCollapsed } as const;
}
