import 'expo-router/entry';

import { faker } from '@faker-js/faker';
import { Factory, Model, Response, RestSerializer, Server, belongsTo, createServer, hasMany } from 'miragejs';

declare global {
  interface Window {
    server: Server;
  }
}

if (__DEV__) {
  if (window.server) {
    window.server.shutdown();
  }

  let hwpark;

  window.server = createServer({
    models: {
      user: Model.extend({
        posts: hasMany('post'),
      }),
      post: Model.extend({
        user: belongsTo('user'),
      }),
      activity: Model.extend({
        user: belongsTo('user'),
      }),
    },
    serializers: {
      application: RestSerializer,
      post: RestSerializer.extend({
        include: ['user'],
        embed: true,
      }),
      activity: RestSerializer.extend({
        include: ['user'],
        embed: true,
      }),
    },
    factories: {
      user: Factory.extend({
        id: () => faker.person.firstName().toLowerCase(),
        uniqueId: () => faker.person.firstName().toLowerCase(),
        userId: () => faker.person.firstName().toLowerCase(),
        username: () => faker.person.fullName(),
        description: () => faker.lorem.sentence(),
        profileImageUrl: () => `https://avatars.githubusercontent.com/u/${Math.floor(Math.random() * 100_000)}?v=4`,
        isVerified: () => Math.random() > 0.5,
      }),
      post: Factory.extend({
        id: () => faker.string.numeric(6),
        content: () => faker.lorem.paragraph(),
        imageUrls: () => Array.from({ length: Math.floor(Math.random() * 3) }, () => faker.image.urlLoremFlickr()),
        likes: () => Math.floor(Math.random() * 100),
        comments: () => Math.floor(Math.random() * 100),
        reposts: () => Math.floor(Math.random() * 100),
      }),
    },
    seeds(server) {
      const users = server.createList('user', 10);

      users.forEach((user) => server.createList('post', 5, { user }));

      hwpark = server.create('user', {
        id: 'hwpark',
        uniqueId: 'hwpark',
        userId: 'hwpark',
        username: '밥팤',
        description: faker.lorem.sentence(),
        profileImageUrl: `https://avatars.githubusercontent.com/u/${Math.floor(Math.random() * 100_000)}?v=4`,
        isVerified: Math.random() > 0.5,
      });

      server.createList('post', 10, { user: hwpark });
    },
    routes() {
      this.passthrough(
        (req) =>
          req.url.startsWith(`${process.env.EXPO_PUBLIC_AUTHORIZATION_SERVER}`) || req.url.startsWith('https://'),
      );

      this.namespace = 'api';

      this.post('/posts', (schema, request) => {
        const { posts } = JSON.parse(request.requestBody);

        posts.forEach((post) => {
          schema.create('post', {
            content: post.content,
            imageUrls: post.imageUrls,
            location: post.location,
          });
        });

        return new Response(200, {}, { posts });
      });

      this.get('/posts', (schema, request) => {
        const cursor = parseInt((request.queryParams.cursor as string) || '0');

        let posts = schema.all('post');

        if (request.queryParams.type === 'following') {
          posts = posts.filter((post) => post.user?.id === hwpark?.id);
        }

        return posts.slice(cursor, cursor + 10);
      });

      this.get('/posts/:id', (schema, request) => {
        const post = schema.find('post', request.params.id);
        const comments = schema.all('post').models.slice(0, 10);
        return new Response(200, {}, { post, comments });
      });

      // user
      this.get('/users/:id', (schema, request) => {
        return schema.find('user', request.params.id);
      });
    },
  });
}
