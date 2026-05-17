import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { usePersistedNavCollapsed } from '../hooks/usePersistedNavCollapsed';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');
  const isDesktop = useMediaQuery('(min-width: 900px)');
  const { collapsed, toggleCollapsed } = usePersistedNavCollapsed();

  const galleryActive = pathname === '/';
  const albumsActive = isAlbums;

  const mobileHeader = (
    <header className="site-header">
      <Link to="/" className="logo">
        <span className="logo-serif">Studio</span>
        <span className="logo-sans">Lookbook</span>
      </Link>
      <nav className="nav" aria-label="Primary">
        <Link
          to="/"
          className={galleryActive ? 'nav-link active' : 'nav-link'}
        >
          Gallery
        </Link>
        <Link
          to="/albums"
          className={albumsActive ? 'nav-link active' : 'nav-link'}
        >
          Albums
        </Link>
      </nav>
    </header>
  );

  const desktopSidebar = (
    <aside
      id="lookbook-app-sidebar"
      className={`app-sidebar${collapsed ? ' app-sidebar--collapsed' : ''}`}
      aria-label="Site navigation"
    >
      <div className="app-sidebar-inner">
        <Link to="/" className="logo app-sidebar-logo">
          <span className="logo-serif">Studio</span>
          <span className="logo-sans">Lookbook</span>
        </Link>
        <nav
          className="app-sidebar-nav"
          id="lookbook-primary-nav-desktop"
          aria-label="Primary"
        >
          <Link
            to="/"
            className={
              galleryActive ? 'nav-link nav-link--rail active' : 'nav-link nav-link--rail'
            }
            title="Gallery"
          >
            {collapsed ? (
              <>
                <span className="sr-only">Gallery</span>
                <span aria-hidden className="nav-rail-char">
                  G
                </span>
              </>
            ) : (
              'Gallery'
            )}
          </Link>
          <Link
            to="/albums"
            className={
              albumsActive ? 'nav-link nav-link--rail active' : 'nav-link nav-link--rail'
            }
            title="Albums"
          >
            {collapsed ? (
              <>
                <span className="sr-only">Albums</span>
                <span aria-hidden className="nav-rail-char">
                  A
                </span>
              </>
            ) : (
              'Albums'
            )}
          </Link>
        </nav>
        <div className="app-sidebar-spacer" />
        <button
          type="button"
          className="sidebar-collapse-btn"
          onClick={toggleCollapsed}
          aria-expanded={!collapsed}
          aria-controls="lookbook-app-sidebar"
          id="lookbook-sidebar-toggle"
        >
          <span className="sr-only">
            {collapsed ? 'Expand navigation' : 'Collapse navigation'}
          </span>
          <span aria-hidden className="sidebar-collapse-icon">
            {collapsed ? '⟩' : '⟨'}
          </span>
        </button>
      </div>
    </aside>
  );

  return (
    <div
      className={`layout${isDesktop ? ' layout--desktop-sidebar' : ''}${collapsed && isDesktop ? ' layout--sidebar-collapsed' : ''}`}
    >
      {isDesktop ? desktopSidebar : mobileHeader}
      <div className="layout-body">
        <main className="main" id="lookbook-main">
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
