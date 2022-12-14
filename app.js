import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { applyMiddleware } from 'graphql-middleware';
import merge from 'lodash.merge';

import auth from './middleware/auth.js';
import permissions from './middleware/permissions.js';
import routes from './routes/file.js';
import resolvers from './schema/resolvers/index.js';
import types from './schema/typeDefs/index.js';

dotenv.config();

const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: ['https://studio.apollographql.com', 'http://localhost:3000'],
    credentials: true
  })
);

app.use(auth);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

const schema = makeExecutableSchema({
  typeDefs: [types.userType, types.adminType, types.superadminType, types.postType],
  resolvers: merge(resolvers.userResolver, resolvers.adminResolver, resolvers.superAdminResolver, resolvers.postResolver)
});

const server = new ApolloServer({
  schema: applyMiddleware(schema, permissions.generate(schema)),
  graphiql: true,
  context: ({ req, res }) => {
    return {
      req,
      res
    };
  }
});

app.use(routes);

server.start().then(() => {
  server.applyMiddleware({
    app,
    cors: false
  });
  app.listen({ port: process.env.PORT }, () => console.log(`Server running at port: ${process.env.PORT}`));
});
