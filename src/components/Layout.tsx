import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAlbumsContext } from '../context/AlbumsContext';
import {
  BagIcon,
  ChevronDownIcon,
  SearchIcon,
  UserIcon,
} from './Icons';

type NavItem = { label: string; to: string; menu?: string[] };

const NAV: NavItem[] = [
  {
    label: 'Shop looks',
    to: '/#gallery',
    menu: ['Minimal', 'Streetwear', 'Classic', 'Athleisure', 'Workwear'],
  },
  { label: 'New in', to: '/#new-in' },
  { label: 'Deals', to: '/#deals' },
  { label: 'Albums', to: '/albums' },
  { label: 'Support', to: '/#support' },
];

const UTILITY_LINKS = ['Store locator', 'Support', 'Style advisor'];

export function Layout({ children }: { children: ReactNode }) {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { albums } = useAlbumsContext();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === '/';
  const savedCount = useMemo(
    () => new Set(albums.flatMap((a) => a.lookIds)).size,
    [albums]
  );

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '');
  }, [searchParams]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname, hash]);

  // In-page anchors come from the nav, so the router has to do the scrolling itself.
  useEffect(() => {
    if (!hash) return;
    const target = document.getElementById(hash.slice(1));
    target?.scrollIntoView({ block: 'start' });
  }, [pathname, hash]);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/?q=${encodeURIComponent(q)}#gallery` : '/');
  }

  function isActive(item: NavItem) {
    if (item.to === '/albums') return pathname.startsWith('/albums');
    if (!isHome) return false;
    const itemHash = item.to.slice(1);
    return hash ? hash === itemHash : itemHash === '#gallery';
  }

  return (
    <div className="layout">
      <a className="skip-link" href="#main">
        Skip to main content
      </a>

      <div className="hp-utility">
        <div className="hp-container hp-utility-inner">
          <p className="hp-utility-note">
            Free shipping and free 30-day returns on every order.
          </p>
          <nav className="hp-utility-nav" aria-label="Utility">
            {UTILITY_LINKS.map((label) => (
              <Link key={label} className="hp-utility-link" to="/#support">
                {label}
              </Link>
            ))}
            <span className="hp-utility-region">US&nbsp;–&nbsp;EN</span>
          </nav>
        </div>
      </div>

      <header className="site-header">
        <div className="hp-container hp-header-inner">
          <button
            type="button"
            className="hp-menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="primary-nav"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="hp-menu-bars" aria-hidden />
            <span className="hp-visually-hidden">
              {menuOpen ? 'Close menu' : 'Open menu'}
            </span>
          </button>

          <Link to="/" className="logo">
            <span className="logo-mark" aria-hidden>
              sl
            </span>
            <span className="logo-word">Studio Lookbook</span>
          </Link>

          <nav
            id="primary-nav"
            className={menuOpen ? 'nav nav-open' : 'nav'}
            aria-label="Main"
          >
            {NAV.map((item) => (
              <div key={item.label} className="nav-item">
                <Link
                  to={item.to}
                  className={isActive(item) ? 'nav-link active' : 'nav-link'}
                >
                  {item.label}
                  {item.menu && <ChevronDownIcon className="nav-caret" />}
                </Link>
                {item.menu && (
                  <div className="nav-menu" role="presentation">
                    <p className="nav-menu-head">Shop by style</p>
                    {item.menu.map((sub) => (
                      <Link
                        key={sub}
                        to={`/?style=${sub.toLowerCase()}#gallery`}
                        className="nav-menu-link"
                      >
                        {sub}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="hp-header-tools">
            <form className="hp-search" role="search" onSubmit={handleSearch}>
              <label className="hp-visually-hidden" htmlFor="site-search">
                Search looks
              </label>
              <input
                id="site-search"
                type="search"
                className="hp-search-input"
                placeholder="Search looks"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="hp-search-btn">
                <SearchIcon />
                <span className="hp-visually-hidden">Search</span>
              </button>
            </form>
            <Link className="hp-icon-btn" to="/#support">
              <UserIcon />
              <span className="hp-visually-hidden">Style advisor</span>
            </Link>
            <Link className="hp-icon-btn hp-bag" to="/albums">
              <BagIcon />
              <span className="hp-visually-hidden">
                Saved looks in albums: {savedCount}
              </span>
              {savedCount > 0 && (
                <span className="hp-bag-count" aria-hidden>
                  {savedCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <div className="hp-promo-band">
        <div className="hp-container hp-promo-inner">
          <p>
            <strong>Season sale.</strong> Up to 40% off selected looks — ends
            Sunday.
          </p>
          <Link to="/#deals" className="hp-promo-link">
            Shop the deals
            <span aria-hidden>&nbsp;›</span>
          </Link>
        </div>
      </div>

      <main id="main" className={isHome ? 'main main-home' : 'main'}>
        {children}
      </main>

      <footer className="site-footer">
        <div className="hp-container">
          <div className="hp-footer-cols">
            <div className="hp-footer-col">
              <h2>Shop</h2>
              <Link to="/?style=minimal#gallery">Minimal / quiet</Link>
              <Link to="/?style=streetwear#gallery">Streetwear / urban</Link>
              <Link to="/?style=classic#gallery">Classic / tailored</Link>
              <Link to="/?style=athleisure#gallery">Athleisure / sporty</Link>
              <Link to="/?style=workwear#gallery">Workwear / heritage</Link>
            </div>
            <div className="hp-footer-col">
              <h2>Support</h2>
              <Link to="/#support">Shipping and delivery</Link>
              <Link to="/#support">Returns and exchanges</Link>
              <Link to="/#support">Fit and sizing guide</Link>
              <Link to="/#support">Contact a style advisor</Link>
            </div>
            <div className="hp-footer-col">
              <h2>About</h2>
              <Link to="/#editorial">Our studio</Link>
              <Link to="/#editorial">Materials and care</Link>
              <Link to="/#editorial">Responsibility</Link>
              <Link to="/#editorial">Careers</Link>
            </div>
            <div className="hp-footer-col">
              <h2>Your account</h2>
              <Link to="/albums">Albums</Link>
              <Link to="/albums">Saved looks</Link>
              <Link to="/#new-in">New arrivals</Link>
              <Link to="/#deals">Current offers</Link>
            </div>
          </div>
          <div className="hp-footer-legal">
            <p>
              © 2026 Studio Lookbook — demo build. Photography via{' '}
              <a
                href="https://unsplash.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Unsplash
              </a>
              . Prices and offers are fictional.
            </p>
            <p className="hp-footer-legal-links">
              <Link to="/#support">Privacy</Link>
              <Link to="/#support">Terms of use</Link>
              <Link to="/#support">Accessibility</Link>
              <span>US&nbsp;–&nbsp;EN</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
