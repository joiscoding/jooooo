import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout">
      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="logo">
            <span className="logo-serif">Studio</span>
            <span className="logo-sans">Lookbook</span>
          </Link>
          <nav className="nav">
            <Link to="/" className={isHome ? 'nav-link active' : 'nav-link'}>
              Gallery
            </Link>
            <Link
              to="/albums"
              className={isAlbums ? 'nav-link active' : 'nav-link'}
            >
              Albums
            </Link>
          </nav>
          <Link to="/albums" className="btn-cta header-cta">
            Create an album
          </Link>
        </div>
      </header>
      <main className={isHome ? 'main main-full' : 'main'}>{children}</main>
      <footer className="site-footer">
        <button
          type="button"
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Back to top
        </button>
        <div className="footer-inner">
          <div className="footer-col">
            <h2 className="footer-heading">Explore</h2>
            <Link to="/">Gallery</Link>
            <Link to="/albums">Albums</Link>
          </div>
          <div className="footer-col">
            <h2 className="footer-heading">Credits</h2>
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Photos via Unsplash
            </a>
          </div>
          <p className="footer-legal">
            Demo only. Modern style, designed to last.
          </p>
        </div>
      </footer>
    </div>
  );
}
