import { Link } from 'react-router-dom';

type SiteNavLinksProps = {
  pathname: string;
  /** Narrow sidebar: short labels + explicit link names for assistive tech */
  compact?: boolean;
  className?: string;
  id?: string;
};

export function SiteNavLinks({
  pathname,
  compact = false,
  className,
  id,
}: SiteNavLinksProps) {
  const isAlbums = pathname.startsWith('/albums');
  const navClass = [compact ? 'nav nav--compact' : 'nav', className]
    .filter(Boolean)
    .join(' ');

  return (
    <nav id={id} className={navClass} aria-label="Main navigation">
      <Link
        to="/"
        className={pathname === '/' ? 'nav-link active' : 'nav-link'}
        aria-current={pathname === '/' ? 'page' : undefined}
        aria-label={compact ? 'Gallery' : undefined}
      >
        {compact ? <span aria-hidden="true">G</span> : 'Gallery'}
      </Link>
      <Link
        to="/albums"
        className={isAlbums ? 'nav-link active' : 'nav-link'}
        aria-current={isAlbums ? 'page' : undefined}
        aria-label={compact ? 'Albums' : undefined}
      >
        {compact ? <span aria-hidden="true">A</span> : 'Albums'}
      </Link>
    </nav>
  );
}
