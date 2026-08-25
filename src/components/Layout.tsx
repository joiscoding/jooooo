import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const isHome = pathname === '/';

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-mark">Studio Lookbook</span>
        </Link>
        <nav className="nav">
          <Link to="/" className={isHome ? 'nav-link active' : 'nav-link'}>
            Gallery
          </Link>
          <Link
            to="/albums"
            className={isAlbums ? 'nav-link active' : 'nav-link'}
          >
            Albums
          </Link>
          <Link to="/albums" className="btn primary nav-cta">
            Start an album
          </Link>
        </nav>
      </header>

      <main className={isHome ? 'main main-wide' : 'main'}>{children}</main>

      <footer className="site-footer">
        <div className="wrap">
          <div className="footer-grid">
            <div className="footer-brand">
              <span className="logo-mark">Studio Lookbook</span>
              <p className="footer-note">
                An image-led edit of men's outfits, kept deliberately small.
                Photography via{' '}
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

            <div>
              <h2 className="footer-h">Browse</h2>
              <ul className="footer-links">
                <li>
                  <Link to="/">Gallery</Link>
                </li>
                <li>
                  <Link to="/albums">Albums</Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="footer-h">Aesthetics</h2>
              <ul className="footer-links">
                {STYLE_ORDER.map((tag) => (
                  <li key={tag}>
                    <Link to={`/?style=${tag}`}>{STYLE_LABELS[tag]}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="footer-h">About</h2>
              <ul className="footer-links">
                <li>
                  <Link to="/albums">Saved looks</Link>
                </li>
                <li>
                  <a
                    href="https://unsplash.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Photo credits
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>Demo project. Modern style, designed to last.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
