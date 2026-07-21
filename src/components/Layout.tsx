import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const isHome = pathname === '/';

  return (
    <div className="layout">
      <div className="utility-bar">
        <div className="utility-inner">
          <span className="utility-tagline">Better Faster Greener™ Style</span>
          <nav className="utility-links" aria-label="Utility">
            <a href="#where">Where to Buy</a>
            <a href="#support">Support</a>
            <a href="#account">Account</a>
            <span className="utility-lang">Global | English</span>
          </nav>
        </div>
      </div>

      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="logo">
            <span className="logo-mark">S</span>
            <span className="logo-text">
              STUDIO<span className="logo-accent">LOOKBOOK</span>
            </span>
          </Link>
          <div className="header-search" role="search">
            <input
              type="search"
              placeholder="Search looks, styles, seasons…"
              aria-label="Search"
            />
            <button type="button" aria-label="Submit search">
              ⌕
            </button>
          </div>
        </div>
      </header>

      <div className="main-nav-bar">
        <nav className="main-nav" aria-label="Primary">
          <Link
            to="/"
            className={isHome ? 'main-nav-link active' : 'main-nav-link'}
          >
            Looks
          </Link>
          <Link
            to="/albums"
            className={isAlbums ? 'main-nav-link active' : 'main-nav-link'}
          >
            Albums
          </Link>
          <a href="/#solutions" className="main-nav-link">
            Solutions
          </a>
          <a href="/#looks-grid" className="main-nav-link">
            Products
          </a>
          <a href="#news" className="main-nav-link">
            News
          </a>
        </nav>
      </div>

      <main className="main">{children}</main>

      <footer className="site-footer">
        <div className="footer-columns">
          <div className="footer-col">
            <h3>Products</h3>
            <Link to="/">All Looks</Link>
            <Link to="/">Minimal / Quiet</Link>
            <Link to="/">Streetwear / Urban</Link>
            <Link to="/">Classic / Tailored</Link>
          </div>
          <div className="footer-col">
            <h3>Solutions</h3>
            <Link to="/">Seasonal Edits</Link>
            <Link to="/">Occasion Styling</Link>
            <Link to="/albums">Saved Albums</Link>
          </div>
          <div className="footer-col">
            <h3>Support</h3>
            <a href="#support">Style FAQ</a>
            <a href="#support">Contact</a>
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Photo Credits (Unsplash)
            </a>
          </div>
          <div className="footer-col">
            <h3>About</h3>
            <a href="#about">Our Story</a>
            <a href="#about">Sustainability</a>
            <a href="#about">Press</a>
          </div>
        </div>
        <div className="footer-legal">
          <p>
            © {new Date().getFullYear()} Studio Lookbook (demo). Modern style,
            designed to last. Not affiliated with any hardware vendor.
          </p>
        </div>
      </footer>
    </div>
  );
}
