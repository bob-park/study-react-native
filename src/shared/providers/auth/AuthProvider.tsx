import { createContext, useEffect, useMemo, useState } from 'react';

import { Alert } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

interface AuthContext {
  user?: User;
  onLogin: ({ username, password }: { username: string; password: string }) => void;
  onLogout: () => void;
}

export const AuthContext = createContext<AuthContext>({ onLogin: () => {}, onLogout: () => {} });

export default function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  // state
  const [user, setUser] = useState<User>();

  // hooks
  const router = useRouter();

  // useEffect
  useEffect(() => {
    AsyncStorage.getItem('user').then((data) => {
      if (!data) {
        return;
      }

      setUser(JSON.parse(data) as User);

      // TODO: access Token 체크
    });
  }, []);

  // handle
  const handleLogin = ({ username, password }: { username: string; password: string }) => {
    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(await res.text());
        }

        return res.json();
      })
      .then((data) =>
        Promise.all([
          SecureStore.setItemAsync('accessToken', data.accessToken),
          SecureStore.setItemAsync('accessToken', data.refreshToken),
          AsyncStorage.setItem('user', JSON.stringify(data.user)),
        ]).then(() => {
          router.push('/(tabs)');
          setUser(data.user);
        }),
      )
      .catch((err) => {
        console.error(err);
        Alert.alert('Invalid credentials.');
      });
  };

  const handleLogout = () => {
    setUser(undefined);
  };

  // memorize
  const memorizeValue = useMemo<AuthContext>(() => ({ user, onLogin: handleLogin, onLogout: handleLogout }), [user]);

  return <AuthContext value={memorizeValue}>{children}</AuthContext>;
}
