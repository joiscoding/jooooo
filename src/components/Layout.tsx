import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { usePersistedNavCollapsed } from '../hooks/usePersistedNavCollapsed';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const isDesktop = useMediaQuery('(min-width: 900px)');
  const { collapsed, toggleCollapsed } = usePersistedNavCollapsed();

  const navLinks = (
    <>
      <Link
        to="/"
        className={pathname === '/' ? 'nav-link active' : 'nav-link'}
        aria-current={pathname === '/' ? 'page' : undefined}
      >
        <span className="nav-link-label">Gallery</span>
        <span className="nav-link-abbr" aria-hidden="true">
          G
        </span>
      </Link>
      <Link
        to="/albums"
        className={isAlbums ? 'nav-link active' : 'nav-link'}
        aria-current={isAlbums ? 'page' : undefined}
      >
        <span className="nav-link-label">Albums</span>
        <span className="nav-link-abbr" aria-hidden="true">
          A
        </span>
      </Link>
    </>
  );

  return (
    <div
      className={`layout${isDesktop && collapsed ? ' nav-collapsed' : ''}`}
      data-nav-collapsed={isDesktop && collapsed ? 'true' : undefined}
    >
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
        </Link>
        <nav className="nav nav-header" aria-label="Primary">
          {navLinks}
        </nav>
      </header>
      <div className="layout-body">
        {isDesktop ? (
          <aside className="app-sidebar" aria-label="Site navigation">
            <nav className="nav nav-sidebar">{navLinks}</nav>
            <button
              type="button"
              className="sidebar-toggle"
              onClick={toggleCollapsed}
              aria-expanded={!collapsed}
              aria-controls="lookbook-main"
              aria-label={
                collapsed ? 'Expand navigation' : 'Collapse navigation'
              }
              title={collapsed ? 'Expand navigation' : 'Collapse navigation'}
            >
              <span className="sidebar-toggle-icon" aria-hidden="true">
                {collapsed ? '⟩' : '⟨'}
              </span>
              <span className="sidebar-toggle-text">
                {collapsed ? 'Expand' : 'Collapse'}
              </span>
            </button>
          </aside>
        ) : null}
        <div className="layout-main-wrap">
          <main id="lookbook-main" className="main">
            {children}
          </main>
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
    </div>
  );
}
