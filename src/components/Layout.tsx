import { Link, useLocation } from 'react-router-dom';
import { useEffect, type ReactNode } from 'react';
import { useGallerySearch } from '../context/GallerySearchContext';
import { useShortcutModifierLabel } from '../hooks/useShortcutModifierLabel';
import { isGlobalSearchShortcut } from '../utils/isGlobalSearchShortcut';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const { query, setQuery, searchInputRef, focusGlobalSearch } =
    useGallerySearch();
  const modLabel = useShortcutModifierLabel();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isGlobalSearchShortcut(event)) return;
      event.preventDefault();
      focusGlobalSearch();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [focusGlobalSearch]);

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
        </Link>
        <div className="header-search">
          <label className="sr-only" htmlFor="global-gallery-search">
            Search looks
          </label>
          <div className="header-search-field">
            <input
              id="global-gallery-search"
              ref={searchInputRef}
              type="search"
              name="q"
              className="header-search-input"
              placeholder="Search looks…"
              autoComplete="off"
              spellCheck={false}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-describedby="global-search-shortcut-hint"
            />
            <span
              id="global-search-shortcut-hint"
              className="header-search-kbd"
              title={`Focus search (${modLabel}+K)`}
            >
              <kbd className="kbd-chip">{modLabel}</kbd>
              <kbd className="kbd-chip">K</kbd>
            </span>
          </div>
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
