import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '../Icons';
import { LookCard } from './LookCard';
import type { Look } from '../../types';

export function LookRail({
  id,
  eyebrow,
  title,
  seeAllTo,
  seeAllLabel,
  looks,
  savedIds,
  onSave,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  seeAllTo: string;
  seeAllLabel: string;
  looks: Look[];
  savedIds: Set<string>;
  onSave: (look: Look) => void;
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const syncEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    syncEdges();
    window.addEventListener('resize', syncEdges);
    return () => window.removeEventListener('resize', syncEdges);
  }, [syncEdges, looks]);

  function scrollByCards(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('.hp-card');
    const stride = (card?.offsetWidth ?? 264) + 20;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({
      left: direction * stride * 2,
      behavior: reduce ? 'auto' : 'smooth',
    });
  }

  return (
    <section className="hp-section hp-rail-section" id={id}>
      <div className="hp-container">
        <div className="hp-section-head">
          <div>
            {eyebrow && <p className="hp-section-eyebrow">{eyebrow}</p>}
            <h2 className="hp-section-title">{title}</h2>
          </div>
          <div className="hp-section-head-side">
            <Link to={seeAllTo} className="hp-see-all">
              {seeAllLabel}
              <span aria-hidden>&nbsp;›</span>
            </Link>
            <div className="hp-rail-arrows">
              <button
                type="button"
                className="hp-round-btn"
                onClick={() => scrollByCards(-1)}
                disabled={atStart}
              >
                <ChevronLeftIcon />
                <span className="hp-visually-hidden">
                  Scroll {title} left
                </span>
              </button>
              <button
                type="button"
                className="hp-round-btn"
                onClick={() => scrollByCards(1)}
                disabled={atEnd}
              >
                <ChevronRightIcon />
                <span className="hp-visually-hidden">
                  Scroll {title} right
                </span>
              </button>
            </div>
          </div>
        </div>

        <ul className="hp-rail" ref={trackRef} onScroll={syncEdges}>
          {looks.map((look, i) => (
            <LookCard
              key={look.id}
              look={look}
              saved={savedIds.has(look.id)}
              onSave={onSave}
              eager={i < 4}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
