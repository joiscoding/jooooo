import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

export type ListEmptyAction =
  | { label: string; to: string }
  | { label: string; href: string; external?: boolean }
  | { label: string; onClick: () => void };

function renderAction(
  action: ListEmptyAction,
  variant: 'primary' | 'ghost',
): ReactNode {
  const className = variant === 'primary' ? 'btn primary' : 'btn ghost';

  if ('to' in action) {
    return (
      <Link to={action.to} className={className}>
        {action.label}
      </Link>
    );
  }
  if ('href' in action) {
    return (
      <a
        href={action.href}
        className={className}
        target={action.external === false ? undefined : '_blank'}
        rel={
          action.external === false
            ? undefined
            : 'noopener noreferrer'
        }
      >
        {action.label}
      </a>
    );
  }
  return (
    <button type="button" className={className} onClick={action.onClick}>
      {action.label}
    </button>
  );
}

export function ListEmptyState({
  title,
  description,
  primaryAction,
  secondaryAction,
}: {
  title: string;
  description?: string;
  primaryAction?: ListEmptyAction;
  secondaryAction?: ListEmptyAction;
}) {
  return (
    <div className="list-empty-state" role="status">
      <h2 className="list-empty-state-title">{title}</h2>
      {description ? (
        <p className="list-empty-state-desc">{description}</p>
      ) : null}
      {(primaryAction || secondaryAction) && (
        <div className="list-empty-state-actions">
          {primaryAction ? renderAction(primaryAction, 'primary') : null}
          {secondaryAction ? renderAction(secondaryAction, 'ghost') : null}
        </div>
      )}
    </div>
  );
}
