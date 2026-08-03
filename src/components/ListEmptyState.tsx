import { Link } from 'react-router-dom';

export type ListEmptyStateAction =
  | { label: string; kind: 'link'; to: string }
  | { label: string; kind: 'external'; href: string }
  | { label: string; kind: 'button'; onClick: () => void };

type ListEmptyStateProps = {
  title: string;
  description?: string;
  primaryAction?: ListEmptyStateAction;
  secondaryAction?: ListEmptyStateAction;
};

function renderAction(
  action: ListEmptyStateAction,
  variant: 'primary' | 'ghost',
) {
  const cls = variant === 'primary' ? 'btn primary' : 'btn ghost';
  switch (action.kind) {
    case 'link':
      return (
        <Link to={action.to} className={cls}>
          {action.label}
        </Link>
      );
    case 'external':
      return (
        <a
          href={action.href}
          className={cls}
          target="_blank"
          rel="noopener noreferrer"
        >
          {action.label}
        </a>
      );
    case 'button':
      return (
        <button type="button" className={cls} onClick={action.onClick}>
          {action.label}
        </button>
      );
    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}

export function ListEmptyState({
  title,
  description,
  primaryAction,
  secondaryAction,
}: ListEmptyStateProps) {
  return (
    <div className="list-empty-state" role="status">
      <h2 className="list-empty-state-title">{title}</h2>
      {description ? (
        <p className="list-empty-state-desc">{description}</p>
      ) : null}
      {primaryAction || secondaryAction ? (
        <div className="list-empty-state-actions">
          {primaryAction ? renderAction(primaryAction, 'primary') : null}
          {secondaryAction ? renderAction(secondaryAction, 'ghost') : null}
        </div>
      ) : null}
    </div>
  );
}
