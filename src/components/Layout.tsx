import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className={isHome ? 'layout layout-home' : 'layout'}>
      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="logo" aria-label="PulseFit Creative home">
            <span className="logo-mark">PF</span>
            <span className="logo-lockup">
              <span className="logo-serif">PulseFit</span>
              <span className="logo-sans">Creative system</span>
            </span>
          </Link>
          <nav className="nav" aria-label="Primary">
            <Link
              to="/"
              className={pathname === '/' ? 'nav-link active' : 'nav-link'}
            >
              Collection
            </Link>
            <Link
              to="/albums"
              className={isAlbums ? 'nav-link active' : 'nav-link'}
            >
              Albums
            </Link>
          </nav>
        </div>
      </header>
      <main className={isHome ? 'main main-home' : 'main'}>{children}</main>
      <footer className="site-footer">
        <div className="site-footer-inner">
          <div>
            <p className="footer-title">
              Premium campaign direction for boutique fitness brands.
            </p>
            <p className="footer-meta">
              Demo imagery via{' '}
              <a
                href="https://unsplash.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Unsplash
              </a>
              . Built as a polished creative system.
            </p>
          </div>
          <div className="footer-links">
            <Link to="/">Collection</Link>
            <Link to="/albums">Albums</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
