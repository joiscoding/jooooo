import { useCallback, useEffect, useState } from 'react';
import {
  NAV_COLLAPSED_STORAGE_KEY,
  readNavCollapsed,
  writeNavCollapsed,
} from '../lib/navStorage';

export function usePersistedNavCollapsed() {
  const [collapsed, setCollapsedState] = useState(() =>
    readNavCollapsed(false),
  );

  useEffect(() => {
    writeNavCollapsed(collapsed);
  }, [collapsed]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== NAV_COLLAPSED_STORAGE_KEY || event.newValue == null) {
        return;
      }
      setCollapsedState(event.newValue === '1');
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setCollapsed = useCallback((next: boolean | ((prev: boolean) => boolean)) => {
    setCollapsedState(next);
  }, []);

  return { collapsed, setCollapsed } as const;
}
