import { useContext, useEffect } from 'react';

import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';

import { exchangeCodeAsync, fetchUserInfoAsync, makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';

import { FontAwesome6, Ionicons } from '@expo/vector-icons';

import { AuthContext } from '@/shared/providers/auth/AuthProvider';

const KEY_ACCESS_TOKEN = 'accessToken';
const KEY_REFRESH_TOKEN = 'refreshToken';
const KEY_EXPIRED_AT = 'expiredAt';

WebBrowser.maybeCompleteAuthSession();

const clientId = process.env.EXPO_PUBLIC_AUTHORIZATION_CLIENT_ID || '';
const clientSecret = process.env.EXPO_PUBLIC_AUTHORIZATION_CLIENT_SECRET || '';

const discovery = {
  authorizationEndpoint: `${process.env.EXPO_PUBLIC_AUTHORIZATION_SERVER}/oauth2/authorize`,
  tokenEndpoint: `${process.env.EXPO_PUBLIC_AUTHORIZATION_SERVER}/oauth2/token`,
  revocationEndpoint: `${process.env.EXPO_PUBLIC_AUTHORIZATION_SERVER}/oauth2/revoke`,
};

const redirectUri = makeRedirectUri({
  scheme: 'studyreactnative',
  native: 'studyreactnative://callback',
});

interface LoginModalProps {
  open: boolean;
  onClose?: () => void;
}

export default function LoginModal({ open, onClose }: Readonly<LoginModalProps>) {
  // context
  const { onLoggedIn } = useContext(AuthContext);

  console.log(redirectUri);

  // hooks
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      clientSecret,
      scopes: ['openid', 'profile'],
      redirectUri,
      responseType: 'code',
    },
    discovery,
  );

  // useEffect
  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;

      exchangeCodeAsync(
        { clientId, clientSecret, redirectUri, code, extraParams: { code_verifier: request?.codeVerifier || '' } },
        discovery,
      )
        .then((data) => {
          Promise.all([
            SecureStore.setItemAsync(KEY_ACCESS_TOKEN, data.accessToken),
            SecureStore.setItemAsync(KEY_REFRESH_TOKEN, data.refreshToken || ''),
            SecureStore.setItemAsync(KEY_EXPIRED_AT, (data.expiresIn || 0) + data.issuedAt + ''),
          ]);

          fetchUserInfoAsync(
            {
              accessToken: data.accessToken,
            },
            {
              userInfoEndpoint: `${process.env.EXPO_PUBLIC_AUTHORIZATION_SERVER}/userinfo`,
            },
          )
            .then((data) => {
              if (!data) {
                throw new Error('null');
              }

              return data.profile as User;
            })
            .then((user) => onLoggedIn(user));
        })
        .then(() => {
          handleClose();
        })
        .catch((err) => console.error(err));
    }
  }, [response]);

  // handle
  const handleClose = () => {
    onClose && onClose();
  };

  return (
    <Modal visible={open} animationType="slide" presentationStyle="formSheet" onRequestClose={handleClose}>
      <View className="relative flex size-full flex-col rounded-t-2xl bg-white p-4 shadow-2xl">
        <View className="">
          <Text className="text-2xl font-bold">Login Modal</Text>
        </View>

        <View className="mt-[50%] w-full">
          <Pressable
            className="flex flex-row items-center justify-center gap-2 rounded-2xl bg-black p-4"
            onPress={() => {
              promptAsync();
              handleClose();
            }}
          >
            <FontAwesome6 name="threads" size={28} color="white" />
            <Text className="text-xl font-semibold text-white">로그인</Text>
          </Pressable>
        </View>

        <TouchableOpacity className="absolute right-6 top-6" onPress={handleClose}>
          <Ionicons name="close" size={24} color="gray" />
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
