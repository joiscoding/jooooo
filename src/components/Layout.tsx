import { Link, useLocation } from 'react-router-dom';
import { useCallback, useEffect, useId, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useGallerySearch } from '../context/GallerySearchContext';
import {
  isGlobalSearchFocusShortcut,
  isOtherEditableTarget,
} from '../utils/globalSearchShortcut';

function searchShortcutLabel(): '⌘K' | 'Ctrl+K' {
  return /Mac|iPhone|iPod|iPad/i.test(navigator.userAgent) ? '⌘K' : 'Ctrl+K';
}

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const { query, setQuery, focusSearchInput, searchInputRef } =
    useGallerySearch();
  const searchFieldId = useId();
  const shortcutLabel = useMemo(() => searchShortcutLabel(), []);

  const onSearchKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (isGlobalSearchFocusShortcut(event.nativeEvent)) {
        event.preventDefault();
        focusSearchInput();
      }
    },
    [focusSearchInput],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isGlobalSearchFocusShortcut(event)) return;
      if (isOtherEditableTarget(event.target)) return;
      event.preventDefault();
      focusSearchInput();
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [focusSearchInput]);

  const shortcutParts = useMemo(() => {
    if (shortcutLabel === '⌘K') return ['⌘', 'K'] as const;
    return ['Ctrl', 'K'] as const;
  }, [shortcutLabel]);

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
        </Link>
        <div className="header-search">
          <label htmlFor={searchFieldId} className="visually-hidden">
            Search looks
          </label>
          <input
            ref={searchInputRef}
            id={searchFieldId}
            type="search"
            name="q"
            enterKeyHint="search"
            autoComplete="off"
            spellCheck={false}
            data-global-search-input
            className="header-search-input"
            placeholder="Search looks…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onSearchKeyDown}
          />
          <span className="search-shortcut-hint" aria-hidden>
            {shortcutParts[0] === 'Ctrl' ? (
              <>
                <kbd className="kbd">Ctrl</kbd>
                <span className="kbd-plus">+</span>
                <kbd className="kbd">K</kbd>
              </>
            ) : (
              <>
                <kbd className="kbd">{shortcutParts[0]}</kbd>
                <kbd className="kbd">{shortcutParts[1]}</kbd>
              </>
            )}
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
