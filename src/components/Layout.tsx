import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const isHome = pathname === '/';

  return (
    <div className="layout">
      <div className="utility-bar" role="note">
        <p className="utility-bar__text">Free standard shipping on orders $75+</p>
        <a href="#main-content" className="utility-bar__skip">
          Skip to content
        </a>
      </div>
      <header className="site-header">
        <div className="site-header__inner">
          <button type="button" className="icon-btn" aria-label="Open menu">
            <span className="icon-btn__line" />
            <span className="icon-btn__line" />
            <span className="icon-btn__line" />
          </button>
          <Link to="/" className="logo">
            <span className="logo-mark">STUDIO</span>
          </Link>
          <div className="site-header__actions">
            <button type="button" className="text-link" aria-label="Search">
              Search
            </button>
            <Link to="/albums" className="text-link text-link--nav">
              Albums
            </Link>
          </div>
        </div>
        <nav className="nav-sub" aria-label="Primary">
          <Link
            to="/"
            className={pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            New
          </Link>
          <span className="nav-link nav-link--faux" aria-hidden="true">
            Men
          </span>
          <span className="nav-link nav-link--faux" aria-hidden="true">
            We Made Too Much
          </span>
          <Link
            to="/albums"
            className={isAlbums ? 'nav-link active' : 'nav-link'}
          >
            Lookbooks
          </Link>
        </nav>
      </header>
      <main
        className={isHome ? 'main main--bleed' : 'main'}
        id="main-content"
      >
        {children}
      </main>
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
