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

  const heroLook = filtered[0] ?? looks[0];
  const editorialPair = useMemo(() => {
    const pool = filter === 'all' ? looks : filtered;
    if (pool.length < 3) return [] as Look[];
    return [pool[1], pool[2]] as [Look, Look];
  }, [looks, filtered, filter]);

  if (loading) {
    return (
      <div className="zara-home">
        <div className="zara-loading">
          <p>Loading</p>
        </div>
      </div>
    );
  }

  return (
    <div className="zara-home">
      {heroLook ? (
        <section className="zara-hero" aria-labelledby="zara-hero-heading">
          <Link
            to={`/look/${heroLook.id}`}
            className="zara-hero-link"
            aria-describedby="zara-hero-heading"
          >
            <div className="zara-hero-media">
              <img
                src={heroLook.hero}
                alt=""
                className="zara-hero-img"
                fetchPriority="high"
              />
            </div>
            <div className="zara-hero-overlay">
              <p id="zara-hero-heading" className="zara-hero-kicker">
                New in
              </p>
              <h1 className="zara-hero-title">{heroLook.title}</h1>
              <span className="zara-hero-cta">View</span>
            </div>
          </Link>
        </section>
      ) : null}

      {editorialPair.length === 2 ? (
        <section className="zara-split" aria-label="Editorial picks">
          {editorialPair.map((look) => (
            <Link
              key={look.id}
              to={`/look/${look.id}`}
              className="zara-split-cell"
            >
              <img src={look.hero} alt="" className="zara-split-img" />
              <span className="zara-split-label">{look.title}</span>
            </Link>
          ))}
        </section>
      ) : null}

      <nav className="zara-filters" aria-label="Style filters">
        <button
          type="button"
          className={filter === 'all' ? 'zara-filter is-active' : 'zara-filter'}
          onClick={() => setFilter('all')}
        >
          View all
        </button>
        {STYLE_ORDER.map((tag) => (
          <button
            key={tag}
            type="button"
            className={filter === tag ? 'zara-filter is-active' : 'zara-filter'}
            onClick={() => setFilter(tag)}
          >
            {STYLE_LABELS[tag]}
          </button>
        ))}
      </nav>

      {filtered.length === 0 ? (
        <p className="zara-empty">No looks in this category.</p>
      ) : (
        <section className="zara-grid-wrap" aria-label="Looks">
          <ul className="zara-grid">
            {filtered.map((look, i) => (
              <li key={look.id} className="zara-tile">
                <Link to={`/look/${look.id}`} className="zara-tile-link">
                  <div className="zara-tile-media">
                    <img
                      src={look.hero}
                      alt=""
                      className="zara-tile-img"
                      loading={i < 8 ? 'eager' : 'lazy'}
                    />
                  </div>
                  <div className="zara-tile-meta">
                    <span className="zara-tile-name">{look.title}</span>
                    <span className="zara-tile-tag">
                      {STYLE_LABELS[look.tag]}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
