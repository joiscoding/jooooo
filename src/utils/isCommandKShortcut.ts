/**
 * True when the key event should trigger the global search shortcut (⌘K / Ctrl+K).
 * Skips when the user is typing in another editable control.
 */
export function isCommandKShortcut(
  event: KeyboardEvent,
  globalSearchInputId: string,
): boolean {
  if (!(event.key === 'k' || event.key === 'K')) return false;
  const metaOrCtrl = event.metaKey || event.ctrlKey;
  if (!metaOrCtrl) return false;
  if (event.altKey || event.shiftKey) return false;

  const target = event.target;
  if (target instanceof HTMLElement) {
    if (target.id === globalSearchInputId) return true;
    if (target.closest(`#${globalSearchInputId}`)) return true;
    if (isEditableElement(target)) return false;
  }

  return true;
}

function isEditableElement(el: HTMLElement): boolean {
  const tag = el.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (el.isContentEditable) return true;
  return false;
}
