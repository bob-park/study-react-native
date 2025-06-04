import { useContext, useRef, useState } from 'react';

import { Animated, Image, Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';

import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';

import { Tabs, useRouter } from 'expo-router';

import { AntDesign, Entypo, FontAwesome6, Ionicons } from '@expo/vector-icons';

import logoDarkMode from '@/assets/images/logo-darkmode.png';
import logo from '@/assets/images/logo.png';
import SideMenu from '@/shared/components/menu/SideMenu';
import { AuthContext } from '@/shared/providers/auth/AuthProvider';
import { ThemeContext } from '@/shared/providers/theme/ThemeProvider';

const AnimatedTabBarButton = ({ children, onPress, style, ...restProps }: BottomTabBarButtonProps) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  // handle
  const handlePressOut = () => {
    // Animated.spring(..) target value 보다 살짝 커졋다가 작아지는 효과
    // Animated.sequence(..) 순차적으로 animation 실행
    Animated.sequence([
      Animated.spring(scaleValue, {
        toValue: 1.2,
        useNativeDriver: true,
        speed: 200,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        speed: 200,
      }),
    ]).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressOut={handlePressOut}
      style={[style]}
      android_ripple={{ borderless: false, radius: 0 }}
    >
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>{children}</Animated.View>
    </Pressable>
  );
};

export default function TabLayout() {
  // context
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  // state
  const isLoggedIn = !!user;
  const [isLoginModelOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [openSideMenu, setOpenSideMenu] = useState<boolean>(false);

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
    <View className="size-full dark:bg-black">
      {/* logo */}
      <View className="relative mt-16 flex h-14 flex-row items-center justify-center gap-2">
        <TouchableOpacity onPress={() => router.push('/')}>
          <Image className="size-10 invert-0" source={theme === 'light' ? logo : logoDarkMode} alt="logo" />
        </TouchableOpacity>

        {!isLoggedIn && (
          <View className="absolute right-4 top-3">
            <TouchableOpacity
              className="h-8 w-16 items-center justify-center rounded-lg bg-black dark:bg-white"
              onPress={openLoginModal}
            >
              <Text className="font-bold text-white dark:text-black">로그인</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity className="absolute left-4 top-3" onPress={() => setOpenSideMenu(true)}>
          <Entypo name="menu" size={24} color={theme === 'light' ? 'black' : 'white'} />
        </TouchableOpacity>
      </View>

      {/* tabs */}
      <Tabs
        backBehavior="history" // default 가 initial route 이기 때문에 뒤로가기 하면 home 으로 감
        screenOptions={{
          headerShown: false,
          tabBarLabel: () => null,
          tabBarButton: (props) => <AnimatedTabBarButton {...props} />,
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
                router.navigate('/posts');
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
      <Modal
        visible={isLoginModelOpen}
        animationType="slide"
        presentationStyle="formSheet"
        onRequestClose={() => setIsLoginModalOpen(false)}
      >
        <View className="relative flex size-full flex-col rounded-t-2xl bg-white p-4 shadow-2xl">
          <View className="">
            <Text className="text-2xl font-bold">Login Modal</Text>
          </View>

          <View className="mt-[50%] w-full">
            <Pressable
              className="flex flex-row items-center justify-center gap-2 rounded-2xl bg-black p-4"
              onPress={() => {
                router.push('/login');
                closeLoginModal();
              }}
            >
              <FontAwesome6 name="threads" size={28} color="white" />
              <Text className="text-xl font-semibold text-white">로그인</Text>
            </Pressable>
          </View>

          <TouchableOpacity className="absolute right-6 top-6" onPress={closeLoginModal}>
            <Ionicons name="close" size={24} color="gray" />
          </TouchableOpacity>
        </View>
      </Modal>
      <SideMenu open={openSideMenu} onClose={() => setOpenSideMenu(false)} />
    </View>
  );
}
