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

  const featured = looks[0];

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
        <p className="eyebrow">Men · Seasonal edit</p>
        <h1 className="home-title">
          Looks built for{' '}
          <span className="title-underline">quiet confidence</span>.
        </h1>
        <p className="home-lede">
          A curated gallery of modern menswear — minimal silhouettes, lasting
          materials, and the calm restraint of pieces designed to endure.
        </p>
      </section>

      {featured && (
        <section className="home-featured" aria-label="Featured look">
          <Link to={`/look/${featured.id}`} className="featured-card">
            <div className="featured-copy">
              <span className="featured-label">Featured look</span>
              <h2 className="featured-title">{featured.title}</h2>
              <p className="featured-tag">{STYLE_LABELS[featured.tag]}</p>
              <span className="featured-cta">View look →</span>
            </div>
            <div className="featured-media">
              <img
                src={featured.hero}
                alt=""
                className="featured-img"
                loading="eager"
              />
            </div>
          </Link>
        </section>
      )}

      <section className="home-gallery-section" aria-label="Look gallery">
        <div className="section-head">
          <h2 className="section-title">The gallery</h2>
          <p className="section-desc">
            Browse by aesthetic — five filters, one editorial wall.
          </p>
        </div>

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
                      <h3 className="wall-title">{look.title}</h3>
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
