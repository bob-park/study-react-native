import { getPosts } from '@/domain/post/api/posts';

import { InfiniteData, QueryKey, useInfiniteQuery } from '@tanstack/react-query';

const DEFAULT_CURSOR_SIZE = 10;

export function usePosts(searchParams: { text?: string }) {
  const { data, fetchNextPage, isFetching, hasNextPage, refetch } = useInfiniteQuery<
    Post[],
    unknown,
    InfiniteData<Post[]>,
    QueryKey,
    { cursor: number }
  >({
    queryKey: ['posts', searchParams],
    queryFn: ({ pageParam }) => getPosts({ ...searchParams, ...pageParam }),
    initialPageParam: {
      cursor: 0,
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) {
        return null;
      }

      const nextCursor = allPages.length * DEFAULT_CURSOR_SIZE;

      return {
        cursor: nextCursor,
      };
    },
  });

  return { pages: data?.pages || ([] as Post[][]), isLoading: isFetching, fetchNextPage, hasNextPage, refetch };
}
