import { getPosts } from '@/domain/post/api/posts';

import { useQuery } from '@tanstack/react-query';

export function usePosts(searchParams: { text?: string }) {
  const { data, isLoading } = useQuery<{ posts: Post[]; users: User[] }>({
    queryKey: ['posts', searchParams],
    queryFn: () => getPosts(searchParams),
  });

  return { posts: data || { posts: [], users: [] }, isLoading };
}
