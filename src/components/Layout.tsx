import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const isHome = pathname === '/';

  return (
    <div className={isHome ? 'layout layout--home-sm' : 'layout'}>
      <div className="utility-bar">
        <span>Men’s systems · Lookbook demo</span>
        <span className="utility-bar-sep" aria-hidden="true">
          ·
        </span>
        <span>Support</span>
        <span className="utility-bar-sep" aria-hidden="true">
          ·
        </span>
        <span>Contact</span>
      </div>
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-mark" aria-hidden="true" />
          <span className="logo-word">
            <span className="logo-primary">Studio</span>
            <span className="logo-secondary">Lookbook</span>
          </span>
        </Link>
        <nav className="nav" aria-label="Primary">
          <Link
            to="/"
            className={pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            Lookbooks
          </Link>
          <a
            className="nav-link"
            href={isHome ? '#building-blocks' : '/#building-blocks'}
          >
            Building Blocks
          </a>
          <Link
            to="/albums"
            className={isAlbums ? 'nav-link active' : 'nav-link'}
          >
            Albums
          </Link>
          <a className="nav-link" href={isHome ? '#featured' : '/#featured'}>
            Featured
          </a>
        </nav>
      </header>
      <main className="main">{children}</main>
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="logo-mark" aria-hidden="true" />
            <span className="footer-brand-name">Studio Lookbook</span>
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
            . Inspired by enterprise product-site layouts; not affiliated with
            any hardware brand.
          </p>
        </div>
      </footer>
    </div>
  );
}
