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

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home">
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">Super Deal Week</p>
          <h1 className="home-title">Style picks with up to 55% off.</h1>
          <p className="hero-subtitle">
            Shop curated looks, save through cashback-style pricing, and
            discover daily drops.
          </p>
          <div className="hero-cta-row">
            <a href="#featured-look-grid" className="hero-cta primary">
              Shop Featured
            </a>
            <a href="#style-filters" className="hero-cta secondary">
              Browse by Style
            </a>
          </div>
        </div>
        <aside className="hero-deals" aria-label="Deal highlights">
          <h2 className="deal-title">Today&apos;s top offers</h2>
          <ul className="deal-list">
            <li>
              <span>Cashback bonus</span>
              <strong>8% back</strong>
            </li>
            <li>
              <span>Flash voucher</span>
              <strong>$20 off $100+</strong>
            </li>
            <li>
              <span>New shopper deal</span>
              <strong>Free shipping</strong>
            </li>
          </ul>
        </aside>
      </section>

      <section
        id="style-filters"
        className="filters-bar"
        aria-label="Style filters"
      >
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

      <section className="promo-strip" aria-label="Shopping benefits">
        <p>Daily markdowns</p>
        <p>Member-only offers</p>
        <p>Curated seasonal trends</p>
      </section>

      {filtered.length === 0 ? (
        <p className="empty-state">No looks in this filter.</p>
      ) : (
        <section id="featured-look-grid">
          <div className="section-head">
            <h2>Featured looks</h2>
            <p>{filtered.length} styles available</p>
          </div>
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
        </section>
      )}
    </div>
  );
}
