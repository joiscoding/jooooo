/** True when the event should open/focus the global search (⌘K / Ctrl+K). */
export function isGlobalSearchShortcut(ev: KeyboardEvent): boolean {
  if (ev.defaultPrevented || ev.repeat) return false;
  if (ev.key !== 'k' && ev.key !== 'K') return false;

  const isMac = typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform);
  const primary = isMac ? ev.metaKey : ev.ctrlKey;
  if (!primary) return false;
  if (isMac && ev.ctrlKey) return false;
  if (!isMac && ev.metaKey) return false;

  const el = ev.target;
  if (!(el instanceof HTMLElement)) return true;
  if (el.isContentEditable) return false;
  const tag = el.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return false;
  if (el.closest('[contenteditable="true"]')) return false;

  return true;
}
