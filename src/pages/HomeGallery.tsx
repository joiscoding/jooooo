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

  const heroImage =
    looks.find((l) => l.id === 'crosswalk-khaki')?.hero ??
    looks[0]?.hero ??
    '/looks/streetwear-urban-01-v2.jpg';

  return (
    <div className="home home--oura">
      <section className="oura-hero" aria-labelledby="oura-headline">
        <div className="oura-hero-media" aria-hidden="true">
          <img
            src={heroImage}
            alt=""
            className="oura-hero-img"
            fetchPriority="high"
          />
          <div className="oura-hero-wash" />
        </div>

        <div className="oura-hero-copy">
          <p className="oura-brand">Studio</p>
          <h1 id="oura-headline" className="oura-headline">
            Looks made for <em>quiet</em> days.
          </h1>
          <p className="oura-dek">
            A calm men&apos;s lookbook — soft light, considered layers, and
            outfits that feel as intentional as the morning after good sleep.
          </p>
          <div className="oura-cta">
            <a className="oura-btn oura-btn--solid" href="#lookbook">
              Explore the edit
            </a>
            <Link className="oura-btn oura-btn--ghost" to="/albums">
              View albums
            </Link>
          </div>
        </div>
      </section>

      <div id="lookbook" className="oura-body">
        {loading ? (
          <div className="page-loading">
            <p className="muted">Loading lookbook…</p>
          </div>
        ) : (
          <>
            <header className="oura-section-head">
              <h2 className="oura-section-title">
                This season&apos;s <em>edit</em>
              </h2>
              <p className="oura-section-dek">
                Browse by mood — five quiet filters, one gallery wall.
              </p>
            </header>

            <section className="filters-bar oura-filters" aria-label="Style filters">
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
              <div className="gallery-wall oura-gallery">
                {filtered.map((look, i) => (
                  <Link
                    key={look.id}
                    to={`/look/${look.id}`}
                    className="wall-card oura-card"
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
          </>
        )}
      </div>
    </div>
  );
}
