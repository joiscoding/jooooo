/**
 * Detects ⌘K (macOS) / Ctrl+K (Windows/Linux) for focusing global search.
 * Skips when the event target is an editable field so we do not block normal typing.
 */
export function isEditableElement(el: Element | null): boolean {
  if (!el) return false;
  if (
    el.closest(
      '[contenteditable="true"], [contenteditable="plaintext-only"]',
    )
  ) {
    return true;
  }
  const tag = el.tagName;
  if (tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (tag === 'INPUT') {
    const type = (el as HTMLInputElement).type?.toLowerCase() ?? 'text';
    const nonTextTypes = new Set([
      'button',
      'checkbox',
      'color',
      'file',
      'hidden',
      'image',
      'radio',
      'range',
      'reset',
      'submit',
    ]);
    return !nonTextTypes.has(type);
  }
  return false;
}

export function isSearchFocusShortcut(ev: KeyboardEvent): boolean {
  if (ev.repeat) return false;
  if (!ev.key || ev.key.toLowerCase() !== 'k') return false;
  if (!(ev.metaKey || ev.ctrlKey)) return false;
  if (ev.altKey || ev.shiftKey) return false;
  if (isEditableElement(ev.target as Element)) return false;
  return true;
}
