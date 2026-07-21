import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout">
      <div className="topbar">
        <span>Where to Wear</span>
        <span>Support</span>
        <span>Global / English</span>
      </div>
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-serif">STUDIO</span>
          <span className="logo-sans">Lookbook®</span>
        </Link>
        <nav className="nav">
          <Link
            to="/"
            className={pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            Looks
          </Link>
          <Link
            to="/albums"
            className={isAlbums ? 'nav-link active' : 'nav-link'}
          >
            Albums
          </Link>
          <span className="nav-link static">Solutions</span>
          <span className="nav-link static">About Us</span>
        </nav>
      </header>
      <main className="main">{children}</main>
      <footer className="site-footer">
        <div className="footer-cols">
          <div>
            <h4>Looks</h4>
            <p>Minimal / quiet</p>
            <p>Streetwear / urban</p>
            <p>Classic / tailored</p>
          </div>
          <div>
            <h4>Solutions</h4>
            <p>Seasonal edits</p>
            <p>Occasion styling</p>
            <p>Albums</p>
          </div>
          <div>
            <h4>Support</h4>
            <p>Care guides</p>
            <p>Sizing</p>
            <p>Contact</p>
          </div>
          <div>
            <h4>About</h4>
            <p>Our story</p>
            <p>Newsroom</p>
            <p>Careers</p>
          </div>
        </div>
        <p className="footer-legal">
          Demo — photos via{' '}
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Unsplash
          </a>
          . © 2026 StudioLookbook. Modern style, designed to last.
        </p>
      </footer>
    </div>
  );
}
