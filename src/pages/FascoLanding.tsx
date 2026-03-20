import { useState } from 'react';

const BRANDS = [
  { name: 'CHANEL', id: 'chanel' },
  { name: 'Louis Vuitton', id: 'lv' },
  { name: 'PRADA', id: 'prada' },
  { name: 'Calvin Klein', id: 'ck' },
  { name: 'DENIM', id: 'denim' },
];

const DEALS = [
  {
    id: 1,
    title: 'Spring Collection',
    subtitle: 'New season essentials',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=750&fit=crop',
    tag: '30% OFF',
  },
  {
    id: 2,
    title: 'Summer Styles',
    subtitle: 'Light & breezy looks',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=750&fit=crop',
    tag: '25% OFF',
  },
  {
    id: 3,
    title: 'Accessories Edit',
    subtitle: 'Complete your outfit',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=750&fit=crop',
    tag: '20% OFF',
  },
];

const PRODUCTS = [
  {
    id: 1,
    name: 'Leather Jacket Look',
    price: 450.0,
    oldPrice: 500.0,
    rating: 4.9,
    reviews: 120,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=520&fit=crop',
  },
  {
    id: 2,
    name: "Men's Black Graphic T-Shirt",
    price: 80.0,
    oldPrice: 100.0,
    rating: 4.7,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=400&h=520&fit=crop',
  },
  {
    id: 3,
    name: "Men's Tropical Palm Print",
    price: 68.5,
    oldPrice: 80.5,
    rating: 4.5,
    reviews: 56,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=520&fit=crop',
  },
  {
    id: 4,
    name: 'Classic Corduroy Jacket',
    price: 600.0,
    oldPrice: null,
    rating: 4.8,
    reviews: 200,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=520&fit=crop',
  },
];

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Fashion Enthusiast',
    text: 'FASCO has completely transformed my wardrobe. The quality of every piece is exceptional, and the customer service is outstanding.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
    rating: 5,
  },
  {
    id: 2,
    name: 'James Miller',
    role: 'Style Blogger',
    text: "I've been shopping here for years. The curated collections make it so easy to find exactly what I'm looking for. Highly recommended!",
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily Chen',
    role: 'Loyal Customer',
    text: 'The attention to detail in every garment is remarkable. From fabric selection to stitching, everything speaks of premium quality.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
    rating: 5,
  },
];

const NAV_LINKS = ['Home', 'Shop', 'Deals', 'New Arrivals'];

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="fasco-stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < Math.floor(rating) ? 'star filled' : 'star'}>
          ★
        </span>
      ))}
    </span>
  );
}

