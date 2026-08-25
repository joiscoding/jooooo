import type { StyleTag } from '../../types';

export type StyleCircle = {
  value: StyleTag | 'all';
  label: string;
  image: string;
};

export function StyleCircles({
  circles,
  active,
  onSelect,
}: {
  circles: StyleCircle[];
  active: StyleTag | 'all';
  onSelect: (value: StyleTag | 'all') => void;
}) {
  return (
    <section className="hp-section hp-quicklinks" aria-labelledby="quicklinks-h">
      <div className="hp-container">
        <h2 id="quicklinks-h" className="hp-section-title">
          Shop by style
        </h2>
        <ul className="hp-circle-row">
          {circles.map((circle) => (
            <li key={circle.value}>
              <button
                type="button"
                className={
                  active === circle.value
                    ? 'hp-circle-btn active'
                    : 'hp-circle-btn'
                }
                aria-pressed={active === circle.value}
                onClick={() => onSelect(circle.value)}
              >
                <span className="hp-circle-media">
                  <img src={circle.image} alt="" loading="lazy" />
                </span>
                <span className="hp-circle-label">{circle.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
