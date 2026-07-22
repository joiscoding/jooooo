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

  const heroLook = looks[0];

  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="eyebrow">Men · Seasonal edit</p>
          <h1 className="home-title">
            Dressing well, <em>made for you.</em>
          </h1>
          <p className="home-sub">
            An edit of considered looks — quiet fabrics, honest construction,
            and silhouettes built for your every day.
          </p>
          <div className="hero-actions">
            <a href="#gallery" className="btn-pill primary">
              Explore the looks
            </a>
            <Link to="/albums" className="btn-pill ghost">
              Your albums
            </Link>
          </div>
        </div>
        {heroLook && (
          <Link to={`/look/${heroLook.id}`} className="home-hero-media">
            <img src={heroLook.hero} alt="" loading="eager" />
          </Link>
        )}
      </section>

      <section className="filters-bar" id="gallery" aria-label="Style filters">
        <p className="filters-kicker">Style edits</p>
        <div className="filters-pills">
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
                  <div className="wall-img-wrap">
                    <img
                      key={`${look.id}-${look.hero}`}
                      src={look.hero}
                      alt=""
                      className="wall-img"
                      loading={i < 4 ? 'eager' : 'lazy'}
                    />
                  </div>
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

      <section className="brand-band">
        <p className="brand-band-kicker">The studio philosophy</p>
        <p className="brand-band-line">
          Fewer, better pieces — <em>worn longer.</em>
        </p>
      </section>
    </div>
  );
}