export function FascoLanding() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="fasco-page">
      {/* Header */}
      <header className="fasco-header">
        <div className="fasco-header-inner">
          <a href="#" className="fasco-logo">FASCO</a>
          <button
            className="fasco-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={mobileMenuOpen ? 'hamburger open' : 'hamburger'}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
          <nav className={`fasco-nav ${mobileMenuOpen ? 'open' : ''}`}>
            {NAV_LINKS.map((link) => (
              <a key={link} href={`#${link.toLowerCase().replace(' ', '-')}`} className="fasco-nav-link">
                {link}
              </a>
            ))}
          </nav>
          <div className="fasco-header-actions">
            <button className="fasco-icon-btn" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
            </button>
            <button className="fasco-icon-btn" aria-label="Account">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
            <button className="fasco-icon-btn cart-btn" aria-label="Cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span className="cart-badge">2</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="fasco-hero" id="home">
        <div className="fasco-hero-inner">
          <div className="fasco-hero-content">
            <p className="fasco-hero-eyebrow">NEW SEASON ARRIVALS</p>
            <h1 className="fasco-hero-title">
              <span className="hero-line-1">ULTIMATE</span>
              <span className="hero-line-2"><em>SALE</em></span>
            </h1>
            <p className="fasco-hero-subtitle">New Collection</p>
            <a href="#shop" className="fasco-hero-btn">
              SHOP NOW
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
          <div className="fasco-hero-image">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&h=900&fit=crop"
              alt="Fashion model in stylish outfit"
              loading="eager"
            />
            <div className="hero-image-accent"></div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="fasco-brands">
        <div className="fasco-brands-inner">
          {BRANDS.map((brand) => (
            <div key={brand.id} className="fasco-brand-item">
              <span className="brand-name">{brand.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Deals of the Month */}
      <section className="fasco-deals" id="deals">
        <div className="fasco-section-inner">
          <div className="fasco-section-header">
            <h2 className="fasco-section-title">Deals Of The Month</h2>
            <p className="fasco-section-subtitle">Don't miss out on these exclusive offers</p>
          </div>
          <div className="fasco-deals-grid">
            {DEALS.map((deal) => (
              <div key={deal.id} className="fasco-deal-card">
                <div className="deal-image-wrap">
                  <img src={deal.image} alt={deal.title} loading="lazy" />
                  <span className="deal-tag">{deal.tag}</span>
                </div>
                <div className="deal-info">
                  <h3 className="deal-title">{deal.title}</h3>
                  <p className="deal-subtitle">{deal.subtitle}</p>
                  <a href="#" className="deal-link">
                    Shop Now →
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="fasco-countdown">
            <p className="countdown-label">Hurry, Before It's Too Late!</p>
            <div className="countdown-boxes">
              {[
                { value: '02', label: 'Days' },
                { value: '12', label: 'Hours' },
                { value: '45', label: 'Minutes' },
                { value: '30', label: 'Seconds' },
              ].map((item) => (
                <div key={item.label} className="countdown-box">
                  <span className="countdown-value">{item.value}</span>
                  <span className="countdown-unit">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals / Products */}
      <section className="fasco-products" id="new-arrivals">
        <div className="fasco-section-inner">
          <div className="fasco-section-header">
            <h2 className="fasco-section-title">New Arrivals</h2>
            <p className="fasco-section-subtitle">Our most rated products for this season</p>
          </div>
          <div className="fasco-products-grid">
            {PRODUCTS.map((product) => (
              <div key={product.id} className="fasco-product-card">
                <div className="product-image-wrap">
                  <img src={product.image} alt={product.name} loading="lazy" />
                  <div className="product-overlay">
                    <button className="product-action-btn" aria-label="Quick view">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                    <button className="product-action-btn" aria-label="Add to wishlist">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                    <button className="product-action-btn" aria-label="Add to cart">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-rating">
                    <StarRating rating={product.rating} />
                    <span className="rating-count">({product.reviews})</span>
                  </div>
                  <div className="product-pricing">
                    <span className="product-price">${product.price.toFixed(2)}</span>
                    {product.oldPrice && (
                      <span className="product-old-price">${product.oldPrice.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="fasco-view-all">
            <a href="#" className="fasco-outline-btn">View All Products</a>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="fasco-testimonials" id="shop">
        <div className="fasco-section-inner">
          <div className="fasco-section-header">
            <h2 className="fasco-section-title">This Is What Our Customers Say</h2>
            <p className="fasco-section-subtitle">Real experiences from real people</p>
          </div>
          <div className="fasco-testimonials-carousel">
            <div className="testimonial-card active">
              <div className="testimonial-stars">
                <StarRating rating={TESTIMONIALS[activeTestimonial].rating} />
              </div>
              <blockquote className="testimonial-text">
                "{TESTIMONIALS[activeTestimonial].text}"
              </blockquote>
              <div className="testimonial-author">
                <img
                  src={TESTIMONIALS[activeTestimonial].avatar}
                  alt={TESTIMONIALS[activeTestimonial].name}
                  className="testimonial-avatar"
                />
                <div>
                  <p className="testimonial-name">{TESTIMONIALS[activeTestimonial].name}</p>
                  <p className="testimonial-role">{TESTIMONIALS[activeTestimonial].role}</p>
                </div>
              </div>
            </div>
            <div className="testimonial-dots">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  className={`dot ${i === activeTestimonial ? 'active' : ''}`}
                  onClick={() => setActiveTestimonial(i)}
                  aria-label={`View testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="fasco-newsletter">
        <div className="fasco-newsletter-inner">
          <div className="newsletter-content">
            <h2 className="newsletter-title">Subscribe To Our Newsletter</h2>
            <p className="newsletter-subtitle">
              Get the latest updates on new arrivals, exclusive deals and more.
            </p>
          </div>
          {subscribed ? (
            <div className="newsletter-success">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>Thank you for subscribing!</span>
            </div>
          ) : (
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-btn">Subscribe</button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="fasco-footer">
        <div className="fasco-footer-inner">
          <div className="footer-grid">
            <div className="footer-col footer-brand">
              <a href="#" className="fasco-footer-logo">FASCO</a>
              <p className="footer-desc">
                Discover the latest trends in fashion and find your perfect style with our curated collections.
              </p>
              <div className="footer-socials">
                <a href="#" aria-label="Twitter" className="social-link">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="#" aria-label="Instagram" className="social-link">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a href="#" aria-label="Facebook" className="social-link">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="footer-col">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li><a href="#">Home</a></li>
                <li><a href="#">Shop</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4 className="footer-heading">Support</h4>
              <ul className="footer-links">
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Shipping</a></li>
                <li><a href="#">Returns</a></li>
                <li><a href="#">Size Guide</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4 className="footer-heading">Contact</h4>
              <ul className="footer-links">
                <li>hello@fasco.com</li>
                <li>+1 (555) 123-4567</li>
                <li>New York, NY</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 FASCO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
