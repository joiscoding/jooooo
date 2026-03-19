import { Link, useLocation } from 'react-router-dom';
import { useState, type ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const [bannerVisible, setBannerVisible] = useState(true);

  return (
    <div className="layout">
      {bannerVisible && (
        <div className="announcement-bar">
          <p>Free shipping on all orders &mdash; Quality essentials, radically fair prices</p>
          <button
            type="button"
            className="announcement-close"
            onClick={() => setBannerVisible(false)}
            aria-label="Close announcement"
          >
            &times;
          </button>
        </div>
      )}
      <header className="site-header">
        <div className="header-inner">
          <nav className="nav nav-left">
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
          <Link to="/" className="logo">
            <span className="logo-text">Studio Lookbook</span>
          </Link>
          <div className="nav nav-right">
            <button type="button" className="icon-btn" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <button type="button" className="icon-btn" aria-label="Saved">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <main className="main">{children}</main>
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-logo">Studio Lookbook</span>
            <p className="footer-tagline">Modern style, designed to last.</p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Explore</h4>
              <Link to="/">Gallery</Link>
              <Link to="/albums">Albums</Link>
            </div>
            <div className="footer-col">
              <h4>About</h4>
              <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">Photo credits</a>
              <span className="footer-note">Demo project</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Studio Lookbook. Photos via Unsplash.</p>
        </div>
      </footer>
    </div>
  );
}
