/**
 * True when the event should open/focus the app-wide search (⌘K / Ctrl+K).
 * Does not call preventDefault; callers decide when to intercept.
 */
export function isGlobalSearchShortcut(event: KeyboardEvent): boolean {
  if (event.defaultPrevented || event.repeat) return false;
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
  if (key !== 'k') return false;
  const mod = event.metaKey || event.ctrlKey;
  if (!mod) return false;
  // Require exactly one primary modifier so we do not steal Alt+Ctrl+K etc.
  if (event.metaKey && event.ctrlKey) return false;
  if (event.altKey || event.shiftKey) return false;
  return true;
}
