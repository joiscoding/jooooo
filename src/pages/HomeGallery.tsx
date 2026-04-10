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

  const heroLook = filtered[0] ?? looks[0];

  const featuredLooks = useMemo(() => {
    return (
      ['classic', 'workwear', 'minimal'] as StyleTag[]
    )
      .map((tag) => looks.find((look) => look.tag === tag))
      .filter((look): look is Look => Boolean(look));
  }, [looks]);

  const stats = useMemo(() => {
    const seasons = new Set(looks.map((look) => look.season)).size;
    const occasions = new Set(looks.map((look) => look.occasion)).size;

    return [
      { label: 'Looks live', value: String(looks.length).padStart(2, '0') },
      { label: 'Style lanes', value: String(STYLE_ORDER.length).padStart(2, '0') },
      { label: 'Occasions', value: String(occasions).padStart(2, '0') },
      { label: 'Seasons', value: String(seasons).padStart(2, '0') },
    ];
  }, [looks]);

  const operationalHighlights = useMemo(() => {
    const workLooks = looks.filter((look) => look.occasion.toLowerCase().includes('work')).length;
    const travelLooks = looks.filter((look) =>
      /(travel|weekend|downtown|outdoor)/i.test(look.occasion),
    ).length;

    return [
      {
        title: 'Fast assortment scan',
        detail: `${STYLE_ORDER.length} style lanes with high-contrast filters for quick browsing.`,
      },
      {
        title: 'Business-ready occasions',
        detail: `${workLooks} looks tuned for work settings and ${travelLooks} for on-the-go demand.`,
      },
      {
        title: 'Board handoff',
        detail: 'Save promising looks into albums for team review and seasonal planning.',
      },
    ];
  }, [looks]);

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
        <div className="hero-copy">
          <p className="eyebrow">Studio wholesale / seasonal launchpad</p>
          <h1 className="home-title">
            A sharper landing page for modern assortment planning.
          </h1>
          <p className="home-intro">
            This Metro AG-inspired concept leans into bold navigation, modular
            merchandising, and quick scanning for retail and buying teams.
          </p>
          <div className="hero-actions">
            <a href="#catalog" className="hero-cta primary">
              Explore the catalog
            </a>
            <Link to="/albums" className="hero-cta secondary">
              Open team boards
            </Link>
          </div>
          <dl className="hero-stats" aria-label="Catalog overview">
            {stats.map((stat) => (
              <div key={stat.label} className="hero-stat">
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {heroLook ? (
          <div className="hero-visual">
            <div className="hero-visual-frame">
              <img
                src={heroLook.hero}
                alt={heroLook.title}
                className="hero-image"
                loading="eager"
              />
              <div className="hero-callout">
                <span className="hero-callout-tag">{STYLE_LABELS[heroLook.tag]}</span>
                <h2>{heroLook.title}</h2>
                <p>
                  {heroLook.season} / {heroLook.occasion}
                </p>
                <ul>
                  {heroLook.keyItems.slice(0, 3).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : null}
      </section>

      <section className="signal-strip" aria-label="Operational highlights">
        {operationalHighlights.map((highlight) => (
          <article key={highlight.title} className="signal-card">
            <p className="signal-kicker">Highlights</p>
            <h2>{highlight.title}</h2>
            <p>{highlight.detail}</p>
          </article>
        ))}
      </section>

      <section className="feature-tiles-shell" aria-label="Featured categories">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Featured lanes</p>
            <h2 className="section-title">Built to spotlight key commercial stories.</h2>
          </div>
          <p className="section-copy">
            Use these entry points as campaign-style promos before teams dive into
            the filtered assortment below.
          </p>
        </div>
        <div className="feature-tiles">
          {featuredLooks.map((look) => (
            <Link key={look.id} to={`/look/${look.id}`} className="feature-tile">
              <img src={look.hero} alt={look.title} className="feature-tile-image" />
              <div className="feature-tile-body">
                <p className="feature-tile-kicker">{STYLE_LABELS[look.tag]}</p>
                <h2>{look.title}</h2>
                <p>
                  {look.season} / {look.occasion}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Category navigator</p>
            <h2 className="section-title">Move through the edit like a buying hub.</h2>
          </div>
          <p className="section-copy">
            Filters stay up front so teams can move from campaign overview to
            individual look detail without losing context.
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
      </section>

      <section className="catalog-shell" id="catalog">
        <div className="catalog-head">
          <div>
            <p className="eyebrow">Current assortment</p>
            <h2 className="section-title">
              {filter === 'all' ? 'All style lanes' : STYLE_LABELS[filter]}
            </h2>
          </div>
          <p className="catalog-summary">
            {filtered.length} look{filtered.length === 1 ? '' : 's'} ready for
            detail review, album saves, and seasonal comparison.
          </p>
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
                      alt={look.title}
                      className="wall-img"
                      loading={i < 4 ? 'eager' : 'lazy'}
                    />
                    <div className="wall-meta">
                      <span className="wall-tag">{STYLE_LABELS[look.tag]}</span>
                      <h2 className="wall-title">{look.title}</h2>
                      <p className="wall-subtitle">
                        {look.season} / {look.occasion}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="utility-band" aria-label="Footer support">
        <div className="utility-band-inner">
          <div>
            <p className="eyebrow">Why this direction works</p>
            <h2 className="section-title">Corporate structure, fashion content.</h2>
          </div>
          <p className="section-copy">
            The landing page now behaves more like a merchandised hub: clear
            bands, stronger hierarchy, and quicker access to saved boards.
          </p>
        </div>
      </section>
    </div>
  );
}
