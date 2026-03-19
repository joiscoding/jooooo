import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const BADGES: Record<string, string> = {
  'quiet-linen': 'Best Seller',
  'boardroom-soft': 'Best Seller',
  'sand-stone': 'New',
  'night-grid': 'New',
  'paper-white': 'Editor Pick',
  'navy-precision': 'Editor Pick',
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

  const featured = useMemo(() => looks.slice(0, 2), [looks]);
  const bestSellers = useMemo(
    () => looks.filter((l) => BADGES[l.id] === 'Best Seller'),
    [looks]
  );
  const newArrivals = useMemo(
    () => looks.filter((l) => BADGES[l.id] === 'New' || BADGES[l.id] === 'Editor Pick'),
    [looks]
  );

  if (loading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner" />
        <p>Loading lookbook&hellip;</p>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Full-width hero banner */}
      <section className="hero-banner">
        <div className="hero-banner-inner">
          <div className="hero-content">
            <span className="hero-eyebrow">Spring 2026 Collection</span>
            <h1 className="hero-title">The New Classics</h1>
            <p className="hero-subtitle">
              Timeless looks crafted with intention. Quality essentials that
              define modern menswear.
            </p>
            <button
              type="button"
              className="hero-cta"
              onClick={() => {
                document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Shop the Edit
            </button>
          </div>
          <div className="hero-image-grid">
            {featured.map((look) => (
              <Link key={look.id} to={`/look/${look.id}`} className="hero-image-link">
                <img src={look.hero} alt={look.title} className="hero-img" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Value proposition bar */}
      <section className="value-bar">
        <div className="value-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>Premium Quality</span>
        </div>
        <div className="value-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
          <span>Free Shipping</span>
        </div>
        <div className="value-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          <span>Curated Edits</span>
        </div>
        <div className="value-item">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" /></svg>
          <span>Save to Albums</span>
        </div>
      </section>

      {/* Best Sellers section */}
      {bestSellers.length > 0 && (
        <section className="curated-section">
          <div className="section-header">
            <h2 className="section-title">Best Sellers</h2>
            <p className="section-subtitle">Our most-loved looks this season</p>
          </div>
          <div className="horizontal-scroll">
            {bestSellers.map((look) => (
              <Link key={look.id} to={`/look/${look.id}`} className="product-card">
                <div className="product-img-wrap">
                  <img src={look.hero} alt={look.title} className="product-img" loading="lazy" />
                  <span className="product-badge badge-bestseller">Best Seller</span>
                </div>
                <div className="product-info">
                  <span className="product-tag">{STYLE_LABELS[look.tag]}</span>
                  <h3 className="product-name">{look.title}</h3>
                  <p className="product-meta">{look.season} &middot; {look.occasion}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Full gallery with filters */}
      <section className="gallery-section" id="gallery">
        <div className="section-header">
          <h2 className="section-title">Shop All Looks</h2>
          <p className="section-subtitle">Browse the complete collection</p>
        </div>

        <div className="filters-bar" role="group" aria-label="Style filters">
          <button
            type="button"
            className={filter === 'all' ? 'filter-pill active' : 'filter-pill'}
            onClick={() => setFilter('all')}
          >
            All
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
        </div>

        {filtered.length === 0 ? (
          <p className="empty-state">No looks match this filter.</p>
        ) : (
          <div className="product-grid">
            {filtered.map((look, i) => (
              <Link key={look.id} to={`/look/${look.id}`} className="product-card">
                <div className="product-img-wrap">
                  <img
                    src={look.hero}
                    alt={look.title}
                    className="product-img"
                    loading={i < 4 ? 'eager' : 'lazy'}
                  />
                  {BADGES[look.id] && (
                    <span className={`product-badge badge-${BADGES[look.id]?.toLowerCase().replace(' ', '')}`}>
                      {BADGES[look.id]}
                    </span>
                  )}
                  <div className="product-quick-view">Quick View</div>
                </div>
                <div className="product-info">
                  <span className="product-tag">{STYLE_LABELS[look.tag]}</span>
                  <h3 className="product-name">{look.title}</h3>
                  <p className="product-meta">{look.season} &middot; {look.occasion}</p>
                  <div className="product-items">
                    {look.keyItems.slice(0, 2).map((item) => (
                      <span key={item} className="product-item-chip">{item}</span>
                    ))}
                    {look.keyItems.length > 2 && (
                      <span className="product-item-chip more">+{look.keyItems.length - 2}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* New & Noteworthy section */}
      {newArrivals.length > 0 && (
        <section className="curated-section noteworthy-section">
          <div className="section-header">
            <h2 className="section-title">New &amp; Noteworthy</h2>
            <p className="section-subtitle">Fresh arrivals and editor picks</p>
          </div>
          <div className="noteworthy-grid">
            {newArrivals.map((look) => (
              <Link key={look.id} to={`/look/${look.id}`} className="noteworthy-card">
                <img src={look.hero} alt={look.title} className="noteworthy-img" loading="lazy" />
                <div className="noteworthy-overlay">
                  <span className="noteworthy-badge">
                    {BADGES[look.id]}
                  </span>
                  <h3 className="noteworthy-name">{look.title}</h3>
                  <span className="noteworthy-cta">View Look &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
