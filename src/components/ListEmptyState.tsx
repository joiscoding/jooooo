import { Link } from 'react-router-dom';

export type ListEmptyAction =
  | {
      label: string;
      to: string;
      variant?: 'primary' | 'ghost';
    }
  | {
      label: string;
      onClick: () => void;
      variant?: 'primary' | 'ghost';
    };

function isLinkAction(
  action: ListEmptyAction,
): action is Extract<ListEmptyAction, { to: string }> {
  return 'to' in action;
}

function ActionButton({ action }: { action: ListEmptyAction }) {
  const variant = action.variant ?? 'primary';
  const className = variant === 'ghost' ? 'btn ghost' : 'btn primary';

  if (isLinkAction(action)) {
    return (
      <Link to={action.to} className={className}>
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

type ListEmptyStateProps = {
  title: string;
  description?: string;
  primaryAction: ListEmptyAction;
  secondaryAction?: ListEmptyAction;
};

/**
 * Shared empty list pattern: short headline, optional supporting line, and CTAs.
 */
export function ListEmptyState({
  title,
  description,
  primaryAction,
  secondaryAction,
}: ListEmptyStateProps) {
  const primary: ListEmptyAction = {
    ...primaryAction,
    variant: primaryAction.variant ?? 'primary',
  };
  const secondary = secondaryAction
    ? {
        ...secondaryAction,
        variant: secondaryAction.variant ?? 'ghost',
      }
    : undefined;

  return (
    <div className="list-empty-state" role="status">
      <h2 className="list-empty-state-title">{title}</h2>
      {description ? (
        <p className="list-empty-state-desc">{description}</p>
      ) : null}
      <div className="list-empty-state-actions">
        <ActionButton action={primary} />
        {secondary ? <ActionButton action={secondary} /> : null}
      </div>
    </div>
  );
}
