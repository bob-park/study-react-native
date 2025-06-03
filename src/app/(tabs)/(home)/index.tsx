import TabMenu, { TabMenuItem } from '@/shared/components/menu/TabMenu';

import { usePathname, useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
  // hooks
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View className="flex size-full flex-col items-center gap-2">
      <ScrollView className="w-full">
        {/* header menu */}
        <View className="">
          <TabMenu>
            <TabMenuItem text="추천" active={pathname === '/'} onPress={() => router.push('/')} />
            <TabMenuItem text="팔로잉" active={pathname === '/following'} onPress={() => router.push('/following')} />
          </TabMenu>
        </View>

        <View className="h-[900px]">
          <TouchableOpacity onPress={() => router.push('/[username]/posts/1')}>
            <Text>post1</Text>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity onPress={() => router.push('/[username]/posts/2')}>
            <Text>post2</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
