import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAlbumsContext } from '../context/AlbumsContext';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { albums } = useAlbumsContext();
  const isAlbums = pathname.startsWith('/albums');
  const isGallery = pathname === '/' || pathname.startsWith('/look/');

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="wordmark" aria-label="Studio home">
          Studio
        </Link>
        <nav className="nav caps" aria-label="Primary">
          <Link to="/" className={isGallery ? 'nav-link active' : 'nav-link'}>
            Men
          </Link>
          <Link
            to="/albums"
            className={isAlbums ? 'nav-link active' : 'nav-link'}
          >
            Albums ({albums.length})
          </Link>
        </nav>
      </header>
      <main className="main">{children}</main>
      <footer className="site-footer caps">
        <ul className="footer-links">
          <li>
            <Link to="/">Lookbook</Link>
          </li>
          <li>
            <Link to="/albums">Albums</Link>
          </li>
          <li>
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Photography
            </a>
          </li>
        </ul>
        <p className="legal">Demo. Photos via Unsplash. Saved locally.</p>
      </footer>
    </div>
  );
}
