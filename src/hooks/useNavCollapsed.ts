import { useCallback, useEffect, useState } from 'react';

/** Persisted desktop sidebar collapsed state (LB-4). */
export const NAV_COLLAPSED_STORAGE_KEY = 'lookbook_nav_collapsed_v1';

function readStored(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(NAV_COLLAPSED_STORAGE_KEY);
    if (raw === '1' || raw === 'true') return true;
    if (raw === '0' || raw === 'false') return false;
    return false;
  } catch {
    return false;
  }
}

function writeStored(collapsed: boolean) {
  try {
    localStorage.setItem(NAV_COLLAPSED_STORAGE_KEY, collapsed ? '1' : '0');
  } catch {
    // ignore quota / private mode
  }
}

/**
 * Desktop sidebar collapsed flag, synced to localStorage so it survives reloads and sessions.
 */
export function useNavCollapsed() {
  const [collapsed, setCollapsed] = useState(readStored);

  useEffect(() => {
    writeStored(collapsed);
  }, [collapsed]);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((c) => !c);
  }, []);

  const setCollapsedState = useCallback((next: boolean) => {
    setCollapsed(next);
  }, []);

  return { collapsed, toggleCollapsed, setCollapsedState };
}
