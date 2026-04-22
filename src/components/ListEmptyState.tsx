import { Link, type To } from 'react-router-dom';

type Cta =
  | {
      label: string;
      to: To;
    }
  | {
      label: string;
      onClick: () => void;
    };

function isLinkCta(cta: Cta): cta is { label: string; to: To } {
  return 'to' in cta;
}

export type ListEmptyStateProps = {
  title: string;
  description?: string;
  primary: Cta;
  secondary?: Cta;
  /** e.g. region label for a11y */
  'aria-label'?: string;
};

/**
 * Consistent empty list pattern: short headline, optional supporting line, and primary/secondary actions.
 */
export function ListEmptyState({
  title,
  description,
  primary,
  secondary,
  'aria-label': ariaLabel = 'No items in this list',
}: ListEmptyStateProps) {
  return (
    <div className="list-empty-state" role="region" aria-label={ariaLabel}>
      <h2 className="list-empty-state-title">{title}</h2>
      {description ? (
        <p className="list-empty-state-desc">{description}</p>
      ) : null}
      <div className="list-empty-state-actions">
        {isLinkCta(primary) ? (
          <Link to={primary.to} className="btn primary">
            {primary.label}
          </Link>
        ) : (
          <button
            type="button"
            className="btn primary"
            onClick={primary.onClick}
          >
            {primary.label}
          </button>
        )}
        {secondary ? (
          isLinkCta(secondary) ? (
            <Link to={secondary.to} className="btn ghost">
              {secondary.label}
            </Link>
          ) : (
            <button
              type="button"
              className="btn ghost"
              onClick={secondary.onClick}
            >
              {secondary.label}
            </button>
          )
        ) : null}
      </div>
    </div>
  );
}
