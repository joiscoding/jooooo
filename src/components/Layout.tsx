import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useNavCollapsed } from '../hooks/useNavCollapsed';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const { collapsed, toggleCollapsed } = useNavCollapsed();

  return (
    <div className={`layout${collapsed ? ' layout-nav-collapsed' : ''}`}>
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
        </Link>
        <nav className="nav nav-header" aria-label="Primary (mobile)">
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
      <div className="layout-body">
        <aside
          className="site-sidebar"
          aria-label="Site navigation"
        >
          <div className="sidebar-inner">
            <button
              type="button"
              className="nav-collapse-toggle"
              onClick={toggleCollapsed}
              aria-expanded={!collapsed}
              aria-controls="sidebar-nav"
              aria-label={
                collapsed ? 'Expand navigation' : 'Collapse navigation'
              }
              title={collapsed ? 'Expand navigation' : 'Collapse navigation'}
            >
              <span className="nav-collapse-icon" aria-hidden>
                {collapsed ? '»' : '«'}
              </span>
              <span className="nav-collapse-label">
                {collapsed ? 'Menu' : 'Collapse'}
              </span>
            </button>
            <nav id="sidebar-nav" className="nav nav-sidebar">
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
          </div>
        </aside>
        <main className="main">{children}</main>
      </div>
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
  );
}
