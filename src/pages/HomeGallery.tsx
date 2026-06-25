import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const PILLARS = [
  {
    icon: '▦',
    title: 'Lookbooks',
    desc: 'Image-led, outfit-first editorial galleries organized by season and occasion.',
  },
  {
    icon: '◆',
    title: 'Style System',
    desc: 'Five aesthetic directions to filter, compare, and discover your fit.',
  },
  {
    icon: '❏',
    title: 'Personal Albums',
    desc: 'Save and organize looks into albums, kept locally in your browser.',
  },
  {
    icon: '✦',
    title: 'Editorial Journal',
    desc: 'Notes on fabric, fit, and the craft behind every curated look.',
  },
] as const;

const NEWS = [
  {
    date: '2026.06.18',
    title: 'Summer edit: linen layering for warm-weather tailoring',
    tag: 'Lookbook',
  },
  {
    date: '2026.05.30',
    title: 'Five directions, one wardrobe — refining the style system',
    tag: 'Studio',
  },
  {
    date: '2026.05.12',
    title: 'Behind the heritage workwear capsule',
    tag: 'Journal',
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

  const STATS = useMemo(
    () => [
      { num: `${looks.length}+`, label: 'Curated Looks' },
      { num: '5', label: 'Style Directions' },
      { num: '4', label: 'Studio Pillars' },
      { num: '∞', label: 'Personal Albums' },
    ],
    [looks.length]
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
      <section className="home-hero bleed">
        <div className="bleed-inner">
          <p className="eyebrow">Editorial Menswear Studio</p>
          <h1 className="home-title">
            Looks built for <em>quiet confidence</em>.
          </h1>
          <p className="home-sub">
            An outfit-first lookbook spanning five aesthetic directions.
            Discover image-led looks, save your favorites, and build albums
            that define your wardrobe.
          </p>
          <div className="hero-actions">
            <a href="#gallery" className="hero-btn primary">
              Browse the Gallery
            </a>
            <Link to="/albums" className="hero-btn outline">
              View Albums
            </Link>
          </div>
        </div>
      </section>

      <section className="stats-strip bleed" aria-label="Studio at a glance">
        <div className="bleed-inner">
          {STATS.map((s) => (
            <div className="stat-item" key={s.label}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" aria-label="What the studio makes">
        <div className="section-head">
          <p className="eyebrow">What we make</p>
          <h2 className="section-title">Four pillars, one wardrobe</h2>
          <p className="section-desc">
            From image-led lookbooks to a personal album system, every part of
            the studio is built around discovering and keeping the looks you
            love.
          </p>
        </div>
        <div className="pillars">
          {PILLARS.map((p) => (
            <article className="pillar-card" key={p.title}>
              <span className="pillar-icon" aria-hidden="true">
                {p.icon}
              </span>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="gallery" aria-label="Featured looks">
        <div className="section-head">
          <p className="eyebrow">Featured looks</p>
          <h2 className="section-title">The seasonal gallery</h2>
          <p className="section-desc">
            Filter the wall by aesthetic direction, then open any look to view
            details and add it to an album.
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
                      <h2 className="wall-title">{look.title}</h2>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="section" aria-label="From the journal">
        <div className="section-head">
          <p className="eyebrow">Newsroom</p>
          <h2 className="section-title">From the journal</h2>
        </div>
        <ul className="news-list">
          {NEWS.map((n) => (
            <li className="news-item" key={n.title}>
              <span className="news-date">{n.date}</span>
              <span className="news-title">{n.title}</span>
              <span className="news-tag">{n.tag}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
