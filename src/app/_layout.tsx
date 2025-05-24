import '@/global.css';
import { Slot } from 'expo-router';

export { ErrorBoundary } from 'expo-router';

function RootLayoutNav() {
  return <Slot />;
}

export default function RootLayout() {
  return <RootLayoutNav />;
}
