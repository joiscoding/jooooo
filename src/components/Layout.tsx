import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const FOOTER_COLUMNS: { heading: string; links: string[] }[] = [
  {
    heading: 'Browse',
    links: ['All looks', 'Seasonal edit', 'New this week', 'Key items'],
  },
  {
    heading: 'Styles',
    links: STYLE_ORDER.map((tag) => STYLE_LABELS[tag]),
  },
  {
    heading: 'Albums',
    links: ['My albums', 'Create an album', 'How albums work', 'Local storage'],
  },
  {
    heading: 'About',
    links: ['The studio', 'Photography credits', 'Press', 'Contact'],
  },
];

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout" id="top">
      <header className="site-header">
        <div className="topbar">
          <div className="topbar-inner">
            <Link to="/" className="logo" aria-label="Studio Lookbook home">
              <span className="logo-mark" aria-hidden="true">
                sl
              </span>
              <span className="logo-smile" aria-hidden="true" />
            </Link>
            <div className="topbar-search" role="search">
              <input
                type="search"
                className="topbar-search-input"
                placeholder="Search looks, styles, and items"
                aria-label="Search looks"
              />
            </div>
            <nav className="topbar-links" aria-label="Utility">
              <a href="#footer" className="topbar-link">
                Contact us
              </a>
              <a href="#footer" className="topbar-link">
                Support
              </a>
              <a href="#footer" className="topbar-link">
                English
              </a>
              <Link to="/albums" className="topbar-link">
                My albums
              </Link>
              <Link to="/albums" className="topbar-link topbar-link-signin">
                Sign in
              </Link>
              <Link to="/albums" className="btn-aws topbar-cta">
                Create an album
              </Link>
            </nav>
          </div>
        </div>
        <div className="catnav">
          <nav className="catnav-inner" aria-label="Primary">
            <Link
              to="/"
              className={pathname === '/' ? 'catnav-link active' : 'catnav-link'}
            >
              Looks
            </Link>
            <a href="/#explore" className="catnav-link">
              Styles
            </a>
            <Link
              to="/albums"
              className={isAlbums ? 'catnav-link active' : 'catnav-link'}
            >
              Albums
            </Link>
            <a href="/#featured" className="catnav-link">
              What&apos;s new
            </a>
            <a href="/#why" className="catnav-link">
              Why Studio Lookbook
            </a>
            <a href="#footer" className="catnav-link">
              Explore more
            </a>
          </nav>
        </div>
      </header>
      <main className="main">{children}</main>
      <footer className="site-footer" id="footer">
        <a href="#top" className="back-to-top">
          Back to top
        </a>
        <div className="footer-columns">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading} className="footer-col">
              <h3 className="footer-heading">{col.heading}</h3>
              <ul className="footer-list">
                {col.links.map((label) => (
                  <li key={label}>
                    <Link to={col.heading === 'Albums' ? '/albums' : '/'}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-legal">
          <p>
            Demo — photos via{' '}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unsplash
            </a>
            . Modern style, designed to last. Albums are saved in this browser
            only.
          </p>
          <p>
            © {new Date().getFullYear()} Studio Lookbook (mock). No account
            required.
          </p>
        </div>
      </footer>
    </div>
  );
}
