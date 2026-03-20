import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look } from '../types';
import { STYLE_LABELS } from '../types';

const COLLECTIONS = [
  {
    label: 'Outerwear',
    img: '/looks/1768809250854-2f4b1e8f19cc-w1200h1600.jpg',
    to: '/lookbook',
  },
  {
    label: 'Street',
    img: '/looks/streetwear-urban-01-v2.jpg',
    to: '/lookbook',
  },
  {
    label: 'Tailored',
    img: '/looks/1732492211688-b1984227af93-w1000h1300.jpg',
    to: '/lookbook',
  },
  {
    label: 'Athleisure',
    img: '/looks/1630877268428-616cc533239a-w1200h1500.jpg',
    to: '/lookbook',
  },
] as const;

const PROMO_TILES = [
  {
    kicker: 'New season',
    title: 'The winter edit',
    cta: 'Shop now',
    img: '/looks/1597815413302-8037c47f5a75-w1200h1600.jpg',
  },
  {
    kicker: 'Limited drop',
    title: 'Essential layers',
    cta: 'View collection',
    img: '/looks/1600117025146-5092075da653-w1000h1500.jpg',
  },
] as const;

export function LandingPage() {
  const [looks, setLooks] = useState<Look[]>([]);

  useEffect(() => {
    fetchLooks().then(setLooks);
  }, []);

  const featured = looks.slice(0, 8);

  return (
    <div className="landing" id="top">
      <div className="landing-topbar">
        <p className="landing-topbar-text">
          Sign up for our newsletter and get 15% off your first order
        </p>
        <form
          className="landing-topbar-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="landing-email-top" className="visually-hidden">
            Email
          </label>
          <input
            id="landing-email-top"
            type="email"
            placeholder="Email address"
            className="landing-input"
            autoComplete="email"
          />
          <button type="submit" className="landing-btn landing-btn-dark">
            Subscribe
          </button>
        </form>
      </div>

      <header className="landing-header">
        <div className="landing-header-inner">
          <nav className="landing-nav-left" aria-label="Shop">
            <Link to="/lookbook" className="landing-nav-link">
              Shop Men
            </Link>
            <span className="landing-nav-muted">Shop Women</span>
          </nav>
          <Link to="/" className="landing-logo" aria-label="FASCO home">
            FASCO
          </Link>
          <div className="landing-nav-right">
            <button type="button" className="landing-icon-link">
              Search
            </button>
            <span className="landing-nav-sep" aria-hidden />
            <button type="button" className="landing-icon-link">
              Wishlist
            </button>
            <span className="landing-nav-sep" aria-hidden />
            <button type="button" className="landing-icon-link">
              Sign in
            </button>
            <span className="landing-nav-sep" aria-hidden />
            <button type="button" className="landing-icon-link">
              Bag (0)
            </button>
          </div>
        </div>
        <p className="landing-announce">
          Free standard shipping on orders over $100 ·{' '}
          <Link to="/lookbook">Browse lookbook</Link>
        </p>
      </header>

      <section className="landing-hero" aria-labelledby="landing-hero-title">
        <div className="landing-hero-visual">
          <img
            src="/looks/1549153166-54374660cb65-w1200h1500.jpg"
            alt=""
            className="landing-hero-img"
          />
          <div className="landing-hero-overlay" />
        </div>
        <div className="landing-hero-copy">
          <p className="landing-eyebrow">New collection</p>
          <h1 id="landing-hero-title" className="landing-hero-title">
            Discover the new you
          </h1>
          <p className="landing-hero-sub">
            Editorials, essentials, and seasonal layers — curated for calm,
            confident dressing.
          </p>
          <div className="landing-hero-actions">
            <Link to="/lookbook" className="landing-btn landing-btn-dark">
              Shop collection
            </Link>
            <Link to="/lookbook" className="landing-btn landing-btn-ghost">
              View lookbook
            </Link>
          </div>
        </div>
      </section>

      <section className="landing-section landing-promos" aria-label="Promotions">
        <div className="landing-promo-grid">
          {PROMO_TILES.map((tile) => (
            <Link
              key={tile.title}
              to="/lookbook"
              className="landing-promo-card"
            >
              <img src={tile.img} alt="" className="landing-promo-img" />
              <div className="landing-promo-meta">
                <span className="landing-eyebrow">{tile.kicker}</span>
                <h2 className="landing-promo-title">{tile.title}</h2>
                <span className="landing-promo-cta">{tile.cta} →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="landing-section" aria-labelledby="collections-heading">
        <div className="landing-section-head">
          <h2 id="collections-heading" className="landing-section-title">
            Shop by category
          </h2>
          <Link to="/lookbook" className="landing-text-link">
            See all
          </Link>
        </div>
        <div className="landing-collections">
          {COLLECTIONS.map((c) => (
            <Link key={c.label} to={c.to} className="landing-collection-card">
              <div className="landing-collection-img-wrap">
                <img src={c.img} alt="" className="landing-collection-img" />
              </div>
              <span className="landing-collection-label">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="landing-section" aria-labelledby="featured-heading">
        <div className="landing-section-head">
          <h2 id="featured-heading" className="landing-section-title">
            Featured products
          </h2>
          <Link to="/lookbook" className="landing-text-link">
            View lookbook
          </Link>
        </div>
        {featured.length === 0 ? (
          <p className="landing-muted">Loading…</p>
        ) : (
          <div className="landing-product-grid">
            {featured.map((look) => (
              <Link
                key={look.id}
                to={`/look/${look.id}`}
                className="landing-product-card"
              >
                <div className="landing-product-img-wrap">
                  <img
                    src={look.hero}
                    alt=""
                    className="landing-product-img"
                  />
                </div>
                <div className="landing-product-meta">
                  <span className="landing-product-tag">
                    {STYLE_LABELS[look.tag]}
                  </span>
                  <h3 className="landing-product-title">{look.title}</h3>
                  <span className="landing-product-price">View look</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="landing-newsletter" aria-labelledby="newsletter-heading">
        <div className="landing-newsletter-inner">
          <h2 id="newsletter-heading" className="landing-newsletter-title">
            Subscribe to our newsletter
          </h2>
          <p className="landing-newsletter-sub">
            First access to drops, private sales, and style notes — no spam.
          </p>
          <form
            className="landing-newsletter-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <label htmlFor="landing-email-footer" className="visually-hidden">
              Email
            </label>
            <input
              id="landing-email-footer"
              type="email"
              placeholder="Your email address"
              className="landing-input landing-input-wide"
              autoComplete="email"
            />
            <button type="submit" className="landing-btn landing-btn-dark">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-grid">
          <div>
            <p className="landing-footer-brand">FASCO</p>
            <p className="landing-footer-copy">
              Fashion e‑commerce landing inspired by the FASCO community Figma
              template. Demo storefront UI only — browse the lookbook for
              outfit-led discovery.
            </p>
          </div>
          <div>
            <p className="landing-footer-heading">Shop</p>
            <ul className="landing-footer-list">
              <li>
                <Link to="/lookbook">Lookbook</Link>
              </li>
              <li>
                <Link to="/albums">Albums</Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="landing-footer-heading">Help</p>
            <ul className="landing-footer-list">
              <li>
                <a href="#top">Contact</a>
              </li>
              <li>
                <a href="#top">Shipping</a>
              </li>
              <li>
                <a href="#top">Returns</a>
              </li>
            </ul>
          </div>
        </div>
        <p className="landing-footer-legal">
          © {new Date().getFullYear()} Demo. Images from Unsplash via project
          assets. Not affiliated with any trademarked brand.
        </p>
      </footer>
    </div>
  );
}
