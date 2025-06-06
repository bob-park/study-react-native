type UserRole = 'ROLE_ADMIN' | 'ROLE_MANAGER' | 'ROLE_USER';

interface User {
  role: UserRole;
  uniqueId: string;
  userId: string;
  username: string;

}

interface UserInfo{
  sub: string;
  profile: User
}
