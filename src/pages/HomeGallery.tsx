import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

/** Repeating frame ratios drive the staggered, editorial gallery wall. */
const FRAME_RATIOS = ['3 / 4', '4 / 5', '1 / 1', '3 / 4', '5 / 6', '4 / 5'];

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

  // The campaign hero is fixed regardless of the active filter; prefer a
  // quiet/minimal look to set a calm, premium tone, else the first look.
  const featured = useMemo<Look | null>(() => {
    if (looks.length === 0) return null;
    return looks.find((l) => l.tag === 'minimal') ?? looks[0];
  }, [looks]);

  const filtered = useMemo(() => {
    const base = looks.filter((l) => l.id !== featured?.id);
    if (filter === 'all') return base;
    return base.filter((l) => l.tag === filter);
  }, [looks, filter, featured]);

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading the edit…</p>
      </div>
    );
  }

  return (
    <div className="home">
      {featured && (
        <section className="hero" aria-label="Seasonal campaign">
          <img
            src={featured.hero}
            alt=""
            className="hero-img"
            fetchPriority="high"
          />
          <div className="hero-scrim" />
          <div className="hero-content">
            <p className="hero-dateline">
              <span>Issue Nº 01</span>
              <span className="hero-dot" aria-hidden="true">
                ✱
              </span>
              <span>The Seasonal Edit</span>
            </p>
            <h1 className="hero-title">
              The art of <em>getting&nbsp;dressed</em>, quietly considered.
            </h1>
            <p className="hero-sub">
              An image-led wardrobe of men&rsquo;s looks — modern style,
              designed to last.
            </p>
            <div className="hero-actions">
              <a href="#edit" className="btn-line">
                Explore the edit
              </a>
              <Link to={`/look/${featured.id}`} className="btn-link">
                Shop the look →
              </Link>
            </div>
          </div>
          <span className="hero-credit">{featured.title}</span>
        </section>
      )}

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((dup) => (
            <span className="marquee-group" key={dup}>
              {STYLE_ORDER.map((tag) => (
                <span className="marquee-item" key={`${dup}-${tag}`}>
                  {STYLE_LABELS[tag].split(' / ')[0]}
                  <span className="marquee-star">✱</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <section className="edit" id="edit">
        <div className="edit-head">
          <div className="edit-head-left">
            <p className="eyebrow">The Edit</p>
            <h2 className="edit-title">Looks for the season</h2>
          </div>
          <p className="edit-count">
            {filtered.length} {filtered.length === 1 ? 'look' : 'looks'}
          </p>
        </div>

        <div
          className="filters-bar"
          role="tablist"
          aria-label="Style filters"
        >
          <button
            type="button"
            role="tab"
            aria-selected={filter === 'all'}
            className={filter === 'all' ? 'filter-pill active' : 'filter-pill'}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          {STYLE_ORDER.map((tag) => (
            <button
              key={tag}
              type="button"
              role="tab"
              aria-selected={filter === tag}
              className={filter === tag ? 'filter-pill active' : 'filter-pill'}
              onClick={() => setFilter(tag)}
            >
              {STYLE_LABELS[tag].split(' / ')[0]}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="empty-state">No looks in this filter yet.</p>
        ) : (
          <div className="gallery-wall">
            {filtered.map((look, i) => (
              <Link
                key={look.id}
                to={`/look/${look.id}`}
                className="wall-card reveal"
                style={
                  {
                    '--ratio': FRAME_RATIOS[i % FRAME_RATIOS.length],
                    '--delay': `${(i % 6) * 60}ms`,
                  } as CSSProperties
                }
              >
                <div className="wall-card-inner">
                  <img
                    src={look.hero}
                    alt=""
                    className="wall-img"
                    loading={i < 4 ? 'eager' : 'lazy'}
                  />
                  <span className="wall-index">
                    {String(i + 1).padStart(2, '0')}
                  </span>
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

      <section className="atelier" aria-label="About the studio">
        <p className="atelier-mark" aria-hidden="true">
          ✱
        </p>
        <p className="atelier-note">
          Every look is styled like a studio plate — full silhouette, fabric,
          and context — so getting dressed feels considered, never complicated.
        </p>
        <p className="atelier-sign">Studio Lookbook — Modern style, designed to last.</p>
      </section>
    </div>
  );
}
