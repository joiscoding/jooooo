import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const HERO_IMAGE = '/looks/1630877268428-616cc533239a-w1200h1500.jpg';

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

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home home--lulu">
      <section className="home-hero-banner" aria-label="Seasonal campaign">
        <img
          src={HERO_IMAGE}
          alt=""
          className="home-hero-banner__img"
          fetchPriority="high"
        />
        <div className="home-hero-banner__scrim" aria-hidden />
        <div className="home-hero-banner__inner">
          <p className="eyebrow eyebrow--light">Men · New season</p>
          <h1 className="home-hero-headline">
            Feel ready
            <br />
            for anything.
          </h1>
          <p className="home-hero-lede">
            Performance-inspired looks built to move with you—from studio to
            street.
          </p>
          <div className="home-hero-actions">
            <button
              type="button"
              className="btn btn-hero"
              onClick={scrollToGallery}
            >
              Shop the edit
            </button>
            <Link to="/albums" className="btn btn-hero-ghost">
              View albums
            </Link>
          </div>
        </div>
      </section>

      <div className="home-body">
        <section
          ref={galleryRef}
          className="home-section"
          aria-labelledby="shop-by-style"
        >
          <div className="home-section-head">
            <h2 id="shop-by-style" className="section-title">
              Shop by style
            </h2>
            <p className="section-subtitle">
              {filtered.length} look{filtered.length === 1 ? '' : 's'}
            </p>
          </div>

          <div
            className="filters-bar filters-bar--tabs"
            aria-label="Style filters"
          >
            <button
              type="button"
              className={filter === 'all' ? 'filter-tab active' : 'filter-tab'}
              onClick={() => setFilter('all')}
            >
              All looks
            </button>
            {STYLE_ORDER.map((tag) => (
              <button
                key={tag}
                type="button"
                className={
                  filter === tag ? 'filter-tab active' : 'filter-tab'
                }
                onClick={() => setFilter(tag)}
              >
                {STYLE_LABELS[tag]}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="empty-state">No looks in this filter.</p>
          ) : (
            <ul className="product-grid">
              {filtered.map((look, i) => (
                <li key={look.id}>
                  <Link to={`/look/${look.id}`} className="product-card">
                    <div className="product-card__media">
                      <img
                        src={look.hero}
                        alt=""
                        className="product-card__img"
                        loading={i < 6 ? 'eager' : 'lazy'}
                      />
                    </div>
                    <div className="product-card__meta">
                      <span className="product-card__tag">
                        {STYLE_LABELS[look.tag]}
                      </span>
                      <h3 className="product-card__title">{look.title}</h3>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="home-promo" aria-label="Membership">
          <div className="home-promo__copy">
            <p className="eyebrow">Members</p>
            <h2 className="home-promo__title">Save on every look you love.</h2>
            <p className="home-promo__text">
              Demo membership perks—free shipping on edits and early access to
              new drops.
            </p>
            <button
              type="button"
              className="btn btn-outline"
              onClick={scrollToGallery}
            >
              Explore the edit
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
