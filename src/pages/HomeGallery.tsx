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

  const heroImage = looks[0]?.hero ?? '';
  const styleCount = useMemo(() => new Set(looks.map((l) => l.tag)).size, [looks]);
  const keyItemsTotal = useMemo(
    () => looks.reduce((n, l) => n + l.keyItems.length, 0),
    [looks]
  );

  const scrollToCollection = () => {
    document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="page-loading page-loading--dark">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home home--abc">
      <section className="abc-hero" aria-labelledby="abc-hero-title">
        {heroImage ? (
          <div className="abc-hero-media" aria-hidden="true">
            <img src={heroImage} alt="" className="abc-hero-img" />
            <div className="abc-hero-scrim" />
          </div>
        ) : null}
        <div className="abc-hero-inner">
          <p className="abc-eyebrow">Men · Seasonal curation</p>
          <h1 id="abc-hero-title" className="abc-hero-title">
            Transform your wardrobe with curated looks.
          </h1>
          <p className="abc-hero-lede">
            Studio Lookbook simplifies how you explore outfits, surfaces clear style lanes,
            and helps you build a confident, cohesive closet—whether you are refreshing one
            rack or planning a full season.
          </p>
          <div className="abc-hero-cta">
            <button type="button" className="btn btn-abc-primary" onClick={scrollToCollection}>
              Browse the collection
            </button>
            <Link to="/albums" className="btn btn-abc-outline">
              View albums
            </Link>
          </div>
        </div>
      </section>

      <section className="abc-section abc-section--light" aria-labelledby="abc-mission">
        <div className="abc-section-inner">
          <h2 id="abc-mission" className="abc-section-title">
            A connected experience for every style lane
          </h2>
          <p className="abc-section-prose">
            Our goal is to help you turn a vague “dress better” ambition into something
            tangible: searchable looks, honest outfit building blocks, and a gallery you can
            return to when you are planning a trip, a job change, or a weekend reset.
          </p>
        </div>
      </section>

      <section className="abc-section abc-section--muted" aria-labelledby="abc-pillars">
        <div className="abc-section-inner">
          <h2 id="abc-pillars" className="abc-section-title">
            Tailored lanes for how you actually dress
          </h2>
          <p className="abc-section-prose abc-section-prose--narrow">
            Pick a lane to filter the wall—each edit is built around real silhouettes and
            occasions, not generic trends.
          </p>
          <ul className="abc-pillars">
            {STYLE_ORDER.map((tag) => (
              <li key={tag}>
                <button
                  type="button"
                  className="abc-pillar-card"
                  onClick={() => {
                    setFilter(tag);
                    scrollToCollection();
                  }}
                >
                  <span className="abc-pillar-name">{STYLE_LABELS[tag]}</span>
                  <span className="abc-pillar-action">Filter gallery</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="abc-stats" aria-label="Lookbook stats">
        <div className="abc-stats-inner">
          <div className="abc-stat">
            <span className="abc-stat-value">{looks.length}</span>
            <span className="abc-stat-label">curated looks</span>
          </div>
          <div className="abc-stat">
            <span className="abc-stat-value">{styleCount}</span>
            <span className="abc-stat-label">style lanes</span>
          </div>
          <div className="abc-stat">
            <span className="abc-stat-value">{keyItemsTotal}</span>
            <span className="abc-stat-label">key pieces indexed</span>
          </div>
          <div className="abc-stat">
            <span className="abc-stat-value">1</span>
            <span className="abc-stat-label">gallery, zero noise</span>
          </div>
        </div>
      </section>

      <section className="abc-section abc-section--light" aria-labelledby="abc-advantage">
        <div className="abc-section-inner abc-quote-wrap">
          <h2 id="abc-advantage" className="abc-section-title">
            The Studio Lookbook advantage
          </h2>
          <blockquote className="abc-quote">
            <p>
              “We wanted one place to align on silhouettes and vocabulary before buying
              anything new. This gallery made it easy to agree on direction and actually
              shop with a list.”
            </p>
            <footer>— In-house style pilot, menswear team</footer>
          </blockquote>
        </div>
      </section>

      <section id="collection" className="abc-collection" aria-label="Look gallery">
        <div className="abc-collection-head">
          <h2 className="abc-collection-title">Explore the collection</h2>
          <p className="abc-collection-sub">
            Filter by lane or scroll the full wall. Tap any look for details and album
            actions.
          </p>
        </div>

        <div className="filters-bar filters-bar--abc" aria-label="Style filters">
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
            {filtered.map((look, i) => (
              <Link key={look.id} to={`/look/${look.id}`} className="wall-card">
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
            ))}
          </div>
        )}
      </section>

      <section className="abc-cta-band" aria-labelledby="abc-cta-title">
        <div className="abc-cta-inner">
          <h2 id="abc-cta-title" className="abc-cta-title">
            Ready to build your next outfit?
          </h2>
          <p className="abc-cta-copy">
            Start with a lane, save favorites to albums, and keep one source of truth for
            what “your look” means this season.
          </p>
          <button type="button" className="btn btn-abc-primary btn-abc-lg" onClick={scrollToCollection}>
            Browse the collection
          </button>
        </div>
      </section>
    </div>
  );
}
