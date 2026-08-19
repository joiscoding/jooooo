import { useEffect, useRef } from 'react';
import { getSearchShortcutLabel } from '../utils/searchShortcut';
import { useSearch } from '../context/SearchContext';

export function GlobalSearch() {
  const { query, setQuery, registerSearchInput } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const shortcutLabel = getSearchShortcutLabel();

  useEffect(() => {
    registerSearchInput(inputRef.current);
    return () => registerSearchInput(null);
  }, [registerSearchInput]);

  return (
    <div className="global-search" role="search">
      <label htmlFor="global-search-input" className="global-search-label">
        Search looks
      </label>
      <div className="global-search-field">
        <input
          ref={inputRef}
          id="global-search-input"
          type="search"
          className="global-search-input"
          placeholder="Search looks…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-keyshortcuts={shortcutLabel}
          aria-describedby="global-search-hint"
        />
        <kbd
          id="global-search-hint"
          className="global-search-kbd"
          aria-label={`Keyboard shortcut: ${shortcutLabel}`}
        >
          {shortcutLabel}
        </kbd>
      </div>
    </div>
  );
}
