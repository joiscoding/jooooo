import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAlbumsContext } from '../context/AlbumsContext';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

export function HomeGallery() {
  const { albums } = useAlbumsContext();
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

  const featured = looks[0];
  const stats = [
    { value: looks.length, label: 'Curated looks' },
    { value: STYLE_ORDER.length, label: 'Style categories' },
    { value: albums.length, label: 'Your albums' },
  ];

  return (
    <div className="home">
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-copy">
            <p className="hero-eyebrow">Men · Seasonal edit</p>
            <h1 className="hero-title">Looks built for quiet confidence</h1>
            <p className="hero-sub">
              Browse outfit-first looks across five styles, then save your
              favorites to albums that stay on this device.
            </p>
            <div className="hero-actions">
              <a href="#gallery" className="btn-cta">
                Explore the gallery
              </a>
              <Link to="/albums" className="btn-outline">
                View your albums
              </Link>
            </div>
          </div>
          {featured && (
            <Link to={`/look/${featured.id}`} className="hero-feature">
              <img src={featured.hero} alt="" className="hero-feature-img" />
              <div className="hero-feature-meta">
                <span className="hero-feature-label">Featured look</span>
                <span className="hero-feature-title">{featured.title}</span>
              </div>
            </Link>
          )}
        </div>
      </section>

      <section className="stats" aria-label="Lookbook at a glance">
        <div className="container stats-inner">
          {stats.map((s) => (
            <div key={s.label} className="stat">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="gallery" className="explore">
        <div className="container">
          <h2 className="section-title">Explore looks by style</h2>
          <div className="style-tabs" aria-label="Style filters">
            <button
              type="button"
              className={filter === 'all' ? 'style-tab active' : 'style-tab'}
              aria-pressed={filter === 'all'}
              onClick={() => setFilter('all')}
            >
              All looks
            </button>
            {STYLE_ORDER.map((tag) => (
              <button
                key={tag}
                type="button"
                className={filter === tag ? 'style-tab active' : 'style-tab'}
                aria-pressed={filter === tag}
                onClick={() => setFilter(tag)}
              >
                {STYLE_LABELS[tag]}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="empty-state">No looks in this filter.</p>
          ) : (
            <div className="look-grid">
              {filtered.map((look, i) => (
                <Link
                  key={look.id}
                  to={`/look/${look.id}`}
                  className="look-card"
                >
                  <img
                    key={`${look.id}-${look.hero}`}
                    src={look.hero}
                    alt=""
                    className="look-card-img"
                    loading={i < 4 ? 'eager' : 'lazy'}
                  />
                  <div className="look-card-body">
                    <span className="look-card-tag">
                      {STYLE_LABELS[look.tag]}
                    </span>
                    <h3 className="look-card-title">{look.title}</h3>
                    <p className="look-card-text">
                      {look.keyItems.join(' · ')}
                    </p>
                    <span className="look-card-link">View look</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-band-inner">
          <div>
            <h2 className="cta-band-title">Start building your wardrobe</h2>
            <p className="cta-band-sub">
              Group looks into named albums. No account needed.
            </p>
          </div>
          <Link to="/albums" className="btn-cta">
            Create an album
          </Link>
        </div>
      </section>
    </div>
  );
}
