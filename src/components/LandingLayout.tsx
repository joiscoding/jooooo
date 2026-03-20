import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

export function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="layout">
      <header className="landing-header">
        <div className="landing-header__inner">
          <Link to="/" className="landing-logo">
            <span className="landing-logo__text">FASCO</span>
          </Link>
          <nav className="landing-nav">
            <Link to="/" className="landing-nav__link">Home</Link>
            <Link to="/gallery" className="landing-nav__link">Gallery</Link>
            <Link to="/albums" className="landing-nav__link">Albums</Link>
          </nav>
          <div className="landing-header__actions">
            <Link to="/gallery" className="landing-btn landing-btn--primary" style={{ padding: '0.6rem 1.5rem', fontSize: '0.72rem' }}>
              Shop Now
            </Link>
          </div>
        </div>
      </header>
      <main>{children}</main>
      {/* Landing Footer */}
      <footer className="landing-footer-wrap">
        <div className="landing-footer">
          <div>
            <h3 className="landing-footer__brand">FASCO</h3>
            <p className="landing-footer__about">
              Elevating men's fashion through curated lookbooks and editorial style guidance.
              Modern design, timeless appeal.
            </p>
          </div>
          <div>
            <h4 className="landing-footer__col-title">Explore</h4>
            <ul className="landing-footer__list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/albums">Albums</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="landing-footer__col-title">Categories</h4>
            <ul className="landing-footer__list">
              <li><Link to="/gallery">Minimal</Link></li>
              <li><Link to="/gallery">Streetwear</Link></li>
              <li><Link to="/gallery">Classic</Link></li>
              <li><Link to="/gallery">Athleisure</Link></li>
              <li><Link to="/gallery">Workwear</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="landing-footer__col-title">Connect</h4>
            <ul className="landing-footer__list">
              <li><a href="#" onClick={(e) => e.preventDefault()}>Instagram</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Twitter / X</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()}>Pinterest</a></li>
            </ul>
          </div>
        </div>
        <div className="landing-footer__bottom">
          <p className="landing-footer__copy">
            &copy; {new Date().getFullYear()} FASCO. All rights reserved. Demo — photos via{' '}
            <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer">Unsplash</a>.
          </p>
          <div className="landing-footer__socials">
            <a href="#" onClick={(e) => e.preventDefault()} aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="#" onClick={(e) => e.preventDefault()} aria-label="Twitter">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
