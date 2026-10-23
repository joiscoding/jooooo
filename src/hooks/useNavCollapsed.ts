import { useCallback, useEffect, useState } from 'react';
import { readNavCollapsed, writeNavCollapsed } from '../storage/navCollapsed';

export function useNavCollapsed() {
  const [collapsed, setCollapsed] = useState(readNavCollapsed);

  useEffect(() => {
    writeNavCollapsed(collapsed);
  }, [collapsed]);

  const toggle = useCallback(() => {
    setCollapsed((c) => !c);
  }, []);

  return { collapsed, setCollapsed, toggle };
}
