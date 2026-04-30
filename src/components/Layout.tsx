import { Link, useLocation } from 'react-router-dom';
import { useCallback, useEffect, useId, useMemo, type ReactNode } from 'react';
import { useSearch } from '../context/SearchContext';
import { isSearchFocusShortcut } from '../lib/isSearchFocusShortcut';
import { isTypingSurface } from '../lib/isTypingSurface';

function useSearchShortcutHint(): string {
  return useMemo(() => {
    if (typeof navigator === 'undefined') return 'Ctrl K';
    const platform = navigator.platform ?? '';
    const isApple = /Mac|iPhone|iPod|iPad/i.test(platform);
    return isApple ? '⌘K' : 'Ctrl K';
  }, []);
}

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const { searchQuery, setSearchQuery, searchInputRef, focusSearch } =
    useSearch();
  const searchId = useId();
  const shortcutHint = useSearchShortcutHint();

  const onGlobalSearchKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isSearchFocusShortcut(e)) return;

      const active = document.activeElement;
      const input = searchInputRef.current;
      const typingElsewhere =
        isTypingSurface(active) && active !== input && !input?.contains(active);

      if (typingElsewhere) return;

      e.preventDefault();
      focusSearch();
    },
    [focusSearch, searchInputRef],
  );

  useEffect(() => {
    window.addEventListener('keydown', onGlobalSearchKeyDown);
    return () => window.removeEventListener('keydown', onGlobalSearchKeyDown);
  }, [onGlobalSearchKeyDown]);

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
        </Link>
        <div className="header-search-wrap">
          <label htmlFor={searchId} className="visually-hidden">
            Search looks
          </label>
          <input
            id={searchId}
            ref={searchInputRef}
            type="search"
            className="header-search-input"
            placeholder="Search looks…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            aria-describedby={`${searchId}-hint`}
            enterKeyHint="search"
          />
          <span id={`${searchId}-hint`} className="header-search-kbd">
            <span className="visually-hidden">Keyboard shortcut </span>
            {shortcutHint}
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
