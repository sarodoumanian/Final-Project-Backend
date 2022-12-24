import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server-express';
// const { GraphQLUpload } = require('apollo-server');
// import { GraphQLUpload } from 'apollo-server-express'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { applyMiddleware } from 'graphql-middleware';
import merge from 'lodash.merge';
import multer from 'multer';

import auth from './middleware/auth.js';
import permissions from './middleware/permissions.js';
import routes from './routes/file.js';
import resolvers from './schema/resolvers/index.js';
import types from './schema/typeDefs/index.js';

dotenv.config();

const app = express();
app.use(cookieParser());

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, next) => {
      next(null, 'public/posts/');
    },

    filename: (req, file, next) => {
      const random = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
      next(null, 'Post-' + random + '-' + file.originalname);
    }
  }),
  fileFilter: (req, file, next) => {
    if (!file) {
      next();
    }
    const image = file.mimetype.startsWith('image/');
    if (image) {
      next(null, true);
    } else {
      return next();
    }
  }
});

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
app.use('/graphql', upload.single('file'));

server.start().then(() => {
  server.applyMiddleware({
    app,
    cors: false
  });
  app.listen({ port: process.env.PORT }, () => console.log(`Server running at port: ${process.env.PORT}`));
});
