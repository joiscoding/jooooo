import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useSearch } from '../context/SearchContext';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const { query, setQuery, searchInputRef, shortcutHint } = useSearch();

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
        </Link>
        <div className="header-search-wrap">
          <label className="header-search" htmlFor="global-search">
            <span className="visually-hidden">Search looks</span>
            <input
              ref={searchInputRef}
              id="global-search"
              type="search"
              name="q"
              className="header-search-input"
              placeholder="Search looks…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              enterKeyHint="search"
            />
            <kbd className="header-search-kbd" aria-hidden="true">
              {shortcutHint}
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
