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
      <div className="page-loading">
        <p className="muted">Loading collection…</p>
      </div>
    );
  }

  return (
    <div className="home">
      {heroLook && (
        <section className="home-banner" aria-label="Featured collection">
          <Link to={`/look/${heroLook.id}`} className="home-banner-link">
            <img
              src={heroLook.hero}
              alt=""
              className="home-banner-img"
              loading="eager"
            />
            <div className="home-banner-copy">
              <p className="home-banner-eyebrow">The new</p>
              <h1 className="home-banner-title">Men&apos;s collection</h1>
              <span className="home-banner-cta">View look</span>
            </div>
          </Link>
        </section>
      )}

      <section className="home-editorial" aria-labelledby="editorial-heading">
        <h2 id="editorial-heading" className="home-section-label">
          Seasonal edit
        </h2>
        <p className="home-section-desc">
          Essential pieces. Clean lines. Nothing extra.
        </p>
      </section>

      <section className="filters-bar" aria-label="Style filters">
        <button
          type="button"
          className={filter === 'all' ? 'filter-tab active' : 'filter-tab'}
          onClick={() => setFilter('all')}
        >
          View all
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
                    loading={i < 6 ? 'eager' : 'lazy'}
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
