import { useContext, useState } from 'react';

import { Modal, SafeAreaView, Text, TouchableOpacity, View, useColorScheme } from 'react-native';

import { BlurView } from 'expo-blur';

import { Ionicons } from '@expo/vector-icons';

import SelectAppearanceMenu from '@/shared/components/menu/SelectAppearanceMenu';
import { AuthContext } from '@/shared/providers/auth/AuthProvider';
import { ThemeContext } from '@/shared/providers/theme/ThemeProvider';

interface SideMenuProps {
  open: boolean;
  onClose?: () => void;
}

export default function SideMenu({ open, onClose }: Readonly<SideMenuProps>) {
  // context
  const { user, onLogout } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  // state
  const isLoggedIn = !!user;
  const [showSelectAppearance, setShowSelectAppearance] = useState<boolean>(false);

  // hooks
  const colorScheme = useColorScheme();

  // handle
  const handleClose = () => {
    onClose && onClose();
  };

  const handleLogout = () => {
    onLogout();

    onClose && onClose();
  };

  return (
    <>
      <Modal visible={open && !showSelectAppearance} animationType="fade" transparent onRequestClose={handleClose}>
        <BlurView
          className="relative flex flex-col items-center justify-center gap-2"
          intensity={colorScheme === 'dark' ? 0 : 10}
          tint="light"
        >
          {/* outside */}
          <TouchableOpacity
            className="absolute left-0 top-0 h-screen w-screen"
            activeOpacity={1}
            onPress={handleClose}
          />

          <SafeAreaView
            className="absolute left-3 top-[90px] z-50 w-[70%] max-w-[320px] rounded-2xl border-[1px] border-gray-300 bg-white dark:bg-black"
            style={{
              shadowColor: theme === 'light' ? '#000' : '#fff',
              shadowOpacity: 0.15,
              shadowOffset: { width: 4, height: 4 },
            }}
          >
            <View className="">
              <TouchableOpacity
                className="items-start justify-center px-5 py-3"
                onPress={() => setShowSelectAppearance(true)}
              >
                <Text className="text-lg font-semibold dark:text-white">Appearance</Text>
                <Ionicons className="absolute right-5 top-4" name="chevron-forward" size={20} color="#888" />
              </TouchableOpacity>
              <TouchableOpacity className="items-start justify-center px-5 py-3">
                <Text className="text-lg font-semibold dark:text-white">Insights</Text>
              </TouchableOpacity>
              <TouchableOpacity className="items-start justify-center px-5 py-3">
                <Text className="text-lg font-semibold dark:text-white">Settings</Text>
              </TouchableOpacity>

              <View className="h-[1px] w-full border-[0.5px] border-gray-400" />

              <TouchableOpacity className="items-start justify-center px-5 py-3">
                <Text className="text-lg font-semibold dark:text-white">Report a problem</Text>
              </TouchableOpacity>

              {isLoggedIn && (
                <TouchableOpacity className="items-start justify-center px-5 py-3" onPress={handleLogout}>
                  <Text className="text-lg font-semibold text-red-600">Log out</Text>
                </TouchableOpacity>
              )}
            </View>
          </SafeAreaView>
        </BlurView>
      </Modal>
      <SelectAppearanceMenu open={showSelectAppearance} onClose={() => setShowSelectAppearance(false)} />
    </>
  );
}
