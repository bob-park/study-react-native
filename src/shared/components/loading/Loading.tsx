import { ActivityIndicator, View } from 'react-native';

export default function Loading() {
  return (
    <View className="flex flex-col items-center justify-center">
      <ActivityIndicator size="large" />
    </View>
  );
}
