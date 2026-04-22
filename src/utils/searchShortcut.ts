/**
 * Whether the key event should open/focus the global app search.
 * Meta+K (Cmd on macOS) or Ctrl+K (Windows/Linux).
 */
export function isSearchFocusShortcut(event: KeyboardEvent): boolean {
  if (event.key !== 'k' && event.key !== 'K') {
    return false;
  }
  if (event.repeat) {
    return false;
  }
  if (event.metaKey) {
    return true;
  }
  if (event.ctrlKey) {
    return true;
  }
  return false;
}

export function isEditableEventTarget(
  eventTarget: EventTarget | null,
  searchInputId: string
): boolean {
  if (!(eventTarget instanceof HTMLElement)) {
    return false;
  }
  const el = eventTarget;
  if (el.id === searchInputId) {
    return false;
  }
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    return !el.readOnly && !el.disabled;
  }
  if (el instanceof HTMLElement && el.isContentEditable) {
    return true;
  }
  return false;
}
