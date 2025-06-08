import { useContext } from 'react';

import { TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

import { useRouter } from 'expo-router';

import logoDarkMode from '@/assets/images/logo-darkmode.png';
import logo from '@/assets/images/logo.png';
import { RefreshContext } from '@/shared/providers/refresh/RefreshProvider';
import { ThemeContext } from '@/shared/providers/theme/ThemeProvider';

export default function AppLogo() {
  // context
  const { theme } = useContext(ThemeContext);
  const { pullDownPosition } = useContext(RefreshContext);

  // hoos
  const router = useRouter();

  const rotateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${pullDownPosition.value * 3 * 2}deg` }],
    };
  });

  return (
    <TouchableOpacity onPress={() => router.push('/')}>
      <Animated.Image
        style={[rotateStyle]}
        className="size-10 invert-0"
        source={theme === 'light' ? logo : logoDarkMode}
        alt="logo"
      />
    </TouchableOpacity>
  );
}
