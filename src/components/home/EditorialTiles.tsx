import { Link } from 'react-router-dom';

export type EditorialTile = {
  id: string;
  title: string;
  copy: string;
  linkLabel: string;
  linkTo: string;
  image: string;
};

export function EditorialTiles({ tiles }: { tiles: EditorialTile[] }) {
  return (
    <section className="hp-section" id="editorial" aria-labelledby="editorial-h">
      <div className="hp-container">
        <div className="hp-section-head">
          <div>
            <p className="hp-section-eyebrow">Style guides</p>
            <h2 id="editorial-h" className="hp-section-title">
              Explore the lookbook
            </h2>
          </div>
        </div>
        <ul className="hp-tile-grid">
          {tiles.map((tile) => (
            <li key={tile.id} className="hp-tile">
              <img src={tile.image} alt="" loading="lazy" />
              <div className="hp-tile-body">
                <h3 className="hp-tile-title">{tile.title}</h3>
                <p className="hp-tile-copy">{tile.copy}</p>
                <Link to={tile.linkTo} className="hp-card-link">
                  {tile.linkLabel}
                  <span aria-hidden>&nbsp;›</span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
