import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const isGallery = pathname === '/gallery';
  const isLanding = pathname === '/';

  return (
    <div className="layout">
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-mark">ABC</span>
          <span className="logo-text">
            Fitness <span className="logo-accent">Lookbook</span>
          </span>
        </Link>
        <nav className="nav">
          <Link
            to="/"
            className={isLanding ? 'nav-link active' : 'nav-link'}
          >
            Home
          </Link>
          <Link
            to="/gallery"
            className={isGallery ? 'nav-link active' : 'nav-link'}
          >
            Gallery
          </Link>
          <Link
            to="/albums"
            className={isAlbums ? 'nav-link active' : 'nav-link'}
          >
            Collections
          </Link>
        </nav>
      </header>
      <main className="main">{children}</main>
      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <Link to="/" className="logo" style={{ marginBottom: '0.5rem' }}>
              <span className="logo-mark">ABC</span>
              <span className="logo-text">
                Fitness <span className="logo-accent">Lookbook</span>
              </span>
            </Link>
            <p>
              Performance-driven looks for every stage of your fitness journey.
              Curated with passion, built for athletes.
            </p>
          </div>
          <div className="footer-links">
            <h4>Explore</h4>
            <ul>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/albums">Collections</Link></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Categories</h4>
            <ul>
              <li><Link to="/gallery?filter=training">Training</Link></li>
              <li><Link to="/gallery?filter=performance">Performance</Link></li>
              <li><Link to="/gallery?filter=recovery">Recovery</Link></li>
              <li><Link to="/gallery?filter=lifestyle">Lifestyle</Link></li>
              <li><Link to="/gallery?filter=competition">Competition</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p style={{ margin: 0 }}>
            ABC Fitness Lookbook — Demo. Photos via{' '}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              Unsplash
            </a>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
