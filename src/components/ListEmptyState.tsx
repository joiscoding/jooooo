import { Link } from 'react-router-dom';

export type ListEmptyAction =
  | { kind: 'link'; to: string; label: string }
  | {
      kind: 'button';
      label: string;
      onClick: () => void;
      variant?: 'primary' | 'ghost';
    };

export type ListEmptyStateProps = {
  title: string;
  description: string;
  primary?: ListEmptyAction;
  secondary?: ListEmptyAction;
};

function actionButtonClass(variant: 'primary' | 'ghost' | undefined): string {
  return variant === 'ghost' ? 'btn ghost' : 'btn primary';
}

export function ListEmptyState({
  title,
  description,
  primary,
  secondary,
}: ListEmptyStateProps) {
  return (
    <section
      className="list-empty-state"
      aria-labelledby="list-empty-title"
    >
      <h2 id="list-empty-title" className="list-empty-title">
        {title}
      </h2>
      <p className="list-empty-desc">{description}</p>
      {(primary ?? secondary) && (
        <div className="list-empty-actions">
          {primary &&
            (primary.kind === 'link' ? (
              <Link
                to={primary.to}
                className="btn primary list-empty-cta"
              >
                {primary.label}
              </Link>
            ) : (
              <button
                type="button"
                className={`list-empty-cta ${actionButtonClass(primary.variant)}`}
                onClick={primary.onClick}
              >
                {primary.label}
              </button>
            ))}
          {secondary &&
            (secondary.kind === 'link' ? (
              <Link to={secondary.to} className="btn ghost list-empty-cta">
                {secondary.label}
              </Link>
            ) : (
              <button
                type="button"
                className={`list-empty-cta ${actionButtonClass(secondary.variant)}`}
                onClick={secondary.onClick}
              >
                {secondary.label}
              </button>
            ))}
        </div>
      )}
    </section>
  );
}
