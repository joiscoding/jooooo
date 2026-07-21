import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

export function HomeGallery() {
  const [looks, setLooks] = useState<Look[]>([]);
  const [filter, setFilter] = useState<StyleTag | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchLooks()
      .then((data) => {
        if (!cancelled) {
          setLooks(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true);
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
      <div className="page-loading" role="status">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-loading" role="alert">
        <p>We couldn’t load the lookbook. Please refresh and try again.</p>
      </div>
    );
  }

  return (
    <div className="home">
      <section className="home-hero">
        <p className="eyebrow">Men’s seasonal edit</p>
        <h1 className="home-title">
          Looks built for
          <br />
          quiet confidence.
        </h1>
        <div className="hero-footer">
          <p className="hero-copy">
            A considered wardrobe for moving through the everyday—selected
            silhouettes, lasting layers, and effortless combinations.
          </p>
          <a className="hero-link" href="#looks">
            Explore the collection <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>

      <section className="collection" id="looks">
        <div className="collection-heading">
          <h2>Current collection</h2>
          <p>
            {filtered.length} {filtered.length === 1 ? 'look' : 'looks'}
          </p>
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

        {filtered.length === 0 ? (
          <p className="empty-state">No looks in this filter.</p>
        ) : (
          <div className="gallery-wall">
            {filtered.map((look, i) => (
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
                    <h2 className="wall-title">{look.title}</h2>
                    <span className="wall-tag">{STYLE_LABELS[look.tag]}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
