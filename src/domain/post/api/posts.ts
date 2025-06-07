import delay from '@/utils/delay';

import ky from 'ky';

export async function getPosts(searchParams: { text?: string }) {
  const result = await ky
    .get('/api/posts', {
      searchParams,
    })
    .json<{ posts: Post[]; users: User[] }>();

  await delay(1_000);

  return result;
}
