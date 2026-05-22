import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const isHome = pathname === '/';

  return (
    <div className={`layout${isHome ? ' layout--home' : ''}`}>
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-mark" aria-hidden="true">
            <span className="logo-mark-shape" />
          </span>
          <span className="logo-wordmark">
            <span className="logo-wordmark-strong">Studio</span>
            <span className="logo-wordmark-sub">Lookbook</span>
          </span>
        </Link>
        <nav className="nav" aria-label="Primary">
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
        <div className="header-actions">
          <a className="header-link" href="/#gallery">
            View looks
          </a>
          <a className="btn-header-cta" href="/#contact">
            Get demo &amp; pricing
          </a>
        </div>
      </header>
      <main className={`main${isHome ? ' main--home' : ''}`}>{children}</main>
      <footer className="site-footer">
        <p>
          Demo — visual rhythm inspired by enterprise fitness software sites.
          Photos via{' '}
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Unsplash
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
