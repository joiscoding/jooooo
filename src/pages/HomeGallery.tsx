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

  const featured = useMemo(
    () => looks.find((l) => l.id === 'navy-precision') ?? looks[0],
    [looks]
  );

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home">
      <section className="hero-band">
        <h1 className="hero-headline">
          Looks built for <span className="underline-emph">quiet</span>{' '}
          confidence.
        </h1>
        <div className="hero-aside">
          <p className="eyebrow">Men · Seasonal Edit</p>
          <p className="hero-intro">
            A considered wardrobe for the modern man — five aesthetics, one
            editorial point of view. Browse the season, then save the looks
            worth keeping.
          </p>
          <a href="#edit" className="pill-btn">
            Browse the edit <span className="arrow">→</span>
          </a>
        </div>
      </section>

      {featured && (
        <section className="feature-band" aria-label="Featured look">
          <div className="feature-text">
            <p className="eyebrow on-dark">Featured look</p>
            <h2 className="feature-title">{featured.title}</h2>
            <p className="feature-sub">
              {STYLE_LABELS[featured.tag]} · {featured.season} ·{' '}
              {featured.occasion}
            </p>
            <Link to={`/look/${featured.id}`} className="pill-btn light">
              View this look <span className="arrow">→</span>
            </Link>
          </div>
          <div className="feature-media">
            <img src={featured.hero} alt={featured.title} loading="eager" />
          </div>
        </section>
      )}

      <section id="edit" className="gallery-section">
        <div className="section-head">
          <h3 className="section-label">The edit</h3>
          <div className="filters-bar" aria-label="Style filters">
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
          </div>
        </div>

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
