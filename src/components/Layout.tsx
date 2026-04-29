import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useNavSidebarCollapsed } from '../hooks/useNavSidebarCollapsed';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const { collapsed, isDesktop, toggleCollapsed } = useNavSidebarCollapsed();

  return (
    <div
      className={
        isDesktop
          ? `layout layout--with-sidebar${collapsed ? ' layout--sidebar-collapsed' : ''}`
          : 'layout'
      }
    >
      {isDesktop ? (
        <>
          <aside className="site-sidebar" aria-label="Main navigation">
            <div className="site-sidebar__brand">
              <Link to="/" className="logo">
                <span className="logo-serif">Studio</span>
                <span className="logo-sans">Lookbook</span>
              </Link>
            </div>
            <nav className="site-sidebar__nav">
              <Link
                to="/"
                className={
                  pathname === '/' ? 'nav-link nav-link--sidebar active' : 'nav-link nav-link--sidebar'
                }
                title="Gallery"
                aria-label="Gallery"
              >
                <span className="nav-link__full">Gallery</span>
                <span className="nav-link__abbr" aria-hidden>
                  G
                </span>
              </Link>
              <Link
                to="/albums"
                className={
                  isAlbums
                    ? 'nav-link nav-link--sidebar active'
                    : 'nav-link nav-link--sidebar'
                }
                title="Albums"
                aria-label="Albums"
              >
                <span className="nav-link__full">Albums</span>
                <span className="nav-link__abbr" aria-hidden>
                  A
                </span>
              </Link>
            </nav>
            <button
              type="button"
              className="sidebar-collapse-toggle"
              data-testid="sidebar-collapse-toggle"
              onClick={toggleCollapsed}
              aria-expanded={!collapsed}
              aria-controls="layout-main"
              title={collapsed ? 'Expand navigation' : 'Collapse navigation'}
            >
              <span className="sidebar-collapse-toggle__icon" aria-hidden>
                {collapsed ? '⟩' : '⟨'}
              </span>
              <span className="sidebar-collapse-toggle__label">
                {collapsed ? 'Expand' : 'Collapse'}
              </span>
            </button>
          </aside>
          <div className="layout__column">
            <main id="layout-main" className="main">
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
        </>
      ) : (
        <>
          <header className="site-header">
            <Link to="/" className="logo">
              <span className="logo-serif">Studio</span>
              <span className="logo-sans">Lookbook</span>
            </Link>
            <nav className="nav">
              <Link
                to="/"
                className={
                  pathname === '/' ? 'nav-link active' : 'nav-link'
                }
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
        </>
      )}
    </div>
  );
}
