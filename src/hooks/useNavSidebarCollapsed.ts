import { useCallback, useEffect, useState } from 'react';
import { readNavCollapsed, writeNavCollapsed } from '../lib/navCollapsedStorage';

const DESKTOP_MIN_PX = 900;

function getIsDesktop(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(`(min-width: ${DESKTOP_MIN_PX}px)`).matches;
}

/**
 * Desktop sidebar collapsed state, persisted in localStorage.
 * On narrow viewports the hook reports expanded and does not write storage.
 */
export function useNavSidebarCollapsed() {
  const [isDesktop, setIsDesktop] = useState(() => getIsDesktop());
  const [collapsed, setCollapsedState] = useState(() =>
    getIsDesktop() ? readNavCollapsed() : false
  );

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_MIN_PX}px)`);
    const onChange = () => {
      const desktop = mq.matches;
      setIsDesktop(desktop);
      if (desktop) {
        setCollapsedState(readNavCollapsed());
      } else {
        setCollapsedState(false);
      }
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const setCollapsedPersisted = useCallback((next: boolean) => {
    setCollapsedState(next);
    if (getIsDesktop()) {
      writeNavCollapsed(next);
    }
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsedPersisted(!collapsed);
  }, [collapsed, setCollapsedPersisted]);

  return {
    collapsed: isDesktop ? collapsed : false,
    isDesktop,
    setCollapsed: setCollapsedPersisted,
    toggleCollapsed,
  };
}
