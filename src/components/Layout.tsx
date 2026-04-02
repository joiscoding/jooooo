import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { usePersistedNavCollapsed } from '../hooks/usePersistedNavCollapsed';
import { SiteNavLinks } from './SiteNavLinks';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { collapsed, setCollapsed } = usePersistedNavCollapsed();

  return (
    <div
      className={`layout${collapsed ? ' layout--nav-collapsed' : ''}`}
      data-nav-collapsed={collapsed ? 'true' : 'false'}
    >
      <aside className="site-sidebar" aria-label="Site navigation">
        <div className="site-sidebar__brand">
          <Link to="/" className="logo">
            <span className="logo-serif">Studio</span>
            <span className="logo-sans">Lookbook</span>
          </Link>
        </div>
        <SiteNavLinks
          id="site-sidebar-nav"
          pathname={pathname}
          compact={collapsed}
        />
        <button
          type="button"
          className="nav-collapse-toggle"
          onClick={() => setCollapsed((c) => !c)}
          aria-expanded={!collapsed}
          aria-controls="site-sidebar-nav"
          aria-label={
            collapsed ? 'Expand sidebar navigation' : 'Collapse sidebar navigation'
          }
          title={collapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          <span className="nav-collapse-toggle__icon" aria-hidden="true">
            {collapsed ? '›' : '‹'}
          </span>
          <span className="nav-collapse-toggle__label">
            {collapsed ? 'Expand' : 'Collapse'}
          </span>
        </button>
      </aside>

      <div className="layout__main-col">
        <header className="site-header site-header--mobile">
          <Link to="/" className="logo">
            <span className="logo-serif">Studio</span>
            <span className="logo-sans">Lookbook</span>
          </Link>
          <SiteNavLinks pathname={pathname} />
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
