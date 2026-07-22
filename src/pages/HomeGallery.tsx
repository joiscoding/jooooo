import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1800&q=85',
  'https://images.unsplash.com/photo-1506629905607-d9c297d37b2f?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
];

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
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Studio Lookbook · 2025 / 26</p>
          <h1 className="home-title">
            Dress with
            <br />
            <em>intention.</em>
          </h1>
          <p className="hero-summary">
            A considered edit of modern menswear. Discover outfits that feel
            as good as they look.
          </p>
          <a className="hero-cta" href="#the-edit">
            Explore the edit <span aria-hidden="true">↘</span>
          </a>
        </div>
        <div className="hero-image-wrap">
          <img
            className="hero-image"
            src={looks[0]?.hero}
            alt={looks[0]?.title ?? 'Editorial menswear look'}
            onError={(event) => {
              event.currentTarget.src = FALLBACK_IMAGES[0];
            }}
          />
          <div className="hero-image-caption">
            <span>Look 01</span>
            <span>{looks[0]?.title ?? 'The opening look'}</span>
          </div>
        </div>
      </section>

      <section className="edit-intro" id="the-edit">
        <div>
          <p className="eyebrow">The edit</p>
          <h2>Find your everyday uniform.</h2>
        </div>
        <p>
          From clean silhouettes to functional layers, browse by the feeling
          you want to carry into the day.
        </p>
      </section>

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
                    alt={`${look.title} editorial`}
                    className="wall-img"
                    loading={i < 4 ? 'eager' : 'lazy'}
                    onError={(event) => {
                      event.currentTarget.src =
                        FALLBACK_IMAGES[(i + 1) % FALLBACK_IMAGES.length];
                    }}
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
