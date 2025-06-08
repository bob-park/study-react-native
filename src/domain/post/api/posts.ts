import delay from '@/utils/delay';

import ky from 'ky';

export async function getPosts(searchParams: { text?: string; type?: string; cursor?: number }) {
  const result = await ky
    .get('/api/posts', {
      searchParams,
    })
    .json<{ posts: Post[] }>();

  await delay(1_000);

  return result.posts;
}
