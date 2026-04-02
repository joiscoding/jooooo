import { Link } from 'react-router-dom';

export type ListEmptyPrimaryAction =
  | { label: string; to: string }
  | { label: string; href: string }
  | { label: string; onClick: () => void };

type ListEmptyStateProps = {
  title: string;
  body: string;
  primaryAction: ListEmptyPrimaryAction;
  secondaryAction?: ListEmptyPrimaryAction;
};

function renderAction(action: ListEmptyPrimaryAction, variant: 'primary' | 'ghost') {
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
      <a href={action.href} className={className}>
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
  body,
  primaryAction,
  secondaryAction,
}: ListEmptyStateProps) {
  return (
    <div className="list-empty-state" role="status">
      <h2 className="list-empty-state__title">{title}</h2>
      <p className="list-empty-state__body muted">{body}</p>
      <div className="list-empty-state__actions">
        {renderAction(primaryAction, 'primary')}
        {secondaryAction ? renderAction(secondaryAction, 'ghost') : null}
      </div>
    </div>
  );
}
