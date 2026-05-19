import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useCallback, useState } from 'react';

/** localStorage key for desktop sidebar collapsed state (LB-4). */
const LOOKBOOK_NAV_COLLAPSED_KEY = 'lookbook_nav_collapsed_v1' as const;

export function parseNavCollapsed(raw: string | null): boolean {
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  return false;
}

function readNavCollapsed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return parseNavCollapsed(window.localStorage.getItem(LOOKBOOK_NAV_COLLAPSED_KEY));
  } catch {
    return false;
  }
}

function writeNavCollapsed(collapsed: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(
      LOOKBOOK_NAV_COLLAPSED_KEY,
      collapsed ? 'true' : 'false',
    );
  } catch {
    /* private mode or quota — ignore */
  }
}

function usePersistedNavCollapsed() {
  const [collapsed, setCollapsedState] = useState(readNavCollapsed);

  const setCollapsed = useCallback((next: boolean) => {
    setCollapsedState(next);
    writeNavCollapsed(next);
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsedState((prev) => {
      const next = !prev;
      writeNavCollapsed(next);
      return next;
    });
  }, []);

  return { collapsed, setCollapsed, toggleCollapsed };
}

function NavLinks({
  pathname,
  variant,
  collapsed,
  id,
}: {
  pathname: string;
  variant: 'header' | 'sidebar';
  collapsed: boolean;
  id?: string;
}) {
  const isAlbums = pathname.startsWith('/albums');
  const navClass = variant === 'header' ? 'nav' : 'app-sidebar__nav';
  const linkClass =
    variant === 'header' ? 'nav-link' : 'app-sidebar__link';

  return (
    <nav className={navClass} aria-label="Primary" id={id}>
      <Link
        to="/"
        className={pathname === '/' ? `${linkClass} active` : linkClass}
        aria-current={pathname === '/' ? 'page' : undefined}
        title="Gallery"
      >
        {variant === 'sidebar' && collapsed ? (
          <span aria-hidden="true" className="app-sidebar__short">
            G
          </span>
        ) : null}
        {variant === 'sidebar' ? (
          <span
            className={
              collapsed
                ? 'app-sidebar__label app-sidebar__label--hidden'
                : 'app-sidebar__label'
            }
          >
            Gallery
          </span>
        ) : (
          'Gallery'
        )}
      </Link>
      <Link
        to="/albums"
        className={isAlbums ? `${linkClass} active` : linkClass}
        aria-current={isAlbums ? 'page' : undefined}
        title="Albums"
      >
        {variant === 'sidebar' && collapsed ? (
          <span aria-hidden="true" className="app-sidebar__short">
            A
          </span>
        ) : null}
        {variant === 'sidebar' ? (
          <span
            className={
              collapsed
                ? 'app-sidebar__label app-sidebar__label--hidden'
                : 'app-sidebar__label'
            }
          >
            Albums
          </span>
        ) : (
          'Albums'
        )}
      </Link>
    </nav>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { collapsed, toggleCollapsed } = usePersistedNavCollapsed();

  return (
    <div className="layout">
      <header className="site-header site-header--mobile">
        <Link to="/" className="logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
        </Link>
        <NavLinks pathname={pathname} variant="header" collapsed={false} />
      </header>

      <div className="layout-body">
        <aside
          className={
            collapsed
              ? 'app-sidebar app-sidebar--collapsed'
              : 'app-sidebar'
          }
          aria-label="Primary navigation"
        >
          <div className="app-sidebar__inner">
            <button
              type="button"
              className="sidebar-toggle"
              onClick={toggleCollapsed}
              aria-expanded={!collapsed}
              aria-controls="sidebar-primary-nav"
              title={collapsed ? 'Expand navigation' : 'Collapse navigation'}
            >
              <span className="sr-only">
                {collapsed ? 'Expand navigation' : 'Collapse navigation'}
              </span>
              <span aria-hidden="true" className="sidebar-toggle__icon">
                {collapsed ? '⟩' : '⟨'}
              </span>
            </button>

            <Link to="/" className="logo app-sidebar__logo">
              <span className="logo-serif">Studio</span>
              <span className="logo-sans">Lookbook</span>
            </Link>

            <NavLinks
              id="sidebar-primary-nav"
              pathname={pathname}
              variant="sidebar"
              collapsed={collapsed}
            />
          </div>
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
    </div>
  );
}
