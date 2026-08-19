import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useNavCollapsed } from '../hooks/useNavCollapsed';

function NavLinks({
  pathname,
  collapsed,
  navId,
}: {
  pathname: string;
  collapsed: boolean;
  navId?: string;
}) {
  const isAlbums = pathname.startsWith('/albums');

  return (
    <nav id={navId} className="nav" aria-label="Primary">
      <Link
        to="/"
        className={pathname === '/' ? 'nav-link active' : 'nav-link'}
        title="Gallery"
      >
        <span className="nav-link-label">Gallery</span>
        {collapsed ? (
          <span className="nav-link-abbr" aria-hidden>
            G
          </span>
        ) : null}
      </Link>
      <Link
        to="/albums"
        className={isAlbums ? 'nav-link active' : 'nav-link'}
        title="Albums"
      >
        <span className="nav-link-label">Albums</span>
        {collapsed ? (
          <span className="nav-link-abbr" aria-hidden>
            A
          </span>
        ) : null}
      </Link>
    </nav>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { collapsed, toggle } = useNavCollapsed();

  return (
    <div className={`layout${collapsed ? ' layout--nav-collapsed' : ''}`}>
      <header className="site-header site-header--mobile">
        <Link to="/" className="logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
        </Link>
        <NavLinks pathname={pathname} collapsed={false} />
      </header>

      <div className="layout-body">
        <aside className="site-sidebar" aria-label="Site navigation">
          <div className="site-sidebar-inner">
            <Link to="/" className="logo logo--sidebar">
              <span className="logo-serif">Studio</span>
              <span className="logo-sans">Lookbook</span>
            </Link>
            <NavLinks
              pathname={pathname}
              collapsed={collapsed}
              navId="site-sidebar-nav"
            />
            <button
              type="button"
              className="nav-collapse-toggle"
              onClick={toggle}
              aria-expanded={!collapsed}
              aria-controls="site-sidebar-nav"
              title={collapsed ? 'Expand navigation' : 'Collapse navigation'}
            >
              <span className="nav-collapse-toggle-icon" aria-hidden>
                {collapsed ? '⟩' : '⟨'}
              </span>
              <span className="nav-collapse-toggle-text">
                {collapsed ? 'Expand' : 'Collapse'}
              </span>
            </button>
          </div>
        </aside>

        <div className="layout-main-column">
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
