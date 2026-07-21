import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const BLOCK_COPY: Record<StyleTag, string> = {
  minimal: 'Clean silhouettes and restrained neutrals.',
  streetwear: 'Utility layers built for the city.',
  classic: 'Tailored structure for desk-to-dinner.',
  athleisure: 'Performance-minded ease, all day.',
  workwear: 'Durable fabrics with heritage grit.',
};

const SOLUTION_STRIP = [
  { label: 'AI-ready layers', detail: 'Technical shells & modular knits' },
  { label: 'Edge-to-office', detail: 'Looks that travel across contexts' },
  { label: 'Green computing chic', detail: 'Fewer pieces, longer wear' },
  { label: 'Rack density style', detail: 'High-impact outfits, low clutter' },
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

  const heroSlides = useMemo(() => {
    const picks = looks.slice(0, 3);
    if (picks.length === 0) {
      return [
        {
          id: 'fallback',
          title: 'Seasonal systems',
          hero: '',
          tag: 'minimal' as StyleTag,
        },
      ];
    }
    return picks;
  }, [looks]);

  useEffect(() => {
    if (heroSlides.length < 2) return;
    const id = window.setInterval(() => {
      setSlide((s) => (s + 1) % heroSlides.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, [heroSlides.length]);

  const filtered = useMemo(() => {
    if (filter === 'all') return looks;
    return looks.filter((l) => l.tag === filter);
  }, [looks, filter]);

  const active = heroSlides[slide] ?? heroSlides[0];

  function selectFilter(next: StyleTag | 'all') {
    setFilter(next);
    const el = document.getElementById('featured');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  return (
    <div className="home home-sm">
      <section className="sm-hero" aria-labelledby="sm-hero-headline">
        <div className="sm-hero-media" aria-hidden="true">
          {heroSlides.map((item, i) =>
            item.hero ? (
              <img
                key={item.id}
                src={item.hero}
                alt=""
                className={
                  i === slide
                    ? 'sm-hero-img sm-hero-img--active'
                    : 'sm-hero-img'
                }
              />
            ) : (
              <div
                key={item.id}
                className={
                  i === slide
                    ? 'sm-hero-img sm-hero-fallback sm-hero-img--active'
                    : 'sm-hero-img sm-hero-fallback'
                }
              />
            )
          )}
          <div className="sm-hero-veil" />
        </div>

        <div className="sm-hero-content">
          <p className="sm-hero-brand">
            Studio Lookbook
            <span className="sm-hero-brand-dot" aria-hidden="true" />
          </p>
          <h1 id="sm-hero-headline" className="sm-hero-headline">
            Application-optimized outfits. Built to last.
          </h1>
          <p className="sm-hero-dek">
            Modular men’s looks you can mix like building blocks—quiet, urban,
            tailored, sporty, or heritage.
          </p>
          <div className="sm-hero-cta">
            <a className="sm-btn sm-btn--red" href="#featured">
              Explore looks
            </a>
            <a className="sm-btn sm-btn--ghost" href="#building-blocks">
              View building blocks
            </a>
          </div>
          {active?.title ? (
            <p className="sm-hero-caption">Featured · {active.title}</p>
          ) : null}
        </div>

        {heroSlides.length > 1 ? (
          <div className="sm-hero-dots" role="tablist" aria-label="Hero slides">
            {heroSlides.map((item, i) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={i === slide}
                className={i === slide ? 'sm-dot active' : 'sm-dot'}
                onClick={() => setSlide(i)}
              >
                <span className="visually-hidden">Slide {i + 1}</span>
              </button>
            ))}
          </div>
        ) : null}
      </section>

      <section className="sm-solutions" aria-label="Solution highlights">
        <ul className="sm-solutions-list">
          {SOLUTION_STRIP.map((item) => (
            <li key={item.label} className="sm-solutions-item">
              <span className="sm-solutions-label">{item.label}</span>
              <span className="sm-solutions-detail">{item.detail}</span>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="building-blocks"
        className="sm-blocks"
        aria-labelledby="sm-blocks-title"
      >
        <div className="sm-section-inner">
          <header className="sm-section-head">
            <p className="sm-section-eyebrow">Platform</p>
            <h2 id="sm-blocks-title" className="sm-section-title">
              Building Blocks
            </h2>
            <p className="sm-section-dek">
              Five aesthetic systems for fully optimized outfits—filter the
              lookbook by the block that fits your day.
            </p>
          </header>
          <ul className="sm-block-grid">
            <li>
              <button
                type="button"
                className={
                  filter === 'all'
                    ? 'sm-block-tile sm-block-tile--active'
                    : 'sm-block-tile'
                }
                onClick={() => selectFilter('all')}
              >
                <span className="sm-block-index">01</span>
                <span className="sm-block-name">All systems</span>
                <span className="sm-block-copy">
                  Full catalog across every style block.
                </span>
              </button>
            </li>
            {STYLE_ORDER.map((tag, i) => (
              <li key={tag}>
                <button
                  type="button"
                  className={
                    filter === tag
                      ? 'sm-block-tile sm-block-tile--active'
                      : 'sm-block-tile'
                  }
                  onClick={() => selectFilter(tag)}
                >
                  <span className="sm-block-index">
                    {String(i + 2).padStart(2, '0')}
                  </span>
                  <span className="sm-block-name">{STYLE_LABELS[tag]}</span>
                  <span className="sm-block-copy">{BLOCK_COPY[tag]}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="featured"
        className="sm-featured"
        aria-labelledby="sm-featured-title"
      >
        <div className="sm-section-inner">
          <header className="sm-section-head sm-section-head--row">
            <div>
              <p className="sm-section-eyebrow">Catalog</p>
              <h2 id="sm-featured-title" className="sm-section-title">
                Featured Looks
              </h2>
              <p className="sm-section-dek">
                {filter === 'all'
                  ? 'Browse the wall—select a look to open details and save to an album.'
                  : `Showing ${STYLE_LABELS[filter]} systems.`}
              </p>
            </div>
            <Link to="/albums" className="sm-text-link">
              Manage albums →
            </Link>
          </header>

          {loading ? (
            <p className="landing-loading-msg">Loading lookbook…</p>
          ) : filtered.length === 0 ? (
            <p className="empty-state">No looks in this filter.</p>
          ) : (
            <div className="gallery-wall landing-gallery-wall">
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
        </div>
      </section>
    </div>
  );
}
