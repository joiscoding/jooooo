import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const isHome = pathname === '/';

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-mark" aria-hidden="true" />
          <span className="logo-text">Studio Lookbook</span>
        </Link>
        <div className="header-right">
          <nav className="nav" aria-label="Primary">
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
          <Link
            to={isHome ? '#gallery' : '/#gallery'}
            className="btn btn-accent"
          >
            Browse looks
          </Link>
        </div>
      </header>
      <main className="main">
        {isHome ? children : <div className="main-inner">{children}</div>}
      </main>
      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="logo">
              <span className="logo-mark" aria-hidden="true" />
              <span className="logo-text">Studio Lookbook</span>
            </Link>
            <p>
              Editorial men&apos;s looks with five aesthetic filters. Save
              favorites to albums — no account required.
            </p>
          </div>
          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              <li>
                <Link to="/">Gallery</Link>
              </li>
              <li>
                <Link to="/albums">Albums</Link>
              </li>
              <li>
                <a href="#gallery">Style filters</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>About</h4>
            <ul>
              <li>
                <a
                  href="https://unsplash.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Photos via Unsplash
                </a>
              </li>
              <li>
                <span className="muted">Modern style, designed to last.</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Studio Lookbook — demo project</p>
          <p>
            Built with editorial calm. Inspired by{' '}
            <a
              href="https://cursor.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              cursor.com
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
