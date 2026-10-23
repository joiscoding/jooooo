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

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  const featured = looks.slice(0, 3);

  return (
    <div className="home">
      <section className="hero">
        <p className="eyebrow">Men · Seasonal edit</p>
        <h1 className="home-title">
          Looks built for <em>quiet</em> confidence.
        </h1>
        <p className="hero-lede">
          Modern style, designed to last. Browse the seasonal lookbook,
          filter by aesthetic, and keep the ones you want in albums.
        </p>
        <div className="hero-actions">
          <a className="btn primary" href="#looks">
            Browse looks
          </a>
          <Link className="btn ghost" to="/albums">
            Open albums
          </Link>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="stage" aria-label="Featured looks">
          <div className="stage-frame">
            <div className="stage-bar">
              <span className="stage-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="stage-label">Studio Lookbook</span>
            </div>
            <div className="stage-grid">
              {featured.map((look) => (
                <Link
                  key={look.id}
                  to={`/look/${look.id}`}
                  className="stage-card"
                >
                  <img src={look.hero} alt="" />
                  <span>
                    <em>{STYLE_LABELS[look.tag]}</em>
                    {look.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="pillars" aria-label="Highlights">
        <div className="pillars-inner">
          <article>
            <p className="pillar-kicker">01</p>
            <h2>Quiet confidence</h2>
            <p>
              Editorial looks with restrained neutrals, clean silhouettes, and
              room to breathe.
            </p>
          </article>
          <article>
            <p className="pillar-kicker">02</p>
            <h2>Five aesthetics</h2>
            <p>
              Minimal, street, tailored, sport, and heritage. Filter the wall
              without leaving the page.
            </p>
          </article>
          <article>
            <p className="pillar-kicker">03</p>
            <h2>Albums that stay</h2>
            <p>
              Save a look, name a collection, and find it again after a
              refresh in this browser.
            </p>
          </article>
        </div>
      </section>

      <section id="looks" className="edit">
        <div className="edit-head">
          <h2>The seasonal edit</h2>
          <p>Every look, one wall. Open any frame for the full outfit.</p>
        </div>

        <section className="filters-bar" aria-label="Style filters">
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
              );
            })}
          </div>
        )}
      </section>

      <section className="proof">
        <blockquote>
          <p>Modern style, designed to last.</p>
          <footer>Studio Lookbook · Men</footer>
        </blockquote>
        <Link to="/albums" className="btn primary">
          Open albums
        </Link>
      </section>
    </div>
  );
}
