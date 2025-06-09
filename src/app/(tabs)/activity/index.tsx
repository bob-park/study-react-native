import { useContext, useState } from 'react';

import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { usePathname, useRouter } from 'expo-router';

import NotFound from '@/app/+not-found';
import ActivityMenu, { ActivityMenuItem } from '@/shared/components/menu/ActivityMenu';
import { NotificationContext } from '@/shared/providers/notification/NotificationProvider';

export default function Index() {
  // context
  const { onSendNotification } = useContext(NotificationContext);

  // state
  const [remoteToken, setRemoteToken] = useState<string>('');

  // hooks
  const router = useRouter();
  const pathname = usePathname();

  if (
    ![
      '/activity',
      '/activity/follows',
      '/activity/replies',
      '/activity/mentions',
      '/activity/reposts',
      '/activity/verified',
    ].includes(pathname)
  ) {
    // notFound() 없음
    return <NotFound />;
  }

  // handle
  const handleAddToastMessage = () => {
    Toast.hide();
    Toast.show({
      type: 'selectedToast',
      text1: '계좌털이범',
      text2: `안녕? 나는 너의 계좌에서 ${Math.floor(Math.random() * 100_000).toLocaleString()}원을 훔쳐갔지`,
      props: {
        avatar: `https://avatars.githubusercontent.com/u/${Math.floor(Math.random() * 100_000)}?v=4`,
      },
    });
  };

  const handlePushNotification = () => {
    onSendNotification({
      title: '이것은 알림이여',
      description: '이것은 테스트하는 것이여',
    });
  };

  const handleRemotePushNotification = () => {
    if (!remoteToken) {
      return;
    }

    onSendNotification({
      to: remoteToken,
      title: '이게 뭐여?',
      description: '이것은 원격 푸시 알림이여',
    });
  };

  return (
    <View className="flex size-full flex-col items-center gap-2 dark:bg-black">
      <View className="mt-3 w-full border-b-[1px] border-gray-300 pb-2">
        <ActivityMenu>
          <ActivityMenuItem text="모두" active={pathname === '/activity'} onPress={() => router.push('/activity')} />
          <ActivityMenuItem
            text="요청"
            active={pathname === '/activity/follows'}
            onPress={() => router.navigate('/activity/follows')}
          />
          <ActivityMenuItem
            text="답글"
            active={pathname === '/activity/replies'}
            onPress={() => router.navigate('/activity/replies')}
          />
          <ActivityMenuItem
            text="언급"
            active={pathname === '/activity/mentions'}
            onPress={() => router.navigate('/activity/mentions')}
          />
          <ActivityMenuItem
            text="인용"
            active={pathname === '/activity/verified'}
            onPress={() => router.navigate('/activity/verified')}
          />
          <ActivityMenuItem
            text="리포스트"
            active={pathname === '/activity/reposts'}
            onPress={() => router.navigate('/activity/reposts')}
          />
        </ActivityMenu>
      </View>

      <View className="mt-3 flex w-full flex-col items-center justify-center gap-5">
        <TouchableOpacity
          className="h-10 w-24 items-center justify-center rounded-2xl bg-gray-300"
          onPress={handleAddToastMessage}
        >
          <Text className="">Click</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="h-10 w-36 items-center justify-center rounded-2xl bg-gray-300"
          onPress={handlePushNotification}
        >
          <Text className="">Push Notification</Text>
        </TouchableOpacity>

        <View className="flex w-full flex-col items-center gap-3">
          <View className="w-full px-10">
            <TextInput
              className="w-full dark:text-white"
              multiline
              placeholder="token"
              placeholderTextColor="gray"
              value={remoteToken}
              onChangeText={(e) => setRemoteToken(e)}
            />
          </View>

          <TouchableOpacity
            className="h-10 w-56 items-center justify-center rounded-2xl bg-gray-300"
            onPress={handleRemotePushNotification}
          >
            <Text className="">Remote Push Notification</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
