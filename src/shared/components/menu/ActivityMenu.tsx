import { Text, TouchableOpacity, View } from 'react-native';

import cx from 'classnames';

interface ActivityMenuProps {
  children?: React.ReactNode;
}

export default function ActivityMenu({ children }: ActivityMenuProps) {
  return <View className="flex w-full flex-row items-center justify-center gap-1">{children}</View>;
}

interface ActivityMenuItemProps {
  active?: boolean;
  text: string;
  onPress?: () => void;
}

export function ActivityMenuItem({ active = false, text, onPress }: ActivityMenuItemProps) {
  // handle
  const handleClick = () => {
    onPress && onPress();
  };

  return (
    <View className={cx('h-8 flex-none')}>
      <TouchableOpacity
        className={cx('w-full items-center rounded-full border-[1px] border-gray-300 px-4', {
          'bg-gray-300': active,
        })}
        activeOpacity={0.8}
        onPress={handleClick}
      >
        <Text
          className={cx('text-base font-extrabold', {
            'text-black': active,
            'dark:text-white': !active,
          })}
        >
          {text}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
