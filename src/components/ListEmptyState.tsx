import { useId } from 'react';
import { Link } from 'react-router-dom';

export type ListEmptyCTA =
  | { action: 'route'; label: string; to: string; tone?: 'primary' | 'ghost' }
  | { action: 'anchor'; label: string; fragmentId: string; tone?: 'primary' | 'ghost' }
  | { action: 'button'; label: string; onClick: () => void; tone?: 'primary' | 'ghost' };

type ListEmptyStateProps = {
  title: string;
  description?: string;
  primaryAction?: ListEmptyCTA;
  secondaryAction?: ListEmptyCTA;
  className?: string;
};

function ctaTone(cta: ListEmptyCTA | undefined, fallback: 'primary' | 'ghost'): 'primary' | 'ghost' {
  return cta?.tone ?? fallback;
}

function renderCta(cta: ListEmptyCTA, defaultTone: 'primary' | 'ghost') {
  const tone = ctaTone(cta, defaultTone);
  const cls = `btn ${tone === 'ghost' ? 'ghost' : 'primary'}`;

  if (cta.action === 'route') {
    return (
      <Link to={cta.to} className={cls}>
        {cta.label}
      </Link>
    );
  }
  if (cta.action === 'anchor') {
    return (
      <a href={`#${cta.fragmentId}`} className={cls}>
        {cta.label}
      </a>
    );
  }
  return (
    <button type="button" className={cls} onClick={cta.onClick}>
      {cta.label}
    </button>
  );
}

export function ListEmptyState({
  title,
  description,
  primaryAction,
  secondaryAction,
  className = '',
}: ListEmptyStateProps) {
  const reactId = useId();
  const titleId = `list-empty-title-${reactId.replace(/:/g, '')}`;

  return (
    <div
      className={`list-empty-state ${className}`.trim()}
      role="region"
      aria-labelledby={titleId}
    >
      <h2 id={titleId} className="list-empty-state__title">
        {title}
      </h2>
      {description ? <p className="list-empty-state__desc">{description}</p> : null}
      {primaryAction || secondaryAction ? (
        <div className="list-empty-state__actions">
          {primaryAction ? renderCta(primaryAction, 'primary') : null}
          {secondaryAction ? renderCta(secondaryAction, 'ghost') : null}
        </div>
      ) : null}
    </div>
  );
}
