import { Text, TouchableOpacity, View } from 'react-native';

import cx from 'classnames';

interface TabMenuProps {
  children?: React.ReactNode;
}

export default function TabMenu({ children }: TabMenuProps) {
  return <View className="flex w-full flex-row items-center justify-center">{children}</View>;
}

interface TabMenuItemProps {
  active?: boolean;
  text: string;
  onPress?: () => void;
}

export function TabMenuItem({ active = false, text, onPress }: TabMenuItemProps) {
  // handle
  const handleClick = () => {
    onPress && onPress();
  };

  return (
    <View
      className={cx('h-10 flex-1 border-b-2', {
        'border-b-gray-300': !active,
      })}
    >
      <TouchableOpacity className="w-full items-center" activeOpacity={0.8} onPress={handleClick}>
        <Text className={cx('text-lg', active ? 'font-bold' : 'text-gray-500')}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
}
