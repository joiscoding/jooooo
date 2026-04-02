import { Link } from 'react-router-dom';

export type ListEmptyStateAction =
  | { kind: 'button'; label: string; onClick: () => void }
  | { kind: 'link'; label: string; to: string };

type ListEmptyStateProps = {
  title: string;
  body: string;
  primary: ListEmptyStateAction;
  secondary?: ListEmptyStateAction;
};

function renderPrimary(action: ListEmptyStateAction) {
  if (action.kind === 'link') {
    return (
      <Link to={action.to} className="btn primary list-empty-state-cta">
        {action.label}
      </Link>
    );
  }
  return (
    <button
      type="button"
      className="btn primary list-empty-state-cta"
      onClick={action.onClick}
    >
      {action.label}
    </button>
  );
}

function renderSecondary(action: ListEmptyStateAction) {
  if (action.kind === 'link') {
    return (
      <Link to={action.to} className="btn ghost list-empty-state-cta-secondary">
        {action.label}
      </Link>
    );
  }
  return (
    <button
      type="button"
      className="btn ghost list-empty-state-cta-secondary"
      onClick={action.onClick}
    >
      {action.label}
    </button>
  );
}

/**
 * Shared empty state for main list views: short headline, supporting line, and primary CTA.
 */
export function ListEmptyState({
  title,
  body,
  primary,
  secondary,
}: ListEmptyStateProps) {
  return (
    <div
      className="list-empty-state"
      role="status"
      aria-live="polite"
    >
      <h2 className="list-empty-state-title">{title}</h2>
      <p className="list-empty-state-body">{body}</p>
      <div className="list-empty-state-actions">
        {renderPrimary(primary)}
        {secondary ? renderSecondary(secondary) : null}
      </div>
    </div>
  );
}
