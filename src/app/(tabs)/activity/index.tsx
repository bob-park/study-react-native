import { View } from 'react-native';

import { usePathname, useRouter } from 'expo-router';

import NotFound from '@/app/+not-found';

import ActivityMenu, { ActivityMenuItem } from './_components/Menu';

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
    </View>
  );
}
