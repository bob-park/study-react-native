import { useState } from 'react';

import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

export default function TabLayout() {
  // state
  const isLoggedIn = true;
  const [isLoginModelOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // hooks
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
      <Tabs
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
