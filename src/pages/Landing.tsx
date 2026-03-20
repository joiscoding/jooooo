import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LANDING_HERO_IMAGE,
  LANDING_PRODUCTS,
  LANDING_PROMO_IMAGE,
} from '../data/landingProducts';

function formatPrice(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(n);
}

export function Landing() {
  const [promoDismissed, setPromoDismissed] = useState(false);
  const [signedUp, setSignedUp] = useState(false);

  function onNewsletterSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSignedUp(true);
  }

  return (
    <div className="landing">
      {!promoDismissed && (
        <div className="landing-topbar" role="region" aria-label="Promotion">
          <p className="landing-topbar-text">
            Sign up for our newsletter and get <strong>15% off</strong> your
            first order
          </p>
          <button
            type="button"
            className="landing-topbar-dismiss"
            onClick={() => setPromoDismissed(true)}
            aria-label="Dismiss promotion"
          >
            ×
          </button>
        </div>
      )}

      <section className="landing-hero">
        <div className="landing-hero-copy">
          <p className="landing-eyebrow">New collection</p>
          <h1 className="landing-hero-title">
            Meet fashion
            <span className="landing-hero-title-accent"> in a new way</span>
          </h1>
          <p className="landing-hero-lede">
            Discover curated pieces with calm tailoring, honest materials, and
            silhouettes made for everyday wear.
          </p>
          <div className="landing-hero-actions">
            <Link to="/lookbook" className="landing-btn landing-btn-primary">
              Shop collection
            </Link>
            <a href="#featured" className="landing-btn landing-btn-ghost">
              View highlights
            </a>
          </div>
        </div>
        <div className="landing-hero-visual">
          <img
            src={LANDING_HERO_IMAGE}
            alt=""
            className="landing-hero-img"
            width={700}
            height={875}
            fetchPriority="high"
          />
        </div>
      </section>

      <section id="featured" className="landing-featured">
        <header className="landing-section-head">
          <h2 className="landing-section-title">Featured products</h2>
          <p className="landing-section-sub">
            A focused edit of outerwear, knits, and accessories.
          </p>
        </header>
        <ul className="landing-product-grid">
          {LANDING_PRODUCTS.map((p) => (
            <li key={p.id} className="landing-product-card">
              <div className="landing-product-media">
                <img
                  src={p.image}
                  alt={p.imageAlt}
                  className="landing-product-img"
                  width={360}
                  height={450}
                  loading="lazy"
                />
              </div>
              <div className="landing-product-meta">
                <h3 className="landing-product-name">{p.name}</h3>
                <p className="landing-product-price">{formatPrice(p.price)}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="landing-featured-cta">
          <Link to="/lookbook" className="landing-text-link">
            Browse the full lookbook →
          </Link>
        </p>
      </section>

      <section className="landing-promo" aria-labelledby="promo-heading">
        <div className="landing-promo-visual">
          <img
            src={LANDING_PROMO_IMAGE}
            alt=""
            width={600}
            height={400}
            loading="lazy"
            className="landing-promo-img"
          />
        </div>
        <div className="landing-promo-copy">
          <p className="landing-eyebrow">Limited offer</p>
          <h2 id="promo-heading" className="landing-promo-title">
            Autumn essentials
          </h2>
          <p className="landing-promo-text">
            Layer in soft neutrals and structured layers. Members save on
            selected styles through the season.
          </p>
          <Link to="/lookbook" className="landing-btn landing-btn-primary">
            Explore looks
          </Link>
        </div>
      </section>

      <section className="landing-newsletter" aria-labelledby="news-heading">
        <div className="landing-newsletter-inner">
          <h2 id="news-heading" className="landing-newsletter-title">
            Subscribe to our newsletter
          </h2>
          <p className="landing-newsletter-sub">
            First access to drops, private sales, and editorial stories.
          </p>
          {signedUp ? (
            <p className="landing-newsletter-thanks" role="status">
              Thanks — you&apos;re on the list.
            </p>
          ) : (
            <form
              className="landing-newsletter-form"
              onSubmit={onNewsletterSubmit}
            >
              <label htmlFor="landing-email" className="visually-hidden">
                Email address
              </label>
              <input
                id="landing-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="Your email address"
                className="landing-newsletter-input"
              />
              <button type="submit" className="landing-btn landing-btn-dark">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
