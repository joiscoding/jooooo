import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const EDIT_COPY: Record<
  StyleTag,
  { eyebrow: string; title: string; blurb: string }
> = {
  minimal: {
    eyebrow: 'Quiet luxury',
    title: 'Minimal essentials',
    blurb:
      'Soft neutrals, clean lines, and easy proportions for days when restraint does the talking.',
  },
  streetwear: {
    eyebrow: 'City ready',
    title: 'Streetwear codes',
    blurb:
      'Utility layers, sharper sneakers, and the kind of styling that holds its own after dark.',
  },
  classic: {
    eyebrow: 'Polished edit',
    title: 'Classic tailoring',
    blurb:
      'Structured coats, refined knits, and dependable pieces that keep formal casual dressing easy.',
  },
  athleisure: {
    eyebrow: 'Move freely',
    title: 'Athleisure lines',
    blurb:
      'Performance cues softened for travel days, coffee runs, and the moments in between.',
  },
  workwear: {
    eyebrow: 'Texture & utility',
    title: 'Workwear layers',
    blurb:
      'Heritage fabrics, grounded color, and durable shapes with enough polish for daily wear.',
  },
};

const COLLECTION_WORDS = [
  'New season',
  'Editorial shop',
  'Tailored ease',
  'Quiet statement',
  'Everyday luxury',
];

const TESTIMONIALS = [
  {
    quote:
      'The styling feels considered without being overworked. Everything looks like it belongs in the same wardrobe.',
    attribution: 'M. Rivera / Editorial customer note',
  },
  {
    quote:
      'It is rare to find a landing page that feels premium but still gets you into the product flow quickly.',
    attribution: 'J. Clarke / Digital merch review',
  },
  {
    quote:
      'The mix of relaxed silhouettes and sharp layers makes the whole collection feel current and wearable.',
    attribution: 'A. Shah / Seasonal buyer feedback',
  },
];

function collectUniqueLooks(candidates: Array<Look | undefined>): Look[] {
  const seen = new Set<string>();
  const picked: Look[] = [];

  for (const look of candidates) {
    if (!look || seen.has(look.id)) continue;
    seen.add(look.id);
    picked.push(look);
  }

  return picked;
}

function shopHref(tag?: StyleTag) {
  return tag ? `/shop?filter=${tag}` : '/shop';
}

