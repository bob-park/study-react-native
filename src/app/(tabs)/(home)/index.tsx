import { View } from 'react-native';

import Post from '@/domain/post/components/Post';
import { usePosts } from '@/domain/post/query/posts';
import Loading from '@/shared/components/loading/Loading';

import { FlashList } from '@shopify/flash-list';

export default function Index() {
  // query
  const { pages, fetchNextPage, isLoading, refetch } = usePosts({});
  const posts = pages.reduce((acc, current) => acc.concat(current), []);

  // handle
  const handleEndReached = () => {
    fetchNextPage();
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <View className="flex size-full flex-col items-center gap-2 dark:bg-black">
      <FlashList
        className="w-screen"
        data={posts}
        renderItem={({ item, index }) => <Post post={item} />}
        ListFooterComponent={isLoading ? <Loading /> : null}
        refreshing={isLoading}
        onRefresh={handleRefresh}
        onEndReached={handleEndReached}
        onEndReachedThreshold={2}
      />
    </View>
  );
}
