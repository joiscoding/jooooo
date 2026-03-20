import { useEffect, useMemo, useState, type FormEvent } from 'react';

type ProductCategory =
  | 'mens-fashion'
  | 'womens-fashion'
  | 'womens-accessories'
  | 'mens-accessories'
  | 'discount-deals';

type ProductFilter = ProductCategory | 'all';

type Product = {
  id: number;
  name: string;
  creator: string;
  category: ProductCategory;
  image: string;
  price: number;
  previousPrice: number;
  rating: number;
};

const heroImages = [
  '/fasco/images/img-1.png',
  '/fasco/images/img-2.png',
  '/fasco/images/img-4.png',
  '/fasco/images/img-3.png',
];

const brandLogos = [
  '/fasco/logos/logo-1.png',
  '/fasco/logos/logo-2.png',
  '/fasco/logos/logo-3.png',
  '/fasco/logos/logo-4.png',
];

const arrivalsFilters: { label: string; value: ProductFilter }[] = [
  { label: 'Shop all', value: 'all' },
  { label: "Men's fashion", value: 'mens-fashion' },
  { label: "Women's fashion", value: 'womens-fashion' },
  { label: "Women's accessories", value: 'womens-accessories' },
  { label: 'Men accessories', value: 'mens-accessories' },
  { label: 'Discount deals', value: 'discount-deals' },
];

const products: Product[] = [
  {
    id: 1,
    name: 'Shiny Dress',
    creator: 'Alia Moss',
    category: 'womens-fashion',
    image: '/fasco/images/product-1.png',
    price: 95,
    previousPrice: 120,
    rating: 5,
  },
  {
    id: 2,
    name: 'Long Dress',
    creator: 'William',
    category: 'discount-deals',
    image: '/fasco/images/product-2.png',
    price: 80,
    previousPrice: 99,
    rating: 4,
  },
  {
    id: 3,
    name: 'Long Dress',
    creator: 'Olive',
    category: 'womens-fashion',
    image: '/fasco/images/product-3.png',
    price: 99,
    previousPrice: 124,
    rating: 5,
  },
  {
    id: 4,
    name: 'Full Sweater',
    creator: 'Uriel',
    category: 'mens-fashion',
    image: '/fasco/images/product-4.png',
    price: 70.5,
    previousPrice: 92,
    rating: 4,
  },
  {
    id: 5,
    name: 'Colorful Dress',
    creator: 'Alberto',
    category: 'womens-accessories',
    image: '/fasco/images/product-5.png',
    price: 99,
    previousPrice: 118,
    rating: 5,
  },
  {
    id: 6,
    name: 'White Shirt',
    creator: 'Enzo',
    category: 'mens-accessories',
    image: '/fasco/images/product-6.png',
    price: 99,
    previousPrice: 110,
    rating: 4,
  },
  {
    id: 7,
    name: 'Shiny Dress',
    creator: 'Talia',
    category: 'discount-deals',
    image: '/fasco/images/product-1.png',
    price: 95,
    previousPrice: 140,
    rating: 5,
  },
  {
    id: 8,
    name: 'Long Dress',
    creator: 'Fred',
    category: 'womens-fashion',
    image: '/fasco/images/product-2.png',
    price: 80,
    previousPrice: 102,
    rating: 4,
  },
  {
    id: 9,
    name: 'Long Dress',
    creator: 'Adrien',
    category: 'womens-accessories',
    image: '/fasco/images/product-3.png',
    price: 99,
    previousPrice: 126,
    rating: 4,
  },
  {
    id: 10,
    name: 'Full Sweater',
    creator: 'Rania',
    category: 'mens-fashion',
    image: '/fasco/images/product-4.png',
    price: 70.5,
    previousPrice: 90,
    rating: 4,
  },
  {
    id: 11,
    name: 'Colorful Dress',
    creator: 'Willy',
    category: 'womens-accessories',
    image: '/fasco/images/product-5.png',
    price: 99,
    previousPrice: 135,
    rating: 5,
  },
  {
    id: 12,
    name: 'White Shirt',
    creator: 'Davilla',
    category: 'mens-accessories',
    image: '/fasco/images/product-6.png',
    price: 99,
    previousPrice: 115,
    rating: 4,
  },
];

