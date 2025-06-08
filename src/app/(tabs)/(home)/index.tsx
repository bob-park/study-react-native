import { useContext, useEffect, useRef, useState } from 'react';

import { PanResponder, View } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import * as Haptics from 'expo-haptics';

import { useQueryClient } from '@tanstack/react-query';

import LoadingLottie from '@/assets/lotties/loading.json';
import Post from '@/domain/post/components/Post';
import { usePosts } from '@/domain/post/query/posts';
import Loading from '@/shared/components/loading/Loading';
import { RefreshContext } from '@/shared/providers/refresh/RefreshProvider';

import { FlashList } from '@shopify/flash-list';
import LottieView from 'lottie-react-native';

const MAX_REFRESH_SCROLL = 120;
const AnimatedFlashList = Animated.createAnimatedComponent(FlashList<Post>);

export default function Index() {
  // context
  const { pullDownPosition } = useContext(RefreshContext);

  // useRef 와 같이 동작하는 것처럼 보이는데, animated 같이 사용한다.
  // react-native-reanimated 와 같이 사용됨
  const scrollPosition = useSharedValue(0);
  const isReadyToRefresh = useSharedValue(false);

  // ref
  const handleOnPanRelease = () => {
    if (scrollPosition.value > 0) {
      return;
    }

    pullDownPosition.set(withTiming(isReadyToRefresh.value ? MAX_REFRESH_SCROLL / 2 : 0, { duration: 1_000 }));

    if (isReadyToRefresh.value) {
      handleRefresh();
    }
  };

  // 이것은 android 에서 동작하는 거 같음
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        if (scrollPosition.value > 0) {
          return;
        }

        pullDownPosition.set(Math.max(Math.min(gestureState.dy, MAX_REFRESH_SCROLL), 0));

        if (pullDownPosition.value >= MAX_REFRESH_SCROLL / 2 && !isReadyToRefresh.value) {
          isReadyToRefresh.set(true);
        }

        if (pullDownPosition.value < MAX_REFRESH_SCROLL / 2 && isReadyToRefresh.value) {
          isReadyToRefresh.set(false);
        }
      },
      onPanResponderRelease: handleOnPanRelease,
      onPanResponderTerminate: handleOnPanRelease,
    }),
  );

  const pullDownStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: pullDownPosition.value }],
    };
  });

  // state
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // query
  const queryClient = useQueryClient();
  const { pages, fetchNextPage, isLoading } = usePosts({});
  const posts = pages.reduce((acc, current) => acc.concat(current), []);

  // hooks
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollPosition.value = e.contentOffset.y;
    },
  });

  // useEffect
  useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [isRefreshing]);

  useEffect(() => {
    if (!isLoading && isRefreshing) {
      pullDownPosition.set(withTiming(0, { duration: 180 }));

      setIsRefreshing(false);
    }
  }, [isLoading, isRefreshing]);

  // handle
  const handleEndReached = () => {
    fetchNextPage();
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['posts', {}] });
    setIsRefreshing(true);
  };

  return (
    <View className="size-full">
      {isRefreshing && (
        <View className="absolute left-0 top-0 flex h-[60px] w-full flex-col items-center justify-center bg-gray-200 py-6">
          <LottieView style={{ width: 100, height: 100 }} source={LoadingLottie} autoPlay loop />
        </View>
      )}
      <Animated.View
        style={[pullDownStyle]}
        className="flex size-full flex-col items-center gap-2 dark:bg-black"
        {...panResponder.current.panHandlers}
      >
        <AnimatedFlashList
          className="w-screen"
          data={posts}
          renderItem={({ item, index }) => <Post post={item} />}
          ListFooterComponent={isLoading ? <Loading /> : null}
          refreshControl={<View />}
          refreshing={isLoading}
          scrollEventThrottle={16} // 16 이 제일 최소값, 일정 주기로 스크롤 이벤트가 발생하는 것을 끄기
          onScroll={scrollHandler}
          onEndReached={handleEndReached}
          onEndReachedThreshold={2}
        />
      </Animated.View>
    </View>
  );
}
