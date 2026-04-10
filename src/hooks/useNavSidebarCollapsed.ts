import { useCallback, useEffect, useState } from 'react';

export const NAV_COLLAPSED_STORAGE_KEY = 'lookbook_nav_collapsed_v1';

const DESKTOP_MQ = '(min-width: 900px)';

function readCollapsed(): boolean {
  try {
    const v = localStorage.getItem(NAV_COLLAPSED_STORAGE_KEY);
    if (v === '1') return true;
    if (v === '0') return false;
    return false;
  } catch {
    return false;
  }
}

function writeCollapsed(collapsed: boolean) {
  try {
    localStorage.setItem(NAV_COLLAPSED_STORAGE_KEY, collapsed ? '1' : '0');
  } catch {
    /* quota / private mode */
  }
}

export function useNavSidebarCollapsed() {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(DESKTOP_MQ).matches;
  });
  const [collapsed, setCollapsedState] = useState(readCollapsed);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MQ);
    const onChange = () => setIsDesktop(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
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

  return { isDesktop, collapsed, setCollapsed, toggleCollapsed };
}
