import { useContext } from 'react';

import { TabsContext } from '..';

export function useTabsContext() {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error('Component must be rendered as a child of Tabs.Root');
  }

  return context;
}
