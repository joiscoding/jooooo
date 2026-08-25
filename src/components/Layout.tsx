import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className={isHome ? 'layout layout--home' : 'layout'}>
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-word">studio</span>
        </Link>
        <nav className="nav" aria-label="Primary">
          <Link
            to="/"
            className={pathname === '/' ? 'nav-link active' : 'nav-link'}
            aria-current={pathname === '/' ? 'page' : undefined}
          >
            Gallery
          </Link>
          <Link
            to="/albums"
            className={isAlbums ? 'nav-cta active' : 'nav-cta'}
            aria-current={isAlbums ? 'page' : undefined}
          >
            Albums
          </Link>
        </nav>
      </header>
      <main className={isHome ? 'main main--flush' : 'main'}>{children}</main>
      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <p className="footer-word">studio</p>
            <p className="muted">Men’s lookbook demo. Photos via Unsplash.</p>
          </div>
          <div>
            <p className="footer-heading">Product</p>
            <Link to="/">Gallery</Link>
            <Link to="/albums">Albums</Link>
          </div>
          <div>
            <p className="footer-heading">Source</p>
            <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">
              Photos via Unsplash
            </a>
            <span className="muted">Local albums only</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
