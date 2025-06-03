import { useState } from 'react';

import { Text, TouchableOpacity, View } from 'react-native';

export default function Counter() {
  // state
  const [count, setCount] = useState<number>(0);

  // handle
  const handleAdd = () => {
    setCount(count + 1);
  };

  const handleSubtract = () => {
    setCount(count - 1);
  };

  return (
    <View className="flex flex-col items-center justify-center gap-2">
      <View className="">
        <Text className="text-4xl">{count}</Text>
      </View>

      <View className="">
        <View className="flex flex-row items-center justify-center gap-3">
          <TouchableOpacity
            className="h-20 w-48 flex-none items-center justify-center rounded-2xl bg-sky-300"
            onPress={handleAdd}
          >
            <Text className="text-2xl">+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="h-20 w-48 items-center justify-center rounded-2xl bg-sky-300"
            onPress={handleSubtract}
          >
            <Text className="text-2xl">-</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
