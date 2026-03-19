import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout">
      <div className="utility-bar">
        <p>Inspired by modern essentials retail: clearer value cues, calmer browsing.</p>
        <span>Free-flowing discovery · Premium visual rhythm</span>
      </div>
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
        </Link>
        <nav className="nav">
          <Link
            to="/"
            className={pathname === '/' ? 'nav-link active' : 'nav-link'}
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
        <div className="header-meta">Editorial, filterable, saveable looks</div>
      </header>
      <main className="main">{children}</main>
      <footer className="site-footer">
        <div className="site-footer-grid">
          <div>
            <p className="site-footer-label">Studio Lookbook</p>
            <p>
              A calmer, more curated browse flow inspired by modern essentials
              retail.
            </p>
          </div>
          <div>
            <p className="site-footer-label">What changed</p>
            <p>Editorial hero, trust messaging, clearer cards, and easier discovery.</p>
          </div>
          <div>
            <p className="site-footer-label">Image credit</p>
            <p>
              Photos via{' '}
              <a
                href="https://unsplash.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Unsplash
              </a>
              .
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
