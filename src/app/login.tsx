import { useContext } from 'react';

import { AuthContext } from '@/shared/providers/auth/AuthProvider';

import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function LoginPage() {
  // context
  const { onLogin } = useContext(AuthContext);

  // hooks
  const router = useRouter();

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
        <Pressable
          className="h-12 w-36 items-center justify-center rounded-2xl bg-black"
          onPress={() => onLogin({ username: 'bobpark', password: '12345' })}
        >
          <Text className="text-2xl font-semibold text-white">로그인</Text>
        </Pressable>
      </View>
    </View>
  );
}
