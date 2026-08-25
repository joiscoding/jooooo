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
      <div className="page-loading" role="status">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  const featuredLook = looks[0];

  return (
    <div className="home">
      <section className="home-hero">
        <div className="hero-copy">
          <p className="hero-kicker">Men · New seasonal edit</p>
          <h1 className="home-title">
            Every day has a <em>look.</em>
          </h1>
          <p className="hero-description">
            Considered outfits for work, weekends, and everything in between.
            Start with a point of view, then make it yours.
          </p>
          <div className="hero-actions">
            <a href="#style-library" className="button button-light">
              Explore the edit
            </a>
            {featuredLook && (
              <Link to={`/look/${featuredLook.id}`} className="button button-text">
                View featured look <span aria-hidden="true">→</span>
              </Link>
            )}
          </div>
        </div>

        {featuredLook && (
          <Link to={`/look/${featuredLook.id}`} className="hero-visual">
            <img
              src={featuredLook.hero}
              alt={`${featuredLook.title} menswear look`}
            />
            <span className="hero-caption">
              <span>{STYLE_LABELS[featuredLook.tag]}</span>
              <strong>{featuredLook.title}</strong>
            </span>
          </Link>
        )}
      </section>

      <section className="home-section style-library" id="style-library">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Our edits</p>
            <h2>Find your direction</h2>
          </div>
          <p>Five distinct ways to get dressed, curated for the season ahead.</p>
        </div>

        <div className="style-grid">
          {STYLE_ORDER.map((tag) => {
            const sample = looks.find((look) => look.tag === tag);

            return (
              <button
                key={tag}
                type="button"
                className={filter === tag ? 'style-card active' : 'style-card'}
                onClick={() => setFilter(tag)}
                aria-pressed={filter === tag}
              >
                {sample && <img src={sample.hero} alt="" loading="lazy" />}
                <span className="style-card-label">
                  <span>Explore</span>
                  <strong>{STYLE_LABELS[tag]}</strong>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="home-section looks-section" id="looks">
        <div className="section-heading looks-heading">
          <div>
            <p className="section-kicker">Shop these</p>
            <h2>
              {filter === 'all' ? 'Explore all looks' : STYLE_LABELS[filter]}
            </h2>
          </div>
          <p>
            {filtered.length} {filtered.length === 1 ? 'look' : 'looks'}
          </p>
        </div>

        <div className="filters-bar" aria-label="Style filters">
          <button
            type="button"
            className={filter === 'all' ? 'filter-pill active' : 'filter-pill'}
            onClick={() => setFilter('all')}
            aria-pressed={filter === 'all'}
          >
            All looks
          </button>
          {STYLE_ORDER.map((tag) => (
            <button
              key={tag}
              type="button"
              className={filter === tag ? 'filter-pill active' : 'filter-pill'}
              onClick={() => setFilter(tag)}
              aria-pressed={filter === tag}
            >
              {STYLE_LABELS[tag]}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="empty-state">No looks in this filter.</p>
        ) : (
          <div className="gallery-wall">
            {filtered.map((look, i) => (
              <Link key={look.id} to={`/look/${look.id}`} className="wall-card">
                <img
                  key={`${look.id}-${look.hero}`}
                  src={look.hero}
                  alt={`${look.title} menswear look`}
                  className="wall-img"
                  loading={i < 4 ? 'eager' : 'lazy'}
                />
                <div className="wall-meta">
                  <div>
                    <span className="wall-tag">{STYLE_LABELS[look.tag]}</span>
                    <h3 className="wall-title">{look.title}</h3>
                  </div>
                  <span className="wall-arrow" aria-hidden="true">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="album-callout">
        <div>
          <p className="section-kicker">Make it personal</p>
          <h2>Build your own edit.</h2>
          <p>Save the looks you want to return to in one place.</p>
        </div>
        <Link to="/albums" className="button button-light">
          View your albums
        </Link>
      </section>
    </div>
  );
}
