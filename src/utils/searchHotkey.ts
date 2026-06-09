/**
 * True when the event should focus the global search (⌘K / Ctrl+K).
 * Does not inspect target; callers decide when to preventDefault.
 */
export function isFocusSearchHotkey(
  e: Pick<
    KeyboardEvent,
    'key' | 'metaKey' | 'ctrlKey' | 'altKey' | 'shiftKey' | 'repeat'
  >
): boolean {
  if (e.repeat) return false;
  if (e.key !== 'k' && e.key !== 'K') return false;
  const mod = e.metaKey || e.ctrlKey;
  if (!mod) return false;
  if (e.altKey || e.shiftKey) return false;
  return true;
}

export function getSearchShortcutLabel(): string {
  if (typeof navigator === 'undefined') return 'Ctrl+K';
  return /Mac|iPhone|iPod|iPad/i.test(navigator.platform) ? '⌘K' : 'Ctrl+K';
}
