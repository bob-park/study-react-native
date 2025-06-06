import { useEffect, useRef, useState } from 'react';

import { Animated, View } from 'react-native';

import { Asset } from 'expo-asset';
import Constants from 'expo-constants';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

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

  // useEffect
  useEffect(() => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 1_000,
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
              transform: [{ scale: animation }],
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
  return (
    <AnimateAppLoader image={logo}>
      <StatusBar style="auto" animated />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="posts" options={{ presentation: 'modal' }} />
      </Stack>
    </AnimateAppLoader>
  );
}

export default function RootLayout() {
  return <RootLayoutNav />;
}
