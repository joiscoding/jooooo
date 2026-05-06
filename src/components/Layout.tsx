import { Link, useLocation } from 'react-router-dom';
import { useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useSearch } from '../context/SearchContext';
import { isSearchFocusShortcut } from '../utils/searchShortcut';

function useIsMac(): boolean {
  return (
    typeof navigator !== 'undefined' &&
    /Mac|iPhone|iPod|iPad/i.test(navigator.platform)
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const { query, setQuery } = useSearch();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isMac = useIsMac();

  const focusSearch = useCallback(() => {
    const el = searchInputRef.current;
    if (!el) return;
    el.focus();
    el.select();
  }, []);

  useEffect(() => {
    function onKeyDown(ev: KeyboardEvent) {
      if (!isSearchFocusShortcut(ev)) return;
      ev.preventDefault();
      focusSearch();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [focusSearch]);

  const shortcutLabel = isMac ? '⌘K' : 'Ctrl+K';

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
        </Link>
        <div className="header-search-wrap">
          <label className="header-search" htmlFor="global-search-input">
            <span className="visually-hidden">Search looks</span>
            <input
              id="global-search-input"
              ref={searchInputRef}
              type="search"
              className="header-search-input"
              placeholder="Search looks…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              aria-describedby="global-search-shortcut-hint"
            />
            <kbd className="search-shortcut-kbd" id="global-search-shortcut-hint">
              {shortcutLabel}
            </kbd>
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
