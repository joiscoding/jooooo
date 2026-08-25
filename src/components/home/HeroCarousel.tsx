import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '../Icons';

export type HeroSlide = {
  id: string;
  eyebrow: string;
  headline: string;
  copy: string;
  offer: string;
  ctaTo: string;
  ctaLabel: string;
  secondaryTo: string;
  secondaryLabel: string;
  image: string;
  theme: 'blue' | 'ink' | 'sand';
};

const AUTOPLAY_MS = 7000;

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      AUTOPLAY_MS
    );
    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  if (slides.length === 0) return null;

  function step(delta: number) {
    setIndex((i) => (i + delta + slides.length) % slides.length);
  }

  return (
    <section
      className="hp-hero"
      aria-roledescription="carousel"
      aria-label="Featured looks"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`hp-hero-slide hp-hero-${slide.theme}`}
          role="group"
          aria-roledescription="slide"
          aria-label={`${i + 1} of ${slides.length}: ${slide.headline}`}
          hidden={i !== index}
        >
          <div className="hp-container hp-hero-inner">
            <div className="hp-hero-copy">
              <p className="hp-hero-eyebrow">{slide.eyebrow}</p>
              <h1 className="hp-hero-headline">{slide.headline}</h1>
              <p className="hp-hero-text">{slide.copy}</p>
              <p className="hp-hero-offer">{slide.offer}</p>
              <div className="hp-hero-actions">
                <Link to={slide.ctaTo} className="hp-btn hp-btn-primary">
                  {slide.ctaLabel}
                </Link>
                <Link to={slide.secondaryTo} className="hp-btn hp-btn-quiet">
                  {slide.secondaryLabel}
                  <span aria-hidden>&nbsp;›</span>
                </Link>
              </div>
            </div>
            <div className="hp-hero-media">
              <img
                src={slide.image}
                alt=""
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        className="hp-hero-arrow hp-hero-arrow-prev"
        onClick={() => step(-1)}
      >
        <ChevronLeftIcon />
        <span className="hp-visually-hidden">Previous slide</span>
      </button>
      <button
        type="button"
        className="hp-hero-arrow hp-hero-arrow-next"
        onClick={() => step(1)}
      >
        <ChevronRightIcon />
        <span className="hp-visually-hidden">Next slide</span>
      </button>

      <div className="hp-hero-dots">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            className={i === index ? 'hp-dot active' : 'hp-dot'}
            aria-current={i === index}
            onClick={() => setIndex(i)}
          >
            <span className="hp-visually-hidden">
              Go to slide {i + 1}: {slide.headline}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
