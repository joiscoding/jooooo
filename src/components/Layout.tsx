import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useNavCollapsed } from '../hooks/useNavCollapsed';

function NavLinks({
  variant = 'horizontal',
  navId,
}: {
  variant?: 'horizontal' | 'vertical' | 'rail';
  navId?: string;
}) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const navClass =
    variant === 'horizontal'
      ? 'nav'
      : variant === 'vertical'
        ? 'nav nav--vertical'
        : 'nav nav--rail';

  return (
    <nav className={navClass} id={navId} aria-label="Primary">
      <Link
        to="/"
        className={pathname === '/' ? 'nav-link active' : 'nav-link'}
        title="Gallery"
      >
        {variant === 'rail' ? (
          <>
            <span className="visually-hidden">Gallery</span>
            <span className="nav-rail-char" aria-hidden>
              G
            </span>
          </>
        ) : (
          'Gallery'
        )}
      </Link>
      <Link
        to="/albums"
        className={isAlbums ? 'nav-link active' : 'nav-link'}
        title="Albums"
      >
        {variant === 'rail' ? (
          <>
            <span className="visually-hidden">Albums</span>
            <span className="nav-rail-char" aria-hidden>
              A
            </span>
          </>
        ) : (
          'Albums'
        )}
      </Link>
    </nav>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const { collapsed, toggle } = useNavCollapsed();

  return (
    <div className="layout">
      <header className="site-header site-header--mobile">
        <Link to="/" className="logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
        </Link>
        <NavLinks variant="horizontal" />
      </header>

      <div className="layout-body">
        <aside
          className={`site-sidebar${collapsed ? ' site-sidebar--collapsed' : ''}`}
          aria-label="Site navigation"
        >
          <div className="site-sidebar-top">
            <Link to="/" className="logo site-sidebar-logo">
              <span className="logo-serif">Studio</span>
              <span className="logo-sans">Lookbook</span>
            </Link>
            <div className="site-sidebar-nav-wrap">
              <NavLinks
                variant={collapsed ? 'rail' : 'vertical'}
                navId="site-primary-nav"
              />
            </div>
          </div>
          <button
            type="button"
            className="sidebar-collapse-toggle"
            onClick={toggle}
            aria-expanded={!collapsed}
            aria-controls="site-primary-nav"
            title={collapsed ? 'Expand navigation' : 'Collapse navigation'}
          >
            <span className="sidebar-collapse-icon" aria-hidden>
              {collapsed ? '»' : '«'}
            </span>
            <span className="sidebar-collapse-label">
              {collapsed ? 'Expand' : 'Collapse'}
            </span>
          </button>
        </aside>

        <div className="layout-main">
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
