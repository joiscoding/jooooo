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
      <div className="home-loading" aria-label="Loading lookbook">
        <div className="hero-skeleton skeleton" />
        <div className="gallery-skeleton">
          <div className="card-skeleton skeleton" />
          <div className="card-skeleton skeleton" />
          <div className="card-skeleton skeleton" />
        </div>
      </div>
    );
  }

  const featuredLook = looks.find((look) => look.tag === 'minimal') ?? looks[0];

  return (
    <div className="home">
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">The spring study · 2026</p>
          <h1 className="home-title">
            Dress for the way you want to <em>feel.</em>
          </h1>
          <p className="hero-intro">
            Considered layers, natural tones, and easy silhouettes for moving
            through every part of your day.
          </p>
          <a className="hero-cta" href="#curated-looks">
            Explore the edit
            <span aria-hidden="true">↓</span>
          </a>
        </div>
        {featuredLook && (
          <Link
            to={`/look/${featuredLook.id}`}
            className="hero-visual"
            aria-label={`Explore ${featuredLook.title}`}
          >
            <img src={featuredLook.hero} alt="" />
            <span className="hero-caption">
              <span>Featured look</span>
              {featuredLook.title}
            </span>
          </Link>
        )}
      </section>

      <section className="collection" id="curated-looks">
        <div className="collection-head">
          <div>
            <p className="eyebrow">Find your rhythm</p>
            <h2 className="collection-title">Curated looks</h2>
          </div>
          <p className="collection-count">
            {filtered.length} {filtered.length === 1 ? 'look' : 'looks'}
          </p>
        </div>

        <div className="filters-bar" aria-label="Style filters">
          <button
            type="button"
            className={filter === 'all' ? 'filter-pill active' : 'filter-pill'}
            aria-pressed={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            All looks
          </button>
          {STYLE_ORDER.map((tag) => (
            <button
              key={tag}
              type="button"
              className={filter === tag ? 'filter-pill active' : 'filter-pill'}
              aria-pressed={filter === tag}
              onClick={() => setFilter(tag)}
            >
              {STYLE_LABELS[tag]}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <p>There are no looks in this edit yet.</p>
            <button type="button" onClick={() => setFilter('all')}>
              Show all looks
            </button>
          </div>
        ) : (
          <div className="gallery-wall">
            {filtered.map((look, i) => (
              <Link
                key={look.id}
                to={`/look/${look.id}`}
                className={`wall-card wall-card-${(i % 6) + 1}`}
              >
                <div className="wall-card-inner">
                  <div className="wall-image-wrap">
                    <img
                      key={`${look.id}-${look.hero}`}
                      src={look.hero}
                      alt=""
                      className="wall-img"
                      loading={i < 4 ? 'eager' : 'lazy'}
                    />
                    <span className="card-arrow" aria-hidden="true">
                      ↗
                    </span>
                  </div>
                  <div className="wall-meta">
                    <span className="wall-tag">{STYLE_LABELS[look.tag]}</span>
                    <h2 className="wall-title">{look.title}</h2>
                    <span className="wall-season">{look.season}</span>
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
