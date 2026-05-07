import { useEffect, useId, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useGallerySearch } from '../context/GallerySearchContext';
import { useGlobalSearchShortcut } from '../hooks/useGlobalSearchShortcut';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const { query, setQuery, focusSearchInput, searchInputRef } = useGallerySearch();
  const searchFieldId = useId();
  const [modHint, setModHint] = useState('⌘');

  useGlobalSearchShortcut(focusSearchInput);

  useEffect(() => {
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
    setModHint(/Mac|iPhone|iPad|iPod/i.test(ua) ? '⌘' : 'Ctrl');
  }, []);

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
        </Link>
        <div className="header-search">
          <label htmlFor={searchFieldId} className="sr-only">
            Search looks
          </label>
          <input
            id={searchFieldId}
            ref={searchInputRef}
            type="search"
            className="global-search-input"
            placeholder="Search looks…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            aria-describedby={`${searchFieldId}-shortcut-hint`}
            enterKeyHint="search"
          />
          <span id={`${searchFieldId}-shortcut-hint`} className="global-search-kbd" title="Focus this field">
            <kbd className="kbd-key">{modHint}</kbd>
            <kbd className="kbd-key">K</kbd>
          </span>
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
