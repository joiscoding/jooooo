import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const isGallery = pathname.startsWith('/gallery');
  const isLookbookHome = pathname === '/';

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-abc">ABC</span>
          <span className="logo-fitness">Fitness</span>
        </Link>
        <nav className="nav">
          <Link
            to="/"
            className={isLookbookHome ? 'nav-link active' : 'nav-link'}
          >
            Lookbook
          </Link>
          <Link
            to="/gallery"
            className={isGallery ? 'nav-link active' : 'nav-link'}
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
      <main className="main">{children}</main>
      <footer className="site-footer">
        <p>
          ABC Fitness lookbook demo — imagery via{' '}
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Unsplash
          </a>
          . Train in style.
        </p>
      </footer>
    </div>
  );
}
