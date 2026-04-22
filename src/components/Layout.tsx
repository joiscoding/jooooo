import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');

  const isHome = pathname === '/';

  return (
    <div className="layout layout--retail">
      <div className="promo-bar" role="status">
        <span className="promo-bar__msg">
          Free delivery on lookbook orders · New drops weekly
        </span>
        <a href="#main-content" className="promo-bar__link">
          Shop the edit
        </a>
      </div>

      <header className="site-header site-header--retail">
        <div className="site-header__row">
          <div className="site-header__left">
            <button
              type="button"
              className="icon-btn"
              aria-label="Menu (visual only)"
            >
              <span className="icon-hamburger" aria-hidden="true" />
            </button>
            <Link to="/" className="logo logo--retail" aria-label="Home">
              Lookbook
            </Link>
          </div>
          <nav className="nav nav--retail" aria-label="Primary">
            <Link
              to="/"
              className={isHome ? 'nav-link active' : 'nav-link'}
            >
              The edit
            </Link>
            <Link
              to="/albums"
              className={isAlbums ? 'nav-link active' : 'nav-link'}
            >
              Favourites
            </Link>
          </nav>
          <div className="site-header__right">
            <button
              type="button"
              className="icon-btn"
              aria-label="Search (visual only)"
            >
              <span className="icon-search" aria-hidden="true" />
            </button>
            <span className="icon-btn" aria-hidden="true" title="Account">
              <span className="icon-user" />
            </span>
            <span className="icon-btn" aria-hidden="true" title="Bag">
              <span className="icon-bag" />
            </span>
          </div>
        </div>
      </header>
      <main
        className={isHome ? 'main main--bleed' : 'main'}
        id="main-content"
      >
        {children}
      </main>
      <footer className="site-footer site-footer--retail">
        <div className="footer-grid">
          <div>
            <h2 className="footer-heading">Help</h2>
            <ul className="footer-links">
              <li>
                <a href="https://unsplash.com" target="_blank" rel="noopener">
                  Image credits
                </a>
              </li>
              <li>
                <a href="#main-content">Size guide</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="footer-heading">About</h2>
            <ul className="footer-links">
              <li>
                <a href="#main-content">Sustainability</a>
              </li>
              <li>
                <a href="#main-content">Careers</a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="footer-heading">Follow</h2>
            <ul className="footer-links">
              <li>
                <a href="#main-content">Newsletter</a>
              </li>
            </ul>
          </div>
        </div>
        <p className="site-footer__fineprint">
          Demo lookbook — photos via{' '}
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Unsplash
          </a>
          . Inspired by high-street fashion retail layout.
        </p>
      </footer>
    </div>
  );
}
