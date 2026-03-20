import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const BRAND_MARKS = ['AURELIA', 'MONARC', 'VANTA', 'LUNE', 'ATELIER', 'NORD'];

const SERVICE_HIGHLIGHTS = [
  {
    title: 'Free shipping',
    copy: 'Complimentary delivery on curated edits over $150.',
  },
  {
    title: 'Easy returns',
    copy: 'Try each silhouette at home with a simple 14-day return window.',
  },
  {
    title: 'Curated styling',
    copy: 'Every drop is arranged by mood, season, and occasion.',
  },
];

const TESTIMONIALS = [
  {
    quote:
      'The fit direction feels elevated without becoming overdone. It is the first fashion site I have wanted to browse from top to bottom.',
    name: 'Elena Moore',
    role: 'Private client',
  },
  {
    quote:
      'Each story block feels editorial, but the products still read clearly. It makes shopping feel much more considered.',
    name: 'James Porter',
    role: 'Wardrobe consultant',
  },
  {
    quote:
      'The layout gives every image room to breathe. I can quickly move from tailored looks to easy weekend sets without losing the thread.',
    name: 'Mila Hart',
    role: 'Frequent shopper',
  },
];

const COUNTDOWN = [
  { label: 'Days', value: '05' },
  { label: 'Hours', value: '12' },
  { label: 'Mins', value: '36' },
  { label: 'Secs', value: '18' },
];

function collectUniqueImages(looks: Look[]) {
  const seen = new Set<string>();
  const images: Array<{ src: string; alt: string }> = [];

  for (const look of looks) {
    for (const src of [look.hero, ...look.gallery]) {
      if (seen.has(src)) continue;
      seen.add(src);
      images.push({
        src,
        alt: `${look.title} styled fashion edit`,
      });
    }
  }

  return images;
}

function pickLook(looks: Look[], index: number) {
  return looks[index] ?? looks[0];
}

