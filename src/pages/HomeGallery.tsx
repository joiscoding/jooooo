import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const QUOTES = [
  {
    text: 'The filter system made it effortless to find pieces that actually fit my wardrobe — not just what’s trending.',
    author: 'Marcus Chen',
    role: 'Creative Director',
  },
  {
    text: 'I save looks to albums before every trip. It’s the fastest way to pack with intention.',
    author: 'James Okonkwo',
    role: 'Founder, Field Notes',
  },
  {
    text: 'Clean, focused, no noise. Exactly how a lookbook should feel when you’re building a capsule.',
    author: 'Elena Vasquez',
    role: 'Stylist',
  },
] as const;

function scrollToGallery() {
  document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
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

  const filtered = useMemo(() => {
    if (filter === 'all') return looks;
    return looks.filter((l) => l.tag === filter);
  }, [looks, filter]);

  const previewLooks = looks.slice(0, 6);
  const albumPreview = looks.slice(0, 3);

  if (loading) {
    return (
      <div className="page-loading home-section">
        <p className="muted">Loading lookbook…</p>
      </div>
    );
  }

  return (
    <div className="home">
      <section className="home-section home-hero">
        <div className="home-hero-inner">
          <h1 className="home-title">
            Looks built for ambitious style.
          </h1>
          <p className="home-subtitle">
            Curated men&apos;s outfits for every season and occasion — filter by
            mood, explore the gallery, and save your favorites to albums.
          </p>
          <div className="home-cta-row">
            <button
              type="button"
              className="btn-primary"
              onClick={scrollToGallery}
            >
              Browse gallery
            </button>
            <Link to="/albums" className="btn-secondary">
              View albums
            </Link>
          </div>
        </div>
      </section>

      <section className="home-section home-trust">
        <p className="home-trust-label">
          Curated across every style lane
        </p>
        <div className="home-trust-logos">
          {STYLE_ORDER.map((tag) => (
            <span key={tag} className="home-trust-item">
              {STYLE_LABELS[tag]}
            </span>
          ))}
        </div>
      </section>

      <section className="home-section home-features">
        <div className="home-section-inner">
          <article className="home-feature">
            <div className="home-feature-copy">
              <p className="home-feature-eyebrow">Seasonal edits</p>
              <h2 className="home-feature-title">
                Curated looks that turn ideas into outfits
              </h2>
              <p className="home-feature-desc">
                Every look is hand-picked with key pieces, occasion notes, and
                season context — so you can dress with confidence, not guesswork.
              </p>
              <button
                type="button"
                className="home-feature-link"
                onClick={scrollToGallery}
              >
                Explore the gallery →
              </button>
            </div>
            <div className="home-feature-visual">
              <div className="home-feature-mock">
                <div className="home-mock-bar" aria-hidden>
                  <span className="home-mock-dot" />
                  <span className="home-mock-dot" />
                  <span className="home-mock-dot" />
                </div>
                <div className="home-mock-grid">
                  {previewLooks.map((look) => (
                    <div key={look.id} className="home-mock-card">
                      <img src={look.hero} alt="" loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <article className="home-feature home-feature--reverse">
            <div className="home-feature-copy">
              <p className="home-feature-eyebrow">Filter by mood</p>
              <h2 className="home-feature-title">
                Find the right aesthetic in seconds
              </h2>
              <p className="home-feature-desc">
                Switch between minimal, streetwear, classic, athleisure, and
                workwear — each lane is organized so you can narrow in fast.
              </p>
              <button
                type="button"
                className="home-feature-link"
                onClick={scrollToGallery}
              >
                Try the filters →
              </button>
            </div>
            <div className="home-feature-visual">
              <div className="home-feature-mock">
                <div className="home-mock-bar" aria-hidden>
                  <span className="home-mock-dot" />
                  <span className="home-mock-dot" />
                  <span className="home-mock-dot" />
                </div>
                <div className="home-mock-filters">
                  <span className="home-mock-pill">All looks</span>
                  <span className="home-mock-pill home-mock-pill--active">
                    Minimal
                  </span>
                  <span className="home-mock-pill">Streetwear</span>
                  <span className="home-mock-pill">Classic</span>
                </div>
                <div className="home-mock-grid">
                  {previewLooks.slice(0, 3).map((look) => (
                    <div key={look.id} className="home-mock-card">
                      <img src={look.hero} alt="" loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <article className="home-feature">
            <div className="home-feature-copy">
              <p className="home-feature-eyebrow">Albums</p>
              <h2 className="home-feature-title">
                Save looks and build your capsule
              </h2>
              <p className="home-feature-desc">
                Create albums for trips, seasons, or events. Collect the looks
                you love and come back to them whenever you need inspiration.
              </p>
              <Link to="/albums" className="home-feature-link">
                Open your albums →
              </Link>
            </div>
            <div className="home-feature-visual">
              <div className="home-feature-mock">
                <div className="home-mock-bar" aria-hidden>
                  <span className="home-mock-dot" />
                  <span className="home-mock-dot" />
                  <span className="home-mock-dot" />
                </div>
                <div className="home-mock-album">
                  {albumPreview.map((look, i) => (
                    <div key={look.id} className="home-mock-album-row">
                      <img
                        src={look.hero}
                        alt=""
                        className="home-mock-album-thumb"
                        loading="lazy"
                      />
                      <div>
                        <p className="home-mock-album-name">
                          {i === 0
                            ? 'Weekend rotation'
                            : i === 1
                              ? 'Office capsule'
                              : 'Travel picks'}
                        </p>
                        <p className="home-mock-album-count">
                          {3 + i} looks saved
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="home-section home-quotes">
        <div className="home-section-inner">
          <h2 className="home-quotes-heading">The new way to get dressed.</h2>
          <div className="home-quotes-grid">
            {QUOTES.map((quote) => (
              <blockquote key={quote.author} className="home-quote">
                <p className="home-quote-text">&ldquo;{quote.text}&rdquo;</p>
                <footer>
                  <p className="home-quote-author">{quote.author}</p>
                  <p className="home-quote-role">{quote.role}</p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="home-section home-gallery-section">
        <div className="home-section-inner">
          <div className="home-gallery-header">
            <div>
              <h2 className="home-gallery-title">The gallery</h2>
              <p className="home-gallery-desc">
                {filtered.length} look{filtered.length === 1 ? '' : 's'} —
                tap any card for key pieces and details.
              </p>
            </div>
            <div className="filters-bar" aria-label="Style filters">
              <button
                type="button"
                className={
                  filter === 'all' ? 'filter-pill active' : 'filter-pill'
                }
                onClick={() => setFilter('all')}
              >
                All looks
              </button>
              {STYLE_ORDER.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={
                    filter === tag ? 'filter-pill active' : 'filter-pill'
                  }
                  onClick={() => setFilter(tag)}
                >
                  {STYLE_LABELS[tag]}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="empty-state">No looks in this filter.</p>
          ) : (
            <div className="gallery-wall">
              {filtered.map((look, i) => (
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
                      <span className="wall-tag">
                        {STYLE_LABELS[look.tag]}
                      </span>
                      <h3 className="wall-title">{look.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="home-section home-cta-bottom">
        <div className="home-section-inner">
          <h2 className="home-cta-bottom-title">Try the lookbook now.</h2>
          <div className="home-cta-row">
            <button
              type="button"
              className="btn-primary btn-accent"
              onClick={scrollToGallery}
            >
              Browse gallery
            </button>
            <Link to="/albums" className="btn-secondary">
              Create an album
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
