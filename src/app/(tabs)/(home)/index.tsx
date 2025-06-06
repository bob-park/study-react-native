import { Text, TouchableOpacity, View } from 'react-native';

import * as WebBrowser from 'expo-web-browser';

export default function Index() {
  return (
    <View className="flex size-full flex-col items-center gap-2 dark:bg-black">
      <View className="mt-10">
        <TouchableOpacity
          className="h-10 w-20 items-center justify-center rounded-2xl bg-gray-300"
          onPress={() => WebBrowser.openBrowserAsync('https://naver.com')}
        >
          <Text>click</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
