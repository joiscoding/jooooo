import { useCallback, useState } from 'react';
import {
  readNavCollapsed,
  writeNavCollapsed,
} from '../lib/navCollapsedStorage';

export function usePersistedNavCollapsed() {
  const [collapsed, setCollapsedState] = useState(() =>
    typeof window === 'undefined' ? false : readNavCollapsed(window.localStorage),
  );

  const setCollapsed = useCallback((next: boolean) => {
    setCollapsedState(next);
    if (typeof window !== 'undefined') {
      writeNavCollapsed(window.localStorage, next);
    }
  }, []);

  const toggle = useCallback(() => {
    setCollapsedState((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        writeNavCollapsed(window.localStorage, next);
      }
      return next;
    });
  }, []);

  return { collapsed, setCollapsed, toggle };
}
