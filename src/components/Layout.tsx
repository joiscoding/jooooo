import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout">
      <div className="utility-bar">
        <span>Autumn Journal 2026</span>
        <span>Heritage mood, modern tailoring</span>
      </div>
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-kicker">MENSWEAR EDIT</span>
          <span className="logo-serif">Crestline</span>
        </Link>
        <nav className="nav">
          <Link
            to="/"
            className={pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            Journal
          </Link>
          <Link
            to="/albums"
            className={isAlbums ? 'nav-link active' : 'nav-link'}
          >
            Trunks
          </Link>
        </nav>
      </header>
      <main className="main">{children}</main>
      <footer className="site-footer">
        <div>
          <p className="footer-heading">Crestline Journal</p>
          <p>
            Editorial demo for menswear storytelling. Photography sourced from{' '}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unsplash
            </a>
            .
          </p>
        </div>
        <p className="footer-note">
          Designed as a calm, luxury-inspired lookbook with local album saving.
        </p>
      </footer>
    </div>
  );
}
