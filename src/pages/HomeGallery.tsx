import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const STYLE_BLURBS: Record<StyleTag, string> = {
  minimal: 'Neutrals, clean silhouettes, nothing extra.',
  streetwear: 'Layers, utility cues, and low-profile sneakers.',
  classic: 'Structure and polish, softened for every day.',
  athleisure: 'Performance-inspired pieces, worn at rest.',
  workwear: 'Durable fabrics with a heritage backbone.',
};

export function HomeGallery() {
  const [looks, setLooks] = useState<Look[]>([]);
  const [filter, setFilter] = useState<StyleTag | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const galleryRef = useRef<HTMLElement>(null);

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

  const heroLook = looks.find((l) => l.tag === 'classic') ?? looks[0];
  const featureA = looks.find((l) => l.tag === 'minimal');
  const featureB = looks.find((l) => l.tag === 'workwear');
  const styleCovers = useMemo(() => {
    const covers = new Map<StyleTag, Look>();
    for (const look of looks) {
      if (!covers.has(look.tag)) covers.set(look.tag, look);
    }
    return covers;
  }, [looks]);

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const pickStyle = (tag: StyleTag) => {
    setFilter(tag);
    scrollToGallery();
  };

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home oura">
      <section className="hero">
        {heroLook && (
          <img
            src={heroLook.hero}
            alt=""
            className="hero-img"
            loading="eager"
          />
        )}
        <div className="hero-scrim" aria-hidden="true" />
        <div className="hero-content">
          <p className="hero-eyebrow">Men · Seasonal edit</p>
          <h1 className="hero-title">
            Quiet confidence,
            <br />
            worn daily.
          </h1>
          <p className="hero-sub">
            Twenty curated looks across five style directions — built to last,
            styled to disappear into your life.
          </p>
          <div className="hero-actions">
            <button
              type="button"
              className="btn-pill light"
              onClick={scrollToGallery}
            >
              Explore the looks
            </button>
            <Link to="/albums" className="btn-pill outline-light">
              My albums
            </Link>
          </div>
        </div>
        <button
          type="button"
          className="hero-scroll-cue"
          onClick={scrollToGallery}
          aria-label="Scroll to gallery"
        >
          ↓
        </button>
      </section>

      <section className="stat-strip" aria-label="Lookbook at a glance">
        <div className="stat">
          <span className="stat-num">{looks.length}</span>
          <span className="stat-label">Curated looks</span>
        </div>
        <div className="stat">
          <span className="stat-num">5</span>
          <span className="stat-label">Style directions</span>
        </div>
        <div className="stat">
          <span className="stat-num">1</span>
          <span className="stat-label">Quiet wardrobe</span>
        </div>
        <div className="stat">
          <span className="stat-num">0</span>
          <span className="stat-label">Loud logos</span>
        </div>
      </section>

      {featureA && (
        <section className="feature-split">
          <div className="feature-media">
            <img src={featureA.hero} alt="" loading="lazy" />
          </div>
          <div className="feature-copy">
            <p className="eyebrow">Minimal / quiet</p>
            <h2 className="feature-title">
              Less on the surface. More underneath.
            </h2>
            <p className="feature-text">
              Clean silhouettes and restrained neutrals that carry you from
              morning to midnight without asking for attention.
            </p>
            <Link to={`/look/${featureA.id}`} className="btn-pill dark">
              See the look
            </Link>
          </div>
        </section>
      )}

      {featureB && (
        <section className="feature-split reverse">
          <div className="feature-media">
            <img src={featureB.hero} alt="" loading="lazy" />
          </div>
          <div className="feature-copy">
            <p className="eyebrow">Workwear / heritage</p>
            <h2 className="feature-title">
              Built for work. Kept for decades.
            </h2>
            <p className="feature-text">
              Durable fabrics and utilitarian details with a vintage-work
              influence — pieces that get better the longer you keep them.
            </p>
            <Link to={`/look/${featureB.id}`} className="btn-pill dark">
              See the look
            </Link>
          </div>
        </section>
      )}

      <section className="style-rail" aria-label="Browse by style">
        <div className="style-rail-head">
          <h2 className="section-title">Five ways to wear it</h2>
          <p className="section-sub">
            Pick a direction — the gallery follows.
          </p>
        </div>
        <div className="style-cards">
          {STYLE_ORDER.map((tag) => {
            const cover = styleCovers.get(tag);
            return (
              <button
                key={tag}
                type="button"
                className="style-card"
                onClick={() => pickStyle(tag)}
              >
                {cover && (
                  <img
                    src={cover.hero}
                    alt=""
                    className="style-card-img"
                    loading="lazy"
                  />
                )}
                <div className="style-card-meta">
                  <span className="style-card-name">{STYLE_LABELS[tag]}</span>
                  <span className="style-card-blurb">{STYLE_BLURBS[tag]}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="gallery-section" ref={galleryRef}>
        <div className="gallery-head">
          <h2 className="section-title">The gallery</h2>
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
                  <div className="wall-meta">
                    <span className="wall-tag">{STYLE_LABELS[look.tag]}</span>
                    <h2 className="wall-title">{look.title}</h2>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="cta-band">
        <h2 className="cta-title">Keep the looks you love.</h2>
        <p className="cta-sub">
          Save any look into a named album — it stays on this device, no
          account needed.
        </p>
        <Link to="/albums" className="btn-pill light">
          Start an album
        </Link>
      </section>
    </div>
  );
}
