import { createContext, useEffect, useMemo, useState } from 'react';

import { Linking } from 'react-native';

import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';

const KEY_NOTIFICATION_TOKEN = 'notificationToken';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
  handleSuccess: (notificationId) => {
    console.log('handleSuccess', notificationId);
  },
  handleError: (notificationId, error) => {
    console.log('handleError', notificationId, error);
  },
});

interface NotificationContextType {
  token?: string;
  onSendNotification: ({ title, description }: { title: string; description: string }) => void;
}

export const NotificationContext = createContext<NotificationContextType>({
  onSendNotification: ({ title, description }) => {},
});

export default function NotificationProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  // state
  const [token, setToken] = useState<string>();

  console.log('token', token);

  // useEffect
  useEffect(() => {
    if (!token) {
      handleInit();
    }

    SecureStore.getItemAsync(KEY_NOTIFICATION_TOKEN).then((data) => {
      if (!data) {
        return;
      }

      handleUpdateToken(data);
    });
  }, [token]);

  // handle
  const handleInit = async () => {
    // Notification 권한 확인 및 요청
    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== 'granted') {
      return Linking.openSettings();
    }

    const projectId = Constants.expoConfig?.extra?.esp?.projectId ?? Constants.easConfig?.projectId;

    console.log('projectId', projectId);

    const token = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    console.log('expoPushToken', token.data);

    handleUpdateToken(token.data);
  };

  const handleUpdateToken = (token: string) => {
    setToken(token);

    SecureStore.setItemAsync(KEY_NOTIFICATION_TOKEN, token);
  };

  const handleSendNotification = ({ title, description }: { title: string; description: string }) => {
    if (!token || !Device.isDevice) {
      // 디바이스가 아니거나 토큰이 없는 경우 로컬 푸시 알림 보내기
      Notifications.scheduleNotificationAsync({
        content: {
          title,
          body: description,
        },
        trigger: null, // 즉시 알림
      });
      return;
    }
  };

  // memorize
  const memorizedContextValue = useMemo<NotificationContextType>(
    () => ({ token, onSendNotification: handleSendNotification }),
    [token],
  );

  return <NotificationContext value={memorizedContextValue}>{children}</NotificationContext>;
}
