import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLooks } from '../data/fetchLooks';
import type { Look, StyleTag } from '../types';
import { STYLE_LABELS, STYLE_ORDER } from '../types';

const CATEGORY_IMAGES: Record<StyleTag, string> = {
  training: '/looks/1517836357463-d25dfeac3438-w1000h1300.jpg',
  recovery: '/looks/1630877268428-616cc533239a-w1200h1500.jpg',
  performance: '/looks/1762575910569-46971cd69df3-w1000h1250.jpg',
  lifestyle: '/looks/1600117025146-5092075da653-w1200h1500.jpg',
  competition: '/looks/1549153166-54374660cb65-w1200h1500.jpg',
};

export function LandingPage() {
  const [looks, setLooks] = useState<Look[]>([]);
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

  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<StyleTag, number>> = {};
    for (const look of looks) {
      counts[look.tag] = (counts[look.tag] ?? 0) + 1;
    }
    return counts;
  }, [looks]);

  const featured = useMemo(() => looks.slice(0, 6), [looks]);

  return (
    <div className="landing">
      {/* Hero */}
      <section className="landing-hero">
        <div className="hero-bg">
          <img
            src="/looks/1476480862126-209bfaa8edc8-w1200h1600.jpg"
            alt=""
            loading="eager"
          />
          <div className="hero-gradient" />
        </div>
        <div className="hero-content">
          <p className="hero-eyebrow">ABC Fitness Lookbook</p>
          <h1 className="hero-title">
            Train in<br />
            <span className="accent">Style.</span>
          </h1>
          <p className="hero-sub">
            Performance-driven looks curated for every stage of your fitness
            journey. From the gym floor to the street.
          </p>
          <div className="hero-actions">
            <Link to="/gallery" className="btn-hero primary">
              Browse Lookbook
            </Link>
            <Link to="/albums" className="btn-hero outline">
              My Collections
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">{looks.length || '14'}+</div>
              <div className="stat-label">Curated Looks</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5</div>
              <div className="stat-label">Categories</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">2026</div>
              <div className="stat-label">Season</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="section-header">
          <p className="section-eyebrow">Categories</p>
          <h2 className="section-title">Find Your Fit</h2>
          <p className="section-sub">
            From high-intensity training to recovery days, we have looks for
            every moment.
          </p>
        </div>
        <div className="categories-grid">
          {STYLE_ORDER.map((tag) => (
            <Link
              key={tag}
              to={`/gallery?filter=${tag}`}
              className="category-card"
            >
              <img
                src={CATEGORY_IMAGES[tag]}
                alt={STYLE_LABELS[tag]}
                loading="lazy"
              />
              <div className="category-overlay">
                <h3 className="category-name">{STYLE_LABELS[tag]}</h3>
                <p className="category-count">
                  {categoryCounts[tag] ?? 0} looks
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Lookbook */}
      <section className="lookbook-section">
        <div className="section-header">
          <p className="section-eyebrow">Featured</p>
          <h2 className="section-title">Latest Looks</h2>
          <p className="section-sub">
            Our top picks for this season. Performance meets aesthetics.
          </p>
        </div>
        {loading ? (
          <div className="page-loading">
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>
              Loading lookbook…
            </p>
          </div>
        ) : (
          <div className="lookbook-grid featured">
            {featured.map((look, i) => (
              <Link
                key={look.id}
                to={`/look/${look.id}`}
                className="look-card"
              >
                <img
                  src={look.hero}
                  alt=""
                  className="look-card-img"
                  loading={i < 2 ? 'eager' : 'lazy'}
                />
                <div className="look-card-overlay">
                  <span className="look-card-tag">
                    {STYLE_LABELS[look.tag]}
                  </span>
                  <h3 className="look-card-title">{look.title}</h3>
                  <p className="look-card-occasion">{look.occasion}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <Link to="/gallery" className="btn-hero primary">
            View All Looks
          </Link>
        </div>
      </section>

      {/* Brand Values */}
      <section className="brand-strip">
        <div className="section-header">
          <p className="section-eyebrow">Why ABC Fitness</p>
          <h2 className="section-title">Built for Athletes</h2>
        </div>
        <div className="brand-values">
          <div className="value-card">
            <div className="value-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)' }}>
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <h3 className="value-title">Performance First</h3>
            <p className="value-desc">
              Every piece is engineered with cutting-edge fabrics and
              construction for maximum athletic performance.
            </p>
          </div>
          <div className="value-card">
            <div className="value-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)' }}>
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <h3 className="value-title">All-Day Comfort</h3>
            <p className="value-desc">
              Transition seamlessly from training to life. Designed for
              comfort that lasts from dawn to dusk.
            </p>
          </div>
          <div className="value-card">
            <div className="value-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)' }}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3 className="value-title">Built to Last</h3>
            <p className="value-desc">
              Quality materials and thoughtful construction mean gear that
              holds up through every rep, every run, every day.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2 className="cta-title">Ready to Elevate Your Game?</h2>
          <p className="cta-sub">
            Explore our full collection and build your personalized fitness
            lookbook.
          </p>
          <Link to="/gallery" className="btn-hero primary">
            Start Browsing
          </Link>
        </div>
      </section>
    </div>
  );
}
