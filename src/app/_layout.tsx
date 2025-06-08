import { useEffect, useRef, useState } from 'react';

import { Animated, View } from 'react-native';
import { DevToolsBubble } from 'react-native-react-query-devtools';

import { Asset } from 'expo-asset';
import * as Clipboard from 'expo-clipboard';
import Constants from 'expo-constants';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '@/app/global.css';
import logo from '@/assets/images/logo.png';
import AuthProvider from '@/shared/providers/auth/AuthProvider';
import ThemeProvider from '@/shared/providers/theme/ThemeProvider';

import cx from 'classnames';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync().catch(() => {});

function AnimatedSplashScreen({ children, image }: Readonly<{ children: React.ReactNode; image: number }>) {
  // ref
  const animation = useRef<Animated.Value>(new Animated.Value(1)).current;

  // state
  const [isAppReady, setIsAppReady] = useState<boolean>(false);
  const [isSplashAnimationComplete, setIsSplashAnimationComplete] = useState<boolean>(false);

  // animation 은 number 가 아니기 때문에, 변경해줘야함
  const rotateValue = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['1080deg', '0deg'],
  });

  // useEffect
  useEffect(() => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 2_000,
      useNativeDriver: true,
    }).start(() => setIsSplashAnimationComplete(true));
  }, []);

  // handle
  const handleLoadEnd = async () => {
    try {
      // data 준비

      // 수동으로 expo splash screen 제거
      await SplashScreen.hideAsync();
    } catch (err) {
      console.error(err);
    } finally {
      setIsAppReady(true);
    }
  };

  return (
    <View className="flex-1">
      {isAppReady && children}
      {!isSplashAnimationComplete && (
        <Animated.View
          className={cx(
            'flex size-full flex-col items-center justify-center',
            `bg-[${Constants.expoConfig?.splash?.backgroundColor || '#ffffff'}]`,
          )}
          style={{ opacity: animation }}
          pointerEvents="none"
        >
          <Animated.Image
            className="w-[200]"
            style={{
              resizeMode: Constants.expoConfig?.splash?.resizeMode || 'contain',
              transform: [{ scale: animation }, { rotate: rotateValue }],
            }}
            source={image}
            alt="splash-image"
            fadeDuration={0}
            onLoadEnd={handleLoadEnd}
          />
        </Animated.View>
      )}
    </View>
  );
}

function AnimateAppLoader({ children, image }: Readonly<{ children: React.ReactNode; image: number }>) {
  // state
  const [isSplashReady, setIsSplashReady] = useState<boolean>(false);

  // useEffect
  useEffect(() => {
    async function prepare() {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // splash image 가 원격인 경우
      // await Asset.fromURI('').downloadAsync();

      await Asset.loadAsync(image);

      setIsSplashReady(true);
    }

    prepare();
  }, [image]);

  if (!isSplashReady) {
    return null;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <AnimatedSplashScreen image={image}>{children}</AnimatedSplashScreen>
      </AuthProvider>
    </ThemeProvider>
  );
}

function RootLayoutNav() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retryOnMount: true,
        refetchOnReconnect: true,
        staleTime: 60 * 1_000,
        gcTime: 120 * 1_000,
      },
    },
  });

  // handle
  // Define your copy function based on your platform
  const handleCopy = async (text: string) => {
    try {
      // For Expo:
      await Clipboard.setStringAsync(text);
      // OR for React Native CLI:
      // await Clipboard.setString(text);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <AnimateAppLoader image={logo}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="auto" animated />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="posts" options={{ presentation: 'modal' }} />
        </Stack>
        {__DEV__ && <DevToolsBubble onCopy={handleCopy} queryClient={queryClient} />}
      </QueryClientProvider>
    </AnimateAppLoader>
  );
}

export default function RootLayout() {
  return <RootLayoutNav />;
}
