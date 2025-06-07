import delay from '@/utils/delay';

export async function getPosts() {
  const result = await fetch('/api/posts', { method: 'GET' })
    .then((res) => res.json())
    .then((data: { posts: Post[]; users: User[] }) => data);

  await delay(1_000);

  return result;
}
