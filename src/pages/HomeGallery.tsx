import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const NEWS_ITEMS = [
  'New: Autumn / Winter capsule looks now live',
  'Studio Lookbook named a leader in quiet luxury styling',
  'Workwear heritage edit — durable fabrics, timeless cuts',
];

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

  const heroLook = looks[0];

  const categoryCards = useMemo(
    () =>
      STYLE_ORDER.map((tag) => ({
        tag,
        label: STYLE_LABELS[tag],
        image: looks.find((l) => l.tag === tag)?.hero,
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

  return (
    <div className="home">
      <section className="home-hero">
        {heroLook && (
          <img src={heroLook.hero} alt="" className="home-hero-bg" />
        )}
        <div className="home-hero-overlay" />
        <div className="home-hero-content">
          <p className="eyebrow">Seasonal Edit · Men</p>
          <h1 className="home-title">
            First-to-Wardrobe Style,
            <br />
            Built at Scale
          </h1>
          <p className="home-subtitle">
            Application-optimized looks for every workload — from the office
            floor to the weekend. Rack up your rotation with our newest
            seasonal systems.
          </p>
          <div className="hero-ctas">
            <a href="#looks-grid" className="btn-cta primary-cta">
              Explore Looks
            </a>
            <Link to="/albums" className="btn-cta ghost-cta">
              My Albums
            </Link>
          </div>
        </div>
      </section>

      <section className="news-strip" id="news" aria-label="News">
        <span className="news-label">News</span>
        <div className="news-items">
          {NEWS_ITEMS.map((item) => (
            <span key={item} className="news-item">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="solutions" id="solutions">
        <div className="section-head">
          <h2 className="section-title">Style Solutions</h2>
          <p className="section-sub">
            Optimized for every aesthetic workload.
          </p>
        </div>
        <div className="solutions-grid">
          {categoryCards.map((card) => (
            <button
              key={card.tag}
              type="button"
              className="solution-card"
              onClick={() => {
                setFilter(card.tag);
                document
                  .getElementById('looks-grid')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {card.image ? (
                <img src={card.image} alt="" className="solution-img" />
              ) : (
                <div className="solution-img placeholder" />
              )}
              <div className="solution-body">
                <h3>{card.label}</h3>
                <span className="solution-count">
                  {card.count} {card.count === 1 ? 'look' : 'looks'} ›
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="products" id="looks-grid">
        <div className="section-head">
          <h2 className="section-title">Featured Looks</h2>
          <p className="section-sub">
            Browse the full line-up, or filter by style family.
          </p>
        </div>

        <div className="filters-bar" role="tablist" aria-label="Style filters">
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'all'}
            className={filter === 'all' ? 'filter-tab active' : 'filter-tab'}
            onClick={() => setFilter('all')}
          >
            All Looks
          </button>
          {STYLE_ORDER.map((tag) => (
            <button
              key={tag}
              type="button"
              role="tab"
              aria-selected={filter === tag}
              className={filter === tag ? 'filter-tab active' : 'filter-tab'}
              onClick={() => setFilter(tag)}
            >
              {STYLE_LABELS[tag]}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="empty-state">No looks in this filter.</p>
        ) : (
          <div className="product-grid">
            {filtered.map((look, i) => (
              <Link key={look.id} to={`/look/${look.id}`} className="product-card">
                <div className="product-img-wrap">
                  <img
                    key={`${look.id}-${look.hero}`}
                    src={look.hero}
                    alt=""
                    className="product-img"
                    loading={i < 4 ? 'eager' : 'lazy'}
                  />
                </div>
                <div className="product-body">
                  <span className="product-tag">{STYLE_LABELS[look.tag]}</span>
                  <h3 className="product-title">{look.title}</h3>
                  <span className="product-link">Learn More ›</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
