import { useCallback, useEffect, useState } from 'react';
import {
  NAV_COLLAPSED_STORAGE_KEY,
  readNavCollapsedFromStorage,
  writeNavCollapsedToStorage,
} from '../nav/storage';

/**
 * Desktop sidebar collapsed state, synced to localStorage and other tabs.
 */
export function useNavCollapsed(): readonly [boolean, () => void] {
  const [collapsed, setCollapsed] = useState(readNavCollapsedFromStorage);

  useEffect(() => {
    writeNavCollapsedToStorage(collapsed);
  }, [collapsed]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== NAV_COLLAPSED_STORAGE_KEY || e.newValue == null) return;
      setCollapsed(e.newValue === 'true');
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggle = useCallback(() => {
    setCollapsed((c) => !c);
  }, []);

  return [collapsed, toggle] as const;
}
