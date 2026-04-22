import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const isHome = pathname === '/';

  return (
    <div className={isHome ? 'layout layout--home' : 'layout'}>
      <header className={isHome ? 'site-header site-header--editorial' : 'site-header'}>
        <Link to="/" className="logo">
          {isHome ? (
            <span className="logo-mono">STUDIO</span>
          ) : (
            <>
              <span className="logo-serif">Studio</span>
              <span className="logo-sans">Lookbook</span>
            </>
          )}
        </Link>
        <nav className="nav">
          <Link
            to="/"
            className={pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            {isHome ? 'New in' : 'Gallery'}
          </Link>
          <Link
            to="/albums"
            className={isAlbums ? 'nav-link active' : 'nav-link'}
          >
            Albums
          </Link>
        </nav>
      </header>
      <main className={isHome ? 'main main--bleed' : 'main'}>{children}</main>
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
