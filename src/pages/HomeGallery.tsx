import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const HERO_IMAGE = '/looks/1768809250854-2f4b1e8f19cc-w1200h1600.jpg';

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

  return (
    <div className="home">
      <section className="cinematic-hero" aria-label="Seasonal lookbook">
        <div className="cinematic-hero__media" aria-hidden="true">
          <img
            src={HERO_IMAGE}
            alt=""
            className="cinematic-hero__img"
            fetchPriority="high"
          />
          <div className="cinematic-hero__veil" />
        </div>

        <div className="cinematic-hero__content">
          <p className="cinematic-hero__brand">Studio</p>
          <h1 className="cinematic-hero__title">
            Quiet. <em>Presence.</em>
          </h1>
          <p className="cinematic-hero__lede">
            Men&apos;s looks designed for everyday ease.
          </p>
          <a href="#lookbook" className="btn btn-pill">
            Explore
          </a>
        </div>
      </section>

      <section className="editorial-band" aria-labelledby="editorial-heading">
        <p className="editorial-band__eyebrow">Form meets function</p>
        <h2 id="editorial-heading" className="editorial-band__title">
          Built for lasting style, <em>worn every day</em>
        </h2>
        <p className="editorial-band__copy">
          An editorial lookbook of quiet silhouettes, considered layers, and
          pieces that earn their place in rotation.
        </p>
      </section>

      <section id="lookbook" className="lookbook">
        <div className="lookbook__intro">
          <h2 className="lookbook__heading">
            The lookbook <em>edit</em>
          </h2>
          <p className="lookbook__sub">
            Filter by aesthetic, then open a look.
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

        {loading ? (
          <div className="page-loading">
            <p className="muted">Loading lookbook…</p>
          </div>
        ) : filtered.length === 0 ? (
          <p className="empty-state">No looks in this filter.</p>
        ) : (
          <div className="gallery-wall">
            {filtered.map((look, i) => (
              <Link
                key={look.id}
                to={`/look/${look.id}`}
                className="wall-card"
                style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
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
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
