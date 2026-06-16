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

  const heroLook = useMemo(
    () => looks.find((l) => l.tag === 'classic') ?? looks[0],
    [looks]
  );

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading the collection…</p>
      </div>
    );
  }

  return (
    <div className="home">
      <section
        className="rl-hero"
        style={
          heroLook
            ? { backgroundImage: `url(${heroLook.hero})` }
            : undefined
        }
      >
        <div className="rl-hero-overlay" />
        <div className="rl-hero-content">
          <p className="rl-eyebrow light">The Heritage Edit · Men</p>
          <h1 className="rl-hero-title">
            Timeless style,
            <br />
            tailored for today.
          </h1>
          <p className="rl-hero-sub">
            An editorial wardrobe of considered looks — from crisp tailoring to
            weathered workwear, assembled with quiet confidence.
          </p>
          <div className="rl-hero-actions">
            <a href="#collection" className="rl-btn solid">
              Explore the collection
            </a>
            <Link to="/albums" className="rl-btn outline">
              Your albums
            </Link>
          </div>
        </div>
      </section>

      <section className="rl-manifesto">
        <span className="rl-crest" aria-hidden="true">
          RL
        </span>
        <p className="rl-manifesto-text">
          Five enduring attitudes, one refined point of view. Browse the looks,
          curate your own albums, and dress with intention.
        </p>
      </section>

      <section id="collection" className="rl-collection">
        <div className="rl-section-head">
          <p className="rl-eyebrow">The Collection</p>
          <h2 className="rl-section-title">Shop the looks by attitude</h2>
        </div>

        <nav className="rl-filters" aria-label="Style filters">
          <button
            type="button"
            className={filter === 'all' ? 'rl-tab active' : 'rl-tab'}
            onClick={() => setFilter('all')}
          >
            All looks
          </button>
          {STYLE_ORDER.map((tag) => (
            <button
              key={tag}
              type="button"
              className={filter === tag ? 'rl-tab active' : 'rl-tab'}
              onClick={() => setFilter(tag)}
            >
              {STYLE_LABELS[tag]}
            </button>
          ))}
        </nav>

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
    </div>
  );
}