const spotlightSlides = [
  '/fasco/images/slide-2.png',
  '/fasco/images/slide-3.png',
  '/fasco/images/slide-2.png',
  '/fasco/images/slide-3.png',
];

const serviceHighlights = [
  {
    title: 'High quality',
    text: 'Crafted from premium materials for everyday wear.',
    symbol: '♥',
  },
  {
    title: 'Warranty protection',
    text: 'Two years of coverage on selected essentials.',
    symbol: '◆',
  },
  {
    title: 'Free shipping',
    text: 'Orders over $150 ship free worldwide.',
    symbol: '⬢',
  },
  {
    title: '24 / 7 support',
    text: 'Dedicated service whenever you need styling help.',
    symbol: '☎',
  },
];

const instagramImages = [
  '/fasco/images/ig-2.png',
  '/fasco/images/ig-3.png',
  '/fasco/images/ig-4.png',
  '/fasco/images/ig-5.png',
  '/fasco/images/ig-6.png',
  '/fasco/images/ig-2.png',
  '/fasco/images/ig-3.png',
];

const testimonials = [
  {
    quote:
      'The tailoring feels incredibly polished, and the sale edit made it easy to build a full look in one go.',
    name: 'Camille Ford',
    role: 'Frequent shopper',
    image: '/fasco/images/customers-1.png',
  },
  {
    quote:
      'Beautiful fabric, fast delivery, and a landing page that feels just like a premium boutique experience.',
    name: 'Mason Reed',
    role: 'Returning customer',
    image: '/fasco/images/customers-2.png',
  },
];

const countdownTarget = new Date('2026-12-31T23:59:59Z').getTime();

function formatTimePart(value: number) {
  return value.toString().padStart(2, '0');
}

function getTimeRemaining() {
  const distance = Math.max(countdownTarget - Date.now(), 0);
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  return {
    days: formatTimePart(days),
    hours: formatTimePart(hours),
    minutes: formatTimePart(minutes),
    seconds: formatTimePart(seconds),
  };
}

function renderStars(count: number) {
  return Array.from({ length: 5 }, (_, index) => (
    <span
      key={index}
      className={index < count ? 'rating-star active' : 'rating-star'}
      aria-hidden="true"
    >
      ★
    </span>
  ));
}

