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
      <div className="page-loading zara-loading">
        <p className="zara-loading-text">Loading</p>
      </div>
    );
  }

  return (
    <div className="home-zara">
      {heroLook && (
        <section className="zara-hero" aria-label="Featured">
          <div className="zara-hero-media">
            <img
              src={heroLook.hero}
              alt=""
              className="zara-hero-img"
              loading="eager"
              fetchPriority="high"
            />
          </div>
          <div className="zara-hero-copy">
            <p className="zara-hero-label">New in</p>
            <h1 className="zara-hero-title">{heroLook.title}</h1>
            <p className="zara-hero-sub">
              Spring selection — men&apos;s wardrobe essentials.
            </p>
            <Link to={`/look/${heroLook.id}`} className="zara-cta">
              Shop the look
            </Link>
          </div>
        </section>
      )}

      <div className="zara-content">
        <header className="zara-collection-head">
          <h2 className="zara-collection-title">Collection</h2>
          <p className="zara-collection-line" aria-hidden="true" />
        </header>

        <div
          className="zara-filters"
          role="group"
          aria-label="Filter by style"
        >
          <button
            type="button"
            className={
              filter === 'all' ? 'zara-filter is-active' : 'zara-filter'
            }
            onClick={() => setFilter('all')}
          >
            View all
          </button>
          {STYLE_ORDER.map((tag) => (
            <button
              key={tag}
              type="button"
              className={
                filter === tag ? 'zara-filter is-active' : 'zara-filter'
              }
              onClick={() => setFilter(tag)}
            >
              {STYLE_LABELS[tag]}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="empty-state zara-empty">No looks in this filter.</p>
        ) : (
          <ul className="zara-grid">
            {filtered.map((look, i) => (
              <li
                key={look.id}
                className={
                  i % 7 === 3 || i % 7 === 6
                    ? 'zara-cell zara-cell--wide'
                    : 'zara-cell'
                }
              >
                <Link to={`/look/${look.id}`} className="zara-card">
                  <div className="zara-card-img-wrap">
                    <img
                      src={look.hero}
                      alt=""
                      className="zara-card-img"
                      loading={i < 6 ? 'eager' : 'lazy'}
                    />
                  </div>
                  <div className="zara-card-meta">
                    <span className="zara-card-tag">
                      {STYLE_LABELS[look.tag]}
                    </span>
                    <span className="zara-card-title">{look.title}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
