import { useId } from 'react';
import { Link } from 'react-router-dom';

export type EmptyStateAction =
  | {
      type: 'router';
      to: string;
      label: string;
      variant?: 'primary' | 'ghost';
    }
  | {
      type: 'button';
      onClick: () => void;
      label: string;
      variant?: 'primary' | 'ghost';
    };

export type ListEmptyStateProps = {
  title: string;
  description?: string;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  className?: string;
};

function actionClass(variant: EmptyStateAction['variant'] | undefined) {
  return variant === 'ghost' ? 'btn ghost' : 'btn primary';
}

function renderAction(action: EmptyStateAction, key: string) {
  const cls = actionClass(action.variant);
  if (action.type === 'router') {
    return (
      <Link key={key} to={action.to} className={cls}>
        {action.label}
      </Link>
    );
  }
  return (
    <button key={key} type="button" className={cls} onClick={action.onClick}>
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
  const root = ['list-empty-state', className].filter(Boolean).join(' ');
  const titleId = useId();

  return (
    <section className={root} role="region" aria-labelledby={titleId}>
      <h2 id={titleId} className="list-empty-state__title">
        {title}
      </h2>
      {description ? (
        <p className="list-empty-state__desc">{description}</p>
      ) : null}
      {primaryAction || secondaryAction ? (
        <div className="list-empty-state__actions">
          {primaryAction ? renderAction(primaryAction, 'primary') : null}
          {secondaryAction ? renderAction(secondaryAction, 'secondary') : null}
        </div>
      ) : null}
    </section>
  );
}
