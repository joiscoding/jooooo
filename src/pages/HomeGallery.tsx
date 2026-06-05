import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';
import './HomeGallery.css';

const TREND_INTEL = [
  {
    title: 'Relaxed tailoring leads',
    source: 'Wallpaper* A/W 2025',
    insight:
      'Unstructured jackets and fluid trousers continue the shift away from rigid suiting.',
    href: 'https://www.wallpaper.com/fashion-beauty/aw-2025-menswear-trend-report',
  },
  {
    title: 'Minimalism stays dominant',
    source: 'Vogue trend prediction',
    insight:
      'Menswear still favors clean lines, quality fabrics, and longevity over micro-trends.',
    href: 'https://www.vogue.com/article/4-menswear-trend-predictions-for-autumn-winter-2025',
  },
  {
    title: 'Monochrome + texture mix',
    source: 'British GQ S/S 2025',
    insight:
      'Single-shade outfits gain depth through tonal layering and contrasting materials.',
    href: 'https://www.gq-magazine.co.uk/article/spring-summer-2025-menswear-trends',
  },
] as const;

const FEATURE_BULLETS = [
  'Tonal earth palettes',
  'Soft-shoulder tailoring',
  'Refined utility layers',
  'Texture-first styling',
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
    return looks.filter((look) => look.tag === filter);
  }, [looks, filter]);

  const highlighted = useMemo(() => filtered.slice(0, 3), [filtered]);

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
        <div className="home-hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Spring / Summer direction</p>
            <h1 className="home-title">
              Fashion-forward menswear with <em>editorial calm</em>.
            </h1>
            <p className="home-intro">
              This landing edit blends runway-informed silhouettes with wearable
              proportions: relaxed tailoring, monochrome stories, and elevated
              utility looks designed to last.
            </p>
            <div className="hero-bullets" aria-label="Current style direction">
              {FEATURE_BULLETS.map((bullet) => (
                <span key={bullet} className="hero-bullet">
                  {bullet}
                </span>
              ))}
            </div>
          </div>

          <aside className="trend-intel" aria-label="Trend intelligence">
            <p className="trend-heading">Trend intelligence</p>
            <ul className="trend-list">
              {TREND_INTEL.map((item) => (
                <li key={item.title} className="trend-item">
                  <p className="trend-title">{item.title}</p>
                  <p className="trend-insight">{item.insight}</p>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="trend-source"
                  >
                    Source: {item.source}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

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

      {highlighted.length > 0 && (
        <section className="highlight-strip" aria-label="Featured looks">
          {highlighted.map((look) => (
            <Link
              key={`featured-${look.id}`}
              to={`/look/${look.id}`}
              className="highlight-card"
            >
              <p className="highlight-tag">{STYLE_LABELS[look.tag]}</p>
              <p className="highlight-title">{look.title}</p>
              <p className="highlight-meta">
                {look.season} · {look.occasion}
              </p>
            </Link>
          ))}
        </section>
      )}

      {filtered.length === 0 ? (
        <p className="empty-state">No looks in this filter.</p>
      ) : (
        <div className="gallery-wall">
          {filtered.map((look, i) => (
            <Link key={look.id} to={`/look/${look.id}`} className="wall-card">
              <div className="wall-card-inner">
                <img
                  src={look.hero}
                  alt={look.title}
                  className="wall-img"
                  loading={i < 4 ? 'eager' : 'lazy'}
                />
                <div className="wall-meta">
                  <span className="wall-tag">{STYLE_LABELS[look.tag]}</span>
                  <h2 className="wall-title">{look.title}</h2>
                  <p className="wall-facts">
                    {look.season} · {look.keyItems[0]}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
