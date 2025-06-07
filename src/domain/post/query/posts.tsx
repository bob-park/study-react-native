import { getPosts } from '@/domain/post/api/posts';

import { useQuery } from '@tanstack/react-query';

export function usePosts() {
  const { data, isLoading } = useQuery<{ posts: Post[]; users: User[] }>({
    queryKey: ['posts'],
    queryFn: () => getPosts(),
  });

  return { posts: data || { posts: [], users: [] }, isLoading };
}
