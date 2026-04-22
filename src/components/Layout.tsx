import { Link, useLocation } from 'react-router-dom';
import type { FormEvent, ReactNode } from 'react';
import { useSearch } from '../context/SearchContext';
import { useAppleKeyboardHint } from '../hooks/useAppleKeyboard';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const { searchQuery, setSearchQuery, searchInputRef, searchInputId } =
    useSearch();
  const { modifierLabel } = useAppleKeyboardHint();

  function onSearchFormSubmit(e: FormEvent) {
    e.preventDefault();
    const el = searchInputRef.current;
    if (el) {
      el.focus();
      el.select();
    }
  }

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
        </Link>
        <form
          className="header-search"
          onSubmit={onSearchFormSubmit}
          role="search"
          aria-label="Search looks in the gallery"
        >
          <input
            ref={searchInputRef}
            id={searchInputId}
            type="search"
            className="header-search-input"
            placeholder="Search looks"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
            enterKeyHint="search"
            aria-label="Search looks"
          />
          <div className="search-shortcut-hint" aria-hidden>
            <kbd className="kbd-pill">
              {modifierLabel}
            </kbd>
            <span className="search-shortcut-plus" aria-hidden>
              +
            </span>
            <kbd className="kbd-pill">K</kbd>
          </div>
        </form>
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
