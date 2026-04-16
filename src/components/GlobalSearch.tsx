import { useMemo } from 'react';
import { useSearch } from '../context/SearchContext';

function shortcutHintLabel(): string {
  if (typeof navigator === 'undefined') return 'Ctrl+K';
  const p = navigator.platform ?? '';
  return /Mac|iPhone|iPad|iPod/.test(p) ? '⌘K' : 'Ctrl+K';
}

export function GlobalSearch() {
  const { query, setQuery, inputRef } = useSearch();
  const hint = useMemo(() => shortcutHintLabel(), []);

  return (
    <div className="global-search">
      <label className="global-search-label visually-hidden" htmlFor="global-search-input">
        Search looks
      </label>
      <div className="global-search-field">
        <span className="global-search-icon" aria-hidden="true">
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
          ref={inputRef}
          id="global-search-input"
          className="global-search-input"
          type="search"
          role="searchbox"
          name="q"
          placeholder="Search looks…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          aria-describedby="global-search-shortcut-hint"
        />
        <kbd id="global-search-shortcut-hint" className="global-search-kbd">
          {hint}
        </kbd>
      </div>
    </div>
  );
}
