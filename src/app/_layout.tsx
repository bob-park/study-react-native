import AuthProvider from '@/shared/providers/auth/AuthProvider';

import '@/global.css';
import { Stack } from 'expo-router';

export { ErrorBoundary } from 'expo-router';

function RootLayoutNav() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="posts" options={{ presentation: 'modal' }} />
      </Stack>
    </AuthProvider>
  );
}

export default function RootLayout() {
  return <RootLayoutNav />;
}
