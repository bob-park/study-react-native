import { createContext, useEffect, useMemo, useState } from 'react';

import { useColorScheme } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_THEME_PREFERENCE = 'theme.preference';

type ThemePreference = 'auto' | 'light' | 'dark';

interface ThemeContextType {
  theme: 'dark' | 'light';
  preference: ThemePreference;
  onUpdatePreference: (preference: ThemePreference) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  preference: 'auto',
  onUpdatePreference: (preference: ThemePreference) => {},
});

export default function ThemeProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  // state
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [preference, setPreference] = useState<ThemePreference>('auto');

  // hooks
  const colorScheme = useColorScheme();

  // useEffect
  useEffect(() => {
    AsyncStorage.getItem(KEY_THEME_PREFERENCE)
      .then((data) => (!data ? 'auto' : (data as ThemePreference)))
      .then((preference) => setPreference(preference));
  }, []);

  useEffect(() => {
    setTheme(preference === 'auto' ? (colorScheme ?? 'light') : preference);

    // save
    AsyncStorage.setItem(KEY_THEME_PREFERENCE, preference);
  }, [preference, colorScheme]);

  // memorize
  const contextValue = useMemo<ThemeContextType>(
    () => ({
      theme,
      preference,
      onUpdatePreference: (preference: ThemePreference) => {
        setPreference(preference);
      },
    }),
    [theme, preference],
  );

  return <ThemeContext value={contextValue}>{children}</ThemeContext>;
}
