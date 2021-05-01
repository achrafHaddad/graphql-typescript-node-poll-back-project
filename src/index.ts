import express from 'express';
import mongoose from 'mongoose';
import { ApolloServer, PubSub } from 'apollo-server-express';
import { createServer } from 'http';

import formatGraphQLErrors from './formatGraphQLErrors';
import typeDefs from './graphql/typeDefs';
import resolvers from './graphql/resolver';

const app = express();

const pubSub = new PubSub();

const server = new ApolloServer({
  formatError: formatGraphQLErrors,
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubSub }),
});

const httpServer = createServer(app);

server.applyMiddleware({ app });
server.installSubscriptionHandlers(httpServer);

mongoose
  .connect('mongodb://localhost/poll', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    httpServer.listen(3000, () => {
      console.log('listening on port 3000');
    });
  })
  .catch(err => console.log(err));
