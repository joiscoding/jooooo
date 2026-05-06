import { useRef } from 'react';
import type { RefObject } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { CopyLinkButton } from './CopyLinkButton';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const menuRef = useRef<HTMLDetailsElement>(null);

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
        </Link>
        <div className="header-right">
          <nav className="nav" aria-label="Main">
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
          <HeaderOverflowMenu menuRef={menuRef} />
        </div>
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

function HeaderOverflowMenu({
  menuRef,
}: {
  menuRef: RefObject<HTMLDetailsElement | null>;
}) {
  function closeMenu() {
    const el = menuRef.current;
    if (el) el.open = false;
  }

  return (
    <details ref={menuRef} className="header-overflow">
      <summary
        className="header-overflow-trigger"
        aria-label="Page actions"
        title="Page actions"
      >
        <span aria-hidden>⋯</span>
      </summary>
      <div className="header-overflow-panel" role="presentation">
        <CopyLinkButton
          className="header-overflow-item"
          label="Copy link"
          onCopied={() => closeMenu()}
        />
      </div>
    </details>
  );
}
