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

  return (
    <div className="home fb-home">
      <section className="fb-hero">
        <div className="fb-hero-copy">
          <p className="fb-wordmark">studio lookbook</p>
          <h1 className="fb-tagline">
            Studio Lookbook helps you discover seasonal men&apos;s looks and
            save the outfits you love to albums.
          </h1>
          <p className="fb-subtag">Looks built for quiet confidence. Men · Seasonal edit.</p>
        </div>
        <div className="fb-card-wrap">
          <div className="fb-card" aria-label="Sign-in placeholder (prototype only)">
            <form onSubmit={(e) => e.preventDefault()}>
              <input
                className="fb-input"
                type="text"
                placeholder="Email address or phone number"
                disabled
                aria-label="Email address or phone number (disabled prototype placeholder)"
              />
              <input
                className="fb-input"
                type="password"
                placeholder="Password"
                disabled
                aria-label="Password (disabled prototype placeholder)"
              />
              <button type="button" className="fb-login" disabled>
                Log In
              </button>
            </form>
            <span className="fb-forgot">Forgotten password?</span>
            <div className="fb-divider" aria-hidden="true" />
            <Link to="/albums" className="fb-create">
              Create new album
            </Link>
            <p className="fb-prototype-note">Prototype only — sign-in is a static placeholder.</p>
          </div>
          <p className="fb-page-note">
            <strong>Create an album</strong> for a season, trip or occasion.
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
