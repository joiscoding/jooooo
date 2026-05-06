import { useCallback, useEffect, useState } from 'react';
import {
  LOOKBOOK_NAV_COLLAPSED_KEY,
  readNavCollapsed,
  writeNavCollapsed,
} from '../lib/navCollapsedStorage';

export function usePersistedNavCollapsed() {
  const [collapsed, setCollapsedState] = useState(() => readNavCollapsed());

  const setCollapsed = useCallback((next: boolean) => {
    setCollapsedState(next);
    writeNavCollapsed(next);
  }, []);

  const toggle = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed, setCollapsed]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (
        e.key !== LOOKBOOK_NAV_COLLAPSED_KEY ||
        e.storageArea !== window.localStorage ||
        e.newValue === null
      ) {
        return;
      }
      setCollapsedState(e.newValue === 'true');
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return { collapsed, setCollapsed, toggle };
}
