import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className={`layout${isHome ? ' layout--home' : ''}`}>
      <header className="site-header">
        <nav className="nav nav--left" aria-label="Primary left">
          <Link
            to="/"
            className={pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            The Collection
          </Link>
        </nav>
        <Link to="/" className="logo" aria-label="Home">
          STUDIO
        </Link>
        <nav className="nav nav--right" aria-label="Primary right">
          <Link
            to="/albums"
            className={isAlbums ? 'nav-link active' : 'nav-link'}
          >
            Albums
          </Link>
        </nav>
      </header>
      <main className="main">{children}</main>
      {isHome ? (
        <footer className="site-footer site-footer--zara">
          <div className="footer-grid">
            <div className="footer-col">
              <p className="footer-heading">Help</p>
              <a href="#help">Customer service</a>
              <a href="#help">Size guide</a>
            </div>
            <div className="footer-col">
              <p className="footer-heading">Follow us</p>
              <a href="#social">Newsletter</a>
              <a href="#social">Instagram</a>
            </div>
            <div className="footer-col">
              <p className="footer-heading">Company</p>
              <a href="#company">About</a>
              <a
                href="https://unsplash.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Photos via Unsplash
              </a>
            </div>
          </div>
          <p className="footer-legal">© 2026 Studio Lookbook. All rights reserved.</p>
        </footer>
      ) : (
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
            .
          </p>
        </footer>
      )}
    </div>
  );
}
