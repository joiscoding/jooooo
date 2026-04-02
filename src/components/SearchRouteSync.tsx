import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';

/** Clears global search when leaving the gallery so results are not stale. */
export function SearchRouteSync() {
  const { pathname } = useLocation();
  const { setSearchQuery } = useSearch();

  useEffect(() => {
    if (pathname !== '/') setSearchQuery('');
  }, [pathname, setSearchQuery]);

  return null;
}