export function LandingPage() {
  const [looks, setLooks] = useState<Look[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState<StyleTag>('minimal');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetchLooks().then((data) => {
      if (cancelled) return;
      setLooks(data);
      setActiveTag((current) =>
        data.some((look) => look.tag === current)
          ? current
          : (data[0]?.tag ?? 'minimal')
      );
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const uniqueImages = useMemo(() => collectUniqueImages(looks), [looks]);

  const heroLooks = useMemo(() => {
    if (looks.length === 0) return [];
    return [pickLook(looks, 0), pickLook(looks, 4), pickLook(looks, 2)];
  }, [looks]);

  const activeLooks = useMemo(
    () => looks.filter((look) => look.tag === activeTag).slice(0, 4),
    [looks, activeTag]
  );

  const storyLooks = useMemo(() => {
    if (looks.length === 0) return [];
    return [pickLook(looks, 7), pickLook(looks, 12)];
  }, [looks]);

  const mostLoved = useMemo(() => {
    if (looks.length === 0) return [];
    return looks.slice(8, 12).length > 0 ? looks.slice(8, 12) : looks.slice(0, 4);
  }, [looks]);

  const dealLook = useMemo(() => {
    if (looks.length === 0) return null;
    return pickLook(looks, 9);
  }, [looks]);

  const dealGallery = useMemo(() => uniqueImages.slice(4, 7), [uniqueImages]);
  const instagramImages = useMemo(() => uniqueImages.slice(0, 6), [uniqueImages]);

  const metrics = useMemo(
    () => [
      {
        label: 'Curated looks',
        value: String(looks.length).padStart(2, '0'),
      },
      {
        label: 'Style directions',
        value: String(
          STYLE_ORDER.filter((tag) => looks.some((look) => look.tag === tag)).length
        ).padStart(2, '0'),
      },
      {
        label: 'Campaign frames',
        value: String(uniqueImages.length).padStart(2, '0'),
      },
    ],
    [looks, uniqueImages.length]
  );

  const activeTagLabel = STYLE_LABELS[activeTag];

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail('');
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <p>Loading the new collection...</p>
      </div>
    );
  }

  if (looks.length === 0 || heroLooks.length === 0 || !dealLook) {
    return (
      <div className="loading-screen">
        <p>No collection data available.</p>
      </div>
    );
  }

  const heroTop = heroLooks[0];
  const heroMain = heroLooks[1];
  const heroBottom = heroLooks[2];

  return (
    <div className="landing-page">
      <div className="announcement-bar">
        <p>Spring sale live now - extra 10% off when you join the list.</p>
        <a href="#newsletter">Get the offer</a>
      </div>

      <header className="landing-header">
        <a href="#top" className="brand-mark" aria-label="FASCO home">
          FASCO
        </a>
        <nav className="site-nav" aria-label="Primary">
          <a href="#new-collection">New collection</a>
          <a href="#story">Stories</a>
          <a href="#deal">Deal of the month</a>
          <a href="#testimonials">Reviews</a>
          <a href="#newsletter">Newsletter</a>
        </nav>
        <div className="header-actions" aria-label="Store shortcuts">
          <a href="#new-collection">Shop</a>
          <a href="#newsletter">Account</a>
        </div>
      </header>

      <main className="landing-main" id="top">
        <section className="hero-section">
          <div className="hero-stack">
            <article className="hero-stack-card">
              <img
                src={heroTop.hero}
                alt={`${heroTop.title} campaign image`}
                loading="eager"
              />
              <div className="hero-stack-copy">
                <p className="hero-card-label">{STYLE_LABELS[heroTop.tag]}</p>
                <h2>{heroTop.title}</h2>
              </div>
            </article>

            <article className="hero-stack-card hero-stack-card-muted">
              <img
                src={heroBottom.hero}
                alt={`${heroBottom.title} campaign image`}
                loading="eager"
              />
              <div className="hero-stack-copy">
                <p className="hero-card-label">{heroBottom.season}</p>
                <h2>{heroBottom.title}</h2>
              </div>
            </article>
          </div>

          <div className="hero-copy">
            <p className="eyebrow">Modern fashion / Spring 2026</p>
            <h1 className="hero-title">
              ULTIMATE
              <span>SALE</span>
            </h1>
            <p className="hero-description">
              Tailored layers, effortless essentials, and relaxed utility edits
              arranged in a FASCO-inspired landing experience built from your
              existing fashion imagery.
            </p>
            <div className="hero-actions-row">
              <a href="#new-collection" className="button-primary">
                Shop now
              </a>
              <a href="#deal" className="button-secondary">
                View the deal
              </a>
            </div>
            <dl className="hero-metrics">
              {metrics.map((metric) => (
                <div key={metric.label}>
                  <dt>{metric.label}</dt>
                  <dd>{metric.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <article className="hero-feature-card">
            <img
              src={heroMain.hero}
              alt={`${heroMain.title} featured image`}
              loading="eager"
            />
            <div className="hero-feature-overlay">
              <p className="hero-card-label">New collection</p>
              <h2>{heroMain.title}</h2>
              <p>{heroMain.keyItems.join(' / ')}</p>
            </div>
          </article>
        </section>

        <section className="brand-rail" aria-label="Featured labels">
          <span className="brand-rail-title">Seen in the edit</span>
          <div className="brand-rail-list">
            {BRAND_MARKS.map((brand) => (
              <span key={brand}>{brand}</span>
            ))}
          </div>
        </section>

        <section className="section-shell collection-section" id="new-collection">
          <div className="section-heading">
            <div>
              <p className="eyebrow">New collection</p>
              <h2>Elevated essentials for every pace of the day.</h2>
            </div>
            <p className="section-copy">
              Filter the collection by mood to move from refined tailoring to
              softer everyday silhouettes without losing the visual rhythm of the
              landing page.
            </p>
          </div>

          <div className="tag-filter" aria-label="Collection filters">
            {STYLE_ORDER.filter((tag) => looks.some((look) => look.tag === tag)).map(
              (tag) => (
                <button
                  key={tag}
                  type="button"
                  className={tag === activeTag ? 'tag-chip active' : 'tag-chip'}
                  onClick={() => setActiveTag(tag)}
                  aria-pressed={tag === activeTag}
                >
                  {STYLE_LABELS[tag]}
                </button>
              )
            )}
          </div>

          <div className="collection-note">
            <p>
              Showing <strong>{activeTagLabel}</strong> looks with clean styling
              notes, season cues, and image-led presentation.
            </p>
          </div>

          <div className="product-grid">
            {activeLooks.map((look) => (
              <article key={look.id} className="product-card">
                <div className="product-media">
                  <img src={look.hero} alt={`${look.title} product preview`} loading="lazy" />
                </div>
                <div className="product-copy">
                  <p className="product-tag">{STYLE_LABELS[look.tag]}</p>
                  <h3>{look.title}</h3>
                  <p className="product-description">
                    {look.keyItems.slice(0, 3).join(' / ')}
                  </p>
                  <div className="product-meta">
                    <span>{look.season}</span>
                    <span>{look.occasion}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell editorial-section" id="story">
          <div className="section-heading">
            <div>
              <p className="eyebrow">FASCO signature</p>
              <h2>Editorial storytelling with enough structure to still feel shoppable.</h2>
            </div>
            <p className="section-copy">
              Large-format image blocks and concise copy keep the page feeling
              premium while making each look easy to scan.
            </p>
          </div>

          <div className="editorial-grid">
            {storyLooks.map((look, index) => (
              <article
                key={look.id}
                className={index % 2 === 0 ? 'editorial-card' : 'editorial-card reverse'}
              >
                <div className="editorial-media">
                  <img src={look.hero} alt={`${look.title} editorial campaign`} loading="lazy" />
                </div>
                <div className="editorial-copy">
                  <p className="eyebrow">{look.occasion}</p>
                  <h3>{look.title}</h3>
                  <p>
                    Built around {look.keyItems.slice(0, 2).join(' and ')}, this
                    story balances {STYLE_LABELS[look.tag].toLowerCase()} energy
                    with a calm, spacious presentation.
                  </p>
                  <ul className="detail-list">
                    {look.keyItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="service-grid" aria-label="Store benefits">
          {SERVICE_HIGHLIGHTS.map((item) => (
            <article key={item.title} className="service-card">
              <p className="service-title">{item.title}</p>
              <p>{item.copy}</p>
            </article>
          ))}
        </section>

        <section className="deal-section" id="deal">
          <div className="deal-copy">
            <p className="eyebrow">Deal of the month</p>
            <h2>{dealLook.title}</h2>
            <p>
              A focused promotional block gives the page its ecommerce cadence
              while keeping the visual emphasis on your existing campaign
              photography.
            </p>
            <div className="deal-timer" aria-label="Countdown timer">
              {COUNTDOWN.map((item) => (
                <div key={item.label} className="timer-card">
                  <span>{item.value}</span>
                  <small>{item.label}</small>
                </div>
              ))}
            </div>
            <a href="#newsletter" className="button-primary">
              Reserve this edit
            </a>
          </div>

          <div className="deal-media">
            <article className="deal-main-card">
              <img src={dealLook.hero} alt={`${dealLook.title} featured deal`} loading="lazy" />
            </article>
            <div className="deal-gallery">
              {dealGallery.map((image) => (
                <article key={image.src} className="deal-gallery-card">
                  <img src={image.src} alt={image.alt} loading="lazy" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-shell most-loved-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Most loved</p>
              <h2>Image-first cards designed to feel clean, premium, and fast to scan.</h2>
            </div>
            <p className="section-copy">
              This row keeps the ecommerce feel of the source design while using
              your existing look metadata instead of inventing a deeper catalog.
            </p>
          </div>

          <div className="most-loved-grid">
            {mostLoved.map((look) => (
              <article key={look.id} className="rated-card">
                <div className="rated-media">
                  <img src={look.hero} alt={`${look.title} most loved style`} loading="lazy" />
                </div>
                <div className="rated-copy">
                  <p className="product-tag">{look.season}</p>
                  <h3>{look.title}</h3>
                  <p>{look.occasion}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="testimonials-section" id="testimonials">
          <div className="section-heading section-heading-on-dark">
            <div>
              <p className="eyebrow">This is what our customers say</p>
              <h2>Confidence, clarity, and a more editorial way to shop.</h2>
            </div>
            <p className="section-copy">
              Testimonial cards bring the layout closer to the original FASCO
              flow and help break up the heavier image sections.
            </p>
          </div>

          <div className="testimonial-grid">
            {TESTIMONIALS.map((testimonial) => (
              <article key={testimonial.name} className="testimonial-card">
                <p className="testimonial-quote">"{testimonial.quote}"</p>
                <div className="testimonial-meta">
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.role}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section-shell instagram-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Follow us on Instagram</p>
              <h2>A closing gallery wall for social proof and visual momentum.</h2>
            </div>
            <p className="section-copy">
              Reusing the strongest frames here extends the campaign without
              needing any extra assets.
            </p>
          </div>

          <div className="instagram-grid">
            {instagramImages.map((image, index) => (
              <article
                key={image.src}
                className={index === 1 || index === 4 ? 'instagram-card large' : 'instagram-card'}
              >
                <img src={image.src} alt={image.alt} loading="lazy" />
              </article>
            ))}
          </div>
        </section>

        <section className="newsletter-section" id="newsletter">
          <div className="newsletter-copy">
            <p className="eyebrow">Newsletter</p>
            <h2>Join the list for private drops, styling notes, and early sale access.</h2>
            <p>
              The final CTA mirrors the original landing-page pattern and gives
              the experience a polished closing point.
            </p>
          </div>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (submitted) setSubmitted(false);
              }}
              placeholder="Enter your email"
            />
            <button type="submit" className="button-primary">
              Subscribe
            </button>
            <p className="newsletter-note">
              {submitted
                ? 'Thanks - you are on the list.'
                : 'No spam, just seasonal drops and private sale previews.'}
            </p>
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <a href="#top" className="brand-mark footer-brand">
            FASCO
          </a>
          <p>Luxury-inspired fashion landing page built from existing repo imagery.</p>
        </div>
        <div className="footer-links">
          <a href="#new-collection">Collection</a>
          <a href="#deal">Deal</a>
          <a href="#newsletter">Contact</a>
        </div>
      </footer>
    </div>
  );
}
