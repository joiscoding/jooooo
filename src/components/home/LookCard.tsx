import { Link } from 'react-router-dom';
import { StarIcon } from '../Icons';
import type { Look } from '../../types';
import { STYLE_LABELS } from '../../types';

const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function Stars({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount?: number;
}) {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <p className="hp-rating">
      <span
        className="hp-stars"
        role="img"
        aria-label={`Rated ${rating} out of 5`}
      >
        {[1, 2, 3, 4, 5].map((step) => (
          <StarIcon
            key={step}
            fill={
              rounded >= step ? 'full' : rounded >= step - 0.5 ? 'half' : 'empty'
            }
          />
        ))}
      </span>
      <span className="hp-rating-value">{rating.toFixed(1)}</span>
      {reviewCount !== undefined && (
        <span className="hp-rating-count">({reviewCount})</span>
      )}
    </p>
  );
}

export function LookCard({
  look,
  saved,
  onSave,
  eager = false,
}: {
  look: Look;
  saved: boolean;
  onSave: (look: Look) => void;
  eager?: boolean;
}) {
  const savings =
    look.wasPriceUsd && look.priceUsd ? look.wasPriceUsd - look.priceUsd : 0;

  return (
    <li className="hp-card">
      <Link to={`/look/${look.id}`} className="hp-card-media">
        {look.badge && (
          <span
            className={
              look.badge === 'New' ? 'hp-chip hp-chip-new' : 'hp-chip'
            }
          >
            {look.badge}
          </span>
        )}
        <img src={look.hero} alt="" loading={eager ? 'eager' : 'lazy'} />
      </Link>
      <div className="hp-card-body">
        <p className="hp-card-tag">{STYLE_LABELS[look.tag]}</p>
        <h3 className="hp-card-title">
          <Link to={`/look/${look.id}`}>{look.title}</Link>
        </h3>
        {look.rating !== undefined && (
          <Stars rating={look.rating} reviewCount={look.reviewCount} />
        )}
        <p className="hp-card-spec">
          {look.keyItems.length} pieces · {look.season} · {look.occasion}
        </p>
        {look.priceUsd !== undefined && (
          <p className="hp-price-row">
            <span className="hp-price">{usd.format(look.priceUsd)}</span>
            {look.wasPriceUsd !== undefined && (
              <s className="hp-price-was">{usd.format(look.wasPriceUsd)}</s>
            )}
            {savings > 0 && (
              <span className="hp-price-save">
                Save {usd.format(savings)}
              </span>
            )}
          </p>
        )}
        <div className="hp-card-actions">
          <button
            type="button"
            className={
              saved ? 'hp-btn hp-btn-saved' : 'hp-btn hp-btn-primary'
            }
            onClick={() => onSave(look)}
          >
            {saved ? 'Saved ✓' : 'Save to album'}
          </button>
          <Link to={`/look/${look.id}`} className="hp-card-link">
            Shop the look
            <span aria-hidden>&nbsp;›</span>
          </Link>
        </div>
      </div>
    </li>
  );
}
