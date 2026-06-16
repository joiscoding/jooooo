import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState, type ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isAlbums = pathname.startsWith('/albums');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHome) {
      setScrolled(false);
      return;
    }

    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  return (
    <div
      className={[
        'layout',
        isHome ? 'layout--home' : '',
        isHome && scrolled ? 'layout--scrolled' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <header className="site-header">
        <nav className="nav nav--left" aria-label="Primary">
          <Link
            to="/"
            className={pathname === '/' ? 'nav-link active' : 'nav-link'}
          >
            Collection
          </Link>
          <Link
            to="/albums"
            className={isAlbums ? 'nav-link active' : 'nav-link'}
          >
            Albums
          </Link>
        </nav>

        <Link to="/" className="logo">
          <span className="logo-mark" aria-hidden="true">
            ◆
          </span>
          <span className="logo-wordmark">
            <span className="logo-primary">Studio</span>
            <span className="logo-secondary">Lookbook</span>
          </span>
        </Link>

        <div className="nav nav--right" aria-hidden="true">
          <span className="nav-utility">Men</span>
        </div>
      </header>

      <main className={isHome ? 'main main--full' : 'main'}>{children}</main>

      <footer className="site-footer">
        <div className="footer-inner">
          <p className="footer-brand">Studio Lookbook</p>
          <p className="footer-tagline">
            Authentic style. Timeless design. Designed to last.
          </p>
          <p className="footer-credit">
            Demo — imagery via{' '}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unsplash
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
