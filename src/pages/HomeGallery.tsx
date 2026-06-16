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

  const featuredLook = useMemo(() => {
    return looks.find((look) => look.tag === 'classic') ?? looks[0];
  }, [looks]);

  const filterCounts = useMemo(() => {
    return STYLE_ORDER.reduce<Record<StyleTag, number>>(
      (counts, tag) => ({
        ...counts,
        [tag]: looks.filter((look) => look.tag === tag).length,
      }),
      {
        minimal: 0,
        streetwear: 0,
        classic: 0,
        athleisure: 0,
        workwear: 0,
      },
    );
  }, [looks]);

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading the seasonal edit...</p>
      </div>
    );
  }

  return (
    <div className="home">
      {featuredLook ? (
        <section className="home-hero" aria-labelledby="home-title">
          <div className="hero-copy">
            <p className="eyebrow">The estate edit · Men</p>
            <h1 id="home-title" className="home-title">
              American ease, tailored for the modern season.
            </h1>
            <p className="hero-deck">
              A refined field guide to washed neutrals, soft tailoring, and
              lived-in layers with a heritage point of view.
            </p>
            <div className="hero-actions">
              <a className="primary-cta" href="#seasonal-edit">
                Explore the edit
              </a>
              <Link className="text-cta" to={`/look/${featuredLook.id}`}>
                View the cover look
              </Link>
            </div>
            <dl className="hero-notes" aria-label="Featured look details">
              <div>
                <dt>Season</dt>
                <dd>{featuredLook.season}</dd>
              </div>
              <div>
                <dt>Occasion</dt>
                <dd>{featuredLook.occasion}</dd>
              </div>
            </dl>
          </div>

          <Link
            to={`/look/${featuredLook.id}`}
            className="hero-feature-card"
            aria-label={`View ${featuredLook.title}`}
          >
            <div className="hero-image-frame">
              <img
                src={featuredLook.hero}
                alt={`${featuredLook.title} menswear look`}
                className="hero-image"
              />
            </div>
            <div className="hero-feature-caption">
              <span>{STYLE_LABELS[featuredLook.tag]}</span>
              <strong>{featuredLook.title}</strong>
            </div>
          </Link>
        </section>
      ) : null}

      <section className="collection-head" id="seasonal-edit">
        <div>
          <p className="eyebrow">Curated wardrobe</p>
          <h2 className="section-title">The seasonal collection</h2>
        </div>
        <p className="section-copy">
          Choose a mood, then open each look for the full outfit notes and
          gallery.
        </p>
      </section>

      <section className="filters-bar" aria-label="Style filters">
        <button
          type="button"
          className={filter === 'all' ? 'filter-pill active' : 'filter-pill'}
          onClick={() => setFilter('all')}
          aria-pressed={filter === 'all'}
        >
          <span>All looks</span>
          <span className="filter-count">{looks.length}</span>
        </button>
        {STYLE_ORDER.map((tag) => (
          <button
            key={tag}
            type="button"
            className={filter === tag ? 'filter-pill active' : 'filter-pill'}
            onClick={() => setFilter(tag)}
            aria-pressed={filter === tag}
          >
            <span>{STYLE_LABELS[tag]}</span>
            <span className="filter-count">{filterCounts[tag]}</span>
          </button>
        ))}
      </section>

      {filtered.length === 0 ? (
        <p className="empty-state">
          No looks match this filter. Try All looks.
        </p>
      ) : (
        <div className="gallery-wall">
          {filtered.map((look, i) => {
            return (
              <Link
                key={look.id}
                to={`/look/${look.id}`}
                className={i === 0 ? 'wall-card wall-card-feature' : 'wall-card'}
              >
                <div className="wall-card-inner">
                  <div className="wall-media">
                    <img
                      key={`${look.id}-${look.hero}`}
                      src={look.hero}
                      alt={`${look.title} menswear look`}
                      className="wall-img"
                      loading={i < 4 ? 'eager' : 'lazy'}
                    />
                  </div>
                  <div className="wall-meta">
                    <span className="wall-tag">{STYLE_LABELS[look.tag]}</span>
                    <h2 className="wall-title">{look.title}</h2>
                    <p className="wall-detail">
                      {look.season} · {look.occasion}
                    </p>
                    <span className="wall-link-text">View look</span>
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
