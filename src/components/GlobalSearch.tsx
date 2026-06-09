import { useEffect, useId } from 'react';
import { useSearch } from '../context/SearchContext';
import { getSearchShortcutLabel, isFocusSearchHotkey } from '../utils/searchHotkey';

export function GlobalSearch() {
  const { query, setQuery, searchInputRef } = useSearch();
  const inputId = useId();
  const hintId = `${inputId}-hint`;
  const shortcutLabel = getSearchShortcutLabel();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!isFocusSearchHotkey(e)) return;

      const target = e.target as Node | null;
      const el = searchInputRef.current;
      if (!el) return;

      const tag =
        target instanceof Element ? target.tagName.toLowerCase() : '';
      const editable =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          tag === 'input' ||
          tag === 'textarea' ||
          tag === 'select');

      if (editable && target !== el) {
        return;
      }

      e.preventDefault();
      el.focus();
      el.select();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [searchInputRef]);

  return (
    <div className="global-search" role="search">
      <label htmlFor={inputId} className="visually-hidden">
        Search looks
      </label>
      <div className="global-search-field">
        <input
          ref={searchInputRef}
          id={inputId}
          type="search"
          name="q"
          className="global-search-input"
          placeholder="Search looks…"
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-describedby={hintId}
        />
        <span id={hintId} className="visually-hidden">
          Keyboard shortcut: {shortcutLabel}
        </span>
        <kbd className="global-search-kbd" aria-hidden="true">
          {shortcutLabel}
        </kbd>
      </div>
    </div>
  );
}
