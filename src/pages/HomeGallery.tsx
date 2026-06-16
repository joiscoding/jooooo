import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const TRUST_MARKS = [
  'Vogue',
  'GQ',
  'Mr Porter',
  'SSENSE',
  'Kinfolk',
  'Monocle',
];

const TESTIMONIALS = [
  {
    quote:
      'It was night and day from one season to another — adoption went from single digits to over 80%. The best stylists were building every client edit in Studio Lookbook.',
    name: 'Diana Hu',
    role: 'Creative Director, Atelier North',
  },
  {
    quote:
      'My favorite styling tool, hands down. Every look in our seasonal drop is tagged, saved, and shared in minutes. Our throughput has gone up incredibly.',
    name: 'Marcus Chen',
    role: 'Head of Menswear, Line & Form',
  },
  {
    quote:
      'The best curation apps have a clarity slider: you control how much structure to give the collection. Here you can browse, filter, or build full albums.',
    name: 'André Laurent',
    role: 'Stylist, Studio 14',
  },
  {
    quote:
      'Studio Lookbook quickly grew from hundreds to thousands of looks across our team. We spend more time on creative direction than file management now.',
    name: 'Patrick Okonkwo',
    role: 'Editor-in-Chief, Draft Co.',
  },
];

const FEATURES = [
  {
    eyebrow: 'Curate with clarity',
    title: 'Looks turn mood boards into outfits',
    body: 'Accelerate styling by organizing every piece, season, and occasion in one place — while you focus on the creative decisions.',
    link: '#gallery',
    linkLabel: 'Explore the gallery →',
    visual: 'gallery' as const,
  },
  {
    eyebrow: 'Build collections',
    title: 'Albums that travel with your clients',
    body: 'Save looks into custom albums for shoots, fittings, or seasonal drops. Share a polished edit without the spreadsheet chaos.',
    link: '/albums',
    linkLabel: 'View your albums →',
    visual: 'albums' as const,
  },
  {
    eyebrow: 'Filter by style',
    title: 'Find the right silhouette instantly',
    body: 'From minimal quiet luxury to heritage workwear — slice the collection by tag and land on the exact vibe you need.',
    link: '#gallery',
    linkLabel: 'Try style filters →',
    visual: 'filters' as const,
  },
];

