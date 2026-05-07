import { useCallback, useEffect, useState } from 'react';
import { readNavCollapsed, writeNavCollapsed } from '../navStorage';

const DESKTOP_NAV_MQ = '(min-width: 900px)';

function initialCollapsedForViewport(): boolean {
  if (typeof window === 'undefined') return false;
  if (!window.matchMedia(DESKTOP_NAV_MQ).matches) return false;
  return readNavCollapsed(window.localStorage);
}

/**
 * Collapsed state for the desktop sidebar; persisted across sessions.
 * On viewports below 900px this stays `false` (top header is used instead).
 */
export function usePersistedNavCollapsed(isDesktop: boolean) {
  const [navCollapsed, setNavCollapsed] = useState(initialCollapsedForViewport);

  useEffect(() => {
    if (!isDesktop) {
      setNavCollapsed(false);
      return;
    }
    setNavCollapsed(readNavCollapsed(window.localStorage));
  }, [isDesktop]);

  const toggleCollapsed = useCallback(() => {
    if (!isDesktop) return;
    setNavCollapsed((prev) => {
      const next = !prev;
      writeNavCollapsed(window.localStorage, next);
      return next;
    });
  }, [isDesktop]);

  return { navCollapsed, toggleCollapsed } as const;
}
