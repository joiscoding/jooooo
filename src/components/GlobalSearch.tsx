import { useMemo } from 'react';
import { useSearch } from '../context/SearchContext';

function useShortcutHint(): string {
  return useMemo(() => {
    if (typeof navigator === 'undefined') {
      return 'Ctrl+K';
    }
    const platform = navigator.platform?.toLowerCase() ?? '';
    const ua = navigator.userAgent.toLowerCase();
    const isApple =
      platform.includes('mac') ||
      platform.includes('iphone') ||
      platform.includes('ipad') ||
      ua.includes('mac os');
    return isApple ? '⌘K' : 'Ctrl+K';
  }, []);
}

export function GlobalSearch() {
  const { query, setQuery, searchInputRef } = useSearch();
  const shortcutHint = useShortcutHint();

  return (
    <div className="global-search" role="search">
      <label className="global-search-label" htmlFor="global-search-input">
        Search looks
      </label>
      <div className="global-search-field">
        <input
          id="global-search-input"
          ref={searchInputRef}
          type="search"
          className="global-search-input"
          placeholder="Search looks…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-keyshortcuts={shortcutHint.includes('⌘') ? 'Meta+K' : 'Control+K'}
        />
        <kbd className="global-search-kbd" aria-hidden="true">
          {shortcutHint}
        </kbd>
      </div>
    </div>
  );
}
