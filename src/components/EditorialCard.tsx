import { Link } from 'react-router-dom';
import type { EditorialCollection, Look } from '../types';
import { STYLE_LABELS } from '../types';

export function LookCard({ look }: { look: Look }) {
  return (
    <Link to={`/look/${look.id}`} className="editorial-card">
      <div className="editorial-card-image-wrap">
        <img src={look.hero} alt={look.title} className="editorial-card-image" />
      </div>
      <div className="editorial-card-body">
        <span className="chip chip-dark">{STYLE_LABELS[look.tag]}</span>
        <h3>{look.title}</h3>
        <p>{look.subtitle}</p>
      </div>
    </Link>
  );
}

export function CollectionCard({
  collection,
  coverLook,
}: {
  collection: EditorialCollection;
  coverLook: Look;
}) {
  return (
    <article className="collection-card">
      <img src={coverLook.hero} alt={collection.title} className="collection-card-image" />
      <div className="collection-card-body">
        <p className="eyebrow">{collection.eyebrow}</p>
        <h3>{collection.title}</h3>
        <p>{collection.description}</p>
        <span className="collection-tone">{collection.tone}</span>
      </div>
    </article>
  );
}
