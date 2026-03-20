import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const isLookbook = pathname === '/lookbook' || pathname.startsWith('/look/');
  const isLanding = pathname === '/';

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-serif">Fasco</span>
          <span className="logo-sans">Fashion</span>
        </Link>
        <nav className="nav">
          <Link
            to="/"
            className={isLanding ? 'nav-link active' : 'nav-link'}
          >
            Home
          </Link>
          <Link
            to="/lookbook"
            className={isLookbook ? 'nav-link active' : 'nav-link'}
          >
            Lookbook
          </Link>
          <Link
            to="/albums"
            className={isAlbums ? 'nav-link active' : 'nav-link'}
          >
            Albums
          </Link>
        </nav>
      </header>
      <main className={isLanding ? 'main main--landing' : 'main'}>{children}</main>
      <footer className="site-footer">
        <p>
          Fasco — inspired by the community Figma template. Photography on the
          landing page from{' '}
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
