import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { usePersistedNavCollapsed } from '../hooks/usePersistedNavCollapsed';

function NavLinks({
  pathname,
  className,
  id,
}: {
  pathname: string;
  className: string;
  id?: string;
}) {
  const isAlbums = pathname.startsWith('/albums');
  return (
    <nav className={className} aria-label="Primary" id={id}>
      <Link
        to="/"
        className={pathname === '/' ? 'nav-link active' : 'nav-link'}
      >
        <span className="nav-link-full">Gallery</span>
        <span className="nav-link-short" aria-hidden="true">
          G
        </span>
      </Link>
      <Link
        to="/albums"
        className={isAlbums ? 'nav-link active' : 'nav-link'}
      >
        <span className="nav-link-full">Albums</span>
        <span className="nav-link-short" aria-hidden="true">
          A
        </span>
      </Link>
    </nav>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { collapsed, toggle } = usePersistedNavCollapsed();

  return (
    <div className={`layout${collapsed ? ' nav-collapsed' : ''}`}>
      <aside className="app-sidebar" aria-label="Site navigation">
        <div className="sidebar-head">
          <Link to="/" className="logo sidebar-logo">
            <span className="logo-serif">Studio</span>
            <span className="logo-sans">Lookbook</span>
          </Link>
          <button
            type="button"
            className="sidebar-toggle"
            onClick={toggle}
            aria-expanded={!collapsed}
            aria-controls="sidebar-primary-nav"
          >
            <span className="visually-hidden">
              {collapsed ? 'Expand' : 'Collapse'} navigation
            </span>
            <span aria-hidden="true" className="sidebar-toggle-icon">
              {collapsed ? '›' : '‹'}
            </span>
          </button>
        </div>
        <NavLinks
          pathname={pathname}
          className="nav sidebar-nav"
          id="sidebar-primary-nav"
        />
      </aside>

      <div className="layout-shell">
        <header className="site-header mobile-header">
          <Link to="/" className="logo">
            <span className="logo-serif">Studio</span>
            <span className="logo-sans">Lookbook</span>
          </Link>
          <NavLinks pathname={pathname} className="nav mobile-nav" />
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
