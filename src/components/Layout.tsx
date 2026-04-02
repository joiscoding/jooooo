import { useEffect, useId, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useSearch } from '../context/SearchContext';
import { isGlobalSearchFocusShortcut } from '../lib/globalSearchShortcut';

function useShortcutHintLabel(): string {
  if (typeof navigator === 'undefined') return 'Ctrl+K';
  const ua = navigator.userAgent;
  const platform = navigator.platform ?? '';
  const apple = /Mac|iPhone|iPad|iPod/i.test(ua) || platform === 'MacIntel';
  return apple ? '⌘K' : 'Ctrl+K';
}

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isAlbums = pathname.startsWith('/albums');
  const { searchQuery, setSearchQuery } = useSearch();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchLabelId = useId();
  const shortcutHint = useShortcutHintLabel();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!isGlobalSearchFocusShortcut(event)) return;
      event.preventDefault();
      event.stopPropagation();
      if (pathname !== '/') navigate('/');
      const el = searchInputRef.current;
      if (el) {
        el.focus();
        el.select();
      }
    }
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [navigate, pathname]);

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
        </Link>
        <div
          className="header-search"
          data-global-search="true"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setSearchQuery('');
              searchInputRef.current?.blur();
            }
          }}
        >
          <label htmlFor={searchLabelId} className="visually-hidden">
            Search looks
          </label>
          <input
            ref={searchInputRef}
            id={searchLabelId}
            type="search"
            className="global-search-input"
            placeholder="Search looks…"
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="search"
            aria-describedby={`${searchLabelId}-hint`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span id={`${searchLabelId}-hint`} className="search-shortcut-hint">
            <kbd className="kbd">{shortcutHint}</kbd>
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
