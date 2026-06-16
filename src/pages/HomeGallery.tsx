import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

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

  const featuredLook = looks.find((look) => look.tag === 'classic') ?? looks[0];
  const filteredCount = `${filtered.length} ${
    filtered.length === 1 ? 'look' : 'looks'
  }`;

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
        <div className="home-hero-copy">
          <p className="eyebrow">Men · Heritage seasonal edit</p>
          <h1 className="home-title">
            An American wardrobe with old-world restraint.
          </h1>
          <p className="home-lede">
            Tailored layers, lived-in sportswear, and country-club ease for
            days that move from city appointments to late dinners.
          </p>
          <div className="hero-actions">
            <a className="hero-cta" href="#seasonal-edit">
              Explore the edit
            </a>
            <span className="hero-note">Tailored · Casual · Weekend</span>
          </div>
        </div>

        {featuredLook ? (
          <Link
            to={`/look/${featuredLook.id}`}
            className="home-hero-image"
            aria-label={`Open ${featuredLook.title}`}
          >
            <img src={featuredLook.hero} alt="" />
            <div className="hero-card-caption">
              <span>{STYLE_LABELS[featuredLook.tag]}</span>
              <strong>{featuredLook.title}</strong>
            </div>
          </Link>
        ) : null}
      </section>

      <section className="heritage-notes" aria-label="Collection notes">
        <div>
          <span>01</span>
          <p>Deep navy, ivory, camel, and espresso set the palette.</p>
        </div>
        <div>
          <span>02</span>
          <p>Soft tailoring balances polished and off-duty pieces.</p>
        </div>
        <div>
          <span>03</span>
          <p>Every look is built around pieces that age with character.</p>
        </div>
      </section>

      <section className="collection-intro" id="seasonal-edit">
        <div>
          <p className="eyebrow">The collection</p>
          <h2>Choose a mood, then make it yours.</h2>
        </div>
        <p>{filteredCount} shown</p>
      </section>

      <section className="filters-bar" aria-label="Style filters">
        <button
          type="button"
          className={filter === 'all' ? 'filter-pill active' : 'filter-pill'}
          onClick={() => setFilter('all')}
          aria-pressed={filter === 'all'}
        >
          All looks
        </button>
        {STYLE_ORDER.map((tag) => (
          <button
            key={tag}
            type="button"
            className={filter === tag ? 'filter-pill active' : 'filter-pill'}
            onClick={() => setFilter(tag)}
            aria-pressed={filter === tag}
          >
            {STYLE_LABELS[tag]}
          </button>
        ))}
      </section>

      {filtered.length === 0 ? (
        <p className="empty-state">No looks in this filter.</p>
      ) : (
        <div className="gallery-wall">
          {filtered.map((look, i) => {
            return (
              <Link
                key={look.id}
                to={`/look/${look.id}`}
                className={i === 0 ? 'wall-card is-featured' : 'wall-card'}
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
                    <p className="wall-subtitle">
                      {look.season} · {look.occasion}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
