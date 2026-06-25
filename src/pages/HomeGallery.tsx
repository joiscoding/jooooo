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

  const activeLabel = filter === 'all' ? 'All looks' : STYLE_LABELS[filter];

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
        <div className="home-hero-copy">
          <p className="eyebrow">Studio Lookbook</p>
          <h1 className="home-title">
            Clothing ideas for quieter, better days.
          </h1>
          <p className="home-deck">
            A calm edit of menswear silhouettes, seasonal uniforms, and
            practical pieces designed to be revisited.
          </p>
          <div className="home-actions">
            <a className="text-cta" href="#collection">
              Explore looks
            </a>
            <span className="home-count">{looks.length} looks curated</span>
          </div>
        </div>
        <div className="home-hero-notes" aria-label="Collection highlights">
          <span>Minimal palettes</span>
          <span>Layered textures</span>
          <span>Everyday uniforms</span>
        </div>
      </section>

      <section className="collection-head" id="collection">
        <div>
          <p className="eyebrow">Browse the edit</p>
          <h2 className="section-title">{activeLabel}</h2>
        </div>
        <p className="section-meta">
          Showing {filtered.length} of {looks.length}
        </p>
      </section>

      <section className="filters-bar" aria-label="Style filters">
        {(['all', ...STYLE_ORDER] as const).map((tag) => (
          <button
            key={tag}
            type="button"
            className={filter === tag ? 'filter-pill active' : 'filter-pill'}
            onClick={() => setFilter(tag)}
            aria-pressed={filter === tag}
          >
            {tag === 'all' ? 'All looks' : STYLE_LABELS[tag]}
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
                className={i === 0 ? 'wall-card wall-card-featured' : 'wall-card'}
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
    </div>
  );
}
