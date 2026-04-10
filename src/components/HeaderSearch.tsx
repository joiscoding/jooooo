import { useCallback, useEffect, useRef } from 'react';
import { useSearch } from '../context/SearchContext';
import { isGlobalSearchShortcut } from '../lib/isGlobalSearchShortcut';

export function HeaderSearch() {
  const { query, setQuery, registerSearchInputRef, focusSearchInput } =
    useSearch();
  const localRef = useRef<HTMLInputElement | null>(null);

  const setRefs = useCallback(
    (el: HTMLInputElement | null) => {
      localRef.current = el;
      registerSearchInputRef(el);
    },
    [registerSearchInputRef],
  );

  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (!isGlobalSearchShortcut(ev)) return;
      ev.preventDefault();
      focusSearchInput();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [focusSearchInput]);

  const isMac =
    typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform);
  const shortcutLabel = isMac ? '⌘K' : 'Ctrl+K';

  return (
    <div className="header-search" role="search" aria-label="Search looks">
      <label htmlFor="global-search" className="visually-hidden">
        Search looks
      </label>
      <input
        ref={setRefs}
        id="global-search"
        type="search"
        className="header-search-input"
        placeholder="Search looks…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="search"
      />
      <kbd className="header-search-kbd" aria-hidden="true">
        {shortcutLabel}
      </kbd>
    </div>
  );
}
