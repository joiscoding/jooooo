/**
 * True when the event should open/focus the global search field.
 * Uses ⌘K (Apple) or Ctrl+K (Windows/Linux); ignores repeats and modifier chords
 * that commonly conflict with browser or OS shortcuts.
 */
export function isFocusSearchShortcut(e: Pick<
  KeyboardEvent,
  'key' | 'metaKey' | 'ctrlKey' | 'altKey' | 'shiftKey' | 'repeat'
>): boolean {
  if (e.repeat) return false;
  if (e.key !== 'k' && e.key !== 'K') return false;
  if (!(e.metaKey || e.ctrlKey)) return false;
  if (e.altKey) return false;
  if (e.shiftKey) return false;
  return true;
}
