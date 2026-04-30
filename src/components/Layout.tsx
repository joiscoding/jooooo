import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useNavCollapsed } from '../hooks/useNavCollapsed';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const [collapsed, toggleCollapsed] = useNavCollapsed();

  return (
    <div className="layout">
      <aside
        className={`app-sidebar ${collapsed ? 'collapsed' : ''}`}
        aria-label="Site navigation"
      >
        <div className="app-sidebar-inner">
          <button
            type="button"
            className="sidebar-toggle"
            onClick={toggleCollapsed}
            aria-expanded={!collapsed}
            aria-controls="sidebar-nav"
            aria-label={
              collapsed ? 'Expand navigation' : 'Collapse navigation'
            }
            title={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          >
            <span className="sidebar-toggle-icon" aria-hidden="true">
              {collapsed ? '»' : '«'}
            </span>
            <span className="sidebar-toggle-text">
              {collapsed ? 'Expand' : 'Collapse'}
            </span>
          </button>
          <Link to="/" className="sidebar-logo">
            <span className="logo-serif">Studio</span>
            <span className="logo-sans">Lookbook</span>
          </Link>
          <nav id="sidebar-nav" className="sidebar-nav">
            <Link
              to="/"
              className={
                pathname === '/' ? 'sidebar-nav-link active' : 'sidebar-nav-link'
              }
            >
              <span className="sidebar-nav-full">Gallery</span>
              <span className="sidebar-nav-short" aria-hidden="true">
                G
              </span>
            </Link>
            <Link
              to="/albums"
              className={
                isAlbums ? 'sidebar-nav-link active' : 'sidebar-nav-link'
              }
            >
              <span className="sidebar-nav-full">Albums</span>
              <span className="sidebar-nav-short" aria-hidden="true">
                A
              </span>
            </Link>
          </nav>
        </div>
      </aside>

      <div className="layout-main-column">
        <header className="site-header site-header--mobile">
          <Link to="/" className="logo">
            <span className="logo-serif">Studio</span>
            <span className="logo-sans">Lookbook</span>
          </Link>
          <nav className="nav">
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
