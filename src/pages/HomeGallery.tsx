import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

function scrollToBrowse() {
  document.getElementById('browse-looks')?.scrollIntoView({ behavior: 'smooth' });
}

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

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home home--aws">
      <section className="home-hero" aria-labelledby="home-hero-heading">
        <div className="home-hero-grid">
          <div className="home-hero-copy">
            <p className="eyebrow">Studio Lookbook — Seasonal men&apos;s edit</p>
            <h1 id="home-hero-heading" className="home-title">
              Discover curated outfits with the clarity of a modern product home.
            </h1>
            <p className="home-lede">
              Browse editorial looks by style, save favorites into albums, and
              drill into detail pages—structured like a cloud console, styled for
              fashion.
            </p>
            <div className="home-hero-actions">
              <button type="button" className="aws-cta aws-cta--lg" onClick={scrollToBrowse}>
                Explore the gallery
              </button>
              <Link to="/albums" className="aws-cta aws-cta--lg aws-cta--surface">
                View albums
              </Link>
            </div>
            <ul className="home-quick-links" aria-label="Quick links">
              <li>
                <button type="button" className="home-quick-link" onClick={scrollToBrowse}>
                  Shop by style →
                </button>
              </li>
              <li>
                <Link to="/albums" className="home-quick-link">
                  Build a capsule →
                </Link>
              </li>
              <li>
                <a href="https://unsplash.com" className="home-quick-link">
                  Where photos come from →
                </a>
              </li>
            </ul>
          </div>
          <div className="home-hero-visual" aria-hidden>
            <div className="home-hero-card">
              <div className="home-hero-metric">
                <span className="home-hero-metric-label">Active looks</span>
                <span className="home-hero-metric-value">{looks.length}</span>
              </div>
              <div className="home-hero-metric">
                <span className="home-hero-metric-label">Style tags</span>
                <span className="home-hero-metric-value">{STYLE_ORDER.length}</span>
              </div>
              <p className="home-hero-panel-note">
                Filter instantly—same grid, zero page reloads.
              </p>
            </div>
          </div>
        </div>
      </section>

      <nav className="aws-secondary-nav" aria-label="Product areas">
        <div className="aws-secondary-nav-inner">
          <a href="#browse-looks" className="aws-secondary-link">
            Gallery
          </a>
          <span className="aws-secondary-sep" aria-hidden>
            |
          </span>
          <Link to="/albums" className="aws-secondary-link">
            Albums
          </Link>
          <span className="aws-secondary-sep" aria-hidden>
            |
          </span>
          <button
            type="button"
            className="aws-secondary-link aws-secondary-link--btn"
            onClick={scrollToBrowse}
          >
            Featured looks
          </button>
        </div>
      </nav>

      <section className="home-features" aria-labelledby="features-heading">
        <h2 id="features-heading" className="visually-hidden">
          Why use this lookbook
        </h2>
        <ul className="home-feature-grid">
          <li className="home-feature-card">
            <h3 className="home-feature-title">Opinionated curation</h3>
            <p className="home-feature-text">
              Each look is tagged and sequenced for fast scanning—like services in a
              console, but for your wardrobe.
            </p>
          </li>
          <li className="home-feature-card">
            <h3 className="home-feature-title">Albums that scale</h3>
            <p className="home-feature-text">
              Group outfits for trips, seasons, or clients. Your saved sets stay in the
              browser, no signup required.
            </p>
          </li>
          <li className="home-feature-card">
            <h3 className="home-feature-title">Detail when you need it</h3>
            <p className="home-feature-text">
              Open any card for fabrics, palette notes, and key pieces—deep detail
              without clutter on the landing view.
            </p>
          </li>
        </ul>
      </section>

      <section id="browse-looks" className="home-gallery-section">
        <div className="home-gallery-head">
          <h2 className="home-gallery-title">Browse looks</h2>
          <p className="home-gallery-sub">
            Filter by style tag. Every tile links to a full breakdown.
          </p>
        </div>
        <section className="filters-bar" aria-label="Style filters">
        <button
          type="button"
          className={filter === 'all' ? 'filter-pill active' : 'filter-pill'}
          onClick={() => setFilter('all')}
        >
          All looks
        </button>
        {STYLE_ORDER.map((tag) => (
          <button
            key={tag}
            type="button"
            className={filter === tag ? 'filter-pill active' : 'filter-pill'}
            onClick={() => setFilter(tag)}
          >
            {STYLE_LABELS[tag]}
          </button>
        ))}
      </section>

      {filtered.length === 0 ? (
        <p className="empty-state">No looks in this filter.</p>
      ) : (
        <div className="gallery-wall">
          {filtered.map((look, i) => {
            return (
              <Link
                key={look.id}
                to={`/look/${look.id}`}
                className="wall-card"
              >
                <div className="wall-card-inner">
                  <img
                    key={`${look.id}-${look.hero}`}
                    src={look.hero}
                    alt=""
                    className="wall-img"
                    loading={i < 4 ? 'eager' : 'lazy'}
                  />
                  <div className="wall-meta">
                    <span className="wall-tag">{STYLE_LABELS[look.tag]}</span>
                    <h2 className="wall-title">{look.title}</h2>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
      </section>
    </div>
  );
}
