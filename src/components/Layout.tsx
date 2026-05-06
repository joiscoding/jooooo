import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useNavCollapsed } from '../hooks/useNavCollapsed';

function NavLinks({
  pathname,
  variant,
  sidebarCollapsed = false,
}: {
  pathname: string;
  variant: 'horizontal' | 'sidebar';
  sidebarCollapsed?: boolean;
}) {
  const isAlbums = pathname.startsWith('/albums');
  const navClass =
    variant === 'horizontal' ? 'nav nav--header' : 'nav nav--sidebar';

  const galleryClass =
    pathname === '/' ? 'nav-link active' : 'nav-link';
  const albumsClass = isAlbums ? 'nav-link active' : 'nav-link';

  return (
    <nav
      className={navClass}
      aria-label="Primary"
      data-collapsed={variant === 'sidebar' && sidebarCollapsed ? 'true' : undefined}
    >
      <Link
        to="/"
        className={galleryClass}
        title="Gallery"
        {...(variant === 'sidebar'
          ? { 'data-short': 'G' as const }
          : {})}
      >
        Gallery
      </Link>
      <Link
        to="/albums"
        className={albumsClass}
        title="Albums"
        {...(variant === 'sidebar'
          ? { 'data-short': 'A' as const }
          : {})}
      >
        Albums
      </Link>
    </nav>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { collapsed, toggleCollapsed } = useNavCollapsed();

  return (
    <div className="layout">
      <header className="site-header site-header--mobile">
        <Link to="/" className="logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
        </Link>
        <NavLinks pathname={pathname} variant="horizontal" />
      </header>

      <div className="layout-body">
        <aside
          id="site-sidebar"
          className={`site-sidebar${collapsed ? ' site-sidebar--collapsed' : ''}`}
          aria-label="Site"
        >
          <div className="site-sidebar__top">
            <Link to="/" className="logo logo--sidebar" title="Studio Lookbook">
              <span className="logo-serif">Studio</span>
              <span className="logo-sans">Lookbook</span>
            </Link>
            <NavLinks
              pathname={pathname}
              variant="sidebar"
              sidebarCollapsed={collapsed}
            />
          </div>
          <button
            type="button"
            className="sidebar-toggle"
            onClick={toggleCollapsed}
            aria-expanded={!collapsed}
            aria-controls="site-sidebar"
            aria-label={
              collapsed ? 'Expand navigation' : 'Collapse navigation'
            }
            title={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          >
            <span className="sidebar-toggle__chevron" aria-hidden>
              {collapsed ? '⟩' : '⟨'}
            </span>
            <span className="sidebar-toggle__label">
              {collapsed ? 'Expand' : 'Collapse'}
            </span>
          </button>
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
