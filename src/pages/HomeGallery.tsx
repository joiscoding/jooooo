import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const FEATURED_TAGS: StyleTag[] = ['athleisure', 'minimal', 'classic'];

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

  const featuredLooks = useMemo(
    () =>
      FEATURED_TAGS.map((tag) => looks.find((look) => look.tag === tag)).filter(
        (look): look is Look => Boolean(look)
      ),
    [looks]
  );

  const seasonCount = useMemo(
    () => new Set(looks.map((look) => look.season)).size,
    [looks]
  );

  const occasionCount = useMemo(
    () => new Set(looks.map((look) => look.occasion)).size,
    [looks]
  );

  const heroLook = featuredLooks[0] ?? looks[0] ?? null;
  const spotlightLooks = featuredLooks.slice(1, 3);
  const proofItems = [
    {
      value: String(looks.length).padStart(2, '0'),
      label: 'curated looks',
      detail: 'Campaign-ready creative from premium basics to performance sets.',
    },
    {
      value: String(STYLE_ORDER.length).padStart(2, '0'),
      label: 'style lanes',
      detail: 'A focused system of visual directions for different member moods.',
    },
    {
      value: String(seasonCount).padStart(2, '0'),
      label: 'seasonal moments',
      detail: 'Looks mapped across transitional, summer, winter, and beyond.',
    },
    {
      value: String(occasionCount).padStart(2, '0'),
      label: 'member scenarios',
      detail: 'Built for commute, recovery, studio, travel, and premium events.',
    },
  ];

  if (loading) {
    return (
      <div className="home home--fitness">
        <section className="landing-hero">
          <div className="home-shell">
            <div className="page-loading page-loading-home">
              <p className="eyebrow eyebrow-bright">Loading campaign system</p>
              <p className="muted-light">Preparing the latest collection...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="home home--fitness">
      <section className="landing-hero">
        <div className="home-shell landing-hero-grid">
          <div className="landing-copy">
            <p className="eyebrow eyebrow-bright">
              Boutique fitness visuals · Member-ready campaigns
            </p>
            <h1 className="landing-title">
              Bring premium fitness energy to every studio launch.
            </h1>
            <p className="landing-lede">
              Inspired by modern fitness-tech landing pages, this refreshed
              experience leads with bold proof points, clear product-style
              modules, and a faster path into curated looks.
            </p>
            <div className="hero-actions">
              <a href="#collection" className="btn primary">
                Browse the collection
              </a>
              <Link to="/albums" className="btn inverse">
                Open albums
              </Link>
            </div>
            <p className="hero-caption">
              Filter by aesthetic, open each look for detail, and save the
              strongest combinations into local creative boards.
            </p>
          </div>

          <div className="hero-visual-stack">
            {heroLook && (
              <div className="hero-visual-card">
                <img
                  src={heroLook.hero}
                  alt={`${heroLook.title} hero look`}
                  className="hero-visual-image"
                />
                <div className="hero-visual-meta">
                  <div>
                    <p className="hero-kicker">{STYLE_LABELS[heroLook.tag]}</p>
                    <h2 className="hero-visual-title">{heroLook.title}</h2>
                  </div>
                  <Link to={`/look/${heroLook.id}`} className="hero-inline-link">
                    Open look
                  </Link>
                </div>
              </div>
            )}

            <div className="hero-mini-grid">
              {spotlightLooks.map((look) => (
                <Link
                  key={look.id}
                  to={`/look/${look.id}`}
                  className="hero-mini-card"
                >
                  <img
                    src={look.hero}
                    alt={`${look.title} spotlight`}
                    className="hero-mini-image"
                  />
                  <div>
                    <span className="hero-mini-label">{look.occasion}</span>
                    <p className="hero-mini-title">{look.title}</p>
                  </div>
                </Link>
              ))}
              <div className="hero-mini-copy">
                <span className="hero-mini-label">Operator flow</span>
                <p>
                  Move from discovery to detail to saved albums without losing
                  the polished, high-conviction feel of a modern fitness brand.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="proof-strip" aria-label="Collection proof points">
        <div className="home-shell proof-grid">
          {proofItems.map((item) => (
            <article key={item.label} className="proof-card">
              <p className="proof-value">{item.value}</p>
              <p className="proof-label">{item.label}</p>
              <p className="proof-detail">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="solution-section home-shell" aria-labelledby="solutions-heading">
        <div className="section-heading section-heading-split">
          <div>
            <p className="eyebrow">Connected experience</p>
            <h2 id="solutions-heading" className="section-title">
              Structured like a platform, still powered by the same collection.
            </h2>
          </div>
          <p className="section-copy">
            The refreshed page borrows the rhythm of a fitness software site:
            promise, proof, capabilities, and then a clean handoff into the
            browseable look collection.
          </p>
        </div>

        <div className="solution-grid">
          <article className="solution-card">
            <p className="solution-index">01</p>
            <h3>Discover by visual lane</h3>
            <p>
              Jump between minimal, classic, athleisure, and more without
              losing the momentum of a campaign planning session.
            </p>
            <a href="#collection" className="text-link">
              Browse filters
            </a>
          </article>

          <article className="solution-card">
            <p className="solution-index">02</p>
            <h3>Review every set in detail</h3>
            <p>
              Open any look to inspect its image stack, key pieces, season, and
              usage context before you commit it to a launch.
            </p>
            {heroLook && (
              <Link to={`/look/${heroLook.id}`} className="text-link">
                View a look page
              </Link>
            )}
          </article>

          <article className="solution-card">
            <p className="solution-index">03</p>
            <h3>Curate creative into albums</h3>
            <p>
              Save strong combinations locally so you can build a sharper brand
              story for shoots, launches, and member-facing campaigns.
            </p>
            <Link to="/albums" className="text-link">
              Open albums
            </Link>
          </article>
        </div>
      </section>

      <section className="featured-section home-shell" aria-labelledby="featured-heading">
        <div className="section-heading section-heading-split">
          <div>
            <p className="eyebrow">Featured drops</p>
            <h2 id="featured-heading" className="section-title">
              Campaign-ready looks for recovery, commute, and premium member touchpoints.
            </h2>
          </div>
          <p className="section-copy">
            The editorial collection is still the core product. It just now sits
            inside a more confident landing page narrative.
          </p>
        </div>

        <div className="featured-grid">
          {featuredLooks.map((look, index) => (
            <Link key={look.id} to={`/look/${look.id}`} className="featured-card">
              <div className="featured-card-media">
                <img
                  src={look.hero}
                  alt={`${look.title} featured look`}
                  className="wall-img"
                />
              </div>
              <div className="featured-card-copy">
                <span className="featured-tagline">
                  Spotlight {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="wall-title">{look.title}</h3>
                <p>
                  {STYLE_LABELS[look.tag]} · {look.occasion}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section
        id="collection"
        className="collection-section home-shell"
        aria-labelledby="collection-heading"
      >
        <div className="section-heading section-heading-split">
          <div>
            <p className="eyebrow">The collection</p>
            <h2 id="collection-heading" className="section-title">
              Explore the full gallery and filter the strongest direction for the moment.
            </h2>
          </div>
          <p className="section-copy">
            Every card still opens the same detail route. The difference is a
            cleaner, more premium entry point that feels closer to a modern
            fitness platform homepage.
          </p>
        </div>

        <section className="filters-bar" aria-label="Style filters">
          <button
            type="button"
            aria-pressed={filter === 'all'}
            className={filter === 'all' ? 'filter-pill active' : 'filter-pill'}
            onClick={() => setFilter('all')}
          >
            All looks
          </button>
          {STYLE_ORDER.map((tag) => (
            <button
              key={tag}
              type="button"
              aria-pressed={filter === tag}
              className={filter === tag ? 'filter-pill active' : 'filter-pill'}
              onClick={() => setFilter(tag)}
            >
              {STYLE_LABELS[tag]}
            </button>
          ))}
        </section>

        {filtered.length === 0 ? (
          <div className="empty-state empty-state-card">
            <p>No looks match this filter right now.</p>
            <button type="button" className="btn ghost" onClick={() => setFilter('all')}>
              Reset to all looks
            </button>
          </div>
        ) : (
          <div className="gallery-wall">
            {filtered.map((look, i) => (
              <Link key={look.id} to={`/look/${look.id}`} className="wall-card">
                <div className="wall-card-inner">
                  <img
                    key={`${look.id}-${look.hero}`}
                    src={look.hero}
                    alt={`${look.title} in ${STYLE_LABELS[look.tag]} style`}
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

      <section className="cta-band">
        <div className="home-shell cta-band-inner">
          <div>
            <p className="eyebrow eyebrow-bright">Ready to curate</p>
            <h2 className="cta-title">
              Save the strongest looks and build your next launch board faster.
            </h2>
          </div>
          <div className="hero-actions">
            <Link to="/albums" className="btn primary">
              Manage albums
            </Link>
            <a href="#collection" className="btn inverse">
              Back to collection
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
