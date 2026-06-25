import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const FEATURES = [
  {
    title: 'Editorial gallery wall',
    body: 'An offset, image-led grid built for discovery — quiet confidence in every frame.',
    link: '#gallery',
    linkLabel: 'Explore the gallery →',
  },
  {
    title: 'Five style filters',
    body: 'From minimal quiet to workwear heritage — find looks that match your lane.',
    link: '#gallery',
    linkLabel: 'Filter by style →',
  },
  {
    title: 'Curated albums',
    body: 'Save favorites into named albums locally. Your edit survives every refresh.',
    link: '/albums',
    linkLabel: 'View albums →',
  },
] as const;

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
    <div className="home">
      <section className="landing-hero">
        <div className="landing-hero-inner">
          <h1 className="landing-title">
            Looks built for ambitious style.
          </h1>
          <p className="landing-lead">
            A men&apos;s lookbook for quiet confidence — editorial photography,
            five aesthetic filters, and albums you curate yourself.
          </p>
          <div className="landing-cta">
            <a href="#gallery" className="btn btn-primary">
              Browse gallery
            </a>
            <Link to="/albums" className="btn btn-secondary">
              View albums
            </Link>
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Style categories">
        <p className="trust-label">Curated across five aesthetics</p>
        <ul className="trust-tags">
          {STYLE_ORDER.map((tag) => (
            <li key={tag}>{STYLE_LABELS[tag]}</li>
          ))}
        </ul>
      </section>

      <section className="features-section" aria-labelledby="features-heading">
        <h2 id="features-heading" className="section-heading">
          The new way to browse menswear.
        </h2>
        <div className="features-grid">
          {FEATURES.map((feature) => (
            <article key={feature.title} className="feature-card">
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-body">{feature.body}</p>
              {feature.link.startsWith('/') ? (
                <Link to={feature.link} className="feature-link">
                  {feature.linkLabel}
                </Link>
              ) : (
                <a href={feature.link} className="feature-link">
                  {feature.linkLabel}
                </a>
              )}
            </article>
          ))}
        </div>
      </section>

      <section id="gallery" className="gallery-section" aria-labelledby="gallery-heading">
        <div className="gallery-section-head">
          <h2 id="gallery-heading" className="section-heading section-heading--left">
            Seasonal edit
          </h2>
          <p className="gallery-section-lead">
            Filter by aesthetic, then dive into full look details.
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

      <section className="landing-cta-band">
        <h2 className="cta-band-title">Try the lookbook now.</h2>
        <div className="landing-cta">
          <a href="#gallery" className="btn btn-primary">
            Browse gallery
          </a>
          <Link to="/albums" className="btn btn-secondary">
            Start an album
          </Link>
        </div>
      </section>
    </div>
  );
}