export function LandingPage() {
  const [looks, setLooks] = useState<Look[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchLooks().then((data) => {
      if (cancelled) return;
      setLooks(data);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const heroLook = useMemo(
    () => looks.find((look) => look.tag === 'classic') ?? looks[0] ?? null,
    [looks]
  );

  const supportingLooks = useMemo(
    () =>
      collectUniqueLooks([
        looks.find((look) => look.tag === 'minimal'),
        looks.find((look) => look.tag === 'streetwear'),
        looks.find((look) => look.tag === 'athleisure'),
        ...looks,
      ]).slice(0, 2),
    [looks]
  );

  const editCards = useMemo(
    () =>
      STYLE_ORDER.map((tag) => ({
        tag,
        look: looks.find((item) => item.tag === tag),
        ...EDIT_COPY[tag],
      })).filter(
        (
          item
        ): item is {
          tag: StyleTag;
          look: Look;
          eyebrow: string;
          title: string;
          blurb: string;
        } => Boolean(item.look)
      ),
    [looks]
  );

  const spotlightLooks = useMemo(
    () =>
      collectUniqueLooks([
        looks.find((look) => look.tag === 'workwear'),
        looks.find((look) => look.tag === 'minimal'),
        looks.find((look) => look.tag === 'streetwear'),
        ...looks,
      ]).slice(0, 2),
    [looks]
  );

  const newArrivals = useMemo(() => looks.slice(0, 6), [looks]);

  const quoteImages = useMemo(
    () =>
      collectUniqueLooks([
        looks.find((look) => look.tag === 'classic'),
        looks.find((look) => look.tag === 'athleisure'),
        looks.find((look) => look.tag === 'workwear'),
        looks.find((look) => look.tag === 'minimal'),
        ...looks,
      ]).slice(0, 3),
    [looks]
  );

  function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  }

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading the new season...</p>
      </div>
    );
  }

  if (!heroLook) {
    return (
      <div className="page-loading">
        <p className="muted">The collection is unavailable right now.</p>
      </div>
    );
  }

  return (
    <div className="landing-page">
      <section className="landing-hero">
        <div className="landing-hero-copy">
          <p className="landing-kicker">FASCO / Spring Summer 2026</p>
          <h1 className="landing-hero-title">
            Modern essentials for the everyday runway.
          </h1>
          <p className="landing-hero-text">
            A FASCO-inspired storefront rebuilt from the existing lookbook
            assets, pairing refined tailoring, relaxed layers, and fast entry
            points into every edit.
          </p>
          <div className="landing-hero-actions">
            <Link to="/shop" className="btn primary">
              Shop new arrivals
            </Link>
            <Link to={shopHref('classic')} className="btn ghost">
              Explore the lookbook
            </Link>
          </div>
          <div className="landing-trust-grid">
            <article className="trust-card">
              <h2>Five curated lanes</h2>
              <p>
                Minimal, streetwear, classic, athleisure, and workwear edits
                are all mapped directly to the catalog.
              </p>
            </article>
            <article className="trust-card">
              <h2>Save looks instantly</h2>
              <p>
                Albums persist in the browser, making it easy to shortlist fits
                worth revisiting later.
              </p>
            </article>
            <article className="trust-card">
              <h2>Editorial-first flow</h2>
              <p>
                Large photography, restrained copy, and clear CTAs keep the
                storefront premium without slowing discovery.
              </p>
            </article>
          </div>
        </div>

        <div className="landing-hero-media">
          <article className="hero-showcase hero-showcase-primary">
            <img
              src={heroLook.hero}
              alt={`${heroLook.title} styled look`}
              className="hero-showcase-image"
              loading="eager"
            />
            <span className="hero-showcase-badge">New season</span>
            <div className="hero-showcase-meta">
              <p className="eyebrow">{STYLE_LABELS[heroLook.tag]}</p>
              <h2>{heroLook.title}</h2>
              <p>
                {heroLook.occasion} / {heroLook.season}
              </p>
              <Link to={`/look/${heroLook.id}`} className="hero-showcase-link">
                Shop the lead look
              </Link>
            </div>
          </article>

          <div className="hero-showcase-stack">
            {supportingLooks.map((look) => (
              <article key={look.id} className="hero-showcase hero-showcase-mini">
                <img
                  src={look.hero}
                  alt={`${look.title} look`}
                  className="hero-showcase-image"
                  loading="lazy"
                />
                <div className="hero-showcase-meta compact">
                  <p className="eyebrow">{STYLE_LABELS[look.tag]}</p>
                  <h2>{look.title}</h2>
                </div>
              </article>
            ))}
            <aside className="hero-style-note">
              <p className="eyebrow">Style note</p>
              <p>
                Tailored layers, softened sportswear, and grounded neutrals keep
                the whole page aligned with a premium, fashion-first mood.
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="landing-marquee" aria-label="Collection signifiers">
        {COLLECTION_WORDS.map((word) => (
          <span key={word}>{word}</span>
        ))}
      </section>

      <section className="landing-section">
        <div className="landing-section-head">
          <div>
            <p className="eyebrow">Shop by edit</p>
            <h2 className="landing-section-title">
              Five ways to wear the season.
            </h2>
          </div>
          <Link to="/shop" className="landing-section-link">
            View all looks
          </Link>
        </div>

        <div className="edit-grid">
          {editCards.map(({ tag, look, eyebrow, title, blurb }) => (
            <Link key={tag} to={shopHref(tag)} className="edit-card">
              <img
                src={look.hero}
                alt={`${title} editorial outfit`}
                className="edit-card-image"
                loading="lazy"
              />
              <div className="edit-card-copy">
                <p className="eyebrow">{eyebrow}</p>
                <h3>{title}</h3>
                <p>{blurb}</p>
                <span className="edit-card-link">
                  Browse {STYLE_LABELS[tag]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="landing-feature-grid">
        <article className="feature-panel feature-panel-dark">
          <div className="feature-panel-copy">
            <p className="eyebrow">Seasonal spotlight</p>
            <h2>Built for weekday polish and off-duty ease.</h2>
            <p>
              Structured outerwear, premium texture, and balanced proportions
              keep the wardrobe grounded whether the day calls for tailoring or
              something softer.
            </p>
            {spotlightLooks[0] && (
              <Link to={`/look/${spotlightLooks[0].id}`} className="btn ghost">
                See the lead look
              </Link>
            )}
          </div>
          {spotlightLooks[0] && (
            <img
              src={spotlightLooks[0].hero}
              alt={`${spotlightLooks[0].title} seasonal feature`}
              className="feature-panel-image"
              loading="lazy"
            />
          )}
        </article>

        <article className="feature-panel">
          {spotlightLooks[1] && (
            <img
              src={spotlightLooks[1].hero}
              alt={`${spotlightLooks[1].title} styling feature`}
              className="feature-panel-image"
              loading="lazy"
            />
          )}
          <div className="feature-panel-copy">
            <p className="eyebrow">Fresh styling</p>
            <h2>Relaxed silhouettes, smarter textures.</h2>
            <p>
              Every look keeps the lines clean while letting fabric, contrast,
              and tonal layering do the heavy lifting.
            </p>
            <Link to={shopHref('minimal')} className="btn primary">
              Start with essentials
            </Link>
          </div>
        </article>
      </section>

      <section className="landing-section">
        <div className="landing-section-head">
          <div>
            <p className="eyebrow">New arrivals</p>
            <h2 className="landing-section-title">
              The latest looks, ready to shop.
            </h2>
          </div>
          <Link to="/shop" className="landing-section-link">
            Browse the collection
          </Link>
        </div>

        <div className="arrival-grid">
          {newArrivals.map((look, index) => (
            <article key={look.id} className="arrival-card">
              <Link to={`/look/${look.id}`} className="arrival-card-media">
                <img
                  src={look.hero}
                  alt={`${look.title} look`}
                  className="arrival-image"
                  loading={index < 3 ? 'eager' : 'lazy'}
                />
              </Link>
              <div className="arrival-card-copy">
                <p className="eyebrow">{STYLE_LABELS[look.tag]}</p>
                <div className="arrival-card-head">
                  <h3>{look.title}</h3>
                  <span>{look.season}</span>
                </div>
                <p className="arrival-card-meta">{look.occasion}</p>
                <ul className="arrival-card-list">
                  {look.keyItems.slice(0, 3).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="arrival-card-actions">
                  <Link to={`/look/${look.id}`} className="btn primary">
                    View look
                  </Link>
                  <Link to={shopHref(look.tag)} className="btn ghost">
                    More like this
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-quote-band">
        <div className="quote-band-media">
          {quoteImages.map((look) => (
            <img
              key={look.id}
              src={look.hero}
              alt={`${look.title} collection detail`}
              className="quote-band-image"
              loading="lazy"
            />
          ))}
        </div>
        <div className="quote-band-copy">
          <p className="eyebrow">Why the edit works</p>
          <blockquote>
            “The styling feels deliberate without being difficult. Every piece
            looks like it belongs in the same wardrobe.”
          </blockquote>
          <p className="quote-band-attribution">
            The refreshed home page keeps that premium cadence while preserving
            the existing gallery and album flows underneath it.
          </p>
        </div>
      </section>

      <section className="landing-section testimonials-section">
        <div className="landing-section-head">
          <div>
            <p className="eyebrow">Notes from the floor</p>
            <h2 className="landing-section-title">
              Social proof with a softer voice.
            </h2>
          </div>
        </div>

        <div className="testimonial-grid">
          {TESTIMONIALS.map((testimonial) => (
            <article
              key={testimonial.attribution}
              className="testimonial-card"
            >
              <p className="testimonial-quote">“{testimonial.quote}”</p>
              <p className="testimonial-attribution">
                {testimonial.attribution}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="newsletter-panel" id="newsletter">
        <div className="newsletter-copy">
          <p className="eyebrow">Newsletter</p>
          <h2>First access to new drops and styling notes.</h2>
          <p>
            Join the list for fresh arrivals, curated edits, and quiet-sale
            updates delivered sparingly.
          </p>
        </div>
        <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            className="text-input newsletter-input"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (subscribed) setSubscribed(false);
            }}
            required
          />
          <button type="submit" className="btn primary">
            Join the list
          </button>
        </form>
        {subscribed && (
          <p className="toast" role="status">
            Thanks — the next FASCO note will land in your inbox.
          </p>
        )}
      </section>
    </div>
  );
}
