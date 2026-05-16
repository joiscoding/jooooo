import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

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

  const heroLook = looks[0];

  if (loading) {
    return (
      <div className="zara-loading">
        <p>Loading</p>
      </div>
    );
  }

  return (
    <div className="home home--zara">
      {heroLook && (
        <section className="zara-hero" aria-label="Featured collection">
          <Link to={`/look/${heroLook.id}`} className="zara-hero-link">
            <img
              src={heroLook.hero}
              alt=""
              className="zara-hero-img"
              loading="eager"
            />
            <div className="zara-hero-copy">
              <p className="zara-hero-eyebrow">The new</p>
              <h1 className="zara-hero-title">Men&apos;s collection</h1>
              <span className="zara-hero-cta">View editorial</span>
            </div>
          </Link>
        </section>
      )}

      <section className="zara-editorial-strip" aria-label="Highlights">
        <div className="zara-editorial-card">
          <p className="zara-editorial-label">Campaign</p>
          <p className="zara-editorial-text">Urban tailoring for transitional weather.</p>
        </div>
        <div className="zara-editorial-card">
          <p className="zara-editorial-label">In store</p>
          <p className="zara-editorial-text">Essential layers, neutral palette, sharp lines.</p>
        </div>
      </section>

      <nav className="zara-categories" aria-label="Style filters">
        <button
          type="button"
          className={filter === 'all' ? 'zara-category zara-category--active' : 'zara-category'}
          onClick={() => setFilter('all')}
        >
          View all
        </button>
        {STYLE_ORDER.map((tag) => (
          <button
            key={tag}
            type="button"
            className={filter === tag ? 'zara-category zara-category--active' : 'zara-category'}
            onClick={() => setFilter(tag)}
          >
            {STYLE_LABELS[tag]}
          </button>
        ))}
      </nav>

      <section className="zara-catalog" aria-label="Looks">
        <div className="zara-catalog-head">
          <h2 className="zara-catalog-title">
            {filter === 'all' ? 'All looks' : STYLE_LABELS[filter]}
          </h2>
          <p className="zara-catalog-count">{filtered.length} items</p>
        </div>

        {filtered.length === 0 ? (
          <p className="zara-empty">No looks in this category.</p>
        ) : (
          <ul className="zara-grid">
            {filtered.map((look, i) => (
              <li key={look.id} className="zara-product">
                <Link to={`/look/${look.id}`} className="zara-product-link">
                  <div className="zara-product-media">
                    <img
                      src={look.hero}
                      alt=""
                      className="zara-product-img"
                      loading={i < 8 ? 'eager' : 'lazy'}
                    />
                  </div>
                  <div className="zara-product-info">
                    <p className="zara-product-name">{look.title}</p>
                    <p className="zara-product-meta">{STYLE_LABELS[look.tag]}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
