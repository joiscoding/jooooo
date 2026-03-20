import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look } from '../types';
import { STYLE_LABELS } from '../types';

const BRAND_NAMES = ['CHANEL', 'DIOR', 'PRADA', 'GUCCI', 'LOUIS VUITTON'];

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate));
  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return timeLeft;
}

function getTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    mins: Math.floor((diff / 60_000) % 60),
    secs: Math.floor((diff / 1000) % 60),
  };
}

const DEAL_END = new Date(Date.now() + 7 * 86_400_000);

const TESTIMONIALS = [
  {
    name: 'James R.',
    text: 'The curation here is unmatched. Every look feels intentional and wearable — exactly what I want from a modern wardrobe.',
    role: 'Creative Director',
  },
  {
    name: 'David K.',
    text: 'Finally, a place that treats menswear with the same editorial care as high-fashion editorials. Bookmarked permanently.',
    role: 'Photographer',
  },
  {
    name: 'Marcus T.',
    text: 'Clean, minimal, beautiful. The lookbooks have genuinely changed how I think about getting dressed each morning.',
    role: 'Architect',
  },
];

export function LandingPage() {
  const [looks, setLooks] = useState<Look[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const countdown = useCountdown(DEAL_END);

  useEffect(() => {
    fetchLooks().then((data) => {
      setLooks(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const newArrivals = looks.slice(0, 4);
  const dealLook = looks[4] || looks[0];
  const instagramLooks = looks.slice(0, 6);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  return (
    <div className="landing">
      {/* ── Hero ── */}
      <section className="landing-hero" ref={heroRef}>
        <div className="landing-hero__content">
          <p className="landing-hero__eyebrow">New Season 2026</p>
          <h1 className="landing-hero__title">
            FASCO
          </h1>
          <p className="landing-hero__subtitle">
            Elevate your wardrobe with pieces that define modern elegance.
            Discover curated collections designed for the contemporary man.
          </p>
          <div className="landing-hero__actions">
            <Link to="/gallery" className="landing-btn landing-btn--primary">
              Explore Collection
            </Link>
            <Link to="/gallery" className="landing-btn landing-btn--outline">
              View Lookbooks
            </Link>
          </div>
        </div>
        <div className="landing-hero__visual">
          {!loading && looks.length > 0 && (
            <>
              <div className="landing-hero__img-stack">
                <img
                  src={looks[0]?.hero}
                  alt=""
                  className="landing-hero__img landing-hero__img--main"
                />
                {looks[1] && (
                  <img
                    src={looks[1].hero}
                    alt=""
                    className="landing-hero__img landing-hero__img--accent"
                  />
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── Brand Strip ── */}
      <section className="landing-brands">
        <div className="landing-brands__track">
          {BRAND_NAMES.map((name) => (
            <span key={name} className="landing-brands__name">{name}</span>
          ))}
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section className="landing-section">
        <div className="landing-section__header">
          <div>
            <p className="landing-section__eyebrow">Curated For You</p>
            <h2 className="landing-section__title">New Arrivals</h2>
          </div>
          <Link to="/gallery" className="landing-link">
            View All &rarr;
          </Link>
        </div>
        {loading ? (
          <p className="muted" style={{ textAlign: 'center', padding: '3rem 0' }}>
            Loading…
          </p>
        ) : (
          <div className="landing-grid landing-grid--4">
            {newArrivals.map((look) => (
              <Link
                key={look.id}
                to={`/look/${look.id}`}
                className="landing-card"
              >
                <div className="landing-card__img-wrap">
                  <img src={look.hero} alt="" className="landing-card__img" />
                  <span className="landing-card__badge">New</span>
                </div>
                <div className="landing-card__body">
                  <span className="landing-card__tag">{STYLE_LABELS[look.tag]}</span>
                  <h3 className="landing-card__title">{look.title}</h3>
                  <p className="landing-card__season">{look.season}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Deal of the Month ── */}
      {dealLook && (
        <section className="landing-deal">
          <div className="landing-deal__visual">
            <img
              src={dealLook.hero}
              alt=""
              className="landing-deal__img"
            />
          </div>
          <div className="landing-deal__content">
            <p className="landing-section__eyebrow">Limited Time Only</p>
            <h2 className="landing-deal__title">Deal of the Month</h2>
            <p className="landing-deal__desc">
              A handpicked editorial look — explore this season's most coveted
              ensemble before it's gone. Minimal style, maximum impact.
            </p>
            <div className="landing-countdown">
              <div className="landing-countdown__unit">
                <span className="landing-countdown__num">{String(countdown.days).padStart(2, '0')}</span>
                <span className="landing-countdown__label">Days</span>
              </div>
              <div className="landing-countdown__unit">
                <span className="landing-countdown__num">{String(countdown.hours).padStart(2, '0')}</span>
                <span className="landing-countdown__label">Hours</span>
              </div>
              <div className="landing-countdown__unit">
                <span className="landing-countdown__num">{String(countdown.mins).padStart(2, '0')}</span>
                <span className="landing-countdown__label">Mins</span>
              </div>
              <div className="landing-countdown__unit">
                <span className="landing-countdown__num">{String(countdown.secs).padStart(2, '0')}</span>
                <span className="landing-countdown__label">Secs</span>
              </div>
            </div>
            <Link to={`/look/${dealLook.id}`} className="landing-btn landing-btn--primary">
              View This Look
            </Link>
          </div>
        </section>
      )}

      {/* ── Collection Highlights ── */}
      <section className="landing-section">
        <div className="landing-section__header">
          <div>
            <p className="landing-section__eyebrow">Discover</p>
            <h2 className="landing-section__title">Style Categories</h2>
          </div>
        </div>
        <div className="landing-categories">
          {(['minimal', 'streetwear', 'classic'] as const).map((tag) => {
            const catLook = looks.find((l) => l.tag === tag);
            return (
              <Link
                key={tag}
                to="/gallery"
                className="landing-category"
              >
                <div className="landing-category__img-wrap">
                  {catLook && (
                    <img
                      src={catLook.hero}
                      alt=""
                      className="landing-category__img"
                    />
                  )}
                  <div className="landing-category__overlay">
                    <h3 className="landing-category__name">{STYLE_LABELS[tag]}</h3>
                    <span className="landing-category__cta">Explore &rarr;</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="landing-testimonials">
        <div className="landing-section__header" style={{ justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <p className="landing-section__eyebrow">What People Say</p>
            <h2 className="landing-section__title">Testimonials</h2>
          </div>
        </div>
        <div className="landing-testimonials__card">
          <div className="landing-testimonials__stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="#1a1a1a">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <blockquote className="landing-testimonials__text">
            "{TESTIMONIALS[activeTestimonial].text}"
          </blockquote>
          <div className="landing-testimonials__author">
            <span className="landing-testimonials__name">
              {TESTIMONIALS[activeTestimonial].name}
            </span>
            <span className="landing-testimonials__role">
              {TESTIMONIALS[activeTestimonial].role}
            </span>
          </div>
          <div className="landing-testimonials__dots">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`landing-testimonials__dot${i === activeTestimonial ? ' active' : ''}`}
                onClick={() => setActiveTestimonial(i)}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="landing-newsletter">
        <div className="landing-newsletter__inner">
          <h2 className="landing-newsletter__title">Subscribe To Our Newsletter</h2>
          <p className="landing-newsletter__desc">
            Get early access to new collections, style guides, and exclusive editorial content.
          </p>
          {subscribed ? (
            <p className="landing-newsletter__success">Thanks for subscribing!</p>
          ) : (
            <form className="landing-newsletter__form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="landing-newsletter__input"
                required
              />
              <button type="submit" className="landing-btn landing-btn--primary">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── Instagram Grid ── */}
      <section className="landing-section">
        <div className="landing-section__header" style={{ justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <p className="landing-section__eyebrow">Follow Us</p>
            <h2 className="landing-section__title">@FASCO on Instagram</h2>
          </div>
        </div>
        <div className="landing-insta-grid">
          {instagramLooks.map((look) => (
            <Link
              key={look.id}
              to={`/look/${look.id}`}
              className="landing-insta-item"
            >
              <img src={look.hero} alt="" className="landing-insta-img" />
              <div className="landing-insta-overlay">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="white" stroke="none" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
