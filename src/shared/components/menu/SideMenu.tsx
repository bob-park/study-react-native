import { Modal, SafeAreaView, TouchableOpacity, useColorScheme } from 'react-native';

import { BlurView } from 'expo-blur';

interface SideMenuProps {
  open: boolean;
  onClose?: () => void;
}

export default function SideMenu({ open, onClose }: Readonly<SideMenuProps>) {
  // hooks
  const colorScheme = useColorScheme();

  // handle
  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <Modal visible={open} animationType="fade" transparent onRequestClose={handleClose}>
      <BlurView
        className="relative flex flex-col items-center justify-center gap-2"
        intensity={colorScheme === 'dark' ? 0 : 10}
        tint="light"
      >
        {/* outside */}
        <TouchableOpacity className="absolute bottom-0 left-0 right-0 top-0" activeOpacity={1} onPress={handleClose} />

        <SafeAreaView></SafeAreaView>
      </BlurView>
    </Modal>
  );
}
