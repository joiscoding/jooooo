import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const TESTIMONIALS = [
  {
    quote:
      'The offset gallery wall makes every look feel intentional — like flipping through a seasonal campaign, not a cluttered grid.',
    author: 'Marcus Chen',
    role: 'Creative director',
  },
  {
    quote:
      'Five filters that actually map to how I dress. Minimal, streetwear, classic — I save looks to albums and come back before every trip.',
    author: 'Jordan Ellis',
    role: 'Stylist',
  },
  {
    quote:
      'Quiet confidence is the right frame. Strong photography, restrained UI, and albums that persist without an account.',
    author: 'Alex Rivera',
    role: 'Editor, menswear',
  },
] as const;

const FEATURES = [
  {
    icon: '◫',
    title: 'Looks turn mood into outfits',
    description:
      'Browse editorial lookbooks built around complete outfits — hero photography first, not product grids.',
    link: '#gallery',
    linkLabel: 'Explore the gallery →',
  },
  {
    icon: '◎',
    title: 'Five aesthetics, one wall',
    description:
      'Filter by minimal, streetwear, classic, athleisure, or workwear. Find your lane without losing the editorial rhythm.',
    link: '#gallery',
    linkLabel: 'Try style filters →',
  },
  {
    icon: '▣',
    title: 'Save what resonates',
    description:
      'Create named albums and add looks from detail pages. Everything persists locally — refresh and your edits stay.',
    link: '/albums',
    linkLabel: 'Open albums →',
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

  const previewLooks = looks.slice(0, 6);

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="landing">
      <section className="landing-section landing-hero">
        <div className="landing-hero-inner">
          <p className="landing-eyebrow">Men · Seasonal edit</p>
          <h1 className="landing-title">
            Your lookbook for building quiet confidence.
          </h1>
          <p className="landing-subtitle">
            Editorial outfit discovery with five aesthetic filters, image-led
            galleries, and albums that save locally — no account required.
          </p>
          <div className="hero-actions">
            <a href="#gallery" className="btn btn-accent btn-lg">
              Browse lookbook
            </a>
            <Link to="/albums" className="btn btn-secondary btn-lg">
              My albums
            </Link>
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Highlights">
        <div className="trust-strip-inner">
          <p className="trust-label">
            Trusted for editorial calm — modern style, designed to last
          </p>
          <div className="trust-tags">
            {STYLE_ORDER.map((tag) => (
              <span key={tag} className="trust-tag">
                {STYLE_LABELS[tag]}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section features-section">
        <div className="landing-section-inner">
          <h2 className="section-heading">The new way to browse looks.</h2>
          <p className="section-lead">
            Image-first discovery, restrained filters, and local albums — built
            for men who care about how things feel, not just how they sell.
          </p>

          <div className="features-grid">
            {FEATURES.map((feature) => (
              <article key={feature.title} className="feature-card">
                <div className="feature-icon" aria-hidden="true">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.description}</p>
                <Link to={feature.link} className="feature-link">
                  {feature.linkLabel}
                </Link>
              </article>
            ))}
          </div>

          <div className="product-preview" aria-hidden="true">
            <div className="preview-chrome">
              <span className="preview-dot" />
              <span className="preview-dot" />
              <span className="preview-dot" />
              <span className="preview-url">studio-lookbook.app/gallery</span>
            </div>
            <div className="preview-body">
              <div className="preview-sidebar">
                <p className="preview-sidebar-label">Style</p>
                <button type="button" className="preview-filter active">
                  All looks
                </button>
                {STYLE_ORDER.slice(0, 3).map((tag) => (
                  <button key={tag} type="button" className="preview-filter">
                    {STYLE_LABELS[tag]}
                  </button>
                ))}
              </div>
              <div className="preview-main">
                {previewLooks.map((look) => (
                  <div key={look.id} className="preview-thumb">
                    <img src={look.hero} alt="" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="gallery" className="landing-section gallery-section">
        <div className="landing-section-inner">
          <div className="gallery-header">
            <div>
              <h2 className="section-heading">Gallery wall</h2>
              <p className="section-lead section-lead-tight">
                Filter by aesthetic and dive into full look details.
              </p>
            </div>
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
                      <h2 className="wall-title">{look.title}</h2>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="landing-section testimonials-section">
        <div className="landing-section-inner">
          <div className="testimonials-header">
            <h2 className="section-heading">Built for people who notice details.</h2>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((item) => (
              <figure key={item.author} className="testimonial-card">
                <blockquote className="testimonial-quote">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <figcaption>
                  <div className="testimonial-author">{item.author}</div>
                  <div className="testimonial-role">{item.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section landing-cta">
        <div className="landing-section-inner">
          <h2 className="section-heading">Try the lookbook now.</h2>
          <p className="section-lead">
            Browse the gallery, filter by aesthetic, and save looks to albums —
            all in your browser.
          </p>
          <div className="hero-actions">
            <a href="#gallery" className="btn btn-accent btn-lg">
              Browse lookbook
            </a>
            <Link to="/albums" className="btn btn-secondary btn-lg">
              View my albums
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
