import TabMenu, { TabMenuItem } from '@/components/menu/TabMenu';

import cx from 'classnames';
import { usePathname, useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
  // hooks
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View className="flex size-full flex-col items-center gap-2">
      {/* header menu */}

      <View className="mt-24">
        <TabMenu>
          <TabMenuItem text="추천" active={pathname === '/'} onPress={() => router.push('/')} />
          <TabMenuItem text="팔로잉" active={pathname === '/following'} onPress={() => router.push('/following')} />
        </TabMenu>
      </View>

      <View>
        <TouchableOpacity onPress={() => router.push('/[username]/posts/1')}>
          <Text>post1</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity onPress={() => router.push('/[username]/posts/2')}>
          <Text>post2</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
