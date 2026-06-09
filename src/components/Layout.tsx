import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const isGallery = pathname === '/';

  return (
    <div className="layout">
      <div className="promo-bar" role="status">
        Free shipping on orders $100+
        <a href="#shop">Shop new arrivals</a>
      </div>
      <header className="site-header">
        <Link to="/" className="logo" aria-label="Studio Lookbook home">
          <span className="logo-mark" aria-hidden="true">S</span>
          <span className="logo-word">Studio</span>
        </Link>
        <nav className="nav" aria-label="Primary">
          <Link
            to="/"
            className={isGallery ? 'nav-link active' : 'nav-link'}
          >
            Men
          </Link>
          <Link
            to="/"
            className={isGallery ? 'nav-link active' : 'nav-link'}
          >
            Lookbooks
          </Link>
          <Link
            to="/albums"
            className={isAlbums ? 'nav-link active' : 'nav-link'}
          >
            Albums
          </Link>
        </nav>
        <div className="utility-nav">
          <button type="button" className="utility-link">Search</button>
          <Link to="/albums" className="utility-link utility-bag">
            Bag
            <span className="bag-count">0</span>
          </Link>
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
          . Built to move. Built to last.
        </p>
      </footer>
    </div>
  );
}
