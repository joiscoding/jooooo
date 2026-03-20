import { Link } from 'react-router-dom';

const heroImg =
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80';
const promoImg =
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80';
const catWomen =
  'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80';
const catMen =
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80';
const catKids =
  'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=800&q=80';

const products = [
  {
    name: 'Floral Textured Shirt',
    price: 49.0,
    img: 'https://images.unsplash.com/photo-1596755094514-f87a3407b321?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Basic Slim Fit T-Shirt',
    price: 29.0,
    img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Cotton Off-White Shirt',
    price: 39.0,
    img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Oversized T-Shirt For Men',
    price: 59.0,
    img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80',
  },
];

const testimonials = [
  {
    quote:
      'The quality and fit exceeded my expectations. Shipping was fast and packaging felt premium.',
    name: 'Sarah M.',
    role: 'Verified buyer',
  },
  {
    quote:
      'Finally a store where the photos match what arrives. The editorial lookbook is a nice touch.',
    name: 'James L.',
    role: 'Member since 2023',
  },
];

export function LandingPage() {
  return (
    <div className="fasco">
      <a href="#main" className="fasco-skip">
        Skip to content
      </a>

      <header className="fasco-topbar">
        <div className="fasco-topbar-inner">
          <span className="fasco-announce">
            Sign up and get 20% off your first order{' '}
            <a href="#newsletter" className="fasco-announce-link">
              Sign up now
            </a>
          </span>
        </div>
      </header>

      <header className="fasco-header">
        <div className="fasco-header-inner">
          <nav className="fasco-nav fasco-nav-left" aria-label="Primary">
            <Link to="/lookbook" className="fasco-nav-link">
              Shop
            </Link>
            <a href="#collections" className="fasco-nav-link">
              Collections
            </a>
            <a href="#stories" className="fasco-nav-link">
              Stories
            </a>
          </nav>
          <Link to="/" className="fasco-logo" aria-label="FASCO home">
            FASCO
          </Link>
          <div className="fasco-header-right">
            <button type="button" className="fasco-icon-btn" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.35-4.35"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <button type="button" className="fasco-icon-btn" aria-label="Account">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M20 21a8 8 0 1 0-16 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
            <button type="button" className="fasco-icon-btn" aria-label="Wishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M12 21s-7-4.35-7-10a5 5 0 0 1 9.9-1A5 5 0 0 1 19 11c0 5.65-7 10-7 10Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button type="button" className="fasco-icon-btn" aria-label="Cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M6 6h15l-1.5 9h-12L6 6Zm0 0L5 3H2M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm8 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main id="main">
        <section className="fasco-hero" aria-labelledby="hero-heading">
          <div className="fasco-hero-grid">
            <div className="fasco-hero-copy">
              <p className="fasco-eyebrow">New collection</p>
              <h1 id="hero-heading" className="fasco-hero-title">
                Meet fashion in <span className="fasco-hero-accent">our</span> best aspects
              </h1>
              <p className="fasco-hero-lede">
                Refined silhouettes, honest materials, and pieces you will reach for every season.
              </p>
              <div className="fasco-hero-cta">
                <Link to="/lookbook" className="fasco-btn fasco-btn-dark">
                  Shop now
                </Link>
                <a href="#collections" className="fasco-btn fasco-btn-ghost">
                  View lookbook
                </a>
              </div>
            </div>
            <div className="fasco-hero-visual">
              <img src={heroImg} alt="" className="fasco-hero-img" width={800} height={1000} />
            </div>
          </div>
        </section>

        <section className="fasco-brands" aria-label="Featured brands">
          <div className="fasco-brands-inner">
            {['Prada', 'Burberry', 'Gucci', 'Dior', 'Fendi'].map((name) => (
              <span key={name} className="fasco-brand-name">
                {name}
              </span>
            ))}
          </div>
        </section>

        <section id="collections" className="fasco-collections">
          <div className="fasco-section-head">
            <h2 className="fasco-section-title">Explore new arrivals</h2>
            <p className="fasco-section-sub">Shop the latest drops across every category.</p>
          </div>
          <div className="fasco-cat-grid">
            <a href="#products" className="fasco-cat-card">
              <img src={catWomen} alt="" className="fasco-cat-img" width={400} height={520} />
              <span className="fasco-cat-label">Women</span>
            </a>
            <a href="#products" className="fasco-cat-card">
              <img src={catMen} alt="" className="fasco-cat-img" width={400} height={520} />
              <span className="fasco-cat-label">Men</span>
            </a>
            <a href="#products" className="fasco-cat-card">
              <img src={catKids} alt="" className="fasco-cat-img" width={400} height={520} />
              <span className="fasco-cat-label">Kids</span>
            </a>
          </div>
        </section>

        <section className="fasco-promo">
          <div className="fasco-promo-grid">
            <div className="fasco-promo-visual">
              <img src={promoImg} alt="" className="fasco-promo-img" width={700} height={880} />
            </div>
            <div className="fasco-promo-copy">
              <p className="fasco-eyebrow">Limited offer</p>
              <h2 className="fasco-promo-title">35% off only this friday and get special gift</h2>
              <div className="fasco-countdown" role="timer" aria-live="polite">
                <div className="fasco-count-block">
                  <span className="fasco-count-val">06</span>
                  <span className="fasco-count-lbl">Days</span>
                </div>
                <div className="fasco-count-block">
                  <span className="fasco-count-val">18</span>
                  <span className="fasco-count-lbl">Hours</span>
                </div>
                <div className="fasco-count-block">
                  <span className="fasco-count-val">48</span>
                  <span className="fasco-count-lbl">Mins</span>
                </div>
              </div>
              <Link to="/lookbook" className="fasco-btn fasco-btn-dark">
                Grab the offer
              </Link>
            </div>
          </div>
        </section>

        <section id="products" className="fasco-products">
          <div className="fasco-section-head fasco-section-head-row">
            <h2 className="fasco-section-title">Featured products</h2>
            <a href="#products" className="fasco-text-link">
              View all
            </a>
          </div>
          <div className="fasco-product-grid">
            {products.map((p) => (
              <article key={p.name} className="fasco-product-card">
                <div className="fasco-product-img-wrap">
                  <img src={p.img} alt="" className="fasco-product-img" width={480} height={600} />
                </div>
                <h3 className="fasco-product-name">{p.name}</h3>
                <p className="fasco-product-price">${p.price.toFixed(2)}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="stories" className="fasco-testimonials">
          <div className="fasco-section-head">
            <h2 className="fasco-section-title">What our clients say</h2>
            <p className="fasco-section-sub">Real feedback from people who shop with us.</p>
          </div>
          <div className="fasco-quote-grid">
            {testimonials.map((t) => (
              <blockquote key={t.name} className="fasco-quote">
                <p className="fasco-quote-text">&ldquo;{t.quote}&rdquo;</p>
                <footer className="fasco-quote-meta">
                  <cite className="fasco-quote-name">{t.name}</cite>
                  <span className="fasco-quote-role">{t.role}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section id="newsletter" className="fasco-newsletter">
          <div className="fasco-newsletter-inner">
            <h2 className="fasco-newsletter-title">Subscribe to our newsletter</h2>
            <p className="fasco-newsletter-sub">
              Get 20% off your first order and weekly style notes. No spam.
            </p>
            <form
              className="fasco-news-form"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <label htmlFor="fasco-email" className="visually-hidden">
                Email address
              </label>
              <input
                id="fasco-email"
                type="email"
                className="fasco-news-input"
                placeholder="Your email address"
                autoComplete="email"
                required
              />
              <button type="submit" className="fasco-btn fasco-btn-dark">
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="fasco-footer">
        <div className="fasco-footer-grid">
          <div className="fasco-footer-brand">
            <span className="fasco-logo fasco-logo-footer">FASCO</span>
            <p className="fasco-footer-tagline">
              Fashion ecommerce demo — inspired by community Figma templates.
            </p>
          </div>
          <div className="fasco-footer-col">
            <h3 className="fasco-footer-heading">Support</h3>
            <ul className="fasco-footer-list">
              <li>
                <a href="#main">Help center</a>
              </li>
              <li>
                <a href="#main">Shipping</a>
              </li>
              <li>
                <a href="#main">Returns</a>
              </li>
            </ul>
          </div>
          <div className="fasco-footer-col">
            <h3 className="fasco-footer-heading">Company</h3>
            <ul className="fasco-footer-list">
              <li>
                <a href="#stories">About</a>
              </li>
              <li>
                <Link to="/lookbook">Lookbook demo</Link>
              </li>
              <li>
                <Link to="/albums">Albums</Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="fasco-footer-copy">© {new Date().getFullYear()} FASCO demo. All rights reserved.</p>
      </footer>
    </div>
  );
}
