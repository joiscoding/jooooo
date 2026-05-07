import { useEffect } from 'react';
import { isGlobalSearchShortcut } from '../utils/isGlobalSearchShortcut';

/**
 * Registers a capture-phase listener so we can focus app search before the browser
 * handles Ctrl/Cmd+K where the OS allows it.
 */
export function useGlobalSearchShortcut(onFocusSearch: () => void): void {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!isGlobalSearchShortcut(e)) return;

      const target = e.target;
      if (target instanceof HTMLElement && target.isContentEditable) return;
      if (target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) return;

      e.preventDefault();
      onFocusSearch();
    }

    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [onFocusSearch]);
}
