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

  const heroLook = looks[0];
  const previewLooks = looks.slice(1, 3);
  const styleCount = new Set(looks.map((look) => look.tag)).size;

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home home-editorial">
      <section className="home-hero" aria-labelledby="landing-title">
        <div className="hero-copy">
          <p className="eyebrow">Menswear forecast · 2026 edit</p>
          <h1 id="landing-title" className="home-title">
            Dress like the city is <em>watching.</em>
          </h1>
          <p className="home-dek">
            A sharp menswear lookbook inspired by digital magazine layouts,
            muted luxury palettes, high-contrast type, and full-frame styling.
          </p>
          <div className="hero-actions">
            {heroLook ? (
              <Link to={`/look/${heroLook.id}`} className="btn primary">
                Enter the edit
              </Link>
            ) : null}
            <a href="#collection" className="btn ghost">
              View collection
            </a>
          </div>
          <div className="trend-notes" aria-label="Fashion-forward design notes">
            <article>
              <span>01</span>
              <p>Editorial spacing with asymmetrical image rhythm.</p>
            </article>
            <article>
              <span>02</span>
              <p>Oversized serif type paired with precise sans labels.</p>
            </article>
            <article>
              <span>03</span>
              <p>Muted stone, ink, and oxblood tones for restrained drama.</p>
            </article>
          </div>
        </div>

        {heroLook ? (
          <div className="hero-visual" aria-label="Featured look">
            <Link to={`/look/${heroLook.id}`} className="hero-frame">
              <img src={heroLook.hero} alt="" className="hero-img" />
              <span className="hero-frame-label">
                {STYLE_LABELS[heroLook.tag]} · {heroLook.season}
              </span>
              <strong>{heroLook.title}</strong>
            </Link>
            <div className="hero-stack" aria-hidden="true">
              {previewLooks.map((look) => (
                <img key={look.id} src={look.hero} alt="" />
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <section className="runway-index" aria-label="Collection summary">
        <div>
          <span>{looks.length.toString().padStart(2, '0')}</span>
          <p>Styled looks</p>
        </div>
        <div>
          <span>{styleCount.toString().padStart(2, '0')}</span>
          <p>Style moods</p>
        </div>
        <div>
          <span>SS/FW</span>
          <p>Seasonless rotation</p>
        </div>
      </section>

      <section
        id="collection"
        className="filters-bar editorial-filters"
        aria-label="Style filters"
      >
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
                className={
                  i % 5 === 0 ? 'wall-card wall-card-large' : 'wall-card'
                }
              >
                <div className="wall-card-inner">
                  <img
                    key={`${look.id}-${look.hero}`}
                    src={look.hero}
                    alt=""
                    className="wall-img"
                    loading={i < 4 ? 'eager' : 'lazy'}
                  />
                  <span className="wall-number">
                    {(i + 1).toString().padStart(2, '0')}
                  </span>
                  <div className="wall-meta">
                    <span className="wall-tag">
                      {STYLE_LABELS[look.tag]} · {look.season}
                    </span>
                    <h2 className="wall-title">{look.title}</h2>
                    <p className="wall-occasion">{look.occasion}</p>
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
