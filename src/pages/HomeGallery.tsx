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

  const featuredLook = looks.find((l) => l.tag === 'classic') ?? looks[0];

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading collection…</p>
      </div>
    );
  }

  return (
    <div className="home">
      <section className="rl-hero">
        {featuredLook && (
          <img
            src={featuredLook.hero}
            alt=""
            className="rl-hero-img"
            loading="eager"
          />
        )}
        <div className="rl-hero-overlay" />
        <div className="rl-hero-content">
          <p className="rl-hero-eyebrow">Men · Fall/Winter</p>
          <h1 className="rl-hero-title">
            Timeless
            <br />
            <em>American</em> Style
          </h1>
          {featuredLook && (
            <Link to={`/look/${featuredLook.id}`} className="rl-cta">
              Explore the Collection
            </Link>
          )}
        </div>
      </section>

      <section className="rl-editorial">
        <div className="rl-editorial-inner">
          <p className="rl-editorial-eyebrow">Since always</p>
          <h2 className="rl-editorial-title">Crafted for Life</h2>
          <p className="rl-editorial-copy">
            From the boardroom to the weekend — a curated edit of looks that
            honor heritage tailoring, quiet confidence, and enduring quality.
          </p>
        </div>
      </section>

      <section className="rl-collection">
        <div className="rl-collection-head">
          <h2 className="rl-section-title">The Collection</h2>
          <div className="filters-bar rl-filters" aria-label="Style filters">
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
        </div>

        {filtered.length === 0 ? (
          <p className="empty-state">No looks in this category.</p>
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
                      <span className="wall-shop">Shop the Look</span>
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
