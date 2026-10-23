import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const STYLE_BLURBS: Record<StyleTag, string> = {
  minimal: 'Neutrals, clean silhouettes, nothing extra.',
  streetwear: 'Sneakers, layers and utility cues for the city.',
  classic: 'Structure and prep, dressed just casual enough.',
  athleisure: 'Performance-inspired pieces with a relaxed fit.',
  workwear: 'Durable fabrics with a vintage-work backbone.',
};

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

  const heroLooks = looks.slice(0, 3);

  const pickStyle = (tag: StyleTag) => {
    setFilter(tag);
    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
  };

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
        <div className="hero-copy">
          <p className="eyebrow">Men · Seasonal edit</p>
          <h1 className="home-title">
            Looks built for <em>quiet</em> confidence.
          </h1>
          <p className="hero-lede">
            An outfit-first lookbook. Browse considered looks across five
            styles, then save the ones you love to your own albums.
          </p>
          <div className="hero-actions">
            <a href="#gallery" className="btn-pill dark">
              Browse looks
            </a>
            <Link to="/albums" className="btn-pill outline">
              Your albums
            </Link>
          </div>
        </div>
        <div className="hero-collage" aria-hidden="true">
          {heroLooks.map((look, i) => (
            <img
              key={look.id}
              src={look.hero}
              alt=""
              className={`hero-collage-img n${i}`}
            />
          ))}
        </div>
      </section>

      <section className="styles-section" aria-labelledby="styles-heading">
        <div className="section-head">
          <h2 id="styles-heading" className="section-title">
            Five ways to dress
          </h2>
          <p className="section-lede">
            Every look maps to one primary style. Pick a direction to start.
          </p>
        </div>
        <div className="style-cards">
          {STYLE_ORDER.map((tag, i) => (
            <button
              key={tag}
              type="button"
              className="style-card"
              onClick={() => pickStyle(tag)}
            >
              <span className="style-card-num">0{i + 1}</span>
              <span className="style-card-title">{STYLE_LABELS[tag]}</span>
              <span className="style-card-body">{STYLE_BLURBS[tag]}</span>
              <span className="style-card-link">View looks →</span>
            </button>
          ))}
        </div>
      </section>

      <section id="gallery" className="gallery-section">
        <div className="section-head">
          <h2 className="section-title">The lookbook</h2>
        </div>

        <div className="filters-bar" role="group" aria-label="Style filters">
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
            {filtered.map((look, i) => (
              <Link key={look.id} to={`/look/${look.id}`} className="wall-card">
                <div className="wall-card-inner">
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
                  <h3 className="wall-title">{look.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="cta-band">
        <h2 className="cta-title">Keep the looks you love.</h2>
        <p className="cta-body">
          Albums live in your browser, so your edits are still here after a
          refresh.
        </p>
        <Link to="/albums" className="btn-pill light">
          Start an album
        </Link>
      </section>
    </div>
  );
}
