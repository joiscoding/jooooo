import { useId } from 'react';
import { useSearch } from '../context/SearchContext';
import { getSearchShortcutParts } from '../utils/globalSearchShortcut';

export function GlobalSearchField() {
  const { query, setQuery, searchInputRef } = useSearch();
  const labelId = useId();
  const { modifier, key } = getSearchShortcutParts();

  return (
    <div className="global-search-wrap">
      <label id={labelId} className="visually-hidden" htmlFor="global-search">
        Search looks
      </label>
      <div className="global-search-inner">
        <span className="global-search-icon" aria-hidden>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M16.5 16.5 21 21"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <input
          ref={searchInputRef}
          id="global-search"
          className="global-search-input"
          type="search"
          name="q"
          role="searchbox"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          placeholder="Search looks…"
          aria-labelledby={labelId}
          aria-keyshortcuts="Meta+K Control+K"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="global-search-kbd" aria-hidden>
          <kbd>{modifier}</kbd>
          <kbd>{key}</kbd>
        </span>
      </div>
    </div>
  );
}
