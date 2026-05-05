/**
 * Returns true when the event should focus the global search field (⌘/Ctrl+K).
 * Uses preventDefault on the listener when this returns true so the browser
 * does not handle the combo (e.g. Chrome’s default for Ctrl+K).
 */
export function isSearchFocusShortcut(event: KeyboardEvent): boolean {
  if (event.defaultPrevented) return false;
  if (event.repeat) return false;
  if (event.altKey || event.shiftKey) return false;
  const key = event.key;
  if (key !== 'k' && key !== 'K') return false;
  return event.metaKey || event.ctrlKey;
}
