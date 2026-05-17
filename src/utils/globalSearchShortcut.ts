/** True when the event should open or focus the global search field. */
export function isGlobalSearchShortcut(
  event: Pick<
    KeyboardEvent,
    'key' | 'metaKey' | 'ctrlKey' | 'altKey' | 'shiftKey' | 'repeat'
  >,
): boolean {
  if (event.repeat) return false;
  if (event.altKey || event.shiftKey) return false;
  if (event.key.toLowerCase() !== 'k') return false;
  return event.metaKey || event.ctrlKey;
}

export function getSearchShortcutParts(): { modifier: string; key: string } {
  if (typeof navigator === 'undefined') {
    return { modifier: 'Ctrl', key: 'K' };
  }
  const isApple = /Mac|iPhone|iPod|iPad/i.test(navigator.userAgent);
  return isApple ? { modifier: '⌘', key: 'K' } : { modifier: 'Ctrl', key: 'K' };
}
