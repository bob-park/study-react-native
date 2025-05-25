import { useEffect, useRef, useState } from 'react';

import UserAvatar from '@/components/user/UserAvatar';

import { AntDesign, Entypo, Feather, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import cx from 'classnames';
import { useRouter } from 'expo-router';
import { FlatList, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import uuid from 'react-native-uuid';

export default function PostsModal() {
  // state
  const [threads, setThreads] = useState<Thread[]>([
    {
      id: uuid.v4(),
      userId: '_bob__park',
      text: '',
      imageUris: [],
      hashTags: [],
      createdAt: new Date(),
    },
  ]);
  const [isPosting, setIsPosting] = useState<boolean>(true);

  // hooks
  const router = useRouter();

  // useEffect
  useEffect(() => {
    if (threads.length === 0) {
      setIsPosting(true);
      return;
    }

    const last = threads[threads.length - 1];

    setIsPosting(!last.text);
  }, [threads]);

  // handle
  const handlePost = () => {};

  const handleAddThread = () => {
    setThreads((prev) => {
      const newThreads = prev.slice();

      newThreads.push({
        id: uuid.v4(),
        userId: '_bob__park',
        text: '',
        imageUris: [],
        hashTags: [],
        createdAt: new Date(),
      });

      return newThreads;
    });
  };

  const handleUpdateThread = ({ id, text }: { id: string; text: string }) => {
    setThreads((prev) => {
      const newThreads = prev.slice();

      const index = prev.findIndex((item) => item.id === id);

      if (index >= 0) {
        newThreads[index] = {
          ...newThreads[index],
          text: text,
        };
      }

      return newThreads;
    });
  };

  const handleRemoveThread = (id: string) => {
    setThreads((prev) => {
      const newThreads = prev.slice();

      const index = newThreads.findIndex((item) => item.id === id);

      if (index >= 0) {
        newThreads.splice(index, 1);
      }

      return newThreads;
    });
  };

  return (
    <View className="mt-5 flex size-full flex-col items-center gap-2">
      {/* headers */}
      <View className="relative flex w-full flex-row items-center justify-center gap-2">
        <View className="items-center justify-center">
          <Text className="text-xl font-bold">새로운 스레드</Text>
        </View>

        <View className="absolute left-5 top-1 w-12 items-center">
          <Pressable className="w-full" onPress={() => router.back()}>
            <Text className="text-lg">취소</Text>
          </Pressable>
        </View>
      </View>

      {/* contents */}
      <FlatList
        className="mt-3 w-full"
        data={threads}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ThreadItem
            thread={item}
            first={index === 0}
            last={index === threads.length - 1}
            onUpdate={handleUpdateThread}
            onRemove={handleRemoveThread}
          />
        )}
        ListFooterComponent={<AddThread posting={isPosting} onAdd={handleAddThread} />}
        keyboardShouldPersistTaps="handled"
      />

      {/* actions */}
      <View className="absolute bottom-14 flex w-full flex-row-reverse items-center justify-center gap-2">
        <Pressable
          className={cx(
            'mr-5 h-10 w-24 flex-none items-center justify-center rounded-full',
            isPosting ? 'bg-gray-400' : 'bg-black',
          )}
          disabled={isPosting}
          onPress={handlePost}
        >
          <Text className="text-lg font-bold text-white">게시</Text>
        </Pressable>

        <View className="flex-1 pl-10">
          <Text className="text-lg text-gray-400">내 팔로워에게 답글 및 인용 허용</Text>
        </View>
      </View>
    </View>
  );
}

interface ThreadItemProps {
  thread: Thread;
  first?: boolean;
  last?: boolean;
  onUpdate?: ({ id, text }: { id: string; text: string }) => void;
  onRemove?: (id: string) => void;
}

