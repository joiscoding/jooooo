import { useCallback, useState } from 'react';
import { readNavCollapsed, writeNavCollapsed } from './navCollapsedStorage';

export function useNavCollapsed() {
  const [collapsed, setCollapsedState] = useState(readNavCollapsed);

  const setCollapsed = useCallback((next: boolean) => {
    setCollapsedState(next);
    writeNavCollapsed(next);
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsedState((prev) => {
      const next = !prev;
      writeNavCollapsed(next);
      return next;
    });
  }, []);

  return { collapsed, setCollapsed, toggleCollapsed };
}
