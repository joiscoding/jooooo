import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { CopyLinkButton } from './CopyLinkButton';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
        </Link>
        <div className="header-right">
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
          <details className="header-overflow">
            <summary className="header-overflow-trigger" aria-label="More">
              More
            </summary>
            <div className="header-overflow-panel">
              <CopyLinkButton
                targetPath={pathname}
                className="header-overflow-item"
                aria-label="Copy link to current page"
              >
                Copy link
              </CopyLinkButton>
            </div>
          </details>
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
