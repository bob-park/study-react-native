import 'expo-router/entry';

import { Response, Server, createServer } from 'miragejs';

declare global {
  interface Window {
    server: Server;
  }
}

if (__DEV__) {
  if (window.server) {
    window.server.shutdown();
  }

  window.server = createServer({
    routes() {
      this.passthrough((req) => req.url.startsWith(`${process.env.EXPO_PUBLIC_AUTHORIZATION_SERVER}`));

      this.namespace = 'api';

      this.post('/login', (schema, request) => {
        const { username, password } = JSON.parse(request.requestBody);

        if (username === 'bobpark' && password === '12345') {
          return {
            accessToken: 'access-token',
            refreshToken: 'refresh-token',
            user: {
              id: 'bob-park',
              username: '박현우',
            },
          };
        } else {
          return new Response(401, {}, { message: 'Invaild credentials' });
        }
      });
    },
  });
}
