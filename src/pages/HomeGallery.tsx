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

  const featuredLook = useMemo(
    () => looks.find((look) => look.id === 'boardroom-soft') ?? looks[0],
    [looks]
  );
  const secondaryLook = useMemo(
    () => looks.find((look) => look.id === 'sand-stone') ?? looks[1] ?? looks[0],
    [looks]
  );
  const campaignLooks = useMemo(
    () =>
      ['navy-precision', 'utility-grain', 'paper-white']
        .map((id) => looks.find((look) => look.id === id))
        .filter((look): look is Look => Boolean(look)),
    [looks]
  );
  const browseLooks = useMemo(() => filtered.slice(0, 8), [filtered]);

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  if (looks.length === 0 || !featuredLook || !secondaryLook) {
    return (
      <div className="page-loading">
        <p className="muted">No looks are available right now.</p>
      </div>
    );
  }

  return (
    <div className="home">
      <section className="home-hero home-hero-editorial">
        <img
          src={featuredLook.hero}
          alt={featuredLook.title}
          className="hero-image"
          loading="eager"
        />
        <div className="hero-overlay">
          <p className="eyebrow">Spring 2026 collection</p>
          <h1 className="home-title">
            Refined dressing for city days, long weekends, and everything in
            between.
          </h1>
          <p className="hero-copy">
            A quieter point of view: tailored layers, heritage textures, and
            relaxed silhouettes styled with a luxury-house mood.
          </p>
          <div className="hero-actions">
            <a href="#browse" className="btn primary hero-btn">
              Shop the edit
            </a>
            <Link to={`/look/${featuredLook.id}`} className="btn ghost hero-btn">
              View campaign look
            </Link>
          </div>
        </div>
      </section>

      <section className="intro-band">
        <div>
          <p className="eyebrow">The house edit</p>
          <p className="intro-copy">
            Elevated staples grounded in tailoring, sport, and utility - arranged
            like a seasonal campaign, then opened up into a shoppable gallery.
          </p>
        </div>
        <dl className="intro-stats">
          <div>
            <dt>Curated looks</dt>
            <dd>{looks.length}</dd>
          </div>
          <div>
            <dt>Style worlds</dt>
            <dd>{STYLE_ORDER.length}</dd>
          </div>
          <div>
            <dt>Season focus</dt>
            <dd>{featuredLook.season}</dd>
          </div>
        </dl>
      </section>

      <section className="editorial-grid">
        <article className="editorial-copy-card">
          <p className="eyebrow">Featured story</p>
          <h2 className="section-title">Modern tailoring, softened.</h2>
          <p className="editorial-copy">
            Sharp lines are tempered with washed neutrals, open collars, and
            pieces that feel polished without becoming formal.
          </p>
          <ul className="editorial-list">
            {featuredLook.keyItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <Link to={`/look/${featuredLook.id}`} className="text-link">
            Explore {featuredLook.title}
          </Link>
        </article>

        <Link to={`/look/${secondaryLook.id}`} className="editorial-image-card">
          <img
            src={secondaryLook.hero}
            alt={secondaryLook.title}
            className="editorial-image"
            loading="lazy"
          />
          <div className="editorial-caption">
            <span className="wall-tag">{STYLE_LABELS[secondaryLook.tag]}</span>
            <h2 className="wall-title">{secondaryLook.title}</h2>
            <p>{secondaryLook.occasion}</p>
          </div>
        </Link>
      </section>

      <section className="campaign-strip">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Campaign selection</p>
            <h2 className="section-title">Three ways into the season.</h2>
          </div>
          <Link to="/albums" className="text-link">
            View saved albums
          </Link>
        </div>

        <div className="campaign-grid">
          {campaignLooks.map((look, index) => (
            <Link key={look.id} to={`/look/${look.id}`} className="campaign-card">
              <img
                src={look.hero}
                alt={look.title}
                className="campaign-image"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
              <div className="campaign-body">
                <span className="card-index">0{index + 1}</span>
                <h3>{look.title}</h3>
                <p>
                  {look.season} · {look.occasion}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="browse" className="browse-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Browse the collection</p>
            <h2 className="section-title">Shop by mood.</h2>
          </div>
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
          <div className="gallery-wall gallery-wall-editorial">
            {browseLooks.map((look, i) => {
              return (
                <Link key={look.id} to={`/look/${look.id}`} className="wall-card">
                  <div className="wall-card-inner">
                    <img
                      key={`${look.id}-${look.hero}`}
                      src={look.hero}
                      alt={look.title}
                      className="wall-img"
                      loading={i < 3 ? 'eager' : 'lazy'}
                    />
                    <div className="wall-meta">
                      <span className="wall-tag">{STYLE_LABELS[look.tag]}</span>
                      <h2 className="wall-title">{look.title}</h2>
                      <p className="wall-subtitle">
                        {look.season} · {look.occasion}
                      </p>
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
