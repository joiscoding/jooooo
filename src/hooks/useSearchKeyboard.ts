import { useEffect } from 'react';
import { useSearch } from '../context/SearchContext';
import { isFocusSearchShortcut } from '../utils/isFocusSearchShortcut';

function isEditableTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  if (el.isContentEditable) return true;
  const tag = el.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
  const role = el.getAttribute('role');
  return role === 'textbox' || role === 'combobox' || role === 'searchbox';
}

/**
 * Registers ⌘K / Ctrl+K to focus the global search field.
 * Skips when focus is in another editable control so we avoid hijacking typing shortcuts.
 */
export function useSearchKeyboard() {
  const { inputRef, focusSearch } = useSearch();

  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (!isFocusSearchShortcut(ev)) return;
      const target = ev.target;
      const input = inputRef.current;
      if (isEditableTarget(target) && target !== input) return;
      ev.preventDefault();
      focusSearch();
    };

    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [focusSearch, inputRef]);
}
