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
      <div className="page-loading" role="status" aria-live="polite">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home">
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">Men · Seasonal edit</p>
          <h1 className="home-title">Looks built for quiet confidence.</h1>
          <p className="hero-deck">
            A considered wardrobe for moving through the world. Modern
            silhouettes, useful layers, and pieces designed to last.
          </p>
          {looks[0] && (
            <Link to={`/look/${looks[0].id}`} className="text-link">
              Explore the seasonal edit <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>
        {looks[0] && (
          <Link to={`/look/${looks[0].id}`} className="hero-visual">
            <img src={looks[0].hero} alt={looks[0].title} />
            <span className="hero-caption">
              <span>{STYLE_LABELS[looks[0].tag]}</span>
              <strong>{looks[0].title}</strong>
            </span>
          </Link>
        )}
      </section>

      <section className="manifesto" aria-labelledby="manifesto-title">
        <p className="section-index">01 / Approach</p>
        <h2 id="manifesto-title">
          Style should feel instinctive, not overthought.
        </h2>
        <p>
          This edit brings together distinct ways of dressing with one idea in
          common: fewer, better choices that make room for personality.
        </p>
      </section>

      <section className="collection" aria-labelledby="collection-title">
        <div className="collection-head">
          <div>
            <p className="section-index">02 / The collection</p>
            <h2 id="collection-title">Find your point of view.</h2>
          </div>
          <p>{filtered.length} curated looks</p>
        </div>

        <div className="filters-bar" aria-label="Style filters">
          <button
            type="button"
            className={filter === 'all' ? 'filter-pill active' : 'filter-pill'}
            onClick={() => setFilter('all')}
            aria-pressed={filter === 'all'}
          >
            All looks
          </button>
          {STYLE_ORDER.map((tag) => (
            <button
              key={tag}
              type="button"
              className={filter === tag ? 'filter-pill active' : 'filter-pill'}
              onClick={() => setFilter(tag)}
              aria-pressed={filter === tag}
            >
              {STYLE_LABELS[tag]}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="empty-state" role="status" aria-live="polite">
            No looks in this filter.
          </p>
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

      <section className="closing-statement">
        <p className="section-index">03 / Make it yours</p>
        <h2>Save what speaks to you. Build a wardrobe with intention.</h2>
        <Link to="/albums" className="text-link">
          View your albums <span aria-hidden="true">→</span>
        </Link>
      </section>
    </div>
  );
}
