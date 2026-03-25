import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const isHome = pathname === '/';

  return (
    <div className="layout">
      {isHome && (
        <div className="rl-promo-bar">
          <span>Discover a World of Style&nbsp;&nbsp;·&nbsp;&nbsp;Spring / Summer 2026</span>
        </div>
      )}
      <header className={`site-header${isHome ? ' rl-header-transparent' : ''}`}>
        <Link to="/" className="logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
        </Link>
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
      <main className={isHome ? 'main main-full' : 'main'}>{children}</main>
      <footer className="site-footer">
        <div className="rl-footer-inner">
          <div className="rl-footer-brand">
            <span className="logo-serif">Studio</span>
            <span className="logo-sans">Lookbook</span>
          </div>
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
        </div>
      </footer>
    </div>
  );
}