export function LandingPage() {
  const [selectedFilter, setSelectedFilter] =
    useState<ProductFilter>('all');
  const [visibleCount, setVisibleCount] = useState(6);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeRemaining(getTimeRemaining());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((previous) => (previous + 1) % spotlightSlides.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    setVisibleCount(6);
  }, [selectedFilter]);

  const filteredProducts = useMemo(() => {
    if (selectedFilter === 'all') {
      return products;
    }

    return products.filter((product) => product.category === selectedFilter);
  }, [selectedFilter]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const canShowMore = visibleCount < filteredProducts.length;

  function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newsletterEmail.trim()) {
      return;
    }

    setIsSubscribed(true);
    setNewsletterEmail('');
  }

  return (
    <div className="landing-page">
      <section className="hero-section section-shell" id="top">
        <div className="hero-grid" aria-label="Featured sale collage">
          <figure className="hero-card hero-card-tall">
            <img
              src={heroImages[0]}
              alt="Model wearing a dark seasonal outfit"
              className="hero-image"
            />
          </figure>
          <figure className="hero-card hero-card-small">
            <img
              src={heroImages[1]}
              alt="Neutral fashion details from the collection"
              className="hero-image"
            />
          </figure>
          <div className="hero-copy-card">
            <p className="hero-kicker">Styles for every season</p>
            <p className="hero-ultimate">Ultimate</p>
            <h1 className="hero-title">Sale</h1>
            <p className="hero-subtitle">New collection</p>
            <p className="hero-description">
              Discover standout tailoring, quiet luxury essentials, and modern
              silhouettes inspired by the FASCO fashion storefront.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#new-arrivals">
                Shop now
              </a>
              <a className="button button-secondary" href="#deals">
                Explore deals
              </a>
            </div>
          </div>
          <figure className="hero-card hero-card-medium">
            <img
              src={heroImages[2]}
              alt="Editorial portrait from the new arrivals collection"
              className="hero-image"
            />
          </figure>
          <figure className="hero-card hero-card-tall hero-card-right">
            <img
              src={heroImages[3]}
              alt="Model in a bright fashion pose from the campaign"
              className="hero-image hero-image-contain"
            />
          </figure>
        </div>

        <div className="brand-strip" aria-label="Partner brands">
          {brandLogos.map((logo, index) => (
            <img
              key={logo}
              src={logo}
              alt={`Partner brand ${index + 1}`}
              className="brand-logo"
            />
          ))}
        </div>
      </section>

      <section className="section-shell deals-section" id="deals">
        <div className="deals-countdown">
          <p className="section-label">Deals of the month</p>
          <h2 className="section-title">Limited-time wardrobe refresh</h2>
          <p className="section-text">
            Secure your favorite pieces before the edit closes. The featured
            collection spotlights elevated staples with markdowns across ready
            to wear and accessories.
          </p>
          <div className="countdown-grid" aria-label="Countdown to offer end">
            <div className="countdown-item">
              <span className="countdown-value">{timeRemaining.days}</span>
              <span className="countdown-label">Days</span>
            </div>
            <div className="countdown-item">
              <span className="countdown-value">{timeRemaining.hours}</span>
              <span className="countdown-label">Hours</span>
            </div>
            <div className="countdown-item">
              <span className="countdown-value">{timeRemaining.minutes}</span>
              <span className="countdown-label">Mins</span>
            </div>
            <div className="countdown-item">
              <span className="countdown-value">{timeRemaining.seconds}</span>
              <span className="countdown-label">Secs</span>
            </div>
          </div>
          <a className="button button-primary" href="#new-arrivals">
            View all offers
          </a>
        </div>

        <div className="spotlight-panel">
          <div className="spotlight-slider">
            {spotlightSlides.map((slide, index) => (
              <img
                key={slide + index}
                src={slide}
                alt={`Spotlight slide ${index + 1}`}
                className={index === currentSlide ? 'spotlight-image active' : 'spotlight-image'}
              />
            ))}
          </div>
          <div className="spotlight-controls" aria-label="Spotlight controls">
            {spotlightSlides.map((_, index) => (
              <button
                key={index}
                type="button"
                className={
                  index === currentSlide
                    ? 'spotlight-dot active'
                    : 'spotlight-dot'
                }
                aria-label={`Show spotlight slide ${index + 1}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell arrivals-section" id="new-arrivals">
        <div className="section-heading">
          <p className="section-label">New arrivals</p>
          <h2 className="section-title">Curated looks straight from the drop</h2>
          <p className="section-text arrivals-copy">
            Browse the same polished merchandising rhythm as the FASCO landing
            page with category filters, editorial cards, and product-first
            storytelling.
          </p>
        </div>

        <div className="filter-row" role="tablist" aria-label="Product filters">
          {arrivalsFilters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              aria-pressed={filter.value === selectedFilter}
              className={
                filter.value === selectedFilter
                  ? 'filter-button active'
                  : 'filter-button'
              }
              onClick={() => setSelectedFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="products-grid">
          {visibleProducts.map((product) => (
            <article key={product.id} className="product-card">
              <div className="product-image-wrap">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <span className="product-badge">
                  Save {Math.round(((product.previousPrice - product.price) / product.previousPrice) * 100)}
                  %
                </span>
              </div>
              <div className="product-meta">
                <div className="rating-row">{renderStars(product.rating)}</div>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-creator">by {product.creator}</p>
                <div className="price-row">
                  <span className="price-current">${product.price.toFixed(2)}</span>
                  <span className="price-previous">
                    ${product.previousPrice.toFixed(2)}
                  </span>
                </div>
                <a href="#collection" className="product-link">
                  Quick view
                </a>
              </div>
            </article>
          ))}
        </div>

        {canShowMore ? (
          <div className="arrivals-action">
            <button
              type="button"
              className="button button-primary"
              onClick={() => setVisibleCount((current) => current + 3)}
            >
              View more
            </button>
          </div>
        ) : null}
      </section>

      <section className="section-shell collection-section" id="collection">
        <div className="collection-visual">
          <img
            src="/fasco/images/bg-img.png"
            alt="Campaign image for the featured collection"
            className="collection-image"
          />
        </div>
        <div className="collection-copy">
          <p className="section-label">Women collection</p>
          <h2 className="section-title">Peaky Blinders</h2>
          <a href="#top" className="collection-link">
            Description
          </a>
          <p className="section-text">
            Sharp silhouettes, dramatic tailoring, and rich texture come
            together in a collection designed for statement dressing with an
            editorial point of view.
          </p>
          <div className="size-row" aria-label="Available size">
            <span className="size-label">Size:</span>
            <span className="size-chip">M</span>
          </div>
          <p className="collection-price">$100.00</p>
          <a className="button button-primary" href="#newsletter">
            Buy now
          </a>
        </div>
      </section>

      <section className="section-shell services-section" aria-label="Store benefits">
        <div className="services-grid">
          {serviceHighlights.map((highlight) => (
            <article key={highlight.title} className="service-card">
              <span className="service-icon" aria-hidden="true">
                {highlight.symbol}
              </span>
              <div>
                <h3 className="service-title">{highlight.title}</h3>
                <p className="service-text">{highlight.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell social-section" id="social">
        <div className="section-heading">
          <p className="section-label">Follow us on Instagram</p>
          <h2 className="section-title">Daily outfit inspiration</h2>
          <p className="section-text arrivals-copy">
            A clean editorial feed keeps the brand expression consistent across
            campaigns, product drops, and styling stories.
          </p>
        </div>
        <div className="instagram-grid">
          {instagramImages.map((image, index) => (
            <img
              key={image + index}
              src={image}
              alt={`Instagram preview ${index + 1}`}
              className="instagram-image"
            />
          ))}
        </div>
      </section>

      <section className="section-shell testimonials-section" id="testimonials">
        <div className="section-heading testimonials-head">
          <p className="section-label">Testimonials</p>
          <h2 className="section-title">This is what our customers say</h2>
          <p className="section-text arrivals-copy">
            The page keeps the premium fashion tone while remaining conversion
            focused, and these reviews reinforce that credibility.
          </p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} className="testimonial-card">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="testimonial-image"
              />
              <div className="testimonial-copy">
                <div className="rating-row">{renderStars(5)}</div>
                <p className="testimonial-quote">“{testimonial.quote}”</p>
                <p className="testimonial-name">{testimonial.name}</p>
                <p className="testimonial-role">{testimonial.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell newsletter-section" id="newsletter">
        <div className="newsletter-card">
          <p className="section-label">Newsletter</p>
          <h2 className="section-title">Stay in the loop</h2>
          <p className="section-text newsletter-copy">
            Be first to hear about fresh arrivals, private sales, and styling
            notes from the FASCO team.
          </p>
          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <input
              type="email"
              placeholder="Enter your email address"
              aria-label="Email address"
              className="newsletter-input"
              value={newsletterEmail}
              onChange={(event) => {
                setNewsletterEmail(event.target.value);
                if (isSubscribed) {
                  setIsSubscribed(false);
                }
              }}
            />
            <button type="submit" className="button button-primary">
              Subscribe
            </button>
          </form>
          {isSubscribed ? (
            <p className="newsletter-note" role="status">
              Thanks for subscribing. Your next private drop update is on the
              way.
            </p>
          ) : null}
        </div>
      </section>
    </div>
  );
}
