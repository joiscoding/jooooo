import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { usePersistedNavCollapsed } from '../hooks/usePersistedNavCollapsed';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const { collapsed, toggle } = usePersistedNavCollapsed();

  const navLinks = (
    <>
      <Link
        to="/"
        className={pathname === '/' ? 'nav-link active' : 'nav-link'}
        title="Gallery"
      >
        <span className="nav-link__full">Gallery</span>
        <span className="nav-link__abbr" aria-hidden="true">
          G
        </span>
      </Link>
      <Link
        to="/albums"
        className={isAlbums ? 'nav-link active' : 'nav-link'}
        title="Albums"
      >
        <span className="nav-link__full">Albums</span>
        <span className="nav-link__abbr" aria-hidden="true">
          A
        </span>
      </Link>
    </>
  );

  return (
    <div
      className={`layout${collapsed ? ' layout--nav-collapsed' : ''}`}
    >
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className="site-header site-header--mobile">
        <Link to="/" className="logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
        </Link>
        <nav className="nav" aria-label="Main">
          {navLinks}
        </nav>
      </header>

      <aside
        className="sidebar-nav"
        id="sidebar-nav-panel"
        aria-label="Site navigation"
      >
        <div className="sidebar-nav__inner">
          <Link to="/" className="logo logo--sidebar">
            <span className="logo-serif">Studio</span>
            <span className="logo-sans">Lookbook</span>
          </Link>
          <nav className="nav nav--sidebar" aria-label="Main">
            {navLinks}
          </nav>
        </div>
        <button
          type="button"
          className="sidebar-toggle"
          onClick={toggle}
          aria-expanded={!collapsed}
          aria-controls="sidebar-nav-panel"
          aria-label={
            collapsed ? 'Expand navigation' : 'Collapse navigation'
          }
          title={collapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          <span className="sidebar-toggle__chevron" aria-hidden="true">
            {collapsed ? '⟩' : '⟨'}
          </span>
          <span className="sidebar-toggle__label" aria-hidden="true">
            {collapsed ? 'Expand' : 'Collapse'}
          </span>
        </button>
      </aside>

      <div className="layout-main">
        <main id="main-content" className="main">
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
  );
}
