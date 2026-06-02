/**
 * Detects the global search focus shortcut (⌘K on macOS, Ctrl+K elsewhere).
 * Uses capture-phase handlers with preventDefault where this returns true
 * to reduce overlap with browser chrome shortcuts when possible.
 */
export function isGlobalSearchFocusShortcut(event: {
  key: string;
  metaKey: boolean;
  ctrlKey: boolean;
  repeat: boolean;
  defaultPrevented: boolean;
}): boolean {
  if (event.repeat || event.defaultPrevented) {
    return false;
  }
  const key = event.key.toLowerCase();
  if (key !== 'k') {
    return false;
  }
  return event.metaKey || event.ctrlKey;
}
