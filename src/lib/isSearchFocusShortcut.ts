/**
 * True when the event should open/focus the global search (⌘K on Apple platforms, Ctrl+K elsewhere).
 * Callers should still ignore repeat events and editable targets when appropriate.
 */
export function isSearchFocusShortcut(
  e: Pick<KeyboardEvent, 'key' | 'metaKey' | 'ctrlKey' | 'altKey' | 'repeat'>,
): boolean {
  if (e.repeat) return false;
  if (e.key !== 'k' && e.key !== 'K') return false;
  if (e.altKey) return false;

  if (typeof navigator === 'undefined') {
    return (e.metaKey || e.ctrlKey) && !(e.metaKey && e.ctrlKey);
  }

  const ua = navigator.userAgent;
  const platform = navigator.platform ?? '';
  const isApple =
    /Mac|iPhone|iPod|iPad/i.test(platform) || /Mac OS/.test(ua);

  if (isApple) {
    return e.metaKey && !e.ctrlKey;
  }

  return e.ctrlKey && !e.metaKey;
}
