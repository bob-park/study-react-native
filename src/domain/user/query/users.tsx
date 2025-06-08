import { getUser } from '@/domain/user/api/users';

import { useQuery } from '@tanstack/react-query';

export function useUser(id?: string) {
  const { data } = useQuery<User>({
    queryKey: ['users', id],
    queryFn: () => getUser(id || ''),
    enabled: !!id,
  });

  return { user: data };
}
