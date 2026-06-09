import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export type EmptyStateAction = {
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'ghost';
};

type ListEmptyStateProps = {
  headline: string;
  description?: string;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  children?: ReactNode;
};

function EmptyStateActionButton({ action }: { action: EmptyStateAction }) {
  const variant = action.variant ?? 'primary';
  const className = `btn ${variant === 'ghost' ? 'ghost' : 'primary'}`;

  if (action.href) {
    return (
      <Link to={action.href} className={className}>
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
  headline,
  description,
  primaryAction,
  secondaryAction,
  children,
}: ListEmptyStateProps) {
  const hasActions = primaryAction || secondaryAction;

  return (
    <div className="list-empty-state" role="status">
      <h2 className="list-empty-state-headline">{headline}</h2>
      {description ? (
        <p className="list-empty-state-description">{description}</p>
      ) : null}
      {children}
      {hasActions ? (
        <div className="list-empty-state-actions">
          {primaryAction ? (
            <EmptyStateActionButton action={primaryAction} />
          ) : null}
          {secondaryAction ? (
            <EmptyStateActionButton action={secondaryAction} />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