function FeatureVisual({
  type,
  looks,
}: {
  type: 'gallery' | 'albums' | 'filters';
  looks: Look[];
}) {
  const preview = looks.slice(0, 3);

  if (type === 'gallery') {
    return (
      <div className="feature-mock">
        <div className="mock-chrome">
          <span className="mock-dot" />
          <span className="mock-dot" />
          <span className="mock-dot" />
          <span className="mock-url">studio-lookbook.app/gallery</span>
        </div>
        <div className="mock-body mock-gallery">
          {preview.map((look) => (
            <div key={look.id} className="mock-card">
              <img src={look.hero} alt="" />
              <span>{look.title}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'albums') {
    return (
      <div className="feature-mock">
        <div className="mock-chrome">
          <span className="mock-dot" />
          <span className="mock-dot" />
          <span className="mock-dot" />
          <span className="mock-url">studio-lookbook.app/albums</span>
        </div>
        <div className="mock-body mock-albums">
          <div className="mock-album-row">
            <span className="mock-album-name">Spring client edit</span>
            <span className="mock-album-count">8 looks</span>
          </div>
          <div className="mock-album-row">
            <span className="mock-album-name">Weekend casual</span>
            <span className="mock-album-count">5 looks</span>
          </div>
          <div className="mock-album-row">
            <span className="mock-album-name">Boardroom rotation</span>
            <span className="mock-album-count">12 looks</span>
          </div>
          <div className="mock-album-add">+ New album</div>
        </div>
      </div>
    );
  }

  return (
    <div className="feature-mock">
      <div className="mock-chrome">
        <span className="mock-dot" />
        <span className="mock-dot" />
        <span className="mock-dot" />
        <span className="mock-url">studio-lookbook.app</span>
      </div>
      <div className="mock-body mock-filters">
        {STYLE_ORDER.slice(0, 4).map((tag, i) => (
          <button
            key={tag}
            type="button"
            className={i === 1 ? 'mock-pill active' : 'mock-pill'}
          >
            {STYLE_LABELS[tag]}
          </button>
        ))}
        {preview[0] && (
          <div className="mock-filter-result">
            <img src={preview[0].hero} alt="" />
            <div>
              <span className="mock-filter-tag">
                {STYLE_LABELS[preview[0].tag]}
              </span>
              <strong>{preview[0].title}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function HomeGallery() {
  const [looks, setLooks] = useState<Look[]>([]);
  const [filter, setFilter] = useState<StyleTag | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

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

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveTestimonial((i) => (i + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, []);

  const filtered = useMemo(() => {
    if (filter === 'all') return looks;
    return looks.filter((l) => l.tag === filter);
  }, [looks, filter]);

  const heroLooks = looks.slice(0, 4);

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="landing">
      <section className="landing-hero">
        <div className="landing-hero-content">
          <h1 className="landing-hero-title">
            Studio Lookbook is your styling agent for building ambitious
            wardrobes.
          </h1>
          <p className="landing-hero-sub">
            Curate seasonal edits, filter by style, and save client-ready
            albums — all in one modern menswear library.
          </p>
          <div className="landing-hero-cta">
            <Link to="#gallery" className="btn btn-primary">
              Browse the gallery
            </Link>
            <Link to="/albums" className="btn btn-ghost">
              Open albums
            </Link>
          </div>
        </div>

        <div className="landing-hero-visual" aria-hidden="true">
          <div className="hero-mock">
            <div className="mock-chrome">
              <span className="mock-dot" />
              <span className="mock-dot" />
              <span className="mock-dot" />
              <span className="mock-url">studio-lookbook.app</span>
            </div>
            <div className="hero-mock-grid">
              {heroLooks.map((look) => (
                <div key={look.id} className="hero-mock-card">
                  <img src={look.hero} alt="" />
                  <div className="hero-mock-meta">
                    <span>{STYLE_LABELS[look.tag]}</span>
                    <strong>{look.title}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Trusted by">
        <p className="trust-label">
          Trusted every day by teams that build world-class style
        </p>
        <div className="trust-logos">
          {TRUST_MARKS.map((name) => (
            <span key={name} className="trust-logo">
              {name}
            </span>
          ))}
        </div>
      </section>

      <section id="features" className="features-section">
        {FEATURES.map((feature, index) => (
          <article
            key={feature.title}
            className={
              index % 2 === 1 ? 'feature-block feature-reverse' : 'feature-block'
            }
          >
            <div className="feature-copy">
              <p className="feature-eyebrow">{feature.eyebrow}</p>
              <h2 className="feature-title">{feature.title}</h2>
              <p className="feature-body">{feature.body}</p>
              <Link to={feature.link} className="feature-link">
                {feature.linkLabel}
              </Link>
            </div>
            <FeatureVisual type={feature.visual} looks={looks} />
          </article>
        ))}
      </section>

      <section className="frontier-section">
        <div className="section-header">
          <h2 className="section-title">Stay on the frontier of menswear.</h2>
        </div>
        <div className="frontier-grid">
          <div className="frontier-card">
            <h3>Filter by every style lane</h3>
            <p>
              Minimal, streetwear, classic, athleisure, and workwear — switch
              contexts without losing your place.
            </p>
            <div className="frontier-pills">
              {STYLE_ORDER.map((tag) => (
                <span key={tag} className="frontier-pill">
                  {STYLE_LABELS[tag]}
                </span>
              ))}
            </div>
          </div>
          <div className="frontier-card">
            <h3>Complete look context</h3>
            <p>
              Every outfit ships with season, occasion, and key pieces — so
              you never guess what makes the look work.
            </p>
            <div className="frontier-detail">
              <span className="frontier-detail-q">
                What pieces define this look?
              </span>
              <span className="frontier-detail-a">
                Unstructured blazer · Oxford shirt · Tapered chinos
              </span>
            </div>
          </div>
          <div className="frontier-card">
            <h3>Build enduring collections</h3>
            <p>
              Save looks into albums for clients, campaigns, or your own
              rotation. Designed to last beyond a single season.
            </p>
            <Link to="/albums" className="feature-link">
              Start an album →
            </Link>
          </div>
        </div>
      </section>

      <section id="gallery" className="gallery-section">
        <div className="section-header">
          <p className="section-eyebrow">Seasonal edit</p>
          <h2 className="section-title">The new way to browse menswear.</h2>
          <p className="section-sub">
            Filter by style and dive into full look details — key items,
            occasion, and gallery shots included.
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

      <section className="testimonials-section">
        <div className="section-header">
          <h2 className="section-title">Loved by stylists everywhere.</h2>
        </div>
        <div className="testimonial-stage">
          {TESTIMONIALS.map((t, i) => (
            <blockquote
              key={t.name}
              className={
                i === activeTestimonial
                  ? 'testimonial active'
                  : 'testimonial'
              }
            >
              <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
              <footer>
                <cite className="testimonial-name">{t.name}</cite>
                <span className="testimonial-role">{t.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>
        <div className="testimonial-dots" aria-hidden="true">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.name}
              type="button"
              className={i === activeTestimonial ? 't-dot active' : 't-dot'}
              onClick={() => setActiveTestimonial(i)}
              aria-label={`Show testimonial from ${t.name}`}
            />
          ))}
        </div>
      </section>

      <section className="cta-section">
        <h2 className="cta-title">Try Studio Lookbook now.</h2>
        <p className="cta-sub">
          Browse the full gallery or start building your first album.
        </p>
        <div className="landing-hero-cta">
          <Link to="#gallery" className="btn btn-primary btn-lg">
            Browse the gallery
          </Link>
          <Link to="/albums" className="btn btn-ghost btn-lg">
            Create an album
          </Link>
        </div>
      </section>
    </div>
  );
}
