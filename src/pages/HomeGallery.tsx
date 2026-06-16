import { useEffect, useMemo, useState, type SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const FALLBACK_IMAGE =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

function handleImageError(event: SyntheticEvent<HTMLImageElement>) {
  const image = event.currentTarget;
  if (image.classList.contains('is-missing')) return;
  image.classList.add('is-missing');
  image.alt = '';
  image.src = FALLBACK_IMAGE;
}

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

  const featuredLook = looks[0];
  const filterLabel =
    filter === 'all' ? 'all styles' : STYLE_LABELS[filter].toLowerCase();

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-copy">
          <p className="eyebrow">Studio Lookbook</p>
          <h1 id="home-title" className="home-title">
            Dress with intention.
          </h1>
          <p className="home-deck">
            A precise menswear edit for quiet uniforms, expressive layers, and
            the daily decisions between them.
          </p>
          <div className="home-actions" aria-label="Landing page actions">
            <a className="home-action primary" href="#archive">
              Explore looks
            </a>
            <Link className="home-action secondary" to="/albums">
              Build an album
            </Link>
          </div>
        </div>

        {featuredLook ? (
          <Link
            to={`/look/${featuredLook.id}`}
            className="home-feature-card"
            aria-label={`View featured look ${featuredLook.title}`}
          >
            <img
              src={featuredLook.hero}
              alt={`${featuredLook.title} outfit`}
              className="home-feature-img"
              loading="eager"
              onError={handleImageError}
            />
            <div className="home-feature-meta">
              <span>{STYLE_LABELS[featuredLook.tag]}</span>
              <strong>{featuredLook.title}</strong>
            </div>
          </Link>
        ) : null}
      </section>

      <section className="gallery-section" id="archive">
        <div className="home-section-head">
          <p className="eyebrow">Archive</p>
          <h2>Browse {filterLabel}.</h2>
          <p>
            {filtered.length} look{filtered.length === 1 ? '' : 's'} selected
            from the seasonal wardrobe.
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

        {filtered.length === 0 ? (
          <p className="empty-state">No looks in this filter.</p>
        ) : (
          <div className="gallery-wall">
            {filtered.map((look, i) => {
              return (
                <Link
                  key={look.id}
                  to={`/look/${look.id}`}
                  className={
                    i === 0 ? 'wall-card wall-card-large' : 'wall-card'
                  }
                  aria-label={`View ${look.title} look`}
                >
                  <div className="wall-card-inner">
                    <img
                      key={`${look.id}-${look.hero}`}
                      src={look.hero}
                      alt={`${look.title} outfit`}
                      className="wall-img"
                      loading={i < 4 ? 'eager' : 'lazy'}
                      onError={handleImageError}
                    />
                    <div className="wall-meta">
                      <span className="wall-tag">{STYLE_LABELS[look.tag]}</span>
                      <h3 className="wall-title">{look.title}</h3>
                      <p className="wall-details">
                        {look.season} · {look.occasion}
                      </p>
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
