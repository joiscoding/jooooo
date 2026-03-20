import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS } from '../types';

const TESTIMONIALS = [
  {
    name: 'James L.',
    role: 'Stylist',
    text: 'The curation here is impeccable. Every look feels intentional — like someone actually thought about how each piece works together.',
    rating: 5,
  },
  {
    name: 'Peter K.',
    role: 'Creative Director',
    text: 'Finally, a lookbook that understands quiet confidence. The styling is modern without being try-hard. I keep coming back for inspiration.',
    rating: 5,
  },
  {
    name: 'Marcus W.',
    role: 'Architect',
    text: 'Clean, minimal, and beautifully photographed. This is the kind of resource I wish existed years ago. Highly recommended.',
    rating: 5,
  },
];

const CATEGORIES: { label: string; tag: StyleTag | 'all' }[] = [
  { label: 'All', tag: 'all' },
  { label: 'Minimal', tag: 'minimal' },
  { label: 'Streetwear', tag: 'streetwear' },
  { label: 'Classic', tag: 'classic' },
  { label: 'Athleisure', tag: 'athleisure' },
  { label: 'Workwear', tag: 'workwear' },
];

function useCountdown(targetDate: Date) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, targetDate.getTime() - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins: Math.floor((diff % 3600000) / 60000),
    secs: Math.floor((diff % 60000) / 1000),
  };
}

function StarRating({ count }: { count: number }) {
  return (
    <span className="lp-stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < count ? 'star filled' : 'star'}>
          ★
        </span>
      ))}
    </span>
  );
}

