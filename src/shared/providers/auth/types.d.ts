type UserRole = 'ROLE_ADMIN' | 'ROLE_MANAGER' | 'ROLE_USER';

interface User {
  role: UserRole;
  id?: string;
  uniqueId: string;
  userId: string;
  username: string;
  profileImageUrl?: string;
  isVerified?: boolean;
}

interface UserInfo {
  sub: string;
  profile: User;
}
