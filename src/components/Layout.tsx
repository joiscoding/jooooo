import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useNavSidebarCollapsed } from '../hooks/useNavSidebarCollapsed';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const { isDesktop, collapsed, toggleCollapsed } = useNavSidebarCollapsed();

  const navLinks = (
    <>
      <Link
        to="/"
        className={pathname === '/' ? 'nav-link active' : 'nav-link'}
      >
        <span className="nav-link-full">Gallery</span>
        <span className="nav-link-short" aria-hidden>
          G
        </span>
      </Link>
      <Link
        to="/albums"
        className={isAlbums ? 'nav-link active' : 'nav-link'}
      >
        <span className="nav-link-full">Albums</span>
        <span className="nav-link-short" aria-hidden>
          A
        </span>
      </Link>
    </>
  );

  return (
    <div className="layout">
      {!isDesktop && (
        <header className="site-header">
          <Link to="/" className="logo">
            <span className="logo-serif">Studio</span>
            <span className="logo-sans">Lookbook</span>
          </Link>
          <nav className="nav nav-horizontal" aria-label="Main">
            {navLinks}
          </nav>
        </header>
      )}

      <div className="layout-shell">
        {isDesktop && (
          <aside
            className={`app-sidebar${collapsed ? ' is-collapsed' : ''}`}
            aria-label="Site navigation"
          >
            <div className="app-sidebar-inner">
              <Link to="/" className="sidebar-logo">
                <span className="logo-serif">Studio</span>
                <span className="logo-sans">Lookbook</span>
              </Link>
              <nav className="sidebar-nav">{navLinks}</nav>
              <button
                type="button"
                className="sidebar-collapse-btn"
                onClick={toggleCollapsed}
                aria-expanded={!collapsed}
                aria-controls="layout-main-region"
                aria-label={
                  collapsed ? 'Expand navigation' : 'Collapse navigation'
                }
                title={collapsed ? 'Expand navigation' : 'Collapse navigation'}
              >
                <span className="sidebar-collapse-icon" aria-hidden>
                  {collapsed ? '»' : '«'}
                </span>
                <span className="sidebar-collapse-label">
                  {collapsed ? 'Expand' : 'Collapse'}
                </span>
              </button>
            </div>
          </aside>
        )}

        <div
          className="layout-body"
          id="layout-main-region"
        >
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
    </div>
  );
}
