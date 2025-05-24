import { Ionicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';

export default function TabLayout() {
  // hooks
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarLabel: () => null,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          tabBarIcon: ({ focused }) => <Ionicons name="home" size={24} color={focused ? 'black' : 'gray'} />,
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => <Ionicons name="search" size={24} color={focused ? 'black' : 'gray'} />,
        }}
      />
      <Tabs.Screen
        name="add"
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.navigate('/modal');
          },
        }}
        options={{
          tabBarIcon: ({ focused }) => <Ionicons name="add" size={24} color={focused ? 'black' : 'gray'} />,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          tabBarIcon: ({ focused }) => <Ionicons name="heart-outline" size={24} color={focused ? 'black' : 'gray'} />,
        }}
      />
      <Tabs.Screen
        name="[username]"
        options={{
          tabBarIcon: ({ focused }) => <Ionicons name="person-outline" size={24} color={focused ? 'black' : 'gray'} />,
        }}
      />

      <Tabs.Screen name="(posts)/[username]/posts/[postId]" options={{ href: null }} />
    </Tabs>
  );
}
