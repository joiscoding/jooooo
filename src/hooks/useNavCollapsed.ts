import { useCallback, useState } from 'react';
import { readNavCollapsed, writeNavCollapsed } from '../lib/navCollapsedStorage';

export function useNavCollapsed() {
  const [collapsed, setCollapsed] = useState(readNavCollapsed);

  const toggle = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      writeNavCollapsed(next);
      return next;
    });
  }, []);

  return { collapsed, toggle };
}
