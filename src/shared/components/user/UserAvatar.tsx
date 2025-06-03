import defaultAvatar from '@/assets/images/default-user-avatar.png';
import { Image, View } from 'react-native';

interface UserAvatarProps {
  avatar?: string;
  name: string;
}

export default function UserAvatar({ avatar, name }: UserAvatarProps) {
  return (
    <View className="flex size-full items-center justify-center rounded-full">
      <Image
        className="size-full"
        source={
          avatar
            ? {
                uri: avatar,
              }
            : defaultAvatar
        }
        alt="avatar"
      />
    </View>
  );
}