export function LandingPage() {
  const [looks, setLooks] = useState<Look[]>([]);
  const [activeTab, setActiveTab] = useState<StyleTag | 'all'>('all');
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  const endDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 12);
    return d;
  }, []);
  const countdown = useCountdown(endDate);

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

  const filteredLooks = useMemo(() => {
    if (activeTab === 'all') return looks;
    return looks.filter((l) => l.tag === activeTab);
  }, [looks, activeTab]);

  const featuredLooks = useMemo(() => looks.slice(0, 3), [looks]);
  const displayLooks = filteredLooks.slice(0, 8);

  if (loading) {
    return (
      <div className="page-loading">
        <p className="muted">Loading…</p>
      </div>
    );
  }

  return (
    <div className="lp">
      {/* Hero */}
      <section className="lp-hero">
        <div className="lp-hero-content">
          <p className="lp-hero-eyebrow">Seasonal Collection</p>
          <h1 className="lp-hero-heading">
            Ultimate
            <br />
            <em>Style</em> Edit
          </h1>
          <p className="lp-hero-sub">
            Curated looks for the modern man. Explore our latest seasonal
            picks—crafted for quiet confidence.
          </p>
          <Link to="/look/crosswalk-khaki" className="lp-hero-cta">
            Shop Now
          </Link>
        </div>
        <div className="lp-hero-image">
          <img
            src="/looks/1768809250854-2f4b1e8f19cc-w1200h1600.jpg"
            alt="Featured look"
            loading="eager"
          />
        </div>
      </section>

      {/* Brand Bar */}
      <section className="lp-brands" aria-label="Featured brands">
        {['CHANEL', 'LOUIS VUITTON', 'PRADA', 'Calvin Klein', 'DENIM'].map(
          (brand) => (
            <span key={brand} className="lp-brand-name">
              {brand}
            </span>
          )
        )}
      </section>

      {/* Deals of the Month */}
      <section className="lp-deals">
        <div className="lp-deals-image">
          <img
            src="/looks/1679412330231-4a049ffd294b-w1200h1500.jpg"
            alt="Deal of the month"
            loading="lazy"
          />
        </div>
        <div className="lp-deals-content">
          <p className="lp-section-label">Exclusive Offer</p>
          <h2 className="lp-section-title">Deals of the Month</h2>
          <p className="lp-deals-text">
            Get our best looks at exceptional prices. Limited time only—don't
            miss these curated seasonal pieces at their lowest.
          </p>
          <div className="lp-countdown">
            <div className="lp-cd-unit">
              <span className="lp-cd-num">{String(countdown.days).padStart(2, '0')}</span>
              <span className="lp-cd-label">Days</span>
            </div>
            <div className="lp-cd-unit">
              <span className="lp-cd-num">{String(countdown.hours).padStart(2, '0')}</span>
              <span className="lp-cd-label">Hours</span>
            </div>
            <div className="lp-cd-unit">
              <span className="lp-cd-num">{String(countdown.mins).padStart(2, '0')}</span>
              <span className="lp-cd-label">Mins</span>
            </div>
            <div className="lp-cd-unit">
              <span className="lp-cd-num">{String(countdown.secs).padStart(2, '0')}</span>
              <span className="lp-cd-label">Secs</span>
            </div>
          </div>
          <Link to="/" className="lp-deals-cta">
            View Collection
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="lp-arrivals">
        <p className="lp-section-label">Explore</p>
        <h2 className="lp-section-title">New Arrivals</h2>

        <div className="lp-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.tag}
              type="button"
              className={activeTab === cat.tag ? 'lp-tab active' : 'lp-tab'}
              onClick={() => setActiveTab(cat.tag)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {displayLooks.length === 0 ? (
          <p className="empty-state">No looks in this category.</p>
        ) : (
          <div className="lp-products-grid">
            {displayLooks.map((look, i) => (
              <Link
                key={look.id}
                to={`/look/${look.id}`}
                className="lp-product-card"
              >
                <div className="lp-product-img-wrap">
                  <img
                    src={look.hero}
                    alt={look.title}
                    className="lp-product-img"
                    loading={i < 4 ? 'eager' : 'lazy'}
                  />
                  <span className="lp-product-tag">
                    {STYLE_LABELS[look.tag]}
                  </span>
                </div>
                <div className="lp-product-info">
                  <h3 className="lp-product-name">{look.title}</h3>
                  <p className="lp-product-meta">{look.season} · {look.occasion}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="lp-arrivals-action">
          <Link to="/" className="lp-view-all">
            View All Looks →
          </Link>
        </div>
      </section>

      {/* Featured Collection Strip */}
      <section className="lp-featured-strip">
        {featuredLooks.map((look) => (
          <Link
            key={look.id}
            to={`/look/${look.id}`}
            className="lp-featured-card"
          >
            <img src={look.hero} alt={look.title} loading="lazy" />
            <div className="lp-featured-overlay">
              <span className="lp-featured-tag">{STYLE_LABELS[look.tag]}</span>
              <h3 className="lp-featured-name">{look.title}</h3>
            </div>
          </Link>
        ))}
      </section>

      {/* Testimonials */}
      <section className="lp-testimonials">
        <p className="lp-section-label">Feedback</p>
        <h2 className="lp-section-title">
          This Is What Our Customers Say
        </h2>

        <div className="lp-testimonial-carousel">
          <button
            type="button"
            className="lp-carousel-btn prev"
            onClick={() =>
              setTestimonialIdx(
                (testimonialIdx - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
              )
            }
            aria-label="Previous testimonial"
          >
            ‹
          </button>

          <div className="lp-testimonial-card">
            <StarRating count={TESTIMONIALS[testimonialIdx].rating} />
            <blockquote className="lp-testimonial-text">
              "{TESTIMONIALS[testimonialIdx].text}"
            </blockquote>
            <div className="lp-testimonial-author">
              <div className="lp-testimonial-avatar">
                {TESTIMONIALS[testimonialIdx].name[0]}
              </div>
              <div>
                <p className="lp-testimonial-name">
                  {TESTIMONIALS[testimonialIdx].name}
                </p>
                <p className="lp-testimonial-role">
                  {TESTIMONIALS[testimonialIdx].role}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="lp-carousel-btn next"
            onClick={() =>
              setTestimonialIdx((testimonialIdx + 1) % TESTIMONIALS.length)
            }
            aria-label="Next testimonial"
          >
            ›
          </button>
        </div>

        <div className="lp-carousel-dots">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              type="button"
              className={
                i === testimonialIdx
                  ? 'lp-carousel-dot active'
                  : 'lp-carousel-dot'
              }
              onClick={() => setTestimonialIdx(i)}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="lp-newsletter">
        <h2 className="lp-newsletter-title">Subscribe To Our Newsletter</h2>
        <p className="lp-newsletter-sub">
          Get the latest style updates, seasonal picks, and exclusive content
          delivered straight to your inbox.
        </p>
        <form
          className="lp-newsletter-form"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="michael@example.com"
            className="lp-newsletter-input"
            aria-label="Email address"
          />
          <button type="submit" className="lp-newsletter-btn">
            Subscribe
          </button>
        </form>
      </section>

      {/* Instagram / Social */}
      <section className="lp-social">
        <p className="lp-section-label">@fasco</p>
        <h2 className="lp-section-title">Follow Us On Instagram</h2>
        <div className="lp-social-grid">
          {looks.slice(0, 6).map((look) => (
            <Link
              key={look.id}
              to={`/look/${look.id}`}
              className="lp-social-card"
            >
              <img src={look.hero} alt={look.title} loading="lazy" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
