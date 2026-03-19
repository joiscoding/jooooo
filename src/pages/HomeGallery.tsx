import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const WALL_PATTERN = [
  { c: 'span 5', r: 'span 5' },
  { c: 'span 4', r: 'span 3' },
  { c: 'span 3', r: 'span 4' },
  { c: 'span 4', r: 'span 4' },
  { c: 'span 5', r: 'span 3' },
  { c: 'span 3', r: 'span 3' },
  { c: 'span 4', r: 'span 5' },
  { c: 'span 5', r: 'span 4' },
  { c: 'span 3', r: 'span 3' },
  { c: 'span 4', r: 'span 3' },
  { c: 'span 5', r: 'span 5' },
  { c: 'span 3', r: 'span 4' },
] as const;

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
        <div className="home-hero-inner">
          <p className="eyebrow">Men · Seasonal edit</p>
          <h1 className="home-title">
            Quality essentials. <em>Thoughtfully</em> styled.
          </h1>
          <p className="home-lede">
            A calm, image-first browse — like flipping a lookbook. Refine by
            mood, then open any look for details.
          </p>
        </div>
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
        <div
          className={
            filter === 'all' ? 'gallery-wall' : 'gallery-wall gallery-uniform'
          }
        >
          {filtered.map((look, i) => {
            const pat = WALL_PATTERN[i % WALL_PATTERN.length];
            const style =
              filter === 'all'
                ? {
                    gridColumn: pat.c,
                    gridRow: pat.r,
                  }
                : undefined;
            return (
              <Link
                key={look.id}
                to={`/look/${look.id}`}
                className="wall-card"
                style={style}
              >
                <div className="wall-card-inner">
                  <div className="wall-img-wrap">
                    <img
                      src={look.hero}
                      alt=""
                      className="wall-img"
                      loading={i < 4 ? 'eager' : 'lazy'}
                    />
                  </div>
                  <div className="wall-meta-below">
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