const ThreadItem = ({ first = false, last = false, thread, onUpdate, onRemove }: ThreadItemProps) => {
  // ref
  const textRef = useRef<TextInput>(null);

  // state
  const [post, setPost] = useState<string>(thread.text);
  const [hashtags, setHashtags] = useState<string[]>([]);

  // useEffect
  useEffect(() => {}, [thread]);

  useEffect(() => {
    if (!textRef.current) {
      return;
    }

    last && textRef.current.focus();
  }, [last]);

  useEffect(() => {
    handleUpdate();
  }, [post, hashtags]);

  // handle
  const handleUpdate = () => {
    onUpdate && onUpdate({ id: thread.id, text: post });
  };

  const handleRemove = () => {
    onRemove && onRemove(thread.id);
  };

  const handleUpdateHashtags = (text: string) => {
    const tags = new Array<string>();

    const tokens = text.split(' ');

    for (const token of tokens) {
      const newTag = token.replace('#', '');

      if (tags.includes(newTag)) {
        continue;
      }

      tags.push(newTag);
    }

    setHashtags(tags);
  };

  return (
    <>
      <View className="relative mx-5 flex h-24 flex-row items-start justify-center gap-2">
        {/* close */}
        {!first && (
          <View className="absolute right-3 top-0 size-6 flex-none">
            <Pressable className="w-full" onPress={handleRemove}>
              <AntDesign name="close" size={20} color="gray" />
            </Pressable>
          </View>
        )}

        {/* avatar */}
        <View className="flex h-full flex-none flex-col items-center justify-center">
          <View className="size-16 flex-none">
            <UserAvatar name="bob" />
          </View>

          <View className="h-full flex-1">
            <View className="h-full w-[1px] rounded-2xl border-[1px] border-gray-300"></View>
          </View>
        </View>

        {/* contents */}
        <View className="flex-1">
          <View className="flex flex-col items-center justify-center gap-1">
            <View className="flex w-full flex-row items-center justify-start gap-2">
              <View className="">
                <Text className="font-semibold">{thread.userId}</Text>
              </View>
              <View className="flex flex-row items-center justify-start gap-3">
                <Octicons name="chevron-right" size={15} color="gray" />
                <TextInput
                  className="font-semibold text-gray-400"
                  value={hashtags.map((hashtag) => `#${hashtag}`).join(' ')}
                  placeholder="주제 추가"
                  onChangeText={handleUpdateHashtags}
                />
              </View>
            </View>
            <View className="w-full">
              <TextInput
                ref={textRef}
                className="w-full"
                multiline
                placeholder="새로운 소식이 있나요?"
                value={post}
                onChangeText={(e) => setPost(e)}
              />
            </View>
            <View className="flex w-full flex-row gap-3">
              <Pressable className="">
                <MaterialCommunityIcons name="image-multiple-outline" size={20} color="gray" />
              </Pressable>
              <Pressable className="">
                <MaterialCommunityIcons name="file-gif-box" size={20} color="gray" />
              </Pressable>
              <Pressable className="">
                <Entypo name="emoji-happy" size={20} color="gray" />
              </Pressable>
              <Pressable className="">
                <MaterialCommunityIcons name="vote" size={20} color="gray" />
              </Pressable>
              <Pressable className="">
                <Feather name="map-pin" size={20} color="gray" />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

interface AddThreadProps {
  posting?: boolean;
  onAdd?: () => void;
}

const AddThread = ({ posting = false, onAdd }: AddThreadProps) => {
  // handle
  const handleAdd = () => {
    onAdd && onAdd();
  };

  return (
    <View className="mx-10 my-2 flex flex-row items-center justify-center gap-2">
      <View className="size-6 flex-none">
        <UserAvatar name="bob" />
      </View>
      <View className="h-full flex-1">
        <TouchableOpacity className="" disabled={posting} onPress={handleAdd}>
          <Text className={cx('font-semibold', posting ? 'text-gray-300' : 'text-gray-500')}>스레드에 추가</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
