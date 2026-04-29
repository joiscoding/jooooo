/** Input types that capture typing; we avoid hijacking shortcuts there (except our own search box). */
const EDITABLE_SELECTOR =
  'input:not([readonly]), textarea:not([readonly]), select, [contenteditable="true"]';

export function isEditableShortcutTarget(
  target: EventTarget | null,
  searchInput: HTMLInputElement | null,
): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const field = target.closest(EDITABLE_SELECTOR);
  if (!field || !(field instanceof HTMLElement)) return false;
  if (searchInput && field === searchInput) return false;
  return true;
}

/**
 * True when the user pressed the app-wide “focus search” chord (⌘K / Ctrl+K).
 * Ignores key repeat. Uses capture-phase listeners with preventDefault to avoid
 * browser defaults (e.g. Ctrl+K focusing the address bar) when we handle the event.
 */
export function isGlobalSearchFocusShortcut(event: KeyboardEvent): boolean {
  if (event.repeat) return false;
  if (event.key !== 'k' && event.key !== 'K') return false;
  if (!event.metaKey && !event.ctrlKey) return false;
  if (event.altKey) return false;
  return true;
}

export function getSearchShortcutHint(): string {
  const p =
    typeof navigator !== 'undefined'
      ? (navigator.userAgentData?.platform ?? navigator.platform ?? '')
      : '';
  return /mac/i.test(p) ? '⌘K' : 'Ctrl+K';
}
