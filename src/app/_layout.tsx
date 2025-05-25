import '@/global.css';
import { Stack } from 'expo-router';

export { ErrorBoundary } from 'expo-router';

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="posts" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return <RootLayoutNav />;
}
