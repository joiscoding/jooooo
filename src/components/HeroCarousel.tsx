import { useCallback, useEffect, useId, useState } from 'react';
import { Link } from 'react-router-dom';

export interface HeroSlide {
  id: string;
  image: string;
  kicker: string;
  title: string;
  copy: string;
  ctaLabel: string;
  to: string;
}

const INTERVAL_MS = 7000;

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const labelId = useId();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const go = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (paused || count < 2) return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) return;
    const id = window.setInterval(() => go(index + 1), INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, count, go, index]);

  if (count === 0) return null;

  const slide = slides[index];
  if (!slide) return null;

  return (
    <section
      className="hero-carousel"
      aria-roledescription="carousel"
      aria-labelledby={labelId}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <h2 id={labelId} className="visually-hidden">
        Featured looks
      </h2>
      <div className="hero-slide" aria-live={paused ? 'polite' : 'off'}>
        <div className="hero-copy">
          <p className="hero-kicker">{slide.kicker}</p>
          <h3 className="hero-title">{slide.title}</h3>
          <p className="hero-copy-text">{slide.copy}</p>
          <Link to={slide.to} className="btn primary">
            {slide.ctaLabel}
          </Link>
        </div>
        <div className="hero-media">
          <img src={slide.image} alt="" />
        </div>
      </div>
      <div className="hero-controls">
        <button
          type="button"
          className="hero-pause"
          aria-pressed={paused}
          aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="currentColor" d="M8 5v14l11-7z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="currentColor" d="M6 5h4v14H6zm8 0h4v14h-4z" />
            </svg>
          )}
        </button>
        <div className="hero-dots" role="tablist" aria-label="Slides">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Slide ${i + 1}: ${s.title}`}
              className={i === index ? 'hero-dot active' : 'hero-dot'}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <div className="hero-arrows">
          <button
            type="button"
            className="hero-arrow"
            aria-label="Previous slide"
            onClick={() => go(index - 1)}
          >
            ‹
          </button>
          <button
            type="button"
            className="hero-arrow"
            aria-label="Next slide"
            onClick={() => go(index + 1)}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}
