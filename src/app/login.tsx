import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Alert, Pressable, Text, View } from 'react-native';

export default function LoginPage() {
  // hooks
  const router = useRouter();

  // handle
  const handleLogin = () => {
    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'bobpark',
        password: '12345',
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
        }),
      )
      .catch((err) => {
        console.error(err);
        Alert.alert('Invalid credentials.');
      });
  };

  return (
    <View className="mt-20 flex flex-col items-center justify-center gap-2">
      <View className="relative flex w-full flex-row items-center justify-center gap-2">
        <View className="absolute left-2 top-1 ml-3">
          <Pressable className="" onPress={() => router.back()}>
            <Text className="text-xl">뒤로</Text>
          </Pressable>
        </View>
        <View>
          <Text className="text-2xl font-bold">로그인</Text>
        </View>
      </View>

      <View className="mt-20">
        <Pressable className="h-12 w-36 items-center justify-center rounded-2xl bg-black" onPress={handleLogin}>
          <Text className="text-2xl font-semibold text-white">로그인</Text>
        </Pressable>
      </View>
    </View>
  );
}
