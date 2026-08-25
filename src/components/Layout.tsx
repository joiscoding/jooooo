import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-mark" aria-hidden="true">
            <span />
            <span />
          </span>
          <span>Studio Lookbook</span>
        </Link>
        <nav className="nav" aria-label="Primary navigation">
          <Link
            to="/"
            className={pathname === '/' ? 'nav-link active' : 'nav-link'}
            aria-current={pathname === '/' ? 'page' : undefined}
          >
            Explore
          </Link>
          <Link
            to="/albums"
            className={isAlbums ? 'nav-link nav-link-primary active' : 'nav-link nav-link-primary'}
            aria-current={isAlbums ? 'page' : undefined}
          >
            Albums
          </Link>
        </nav>
      </header>
      <main className={isHome ? 'main home-main' : 'main'}>{children}</main>
      <footer className="site-footer">
        <div>
          <Link to="/" className="footer-brand">
            Studio Lookbook
          </Link>
          <p>Modern menswear, edited for everyday life.</p>
        </div>
        <div className="footer-links">
          <Link to="/">Explore</Link>
          <Link to="/albums">Albums</Link>
          <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">
            Photography
          </a>
        </div>
      </footer>
    </div>
  );
}
