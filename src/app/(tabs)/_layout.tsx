import { useState } from 'react';

import logo from '@/assets/images/logo.png';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs, useRouter } from 'expo-router';
import { Image, Modal, Text, TouchableOpacity, View } from 'react-native';

export default function TabLayout() {
  // state
  const isLoggedIn = true;
  const [isLoginModelOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // hooks
  /**
   * <pre>
   *     router.push(..)
   *       - 모든 history 에 저장
   *     router.replace(..)
   *       - 마지막꺼대체
   *     router.navigate(..)
   *       - 여러번 눌렀을 경우 중복을 제거하고 저장함
   * </pre>
   */
  const router = useRouter();

  // handle
  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <>
      {/* logo */}
      <BlurView
        className="relative mt-16 flex h-12 flex-row items-center justify-center gap-2"
        intensity={50}
        experimentalBlurMethod="dimezisBlurView"
      >
        <TouchableOpacity onPress={() => router.push('/')}>
          <Image className="size-10" source={logo} alt="logo" />
        </TouchableOpacity>

        <View className="absolute right-4 top-2">
          <TouchableOpacity
            className="h-8 w-16 items-center justify-center rounded-lg bg-black"
            onPress={openLoginModal}
          >
            <Text className="font-bold text-white">로그인</Text>
          </TouchableOpacity>
        </View>
      </BlurView>

      {/* tabs */}
      <Tabs
        backBehavior="history" // default 가 initial route 이기 때문에 뒤로가기 하면 home 으로 감
        screenOptions={{
          headerShown: false,
          tabBarLabel: () => null,
        }}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Entypo name="home" size={24} color="black" />
              ) : (
                <AntDesign name="home" size={24} color="gray" />
              ),
          }}
        />

        <Tabs.Screen
          name="search"
          options={{
            tabBarIcon: ({ focused }) => <Ionicons name="search" size={24} color={focused ? 'black' : 'gray'} />,
          }}
        />
        <Tabs.Screen
          name="add"
          listeners={{
            tabPress: (e) => {
              e.preventDefault();

              if (isLoggedIn) {
                router.navigate('/modal');
              } else {
                openLoginModal();
              }
            },
          }}
          options={{
            tabBarIcon: ({ focused }) => <Ionicons name="add" size={24} color={focused ? 'black' : 'gray'} />,
          }}
        />
        <Tabs.Screen
          name="activity"
          listeners={{
            tabPress: (e) => {
              if (!isLoggedIn) {
                e.preventDefault();
                openLoginModal();
              }
            },
          }}
          options={{
            tabBarIcon: ({ focused }) => (
              <AntDesign name={focused ? 'heart' : 'hearto'} size={24} color={focused ? 'black' : 'gray'} />
            ),
          }}
        />
        <Tabs.Screen
          name="[username]"
          listeners={{
            tabPress: (e) => {
              if (!isLoggedIn) {
                e.preventDefault();
                openLoginModal();
              }
            },
          }}
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={focused ? 'black' : 'gray'} />
            ),
          }}
        />

        <Tabs.Screen name="(posts)/[username]/posts/[postId]" options={{ href: null }} />
      </Tabs>
      <Modal visible={isLoginModelOpen} transparent animationType="slide">
        <View className="relative mt-[90%] flex size-full flex-col rounded-t-2xl bg-white p-4 shadow-2xl">
          <View className="">
            <Text className="text-2xl font-bold">Login Modal</Text>
          </View>

          <TouchableOpacity className="absolute right-6 top-6" onPress={closeLoginModal}>
            <Ionicons name="close" size={24} color="gray" />
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}
