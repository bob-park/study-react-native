import { Animated, Image, Text, TouchableOpacity } from 'react-native';

import { AntDesign, Feather, FontAwesome6, MaterialIcons } from '@expo/vector-icons';

import UserAvatar from '@/shared/components/user/UserAvatar';

import { FlashList } from '@shopify/flash-list';

import View = Animated.View;

interface PostProps {
  post: Post;
}

export default function Post({ post }: Readonly<PostProps>) {
  return (
    <View className="flex w-full flex-row gap-3 p-2">
      {/* avatar */}
      <View className="size-16 flex-none">
        <UserAvatar avatar={post.user.profileImageUrl} name={post.user.username} />
      </View>

      {/* contents */}
      <View className="border-b-[1px] border-gray-300 pb-3">
        <View className="flex flex-col gap-1">
          <View className="">
            <View className="flex flex-row items-center justify-between gap-2">
              {/* user info */}
              <View className="">
                <View className="flex flex-col gap-1">
                  <View className="flex flex-row items-center gap-2">
                    <Text className="text-lg font-semibold dark:text-white">{post.user.userId}</Text>

                    <MaterialIcons name="verified" size={20} color="#0ea5e9" />
                  </View>
                  <View className="w-full">
                    <Text className="text-lg text-gray-500 dark:text-gray-300" numberOfLines={1} ellipsizeMode="tail">
                      {post.user.username}
                    </Text>
                  </View>
                </View>
              </View>

              {/* button */}
              <View className="">
                <TouchableOpacity className="h-10 w-32 items-center justify-center rounded-xl bg-black dark:bg-white">
                  <Text className="text-xl font-bold text-white dark:text-black">Follow</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* contents */}
          <View className="mt-2 w-[300px]">
            <Text className="text-pretty text-base dark:text-white">{post.content}</Text>
          </View>

          {/* images */}
          {post.imageUrls.length > 0 && (
            <FlashList
              className="w-80"
              data={post.imageUrls}
              horizontal
              renderItem={({ item: uri, index: imageIndex }) => (
                <View className="relative ml-2 flex size-64">
                  <Image className="size-full rounded-2xl" source={{ uri }} alt="thread image" />
                </View>
              )}
            />
          )}

          {/* followers */}
          <View className="mb-2 mt-3">
            <View className="flex flex-row items-center justify-start gap-6">
              <View className="flex flex-row items-center justify-center gap-1">
                <AntDesign name="hearto" size={20} color="gray" />
                <Text className="text-gray-500 dark:text-gray-300">{post.likes}</Text>
              </View>

              <View className="flex flex-row items-center justify-center gap-1">
                <FontAwesome6 name="comments" size={20} color="gray" />
                <Text className="text-gray-500 dark:text-gray-300">{post.comments}</Text>
              </View>

              <View className="flex flex-row items-center justify-center gap-1">
                <AntDesign name="retweet" size={20} color="gray" />
                <Text className="text-gray-500 dark:text-gray-300">{post.reposts}</Text>
              </View>

              <View className="flex flex-row items-center justify-center gap-1">
                <Feather name="send" size={20} color="gray" />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
