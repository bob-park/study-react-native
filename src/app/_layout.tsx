import { Stack } from 'expo-router';

import '@/app/global.css';
import AuthProvider from '@/shared/providers/auth/AuthProvider';

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
