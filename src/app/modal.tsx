import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function Modal() {
  // hooks
  const router = useRouter();

  return (
    <View className="relative m-10 flex size-full flex-col items-center gap-2">
      <View className="w-full">
        <Text className="text-2xl font-bold">Modal</Text>
      </View>

      <Pressable className="absolute bottom-20 w-full items-center" onPress={() => router.back()}>
        <Text className="text-xl font-bold">Close</Text>
      </Pressable>
    </View>
  );
}
