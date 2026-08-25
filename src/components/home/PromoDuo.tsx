import { Link } from 'react-router-dom';

export type Promo = {
  id: string;
  kicker: string;
  title: string;
  copy: string;
  ctaLabel: string;
  ctaTo: string;
  image: string;
};

export function PromoDuo({ promos }: { promos: Promo[] }) {
  return (
    <section className="hp-section" aria-label="Featured collections">
      <div className="hp-container hp-promo-duo">
        {promos.map((promo) => (
          <article key={promo.id} className="hp-promo-card">
            <img
              className="hp-promo-bg"
              src={promo.image}
              alt=""
              loading="lazy"
            />
            <div className="hp-promo-body">
              <p className="hp-promo-kicker">{promo.kicker}</p>
              <h3 className="hp-promo-title">{promo.title}</h3>
              <p className="hp-promo-copy">{promo.copy}</p>
              <Link to={promo.ctaTo} className="hp-btn hp-btn-light">
                {promo.ctaLabel}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
