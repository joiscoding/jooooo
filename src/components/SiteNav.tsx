import { Link, useLocation } from 'react-router-dom';

type SiteNavProps = {
  id?: string;
  className?: string;
  /** When true, show compact letter marks for collapsed desktop rail */
  compact?: boolean;
};

export function SiteNav({ id, className, compact }: SiteNavProps) {
  const { pathname } = useLocation();
  const isAlbums = pathname.startsWith('/albums');

  return (
    <nav id={id} className={className} aria-label="Primary">
      <Link
        to="/"
        className={pathname === '/' ? 'nav-link active' : 'nav-link'}
        title="Gallery"
      >
        {compact ? (
          <>
            <span className="sr-only">Gallery</span>
            <span aria-hidden="true">G</span>
          </>
        ) : (
          'Gallery'
        )}
      </Link>
      <Link
        to="/albums"
        className={isAlbums ? 'nav-link active' : 'nav-link'}
        title="Albums"
      >
        {compact ? (
          <>
            <span className="sr-only">Albums</span>
            <span aria-hidden="true">A</span>
          </>
        ) : (
          'Albums'
        )}
      </Link>
    </nav>
  );
}
