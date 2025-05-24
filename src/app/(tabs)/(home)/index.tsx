import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
  // hooks
  const router = useRouter();

  return (
    <View className="flex size-full flex-col items-center justify-center gap-2">
      <View>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Text>For you</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity onPress={() => router.push('/following')}>
          <Text>Following</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity onPress={() => router.push('/[username]/posts/1')}>
          <Text>post1</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity onPress={() => router.push('/[username]/posts/2')}>
          <Text>post2</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
