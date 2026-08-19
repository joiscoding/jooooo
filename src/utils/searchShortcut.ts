/**
 * Detect ⌘K (macOS) or Ctrl+K (Windows/Linux) for focusing global search.
 * Call preventDefault on matching events to avoid browser shortcuts where possible.
 */
export function isSearchFocusShortcut(event: KeyboardEvent): boolean {
  const key = event.key.toLowerCase();
  if (key !== 'k') return false;

  const isMac =
    typeof navigator !== 'undefined' &&
  (navigator.platform?.includes('Mac') ||
    /Mac|iPhone|iPad|iPod/.test(navigator.userAgent));

  if (isMac) {
    return event.metaKey && !event.ctrlKey && !event.altKey;
  }

  return event.ctrlKey && !event.metaKey && !event.altKey;
}

/** Platform-specific shortcut label for UI hints. */
export function getSearchShortcutLabel(): string {
  const isMac =
    typeof navigator !== 'undefined' &&
    (navigator.platform?.includes('Mac') ||
      /Mac|iPhone|iPad|iPod/.test(navigator.userAgent));

  return isMac ? '⌘K' : 'Ctrl+K';
}
