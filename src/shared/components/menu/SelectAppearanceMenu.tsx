import { useContext } from 'react';

import { Modal, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

import { BlurView } from 'expo-blur';

import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import { ThemeContext } from '@/shared/providers/theme/ThemeProvider';

import cx from 'classnames';

interface AppearanceMenuProps {
  open: boolean;
  onClose?: () => void;
}

export default function SelectAppearanceMenu({ open, onClose }: Readonly<AppearanceMenuProps>) {
  // context
  const { theme, preference, onUpdatePreference } = useContext(ThemeContext);

  // handle
  const handleClose = () => {
    onClose && onClose();
  };

  const handleChangeScheme = (scheme: 'dark' | 'light' | 'system') => {
    onUpdatePreference(scheme);
  };

  return (
    <Modal visible={open} animationType="none" transparent onRequestClose={handleClose}>
      <BlurView
        className="relative flex flex-col items-center justify-center gap-2"
        intensity={preference === 'dark' ? 0 : 10}
        tint="light"
      >
        {/* outside */}
        <TouchableOpacity className="absolute left-0 top-0 h-screen w-screen" activeOpacity={1} onPress={handleClose} />

        <SafeAreaView
          className="absolute left-3 top-[90px] z-50 w-[50%] rounded-2xl border-[1px] border-gray-300 bg-white dark:bg-black"
          style={{ shadowColor: '#000', shadowOpacity: 0.15, shadowOffset: { width: 2, height: 4 } }}
        >
          <View className="flex w-full flex-col items-center justify-center gap-2 p-3">
            <View className="relative flex w-full flex-row items-center justify-center gap-3">
              <View className="items-center justify-center">
                <Text className="text-lg font-semibold dark:text-white">Appearance</Text>
              </View>

              <TouchableOpacity className="absolute left-0 top-0" onPress={handleClose}>
                <Ionicons name="arrow-back-outline" size={24} color={theme === 'light' ? 'black' : 'white'} />
              </TouchableOpacity>
            </View>

            <View className="mt-3 flex flex-row items-center justify-center gap-2">
              <TouchableOpacity
                className={cx(
                  'size-10 items-center justify-center rounded-xl',
                  preference === 'light' && 'bg-gray-300',
                )}
                disabled={preference === 'light'}
                onPress={() => handleChangeScheme('light')}
              >
                <MaterialIcons
                  name="light-mode"
                  size={24}
                  color={theme === 'light' || preference === 'light' ? 'black' : 'white'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                className={cx('size-10 items-center justify-center rounded-xl', preference === 'dark' && 'bg-gray-300')}
                disabled={preference === 'dark'}
                onPress={() => handleChangeScheme('dark')}
              >
                <MaterialIcons
                  name="dark-mode"
                  size={24}
                  color={theme === 'light' || preference === 'dark' ? 'black' : 'white'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                className={cx(
                  'size-10 items-center justify-center rounded-xl',
                  preference === 'system' && 'bg-gray-300',
                )}
                disabled={preference === 'system'}
                onPress={() => handleChangeScheme('system')}
              >
                <MaterialCommunityIcons
                  name="desktop-mac"
                  size={24}
                  color={theme === 'light' || preference === 'system' ? 'black' : 'white'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </BlurView>
    </Modal>
  );
}
