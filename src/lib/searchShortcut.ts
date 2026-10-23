/** True when the user pressed the global search focus shortcut (⌘K / Ctrl+K). */
export function isSearchFocusShortcut(event: KeyboardEvent): boolean {
  if (event.key !== 'k' && event.key !== 'K') {
    return false;
  }
  if (event.altKey || event.shiftKey) {
    return false;
  }
  return event.metaKey || event.ctrlKey;
}
