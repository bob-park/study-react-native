import { View } from 'react-native';

import { Stack } from 'expo-router';

import '@/app/global.css';
import AuthProvider from '@/shared/providers/auth/AuthProvider';
import ThemeProvider from '@/shared/providers/theme/ThemeProvider';

export { ErrorBoundary } from 'expo-router';

function RootLayoutNav() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="posts" options={{ presentation: 'modal' }} />
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return <RootLayoutNav />;
}
