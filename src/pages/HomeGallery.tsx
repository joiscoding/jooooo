import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const FEATURED_COUNT = 4;

const VALUE_PROPS: { title: string; body: string }[] = [
  {
    title: 'Outfit-first discovery',
    body: 'Every look is a complete outfit, not a product grid. Browse by how you want to dress, then dig into the key items.',
  },
  {
    title: 'Five clear styles',
    body: 'Minimal, streetwear, tailored, athleisure, and workwear. Filter once and see only what fits your direction.',
  },
  {
    title: 'Albums that stay put',
    body: 'Save looks to named albums in this browser. No account, no sign-up — they are still here after a refresh.',
  },
];

function lookSummary(look: Look): string {
  return `${look.season} · ${look.occasion}. ${look.keyItems.join(', ')}.`;
}

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

  const heroLook = looks[0];
  // Skip the hero look so the strip under it never repeats the same card.
  const featured = useMemo(
    () => looks.slice(1, 1 + FEATURED_COUNT),
    [looks],
  );

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

  return (
    <div className="home">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-inner">
          <div className="hero-copy">
            <p className="hero-eyebrow">Studio Lookbook for Men</p>
            <h1 id="hero-title" className="hero-title">
              Build your wardrobe on Studio Lookbook
            </h1>
            <p className="hero-sub">
              Editorial looks across five styles, ready to browse, compare, and
              save. Start with a look, keep what works in an album, and come
              back anytime.
            </p>
            <div className="hero-actions">
              <a href="#explore" className="btn-aws btn-aws-lg">
                Get started for free
              </a>
              <Link to="/albums" className="btn-aws-outline btn-aws-lg">
                Browse albums
              </Link>
            </div>
          </div>
          {heroLook && (
            <Link to={`/look/${heroLook.id}`} className="hero-card">
              <img
                src={heroLook.hero}
                alt=""
                className="hero-card-img"
                loading="eager"
              />
              <div className="hero-card-meta">
                <span className="hero-card-label">Featured look</span>
                <span className="hero-card-title">{heroLook.title}</span>
              </div>
            </Link>
          )}
        </div>
      </section>

      <section
        className="featured"
        id="featured"
        aria-label="Featured looks"
      >
        <div className="featured-grid">
          {featured.map((look) => (
            <Link
              key={look.id}
              to={`/look/${look.id}`}
              className="featured-card"
            >
              <img
                src={look.hero}
                alt=""
                className="featured-img"
                loading="eager"
              />
              <div className="featured-body">
                <span className="card-label">{STYLE_LABELS[look.tag]}</span>
                <h2 className="featured-title">{look.title}</h2>
                <p className="card-text">
                  {look.season} · {look.occasion}
                </p>
                <span className="learn-more">Learn more »</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="explore" id="explore" aria-labelledby="explore-title">
        <div className="section-inner">
          <h2 id="explore-title" className="section-title">
            Explore looks by style
          </h2>
          <p className="section-sub">
            Filter the full lookbook by aesthetic. Open any look to see key
            items and add it to an album.
          </p>

          <div className="tabs" role="group" aria-label="Style filters">
            <button
              type="button"
              className={filter === 'all' ? 'tab active' : 'tab'}
              aria-pressed={filter === 'all'}
              onClick={() => setFilter('all')}
            >
              All looks
            </button>
            {STYLE_ORDER.map((tag) => (
              <button
                key={tag}
                type="button"
                className={filter === tag ? 'tab active' : 'tab'}
                aria-pressed={filter === tag}
                onClick={() => setFilter(tag)}
              >
                {STYLE_LABELS[tag]}
              </button>
            ))}
          </div>

          <p className="result-count muted">
            {filtered.length} {filtered.length === 1 ? 'look' : 'looks'}
          </p>

          {filtered.length === 0 ? (
            <p className="empty-state">No looks in this filter.</p>
          ) : (
            <div className="look-grid">
              {filtered.map((look) => (
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
                    loading="lazy"
                  />
                  <div className="look-card-body">
                    <span className="card-label">{STYLE_LABELS[look.tag]}</span>
                    <h3 className="look-card-title">{look.title}</h3>
                    <p className="card-text">{lookSummary(look)}</p>
                    <span className="learn-more">View look »</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="why" id="why" aria-labelledby="why-title">
        <div className="section-inner">
          <h2 id="why-title" className="section-title">
            Why Studio Lookbook
          </h2>
          <div className="why-grid">
            {VALUE_PROPS.map((item) => (
              <div key={item.title} className="why-card">
                <h3 className="why-title">{item.title}</h3>
                <p className="card-text">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band" aria-labelledby="cta-title">
        <div className="section-inner cta-inner">
          <div>
            <h2 id="cta-title" className="section-title">
              Ready to get started?
            </h2>
            <p className="section-sub">
              Create your first album and start saving looks in seconds.
            </p>
          </div>
          <Link to="/albums" className="btn-aws btn-aws-lg">
            Create an album
          </Link>
        </div>
      </section>
    </div>
  );
}
