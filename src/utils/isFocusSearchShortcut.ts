/**
 * True when the event should open/focus the app search field (⌘K / Ctrl+K).
 * Does not call preventDefault; caller decides after checking focus rules.
 */
export function isFocusSearchShortcut(ev: Pick<KeyboardEvent, 'key' | 'metaKey' | 'ctrlKey' | 'altKey' | 'shiftKey' | 'defaultPrevented' | 'repeat' | 'isComposing'>): boolean {
  if (ev.defaultPrevented) return false;
  if (ev.repeat) return false;
  if (ev.isComposing) return false;
  if (ev.key !== 'k' && ev.key !== 'K') return false;
  const mod = ev.metaKey || ev.ctrlKey;
  if (!mod) return false;
  if (ev.metaKey && ev.ctrlKey) return false;
  if (ev.altKey || ev.shiftKey) return false;
  return true;
}
