import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

export type ListEmptyAction =
  | { label: string; href: string }
  | { label: string; onClick: () => void };

export type ListEmptyStateProps = {
  title: string;
  description: string;
  primaryAction?: ListEmptyAction;
  secondaryAction?: ListEmptyAction;
};

function renderAction(
  spec: ListEmptyAction,
  variant: 'primary' | 'secondary',
): ReactNode {
  const className =
    variant === 'primary' ? 'btn primary list-empty-cta' : 'btn ghost list-empty-cta';

  if ('href' in spec) {
    const isExternal = /^https?:\/\//i.test(spec.href);
    if (isExternal) {
      return (
        <a
          href={spec.href}
          className={className}
          target="_blank"
          rel="noopener noreferrer"
        >
          {spec.label}
        </a>
      );
    }
    return (
      <Link to={spec.href} className={className}>
        {spec.label}
      </Link>
    );
  }

  return (
    <button type="button" className={className} onClick={spec.onClick}>
      {spec.label}
    </button>
  );
}

/**
 * Shared empty list pattern: headline, short supporting copy, and optional CTAs.
 */
export function ListEmptyState({
  title,
  description,
  primaryAction,
  secondaryAction,
}: ListEmptyStateProps) {
  return (
    <div className="list-empty-state" role="status">
      <h2 className="list-empty-title">{title}</h2>
      <p className="list-empty-desc">{description}</p>
      {(primaryAction ?? secondaryAction) && (
        <div className="list-empty-actions">
          {primaryAction && renderAction(primaryAction, 'primary')}
          {secondaryAction && renderAction(secondaryAction, 'secondary')}
        </div>
      )}
    </div>
  );
}
