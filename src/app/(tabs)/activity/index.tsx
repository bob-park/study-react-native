import NotFound from '@/app/+not-found';

import { usePathname, useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
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

  return (
    <View className="flex size-full flex-col items-center justify-center gap-2">
      <View>
        <TouchableOpacity onPress={() => router.push('/activity')}>
          <Text>All</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity onPress={() => router.push('/activity/follows')}>
          <Text>Follows</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity onPress={() => router.push('/activity/replies')}>
          <Text>Replies</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity onPress={() => router.push('/activity/mentions')}>
          <Text>Mentions</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity onPress={() => router.push('/activity/reposts')}>
          <Text>Reposts</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity onPress={() => router.push('/activity/verified')}>
          <Text>Verified</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
