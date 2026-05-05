import { Link } from 'react-router-dom';

type ActionVariant = 'primary' | 'ghost';

type EmptyAction =
  | { label: string; to: string; variant?: ActionVariant }
  | { label: string; href: string; variant?: ActionVariant }
  | { label: string; onClick: () => void; variant?: ActionVariant };

type ListEmptyStateProps = {
  title: string;
  description?: string;
  primaryAction?: EmptyAction;
  secondaryAction?: EmptyAction;
  className?: string;
};

function actionClasses(variant: ActionVariant) {
  return variant === 'primary' ? 'btn primary' : 'btn ghost';
}

function renderAction(action: EmptyAction, defaultVariant: ActionVariant) {
  const variant = action.variant ?? defaultVariant;
  const cls = actionClasses(variant);

  if ('to' in action) {
    return (
      <Link to={action.to} className={cls}>
        {action.label}
      </Link>
    );
  }
  if ('href' in action) {
    return (
      <a href={action.href} className={cls}>
        {action.label}
      </a>
    );
  }
  return (
    <button type="button" className={cls} onClick={action.onClick}>
      {action.label}
    </button>
  );
}

export function ListEmptyState({
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}: ListEmptyStateProps) {
  const rootClass = ['list-empty-state', className].filter(Boolean).join(' ');

  return (
    <div className={rootClass} role="status">
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
