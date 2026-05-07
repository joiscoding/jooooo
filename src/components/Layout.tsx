import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { usePersistedNavCollapsed } from '../hooks/usePersistedNavCollapsed';

function NavLinks({
  pathname,
  navClassName,
  linkClassName,
  navId,
  variant,
  sidebarCollapsed,
}: {
  pathname: string;
  navClassName: string;
  linkClassName: string;
  navId?: string;
  variant: 'header' | 'sidebar';
  sidebarCollapsed?: boolean;
}) {
  const isAlbums = pathname.startsWith('/albums');
  const showInitials = variant === 'sidebar';
  const collapsedSidebar = Boolean(showInitials && sidebarCollapsed);

  return (
    <nav
      className={navClassName}
      aria-label="Primary navigation"
      {...(navId ? { id: navId } : {})}
    >
      <Link
        to="/"
        className={pathname === '/' ? `${linkClassName} active` : linkClassName}
        title="Gallery"
        {...(collapsedSidebar ? { 'aria-label': 'Gallery' } : {})}
      >
        <span className="nav-link-label">Gallery</span>
        {showInitials ? (
          <span className="nav-link-initial" aria-hidden="true">
            G
          </span>
        ) : null}
      </Link>
      <Link
        to="/albums"
        className={isAlbums ? `${linkClassName} active` : linkClassName}
        title="Albums"
        {...(collapsedSidebar ? { 'aria-label': 'Albums' } : {})}
      >
        <span className="nav-link-label">Albums</span>
        {showInitials ? (
          <span className="nav-link-initial" aria-hidden="true">
            A
          </span>
        ) : null}
      </Link>
    </nav>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isDesktop = useMediaQuery('(min-width: 900px)');
  const { navCollapsed, toggleCollapsed } = usePersistedNavCollapsed(isDesktop);

  const layoutClass = [
    'layout',
    isDesktop ? 'layout--desktop-sidebar' : '',
    isDesktop && navCollapsed ? 'layout--sidebar-collapsed' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={layoutClass}>
      {isDesktop ? (
        <aside className="site-sidebar" aria-label="Site">
          <div className="site-sidebar-top">
            <Link
              to="/"
              className="logo logo--sidebar"
              title="Studio Lookbook home"
              aria-label="Studio Lookbook home"
            >
              <span className="logo-full">
                <span className="logo-serif">Studio</span>
                <span className="logo-sans">Lookbook</span>
              </span>
              <span className="logo-compact" aria-hidden="true">
                SL
              </span>
            </Link>
            <NavLinks
              pathname={pathname}
              navClassName="nav nav--sidebar"
              linkClassName="nav-link nav-link--sidebar"
              navId="layout-primary-nav"
              variant="sidebar"
              sidebarCollapsed={navCollapsed}
            />
          </div>
          <button
            type="button"
            className="sidebar-collapse-btn"
            onClick={toggleCollapsed}
            aria-expanded={!navCollapsed}
            aria-controls="layout-primary-nav"
            aria-label={navCollapsed ? 'Expand navigation' : 'Collapse navigation'}
          >
            <span className="sidebar-collapse-icon" aria-hidden="true">
              {navCollapsed ? '⟩' : '⟨'}
            </span>
          </button>
        </aside>
      ) : (
        <header className="site-header">
          <Link to="/" className="logo">
            <span className="logo-serif">Studio</span>
            <span className="logo-sans">Lookbook</span>
          </Link>
          <NavLinks
            pathname={pathname}
            navClassName="nav"
            linkClassName="nav-link"
            variant="header"
          />
        </header>
      )}
      <div className="layout-body">
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
