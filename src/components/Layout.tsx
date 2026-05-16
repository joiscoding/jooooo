import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { SiteNav } from './SiteNav';
import { usePersistedNavCollapsed } from '../hooks/usePersistedNavCollapsed';

export function Layout({ children }: { children: ReactNode }) {
  const { collapsed, toggleCollapsed } = usePersistedNavCollapsed();

  return (
    <div className="layout">
      <aside
        className={`app-sidebar${collapsed ? ' collapsed' : ''}`}
        aria-label="Site navigation"
      >
        <Link to="/" className="sidebar-logo">
          {collapsed ? (
            <span className="sidebar-logo-mark" aria-hidden="true">
              S
            </span>
          ) : (
            <>
              <span className="logo-serif">Studio</span>
              <span className="logo-sans">Lookbook</span>
            </>
          )}
          {collapsed ? <span className="sr-only">Studio Lookbook home</span> : null}
        </Link>
        <SiteNav
          id="sidebar-primary-nav"
          className={`nav nav-sidebar${collapsed ? ' nav-sidebar-compact' : ''}`}
          compact={collapsed}
        />
        <div className="sidebar-footer">
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
            <span aria-hidden="true">{collapsed ? '»' : '«'}</span>
          </button>
        </div>
      </aside>

      <div className="layout-shell">
        <header className="site-header site-header-mobile">
          <Link to="/" className="logo">
            <span className="logo-serif">Studio</span>
            <span className="logo-sans">Lookbook</span>
          </Link>
          <SiteNav className="nav" />
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
