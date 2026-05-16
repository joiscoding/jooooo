import { useCallback, useEffect, useState } from 'react';
import { readNavCollapsed, writeNavCollapsed } from '../lib/navCollapsedStorage';

export function usePersistedNavCollapsed() {
  const [collapsed, setCollapsed] = useState(readNavCollapsed);

  useEffect(() => {
    writeNavCollapsed(collapsed);
  }, [collapsed]);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((c) => !c);
  }, []);

  return { collapsed, setCollapsed, toggleCollapsed };
}
