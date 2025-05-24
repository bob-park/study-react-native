import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
  // hooks
  const router = useRouter();
  const { username } = useLocalSearchParams();

  return (
    <View className="flex size-full flex-col items-center justify-center gap-2">
      <View>
        <TouchableOpacity onPress={() => router.push(`/${username}`)}>
          <Text>Threads</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity onPress={() => router.push(`/${username}/replies`)}>
          <Text>Replies</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity onPress={() => router.push(`/${username}/reposts`)}>
          <Text>Reposts</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
