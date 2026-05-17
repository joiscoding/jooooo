/**
 * Shared logic for the global search keyboard shortcut (⌘/Ctrl+K).
 * Kept pure so it can be covered by unit tests without a DOM.
 */

export type ShortcutKeyboardLike = Pick<
  KeyboardEvent,
  'key' | 'metaKey' | 'ctrlKey' | 'repeat' | 'defaultPrevented'
>;

export function isGlobalSearchFocusShortcut(
  event: ShortcutKeyboardLike,
): boolean {
  if (event.defaultPrevented || event.repeat) return false;
  if (event.key !== 'k' && event.key !== 'K') return false;
  return event.metaKey || event.ctrlKey;
}

const SEARCH_INPUT_SELECTOR = '[data-global-search-input]';

/**
 * Returns true when the event target is an editable field other than our
 * global search input, so we do not steal focus from normal form typing.
 */
export function isOtherEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.closest(SEARCH_INPUT_SELECTOR)) return false;

  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  if (target.isContentEditable) return true;
  return false;
}
