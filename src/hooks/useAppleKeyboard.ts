import { useState } from 'react';

/**
 * Heuristic for showing ⌘ vs Ctrl in the UI. Updates on first paint;
 * sufficient for a shortcut hint, not for actual shortcut handling.
 */
export function useAppleKeyboardHint(): { modifierLabel: '⌘' | 'Ctrl' } {
  const [modifierLabel] = useState<'⌘' | 'Ctrl'>(() => {
    if (typeof navigator === 'undefined') {
      return 'Ctrl';
    }
    if (navigator.userAgentData?.platform) {
      return navigator.userAgentData.platform.toLowerCase().includes('mac')
        ? '⌘'
        : 'Ctrl';
    }
    return /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent) ? '⌘' : 'Ctrl';
  });
  return { modifierLabel };
}
