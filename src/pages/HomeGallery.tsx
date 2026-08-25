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
          <p className="eyebrow">The men&apos;s seasonal edit</p>
          <h1 className="home-title">What do you want to wear?</h1>
          <p className="home-intro">
            A considered collection of looks for work, weekends, and everywhere in between.
          </p>
        </div>

        <div className="style-prompt">
          <div className="style-prompt-heading">
            <span>Explore by style</span>
            <span className="style-prompt-status">
              {filter === 'all' ? 'Showing the full edit' : STYLE_LABELS[filter]}
            </span>
          </div>
          <div className="filters-bar" aria-label="Style filters">
          <button
              type="button"
              className={filter === 'all' ? 'filter-pill active' : 'filter-pill'}
              aria-pressed={filter === 'all'}
              onClick={() => setFilter('all')}
            >
              All looks
          </button>
            {STYLE_ORDER.map((tag) => (
              <button
                key={tag}
                type="button"
                className={filter === tag ? 'filter-pill active' : 'filter-pill'}
                aria-pressed={filter === tag}
                onClick={() => setFilter(tag)}
              >
                {STYLE_LABELS[tag]}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="collection-heading">
        <h2>Explore the edit</h2>
        <p>{filtered.length} considered looks</p>
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
                    <div className="wall-title-row">
                      <h3 className="wall-title">{look.title}</h3>
                      <span className="wall-arrow" aria-hidden="true">
                        ↗
                      </span>
                    </div>
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
