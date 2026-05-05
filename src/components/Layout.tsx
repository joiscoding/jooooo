import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useId, useRef } from 'react';
import { useSearch } from '../context/SearchContext';
import { isSearchFocusShortcut } from '../utils/isSearchFocusShortcut';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const {
    query,
    setQuery,
    registerFocusSearch,
    focusSearch,
  } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const labelId = useId();

  useEffect(() => {
    const unregister = registerFocusSearch(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
    return unregister;
  }, [registerFocusSearch]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isSearchFocusShortcut(event)) return;
      const target = event.target as Node | null;
      const editable =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          target.closest('[contenteditable="true"]'));
      if (editable) return;
      event.preventDefault();
      focusSearch();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [focusSearch]);

  const shortcutHint =
    typeof navigator !== 'undefined' &&
    /Mac|iPhone|iPod|iPad/i.test(navigator.platform)
      ? '⌘K'
      : 'Ctrl+K';

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
        </Link>
        <div className="header-search-wrap">
          <label htmlFor={labelId} className="sr-only">
            Search looks
          </label>
          <input
            ref={inputRef}
            id={labelId}
            type="search"
            className="header-search-input"
            placeholder="Search looks…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            enterKeyHint="search"
            autoComplete="off"
            spellCheck={false}
            aria-describedby={`${labelId}-hint`}
          />
          <span id={`${labelId}-hint`} className="header-search-kbd-hint">
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
