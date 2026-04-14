import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const isHome = pathname === '/';

  return (
    <div className={`layout${isHome ? ' layout--home-zara' : ''}`}>
      <header className="site-header">
        <Link to="/" className="logo">
          {isHome ? (
            <span className="logo-zara">Lookbook</span>
          ) : (
            <>
              <span className="logo-serif">Studio</span>
              <span className="logo-sans">Lookbook</span>
            </>
          )}
        </Link>
        <nav className="nav" aria-label="Primary">
          <Link
            to="/"
            className={pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            {isHome ? 'Collection' : 'Gallery'}
          </Link>
          <Link
            to="/albums"
            className={isAlbums ? 'nav-link active' : 'nav-link'}
          >
            Albums
          </Link>
        </nav>
      </header>
      <main className="main">{children}</main>
      <footer className={`site-footer${isHome ? ' site-footer--zara' : ''}`}>
        {isHome ? (
          <p>
            Photos{' '}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unsplash
            </a>
            . Demo storefront layout.
          </p>
        ) : (
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
        )}
      </footer>
    </div>
  );
}
