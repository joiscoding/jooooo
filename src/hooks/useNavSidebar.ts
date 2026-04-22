import { useCallback, useState } from 'react';
import { getNavCollapsed, setNavCollapsed } from './navSidebarStorage';

export function useNavSidebar() {
  const [collapsed, setCollapsed] = useState(getNavCollapsed);

  const setCollapsedAndPersist = useCallback((value: boolean) => {
    setCollapsed(value);
    setNavCollapsed(value);
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsedAndPersist(!collapsed);
  }, [collapsed, setCollapsedAndPersist]);

  return { collapsed, setCollapsed: setCollapsedAndPersist, toggleCollapsed };
}
