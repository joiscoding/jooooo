import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const STYLE_TILE_LABELS: Record<StyleTag, string> = {
  minimal: 'Minimal',
  streetwear: 'Streetwear',
  classic: 'Tailored',
  athleisure: 'Athleisure',
  workwear: 'Workwear',
};

const HERO_IMAGE = '/looks/1630877268428-616cc533239a-w1200h1500.jpg';
const CTA_IMAGE = '/looks/1768809250854-2f4b1e8f19cc-w1200h1600.jpg';

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

  const styleTiles = useMemo(() => {
    return STYLE_ORDER.map((tag) => {
      const sample = looks.find((l) => l.tag === tag);
      return {
        tag,
        label: STYLE_TILE_LABELS[tag],
        image: sample?.hero ?? HERO_IMAGE,
      };
    });
  }, [looks]);

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
    <div className="home">
      <section className="hero" aria-labelledby="hero-title">
        <img
          src={HERO_IMAGE}
          alt=""
          className="hero-media"
          loading="eager"
        />
        <div className="hero-content">
          <span className="hero-eyebrow">New · Men’s Edit</span>
          <h1 id="hero-title" className="hero-title">
            Built to move.
            <br />
            Made to last.
          </h1>
          <p className="hero-sub">
            Performance-minded essentials and editorial looks engineered for
            every part of your day — from the studio to the street.
          </p>
          <div className="hero-cta-row">
            <a href="#featured" className="btn invert">
              Shop the edit
            </a>
            <a href="#styles" className="btn outline-light">
              Explore styles
            </a>
          </div>
        </div>
      </section>

      <section className="section" id="styles" aria-labelledby="styles-title">
        <div className="section-head">
          <div>
            <p className="section-eyebrow">Shop by style</p>
            <h2 id="styles-title" className="section-title">
              Find your fit
            </h2>
          </div>
          <a href="#featured" className="section-link">
            See all looks
          </a>
        </div>
        <div className="style-tiles">
          {styleTiles.map((t) => (
            <button
              key={t.tag}
              type="button"
              className="style-tile"
              onClick={() => {
                setFilter(t.tag);
                const el = document.getElementById('featured');
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              aria-label={`Filter looks by ${t.label}`}
            >
              <img src={t.image} alt="" className="style-tile-img" />
              <span className="style-tile-label">{t.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section
        className="section"
        id="featured"
        aria-labelledby="featured-title"
      >
        <div className="section-head">
          <div>
            <p className="section-eyebrow">Featured</p>
            <h2 id="featured-title" className="section-title">
              The lookbook
            </h2>
          </div>
        </div>

        <div className="filters-bar" role="group" aria-label="Style filters">
          <button
            type="button"
            className={filter === 'all' ? 'filter-pill active' : 'filter-pill'}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          {STYLE_ORDER.map((tag) => (
            <button
              key={tag}
              type="button"
              className={filter === tag ? 'filter-pill active' : 'filter-pill'}
              onClick={() => setFilter(tag)}
            >
              {STYLE_TILE_LABELS[tag]}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="empty-state">No looks in this filter.</p>
        ) : (
          <div className="gallery-wall">
            {filtered.map((look, i) => (
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
                    <h3 className="wall-title">{look.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="value-strip" aria-label="Why shop with us">
        <div className="value-grid">
          <div className="value-item">
            <h3>Free shipping</h3>
            <p>Complimentary shipping on every order $100+.</p>
          </div>
          <div className="value-item">
            <h3>Built to last</h3>
            <p>Premium fabrics and considered construction, season after season.</p>
          </div>
          <div className="value-item">
            <h3>Save your looks</h3>
            <p>Curate albums of your favorite outfits — stored right in your browser.</p>
          </div>
        </div>
      </section>

      <section className="cta-banner" aria-labelledby="cta-title">
        <img src={CTA_IMAGE} alt="" className="cta-banner-media" />
        <div className="cta-banner-inner">
          <h2 id="cta-title">Move with intention.</h2>
          <p>
            Save the looks that move you. Build albums, refine your edit, and
            come back any time — your selection is always waiting.
          </p>
          <Link to="/albums" className="btn invert">
            Start your album
          </Link>
        </div>
      </section>
    </div>
  );
}
