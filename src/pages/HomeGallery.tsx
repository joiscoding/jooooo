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

  const dominantStyle = useMemo(() => {
    if (!looks.length) return null;
    const counts = looks.reduce<Record<StyleTag, number>>(
      (acc, look) => {
        acc[look.tag] += 1;
        return acc;
      },
      {
        casual: 0,
        smart: 0,
        technical: 0,
      },
    );
    return STYLE_ORDER.reduce((current, tag) =>
      counts[tag] > counts[current] ? tag : current,
    STYLE_ORDER[0]);
  }, [looks]);

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home cursor-home">
      <section className="cursor-hero">
        <div className="cursor-hero-copy">
          <p className="eyebrow">Studio Lookbook · Collection 2026</p>
          <h1 className="home-title">
            Build your wardrobe system with <em>intentional</em> looks.
          </h1>
          <p className="hero-subtitle">
            Explore a curated edit inspired by the visual language of
            cursor.com: minimal, bold, and practical.
          </p>
          <div className="hero-actions">
            <a href="#looks" className="btn primary">
              Explore looks
            </a>
            <Link to="/albums" className="btn ghost">
              Open albums
            </Link>
          </div>
        </div>
        <div className="hero-metrics">
          <div className="hero-metric">
            <span className="hero-metric-label">Total looks</span>
            <strong>{looks.length}</strong>
          </div>
          <div className="hero-metric">
            <span className="hero-metric-label">Style tracks</span>
            <strong>{STYLE_ORDER.length}</strong>
          </div>
          <div className="hero-metric">
            <span className="hero-metric-label">Dominant style</span>
            <strong>
              {dominantStyle ? STYLE_LABELS[dominantStyle] : 'Unspecified'}
            </strong>
          </div>
        </div>
      </section>

      <section className="cursor-surface" id="looks">
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
                      alt={look.title}
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
