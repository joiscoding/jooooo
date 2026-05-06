import { useMemo } from 'react';

/** Label for the primary shortcut modifier: ⌘ on Apple platforms, Ctrl elsewhere. */
export function useShortcutModifierLabel(): '⌘' | 'Ctrl' {
  return useMemo(() => {
    if (typeof navigator === 'undefined') return 'Ctrl';
    return /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent) ? '⌘' : 'Ctrl';
  }, []);
}
