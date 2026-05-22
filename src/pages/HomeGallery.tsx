import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const CATEGORY_BLURBS: Record<StyleTag, string> = {
  minimal: 'Clean layers, zero noise.',
  streetwear: 'Urban energy, built to move.',
  classic: 'Tailored ease for every day.',
  athleisure: 'Train, travel, recover.',
  workwear: 'Heritage fabrics, modern fit.',
};

export function HomeGallery() {
  const [looks, setLooks] = useState<Look[]>([]);
  const [filter, setFilter] = useState<StyleTag | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchLooks().then((data) => {
      if (!cancelled) {
        setLooks(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return looks;
    return looks.filter((l) => l.tag === filter);
  }, [looks, filter]);

  const heroLook = useMemo(() => {
    return (
      looks.find((l) => l.tag === 'athleisure') ??
      looks.find((l) => l.tag === 'minimal') ??
      looks[0]
    );
  }, [looks]);

  const featuredCategories = useMemo(() => {
    return STYLE_ORDER.map((tag) => {
      const match = looks.find((l) => l.tag === tag);
      return { tag, look: match };
    }).filter((entry) => entry.look);
  }, [looks]);

  const spotlightLooks = useMemo(() => looks.slice(0, 4), [looks]);

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home landing">
      {heroLook && (
        <section className="hero-full" aria-label="Featured campaign">
          <img
            src={heroLook.hero}
            alt=""
            className="hero-full-img"
            fetchPriority="high"
          />
          <div className="hero-full-content">
            <p className="hero-kicker">Men&apos;s — Spring edit</p>
            <h1 className="hero-headline">
              Technical comfort.
              <br />
              Everyday confidence.
            </h1>
            <p className="hero-sub">
              Performance fabrics and clean silhouettes for training, travel,
              and everything between.
            </p>
            <div className="hero-cta-row">
              <Link to={`/look/${heroLook.id}`} className="btn btn-dark">
                Shop {heroLook.title}
              </Link>
              <a href="#new-arrivals" className="btn btn-outline-light">
                View new arrivals
              </a>
            </div>
          </div>
        </section>
      )}

      <section className="values-strip" aria-label="Brand values">
        <ul className="values-list">
          <li>Free shipping on lookbook demo</li>
          <li>Quality gear, designed to last</li>
          <li>Members save on seasonal drops</li>
        </ul>
      </section>

      <section
        id="shop-by-style"
        className="category-tiles"
        aria-labelledby="category-heading"
      >
        <div className="section-head">
          <h2 id="category-heading" className="section-title">
            Shop by style
          </h2>
          <p className="section-lead">
            Curated edits across five signatures — tap a category to explore.
          </p>
        </div>
        <div className="category-grid">
          {featuredCategories.map(({ tag, look }) =>
            look ? (
              <Link
                key={tag}
                to={`/look/${look.id}`}
                className="category-tile"
              >
                <img src={look.hero} alt="" className="category-tile-img" />
                <div className="category-tile-overlay">
                  <span className="category-tile-label">
                    {STYLE_LABELS[tag]}
                  </span>
                  <span className="category-tile-cta">Shop now</span>
                </div>
              </Link>
            ) : null,
          )}
        </div>
      </section>

      {spotlightLooks.length >= 2 && (
        <section className="split-promo" aria-label="Featured collections">
          <Link
            to={`/look/${spotlightLooks[0].id}`}
            className="split-promo-panel"
          >
            <img
              src={spotlightLooks[0].hero}
              alt=""
              className="split-promo-img"
            />
            <div className="split-promo-copy">
              <p className="split-promo-kicker">Best sellers</p>
              <h2 className="split-promo-title">{spotlightLooks[0].title}</h2>
              <span className="split-promo-link">Shop the look</span>
            </div>
          </Link>
          <Link
            to={`/look/${spotlightLooks[1]?.id ?? spotlightLooks[0].id}`}
            className="split-promo-panel split-promo-panel--accent"
          >
            <img
              src={spotlightLooks[1]?.hero ?? spotlightLooks[0].hero}
              alt=""
              className="split-promo-img"
            />
            <div className="split-promo-copy">
              <p className="split-promo-kicker">Member favourite</p>
              <h2 className="split-promo-title">
                {spotlightLooks[1]?.title ?? spotlightLooks[0].title}
              </h2>
              <span className="split-promo-link">Explore edit</span>
            </div>
          </Link>
        </section>
      )}

      <section
        id="new-arrivals"
        className="arrivals-section"
        aria-labelledby="arrivals-heading"
      >
        <div className="section-head section-head--row">
          <div>
            <h2 id="arrivals-heading" className="section-title">
              New arrivals
            </h2>
            <p className="section-lead section-lead--tight">
              {filter === 'all'
                ? 'Fresh silhouettes across every signature style.'
                : CATEGORY_BLURBS[filter]}
            </p>
          </div>
        </div>

        <div className="filters-bar filters-bar--tabs" aria-label="Style filters">
          <button
            type="button"
            className={filter === 'all' ? 'filter-tab active' : 'filter-tab'}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          {STYLE_ORDER.map((tag) => (
            <button
              key={tag}
              type="button"
              className={filter === tag ? 'filter-tab active' : 'filter-tab'}
              onClick={() => setFilter(tag)}
            >
              {STYLE_LABELS[tag]}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="empty-state">No looks in this filter.</p>
        ) : (
          <div className="product-grid">
            {filtered.map((look, i) => (
              <Link
                key={look.id}
                to={`/look/${look.id}`}
                className="product-card"
              >
                <div className="product-card-media">
                  <img
                    key={`${look.id}-${look.hero}`}
                    src={look.hero}
                    alt=""
                    className="product-card-img"
                    loading={i < 6 ? 'eager' : 'lazy'}
                  />
                  {i < 2 && <span className="product-badge">New</span>}
                </div>
                <div className="product-card-info">
                  <span className="product-tag">{STYLE_LABELS[look.tag]}</span>
                  <h3 className="product-title">{look.title}</h3>
                  <p className="product-meta">{look.season} · {look.occasion}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="editorial-band" aria-label="Brand story">
        <div className="editorial-band-inner">
          <h2 className="editorial-band-title">
            Gear for the days you actually live in.
          </h2>
          <p className="editorial-band-text">
            Studio Lookbook is a demo gallery inspired by premium athletic
            retail — clean layouts, bold photography, and product-first
            storytelling.
          </p>
          <Link to="/albums" className="btn btn-dark">
            Build your album
          </Link>
        </div>
      </section>
    </div>
  );
}
