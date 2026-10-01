import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Look } from '../types';
import { STYLE_SHORT_LABELS } from '../types';

/**
 * Second photo shown on hover. Skips any image that is another look's cover,
 * so a card never appears to turn into its neighbour.
 */
export function pickHoverImage(look: Look, allLooks: Look[]): string | null {
  const otherCovers = new Set(
    allLooks.filter((l) => l.id !== look.id).map((l) => l.hero)
  );
  return (
    look.gallery.find((src) => src !== look.hero && !otherCovers.has(src)) ??
    null
  );
}

interface LookCardProps {
  look: Look;
  /** Result of pickHoverImage; omit to disable the hover swap. */
  hoverImage?: string | null;
  /** Eager-load above-the-fold cards. */
  eager?: boolean;
  /** Optional overlay control (e.g. "Remove" in an album). */
  action?: ReactNode;
}

/** Product-style card: image with hover swap to a second photo, meta below. */
export function LookCard({
  look,
  hoverImage = null,
  eager = false,
  action,
}: LookCardProps) {
  return (
    <article className="look-card">
      <Link to={`/look/${look.id}`} className="look-card-link">
        <div className="look-card-media">
          <img
            key={`${look.id}-${look.hero}`}
            src={look.hero}
            alt=""
            className="look-card-img"
            loading={eager ? 'eager' : 'lazy'}
          />
          {hoverImage && (
            <img
              src={hoverImage}
              alt=""
              className="look-card-img look-card-img-alt"
              loading="lazy"
              aria-hidden="true"
            />
          )}
        </div>
        <div className="look-card-body">
          <h3 className="look-card-title">{look.title}</h3>
          <p className="look-card-sub">
            {STYLE_SHORT_LABELS[look.tag]} · Designed for {look.occasion}
          </p>
        </div>
      </Link>
      {action}
    </article>
  );
}
