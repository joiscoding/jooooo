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

  const heroLook = filtered[0];

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home">
      <section className="home-hero-cinematic" aria-label="Featured collection">
        {heroLook ? (
          <>
            <img
              src={heroLook.hero}
              alt=""
              className="home-hero-media"
              fetchPriority="high"
            />
            <div className="home-hero-scrim" aria-hidden />
          </>
        ) : (
          <div className="home-hero-fallback" aria-hidden />
        )}
        <div className="home-hero-inner">
          <p className="home-hero-eyebrow">Men · Seasonal drop</p>
          <h1 className="home-hero-headline">
            Feel good. Look sharp.
            <span className="home-hero-headline-sub"> On the move.</span>
          </h1>
          <p className="home-hero-dek">
            Versatile layers, clean lines, and pieces that work from commute
            to cooldown.
          </p>
          <a href="#collection" className="home-hero-cta">
            Shop the edits
          </a>
        </div>
      </section>

      <div className="home-body">
        <section className="home-editorial">
          <h2 className="home-editorial-title">Designed for real life</h2>
          <p className="home-editorial-copy">
            Explore curated looks by vibe—then tap in for fabrics, key items,
            and styling notes.
          </p>
        </section>

        <section
          id="collection"
          className="filters-bar home-filters"
          aria-label="Style filters"
        >
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
          <div className="gallery-wall home-gallery">
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
                      <span className="wall-tag">
                        {STYLE_LABELS[look.tag]}
                      </span>
                      <h2 className="wall-title">{look.title}</h2>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
