import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import { Link, useLocation, useNavigationType } from 'react-router-dom';

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const scrollPositions = useRef(new Map<string, number>());
  const { pathname } = location;
  const isAlbums = pathname.startsWith('/albums');

  useEffect(() => {
    const saveScrollPosition = () => {
      scrollPositions.current.set(location.key, window.scrollY);
    };

    saveScrollPosition();
    window.addEventListener('scroll', saveScrollPosition, { passive: true });
    return () => window.removeEventListener('scroll', saveScrollPosition);
  }, [location.key]);

  useLayoutEffect(() => {
    if (navigationType === 'POP') {
      const savedPosition = scrollPositions.current.get(location.key);
      window.requestAnimationFrame(() => {
        window.scrollTo(0, savedPosition ?? 0);
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.key, navigationType]);

  return (
    <div className="layout">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <Link to="/" className="logo">
          <span className="logo-mark" aria-hidden="true">
            S
          </span>
          <span className="logo-copy">
            <strong>Studio</strong>
            <span>Lookbook systems</span>
          </span>
        </Link>
        <nav className="nav" aria-label="Primary navigation">
          <Link
            to="/"
            className={pathname === '/' ? 'nav-link active' : 'nav-link'}
            aria-current={pathname === '/' ? 'page' : undefined}
          >
            Look systems
          </Link>
          <Link
            to="/albums"
            className={isAlbums ? 'nav-link active' : 'nav-link'}
            aria-current={isAlbums ? 'page' : undefined}
          >
            Saved albums
          </Link>
        </nav>
      </header>
      <main className="main" id="main-content">
        {children}
      </main>
      <footer className="site-footer">
        <div className="footer-brand">
          <span className="footer-kicker">Studio Lookbook / Men</span>
          <p>Modular style, considered for the long run.</p>
        </div>
        <div className="footer-links">
          <Link to="/">Look systems</Link>
          <Link to="/albums">Saved albums</Link>
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Photography via Unsplash
          </a>
        </div>
        <p className="footer-note">Independent concept demo · 2026</p>
      </footer>
    </div>
  );
}
