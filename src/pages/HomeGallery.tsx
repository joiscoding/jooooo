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
          <p className="eyebrow">Member week · Men's style rewards</p>
          <h1 className="home-title">
            Big outfit energy, bigger cashback feeling.
          </h1>
          <p className="hero-subtitle">
            Explore curated looks, save favorites, and build a wardrobe that
            feels like a smarter way to shop.
          </p>
          <div className="hero-actions">
            <a href="#looks" className="hero-cta">
              Shop the edit
            </a>
            <span className="hero-promo">Up to 12% back on featured fits</span>
          </div>
        </div>
        <div className="hero-deal-card" aria-label="Featured member offer">
          <span>Today only</span>
          <strong>12%</strong>
          <p>Cashback-style rewards on the seasonal lookbook.</p>
        </div>
      </section>

      <section className="rewards-strip" aria-label="Shopping benefits">
        <span>Free shipping inspiration</span>
        <span>Members earn more</span>
        <span>Save looks to albums</span>
      </section>

      <section id="looks" className="filters-bar" aria-label="Style filters">
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
    </div>
  );
}
