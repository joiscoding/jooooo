import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const isHome = pathname === '/';

  return (
    <div className="layout">
      <div className="promo-bar" role="region" aria-label="Promotion">
        <p>
          New season edit — explore the lookbook.{' '}
          <Link to="/" className="promo-bar-link">
            Shop the gallery
          </Link>
        </p>
      </div>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="logo" aria-label="Studio Lookbook home">
            studio lookbook
          </Link>
          <nav className="nav" aria-label="Primary">
            <Link
              to="/"
              className={isHome ? 'nav-link active' : 'nav-link'}
            >
              What&apos;s New
            </Link>
            <Link
              to="/#shop-by-style"
              className="nav-link"
            >
              Men
            </Link>
            <Link
              to="/albums"
              className={isAlbums ? 'nav-link active' : 'nav-link'}
            >
              Saved Looks
            </Link>
          </nav>
          <div className="header-utils" aria-hidden="true">
            <span className="header-util">Search</span>
            <span className="header-util">Bag (0)</span>
          </div>
        </div>
      </header>
      <main className={`main ${isHome ? 'main--landing' : ''}`}>{children}</main>
      <footer className="site-footer">
        <div className="footer-grid">
          <div className="footer-col">
            <h3 className="footer-heading">Help</h3>
            <ul className="footer-links">
              <li>
                <a href="#order">Order Status</a>
              </li>
              <li>
                <a href="#shipping">Shipping</a>
              </li>
              <li>
                <a href="#returns">Returns</a>
              </li>
              <li>
                <a href="#contact">Contact Us</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h3 className="footer-heading">About</h3>
            <ul className="footer-links">
              <li>
                <a href="#story">Our Story</a>
              </li>
              <li>
                <Link to="/">Lookbook</Link>
              </li>
              <li>
                <Link to="/albums">Albums</Link>
              </li>
            </ul>
          </div>
          <div className="footer-col footer-col--wide">
            <h3 className="footer-heading">Email Sign Up</h3>
            <p className="footer-copy">
              Get look drops, styling notes, and seasonal edits.
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            Demo — photos via{' '}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unsplash
            </a>
            . Designed for movement and everyday wear.
          </p>
        </div>
      </footer>
    </div>
  );
}
