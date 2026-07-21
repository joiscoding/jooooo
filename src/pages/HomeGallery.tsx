import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const HERO_SLIDES: {
  eyebrow: string;
  title: string;
  sub: string;
  cta: string;
  tag: StyleTag;
}[] = [
  {
    eyebrow: 'Seasonal Edit 2026',
    title: 'Wardrobe Solutions, Engineered for Every Day',
    sub: 'High-density looks optimized for the modern workload — office, weekend, and everything in between.',
    cta: 'Explore Looks',
    tag: 'minimal',
  },
  {
    eyebrow: 'New Deployment',
    title: 'Streetwear at Scale',
    sub: 'Rack up layers, graphics, and utility cues with our latest urban lineup.',
    cta: 'Learn More',
    tag: 'streetwear',
  },
  {
    eyebrow: 'Enterprise-Grade Tailoring',
    title: 'Total Style Solutions for Mission-Critical Moments',
    sub: 'Structured, dress-casual builds validated for boardrooms and dinners alike.',
    cta: 'View Lineup',
    tag: 'classic',
  },
];

const TICKER_ITEMS = [
  'Press Release: StudioLookbook announces Fall/Winter lineup with liquid-cooled linen',
  'New: Workwear / heritage collection now shipping worldwide',
  'Event: Seasonal Edit showcase — explore the full gallery below',
];

export function HomeGallery() {
  const [looks, setLooks] = useState<Look[]>([]);
  const [filter, setFilter] = useState<StyleTag | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [slide, setSlide] = useState(0);

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
    const t = setInterval(() => {
      setSlide((s) => (s + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const heroImages = useMemo(() => {
    return HERO_SLIDES.map(
      (s) => looks.find((l) => l.tag === s.tag)?.hero ?? looks[0]?.hero
    );
  }, [looks]);

  const filtered = useMemo(() => {
    if (filter === 'all') return looks;
    return looks.filter((l) => l.tag === filter);
  }, [looks, filter]);

  const categoryCards = useMemo(
    () =>
      STYLE_ORDER.map((tag) => ({
        tag,
        label: STYLE_LABELS[tag],
        img: looks.find((l) => l.tag === tag)?.hero,
        count: looks.filter((l) => l.tag === tag).length,
      })),
    [looks]
  );

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  const active = HERO_SLIDES[slide];

  return (
    <div className="sm-home">
      <section className="sm-hero" aria-label="Featured campaigns">
        {heroImages[slide] && (
          <img
            key={slide}
            src={heroImages[slide]}
            alt=""
            className="sm-hero-bg"
          />
        )}
        <div className="sm-hero-overlay" />
        <div className="sm-hero-content">
          <p className="sm-hero-eyebrow">{active.eyebrow}</p>
          <h1 className="sm-hero-title">{active.title}</h1>
          <p className="sm-hero-sub">{active.sub}</p>
          <div className="sm-hero-actions">
            <button
              type="button"
              className="sm-btn primary"
              onClick={() => {
                setFilter(active.tag);
                document
                  .getElementById('sm-products')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {active.cta}
            </button>
            <Link to="/albums" className="sm-btn outline">
              My Albums
            </Link>
          </div>
        </div>
        <div className="sm-hero-dots" role="tablist" aria-label="Hero slides">
          {HERO_SLIDES.map((s, i) => (
            <button
              key={s.title}
              type="button"
              role="tab"
              aria-selected={i === slide}
              aria-label={`Slide ${i + 1}`}
              className={i === slide ? 'sm-dot active' : 'sm-dot'}
              onClick={() => setSlide(i)}
            />
          ))}
        </div>
      </section>

      <div className="sm-ticker" aria-label="Announcements">
        <span className="sm-ticker-label">What's New</span>
        <div className="sm-ticker-track">
          <div className="sm-ticker-inner">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="sm-ticker-item">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="sm-section">
        <div className="sm-section-head">
          <h2 className="sm-section-title">Style Solutions</h2>
          <p className="sm-section-sub">
            Application-optimized looks across five product families.
          </p>
        </div>
        <div className="sm-cat-grid">
          {categoryCards.map((c) => (
            <button
              key={c.tag}
              type="button"
              className={
                filter === c.tag ? 'sm-cat-card active' : 'sm-cat-card'
              }
              onClick={() => {
                setFilter(filter === c.tag ? 'all' : c.tag);
                document
                  .getElementById('sm-products')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {c.img && <img src={c.img} alt="" className="sm-cat-img" />}
              <div className="sm-cat-body">
                <h3 className="sm-cat-title">{c.label}</h3>
                <span className="sm-cat-count">{c.count} looks</span>
                <span className="sm-learn-more">Learn More ›</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="sm-section" id="sm-products">
        <div className="sm-section-head row">
          <div>
            <h2 className="sm-section-title">
              {filter === 'all' ? 'Featured Looks' : STYLE_LABELS[filter]}
            </h2>
            <p className="sm-section-sub">
              Production-ready outfits, tested and validated.
            </p>
          </div>
          {filter !== 'all' && (
            <button
              type="button"
              className="sm-btn outline dark"
              onClick={() => setFilter('all')}
            >
              View All
            </button>
          )}
        </div>
        {filtered.length === 0 ? (
          <p className="empty-state">No looks in this filter.</p>
        ) : (
          <div className="sm-product-grid">
            {filtered.map((look, i) => (
              <Link
                key={look.id}
                to={`/look/${look.id}`}
                className="sm-product-card"
              >
                <div className="sm-product-imgwrap">
                  <img
                    src={look.hero}
                    alt=""
                    className="sm-product-img"
                    loading={i < 4 ? 'eager' : 'lazy'}
                  />
                </div>
                <div className="sm-product-body">
                  <span className="sm-product-tag">
                    {STYLE_LABELS[look.tag]}
                  </span>
                  <h3 className="sm-product-title">{look.title}</h3>
                  <p className="sm-product-meta">
                    {look.season} · {look.occasion}
                  </p>
                  <span className="sm-learn-more">Learn More ›</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
