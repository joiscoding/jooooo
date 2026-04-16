import type { ReactNode } from 'react';

type ListEmptyStateProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

/**
 * Shared empty state for main list views: headline, supporting copy, optional CTAs.
 */
export function ListEmptyState({
  title,
  description,
  children,
}: ListEmptyStateProps) {
  return (
    <div className="list-empty-state" role="status" aria-live="polite">
      <h2 className="list-empty-state-title">{title}</h2>
      <p className="list-empty-state-desc">{description}</p>
      {children ? (
        <div className="list-empty-state-actions">{children}</div>
      ) : null}
    </div>
  );
}
