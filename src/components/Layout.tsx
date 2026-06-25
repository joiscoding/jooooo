import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');

  const year = new Date().getFullYear();

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-mark">S</span>
          <span className="logo-text">
            <span className="logo-serif">Studio</span>
            <span className="logo-sans">Lookbook</span>
          </span>
        </Link>
        <nav className="nav">
          <Link
            to="/"
            className={pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            Home
          </Link>
          <Link
            to="/"
            className="nav-link"
          >
            Lookbooks
          </Link>
          <Link
            to="/albums"
            className={isAlbums ? 'nav-link active' : 'nav-link'}
          >
            Albums
          </Link>
          <Link to="/" className="nav-cta">
            Explore Gallery
          </Link>
        </nav>
      </header>
      <main className="main">{children}</main>
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="logo-serif">Studio Lookbook</span>
            <p>
              An editorial menswear studio. Outfit-first looks across five
              aesthetic directions — built for quiet, lasting confidence.
            </p>
          </div>
          <div className="footer-col">
            <h4>Explore</h4>
            <ul>
              <li>
                <Link to="/">Gallery</Link>
              </li>
              <li>
                <Link to="/">Lookbooks</Link>
              </li>
              <li>
                <Link to="/albums">Albums</Link>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Studio</h4>
            <ul>
              <li>
                <span>About Us</span>
              </li>
              <li>
                <span>Journal</span>
              </li>
              <li>
                <span>Careers</span>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Resources</h4>
            <ul>
              <li>
                <a
                  href="https://unsplash.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Photo credits
                </a>
              </li>
              <li>
                <span>Press</span>
              </li>
              <li>
                <span>Contact</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-legal">
          <div className="footer-legal-inner">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Cookie Settings</span>
            <span className="footer-copy">
              Copyright © {year} Studio Lookbook. All Rights Reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
