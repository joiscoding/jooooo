import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { usePersistedNavCollapsed } from '../hooks/usePersistedNavCollapsed';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const [navCollapsed, toggleNavCollapsed] = usePersistedNavCollapsed();

  const navId = 'sidebar-primary-nav';

  return (
    <div
      className={`layout${navCollapsed ? ' layout-nav-collapsed' : ''}`}
      data-nav-collapsed={navCollapsed ? 'true' : 'false'}
    >
      <header className="site-header site-header-mobile">
        <Link to="/" className="logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
        </Link>
        <nav className="nav" aria-label="Main">
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
      </header>

      <aside className="site-sidebar" aria-label="Site">
        <div className="sidebar-inner">
          <Link to="/" className="logo sidebar-logo">
            <span className="logo-serif">Studio</span>
            <span className="logo-sans logo-sans-block">Lookbook</span>
          </Link>
          <nav
            id={navId}
            className="sidebar-nav"
            aria-label="Main navigation"
          >
            <Link
              to="/"
              className={
                pathname === '/' ? 'sidebar-link active' : 'sidebar-link'
              }
              title="Gallery"
            >
              <span className="sidebar-link-full">Gallery</span>
              <span className="sidebar-link-short" aria-hidden="true">
                G
              </span>
            </Link>
            <Link
              to="/albums"
              className={
                isAlbums ? 'sidebar-link active' : 'sidebar-link'
              }
              title="Albums"
            >
              <span className="sidebar-link-full">Albums</span>
              <span className="sidebar-link-short" aria-hidden="true">
                A
              </span>
            </Link>
          </nav>
          <div className="sidebar-footer">
            <button
              type="button"
              className="sidebar-toggle"
              onClick={toggleNavCollapsed}
              aria-expanded={!navCollapsed}
              aria-controls={navId}
              title={navCollapsed ? 'Expand navigation' : 'Collapse navigation'}
            >
              <span className="sidebar-toggle-icon" aria-hidden="true">
                {navCollapsed ? '⟩' : '⟨'}
              </span>
              <span className="sidebar-toggle-label">
                {navCollapsed ? 'Expand' : 'Collapse'}
              </span>
            </button>
          </div>
        </div>
      </aside>

      <div className="layout-main-col">
        <main className="main">{children}</main>
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
    </div>
  );
}
