import { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useSearch } from '../context/SearchContext';
import { isGlobalSearchFocusShortcut } from '../utils/searchShortcut';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const { query, setQuery, focusSearchInput, searchInputRef } = useSearch();

  const isApplePlatform = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    return /Mac|iPhone|iPod|iPad/i.test(navigator.platform);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isGlobalSearchFocusShortcut(event)) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      focusSearchInput();
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [focusSearchInput]);

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
        </Link>
        <div className="header-search">
          <label className="search-field-label" htmlFor="global-search-input">
            <span className="visually-hidden">Search looks</span>
            <input
              id="global-search-input"
              ref={searchInputRef}
              type="search"
              className="search-input"
              placeholder="Search looks…"
              autoComplete="off"
              spellCheck={false}
              enterKeyHint="search"
              aria-keyshortcuts="Meta+K Control+K"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <span className="search-kbd-hint" aria-hidden="true">
              <kbd className="search-kbd">{isApplePlatform ? '⌘' : 'Ctrl'}</kbd>
              <kbd className="search-kbd">K</kbd>
            </span>
          </label>
        </div>
        <nav className="nav">
          <Link
            to="/"
            className={pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            Gallery
          </Link>
          <Link
            to="/albums"
            className={isAlbums ? 'nav-link active' : 'nav-link'}
          >
            Albums
          </Link>
        </nav>
      </header>
      <main className="main">{children}</main>
      <footer className="site-footer">
        <p>
          Demo — photos via{' '}
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Unsplash
          </a>
          . Modern style, designed to last.
        </p>
      </footer>
    </div>
  );
}
