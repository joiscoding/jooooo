import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const isAlbums = pathname.startsWith('/albums');

  return (
    <div className="layout">
      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="logo" aria-label="Studio home">
            <span className="logo-mark">STUDIO</span>
          </Link>

          <nav className="nav primary-nav" aria-label="Primary">
            <Link
              to="/"
              className={isHome ? 'nav-link active' : 'nav-link'}
            >
              New In
            </Link>
            <Link
              to="/"
              className="nav-link"
            >
              Lookbook
            </Link>
            <Link
              to="/albums"
              className={isAlbums ? 'nav-link active' : 'nav-link'}
            >
              Albums
            </Link>
          </nav>

          <nav className="nav utility-nav" aria-label="Utility">
            <button type="button" className="nav-link nav-button" aria-label="Search">
              Search
            </button>
            <button type="button" className="nav-link nav-button" aria-label="Account">
              Login
            </button>
            <Link to="/albums" className="nav-link" aria-label="Saved albums">
              Saved
            </Link>
            <button type="button" className="nav-link nav-button" aria-label="Bag">
              Bag (0)
            </button>
          </nav>
        </div>
      </header>

      <main className={isHome ? 'main main--full' : 'main'}>{children}</main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-cols">
            <section className="footer-col">
              <h3 className="footer-h">Help</h3>
              <ul>
                <li><a href="#">Customer service</a></li>
                <li><a href="#">Shipping</a></li>
                <li><a href="#">Returns</a></li>
                <li><a href="#">Size guide</a></li>
              </ul>
            </section>
            <section className="footer-col">
              <h3 className="footer-h">Studio</h3>
              <ul>
                <li><a href="#">About</a></li>
                <li><a href="#">Sustainability</a></li>
                <li><a href="#">Stores</a></li>
                <li><a href="#">Press</a></li>
              </ul>
            </section>
            <section className="footer-col">
              <h3 className="footer-h">Follow</h3>
              <ul>
                <li><a href="#">Newsletter</a></li>
                <li><a href="#">Instagram</a></li>
                <li><a href="#">Pinterest</a></li>
                <li><a href="#">TikTok</a></li>
              </ul>
            </section>
            <section className="footer-col">
              <h3 className="footer-h">Region</h3>
              <ul>
                <li><a href="#">United States · USD</a></li>
                <li><a href="#">Change country</a></li>
              </ul>
            </section>
          </div>

          <div className="footer-fineprint">
            <p>
              © Studio Lookbook. Demo project — photography via{' '}
              <a
                href="https://unsplash.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Unsplash
              </a>
              .
            </p>
            <ul className="footer-legal">
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Cookies</a></li>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Accessibility</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
