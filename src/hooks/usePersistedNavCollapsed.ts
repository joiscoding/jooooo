import { useCallback, useEffect, useState } from 'react';
import {
  LOOKBOOK_NAV_COLLAPSED_KEY,
  readNavCollapsed,
  writeNavCollapsed,
} from '../storage/navCollapsedStorage';

function initialCollapsed(): boolean {
  if (typeof window === 'undefined') return false;
  return readNavCollapsed() ?? false;
}

/**
 * Desktop sidebar collapsed flag persisted in localStorage.
 * Safe when localStorage is unavailable; syncs across tabs via `storage` events.
 */
export function usePersistedNavCollapsed() {
  const [collapsed, setCollapsedState] = useState(initialCollapsed);

  useEffect(() => {
    const applyFromStorage = () => {
      const stored = readNavCollapsed();
      setCollapsedState(stored ?? false);
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === LOOKBOOK_NAV_COLLAPSED_KEY) {
        applyFromStorage();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setCollapsed = useCallback((next: boolean) => {
    writeNavCollapsed(next);
    setCollapsedState(next);
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsedState((prev) => {
      const next = !prev;
      writeNavCollapsed(next);
      return next;
    });
  }, []);

  return { collapsed, setCollapsed, toggleCollapsed };
}
