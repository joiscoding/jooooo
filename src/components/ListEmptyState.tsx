import { Link } from 'react-router-dom';

export type ListEmptyStateAction =
  | { label: string; to: string }
  | { label: string; href: string }
  | { label: string; onClick: () => void };

type ListEmptyStateProps = {
  title: string;
  description?: string;
  primary?: ListEmptyStateAction;
  secondary?: ListEmptyStateAction;
  className?: string;
};

function isExternalLink(
  action: ListEmptyStateAction,
): action is { label: string; href: string } {
  return 'href' in action;
}

function isRouterLink(
  action: ListEmptyStateAction,
): action is { label: string; to: string } {
  return 'to' in action;
}

export function ListEmptyState({
  title,
  description,
  primary,
  secondary,
  className,
}: ListEmptyStateProps) {
  function renderAction(
    action: ListEmptyStateAction,
    variant: 'primary' | 'secondary',
  ) {
    const btnClass = variant === 'primary' ? 'btn primary' : 'btn ghost';
    if (isExternalLink(action)) {
      return (
        <a
          href={action.href}
          className={btnClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          {action.label}
        </a>
      );
    }
    if (isRouterLink(action)) {
      return (
        <Link to={action.to} className={btnClass}>
          {action.label}
        </Link>
      );
    }
    return (
      <button type="button" className={btnClass} onClick={action.onClick}>
        {action.label}
      </button>
    );
  }

  const rootClass = ['list-empty-state', className].filter(Boolean).join(' ');

  return (
    <div className={rootClass} role="status" aria-live="polite">
      <h2 className="list-empty-state-title">{title}</h2>
      {description ? (
        <p className="list-empty-state-desc">{description}</p>
      ) : null}
      {primary || secondary ? (
        <div className="list-empty-state-actions">
          {primary ? renderAction(primary, 'primary') : null}
          {secondary ? renderAction(secondary, 'secondary') : null}
        </div>
      ) : null}
    </div>
  );
}
