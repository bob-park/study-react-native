import { useContext } from 'react';

import { View } from 'react-native';

import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';

import { Slot, withLayoutContext } from 'expo-router';

import { AuthContext } from '@/shared/providers/auth/AuthProvider';

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function HomeLayout() {
  // context
  const { user } = useContext(AuthContext);

  // state
  const isLoggedIn = !!user;

  return (
    <View className="flex size-full flex-row">
      {isLoggedIn ? (
        <MaterialTopTabs
          screenOptions={{
            lazy: true, // 스와이프 될때, 로딩
            tabBarStyle: { backgroundColor: 'none' },
            tabBarIndicatorStyle: { backgroundColor: 'black' },
          }}
        >
          <MaterialTopTabs.Screen name="index" options={{ title: '추천' }} />
          <MaterialTopTabs.Screen name="following" options={{ title: '팔로우' }} />
        </MaterialTopTabs>
      ) : (
        <Slot />
      )}
    </View>
  );
}
