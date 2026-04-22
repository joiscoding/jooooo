import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useNavSidebar } from '../hooks/useNavSidebar';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const { collapsed, toggleCollapsed } = useNavSidebar();

  return (
    <div
      className={collapsed ? 'layout layout--nav-collapsed' : 'layout'}
    >
      <header className="site-header site-header--mobile" aria-label="Top">
        <Link to="/" className="logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
        </Link>
        <nav className="nav" aria-label="Primary">
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

      <aside
        className="app-sidebar"
        aria-label="Site"
        data-collapsed={collapsed ? 'true' : 'false'}
      >
        <div className="app-sidebar-head">
          <Link to="/" className="logo" title="Home">
            <span className="logo-serif">Studio</span>
            <span className="logo-sans">Lookbook</span>
          </Link>
          <button
            type="button"
            className="nav-collapse-toggle"
            onClick={toggleCollapsed}
            aria-expanded={!collapsed}
            aria-controls="sidebar-nav"
            title={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          >
            <span className="nav-collapse-toggle__icon" aria-hidden>
              {collapsed ? '⟩' : '⟨'}
            </span>
            <span className="visually-hidden">
              {collapsed ? 'Expand' : 'Collapse'} sidebar
            </span>
          </button>
        </div>
        <nav
          className="nav nav--sidebar"
          id="sidebar-nav"
          aria-label="Primary"
        >
          <Link
            to="/"
            className={pathname === '/' ? 'nav-link active' : 'nav-link'}
            title="Gallery"
          >
            <span className="nav-link-abbr" aria-hidden>
              G
            </span>
            <span className="nav-link-text">Gallery</span>
          </Link>
          <Link
            to="/albums"
            className={isAlbums ? 'nav-link active' : 'nav-link'}
            title="Albums"
          >
            <span className="nav-link-abbr" aria-hidden>
              A
            </span>
            <span className="nav-link-text">Albums</span>
          </Link>
        </nav>
      </aside>

      <div className="layout-content">
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
