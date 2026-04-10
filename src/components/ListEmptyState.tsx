import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type ButtonVariant = 'primary' | 'ghost';

type LinkAction = {
  label: string;
  to: string;
  variant?: ButtonVariant;
};

type ButtonAction = {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
};

export type ListEmptyStateAction = LinkAction | ButtonAction;

function isLinkAction(
  a: ListEmptyStateAction
): a is LinkAction {
  return 'to' in a;
}

export function ListEmptyState({
  title,
  description,
  primaryAction,
  secondaryAction,
  className = '',
  children,
}: {
  title: string;
  description?: string;
  primaryAction?: ListEmptyStateAction;
  secondaryAction?: ListEmptyStateAction;
  className?: string;
  children?: ReactNode;
}) {
  function renderAction(action: ListEmptyStateAction) {
    const variant = action.variant ?? 'primary';
    const cls =
      variant === 'primary' ? 'btn primary' : 'btn ghost';

    if (isLinkAction(action)) {
      return (
        <Link to={action.to} className={cls}>
          {action.label}
        </Link>
      );
    }
    return (
      <button type="button" className={cls} onClick={action.onClick}>
        {action.label}
      </button>
    );
  }

  return (
    <section
      className={`list-empty-state ${className}`.trim()}
      role="status"
      aria-live="polite"
    >
      <h2 className="list-empty-state-title">{title}</h2>
      {description ? (
        <p className="list-empty-state-desc">{description}</p>
      ) : null}
      {children}
      {(primaryAction || secondaryAction) && (
        <div className="list-empty-state-actions">
          {primaryAction ? renderAction(primaryAction) : null}
          {secondaryAction ? renderAction(secondaryAction) : null}
        </div>
      )}
    </section>
  );
}
