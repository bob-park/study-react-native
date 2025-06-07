import { useState } from 'react';

import { FlatList, Text, TextInput, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import Post from '@/domain/post/components/Post';
import { usePosts } from '@/domain/post/query/posts';

export default function Search() {
  // state
  const [searchText, setSearchText] = useState<string>('');

  // query
  const { posts: data } = usePosts();
  const { posts, users } = data;

  return (
    <View className="flex size-full flex-col items-center gap-2 dark:bg-black">
      {/* search form*/}
      <View className="w-full px-6 py-2 dark:bg-gray-950">
        <View className="flex h-16 flex-row items-center justify-center rounded-2xl border-[1px] border-gray-500 px-5 py-2 dark:bg-black">
          <View className="w-20 flex-none items-center justify-center pl-8">
            <Ionicons name="search" size={24} color="gray" />
          </View>

          <TextInput
            className="w-full text-xl"
            placeholder="Search"
            placeholderTextColor="gray"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
        </View>
      </View>

      {/* result */}
      <View className="mb-20 w-full">
        <View className="flex gap-3">
          <FlatList
            className="w-full"
            data={posts}
            keyExtractor={(post) => `posts_list_item_${post.id}`}
            renderItem={({ item, index }) => (
              <Post post={{ ...item, user: users.find((user) => user.id === item.userId) }} />
            )}
            keyboardShouldPersistTaps="handled"
            ListHeaderComponent={
              <View className="flex w-full flex-col items-center gap-2">
                <View className="w-full pl-3">
                  <Text className="font-semibold text-gray-500">Follow suggestions</Text>
                </View>
              </View>
            }
          />
        </View>
      </View>
    </View>
  );
}
