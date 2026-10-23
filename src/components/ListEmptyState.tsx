import { Link } from 'react-router-dom';

export type ListEmptyStateAction = {
  label: string;
  href?: string;
  onClick?: () => void;
};

export type ListEmptyStateProps = {
  headline: string;
  description: string;
  primaryAction: ListEmptyStateAction;
  secondaryAction?: ListEmptyStateAction;
};

function ActionButton({
  action,
  variant,
}: {
  action: ListEmptyStateAction;
  variant: 'primary' | 'ghost';
}) {
  const className = variant === 'primary' ? 'btn primary' : 'btn ghost';

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
}: ListEmptyStateProps) {
  return (
    <div className="list-empty-state" role="status">
      <h2 className="list-empty-state-headline">{headline}</h2>
      <p className="list-empty-state-description">{description}</p>
      <div className="list-empty-state-actions">
        <ActionButton action={primaryAction} variant="primary" />
        {secondaryAction ? (
          <ActionButton action={secondaryAction} variant="ghost" />
        ) : null}
      </div>
    </div>
  );
}
