import { createContext, useMemo } from 'react';

import { SharedValue, useSharedValue } from 'react-native-reanimated';

interface RefreshContextType {
  pullDownPosition: SharedValue<number>;
}

export const RefreshContext = createContext<RefreshContextType>({
  pullDownPosition: null as unknown as SharedValue<number>,
});

export default function RefreshProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  // state
  const pullDownPosition = useSharedValue(0);

  // memorize
  const memorizedContextValue = useMemo<RefreshContextType>(
    () => ({
      pullDownPosition,
    }),
    [pullDownPosition],
  );

  return <RefreshContext value={memorizedContextValue}>{children}</RefreshContext>;
}
