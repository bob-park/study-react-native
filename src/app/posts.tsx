import { useEffect, useRef, useState } from 'react';

import {
  Alert,
  FlatList,
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';

import { AntDesign, Entypo, Feather, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';

import UserAvatar from '@/shared/components/user/UserAvatar';

import cx from 'classnames';
import uuid from 'react-native-uuid';

const dummyTags = [
  'java',
  'java 30th',
  'js',
  'react',
  '창업아이디어',
  '하이에나',
  '비행기표',
  'AI',
  '강의',
  '인프런',
  '운동하는직장인',
  'Threads birthday',
];

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

  const handleUpdateThread = (thread: Thread) => {
    setThreads((prev) => {
      const newThreads = prev.slice();

      const index = prev.findIndex((item) => item.id === thread.id);

      if (index >= 0) {
        newThreads[index] = {
          ...newThreads[index],
          ...thread,
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
    <View className="flex size-full flex-col items-center dark:bg-black">
      {/* headers */}
      <View className="z-10 mb-2 mt-3 flex h-12 w-full flex-none flex-row items-center justify-center gap-2">
        <View className="relative w-full items-center justify-center">
          <Text className="text-xl font-bold dark:text-white">새로운 스레드</Text>

          <View className="absolute left-5 top-1 w-12 items-center">
            <Pressable className="w-full" onPress={() => router.back()}>
              <Text className="text-lg dark:text-white">취소</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* contents */}
      <FlatList
        className="w-full"
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
      <View className="mb-10 flex h-12 w-full flex-none flex-row-reverse items-center justify-center gap-2">
        <Pressable
          className={cx(
            'mr-5 h-10 w-24 flex-none items-center justify-center rounded-full',
            isPosting ? 'bg-gray-400 dark:bg-gray-600' : 'bg-black dark:bg-gray-300',
          )}
          disabled={isPosting}
          onPress={handlePost}
        >
          <Text className="text-lg font-bold text-white dark:text-black">게시</Text>
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
  onUpdate?: (item: Thread) => void;
  onRemove?: (id: string) => void;
}

const ThreadItem = ({ first = false, last = false, thread, onUpdate, onRemove }: ThreadItemProps) => {
  // ref
  const textRef = useRef<TextInput>(null);
  const tagRef = useRef<TextInput>(null);

  // state
  const [showSelectTags, setShowSelectTags] = useState<boolean>(false);
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
    onUpdate &&
      onUpdate({
        ...thread,
        text: post,
        hashTags: hashtags.map((hashtag) => ({ id: uuid.v4(), tag: hashtag })),
      });
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
    setShowSelectTags(false);
  };

  const handleGetMyLocation = async (id: string) => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Location permission not granted.', 'Please grant location permissions.', [
        {
          text: 'Open Settings',
          onPress: async () => {
            await Linking.openSettings();
          },
        },
        {
          text: 'Cancel',
        },
      ]);

      try {
        await Location.getBackgroundPermissionsAsync();
      } catch (error) {
        console.error(error);
        return;
      }

      return;
    }

    const location = await Location.getCurrentPositionAsync({});

    // location 을 address 로 바꿔주는 함수
    // const address = await Location.reverseGeocodeAsync({
    //   latitude: location.coords.latitude,
    //   longitude: location.coords.longitude,
    // });

    onUpdate &&
      onUpdate({
        ...thread,
        location: [location.coords.latitude, location.coords.longitude],
      });
  };

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Image permission not granted.', 'Please grant Image permissions.', [
        {
          text: 'Open Settings',
          onPress: async () => {
            await Linking.openSettings();
          },
        },
        {
          text: 'Cancel',
        },
      ]);

      return;
    }

    const images = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos', 'livePhotos'],
      allowsMultipleSelection: true,
      selectionLimit: 5,
    });

    const imageUris = images.assets?.map((asset) => asset.uri);

    onUpdate &&
      onUpdate({
        ...thread,
        imageUris: imageUris || [],
      });
  };

  const handleRemoveImage = (imageUri: string) => {
    onUpdate && onUpdate({ ...thread, imageUris: thread.imageUris.filter((item) => item !== imageUri) });
  };

  return (
    <View
      className={cx(
        'relative mx-5 flex flex-row items-start justify-center gap-2',
        thread.imageUris.length === 0 ? 'h-24' : 'h-56',
      )}
    >
      {/* avatar */}
      <View className="flex h-full flex-none flex-col items-center justify-center">
        <View className="size-16 flex-none">
          <UserAvatar name="bob" />
        </View>

        <View className="h-full flex-1 pt-2">
          <View className="h-full w-[1px] rounded-2xl border-[1px] border-gray-300"></View>
        </View>
      </View>

      {/* contents */}
      <View className="flex-1">
        <View className="flex flex-col items-center justify-center gap-1">
          <View className="flex w-full flex-row items-center justify-start gap-2">
            <View className="">
              <Text className="font-semibold dark:text-white">{thread.userId}</Text>
            </View>
            <View className="flex flex-row items-center justify-start gap-3">
              <Octicons name="chevron-right" size={15} color="gray" />
              <TextInput
                ref={tagRef}
                className="font-semibold text-gray-400 dark:text-white"
                value={hashtags.map((hashtag) => `#${hashtag}`).join(' ')}
                placeholder="주제 추가"
                placeholderTextColor="gray"
                onChangeText={handleUpdateHashtags}
                onFocus={() => setShowSelectTags(true)}
                onBlur={() => setShowSelectTags(false)}
              />
              {showSelectTags && (
                <View className={cx('absolute left-2 top-6 z-[100] h-80 w-56')}>
                  <HashtagDropDown onChange={(tag) => handleUpdateHashtags(tag)} />
                </View>
              )}
            </View>
          </View>
          <View className="w-full">
            <TextInput
              ref={textRef}
              className="w-full dark:text-white"
              multiline
              placeholder="새로운 소식이 있나요?"
              placeholderTextColor="gray"
              value={post}
              onChangeText={(e) => setPost(e)}
            />
          </View>
          {thread.imageUris.length > 0 && (
            <FlatList
              className="h-32 w-full"
              data={thread.imageUris}
              horizontal
              keyExtractor={(_, index) => `thread-${thread.id}-item-image-${index}`}
              renderItem={({ item: uri, index: imageIndex }) => (
                <View className="relative ml-2 flex h-32 w-32">
                  <Image className="size-full rounded-2xl" source={{ uri }} alt="thread image" />
                  <TouchableOpacity
                    className="absolute right-1 top-1 size-7 rounded-full bg-white p-[1px]"
                    onPress={() => handleRemoveImage(uri)}
                  >
                    <AntDesign name="closecircle" size={22} color="black" />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}

          <View className="flex w-full flex-row gap-3">
            <Pressable className="" onPress={() => pickImages()}>
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
            <Pressable className="" onPress={() => handleGetMyLocation(thread.id)}>
              <Feather name="map-pin" size={20} color="gray" />
            </Pressable>
          </View>
        </View>
      </View>

      {/* close */}
      {!first && (
        <View className="size-6 flex-none">
          <Pressable className="w-full" onPress={handleRemove}>
            <AntDesign name="close" size={20} color="gray" />
          </Pressable>
        </View>
      )}
    </View>
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
    <View className="mx-10 my-2 flex h-[300px] w-full flex-row items-start justify-center gap-2">
      <View className="size-6 flex-none">
        <UserAvatar name="bob" />
      </View>
      <View className="h-full flex-1">
        <TouchableOpacity className="" disabled={posting} onPress={handleAdd}>
          <Text
            className={cx(
              'font-semibold',
              posting ? 'text-gray-300 dark:text-gray-500' : 'text-gray-500 dark:text-gray-300',
            )}
          >
            스레드에 추가
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

interface HashtagDropDownProps {
  onChange?: (text: string) => void;
}

const HashtagDropDown = ({ onChange }: HashtagDropDownProps) => {
  // handle
  const handleSelect = (tag: string) => {
    onChange && onChange(tag);
  };

  return (
    <ScrollView className="flex size-full flex-col gap-1 overflow-hidden rounded-lg border-[1px] border-gray-300 bg-white shadow-2xl dark:bg-black">
      {dummyTags.map((tag, index) => (
        <View
          key={`hashtag-dropdown-key-${index}`}
          className="h-12 w-full border-b-[1px] border-gray-300 px-6 py-1 dark:bg-black"
        >
          <TouchableOpacity className="size-full" onPress={() => handleSelect(tag)}>
            <Text className="mt-1 size-full text-xl font-semibold dark:text-white">{tag}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};
