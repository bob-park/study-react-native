import { useContext } from 'react';

import { Text, TouchableOpacity, View } from 'react-native';

import {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
  createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';

import { withLayoutContext } from 'expo-router';

import { MaterialIcons } from '@expo/vector-icons';

import { useUser } from '@/domain/user/query/users';
import UserAvatar from '@/shared/components/user/UserAvatar';
import { AuthContext } from '@/shared/providers/auth/AuthProvider';
import { ThemeContext } from '@/shared/providers/theme/ThemeProvider';

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function UsernameLayout() {
  // context
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  // query
  const { user: data } = useUser(user?.userId);

  return (
    <View className="flex size-full flex-col items-start gap-2 dark:bg-black">
      {/* user info*/}
      <View className="mt-2 flex w-full flex-row items-center justify-between gap-2 px-4">
        <View className="flex flex-col gap-1">
          <View className="flex flex-row items-center gap-2">
            <Text className="text-2xl font-semibold dark:text-white">{data?.username}</Text>
            <MaterialIcons name="verified" size={20} color="#0ea5e9" />
          </View>
          <View className="">
            <Text className="text-lg dark:text-white">{user?.userId}</Text>
          </View>
        </View>

        <View className="size-24">
          <UserAvatar avatar={data?.profileImageUrl} name={data?.username || ''} />
        </View>
      </View>

      {/* follower */}
      <View className="mt-3">
        <View className="flex flex-row items-center justify-between gap-2 px-4">
          <View className="">
            <Text className="text-lg text-gray-500 dark:text-gray-300">팔로워 0명</Text>
          </View>
          <View className=""></View>
        </View>
      </View>

      {/* profile modify button */}
      <View className="mt-2">
        <View className="flex flex-row items-center justify-between gap-2 px-4">
          <TouchableOpacity className="h-10 w-full items-center justify-center rounded-xl border-[1px] border-gray-300">
            <Text className="dark:text-white">프로필 수정</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex size-full flex-row">
        <MaterialTopTabs
          screenOptions={{
            tabBarStyle: { backgroundColor: 'none' },
            tabBarLabelStyle: { color: theme === 'light' ? 'black' : 'white', fontWeight: 'bold' },
            tabBarIndicatorStyle: { backgroundColor: theme === 'light' ? 'black' : 'white' },
          }}
        >
          <MaterialTopTabs.Screen name="index" options={{ title: '스레드' }} />
          <MaterialTopTabs.Screen name="replies" options={{ title: '답글' }} />
          <MaterialTopTabs.Screen name="reposts" options={{ title: '리포스트' }} />
        </MaterialTopTabs>
      </View>
    </View>
  );
}
