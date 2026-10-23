import { Link } from 'react-router-dom';

export type ListEmptyStateAction = {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'ghost';
};

type ListEmptyStateProps = {
  headline: string;
  description?: string;
  primaryAction?: ListEmptyStateAction;
  secondaryAction?: ListEmptyStateAction;
  className?: string;
};

function EmptyStateButton({
  action,
  defaultVariant,
}: {
  action: ListEmptyStateAction;
  defaultVariant: 'primary' | 'ghost';
}) {
  const variant = action.variant ?? defaultVariant;
  const className =
    variant === 'primary' ? 'btn primary' : 'btn ghost';

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
  className,
}: ListEmptyStateProps) {
  const rootClass = ['list-empty-state', className].filter(Boolean).join(' ');

  return (
    <div className={rootClass} role="status">
      <h2 className="list-empty-headline">{headline}</h2>
      {description ? (
        <p className="list-empty-description muted">{description}</p>
      ) : null}
      {(primaryAction || secondaryAction) && (
        <div className="list-empty-actions">
          {primaryAction ? (
            <EmptyStateButton action={primaryAction} defaultVariant="primary" />
          ) : null}
          {secondaryAction ? (
            <EmptyStateButton
              action={secondaryAction}
              defaultVariant="ghost"
            />
          ) : null}
        </div>
      )}
    </div>
  );
}
