import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAlbumsContext } from '../context/AlbumsContext';

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { albums } = useAlbumsContext();
  const isHome = pathname === '/';
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '');
  }, [searchParams]);

  const savedCount = albums.reduce((n, a) => n + a.lookIds.length, 0);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const next = query.trim();
    if (next) {
      navigate(`/?q=${encodeURIComponent(next)}`);
    } else {
      navigate('/');
    }
  }

  return (
    <div className={isHome ? 'layout layout-home' : 'layout'}>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="logo" aria-label="Studio Lookbook home">
            <span className="logo-circle" aria-hidden="true">
              sl
            </span>
            <span className="logo-word">Studio</span>
          </Link>

          <nav className="primary-nav" aria-label="Primary">
            <NavLink
              to="/albums"
              className={({ isActive }) =>
                isActive ? 'primary-nav-link current' : 'primary-nav-link'
              }
            >
              Explore
            </NavLink>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? 'primary-nav-link current' : 'primary-nav-link'
              }
            >
              Shop
            </NavLink>
            <a href="#site-footer" className="primary-nav-link">
              Support
            </a>
          </nav>

          <div className="header-tools">
            <form className="header-search" role="search" onSubmit={handleSearch}>
              <label htmlFor="site-search" className="visually-hidden">
                Search looks
              </label>
              <svg
                className="search-icon"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                aria-hidden="true"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M20 20l-3.5-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <input
                id="site-search"
                type="search"
                placeholder="What can we help you find?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </form>
            <Link to="/albums" className="header-icon-link" aria-label="Albums">
              <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                <path
                  d="M4 6h10v12H4zM14 8h6v10h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
              {savedCount > 0 ? (
                <span className="header-badge">{savedCount}</span>
              ) : null}
            </Link>
          </div>
        </div>
      </header>

      <main id="main-content" className="main">
        {children}
      </main>

      <footer id="site-footer" className="site-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="logo-circle" aria-hidden="true">
              sl
            </span>
            <p>Studio Lookbook</p>
          </div>
          <div className="footer-cols">
            <div>
              <h2>About us</h2>
              <ul>
                <li>
                  <Link to="/">Shop looks</Link>
                </li>
                <li>
                  <Link to="/albums">Albums</Link>
                </li>
                <li>
                  <a href="https://unsplash.com" rel="noopener noreferrer" target="_blank">
                    Photography
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2>Ways to shop</h2>
              <ul>
                <li>
                  <Link to="/?tag=classic">Classic</Link>
                </li>
                <li>
                  <Link to="/?tag=streetwear">Streetwear</Link>
                </li>
                <li>
                  <Link to="/?tag=athleisure">Athleisure</Link>
                </li>
                <li>
                  <Link to="/?tag=workwear">Workwear</Link>
                </li>
                <li>
                  <Link to="/?tag=minimal">Minimal</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2>Support</h2>
              <ul>
                <li>
                  <Link to="/albums">Saved albums</Link>
                </li>
                <li>
                  <a href="#main-content">Back to top</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="footer-legal">
          Unofficial lookbook demo. Not affiliated with HP. Photos via{' '}
          <a href="https://unsplash.com" rel="noopener noreferrer" target="_blank">
            Unsplash
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
