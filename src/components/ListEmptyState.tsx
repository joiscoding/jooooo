import { useId } from 'react';
import { Link } from 'react-router-dom';

export type ListEmptyStateAction =
  | { type: 'link'; label: string; to: string }
  | { type: 'external'; label: string; href: string }
  | { type: 'button'; label: string; onClick: () => void };

export type ListEmptyStateProps = {
  title: string;
  description?: string;
  primaryAction?: ListEmptyStateAction;
  secondaryAction?: ListEmptyStateAction;
  className?: string;
};

function EmptyActionControl({
  action,
  variant,
}: {
  action: ListEmptyStateAction;
  variant: 'primary' | 'secondary';
}) {
  const className = variant === 'primary' ? 'btn primary' : 'btn ghost';

  if (action.type === 'external') {
    return (
      <a
        className={className}
        href={action.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {action.label}
      </a>
    );
  }

  if (action.type === 'link') {
    return (
      <Link className={className} to={action.to}>
        {action.label}
      </Link>
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
  className = '',
}: ListEmptyStateProps) {
  const titleId = useId();
  const rootClass =
    className.trim() === ''
      ? 'list-empty-state'
      : `list-empty-state ${className.trim()}`;

  return (
    <section
      className={rootClass}
      aria-labelledby={titleId}
      data-testid="list-empty-state"
    >
      <h2 id={titleId} className="list-empty-state-title">
        {title}
      </h2>
      {description ? (
        <p className="list-empty-state-desc">{description}</p>
      ) : null}
      {primaryAction || secondaryAction ? (
        <div className="list-empty-state-actions">
          {primaryAction ? (
            <EmptyActionControl action={primaryAction} variant="primary" />
          ) : null}
          {secondaryAction ? (
            <EmptyActionControl action={secondaryAction} variant="secondary" />
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
