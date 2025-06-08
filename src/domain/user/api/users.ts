import ky from 'ky';

export async function getUser(id: string) {
  const result = await ky.get(`/api/users/${id}`).json<{ user: User }>();

  return result.user;
}
